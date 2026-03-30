/**
 * System Tests for Endpoint API
 *
 * Tests against live bConnect API
 * Includes read and write operations with cleanup
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext, generateTestResourceName } from './setup';
import * as endpoint from '../../nodes/Baramundi/actions/endpoint/endpoint.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Endpoint API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;
  let createdEndpointIds: string[] = [];

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  afterAll(async () => {
    // Cleanup: Delete any endpoints created during tests
    for (const id of createdEndpointIds) {
      try {
        const context = createSystemTestContext({ endpointId: id }, config!);
        await endpoint.deleteEndpoint.call(context, 0);
        console.log(`Cleaned up test endpoint: ${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup endpoint ${id}:`, error);
      }
    }
  });

  describe('Read Operations', () => {
    it('should fetch endpoints from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await endpoint.getMany.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(10);

      // Verify structure
      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
        expect(result[0].json).toHaveProperty('displayName');
      }
    });

    it('should get a specific endpoint by ID', async () => {
      // First get an endpoint
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const endpoints = await endpoint.getMany.call(listContext, 0);

      if (endpoints.length === 0) {
        console.warn('No endpoints available for testing');
        return;
      }

      const endpointId = endpoints[0].json.id as string;

      // Now get that specific endpoint
      const context = createSystemTestContext({
        endpointSelection: endpointId,
        endpointId,
      }, config!);

      const result = await endpoint.get.call(context, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.id).toBe(endpointId);
      expect(result[0].json).toHaveProperty('displayName');
    });

    it('should support orderBy', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
        options: { orderBy: 'DisplayName asc' },
      }, config!);

      const result = await endpoint.getMany.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Update Operations', () => {
    it('should update an endpoint comment', async () => {
      // Get an existing endpoint
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const endpoints = await endpoint.getMany.call(listContext, 0);

      if (endpoints.length === 0) {
        console.warn('No endpoints available for testing update');
        return;
      }

      const endpointId = endpoints[0].json.id as string;
      const originalComment = endpoints[0].json.comment as string;

      // Update the endpoint
      const updateContext = createSystemTestContext({
        endpointSelection: endpointId,
        endpointId,
        updateFields: {
          comment: 'System test comment - ' + new Date().toISOString(),
        },
      }, config!);

      const result = await endpoint.update.call(updateContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(endpointId);
      expect(result[0].json.comment).toContain('System test comment');

      // Restore original comment
      try {
        const restoreContext = createSystemTestContext({
          endpointSelection: endpointId,
          endpointId,
          updateFields: {
            comment: originalComment || '',
          },
        }, config!);

        await endpoint.update.call(restoreContext, 0);
      } catch (error) {
        console.warn('Failed to restore original comment:', error);
      }
    });
  });

  describe('Search Operations', () => {
    it('should search endpoints by query', async () => {
      const context = createSystemTestContext({
        searchQuery: 'Windows',
        returnAll: false,
        limit: 5,
      }, config!);

      const result = await endpoint.search.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Logical Groups Operations', () => {
    let createdGroupId: string;

    it('should create, read, update, and delete a logical group', async () => {
      // CREATE
      const createContext = createSystemTestContext({
        name: `SystemTest_LogicalGroup_${Date.now()}`,
        additionalFields: {
          comment: 'System test logical group',
        },
      }, config!);

      const created = await endpoint.createLogicalGroup.call(createContext, 0);
      expect(created).toBeDefined();
      expect(created[0].json).toHaveProperty('id');
      createdGroupId = created[0].json.id as string;
      createdEndpointIds.push(createdGroupId); // For cleanup

      // READ
      const readContext = createSystemTestContext({
        groupId: createdGroupId,
      }, config!);

      const read = await endpoint.getLogicalGroup.call(readContext, 0);
      expect(read).toBeDefined();
      expect(read[0].json.id).toBe(createdGroupId);

      // UPDATE
      const updateContext = createSystemTestContext({
        groupId: createdGroupId,
        updateFields: {
          comment: 'Updated comment',
        },
      }, config!);

      const updated = await endpoint.updateLogicalGroup.call(updateContext, 0);
      expect(updated).toBeDefined();
      expect(updated[0].json.id).toBe(createdGroupId);

      // DELETE
      const deleteContext = createSystemTestContext({
        groupId: createdGroupId,
      }, config!);

      const deleted = await endpoint.deleteLogicalGroup.call(deleteContext, 0);
      expect(deleted).toBeDefined();
      expect(deleted[0].json.success).toBe(true);

      // Remove from cleanup list
      createdEndpointIds = createdEndpointIds.filter(id => id !== createdGroupId);
    });

    it('should list all logical groups', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await endpoint.getLogicalGroups.call(context, 0);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Static Groups Operations', () => {
    let createdGroupId: string;

    it.skip('should create, read, update, and delete a static group', async () => {
      // Note: Static Groups endpoint may not be available in all bConnect versions
      // CREATE
      const createContext = createSystemTestContext({
        name: `SystemTest_StaticGroup_${Date.now()}`,
        additionalFields: {
          comment: 'System test static group',
        },
      }, config!);

      const created = await endpoint.createStaticGroup.call(createContext, 0);
      expect(created).toBeDefined();
      expect(created[0].json).toHaveProperty('id');
      createdGroupId = created[0].json.id as string;
      createdEndpointIds.push(createdGroupId);

      // READ
      const readContext = createSystemTestContext({
        groupId: createdGroupId,
      }, config!);

      const read = await endpoint.getStaticGroup.call(readContext, 0);
      expect(read).toBeDefined();
      expect(read[0].json.id).toBe(createdGroupId);

      // UPDATE
      const updateContext = createSystemTestContext({
        groupId: createdGroupId,
        updateFields: {
          comment: 'Updated static group comment',
        },
      }, config!);

      const updated = await endpoint.updateStaticGroup.call(updateContext, 0);
      expect(updated).toBeDefined();

      // DELETE
      const deleteContext = createSystemTestContext({
        groupId: createdGroupId,
      }, config!);

      const deleted = await endpoint.deleteStaticGroup.call(deleteContext, 0);
      expect(deleted).toBeDefined();
      expect(deleted[0].json.success).toBe(true);

      createdEndpointIds = createdEndpointIds.filter(id => id !== createdGroupId);
    });

    it.skip('should list all static groups', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await endpoint.getStaticGroups.call(context, 0);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Dynamic Groups Operations', () => {
    it.skip('should get a specific dynamic group', async () => {
      // First get a dynamic group ID
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const groups = await endpoint.getDynamicGroups.call(listContext, 0);

      if (groups.length === 0) {
        console.warn('No dynamic groups available for testing');
        return;
      }

      const groupId = groups[0].json.id as string;

      const context = createSystemTestContext({
        groupId,
      }, config!);

      const result = await endpoint.getDynamicGroup.call(context, 0);
      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(groupId);
    });

    it.skip('should list all dynamic groups', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await endpoint.getDynamicGroups.call(context, 0);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid endpoint ID', async () => {
      const endpointId = '00000000-0000-0000-0000-000000000000';
      const context = createSystemTestContext({
        endpointSelection: endpointId,
        endpointId,
      }, config!);

      await expect(endpoint.get.call(context, 0)).rejects.toThrow();
    });

    it('should handle invalid GUID format', async () => {
      const endpointId = 'invalid-guid';
      const context = createSystemTestContext({
        endpointSelection: '__custom__',
        endpointId,
      }, config!);

      await expect(endpoint.get.call(context, 0)).rejects.toThrow();
    });
  });
});
