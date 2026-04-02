import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  getBitLockerWindowsEndpoints,
  getBitLockerWindowsEndpoint,
  getLocalAdministrativeAccounts,
  triggerLocalAdminAccountsUpdate,
  patchLocalAdminUserCredentials,
  getMicrosoftDefenderThreats,
  getMicrosoftDefenderThreat,
  getMicrosoftDefenderThreatsByEndpoint,
  getMicrosoftDefenderThreatsByLogicalGroup,
  getMicrosoftDefenderWindowsEndpoints,
  getMicrosoftDefenderWindowsEndpoint,
  getBitLockerSecrets,
  patchBitLockerSecrets,
} from '../../../../../nodes/BaramundiSecurity/actions/defenseControl/defenseControl.execute';

// Mock helper function to create IExecuteFunctions
function createMockExecuteFunctions(
  params: Record<string, any> = {},
  credentials: Record<string, any> = {},
  mockResponse: any = {},
): IExecuteFunctions {
  return {
    getNodeParameter: vi.fn((name: string, index: number, defaultValue?: any) => {
      return params[name] !== undefined ? params[name] : defaultValue;
    }),
    getCredentials: vi.fn(async () => ({
      baseUrl: 'https://bms-win22srv:444/bconnect',
      username: 'Administrator',
      password: 'test-password-do-not-use',
      ignoreSslIssues: false,
      ...credentials,
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

describe('Defense Control Operations', () => {
  describe('BitLocker Operations', () => {
    describe('getBitLockerWindowsEndpoints()', () => {
      it('should fetch BitLocker endpoints with pagination', async () => {
        const mockEndpoints = {
          currentPage: 0,
          pageSize: 50,
          totalPages: 1,
          totalItems: 2,
          hasPreviousPage: false,
          hasNextPage: false,
          data: [
            { id: 'ep-1', name: 'WS-001', bitLockerEnabled: true, encryptionStatus: 'Encrypted' },
            { id: 'ep-2', name: 'WS-002', bitLockerEnabled: true, encryptionStatus: 'Encrypted' },
          ],
        };

        const mockContext = createMockExecuteFunctions({ returnAll: false, limit: 50 }, {}, mockEndpoints);
        const result = await getBitLockerWindowsEndpoints.call(mockContext, 0);

        expect(result).toHaveLength(2);
        expect(result[0].json.name).toBe('WS-001');
        expect(result[0].json.bitLockerEnabled).toBe(true);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/defensecontrol/v2.0/BitLocker/WindowsEndpoints'),
            qs: expect.objectContaining({
              PageSize: 50,
              Page: 0,
            }),
          }),
        );
      });

      it('should fetch all BitLocker endpoints when returnAll is true', async () => {
        const mockPage1 = {
          currentPage: 0,
          pageSize: 2,
          totalPages: 2,
          totalItems: 3,
          hasPreviousPage: false,
          hasNextPage: true,
          data: [
            { id: 'ep-1', name: 'WS-001' },
            { id: 'ep-2', name: 'WS-002' },
          ],
        };

        const mockPage2 = {
          currentPage: 1,
          pageSize: 2,
          totalPages: 2,
          totalItems: 3,
          hasPreviousPage: true,
          hasNextPage: false,
          data: [
            { id: 'ep-3', name: 'WS-003' },
          ],
        };

        const mockContext = createMockExecuteFunctions({ returnAll: true }, {}, {});
        let callCount = 0;
        mockContext.helpers.httpRequest = vi.fn(async () => {
          return callCount++ === 0 ? mockPage1 : mockPage2;
        });

        const result = await getBitLockerWindowsEndpoints.call(mockContext, 0);

        expect(result).toHaveLength(3);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
      });
    });

    describe('getBitLockerWindowsEndpoint()', () => {
      it('should fetch a single BitLocker endpoint by ID', async () => {
        const endpointId = '11111111-1111-1111-1111-111111111111';
        const mockEndpoint = {
          id: endpointId,
          name: 'WS-001',
          bitLockerEnabled: true,
          encryptionStatus: 'Fully Encrypted',
          recoveryKeys: ['key1', 'key2'],
        };

        const mockContext = createMockExecuteFunctions({ endpointId }, {}, mockEndpoint);
        const result = await getBitLockerWindowsEndpoint.call(mockContext, 0);

        expect(result[0].json.id).toBe(endpointId);
        expect(result[0].json.bitLockerEnabled).toBe(true);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/defensecontrol/v2.0/BitLocker/WindowsEndpoints/${endpointId}`),
          }),
        );
      });

      it('should handle 404 errors for non-existent endpoints', async () => {
        const endpointId = '11111111-1111-1111-1111-111111111111';
        const mockContext = createMockExecuteFunctions({ endpointId });

        mockContext.helpers.httpRequest = vi.fn(async () => {
          const error: any = new Error('Not Found');
          error.statusCode = 404;
          throw error;
        });

        await expect(getBitLockerWindowsEndpoint.call(mockContext, 0)).rejects.toThrow('Not Found');
      });
    });
  });

  describe('Local Administrative Accounts Operations', () => {
    describe('getLocalAdministrativeAccounts()', () => {
      it('should fetch local admin accounts for an endpoint', async () => {
        const endpointId = '11111111-1111-1111-1111-111111111111';
        const mockAccounts = {
          endpointId,
          accounts: [
            { username: 'Administrator', expiryDate: '2024-12-31', isExpired: false },
            { username: 'LocalAdmin', expiryDate: '2024-11-30', isExpired: false },
          ],
        };

        const mockContext = createMockExecuteFunctions({ endpointId }, {}, mockAccounts);
        const result = await getLocalAdministrativeAccounts.call(mockContext, 0);

        expect(result[0].json.endpointId).toBe(endpointId);
        expect(result[0].json.accounts).toHaveLength(2);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/defensecontrol/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/${endpointId}`),
          }),
        );
      });
    });

    describe('triggerLocalAdminAccountsUpdate()', () => {
      it('should trigger update on client', async () => {
        const endpointId = '11111111-1111-1111-1111-111111111111';
        const mockContext = createMockExecuteFunctions({ endpointId }, {}, true);
        const result = await triggerLocalAdminAccountsUpdate.call(mockContext, 0);

        expect(result[0].json).toEqual({ success: true, endpointId });
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: expect.stringContaining(`/defensecontrol/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/${endpointId}/TriggerUpdateOnClient`),
          }),
        );
      });
    });

    describe('patchLocalAdminUserCredentials()', () => {
      it('should update local admin credentials', async () => {
        const endpointId = '11111111-1111-1111-1111-111111111111';
        const mockUpdated = {
          endpointId,
          accounts: [{ username: 'Administrator', expiryDate: '2025-12-31' }],
        };

        const mockContext = createMockExecuteFunctions(
          { endpointId, updateFields: { expiryDate: '2025-12-31' } },
          {},
          {},
        );

        mockContext.helpers.httpRequest = vi.fn()
          .mockResolvedValueOnce(mockUpdated); // PATCH returns updated account

        const result = await patchLocalAdminUserCredentials.call(mockContext, 0);

        expect(result[0].json.endpointId).toBe(endpointId);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'PATCH',
            url: expect.stringContaining(`/defensecontrol/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/${endpointId}`),
          }),
        );
      });
    });
  });

  describe('Microsoft Defender Threats Operations', () => {
    describe('getMicrosoftDefenderThreats()', () => {
      it('should fetch all threats with pagination', async () => {
        const mockThreats = {
          currentPage: 0,
          pageSize: 50,
          totalPages: 1,
          totalItems: 2,
          hasPreviousPage: false,
          hasNextPage: false,
          data: [
            { id: 'threat-1', name: 'Trojan.Generic', severity: 'High', status: 'Quarantined' },
            { id: 'threat-2', name: 'Adware.Suspicious', severity: 'Medium', status: 'Removed' },
          ],
        };

        const mockContext = createMockExecuteFunctions({ returnAll: false, limit: 50 }, {}, mockThreats);
        const result = await getMicrosoftDefenderThreats.call(mockContext, 0);

        expect(result).toHaveLength(2);
        expect(result[0].json.name).toBe('Trojan.Generic');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/defensecontrol/v2.0/MicrosoftDefender/Threats'),
          }),
        );
      });
    });

    describe('getMicrosoftDefenderThreat()', () => {
      it('should fetch a single threat by ID', async () => {
        const threatId = '40404040-4040-4040-4040-404040404040';
        const mockThreat = {
          id: threatId,
          name: 'Trojan.Generic',
          severity: 'High',
          detectedDate: '2024-01-20',
        };

        const mockContext = createMockExecuteFunctions({ threatId }, {}, mockThreat);
        const result = await getMicrosoftDefenderThreat.call(mockContext, 0);

        expect(result[0].json.id).toBe(threatId);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/defensecontrol/v2.0/MicrosoftDefender/Threats/${threatId}`),
          }),
        );
      });
    });

    describe('getMicrosoftDefenderThreatsByEndpoint()', () => {
      it('should fetch threats for a specific endpoint', async () => {
        const endpointId = '11111111-1111-1111-1111-111111111111';
        const mockThreats = {
          currentPage: 0,
          pageSize: 50,
          totalPages: 1,
          totalItems: 1,
          hasPreviousPage: false,
          hasNextPage: false,
          data: [
            { id: 'threat-1', name: 'Trojan.Generic', endpointId },
          ],
        };

        const mockContext = createMockExecuteFunctions({ endpointId, returnAll: false, limit: 50 }, {}, mockThreats);
        const result = await getMicrosoftDefenderThreatsByEndpoint.call(mockContext, 0);

        expect(result).toHaveLength(1);
        expect(result[0].json.endpointId).toBe(endpointId);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/defensecontrol/v2.0/MicrosoftDefender/WindowsEndpoints/${endpointId}/Threats`),
          }),
        );
      });
    });

    describe('getMicrosoftDefenderThreatsByLogicalGroup()', () => {
      it('should fetch threats for a logical group', async () => {
        const logicalGroupId = '22222222-2222-2222-2222-222222222222';
        const mockThreats = {
          currentPage: 0,
          pageSize: 50,
          totalPages: 1,
          totalItems: 2,
          hasPreviousPage: false,
          hasNextPage: false,
          data: [
            { id: 'threat-1', name: 'Threat 1' },
            { id: 'threat-2', name: 'Threat 2' },
          ],
        };

        const mockContext = createMockExecuteFunctions({ logicalGroupId, returnAll: false, limit: 50 }, {}, mockThreats);
        const result = await getMicrosoftDefenderThreatsByLogicalGroup.call(mockContext, 0);

        expect(result).toHaveLength(2);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/defensecontrol/v2.0/MicrosoftDefender/LogicalGroups/${logicalGroupId}/Threats`),
          }),
        );
      });
    });
  });

  describe('Microsoft Defender Endpoints Operations', () => {
    describe('getMicrosoftDefenderWindowsEndpoints()', () => {
      it('should fetch Defender endpoints with pagination', async () => {
        const mockEndpoints = {
          currentPage: 0,
          pageSize: 50,
          totalPages: 1,
          totalItems: 2,
          hasPreviousPage: false,
          hasNextPage: false,
          data: [
            { id: 'ep-1', name: 'WS-001', defenderEnabled: true, threatCount: 0 },
            { id: 'ep-2', name: 'WS-002', defenderEnabled: true, threatCount: 1 },
          ],
        };

        const mockContext = createMockExecuteFunctions({ returnAll: false, limit: 50 }, {}, mockEndpoints);
        const result = await getMicrosoftDefenderWindowsEndpoints.call(mockContext, 0);

        expect(result).toHaveLength(2);
        expect(result[0].json.name).toBe('WS-001');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/defensecontrol/v2.0/MicrosoftDefender/WindowsEndpoints'),
          }),
        );
      });
    });

    describe('getMicrosoftDefenderWindowsEndpoint()', () => {
      it('should fetch a single Defender endpoint by ID', async () => {
        const endpointId = '11111111-1111-1111-1111-111111111111';
        const mockEndpoint = {
          id: endpointId,
          name: 'WS-001',
          defenderEnabled: true,
          definitionsUpToDate: true,
          lastScan: '2024-01-20T10:00:00Z',
        };

        const mockContext = createMockExecuteFunctions({ endpointId }, {}, mockEndpoint);
        const result = await getMicrosoftDefenderWindowsEndpoint.call(mockContext, 0);

        expect(result[0].json.id).toBe(endpointId);
        expect(result[0].json.defenderEnabled).toBe(true);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/defensecontrol/v2.0/MicrosoftDefender/WindowsEndpoints/${endpointId}`),
          }),
        );
      });
    });
  });

  describe('Credential Configuration', () => {
    it('should use correct base URL from credentials', async () => {
      const mockEndpoint = { id: '11111111-1111-1111-1111-111111111111', name: 'Test' };
      const mockContext = createMockExecuteFunctions(
        { endpointId: '11111111-1111-1111-1111-111111111111' },
        { baseUrl: 'https://custom-bms-server:443/bconnect' },
        mockEndpoint,
      );

      await getBitLockerWindowsEndpoint.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom-bms-server:443/bconnect',
        }),
      );
    });

    it('should use SSL skip option from credentials', async () => {
      const mockEndpoint = { id: '11111111-1111-1111-1111-111111111111', name: 'Test' };
      const mockContext = createMockExecuteFunctions(
        { endpointId: '11111111-1111-1111-1111-111111111111' },
        { ignoreSslIssues: true },
        mockEndpoint,
      );

      await getBitLockerWindowsEndpoint.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          skipSslCertificateValidation: true,
        }),
      );
    });
  });
});

