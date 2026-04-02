import type { INodeProperties } from 'n8n-workflow';
import { endpointLocator } from '../../../shared/resourceLocators';

const COMMON_ASSET_OPTIONS = [
  { name: 'Get', value: 'get', description: 'Get an asset by ID', action: 'Get an asset' },
  { name: 'Get Many', value: 'getMany', description: 'Get many assets', action: 'Get many assets' },
  { name: 'Create', value: 'create', description: 'Create a new asset', action: 'Create an asset' },
  { name: 'Update', value: 'update', description: 'Update an asset', action: 'Update an asset' },
  { name: 'Delete', value: 'delete', description: 'Delete an asset', action: 'Delete an asset' },
  { name: 'Get Asset Types', value: 'getAssetTypes', description: 'Get many asset types', action: 'Get asset types' },
  { name: 'Get Asset Type', value: 'getAssetType', description: 'Get an asset type by ID', action: 'Get an asset type' },
  { name: 'Create Asset Type', value: 'createAssetType', description: 'Create a new asset type', action: 'Create an asset type' },
  { name: 'Delete Asset Type', value: 'deleteAssetType', description: 'Delete an asset type', action: 'Delete an asset type' },
  { name: 'Get Assets by Endpoint', value: 'getAssetsByEndpoint', description: 'Get assets linked to an endpoint', action: 'Get assets by endpoint' },
  { name: 'Get Assets by Logical Group', value: 'getAssetsByLogicalGroup', description: 'Get assets in a logical group', action: 'Get assets by logical group' },
  { name: 'Get Asset Stock Assets', value: 'getAssetStockAssets', description: 'Get assets in stock', action: 'Get asset stock assets' },
  { name: 'Get Asset Stock Folders', value: 'getAssetStockFolders', action: 'Get asset stock folders' },
  { name: 'Create Asset Stock Folder', value: 'createAssetStockFolder', description: 'Create a new asset stock folder', action: 'Create asset stock folder' },
  { name: 'Update Asset Stock Folder', value: 'updateAssetStockFolder', action: 'Update asset stock folder' },
  { name: 'Delete Asset Stock Folder', value: 'deleteAssetStockFolder', description: 'Delete an asset stock folder', action: 'Delete asset stock folder' },
  { name: 'Get Asset Stock Folder', value: 'getAssetStockFolder', description: 'Get a single asset stock folder by ID', action: 'Get asset stock folder' },
  { name: 'Get Asset Stock Sub-Folders', value: 'getAssetStockSubFolders', description: 'Get sub-folders of an asset stock folder', action: 'Get asset stock sub-folders' },
  { name: 'Get Asset Type Folders', value: 'getAssetTypeFolders', action: 'Get asset type folders' },
  { name: 'Get Asset Type Folder', value: 'getAssetTypeFolder', description: 'Get a single asset type folder by ID', action: 'Get asset type folder' },
  { name: 'Create Asset Type Folder', value: 'createAssetTypeFolder', description: 'Create a new asset type folder', action: 'Create asset type folder' },
  { name: 'Update Asset Type Folder', value: 'updateAssetTypeFolder', description: 'Update an asset type folder', action: 'Update asset type folder' },
  { name: 'Delete Asset Type Folder', value: 'deleteAssetTypeFolder', description: 'Delete an asset type folder', action: 'Delete asset type folder' },
  { name: 'Get Asset Type Folder Sub-Folders', value: 'getAssetTypeFolderSubFolders', description: 'Get sub-folders of an asset type folder', action: 'Get asset type folder sub-folders' },
];

export const assetOperations25R2: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['asset'], bmsVersion: ['25R2'] } },
    options: [...COMMON_ASSET_OPTIONS],
    default: 'getMany',
  },
];

export const assetOperations26R1: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['asset'], bmsVersion: ['26R1'] } },
    options: [
      ...COMMON_ASSET_OPTIONS,
      { name: 'Get Assets by AD Object', value: 'getAssetsByADObject', description: 'Get assets linked to an AD object (bMS 26R1+)', action: 'Get assets by AD object' },
      { name: 'Get Assets by Org Unit', value: 'getAssetsByOrgUnit', description: 'Get assets linked to an org unit (bMS 26R1+)', action: 'Get assets by org unit' },
    ],
    default: 'getAssetsByADObject',
  },
];

