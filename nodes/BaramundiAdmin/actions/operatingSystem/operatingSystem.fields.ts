import type { INodeProperties } from 'n8n-workflow';
import { endpointLocator } from '../../../shared/resourceLocators';

export const operatingSystemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['operatingSystem'],
			},
		},
		options: [
			{
				name: 'Create Folder',
				value: 'createFolder',
				description: 'Create a new OS folder',
				action: 'Create an OS folder',
			},
			{
				name: 'Delete Folder',
				value: 'deleteFolder',
				description: 'Delete an OS folder',
				action: 'Delete an OS folder',
			},
			{
				name: 'Get Folder',
				value: 'getFolder',
				description: 'Get a single OS folder by ID',
				action: 'Get an OS folder',
			},
			{
				name: 'Get Folders',
				value: 'getFolders',
				description: 'Get many OS folders',
				action: 'Get OS folders',
			},
			{
				name: 'Get Subfolders',
				value: 'getFoldersByFolderId',
				description: 'Get subfolders of a folder',
				action: 'Get subfolders',
			},
			{
				name: 'Get Windows Endpoint',
				value: 'getWindowsEndpoint',
				description: 'Get a Windows endpoint OS info by ID',
				action: 'Get a Windows endpoint OS info',
			},
			{
				name: 'Get Windows Endpoints',
				value: 'getWindowsEndpoints',
				description: 'Get Windows endpoints OS info',
				action: 'Get Windows endpoints OS info',
			},
			{
				name: 'Update Folder',
				value: 'updateFolder',
				description: 'Update an OS folder',
				action: 'Update an OS folder',
			},
			{
				name: 'Update Windows Endpoint',
				value: 'updateWindowsEndpoint',
				description: 'Update Windows endpoint OS config',
				action: 'Update Windows endpoint OS config',
			},
		],
		default: 'getFolders',
	},
];

export const operatingSystemFields: INodeProperties[] = [
	// Pagination fields
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['operatingSystem'],
				operation: ['getFolders', 'getFoldersByFolderId', 'getWindowsEndpoints'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['operatingSystem'],
				operation: ['getFolders', 'getFoldersByFolderId', 'getWindowsEndpoints'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['operatingSystem'],
				operation: ['getFolders', 'getFoldersByFolderId', 'getWindowsEndpoints'],
			},
		},
		options: [
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				description: 'Filter results by name',
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				default: '',
				placeholder: 'Name asc',
				description: 'Sort order (e.g., "Name asc")',
			},
		],
	},

	// Folder ID fields
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['operatingSystem'],
				operation: ['getFolder', 'getFoldersByFolderId', 'updateFolder', 'deleteFolder'],
			},
		},
		description: 'The GUID of the OS folder',
	},

	// Create folder fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['operatingSystem'],
				operation: ['createFolder'],
			},
		},
		description: 'The name of the OS folder',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['operatingSystem'],
				operation: ['createFolder'],
			},
		},
		options: [
			{
				displayName: 'Parent ID',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'The GUID of the parent folder',
			},
		],
	},

	// Update folder fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['operatingSystem'],
				operation: ['updateFolder'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the OS folder',
			},
			{
				displayName: 'Parent ID',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'The GUID of the parent folder',
			},
		],
	},

	// Endpoint ID fields
	endpointLocator({
		show: {
			resource: ['operatingSystem'],
			operation: ['getWindowsEndpoint', 'updateWindowsEndpoint'],
		},
	}),

	// Update Windows endpoint fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['operatingSystem'],
				operation: ['updateWindowsEndpoint'],
			},
		},
		options: [
			{
				displayName: 'OS Install Folder ID',
				name: 'osInstallFolderId',
				type: 'string',
				default: '',
				description: 'The GUID of the OS install folder',
			},
		],
	},
];
