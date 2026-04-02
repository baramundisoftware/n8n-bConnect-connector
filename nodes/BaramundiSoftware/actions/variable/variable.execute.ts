import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import { validateGuid, validateODataString , extractResourceLocatorValue } from '../../../shared/utils/validation';

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
	const _variableDefinitionIdValidation = validateGuid(variableDefinitionId);
	if (!_variableDefinitionIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _variableDefinitionIdValidation.errors.join(', '), { itemIndex: index });
	}
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
	const _variableDefinitionIdValidation = validateGuid(variableDefinitionId);
	if (!_variableDefinitionIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _variableDefinitionIdValidation.errors.join(', '), { itemIndex: index });
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
	const _variableDefinitionIdValidation = validateGuid(variableDefinitionId);
	if (!_variableDefinitionIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _variableDefinitionIdValidation.errors.join(', '), { itemIndex: index });
	}
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
	const _variableInstanceIdValidation = validateGuid(variableInstanceId);
	if (!_variableInstanceIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _variableInstanceIdValidation.errors.join(', '), { itemIndex: index });
	}
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
	const _variableInstanceIdValidation = validateGuid(variableInstanceId);
	if (!_variableInstanceIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _variableInstanceIdValidation.errors.join(', '), { itemIndex: index });
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
	const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
	const _endpointIdValidation = validateGuid(endpointId);
	if (!_endpointIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
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
	const _logicalGroupIdValidation = validateGuid(logicalGroupId);
	if (!_logicalGroupIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _logicalGroupIdValidation.errors.join(', '), { itemIndex: index });
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
	const _adObjectIdValidation = validateGuid(adObjectId);
	if (!_adObjectIdValidation.valid) {
		throw new NodeOperationError(this.getNode(), _adObjectIdValidation.errors.join(', '), { itemIndex: index });
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

// ============================================================================
// VARIABLE GAPS (Phase 8F)
// ============================================================================

export async function getVariableInstancesByApplication(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const applicationId = this.getNodeParameter('applicationId', index) as string;
  const _applicationIdValidation = validateGuid(applicationId);
  if (!_applicationIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _applicationIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/variables/v2.0/WindowsApplications/${applicationId}/VariableInstances`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/variables/v2.0/WindowsApplications/${applicationId}/VariableInstances`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getVariableInstancesByJobDefinition(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobDefinitionId = this.getNodeParameter('jobDefinitionId', index) as string;
  const _jobDefinitionIdValidation = validateGuid(jobDefinitionId);
  if (!_jobDefinitionIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobDefinitionIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/variables/v2.0/WindowsJobDefinitions/${jobDefinitionId}/VariableInstances`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/variables/v2.0/WindowsJobDefinitions/${jobDefinitionId}/VariableInstances`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}
