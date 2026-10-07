import type { INodeProperties } from 'n8n-workflow';
import { endpointLocator } from '../../../shared/resourceLocators';

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
	endpointLocator({ show: { resource: ['software'], operation: ['getInstalledSoftwareByEndpoint'] } }),
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
			{ displayName: 'Type', name: 'type', type: 'options', default: 'Install', options: [{ name: 'Install', value: 'Install' }, { name: 'Uninstall', value: 'Uninstall' }], description: 'Whether the bundle installs or uninstalls its applications' },
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

// ============================================================================
// P12.5 — softwareBundle sub-resource
// ============================================================================

export const softwareBundleOperations: INodeProperties[] = [{
	displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
	displayOptions: { show: { resource: ['softwareBundle'], bmsVersion: ['26R1'] } },
	options: [
		{ name: 'Add Application to Bundle', value: 'addApplicationToBundle', description: 'Add an application to a bundle', action: 'Add application to bundle' },
		{ name: 'Create Bundle', value: 'createBundle', description: 'Create a software bundle', action: 'Create bundle' },
		{ name: 'Create Bundle Folder', value: 'createBundleFolder', description: 'Create a bundle folder', action: 'Create bundle folder' },
		{ name: 'Delete Bundle', value: 'deleteBundle', description: 'Delete a software bundle', action: 'Delete bundle' },
		{ name: 'Delete Bundle Application', value: 'deleteBundleApplication', description: 'Delete a bundle application', action: 'Delete bundle application' },
		{ name: 'Delete Bundle Folder', value: 'deleteBundleFolder', description: 'Delete a bundle folder', action: 'Delete bundle folder' },
		{ name: 'Get Bundle', value: 'getBundle', description: 'Get a software bundle by ID', action: 'Get bundle' },
		{ name: 'Get Bundle Applications', value: 'getBundleApplications', description: 'Get all bundle applications', action: 'Get bundle applications' },
		{ name: 'Get Bundle Applications by Bundle', value: 'getBundleApplicationsByBundle', description: 'Get applications in a bundle', action: 'Get bundle applications by bundle' },
		{ name: 'Get Bundle Folder', value: 'getBundleFolder', description: 'Get a bundle folder by ID', action: 'Get bundle folder' },
		{ name: 'Get Bundle Folders', value: 'getBundleFolders', description: 'Get all bundle folders', action: 'Get bundle folders' },
		{ name: 'Get Bundle Sub Folders', value: 'getBundleSubFolders', description: 'Get sub-folders of a bundle folder', action: 'Get bundle sub folders' },
		{ name: 'Get Bundles', value: 'getBundles', description: 'Get all software bundles', action: 'Get bundles' },
		{ name: 'Replace Application in Bundle', value: 'replaceApplicationInBundle', description: 'Update a bundle application via PATCH', action: 'Replace application in bundle' },
		{ name: 'Update Bundle Folder', value: 'updateBundleFolder', description: 'Update a bundle folder', action: 'Update bundle folder' },
	],
	default: 'getBundles',
}];

