import type { INodeProperties } from 'n8n-workflow';

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
				name: 'Get Variables by Endpoint',
				value: 'getVariableInstancesByEndpoint',
				description: 'Get variable instances for an endpoint',
				action: 'Get variables by endpoint',
			},
			{
				name: 'Get Variables by Logical Group',
				value: 'getVariableInstancesByLogicalGroup',
				description: 'Get variable instances for a logical group',
				action: 'Get variables by logical group',
			},
			{
				name: 'Get Variables by Application',
				value: 'getVariableInstancesByApplication',
				description: 'Get variable instances for a Windows application',
				action: 'Get variables by application',
			},
			{
				name: 'Get Variables by Job Definition',
				value: 'getVariableInstancesByJobDefinition',
				description: 'Get variable instances for a Windows job definition',
				action: 'Get variables by job definition',
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
	{
		displayName: 'Data Type',
		name: 'dataType',
		type: 'options',
		required: true,
		options: [
			{ name: 'String', value: 'String' },
			{ name: 'Integer', value: 'Integer' },
			{ name: 'Boolean', value: 'Boolean' },
			{ name: 'DateTime', value: 'DateTime' },
		],
		default: 'String',
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['createVariableDefinition'],
			},
		},
		description: 'The data type of the variable',
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
				displayName: 'Default Value',
				name: 'defaultValue',
				type: 'string',
				default: '',
				description: 'Default value for the variable',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the variable',
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
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the variable',
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
	{
		displayName: 'Endpoint ID',
		name: 'endpointId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['variable'],
				operation: ['getVariableInstancesByEndpoint'],
			},
		},
		description: 'The GUID of the endpoint',
	},

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
