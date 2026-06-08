/**
 * Unit Tests for SEC-08: Version-Mismatch Guards in BaramundiEndpoint Router
 *
 * Verifies that 25R2-only operations throw NodeOperationError when bmsVersion = '26R1',
 * preventing silent workflow breakage when credentials are updated to a 26R1 server.
 */

import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Mock the entire endpoint execute module — router delegates to these functions
vi.mock('../../../../../nodes/BaramundiEndpoint/actions/endpoint/endpoint.execute', () => ({
  get: vi.fn(async () => []),
  getMany: vi.fn(async () => []),
  search: vi.fn(async () => []),
  create: vi.fn(async () => []),
  update: vi.fn(async () => []),
  deleteEndpoint: vi.fn(async () => []),
  startEnrollment: vi.fn(async () => []),
  triggerIntuneInstallation: vi.fn(async () => []),
  setEntraIdData: vi.fn(async () => []),
  deleteEntraIdData: vi.fn(async () => []),
  getEntraIdDataByDeviceId: vi.fn(async () => []),
  getUnmanagedEndpoints: vi.fn(async () => []),
  getUnmanagedEndpoint: vi.fn(async () => []),
  deleteUnmanagedEndpoint: vi.fn(async () => []),
  getEndpointsByLogicalGroup: vi.fn(async () => []),
  getEndpointsByStaticGroup: vi.fn(async () => []),
  getEndpointsByDynamicGroup: vi.fn(async () => []),
  getEndpointsByUDG: vi.fn(async () => []),
  getEndpointsByADUser: vi.fn(async () => []),
  getEndpointsByGroup: vi.fn(async () => []),
  getIndustrialEndpoints: vi.fn(async () => []),
  getIndustrialEndpoint: vi.fn(async () => []),
  createIndustrialEndpoint: vi.fn(async () => []),
  updateIndustrialEndpoint: vi.fn(async () => []),
  deleteIndustrialEndpoint: vi.fn(async () => []),
  getIndustrialEndpointsByGroup: vi.fn(async () => []),
  getLogicalGroup: vi.fn(async () => []),
  getLogicalGroups: vi.fn(async () => []),
  createLogicalGroup: vi.fn(async () => []),
  updateLogicalGroup: vi.fn(async () => []),
  deleteLogicalGroup: vi.fn(async () => []),
  getLogicalGroupSubGroups: vi.fn(async () => []),
  getStaticGroup: vi.fn(async () => []),
  getStaticGroups: vi.fn(async () => []),
  createStaticGroup: vi.fn(async () => []),
  updateStaticGroup: vi.fn(async () => []),
  deleteStaticGroup: vi.fn(async () => []),
  getDynamicGroup: vi.fn(async () => []),
  getDynamicGroups: vi.fn(async () => []),
  createEndpointMaintenanceWindow: vi.fn(async () => []),
  updateEndpointMaintenanceWindow: vi.fn(async () => []),
  deleteEndpointMaintenanceWindow: vi.fn(async () => []),
  getEndpointMaintenanceWindow: vi.fn(async () => []),
  putEndpointMaintenanceWindow: vi.fn(async () => []),
  createGroupMaintenanceWindow: vi.fn(async () => []),
  updateGroupMaintenanceWindow: vi.fn(async () => []),
  deleteGroupMaintenanceWindow: vi.fn(async () => []),
  getGroupMaintenanceWindow: vi.fn(async () => []),
  putGroupMaintenanceWindow: vi.fn(async () => []),
}));

import { router } from '../../../../../nodes/BaramundiEndpoint/actions/router';

function createMockContext(resource: string, operation: string, bmsVersion: string): IExecuteFunctions {
  const inputData: INodeExecutionData[] = [{ json: {} }];
  return {
    getInputData: vi.fn(() => inputData),
    getNodeParameter: vi.fn((paramName: string, _index: number, defaultValue?: any) => {
      if (paramName === 'resource') return resource;
      if (paramName === 'operation') return operation;
      if (paramName === 'bmsVersion') return bmsVersion;
      return defaultValue;
    }),
    getNode: vi.fn(() => ({
      name: 'BaramundiEndpoint',
      type: 'n8n-nodes-baramundi.baramundiEndpoint',
      typeVersion: 1,
      position: [0, 0] as [number, number],
      parameters: {},
      id: 'test-node-id',
    })),
    continueOnFail: vi.fn(() => false),
  } as unknown as IExecuteFunctions;
}

describe('Router Version-Mismatch Guards (SEC-08)', () => {
  describe('Maintenance Window PUT operations — 25R2-only, should throw on 26R1', () => {
    it('should throw NodeOperationError for putEndpointMaintenanceWindow when bmsVersion is 26R1', async () => {
      const ctx = createMockContext('maintenanceWindow', 'putEndpointMaintenanceWindow', '26R1');
      await expect(router.call(ctx)).rejects.toThrow(NodeOperationError);
    });

    it('should include helpful message pointing to PATCH operation for putEndpointMaintenanceWindow', async () => {
      const ctx = createMockContext('maintenanceWindow', 'putEndpointMaintenanceWindow', '26R1');
      await expect(router.call(ctx)).rejects.toThrow(/25R2/);
    });

    it('should throw NodeOperationError for putGroupMaintenanceWindow when bmsVersion is 26R1', async () => {
      const ctx = createMockContext('maintenanceWindow', 'putGroupMaintenanceWindow', '26R1');
      await expect(router.call(ctx)).rejects.toThrow(NodeOperationError);
    });

    it('should include helpful message pointing to PATCH operation for putGroupMaintenanceWindow', async () => {
      const ctx = createMockContext('maintenanceWindow', 'putGroupMaintenanceWindow', '26R1');
      await expect(router.call(ctx)).rejects.toThrow(/25R2/);
    });

    it('should NOT throw for putEndpointMaintenanceWindow when bmsVersion is 25R2', async () => {
      const ctx = createMockContext('maintenanceWindow', 'putEndpointMaintenanceWindow', '25R2');
      await expect(router.call(ctx)).resolves.toBeDefined();
    });

    it('should NOT throw for putGroupMaintenanceWindow when bmsVersion is 25R2', async () => {
      const ctx = createMockContext('maintenanceWindow', 'putGroupMaintenanceWindow', '25R2');
      await expect(router.call(ctx)).resolves.toBeDefined();
    });
  });

  describe('Industrial Endpoint operations — 25R2-only, should throw on 26R1', () => {
    const industrialOps = [
      'getIndustrialEndpoints',
      'getIndustrialEndpoint',
      'createIndustrialEndpoint',
      'updateIndustrialEndpoint',
      'deleteIndustrialEndpoint',
      'getIndustrialEndpointsByGroup',
    ];

    for (const op of industrialOps) {
      it(`should throw NodeOperationError for ${op} when bmsVersion is 26R1`, async () => {
        const ctx = createMockContext('endpoint', op, '26R1');
        await expect(router.call(ctx)).rejects.toThrow(NodeOperationError);
      });

      it(`should include '25R2' in error message for ${op}`, async () => {
        const ctx = createMockContext('endpoint', op, '26R1');
        await expect(router.call(ctx)).rejects.toThrow(/25R2/);
      });

      it(`should NOT throw for ${op} when bmsVersion is 25R2`, async () => {
        const ctx = createMockContext('endpoint', op, '25R2');
        await expect(router.call(ctx)).resolves.toBeDefined();
      });
    }
  });
});