/** @deprecated Use assetOperations25R2 and assetOperations26R1 instead */
export const assetOperations: INodeProperties[] = [...assetOperations25R2, ...assetOperations26R1];

export const assetFields: INodeProperties[] = [
  // ----------------------------------
  //         asset:get
  // ----------------------------------
  {
    displayName: 'Asset ID',
    name: 'assetId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'The GUID of the asset',
  },

  // ----------------------------------
  //         asset:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['getMany'],
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
        resource: ['asset'],
        operation: ['getMany'],
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
        resource: ['asset'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter assets by name or description',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        placeholder: 'DisplayName asc',
        description: 'Sort order (e.g., "DisplayName asc", "AssetType desc")',
      },
      {
        displayName: 'Asset Type ID',
        name: 'assetTypeId',
        type: 'string',
        default: '',
        description: 'Filter by asset type GUID',
      },
    ],
  },

  // ----------------------------------
  //         asset:create
  // ----------------------------------
  {
    displayName: 'Asset Type ID',
    name: 'assetTypeId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['create'],
      },
    },
    description: 'The GUID of the asset type',
  },
  {
    displayName: 'Display Name',
    name: 'displayName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['create'],
      },
    },
    description: 'The display name of the asset',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Optional comment about the asset',
      },
      {
        displayName: 'Inventory Number',
        name: 'inventoryNumber',
        type: 'string',
        default: '',
        description: 'Inventory tracking number',
      },
      {
        displayName: 'Serial Number',
        name: 'serialNumber',
        type: 'string',
        default: '',
        description: 'Serial number of the asset',
      },
      {
        displayName: 'Manufacturer',
        name: 'manufacturer',
        type: 'string',
        default: '',
        description: 'Manufacturer name',
      },
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: '',
        description: 'Model name or number',
      },
      {
        displayName: 'Location',
        name: 'location',
        type: 'string',
        default: '',
        description: 'Physical location of the asset',
      },
      {
        displayName: 'Purchase Date',
        name: 'purchaseDate',
        type: 'dateTime',
        default: '',
        description: 'Date when the asset was purchased',
      },
      {
        displayName: 'Purchase Price',
        name: 'purchasePrice',
        type: 'number',
        default: 0,
        description: 'Purchase price of the asset',
      },
    ],
  },

  // ----------------------------------
  //         asset:update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Display Name',
        name: 'displayName',
        type: 'string',
        default: '',
        description: 'The display name of the asset',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment about the asset',
      },
      {
        displayName: 'Inventory Number',
        name: 'inventoryNumber',
        type: 'string',
        default: '',
        description: 'Inventory tracking number',
      },
      {
        displayName: 'Serial Number',
        name: 'serialNumber',
        type: 'string',
        default: '',
        description: 'Serial number of the asset',
      },
      {
        displayName: 'Manufacturer',
        name: 'manufacturer',
        type: 'string',
        default: '',
        description: 'Manufacturer name',
      },
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: '',
        description: 'Model name or number',
      },
      {
        displayName: 'Location',
        name: 'location',
        type: 'string',
        default: '',
        description: 'Physical location of the asset',
      },
      {
        displayName: 'Purchase Date',
        name: 'purchaseDate',
        type: 'dateTime',
        default: '',
        description: 'Date when the asset was purchased',
      },
      {
        displayName: 'Purchase Price',
        name: 'purchasePrice',
        type: 'number',
        default: 0,
        description: 'Purchase price of the asset',
      },
    ],
  },

  // ============================================================================
  // ASSET TYPES OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         asset:getAssetTypes
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['getAssetTypes', 'getAssetsByEndpoint', 'getAssetsByLogicalGroup', 'getAssetStockAssets', 'getAssetStockFolders'],
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
        resource: ['asset'],
        operation: ['getAssetTypes', 'getAssetsByEndpoint', 'getAssetsByLogicalGroup', 'getAssetStockAssets', 'getAssetStockFolders'],
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
        resource: ['asset'],
        operation: ['getAssetTypes', 'getAssetsByEndpoint', 'getAssetsByLogicalGroup', 'getAssetStockAssets', 'getAssetStockFolders'],
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
  //         asset:getAssetType
  // ----------------------------------
  {
    displayName: 'Asset Type ID',
    name: 'assetTypeId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['getAssetType', 'deleteAssetType'],
      },
    },
    description: 'The GUID of the asset type',
  },

  // ----------------------------------
  //         asset:createAssetType
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['createAssetType', 'createAssetStockFolder'],
      },
    },
    description: 'The name of the asset type or folder',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['createAssetType', 'createAssetStockFolder'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the asset type or folder',
      },
      {
        displayName: 'Parent ID',
        name: 'parentId',
        type: 'string',
        default: '',
        description: 'GUID of the parent folder (for stock folders)',
      },
    ],
  },

  // ============================================================================
  // ASSET ORGANIZATION OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         asset:getAssetsByEndpoint
  // ----------------------------------
  endpointLocator({
    show: {
      resource: ['asset'],
      operation: ['getAssetsByEndpoint'],
    },
  }),

  // ----------------------------------
  //         asset:getAssetsByLogicalGroup
  // ----------------------------------
  {
    displayName: 'Logical Group ID',
    name: 'logicalGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['getAssetsByLogicalGroup'],
      },
    },
    description: 'The GUID of the logical group',
  },

  // ============================================================================
  // ASSET STOCK OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         asset:updateAssetStockFolder
  // ----------------------------------
  {
    displayName: 'Folder ID',
    name: 'folderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['updateAssetStockFolder', 'deleteAssetStockFolder'],
      },
    },
    description: 'The GUID of the asset stock folder',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['updateAssetStockFolder'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the folder',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the folder',
      },
      {
        displayName: 'Parent ID',
        name: 'parentId',
        type: 'string',
        default: '',
        description: 'GUID of the parent folder',
      },
    ],
  },

  // ============================================================================
  // AD OBJECT / ORG UNIT ASSET OPERATIONS (bMS 26R1+)
  // ============================================================================

  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['getAssetsByADObject', 'getAssetsByOrgUnit'],
        bmsVersion: ['26R1'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['getAssetsByADObject', 'getAssetsByOrgUnit'],
        bmsVersion: ['26R1'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'AD Object ID',
    name: 'adObjectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['getAssetsByADObject'],
        bmsVersion: ['26R1'],
      },
    },
    description: 'The GUID of the AD object',
  },
  {
    displayName: 'Org Unit ID',
    name: 'orgUnitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asset'],
        operation: ['getAssetsByOrgUnit'],
        bmsVersion: ['26R1'],
      },
    },
    description: 'The GUID of the org unit',
  },

  // ----------------------------------
  //  asset:getAssetStockFolder
  // ----------------------------------
  {
    displayName: 'Folder ID',
    name: 'folderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetStockFolder'] } },
    description: 'The GUID of the asset stock folder',
  },

  // ----------------------------------
  //  asset:getAssetStockSubFolders
  // ----------------------------------
  {
    displayName: 'Folder ID',
    name: 'folderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetStockSubFolders'] } },
    description: 'The GUID of the parent asset stock folder',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetStockSubFolders'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetStockSubFolders'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetStockSubFolders'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter folders by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },

  // ----------------------------------
  //  asset:getAssetTypeFolders
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetTypeFolders'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetTypeFolders'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetTypeFolders'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter folders by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },

  // ----------------------------------
  //  asset:getAssetTypeFolder
  // ----------------------------------
  {
    displayName: 'Asset Type Folder ID',
    name: 'assetTypeFolderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetTypeFolder'] } },
    description: 'The GUID of the asset type folder',
  },

  // ----------------------------------
  //  asset:createAssetTypeFolder
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['asset'], operation: ['createAssetTypeFolder'] } },
    description: 'Name of the new asset type folder',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['asset'], operation: ['createAssetTypeFolder'] } },
    options: [
      { displayName: 'Parent Folder ID', name: 'parentFolderId', type: 'string', default: '', description: 'The GUID of the parent folder' },
    ],
  },

  // ----------------------------------
  //  asset:updateAssetTypeFolder
  // ----------------------------------
  {
    displayName: 'Asset Type Folder ID',
    name: 'assetTypeFolderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['asset'], operation: ['updateAssetTypeFolder'] } },
    description: 'The GUID of the asset type folder to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['asset'], operation: ['updateAssetTypeFolder'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '', description: 'New name for the folder' },
    ],
  },

  // ----------------------------------
  //  asset:deleteAssetTypeFolder
  // ----------------------------------
  {
    displayName: 'Asset Type Folder ID',
    name: 'assetTypeFolderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['asset'], operation: ['deleteAssetTypeFolder'] } },
    description: 'The GUID of the asset type folder to delete',
  },

  // ----------------------------------
  //  asset:getAssetTypeFolderSubFolders
  // ----------------------------------
  {
    displayName: 'Asset Type Folder ID',
    name: 'assetTypeFolderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetTypeFolderSubFolders'] } },
    description: 'The GUID of the parent asset type folder',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetTypeFolderSubFolders'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetTypeFolderSubFolders'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['asset'], operation: ['getAssetTypeFolderSubFolders'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter folders by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
];

