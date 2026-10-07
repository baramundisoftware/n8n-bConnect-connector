import type { INodeProperties } from 'n8n-workflow';
import { endpointLocator } from '../../../shared/resourceLocators';

export const variableOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['variable'],
			},
		},
		options: [
			{
				name: 'Create Variable Definition',
				value: 'createVariableDefinition',
				description: 'Create a new variable definition',
				action: 'Create a variable definition',
			},
			{
				name: 'Delete Variable Definition',
				value: 'deleteVariableDefinition',
				description: 'Delete a variable definition',
				action: 'Delete a variable definition',
			},
			{
				name: 'Get Variable Definition',
				value: 'getVariableDefinition',
				description: 'Get a single variable definition by ID',
				action: 'Get a variable definition',
			},
			{
				name: 'Get Variable Definitions',
				value: 'getVariableDefinitions',
				description: 'Get many variable definitions',
				action: 'Get variable definitions',
			},
			{
				name: 'Get Variable Instance',
				value: 'getVariableInstance',
				description: 'Get a single variable instance by ID',
				action: 'Get a variable instance',
			},
			{
				name: 'Get Variable Instances',
				value: 'getVariableInstances',
				description: 'Get many variable instances',
				action: 'Get variable instances',
			},
			{
				name: 'Get Variables by AD Object',
				value: 'getVariableInstancesByADObject',
				description: 'Get variable instances for an AD object',
				action: 'Get variables by AD object',
			},
			{
				name: 'Get Variables by Application',
				value: 'getVariableInstancesByApplication',
				description: 'Get variable instances for a Windows application',
				action: 'Get variables by application',
			},
			{
				name: 'Get Variables by Endpoint',
				value: 'getVariableInstancesByEndpoint',
				description: 'Get variable instances for an endpoint',
				action: 'Get variables by endpoint',
			},
			{
				name: 'Get Variables by Job Definition',
				value: 'getVariableInstancesByJobDefinition',
				description: 'Get variable instances for a Windows job definition',
				action: 'Get variables by job definition',
			},
			{
				name: 'Get Variables by Logical Group',
				value: 'getVariableInstancesByLogicalGroup',
				description: 'Get variable instances for a logical group',
				action: 'Get variables by logical group',
			},
			{
				name: 'Update Variable Definition',
				value: 'updateVariableDefinition',
				description: 'Update a variable definition',
				action: 'Update a variable definition',
			},
			{
				name: 'Update Variable Instance',
				value: 'updateVariableInstance',
				description: 'Update a variable instance',
				action: 'Update a variable instance',
			},
		],
		default: 'getVariableDefinitions',
	},
];

