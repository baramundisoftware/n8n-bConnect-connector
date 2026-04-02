import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  getMany,
  get,
  getFolders,
  getFolder,
  getSubFolders,
  getGroupsByFolder,
} from '../../../../../nodes/BaramundiSoftware/actions/universalDynamicGroups/universalDynamicGroups.execute';

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
      password: 'test-password-do-not-use',
      ignoreSslIssues: false,
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

const mockGroup = { id: '78787878-7878-7878-7878-787878787878', name: 'All Windows Endpoints', type: 'UniversalDynamicGroup' };
const mockFolder = { id: '77777777-7777-7777-7777-777777777777', name: 'Production', parentId: null };
const pageResponse = (data: any[]) => ({ data, currentPage: 0, pageSize: 50, totalCount: data.length });

describe('Universal Dynamic Groups Operations', () => {

  describe('getMany()', () => {
    it('should return paginated universal dynamic groups', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: false, limit: 10, options: {} },
        pageResponse([mockGroup]),
      );
      const result = await getMany.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockGroup);
    });

    it('should return all groups when returnAll is true', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: true, options: {} },
        pageResponse([mockGroup, { ...mockGroup, id: '78787878-7878-7878-7878-787878787878' }]),
      );
      const result = await getMany.call(mock, 0);
      expect(result).toHaveLength(2);
    });

    it('should call the correct API path', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: false, limit: 10, options: {} },
        pageResponse([mockGroup]),
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await getMany.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.url).toContain('/universaldynamicgroups/v2.0/UniversalDynamicGroups');
    });
  });

  describe('get()', () => {
    it('should return a single group by ID', async () => {
      const mock = createMockExecuteFunctions(
        { groupId: '78787878-7878-7878-7878-787878787878' },
        mockGroup,
      );
      const result = await get.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockGroup);
    });

    it('should call the correct API path with group ID', async () => {
      const mock = createMockExecuteFunctions(
        { groupId: '78787878-7878-7878-7878-787878787878' },
        mockGroup,
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await get.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.url).toContain('/universaldynamicgroups/v2.0/UniversalDynamicGroups/78787878-7878-7878-7878-787878787878');
    });
  });

  describe('getFolders()', () => {
    it('should return paginated folders', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: false, limit: 10 },
        pageResponse([mockFolder]),
      );
      const result = await getFolders.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockFolder);
    });
  });

  describe('getFolder()', () => {
    it('should return a single folder by ID', async () => {
      const mock = createMockExecuteFunctions(
        { folderId: '77777777-7777-7777-7777-777777777777' },
        mockFolder,
      );
      const result = await getFolder.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockFolder);
    });

    it('should call the correct API path with folder ID', async () => {
      const mock = createMockExecuteFunctions(
        { folderId: '77777777-7777-7777-7777-777777777777' },
        mockFolder,
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await getFolder.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.url).toContain('/universaldynamicgroups/v2.0/UniversalDynamicGroupsFolder/77777777-7777-7777-7777-777777777777');
    });
  });

  describe('getSubFolders()', () => {
    it('should return sub-folders for a given folder', async () => {
      const mock = createMockExecuteFunctions(
        { folderId: '77777777-7777-7777-7777-777777777777', returnAll: false, limit: 10 },
        pageResponse([{ ...mockFolder, id: '77777777-7777-7777-7777-777777777777', parentId: '77777777-7777-7777-7777-777777777777' }]),
      );
      const result = await getSubFolders.call(mock, 0);
      expect(result).toHaveLength(1);
    });

    it('should call correct path with folder ID', async () => {
      const mock = createMockExecuteFunctions(
        { folderId: '77777777-7777-7777-7777-777777777777', returnAll: false, limit: 10 },
        pageResponse([]),
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await getSubFolders.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.url).toContain('/universaldynamicgroups/v2.0/UniversalDynamicGroupsFolder/77777777-7777-7777-7777-777777777777/Folders');
    });
  });

  describe('getGroupsByFolder()', () => {
    it('should return groups within a folder', async () => {
      const mock = createMockExecuteFunctions(
        { folderId: '77777777-7777-7777-7777-777777777777', returnAll: false, limit: 10 },
        pageResponse([mockGroup]),
      );
      const result = await getGroupsByFolder.call(mock, 0);
      expect(result).toHaveLength(1);
    });

    it('should call correct path with folder ID', async () => {
      const mock = createMockExecuteFunctions(
        { folderId: '77777777-7777-7777-7777-777777777777', returnAll: false, limit: 10 },
        pageResponse([mockGroup]),
      );
      const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
      await getGroupsByFolder.call(mock, 0);
      const callArgs = httpRequest.mock.calls[0][0];
      expect(callArgs.url).toContain('/universaldynamicgroups/v2.0/Folders/77777777-7777-7777-7777-777777777777/UniversalDynamicGroups');
    });
  });
});

describe('Validation error paths', () => {
  it('should throw NodeOperationError for invalid GUID in id (get)', async () => {
    const mock = createMockExecuteFunctions({ id: 'not-a-guid' });
    await expect(get.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in folderId (getFolder)', async () => {
    const mock = createMockExecuteFunctions({ folderId: 'not-a-guid' });
    await expect(getFolder.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in folderId (getSubFolders)', async () => {
    const mock = createMockExecuteFunctions({ folderId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getSubFolders.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in folderId (getGroupsByFolder)', async () => {
    const mock = createMockExecuteFunctions({ folderId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(getGroupsByFolder.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getMany', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(getMany.call(mock, 0)).rejects.toThrow();
  });
});
