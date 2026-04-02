import { describe, it, expect, vi } from 'vitest';
import { NodeOperationError } from 'n8n-workflow';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { get, getMany, create, update, deleteAsset, getAssetTypes, getAssetType, getAssetsByEndpoint, getAssetsByLogicalGroup, createAssetType, deleteAssetType, getAssetStockAssets, getAssetStockFolders, createAssetStockFolder, updateAssetStockFolder, deleteAssetStockFolder, getAssetsByADObject, getAssetsByOrgUnit, getAssetStockFolder, getAssetStockSubFolders, getAssetTypeFolders, getAssetTypeFolder, createAssetTypeFolder, updateAssetTypeFolder, deleteAssetTypeFolder, getAssetTypeFolderSubFolders } from '../../../../../nodes/BaramundiAsset/actions/asset/asset.execute';

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

describe('Asset Operations', () => {
  describe('get()', () => {
    it('should fetch a single asset by ID', async () => {
      const assetId = '12345678-1234-1234-1234-123456789abc';
      const mockAsset = {
        id: assetId,
        displayName: 'Dell Latitude 7490',
        assetType: 'Laptop',
        serialNumber: 'SN123456',
        manufacturer: 'Dell',
        model: 'Latitude 7490',
      };

      const mockContext = createMockExecuteFunctions(
        { assetId },
        {},
        mockAsset
      );

      const result = await get.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockAsset);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/assets/v2.0/Assets/${assetId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent assets', async () => {
      const assetId = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
      const mockContext = createMockExecuteFunctions({ assetId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(get.call(mockContext, 0)).rejects.toThrow('Not Found');
    });

    it('should throw NodeOperationError for invalid GUID format', async () => {
      const mockContext = createMockExecuteFunctions({ assetId: 'not-a-guid' });
      await expect(get.call(mockContext, 0)).rejects.toThrow(NodeOperationError);
    });

    it('should throw NodeOperationError for empty assetId', async () => {
      const mockContext = createMockExecuteFunctions({ assetId: '' });
      await expect(get.call(mockContext, 0)).rejects.toThrow(NodeOperationError);
    });

    it('should throw NodeOperationError for SQL-injection-style assetId', async () => {
      const mockContext = createMockExecuteFunctions({ assetId: "' OR '1'='1" });
      await expect(get.call(mockContext, 0)).rejects.toThrow(NodeOperationError);
    });
  });

  describe('getMany()', () => {
    it('should fetch multiple assets with pagination', async () => {
      const mockAssets = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'asset-1', displayName: 'Laptop 1', assetType: 'Laptop' },
          { id: 'asset-2', displayName: 'Monitor 1', assetType: 'Monitor' },
          { id: 'asset-3', displayName: 'Printer 1', assetType: 'Printer' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockAssets
      );

      const result = await getMany.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.displayName).toBe('Laptop 1');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/assets/v2.0/Assets'),
          qs: expect.objectContaining({
            PageSize: 50,
            Page: 0,
          }),
        })
      );
    });

    it('should fetch all assets when returnAll is true', async () => {
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'asset-1', displayName: 'Asset 1' },
          { id: 'asset-2', displayName: 'Asset 2' },
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
          { id: 'asset-3', displayName: 'Asset 3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getMany.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.id).toBe('asset-1');
      expect(result[2].json.id).toBe('asset-3');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should support SearchQuery option', async () => {
      const mockAssets = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'asset-1', displayName: 'Dell Laptop' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { searchQuery: 'Dell' },
        },
        {},
        mockAssets
      );

      await getMany.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            SearchQuery: 'Dell',
          }),
        })
      );
    });

    it('should support OrderBy option', async () => {
      const mockAssets = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'asset-2', displayName: 'Printer' },
          { id: 'asset-1', displayName: 'Laptop' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { orderBy: 'DisplayName desc' },
        },
        {},
        mockAssets
      );

      await getMany.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            OrderBy: 'DisplayName desc',
          }),
        })
      );
    });

    it('should support AssetTypeId filter', async () => {
      const assetTypeId = '11111111-1111-1111-1111-111111111111';
      const mockAssets = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'asset-1', displayName: 'Laptop 1', assetTypeId },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { assetTypeId },
        },
        {},
        mockAssets
      );

      await getMany.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            AssetTypeId: assetTypeId,
          }),
        })
      );
    });

    it('should handle empty results', async () => {
      const mockEmptyAssets = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 0,
        totalItems: 0,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockEmptyAssets
      );

      const result = await getMany.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });
  });

  describe('create()', () => {
    it('should create an asset with required fields only', async () => {
      const assetTypeId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
      const displayName = 'Test Laptop';
      const mockCreatedAsset = {
        id: '12345678-1234-1234-1234-123456789abc',
        assetTypeId,
        displayName,
        createdAt: '2026-01-20T12:00:00Z',
      };

      const mockContext = createMockExecuteFunctions(
        {
          assetTypeId,
          displayName,
          additionalFields: {},
        },
        {},
        mockCreatedAsset
      );

      const result = await create.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe(displayName);
      expect(result[0].json.assetTypeId).toBe(assetTypeId);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/assets/v2.0/Assets'),
          body: {
            assetTypeId,
            displayName,
          },
        })
      );
    });

    it('should create an asset with all additional fields', async () => {
      const assetTypeId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
      const displayName = 'Dell Latitude 7490';
      const additionalFields = {
        comment: 'Assigned to IT department',
        inventoryNumber: 'INV-2024-001',
        serialNumber: 'SN123456789',
        manufacturer: 'Dell',
        model: 'Latitude 7490',
        location: 'Building A, Floor 3',
        purchaseDate: '2024-01-15T00:00:00Z',
        purchasePrice: 1299.99,
      };

      const mockCreatedAsset = {
        id: '12345678-1234-1234-1234-123456789abc',
        assetTypeId,
        displayName,
        ...additionalFields,
      };

      const mockContext = createMockExecuteFunctions(
        {
          assetTypeId,
          displayName,
          additionalFields,
        },
        {},
        mockCreatedAsset
      );

      const result = await create.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.serialNumber).toBe(additionalFields.serialNumber);
      expect(result[0].json.manufacturer).toBe(additionalFields.manufacturer);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          body: {
            assetTypeId,
            displayName,
            ...additionalFields,
          },
        })
      );
    });

    it('should handle errors when creating asset with invalid type', async () => {
      const mockContext = createMockExecuteFunctions({
        assetTypeId: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        displayName: 'Test Asset',
        additionalFields: {},
      });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Request failed with status code 400');
        error.statusCode = 400;
        throw error;
      });

      await expect(create.call(mockContext, 0)).rejects.toThrow('400');
    });

    it('should throw NodeOperationError for invalid assetTypeId GUID', async () => {
      const mockContext = createMockExecuteFunctions({
        assetTypeId: 'not-a-guid',
        displayName: 'Test Asset',
        additionalFields: {},
      });
      await expect(create.call(mockContext, 0)).rejects.toThrow(NodeOperationError);
    });
  });

  describe('update()', () => {
    it('should update an asset with single field', async () => {
      const assetId = '12345678-1234-1234-1234-123456789abc';
      const updateFields = {
        displayName: 'Updated Asset Name',
      };

      const mockUpdatedAsset = {
        id: assetId,
        displayName: 'Updated Asset Name',
        assetType: 'Laptop',
      };

      const mockContext = createMockExecuteFunctions(
        {
          assetId,
          updateFields,
        },
        {},
        mockUpdatedAsset
      );

      let patchCalled = false;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchCalled = true;
          return undefined;
        }
        return mockUpdatedAsset;
      });

      const result = await update.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.displayName).toBe('Updated Asset Name');
      expect(patchCalled).toBe(true);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should update asset with multiple fields', async () => {
      const assetId = '22222222-2222-2222-2222-222222222222';
      const updateFields = {
        displayName: 'Updated Name',
        location: 'Building B',
        comment: 'Moved to new location',
      };

      const mockUpdatedAsset = {
        id: assetId,
        ...updateFields,
      };

      const mockContext = createMockExecuteFunctions(
        {
          assetId,
          updateFields,
        },
        {},
        mockUpdatedAsset
      );

      let patchBody: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchBody = options.body;
          return undefined;
        }
        return mockUpdatedAsset;
      });

      const result = await update.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(patchBody).toBeDefined();
      expect(patchBody).toHaveLength(3);
      expect(patchBody).toEqual(
        expect.arrayContaining([
          { op: 'replace', path: '/displayName', value: 'Updated Name' },
          { op: 'replace', path: '/location', value: 'Building B' },
          { op: 'replace', path: '/comment', value: 'Moved to new location' },
        ])
      );
    });

    it('should throw error when no fields to update', async () => {
      const assetId = '33333333-3333-3333-3333-333333333333';
      const mockContext = createMockExecuteFunctions(
        {
          assetId,
          updateFields: {},
        },
        {},
        {}
      );

      await expect(update.call(mockContext, 0)).rejects.toThrow('No fields to update');
    });

    it('should ignore empty string values in update', async () => {
      const assetId = '44444444-4444-4444-4444-444444444444';
      const updateFields = {
        displayName: 'valid-name',
        comment: '',
        location: null,
      };

      const mockUpdatedAsset = {
        id: assetId,
        displayName: 'valid-name',
      };

      const mockContext = createMockExecuteFunctions(
        {
          assetId,
          updateFields,
        },
        {},
        mockUpdatedAsset
      );

      let patchBody: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchBody = options.body;
          return undefined;
        }
        return mockUpdatedAsset;
      });

      const result = await update.call(mockContext, 0);

      expect(patchBody).toBeDefined();
      expect(patchBody).toHaveLength(1);
      expect(patchBody[0]).toEqual({
        op: 'replace',
        path: '/displayName',
        value: 'valid-name',
      });
    });

    it('should handle errors when updating non-existent asset', async () => {
      const assetId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions({
        assetId,
        updateFields: { displayName: 'new-name' },
      });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      await expect(update.call(mockContext, 0)).rejects.toThrow('404');
    });

    it('should use JSON Patch format for PATCH request', async () => {
      const assetId = '55555555-5555-5555-5555-555555555555';
      const updateFields = {
        displayName: 'test-name',
      };

      const mockContext = createMockExecuteFunctions(
        {
          assetId,
          updateFields,
        },
        {},
        { id: assetId, displayName: 'test-name' }
      );

      let patchRequest: any;
      mockContext.helpers.httpRequest = vi.fn(async (options: any) => {
        if (options.method === 'PATCH') {
          patchRequest = options;
          return undefined;
        }
        return { id: assetId, displayName: 'test-name' };
      });

      await update.call(mockContext, 0);

      expect(patchRequest.url).toBe(`/assets/v2.0/Assets/${assetId}`);
      expect(patchRequest.body).toBeInstanceOf(Array);
      expect(patchRequest.body[0]).toHaveProperty('op', 'replace');
      expect(patchRequest.body[0]).toHaveProperty('path', '/displayName');
      expect(patchRequest.body[0]).toHaveProperty('value', 'test-name');
    });

    it('should throw NodeOperationError for invalid assetId GUID', async () => {
      const mockContext = createMockExecuteFunctions({
        assetId: 'invalid-guid-format',
        updateFields: { displayName: 'New Name' },
      });
      await expect(update.call(mockContext, 0)).rejects.toThrow(NodeOperationError);
    });
  });

  describe('deleteAsset()', () => {
    it('should delete an asset by ID', async () => {
      const assetId = '12345678-1234-1234-1234-123456789abc';
      const mockContext = createMockExecuteFunctions(
        { assetId },
        {},
        {}
      );

      const result = await deleteAsset.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        success: true,
        deletedId: assetId,
      });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: expect.stringContaining(`/assets/v2.0/Assets/${assetId}`),
        })
      );
    });

    it('should handle errors when deleting non-existent asset', async () => {
      const assetId = '00000000-0000-0000-0000-000000000000';
      const mockContext = createMockExecuteFunctions({ assetId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      await expect(deleteAsset.call(mockContext, 0)).rejects.toThrow('404');
    });

    it('should throw NodeOperationError for invalid assetId GUID', async () => {
      const mockContext = createMockExecuteFunctions({ assetId: 'not-a-valid-guid' });
      await expect(deleteAsset.call(mockContext, 0)).rejects.toThrow(NodeOperationError);
    });
  });

  describe('Credential Configuration', () => {
    it('should use correct base URL from credentials', async () => {
      const assetId = '12345678-1234-1234-1234-123456789abc';
      const mockAsset = { id: assetId, displayName: 'Test Asset' };

      const mockContext = createMockExecuteFunctions(
        { assetId },
        { baseUrl: 'https://custom-bms-server:443/bconnect' },
        mockAsset
      );

      await get.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom-bms-server:443/bconnect',
        })
      );
    });

    it('should use SSL skip option from credentials', async () => {
      const assetId = '12345678-1234-1234-1234-123456789abc';
      const mockAsset = { id: assetId, displayName: 'Test Asset' };

      const mockContext = createMockExecuteFunctions(
        { assetId },
        { ignoreSslIssues: true },
        mockAsset
      );

      await get.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          skipSslCertificateValidation: true,
        })
      );
    });
  });

  // ============================================================================
  // ASSET TYPES OPERATIONS
  // ============================================================================

  describe('getAssetTypes()', () => {
    it('should fetch all asset types with pagination', async () => {
      const mockAssetTypes = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'type-1', name: 'Laptop', description: 'Laptop computers' },
          { id: 'type-2', name: 'Monitor', description: 'Display monitors' },
          { id: 'type-3', name: 'Printer', description: 'Printing devices' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockAssetTypes
      );

      const result = await getAssetTypes.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.name).toBe('Laptop');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/assets/v2.0/AssetTypes'),
        })
      );
    });

    it('should fetch all asset types when returnAll is true', async () => {
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'type-1', name: 'Type 1' },
          { id: 'type-2', name: 'Type 2' },
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
          { id: 'type-3', name: 'Type 3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getAssetTypes.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAssetType()', () => {
    it('should fetch a single asset type by ID', async () => {
      const assetTypeId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
      const mockAssetType = {
        id: assetTypeId,
        name: 'Laptop',
        description: 'Laptop computers',
        category: 'Hardware',
      };

      const mockContext = createMockExecuteFunctions(
        { assetTypeId },
        {},
        mockAssetType
      );

      const result = await getAssetType.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockAssetType);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/assets/v2.0/AssetTypes/${assetTypeId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent asset types', async () => {
      const assetTypeId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
      const mockContext = createMockExecuteFunctions({ assetTypeId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getAssetType.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  describe('createAssetType()', () => {
    it('should create a new asset type', async () => {
      const name = 'Tablet';
      const mockResponse = {
        id: 'type-new',
        name,
      };

      const mockContext = createMockExecuteFunctions(
        { name, additionalFields: {} },
        {},
        mockResponse
      );

      const result = await createAssetType.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.name).toBe(name);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/assets/v2.0/AssetTypes'),
          body: expect.objectContaining({ name }),
        })
      );
    });

    it('should create asset type with description', async () => {
      const name = 'Smartphone';
      const description = 'Mobile phones';
      const mockResponse = { id: 'type-new', name, description };

      const mockContext = createMockExecuteFunctions(
        { name, additionalFields: { description } },
        {},
        mockResponse
      );

      const result = await createAssetType.call(mockContext, 0);

      expect(result[0].json.description).toBe(description);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({ name, description }),
        })
      );
    });
  });

  describe('deleteAssetType()', () => {
    it('should delete an asset type', async () => {
      const assetTypeId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
      const mockContext = createMockExecuteFunctions(
        { assetTypeId },
        {},
        {}
      );

      const result = await deleteAssetType.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toEqual({ success: true, deletedId: assetTypeId });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: expect.stringContaining(`/assets/v2.0/AssetTypes/${assetTypeId}`),
        })
      );
    });
  });

  // ============================================================================
  // ASSET ORGANIZATION OPERATIONS
  // ============================================================================

  describe('getAssetsByEndpoint()', () => {
    it('should fetch assets for a specific endpoint', async () => {
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockAssets = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'asset-1', displayName: 'Laptop', endpointId },
          { id: 'asset-2', displayName: 'Monitor', endpointId },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { endpointId, returnAll: false, limit: 50 },
        {},
        mockAssets
      );

      const result = await getAssetsByEndpoint.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/assets/v2.0/WindowsEndpoint/${endpointId}/Assets`),
        })
      );
    });
  });

  describe('getAssetsByLogicalGroup()', () => {
    it('should fetch assets for a logical group', async () => {
      const logicalGroupId = '22222222-2222-2222-2222-222222222222';
      const mockAssets = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'asset-1', displayName: 'Laptop 1' },
          { id: 'asset-2', displayName: 'Laptop 2' },
          { id: 'asset-3', displayName: 'Laptop 3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { logicalGroupId, returnAll: false, limit: 50 },
        {},
        mockAssets
      );

      const result = await getAssetsByLogicalGroup.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/assets/v2.0/LogicalGroups/${logicalGroupId}/Assets`),
        })
      );
    });
  });

  // ============================================================================
  // ASSET STOCK OPERATIONS
  // ============================================================================

  describe('getAssetStockAssets()', () => {
    it('should fetch assets in stock', async () => {
      const mockStockAssets = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'asset-1', displayName: 'New Laptop', inStock: true },
          { id: 'asset-2', displayName: 'New Monitor', inStock: true },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockStockAssets
      );

      const result = await getAssetStockAssets.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/assets/v2.0/AssetStock/Assets'),
        })
      );
    });
  });

  describe('getAssetStockFolders()', () => {
    it('should fetch all stock folders', async () => {
      const mockFolders = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'folder-1', name: 'Warehouse A', parentId: null },
          { id: 'folder-2', name: 'Shelf 1', parentId: 'folder-1' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockFolders
      );

      const result = await getAssetStockFolders.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/assets/v2.0/AssetStock/Folders'),
        })
      );
    });
  });

  describe('createAssetStockFolder()', () => {
    it('should create a new stock folder', async () => {
      const name = 'Warehouse B';
      const mockResponse = {
        id: 'folder-new',
        name,
        parentId: null,
      };

      const mockContext = createMockExecuteFunctions(
        { name, additionalFields: {} },
        {},
        mockResponse
      );

      const result = await createAssetStockFolder.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json.name).toBe(name);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/assets/v2.0/AssetStock/Folders'),
          body: expect.objectContaining({ name }),
        })
      );
    });
  });

  describe('updateAssetStockFolder()', () => {
    it('should update a stock folder', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const newName = 'Updated Warehouse';
      const mockResponse = { id: folderId, name: newName };

      const mockContext = createMockExecuteFunctions(
        { folderId, updateFields: { name: newName } },
        {},
        {},
        [{}, mockResponse]
      );

      const result = await updateAssetStockFolder.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json.name).toBe(newName);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: expect.stringContaining(`/assets/v2.0/AssetStock/Folders/${folderId}`),
        })
      );
    });

    it('should throw error when no fields to update', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockContext = createMockExecuteFunctions({
        folderId,
        updateFields: {},
      });

      await expect(updateAssetStockFolder.call(mockContext, 0)).rejects.toThrow('No fields to update');
    });
  });

  describe('deleteAssetStockFolder()', () => {
    it('should delete a stock folder', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockContext = createMockExecuteFunctions(
        { folderId },
        {},
        {}
      );

      const result = await deleteAssetStockFolder.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toEqual({ success: true, deletedId: folderId });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: expect.stringContaining(`/assets/v2.0/AssetStock/Folders/${folderId}`),
        })
      );
    });
  });
});