export const variableFields: INodeProperties[] = [
	// ============================================================================
	// VARIABLE DEFINITIONS FIELDS
	// ============================================================================

	// ----------------------------------
	//         variable:getVariableDefinitions
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: [
					'getVariableDefinitions',
					'getVariableInstances',
					'getVariableInstancesByEndpoint',
					'getVariableInstancesByLogicalGroup',
					'getVariableInstancesByADObject',
				],
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
				resource: ['variable'],
				operation: [
					'getVariableDefinitions',
					'getVariableInstances',
					'getVariableInstancesByEndpoint',
					'getVariableInstancesByLogicalGroup',
					'getVariableInstancesByADObject',
				],
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
				resource: ['variable'],
				operation: [
					'getVariableDefinitions',
					'getVariableInstances',
					'getVariableInstancesByEndpoint',
					'getVariableInstancesByLogicalGroup',
					'getVariableInstancesByADObject',
				],
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

	// ----------------------------------
	//         variable:getVariableDefinition
	// ----------------------------------
	{
		displayName: 'Variable Definition ID',
		name: 'variableDefinitionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['getVariableDefinition', 'updateVariableDefinition', 'deleteVariableDefinition'],
			},
		},
		description: 'The GUID of the variable definition',
	},

	// ----------------------------------
	//         variable:createVariableDefinition
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['createVariableDefinition'],
			},
		},
		description: 'The name of the variable definition',
	},
	// VariableDefinitionForCreation: name, category and scopes are required
	{
		displayName: 'Category',
		name: 'category',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['createVariableDefinition'],
			},
		},
		description: 'The category the variable is listed under',
	},
	{
		displayName: 'Scopes',
		name: 'scopes',
		type: 'multiOptions',
		required: true,
		default: ['Endpoint'],
		displayOptions: {
			show: {
				bmsVersion: ['25R2'],
				resource: ['variable'],
				operation: ['createVariableDefinition'],
			},
		},
		options: [
			{ name: 'AD Object', value: 'ADObject' },
			{ name: 'Android Endpoint', value: 'AndroidEndpoint' },
			{ name: 'Endpoint (Windows/Mac)', value: 'Endpoint' },
			{ name: 'Industrial Endpoint', value: 'IndustrialEndpoint' },
			{ name: 'iOS Endpoint', value: 'IosEndpoint' },
			{ name: 'Linux Endpoint', value: 'LinuxEndpoint' },
			{ name: 'Logical Group', value: 'LogicalGroup' },
			{ name: 'Network Endpoint', value: 'NetworkEndpoint' },
			{ name: 'Windows Application', value: 'WindowsApplication' },
			{ name: 'Windows Job Definition', value: 'WindowsJobDefinition' },
		],
		description: 'Objects the variable applies to. Legacy scopes (AD Object, Endpoint, Logical Group, Windows Application, Windows Job Definition) must be used alone; modern scopes can be combined.',
	},
	{
		displayName: 'Scopes',
		name: 'scopes',
		type: 'multiOptions',
		required: true,
		default: ['Endpoint'],
		displayOptions: {
			show: {
				bmsVersion: ['26R1'],
				resource: ['variable'],
				operation: ['createVariableDefinition'],
			},
		},
		options: [
			{ name: 'AD Object', value: 'ADObject' },
			{ name: 'Android Endpoint', value: 'AndroidEndpoint' },
			{ name: 'Endpoint (Windows/Mac)', value: 'Endpoint' },
			{ name: 'iOS Endpoint', value: 'IosEndpoint' },
			{ name: 'Linux Endpoint', value: 'LinuxEndpoint' },
			{ name: 'Logical Group', value: 'LogicalGroup' },
			{ name: 'Network Endpoint', value: 'NetworkEndpoint' },
			{ name: 'Windows Application', value: 'WindowsApplication' },
			{ name: 'Windows Job Definition', value: 'WindowsJobDefinition' },
		],
		description: 'Objects the variable applies to. Legacy scopes (AD Object, Endpoint, Logical Group, Windows Application, Windows Job Definition) must be used alone; modern scopes can be combined.',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Checkbox', value: 'Checkbox' },
			{ name: 'Date', value: 'Date' },
			{ name: 'Drop-Down Editable List', value: 'DropDownEditableList' },
			{ name: 'Drop-Down List', value: 'DropDownList' },
			{ name: 'File Link', value: 'FileLink' },
			{ name: 'Folder', value: 'Folder' },
			{ name: 'Integer', value: 'Integer' },
			{ name: 'Password', value: 'Password' },
			{ name: 'String', value: 'String' },
		],
		default: 'String',
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['createVariableDefinition'],
			},
		},
		description: 'The type of the variable',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['createVariableDefinition'],
			},
		},
		options: [
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Default Value',
				name: 'defaultValue',
				type: 'string',
				default: '',
				description: 'Default value for the variable',
			},
		],
	},

	// ----------------------------------
	//         variable:updateVariableDefinition
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['updateVariableDefinition'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the variable definition',
			},
			{
				displayName: 'Default Value',
				name: 'defaultValue',
				type: 'string',
				default: '',
				description: 'Default value for the variable',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
			},
		],
	},

	// ============================================================================
	// VARIABLE INSTANCES FIELDS
	// ============================================================================

	// ----------------------------------
	//         variable:getVariableInstance
	// ----------------------------------
	{
		displayName: 'Variable Instance ID',
		name: 'variableInstanceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['getVariableInstance', 'updateVariableInstance'],
			},
		},
		description: 'The GUID of the variable instance',
	},

	// ----------------------------------
	//         variable:updateVariableInstance
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['updateVariableInstance'],
			},
		},
		options: [
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				description: 'The value of the variable instance',
			},
		],
	},

	// ============================================================================
	// BY ENTITY FIELDS
	// ============================================================================

	// ----------------------------------
	//         variable:getVariableInstancesByEndpoint
	// ----------------------------------
	endpointLocator({
		show: {
			resource: ['variable'],
			operation: ['getVariableInstancesByEndpoint'],
		},
	}),

	// ----------------------------------
	//         variable:getVariableInstancesByLogicalGroup
	// ----------------------------------
	{
		displayName: 'Logical Group ID',
		name: 'logicalGroupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['getVariableInstancesByLogicalGroup'],
			},
		},
		description: 'The GUID of the logical group',
	},

	// ----------------------------------
	//         variable:getVariableInstancesByADObject
	// ----------------------------------
	{
		displayName: 'AD Object ID',
		name: 'adObjectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['getVariableInstancesByADObject'],
			},
		},
		description: 'The GUID of the AD object',
	},

	// Phase 8F
	{ displayName: 'Application ID', name: 'applicationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['variable'], operation: ['getVariableInstancesByApplication'] } }, description: 'The GUID of the Windows application' },
	{ displayName: 'Job Definition ID', name: 'jobDefinitionId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['variable'], operation: ['getVariableInstancesByJobDefinition'] } }, description: 'The GUID of the Windows job definition' },
	{ displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['variable'], operation: ['getVariableInstancesByApplication', 'getVariableInstancesByJobDefinition'] } }, description: 'Whether to return all results or only up to a given limit' },
	{ displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50, displayOptions: { show: { resource: ['variable'], operation: ['getVariableInstancesByApplication', 'getVariableInstancesByJobDefinition'], returnAll: [false] } }, description: 'Max number of results to return' },
];
