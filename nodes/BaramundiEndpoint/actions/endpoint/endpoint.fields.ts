import type { INodeProperties } from 'n8n-workflow';
import { endpointLocator } from '../../../shared/resourceLocators';

// ============================================================
// Core Endpoint Operations
// ============================================================

/** Operations shown when bmsVersion = 25R2 */
export const endpointOperations25R2: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['endpoint'], bmsVersion: ['25R2'] } },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new endpoint', action: 'Create an endpoint' },
      { name: 'Create Industrial Endpoint', value: 'createIndustrialEndpoint', description: 'Create a new industrial endpoint (bMS 25R2 only)', action: 'Create industrial endpoint' },
      { name: 'Delete', value: 'delete', description: 'Delete an endpoint', action: 'Delete an endpoint' },
      { name: 'Delete Industrial Endpoint', value: 'deleteIndustrialEndpoint', description: 'Delete an industrial endpoint (bMS 25R2 only)', action: 'Delete industrial endpoint' },
      { name: 'Get', value: 'get', description: 'Get an endpoint by ID', action: 'Get an endpoint' },
      { name: 'Get By Group', value: 'getEndpointsByGroup', description: 'Get endpoints in a group, optionally filtered by platform type', action: 'Get endpoints by group' },
      { name: 'Get Endpoints by AD User', value: 'getEndpointsByADUser', description: 'Get endpoints assigned to an AD user', action: 'Get endpoints by AD user' },
      { name: 'Get Industrial Endpoint', value: 'getIndustrialEndpoint', description: 'Get an industrial endpoint by ID (bMS 25R2 only)', action: 'Get industrial endpoint' },
      { name: 'Get Industrial Endpoints', value: 'getIndustrialEndpoints', description: 'Get all industrial endpoints (bMS 25R2 only)', action: 'Get industrial endpoints' },
      { name: 'Get Industrial Endpoints By Group', value: 'getIndustrialEndpointsByGroup', description: 'Get industrial endpoints in a group (bMS 25R2 only)', action: 'Get industrial endpoints by group' },
      { name: 'Get Many', value: 'getMany', description: 'Get many endpoints, optionally filtered by platform type', action: 'Get many endpoints' },
      { name: 'Search', value: 'search', description: 'Search endpoints by name or other criteria', action: 'Search endpoints' },
      { name: 'Start Enrollment', value: 'startEnrollment', description: 'Start enrollment process for an endpoint', action: 'Start enrollment for endpoint' },
      { name: 'Trigger Intune Installation', value: 'triggerIntuneInstallation', description: 'Trigger installation of baramundi Management Agent via Intune', action: 'Trigger Intune installation' },
      { name: 'Update', value: 'update', description: 'Update an endpoint', action: 'Update an endpoint' },
      { name: 'Update Industrial Endpoint', value: 'updateIndustrialEndpoint', description: 'Update an industrial endpoint (bMS 25R2 only)', action: 'Update industrial endpoint' },
    ],
    default: 'getMany',
  },
];

/** Operations shown when bmsVersion = 26R1 */
export const endpointOperations26R1: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['endpoint'], bmsVersion: ['26R1'] } },
    options: [
      { name: 'Create', value: 'create', description: 'Create a new endpoint', action: 'Create an endpoint' },
      { name: 'Delete', value: 'delete', description: 'Delete an endpoint', action: 'Delete an endpoint' },
      { name: 'Delete Entra ID Data', value: 'deleteEntraIdData', description: 'Delete Entra ID data for an endpoint (bMS 26R1+)', action: 'Delete Entra ID data for endpoint' },
      { name: 'Delete Unmanaged Endpoint', value: 'deleteUnmanagedEndpoint', description: 'Delete an unmanaged endpoint by ID (bMS 26R1+)', action: 'Delete unmanaged endpoint' },
      { name: 'Get', value: 'get', description: 'Get an endpoint by ID', action: 'Get an endpoint' },
      { name: 'Get By Group', value: 'getEndpointsByGroup', description: 'Get endpoints in a group, optionally filtered by platform type', action: 'Get endpoints by group' },
      { name: 'Get Endpoints by AD User', value: 'getEndpointsByADUser', description: 'Get endpoints assigned to an AD user', action: 'Get endpoints by AD user' },
      { name: 'Get Endpoints by UDG', value: 'getEndpointsByUDG', description: 'Get endpoints in a Universal Dynamic Group (bMS 26R1+)', action: 'Get endpoints by UDG' },
      { name: 'Get Entra ID Data By Device ID', value: 'getEntraIdDataByDeviceId', description: 'Get Entra ID endpoint data by Entra ID device ID (bMS 26R1+)', action: 'Get Entra ID data by device ID' },
      { name: 'Get Many', value: 'getMany', description: 'Get many endpoints, optionally filtered by platform type', action: 'Get many endpoints' },
      { name: 'Get Unmanaged Endpoint', value: 'getUnmanagedEndpoint', description: 'Get an unmanaged endpoint by ID (bMS 26R1+)', action: 'Get unmanaged endpoint' },
      { name: 'Get Unmanaged Endpoints', value: 'getUnmanagedEndpoints', description: 'Get all unmanaged endpoints (bMS 26R1+)', action: 'Get unmanaged endpoints' },
      { name: 'Search', value: 'search', description: 'Search endpoints by name or other criteria', action: 'Search endpoints' },
      { name: 'Set Entra ID Data', value: 'setEntraIdData', description: 'Create or update Entra ID data for an endpoint (bMS 26R1+)', action: 'Set Entra ID data for endpoint' },
      { name: 'Start Enrollment', value: 'startEnrollment', description: 'Start enrollment process for an endpoint', action: 'Start enrollment for endpoint' },
      { name: 'Trigger Intune Installation', value: 'triggerIntuneInstallation', description: 'Trigger installation of baramundi Management Agent via Intune', action: 'Trigger Intune installation' },
      { name: 'Update', value: 'update', description: 'Update an endpoint', action: 'Update an endpoint' },
    ],
    default: 'getMany',
  },
];

