import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import { validateGuid, validateODataString } from '../../../shared/utils/validation';

const MAX_COMMENT_LENGTH = 4000;

/** JSON Patch paths of the modifiable threshold values (spelled as in the spec example). */
const PATCH_PATHS: Record<string, string> = {
	value: '/Value',
	type: '/Type',
	severity: '/Severity',
	isActive: '/IsActive',
	comment: '/Comment',
};

function guidParameter(this: IExecuteFunctions, name: string, index: number): string {
	const id = this.getNodeParameter(name, index) as string;
	const validation = validateGuid(id);
	if (!validation.valid) {
		throw new NodeOperationError(this.getNode(), validation.errors.join(', '), { itemIndex: index });
	}
	return id;
}

function checkComment(this: IExecuteFunctions, comment: unknown, index: number): void {
	if (typeof comment === 'string' && comment.length > MAX_COMMENT_LENGTH) {
		throw new NodeOperationError(this.getNode(), `Comment is longer than ${MAX_COMMENT_LENGTH} characters`, { itemIndex: index });
	}
}

async function list(this: IExecuteFunctions, index: number, path: string): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	const qs: Record<string, string | number> = {};
	for (const [option, param, label] of [['searchQuery', 'SearchQuery', 'Search Query'], ['orderBy', 'OrderBy', 'Order By']]) {
		if (!options[option]) continue;
		const validation = validateODataString(options[option] as string, label);
		if (!validation.valid) throw new NodeOperationError(this.getNode(), validation.errors.join('\n'), { itemIndex: index });
		qs[param] = options[option] as string;
	}

	if (returnAll) {
		const data = await apiRequestAllItems.call(this, 'GET', path, {}, qs);
		return this.helpers.returnJsonArray(data);
	}
	qs.PageSize = this.getNodeParameter('limit', index) as number;
	qs.Page = 0;
	const response = await apiRequest.call(this, 'GET', path, {}, qs);
	return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
}

export async function getMany(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	return await list.call(this, index, '/universaldynamicgroups/v2.0/Thresholds');
}

export async function getByGroup(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = guidParameter.call(this, 'dynamicGroupId', index);
	return await list.call(this, index, `/universaldynamicgroups/v2.0/UniversalDynamicGroups/${groupId}/Thresholds`);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = guidParameter.call(this, 'thresholdId', index);
	const response = await apiRequest.call(this, 'GET', `/universaldynamicgroups/v2.0/Thresholds/${id}`);
	return this.helpers.returnJsonArray([response as IDataObject]);
}

export async function create(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const dynamicGroupId = guidParameter.call(this, 'dynamicGroupId', index);
	const securityProfileId = guidParameter.call(this, 'securityProfileId', index);
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	checkComment.call(this, additionalFields.comment, index);

	const body: IDataObject = {
		dynamicGroupId,
		securityProfileId,
		value: this.getNodeParameter('value', index) as number,
		type: this.getNodeParameter('type', index) as string,
		severity: this.getNodeParameter('severity', index) as string,
		isActive: this.getNodeParameter('isActive', index, true) as boolean,
	};
	if (additionalFields.comment) body.comment = additionalFields.comment;

	const response = await apiRequest.call(this, 'POST', '/universaldynamicgroups/v2.0/Thresholds', body);
	return this.helpers.returnJsonArray([response as IDataObject]);
}

export async function update(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = guidParameter.call(this, 'thresholdId', index);
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;
	checkComment.call(this, updateFields.comment, index);

	const patchOperations = Object.entries(updateFields)
		.filter(([key, value]) => key in PATCH_PATHS && value !== undefined && value !== null)
		.map(([key, value]) => ({ op: 'replace', path: PATCH_PATHS[key], value }));
	if (patchOperations.length === 0) {
		throw new NodeOperationError(this.getNode(), 'No fields to update specified', { itemIndex: index });
	}

	// PATCH returns the updated threshold
	const response = await apiRequest.call(this, 'PATCH', `/universaldynamicgroups/v2.0/Thresholds/${id}`, patchOperations);
	return this.helpers.returnJsonArray([response as IDataObject]);
}

export async function deleteThreshold(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = guidParameter.call(this, 'thresholdId', index);
	await apiRequest.call(this, 'DELETE', `/universaldynamicgroups/v2.0/Thresholds/${id}`);
	return this.helpers.returnJsonArray({ success: true, deletedId: id });
}