// ============================================================================
// Phase 4: Asset Operations
// ============================================================================

const pageResponseAsset = (data: any[]) => ({ data, currentPage: 0, pageSize: 50, totalCount: data.length });

describe('Asset Phase 4 - AD Object and OrgUnit Operations', () => {
  describe('getAssetsByADObject()', () => {
    it('should return paginated assets for an AD object', async () => {
      const mockContext = createMockExecuteFunctions(
        { adObjectId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', returnAll: false, limit: 5 },
        {},
        pageResponseAsset([{ id: 'asset1' }, { id: 'asset2' }]),
      );
      const result = await getAssetsByADObject.call(mockContext, 0);
      expect(result).toHaveLength(2);
    });
  });

  describe('getAssetsByOrgUnit()', () => {
    it('should return paginated assets for an org unit', async () => {
      const mockContext = createMockExecuteFunctions(
        { orgUnitId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', returnAll: false, limit: 5 },
        {},
        pageResponseAsset([{ id: 'asset3' }]),
      );
      const result = await getAssetsByOrgUnit.call(mockContext, 0);
      expect(result).toHaveLength(1);
    });
  });

  // ============================================================================
  // PHASE 8B — Asset Stock / Asset Type Folder Operations
  // ============================================================================

  describe('getAssetStockFolder()', () => {
    it('should fetch a single asset stock folder by ID', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockFolder = { id: folderId, name: 'Stock Folder A' };
      const mockContext = createMockExecuteFunctions({ folderId }, {}, mockFolder);

      const result = await getAssetStockFolder.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockFolder);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'GET', url: expect.stringContaining(`/assets/v2.0/AssetStock/Folders/${folderId}`) }),
      );
    });
  });

  describe('getAssetStockSubFolders()', () => {
    it('should fetch sub-folders of an asset stock folder', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockContext = createMockExecuteFunctions(
        { folderId, returnAll: false, limit: 50 },
        {},
        pageResponseAsset([{ id: 'sub-1', name: 'Sub A' }, { id: 'sub-2', name: 'Sub B' }]),
      );

      const result = await getAssetStockSubFolders.call(mockContext, 0);

      expect(result).toHaveLength(2);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/assets/v2.0/AssetStock/Folders/${folderId}/Folders`) }),
      );
    });
  });

  describe('getAssetTypeFolders()', () => {
    it('should fetch asset type folders with pagination', async () => {
      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        pageResponseAsset([{ id: 'tf-1', name: 'Type Folder A' }]),
      );

      const result = await getAssetTypeFolders.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining('/assets/v2.0/AssetTypes/Folders') }),
      );
    });
  });

  describe('getAssetTypeFolder()', () => {
    it('should fetch a single asset type folder by ID', async () => {
      const assetTypeFolderId = '90909090-9090-9090-9090-909090909090';
      const mockFolder = { id: assetTypeFolderId, name: 'Type Folder X' };
      const mockContext = createMockExecuteFunctions({ assetTypeFolderId }, {}, mockFolder);

      const result = await getAssetTypeFolder.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockFolder);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}`) }),
      );
    });
  });

  describe('createAssetTypeFolder()', () => {
    it('should create an asset type folder', async () => {
      const mockFolder = { id: 'new-atf', name: 'New Type Folder' };
      const mockContext = createMockExecuteFunctions(
        { name: 'New Type Folder', additionalFields: {} }, {}, mockFolder,
      );

      const result = await createAssetTypeFolder.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(result[0].json.name).toBe('New Type Folder');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'POST', url: expect.stringContaining('/assets/v2.0/AssetTypes/Folders') }),
      );
    });
  });

  describe('updateAssetTypeFolder()', () => {
    it('should update an asset type folder via PATCH', async () => {
      const assetTypeFolderId = '90909090-9090-9090-9090-909090909090';
      const mockFolder = { id: assetTypeFolderId, name: 'Updated Folder' };
      const mockContext = createMockExecuteFunctions(
        { assetTypeFolderId, updateFields: { name: 'Updated Folder' } },
        {},
        mockFolder,
      );

      const result = await updateAssetTypeFolder.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'PATCH', url: expect.stringContaining(`/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}`) }),
      );
    });

    it('should throw when no update fields provided', async () => {
      const assetTypeFolderId = '90909090-9090-9090-9090-909090909090';
      const mockContext = createMockExecuteFunctions(
        { assetTypeFolderId, updateFields: {} }, {}, {},
      );

      await expect(updateAssetTypeFolder.call(mockContext, 0)).rejects.toThrow('No fields to update specified');
    });
  });

  describe('deleteAssetTypeFolder()', () => {
    it('should delete an asset type folder', async () => {
      const assetTypeFolderId = '90909090-9090-9090-9090-909090909090';
      const mockContext = createMockExecuteFunctions({ assetTypeFolderId }, {}, {});

      const result = await deleteAssetTypeFolder.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ success: true, deletedId: assetTypeFolderId });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'DELETE', url: expect.stringContaining(`/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}`) }),
      );
    });
  });

  describe('getAssetTypeFolderSubFolders()', () => {
    it('should fetch sub-folders of an asset type folder', async () => {
      const assetTypeFolderId = '90909090-9090-9090-9090-909090909090';
      const mockContext = createMockExecuteFunctions(
        { assetTypeFolderId, returnAll: false, limit: 50 },
        {},
        pageResponseAsset([{ id: 'sub-atf-1', name: 'Sub Type Folder' }]),
      );

      const result = await getAssetTypeFolderSubFolders.call(mockContext, 0);

      expect(result).toHaveLength(1);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining(`/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}/Folders`) }),
      );
    });
  });
});
