import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import { validateGuid, validateODataString } from '../../../shared/utils/validation';

export async function getRules(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	if (options.orderBy) {
		const obValidation = validateODataString(options.orderBy as string, 'Order By');
		if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
		qs.OrderBy = options.orderBy as string;
	}

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', '/compliance/v2.0/Rules', {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', '/compliance/v2.0/Rules', {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}

export async function getRule(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('ruleId', index) as string;
	const validation = validateGuid(id);
	if (!validation.valid) throw new NodeOperationError(this.getNode(), `Rule ID: ${validation.errors.join(', ')}`, { itemIndex: index });
	const response = await apiRequest.call(this, 'GET', `/compliance/v2.0/Rules/${id}`);
	return this.helpers.returnJsonArray([response as IDataObject]);
}

export async function getVulnerabilities(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	if (options.orderBy) {
		const obValidation = validateODataString(options.orderBy as string, 'Order By');
		if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
		qs.OrderBy = options.orderBy as string;
	}

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', '/compliance/v2.0/Vulnerabilities', {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', '/compliance/v2.0/Vulnerabilities', {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}

export async function getVulnerability(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('vulnerabilityId', index) as string;
	const validation = validateGuid(id);
	if (!validation.valid) throw new NodeOperationError(this.getNode(), `Vulnerability ID: ${validation.errors.join(', ')}`, { itemIndex: index });
	const response = await apiRequest.call(this, 'GET', `/compliance/v2.0/Vulnerabilities/${id}`);
	return this.helpers.returnJsonArray([response as IDataObject]);
}

export async function getDetectedVulnerabilities(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	if (options.orderBy) {
		const obValidation = validateODataString(options.orderBy as string, 'Order By');
		if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
		qs.OrderBy = options.orderBy as string;
	}

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', '/compliance/v2.0/DetectedVulnerabilities', {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', '/compliance/v2.0/DetectedVulnerabilities', {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}

export async function getDetectedVulnerabilitiesByEndpoint(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const endpointId = this.getNodeParameter('endpointId', index) as string;
	const endpointValidation = validateGuid(endpointId);
	if (!endpointValidation.valid) throw new NodeOperationError(this.getNode(), `Endpoint ID: ${endpointValidation.errors.join(', ')}`, { itemIndex: index });
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', `/compliance/v2.0/WindowsEndpoints/${endpointId}/DetectedVulnerabilities`, {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', `/compliance/v2.0/WindowsEndpoints/${endpointId}/DetectedVulnerabilities`, {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}

export async function getDetectedRuleViolations(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	if (options.orderBy) {
		const obValidation = validateODataString(options.orderBy as string, 'Order By');
		if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
		qs.OrderBy = options.orderBy as string;
	}

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', '/compliance/v2.0/DetectedRuleViolations', {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', '/compliance/v2.0/DetectedRuleViolations', {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}

export async function getDetectedRuleViolationsByEndpoint(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const endpointId = this.getNodeParameter('endpointId', index) as string;
	const endpointValidation = validateGuid(endpointId);
	if (!endpointValidation.valid) throw new NodeOperationError(this.getNode(), `Endpoint ID: ${endpointValidation.errors.join(', ')}`, { itemIndex: index });
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: Record<string, string | number> = {};

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', `/compliance/v2.0/Endpoints/${endpointId}/DetectedRuleViolations`, {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', `/compliance/v2.0/Endpoints/${endpointId}/DetectedRuleViolations`, {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}
