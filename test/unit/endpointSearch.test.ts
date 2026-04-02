/**
 * Unit Tests — endpointSearch type-filtering (Phase 17)
 *
 * Verifies that endpointSearch uses the correct typed API path
 * based on the endpointType sibling parameter (via getCurrentNodeParameter).
 *
 * RED phase: these tests are written before the implementation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { endpointSearch } from '../../nodes/shared/loadOptions';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type MockApiRequest = ReturnType<typeof vi.fn>;

/**
 * Build a minimal ILoadOptionsFunctions context that:
 * - returns `endpointType` from getCurrentNodeParameter
 * - exposes a spy via helpers.httpRequest so we can assert the URL called
 */
function makeCtx(endpointType: string): {
  ctx: ILoadOptionsFunctions;
  httpRequestSpy: MockApiRequest;
} {
  const httpRequestSpy = vi.fn(async () => ({
    data: [
      { id: 'aaaaaaaa-0000-0000-0000-000000000001', displayName: 'EP-1', hostName: 'host1' },
    ],
    hasNextPage: false,
  }));

  const ctx = {
    getCurrentNodeParameter: vi.fn((paramName: string) => {
      if (paramName === 'endpointType') return endpointType;
      return undefined;
    }),
    getCredentials: vi.fn(async () => ({
      baseUrl: 'https://bms-test:444/bconnect',
      username: 'admin',
      password: 'secret',
      ignoreSslIssues: false,
    })),
    helpers: {
      httpRequest: httpRequestSpy,
      returnJsonArray: vi.fn((d: unknown) => d),
    },
    getNode: vi.fn(() => ({ name: 'test', type: 'test', typeVersion: 1, position: [0, 0], parameters: {} })),
  } as unknown as ILoadOptionsFunctions;

  return { ctx, httpRequestSpy };
}

/** Extract the API path that was passed to httpRequest */
function calledPath(spy: MockApiRequest): string {
  const callArgs = spy.mock.calls[0]?.[0] as { url?: string } | undefined;
  return callArgs?.url ?? '';
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('endpointSearch — type-filtered list', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses /Endpoints when endpointType is "all"', async () => {
    const { ctx, httpRequestSpy } = makeCtx('all');
    await endpointSearch.call(ctx);
    expect(calledPath(httpRequestSpy)).toContain('/endpoints/v2.0/Endpoints');
    expect(calledPath(httpRequestSpy)).not.toContain('WindowsEndpoints');
  });

  it('uses /WindowsEndpoints when endpointType is "windows"', async () => {
    const { ctx, httpRequestSpy } = makeCtx('windows');
    await endpointSearch.call(ctx);
    expect(calledPath(httpRequestSpy)).toContain('/endpoints/v2.0/WindowsEndpoints');
  });

  it('uses /AndroidEndpoints when endpointType is "android"', async () => {
    const { ctx, httpRequestSpy } = makeCtx('android');
    await endpointSearch.call(ctx);
    expect(calledPath(httpRequestSpy)).toContain('/endpoints/v2.0/AndroidEndpoints');
  });

  it('uses /IosEndpoints when endpointType is "ios"', async () => {
    const { ctx, httpRequestSpy } = makeCtx('ios');
    await endpointSearch.call(ctx);
    expect(calledPath(httpRequestSpy)).toContain('/endpoints/v2.0/IosEndpoints');
  });

  it('uses /LinuxEndpoints when endpointType is "linux"', async () => {
    const { ctx, httpRequestSpy } = makeCtx('linux');
    await endpointSearch.call(ctx);
    expect(calledPath(httpRequestSpy)).toContain('/endpoints/v2.0/LinuxEndpoints');
  });

  it('uses /MacEndpoints when endpointType is "mac"', async () => {
    const { ctx, httpRequestSpy } = makeCtx('mac');
    await endpointSearch.call(ctx);
    expect(calledPath(httpRequestSpy)).toContain('/endpoints/v2.0/MacEndpoints');
  });

  it('uses /NetworkEndpoints when endpointType is "network"', async () => {
    const { ctx, httpRequestSpy } = makeCtx('network');
    await endpointSearch.call(ctx);
    expect(calledPath(httpRequestSpy)).toContain('/endpoints/v2.0/NetworkEndpoints');
  });

  it('falls back to /Endpoints when endpointType is absent (undefined)', async () => {
    const { ctx, httpRequestSpy } = makeCtx(undefined as unknown as string);
    await endpointSearch.call(ctx);
    expect(calledPath(httpRequestSpy)).toContain('/endpoints/v2.0/Endpoints');
    expect(calledPath(httpRequestSpy)).not.toMatch(/Windows|Android|Ios|Linux|Mac|Network/);
  });

  it('returns mapped results regardless of endpoint type', async () => {
    const { ctx } = makeCtx('windows');
    const result = await endpointSearch.call(ctx);
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toMatchObject({
      name: 'EP-1 (host1)',
      value: 'aaaaaaaa-0000-0000-0000-000000000001',
    });
  });

  it('passes SearchQuery filter through unchanged', async () => {
    const { ctx, httpRequestSpy } = makeCtx('windows');
    await endpointSearch.call(ctx, 'myhost');
    const qs = (httpRequestSpy.mock.calls[0]?.[0] as { qs?: Record<string, unknown> })?.qs;
    expect(qs?.SearchQuery).toContain('myhost');
  });
});
