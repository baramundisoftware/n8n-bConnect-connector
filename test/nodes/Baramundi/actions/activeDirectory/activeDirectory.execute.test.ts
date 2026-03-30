import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getADGroups, getADGroup, getADGroupsByOrgUnit, getADUsersByGroup, getADUsers, getADUser, getADObjects, getADObject, getOrgUnits, getOrgUnit } from '../../../../../nodes/Baramundi/actions/activeDirectory/activeDirectory.execute';

// Mock helper function to create IExecuteFunctions
function createMockExecuteFunctions(
  params: Record<string, any> = {},
  credentials: Record<string, any> = {},
  mockResponse: any = {},
  mockResponses: any[] = [],
): IExecuteFunctions {
  let callIndex = 0;

  const httpRequest = vi.fn(async () => {
    if (mockResponses.length > 0) {
      const response = mockResponses[callIndex] || mockResponse;
      callIndex++;
      return response;
    }
    return mockResponse;
  });

  return {
    getNodeParameter: vi.fn((name: string, index: number, defaultValue?: any) => {
      return params[name] !== undefined ? params[name] : defaultValue;
    }),
    getCredentials: vi.fn(async () => ({
      baseUrl: 'https://bms-win22srv:444/bconnect',
      username: 'Administrator',
      password: 'baramundi-2008',
      ignoreSslIssues: true,
      ...credentials,
    })),
    helpers: {
      httpRequest,
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

describe('Active Directory Operations', () => {
  // ============================================================================
  // AD GROUPS OPERATIONS
  // ============================================================================

  describe('getADGroups()', () => {
    it('should fetch all AD groups with pagination', async () => {
      const mockADGroups = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'group-1', name: 'IT-Department', description: 'IT staff' },
          { id: 'group-2', name: 'HR-Department', description: 'HR staff' },
          { id: 'group-3', name: 'Managers', description: 'Management team' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockADGroups
      );

      const result = await getADGroups.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.name).toBe('IT-Department');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/activedirectory/v2.0/ADGroups'),
        })
      );
    });

    it('should fetch all AD groups when returnAll is true', async () => {
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'group-1', name: 'Group 1' },
          { id: 'group-2', name: 'Group 2' },
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
          { id: 'group-3', name: 'Group 3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getADGroups.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should support SearchQuery option', async () => {
      const mockADGroups = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'group-1', name: 'IT-Department' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { searchQuery: 'IT' },
        },
        {},
        mockADGroups
      );

      await getADGroups.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            SearchQuery: 'IT',
          }),
        })
      );
    });
  });

  describe('getADGroup()', () => {
    it('should fetch a single AD group by ID', async () => {
      const adGroupId = 'group-123';
      const mockADGroup = {
        id: adGroupId,
        name: 'IT-Department',
        description: 'Information Technology Department',
        distinguishedName: 'CN=IT-Department,OU=Groups,DC=example,DC=com',
        memberCount: 25,
      };

      const mockContext = createMockExecuteFunctions(
        { adGroupId },
        {},
        mockADGroup
      );

      const result = await getADGroup.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockADGroup);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/ADGroups/${adGroupId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent AD groups', async () => {
      const adGroupId = 'non-existent';
      const mockContext = createMockExecuteFunctions({ adGroupId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getADGroup.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  describe('getADGroupsByOrgUnit()', () => {
    it('should fetch AD groups for a specific organizational unit', async () => {
      const orgUnitId = 'ou-456';
      const mockADGroups = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'group-1', name: 'IT-Department', orgUnitId },
          { id: 'group-2', name: 'Developers', orgUnitId },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { orgUnitId, returnAll: false, limit: 50 },
        {},
        mockADGroups
      );

      const result = await getADGroupsByOrgUnit.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/OrgUnits/${orgUnitId}/ADGroups`),
        })
      );
    });
  });

  describe('getADUsersByGroup()', () => {
    it('should fetch AD users for a specific group', async () => {
      const adGroupId = 'group-789';
      const mockADUsers = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'user-1', name: 'John Doe', samAccountName: 'jdoe', groupId: adGroupId },
          { id: 'user-2', name: 'Jane Smith', samAccountName: 'jsmith', groupId: adGroupId },
          { id: 'user-3', name: 'Bob Johnson', samAccountName: 'bjohnson', groupId: adGroupId },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { adGroupId, returnAll: false, limit: 50 },
        {},
        mockADUsers
      );

      const result = await getADUsersByGroup.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/ADGroups/${adGroupId}/ADUsers`),
        })
      );
    });
  });

  // ============================================================================
  // AD USERS OPERATIONS
  // ============================================================================

  describe('getADUsers()', () => {
    it('should fetch all AD users with pagination', async () => {
      const mockADUsers = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'user-1', name: 'Alice Brown', samAccountName: 'abrown', email: 'alice@example.com' },
          { id: 'user-2', name: 'Charlie Davis', samAccountName: 'cdavis', email: 'charlie@example.com' },
          { id: 'user-3', name: 'Diana Wilson', samAccountName: 'dwilson', email: 'diana@example.com' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockADUsers
      );

      const result = await getADUsers.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.name).toBe('Alice Brown');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/activedirectory/v2.0/ADUsers'),
        })
      );
    });

    it('should fetch all AD users when returnAll is true', async () => {
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'user-1', name: 'User 1' },
          { id: 'user-2', name: 'User 2' },
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
          { id: 'user-3', name: 'User 3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getADUsers.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('getADUser()', () => {
    it('should fetch a single AD user by ID', async () => {
      const adUserId = 'user-123';
      const mockADUser = {
        id: adUserId,
        name: 'John Doe',
        samAccountName: 'jdoe',
        email: 'john.doe@example.com',
        department: 'IT',
        title: 'System Administrator',
        distinguishedName: 'CN=John Doe,OU=Users,DC=example,DC=com',
      };

      const mockContext = createMockExecuteFunctions(
        { adUserId },
        {},
        mockADUser
      );

      const result = await getADUser.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockADUser);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/ADUsers/${adUserId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent AD users', async () => {
      const adUserId = 'non-existent';
      const mockContext = createMockExecuteFunctions({ adUserId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getADUser.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  // ============================================================================
  // AD OBJECTS OPERATIONS
  // ============================================================================

  describe('getADObjects()', () => {
    it('should fetch all AD objects with pagination', async () => {
      const mockADObjects = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'obj-1', name: 'Computer-001', objectClass: 'computer' },
          { id: 'obj-2', name: 'Printer-HR', objectClass: 'printer' },
          { id: 'obj-3', name: 'Server-DC01', objectClass: 'computer' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockADObjects
      );

      const result = await getADObjects.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.name).toBe('Computer-001');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/activedirectory/v2.0/ADObjects'),
        })
      );
    });
  });

  describe('getADObject()', () => {
    it('should fetch a single AD object by ID', async () => {
      const adObjectId = 'obj-123';
      const mockADObject = {
        id: adObjectId,
        name: 'Server-DC01',
        objectClass: 'computer',
        distinguishedName: 'CN=Server-DC01,OU=Servers,DC=example,DC=com',
        description: 'Primary domain controller',
      };

      const mockContext = createMockExecuteFunctions(
        { adObjectId },
        {},
        mockADObject
      );

      const result = await getADObject.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockADObject);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/ADObjects/${adObjectId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent AD objects', async () => {
      const adObjectId = 'non-existent';
      const mockContext = createMockExecuteFunctions({ adObjectId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getADObject.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  // ============================================================================
  // AD ORGANIZATIONAL UNITS OPERATIONS
  // ============================================================================

  describe('getOrgUnits()', () => {
    it('should fetch all organizational units with pagination', async () => {
      const mockOrgUnits = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'ou-1', name: 'IT-Department', description: 'IT organizational unit' },
          { id: 'ou-2', name: 'HR-Department', description: 'HR organizational unit' },
          { id: 'ou-3', name: 'Finance', description: 'Finance organizational unit' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockOrgUnits
      );

      const result = await getOrgUnits.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.name).toBe('IT-Department');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/activedirectory/v2.0/OrgUnits'),
        })
      );
    });

    it('should fetch all OUs when returnAll is true', async () => {
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'ou-1', name: 'OU 1' },
          { id: 'ou-2', name: 'OU 2' },
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
          { id: 'ou-3', name: 'OU 3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getOrgUnits.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('getOrgUnit()', () => {
    it('should fetch a single organizational unit by ID', async () => {
      const orgUnitId = 'ou-123';
      const mockOrgUnit = {
        id: orgUnitId,
        name: 'IT-Department',
        description: 'Information Technology Department',
        distinguishedName: 'OU=IT-Department,DC=example,DC=com',
        parentId: 'ou-root',
      };

      const mockContext = createMockExecuteFunctions(
        { orgUnitId },
        {},
        mockOrgUnit
      );

      const result = await getOrgUnit.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockOrgUnit);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/OrgUnits/${orgUnitId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent OUs', async () => {
      const orgUnitId = 'non-existent';
      const mockContext = createMockExecuteFunctions({ orgUnitId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getOrgUnit.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  describe('Credential Configuration', () => {
    it('should use correct base URL from credentials', async () => {
      const adGroupId = 'group-123';
      const mockADGroup = { id: adGroupId, name: 'Test Group' };

      const mockContext = createMockExecuteFunctions(
        { adGroupId },
        { baseUrl: 'https://custom-bms-server:443/bconnect' },
        mockADGroup
      );

      await getADGroup.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom-bms-server:443/bconnect',
        })
      );
    });

    it('should use SSL skip option from credentials', async () => {
      const adGroupId = 'group-123';
      const mockADGroup = { id: adGroupId, name: 'Test Group' };

      const mockContext = createMockExecuteFunctions(
        { adGroupId },
        { ignoreSslIssues: true },
        mockADGroup
      );

      await getADGroup.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          skipSslCertificateValidation: true,
        })
      );
    });
  });
});
