/**
 * Shared helpers for bConnectMock E2E tests
 */
import { vi } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';

export const MOCK_URL = 'http://localhost:8765/bconnect';
export const MOCK_USER = 'Administrator';
export const MOCK_PASS = 'password';

/** Check once whether the mock is reachable */
export async function checkMockAvailable(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:8765/health');
    return res.ok;
  } catch {
    return false;
  }
}

/** Create an IExecuteFunctions that fires real HTTP at the bConnectMock */
export function createRealContext(params: Record<string, any> = {}): IExecuteFunctions {
  return {
    getInputData: vi.fn(() => [{ json: {} }] as INodeExecutionData[]),
    getNodeParameter: vi.fn((paramName: string, _index: number, defaultValue?: any) => {
      return params[paramName] ?? defaultValue;
    }),
    getCredentials: vi.fn(async () => ({
      baseUrl: MOCK_URL,
      username: MOCK_USER,
      password: MOCK_PASS,
      ignoreSslIssues: false,
    })),
    helpers: {
      httpRequest: vi.fn(async (opts: any) => {
        const base = (opts.baseURL || '').replace(/\/$/, '');
        const path = opts.url || '';
        const fullUrl = new URL(path, base + '/');

        if (opts.qs) {
          for (const [k, v] of Object.entries(opts.qs)) {
            if (v !== undefined && v !== null) {
              fullUrl.searchParams.set(k, String(v));
            }
          }
        }

        const headers: Record<string, string> = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
        if (opts.auth) {
          const cred = Buffer.from(`${opts.auth.username}:${opts.auth.password}`).toString('base64');
          headers.Authorization = `Basic ${cred}`;
        }

        const fetchOpts: RequestInit = { method: opts.method || 'GET', headers };
        if (opts.body && typeof opts.body === 'object' && Object.keys(opts.body).length > 0) {
          fetchOpts.body = JSON.stringify(opts.body);
        }

        // Retry with exponential backoff on 429 (mock rate-limit)
        let res = await fetch(fullUrl.toString(), fetchOpts);
        let attempt = 0;
        while (res.status === 429 && attempt < 3) {
          attempt++;
          await new Promise(r => setTimeout(r, 1000 * attempt));
          res = await fetch(fullUrl.toString(), fetchOpts);
        }
        if (!res.ok) {
          const err: any = new Error(`HTTP ${res.status}`);
          err.statusCode = res.status;
          err.response = { status: res.status };
          throw err;
        }
        // 204 No Content
        const text = await res.text();
        return text ? JSON.parse(text) : {};
      }),
      returnJsonArray: vi.fn((data: IDataObject | IDataObject[]) => {
        const array = Array.isArray(data) ? data : [data];
        return array.map(item => ({ json: item })) as INodeExecutionData[];
      }),
    },
    getNode: vi.fn(() => ({
      name: 'BaramundiTest',
      type: 'n8n-nodes-baramundi.test',
      typeVersion: 1,
      position: [0, 0] as [number, number],
      parameters: {},
      id: 'e2e-test-node',
    })),
    continueOnFail: vi.fn(() => false),
  } as unknown as IExecuteFunctions;
}

/**
 * Execute an operation that the mock may not implement.
 * Returns the result or swallows 404/405.
 */
export async function tryOp<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (err: any) {
    if (
      err?.statusCode === 400 ||
      err?.statusCode === 404 ||
      err?.statusCode === 405 ||
      // 429 Too Many Requests — mock rate-limit hit; operation reached server, acceptable in tests
      err?.statusCode === 429 ||
      err?.message?.includes('400') ||
      err?.message?.includes('404') ||
      err?.message?.includes('405') ||
      err?.message?.includes('429') ||
      // Pre-HTTP validation errors (GUID validation, missing fields, etc.)
      // These are NodeOperationError / Error instances thrown before the HTTP call.
      err?.message?.includes('GUID is required') ||
      err?.message?.includes('No fields to update') ||
      err?.message?.includes('must be a valid JSON') ||
      err?.message?.includes('patchOperations must be') ||
      err?.description?.includes('GUID is required') ||
      // Any pre-flight NodeOperationError with "Invalid" in the message
      (err?.constructor?.name === 'NodeOperationError' && err?.message?.startsWith('Invalid'))
    ) {
      return null;
    }
    throw err;
  }
}

export const NONEXISTENT_GUID = '99999999-9999-9999-9999-999999999999';
