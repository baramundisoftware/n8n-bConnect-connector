import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getADGroups, getADGroup, getADGroupsByOrgUnit, getADUsersByGroup, getADUsers, getADUser, getADObjects, getADObject, getOrgUnits, getOrgUnit, getADGroupsByADGroup, getADObjectsByADGroup, getADObjectMemberships, getADObjectsByOrgUnit, getADUsersByOrgUnit, getOrgUnitsByOrgUnit } from '../../../../../nodes/BaramundiAdmin/actions/activeDirectory/activeDirectory.execute';

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
      baseUrl: 'https://bms.example.com:444/bconnect',
      username: 'Administrator',
      password: 'test-password-do-not-use',
      ignoreSslIssues: false,
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
      const adGroupId = '33333333-3333-3333-3333-333333333333';
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
      const adGroupId = '33333333-3333-3333-3333-333333333333';
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
      const orgUnitId = '44444444-4444-4444-4444-444444444444';
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
      const adGroupId = '33333333-3333-3333-3333-333333333333';
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
      const adUserId = '55555555-5555-5555-5555-555555555555';
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
      const adUserId = '55555555-5555-5555-5555-555555555555';
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
      const adObjectId = '66666666-6666-6666-6666-666666666666';
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
      const adObjectId = '66666666-6666-6666-6666-666666666666';
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
      const orgUnitId = '44444444-4444-4444-4444-444444444444';
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
      const orgUnitId = '44444444-4444-4444-4444-444444444444';
      const mockContext = createMockExecuteFunctions({ orgUnitId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getOrgUnit.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  // ============================================================================
  // AD SUB-NAVIGATION OPERATIONS (Phase 8A)
  // ============================================================================

  describe('getADGroupsByADGroup()', () => {
    it('should fetch AD sub-groups in an AD group with pagination', async () => {
      const adGroupId = '33333333-3333-3333-3333-333333333333';
      const mockResponse = {
        currentPage: 0, pageSize: 50, totalPages: 1, totalItems: 2,
        hasPreviousPage: false, hasNextPage: false,
        data: [
          { id: 'group-child-1', name: 'SubGroup-A' },
          { id: 'group-child-2', name: 'SubGroup-B' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { adGroupId, returnAll: false, limit: 50 }, {}, mockResponse,
      );

      const result = await getADGroupsByADGroup.call(mockContext, 0);

      expect(result).toHaveLength(2);
      expect(result[0].json.name).toBe('SubGroup-A');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/ADGroups/${adGroupId}/ADGroups`),
        }),
      );
    });

    it('should fetch all AD sub-groups when returnAll is true', async () => {
      const adGroupId = '33333333-3333-3333-3333-333333333333';
      const mockPage1 = {
        currentPage: 0, pageSize: 2, totalPages: 2, totalItems: 3,
        hasPreviousPage: false, hasNextPage: true,
        data: [{ id: 'g-1', name: 'G1' }, { id: 'g-2', name: 'G2' }],
      };
      const mockPage2 = {
        currentPage: 1, pageSize: 2, totalPages: 2, totalItems: 3,
        hasPreviousPage: true, hasNextPage: false,
        data: [{ id: 'g-3', name: 'G3' }],
      };

      const mockContext = createMockExecuteFunctions(
        { adGroupId, returnAll: true }, {}, {}, [mockPage1, mockPage2],
      );

      const result = await getADGroupsByADGroup.call(mockContext, 0);

      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('getADObjectsByADGroup()', () => {
    it('should fetch AD objects in an AD group with pagination', async () => {
      const adGroupId = '33333333-3333-3333-3333-333333333333';
      const mockResponse = {
        currentPage: 0, pageSize: 50, totalPages: 1, totalItems: 2,
        hasPreviousPage: false, hasNextPage: false,
        data: [
          { id: 'obj-1', name: 'Computer-001', objectClass: 'computer' },
          { id: 'obj-2', name: 'User-001', objectClass: 'user' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { adGroupId, returnAll: false, limit: 50 }, {}, mockResponse,
      );

      const result = await getADObjectsByADGroup.call(mockContext, 0);

      expect(result).toHaveLength(2);
      expect(result[0].json.name).toBe('Computer-001');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/ADGroups/${adGroupId}/ADObjects`),
        }),
      );
    });
  });

  describe('getADObjectMemberships()', () => {
    it('should fetch group memberships of an AD object', async () => {
      const adObjectId = '66666666-6666-6666-6666-666666666666';
      const mockResponse = {
        currentPage: 0, pageSize: 50, totalPages: 1, totalItems: 2,
        hasPreviousPage: false, hasNextPage: false,
        data: [
          { id: 'group-1', name: 'Domain Admins' },
          { id: 'group-2', name: 'IT-Department' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { adObjectId, returnAll: false, limit: 50 }, {}, mockResponse,
      );

      const result = await getADObjectMemberships.call(mockContext, 0);

      expect(result).toHaveLength(2);
      expect(result[0].json.name).toBe('Domain Admins');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/ADObjects/${adObjectId}/ADGroupMemberships`),
        }),
      );
    });
  });

  describe('getADObjectsByOrgUnit()', () => {
    it('should fetch AD objects in an organizational unit', async () => {
      const orgUnitId = '44444444-4444-4444-4444-444444444444';
      const mockResponse = {
        currentPage: 0, pageSize: 50, totalPages: 1, totalItems: 2,
        hasPreviousPage: false, hasNextPage: false,
        data: [
          { id: 'obj-1', name: 'Computer-001', objectClass: 'computer' },
          { id: 'obj-2', name: 'Printer-001', objectClass: 'printer' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { orgUnitId, returnAll: false, limit: 50 }, {}, mockResponse,
      );

      const result = await getADObjectsByOrgUnit.call(mockContext, 0);

      expect(result).toHaveLength(2);
      expect(result[0].json.name).toBe('Computer-001');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/OrgUnits/${orgUnitId}/ADObjects`),
        }),
      );
    });
  });

  describe('getADUsersByOrgUnit()', () => {
    it('should fetch AD users in an organizational unit', async () => {
      const orgUnitId = '44444444-4444-4444-4444-444444444444';
      const mockResponse = {
        currentPage: 0, pageSize: 50, totalPages: 1, totalItems: 2,
        hasPreviousPage: false, hasNextPage: false,
        data: [
          { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
          { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { orgUnitId, returnAll: false, limit: 50 }, {}, mockResponse,
      );

      const result = await getADUsersByOrgUnit.call(mockContext, 0);

      expect(result).toHaveLength(2);
      expect(result[0].json.name).toBe('John Doe');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/OrgUnits/${orgUnitId}/ADUsers`),
        }),
      );
    });
  });

  describe('getOrgUnitsByOrgUnit()', () => {
    it('should fetch sub-OUs in an organizational unit', async () => {
      const orgUnitId = '44444444-4444-4444-4444-444444444444';
      const mockResponse = {
        currentPage: 0, pageSize: 50, totalPages: 1, totalItems: 2,
        hasPreviousPage: false, hasNextPage: false,
        data: [
          { id: 'ou-child-1', name: 'IT-Sub-OU' },
          { id: 'ou-child-2', name: 'HR-Sub-OU' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { orgUnitId, returnAll: false, limit: 50 }, {}, mockResponse,
      );

      const result = await getOrgUnitsByOrgUnit.call(mockContext, 0);

      expect(result).toHaveLength(2);
      expect(result[0].json.name).toBe('IT-Sub-OU');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/activedirectory/v2.0/OrgUnits/${orgUnitId}/OrgUnits`),
        }),
      );
    });
  });

  describe('Credential Configuration', () => {
    it('should use correct base URL from credentials', async () => {
      const adGroupId = '33333333-3333-3333-3333-333333333333';
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
      const adGroupId = '33333333-3333-3333-3333-333333333333';
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

describe('returnAll: true branches', () => {
  const multiPage1 = {
    currentPage: 0, pageSize: 2, totalPages: 2, totalItems: 3,
    hasPreviousPage: false, hasNextPage: true,
    data: [{ id: 'x1' }, { id: 'x2' }],
  };
  const multiPage2 = {
    currentPage: 1, pageSize: 2, totalPages: 2, totalItems: 3,
    hasPreviousPage: true, hasNextPage: false,
    data: [{ id: 'x3' }],
  };

  it('getADObjectsByADGroup returnAll=true', async () => {
    const mockContext = createMockExecuteFunctions(
      { adGroupId: '33333333-3333-3333-3333-333333333333', returnAll: true, options: {} },
      {}, {}, [multiPage1, multiPage2],
    );
    const result = await getADObjectsByADGroup.call(mockContext, 0);
    expect(result).toHaveLength(3);
  });

  it('getADObjectMemberships returnAll=true', async () => {
    const mockContext = createMockExecuteFunctions(
      { adObjectId: '66666666-6666-6666-6666-666666666666', returnAll: true, options: {} },
      {}, {}, [multiPage1, multiPage2],
    );
    const result = await getADObjectMemberships.call(mockContext, 0);
    expect(result).toHaveLength(3);
  });

  it('getADObjectsByOrgUnit returnAll=true', async () => {
    const mockContext = createMockExecuteFunctions(
      { orgUnitId: '44444444-4444-4444-4444-444444444444', returnAll: true, options: {} },
      {}, {}, [multiPage1, multiPage2],
    );
    const result = await getADObjectsByOrgUnit.call(mockContext, 0);
    expect(result).toHaveLength(3);
  });

  it('getADUsersByOrgUnit returnAll=true', async () => {
    const mockContext = createMockExecuteFunctions(
      { orgUnitId: '44444444-4444-4444-4444-444444444444', returnAll: true, options: {} },
      {}, {}, [multiPage1, multiPage2],
    );
    const result = await getADUsersByOrgUnit.call(mockContext, 0);
    expect(result).toHaveLength(3);
  });

  it('getADGroups returnAll=true', async () => {
    const mockContext = createMockExecuteFunctions(
      { returnAll: true, options: {} }, {}, {}, [multiPage1, multiPage2],
    );
    const result = await getADGroups.call(mockContext, 0);
    expect(result).toHaveLength(3);
  });

  it('getADObjectsByADGroup with searchQuery and orderBy options', async () => {
    const mockContext = createMockExecuteFunctions(
      { adGroupId: '33333333-3333-3333-3333-333333333333', returnAll: false, limit: 50, options: { searchQuery: 'Name eq test', orderBy: 'Name asc' } },
      {}, { data: [{ id: 'x1' }] },
    );
    const result = await getADObjectsByADGroup.call(mockContext, 0);
    expect(result).toHaveLength(1);
  });

  it('getADObjectMemberships with searchQuery and orderBy options', async () => {
    const mockContext = createMockExecuteFunctions(
      { adObjectId: '66666666-6666-6666-6666-666666666666', returnAll: false, limit: 50, options: { searchQuery: 'Name eq test', orderBy: 'Name asc' } },
      {}, { data: [{ id: 'x1' }] },
    );
    const result = await getADObjectMemberships.call(mockContext, 0);
    expect(result).toHaveLength(1);
  });

  it('getADObjectsByOrgUnit with searchQuery and orderBy options', async () => {
    const mockContext = createMockExecuteFunctions(
      { orgUnitId: '44444444-4444-4444-4444-444444444444', returnAll: false, limit: 50, options: { searchQuery: 'Name eq test', orderBy: 'Name asc' } },
      {}, { data: [{ id: 'x1' }] },
    );
    const result = await getADObjectsByOrgUnit.call(mockContext, 0);
    expect(result).toHaveLength(1);
  });

  it('getADUsersByOrgUnit with searchQuery and orderBy options', async () => {
    const mockContext = createMockExecuteFunctions(
      { orgUnitId: '44444444-4444-4444-4444-444444444444', returnAll: false, limit: 50, options: { searchQuery: 'Name eq test', orderBy: 'Name asc' } },
      {}, { data: [{ id: 'x1' }] },
    );
    const result = await getADUsersByOrgUnit.call(mockContext, 0);
    expect(result).toHaveLength(1);
  });

  it('getOrgUnitsByOrgUnit with searchQuery and orderBy options', async () => {
    const mockContext = createMockExecuteFunctions(
      { orgUnitId: '44444444-4444-4444-4444-444444444444', returnAll: false, limit: 50, options: { searchQuery: 'Name eq test', orderBy: 'Name asc' } },
      {}, { data: [{ id: 'x1' }] },
    );
    const result = await getOrgUnitsByOrgUnit.call(mockContext, 0);
    expect(result).toHaveLength(1);
  });

  it('getADUsers returnAll=true', async () => {
    const mockContext = createMockExecuteFunctions(
      { returnAll: true, options: {} }, {}, {}, [multiPage1, multiPage2],
    );
    const result = await getADUsers.call(mockContext, 0);
    expect(result).toHaveLength(3);
  });

  it('getADObjects returnAll=true', async () => {
    const mockContext = createMockExecuteFunctions(
      { returnAll: true, options: {} }, {}, {}, [multiPage1, multiPage2],
    );
    const result = await getADObjects.call(mockContext, 0);
    expect(result).toHaveLength(3);
  });

  it('getADGroupsByOrgUnit returnAll=true', async () => {
    const mockContext = createMockExecuteFunctions(
      { orgUnitId: '44444444-4444-4444-4444-444444444444', returnAll: true, options: {} },
      {}, {}, [multiPage1, multiPage2],
    );
    const result = await getADGroupsByOrgUnit.call(mockContext, 0);
    expect(result).toHaveLength(3);
  });

  it('getADUsersByGroup returnAll=true', async () => {
    const mockContext = createMockExecuteFunctions(
      { adGroupId: '33333333-3333-3333-3333-333333333333', returnAll: true, options: {} },
      {}, {}, [multiPage1, multiPage2],
    );
    const result = await getADUsersByGroup.call(mockContext, 0);
    expect(result).toHaveLength(3);
  });
});

describe('Validation error paths', () => {
  it('should throw NodeOperationError for invalid GUID in adGroupId (getADGroup)', async () => {
    const mock = createMockExecuteFunctions({ adGroupId: 'not-a-guid' });
    await expect(getADGroup.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in adUserId (getADUser)', async () => {
    const mock = createMockExecuteFunctions({ adUserId: 'not-a-guid' });
    await expect(getADUser.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in adObjectId (getADObject)', async () => {
    const mock = createMockExecuteFunctions({ adObjectId: 'not-a-guid' });
    await expect(getADObject.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in orgUnitId (getOrgUnit)', async () => {
    const mock = createMockExecuteFunctions({ orgUnitId: 'not-a-guid' });
    await expect(getOrgUnit.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in orgUnitId (getADGroupsByOrgUnit)', async () => {
    const mock = createMockExecuteFunctions({ orgUnitId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getADGroupsByOrgUnit.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in adGroupId (getADUsersByGroup)', async () => {
    const mock = createMockExecuteFunctions({ adGroupId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getADUsersByGroup.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in adGroupId (getADGroupsByADGroup)', async () => {
    const mock = createMockExecuteFunctions({ adGroupId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getADGroupsByADGroup.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in adGroupId (getADObjectsByADGroup)', async () => {
    const mock = createMockExecuteFunctions({ adGroupId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getADObjectsByADGroup.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in adObjectId (getADObjectMemberships)', async () => {
    const mock = createMockExecuteFunctions({ adObjectId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getADObjectMemberships.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in orgUnitId (getADObjectsByOrgUnit)', async () => {
    const mock = createMockExecuteFunctions({ orgUnitId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getADObjectsByOrgUnit.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in orgUnitId (getADUsersByOrgUnit)', async () => {
    const mock = createMockExecuteFunctions({ orgUnitId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getADUsersByOrgUnit.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in orgUnitId (getOrgUnitsByOrgUnit)', async () => {
    const mock = createMockExecuteFunctions({ orgUnitId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getOrgUnitsByOrgUnit.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getADGroups', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(getADGroups.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getADGroups', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(getADGroups.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getADUsers', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(getADUsers.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getADObjects', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(getADObjects.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getOrgUnits', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(getOrgUnits.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getOrgUnitsByOrgUnit', async () => {
    const mock = createMockExecuteFunctions({
      orgUnitId: '44444444-4444-4444-4444-444444444444',
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(getOrgUnitsByOrgUnit.call(mock, 0)).rejects.toThrow();
  });

  it('should fetch all sub-OUs when returnAll is true (getOrgUnitsByOrgUnit)', async () => {
    const orgUnitId = '44444444-4444-4444-4444-444444444444';
    const mockPage1 = {
      currentPage: 0, pageSize: 2, totalPages: 2, totalItems: 3,
      hasPreviousPage: false, hasNextPage: true,
      data: [{ id: 'ou-1', name: 'Sub1' }, { id: 'ou-2', name: 'Sub2' }],
    };
    const mockPage2 = {
      currentPage: 1, pageSize: 2, totalPages: 2, totalItems: 3,
      hasPreviousPage: true, hasNextPage: false,
      data: [{ id: 'ou-3', name: 'Sub3' }],
    };
    const mock = createMockExecuteFunctions(
      { orgUnitId, returnAll: true },
      {},
      {},
      [mockPage1, mockPage2],
    );
    const result = await getOrgUnitsByOrgUnit.call(mock, 0);
    expect(result).toHaveLength(3);
  });

  it('should throw NodeOperationError for invalid OData orderBy in getADUsers', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(getADUsers.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getADObjects', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(getADObjects.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getOrgUnits', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(getOrgUnits.call(mock, 0)).rejects.toThrow();
  });
});