// ============================================================================
// Phase 4: BitLocker Secrets Operations
// ============================================================================

describe('DefenseControl Phase 4 - BitLocker Secrets', () => {
  describe('getBitLockerSecrets()', () => {
    it('should return bitlocker secrets for an endpoint', async () => {
      const mockResponse = { keyProtectors: [] };
      const mockContext = createMockExecuteFunctions(
        { endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
        {},
        mockResponse,
      );
      const result = await getBitLockerSecrets.call(mockContext, 0);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('patchBitLockerSecrets()', () => {
    it('should call httpRequest with method PATCH', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          patchOperations: '[{"op":"replace","path":"/InitialStartupPin","value":"12345"}]',
        },
        {},
        { success: true },
      );
      await patchBitLockerSecrets.call(mockContext, 0);
      const httpRequest = mockContext.helpers.httpRequest as ReturnType<typeof vi.fn>;
      expect(httpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'PATCH' }));
    });

    it('should throw for invalid JSON in patchOperations', async () => {
      const mockContext = createMockExecuteFunctions(
        { endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', patchOperations: 'not-json' },
        {},
        {},
      );
      await expect(patchBitLockerSecrets.call(mockContext, 0)).rejects.toThrow(
        'patchOperations must be a valid JSON array',
      );
    });

    it('should throw for RFC 6902 violations — invalid op', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          patchOperations: '[{"op":"update","path":"/x","value":1}]',
        },
        {},
        {},
      );
      await expect(patchBitLockerSecrets.call(mockContext, 0)).rejects.toThrow(
        /Invalid RFC 6902 patch document/,
      );
    });

    it('should throw for RFC 6902 violations — replace missing value', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          patchOperations: '[{"op":"replace","path":"/x"}]',
        },
        {},
        {},
      );
      await expect(patchBitLockerSecrets.call(mockContext, 0)).rejects.toThrow(
        /Invalid RFC 6902 patch document/,
      );
    });

    it('should throw for RFC 6902 violations — path not starting with /', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          patchOperations: '[{"op":"replace","path":"InitialStartupPin","value":"1"}]',
        },
        {},
        {},
      );
      await expect(patchBitLockerSecrets.call(mockContext, 0)).rejects.toThrow(
        /Invalid RFC 6902 patch document/,
      );
    });
  });
});

