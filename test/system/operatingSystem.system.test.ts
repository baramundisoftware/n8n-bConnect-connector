/**
 * System Tests for Operating Systems API
 *
 * Tests against live bConnect API
 * Includes read and write operations with cleanup
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext } from './setup';
import * as os from '../../nodes/BaramundiAdmin/actions/operatingSystem/operatingSystem.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Operating Systems API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;
  let createdFolderIds: string[] = [];

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  afterAll(async () => {
    // Cleanup: Delete any folders created during tests
    for (const id of createdFolderIds) {
      try {
        const context = createSystemTestContext({ folderId: id }, config!);
        await os.deleteFolder.call(context, 0);
        console.log(`Cleaned up test folder: ${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup folder ${id}:`, error);
      }
    }
  });

  describe('Folder Operations - Read', () => {
    it('should fetch OS folders from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await os.getFolders.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
        expect(result[0].json).toHaveProperty('name');
      }
    });

    it('should get a specific OS folder by ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const folders = await os.getFolders.call(listContext, 0);

      if (folders.length === 0) {
        console.warn('No OS folders available for testing');
        return;
      }

      const folderId = folders[0].json.id as string;

      const context = createSystemTestContext({
        folderId,
      }, config!);

      const result = await os.getFolder.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(folderId);
    });

    it('should get subfolders by parent folder ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const folders = await os.getFolders.call(listContext, 0);

      if (folders.length === 0) {
        console.warn('No OS folders available for testing');
        return;
      }

      const folderId = folders[0].json.id as string;

      const context = createSystemTestContext({
        folderId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await os.getFoldersByFolderId.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Folder Operations - CRUD', () => {
    it('should create, update, and delete an OS folder', async () => {
      // Get an existing folder to use as parent
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const folders = await os.getFolders.call(listContext, 0);

      if (folders.length === 0) {
        console.warn('No OS folders available to use as parent');
        return;
      }

      const parentId = folders[0].json.id as string;

      // CREATE
      const createContext = createSystemTestContext({
        name: `SystemTest_OSFolder_${Date.now()}`,
        parentId,
      }, config!);

      const created = await os.createFolder.call(createContext, 0);
      expect(created).toBeDefined();
      expect(created[0].json).toHaveProperty('id');
      expect(created[0].json.name).toContain('SystemTest_OSFolder_');
      const folderId = created[0].json.id as string;
      createdFolderIds.push(folderId);

      // UPDATE
      const updateContext = createSystemTestContext({
        folderId,
        updateFields: {
          comment: 'Updated OS folder comment',
        },
      }, config!);

      const updated = await os.updateFolder.call(updateContext, 0);
      expect(updated).toBeDefined();
      expect(updated[0].json.id).toBe(folderId);

      // DELETE
      const deleteContext = createSystemTestContext({
        folderId,
      }, config!);

      const deleted = await os.deleteFolder.call(deleteContext, 0);
      expect(deleted).toBeDefined();
      expect(deleted[0].json.success).toBe(true);

      // Remove from cleanup list
      createdFolderIds = createdFolderIds.filter(id => id !== folderId);
    });
  });

  describe('Windows Endpoints Operations', () => {
    it('should fetch Windows endpoints from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await os.getWindowsEndpoints.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
      }
    });

    it('should get a specific Windows endpoint by ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const endpoints = await os.getWindowsEndpoints.call(listContext, 0);

      if (endpoints.length === 0) {
        console.warn('No Windows endpoints available for testing');
        return;
      }

      const endpointId = endpoints[0].json.id as string;

      const context = createSystemTestContext({
        endpointId,
      }, config!);

      const result = await os.getWindowsEndpoint.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(endpointId);
    });

    it('should support pagination', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 5,
      }, config!);

      const result = await os.getWindowsEndpoints.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('should update a Windows endpoint', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const endpoints = await os.getWindowsEndpoints.call(listContext, 0);

      if (endpoints.length === 0) {
        console.warn('No Windows endpoints available for testing update');
        return;
      }

      const endpointId = endpoints[0].json.id as string;

      const updateContext = createSystemTestContext({
        endpointId,
        updateFields: {
          comment: `SystemTest_${Date.now()}`,
        },
      }, config!);

      const result = await os.updateWindowsEndpoint.call(updateContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(endpointId);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid folder ID', async () => {
      const context = createSystemTestContext({
        folderId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(os.getFolder.call(context, 0)).rejects.toThrow();
    });

    it('should handle invalid endpoint ID', async () => {
      const context = createSystemTestContext({
        endpointId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(os.getWindowsEndpoint.call(context, 0)).rejects.toThrow();
    });
  });
});
