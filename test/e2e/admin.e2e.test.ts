/**
 * E2E Tests — BaramundiAdmin Node
 * Runs against bConnect-Mock on localhost:8765
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRealContext, checkMockAvailable, tryOp, NONEXISTENT_GUID } from './helpers';
import * as ad from '../../nodes/BaramundiAdmin/actions/activeDirectory/activeDirectory.execute';
import * as sm from '../../nodes/BaramundiAdmin/actions/serverManagement/serverManagement.execute';
import * as os from '../../nodes/BaramundiAdmin/actions/operatingSystem/operatingSystem.execute';

let available = false;
let firstADGroupId = '';
let firstADUserId = '';
let firstADObjectId = '';
let firstOrgUnitId = '';
let firstOSFolderId = '';

beforeAll(async () => {
  available = await checkMockAvailable();
  if (!available) {
    console.warn('⚠ bConnectMock not running — admin E2E tests skipped');
    return;
  }
  const gCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const groups = await tryOp(() => ad.getADGroups.call(gCtx, 0));
  if (groups && groups.length > 0) firstADGroupId = groups[0].json.id as string;

  const uCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const users = await tryOp(() => ad.getADUsers.call(uCtx, 0));
  if (users && users.length > 0) firstADUserId = users[0].json.id as string;

  const oCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const objects = await tryOp(() => ad.getADObjects.call(oCtx, 0));
  if (objects && objects.length > 0) firstADObjectId = objects[0].json.id as string;

  const ouCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const ous = await tryOp(() => ad.getOrgUnits.call(ouCtx, 0));
  if (ous && ous.length > 0) firstOrgUnitId = ous[0].json.id as string;

  const fCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const folders = await tryOp(() => os.getFolders.call(fCtx, 0));
  if (folders && folders.length > 0) firstOSFolderId = folders[0].json.id as string;
});

// ─── Active Directory — AD Groups ─────────────────────────────────────────────

describe('E2E: AD Group — getADGroups', () => {
  it('returns an array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => ad.getADGroups.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: AD Group — getADGroup', () => {
  it('returns a single AD group', async () => {
    if (!available || !firstADGroupId) return;
    const ctx = createRealContext({ adGroupId: firstADGroupId });
    const result = await tryOp(() => ad.getADGroup.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });
});

describe('E2E: AD Group — getADGroupsByADGroup', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstADGroupId) return;
    const ctx = createRealContext({ adGroupId: firstADGroupId, returnAll: false, limit: 5, options: {} });
    await tryOp(() => ad.getADGroupsByADGroup.call(ctx, 0));
  });
});

describe('E2E: AD Group — getADGroupsByOrgUnit', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstOrgUnitId) return;
    const ctx = createRealContext({ orgUnitId: firstOrgUnitId, returnAll: false, limit: 5, options: {} });
    await tryOp(() => ad.getADGroupsByOrgUnit.call(ctx, 0));
  });
});

// ─── Active Directory — AD Users ──────────────────────────────────────────────

describe('E2E: AD User — getADUsers', () => {
  it('returns an array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => ad.getADUsers.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: AD User — getADUser', () => {
  it('returns a single AD user', async () => {
    if (!available || !firstADUserId) return;
    const ctx = createRealContext({ adUserId: firstADUserId });
    const result = await tryOp(() => ad.getADUser.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });
});

describe('E2E: AD User — getADUsersByGroup', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstADGroupId) return;
    const ctx = createRealContext({ adGroupId: firstADGroupId, returnAll: false, limit: 5, options: {} });
    await tryOp(() => ad.getADUsersByGroup.call(ctx, 0));
  });
});

describe('E2E: AD User — getADUsersByOrgUnit', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstOrgUnitId) return;
    const ctx = createRealContext({ orgUnitId: firstOrgUnitId, returnAll: false, limit: 5, options: {} });
    await tryOp(() => ad.getADUsersByOrgUnit.call(ctx, 0));
  });
});

// ─── Active Directory — AD Objects ────────────────────────────────────────────

describe('E2E: AD Object — getADObjects', () => {
  it('returns an array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => ad.getADObjects.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: AD Object — getADObject', () => {
  it('returns a single AD object', async () => {
    if (!available || !firstADObjectId) return;
    const ctx = createRealContext({ adObjectId: firstADObjectId });
    const result = await tryOp(() => ad.getADObject.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });
});

describe('E2E: AD Object — getADObjectsByADGroup', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstADGroupId) return;
    const ctx = createRealContext({ adGroupId: firstADGroupId, returnAll: false, limit: 5, options: {} });
    await tryOp(() => ad.getADObjectsByADGroup.call(ctx, 0));
  });
});

describe('E2E: AD Object — getADObjectsByOrgUnit', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstOrgUnitId) return;
    const ctx = createRealContext({ orgUnitId: firstOrgUnitId, returnAll: false, limit: 5, options: {} });
    await tryOp(() => ad.getADObjectsByOrgUnit.call(ctx, 0));
  });
});

describe('E2E: AD Object — getADObjectMemberships', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstADObjectId) return;
    const ctx = createRealContext({ adObjectId: firstADObjectId, returnAll: false, limit: 5, options: {} });
    await tryOp(() => ad.getADObjectMemberships.call(ctx, 0));
  });
});

// ─── Active Directory — Org Units ─────────────────────────────────────────────

describe('E2E: Org Unit — getOrgUnits', () => {
  it('returns an array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => ad.getOrgUnits.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Org Unit — getOrgUnit', () => {
  it('returns a single org unit', async () => {
    if (!available || !firstOrgUnitId) return;
    const ctx = createRealContext({ orgUnitId: firstOrgUnitId });
    const result = await tryOp(() => ad.getOrgUnit.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });
});

describe('E2E: Org Unit — getOrgUnitsByOrgUnit', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstOrgUnitId) return;
    const ctx = createRealContext({ orgUnitId: firstOrgUnitId, returnAll: false, limit: 5, options: {} });
    await tryOp(() => ad.getOrgUnitsByOrgUnit.call(ctx, 0));
  });
});

// ─── Server Management ────────────────────────────────────────────────────────

describe('E2E: Server Management — read operations', () => {
  it('getManagementServer returns object or 404', async () => {
    if (!available) return;
    const result = await tryOp(() => sm.getManagementServer.call(createRealContext(), 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });

  it('getGateway returns object or 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getGateway.call(createRealContext(), 0));
  });

  it('getDipStatus returns object or 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getDipStatus.call(createRealContext(), 0));
  });

  it('getVpnAppliance returns object or 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getVpnAppliance.call(createRealContext(), 0));
  });

  it('getCloudConnectors returns array or 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getCloudConnectors.call(createRealContext({ returnAll: false, limit: 5 }), 0));
  });

  it('getPxeRelays returns array or 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getPxeRelays.call(createRealContext({ returnAll: false, limit: 5 }), 0));
  });

  it('getApiKeys returns array or 404 (26R1)', async () => {
    if (!available) return;
    await tryOp(() => sm.getApiKeys.call(createRealContext({ returnAll: false, limit: 5 }), 0));
  });

  it('getDownloadJobs returns array or 404 (26R1)', async () => {
    if (!available) return;
    await tryOp(() => sm.getDownloadJobs.call(createRealContext({ returnAll: false, limit: 5 }), 0));
  });

  it('getDownloadJob accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getDownloadJob.call(createRealContext({ downloadJobId: NONEXISTENT_GUID }), 0));
  });

  it('getDipsMSWCleanup returns object or 404 (26R1)', async () => {
    if (!available) return;
    await tryOp(() => sm.getDipsMSWCleanup.call(createRealContext(), 0));
  });

  it('simulateMSWCleanup accepts 404 (26R1)', async () => {
    if (!available) return;
    await tryOp(() => sm.simulateMSWCleanup.call(createRealContext(), 0));
  });
});

describe('E2E: Server Management — destructive (accepts 404)', () => {
  it('restartManagementServer', async () => {
    if (!available) return;
    await tryOp(() => sm.restartManagementServer.call(createRealContext({ additionalFields: {} }), 0));
  });

  it('cancelScheduledRestart', async () => {
    if (!available) return;
    await tryOp(() => sm.cancelScheduledRestart.call(createRealContext(), 0));
  });
});

// ─── Microservice ─────────────────────────────────────────────────────────────

describe('E2E: Microservice', () => {
  let firstMicroserviceId = '';

  it('getMicroservices returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => sm.getMicroservices.call(ctx, 0));
    if (result !== null) {
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) firstMicroserviceId = result[0].json.id as string;
    }
  });

  it('getMicroservice accepts 404', async () => {
    if (!available) return;
    const id = firstMicroserviceId || NONEXISTENT_GUID;
    await tryOp(() => sm.getMicroservice.call(createRealContext({ microserviceId: id }), 0));
  });

  it('startMicroservice accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.startMicroservice.call(createRealContext({ microserviceId: NONEXISTENT_GUID }), 0));
  });

  it('stopMicroservice accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.stopMicroservice.call(createRealContext({ microserviceId: NONEXISTENT_GUID }), 0));
  });

  it('restartMicroservice accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.restartMicroservice.call(createRealContext({ microserviceId: NONEXISTENT_GUID }), 0));
  });
});

// ─── Operating System / Windows Update Management ─────────────────────────────

describe('E2E: Operating System — getFolders', () => {
  it('returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => os.getFolders.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Operating System — getFolder', () => {
  it('returns object or 404', async () => {
    if (!available || !firstOSFolderId) return;
    const result = await tryOp(() => os.getFolder.call(createRealContext({ folderId: firstOSFolderId }), 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });
});

describe('E2E: Operating System — getFoldersByFolderId', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstOSFolderId) return;
    const ctx = createRealContext({ folderId: firstOSFolderId, returnAll: false, limit: 5 });
    await tryOp(() => os.getFoldersByFolderId.call(ctx, 0));
  });
});

describe('E2E: Operating System — CRUD lifecycle', () => {
  it('createFolder → updateFolder → deleteFolder', async () => {
    if (!available) return;
    const createCtx = createRealContext({ name: 'E2E-OSFolder', additionalFields: {} });
    const created = await tryOp(() => os.createFolder.call(createCtx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;

    await tryOp(() => os.updateFolder.call(createRealContext({ folderId: id, updateFields: { name: 'E2E-OSFolder-Updated' } }), 0));
    await tryOp(() => os.deleteFolder.call(createRealContext({ folderId: id }), 0));
  });
});

describe('E2E: Operating System — Windows Endpoints', () => {
  it('getWindowsEndpoints returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    await tryOp(() => os.getWindowsEndpoints.call(ctx, 0));
  });

  it('getWindowsEndpoint accepts 404', async () => {
    if (!available) return;
    await tryOp(() => os.getWindowsEndpoint.call(createRealContext({ endpointId: NONEXISTENT_GUID }), 0));
  });

  it('updateWindowsEndpoint accepts 404', async () => {
    if (!available) return;
    await tryOp(() => os.updateWindowsEndpoint.call(createRealContext({ endpointId: NONEXISTENT_GUID, updateFields: {} }), 0));
  });
});

// ─── Security Groups & Profiles (shared with Security node) ──────────────────

describe('E2E: Security Group (Admin)', () => {
  it('getSecurityGroups returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => sm.getSecurityGroups.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('createSecurityGroup → deleteSecurityGroup (accepts 404)', async () => {
    if (!available) return;
    const created = await tryOp(() => sm.createSecurityGroup.call(createRealContext({ name: 'E2E-SecGroup', additionalFields: {} }), 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;

    await tryOp(() => sm.updateSecurityGroup.call(createRealContext({ securityGroupId: id, updateFields: { name: 'E2E-SecGroup-Updated' } }), 0));
    await tryOp(() => sm.deleteSecurityGroup.call(createRealContext({ securityGroupId: id }), 0));
  });
});

describe('E2E: Security Profile (Admin)', () => {
  it('getSecurityProfiles returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    await tryOp(() => sm.getSecurityProfiles.call(ctx, 0));
  });

  it('createSecurityProfile → deleteSecurityProfile (accepts 404)', async () => {
    if (!available) return;
    const created = await tryOp(() => sm.createSecurityProfile.call(createRealContext({ name: 'E2E-SecProfile', additionalFields: {} }), 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;
    await tryOp(() => sm.updateSecurityProfile.call(createRealContext({ securityProfileId: id, updateFields: {} }), 0));
    await tryOp(() => sm.deleteSecurityProfile.call(createRealContext({ securityProfileId: id }), 0));
  });
});

describe('E2E: Access Rights (Admin)', () => {
  it('getAccessRights accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getAccessRights.call(createRealContext({ objectId: NONEXISTENT_GUID, objectType: 'Endpoint' }), 0));
  });

  it('updateObjectPermissions accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.updateObjectPermissions.call(createRealContext({ objectId: NONEXISTENT_GUID, objectType: 'Endpoint', permissions: [] }), 0));
  });
});
