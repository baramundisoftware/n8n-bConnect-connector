import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import * as software from '../../../../../nodes/Baramundi/actions/software/software.execute';

function createMockExecuteFunctions(nodeParameters: Record<string, any> = {}, credentials: Record<string, any> = {}, mockResponse: any = {}): IExecuteFunctions {
	return {
		getNodeParameter: vi.fn((paramName: string, itemIndex: number, fallback?: any) => nodeParameters[paramName] ?? fallback),
		getCredentials: vi.fn(async () => ({ baseUrl: credentials.baseUrl || 'https://bms-win22srv:444/bconnect', username: 'testuser', password: 'testpass', ignoreSslIssues: credentials.ignoreSslIssues ?? true })),
		helpers: { httpRequest: vi.fn(async () => mockResponse), returnJsonArray: vi.fn((data: IDataObject | IDataObject[]) => { const array = Array.isArray(data) ? data : [data]; return array.map((item) => ({ json: item, pairedItem: { item: 0 } })); }) } as any,
		continueOnFail: vi.fn(() => false),
		getNode: vi.fn(() => ({ name: 'Test Node', type: 'test', typeVersion: 1, position: [0, 0], parameters: {} })),
	} as unknown as IExecuteFunctions;
}

describe('Software Operations', () => {
	it('should fetch all installed Windows software', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Adobe Reader' }, { id: 'sw-2', name: 'WinRAR' }] };
		const mockContext = createMockExecuteFunctions({ returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledWindowsSoftware.call(mockContext, 0);
		expect(result).toHaveLength(2);
	});

	it('should fetch installed software by endpoint', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Software 1' }] };
		const mockContext = createMockExecuteFunctions({ endpointId: 'ep-123', returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledSoftwareByEndpoint.call(mockContext, 0);
		expect(result).toBeDefined();
		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/WindowsEndpoints/ep-123/InstalledWindowsSoftware') }));
	});

	it('should fetch installed software by logical group', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Software 1' }] };
		const mockContext = createMockExecuteFunctions({ logicalGroupId: 'lg-123', returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledSoftwareByLogicalGroup.call(mockContext, 0);
		expect(result).toBeDefined();
		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/LogicalGroups/lg-123/InstalledWindowsSoftware') }));
	});

	it('should fetch installed software by universal dynamic group', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Software 1' }] };
		const mockContext = createMockExecuteFunctions({ universalDynamicGroupId: 'udg-123', returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledSoftwareByUniversalDynamicGroup.call(mockContext, 0);
		expect(result).toBeDefined();
		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/UniversalDynamicGroups/udg-123/InstalledWindowsSoftware') }));
	});
});

// ============================================================================
// Phase 4: Bundle Operations
// ============================================================================

const pageResponse4 = (data: any[]) => ({ data, currentPage: 0, pageSize: 50, totalCount: data.length });

describe('Software Phase 4 - Bundle Operations', () => {
  describe('getBundles()', () => {
    it('should return paginated bundles when returnAll is false', async () => {
      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 5, options: {} },
        {},
        pageResponse4([{ id: 'b1', name: 'Bundle1' }]),
      );
      const result = await software.getBundles.call(mockContext, 0);
      expect(result).toHaveLength(1);
    });

    it('should return all bundles when returnAll is true', async () => {
      const mockContext = createMockExecuteFunctions(
        { returnAll: true, options: {} },
        {},
        pageResponse4([{ id: 'b1' }, { id: 'b2' }]),
      );
      const result = await software.getBundles.call(mockContext, 0);
      expect(result).toHaveLength(2);
    });
  });

  describe('getBundle()', () => {
    it('should return the bundle by id', async () => {
      const mockContext = createMockExecuteFunctions(
        { bundleId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
        {},
        { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'TestBundle' },
      );
      const result = await software.getBundle.call(mockContext, 0);
      expect(result[0].json.name).toBe('TestBundle');
    });
  });

  describe('createBundle()', () => {
    it('should call POST and return the created bundle', async () => {
      const mockContext = createMockExecuteFunctions(
        { name: 'NewBundle', additionalFields: { type: 'standard' } },
        {},
        { id: 'new-id', name: 'NewBundle' },
      );
      const result = await software.createBundle.call(mockContext, 0);
      const httpRequest = mockContext.helpers.httpRequest as ReturnType<typeof vi.fn>;
      expect(httpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'POST' }));
      expect(result[0].json.name).toBe('NewBundle');
    });
  });

  describe('deleteBundle()', () => {
    it('should return success true', async () => {
      const mockContext = createMockExecuteFunctions(
        { bundleId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
        {},
        {},
      );
      const result = await software.deleteBundle.call(mockContext, 0);
      expect(result[0].json.success).toBe(true);
    });
  });

  describe('getBundleFolders()', () => {
    it('should return paginated bundle folders', async () => {
      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 5 },
        {},
        pageResponse4([{ id: 'f1' }]),
      );
      const result = await software.getBundleFolders.call(mockContext, 0);
      expect(result).toHaveLength(1);
    });
  });

  describe('getBundleFolder()', () => {
    it('should return folder by id', async () => {
      const mockContext = createMockExecuteFunctions(
        { bundleFolderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
        {},
        { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Folder1' },
      );
      const result = await software.getBundleFolder.call(mockContext, 0);
      expect(result[0].json.id).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    });
  });

  describe('getBundleSubFolders()', () => {
    it('should return paginated subfolders', async () => {
      const mockContext = createMockExecuteFunctions(
        { bundleFolderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', returnAll: false, limit: 5 },
        {},
        pageResponse4([{ id: 'sf1' }, { id: 'sf2' }]),
      );
      const result = await software.getBundleSubFolders.call(mockContext, 0);
      expect(result).toHaveLength(2);
    });
  });

  describe('createBundleFolder()', () => {
    it('should return the created folder', async () => {
      const mockContext = createMockExecuteFunctions(
        { name: 'Folder1', additionalFields: {} },
        {},
        { id: 'f1', name: 'Folder1' },
      );
      const result = await software.createBundleFolder.call(mockContext, 0);
      expect(result[0].json.name).toBe('Folder1');
    });
  });

  describe('deleteBundleFolder()', () => {
    it('should return success true', async () => {
      const mockContext = createMockExecuteFunctions(
        { bundleFolderId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
        {},
        {},
      );
      const result = await software.deleteBundleFolder.call(mockContext, 0);
      expect(result[0].json.success).toBe(true);
    });
  });

  describe('getBundleApplicationsByBundle()', () => {
    it('should return paginated bundle applications', async () => {
      const mockContext = createMockExecuteFunctions(
        { bundleId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', returnAll: false, limit: 5 },
        {},
        pageResponse4([{ id: 'app1' }, { id: 'app2' }]),
      );
      const result = await software.getBundleApplicationsByBundle.call(mockContext, 0);
      expect(result).toHaveLength(2);
    });
  });
});
