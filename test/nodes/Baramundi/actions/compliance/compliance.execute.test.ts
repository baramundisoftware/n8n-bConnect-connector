import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  getRules,
  getRule,
  getVulnerabilities,
  getVulnerability,
  getDetectedVulnerabilities,
  getDetectedVulnerabilitiesByEndpoint,
  getDetectedRuleViolations,
  getDetectedRuleViolationsByEndpoint,
} from '../../../../../nodes/Baramundi/actions/compliance/compliance.execute';

function createMockExecuteFunctions(
  params: Record<string, any> = {},
  mockResponse: any = {},
): IExecuteFunctions {
  return {
    getNodeParameter: vi.fn((name: string, _index: number, defaultValue?: any) => {
      return params[name] !== undefined ? params[name] : defaultValue;
    }),
    getCredentials: vi.fn(async () => ({
      baseUrl: 'https://bms-server:444/bconnect',
      username: 'admin',
      password: 'secret',
      ignoreSslIssues: true,
    })),
    helpers: {
      httpRequest: vi.fn(async () => mockResponse),
      returnJsonArray: vi.fn((data: any) => {
        if (Array.isArray(data)) {
          return data.map((item) => ({ json: item })) as INodeExecutionData[];
        }
        return [{ json: data }] as INodeExecutionData[];
      }),
    },
    getNode: vi.fn(() => ({
      id: 'test-node-id',
      name: 'Baramundi',
      type: 'n8n-nodes-baramundi.baramundi',
      typeVersion: 1,
      position: [0, 0],
      parameters: {},
    })),
  } as unknown as IExecuteFunctions;
}

const RULE_ID = '11111111-1111-1111-1111-111111111111';
const VULN_ID = '22222222-2222-2222-2222-222222222222';
const ENDPOINT_ID = '33333333-3333-3333-3333-333333333333';
const mockRule = { id: RULE_ID, name: 'Password Policy', platform: 'Android' };
const mockVuln = { id: VULN_ID, name: 'CVE-2024-1234', severity: 'High' };
const mockDetectedVuln = { id: '44444444-4444-4444-4444-444444444444', endpointId: ENDPOINT_ID, vulnerabilityId: VULN_ID };
const mockRuleViolation = { id: '55555555-5555-5555-5555-555555555555', endpointId: ENDPOINT_ID, ruleId: RULE_ID };

const pageResponse = (data: any[]) => ({ data, currentPage: 0, pageSize: 50, totalCount: data.length });

describe('Compliance Operations', () => {

  describe('getRules()', () => {
    it('should return paginated rules', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: false, limit: 10, options: {} },
        pageResponse([mockRule]),
      );
      const result = await getRules.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockRule);
    });

    it('should return all rules when returnAll is true', async () => {
      const rules = [mockRule, { ...mockRule, id: 'rule-guid-2' }];
      const mock = createMockExecuteFunctions(
        { returnAll: true, options: {} },
        pageResponse(rules),
      );
      const result = await getRules.call(mock, 0);
      expect(result).toHaveLength(2);
    });

    it('should pass orderBy option to query', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: false, limit: 5, options: { orderBy: 'Name asc' } },
        pageResponse([mockRule]),
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await getRules.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.qs?.OrderBy).toBe('Name asc');
    });
  });

  describe('getRule()', () => {
    it('should return a single rule by ID', async () => {
      const mock = createMockExecuteFunctions(
        { ruleId: RULE_ID },
        mockRule,
      );
      const result = await getRule.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockRule);
    });

    it('should call the correct API path with rule ID', async () => {
      const mock = createMockExecuteFunctions(
        { ruleId: RULE_ID },
        mockRule,
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await getRule.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.url).toContain('/compliance/v2.0/Rules/');
    });
  });

  describe('getVulnerabilities()', () => {
    it('should return paginated vulnerabilities', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: false, limit: 10, options: {} },
        pageResponse([mockVuln]),
      );
      const result = await getVulnerabilities.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockVuln);
    });
  });

  describe('getVulnerability()', () => {
    it('should return a single vulnerability by ID', async () => {
      const mock = createMockExecuteFunctions(
        { vulnerabilityId: VULN_ID },
        mockVuln,
      );
      const result = await getVulnerability.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockVuln);
    });

    it('should call the correct API path with vulnerability ID', async () => {
      const mock = createMockExecuteFunctions(
        { vulnerabilityId: VULN_ID },
        mockVuln,
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await getVulnerability.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.url).toContain('/compliance/v2.0/Vulnerabilities/');
    });
  });

  describe('getDetectedVulnerabilities()', () => {
    it('should return paginated detected vulnerabilities', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: false, limit: 10, options: {} },
        pageResponse([mockDetectedVuln]),
      );
      const result = await getDetectedVulnerabilities.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockDetectedVuln);
    });
  });

  describe('getDetectedVulnerabilitiesByEndpoint()', () => {
    it('should return detected vulnerabilities for a specific endpoint', async () => {
      const mock = createMockExecuteFunctions(
        { endpointId: ENDPOINT_ID, returnAll: false, limit: 10 },
        pageResponse([mockDetectedVuln]),
      );
      const result = await getDetectedVulnerabilitiesByEndpoint.call(mock, 0);
      expect(result).toHaveLength(1);
    });

    it('should call correct path with endpoint ID', async () => {
      const mock = createMockExecuteFunctions(
        { endpointId: ENDPOINT_ID, returnAll: false, limit: 10 },
        pageResponse([mockDetectedVuln]),
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await getDetectedVulnerabilitiesByEndpoint.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.url).toContain('/compliance/v2.0/WindowsEndpoints/');
      expect(callArgs.url).toContain('/DetectedVulnerabilities');
    });
  });

  describe('getDetectedRuleViolations()', () => {
    it('should return paginated rule violations', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: false, limit: 10, options: {} },
        pageResponse([mockRuleViolation]),
      );
      const result = await getDetectedRuleViolations.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockRuleViolation);
    });
  });

  describe('getDetectedRuleViolationsByEndpoint()', () => {
    it('should return rule violations for a specific endpoint', async () => {
      const mock = createMockExecuteFunctions(
        { endpointId: ENDPOINT_ID, returnAll: false, limit: 10 },
        pageResponse([mockRuleViolation]),
      );
      const result = await getDetectedRuleViolationsByEndpoint.call(mock, 0);
      expect(result).toHaveLength(1);
    });

    it('should call correct path with endpoint ID', async () => {
      const mock = createMockExecuteFunctions(
        { endpointId: ENDPOINT_ID, returnAll: false, limit: 10 },
        pageResponse([mockRuleViolation]),
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await getDetectedRuleViolationsByEndpoint.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.url).toContain('/compliance/v2.0/Endpoints/');
      expect(callArgs.url).toContain('/DetectedRuleViolations');
    });
  });
});
