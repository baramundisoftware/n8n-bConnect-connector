/**
 * E2E Tests — BaramundiJob Node
 * Runs against bConnect-Mock on localhost:8765
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRealContext, checkMockAvailable, tryOp, NONEXISTENT_GUID } from './helpers';
import * as job from '../../nodes/BaramundiJob/actions/job/job.execute';

let available = false;
let firstJobId = '';
let firstFolderId = '';
let firstInstanceId = '';
let firstKioskReleaseId = '';

beforeAll(async () => {
  available = await checkMockAvailable();
  if (!available) {
    console.warn('⚠ bConnectMock not running — job E2E tests skipped');
    return;
  }
  const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const jobs = await tryOp(() => job.getMany.call(ctx, 0));
  if (jobs && jobs.length > 0) firstJobId = jobs[0].json.id as string;

  const fCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const folders = await tryOp(() => job.getFolders.call(fCtx, 0));
  if (folders && folders.length > 0) firstFolderId = folders[0].json.id as string;

  const iCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const instances = await tryOp(() => job.getAllJobInstances.call(iCtx, 0));
  if (instances && instances.length > 0) firstInstanceId = instances[0].json.id as string;

  const kCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const kiosks = await tryOp(() => job.getKioskReleases.call(kCtx, 0));
  if (kiosks && kiosks.length > 0) firstKioskReleaseId = kiosks[0].json.id as string;
});

// ─── Job Definition ────────────────────────────────────────────────────────────

describe('E2E: Job — getMany', () => {
  it('returns an array of job definitions', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => job.getMany.call(ctx, 0));
    if (result !== null) {
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    }
  });
});

describe('E2E: Job — get', () => {
  it('returns a single job by ID', async () => {
    if (!available || !firstJobId) return;
    const ctx = createRealContext({ jobId: firstJobId });
    const result = await tryOp(() => job.get.call(ctx, 0));
    if (result !== null) expect(result[0].json).toHaveProperty('id', firstJobId);
  });
});

describe('E2E: Job — getJobDefinitionsByFolder', () => {
  it('returns jobs by folder (accepts 404)', async () => {
    if (!available || !firstFolderId) return;
    const ctx = createRealContext({ folderId: firstFolderId, returnAll: false, limit: 5 });
    await tryOp(() => job.getJobDefinitionsByFolder.call(ctx, 0));
  });
});

describe('E2E: Job — CRUD lifecycle', () => {
  it('create → update → deleteJob', async () => {
    if (!available || !firstFolderId) return;
    const createCtx = createRealContext({
      name: 'E2E-TestJob',
      folderId: firstFolderId,
      additionalFields: {},
    });
    const created = await tryOp(() => job.create.call(createCtx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;

    await tryOp(() => job.update.call(createRealContext({ jobId: id, updateFields: { name: 'E2E-TestJob-Updated' } }), 0));
    await tryOp(() => job.deleteJob.call(createRealContext({ jobId: id }), 0));
  });
});

describe('E2E: Job — execute (accepts 404)', () => {
  it('execute job definition', async () => {
    if (!available || !firstJobId) return;
    const ctx = createRealContext({ jobId: firstJobId, endpointIds: '', options: {} });
    await tryOp(() => job.execute.call(ctx, 0));
  });
});

describe('E2E: Job — getInstances', () => {
  it('returns job instances for a job definition', async () => {
    if (!available || !firstJobId) return;
    const ctx = createRealContext({ jobId: firstJobId, returnAll: false, limit: 5 });
    const result = await tryOp(() => job.getInstances.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Job — getJobInstancesByLogicalGroup', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ logicalGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => job.getJobInstancesByLogicalGroup.call(ctx, 0));
  });
});

describe('E2E: Job — getJobInstancesByStaticGroup', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ staticGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => job.getJobInstancesByStaticGroup.call(ctx, 0));
  });
});

describe('E2E: Job — getJobInstancesByDynamicGroup', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ dynamicGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => job.getJobInstancesByDynamicGroup.call(ctx, 0));
  });
});

describe('E2E: Job — getJobInstancesByUDG', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ universalDynamicGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => job.getJobInstancesByUDG.call(ctx, 0));
  });
});

describe('E2E: Job — assign operations (accepts 404)', () => {
  it('assignJobToLogicalGroup', async () => {
    if (!available || !firstJobId) return;
    const ctx = createRealContext({ jobId: firstJobId, logicalGroupId: NONEXISTENT_GUID });
    await tryOp(() => job.assignJobToLogicalGroup.call(ctx, 0));
  });

  it('assignJobToStaticGroup', async () => {
    if (!available || !firstJobId) return;
    const ctx = createRealContext({ jobId: firstJobId, staticGroupId: NONEXISTENT_GUID });
    await tryOp(() => job.assignJobToStaticGroup.call(ctx, 0));
  });

  it('assignJobToDynamicGroup', async () => {
    if (!available || !firstJobId) return;
    const ctx = createRealContext({ jobId: firstJobId, dynamicGroupId: NONEXISTENT_GUID });
    await tryOp(() => job.assignJobToDynamicGroup.call(ctx, 0));
  });

  it('assignJobToUDG', async () => {
    if (!available || !firstJobId) return;
    const ctx = createRealContext({ jobId: firstJobId, universalDynamicGroupId: NONEXISTENT_GUID });
    await tryOp(() => job.assignJobToUDG.call(ctx, 0));
  });
});

// ─── Job Instance ─────────────────────────────────────────────────────────────

describe('E2E: Job Instance — getAllJobInstances', () => {
  it('returns array of all job instances', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => job.getAllJobInstances.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Job Instance — getJobInstance', () => {
  it('returns a single job instance', async () => {
    if (!available || !firstInstanceId) return;
    const ctx = createRealContext({ instanceId: firstInstanceId });
    const result = await tryOp(() => job.getJobInstance.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });
});

describe('E2E: Job Instance — getEndpointJobInstances', () => {
  it('returns instances for endpoint (accepts 404)', async () => {
    if (!available) return;
    const ctx = createRealContext({ endpointId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => job.getEndpointJobInstances.call(ctx, 0));
  });
});

describe('E2E: Job Instance — state operations (accepts 404)', () => {
  it('startJobInstance', async () => {
    if (!available || !firstInstanceId) return;
    await tryOp(() => job.startJobInstance.call(createRealContext({ instanceId: firstInstanceId }), 0));
  });

  it('stopJobInstance', async () => {
    if (!available || !firstInstanceId) return;
    await tryOp(() => job.stopJobInstance.call(createRealContext({ instanceId: firstInstanceId }), 0));
  });

  it('resumeJobInstance', async () => {
    if (!available || !firstInstanceId) return;
    await tryOp(() => job.resumeJobInstance.call(createRealContext({ instanceId: firstInstanceId }), 0));
  });

  it('deleteJobInstance', async () => {
    if (!available) return;
    await tryOp(() => job.deleteJobInstance.call(createRealContext({ instanceId: NONEXISTENT_GUID }), 0));
  });
});

// ─── Job Folder ───────────────────────────────────────────────────────────────

describe('E2E: Job Folder — getFolders', () => {
  it('returns array of job folders', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => job.getFolders.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Job Folder — getFolder', () => {
  it('returns a single folder', async () => {
    if (!available || !firstFolderId) return;
    const ctx = createRealContext({ folderId: firstFolderId });
    const result = await tryOp(() => job.getFolder.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });
});

describe('E2E: Job Folder — getSubFolders', () => {
  it('returns sub-folders (accepts 404)', async () => {
    if (!available || !firstFolderId) return;
    const ctx = createRealContext({ folderId: firstFolderId, returnAll: false, limit: 5 });
    await tryOp(() => job.getSubFolders.call(ctx, 0));
  });
});

describe('E2E: Job Folder — CRUD lifecycle', () => {
  it('createFolder → updateFolder → deleteFolder', async () => {
    if (!available) return;
    const createCtx = createRealContext({ name: 'E2E-JobFolder', additionalFields: {} });
    const created = await tryOp(() => job.createFolder.call(createCtx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;

    await tryOp(() => job.updateFolder.call(createRealContext({ folderId: id, updateFields: { name: 'E2E-JobFolder-Updated' } }), 0));
    await tryOp(() => job.deleteFolder.call(createRealContext({ folderId: id }), 0));
  });
});

// ─── Kiosk Release ────────────────────────────────────────────────────────────

describe('E2E: Kiosk Release — getKioskReleases', () => {
  it('returns array of kiosk releases', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => job.getKioskReleases.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Kiosk Release — getKioskRelease', () => {
  it('returns a single kiosk release', async () => {
    if (!available || !firstKioskReleaseId) return;
    const ctx = createRealContext({ releaseId: firstKioskReleaseId });
    const result = await tryOp(() => job.getKioskRelease.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });
});

describe('E2E: Kiosk Release — getKioskReleasesByJobDefinition', () => {
  it('accepts response or 404', async () => {
    if (!available || !firstJobId) return;
    const ctx = createRealContext({ jobDefinitionId: firstJobId, returnAll: false, limit: 5 });
    await tryOp(() => job.getKioskReleasesByJobDefinition.call(ctx, 0));
  });
});

describe('E2E: Kiosk Release — getKioskReleasesByEndpoint', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ endpointId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => job.getKioskReleasesByEndpoint.call(ctx, 0));
  });
});

describe('E2E: Kiosk Release — getKioskReleasesByLogicalGroup', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ logicalGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => job.getKioskReleasesByLogicalGroup.call(ctx, 0));
  });
});

describe('E2E: Kiosk Release — getKioskReleasesByADObject', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ adObjectId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => job.getKioskReleasesByADObject.call(ctx, 0));
  });
});

describe('E2E: Kiosk Release — createKioskRelease → withdrawKioskRelease', () => {
  it('lifecycle (accepts 404)', async () => {
    if (!available || !firstJobId) return;
    const createCtx = createRealContext({
      jobDefinitionId: firstJobId,
      assignmentTargetId: NONEXISTENT_GUID,
    });
    const created = await tryOp(() => job.createKioskRelease.call(createCtx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;
    await tryOp(() => job.withdrawKioskRelease.call(createRealContext({ releaseId: id }), 0));
  });
});
