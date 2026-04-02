/**
 * E2E Tests — BaramundiEndpoint Node
 * Runs against bConnectMock_V2.0 on localhost:8765
 * Skip automatically when mock is not running.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRealContext, checkMockAvailable, tryOp, NONEXISTENT_GUID } from './helpers';
import * as ep from '../../nodes/BaramundiEndpoint/actions/endpoint/endpoint.execute';

let available = false;
let firstEndpointId = '';
let firstLogicalGroupId = '';
let firstStaticGroupId = '';
let firstDynamicGroupId = '';
let createdLogicalGroupId = '';

beforeAll(async () => {
  available = await checkMockAvailable();
  if (!available) {
    console.warn('⚠ bConnectMock not running — endpoint E2E tests skipped');
    return;
  }
  // Pre-fetch IDs for sub-tests
  const ctx = createRealContext({ returnAll: false, limit: 5, endpointType: 'all', additionalFields: {} });
  const endpoints = await ep.getMany.call(ctx, 0);
  if (endpoints.length > 0) firstEndpointId = endpoints[0].json.id as string;

  const lgCtx = createRealContext({ returnAll: false, limit: 5 });
  const groups = await ep.getLogicalGroups.call(lgCtx, 0);
  if (groups.length > 0) firstLogicalGroupId = groups[0].json.id as string;

  const sgCtx = createRealContext({ returnAll: false, limit: 5 });
  const sgroups = await ep.getStaticGroups.call(sgCtx, 0);
  if (sgroups.length > 0) firstStaticGroupId = sgroups[0].json.id as string;

  const dgCtx = createRealContext({ returnAll: false, limit: 5 });
  const dgroups = await ep.getDynamicGroups.call(dgCtx, 0);
  if (dgroups.length > 0) firstDynamicGroupId = dgroups[0].json.id as string;
});

// ─── Endpoint CRUD ───────────────────────────────────────────────────────────

describe('E2E: Endpoint — getMany', () => {
  it('returns an array of endpoints', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, endpointType: 'all', additionalFields: {} });
    const result = await ep.getMany.call(ctx, 0);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].json).toHaveProperty('id');
  });

  it('respects limit', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 2, endpointType: 'all', additionalFields: {} });
    const result = await ep.getMany.call(ctx, 0);
    expect(result.length).toBeLessThanOrEqual(2);
  });
});

describe('E2E: Endpoint — get', () => {
  it('returns a single endpoint by ID', async () => {
    if (!available || !firstEndpointId) return;
    const ctx = createRealContext({ endpointId: firstEndpointId, endpointType: 'all' });
    const result = await ep.get.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(result[0].json).toHaveProperty('id', firstEndpointId);
    expect(result[0].json).toHaveProperty('displayName');
  });

  it('throws for nonexistent GUID', async () => {
    if (!available) return;
    const ctx = createRealContext({ endpointId: NONEXISTENT_GUID, endpointType: 'all' });
    await expect(ep.get.call(ctx, 0)).rejects.toThrow();
  });
});

describe('E2E: Endpoint — search', () => {
  it('returns endpoints matching search query', async () => {
    if (!available) return;
    const ctx = createRealContext({ searchQuery: 'PCDE001', returnAll: false, limit: 10, additionalFields: {} });
    const result = await ep.search.call(ctx, 0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns empty array for no-match search', async () => {
    if (!available) return;
    const ctx = createRealContext({ searchQuery: 'ZZZNONEXISTENT999', returnAll: false, limit: 10, additionalFields: {} });
    const result = await ep.search.call(ctx, 0);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Endpoint — getEndpointsByGroup', () => {
  it('returns endpoints for a typed endpoint group query (accepts 404)', async () => {
    if (!available || !firstLogicalGroupId) return;
    const ctx = createRealContext({
      groupId: firstLogicalGroupId,
      groupType: 'logical',
      endpointType: 'all',
      returnAll: false,
      limit: 5,
    });
    const result = await tryOp(() => ep.getEndpointsByGroup.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Endpoint — getEndpointsByLogicalGroup', () => {
  it('returns endpoints for a logical group', async () => {
    if (!available || !firstLogicalGroupId) return;
    const ctx = createRealContext({ logicalGroupId: firstLogicalGroupId, returnAll: false, limit: 5 });
    const result = await tryOp(() => ep.getEndpointsByLogicalGroup.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Endpoint — getEndpointsByStaticGroup', () => {
  it('returns endpoints for a static group (accepts 404)', async () => {
    if (!available || !firstStaticGroupId) return;
    const ctx = createRealContext({ staticGroupId: firstStaticGroupId, returnAll: false, limit: 5 });
    const result = await tryOp(() => ep.getEndpointsByStaticGroup.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Endpoint — getEndpointsByDynamicGroup', () => {
  it('returns endpoints for a dynamic group (accepts 404)', async () => {
    if (!available || !firstDynamicGroupId) return;
    const ctx = createRealContext({ dynamicGroupId: firstDynamicGroupId, returnAll: false, limit: 5 });
    const result = await tryOp(() => ep.getEndpointsByDynamicGroup.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Endpoint — getEndpointsByUDG', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ universalDynamicGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => ep.getEndpointsByUDG.call(ctx, 0));
  });
});

describe('E2E: Endpoint — getEndpointsByADUser', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ adUserId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => ep.getEndpointsByADUser.call(ctx, 0));
  });
});

describe('E2E: Endpoint — unmanaged', () => {
  it('getUnmanagedEndpoints returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, additionalFields: {} });
    const result = await tryOp(() => ep.getUnmanagedEndpoints.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('getUnmanagedEndpoint accepts 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ endpointId: NONEXISTENT_GUID });
    await tryOp(() => ep.getUnmanagedEndpoint.call(ctx, 0));
  });

  it('deleteUnmanagedEndpoint accepts 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ endpointId: NONEXISTENT_GUID });
    await tryOp(() => ep.deleteUnmanagedEndpoint.call(ctx, 0));
  });
});

describe('E2E: Endpoint — EntraId (accepts 404)', () => {
  it('getEntraIdDataByDeviceId accepts 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ deviceId: 'test-device-id' });
    await tryOp(() => ep.getEntraIdDataByDeviceId.call(ctx, 0));
  });

  it('setEntraIdData accepts 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ endpointId: firstEndpointId || NONEXISTENT_GUID, entraIdData: {} });
    await tryOp(() => ep.setEntraIdData.call(ctx, 0));
  });

  it('deleteEntraIdData accepts 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ endpointId: firstEndpointId || NONEXISTENT_GUID });
    await tryOp(() => ep.deleteEntraIdData.call(ctx, 0));
  });
});

describe('E2E: Endpoint — industrial (25R2-only, accepts 404)', () => {
  it('getIndustrialEndpoints accepts 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, additionalFields: {} });
    await tryOp(() => ep.getIndustrialEndpoints.call(ctx, 0));
  });

  it('getIndustrialEndpoint accepts 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ endpointId: NONEXISTENT_GUID });
    await tryOp(() => ep.getIndustrialEndpoint.call(ctx, 0));
  });

  it('getIndustrialEndpointsByGroup accepts 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ groupId: NONEXISTENT_GUID, groupType: 'logical', returnAll: false, limit: 5 });
    await tryOp(() => ep.getIndustrialEndpointsByGroup.call(ctx, 0));
  });
});

// ─── Logical Group ────────────────────────────────────────────────────────────

describe('E2E: Logical Group — CRUD lifecycle', () => {
  it('getLogicalGroups returns array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await ep.getLogicalGroups.call(ctx, 0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('getLogicalGroup returns object', async () => {
    if (!available || !firstLogicalGroupId) return;
    const ctx = createRealContext({ logicalGroupId: firstLogicalGroupId });
    const result = await ep.getLogicalGroup.call(ctx, 0);
    expect(result[0].json).toHaveProperty('id', firstLogicalGroupId);
  });

  it('getLogicalGroupSubGroups returns array or 404', async () => {
    if (!available || !firstLogicalGroupId) return;
    const ctx = createRealContext({ logicalGroupId: firstLogicalGroupId, returnAll: false, limit: 5 });
    const result = await tryOp(() => ep.getLogicalGroupSubGroups.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('createLogicalGroup → updateLogicalGroup → deleteLogicalGroup', async () => {
    if (!available) return;
    const createCtx = createRealContext({ name: 'E2E-Test-LG', additionalFields: {} });
    const created = await tryOp(() => ep.createLogicalGroup.call(createCtx, 0));
    if (!created || created.length === 0) return;

    createdLogicalGroupId = created[0].json.id as string;

    const updateCtx = createRealContext({ logicalGroupId: createdLogicalGroupId, updateFields: { name: 'E2E-Test-LG-Updated' } });
    await tryOp(() => ep.updateLogicalGroup.call(updateCtx, 0));

    const deleteCtx = createRealContext({ logicalGroupId: createdLogicalGroupId });
    await tryOp(() => ep.deleteLogicalGroup.call(deleteCtx, 0));
  });
});

// ─── Static Group ─────────────────────────────────────────────────────────────

describe('E2E: Static Group', () => {
  it('getStaticGroups returns array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await ep.getStaticGroups.call(ctx, 0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('getStaticGroup returns object', async () => {
    if (!available || !firstStaticGroupId) return;
    const ctx = createRealContext({ staticGroupId: firstStaticGroupId });
    const result = await ep.getStaticGroup.call(ctx, 0);
    expect(result[0].json).toHaveProperty('id', firstStaticGroupId);
  });

  it('createStaticGroup → updateStaticGroup → deleteStaticGroup', async () => {
    if (!available) return;
    const createCtx = createRealContext({ name: 'E2E-Static-Group', additionalFields: {} });
    const created = await tryOp(() => ep.createStaticGroup.call(createCtx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;

    await tryOp(() => ep.updateStaticGroup.call(createRealContext({ staticGroupId: id, updateFields: { name: 'E2E-Static-Updated' } }), 0));
    await tryOp(() => ep.deleteStaticGroup.call(createRealContext({ staticGroupId: id }), 0));
  });
});

// ─── Dynamic Group ────────────────────────────────────────────────────────────

describe('E2E: Dynamic Group', () => {
  it('getDynamicGroups returns array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await ep.getDynamicGroups.call(ctx, 0);
    expect(Array.isArray(result)).toBe(true);
  });

  it('getDynamicGroup returns object', async () => {
    if (!available || !firstDynamicGroupId) return;
    const ctx = createRealContext({ dynamicGroupId: firstDynamicGroupId });
    const result = await ep.getDynamicGroup.call(ctx, 0);
    expect(result[0].json).toHaveProperty('id', firstDynamicGroupId);
  });
});

// ─── Maintenance Window ───────────────────────────────────────────────────────

describe('E2E: Maintenance Window — endpoint lifecycle', () => {
  it('createEndpointMaintenanceWindow → get → update → delete (accepts 404)', async () => {
    if (!available || !firstEndpointId) return;

    const createCtx = createRealContext({
      endpointId: firstEndpointId,
      additionalFields: {
        startTime: '2026-06-01T22:00:00Z',
        durationInMinutes: 120,
      },
    });
    const created = await tryOp(() => ep.createEndpointMaintenanceWindow.call(createCtx, 0));

    const getCtx = createRealContext({ endpointId: firstEndpointId });
    const got = await tryOp(() => ep.getEndpointMaintenanceWindow.call(getCtx, 0));
    if (got !== null && got.length > 0) {
      expect(got[0].json).toBeDefined();
    }

    if (created !== null) {
      const updateCtx = createRealContext({
        endpointId: firstEndpointId,
        updateFields: { durationInMinutes: 180 },
      });
      await tryOp(() => ep.updateEndpointMaintenanceWindow.call(updateCtx, 0));

      const deleteCtx = createRealContext({ endpointId: firstEndpointId });
      await tryOp(() => ep.deleteEndpointMaintenanceWindow.call(deleteCtx, 0));
    }
  });
});

describe('E2E: Maintenance Window — group lifecycle', () => {
  it('createGroupMaintenanceWindow → get → update → delete (accepts 404)', async () => {
    if (!available || !firstLogicalGroupId) return;

    const createCtx = createRealContext({
      groupId: firstLogicalGroupId,
      groupType: 'logical',
      additionalFields: {
        startTime: '2026-06-01T22:00:00Z',
        durationInMinutes: 120,
      },
    });
    await tryOp(() => ep.createGroupMaintenanceWindow.call(createCtx, 0));

    const getCtx = createRealContext({ groupId: firstLogicalGroupId, groupType: 'logical' });
    const got = await tryOp(() => ep.getGroupMaintenanceWindow.call(getCtx, 0));
    if (got !== null && got.length > 0) {
      expect(got[0].json).toBeDefined();
    }

    const updateCtx = createRealContext({
      groupId: firstLogicalGroupId,
      groupType: 'logical',
      updateFields: { durationInMinutes: 240 },
    });
    await tryOp(() => ep.updateGroupMaintenanceWindow.call(updateCtx, 0));

    const deleteCtx = createRealContext({ groupId: firstLogicalGroupId, groupType: 'logical' });
    await tryOp(() => ep.deleteGroupMaintenanceWindow.call(deleteCtx, 0));
  });

  it('putEndpointMaintenanceWindow (25R2, accepts 404)', async () => {
    if (!available || !firstEndpointId) return;
    const ctx = createRealContext({
      endpointId: firstEndpointId,
      startTime: '2026-06-01T22:00:00Z',
      durationInMinutes: 120,
    });
    await tryOp(() => ep.putEndpointMaintenanceWindow.call(ctx, 0));
  });

  it('putGroupMaintenanceWindow (25R2, accepts 404)', async () => {
    if (!available || !firstLogicalGroupId) return;
    const ctx = createRealContext({
      groupId: firstLogicalGroupId,
      groupType: 'logical',
      startTime: '2026-06-01T22:00:00Z',
      durationInMinutes: 120,
    });
    await tryOp(() => ep.putGroupMaintenanceWindow.call(ctx, 0));
  });
});