/** @deprecated Use endpointOperations25R2 and endpointOperations26R1 instead */
export const endpointOperations: INodeProperties[] = [...endpointOperations25R2, ...endpointOperations26R1];

// ============================================================
// Logical Group Operations
// ============================================================

export const logicalGroupOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['logicalGroup'] } },
    options: [
      { name: 'Create', value: 'createLogicalGroup', description: 'Create a new logical group', action: 'Create a logical group' },
      { name: 'Delete', value: 'deleteLogicalGroup', description: 'Delete a logical group', action: 'Delete a logical group' },
      { name: 'Get', value: 'getLogicalGroup', description: 'Get a logical group by ID', action: 'Get a logical group' },
      { name: 'Get Endpoints by Logical Group', value: 'getEndpointsByLogicalGroup', description: 'Get endpoints in a logical group', action: 'Get endpoints by logical group' },
      { name: 'Get Many', value: 'getLogicalGroups', description: 'Get many logical groups', action: 'Get many logical groups' },
      { name: 'Get Sub-Groups', value: 'getLogicalGroupSubGroups', description: 'Get sub-groups of a logical group', action: 'Get logical group sub-groups' },
      { name: 'Update', value: 'updateLogicalGroup', description: 'Update a logical group', action: 'Update a logical group' },
    ],
    default: 'getLogicalGroups',
  },
];

// ============================================================
// Static Group Operations
// ============================================================

export const staticGroupOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['staticGroup'] } },
    // bConnect exposes static groups only through sub-routes (/StaticGroups/{id}/Endpoints, …);
    // list/get/create/update/delete routes do not exist (#60)
    options: [
      { name: 'Get Endpoints by Static Group', value: 'getEndpointsByStaticGroup', description: 'Get endpoints in a static group', action: 'Get endpoints by static group' },
    ],
    default: 'getEndpointsByStaticGroup',
  },
];

// ============================================================
// Dynamic Group Operations
// ============================================================

export const dynamicGroupOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['dynamicGroup'] } },
    // bConnect exposes dynamic groups only through sub-routes (/DynamicGroups/{id}/Endpoints, …) (#60)
    options: [
      { name: 'Get Endpoints by Dynamic Group', value: 'getEndpointsByDynamicGroup', description: 'Get endpoints in a dynamic group', action: 'Get endpoints by dynamic group' },
    ],
    default: 'getEndpointsByDynamicGroup',
  },
];

// ============================================================
// Maintenance Window Operations
// ============================================================

export const maintenanceWindowOperations25R2: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['maintenanceWindow'], bmsVersion: ['25R2'] } },
    options: [
      { name: 'Create Endpoint Maintenance Window', value: 'createEndpointMaintenanceWindow', description: 'Create a maintenance window for an endpoint', action: 'Create endpoint maintenance window' },
      { name: 'Create Group Maintenance Window', value: 'createGroupMaintenanceWindow', description: 'Create a maintenance window for a group', action: 'Create group maintenance window' },
      { name: 'Delete Endpoint Maintenance Window', value: 'deleteEndpointMaintenanceWindow', description: 'Delete a maintenance window for an endpoint', action: 'Delete endpoint maintenance window' },
      { name: 'Delete Group Maintenance Window', value: 'deleteGroupMaintenanceWindow', description: 'Delete a maintenance window for a group', action: 'Delete group maintenance window' },
      { name: 'Get Endpoint Maintenance Window', value: 'getEndpointMaintenanceWindow', description: 'Get the maintenance window for an endpoint', action: 'Get endpoint maintenance window' },
      { name: 'Get Group Maintenance Window', value: 'getGroupMaintenanceWindow', description: 'Get the maintenance window for a logical group', action: 'Get group maintenance window' },
      { name: 'Replace Endpoint Maintenance Window (PUT)', value: 'putEndpointMaintenanceWindow', description: 'Replace a maintenance window for an endpoint with a full body (bMS 25R2)', action: 'Replace endpoint maintenance window' },
      { name: 'Replace Group Maintenance Window (PUT)', value: 'putGroupMaintenanceWindow', description: 'Replace a maintenance window for a group with a full body (bMS 25R2)', action: 'Replace group maintenance window' },
    ],
    default: 'getEndpointMaintenanceWindow',
  },
];

