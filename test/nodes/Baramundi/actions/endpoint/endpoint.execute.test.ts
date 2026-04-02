/**
 * Unit Tests for Endpoint Operations
 *
 * Tests the endpoint.execute.ts functions with mocked n8n execution context
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { get, getMany, search, deleteEndpoint, create, update, startEnrollment, triggerIntuneInstallation, getLogicalGroup, getLogicalGroups, createLogicalGroup, updateLogicalGroup, deleteLogicalGroup, getStaticGroup, getStaticGroups, createStaticGroup, updateStaticGroup, deleteStaticGroup, getDynamicGroup, getDynamicGroups, setEntraIdData, deleteEntraIdData, getEntraIdDataByDeviceId, getUnmanagedEndpoints, getUnmanagedEndpoint, deleteUnmanagedEndpoint, putEndpointMaintenanceWindow, putGroupMaintenanceWindow, updateEndpointMaintenanceWindow, updateGroupMaintenanceWindow, getEndpointMaintenanceWindow, getGroupMaintenanceWindow, getLogicalGroupSubGroups, getEndpointsByLogicalGroup, getEndpointsByStaticGroup, getEndpointsByDynamicGroup, getEndpointsByUDG, getEndpointsByADUser, getEndpointsByGroup, getIndustrialEndpoints, getIndustrialEndpoint, createIndustrialEndpoint, updateIndustrialEndpoint, deleteIndustrialEndpoint, getIndustrialEndpointsByGroup } from '../../../../../nodes/BaramundiEndpoint/actions/endpoint/endpoint.execute';

/**
 * Create a mock IExecuteFunctions instance for testing
 */
