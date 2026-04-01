import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../transport/requestApi';
import { validateGuid } from '../../utils/validation';

// ============================================================================
// FOLDERS OPERATIONS
// ============================================================================

export async function getFolders(
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
		const response = await apiRequestAllItems.call(
			this,
			'GET',
			'/operatingsystems/v2.0/Folders',
			{},
			qs,
		);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	} else {
		qs.PageSize = limit;
		qs.Page = 0;
		const response = await apiRequest.call(this, 'GET', '/operatingsystems/v2.0/Folders', {}, qs);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function getFolder(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const folderId = this.getNodeParameter('folderId', index) as string;
	const _folderIdValidation = validateGuid(folderId);
	if (!_folderIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
	}
	const response = await apiRequest.call(this, 'GET', `/operatingsystems/v2.0/Folders/${folderId}`);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getFoldersByFolderId(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const folderId = this.getNodeParameter('folderId', index) as string;
	const _folderIdValidation = validateGuid(folderId);
	if (!_folderIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
	}
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
			`/operatingsystems/v2.0/Folders/${folderId}/Folders`,
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
			`/operatingsystems/v2.0/Folders/${folderId}/Folders`,
			{},
			qs,
		);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function createFolder(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name,
		...additionalFields,
	};

	const response = await apiRequest.call(this, 'POST', '/operatingsystems/v2.0/Folders', body);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateFolder(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const folderId = this.getNodeParameter('folderId', index) as string;
	const _folderIdValidation = validateGuid(folderId);
	if (!_folderIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
	}
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	// Build JSON Patch document for PATCH request
	const patchOperations: Array<{ op: string; path: string; value: unknown }> = [];

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

	await apiRequest.call(
		this,
		'PATCH',
		`/operatingsystems/v2.0/Folders/${folderId}`,
		patchOperations,
	);

	// Fetch updated folder to return
	const response = await apiRequest.call(this, 'GET', `/operatingsystems/v2.0/Folders/${folderId}`);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteFolder(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const folderId = this.getNodeParameter('folderId', index) as string;
	const _folderIdValidation = validateGuid(folderId);
	if (!_folderIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
	}
	await apiRequest.call(this, 'DELETE', `/operatingsystems/v2.0/Folders/${folderId}`);
	return this.helpers.returnJsonArray({ success: true, deletedId: folderId });
}

// ============================================================================
// WINDOWS ENDPOINTS OPERATIONS
// ============================================================================

export async function getWindowsEndpoints(
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
		const response = await apiRequestAllItems.call(
			this,
			'GET',
			'/operatingsystems/v2.0/WindowsEndpoints',
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
			'/operatingsystems/v2.0/WindowsEndpoints',
			{},
			qs,
		);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function getWindowsEndpoint(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const endpointId = this.getNodeParameter('endpointId', index) as string;
	const _endpointIdValidation = validateGuid(endpointId);
	if (!_endpointIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
	}
	const response = await apiRequest.call(
		this,
		'GET',
		`/operatingsystems/v2.0/WindowsEndpoints/${endpointId}`,
	);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateWindowsEndpoint(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const endpointId = this.getNodeParameter('endpointId', index) as string;
	const _endpointIdValidation = validateGuid(endpointId);
	if (!_endpointIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
	}
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	// Build JSON Patch document for PATCH request
	const patchOperations: Array<{ op: string; path: string; value: unknown }> = [];

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

	await apiRequest.call(
		this,
		'PATCH',
		`/operatingsystems/v2.0/WindowsEndpoints/${endpointId}`,
		patchOperations,
	);

	// Fetch updated endpoint to return
	const response = await apiRequest.call(
		this,
		'GET',
		`/operatingsystems/v2.0/WindowsEndpoints/${endpointId}`,
	);
	return this.helpers.returnJsonArray(response as IDataObject);
}
