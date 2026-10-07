/**
 * System Tests for Server Management API
 *
 * Tests against live bConnect API
 * Mostly read-only operations (safe to run)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext } from './setup';
import * as server from '../../nodes/BaramundiAdmin/actions/serverManagement/serverManagement.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Server Management API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;
  let createdSecurityGroupIds: string[] = [];

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  afterAll(async () => {
    // Cleanup: Delete any security groups created during tests
    for (const id of createdSecurityGroupIds) {
      try {
        const context = createSystemTestContext({ securityGroupId: id }, config!);
        await server.deleteSecurityGroup.call(context, 0);
        console.log(`Cleaned up test security group: ${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup security group ${id}:`, error);
      }
    }
  });

  describe('Management Server Operations', () => {
    it('should get management server info', async () => {
      const context = createSystemTestContext({}, config!);
      const result = await server.getManagementServer.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toHaveProperty('name');
      expect(result[0].json).toHaveProperty('version');
      expect(result[0].json).toHaveProperty('state');
    });

    it('should get gateway info', async () => {
      const context = createSystemTestContext({}, config!);
      const result = await server.getGateway.call(context, 0);

      expect(result).toBeDefined();
      // Gateway returns various properties depending on installation status
    });

    it('should get DIP status', async () => {
      const context = createSystemTestContext({}, config!);
      const result = await server.getDipStatus.call(context, 0);

      expect(result).toBeDefined();
    });

    it('should get VPN appliance info', async () => {
      const context = createSystemTestContext({}, config!);
      const result = await server.getVpnAppliance.call(context, 0);

      expect(result).toBeDefined();
    });
  });

  describe('Microservices Operations', () => {
    it('should fetch microservices from live API', async () => {
      const context = createSystemTestContext({}, config!);
      const result = await server.getMicroservices.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should get a specific microservice by ID', async () => {
      const listContext = createSystemTestContext({}, config!);
      const microservices = await server.getMicroservices.call(listContext, 0);

      if (microservices.length === 0) {
        console.warn('No microservices available for testing');
        return;
      }

      const microserviceId = microservices[0].json.id as string;
      const context = createSystemTestContext({
        microserviceId,
      }, config!);

      const result = await server.getMicroservice.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(microserviceId);
    });

    // Skip microservice control operations - potentially disruptive
    it.skip('should start a microservice', async () => {
      const listContext = createSystemTestContext({}, config!);
      const microservices = await server.getMicroservices.call(listContext, 0);

      if (microservices.length === 0) {
        console.warn('No microservices available for testing');
        return;
      }

      const microserviceId = microservices[0].json.id as string;
      const context = createSystemTestContext({
        microserviceId,
      }, config!);

      const result = await server.startMicroservice.call(context, 0);
      expect(result).toBeDefined();
    });

    it.skip('should stop a microservice', async () => {
      const listContext = createSystemTestContext({}, config!);
      const microservices = await server.getMicroservices.call(listContext, 0);

      if (microservices.length === 0) {
        console.warn('No microservices available for testing');
        return;
      }

      const microserviceId = microservices[0].json.id as string;
      const context = createSystemTestContext({
        microserviceId,
      }, config!);

      const result = await server.stopMicroservice.call(context, 0);
      expect(result).toBeDefined();
    });

    it.skip('should restart a microservice', async () => {
      const listContext = createSystemTestContext({}, config!);
      const microservices = await server.getMicroservices.call(listContext, 0);

      if (microservices.length === 0) {
        console.warn('No microservices available for testing');
        return;
      }

      const microserviceId = microservices[0].json.id as string;
      const context = createSystemTestContext({
        microserviceId,
      }, config!);

      const result = await server.restartMicroservice.call(context, 0);
      expect(result).toBeDefined();
    });
  });

  describe('Cloud Connectors and PXE Relays', () => {
    it('should fetch cloud connectors', async () => {
      const context = createSystemTestContext({}, config!);
      const result = await server.getCloudConnectors.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch PXE relays', async () => {
      const context = createSystemTestContext({}, config!);
      const result = await server.getPxeRelays.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Security Groups Operations', () => {
    it('should fetch security groups from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await server.getSecurityGroups.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
      }
    });

    it('should get a specific security group by ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const groups = await server.getSecurityGroups.call(listContext, 0);

      if (groups.length === 0) {
        console.warn('No security groups available for testing');
        return;
      }

      const groupId = groups[0].json.id as string;
      const context = createSystemTestContext({
        securityGroupId: groupId,
      }, config!);

      const result = await server.getSecurityGroup.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(groupId);
    });

    // Skip CRUD operations - security groups are critical and require careful configuration
    it('should create, update, and delete a security group', async () => {
      // CREATE
      const createContext = createSystemTestContext({
        name: `SystemTest_SecurityGroup_${Date.now()}`,
      }, config!);

      const created = await server.createSecurityGroup.call(createContext, 0);
      expect(created).toBeDefined();
      expect(created[0].json).toHaveProperty('id');
      const groupId = created[0].json.id as string;
      createdSecurityGroupIds.push(groupId);

      // The create answer may carry only the id; read the group back. bConnect-Mock 0.8.0
      // drops groupName from every security group (bConnect-Mock#86), so check it on a real bMS only.
      const read = await server.getSecurityGroup.call(createSystemTestContext({ securityGroupId: groupId }, config!), 0);
      expect(read[0].json.id).toBe(groupId);
      if (process.env.BCONNECT_IS_MOCK !== 'true') {
        expect(read[0].json.groupName).toContain('SystemTest_SecurityGroup_');
      }

      // UPDATE
      const updateContext = createSystemTestContext({
        securityGroupId: groupId,
        updateFields: {
          name: `SystemTest_SecurityGroup_${Date.now()}_renamed`,
        },
      }, config!);

      const updated = await server.updateSecurityGroup.call(updateContext, 0);
      expect(updated).toBeDefined();
      expect(updated[0].json.id).toBe(groupId);

      // DELETE
      const deleteContext = createSystemTestContext({
        securityGroupId: groupId,
      }, config!);

      const deleted = await server.deleteSecurityGroup.call(deleteContext, 0);
      expect(deleted).toBeDefined();
      expect(deleted[0].json.success).toBe(true);

      // Remove from cleanup list
      createdSecurityGroupIds = createdSecurityGroupIds.filter(id => id !== groupId);
    });
  });

  describe('Security Profiles Operations', () => {
    it('should fetch security profiles from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await server.getSecurityProfiles.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
        expect(result[0].json).toHaveProperty('name');
      }
    });

    it('should get a specific security profile by ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const profiles = await server.getSecurityProfiles.call(listContext, 0);

      if (profiles.length === 0) {
        console.warn('No security profiles available for testing');
        return;
      }

      const profileId = profiles[0].json.id as string;
      const context = createSystemTestContext({
        securityProfileId: profileId,
      }, config!);

      const result = await server.getSecurityProfile.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(profileId);
    });
  });

  describe('Access Rights Operations', () => {
    // Skip - requires specific object ID (can use security group ID, etc.)
    it('should fetch access rights for an object', async () => {
      // Get a security group to test access rights on
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const groups = await server.getSecurityGroups.call(listContext, 0);

      if (groups.length === 0) {
        console.warn('No security groups available for testing access rights');
        return;
      }

      const objectId = groups[0].json.id as string;

      const context = createSystemTestContext({
        objectId,
      }, config!);

      const result = await server.getAccessRights.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Server Control Operations', () => {
    // Skip server restart operations - highly disruptive
    it.skip('should restart management server', async () => {
      const context = createSystemTestContext({}, config!);
      const result = await server.restartManagementServer.call(context, 0);
      expect(result).toBeDefined();
    });

    it.skip('should cancel scheduled restart', async () => {
      const context = createSystemTestContext({}, config!);
      const result = await server.cancelScheduledRestart.call(context, 0);
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid microservice ID', async () => {
      const context = createSystemTestContext({
        microserviceId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(server.getMicroservice.call(context, 0)).rejects.toThrow();
    });

    it('should handle invalid security group ID', async () => {
      const context = createSystemTestContext({
        securityGroupId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(server.getSecurityGroup.call(context, 0)).rejects.toThrow();
    });

    it('should handle invalid security profile ID', async () => {
      const context = createSystemTestContext({
        securityProfileId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(server.getSecurityProfile.call(context, 0)).rejects.toThrow();
    });
  });
});
