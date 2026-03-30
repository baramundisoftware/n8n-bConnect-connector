/**
 * System Tests for Assets API
 *
 * Tests against live bConnect API
 * Includes read and write operations with cleanup
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext } from './setup';
import * as asset from '../../nodes/Baramundi/actions/asset/asset.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Assets API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;
  let createdAssetIds: string[] = [];
  let createdAssetTypeIds: string[] = [];
  let createdStockFolderIds: string[] = [];

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  afterAll(async () => {
    // Cleanup: Delete assets first, then asset types and folders
    for (const id of createdAssetIds) {
      try {
        const context = createSystemTestContext({ assetId: id }, config!);
        await asset.deleteAsset.call(context, 0);
        console.log(`Cleaned up test asset: ${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup asset ${id}:`, error);
      }
    }

    for (const id of createdAssetTypeIds) {
      try {
        const context = createSystemTestContext({ assetTypeId: id }, config!);
        await asset.deleteAssetType.call(context, 0);
        console.log(`Cleaned up test asset type: ${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup asset type ${id}:`, error);
      }
    }

    for (const id of createdStockFolderIds) {
      try {
        const context = createSystemTestContext({ folderId: id }, config!);
        await asset.deleteAssetStockFolder.call(context, 0);
        console.log(`Cleaned up test stock folder: ${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup stock folder ${id}:`, error);
      }
    }
  });

  describe('Asset Management - Read Operations', () => {
    it('should fetch assets from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await asset.getMany.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('assetId');
        expect(result[0].json).toHaveProperty('name');
      }
    });

    it('should get a specific asset by ID', async () => {
      // First get an asset
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const assets = await asset.getMany.call(listContext, 0);

      if (assets.length === 0) {
        console.warn('No assets available for testing');
        return;
      }

      const assetId = assets[0].json.assetId as string;

      const context = createSystemTestContext({
        assetId,
      }, config!);

      const result = await asset.get.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.assetId).toBe(assetId);
    });

    it('should support search and orderBy options', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 5,
        options: {
          orderBy: 'Name asc',
        },
      }, config!);

      const result = await asset.getMany.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Asset Management - Full CRUD', () => {
    let createdAssetId: string;
    let assetTypeId: string;

    // Skip this test - creating assets requires valid assetTypeId and proper parent hierarchy setup
    it.skip('should create, read, update, and delete an asset', async () => {
      // First, get or create an asset type
      const typesContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const types = await asset.getAssetTypes.call(typesContext, 0);

      if (types.length === 0) {
        console.warn('No existing asset types available, cannot create asset without asset type');
        return;
      } else {
        assetTypeId = types[0].json.guid as string;
      }

      // CREATE
      const createContext = createSystemTestContext({
        assetTypeId,
        displayName: `SystemTest_Asset_${Date.now()}`,
        additionalFields: {
          name: `SystemTest_Asset_${Date.now()}`,  // Required field
          ownerType: 'Machine',  // Required field
          comments: 'System test asset',
        },
      }, config!);

      const created = await asset.create.call(createContext, 0);
      expect(created).toBeDefined();
      expect(created[0].json).toHaveProperty('assetId');
      expect(created[0].json.name).toContain('SystemTest_Asset_');
      createdAssetId = created[0].json.assetId as string;
      createdAssetIds.push(createdAssetId);

      // READ
      const readContext = createSystemTestContext({
        assetId: createdAssetId,
      }, config!);

      const read = await asset.get.call(readContext, 0);
      expect(read).toBeDefined();
      expect(read[0].json.assetId).toBe(createdAssetId);

      // UPDATE
      const updateContext = createSystemTestContext({
        assetId: createdAssetId,
        updateFields: {
          comments: 'Updated comment',
        },
      }, config!);

      const updated = await asset.update.call(updateContext, 0);
      expect(updated).toBeDefined();
      expect(updated[0].json.assetId).toBe(createdAssetId);
      expect(updated[0].json.comments).toBe('Updated comment');

      // DELETE
      const deleteContext = createSystemTestContext({
        assetId: createdAssetId,
      }, config!);

      const deleted = await asset.deleteAsset.call(deleteContext, 0);
      expect(deleted).toBeDefined();
      expect(deleted[0].json.success).toBe(true);

      // Remove from cleanup list
      createdAssetIds = createdAssetIds.filter(id => id !== createdAssetId);
    });
  });

  describe('Asset Types Operations', () => {
    it('should fetch asset types from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await asset.getAssetTypes.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('guid');
        expect(result[0].json).toHaveProperty('name');
      }
    });

    it('should get a specific asset type by ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const types = await asset.getAssetTypes.call(listContext, 0);

      if (types.length === 0) {
        console.warn('No asset types available for testing');
        return;
      }

      const typeId = types[0].json.guid as string;

      const context = createSystemTestContext({
        assetTypeId: typeId,
      }, config!);

      const result = await asset.getAssetType.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.guid).toBe(typeId);
    });

    // Skip this test - creating asset types requires valid parent hierarchy configuration
    it.skip('should create and delete an asset type', async () => {
      // Get an existing asset type to use as parent
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const existingTypes = await asset.getAssetTypes.call(listContext, 0);

      if (existingTypes.length === 0) {
        console.warn('No existing asset types to use as parent, skipping create test');
        return;
      }

      const parentId = existingTypes[0].json.guidParent as string;

      // CREATE - Only include guidParent if it's not null/empty
      const additionalFields: any = {};
      if (parentId && parentId !== '00000000-0000-0000-0000-000000000000') {
        additionalFields.guidParent = parentId;
      }

      const createContext = createSystemTestContext({
        name: `SystemTest_Type_${Date.now()}`,
        additionalFields,
      }, config!);

      const created = await asset.createAssetType.call(createContext, 0);
      expect(created).toBeDefined();
      expect(created[0].json).toHaveProperty('guid');
      expect(created[0].json.name).toContain('SystemTest_Type_');
      const typeId = created[0].json.guid as string;
      createdAssetTypeIds.push(typeId);

      // DELETE
      const deleteContext = createSystemTestContext({
        assetTypeId: typeId,
      }, config!);

      const deleted = await asset.deleteAssetType.call(deleteContext, 0);
      expect(deleted).toBeDefined();
      expect(deleted[0].json.success).toBe(true);

      // Remove from cleanup list
      createdAssetTypeIds = createdAssetTypeIds.filter(id => id !== typeId);
    });
  });

  describe('Asset Organization Operations', () => {
    it('should fetch assets by endpoint', async () => {
      // First, get an endpoint ID
      const endpointsContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const endpoints = await (await import('../../nodes/Baramundi/actions/endpoint/endpoint.execute')).getMany.call(endpointsContext, 0);

      if (endpoints.length === 0) {
        console.warn('No endpoints available for testing');
        return;
      }

      const endpointId = endpoints[0].json.id as string;

      const context = createSystemTestContext({
        endpointId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await asset.getAssetsByEndpoint.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch assets by logical group', async () => {
      // First, get a logical group ID
      const groupsContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const groups = await (await import('../../nodes/Baramundi/actions/endpoint/endpoint.execute')).getLogicalGroups.call(groupsContext, 0);

      if (groups.length === 0) {
        console.warn('No logical groups available for testing');
        return;
      }

      const logicalGroupId = groups[0].json.id as string;

      const context = createSystemTestContext({
        logicalGroupId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await asset.getAssetsByLogicalGroup.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Asset Stock Operations', () => {
    it('should fetch asset stock assets', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await asset.getAssetStockAssets.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch asset stock folders', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await asset.getAssetStockFolders.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should create, update, and delete an asset stock folder', async () => {
      // CREATE
      const createContext = createSystemTestContext({
        name: `SystemTest_StockFolder_${Date.now()}`,
        additionalFields: {
          comment: 'System test stock folder',
        },
      }, config!);

      const created = await asset.createAssetStockFolder.call(createContext, 0);
      expect(created).toBeDefined();
      expect(created[0].json).toHaveProperty('id');
      expect(created[0].json.name).toContain('SystemTest_StockFolder_');
      const folderId = created[0].json.id as string;
      createdStockFolderIds.push(folderId);

      // UPDATE
      const updateContext = createSystemTestContext({
        folderId,
        updateFields: {
          comment: 'Updated stock folder comment',
        },
      }, config!);

      const updated = await asset.updateAssetStockFolder.call(updateContext, 0);
      expect(updated).toBeDefined();
      expect(updated[0].json.id).toBe(folderId);

      // DELETE
      const deleteContext = createSystemTestContext({
        folderId,
      }, config!);

      const deleted = await asset.deleteAssetStockFolder.call(deleteContext, 0);
      expect(deleted).toBeDefined();
      expect(deleted[0].json.success).toBe(true);

      // Remove from cleanup list
      createdStockFolderIds = createdStockFolderIds.filter(id => id !== folderId);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid asset ID', async () => {
      const context = createSystemTestContext({
        assetId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(asset.get.call(context, 0)).rejects.toThrow();
    });

    it('should handle invalid asset type ID', async () => {
      const context = createSystemTestContext({
        assetTypeId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(asset.getAssetType.call(context, 0)).rejects.toThrow();
    });
  });
});