export const softwareBundleFields: INodeProperties[] = [
	{ displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['softwareBundle'], operation: ['getBundles', 'getBundleFolders', 'getBundleSubFolders', 'getBundleApplicationsByBundle'] } }, description: 'Whether to return all results or only up to a given limit' },
	{ displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50, displayOptions: { show: { resource: ['softwareBundle'], operation: ['getBundles', 'getBundleFolders', 'getBundleSubFolders', 'getBundleApplicationsByBundle'], returnAll: [false] } }, description: 'Max number of results to return' },
	{ displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {}, displayOptions: { show: { resource: ['softwareBundle'], operation: ['getBundles'] } }, options: [
		{ displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
		{ displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
	]},
	{ displayName: 'Bundle ID', name: 'bundleId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['softwareBundle'], operation: ['getBundle', 'deleteBundle', 'getBundleApplicationsByBundle'] } }, description: 'The GUID of the bundle' },
	{ displayName: 'Name', name: 'name', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['softwareBundle'], operation: ['createBundle', 'createBundleFolder'] } }, description: 'The name of the bundle or folder' },
	{
		displayName: 'Additional Fields', name: 'additionalFields', type: 'collection', placeholder: 'Add Field', default: {},
		displayOptions: { show: { resource: ['softwareBundle'], operation: ['createBundle'] } },
		options: [
			{ displayName: 'Type', name: 'type', type: 'options', default: 'Install', options: [{ name: 'Install', value: 'Install' }, { name: 'Uninstall', value: 'Uninstall' }], description: 'Whether the bundle installs or uninstalls its applications' },
			{ displayName: 'Ignore Dependencies', name: 'ignoreDependencies', type: 'boolean', default: false, description: 'Whether to ignore dependencies' },
			{ displayName: 'Parent ID', name: 'parentId', type: 'string', default: '', description: 'GUID of the parent folder' },
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '', description: 'Optional comment' },
		],
	},
	{ displayName: 'Bundle Folder ID', name: 'bundleFolderId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['softwareBundle'], operation: ['getBundleFolder', 'getBundleSubFolders', 'deleteBundleFolder', 'updateBundleFolder'] } }, description: 'The GUID of the bundle folder' },
	{
		displayName: 'Additional Fields', name: 'additionalFields', type: 'collection', placeholder: 'Add Field', default: {},
		displayOptions: { show: { resource: ['softwareBundle'], operation: ['createBundleFolder'] } },
		options: [
			{ displayName: 'Parent ID', name: 'parentId', type: 'string', default: '', description: 'GUID of the parent folder' },
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '', description: 'Optional comment' },
		],
	},
	{ displayName: 'Bundle ID', name: 'bundleId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['softwareBundle'], operation: ['addApplicationToBundle'] } }, description: 'The GUID of the bundle' },
	{ displayName: 'Application ID', name: 'applicationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['softwareBundle'], operation: ['addApplicationToBundle'] } }, description: 'The GUID of the application to add' },
	{ displayName: 'Bundle ID', name: 'bundleId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['softwareBundle'], operation: ['replaceApplicationInBundle'] } }, description: 'The GUID of the bundle' },
	{ displayName: 'Bundle Application ID', name: 'bundleApplicationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['softwareBundle'], operation: ['replaceApplicationInBundle', 'deleteBundleApplication'] } }, description: 'The GUID of the bundle application' },
	{ displayName: 'Update Fields', name: 'updateFields', type: 'collection', placeholder: 'Add Field', default: {}, displayOptions: { show: { resource: ['softwareBundle'], operation: ['replaceApplicationInBundle'] } }, options: [{ displayName: 'Application ID', name: 'applicationId', type: 'string', default: '', description: 'New application GUID' }, { displayName: 'Priority', name: 'priority', type: 'number', default: 0, description: 'New priority' }] },
	{ displayName: 'Update Fields', name: 'updateFields', type: 'collection', placeholder: 'Add Field', default: {}, displayOptions: { show: { resource: ['softwareBundle'], operation: ['updateBundleFolder'] } }, options: [{ displayName: 'Name', name: 'name', type: 'string', default: '', description: 'New folder name' }] },
	{ displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['softwareBundle'], operation: ['getBundleApplications'] } }, description: 'Whether to return all results or only up to a given limit' },
	{ displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50, displayOptions: { show: { resource: ['softwareBundle'], operation: ['getBundleApplications'], returnAll: [false] } }, description: 'Max number of results to return' },
];

// ============================================================================
// P12.5 — software trimmed (keep resource, trimmed to installed software ops)
// ============================================================================

export const softwareOperations25R2Trimmed: INodeProperties[] = [{
	displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
	displayOptions: { show: { resource: ['software'], bmsVersion: ['25R2'] } },
	options: [...COMMON_SOFTWARE_OPTIONS],
	default: 'getInstalledWindowsSoftware',
}];

export const softwareOperations26R1Trimmed: INodeProperties[] = [{
	displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
	displayOptions: { show: { resource: ['software'], bmsVersion: ['26R1'] } },
	options: [
		...COMMON_SOFTWARE_OPTIONS,
		{ name: 'Get Software by Universal Dynamic Group', value: 'getInstalledSoftwareByUniversalDynamicGroup', description: 'Get installed software for a universal dynamic group (bMS 26R1+)', action: 'Get software by universal dynamic group' },
	],
	// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options -- 'getInstalledWindowsSoftware' is in COMMON_SOFTWARE_OPTIONS spread; ESLint cannot resolve spread
	default: 'getInstalledWindowsSoftware',
}];
