import type { INodeProperties } from 'n8n-workflow';

const COMMON_SOFTWARE_OPTIONS = [
	{ name: 'Get Installed Software', value: 'getInstalledWindowsSoftware', description: 'Get all installed Windows software', action: 'Get installed software' },
	{ name: 'Get Software by Endpoint', value: 'getInstalledSoftwareByEndpoint', description: 'Get installed software for an endpoint', action: 'Get software by endpoint' },
	{ name: 'Get Software by Logical Group', value: 'getInstalledSoftwareByLogicalGroup', description: 'Get installed software for a logical group', action: 'Get software by logical group' },
];

export const softwareOperations25R2: INodeProperties[] = [{
	displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
	displayOptions: { show: { resource: ['software'], bmsVersion: ['25R2'] } },
	options: [...COMMON_SOFTWARE_OPTIONS],
	default: 'getInstalledWindowsSoftware',
}];

export const softwareOperations26R1: INodeProperties[] = [{
	displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
	displayOptions: { show: { resource: ['software'], bmsVersion: ['26R1'] } },
	options: [
		...COMMON_SOFTWARE_OPTIONS,
		{ name: 'Get Software by Universal Dynamic Group', value: 'getInstalledSoftwareByUniversalDynamicGroup', description: 'Get installed software for a universal dynamic group (bMS 26R1+)', action: 'Get software by universal dynamic group' },
		{ name: 'Get Bundles', value: 'getBundles', description: 'Get all software bundles (bMS 26R1+)', action: 'Get bundles' },
		{ name: 'Get Bundle', value: 'getBundle', description: 'Get a software bundle by ID (bMS 26R1+)', action: 'Get bundle' },
		{ name: 'Create Bundle', value: 'createBundle', description: 'Create a software bundle (bMS 26R1+)', action: 'Create bundle' },
		{ name: 'Delete Bundle', value: 'deleteBundle', description: 'Delete a software bundle (bMS 26R1+)', action: 'Delete bundle' },
		{ name: 'Get Bundle Folders', value: 'getBundleFolders', description: 'Get all bundle folders (bMS 26R1+)', action: 'Get bundle folders' },
		{ name: 'Get Bundle Folder', value: 'getBundleFolder', description: 'Get a bundle folder by ID (bMS 26R1+)', action: 'Get bundle folder' },
		{ name: 'Get Bundle Sub Folders', value: 'getBundleSubFolders', description: 'Get sub-folders of a bundle folder (bMS 26R1+)', action: 'Get bundle sub folders' },
		{ name: 'Create Bundle Folder', value: 'createBundleFolder', description: 'Create a bundle folder (bMS 26R1+)', action: 'Create bundle folder' },
		{ name: 'Delete Bundle Folder', value: 'deleteBundleFolder', description: 'Delete a bundle folder (bMS 26R1+)', action: 'Delete bundle folder' },
		{ name: 'Get Bundle Applications by Bundle', value: 'getBundleApplicationsByBundle', description: 'Get applications in a bundle (bMS 26R1+)', action: 'Get bundle applications by bundle' },
		{ name: 'Add Application to Bundle', value: 'addApplicationToBundle', description: 'Add an application to a bundle (bMS 26R1+)', action: 'Add application to bundle' },
		{ name: 'Replace Application in Bundle', value: 'replaceApplicationInBundle', description: 'Update a bundle application via PATCH (bMS 26R1+)', action: 'Replace application in bundle' },
		{ name: 'Update Bundle Folder', value: 'updateBundleFolder', description: 'Update a bundle folder (bMS 26R1+)', action: 'Update bundle folder' },
		{ name: 'Get Bundle Applications', value: 'getBundleApplications', description: 'Get all bundle applications (bMS 26R1+)', action: 'Get bundle applications' },
		{ name: 'Delete Bundle Application', value: 'deleteBundleApplication', description: 'Delete a bundle application (bMS 26R1+)', action: 'Delete bundle application' },
	],
	// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options -- 'getInstalledWindowsSoftware' is in COMMON_SOFTWARE_OPTIONS spread; ESLint cannot resolve spread
	default: 'getInstalledWindowsSoftware',
}];

/** @deprecated Use softwareOperations25R2 and softwareOperations26R1 instead */
export const softwareOperations: INodeProperties[] = [...softwareOperations25R2, ...softwareOperations26R1];

