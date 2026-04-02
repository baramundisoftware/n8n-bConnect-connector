import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import { validateGuid, validateODataString , extractResourceLocatorValue } from '../../../shared/utils/validation';

export async function getInstalledWindowsSoftware(
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
		const response = await apiRequestAllItems.call(this, 'GET', '/software/v2.0/InstalledWindowsSoftware', {}, qs);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	} else {
		qs.PageSize = limit;
		qs.Page = 0;
		const response = await apiRequest.call(this, 'GET', '/software/v2.0/InstalledWindowsSoftware', {}, qs);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function getInstalledSoftwareByEndpoint(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
	const _endpointIdValidation = validateGuid(endpointId);
	if (!_endpointIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
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
		const response = await apiRequestAllItems.call(this, 'GET', `/software/v2.0/WindowsEndpoints/${endpointId}/InstalledWindowsSoftware`, {}, qs);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	} else {
		qs.PageSize = limit;
		qs.Page = 0;
		const response = await apiRequest.call(this, 'GET', `/software/v2.0/WindowsEndpoints/${endpointId}/InstalledWindowsSoftware`, {}, qs);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function getInstalledSoftwareByLogicalGroup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const logicalGroupId = this.getNodeParameter('logicalGroupId', index) as string;
	const _logicalGroupIdValidation = validateGuid(logicalGroupId);
	if (!_logicalGroupIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _logicalGroupIdValidation.errors.join(', '), { itemIndex: index });
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
		const response = await apiRequestAllItems.call(this, 'GET', `/software/v2.0/LogicalGroups/${logicalGroupId}/InstalledWindowsSoftware`, {}, qs);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	} else {
		qs.PageSize = limit;
		qs.Page = 0;
		const response = await apiRequest.call(this, 'GET', `/software/v2.0/LogicalGroups/${logicalGroupId}/InstalledWindowsSoftware`, {}, qs);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function getInstalledSoftwareByUniversalDynamicGroup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const universalDynamicGroupId = this.getNodeParameter('universalDynamicGroupId', index) as string;
	const _universalDynamicGroupIdValidation = validateGuid(universalDynamicGroupId);
	if (!_universalDynamicGroupIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _universalDynamicGroupIdValidation.errors.join(', '), { itemIndex: index });
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
		const response = await apiRequestAllItems.call(this, 'GET', `/software/v2.0/UniversalDynamicGroups/${universalDynamicGroupId}/InstalledWindowsSoftware`, {}, qs);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	} else {
		qs.PageSize = limit;
		qs.Page = 0;
		const response = await apiRequest.call(this, 'GET', `/software/v2.0/UniversalDynamicGroups/${universalDynamicGroupId}/InstalledWindowsSoftware`, {}, qs);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

// ============================================================================
// BUNDLE OPERATIONS (bMS 26R1+)
// ============================================================================

export async function getBundles(
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
		const response = await apiRequestAllItems.call(this, 'GET', '/software/v2.0/Bundles', {}, qs);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	} else {
		qs.PageSize = limit;
		qs.Page = 0;
		const response = await apiRequest.call(this, 'GET', '/software/v2.0/Bundles', {}, qs);
		return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
	}
}

export async function getBundle(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bundleId = this.getNodeParameter('bundleId', index) as string;
	const _bundleIdValidation = validateGuid(bundleId);
	if (!_bundleIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _bundleIdValidation.errors.join(', '), { itemIndex: index });
	}
	const response = await apiRequest.call(this, 'GET', `/software/v2.0/Bundles/${bundleId}`);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createBundle(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	const body: IDataObject = { name, ...additionalFields };
	const response = await apiRequest.call(this, 'POST', '/software/v2.0/Bundles', body);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteBundle(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bundleId = this.getNodeParameter('bundleId', index) as string;
	const _bundleIdValidation = validateGuid(bundleId);
	if (!_bundleIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _bundleIdValidation.errors.join(', '), { itemIndex: index });
	}
	await apiRequest.call(this, 'DELETE', `/software/v2.0/Bundles/${bundleId}`);
	return this.helpers.returnJsonArray({ success: true, deletedId: bundleId });
}

// ============================================================================
// BUNDLE FOLDER OPERATIONS (bMS 26R1+)
// ============================================================================

export async function getBundleFolders(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 50) as number;

	const qs: Record<string, string | number> = {};

	if (returnAll) {
		const response = await apiRequestAllItems.call(this, 'GET', '/software/v2.0/Bundle/Folders', {}, qs);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	} else {
		qs.PageSize = limit;
		qs.Page = 0;
		const response = await apiRequest.call(this, 'GET', '/software/v2.0/Bundle/Folders', {}, qs);
		return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
	}
}

export async function getBundleFolder(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bundleFolderId = this.getNodeParameter('bundleFolderId', index) as string;
	const _bundleFolderIdValidation = validateGuid(bundleFolderId);
	if (!_bundleFolderIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _bundleFolderIdValidation.errors.join(', '), { itemIndex: index });
	}
	const response = await apiRequest.call(this, 'GET', `/software/v2.0/Bundle/Folders/${bundleFolderId}`);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getBundleSubFolders(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bundleFolderId = this.getNodeParameter('bundleFolderId', index) as string;
	const _bundleFolderIdValidation = validateGuid(bundleFolderId);
	if (!_bundleFolderIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _bundleFolderIdValidation.errors.join(', '), { itemIndex: index });
	}
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 50) as number;

	const qs: Record<string, string | number> = {};

	if (returnAll) {
		const response = await apiRequestAllItems.call(this, 'GET', `/software/v2.0/Bundle/Folders/${bundleFolderId}/Folders`, {}, qs);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	} else {
		qs.PageSize = limit;
		qs.Page = 0;
		const response = await apiRequest.call(this, 'GET', `/software/v2.0/Bundle/Folders/${bundleFolderId}/Folders`, {}, qs);
		return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
	}
}

