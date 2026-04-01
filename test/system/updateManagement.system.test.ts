/**
 * System Tests for Update Management API
 *
 * Tests against live bConnect API
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext } from './setup';
import * as updateManagement from '../../nodes/Baramundi/actions/updateManagement/updateManagement.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Update Management API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  describe('Read Operations', () => {
    it('should fetch Windows endpoints for update management', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await updateManagement.getWindowsEndpoints.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
        expect(result[0].json).toHaveProperty('displayName');
      }
    });

    it('should get a specific Windows endpoint for update management', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const endpoints = await updateManagement.getWindowsEndpoints.call(listContext, 0);

      if (endpoints.length === 0) {
        console.warn('No update management endpoints available for testing');
        return;
      }

      const endpointId = endpoints[0].json.id as string;

      const context = createSystemTestContext({
        endpointId,
      }, config!);

      const result = await updateManagement.getWindowsEndpoint.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toHaveProperty('id');
      expect(result[0].json.id).toBe(endpointId);
    });
  });
});
