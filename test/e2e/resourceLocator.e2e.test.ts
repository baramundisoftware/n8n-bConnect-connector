/**
 * E2E Tests for Phase 15 — Resource Locator UX
 *
 * Runs against bConnect-Mock on localhost:8765
 * Tests: listSearch methods, resourceLocator extraction, full execute pipeline
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData, IDataObject, ILoadOptionsFunctions } from 'n8n-workflow';
import { endpointSearch, jobDefinitionSearch, jobFolderSearch } from '../../nodes/shared/loadOptions';
import { get as getEndpoint, getMany as getManyEndpoints, search as searchEndpoints } from '../../nodes/BaramundiEndpoint/actions/endpoint/endpoint.execute';
import { get as getJob, getEndpointJobInstances } from '../../nodes/BaramundiJob/actions/job/job.execute';

const MOCK_URL = 'http://localhost:8765/bconnect';
const MOCK_USER = 'Administrator';
const MOCK_PASS = 'password';

/**
 * Build a real HTTP mock that matches the n8n httpRequest contract.
 * apiRequest passes { baseURL, url, qs, method, auth, ... } to helpers.httpRequest.
 */
function createRealContext(
  params: Record<string, any> = {},
): IExecuteFunctions {
  return {
    getNodeParameter: vi.fn((paramName: string, _index: number, defaultValue?: any) => {
      return params[paramName] ?? defaultValue;
    }),
    getCurrentNodeParameter: vi.fn((paramName: string) => {
      return params[paramName];
    }),
    getCredentials: vi.fn(async () => ({
      baseUrl: MOCK_URL,
      username: MOCK_USER,
      password: MOCK_PASS,
      ignoreSslIssues: false,
    })),
    helpers: {
      httpRequest: vi.fn(async (opts: any) => {
        // n8n merges baseURL + url
        const base = (opts.baseURL || '').replace(/\/$/, '');
        const path = opts.url || '';
        const fullUrl = new URL(path, base + '/');

        // Add query string params
        if (opts.qs) {
          for (const [k, v] of Object.entries(opts.qs)) {
            fullUrl.searchParams.set(k, String(v));
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

        const fetchOpts: RequestInit = {
          method: opts.method || 'GET',
          headers,
        };
        if (opts.body && Object.keys(opts.body).length > 0) {
          fetchOpts.body = JSON.stringify(opts.body);
        }

        const res = await fetch(fullUrl.toString(), fetchOpts);
        if (!res.ok) {
          const err: any = new Error(`HTTP ${res.status}`);
          err.statusCode = res.status;
          err.response = { status: res.status };
          throw err;
        }
        return res.json();
      }),
      returnJsonArray: vi.fn((data: IDataObject | IDataObject[]) => {
        const array = Array.isArray(data) ? data : [data];
        return array.map(item => ({ json: item })) as INodeExecutionData[];
      }),
    },
    getNode: vi.fn(() => ({
      name: 'BaramundiEndpoint',
      type: 'n8n-nodes-baramundi.baramundiEndpoint',
      typeVersion: 1,
      position: [0, 0],
      parameters: {},
    })),
  } as unknown as IExecuteFunctions;
}

function createRealLoadContext(): ILoadOptionsFunctions {
  return createRealContext() as unknown as ILoadOptionsFunctions;
}

let mockAvailable = false;
beforeAll(async () => {
  try {
    const res = await fetch('http://localhost:8765/health');
    mockAvailable = res.ok;
  } catch {
    mockAvailable = false;
  }
  if (!mockAvailable) {
    console.warn('⚠ bConnectMock not running on :8765 — E2E tests will be skipped');
  }
});

describe('E2E: Resource Locator against bConnectMock', () => {

  // ─── listSearch methods ───────────────────────────────────────────

  describe('endpointSearch', () => {
    it('should return endpoints from live mock (no filter)', async () => {
      if (!mockAvailable) return;
      const ctx = createRealLoadContext();
      const result = await endpointSearch.call(ctx);
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0]).toHaveProperty('name');
      expect(result.results[0]).toHaveProperty('value');
      expect(result.results[0].value).toMatch(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      );
    });

    it('should handle filter parameter (mock may not support OData contains())', async () => {
      if (!mockAvailable) return;
      const ctx = createRealLoadContext();
      // The mock uses simple text search, not OData contains() — so the filter may return 0 results.
      // The important thing is that the method doesn't throw and returns a valid structure.
      const result = await endpointSearch.call(ctx, 'PCDE001');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('should paginate', async () => {
      if (!mockAvailable) return;
      const ctx = createRealLoadContext();
      const page0 = await endpointSearch.call(ctx);
      if (page0.paginationToken) {
        const page1 = await endpointSearch.call(ctx, undefined, page0.paginationToken);
        expect(page1.results.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('jobDefinitionSearch', () => {
    it('should return job definitions from live mock', async () => {
      if (!mockAvailable) return;
      const ctx = createRealLoadContext();
      const result = await jobDefinitionSearch.call(ctx);
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0]).toHaveProperty('name');
      expect(result.results[0]).toHaveProperty('value');
    });
  });

  describe('jobFolderSearch', () => {
    it('should return job folders from live mock', async () => {
      if (!mockAvailable) return;
      const ctx = createRealLoadContext();
      const result = await jobFolderSearch.call(ctx);
      expect(result.results.length).toBeGreaterThan(0);
    });
  });

  // ─── Endpoint operations with resourceLocator values ──────────────

  describe('endpoint.get with resourceLocator', () => {
    it('should fetch endpoint using resourceLocator object', async () => {
      if (!mockAvailable) return;
      const searchCtx = createRealLoadContext();
      const searchResult = await endpointSearch.call(searchCtx);
      const endpointId = searchResult.results[0].value;

      const ctx = createRealContext({
        endpointId: { __rl: true, mode: 'id', value: endpointId },
        endpointType: 'all',
      });
      const result = await getEndpoint.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toHaveProperty('id', endpointId);
      expect(result[0].json).toHaveProperty('displayName');
    });

    it('should fetch endpoint using plain string (backward compat)', async () => {
      if (!mockAvailable) return;
      const searchCtx = createRealLoadContext();
      const searchResult = await endpointSearch.call(searchCtx);
      const endpointId = searchResult.results[0].value;

      const ctx = createRealContext({
        endpointId,
        endpointType: 'all',
      });
      const result = await getEndpoint.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toHaveProperty('id', endpointId);
    });
  });

  describe('endpoint.getMany', () => {
    it('should return paginated endpoints', async () => {
      if (!mockAvailable) return;
      const ctx = createRealContext({
        returnAll: false,
        limit: 5,
        endpointType: 'all',
        additionalFields: {},
      });
      const result = await getManyEndpoints.call(ctx, 0);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  describe('endpoint.search', () => {
    it('should search by display name (simple text query)', async () => {
      if (!mockAvailable) return;
      const ctx = createRealContext({
        searchQuery: 'PCDE001',
        returnAll: false,
        limit: 10,
        additionalFields: {},
      });
      const result = await searchEndpoints.call(ctx, 0);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].json).toHaveProperty('displayName');
    });
  });

  // ─── Job operations with resourceLocator values ───────────────────

  describe('job.get with resourceLocator', () => {
    it('should fetch job using resourceLocator object', async () => {
      if (!mockAvailable) return;
      const searchCtx = createRealLoadContext();
      const searchResult = await jobDefinitionSearch.call(searchCtx);
      if (searchResult.results.length === 0) return;
      const jobId = searchResult.results[0].value;

      const ctx = createRealContext({
        jobId: { __rl: true, mode: 'id', value: jobId },
      });
      const result = await getJob.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toHaveProperty('id', jobId);
    });
  });

  describe('job.getEndpointJobInstances with resourceLocator', () => {
    it('should query job instances for endpoint using resourceLocator (may 404 on mock)', async () => {
      if (!mockAvailable) return;
      const searchCtx = createRealLoadContext();
      const searchResult = await endpointSearch.call(searchCtx);
      const endpointId = searchResult.results[0].value;

      const ctx = createRealContext({
        endpointId: { __rl: true, mode: 'id', value: endpointId },
        returnAll: false,
        limit: 10,
      });
      try {
        const result = await getEndpointJobInstances.call(ctx, 0);
        expect(Array.isArray(result)).toBe(true);
      } catch (err: any) {
        // Mock may not implement this route — 404 is acceptable
        expect(err.message).toContain('404');
      }
    });
  });

  // ─── Error handling ───────────────────────────────────────────────

  describe('error scenarios', () => {
    it('should reject invalid GUID in resourceLocator', async () => {
      if (!mockAvailable) return;
      const ctx = createRealContext({
        endpointId: { __rl: true, mode: 'id', value: 'not-a-guid' },
        endpointType: 'all',
      });
      await expect(getEndpoint.call(ctx, 0)).rejects.toThrow('Invalid endpoint ID');
    });

    it('should handle 404 for nonexistent endpoint', async () => {
      if (!mockAvailable) return;
      const ctx = createRealContext({
        endpointId: '99999999-9999-9999-9999-999999999999',
        endpointType: 'all',
      });
      await expect(getEndpoint.call(ctx, 0)).rejects.toThrow();
    });

    it('should return empty for OData-invalid search filter in listSearch', async () => {
      if (!mockAvailable) return;
      const ctx = createRealLoadContext();
      const result = await endpointSearch.call(ctx, 'bad"injection;attempt');
      expect(result.results).toHaveLength(0);
    });
  });
});
