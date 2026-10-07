/**
 * System Tests for Variables API
 *
 * Tests against live bConnect API
 * Includes read and write operations with cleanup
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext } from './setup';
import * as variable from '../../nodes/BaramundiSoftware/actions/variable/variable.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Variables API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;
  let createdVariableDefinitionIds: string[] = [];

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  afterAll(async () => {
    // Cleanup: Delete any variable definitions created during tests
    for (const id of createdVariableDefinitionIds) {
      try {
        const context = createSystemTestContext({ variableDefinitionId: id }, config!);
        await variable.deleteVariableDefinition.call(context, 0);
        console.log(`Cleaned up test variable definition: ${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup variable definition ${id}:`, error);
      }
    }
  });

  describe('Variable Definitions - Read Operations', () => {
    it('should fetch variable definitions from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await variable.getVariableDefinitions.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        console.log('Sample variable definition:', JSON.stringify(result[0].json, null, 2));
        expect(result[0].json).toHaveProperty('id');
        expect(result[0].json).toHaveProperty('name');
      }
    });

    it('should get a specific variable definition by ID', async () => {
      // First get a variable definition
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const definitions = await variable.getVariableDefinitions.call(listContext, 0);

      if (definitions.length === 0) {
        console.warn('No variable definitions available for testing');
        return;
      }

      const definitionId = definitions[0].json.id as string;

      const context = createSystemTestContext({
        variableDefinitionId: definitionId,
      }, config!);

      const result = await variable.getVariableDefinition.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(definitionId);
    });
  });

  describe('Variable Definitions - Full CRUD', () => {
    let createdDefinitionId: string;

    it('should create, read, update, and delete a variable definition', async () => {
      // CREATE
      const createContext = createSystemTestContext({
        name: `SystemTest_VarDef_${Date.now()}`,
        category: 'Client',
        scopes: ['Endpoint'],
        type: 'String',
        additionalFields: {
          comment: 'System test variable definition',
        },
      }, config!);

      const created = await variable.createVariableDefinition.call(createContext, 0);
      expect(created).toBeDefined();
      expect(created[0].json).toHaveProperty('id');
      expect(created[0].json.name).toContain('SystemTest_VarDef_');
      createdDefinitionId = created[0].json.id as string;
      createdVariableDefinitionIds.push(createdDefinitionId);

      // READ
      const readContext = createSystemTestContext({
        variableDefinitionId: createdDefinitionId,
      }, config!);

      const read = await variable.getVariableDefinition.call(readContext, 0);
      expect(read).toBeDefined();
      expect(read[0].json.id).toBe(createdDefinitionId);

      // UPDATE
      const updateContext = createSystemTestContext({
        variableDefinitionId: createdDefinitionId,
        updateFields: {
          comment: 'Updated comment',
        },
      }, config!);

      const updated = await variable.updateVariableDefinition.call(updateContext, 0);
      expect(updated).toBeDefined();
      expect(updated[0].json.id).toBe(createdDefinitionId);
      expect(updated[0].json.comment).toBe('Updated comment');

      // DELETE
      const deleteContext = createSystemTestContext({
        variableDefinitionId: createdDefinitionId,
      }, config!);

      const deleted = await variable.deleteVariableDefinition.call(deleteContext, 0);
      expect(deleted).toBeDefined();
      expect(deleted[0].json.success).toBe(true);

      // Remove from cleanup list
      createdVariableDefinitionIds = createdVariableDefinitionIds.filter(id => id !== createdDefinitionId);
    });
  });

  describe('Variable Instances - Read Operations', () => {
    it('should fetch variable instances from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await variable.getVariableInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
      }
    });

    it('should get a specific variable instance by ID', async () => {
      // First get a variable instance
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const instances = await variable.getVariableInstances.call(listContext, 0);

      if (instances.length === 0) {
        console.warn('No variable instances available for testing');
        return;
      }

      const instanceId = instances[0].json.id as string;

      const context = createSystemTestContext({
        variableInstanceId: instanceId,
      }, config!);

      const result = await variable.getVariableInstance.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(instanceId);
    });

    it('should update a variable instance', async () => {
      // Get an existing instance
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const instances = await variable.getVariableInstances.call(listContext, 0);

      if (instances.length === 0) {
        console.warn('No variable instances available for testing update');
        return;
      }

      const instanceId = instances[0].json.id as string;
      const originalValue = instances[0].json.value;

      // Update the instance
      const updateContext = createSystemTestContext({
        variableInstanceId: instanceId,
        updateFields: {
          value: `SystemTest_${Date.now()}`,
        },
      }, config!);

      const result = await variable.updateVariableInstance.call(updateContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(instanceId);

      // Restore original value
      try {
        const restoreContext = createSystemTestContext({
          variableInstanceId: instanceId,
          updateFields: {
            value: originalValue,
          },
        }, config!);

        await variable.updateVariableInstance.call(restoreContext, 0);
      } catch (error) {
        console.warn('Failed to restore original value:', error);
      }
    });
  });

  describe('Variable Instances By Entity', () => {
    it('should fetch variable instances by endpoint', async () => {
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

      const result = await variable.getVariableInstancesByEndpoint.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch variable instances by logical group', async () => {
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

      const result = await variable.getVariableInstancesByLogicalGroup.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch variable instances by AD object', async () => {
      // First, get an AD object ID
      const adObjectsContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const adObjects = await (await import('../../nodes/Baramundi/actions/activeDirectory/activeDirectory.execute')).getADObjects.call(adObjectsContext, 0);

      if (adObjects.length === 0) {
        console.warn('No AD objects available for testing');
        return;
      }

      const adObjectId = adObjects[0].json.id as string;

      const context = createSystemTestContext({
        adObjectId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await variable.getVariableInstancesByADObject.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid variable definition ID', async () => {
      const context = createSystemTestContext({
        variableDefinitionId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(variable.getVariableDefinition.call(context, 0)).rejects.toThrow();
    });

    it('should handle invalid variable instance ID', async () => {
      const context = createSystemTestContext({
        variableInstanceId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(variable.getVariableInstance.call(context, 0)).rejects.toThrow();
    });
  });
});
