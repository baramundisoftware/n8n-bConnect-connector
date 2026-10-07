/**
 * Unit Tests for the bConnect credential definition (#35)
 *
 * The credential test must request a real bConnect path and must not ignore HTTP errors:
 * with `ignoreHttpStatusErrors`, n8n's credential tester reports success for 401/404 too,
 * and `responseCode` rules never apply.
 */

import { describe, it, expect } from 'vitest';
import { BconnectApi } from '../../credentials/BconnectApi.credentials';

describe('BconnectApi credential', () => {
  const credential = new BconnectApi();
  const test = credential.test;

  it('should test against the module-prefixed endpoint list', () => {
    expect(test.request.url).toBe('/endpoints/v2.0/Endpoints');
    expect(test.request.qs).toEqual({ PageSize: 1 });
  });

  it('should not ignore HTTP status errors', () => {
    expect(test.request.ignoreHttpStatusErrors).toBeUndefined();
  });

  it.each([401, 403, 404])('should map HTTP %i to an actionable message', (code) => {
    const rule = test.rules?.find(
      (r) => r.type === 'responseCode' && r.properties.value === code,
    );
    expect(rule).toBeDefined();
    expect(String(rule?.properties.message).length).toBeGreaterThan(20);
  });

  it('should normalise the Server URL in the test request (#34)', () => {
    const expr = String(test.request.baseURL);
    expect(expr).toContain('$credentials.baseUrl');
    expect(expr).toContain('.trim()');
    // Evaluate the expression body the way n8n would, with a dirty URL
    const body = expr.replace(/^=\{\{\s*/, '').replace(/\s*\}\}$/, '');
    const evaluate = new Function('$credentials', `return ${body};`);
    expect(evaluate({ baseUrl: ' https://bms:444/bconnect/ ' })).toBe('https://bms:444/bconnect');
  });

  describe('authenticate()', () => {
    const request = { url: '/endpoints/v2.0/Endpoints', headers: { Accept: 'application/json' } };

    it('adds Basic auth and no API key header for Basic Auth', async () => {
      const out = await credential.authenticate(
        { authMethod: 'basicAuth', username: 'svc-n8n', password: 'pw-do-not-use' },
        request,
      );
      expect(out.auth).toEqual({ username: 'svc-n8n', password: 'pw-do-not-use' });
      expect(out.headers).toEqual({ Accept: 'application/json' });
    });

    it('defaults to Basic Auth when no method is stored (credentials from before the API key option)', async () => {
      const out = await credential.authenticate({ username: 'u', password: 'p' }, request);
      expect(out.auth).toEqual({ username: 'u', password: 'p' });
    });

    it('adds only the X-Api-Key header for API Key, no Basic auth', async () => {
      const out = await credential.authenticate(
        { authMethod: 'apiKey', apiKey: 'key-do-not-use', username: '', password: '' },
        request,
      );
      expect(out.headers).toEqual({ Accept: 'application/json', 'X-Api-Key': 'key-do-not-use' });
      expect(out.auth).toBeUndefined();
    });

    it('does not change the request it was given', async () => {
      const original = structuredClone(request);
      await credential.authenticate({ authMethod: 'apiKey', apiKey: 'k' }, request);
      expect(request).toEqual(original);
    });

    it('leaves authentication of the credential test to authenticate()', () => {
      expect(test.request.headers).toBeUndefined();
      expect(test.request.auth).toBeUndefined();
    });
  });
});