export async function createBundleFolder(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	const body: IDataObject = { name, ...additionalFields };
	const response = await apiRequest.call(this, 'POST', '/software/v2.0/Bundle/Folders', body);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteBundleFolder(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bundleFolderId = this.getNodeParameter('bundleFolderId', index) as string;
	const _bundleFolderIdValidation = validateGuid(bundleFolderId);
	if (!_bundleFolderIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _bundleFolderIdValidation.errors.join(', '), { itemIndex: index });
	}
	await apiRequest.call(this, 'DELETE', `/software/v2.0/Bundle/Folders/${bundleFolderId}`);
	return this.helpers.returnJsonArray({ success: true, deletedId: bundleFolderId });
}

export async function getBundleApplicationsByBundle(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bundleId = this.getNodeParameter('bundleId', index) as string;
	const _bundleIdValidation = validateGuid(bundleId);
	if (!_bundleIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _bundleIdValidation.errors.join(', '), { itemIndex: index });
	}
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 50) as number;

	const qs: Record<string, string | number> = {};

	if (returnAll) {
		const response = await apiRequestAllItems.call(this, 'GET', `/software/v2.0/Bundles/${bundleId}/BundleApplications`, {}, qs);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	} else {
		qs.PageSize = limit;
		qs.Page = 0;
		const response = await apiRequest.call(this, 'GET', `/software/v2.0/Bundles/${bundleId}/BundleApplications`, {}, qs);
		return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
	}
}

// ============================================================================
// SOFTWARE GAPS (Phase 8E) — all 26R1-only
// ============================================================================

export async function addApplicationToBundle(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const bundleId = this.getNodeParameter('bundleId', index) as string;
  const _bundleIdValidation = validateGuid(bundleId);
  if (!_bundleIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _bundleIdValidation.errors.join(', '), { itemIndex: index });
  }
  const applicationId = this.getNodeParameter('applicationId', index) as string;
  const _applicationIdValidation = validateGuid(applicationId);
  if (!_applicationIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _applicationIdValidation.errors.join(', '), { itemIndex: index });
  }
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = { applicationId, ...additionalFields };
  const response = await apiRequest.call(this, 'POST', `/software/v2.0/Bundles/${bundleId}/BundleApplications`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function replaceApplicationInBundle(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const bundleId = this.getNodeParameter('bundleId', index) as string;
  const _bundleIdValidation = validateGuid(bundleId);
  if (!_bundleIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _bundleIdValidation.errors.join(', '), { itemIndex: index });
  }
  const bundleApplicationId = this.getNodeParameter('bundleApplicationId', index) as string;
  const _bundleApplicationIdValidation = validateGuid(bundleApplicationId);
  if (!_bundleApplicationIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _bundleApplicationIdValidation.errors.join(', '), { itemIndex: index });
  }
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

  const response = await apiRequest.call(this, 'PATCH', `/software/v2.0/Bundles/${bundleId}/BundleApplications/${bundleApplicationId}`, patchOperations);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateBundleFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const bundleFolderId = this.getNodeParameter('bundleFolderId', index) as string;
  const _bundleFolderIdValidation = validateGuid(bundleFolderId);
  if (!_bundleFolderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _bundleFolderIdValidation.errors.join(', '), { itemIndex: index });
  }
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

  const response = await apiRequest.call(this, 'PATCH', `/software/v2.0/Bundle/Folders/${bundleFolderId}`, patchOperations);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getBundleApplications(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/software/v2.0/BundleApplications', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/software/v2.0/BundleApplications', {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function deleteBundleApplication(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const bundleApplicationId = this.getNodeParameter('bundleApplicationId', index) as string;
  const _bundleApplicationIdValidation = validateGuid(bundleApplicationId);
  if (!_bundleApplicationIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _bundleApplicationIdValidation.errors.join(', '), { itemIndex: index });
  }
  await apiRequest.call(this, 'DELETE', `/software/v2.0/BundleApplications/${bundleApplicationId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: bundleApplicationId });
}
