import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  getManagementServer,
  getGateway,
  getDipStatus,
  getVpnAppliance,
  getMicroservices,
  getMicroservice,
  getCloudConnectors,
  getPxeRelays,
  getSecurityGroups,
  getSecurityGroup,
  getSecurityProfiles,
  getSecurityProfile,
  getAccessRights,
  restartManagementServer,
  cancelScheduledRestart,
  startMicroservice,
  stopMicroservice,
  restartMicroservice,
  createSecurityGroup,
  updateSecurityGroup,
  deleteSecurityGroup,
  createSecurityProfile,
  updateSecurityProfile,
  deleteSecurityProfile,
  updateObjectPermissions,
  getDipsMSWCleanup,
  simulateMSWCleanup,
  getApiKeys,
  getDownloadJobs,
  getDownloadJob,
} from '../../../../../nodes/BaramundiAdmin/actions/serverManagement/serverManagement.execute';

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

describe('Server Management Operations', () => {
  describe('Server Information Operations', () => {
    describe('getManagementServer()', () => {
      it('should fetch management server information', async () => {
        const mockServer = {
          id: 'server-1',
          name: 'BMS-WIN22SRV',
          version: '2024.1.100',
          licenseInfo: { isValid: true, expiryDate: '2025-12-31' },
        };

        const mockContext = createMockExecuteFunctions({}, {}, mockServer);
        const result = await getManagementServer.call(mockContext, 0);

        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(result[0].json).toEqual(mockServer);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/servermanagement/v2.0/ManagementServer'),
          }),
        );
      });
    });

    describe('getGateway()', () => {
      it('should fetch gateway information', async () => {
        const mockGateway = {
          id: 'gateway-1',
          name: 'Primary Gateway',
          status: 'online',
        };

        const mockContext = createMockExecuteFunctions({}, {}, mockGateway);
        const result = await getGateway.call(mockContext, 0);

        expect(result).toBeDefined();
        expect(result[0].json.name).toBe('Primary Gateway');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/servermanagement/v2.0/Gateway'),
          }),
        );
      });
    });

    describe('getDipStatus()', () => {
      it('should fetch DIP status information', async () => {
        const mockDips = [
          { id: 'dip-1', name: 'DIP Munich', status: 'online' },
          { id: 'dip-2', name: 'DIP Berlin', status: 'online' },
        ];

        const mockContext = createMockExecuteFunctions({}, {}, mockDips);
        const result = await getDipStatus.call(mockContext, 0);

        expect(result).toHaveLength(2);
        expect(result[0].json.name).toBe('DIP Munich');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/servermanagement/v2.0/Dips'),
          }),
        );
      });
    });

    describe('getVpnAppliance()', () => {
      it('should fetch VPN appliance information', async () => {
        const mockVpn = {
          id: 'vpn-1',
          name: 'Corporate VPN',
          isEnabled: true,
        };

        const mockContext = createMockExecuteFunctions({}, {}, mockVpn);
        const result = await getVpnAppliance.call(mockContext, 0);

        expect(result[0].json.name).toBe('Corporate VPN');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/servermanagement/v2.0/VpnAppliance'),
          }),
        );
      });
    });
  });

  describe('Microservices Operations', () => {
    describe('getMicroservices()', () => {
      it('should fetch all microservices', async () => {
        const mockMicroservices = [
          { id: 'ms-1', name: 'Inventory Service', status: 'running' },
          { id: 'ms-2', name: 'Deployment Service', status: 'running' },
        ];

        const mockContext = createMockExecuteFunctions({}, {}, mockMicroservices);
        const result = await getMicroservices.call(mockContext, 0);

        expect(result).toHaveLength(2);
        expect(result[0].json.name).toBe('Inventory Service');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/servermanagement/v2.0/Microservices'),
          }),
        );
      });
    });

    describe('getMicroservice()', () => {
      it('should fetch a single microservice by ID', async () => {
        const microserviceId = '9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a9a';
        const mockMicroservice = {
          id: microserviceId,
          name: 'Inventory Service',
          status: 'running',
          version: '2024.1',
        };

        const mockContext = createMockExecuteFunctions({ microserviceId }, {}, mockMicroservice);
        const result = await getMicroservice.call(mockContext, 0);

        expect(result[0].json.id).toBe(microserviceId);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/servermanagement/v2.0/Microservices/${microserviceId}`),
          }),
        );
      });
    });
  });

  describe('Infrastructure Operations', () => {
    describe('getCloudConnectors()', () => {
      it('should fetch all cloud connectors', async () => {
        const mockConnectors = [
          { id: 'cc-1', name: 'Azure Connector', isActive: true },
        ];

        const mockContext = createMockExecuteFunctions({}, {}, mockConnectors);
        const result = await getCloudConnectors.call(mockContext, 0);

        expect(result).toHaveLength(1);
        expect(result[0].json.name).toBe('Azure Connector');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/servermanagement/v2.0/CloudConnectors'),
          }),
        );
      });
    });

    describe('getPxeRelays()', () => {
      it('should fetch all PXE relays', async () => {
        const mockRelays = [
          { id: 'pxe-1', name: 'PXE Relay 1', status: 'active' },
        ];

        const mockContext = createMockExecuteFunctions({}, {}, mockRelays);
        const result = await getPxeRelays.call(mockContext, 0);

        expect(result).toHaveLength(1);
        expect(result[0].json.name).toBe('PXE Relay 1');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/servermanagement/v2.0/PxeRelays'),
          }),
        );
      });
    });
  });

  describe('Security Groups Operations', () => {
    describe('getSecurityGroups()', () => {
      it('should fetch security groups with pagination', async () => {
        const mockGroups = {
          currentPage: 0,
          pageSize: 50,
          totalPages: 1,
          totalItems: 2,
          hasPreviousPage: false,
          hasNextPage: false,
          data: [
            { id: 'sg-1', name: 'Administrators', description: 'Admin group' },
            { id: 'sg-2', name: 'Operators', description: 'Operator group' },
          ],
        };

        const mockContext = createMockExecuteFunctions({ returnAll: false, limit: 50 }, {}, mockGroups);
        const result = await getSecurityGroups.call(mockContext, 0);

        expect(result).toHaveLength(2);
        expect(result[0].json.name).toBe('Administrators');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/servermanagement/v2.0/SecurityGroups'),
            qs: expect.objectContaining({
              PageSize: 50,
              Page: 0,
            }),
          }),
        );
      });
    });

    describe('getSecurityGroup()', () => {
      it('should fetch a single security group by ID', async () => {
        const groupId = 'bcbcbcbc-bcbc-bcbc-bcbc-bcbcbcbcbcbc';
        const mockGroup = {
          id: groupId,
          name: 'Administrators',
          description: 'Full access group',
        };

        const mockContext = createMockExecuteFunctions({ securityGroupId: groupId }, {}, mockGroup);
        const result = await getSecurityGroup.call(mockContext, 0);

        expect(result[0].json.id).toBe(groupId);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/servermanagement/v2.0/SecurityGroups/${groupId}`),
          }),
        );
      });
    });

    describe('createSecurityGroup()', () => {
      it('should create a new security group', async () => {
        const name = 'Test Group';
        const mockCreated = {
          id: 'sg-new',
          name,
          description: 'Test description',
        };

        const mockContext = createMockExecuteFunctions(
          { name, additionalFields: { description: 'Test description' } },
          {},
          mockCreated,
        );
        const result = await createSecurityGroup.call(mockContext, 0);

        expect(result[0].json.name).toBe(name);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: expect.stringContaining('/servermanagement/v2.0/SecurityGroups'),
            body: expect.objectContaining({ name }),
          }),
        );
      });
    });

    describe('updateSecurityGroup()', () => {
      it('should update a security group', async () => {
        const groupId = 'bcbcbcbc-bcbc-bcbc-bcbc-bcbcbcbcbcbc';
        const mockUpdated = { id: groupId, name: 'Updated Name' };

        const mockContext = createMockExecuteFunctions(
          { securityGroupId: groupId, updateFields: { name: 'Updated Name' } },
          {},
          {},
        );

        mockContext.helpers.httpRequest = vi.fn()
          .mockResolvedValueOnce(undefined) // PATCH returns void
          .mockResolvedValueOnce(mockUpdated); // GET returns updated group

        const result = await updateSecurityGroup.call(mockContext, 0);

        expect(result[0].json.name).toBe('Updated Name');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
      });
    });

    describe('deleteSecurityGroup()', () => {
      it('should delete a security group', async () => {
        const groupId = 'bcbcbcbc-bcbc-bcbc-bcbc-bcbcbcbcbcbc';
        const mockContext = createMockExecuteFunctions({ securityGroupId: groupId }, {}, {});
        const result = await deleteSecurityGroup.call(mockContext, 0);

        expect(result[0].json).toEqual({ success: true, deletedId: groupId });
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'DELETE',
            url: expect.stringContaining(`/servermanagement/v2.0/SecurityGroups/${groupId}`),
          }),
        );
      });
    });
  });

  describe('Security Profiles Operations', () => {
    describe('getSecurityProfiles()', () => {
      it('should fetch security profiles with pagination', async () => {
        const mockProfiles = {
          currentPage: 0,
          pageSize: 50,
          totalPages: 1,
          totalItems: 1,
          hasPreviousPage: false,
          hasNextPage: false,
          data: [
            { id: 'sp-1', name: 'Full Access', permissions: [] },
          ],
        };

        const mockContext = createMockExecuteFunctions({ returnAll: false, limit: 50 }, {}, mockProfiles);
        const result = await getSecurityProfiles.call(mockContext, 0);

        expect(result).toHaveLength(1);
        expect(result[0].json.name).toBe('Full Access');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining('/servermanagement/v2.0/SecurityProfiles'),
          }),
        );
      });
    });

    describe('getSecurityProfile()', () => {
      it('should fetch a single security profile by ID', async () => {
        const profileId = 'dededede-dede-dede-dede-dededededede';
        const mockProfile = {
          id: profileId,
          name: 'Full Access',
          permissions: ['read', 'write'],
        };

        const mockContext = createMockExecuteFunctions({ securityProfileId: profileId }, {}, mockProfile);
        const result = await getSecurityProfile.call(mockContext, 0);

        expect(result[0].json.id).toBe(profileId);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/servermanagement/v2.0/SecurityProfiles/${profileId}`),
          }),
        );
      });
    });

    describe('createSecurityProfile()', () => {
      it('should create a new security profile', async () => {
        const name = 'Test Profile';
        const mockCreated = {
          id: 'sp-new',
          name,
          comment: 'Test comment',
          displayAdministratorIdentities: false,
          displayEndpointUserIdentities: false,
        };

        const mockContext = createMockExecuteFunctions(
          {
            name,
            additionalFields: {
              comment: 'Test comment',
              displayAdministratorIdentities: false,
              displayEndpointUserIdentities: false,
            },
          },
          {},
          mockCreated,
        );
        const result = await createSecurityProfile.call(mockContext, 0);

        expect(result[0].json.name).toBe(name);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: expect.stringContaining('/servermanagement/v2.0/SecurityProfiles'),
            body: expect.objectContaining({ name }),
          }),
        );
      });
    });

    describe('updateSecurityProfile()', () => {
      it('should update a security profile', async () => {
        const profileId = 'dededede-dede-dede-dede-dededededede';
        const mockUpdated = { id: profileId, name: 'Updated Profile' };

        const mockContext = createMockExecuteFunctions(
          { securityProfileId: profileId, updateFields: { name: 'Updated Profile' } },
          {},
          {},
        );

        mockContext.helpers.httpRequest = vi.fn()
          .mockResolvedValueOnce(undefined) // PATCH returns void
          .mockResolvedValueOnce(mockUpdated); // GET returns updated profile

        const result = await updateSecurityProfile.call(mockContext, 0);

        expect(result[0].json.name).toBe('Updated Profile');
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
      });
    });

    describe('deleteSecurityProfile()', () => {
      it('should delete a security profile', async () => {
        const profileId = 'dededede-dede-dede-dede-dededededede';
        const mockContext = createMockExecuteFunctions({ securityProfileId: profileId }, {}, {});
        const result = await deleteSecurityProfile.call(mockContext, 0);

        expect(result[0].json).toEqual({ success: true, deletedId: profileId });
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'DELETE',
            url: expect.stringContaining(`/servermanagement/v2.0/SecurityProfiles/${profileId}`),
          }),
        );
      });
    });
  });

  describe('Object Permissions Operations', () => {
    describe('getAccessRights()', () => {
      it('should fetch access rights for an object', async () => {
        const objectId = 'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0';
        const mockRights = {
          objectId,
          permissions: [
            { securityGroupId: 'sg-1', rights: ['read', 'write'] },
          ],
        };

        const mockContext = createMockExecuteFunctions({ objectId }, {}, mockRights);
        const result = await getAccessRights.call(mockContext, 0);

        expect(result[0].json.objectId).toBe(objectId);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'GET',
            url: expect.stringContaining(`/servermanagement/v2.0/Objects/${objectId}/Rights`),
          }),
        );
      });
    });

    describe('updateObjectPermissions()', () => {
      it('should update object permissions', async () => {
        const objectId = 'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0';
        const mockUpdated = { objectId, updated: true };

        const mockContext = createMockExecuteFunctions(
          {
            objectId,
            updateFields: {
              securityProfileAccessRights: JSON.stringify([{ profileId: 'sp-1', accessRights: 31 }]),
            },
          },
          {},
          {},
        );

        mockContext.helpers.httpRequest = vi.fn()
          .mockResolvedValueOnce(undefined) // PATCH returns void
          .mockResolvedValueOnce(mockUpdated); // GET returns updated object

        const result = await updateObjectPermissions.call(mockContext, 0);

        expect(result[0].json.updated).toBe(true);
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'PATCH',
            url: expect.stringContaining(`/servermanagement/v2.0/Objects/${objectId}`),
          }),
        );
      });
    });
  });

  describe('Server Control Operations', () => {
    describe('restartManagementServer()', () => {
      it('should restart the management server', async () => {
        const mockContext = createMockExecuteFunctions({}, {}, {});
        const result = await restartManagementServer.call(mockContext, 0);

        expect(result[0].json).toEqual({ success: true, action: 'restart' });
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: expect.stringContaining('/servermanagement/v2.0/Restart'),
          }),
        );
      });
    });

    describe('cancelScheduledRestart()', () => {
      it('should cancel scheduled restart', async () => {
        const mockContext = createMockExecuteFunctions({}, {}, {});
        const result = await cancelScheduledRestart.call(mockContext, 0);

        expect(result[0].json).toEqual({ success: true, action: 'cancel_restart' });
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: expect.stringContaining('/servermanagement/v2.0/CancelScheduledRestart'),
          }),
        );
      });
    });

    describe('startMicroservice()', () => {
      it('should start a microservice', async () => {
        const microserviceId = '9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a9a';
        const mockContext = createMockExecuteFunctions({ microserviceId }, {}, {});
        const result = await startMicroservice.call(mockContext, 0);

        expect(result[0].json).toEqual({ success: true, microserviceId, action: 'start' });
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: expect.stringContaining(`/servermanagement/v2.0/Microservices/${microserviceId}/Start`),
          }),
        );
      });
    });

    describe('stopMicroservice()', () => {
      it('should stop a microservice', async () => {
        const microserviceId = '9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a9a';
        const mockContext = createMockExecuteFunctions({ microserviceId }, {}, {});
        const result = await stopMicroservice.call(mockContext, 0);

        expect(result[0].json).toEqual({ success: true, microserviceId, action: 'stop' });
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: expect.stringContaining(`/servermanagement/v2.0/Microservices/${microserviceId}/Stop`),
          }),
        );
      });
    });

    describe('restartMicroservice()', () => {
      it('should restart a microservice', async () => {
        const microserviceId = '9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a9a';
        const mockContext = createMockExecuteFunctions({ microserviceId }, {}, {});
        const result = await restartMicroservice.call(mockContext, 0);

        expect(result[0].json).toEqual({ success: true, microserviceId, action: 'restart' });
        expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: expect.stringContaining(`/servermanagement/v2.0/Microservices/${microserviceId}/Restart`),
          }),
        );
      });
    });
  });

  describe('Credential Configuration', () => {
    it('should use correct base URL from credentials', async () => {
      const mockServer = { id: 'server-1', name: 'Test' };
      const mockContext = createMockExecuteFunctions(
        {},
        { baseUrl: 'https://custom-bms-server:443/bconnect' },
        mockServer,
      );

      await getManagementServer.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom-bms-server:443/bconnect',
        }),
      );
    });

    it('should use SSL skip option from credentials', async () => {
      const mockServer = { id: 'server-1', name: 'Test' };
      const mockContext = createMockExecuteFunctions({}, { ignoreSslIssues: true }, mockServer);

      await getManagementServer.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          skipSslCertificateValidation: true,
        }),
      );
    });
  });
});

// ============================================================================
// Phase 4: ServerManagement Operations
// ============================================================================

const pageResponseSM = (data: any[]) => ({ data, currentPage: 0, pageSize: 50, totalCount: data.length });

describe('ServerManagement Phase 4 - New Operations', () => {
  describe('getDipsMSWCleanup()', () => {
    it('should return status started', async () => {
      const mockContext = createMockExecuteFunctions({}, {}, { status: 'started' });
      const result = await getDipsMSWCleanup.call(mockContext, 0);
      expect(result[0].json.status).toBe('started');
    });
  });

  describe('simulateMSWCleanup()', () => {
    it('should return simulation result', async () => {
      const mockContext = createMockExecuteFunctions({}, {}, { simulationResult: 'ok' });
      const result = await simulateMSWCleanup.call(mockContext, 0);
      expect(result[0].json.simulationResult).toBe('ok');
    });
  });

  describe('getApiKeys()', () => {
    it('should return api keys array', async () => {
      const mockContext = createMockExecuteFunctions({}, {}, [{ id: 'key1', name: 'ApiKey1' }]);
      const result = await getApiKeys.call(mockContext, 0);
      expect(result).toHaveLength(1);
    });
  });

  describe('getDownloadJobs()', () => {
    it('should return paginated download jobs when returnAll is false', async () => {
      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 5 },
        {},
        pageResponseSM([{ id: 'job1' }, { id: 'job2' }]),
      );
      const result = await getDownloadJobs.call(mockContext, 0);
      expect(result).toHaveLength(2);
    });
  });

  describe('getDownloadJob()', () => {
    it('should return the download job by id', async () => {
      const downloadJobId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      const mockContext = createMockExecuteFunctions(
        { downloadJobId },
        {},
        { id: downloadJobId },
      );
      const result = await getDownloadJob.call(mockContext, 0);
      expect(result[0].json.id).toBe(downloadJobId);
    });
  });
});
