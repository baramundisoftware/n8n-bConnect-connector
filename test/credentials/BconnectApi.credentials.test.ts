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
});