// ============================================================================
// P12.4 — assetType sub-resource
// ============================================================================

export const assetTypeOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['assetType'] } },
    options: [
      { name: 'Get Asset Types', value: 'getAssetTypes', description: 'Get many asset types', action: 'Get asset types' },
      { name: 'Get Asset Type', value: 'getAssetType', description: 'Get an asset type by ID', action: 'Get an asset type' },
      { name: 'Create Asset Type', value: 'createAssetType', description: 'Create a new asset type', action: 'Create an asset type' },
      { name: 'Delete Asset Type', value: 'deleteAssetType', description: 'Delete an asset type', action: 'Delete an asset type' },
    ],
    default: 'getAssetTypes',
  },
];

export const assetTypeFields: INodeProperties[] = [
  {
    displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false,
    displayOptions: { show: { resource: ['assetType'], operation: ['getAssetTypes'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50,
    displayOptions: { show: { resource: ['assetType'], operation: ['getAssetTypes'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {},
    displayOptions: { show: { resource: ['assetType'], operation: ['getAssetTypes'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order (e.g., "Name asc")' },
    ],
  },
  {
    displayName: 'Asset Type ID', name: 'assetTypeId', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetType'], operation: ['getAssetType', 'deleteAssetType'] } },
    description: 'The GUID of the asset type',
  },
  {
    displayName: 'Name', name: 'name', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetType'], operation: ['createAssetType'] } },
    description: 'The name of the asset type',
  },
  {
    displayName: 'Additional Fields', name: 'additionalFields', type: 'collection', placeholder: 'Add Field', default: {},
    displayOptions: { show: { resource: ['assetType'], operation: ['createAssetType'] } },
    options: [
      { displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Description of the asset type' },
    ],
  },
];

// ============================================================================
// P12.4 — assetFolder sub-resource
// ============================================================================

export const assetFolderOperations: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['assetFolder'] } },
    options: [
      { name: 'Create Asset Stock Folder', value: 'createAssetStockFolder', description: 'Create a new asset stock folder', action: 'Create asset stock folder' },
      { name: 'Create Asset Type Folder', value: 'createAssetTypeFolder', description: 'Create a new asset type folder', action: 'Create asset type folder' },
      { name: 'Delete Asset Stock Folder', value: 'deleteAssetStockFolder', description: 'Delete an asset stock folder', action: 'Delete asset stock folder' },
      { name: 'Delete Asset Type Folder', value: 'deleteAssetTypeFolder', description: 'Delete an asset type folder', action: 'Delete asset type folder' },
      { name: 'Get Asset Stock Assets', value: 'getAssetStockAssets', description: 'Get assets in stock', action: 'Get asset stock assets' },
      { name: 'Get Asset Stock Folder', value: 'getAssetStockFolder', description: 'Get a single asset stock folder by ID', action: 'Get asset stock folder' },
      { name: 'Get Asset Stock Folders', value: 'getAssetStockFolders', action: 'Get asset stock folders' },
      { name: 'Get Asset Stock Sub-Folders', value: 'getAssetStockSubFolders', description: 'Get sub-folders of an asset stock folder', action: 'Get asset stock sub-folders' },
      { name: 'Get Asset Type Folder', value: 'getAssetTypeFolder', description: 'Get a single asset type folder by ID', action: 'Get asset type folder' },
      { name: 'Get Asset Type Folder Sub-Folders', value: 'getAssetTypeFolderSubFolders', description: 'Get sub-folders of an asset type folder', action: 'Get asset type folder sub-folders' },
      { name: 'Get Asset Type Folders', value: 'getAssetTypeFolders', action: 'Get asset type folders' },
      { name: 'Update Asset Stock Folder', value: 'updateAssetStockFolder', action: 'Update asset stock folder' },
      { name: 'Update Asset Type Folder', value: 'updateAssetTypeFolder', description: 'Update an asset type folder', action: 'Update asset type folder' },
    ],
    default: 'getAssetStockFolders',
  },
];

export const assetFolderFields: INodeProperties[] = [
  // getAssetStockAssets / getAssetStockFolders
  {
    displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false,
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetStockAssets', 'getAssetStockFolders'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50,
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetStockAssets', 'getAssetStockFolders'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {},
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetStockAssets', 'getAssetStockFolders'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order (e.g., "Name asc")' },
    ],
  },
  // createAssetStockFolder
  {
    displayName: 'Name', name: 'name', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetFolder'], operation: ['createAssetStockFolder'] } },
    description: 'The name of the folder',
  },
  {
    displayName: 'Additional Fields', name: 'additionalFields', type: 'collection', placeholder: 'Add Field', default: {},
    displayOptions: { show: { resource: ['assetFolder'], operation: ['createAssetStockFolder'] } },
    options: [
      { displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Description of the folder' },
      { displayName: 'Parent ID', name: 'parentId', type: 'string', default: '', description: 'GUID of the parent folder' },
    ],
  },
  // updateAssetStockFolder / deleteAssetStockFolder
  {
    displayName: 'Folder ID', name: 'folderId', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetFolder'], operation: ['updateAssetStockFolder', 'deleteAssetStockFolder'] } },
    description: 'The GUID of the asset stock folder',
  },
  {
    displayName: 'Update Fields', name: 'updateFields', type: 'collection', placeholder: 'Add Field', default: {},
    displayOptions: { show: { resource: ['assetFolder'], operation: ['updateAssetStockFolder'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '', description: 'The name of the folder' },
      { displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Description of the folder' },
      { displayName: 'Parent ID', name: 'parentId', type: 'string', default: '', description: 'GUID of the parent folder' },
    ],
  },
  // getAssetStockFolder
  {
    displayName: 'Folder ID', name: 'folderId', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetStockFolder'] } },
    description: 'The GUID of the asset stock folder',
  },
  // getAssetStockSubFolders
  {
    displayName: 'Folder ID', name: 'folderId', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetStockSubFolders'] } },
    description: 'The GUID of the parent asset stock folder',
  },
  {
    displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false,
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetStockSubFolders'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50,
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetStockSubFolders'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {},
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetStockSubFolders'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter folders by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
  // getAssetTypeFolders
  {
    displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false,
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetTypeFolders'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50,
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetTypeFolders'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {},
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetTypeFolders'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter folders by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
  // getAssetTypeFolder
  {
    displayName: 'Asset Type Folder ID', name: 'assetTypeFolderId', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetTypeFolder'] } },
    description: 'The GUID of the asset type folder',
  },
  // createAssetTypeFolder
  {
    displayName: 'Name', name: 'name', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetFolder'], operation: ['createAssetTypeFolder'] } },
    description: 'Name of the new asset type folder',
  },
  {
    displayName: 'Additional Fields', name: 'additionalFields', type: 'collection', placeholder: 'Add Field', default: {},
    displayOptions: { show: { resource: ['assetFolder'], operation: ['createAssetTypeFolder'] } },
    options: [
      { displayName: 'Parent Folder ID', name: 'parentFolderId', type: 'string', default: '', description: 'The GUID of the parent folder' },
    ],
  },
  // updateAssetTypeFolder
  {
    displayName: 'Asset Type Folder ID', name: 'assetTypeFolderId', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetFolder'], operation: ['updateAssetTypeFolder'] } },
    description: 'The GUID of the asset type folder to update',
  },
  {
    displayName: 'Update Fields', name: 'updateFields', type: 'collection', placeholder: 'Add Field', default: {},
    displayOptions: { show: { resource: ['assetFolder'], operation: ['updateAssetTypeFolder'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '', description: 'New name for the folder' },
    ],
  },
  // deleteAssetTypeFolder
  {
    displayName: 'Asset Type Folder ID', name: 'assetTypeFolderId', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetFolder'], operation: ['deleteAssetTypeFolder'] } },
    description: 'The GUID of the asset type folder to delete',
  },
  // getAssetTypeFolderSubFolders
  {
    displayName: 'Asset Type Folder ID', name: 'assetTypeFolderId', type: 'string', required: true, default: '',
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetTypeFolderSubFolders'] } },
    description: 'The GUID of the parent asset type folder',
  },
  {
    displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false,
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetTypeFolderSubFolders'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1 }, default: 50,
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetTypeFolderSubFolders'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options', name: 'options', type: 'collection', placeholder: 'Add Option', default: {},
    displayOptions: { show: { resource: ['assetFolder'], operation: ['getAssetTypeFolderSubFolders'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter folders by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
];

// ============================================================================
// P12.4 — asset trimmed (keep resource, trimmed ops/fields)
// ============================================================================

export const assetOperations25R2Trimmed: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['asset'], bmsVersion: ['25R2'] } },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new asset', action: 'Create an asset' },
      { name: 'Delete', value: 'delete', description: 'Delete an asset', action: 'Delete an asset' },
      { name: 'Get', value: 'get', description: 'Get an asset by ID', action: 'Get an asset' },
      { name: 'Get Assets by Endpoint', value: 'getAssetsByEndpoint', description: 'Get assets linked to an endpoint', action: 'Get assets by endpoint' },
      { name: 'Get Assets by Logical Group', value: 'getAssetsByLogicalGroup', description: 'Get assets in a logical group', action: 'Get assets by logical group' },
      { name: 'Get Many', value: 'getMany', description: 'Get many assets', action: 'Get many assets' },
      { name: 'Update', value: 'update', description: 'Update an asset', action: 'Update an asset' },
    ],
    default: 'getMany',
  },
];

export const assetOperations26R1Trimmed: INodeProperties[] = [
  {
    displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
    displayOptions: { show: { resource: ['asset'], bmsVersion: ['26R1'] } },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new asset', action: 'Create an asset' },
      { name: 'Delete', value: 'delete', description: 'Delete an asset', action: 'Delete an asset' },
      { name: 'Get', value: 'get', description: 'Get an asset by ID', action: 'Get an asset' },
      { name: 'Get Assets by AD Object', value: 'getAssetsByADObject', description: 'Get assets linked to an AD object (bMS 26R1+)', action: 'Get assets by AD object' },
      { name: 'Get Assets by Endpoint', value: 'getAssetsByEndpoint', description: 'Get assets linked to an endpoint', action: 'Get assets by endpoint' },
      { name: 'Get Assets by Logical Group', value: 'getAssetsByLogicalGroup', description: 'Get assets in a logical group', action: 'Get assets by logical group' },
      { name: 'Get Assets by Org Unit', value: 'getAssetsByOrgUnit', description: 'Get assets linked to an org unit (bMS 26R1+)', action: 'Get assets by org unit' },
      { name: 'Get Many', value: 'getMany', description: 'Get many assets', action: 'Get many assets' },
      { name: 'Update', value: 'update', description: 'Update an asset', action: 'Update an asset' },
    ],
    default: 'getMany',
  },
];
