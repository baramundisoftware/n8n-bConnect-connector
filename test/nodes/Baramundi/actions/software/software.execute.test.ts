import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import * as software from '../../../../../nodes/BaramundiSoftware/actions/software/software.execute';

function createMockExecuteFunctions(nodeParameters: Record<string, any> = {}, credentials: Record<string, any> = {}, mockResponse: any = {}): IExecuteFunctions {
	return {
		getNodeParameter: vi.fn((paramName: string, itemIndex: number, fallback?: any) => nodeParameters[paramName] ?? fallback),
		getCredentials: vi.fn(async () => ({ baseUrl: credentials.baseUrl || 'https://bms-win22srv:444/bconnect', username: 'testuser', password: 'test-password-do-not-use', ignoreSslIssues: credentials.ignoreSslIssues ?? false })),
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
		const mockContext = createMockExecuteFunctions({ endpointId: '11111111-1111-1111-1111-111111111111', returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledSoftwareByEndpoint.call(mockContext, 0);
		expect(result).toBeDefined();
		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/WindowsEndpoints/11111111-1111-1111-1111-111111111111/InstalledWindowsSoftware') }));
	});

	it('should fetch installed software by logical group', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Software 1' }] };
		const mockContext = createMockExecuteFunctions({ logicalGroupId: '22222222-2222-2222-2222-222222222222', returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledSoftwareByLogicalGroup.call(mockContext, 0);
		expect(result).toBeDefined();
		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/LogicalGroups/22222222-2222-2222-2222-222222222222/InstalledWindowsSoftware') }));
	});

	it('should fetch installed software by universal dynamic group', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Software 1' }] };
		const mockContext = createMockExecuteFunctions({ universalDynamicGroupId: '78787878-7878-7878-7878-787878787878', returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledSoftwareByUniversalDynamicGroup.call(mockContext, 0);
		expect(result).toBeDefined();
		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/UniversalDynamicGroups/78787878-7878-7878-7878-787878787878/InstalledWindowsSoftware') }));
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

describe('Software Phase 8E — Bundle Application / Folder Operations', () => {
  const pageResp = (items: any[]) => ({
    currentPage: 0, pageSize: 50, totalPages: 1, totalItems: items.length,
    hasPreviousPage: false, hasNextPage: false, data: items,
  });

  function createCtx(params: Record<string, any>, response: any) {
    return {
      getNodeParameter: vi.fn((name: string, _i: number, def?: any) => params[name] ?? def),
      getCredentials: vi.fn(async () => ({ baseUrl: 'https://bms:444/bconnect', username: 'u', password: 'test-password-do-not-use', ignoreSslIssues: false })),
      helpers: {
        httpRequest: vi.fn(async () => response),
        returnJsonArray: vi.fn((data: any) => (Array.isArray(data) ? data : [data]).map((j: any) => ({ json: j }))),
      },
      getNode: vi.fn(() => ({ name: 'Baramundi', type: 'n8n-nodes-baramundi.baramundi', typeVersion: 1, position: [0,0], parameters: {} })),
    } as any;
  }

  it('addApplicationToBundle — POSTs to Bundles/{id}/BundleApplications', async () => {
    const ctx = createCtx({ bundleId: '12121212-1212-1212-1212-121212121212', applicationId: 'dddddddd-dddd-dddd-dddd-dddddddddddd', additionalFields: {} }, { id: '56565656-5656-5656-5656-565656565656' });
    const result = await software.addApplicationToBundle.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'POST', url: expect.stringContaining('/software/v2.0/Bundles/12121212-1212-1212-1212-121212121212/BundleApplications') }));
  });

  it('replaceApplicationInBundle — PATCHes bundle application', async () => {
    const ctx = createCtx({ bundleId: '12121212-1212-1212-1212-121212121212', bundleApplicationId: '56565656-5656-5656-5656-565656565656', updateFields: { applicationId: 'dddddddd-dddd-dddd-dddd-dddddddddddd' } }, { id: '56565656-5656-5656-5656-565656565656' });
    const result = await software.replaceApplicationInBundle.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'PATCH', url: expect.stringContaining('/software/v2.0/Bundles/12121212-1212-1212-1212-121212121212/BundleApplications/56565656-5656-5656-5656-565656565656') }));
  });

  it('replaceApplicationInBundle — throws when no update fields', async () => {
    const ctx = createCtx({ bundleId: '12121212-1212-1212-1212-121212121212', bundleApplicationId: '56565656-5656-5656-5656-565656565656', updateFields: {} }, {});
    await expect(software.replaceApplicationInBundle.call(ctx, 0)).rejects.toThrow('No fields to update specified');
  });

  it('updateBundleFolder — PATCHes bundle folder', async () => {
    const ctx = createCtx({ bundleFolderId: '34343434-3434-3434-3434-343434343434', updateFields: { name: 'Updated' } }, { id: '34343434-3434-3434-3434-343434343434' });
    const result = await software.updateBundleFolder.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'PATCH', url: expect.stringContaining('/software/v2.0/Bundle/Folders/34343434-3434-3434-3434-343434343434') }));
  });

  it('getBundleApplications — returns paginated results', async () => {
    const ctx = createCtx({ returnAll: false, limit: 50 }, pageResp([{ id: 'ba-3' }, { id: 'ba-4' }]));
    const result = await software.getBundleApplications.call(ctx, 0);
    expect(result).toHaveLength(2);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/software/v2.0/BundleApplications') }));
  });

  it('deleteBundleApplication — deletes bundle application', async () => {
    const ctx = createCtx({ bundleApplicationId: '56565656-5656-5656-5656-565656565656' }, {});
    const result = await software.deleteBundleApplication.call(ctx, 0);
    expect(result[0].json).toEqual({ success: true, deletedId: '56565656-5656-5656-5656-565656565656' });
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'DELETE', url: expect.stringContaining('/software/v2.0/BundleApplications/56565656-5656-5656-5656-565656565656') }));
  });
});

