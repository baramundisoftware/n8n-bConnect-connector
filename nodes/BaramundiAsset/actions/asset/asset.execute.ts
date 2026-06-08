import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import { validateGuid, validateODataString , extractResourceLocatorValue } from '../../../shared/utils/validation';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetId = this.getNodeParameter('assetId', index) as string;
  const assetIdValidation = validateGuid(assetId);
  if (!assetIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset ID:\n${assetIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.OrderBy = options.orderBy;
  }

  if (options.assetTypeId) {
    const atIdValidation = validateGuid(options.assetTypeId);
    if (!atIdValidation.valid) {
      throw new NodeOperationError(this.getNode(), `Invalid asset type ID:\n${atIdValidation.errors.join('\n')}`, { itemIndex: index });
    }
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
  const assetTypeIdValidation = validateGuid(assetTypeId);
  if (!assetTypeIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset type ID:\n${assetTypeIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const assetIdValidation = validateGuid(assetId);
  if (!assetIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset ID:\n${assetIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
    throw new NodeOperationError(this.getNode(), 'No fields to update specified');
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
  const assetIdValidation = validateGuid(assetId);
  if (!assetIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset ID:\n${assetIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
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
  const assetTypeIdValidation = validateGuid(assetTypeId);
  if (!assetTypeIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset type ID:\n${assetTypeIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const assetTypeIdValidation = validateGuid(assetTypeId);
  if (!assetTypeIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset type ID:\n${assetTypeIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const endpointIdValidation = validateGuid(endpointId);
  if (!endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid endpoint ID:\n${endpointIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
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
  const logicalGroupIdValidation = validateGuid(logicalGroupId);
  if (!logicalGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid logical group ID:\n${logicalGroupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
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
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
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
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
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
  const folderIdValidation = validateGuid(folderId);
  if (!folderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid folder ID:\n${folderIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
    throw new NodeOperationError(this.getNode(), 'No fields to update specified');
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
  const folderIdValidation = validateGuid(folderId);
  if (!folderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid folder ID:\n${folderIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const adObjectIdValidation = validateGuid(adObjectId);
  if (!adObjectIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid AD object ID:\n${adObjectIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const orgUnitIdValidation = validateGuid(orgUnitId);
  if (!orgUnitIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid org unit ID:\n${orgUnitIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const folderIdValidation = validateGuid(folderId);
  if (!folderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid folder ID:\n${folderIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/assets/v2.0/AssetStock/Folders/${folderId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getAssetStockSubFolders(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = this.getNodeParameter('folderId', index) as string;
  const folderIdValidation = validateGuid(folderId);
  if (!folderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid folder ID:\n${folderIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    qs.SearchQuery = options.searchQuery;
  }
  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    qs.OrderBy = options.orderBy;
  }

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
  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    qs.SearchQuery = options.searchQuery;
  }
  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    qs.OrderBy = options.orderBy;
  }

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
  const atfIdValidation = validateGuid(assetTypeFolderId);
  if (!atfIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset type folder ID:\n${atfIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const atfIdValidation = validateGuid(assetTypeFolderId);
  if (!atfIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset type folder ID:\n${atfIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const patchOperations: Array<{op: string; path: string; value: unknown}> = [];
  for (const [key, value] of Object.entries(updateFields)) {
    if (value !== undefined && value !== null && value !== '') {
      patchOperations.push({ op: 'replace', path: `/${key}`, value });
    }
  }

  if (patchOperations.length === 0) {
    throw new NodeOperationError(this.getNode(), 'No fields to update specified');
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
  const atfIdValidation = validateGuid(assetTypeFolderId);
  if (!atfIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset type folder ID:\n${atfIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  await apiRequest.call(this, 'DELETE', `/assets/v2.0/AssetTypes/Folders/${assetTypeFolderId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: assetTypeFolderId });
}

export async function getAssetTypeFolderSubFolders(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const assetTypeFolderId = this.getNodeParameter('assetTypeFolderId', index) as string;
  const atfIdValidation = validateGuid(assetTypeFolderId);
  if (!atfIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid asset type folder ID:\n${atfIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    qs.SearchQuery = options.searchQuery;
  }
  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    qs.OrderBy = options.orderBy;
  }

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
