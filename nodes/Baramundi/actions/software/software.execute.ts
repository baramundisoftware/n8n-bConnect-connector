import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../transport/requestApi';

export async function getInstalledWindowsSoftware(
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
	const endpointId = this.getNodeParameter('endpointId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 50) as number;
	const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

	const qs: Record<string, string | number> = {};
	if (options.searchQuery) qs.SearchQuery = options.searchQuery;
	if (options.orderBy) qs.OrderBy = options.orderBy;

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
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 50) as number;
	const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

	const qs: Record<string, string | number> = {};
	if (options.searchQuery) qs.SearchQuery = options.searchQuery;
	if (options.orderBy) qs.OrderBy = options.orderBy;

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
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const limit = this.getNodeParameter('limit', index, 50) as number;
	const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

	const qs: Record<string, string | number> = {};
	if (options.searchQuery) qs.SearchQuery = options.searchQuery;
	if (options.orderBy) qs.OrderBy = options.orderBy;

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
	if (options.searchQuery) qs.SearchQuery = options.searchQuery;
	if (options.orderBy) qs.OrderBy = options.orderBy;

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
	const response = await apiRequest.call(this, 'GET', `/software/v2.0/Bundle/Folders/${bundleFolderId}`);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getBundleSubFolders(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bundleFolderId = this.getNodeParameter('bundleFolderId', index) as string;
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
	await apiRequest.call(this, 'DELETE', `/software/v2.0/Bundle/Folders/${bundleFolderId}`);
	return this.helpers.returnJsonArray({ success: true, deletedId: bundleFolderId });
}

export async function getBundleApplicationsByBundle(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const bundleId = this.getNodeParameter('bundleId', index) as string;
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
