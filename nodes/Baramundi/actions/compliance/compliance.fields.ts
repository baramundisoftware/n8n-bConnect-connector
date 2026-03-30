import type { INodeProperties } from 'n8n-workflow';

export const complianceOperations: INodeProperties[] = [{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['compliance'] } },
	options: [
		{ name: 'Get Detected Rule Violations', value: 'getDetectedRuleViolations', description: 'Get all detected configuration rule violations', action: 'Get detected rule violations' },
		{ name: 'Get Detected Rule Violations by Endpoint', value: 'getDetectedRuleViolationsByEndpoint', description: 'Get detected rule violations for a specific endpoint', action: 'Get detected rule violations by endpoint' },
		{ name: 'Get Detected Vulnerabilities', value: 'getDetectedVulnerabilities', description: 'Get all detected vulnerabilities for Windows endpoints', action: 'Get detected vulnerabilities' },
		{ name: 'Get Detected Vulnerabilities by Endpoint', value: 'getDetectedVulnerabilitiesByEndpoint', description: 'Get detected vulnerabilities for a specific Windows endpoint', action: 'Get detected vulnerabilities by endpoint' },
		{ name: 'Get Rule', value: 'getRule', description: 'Get a specific compliance rule by ID', action: 'Get compliance rule' },
		{ name: 'Get Rules', value: 'getRules', description: 'Get all compliance rules', action: 'Get compliance rules' },
		{ name: 'Get Vulnerabilities', value: 'getVulnerabilities', description: 'Get all detectable vulnerabilities', action: 'Get vulnerabilities' },
		{ name: 'Get Vulnerability', value: 'getVulnerability', description: 'Get a specific vulnerability by ID', action: 'Get vulnerability' },
	],
	default: 'getRules',
}];

export const complianceFields: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['compliance'], operation: ['getRule'] } },
		description: 'The GUID of the compliance rule',
	},
	{
		displayName: 'Vulnerability ID',
		name: 'vulnerabilityId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['compliance'], operation: ['getVulnerability'] } },
		description: 'The GUID of the vulnerability',
	},
	{
		displayName: 'Endpoint ID',
		name: 'endpointId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['compliance'], operation: ['getDetectedVulnerabilitiesByEndpoint', 'getDetectedRuleViolationsByEndpoint'] } },
		description: 'The GUID of the endpoint',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['compliance'], operation: ['getRules', 'getVulnerabilities', 'getDetectedVulnerabilities', 'getDetectedVulnerabilitiesByEndpoint', 'getDetectedRuleViolations', 'getDetectedRuleViolationsByEndpoint'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: { show: { resource: ['compliance'], operation: ['getRules', 'getVulnerabilities', 'getDetectedVulnerabilities', 'getDetectedVulnerabilitiesByEndpoint', 'getDetectedRuleViolations', 'getDetectedRuleViolationsByEndpoint'], returnAll: [false] } },
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['compliance'], operation: ['getRules', 'getVulnerabilities', 'getDetectedVulnerabilities', 'getDetectedRuleViolations'] } },
		options: [
			{ displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order for results' },
		],
	},
];
