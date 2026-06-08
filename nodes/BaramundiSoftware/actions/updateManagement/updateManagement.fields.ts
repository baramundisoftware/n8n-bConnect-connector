import type { INodeProperties } from 'n8n-workflow';
import { endpointLocator } from '../../../shared/resourceLocators';

export const updateManagementOperations: INodeProperties[] = [{
	displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
	displayOptions: { show: { resource: ['updateManagement'] } },
	options: [
		{ name: 'Get Windows Endpoints', value: 'getWindowsEndpoints', description: 'Get Windows endpoints update info', action: 'Get Windows endpoints update info' },
		{ name: 'Get Windows Endpoint', value: 'getWindowsEndpoint', description: 'Get a Windows endpoint update info by ID', action: 'Get a Windows endpoint update info' },
		{ name: 'Update Windows Endpoint', value: 'updateWindowsEndpoint', description: 'Update Windows endpoint update profile', action: 'Update Windows endpoint update profile' },
	],
	default: 'getWindowsEndpoints',
}];

export const updateManagementFields: INodeProperties[] = [
	{ displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['updateManagement'], operation: ['getWindowsEndpoints'] } }, description: 'Whether to return all results or only up to a given limit' },
	{ displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50, displayOptions: { show: { resource: ['updateManagement'], operation: ['getWindowsEndpoints'], returnAll: [false] } }, description: 'Max number of results to return' },
	{ displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {}, displayOptions: { show: { resource: ['updateManagement'], operation: ['getWindowsEndpoints'] } }, options: [
		{ displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
		{ displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
	]},
	endpointLocator({ show: { resource: ['updateManagement'], operation: ['getWindowsEndpoint', 'updateWindowsEndpoint'] } }),
	{ displayName: 'Update Fields', name: 'updateFields', type: 'collection', placeholder: 'Add Field', default: {}, displayOptions: { show: { resource: ['updateManagement'], operation: ['updateWindowsEndpoint'] } }, options: [
		{ displayName: 'Update Profile ID', name: 'updateProfileId', type: 'string', default: '', description: 'The GUID of the update profile' },
	]},
];