function createMockExecuteFunctions(
  params: Record<string, any> = {},
  credentials: Record<string, any> = {},
  mockResponse: any = {},
): IExecuteFunctions {
  return {
    getNodeParameter: vi.fn((paramName: string, index: number, defaultValue?: any) => {
      return params[paramName] ?? defaultValue;
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
      returnJsonArray: vi.fn((data: IDataObject | IDataObject[]) => {
        const array = Array.isArray(data) ? data : [data];
        return array.map(item => ({ json: item })) as INodeExecutionData[];
      }),
    },
    getNode: vi.fn(() => ({
      name: 'Baramundi',
      type: 'n8n-nodes-baramundi.baramundi',
      typeVersion: 1,
      position: [0, 0],
      parameters: {},
    })),
  } as unknown as IExecuteFunctions;
}

describe('Endpoint Operations - Unit Tests', () => {
  describe('get()', () => {
    it('should fetch a single endpoint by ID', async () => {
      // Arrange
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const mockEndpoint = {
        id: endpointId,
        displayName: 'bms-win22srv',
        operatingSystem: 'Microsoft Windows Server 2022 Standard',
        primaryIP: '172.21.165.56',
      };

      const mockContext = createMockExecuteFunctions(
        { endpointId, endpointSelection: endpointId },
        {},
        mockEndpoint
      );

      // Act
      const result = await get.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockEndpoint);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: `/endpoints/v2.0/Endpoints/${endpointId}`,
        })
      );
    });

    it('should handle errors when endpoint not found', async () => {
      // Arrange
      const endpointId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        { endpointId, endpointSelection: endpointId },
        {},
        {}
      );

      // Mock httpRequest to throw error
      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert
      await expect(get.call(mockContext, 0)).rejects.toThrow();
    });
  });

  describe('getMany()', () => {
    it('should fetch multiple endpoints with pagination', async () => {
      // Arrange
      const mockResponse = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          {
            id: '98cdf559-1733-42b4-ae1f-42eabf7f9281',
            displayName: 'bms-win22srv',
            operatingSystem: 'Microsoft Windows Server 2022 Standard',
          },
          {
            id: '12345678-1234-1234-1234-123456789012',
            displayName: 'client-01',
            operatingSystem: 'Microsoft Windows 11 Pro',
          },
          {
            id: '87654321-4321-4321-4321-210987654321',
            displayName: 'client-02',
            operatingSystem: 'Microsoft Windows 11 Pro',
          },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: {},
        },
        {},
        mockResponse
      );

      // Act
      const result = await getMany.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.displayName).toBe('bms-win22srv');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: '/endpoints/v2.0/Endpoints',
          qs: expect.objectContaining({
            PageSize: 50,
            Page: 0,
          }),
        })
      );
    });

    it('should fetch all endpoints when returnAll is true', async () => {
      // Arrange
      const mockResponse = {
        currentPage: 0,
        pageSize: 100,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: '1', displayName: 'endpoint-01' },
          { id: '2', displayName: 'endpoint-02' },
          { id: '3', displayName: 'endpoint-03' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: true,
          limit: 50,
          options: {},
        },
        {},
        mockResponse
      );

      // Act
      const result = await getMany.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            PageSize: 100,
            Page: 0,
          }),
        })
      );
    });

    it('should support orderBy option', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', displayName: 'A-Endpoint' },
          { id: '2', displayName: 'B-Endpoint' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { orderBy: 'displayName asc' },
        },
        {},
        mockResponse
      );

      // Act
      await getMany.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            OrderBy: 'displayName asc',
          }),
        })
      );
    });

    it('should support orgUnitId filter', async () => {
      // Arrange
      const orgUnitId = '11111111-1111-1111-1111-111111111111';
      const mockResponse = {
        data: [{ id: '1', displayName: 'endpoint-01' }],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { orgUnitId },
        },
        {},
        mockResponse
      );

      // Act
      await getMany.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            OrgUnitId: orgUnitId,
          }),
        })
      );
    });

    it('should handle empty result', async () => {
      // Arrange
      const mockResponse = {
        data: [],
        hasNextPage: false,
        totalItems: 0,
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50, options: {} },
        {},
        mockResponse
      );

      // Act
      const result = await getMany.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });
  });

  describe('search()', () => {
    it('should search endpoints by query string', async () => {
      // Arrange
      const searchQuery = 'win22srv';
      const mockResponse = {
        data: [
          {
            id: '98cdf559-1733-42b4-ae1f-42eabf7f9281',
            displayName: 'bms-win22srv',
            operatingSystem: 'Microsoft Windows Server 2022 Standard',
          },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          searchQuery,
          returnAll: false,
          limit: 50,
        },
        {},
        mockResponse
      );

      // Act
      const result = await search.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe('bms-win22srv');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            SearchQuery: searchQuery,
            PageSize: 50,
            Page: 0,
          }),
        })
      );
    });

    it('should search with returnAll option', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', displayName: 'match-01' },
          { id: '2', displayName: 'match-02' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          searchQuery: 'match',
          returnAll: true,
          limit: 50,
        },
        {},
        mockResponse
      );

      // Act
      const result = await search.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
    });

    it('should handle no search results', async () => {
      // Arrange
      const mockResponse = {
        data: [],
        hasNextPage: false,
        totalItems: 0,
      };

      const mockContext = createMockExecuteFunctions(
        {
          searchQuery: 'nonexistent',
          returnAll: false,
          limit: 50,
        },
        {},
        mockResponse
      );

      // Act
      const result = await search.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });

    it('should reject invalid OData in searchQuery (SEC-04.1)', async () => {
      // Arrange — injection attempt: semicolon-separated statement
      const mockContext = createMockExecuteFunctions(
        {
          searchQuery: "'; DROP TABLE Endpoints--",
          returnAll: false,
          limit: 50,
        },
        {},
        {}
      );

      // Act & Assert
      await expect(search.call(mockContext, 0)).rejects.toThrow();
    });
  });

  describe('deleteEndpoint()', () => {
    it('should delete an endpoint by ID', async () => {
      // Arrange
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const mockContext = createMockExecuteFunctions(
        { endpointId, endpointSelection: endpointId },
        {},
        {} // DELETE returns empty response
      );

      // Act
      const result = await deleteEndpoint.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        success: true,
        deletedId: endpointId,
      });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: `/endpoints/v2.0/Endpoints/${endpointId}`,
        })
      );
    });

    it('should handle errors when deleting non-existent endpoint', async () => {
      // Arrange
      const endpointId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        { endpointId, endpointSelection: endpointId },
        {},
        {}
      );

      // Mock httpRequest to throw error
      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert
      await expect(deleteEndpoint.call(mockContext, 0)).rejects.toThrow('404');
    });
  });

  describe('Credential Configuration', () => {
    it('should use correct base URL from credentials', async () => {
      // Arrange
      const customBaseUrl = 'https://custom-server:444/bconnect';
      const endpointId = '12345678-1234-1234-1234-123456789012';
      const mockContext = createMockExecuteFunctions(
        { endpointId, endpointSelection: endpointId },
        { baseUrl: customBaseUrl },
        { id: endpointId }
      );

      // Act
      await get.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: customBaseUrl,
        })
      );
    });

    it('should use SSL skip option from credentials', async () => {
      // Arrange
      const endpointId = '87654321-4321-4321-4321-210987654321';
      const mockContext = createMockExecuteFunctions(
        { endpointId, endpointSelection: endpointId },
        { ignoreSslIssues: true },
        { id: endpointId }
      );

      // Act
      await get.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          skipSslCertificateValidation: true,
        })
      );
    });
  });

  describe('create()', () => {
    it('should create a Windows endpoint with required fields only', async () => {
      // Arrange
      const displayName = 'test-endpoint-01';
      const hostName = 'TEST-PC-01';
      const mockCreatedEndpoint = {
        id: '12345678-1234-1234-1234-123456789abc',
        displayName,
        hostName,
        operatingSystem: 'Microsoft Windows 11 Pro',
        primaryIP: '10.0.0.50',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'windows',
          displayName,
          hostName,
          additionalFields: {},
        },
        {},
        mockCreatedEndpoint
      );

      // Act
      const result = await create.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe(displayName);
      expect(result[0].json.hostName).toBe(hostName);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: '/endpoints/v2.0/WindowsEndpoints',
          body: {
            displayName,
            hostName,
          },
        })
      );
    });

    it('should create a Windows endpoint with all additional fields', async () => {
      // Arrange
      const displayName = 'test-endpoint-02';
      const hostName = 'TEST-PC-02';
      const additionalFields = {
        comment: 'Test endpoint for automation',
        domain: 'contoso.com',
        logicalGroupId: '11111111-1111-1111-1111-111111111111',
        primaryIP: '10.0.0.51',
        primaryMAC: 'AA:BB:CC:DD:EE:FF',
        primarySubnetMask: '255.255.255.0',
        registeredUser: 'john.doe@contoso.com',
        uuid: '00000000-A1A1-B2B2-C3C3-111111DDDDDD',
      };

      const mockCreatedEndpoint = {
        id: '22222222-2222-2222-2222-222222222222',
        displayName,
        hostName,
        ...additionalFields,
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'windows',
          displayName,
          hostName,
          additionalFields,
        },
        {},
        mockCreatedEndpoint
      );

      // Act
      const result = await create.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.comment).toBe(additionalFields.comment);
      expect(result[0].json.primaryMAC).toBe(additionalFields.primaryMAC);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/endpoints/v2.0/WindowsEndpoints',
          body: {
            displayName,
            hostName,
            ...additionalFields,
          },
        })
      );
    });

    it('should handle errors when creating endpoint with duplicate name', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'windows',
          displayName: 'duplicate-endpoint',
          hostName: 'DUPLICATE-PC',
          additionalFields: {},
        },
        {},
        {}
      );

      // Mock httpRequest to throw error
      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 409');
      });

      // Act & Assert
      await expect(create.call(mockContext, 0)).rejects.toThrow('409');
    });

    it('should handle errors when creating endpoint without permissions', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'windows',
          displayName: 'unauthorized-endpoint',
          hostName: 'UNAUTH-PC',
          additionalFields: {},
        },
        {},
        {}
      );

      // Mock httpRequest to throw error
      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 403');
      });

      // Act & Assert
      await expect(create.call(mockContext, 0)).rejects.toThrow('403');
    });

    it('should create a Linux endpoint', async () => {
      // Arrange
      const displayName = 'linux-server-01';
      const hostName = 'LINUX-SRV-01';
      const mockCreatedEndpoint = {
        id: '33333333-3333-3333-3333-333333333333',
        displayName,
        hostName,
        operatingSystem: 'Ubuntu 22.04 LTS',
        primaryIP: '10.0.0.100',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'linux',
          displayName,
          hostName,
          additionalFields: {},
        },
        {},
        mockCreatedEndpoint
      );

      // Act
      const result = await create.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe(displayName);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/endpoints/v2.0/LinuxEndpoints',
          body: {
            displayName,
            hostName,
          },
        })
      );
    });

    it('should create a Mac endpoint', async () => {
      // Arrange
      const displayName = 'macbook-pro-01';
      const mockCreatedEndpoint = {
        id: '44444444-4444-4444-4444-444444444444',
        displayName,
        operatingSystem: 'macOS 14 Sonoma',
        serialNumber: 'C02ABC123456',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'mac',
          displayName,
          additionalFields: {
            serialNumber: 'C02ABC123456',
            owner: 'Corporate',
          },
        },
        {},
        mockCreatedEndpoint
      );

      // Act
      const result = await create.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe(displayName);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/endpoints/v2.0/MacEndpoints',
          body: {
            displayName,
            serialNumber: 'C02ABC123456',
            owner: 'Corporate',
          },
        })
      );
    });

    it('should create an Android endpoint', async () => {
      // Arrange
      const displayName = 'android-phone-01';
      const mockCreatedEndpoint = {
        id: '55555555-5555-5555-5555-555555555555',
        displayName,
        operatingSystem: 'Android 14',
        serialNumber: 'ANDROID123456',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'android',
          displayName,
          additionalFields: {
            serialNumber: 'ANDROID123456',
            owner: 'Corporate',
            registeredUser: 'john.doe@company.com',
          },
        },
        {},
        mockCreatedEndpoint
      );

      // Act
      const result = await create.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe(displayName);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/endpoints/v2.0/AndroidEndpoints',
          body: {
            displayName,
            serialNumber: 'ANDROID123456',
            owner: 'Corporate',
            registeredUser: 'john.doe@company.com',
          },
        })
      );
    });

    it('should create an iOS endpoint', async () => {
      // Arrange
      const displayName = 'iphone-15-pro';
      const mockCreatedEndpoint = {
        id: '66666666-6666-6666-6666-666666666666',
        displayName,
        operatingSystem: 'iOS 17.2',
        serialNumber: 'IOS987654321',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'ios',
          displayName,
          additionalFields: {
            serialNumber: 'IOS987654321',
            owner: 'Personal',
            registeredUser: 'jane.smith@company.com',
          },
        },
        {},
        mockCreatedEndpoint
      );

      // Act
      const result = await create.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe(displayName);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/endpoints/v2.0/IosEndpoints',
          body: {
            displayName,
            serialNumber: 'IOS987654321',
            owner: 'Personal',
            registeredUser: 'jane.smith@company.com',
          },
        })
      );
    });

    it('should create a Network endpoint with required primaryIP', async () => {
      // Arrange
      const displayName = 'switch-core-01';
      const primaryIP = '192.168.1.1';
      const mockCreatedEndpoint = {
        id: '77777777-7777-7777-7777-777777777777',
        displayName,
        primaryIP,
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'network',
          displayName,
          primaryIP,
          additionalFields: {},
        },
        {},
        mockCreatedEndpoint
      );

      // Act
      const result = await create.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe(displayName);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/endpoints/v2.0/NetworkEndpoints',
          body: {
            displayName,
            primaryIP,
          },
        })
      );
    });

    it('should create a Network endpoint with optional fields', async () => {
      // Arrange
      const displayName = 'router-edge-01';
      const primaryIP = '10.0.0.1';
      const mockCreatedEndpoint = {
        id: '88888888-8888-8888-8888-888888888888',
        displayName,
        primaryIP,
        hostName: 'ROUTER-EDGE-01',
        webInterfaceUrl: 'https://192.168.1.1/admin',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'network',
          displayName,
          primaryIP,
          additionalFields: {
            hostName: 'ROUTER-EDGE-01',
            webInterfaceUrl: 'https://192.168.1.1/admin',
            comment: 'Edge router',
          },
        },
        {},
        mockCreatedEndpoint
      );

      // Act
      const result = await create.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/endpoints/v2.0/NetworkEndpoints',
          body: {
            displayName,
            primaryIP,
            hostName: 'ROUTER-EDGE-01',
            webInterfaceUrl: 'https://192.168.1.1/admin',
            comment: 'Edge router',
          },
        })
      );
    });

    it('should reject invalid primaryIP for Network endpoint', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'network',
          displayName: 'switch-01',
          primaryIP: 'not-an-ip',
          additionalFields: {},
        },
        {},
        {}
      );

      // Act & Assert
      await expect(create.call(mockContext, 0)).rejects.toThrow();
    });

    it('should handle unknown endpoint type', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions(
        {
          endpointType: 'unknown',
          displayName: 'test',
          additionalFields: {},
        },
        {},
        {}
      );

      // Act & Assert
      await expect(create.call(mockContext, 0)).rejects.toThrow('Unknown endpoint type: unknown');
    });
  });

  describe('startEnrollment()', () => {
    it('should start enrollment for a Windows endpoint', async () => {
      // Arrange
      const endpointId = '12345678-1234-1234-1234-123456789abc';
      const mockEndpoint = {
        id: endpointId,
        type: 'WindowsEndpoint',
        displayName: 'TEST-PC-01',
      };

      const mockEnrollmentResponse = {
        enrollmentId: 'enrollment-123',
        status: 'Started',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          enrollmentOptions: {
            emailRecipient: 'user@company.com',
            emailLanguageId: 1033,
          },
        },
        {},
        mockEnrollmentResponse
      );

      // Mock two HTTP requests: GET endpoint, then POST enrollment
      let callCount = 0;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        callCount++;
        if (callCount === 1) {
          // First call: GET endpoint
          expect(options.method).toBe('GET');
          return mockEndpoint;
        } else {
          // Second call: POST enrollment
          expect(options.method).toBe('POST');
          expect(options.url).toBe(`/endpoints/v2.0/WindowsEndpoints/${endpointId}/StartEnrollment`);
          return mockEnrollmentResponse;
        }
      });

      // Act
      const result = await startEnrollment.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.success).toBe(true);
      expect(result[0].json.endpointId).toBe(endpointId);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should start enrollment for an Android endpoint', async () => {
      // Arrange
      const endpointId = '55555555-5555-5555-5555-555555555555';
      const mockEndpoint = {
        id: endpointId,
        type: 'AndroidEndpoint',
        displayName: 'Android Phone',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          enrollmentOptions: {},
        },
        {},
        {}
      );

      let callCount = 0;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        callCount++;
        if (callCount === 1) {
          return mockEndpoint;
        } else {
          expect(options.url).toBe(`/endpoints/v2.0/AndroidEndpoints/${endpointId}/StartEnrollment`);
          return {};
        }
      });

      // Act
      const result = await startEnrollment.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result[0].json.success).toBe(true);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should start enrollment for an iOS endpoint with email options', async () => {
      // Arrange
      const endpointId = '66666666-6666-6666-6666-666666666666';
      const mockEndpoint = {
        id: endpointId,
        type: 'IosEndpoint',
        displayName: 'iPhone 15 Pro',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          enrollmentOptions: {
            emailRecipient: 'test@example.com',
            emailLanguageId: 1031,
          },
        },
        {},
        {}
      );

      let enrollmentBody: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'GET') {
          return mockEndpoint;
        } else {
          enrollmentBody = options.body;
          return {};
        }
      });

      // Act
      const result = await startEnrollment.call(mockContext, 0);

      // Assert
      expect(enrollmentBody).toEqual({
        emailRecipient: 'test@example.com',
        emailLanguageId: 1031,
      });
      expect(result[0].json.success).toBe(true);
    });

    it('should handle enrollment for unsupported endpoint type', async () => {
      // Arrange
      const endpointId = '99999999-9999-9999-9999-999999999999';
      const mockEndpoint = {
        id: endpointId,
        type: 'UnknownEndpoint',
        displayName: 'Unknown Device',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          enrollmentOptions: {},
        },
        {},
        mockEndpoint
      );

      mockContext.helpers.httpRequest = vi.fn(async () => mockEndpoint);

      // Act & Assert
      await expect(startEnrollment.call(mockContext, 0)).rejects.toThrow(
        'Enrollment not supported for endpoint type: UnknownEndpoint'
      );
    });
  });

  describe('triggerIntuneInstallation()', () => {
    it('should trigger Intune installation for an endpoint', async () => {
      // Arrange
      const endpointId = '12345678-1234-1234-1234-123456789abc';
      const mockResponse = true; // API returns boolean

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
        },
        {},
        mockResponse
      );

      // Act
      const result = await triggerIntuneInstallation.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.success).toBe(true);
      expect(result[0].json.endpointId).toBe(endpointId);
      expect(result[0].json.action).toBe('triggerIntuneInstallation');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: `/endpoints/v2.0/WindowsEndpoints/${endpointId}/TriggerInstallationViaIntune`,
        })
      );
    });

    it('should handle errors when triggering Intune installation fails', async () => {
      // Arrange
      const endpointId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
        },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 400');
      });

      // Act & Assert
      await expect(triggerIntuneInstallation.call(mockContext, 0)).rejects.toThrow('400');
    });

    it('should use custom endpoint GUID when provided', async () => {
      // Arrange
      const customEndpointId = '11111111-2222-3333-4444-555555555555';
      const mockResponse = true;

      const mockContext = createMockExecuteFunctions(
        {
          endpointId: customEndpointId,
          endpointSelection: '__custom__',
        },
        {},
        mockResponse
      );

      // Act
      const result = await triggerIntuneInstallation.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result[0].json.endpointId).toBe(customEndpointId);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `/endpoints/v2.0/WindowsEndpoints/${customEndpointId}/TriggerInstallationViaIntune`,
        })
      );
    });
  });

  describe('update()', () => {
    it('should update an endpoint with single field', async () => {
      // Arrange
      const endpointId = '12345678-1234-1234-1234-123456789abc';
      const updateFields = {
        displayName: 'updated-endpoint-name',
      };

      const mockUpdatedEndpoint = {
        id: endpointId,
        displayName: 'updated-endpoint-name',
        hostName: 'TEST-PC-01',
        primaryIP: '10.0.0.50',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          updateFields,
        },
        {},
        mockUpdatedEndpoint
      );

      // Mock two calls: PATCH (no response) then GET (updated endpoint)
      let callCount = 0;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        callCount++;
        if (callCount === 1) {
          // PATCH request
          expect(options.method).toBe('PATCH');
          return undefined; // PATCH returns no content
        } else {
          // GET request to fetch updated endpoint
          expect(options.method).toBe('GET');
          return mockUpdatedEndpoint;
        }
      });

      // Act
      const result = await update.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe('updated-endpoint-name');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should update endpoint with multiple fields', async () => {
      // Arrange
      const endpointId = '22222222-2222-2222-2222-222222222222';
      const updateFields = {
        displayName: 'updated-name',
        comment: 'Updated comment',
        primaryIP: '10.0.0.100',
        domain: 'newdomain.com',
      };

      const mockUpdatedEndpoint = {
        id: endpointId,
        ...updateFields,
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          updateFields,
        },
        {},
        mockUpdatedEndpoint
      );

      let patchBody: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchBody = options.body;
          return undefined;
        }
        return mockUpdatedEndpoint;
      });

      // Act
      const result = await update.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(patchBody).toBeDefined();
      expect(patchBody).toHaveLength(4); // 4 fields updated
      expect(patchBody).toEqual(
        expect.arrayContaining([
          { op: 'replace', path: '/displayName', value: 'updated-name' },
          { op: 'replace', path: '/comment', value: 'Updated comment' },
          { op: 'replace', path: '/primaryIP', value: '10.0.0.100' },
          { op: 'replace', path: '/domain', value: 'newdomain.com' },
        ])
      );
    });

    it('should throw error when no fields to update', async () => {
      // Arrange
      const endpointId = '33333333-3333-3333-3333-333333333333';
      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          updateFields: {},
        },
        {},
        {}
      );

      // Act & Assert
      await expect(update.call(mockContext, 0)).rejects.toThrow('No fields to update');
    });

    it('should ignore empty string values in update', async () => {
      // Arrange
      const endpointId = '44444444-4444-4444-4444-444444444444';
      const updateFields = {
        displayName: 'valid-name',
        comment: '', // Empty string should be ignored
        domain: null, // Null should be ignored
      };

      const mockUpdatedEndpoint = {
        id: endpointId,
        displayName: 'valid-name',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          updateFields,
        },
        {},
        mockUpdatedEndpoint
      );

      let patchBody: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchBody = options.body;
          return undefined;
        }
        return mockUpdatedEndpoint;
      });

      // Act
      const result = await update.call(mockContext, 0);

      // Assert
      expect(patchBody).toBeDefined();
      expect(patchBody).toHaveLength(1); // Only displayName should be included
      expect(patchBody[0]).toEqual({
        op: 'replace',
        path: '/displayName',
        value: 'valid-name',
      });
    });

    it('should handle errors when updating non-existent endpoint', async () => {
      // Arrange
      const endpointId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          updateFields: { displayName: 'new-name' },
        },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert
      await expect(update.call(mockContext, 0)).rejects.toThrow('404');
    });

    it('should use JSON Patch format for PATCH request', async () => {
      // Arrange
      const endpointId = '55555555-5555-5555-5555-555555555555';
      const updateFields = {
        displayName: 'test-name',
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointSelection: endpointId,
          updateFields,
        },
        {},
        { id: endpointId, displayName: 'test-name' }
      );

      let patchRequest: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchRequest = options;
          return undefined;
        }
        return { id: endpointId, displayName: 'test-name' };
      });

      // Act
      await update.call(mockContext, 0);

      // Assert
      expect(patchRequest.url).toBe(`/endpoints/v2.0/WindowsEndpoints/${endpointId}`);
      expect(patchRequest.body).toBeInstanceOf(Array);
      expect(patchRequest.body[0]).toHaveProperty('op', 'replace');
      expect(patchRequest.body[0]).toHaveProperty('path', '/displayName');
      expect(patchRequest.body[0]).toHaveProperty('value', 'test-name');
    });
  });

  // ============================================================================
  // LOGICAL GROUP OPERATIONS
  // ============================================================================

  describe('getLogicalGroup()', () => {
    it('should fetch a single logical group by ID', async () => {
      // Arrange
      const groupId = '11111111-1111-1111-1111-111111111111';
      const mockGroup = {
        id: groupId,
        name: 'Test Group',
        description: 'A test logical group',
        comment: 'Created for testing',
      };

      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        mockGroup
      );

      // Act
      const result = await getLogicalGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockGroup);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: `/endpoints/v2.0/LogicalGroups/${groupId}`,
        })
      );
    });

    it('should handle errors when logical group not found', async () => {
      // Arrange
      const groupId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert
      await expect(getLogicalGroup.call(mockContext, 0)).rejects.toThrow('404');
    });
  });

  describe('getLogicalGroups()', () => {
    it('should fetch multiple logical groups with pagination', async () => {
      // Arrange
      const mockResponse = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Group 1',
            description: 'First group',
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            name: 'Group 2',
            description: 'Second group',
          },
          {
            id: '33333333-3333-3333-3333-333333333333',
            name: 'Group 3',
            description: 'Third group',
          },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: {},
        },
        {},
        mockResponse
      );

      // Act
      const result = await getLogicalGroups.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.name).toBe('Group 1');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: '/endpoints/v2.0/LogicalGroups',
          qs: expect.objectContaining({
            PageSize: 50,
            Page: 0,
          }),
        })
      );
    });

    it('should fetch all logical groups when returnAll is true', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'Group 1' },
          { id: '2', name: 'Group 2' },
          { id: '3', name: 'Group 3' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: true,
          limit: 50,
          options: {},
        },
        {},
        mockResponse
      );

      // Act
      const result = await getLogicalGroups.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
    });

    it('should support searchQuery option', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'Test Group' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { searchQuery: 'Test' },
        },
        {},
        mockResponse
      );

      // Act
      await getLogicalGroups.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            SearchQuery: 'Test',
          }),
        })
      );
    });

    it('should support orderBy option', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'A-Group' },
          { id: '2', name: 'B-Group' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { orderBy: 'name asc' },
        },
        {},
        mockResponse
      );

      // Act
      await getLogicalGroups.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            OrderBy: 'name asc',
          }),
        })
      );
    });

    it('should handle empty result', async () => {
      // Arrange
      const mockResponse = {
        data: [],
        hasNextPage: false,
        totalItems: 0,
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50, options: {} },
        {},
        mockResponse
      );

      // Act
      const result = await getLogicalGroups.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });
  });

  describe('createLogicalGroup()', () => {
    it('should create a logical group with name only', async () => {
      // Arrange
      const name = 'New Test Group';
      const mockCreatedGroup = {
        id: '44444444-4444-4444-4444-444444444444',
        name,
      };

      const mockContext = createMockExecuteFunctions(
        {
          name,
          additionalFields: {},
        },
        {},
        mockCreatedGroup
      );

      // Act
      const result = await createLogicalGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.name).toBe(name);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: '/endpoints/v2.0/LogicalGroups',
          body: {
            name,
          },
        })
      );
    });

    it('should create a logical group with all fields', async () => {
      // Arrange
      const name = 'Complete Test Group';
      const additionalFields = {
        description: 'A complete test group',
        comment: 'Created with all fields',
      };

      const mockCreatedGroup = {
        id: '55555555-5555-5555-5555-555555555555',
        name,
        ...additionalFields,
      };

      const mockContext = createMockExecuteFunctions(
        {
          name,
          additionalFields,
        },
        {},
        mockCreatedGroup
      );

      // Act
      const result = await createLogicalGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.description).toBe(additionalFields.description);
      expect(result[0].json.comment).toBe(additionalFields.comment);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/endpoints/v2.0/LogicalGroups',
          body: {
            name,
            ...additionalFields,
          },
        })
      );
    });

    it('should handle errors when creating duplicate group', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions(
        {
          name: 'Duplicate Group',
          additionalFields: {},
        },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 409');
      });

      // Act & Assert
      await expect(createLogicalGroup.call(mockContext, 0)).rejects.toThrow('409');
    });
  });

  describe('updateLogicalGroup()', () => {
    it('should update a logical group with single field', async () => {
      // Arrange
      const groupId = '11111111-1111-1111-1111-111111111111';
      const updateFields = {
        name: 'Updated Group Name',
      };

      const mockUpdatedGroup = {
        id: groupId,
        name: 'Updated Group Name',
        description: 'Original description',
      };

      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields,
        },
        {},
        mockUpdatedGroup
      );

      let callCount = 0;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        callCount++;
        if (callCount === 1) {
          expect(options.method).toBe('PATCH');
          return undefined;
        } else {
          expect(options.method).toBe('GET');
          return mockUpdatedGroup;
        }
      });

      // Act
      const result = await updateLogicalGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.name).toBe('Updated Group Name');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should update logical group with multiple fields', async () => {
      // Arrange
      const groupId = '22222222-2222-2222-2222-222222222222';
      const updateFields = {
        name: 'Updated Name',
        description: 'Updated description',
        comment: 'Updated comment',
      };

      const mockUpdatedGroup = {
        id: groupId,
        ...updateFields,
      };

      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields,
        },
        {},
        mockUpdatedGroup
      );

      let patchBody: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchBody = options.body;
          return undefined;
        }
        return mockUpdatedGroup;
      });

      // Act
      const result = await updateLogicalGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(patchBody).toBeDefined();
      expect(patchBody).toHaveLength(3);
      expect(patchBody).toEqual(
        expect.arrayContaining([
          { op: 'replace', path: '/name', value: 'Updated Name' },
          { op: 'replace', path: '/description', value: 'Updated description' },
          { op: 'replace', path: '/comment', value: 'Updated comment' },
        ])
      );
    });

    it('should throw error when no fields to update', async () => {
      // Arrange
      const groupId = '33333333-3333-3333-3333-333333333333';
      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields: {},
        },
        {},
        {}
      );

      // Act & Assert
      await expect(updateLogicalGroup.call(mockContext, 0)).rejects.toThrow('No fields to update');
    });

    it('should ignore empty string values in update', async () => {
      // Arrange
      const groupId = '44444444-4444-4444-4444-444444444444';
      const updateFields = {
        name: 'Valid Name',
        description: '',
        comment: null,
      };

      const mockUpdatedGroup = {
        id: groupId,
        name: 'Valid Name',
      };

      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields,
        },
        {},
        mockUpdatedGroup
      );

      let patchBody: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchBody = options.body;
          return undefined;
        }
        return mockUpdatedGroup;
      });

      // Act
      const result = await updateLogicalGroup.call(mockContext, 0);

      // Assert
      expect(patchBody).toBeDefined();
      expect(patchBody).toHaveLength(1);
      expect(patchBody[0]).toEqual({
        op: 'replace',
        path: '/name',
        value: 'Valid Name',
      });
    });

    it('should handle errors when updating non-existent group', async () => {
      // Arrange
      const groupId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields: { name: 'New Name' },
        },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert
      await expect(updateLogicalGroup.call(mockContext, 0)).rejects.toThrow('404');
    });

    it('should use JSON Patch format for PATCH request', async () => {
      // Arrange
      const groupId = '55555555-5555-5555-5555-555555555555';
      const updateFields = {
        name: 'Test Name',
      };

      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields,
        },
        {},
        { id: groupId, name: 'Test Name' }
      );

      let patchRequest: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchRequest = options;
          return undefined;
        }
        return { id: groupId, name: 'Test Name' };
      });

      // Act
      await updateLogicalGroup.call(mockContext, 0);

      // Assert
      expect(patchRequest.url).toBe(`/endpoints/v2.0/LogicalGroups/${groupId}`);
      expect(patchRequest.body).toBeInstanceOf(Array);
      expect(patchRequest.body[0]).toHaveProperty('op', 'replace');
      expect(patchRequest.body[0]).toHaveProperty('path', '/name');
      expect(patchRequest.body[0]).toHaveProperty('value', 'Test Name');
    });
  });

  describe('deleteLogicalGroup()', () => {
    it('should delete a logical group by ID', async () => {
      // Arrange
      const groupId = '11111111-1111-1111-1111-111111111111';
      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        {}
      );

      // Act
      const result = await deleteLogicalGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        success: true,
        deletedId: groupId,
      });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: `/endpoints/v2.0/LogicalGroups/${groupId}`,
        })
      );
    });

    it('should handle errors when deleting non-existent group', async () => {
      // Arrange
      const groupId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert
      await expect(deleteLogicalGroup.call(mockContext, 0)).rejects.toThrow('404');
    });
  });

  // ============================================================================
  // STATIC GROUP OPERATIONS
  // ============================================================================

  describe('getStaticGroup()', () => {
    it('should fetch a single static group by ID', async () => {
      // Arrange
      const groupId = '11111111-1111-1111-1111-111111111111';
      const mockGroup = {
        id: groupId,
        name: 'Test Static Group',
        description: 'A test static group',
        comment: 'Created for testing',
      };

      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        mockGroup
      );

      // Act
      const result = await getStaticGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockGroup);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: `/endpoints/v2.0/StaticGroups/${groupId}`,
        })
      );
    });

    it('should handle errors when static group not found', async () => {
      // Arrange
      const groupId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert
      await expect(getStaticGroup.call(mockContext, 0)).rejects.toThrow('404');
    });
  });

  describe('getStaticGroups()', () => {
    it('should fetch multiple static groups with pagination', async () => {
      // Arrange
      const mockResponse = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Static Group 1',
            description: 'First static group',
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            name: 'Static Group 2',
            description: 'Second static group',
          },
          {
            id: '33333333-3333-3333-3333-333333333333',
            name: 'Static Group 3',
            description: 'Third static group',
          },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: {},
        },
        {},
        mockResponse
      );

      // Act
      const result = await getStaticGroups.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.name).toBe('Static Group 1');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: '/endpoints/v2.0/StaticGroups',
          qs: expect.objectContaining({
            PageSize: 50,
            Page: 0,
          }),
        })
      );
    });

    it('should fetch all static groups when returnAll is true', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'Static Group 1' },
          { id: '2', name: 'Static Group 2' },
          { id: '3', name: 'Static Group 3' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: true,
          limit: 50,
          options: {},
        },
        {},
        mockResponse
      );

      // Act
      const result = await getStaticGroups.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
    });

    it('should support searchQuery option', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'Test Static Group' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { searchQuery: 'Test' },
        },
        {},
        mockResponse
      );

      // Act
      await getStaticGroups.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            SearchQuery: 'Test',
          }),
        })
      );
    });

    it('should support orderBy option', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'A-Group' },
          { id: '2', name: 'B-Group' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { orderBy: 'name asc' },
        },
        {},
        mockResponse
      );

      // Act
      await getStaticGroups.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            OrderBy: 'name asc',
          }),
        })
      );
    });

    it('should handle empty result', async () => {
      // Arrange
      const mockResponse = {
        data: [],
        hasNextPage: false,
        totalItems: 0,
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50, options: {} },
        {},
        mockResponse
      );

      // Act
      const result = await getStaticGroups.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });
  });

  describe('createStaticGroup()', () => {
    it('should create a static group with name only', async () => {
      // Arrange
      const name = 'New Test Static Group';
      const mockCreatedGroup = {
        id: '44444444-4444-4444-4444-444444444444',
        name,
      };

      const mockContext = createMockExecuteFunctions(
        {
          name,
          additionalFields: {},
        },
        {},
        mockCreatedGroup
      );

      // Act
      const result = await createStaticGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.name).toBe(name);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: '/endpoints/v2.0/StaticGroups',
          body: {
            name,
          },
        })
      );
    });

    it('should create a static group with all fields', async () => {
      // Arrange
      const name = 'Complete Test Static Group';
      const additionalFields = {
        description: 'A complete test static group',
        comment: 'Created with all fields',
      };

      const mockCreatedGroup = {
        id: '55555555-5555-5555-5555-555555555555',
        name,
        ...additionalFields,
      };

      const mockContext = createMockExecuteFunctions(
        {
          name,
          additionalFields,
        },
        {},
        mockCreatedGroup
      );

      // Act
      const result = await createStaticGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.description).toBe(additionalFields.description);
      expect(result[0].json.comment).toBe(additionalFields.comment);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/endpoints/v2.0/StaticGroups',
          body: {
            name,
            ...additionalFields,
          },
        })
      );
    });

    it('should handle errors when creating duplicate static group', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions(
        {
          name: 'Duplicate Static Group',
          additionalFields: {},
        },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 409');
      });

      // Act & Assert
      await expect(createStaticGroup.call(mockContext, 0)).rejects.toThrow('409');
    });
  });

  describe('updateStaticGroup()', () => {
    it('should update a static group with single field', async () => {
      // Arrange
      const groupId = '11111111-1111-1111-1111-111111111111';
      const updateFields = {
        name: 'Updated Static Group Name',
      };

      const mockUpdatedGroup = {
        id: groupId,
        name: 'Updated Static Group Name',
        description: 'Original description',
      };

      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields,
        },
        {},
        mockUpdatedGroup
      );

      let callCount = 0;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        callCount++;
        if (callCount === 1) {
          expect(options.method).toBe('PATCH');
          return undefined;
        } else {
          expect(options.method).toBe('GET');
          return mockUpdatedGroup;
        }
      });

      // Act
      const result = await updateStaticGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.name).toBe('Updated Static Group Name');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should update static group with multiple fields', async () => {
      // Arrange
      const groupId = '22222222-2222-2222-2222-222222222222';
      const updateFields = {
        name: 'Updated Static Name',
        description: 'Updated static description',
        comment: 'Updated static comment',
      };

      const mockUpdatedGroup = {
        id: groupId,
        ...updateFields,
      };

      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields,
        },
        {},
        mockUpdatedGroup
      );

      let patchBody: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchBody = options.body;
          return undefined;
        }
        return mockUpdatedGroup;
      });

      // Act
      const result = await updateStaticGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(patchBody).toBeDefined();
      expect(patchBody).toHaveLength(3);
      expect(patchBody).toEqual(
        expect.arrayContaining([
          { op: 'replace', path: '/name', value: 'Updated Static Name' },
          { op: 'replace', path: '/description', value: 'Updated static description' },
          { op: 'replace', path: '/comment', value: 'Updated static comment' },
        ])
      );
    });

    it('should throw error when no fields to update', async () => {
      // Arrange
      const groupId = '33333333-3333-3333-3333-333333333333';
      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields: {},
        },
        {},
        {}
      );

      // Act & Assert
      await expect(updateStaticGroup.call(mockContext, 0)).rejects.toThrow('No fields to update');
    });

    it('should ignore empty string values in update', async () => {
      // Arrange
      const groupId = '44444444-4444-4444-4444-444444444444';
      const updateFields = {
        name: 'Valid Static Name',
        description: '',
        comment: null,
      };

      const mockUpdatedGroup = {
        id: groupId,
        name: 'Valid Static Name',
      };

      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields,
        },
        {},
        mockUpdatedGroup
      );

      let patchBody: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchBody = options.body;
          return undefined;
        }
        return mockUpdatedGroup;
      });

      // Act
      const result = await updateStaticGroup.call(mockContext, 0);

      // Assert
      expect(patchBody).toBeDefined();
      expect(patchBody).toHaveLength(1);
      expect(patchBody[0]).toEqual({
        op: 'replace',
        path: '/name',
        value: 'Valid Static Name',
      });
    });

    it('should use JSON Patch format for PATCH request', async () => {
      // Arrange
      const groupId = '55555555-5555-5555-5555-555555555555';
      const updateFields = {
        name: 'Test Static Name',
      };

      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          updateFields,
        },
        {},
        { id: groupId, name: 'Test Static Name' }
      );

      let patchRequest: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchRequest = options;
          return undefined;
        }
        return { id: groupId, name: 'Test Static Name' };
      });

      // Act
      await updateStaticGroup.call(mockContext, 0);

      // Assert
      expect(patchRequest.url).toBe(`/endpoints/v2.0/StaticGroups/${groupId}`);
      expect(patchRequest.body).toBeInstanceOf(Array);
      expect(patchRequest.body[0]).toHaveProperty('op', 'replace');
      expect(patchRequest.body[0]).toHaveProperty('path', '/name');
      expect(patchRequest.body[0]).toHaveProperty('value', 'Test Static Name');
    });
  });

  describe('deleteStaticGroup()', () => {
    it('should delete a static group by ID', async () => {
      // Arrange
      const groupId = '11111111-1111-1111-1111-111111111111';
      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        {}
      );

      // Act
      const result = await deleteStaticGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        success: true,
        deletedId: groupId,
      });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: `/endpoints/v2.0/StaticGroups/${groupId}`,
        })
      );
    });

    it('should handle errors when deleting non-existent static group', async () => {
      // Arrange
      const groupId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert
      await expect(deleteStaticGroup.call(mockContext, 0)).rejects.toThrow('404');
    });
  });

  // ============================================================================
  // DYNAMIC GROUP OPERATIONS (READ-ONLY)
  // ============================================================================

  describe('getDynamicGroup()', () => {
    it('should fetch a single dynamic group by ID', async () => {
      // Arrange
      const groupId = '11111111-1111-1111-1111-111111111111';
      const mockGroup = {
        id: groupId,
        name: 'Test Dynamic Group',
        description: 'A test dynamic group',
        query: 'OperatingSystem LIKE "%Windows%"',
      };

      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        mockGroup
      );

      // Act
      const result = await getDynamicGroup.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockGroup);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: `/endpoints/v2.0/DynamicGroups/${groupId}`,
        })
      );
    });

    it('should handle errors when dynamic group not found', async () => {
      // Arrange
      const groupId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions(
        { groupId },
        {},
        {}
      );

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert
      await expect(getDynamicGroup.call(mockContext, 0)).rejects.toThrow('404');
    });
  });

  describe('getDynamicGroups()', () => {
    it('should fetch multiple dynamic groups with pagination', async () => {
      // Arrange
      const mockResponse = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            name: 'Windows Computers',
            query: 'OperatingSystem LIKE "%Windows%"',
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            name: 'MacOS Computers',
            query: 'OperatingSystem LIKE "%macOS%"',
          },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: {},
        },
        {},
        mockResponse
      );

      // Act
      const result = await getDynamicGroups.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result[0].json.name).toBe('Windows Computers');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: '/endpoints/v2.0/DynamicGroups',
          qs: expect.objectContaining({
            PageSize: 50,
            Page: 0,
          }),
        })
      );
    });

    it('should fetch all dynamic groups when returnAll is true', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'Dynamic Group 1' },
          { id: '2', name: 'Dynamic Group 2' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: true,
          limit: 50,
          options: {},
        },
        {},
        mockResponse
      );

      // Act
      const result = await getDynamicGroups.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
    });

    it('should support searchQuery option', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'Test Dynamic Group' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { searchQuery: 'Test' },
        },
        {},
        mockResponse
      );

      // Act
      await getDynamicGroups.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            SearchQuery: 'Test',
          }),
        })
      );
    });

    it('should support orderBy option', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: '1', name: 'A-Group' },
          { id: '2', name: 'B-Group' },
        ],
        hasNextPage: false,
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { orderBy: 'name asc' },
        },
        {},
        mockResponse
      );

      // Act
      await getDynamicGroups.call(mockContext, 0);

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            OrderBy: 'name asc',
          }),
        })
      );
    });

    it('should handle empty result', async () => {
      // Arrange
      const mockResponse = {
        data: [],
        hasNextPage: false,
        totalItems: 0,
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50, options: {} },
        {},
        mockResponse
      );

      // Act
      const result = await getDynamicGroups.call(mockContext, 0);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });
  });
});