export const maintenanceWindowOperations26R1: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['maintenanceWindow'], bmsVersion: ['26R1'] } },
    options: [
      { name: 'Create Endpoint Maintenance Window', value: 'createEndpointMaintenanceWindow', description: 'Create a maintenance window for an endpoint', action: 'Create endpoint maintenance window' },
      { name: 'Create Group Maintenance Window', value: 'createGroupMaintenanceWindow', description: 'Create a maintenance window for a group', action: 'Create group maintenance window' },
      { name: 'Delete Endpoint Maintenance Window', value: 'deleteEndpointMaintenanceWindow', description: 'Delete a maintenance window for an endpoint', action: 'Delete endpoint maintenance window' },
      { name: 'Delete Group Maintenance Window', value: 'deleteGroupMaintenanceWindow', description: 'Delete a maintenance window for a group', action: 'Delete group maintenance window' },
      { name: 'Get Endpoint Maintenance Window', value: 'getEndpointMaintenanceWindow', description: 'Get the maintenance window for an endpoint', action: 'Get endpoint maintenance window' },
      { name: 'Get Group Maintenance Window', value: 'getGroupMaintenanceWindow', description: 'Get the maintenance window for a logical group', action: 'Get group maintenance window' },
      { name: 'Update Endpoint Maintenance Window (PATCH)', value: 'updateEndpointMaintenanceWindow', description: 'Update a maintenance window for an endpoint using JSON Patch (bMS 26R1+)', action: 'Update endpoint maintenance window' },
      { name: 'Update Group Maintenance Window (PATCH)', value: 'updateGroupMaintenanceWindow', description: 'Update a maintenance window for a group using JSON Patch (bMS 26R1+)', action: 'Update group maintenance window' },
    ],
    default: 'getEndpointMaintenanceWindow',
  },
];

// ============================================================
// Core Endpoint Fields
// ============================================================

