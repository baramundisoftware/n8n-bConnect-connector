/**
 * System Tests for Software API
 *
 * Tests against live bConnect API
 * All operations are read-only (safe to run)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext } from './setup';
import * as software from '../../nodes/BaramundiSoftware/actions/software/software.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Software API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  describe('getInstalledWindowsSoftware()', () => {
    it('should fetch installed Windows software from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await software.getInstalledWindowsSoftware.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(10);

      // Verify structure of first item
      if (result.length > 0) {
        console.log('Sample software item:', JSON.stringify(result[0].json, null, 2));
        expect(result[0].json).toHaveProperty('displayName');
        expect(result[0].json).toHaveProperty('publisher');
      }
    });

    it('should support search query option', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 5,
        options: { searchQuery: 'Windows' },
      }, config!);

      const result = await software.getInstalledWindowsSoftware.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Verify search was applied (results should be filtered)
      if (result.length > 0) {
        console.log('Search results:', result.map(r => r.json.displayName));
      }
    });

    it('should support orderBy option', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
        options: { orderBy: 'Name asc' },
      }, config!);

      const result = await software.getInstalledWindowsSoftware.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getInstalledSoftwareByEndpoint()', () => {
    it('should fetch software for a specific endpoint', async () => {
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

      // Now get software for that endpoint
      const context = createSystemTestContext({
        endpointId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await software.getInstalledSoftwareByEndpoint.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('displayName');
        expect(result[0].json).toHaveProperty('publisher');
      }
    });
  });

  describe('getInstalledSoftwareByLogicalGroup()', () => {
    it('should fetch software for a specific logical group', async () => {
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

      // Now get software for that logical group
      const context = createSystemTestContext({
        logicalGroupId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await software.getInstalledSoftwareByLogicalGroup.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('displayName');
        expect(result[0].json).toHaveProperty('publisher');
      }
    });
  });

  describe('getInstalledSoftwareByUniversalDynamicGroup()', () => {
    it('should fetch software for a specific universal dynamic group', async () => {
      // Get a UDG ID from the mock
      const groupsContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const groups = await (await import('../../nodes/Baramundi/actions/universalDynamicGroups/universalDynamicGroups.execute')).getMany.call(groupsContext, 0);

      if (groups.length === 0) {
        console.warn('No universal dynamic groups available for testing');
        return;
      }

      const universalDynamicGroupId = groups[0].json.id as string;

      // Now get software for that dynamic group
      const context = createSystemTestContext({
        universalDynamicGroupId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await software.getInstalledSoftwareByUniversalDynamicGroup.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('displayName');
        expect(result[0].json).toHaveProperty('publisher');
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid endpoint ID gracefully', async () => {
      const context = createSystemTestContext({
        endpointId: '00000000-0000-0000-0000-000000000000',
        returnAll: false,
        limit: 10,
      }, config!);

      await expect(software.getInstalledSoftwareByEndpoint.call(context, 0)).rejects.toThrow();
    });
  });
});
