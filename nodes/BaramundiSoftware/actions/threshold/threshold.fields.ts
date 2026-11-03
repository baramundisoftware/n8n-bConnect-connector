import type { INodeProperties } from 'n8n-workflow';
import { SINCE_26R2 } from '../../../shared/utils/versionGating';

// Thresholds on universal dynamic groups (bMS 26R2+): Threshold / ThresholdForCreation.
// A threshold compares a group's endpoint count with a value and raises a notification.

const TYPE_OPTIONS = [
	{ name: 'Upper Limit', value: 'UpperLimit', description: 'Notify when the endpoint count exceeds the value' },
	{ name: 'Lower Limit', value: 'LowerLimit', description: 'Notify when the endpoint count falls below the value' },
];

const SEVERITY_OPTIONS = [
	{ name: 'Error', value: 'Error' },
	{ name: 'Info', value: 'Info' },
	{ name: 'Warning', value: 'Warning' },
];

const show = (operation: string[], extra: Record<string, unknown[]> = {}) => ({
	show: { resource: ['threshold'], operation, bmsVersion: SINCE_26R2, ...extra },
});

export const thresholdOperations: INodeProperties[] = [{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['threshold'], bmsVersion: SINCE_26R2 } },
	options: [
		{ name: 'Create Threshold', value: 'create', description: 'Create a threshold on a universal dynamic group', action: 'Create a threshold' },
		{ name: 'Delete Threshold', value: 'delete', description: 'Delete a threshold', action: 'Delete a threshold' },
		{ name: 'Get Threshold', value: 'get', description: 'Get a threshold by ID', action: 'Get a threshold' },
		{ name: 'Get Thresholds', value: 'getMany', description: 'Get all thresholds', action: 'Get thresholds' },
		{ name: 'Get Thresholds by Group', value: 'getByGroup', description: 'Get the thresholds of a universal dynamic group', action: 'Get thresholds by group' },
		{ name: 'Update Threshold', value: 'update', description: 'Update a threshold', action: 'Update a threshold' },
	],
	default: 'getMany',
}];

export const thresholdFields: INodeProperties[] = [
	{
		displayName: 'Threshold ID',
		name: 'thresholdId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(['get', 'update', 'delete']),
		description: 'The GUID of the threshold',
	},
	{
		displayName: 'Universal Dynamic Group ID',
		name: 'dynamicGroupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(['create', 'getByGroup']),
		description: 'The GUID of the universal dynamic group',
	},
	{
		displayName: 'Security Profile ID',
		name: 'securityProfileId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(['create']),
		description: 'The GUID of the security profile the threshold is associated with',
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'number',
		typeOptions: { minValue: 0 },
		required: true,
		default: 0,
		displayOptions: show(['create']),
		description: 'The endpoint count of the group is compared against this value',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		default: 'UpperLimit',
		displayOptions: show(['create']),
		options: TYPE_OPTIONS,
		description: 'Whether the value is an upper or a lower limit',
	},
	{
		displayName: 'Severity',
		name: 'severity',
		type: 'options',
		required: true,
		default: 'Warning',
		displayOptions: show(['create']),
		options: SEVERITY_OPTIONS,
		description: 'The severity of the notification raised when the threshold is reached',
	},
	{
		displayName: 'Is Active',
		name: 'isActive',
		type: 'boolean',
		default: true,
		displayOptions: show(['create']),
		description: 'Whether the threshold is evaluated right away',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: show(['create']),
		options: [
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '', description: 'A comment on the threshold (up to 4000 characters)' },
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: show(['update']),
		options: [
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '', description: 'A comment on the threshold (up to 4000 characters)' },
			{ displayName: 'Is Active', name: 'isActive', type: 'boolean', default: true, description: 'Whether the threshold is evaluated' },
			{ displayName: 'Severity', name: 'severity', type: 'options', default: 'Warning', options: SEVERITY_OPTIONS, description: 'The severity of the notification raised when the threshold is reached' },
			{ displayName: 'Type', name: 'type', type: 'options', default: 'UpperLimit', options: TYPE_OPTIONS, description: 'Whether the value is an upper or a lower limit' },
			{ displayName: 'Value', name: 'value', type: 'number', typeOptions: { minValue: 0 }, default: 0, description: 'The endpoint count of the group is compared against this value' },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: show(['getMany', 'getByGroup']),
		description: 'Whether to return all results or only up to a given limit',
		hint: 'Results are capped at 5,000 items regardless of this setting',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: show(['getMany', 'getByGroup'], { returnAll: [false] }),
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: show(['getMany', 'getByGroup']),
		options: [
			{ displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'DynamicGroupName asc', description: 'Sort order: DynamicGroupName, SecurityProfileName, Severity, Value, Type or IsActive, then asc or desc' },
			{ displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Only return thresholds whose group name, security profile name or comment match this value' },
		],
	},
];
