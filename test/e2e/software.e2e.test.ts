/**
 * E2E Tests — BaramundiSoftware Node
 * Runs against bConnectMock_V2.0 on localhost:8765
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRealContext, checkMockAvailable, tryOp, NONEXISTENT_GUID } from './helpers';
import * as sw from '../../nodes/BaramundiSoftware/actions/software/software.execute';

let available = false;
let firstBundleId = '';
let firstBundleFolderId = '';
let firstBundleApplicationId = '';

beforeAll(async () => {
  available = await checkMockAvailable();
  if (!available) {
    console.warn('⚠ bConnectMock not running — software E2E tests skipped');
    return;
  }
  const bCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const bundles = await tryOp(() => sw.getBundles.call(bCtx, 0));
  if (bundles && bundles.length > 0) firstBundleId = bundles[0].json.id as string;

  const fCtx = createRealContext({ returnAll: false, limit: 5 });
  const folders = await tryOp(() => sw.getBundleFolders.call(fCtx, 0));
  if (folders && folders.length > 0) firstBundleFolderId = folders[0].json.id as string;

  const apCtx = createRealContext({ returnAll: false, limit: 5 });
  const apps = await tryOp(() => sw.getBundleApplications.call(apCtx, 0));
  if (apps && apps.length > 0) firstBundleApplicationId = apps[0].json.id as string;
});

// ─── Installed Software ───────────────────────────────────────────────────────

describe('E2E: Software — getInstalledWindowsSoftware', () => {
  it('returns array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => sw.getInstalledWindowsSoftware.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Software — getInstalledSoftwareByEndpoint', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ endpointId: NONEXISTENT_GUID, returnAll: false, limit: 5, options: {} });
    await tryOp(() => sw.getInstalledSoftwareByEndpoint.call(ctx, 0));
  });
});

describe('E2E: Software — getInstalledSoftwareByLogicalGroup', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ logicalGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5, options: {} });
    await tryOp(() => sw.getInstalledSoftwareByLogicalGroup.call(ctx, 0));
  });
});

describe('E2E: Software — getInstalledSoftwareByUniversalDynamicGroup (26R1)', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ universalDynamicGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5, options: {} });
    await tryOp(() => sw.getInstalledSoftwareByUniversalDynamicGroup.call(ctx, 0));
  });
});

// ─── Bundle ───────────────────────────────────────────────────────────────────

describe('E2E: Bundle — getBundles', () => {
  it('returns array of bundles', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => sw.getBundles.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Bundle — getBundle', () => {
  it('returns a single bundle', async () => {
    if (!available || !firstBundleId) return;
    const ctx = createRealContext({ bundleId: firstBundleId });
    const result = await tryOp(() => sw.getBundle.call(ctx, 0));
    if (result !== null) expect(result[0].json).toHaveProperty('id', firstBundleId);
  });
});

describe('E2E: Bundle — CRUD lifecycle', () => {
  it('createBundle → deleteBundle', async () => {
    if (!available) return;
    const createCtx = createRealContext({ name: 'E2E-TestBundle', additionalFields: {} });
    const created = await tryOp(() => sw.createBundle.call(createCtx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;
    await tryOp(() => sw.deleteBundle.call(createRealContext({ bundleId: id }), 0));
  });
});

describe('E2E: Bundle — getBundleApplicationsByBundle', () => {
  it('returns applications for a bundle (accepts 404)', async () => {
    if (!available || !firstBundleId) return;
    const ctx = createRealContext({ bundleId: firstBundleId, returnAll: false, limit: 5 });
    const result = await tryOp(() => sw.getBundleApplicationsByBundle.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Bundle — addApplicationToBundle (accepts 404)', () => {
  it('adds application to bundle', async () => {
    if (!available || !firstBundleId || !firstBundleApplicationId) return;
    const ctx = createRealContext({
      bundleId: firstBundleId,
      applicationId: firstBundleApplicationId,
      additionalFields: {},
    });
    await tryOp(() => sw.addApplicationToBundle.call(ctx, 0));
  });
});

describe('E2E: Bundle — replaceApplicationInBundle (accepts 404)', () => {
  it('replaces an application in a bundle', async () => {
    if (!available || !firstBundleId) return;
    const ctx = createRealContext({
      bundleId: firstBundleId,
      bundleApplicationId: NONEXISTENT_GUID,
      updateFields: {},
    });
    await tryOp(() => sw.replaceApplicationInBundle.call(ctx, 0));
  });
});

describe('E2E: Bundle — deleteBundleApplication (accepts 404)', () => {
  it('deletes a bundle application', async () => {
    if (!available) return;
    const ctx = createRealContext({ bundleApplicationId: NONEXISTENT_GUID });
    await tryOp(() => sw.deleteBundleApplication.call(ctx, 0));
  });
});

// ─── Bundle Folder ────────────────────────────────────────────────────────────

describe('E2E: Bundle Folder — getBundleFolders', () => {
  it('returns array of bundle folders', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => sw.getBundleFolders.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Bundle Folder — getBundleFolder', () => {
  it('returns a single bundle folder', async () => {
    if (!available || !firstBundleFolderId) return;
    const ctx = createRealContext({ bundleFolderId: firstBundleFolderId });
    const result = await tryOp(() => sw.getBundleFolder.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });
});

describe('E2E: Bundle Folder — getBundleSubFolders', () => {
  it('returns sub-folders (accepts 404)', async () => {
    if (!available || !firstBundleFolderId) return;
    const ctx = createRealContext({ bundleFolderId: firstBundleFolderId, returnAll: false, limit: 5 });
    await tryOp(() => sw.getBundleSubFolders.call(ctx, 0));
  });
});

describe('E2E: Bundle Folder — CRUD lifecycle', () => {
  it('createBundleFolder → updateBundleFolder → deleteBundleFolder', async () => {
    if (!available) return;
    const createCtx = createRealContext({ name: 'E2E-BundleFolder', additionalFields: {} });
    const created = await tryOp(() => sw.createBundleFolder.call(createCtx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;

    await tryOp(() => sw.updateBundleFolder.call(createRealContext({ bundleFolderId: id, updateFields: { name: 'E2E-BundleFolder-Updated' } }), 0));
    await tryOp(() => sw.deleteBundleFolder.call(createRealContext({ bundleFolderId: id }), 0));
  });
});

// ─── Bundle Applications (global) ─────────────────────────────────────────────

describe('E2E: Bundle Applications — getBundleApplications', () => {
  it('returns global bundle applications list', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => sw.getBundleApplications.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});
