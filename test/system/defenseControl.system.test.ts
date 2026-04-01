/**
 * System Tests for Defense Control API
 *
 * Tests against live bConnect API
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext } from './setup';
import * as defenseControl from '../../nodes/Baramundi/actions/defenseControl/defenseControl.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Defense Control API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  describe('BitLocker Operations', () => {
    it('should fetch BitLocker Windows endpoints', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await defenseControl.getBitLockerWindowsEndpoints.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should get a specific BitLocker Windows endpoint', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const endpoints = await defenseControl.getBitLockerWindowsEndpoints.call(listContext, 0);

      if (endpoints.length === 0) {
        console.warn('No BitLocker endpoints available for testing');
        return;
      }

      const endpointId = endpoints[0].json.endpointId as string;

      const context = createSystemTestContext({
        endpointId,
      }, config!);

      const result = await defenseControl.getBitLockerWindowsEndpoint.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toHaveProperty('endpointId');
    });
  });

  describe('Local Admin Accounts Operations', () => {
    it.skip('should fetch local administrative accounts for an endpoint', async () => {
      // Note: 'Local administrative accounts' feature may not be enabled in all bConnect versions
      // Get an endpoint first
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
      }, config!);

      const result = await defenseControl.getLocalAdministrativeAccounts.call(context, 0);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('endpointId');
    });
  });

  describe('Microsoft Defender Threats Operations', () => {
    it('should fetch Microsoft Defender threats', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await defenseControl.getMicrosoftDefenderThreats.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should get a specific Microsoft Defender threat', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const threats = await defenseControl.getMicrosoftDefenderThreats.call(listContext, 0);

      if (threats.length === 0) {
        console.warn('No Defender threats available for testing');
        return;
      }

      const threatId = threats[0].json.id as string;

      const context = createSystemTestContext({
        threatId,
      }, config!);

      const result = await defenseControl.getMicrosoftDefenderThreat.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toHaveProperty('id');
    });

    it('should fetch Microsoft Defender threats by endpoint', async () => {
      // Get an endpoint first
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

      const result = await defenseControl.getMicrosoftDefenderThreatsByEndpoint.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch Microsoft Defender threats by logical group', async () => {
      // Get a logical group first
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

      const result = await defenseControl.getMicrosoftDefenderThreatsByLogicalGroup.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Microsoft Defender Windows Endpoints Operations', () => {
    it('should fetch Microsoft Defender Windows endpoints', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await defenseControl.getMicrosoftDefenderWindowsEndpoints.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should get a specific Microsoft Defender Windows endpoint', async () => {
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const endpoints = await defenseControl.getMicrosoftDefenderWindowsEndpoints.call(listContext, 0);

      if (endpoints.length === 0) {
        console.warn('No Defender Windows endpoints available for testing');
        return;
      }

      const endpointId = endpoints[0].json.endpointId as string;

      const context = createSystemTestContext({
        endpointId,
      }, config!);

      const result = await defenseControl.getMicrosoftDefenderWindowsEndpoint.call(context, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toHaveProperty('endpointId');
    });
  });
});