describe('Validation error paths', () => {
  it('should throw NodeOperationError for invalid GUID in endpointId (getBitLockerWindowsEndpoint)', async () => {
    const mock = createMockExecuteFunctions({ endpointId: 'not-a-guid' });
    await expect(getBitLockerWindowsEndpoint.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in endpointId (getLocalAdministrativeAccounts)', async () => {
    const mock = createMockExecuteFunctions({ endpointId: 'not-a-guid' });
    await expect(getLocalAdministrativeAccounts.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in endpointId (triggerLocalAdminAccountsUpdate)', async () => {
    const mock = createMockExecuteFunctions({ endpointId: 'not-a-guid' });
    await expect(triggerLocalAdminAccountsUpdate.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in threatId (getMicrosoftDefenderThreat)', async () => {
    const mock = createMockExecuteFunctions({ threatId: 'not-a-guid' });
    await expect(getMicrosoftDefenderThreat.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in endpointId (getMicrosoftDefenderThreatsByEndpoint)', async () => {
    const mock = createMockExecuteFunctions({ endpointId: 'not-a-guid', returnAll: false, limit: 10, options: {} });
    await expect(getMicrosoftDefenderThreatsByEndpoint.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in logicalGroupId (getMicrosoftDefenderThreatsByLogicalGroup)', async () => {
    const mock = createMockExecuteFunctions({ logicalGroupId: 'not-a-guid', returnAll: false, limit: 10, options: {} });
    await expect(getMicrosoftDefenderThreatsByLogicalGroup.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getBitLockerWindowsEndpoints', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(getBitLockerWindowsEndpoints.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getBitLockerWindowsEndpoints', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(getBitLockerWindowsEndpoints.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getMicrosoftDefenderThreats', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(getMicrosoftDefenderThreats.call(mock, 0)).rejects.toThrow();
  });
});