// ============================================================================
// Phase 4: New Endpoint Operations
// ============================================================================

const pageResponse = (data: any[]) => ({ data, currentPage: 0, pageSize: 50, totalCount: data.length });

describe('Endpoint Phase 4 - EntraId Operations', () => {
  describe('setEntraIdData()', () => {
    it('should return array of length 1 on success', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          endpointSelection: '__custom__',
          endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          entraIdDeviceId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          additionalFields: {},
        },
        {},
        {},
      );
      const result = await setEntraIdData.call(mockContext, 0);
      expect(result).toHaveLength(1);
    });
  });

  describe('deleteEntraIdData()', () => {
    it('should return success true', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          endpointSelection: '__custom__',
          endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        },
        {},
        {},
      );
      const result = await deleteEntraIdData.call(mockContext, 0);
      expect(result[0].json.success).toBe(true);
    });
  });

  describe('getEntraIdDataByDeviceId()', () => {
    it('should return device data with matching id', async () => {
      const deviceId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      const mockContext = createMockExecuteFunctions(
        { deviceId },
        {},
        { id: deviceId, displayName: 'TestDevice' },
      );
      const result = await getEntraIdDataByDeviceId.call(mockContext, 0);
      expect(result[0].json.id).toBe(deviceId);
    });
  });
});