export const softwareFields: INodeProperties[] = [
	{ displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['software'], operation: ['getInstalledWindowsSoftware', 'getInstalledSoftwareByEndpoint', 'getInstalledSoftwareByLogicalGroup', 'getInstalledSoftwareByUniversalDynamicGroup', 'getBundles', 'getBundleFolders', 'getBundleSubFolders', 'getBundleApplicationsByBundle'] } }, description: 'Whether to return all results or only up to a given limit' },
	{ displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50, displayOptions: { show: { resource: ['software'], operation: ['getInstalledWindowsSoftware', 'getInstalledSoftwareByEndpoint', 'getInstalledSoftwareByLogicalGroup', 'getInstalledSoftwareByUniversalDynamicGroup', 'getBundles', 'getBundleFolders', 'getBundleSubFolders', 'getBundleApplicationsByBundle'], returnAll: [false] } }, description: 'Max number of results to return' },
	{ displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {}, displayOptions: { show: { resource: ['software'], operation: ['getInstalledWindowsSoftware', 'getInstalledSoftwareByEndpoint', 'getInstalledSoftwareByLogicalGroup', 'getInstalledSoftwareByUniversalDynamicGroup', 'getBundles'] } }, options: [
		{ displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
		{ displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
	]},
	{ displayName: 'Endpoint ID', name: 'endpointId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['getInstalledSoftwareByEndpoint'] } }, description: 'The GUID of the endpoint' },
	{ displayName: 'Logical Group ID', name: 'logicalGroupId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['getInstalledSoftwareByLogicalGroup'] } }, description: 'The GUID of the logical group' },
	{ displayName: 'Universal Dynamic Group ID', name: 'universalDynamicGroupId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['getInstalledSoftwareByUniversalDynamicGroup'] } }, description: 'The GUID of the universal dynamic group' },

	// ============================================================================
	// BUNDLE OPERATIONS (bMS 26R1+)
	// ============================================================================

	{ displayName: 'Bundle ID', name: 'bundleId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['getBundle', 'deleteBundle', 'getBundleApplicationsByBundle'], bmsVersion: ['26R1'] } }, description: 'The GUID of the bundle' },
	{ displayName: 'Name', name: 'name', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['createBundle', 'createBundleFolder'], bmsVersion: ['26R1'] } }, description: 'The name of the bundle or folder' },
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['software'], operation: ['createBundle'], bmsVersion: ['26R1'] } },
		options: [
			{ displayName: 'Type', name: 'type', type: 'string', default: '', description: 'Bundle type' },
			{ displayName: 'Ignore Dependencies', name: 'ignoreDependencies', type: 'boolean', default: false, description: 'Whether to ignore dependencies' },
			{ displayName: 'Parent ID', name: 'parentId', type: 'string', default: '', description: 'GUID of the parent folder' },
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '', description: 'Optional comment' },
		],
	},

	// ============================================================================
	// BUNDLE FOLDER OPERATIONS (bMS 26R1+)
	// ============================================================================

	{ displayName: 'Bundle Folder ID', name: 'bundleFolderId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['getBundleFolder', 'getBundleSubFolders', 'deleteBundleFolder', 'updateBundleFolder'], bmsVersion: ['26R1'] } }, description: 'The GUID of the bundle folder' },
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['software'], operation: ['createBundleFolder'], bmsVersion: ['26R1'] } },
		options: [
			{ displayName: 'Parent ID', name: 'parentId', type: 'string', default: '', description: 'GUID of the parent folder' },
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '', description: 'Optional comment' },
		],
	},

	// ============================================================================
	// PHASE 8E — new fields
	// ============================================================================

	// addApplicationToBundle
	{ displayName: 'Bundle ID', name: 'bundleId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['addApplicationToBundle'], bmsVersion: ['26R1'] } }, description: 'The GUID of the bundle' },
	{ displayName: 'Application ID', name: 'applicationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['addApplicationToBundle'], bmsVersion: ['26R1'] } }, description: 'The GUID of the application to add' },
	{ displayName: 'Additional Fields', name: 'additionalFields', type: 'collection', placeholder: 'Add Field', default: {}, displayOptions: { show: { resource: ['software'], operation: ['addApplicationToBundle'], bmsVersion: ['26R1'] } }, options: [{ displayName: 'Priority', name: 'priority', type: 'number', default: 0, description: 'Priority of the application in the bundle' }] },

	// replaceApplicationInBundle
	{ displayName: 'Bundle ID', name: 'bundleId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['replaceApplicationInBundle'], bmsVersion: ['26R1'] } }, description: 'The GUID of the bundle' },
	{ displayName: 'Bundle Application ID', name: 'bundleApplicationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['software'], operation: ['replaceApplicationInBundle', 'deleteBundleApplication'], bmsVersion: ['26R1'] } }, description: 'The GUID of the bundle application' },
	{ displayName: 'Update Fields', name: 'updateFields', type: 'collection', placeholder: 'Add Field', default: {}, displayOptions: { show: { resource: ['software'], operation: ['replaceApplicationInBundle'], bmsVersion: ['26R1'] } }, options: [{ displayName: 'Application ID', name: 'applicationId', type: 'string', default: '', description: 'New application GUID' }, { displayName: 'Priority', name: 'priority', type: 'number', default: 0, description: 'New priority' }] },

	// updateBundleFolder
	{ displayName: 'Update Fields', name: 'updateFields', type: 'collection', placeholder: 'Add Field', default: {}, displayOptions: { show: { resource: ['software'], operation: ['updateBundleFolder'], bmsVersion: ['26R1'] } }, options: [{ displayName: 'Name', name: 'name', type: 'string', default: '', description: 'New folder name' }] },

	// getBundleApplications
	{ displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['software'], operation: ['getBundleApplications'], bmsVersion: ['26R1'] } }, description: 'Whether to return all results or only up to a given limit' },
	{ displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50, displayOptions: { show: { resource: ['software'], operation: ['getBundleApplications'], bmsVersion: ['26R1'], returnAll: [false] } }, description: 'Max number of results to return' },
];
