import type { INodeProperties } from 'n8n-workflow';

export const universalDynamicGroupsOperations: INodeProperties[] = [{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['universalDynamicGroups'], bmsVersion: ['26R1'] } },
	options: [
		{ name: 'Get Folder', value: 'getFolder', description: 'Get a universal dynamic groups folder by ID', action: 'Get folder' },
		{ name: 'Get Folders', value: 'getFolders', description: 'Get all universal dynamic group folders', action: 'Get folders' },
		{ name: 'Get Group', value: 'get', description: 'Get a universal dynamic group by ID', action: 'Get universal dynamic group' },
		{ name: 'Get Groups', value: 'getMany', description: 'Get all universal dynamic groups', action: 'Get universal dynamic groups' },
		{ name: 'Get Groups by Folder', value: 'getGroupsByFolder', description: 'Get universal dynamic groups in a folder', action: 'Get groups by folder' },
		{ name: 'Get Sub-Folders', value: 'getSubFolders', description: 'Get sub-folders within a folder', action: 'Get sub-folders' },
	],
	default: 'getMany',
}];

export const universalDynamicGroupsFields: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['universalDynamicGroups'], operation: ['get'], bmsVersion: ['26R1'] } },
		description: 'The GUID of the universal dynamic group',
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['universalDynamicGroups'], operation: ['getFolder', 'getSubFolders', 'getGroupsByFolder'], bmsVersion: ['26R1'] } },
		description: 'The GUID of the folder',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['universalDynamicGroups'], operation: ['getMany', 'getFolders', 'getSubFolders', 'getGroupsByFolder'], bmsVersion: ['26R1'] } },
		description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: { show: { resource: ['universalDynamicGroups'], operation: ['getMany', 'getFolders', 'getSubFolders', 'getGroupsByFolder'], returnAll: [false], bmsVersion: ['26R1'] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['universalDynamicGroups'], operation: ['getMany'], bmsVersion: ['26R1'] } },
		options: [
			{ displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order for results' },
		],
	},
];