describe('Endpoint Phase 4 - UnmanagedEndpoints Operations', () => {
  describe('getUnmanagedEndpoints()', () => {
    it('should return paginated results when returnAll is false', async () => {
      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 5 },
        {},
        pageResponse([{ id: 'u1' }, { id: 'u2' }]),
      );
      const result = await getUnmanagedEndpoints.call(mockContext, 0);
      expect(result).toHaveLength(2);
    });

    it('should return all results when returnAll is true', async () => {
      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        pageResponse([{ id: 'u1' }, { id: 'u2' }, { id: 'u3' }]),
      );
      const result = await getUnmanagedEndpoints.call(mockContext, 0);
      expect(result).toHaveLength(3);
    });
  });

  describe('getUnmanagedEndpoint()', () => {
    it('should return the unmanaged endpoint by id', async () => {
      const unmanagedEndpointId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      const mockContext = createMockExecuteFunctions(
        { unmanagedEndpointId },
        {},
        { id: unmanagedEndpointId },
      );
      const result = await getUnmanagedEndpoint.call(mockContext, 0);
      expect(result[0].json.id).toBe(unmanagedEndpointId);
    });
  });

  describe('deleteUnmanagedEndpoint()', () => {
    it('should return success true', async () => {
      const unmanagedEndpointId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      const mockContext = createMockExecuteFunctions(
        { unmanagedEndpointId },
        {},
        {},
      );
      const result = await deleteUnmanagedEndpoint.call(mockContext, 0);
      expect(result[0].json.success).toBe(true);
    });
  });
});

