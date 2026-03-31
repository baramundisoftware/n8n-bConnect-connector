import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../transport/requestApi';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetId = this.getNodeParameter('assetId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/assets/v2.0/Assets/${assetId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getMany(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
    assetTypeId?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (options.assetTypeId) {
    qs.AssetTypeId = options.assetTypeId;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/assets/v2.0/Assets', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/assets/v2.0/Assets', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetTypeId = this.getNodeParameter('assetTypeId', index) as string;
  const displayName = this.getNodeParameter('displayName', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    assetTypeId,
    displayName,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/assets/v2.0/Assets', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetId = this.getNodeParameter('assetId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  // Build JSON Patch document for PATCH request
  const patchOperations: Array<{op: string; path: string; value: unknown}> = [];

  for (const [key, value] of Object.entries(updateFields)) {
    if (value !== undefined && value !== null && value !== '') {
      patchOperations.push({
        op: 'replace',
        path: `/${key}`,
        value,
      });
    }
  }

  if (patchOperations.length === 0) {
    throw new Error('No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/assets/v2.0/Assets/${assetId}`, patchOperations);

  // Fetch updated asset to return
  const response = await apiRequest.call(this, 'GET', `/assets/v2.0/Assets/${assetId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteAsset(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetId = this.getNodeParameter('assetId', index) as string;
  await apiRequest.call(this, 'DELETE', `/assets/v2.0/Assets/${assetId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: assetId });
}

// ============================================================================
// ASSET TYPES OPERATIONS
// ============================================================================

export async function getAssetTypes(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/assets/v2.0/AssetTypes', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/assets/v2.0/AssetTypes', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getAssetType(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetTypeId = this.getNodeParameter('assetTypeId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/assets/v2.0/AssetTypes/${assetTypeId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createAssetType(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/assets/v2.0/AssetTypes', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteAssetType(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetTypeId = this.getNodeParameter('assetTypeId', index) as string;
  await apiRequest.call(this, 'DELETE', `/assets/v2.0/AssetTypes/${assetTypeId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: assetTypeId });
}

// ============================================================================
// ASSET ORGANIZATION OPERATIONS
// ============================================================================

export async function getAssetsByEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this,
      'GET',
      `/assets/v2.0/WindowsEndpoint/${endpointId}/Assets`,
      {},
      qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this,
      'GET',
      `/assets/v2.0/WindowsEndpoint/${endpointId}/Assets`,
      {},
      qs,
    );
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getAssetsByLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const logicalGroupId = this.getNodeParameter('logicalGroupId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this,
      'GET',
      `/assets/v2.0/LogicalGroups/${logicalGroupId}/Assets`,
      {},
      qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this,
      'GET',
      `/assets/v2.0/LogicalGroups/${logicalGroupId}/Assets`,
      {},
      qs,
    );
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

// ============================================================================
// ASSET STOCK OPERATIONS
// ============================================================================

export async function getAssetStockAssets(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/assets/v2.0/AssetStock/Assets', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/assets/v2.0/AssetStock/Assets', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getAssetStockFolders(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/assets/v2.0/AssetStock/Folders', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/assets/v2.0/AssetStock/Folders', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function createAssetStockFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/assets/v2.0/AssetStock/Folders', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateAssetStockFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = this.getNodeParameter('folderId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  // Build JSON Patch document for PATCH request
  const patchOperations: Array<{op: string; path: string; value: unknown}> = [];

  for (const [key, value] of Object.entries(updateFields)) {
    if (value !== undefined && value !== null && value !== '') {
      patchOperations.push({
        op: 'replace',
        path: `/${key}`,
        value,
      });
    }
  }

  if (patchOperations.length === 0) {
    throw new Error('No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/assets/v2.0/AssetStock/Folders/${folderId}`, patchOperations);

  // Fetch updated folder to return
  const response = await apiRequest.call(this, 'GET', `/assets/v2.0/AssetStock/Folders/${folderId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteAssetStockFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = this.getNodeParameter('folderId', index) as string;
  await apiRequest.call(this, 'DELETE', `/assets/v2.0/AssetStock/Folders/${folderId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: folderId });
}

// ============================================================================
// AD OBJECT / ORG UNIT ASSET OPERATIONS (bMS 26R1+)
// ============================================================================

export async function getAssetsByADObject(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const adObjectId = this.getNodeParameter('adObjectId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  const qs: Record<string, string | number> = {};

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/assets/v2.0/ADObjects/${adObjectId}/Assets`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/assets/v2.0/ADObjects/${adObjectId}/Assets`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getAssetsByOrgUnit(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const orgUnitId = this.getNodeParameter('orgUnitId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  const qs: Record<string, string | number> = {};

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/assets/v2.0/OrgUnits/${orgUnitId}/Assets`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/assets/v2.0/OrgUnits/${orgUnitId}/Assets`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

// ============================================================================
// ASSET STOCK FOLDER OPERATIONS (Phase 8B)
// ============================================================================

export async function getAssetStockFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = this.getNodeParameter('folderId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/assets/v2.0/AssetStock/Folders/${folderId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getAssetStockSubFolders(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = this.getNodeParameter('folderId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) qs.SearchQuery = options.searchQuery;
  if (options.orderBy) qs.OrderBy = options.orderBy;

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/assets/v2.0/AssetStock/Folders/${folderId}/Folders`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/assets/v2.0/AssetStock/Folders/${folderId}/Folders`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

// ============================================================================
// ASSET TYPE FOLDER OPERATIONS (Phase 8B)
// ============================================================================

export async function getAssetTypeFolders(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) qs.SearchQuery = options.searchQuery;
  if (options.orderBy) qs.OrderBy = options.orderBy;

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/assets/v2.0/AssetTypes/Folders', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/assets/v2.0/AssetTypes/Folders', {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getAssetTypeFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetTypeFolderId = this.getNodeParameter('assetTypeFolderId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createAssetTypeFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = { name, ...additionalFields };
  const response = await apiRequest.call(this, 'POST', '/assets/v2.0/AssetTypes/Folders', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateAssetTypeFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetTypeFolderId = this.getNodeParameter('assetTypeFolderId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const patchOperations: Array<{op: string; path: string; value: unknown}> = [];
  for (const [key, value] of Object.entries(updateFields)) {
    if (value !== undefined && value !== null && value !== '') {
      patchOperations.push({ op: 'replace', path: `/${key}`, value });
    }
  }

  if (patchOperations.length === 0) {
    throw new Error('No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}`, patchOperations);
  const response = await apiRequest.call(this, 'GET', `/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteAssetTypeFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetTypeFolderId = this.getNodeParameter('assetTypeFolderId', index) as string;
  await apiRequest.call(this, 'DELETE', `/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: assetTypeFolderId });
}

export async function getAssetTypeFolderSubFolders(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetTypeFolderId = this.getNodeParameter('assetTypeFolderId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) qs.SearchQuery = options.searchQuery;
  if (options.orderBy) qs.OrderBy = options.orderBy;

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}/Folders`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}/Folders`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}