describe('returnAll: true branches', () => {
  const multiPage1 = {
    currentPage: 0, pageSize: 2, totalPages: 2, totalItems: 3,
    hasPreviousPage: false, hasNextPage: true,
    data: [{ id: 's1' }, { id: 's2' }],
  };
  const multiPage2 = {
    currentPage: 1, pageSize: 2, totalPages: 2, totalItems: 3,
    hasPreviousPage: true, hasNextPage: false,
    data: [{ id: 's3' }],
  };

  function createReturnAllCtx(params: Record<string, any>, pages: any[]) {
    let callIndex = 0;
    return {
      getNodeParameter: vi.fn((name: string, _i: number, def?: any) => params[name] ?? def),
      getCredentials: vi.fn(async () => ({ baseUrl: 'https://bms:444/bconnect', username: 'u', password: 'test-password-do-not-use', ignoreSslIssues: false })),
      helpers: {
        httpRequest: vi.fn(async () => { const r = pages[callIndex] || pages[pages.length - 1]; callIndex++; return r; }),
        returnJsonArray: vi.fn((data: any) => (Array.isArray(data) ? data : [data]).map((j: any) => ({ json: j }))),
      },
      getNode: vi.fn(() => ({ name: 'Baramundi', type: 'test', typeVersion: 1, position: [0, 0], parameters: {} })),
    } as any;
  }

  it('getInstalledWindowsSoftware returnAll=true', async () => {
    const ctx = createReturnAllCtx({ returnAll: true, options: {} }, [multiPage1, multiPage2]);
    const result = await software.getInstalledWindowsSoftware.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getInstalledSoftwareByEndpoint returnAll=true', async () => {
    const ctx = createReturnAllCtx({ endpointId: '11111111-1111-1111-1111-111111111111', returnAll: true, options: {} }, [multiPage1, multiPage2]);
    const result = await software.getInstalledSoftwareByEndpoint.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getInstalledSoftwareByLogicalGroup returnAll=true', async () => {
    const ctx = createReturnAllCtx({ logicalGroupId: '22222222-2222-2222-2222-222222222222', returnAll: true, options: {} }, [multiPage1, multiPage2]);
    const result = await software.getInstalledSoftwareByLogicalGroup.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getInstalledSoftwareByUniversalDynamicGroup returnAll=true', async () => {
    const ctx = createReturnAllCtx({ universalDynamicGroupId: '78787878-7878-7878-7878-787878787878', returnAll: true, options: {} }, [multiPage1, multiPage2]);
    const result = await software.getInstalledSoftwareByUniversalDynamicGroup.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getBundleApplicationsByBundle returnAll=true', async () => {
    const ctx = createReturnAllCtx({ bundleId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', returnAll: true }, [multiPage1, multiPage2]);
    const result = await software.getBundleApplicationsByBundle.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getBundleApplications returnAll=true', async () => {
    const ctx = createReturnAllCtx({ returnAll: true }, [multiPage1, multiPage2]);
    const result = await software.getBundleApplications.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getBundleFolders returnAll=true', async () => {
    const ctx = createReturnAllCtx({ returnAll: true }, [multiPage1, multiPage2]);
    const result = await software.getBundleFolders.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('updateBundleFolder throws when no fields to update', async () => {
    const ctx = createReturnAllCtx({ bundleFolderId: '34343434-3434-3434-3434-343434343434', updateFields: {} }, []);
    await expect(software.updateBundleFolder.call(ctx, 0)).rejects.toThrow('No fields to update specified');
  });
});

describe('Validation error paths', () => {
  it('should throw NodeOperationError for invalid GUID in endpointId (getInstalledSoftwareByEndpoint)', async () => {
    const mock = createMockExecuteFunctions({ endpointId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(software.getInstalledSoftwareByEndpoint.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in logicalGroupId (getInstalledSoftwareByLogicalGroup)', async () => {
    const mock = createMockExecuteFunctions({ logicalGroupId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(software.getInstalledSoftwareByLogicalGroup.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in universalDynamicGroupId (getInstalledSoftwareByUniversalDynamicGroup)', async () => {
    const mock = createMockExecuteFunctions({ universalDynamicGroupId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(software.getInstalledSoftwareByUniversalDynamicGroup.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in bundleId (getBundle)', async () => {
    const mock = createMockExecuteFunctions({ bundleId: 'not-a-guid' });
    await expect(software.getBundle.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getInstalledWindowsSoftware', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(software.getInstalledWindowsSoftware.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getInstalledWindowsSoftware', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(software.getInstalledWindowsSoftware.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getInstalledSoftwareByEndpoint', async () => {
    const mock = createMockExecuteFunctions({
      endpointId: '11111111-1111-1111-1111-111111111111',
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(software.getInstalledSoftwareByEndpoint.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getBundles', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(software.getBundles.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in bundleId (deleteBundle)', async () => {
    const mock = createMockExecuteFunctions({ bundleId: 'not-a-guid' });
    await expect(software.deleteBundle.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in bundleFolderId (getBundleFolder)', async () => {
    const mock = createMockExecuteFunctions({ bundleFolderId: 'not-a-guid' });
    await expect(software.getBundleFolder.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in bundleFolderId (getBundleSubFolders)', async () => {
    const mock = createMockExecuteFunctions({ bundleFolderId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(software.getBundleSubFolders.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in bundleFolderId (deleteBundleFolder)', async () => {
    const mock = createMockExecuteFunctions({ bundleFolderId: 'not-a-guid' });
    await expect(software.deleteBundleFolder.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in bundleId (getBundleApplicationsByBundle)', async () => {
    const mock = createMockExecuteFunctions({ bundleId: 'not-a-guid', returnAll: false, limit: 10 });
    await expect(software.getBundleApplicationsByBundle.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in bundleId (addApplicationToBundle)', async () => {
    const mock = createMockExecuteFunctions({ bundleId: 'not-a-guid', applicationId: '11111111-1111-1111-1111-111111111111' });
    await expect(software.addApplicationToBundle.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in bundleApplicationId (deleteBundleApplication)', async () => {
    const mock = createMockExecuteFunctions({ bundleApplicationId: 'not-a-guid' });
    await expect(software.deleteBundleApplication.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getBundles', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(software.getBundles.call(mock, 0)).rejects.toThrow();
  });
});