export const endpointFields: INodeProperties[] = [
  // ----------------------------------
  //         endpoint:get, endpoint:delete
  // ----------------------------------
  endpointLocator({
    show: {
      resource: ['endpoint'],
      operation: ['get', 'delete'],
    },
  }),

  // ----------------------------------
  //         endpoint:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['endpoint'],
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
        resource: ['endpoint'],
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
        resource: ['endpoint'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        placeholder: 'DisplayName asc',
        description: 'Sort order (e.g., "DisplayName asc", "LastContact desc")',
      },
      {
        displayName: 'Display Name',
        name: 'displayName',
        type: 'string',
        default: '',
        description: 'Filter by display name',
      },
      {
        displayName: 'Host Name',
        name: 'hostName',
        type: 'string',
        default: '',
        description: 'Filter by host name (not available for Android and iOS)',
      },
    ],
  },

  // ----------------------------------
  //         endpoint:search
  // ----------------------------------
  {
    displayName: 'Search Query',
    name: 'searchQuery',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['search'],
      },
    },
    description: 'Search query to filter endpoints (searches in DisplayName)',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['search'],
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
        resource: ['endpoint'],
        operation: ['search'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         endpoint:create
  // ----------------------------------
  {
    displayName: 'Endpoint Type',
    name: 'endpointType',
    type: 'options',
    required: true,
    default: 'windows',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'Android',
        value: 'android',
        description: 'Android mobile device',
      },
      {
        name: 'iOS',
        value: 'ios',
        description: 'iOS mobile device',
      },
      {
        name: 'Linux',
        value: 'linux',
        description: 'Linux endpoint',
      },
      {
        name: 'Mac',
        value: 'mac',
        description: 'macOS endpoint',
      },
      {
        name: 'Network',
        value: 'network',
        description: 'Network endpoint (requires primary IP address)',
      },
      {
        name: 'Windows',
        value: 'windows',
        description: 'Windows desktop/server endpoint',
      },
    ],
    description: 'The type of endpoint to create',
  },
  {
    displayName: 'Display Name',
    name: 'displayName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
      },
    },
    description: 'Display name of the endpoint (max 255 characters)',
  },
  {
    displayName: 'Host Name',
    name: 'hostName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
        endpointType: ['windows', 'linux'],
      },
    },
    description: 'The host name of the endpoint (required for Windows and Linux)',
  },
  {
    // WindowsEndpointForCreation
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
        endpointType: ['windows'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Text field for creating comments on the endpoint',
      },
      {
        displayName: 'Domain',
        name: 'domain',
        type: 'string',
        default: '',
        description: 'The name of the domain the client is joined to',
      },
      {
        displayName: 'Logical Group ID',
        name: 'logicalGroupId',
        type: 'string',
        default: '',
        description: 'ID of Logical Group (GUID)',
      },
      {
        displayName: 'Primary IP',
        name: 'primaryIP',
        type: 'string',
        default: '',
        description: 'Primary IP address of the endpoint',
      },
      {
        displayName: 'Primary MAC',
        name: 'primaryMAC',
        type: 'string',
        default: '',
        placeholder: 'AA:BB:CC:DD:EE:FF',
        description: 'Primary MAC address (IEEE MAC-48 format)',
      },
      {
        displayName: 'Primary Subnet Mask',
        name: 'primarySubnetMask',
        type: 'string',
        default: '',
        placeholder: '255.255.255.0',
      },
      {
        displayName: 'Registered User',
        name: 'registeredUser',
        type: 'string',
        default: '',
        description: 'The registered user of the endpoint',
      },
      {
        displayName: 'UUID',
        name: 'uuid',
        type: 'string',
        default: '',
        description: 'The UUID of the endpoint',
      },
    ],
  },
  {
    // LinuxEndpointForCreation
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
        endpointType: ['linux'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Text field for creating comments on the endpoint',
      },
      {
        displayName: 'Logical Group ID',
        name: 'logicalGroupId',
        type: 'string',
        default: '',
        description: 'ID of Logical Group (GUID)',
      },
      {
        displayName: 'Primary IP',
        name: 'primaryIP',
        type: 'string',
        default: '',
        description: 'Primary IP address of the endpoint',
      },
      {
        displayName: 'Primary MAC',
        name: 'primaryMAC',
        type: 'string',
        default: '',
        placeholder: 'AA:BB:CC:DD:EE:FF',
        description: 'Primary MAC address (IEEE MAC-48 format)',
      },
      {
        displayName: 'Registered User',
        name: 'registeredUser',
        type: 'string',
        default: '',
        description: 'The registered user of the endpoint',
      },
    ],
  },
  {
    // MacEndpointForCreation
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
        endpointType: ['mac'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Text field for creating comments on the endpoint',
      },
      {
        displayName: 'Host Name',
        name: 'hostName',
        type: 'string',
        default: '',
        description: 'Host name of the endpoint',
      },
      {
        displayName: 'Logical Group ID',
        name: 'logicalGroupId',
        type: 'string',
        default: '',
        description: 'ID of Logical Group (GUID)',
      },
      {
        displayName: 'Owner',
        name: 'owner',
        type: 'options',
        default: 'Company',
        options: [
          { name: 'Company', value: 'Company' },
          { name: 'Private', value: 'Private' },
        ],
        description: 'Whether the device is company-owned or private',
      },
      {
        displayName: 'Registered User',
        name: 'registeredUser',
        type: 'string',
        default: '',
        description: 'The registered user of the endpoint',
      },
      {
        displayName: 'Serial Number',
        name: 'serialNumber',
        type: 'string',
        default: '',
        description: 'Serial number of the device',
      },
    ],
  },
  {
    // AndroidEndpointForCreation / IosEndpointForCreation (no host name)
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
        endpointType: ['android', 'ios'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Text field for creating comments on the endpoint',
      },
      {
        displayName: 'Logical Group ID',
        name: 'logicalGroupId',
        type: 'string',
        default: '',
        description: 'ID of Logical Group (GUID)',
      },
      {
        displayName: 'Owner',
        name: 'owner',
        type: 'options',
        default: 'Company',
        options: [
          { name: 'Company', value: 'Company' },
          { name: 'Private', value: 'Private' },
        ],
        description: 'Whether the device is company-owned or private',
      },
      {
        displayName: 'Registered User',
        name: 'registeredUser',
        type: 'string',
        default: '',
        description: 'The registered user of the endpoint',
      },
      {
        displayName: 'Serial Number',
        name: 'serialNumber',
        type: 'string',
        default: '',
        description: 'Serial number of the device',
      },
    ],
  },

  // ----------------------------------
  //         endpoint:create (network)
  // ----------------------------------
  {
    displayName: 'Primary IP Address',
    name: 'primaryIP',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
        endpointType: ['network'],
      },
    },
    description: 'Primary IP address of the network endpoint (required)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
        endpointType: ['network'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Text field for creating comments on the endpoint',
      },
      {
        displayName: 'Host Name',
        name: 'hostName',
        type: 'string',
        default: '',
        description: 'Host name of the network endpoint',
      },
      {
        displayName: 'Logical Group ID',
        name: 'logicalGroupId',
        type: 'string',
        default: '',
        description: 'ID of Logical Group (GUID)',
      },
      {
        displayName: 'Primary MAC Address',
        name: 'primaryMAC',
        type: 'string',
        default: '',
        description: 'Primary MAC address of the endpoint',
      },
      {
        displayName: 'Web Interface URL',
        name: 'webInterfaceUrl',
        type: 'string',
        default: '',
        description: 'URL of the web interface of the network device',
      },
    ],
  },

  // ----------------------------------
  //         endpoint:update
  // ----------------------------------
  endpointLocator({
    show: {
      resource: ['endpoint'],
      operation: ['update'],
    },
  }),
  // Domain only exists on Windows endpoints; the other platform types have no such property.
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['update'],
        endpointType: ['windows'],
      },
    },
    options: [
      {
        displayName: 'Display Name',
        name: 'displayName',
        type: 'string',
        default: '',
        description: 'Display name of the endpoint',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment text',
      },
      {
        displayName: 'Host Name',
        name: 'hostName',
        type: 'string',
        default: '',
        description: 'The host name of the endpoint',
      },
      {
        displayName: 'Primary IP',
        name: 'primaryIP',
        type: 'string',
        default: '',
        description: 'Primary IP address',
      },
      {
        displayName: 'Primary MAC',
        name: 'primaryMAC',
        type: 'string',
        default: '',
        description: 'Primary MAC address',
      },
      {
        displayName: 'Logical Group ID',
        name: 'logicalGroupId',
        type: 'string',
        default: '',
        description: 'Logical Group GUID',
      },
      {
        displayName: 'Domain',
        name: 'domain',
        type: 'string',
        default: '',
        description: 'Domain name',
      },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['update'],
      },
      hide: {
        endpointType: ['windows'],
      },
    },
    options: [
      {
        displayName: 'Display Name',
        name: 'displayName',
        type: 'string',
        default: '',
        description: 'Display name of the endpoint',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment text',
      },
      {
        displayName: 'Host Name',
        name: 'hostName',
        type: 'string',
        default: '',
        description: 'The host name of the endpoint',
      },
      {
        displayName: 'Primary IP',
        name: 'primaryIP',
        type: 'string',
        default: '',
        description: 'Primary IP address',
      },
      {
        displayName: 'Primary MAC',
        name: 'primaryMAC',
        type: 'string',
        default: '',
        description: 'Primary MAC address',
      },
      {
        displayName: 'Logical Group ID',
        name: 'logicalGroupId',
        type: 'string',
        default: '',
        description: 'Logical Group GUID',
      },
    ],
  },

  // ----------------------------------
  //         endpoint:startEnrollment
  // ----------------------------------
  endpointLocator({
    show: {
      resource: ['endpoint'],
      operation: ['startEnrollment'],
    },
  }),
  {
    displayName: 'Enrollment Options',
    name: 'enrollmentOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['startEnrollment'],
      },
    },
    options: [
      {
        displayName: 'Enrollment Email Address',
        name: 'enrollmentMailAddress',
        type: 'string',
        default: '',
        placeholder: 'user@company.com',
        description: 'Email address to send enrollment instructions',
      },
      {
        displayName: 'Email Language ID',
        name: 'emailLanguageId',
        type: 'number',
        default: 1033,
        description: 'Language ID for enrollment email (1033=English, 1031=German)',
      },
    ],
  },

  // ----------------------------------
  //         endpoint:triggerIntuneInstallation
  // ----------------------------------
  endpointLocator({
    show: {
      resource: ['endpoint'],
      operation: ['triggerIntuneInstallation'],
    },
  }),

  // ----------------------------------
  //         endpoint: EntraId operations (26R1+)
  // ----------------------------------
  endpointLocator({
    show: {
      resource: ['endpoint'],
      operation: ['setEntraIdData', 'deleteEntraIdData'],
      bmsVersion: ['26R1'],
    },
  }),
  {
    displayName: 'Entra ID Device ID',
    name: 'entraIdDeviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['setEntraIdData'],
        bmsVersion: ['26R1'],
      },
    },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'The Entra ID device ID (GUID)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['setEntraIdData'],
        bmsVersion: ['26R1'],
      },
    },
    options: [
      {
        displayName: 'Entra ID Tenant ID',
        name: 'entraIdTenantId',
        type: 'string',
        default: '',
        placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
        description: 'The Entra ID tenant ID (GUID)',
      },
      {
        displayName: 'Entra ID User ID',
        name: 'entraIdUserId',
        type: 'string',
        default: '',
        placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
        description: 'The Entra ID user ID (GUID)',
      },
    ],
  },
  {
    displayName: 'Device ID',
    name: 'deviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['getEntraIdDataByDeviceId'],
        bmsVersion: ['26R1'],
      },
    },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'The Entra ID device ID (GUID)',
  },

  // ----------------------------------
  //         endpoint: UnmanagedEndpoints operations (26R1+)
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['getUnmanagedEndpoints'],
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
        resource: ['endpoint'],
        operation: ['getUnmanagedEndpoints'],
        bmsVersion: ['26R1'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Unmanaged Endpoint ID',
    name: 'unmanagedEndpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['getUnmanagedEndpoint', 'deleteUnmanagedEndpoint'],
        bmsVersion: ['26R1'],
      },
    },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'The GUID of the unmanaged endpoint',
  },

  // ----------------------------------
  //         endpoint: getEndpointsByADUser
  // ----------------------------------
  {
    displayName: 'AD User ID',
    name: 'adUserId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByADUser'] } },
    description: 'The GUID of the AD user',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByADUser'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByADUser'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByADUser'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },

  // ----------------------------------
  //         endpoint: getEndpointsByUDG (26R1+)
  // ----------------------------------
  {
    displayName: 'Universal Dynamic Group ID',
    name: 'udgId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByUDG'], bmsVersion: ['26R1'] } },
    description: 'The GUID of the Universal Dynamic Group (bMS 26R1+)',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByUDG'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByUDG'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByUDG'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
];