describe('Endpoint Phase 4 - MaintenanceWindow PUT Operations', () => {
  describe('putEndpointMaintenanceWindow()', () => {
    it('should call httpRequest with method PUT', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          endpointSelection: '__custom__',
          endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          windowId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          maintenanceWindowJson: '{"maintenanceWindowDefinitionType":"daily","intervals":[]}',
        },
        {},
        { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
      );
      await putEndpointMaintenanceWindow.call(mockContext, 0);
      const httpRequest = mockContext.helpers.httpRequest as ReturnType<typeof vi.fn>;
      expect(httpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'PUT' }));
    });
  });

  describe('putGroupMaintenanceWindow()', () => {
    it('should call httpRequest with method PUT', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          groupId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          groupType: 'logical',
          windowId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          maintenanceWindowJson: '{"maintenanceWindowDefinitionType":"daily","intervals":[]}',
        },
        {},
        { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
      );
      await putGroupMaintenanceWindow.call(mockContext, 0);
      const httpRequest = mockContext.helpers.httpRequest as ReturnType<typeof vi.fn>;
      expect(httpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'PUT' }));
    });
  });
});

describe('Endpoint Phase 6 - MaintenanceWindow PATCH Operations (26R1)', () => {
  describe('updateEndpointMaintenanceWindow()', () => {
    it('should call PATCH with JSON Patch operations', async () => {
      const endpointId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      const windowId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
      const mockContext = createMockExecuteFunctions(
        {
          endpointSelection: '__custom__',
          endpointId,
          windowId,
          updateFields: { enabled: true },
        },
        {},
        { id: windowId, enabled: true },
      );
      await updateEndpointMaintenanceWindow.call(mockContext, 0);
      const httpRequest = mockContext.helpers.httpRequest as ReturnType<typeof vi.fn>;
      expect(httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: `/endpoints/v2.0/WindowsEndpoints/${endpointId}/MaintenanceWindows/${windowId}`,
          body: [{ op: 'replace', path: '/enabled', value: true }],
        }),
      );
    });

    it('should throw when no fields to update', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          endpointSelection: '__custom__',
          endpointId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          windowId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          updateFields: {},
        },
        {},
        {},
      );
      await expect(updateEndpointMaintenanceWindow.call(mockContext, 0)).rejects.toThrow(
        'No fields to update specified',
      );
    });
  });

  describe('updateGroupMaintenanceWindow()', () => {
    it('should call PATCH with correct group type path for logical group', async () => {
      const groupId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      const windowId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          groupType: 'logical',
          windowId,
          updateFields: { enabled: false },
        },
        {},
        { id: windowId, enabled: false },
      );
      await updateGroupMaintenanceWindow.call(mockContext, 0);
      const httpRequest = mockContext.helpers.httpRequest as ReturnType<typeof vi.fn>;
      expect(httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: `/endpoints/v2.0/LogicalGroups/${groupId}/MaintenanceWindows/${windowId}`,
          body: [{ op: 'replace', path: '/enabled', value: false }],
        }),
      );
    });

    it('should use StaticGroups path when groupType is static', async () => {
      const groupId = 'c3d4e5f6-a7b8-9012-cdef-123456789012';
      const windowId = 'd4e5f6a7-b8c9-0123-defa-234567890123';
      const mockContext = createMockExecuteFunctions(
        {
          groupId,
          groupType: 'static',
          windowId,
          updateFields: { enabled: true },
        },
        {},
        { id: windowId },
      );
      await updateGroupMaintenanceWindow.call(mockContext, 0);
      const httpRequest = mockContext.helpers.httpRequest as ReturnType<typeof vi.fn>;
      expect(httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: `/endpoints/v2.0/StaticGroups/${groupId}/MaintenanceWindows/${windowId}`,
        }),
      );
    });

    it('should throw when no fields to update', async () => {
      const mockContext = createMockExecuteFunctions(
        {
          groupId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          groupType: 'logical',
          windowId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          updateFields: {},
        },
        {},
        {},
      );
      await expect(updateGroupMaintenanceWindow.call(mockContext, 0)).rejects.toThrow(
        'No fields to update specified',
      );
    });
  });
});

