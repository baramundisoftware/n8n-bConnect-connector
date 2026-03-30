import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../transport/requestApi';

// ============================================================================
// VARIABLE DEFINITIONS OPERATIONS
// ============================================================================

export async function getVariableDefinitions(
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
			'/variables/v2.0/VariableDefinitions',
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
			'/variables/v2.0/VariableDefinitions',
			{},
			qs,
		);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function getVariableDefinition(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const variableDefinitionId = this.getNodeParameter('variableDefinitionId', index) as string;
	const response = await apiRequest.call(
		this,
		'GET',
		`/variables/v2.0/VariableDefinitions/${variableDefinitionId}`,
	);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createVariableDefinition(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const dataType = this.getNodeParameter('dataType', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		name,
		dataType,
		...additionalFields,
	};

	const response = await apiRequest.call(
		this,
		'POST',
		'/variables/v2.0/VariableDefinitions',
		body,
	);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateVariableDefinition(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const variableDefinitionId = this.getNodeParameter('variableDefinitionId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	// Build JSON Patch document for PATCH request
	const patchOperations: Array<{ op: string; path: string; value: any }> = [];

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
		`/variables/v2.0/VariableDefinitions/${variableDefinitionId}`,
		patchOperations,
	);

	// Fetch updated variable definition to return
	const response = await apiRequest.call(
		this,
		'GET',
		`/variables/v2.0/VariableDefinitions/${variableDefinitionId}`,
	);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteVariableDefinition(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const variableDefinitionId = this.getNodeParameter('variableDefinitionId', index) as string;
	await apiRequest.call(
		this,
		'DELETE',
		`/variables/v2.0/VariableDefinitions/${variableDefinitionId}`,
	);
	return this.helpers.returnJsonArray({
		success: true,
		deletedId: variableDefinitionId,
	});
}

// ============================================================================
// VARIABLE INSTANCES OPERATIONS
// ============================================================================

export async function getVariableInstances(
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
			'/variables/v2.0/VariableInstances',
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
			'/variables/v2.0/VariableInstances',
			{},
			qs,
		);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function getVariableInstance(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const variableInstanceId = this.getNodeParameter('variableInstanceId', index) as string;
	const response = await apiRequest.call(
		this,
		'GET',
		`/variables/v2.0/VariableInstances/${variableInstanceId}`,
	);
	return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateVariableInstance(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const variableInstanceId = this.getNodeParameter('variableInstanceId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	// Build JSON Patch document for PATCH request
	const patchOperations: Array<{ op: string; path: string; value: any }> = [];

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
		`/variables/v2.0/VariableInstances/${variableInstanceId}`,
		patchOperations,
	);

	// Fetch updated variable instance to return
	const response = await apiRequest.call(
		this,
		'GET',
		`/variables/v2.0/VariableInstances/${variableInstanceId}`,
	);
	return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// VARIABLE INSTANCES BY ENTITY OPERATIONS
// ============================================================================

export async function getVariableInstancesByEndpoint(
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
			`/variables/v2.0/Endpoints/${endpointId}/VariableInstances`,
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
			`/variables/v2.0/Endpoints/${endpointId}/VariableInstances`,
			{},
			qs,
		);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function getVariableInstancesByLogicalGroup(
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
			`/variables/v2.0/LogicalGroups/${logicalGroupId}/VariableInstances`,
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
			`/variables/v2.0/LogicalGroups/${logicalGroupId}/VariableInstances`,
			{},
			qs,
		);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}

export async function getVariableInstancesByADObject(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const adObjectId = this.getNodeParameter('adObjectId', index) as string;
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
			`/variables/v2.0/ADObjects/${adObjectId}/VariableInstances`,
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
			`/variables/v2.0/ADObjects/${adObjectId}/VariableInstances`,
			{},
			qs,
		);
		const data = (response.data as IDataObject[]) || [];
		return this.helpers.returnJsonArray(data);
	}
}
