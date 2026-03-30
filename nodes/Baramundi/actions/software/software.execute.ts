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