describe('Endpoint Phase 8C - Group Navigation Operations', () => {
  const pageResponse = (items: any[]) => ({
    currentPage: 0, pageSize: 50, totalPages: 1, totalItems: items.length,
    hasPreviousPage: false, hasNextPage: false, data: items,
  });

  describe('getEndpointMaintenanceWindow()', () => {
    it('should fetch the maintenance window for an endpoint', async () => {
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockMW = { id: 'mw-1', startTime: '08:00', endTime: '10:00' };
      const ctx = createMockExecuteFunctions({ endpointId }, {}, mockMW);

      const result = await getEndpointMaintenanceWindow.call(ctx, 0);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockMW);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/endpoints/v2.0/Endpoints/${endpointId}/MaintenanceWindow`) }),
      );
    });
  });

  describe('getGroupMaintenanceWindow()', () => {
    it('should fetch the maintenance window for a logical group', async () => {
      const logicalGroupId = '22222222-2222-2222-2222-222222222222';
      const mockMW = { id: 'mw-2', startTime: '09:00', endTime: '11:00' };
      const ctx = createMockExecuteFunctions({ logicalGroupId }, {}, mockMW);

      const result = await getGroupMaintenanceWindow.call(ctx, 0);

      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/endpoints/v2.0/LogicalGroups/${logicalGroupId}/MaintenanceWindow`) }),
      );
    });
  });

  describe('getLogicalGroupSubGroups()', () => {
    it('should fetch sub-groups of a logical group', async () => {
      const logicalGroupId = '22222222-2222-2222-2222-222222222222';
      const ctx = createMockExecuteFunctions(
        { logicalGroupId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'sg-1', name: 'Sub Group A' }]),
      );

      const result = await getLogicalGroupSubGroups.call(ctx, 0);

      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/endpoints/v2.0/LogicalGroups/${logicalGroupId}/LogicalGroups`) }),
      );
    });
  });

  describe('getEndpointsByLogicalGroup()', () => {
    it('should fetch endpoints in a logical group', async () => {
      const logicalGroupId = '22222222-2222-2222-2222-222222222222';
      const ctx = createMockExecuteFunctions(
        { logicalGroupId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ep-1', displayName: 'PC-001' }, { id: 'ep-2', displayName: 'PC-002' }]),
      );

      const result = await getEndpointsByLogicalGroup.call(ctx, 0);

      expect(result).toHaveLength(2);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/endpoints/v2.0/LogicalGroups/${logicalGroupId}/Endpoints`) }),
      );
    });
  });

  describe('getEndpointsByStaticGroup()', () => {
    it('should fetch endpoints in a static group', async () => {
      const staticGroupId = '50505050-5050-5050-5050-505050505050';
      const ctx = createMockExecuteFunctions(
        { staticGroupId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ep-3', displayName: 'Server-001' }]),
      );

      const result = await getEndpointsByStaticGroup.call(ctx, 0);

      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/endpoints/v2.0/StaticGroups/${staticGroupId}/Endpoints`) }),
      );
    });
  });

  describe('getEndpointsByDynamicGroup()', () => {
    it('should fetch endpoints in a dynamic group', async () => {
      const dynamicGroupId = '60606060-6060-6060-6060-606060606060';
      const ctx = createMockExecuteFunctions(
        { dynamicGroupId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ep-4', displayName: 'Laptop-001' }]),
      );

      const result = await getEndpointsByDynamicGroup.call(ctx, 0);

      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/endpoints/v2.0/DynamicGroups/${dynamicGroupId}/Endpoints`) }),
      );
    });
  });

  describe('getEndpointsByUDG()', () => {
    it('should fetch endpoints in a Universal Dynamic Group (26R1+)', async () => {
      const udgId = '70707070-7070-7070-7070-707070707070';
      const ctx = createMockExecuteFunctions(
        { udgId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ep-5', displayName: 'Mobile-001' }]),
      );

      const result = await getEndpointsByUDG.call(ctx, 0);

      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/endpoints/v2.0/UniversalDynamicGroups/${udgId}/Endpoints`) }),
      );
    });
  });

  describe('getEndpointsByADUser()', () => {
    it('should fetch endpoints assigned to an AD user', async () => {
      const adUserId = '55555555-5555-5555-5555-555555555555';
      const ctx = createMockExecuteFunctions(
        { adUserId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ep-6', displayName: 'PC-John' }, { id: 'ep-7', displayName: 'Laptop-John' }]),
      );

      const result = await getEndpointsByADUser.call(ctx, 0);

      expect(result).toHaveLength(2);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/endpoints/v2.0/ADUsers/${adUserId}/Endpoints`) }),
      );
    });
  });

  // ============================================================================
  // Phase 14 — endpointType merged into get/getMany/update/delete/startEnrollment
  // ============================================================================

  describe('getMany() with endpointType', () => {
    it('should fetch Android endpoints when endpointType=android', async () => {
      const ctx = createMockExecuteFunctions(
        { endpointType: 'android', returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'and-1', displayName: 'Phone-01' }]),
      );
      const result = await getMany.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/endpoints/v2.0/AndroidEndpoints' }),
      );
    });

    it('should fetch Network endpoints when endpointType=network', async () => {
      const ctx = createMockExecuteFunctions(
        { endpointType: 'network', returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'net-1', displayName: 'Switch-01' }]),
      );
      const result = await getMany.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/endpoints/v2.0/NetworkEndpoints' }),
      );
    });

    it('should use generic /Endpoints path when endpointType=all', async () => {
      const ctx = createMockExecuteFunctions(
        { endpointType: 'all', returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ep-1' }]),
      );
      await getMany.call(ctx, 0);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/endpoints/v2.0/Endpoints' }),
      );
    });
  });

  describe('get() with endpointType', () => {
    it('should fetch a single iOS endpoint by ID when endpointType=ios', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { endpointSelection: endpointId, endpointType: 'ios' },
        {},
        { id: endpointId, displayName: 'iPhone-01' },
      );
      const result = await get.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: `/endpoints/v2.0/IosEndpoints/${endpointId}` }),
      );
    });

    it('should use generic path when endpointType=all', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { endpointSelection: endpointId, endpointType: 'all' },
        {},
        { id: endpointId },
      );
      await get.call(ctx, 0);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: `/endpoints/v2.0/Endpoints/${endpointId}` }),
      );
    });
  });

  describe('update() with endpointType', () => {
    it('should PATCH a Linux endpoint at type-specific path', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { endpointSelection: endpointId, endpointType: 'linux', updateFields: { displayName: 'linux-01' } },
        {},
        { id: endpointId, displayName: 'linux-01' },
      );
      const result = await update.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'PATCH', url: `/endpoints/v2.0/LinuxEndpoints/${endpointId}` }),
      );
    });

    it('should PATCH a Mac endpoint at type-specific path', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { endpointSelection: endpointId, endpointType: 'mac', updateFields: { displayName: 'mac-01' } },
        {},
        { id: endpointId, displayName: 'mac-01' },
      );
      const result = await update.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'PATCH', url: `/endpoints/v2.0/MacEndpoints/${endpointId}` }),
      );
    });
  });

  describe('deleteEndpoint() with endpointType', () => {
    it('should DELETE a Mac endpoint at type-specific path', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { endpointSelection: endpointId, endpointType: 'mac' },
        {},
        {},
      );
      const result = await deleteEndpoint.call(ctx, 0);
      expect(result[0].json).toMatchObject({ success: true, deletedId: endpointId });
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'DELETE', url: `/endpoints/v2.0/MacEndpoints/${endpointId}` }),
      );
    });
  });

  describe('startEnrollment() with explicit endpointType', () => {
    it('should POST enrollment for an Android endpoint using explicit type', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { endpointSelection: endpointId, endpointType: 'android', enrollmentOptions: {} },
        {},
        {},
      );
      const result = await startEnrollment.call(ctx, 0);
      expect(result[0].json).toMatchObject({ success: true, endpointId });
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: `/endpoints/v2.0/AndroidEndpoints/${endpointId}/StartEnrollment` }),
      );
    });

    it('should throw for Network endpoints which do not support enrollment', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { endpointSelection: endpointId, endpointType: 'network', enrollmentOptions: {} },
        {},
        {},
      );
      await expect(startEnrollment.call(ctx, 0)).rejects.toThrow('Enrollment not supported');
    });
  });

  describe('getEndpointsByGroup()', () => {
    it('should fetch iOS endpoints in a logical group when endpointType=ios', async () => {
      const groupId = '11111111-1111-1111-1111-111111111111';
      const ctx = createMockExecuteFunctions(
        { endpointType: 'ios', groupType: 'logical', typedGroupId: groupId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ios-1', displayName: 'iPhone-01' }]),
      );
      const result = await getEndpointsByGroup.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: `/endpoints/v2.0/LogicalGroups/${groupId}/IosEndpoints` }),
      );
    });

    it('should fetch Android endpoints by AD user when endpointType=android', async () => {
      const groupId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const ctx = createMockExecuteFunctions(
        { endpointType: 'android', groupType: 'adUser', typedGroupId: groupId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'and-2', displayName: 'Phone-02' }]),
      );
      const result = await getEndpointsByGroup.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: `/endpoints/v2.0/ADUsers/${groupId}/AndroidEndpoints` }),
      );
    });

    it('should use generic /Endpoints path when endpointType=all', async () => {
      const groupId = '11111111-1111-1111-1111-111111111111';
      const ctx = createMockExecuteFunctions(
        { endpointType: 'all', groupType: 'logical', typedGroupId: groupId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ep-1' }]),
      );
      await getEndpointsByGroup.call(ctx, 0);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: `/endpoints/v2.0/LogicalGroups/${groupId}/Endpoints` }),
      );
    });
  });

  // Industrial endpoint operations (25R2 only — now in endpoint resource)
  describe('getIndustrialEndpoints()', () => {
    it('should fetch industrial endpoints', async () => {
      const ctx = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ind-1', displayName: 'PLC-01' }]),
      );
      const result = await getIndustrialEndpoints.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/endpoints/v2.0/IndustrialEndpoints' }),
      );
    });
  });

  describe('getIndustrialEndpoint()', () => {
    it('should fetch a single industrial endpoint by ID', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { industrialEndpointId: endpointId },
        {},
        { id: endpointId, displayName: 'PLC-01' },
      );
      const result = await getIndustrialEndpoint.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: `/endpoints/v2.0/IndustrialEndpoints/${endpointId}` }),
      );
    });
  });

  describe('createIndustrialEndpoint()', () => {
    it('should POST to create an industrial endpoint', async () => {
      const ctx = createMockExecuteFunctions(
        { displayName: 'PLC-New', additionalFields: { primaryIP: '10.0.0.1' } },
        {},
        { id: 'ind-new', displayName: 'PLC-New' },
      );
      const result = await createIndustrialEndpoint.call(ctx, 0);
      expect(result[0].json).toMatchObject({ id: 'ind-new' });
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'POST', url: '/endpoints/v2.0/IndustrialEndpoints' }),
      );
    });
  });

  describe('updateIndustrialEndpoint()', () => {
    it('should PATCH an industrial endpoint', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { industrialEndpointId: endpointId, updateFields: { displayName: 'PLC-Updated' } },
        {},
        { id: endpointId, displayName: 'PLC-Updated' },
      );
      const result = await updateIndustrialEndpoint.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'PATCH', url: `/endpoints/v2.0/IndustrialEndpoints/${endpointId}` }),
      );
    });
  });

  describe('deleteIndustrialEndpoint()', () => {
    it('should DELETE an industrial endpoint', async () => {
      const endpointId = '98cdf559-1733-42b4-ae1f-42eabf7f9281';
      const ctx = createMockExecuteFunctions(
        { industrialEndpointId: endpointId },
        {},
        {},
      );
      const result = await deleteIndustrialEndpoint.call(ctx, 0);
      expect(result[0].json).toMatchObject({ success: true, deletedId: endpointId });
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'DELETE', url: `/endpoints/v2.0/IndustrialEndpoints/${endpointId}` }),
      );
    });
  });

  describe('getIndustrialEndpointsByGroup()', () => {
    it('should fetch industrial endpoints in a static group', async () => {
      const groupId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
      const ctx = createMockExecuteFunctions(
        { industrialGroupType: 'static', industrialGroupId: groupId, returnAll: false, limit: 50 },
        {},
        pageResponse([{ id: 'ind-2', displayName: 'PLC-02' }]),
      );
      const result = await getIndustrialEndpointsByGroup.call(ctx, 0);
      expect(result).toHaveLength(1);
      expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: `/endpoints/v2.0/StaticGroups/${groupId}/IndustrialEndpoints` }),
      );
    });
  });
});
