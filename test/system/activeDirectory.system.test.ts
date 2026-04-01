/**
 * System Tests for Active Directory API
 *
 * Tests against live bConnect API
 * All operations are read-only (safe to run)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext } from './setup';
import * as activeDirectory from '../../nodes/Baramundi/actions/activeDirectory/activeDirectory.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Active Directory API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  describe('AD Groups Operations', () => {
    it('should fetch AD groups from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await activeDirectory.getADGroups.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should get a specific AD group by ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const groups = await activeDirectory.getADGroups.call(listContext, 0);

      if (groups.length === 0) {
        console.warn('No AD groups available for testing');
        return;
      }

      const adGroupId = groups[0].json.id as string;

      const context = createSystemTestContext({
        adGroupId,
      }, config!);

      const result = await activeDirectory.getADGroup.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(adGroupId);
    });

    it('should fetch AD groups by org unit', async () => {
      // Get a real org unit first
      const orgUnitsContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const orgUnits = await activeDirectory.getOrgUnits.call(orgUnitsContext, 0);

      if (orgUnits.length === 0) {
        console.warn('No org units available for testing');
        return;
      }

      const orgUnitId = orgUnits[0].json.id as string;

      const context = createSystemTestContext({
        orgUnitId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await activeDirectory.getADGroupsByOrgUnit.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch AD users by group', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const groups = await activeDirectory.getADGroups.call(listContext, 0);

      if (groups.length === 0) {
        console.warn('No AD groups available for testing');
        return;
      }

      const adGroupId = groups[0].json.id as string;

      const context = createSystemTestContext({
        adGroupId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await activeDirectory.getADUsersByGroup.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('AD Users Operations', () => {
    it('should fetch AD users from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await activeDirectory.getADUsers.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should get a specific AD user by ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const users = await activeDirectory.getADUsers.call(listContext, 0);

      if (users.length === 0) {
        console.warn('No AD users available for testing');
        return;
      }

      const adUserId = users[0].json.id as string;

      const context = createSystemTestContext({
        adUserId,
      }, config!);

      const result = await activeDirectory.getADUser.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(adUserId);
    });
  });

  describe('AD Objects Operations', () => {
    it('should fetch AD objects from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await activeDirectory.getADObjects.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should get a specific AD object by ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const objects = await activeDirectory.getADObjects.call(listContext, 0);

      if (objects.length === 0) {
        console.warn('No AD objects available for testing');
        return;
      }

      const adObjectId = objects[0].json.id as string;

      const context = createSystemTestContext({
        adObjectId,
      }, config!);

      const result = await activeDirectory.getADObject.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(adObjectId);
    });
  });

  describe('Org Units Operations', () => {
    it('should fetch org units from live API', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await activeDirectory.getOrgUnits.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should get a specific org unit by ID', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const orgUnits = await activeDirectory.getOrgUnits.call(listContext, 0);

      if (orgUnits.length === 0) {
        console.warn('No org units available for testing');
        return;
      }

      const orgUnitId = orgUnits[0].json.id as string;

      const context = createSystemTestContext({
        orgUnitId,
      }, config!);

      const result = await activeDirectory.getOrgUnit.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json.id).toBe(orgUnitId);
    });
  });
});