// ============================================================
// Logical Group Fields
// ============================================================

export const logicalGroupFields: INodeProperties[] = [
  // ----------------------------------
  //         logicalGroup: Group ID (get, update, delete)
  // ----------------------------------
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['logicalGroup'],
        operation: ['getLogicalGroup', 'updateLogicalGroup', 'deleteLogicalGroup'],
      },
    },
    description: 'The GUID of the group',
  },

  // ----------------------------------
  //         logicalGroup:getLogicalGroups
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['logicalGroup'],
        operation: ['getLogicalGroups'],
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
        resource: ['logicalGroup'],
        operation: ['getLogicalGroups'],
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
        resource: ['logicalGroup'],
        operation: ['getLogicalGroups'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Search query to filter groups',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        placeholder: 'Name asc',
        description: 'Sort order (e.g., "Name asc", "Name desc")',
      },
    ],
  },

  // ----------------------------------
  //         logicalGroup:createLogicalGroup
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['logicalGroup'],
        operation: ['createLogicalGroup'],
      },
    },
    description: 'Name of the group',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['logicalGroup'],
        operation: ['createLogicalGroup'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the group',
      },
    ],
  },

  // ----------------------------------
  //         logicalGroup:updateLogicalGroup
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['logicalGroup'],
        operation: ['updateLogicalGroup'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the group',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the group',
      },
    ],
  },

  // ----------------------------------
  //         logicalGroup: getLogicalGroupSubGroups, getEndpointsByLogicalGroup
  // ----------------------------------
  {
    displayName: 'Logical Group ID',
    name: 'logicalGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['logicalGroup'], operation: ['getLogicalGroupSubGroups', 'getEndpointsByLogicalGroup'] } },
    description: 'The GUID of the logical group',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['logicalGroup'], operation: ['getLogicalGroupSubGroups', 'getEndpointsByLogicalGroup'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['logicalGroup'], operation: ['getLogicalGroupSubGroups', 'getEndpointsByLogicalGroup'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['logicalGroup'], operation: ['getLogicalGroupSubGroups', 'getEndpointsByLogicalGroup'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
];

// ============================================================
// Static Group Fields
// ============================================================

export const staticGroupFields: INodeProperties[] = [
  // ----------------------------------
  //         staticGroup: getEndpointsByStaticGroup
  // ----------------------------------
  {
    displayName: 'Static Group ID',
    name: 'staticGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['staticGroup'], operation: ['getEndpointsByStaticGroup'] } },
    description: 'The GUID of the static group',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['staticGroup'], operation: ['getEndpointsByStaticGroup'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['staticGroup'], operation: ['getEndpointsByStaticGroup'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['staticGroup'], operation: ['getEndpointsByStaticGroup'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
];

// ============================================================
// Dynamic Group Fields
// ============================================================

export const dynamicGroupFields: INodeProperties[] = [
  // ----------------------------------
  //         dynamicGroup: getEndpointsByDynamicGroup
  // ----------------------------------
  {
    displayName: 'Dynamic Group ID',
    name: 'dynamicGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['dynamicGroup'], operation: ['getEndpointsByDynamicGroup'] } },
    description: 'The GUID of the dynamic group',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['dynamicGroup'], operation: ['getEndpointsByDynamicGroup'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['dynamicGroup'], operation: ['getEndpointsByDynamicGroup'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['dynamicGroup'], operation: ['getEndpointsByDynamicGroup'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
];

// ============================================================
// Maintenance Window Fields
// ============================================================

const MW_ENDPOINT_OPS = ['createEndpointMaintenanceWindow', 'updateEndpointMaintenanceWindow', 'deleteEndpointMaintenanceWindow', 'putEndpointMaintenanceWindow', 'getEndpointMaintenanceWindow'];
const MW_GROUP_OPS = ['createGroupMaintenanceWindow', 'updateGroupMaintenanceWindow', 'deleteGroupMaintenanceWindow', 'putGroupMaintenanceWindow', 'getGroupMaintenanceWindow'];
/** Operations that send a maintenance window body (POST, PUT 25R2, PATCH 26R1). */
const MW_WRITE_OPS = [
  'createEndpointMaintenanceWindow', 'updateEndpointMaintenanceWindow', 'putEndpointMaintenanceWindow',
  'createGroupMaintenanceWindow', 'updateGroupMaintenanceWindow', 'putGroupMaintenanceWindow',
];

const MW_DEFINITION_TYPES_25R2 = [
  { name: 'Everyday', value: 'Everyday', description: 'The same intervals every day' },
  { name: 'Individual Weekday', value: 'IndividualWeekday', description: 'Separate intervals per weekday' },
  { name: 'Unrestricted', value: 'Unrestricted', description: 'No restriction' },
  { name: 'Workday / Weekend', value: 'WorkdayWeekend', description: 'Separate intervals for workdays and weekends' },
];
const MW_DEFINITION_TYPES_26R1 = [
  { name: 'Anytime', value: 'Anytime' },
  ...MW_DEFINITION_TYPES_25R2,
  { name: 'Never', value: 'Never' },
];

function mwDefinitionType(version: '25R2' | '26R1'): INodeProperties {
  return {
    displayName: 'Definition Type',
    name: 'maintenanceWindowDefinitionType',
    type: 'options',
    required: true,
    default: 'Everyday',
    displayOptions: { show: { bmsVersion: [version], resource: ['maintenanceWindow'], operation: MW_WRITE_OPS } },
    options: version === '25R2' ? MW_DEFINITION_TYPES_25R2 : MW_DEFINITION_TYPES_26R1,
    description: 'How the maintenance window is defined',
  };
}

export const maintenanceWindowFields: INodeProperties[] = [
  // Maintenance windows follow MaintenanceWindow / MaintenanceWindowForCreation: a definition
  // type plus intervals. They exist for endpoints and logical groups only.
  endpointLocator({
    show: {
      resource: ['maintenanceWindow'],
      operation: MW_ENDPOINT_OPS,
    },
  }),
  {
    displayName: 'Logical Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['maintenanceWindow'], operation: MW_GROUP_OPS } },
    description: 'The GUID of the logical group (maintenance windows exist for logical groups only)',
  },
  mwDefinitionType('25R2'),
  mwDefinitionType('26R1'),
  {
    displayName: 'Intervals',
    name: 'intervals',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    placeholder: 'Add Interval',
    default: {},
    displayOptions: {
      show: { resource: ['maintenanceWindow'], operation: MW_WRITE_OPS },
      hide: { maintenanceWindowDefinitionType: ['Unrestricted', 'Anytime', 'Never'] },
    },
    description: 'When maintenance is allowed. Times are HH:MM; use 24:00 for the end of the day.',
    options: [
      {
        displayName: 'Interval',
        name: 'interval',
        values: [
          {
            displayName: 'Period',
            name: 'maintenancePeriod',
            type: 'options',
            default: 'Everyday',
            options: [
              { name: 'Everyday', value: 'Everyday' },
              { name: 'Friday', value: 'Friday' },
              { name: 'Monday', value: 'Monday' },
              { name: 'Saturday', value: 'Saturday' },
              { name: 'Sunday', value: 'Sunday' },
              { name: 'Thursday', value: 'Thursday' },
              { name: 'Tuesday', value: 'Tuesday' },
              { name: 'Wednesday', value: 'Wednesday' },
              { name: 'Weekends', value: 'Weekends' },
              { name: 'Workdays', value: 'Workdays' },
            ],
            description: 'Everyday for "Everyday", Workdays/Weekends for "Workday / Weekend", a weekday for "Individual Weekday"',
          },
          { displayName: 'Start', name: 'start', type: 'string', default: '22:00', placeholder: 'HH:MM' },
          { displayName: 'End', name: 'end', type: 'string', default: '24:00', placeholder: 'HH:MM' },
        ],
      },
    ],
  },
];

// ============================================================
// Phase 14 — endpointType + getEndpointsByGroup + industrial fields
// (appended to endpointFields above; typedEndpointFields removed)
// ============================================================

// endpointType for get / getMany / delete (optional, defaults to 'all')
const ENDPOINT_TYPE_OPTIONS_ALL = [
  { name: 'All Platforms', value: 'all' },
  { name: 'Android', value: 'android' },
  { name: 'iOS', value: 'ios' },
  { name: 'Linux', value: 'linux' },
  { name: 'Mac', value: 'mac' },
  { name: 'Network', value: 'network' },
  { name: 'Windows', value: 'windows' },
];

// endpointType for update (required, no 'all')
const ENDPOINT_TYPE_OPTIONS_REQUIRED = [
  { name: 'Android', value: 'android' },
  { name: 'iOS', value: 'ios' },
  { name: 'Linux', value: 'linux' },
  { name: 'Mac', value: 'mac' },
  { name: 'Network', value: 'network' },
  { name: 'Windows', value: 'windows' },
];

export const endpointTypeFields: INodeProperties[] = [
  // endpointType for getMany
  {
    displayName: 'Platform Type',
    name: 'endpointType',
    type: 'options',
    default: 'all',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getMany', 'getEndpointsByGroup'] } },
    options: ENDPOINT_TYPE_OPTIONS_ALL,
    description: 'Filter by endpoint platform type. Select "All Platforms" to return all types.',
  },
  // endpointType for get / delete (optional)
  {
    displayName: 'Platform Type',
    name: 'endpointType',
    type: 'options',
    default: 'all',
    displayOptions: { show: { resource: ['endpoint'], operation: ['get', 'delete'] } },
    options: ENDPOINT_TYPE_OPTIONS_ALL,
    description: 'Optionally use the type-specific API path. "All Platforms" uses the generic endpoint.',
  },
  // endpointType for update (required, no 'all')
  {
    displayName: 'Platform Type',
    name: 'endpointType',
    type: 'options',
    required: true,
    default: 'windows',
    displayOptions: { show: { resource: ['endpoint'], operation: ['update'] } },
    options: ENDPOINT_TYPE_OPTIONS_REQUIRED,
    description: 'The platform type of the endpoint to update',
  },
  // endpointType for startEnrollment (optional)
  {
    displayName: 'Platform Type',
    name: 'endpointType',
    type: 'options',
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['startEnrollment'] } },
    options: [
      { name: 'Android', value: 'android' },
      { name: 'Auto-Detect (API Lookup)', value: '' },
      { name: 'iOS', value: 'ios' },
      { name: 'Mac', value: 'mac' },
      { name: 'Windows', value: 'windows' },
    ],
    description: 'Optionally specify the platform type to skip the auto-detect API call. Network and Linux do not support enrollment.',
  },

  // ----------------------------------
  // getEndpointsByGroup fields
  // ----------------------------------
  {
    displayName: 'Group Type',
    name: 'groupType',
    type: 'options',
    required: true,
    default: 'logical',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByGroup'] } },
    options: [
      { name: 'AD User', value: 'adUser' },
      { name: 'Dynamic Group', value: 'dynamic' },
      { name: 'Logical Group', value: 'logical' },
      { name: 'Static Group', value: 'static' },
      { name: 'Universal Dynamic Group (26R1)', value: 'udg' },
    ],
    description: 'The type of group to query',
  },
  {
    displayName: 'Group ID',
    name: 'typedGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByGroup'] } },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'The GUID of the group',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByGroup'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByGroup'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByGroup'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },

  // ----------------------------------
  // Industrial endpoint fields (25R2 only)
  // ----------------------------------
  {
    displayName: 'Industrial Endpoint ID',
    name: 'industrialEndpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getIndustrialEndpoint', 'updateIndustrialEndpoint', 'deleteIndustrialEndpoint'] } },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'The GUID of the industrial endpoint',
  },
  {
    displayName: 'Display Name',
    name: 'displayName',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['createIndustrialEndpoint'] } },
    description: 'Display name for the new industrial endpoint',
  },
  // IndustrialEndpointForCreation: primaryIP, port and snmpConfiguration are required
  {
    displayName: 'Primary IP',
    name: 'primaryIP',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['createIndustrialEndpoint'] } },
    description: 'Primary IP address of the industrial endpoint',
  },
  {
    displayName: 'Port',
    name: 'port',
    type: 'number',
    required: true,
    default: 161,
    displayOptions: { show: { resource: ['endpoint'], operation: ['createIndustrialEndpoint'] } },
    description: 'SNMP port of the industrial endpoint',
  },
  {
    displayName: 'SNMP Configuration (JSON)',
    name: 'snmpConfiguration',
    type: 'json',
    required: true,
    default: '{"version":"V2c","community":"public"}',
    displayOptions: { show: { resource: ['endpoint'], operation: ['createIndustrialEndpoint'] } },
    description:
      'SnmpConfigurationForCreation: version (V1, V2c, V3), community, username, authentication (None, MD5, SHA, SHA256, SHA384, SHA512), encryption (None, DES, AES, TDES, AES192, AES256), contextName, contextEngineId, authenticationPassword, encryptionPassword',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['createIndustrialEndpoint'] } },
    options: [
      { displayName: 'Comment', name: 'comment', type: 'string', default: '' },
      { displayName: 'Host Name', name: 'hostName', type: 'string', default: '' },
      { displayName: 'Primary MAC', name: 'primaryMAC', type: 'string', default: '' },
      { displayName: 'Logical Group ID', name: 'logicalGroupId', type: 'string', default: '' },
      { displayName: 'Web Interface URL', name: 'webInterfaceUrl', type: 'string', default: '' },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['updateIndustrialEndpoint'] } },
    options: [
      { displayName: 'Display Name', name: 'displayName', type: 'string', default: '' },
      { displayName: 'Primary IP', name: 'primaryIP', type: 'string', default: '' },
      { displayName: 'Primary MAC', name: 'primaryMAC', type: 'string', default: '' },
    ],
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getIndustrialEndpoints', 'getIndustrialEndpointsByGroup'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getIndustrialEndpoints', 'getIndustrialEndpointsByGroup'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['getIndustrialEndpoints', 'getIndustrialEndpointsByGroup'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
  {
    displayName: 'Group Type',
    name: 'industrialGroupType',
    type: 'options',
    required: true,
    default: 'logical',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getIndustrialEndpointsByGroup'] } },
    options: [
      { name: 'Logical Group', value: 'logical' },
      { name: 'Static Group', value: 'static' },
      { name: 'Universal Dynamic Group', value: 'udg' },
    ],
    description: 'The type of group to query',
  },
  {
    displayName: 'Group ID',
    name: 'industrialGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getIndustrialEndpointsByGroup'] } },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'The GUID of the group',
  },
];
