import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import { validateGuid, validateODataString } from '../../../shared/utils/validation';

export async function getMany(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	if (options.orderBy) {
		const obValidation = validateODataString(options.orderBy as string, 'Order By');
		if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
		qs.OrderBy = options.orderBy as string;
	}

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', '/universaldynamicgroups/v2.0/UniversalDynamicGroups', {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', '/universaldynamicgroups/v2.0/UniversalDynamicGroups', {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('groupId', index) as string;
	const _idValidation = validateGuid(id);
	if (!_idValidation.valid) {
		throw new NodeOperationError(this.getNode(), _idValidation.errors.join(', '), { itemIndex: index });
	}
	const response = await apiRequest.call(this, 'GET', `/universaldynamicgroups/v2.0/UniversalDynamicGroups/${id}`);
	return this.helpers.returnJsonArray([response as IDataObject]);
}

export async function getFolders(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', '/universaldynamicgroups/v2.0/UniversalDynamicGroupsFolder', {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', '/universaldynamicgroups/v2.0/UniversalDynamicGroupsFolder', {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}

export async function getFolder(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('folderId', index) as string;
	const _idValidation = validateGuid(id);
	if (!_idValidation.valid) {
		throw new NodeOperationError(this.getNode(), _idValidation.errors.join(', '), { itemIndex: index });
	}
	const response = await apiRequest.call(this, 'GET', `/universaldynamicgroups/v2.0/UniversalDynamicGroupsFolder/${id}`);
	return this.helpers.returnJsonArray([response as IDataObject]);
}

export async function getSubFolders(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const folderId = this.getNodeParameter('folderId', index) as string;
	const _folderIdValidation = validateGuid(folderId);
	if (!_folderIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
	}
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', `/universaldynamicgroups/v2.0/UniversalDynamicGroupsFolder/${folderId}/Folders`, {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', `/universaldynamicgroups/v2.0/UniversalDynamicGroupsFolder/${folderId}/Folders`, {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}

export async function getGroupsByFolder(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const folderId = this.getNodeParameter('folderId', index) as string;
	const _folderIdValidation = validateGuid(folderId);
	if (!_folderIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
	}
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', `/universaldynamicgroups/v2.0/Folders/${folderId}/UniversalDynamicGroups`, {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', `/universaldynamicgroups/v2.0/Folders/${folderId}/UniversalDynamicGroups`, {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}
