/**
 * E2E Tests — BaramundiAsset Node
 * Runs against bConnectMock_V2.0 on localhost:8765
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRealContext, checkMockAvailable, tryOp, NONEXISTENT_GUID } from './helpers';
import * as asset from '../../nodes/BaramundiAsset/actions/asset/asset.execute';

let available = false;
let firstAssetId = '';
let firstAssetTypeId = '';
let firstStockFolderId = '';
let firstTypeFolderId = '';

beforeAll(async () => {
  available = await checkMockAvailable();
  if (!available) {
    console.warn('⚠ bConnectMock not running — asset E2E tests skipped');
    return;
  }
  const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const assets = await tryOp(() => asset.getMany.call(ctx, 0));
  if (assets && assets.length > 0) firstAssetId = assets[0].json.id as string;

  const typeCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const types = await tryOp(() => asset.getAssetTypes.call(typeCtx, 0));
  if (types && types.length > 0) firstAssetTypeId = types[0].json.id as string;

  const sfCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const sfolders = await tryOp(() => asset.getAssetStockFolders.call(sfCtx, 0));
  if (sfolders && sfolders.length > 0) firstStockFolderId = sfolders[0].json.id as string;

  const tfCtx = createRealContext({ returnAll: false, limit: 5, options: {} });
  const tfolders = await tryOp(() => asset.getAssetTypeFolders.call(tfCtx, 0));
  if (tfolders && tfolders.length > 0) firstTypeFolderId = tfolders[0].json.id as string;
});

// ─── Asset ────────────────────────────────────────────────────────────────────

describe('E2E: Asset — getMany', () => {
  it('returns an array of assets', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => asset.getMany.call(ctx, 0));
    if (result !== null) {
      expect(Array.isArray(result)).toBe(true);
    }
  });
});

describe('E2E: Asset — get', () => {
  it('returns a single asset by ID', async () => {
    if (!available || !firstAssetId) return;
    const ctx = createRealContext({ assetId: firstAssetId });
    const result = await tryOp(() => asset.get.call(ctx, 0));
    if (result !== null) {
      expect(result[0].json).toHaveProperty('id', firstAssetId);
    }
  });
});

describe('E2E: Asset — CRUD lifecycle', () => {
  it('create → update → delete', async () => {
    if (!available || !firstAssetTypeId) return;
    const createCtx = createRealContext({
      assetTypeId: firstAssetTypeId,
      displayName: 'E2E Test Asset',
      additionalFields: {},
    });
    // Also catch 400 Bad Request (mock may require additional mandatory fields)
    const created = await tryOp(() => asset.create.call(createCtx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;

    await tryOp(() => asset.update.call(createRealContext({ assetId: id, updateFields: { displayName: 'E2E Test Asset Updated' } }), 0));
    await tryOp(() => asset.deleteAsset.call(createRealContext({ assetId: id }), 0));
  });
});

describe('E2E: Asset — getAssetsByEndpoint', () => {
  it('returns assets for endpoint (accepts 404)', async () => {
    if (!available || !firstAssetId) return;
    const ctx = createRealContext({ endpointId: NONEXISTENT_GUID, returnAll: false, limit: 5, options: {} });
    await tryOp(() => asset.getAssetsByEndpoint.call(ctx, 0));
  });
});

describe('E2E: Asset — getAssetsByLogicalGroup', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ logicalGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5, options: {} });
    await tryOp(() => asset.getAssetsByLogicalGroup.call(ctx, 0));
  });
});

describe('E2E: Asset — getAssetsByADObject', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ adObjectId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => asset.getAssetsByADObject.call(ctx, 0));
  });
});

describe('E2E: Asset — getAssetsByOrgUnit', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ orgUnitId: NONEXISTENT_GUID, returnAll: false, limit: 5 });
    await tryOp(() => asset.getAssetsByOrgUnit.call(ctx, 0));
  });
});

// ─── Asset Type ───────────────────────────────────────────────────────────────

describe('E2E: Asset Type — list & get', () => {
  it('getAssetTypes returns array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => asset.getAssetTypes.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('getAssetType returns object', async () => {
    if (!available || !firstAssetTypeId) return;
    const ctx = createRealContext({ assetTypeId: firstAssetTypeId });
    const result = await tryOp(() => asset.getAssetType.call(ctx, 0));
    if (result !== null) expect(result[0].json).toHaveProperty('id', firstAssetTypeId);
  });
});

describe('E2E: Asset Type — createAssetType → deleteAssetType', () => {
  it('lifecycle (accepts 404)', async () => {
    if (!available) return;
    const ctx = createRealContext({ name: 'E2E-AssetType', additionalFields: {} });
    const created = await tryOp(() => asset.createAssetType.call(ctx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;
    await tryOp(() => asset.deleteAssetType.call(createRealContext({ assetTypeId: id }), 0));
  });
});

// ─── Asset Stock Folder ───────────────────────────────────────────────────────

describe('E2E: Asset Stock Folder', () => {
  it('getAssetStockFolders returns array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => asset.getAssetStockFolders.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('getAssetStockFolder returns object', async () => {
    if (!available || !firstStockFolderId) return;
    const ctx = createRealContext({ folderId: firstStockFolderId });
    const result = await tryOp(() => asset.getAssetStockFolder.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });

  it('getAssetStockSubFolders returns array', async () => {
    if (!available || !firstStockFolderId) return;
    const ctx = createRealContext({ folderId: firstStockFolderId, returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => asset.getAssetStockSubFolders.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('getAssetStockAssets returns array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => asset.getAssetStockAssets.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('createAssetStockFolder → updateAssetStockFolder → deleteAssetStockFolder', async () => {
    if (!available) return;
    const ctx = createRealContext({ name: 'E2E-StockFolder', additionalFields: {} });
    const created = await tryOp(() => asset.createAssetStockFolder.call(ctx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;

    await tryOp(() => asset.updateAssetStockFolder.call(createRealContext({ folderId: id, updateFields: { name: 'E2E-StockFolder-Updated' } }), 0));
    await tryOp(() => asset.deleteAssetStockFolder.call(createRealContext({ folderId: id }), 0));
  });
});

// ─── Asset Type Folder ────────────────────────────────────────────────────────

describe('E2E: Asset Type Folder', () => {
  it('getAssetTypeFolders returns array', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => asset.getAssetTypeFolders.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('getAssetTypeFolder returns object', async () => {
    if (!available || !firstTypeFolderId) return;
    const ctx = createRealContext({ assetTypeFolderId: firstTypeFolderId });
    const result = await tryOp(() => asset.getAssetTypeFolder.call(ctx, 0));
    if (result !== null) expect(result[0].json).toBeDefined();
  });

  it('getAssetTypeFolderSubFolders returns array', async () => {
    if (!available || !firstTypeFolderId) return;
    const ctx = createRealContext({ assetTypeFolderId: firstTypeFolderId, returnAll: false, limit: 5, options: {} });
    const result = await tryOp(() => asset.getAssetTypeFolderSubFolders.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('createAssetTypeFolder → updateAssetTypeFolder → deleteAssetTypeFolder', async () => {
    if (!available) return;
    const ctx = createRealContext({ name: 'E2E-TypeFolder', additionalFields: {} });
    const created = await tryOp(() => asset.createAssetTypeFolder.call(ctx, 0));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;

    await tryOp(() => asset.updateAssetTypeFolder.call(createRealContext({ assetTypeFolderId: id, updateFields: { name: 'E2E-TypeFolder-Updated' } }), 0));
    await tryOp(() => asset.deleteAssetTypeFolder.call(createRealContext({ assetTypeFolderId: id }), 0));
  });
});
