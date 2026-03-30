import type { INodeProperties } from 'n8n-workflow';

export const softwareOperations: INodeProperties[] = [{
	displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
	displayOptions: { show: { resource: ['software'] } },
	options: [
		{ name: 'Get Installed Software', value: 'getInstalledWindowsSoftware', description: 'Get all installed Windows software', action: 'Get installed software' },
		{ name: 'Get Software by Endpoint', value: 'getInstalledSoftwareByEndpoint', description: 'Get installed software for an endpoint', action: 'Get software by endpoint' },
		{ name: 'Get Software by Logical Group', value: 'getInstalledSoftwareByLogicalGroup', description: 'Get installed software for a logical group', action: 'Get software by logical group' },
		{ name: 'Get Software by Universal Dynamic Group', value: 'getInstalledSoftwareByUniversalDynamicGroup', description: 'Get installed software for a universal dynamic group (requires bMS 26R1+)', action: 'Get software by universal dynamic group' },
	],
	default: 'getInstalledWindowsSoftware',
}];

export const softwareFields: INodeProperties[] = [
	{ displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['software'], operation: ['getInstalledWindowsSoftware', 'getInstalledSoftwareByEndpoint', 'getInstalledSoftwareByLogicalGroup', 'getInstalledSoftwareByUniversalDynamicGroup'] } }, description: 'Whether to return all results or only up to a given limit' },
	{ displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50, displayOptions: { show: { resource: ['software'], operation: ['getInstalledWindowsSoftware', 'getInstalledSoftwareByEndpoint', 'getInstalledSoftwareByLogicalGroup', 'getInstalledSoftwareByUniversalDynamicGroup'], returnAll: [false] } }, description: 'Max number of results to return' },
	{ displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {}, displayOptions: { show: { resource: ['software'], operation: ['getInstalledWindowsSoftware', 'getInstalledSoftwareByEndpoint', 'getInstalledSoftwareByLogicalGroup', 'getInstalledSoftwareByUniversalDynamicGroup'] } }, options: [
		{ displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
		{ displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
	]},
	{ displayName: 'Endpoint ID', name: 'endpointId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['getInstalledSoftwareByEndpoint'] } }, description: 'The GUID of the endpoint' },
	{ displayName: 'Logical Group ID', name: 'logicalGroupId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['getInstalledSoftwareByLogicalGroup'] } }, description: 'The GUID of the logical group' },
	{ displayName: 'Universal Dynamic Group ID', name: 'universalDynamicGroupId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['getInstalledSoftwareByUniversalDynamicGroup'] } }, description: 'The GUID of the universal dynamic group' },
];
