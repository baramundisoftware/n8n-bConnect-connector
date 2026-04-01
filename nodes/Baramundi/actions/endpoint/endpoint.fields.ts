import type { INodeProperties } from 'n8n-workflow';

// Common operation options available in both 25R2 and 26R1
const COMMON_ENDPOINT_OPTIONS = [
  { name: 'Create', value: 'create', description: 'Create a new Windows endpoint', action: 'Create a Windows endpoint' },
  { name: 'Delete', value: 'delete', description: 'Delete an endpoint', action: 'Delete an endpoint' },
  { name: 'Get', value: 'get', description: 'Get an endpoint by ID', action: 'Get an endpoint' },
  { name: 'Get Many', value: 'getMany', description: 'Get many endpoints', action: 'Get many endpoints' },
  { name: 'Search', value: 'search', description: 'Search endpoints by name or other criteria', action: 'Search endpoints' },
  { name: 'Start Enrollment', value: 'startEnrollment', description: 'Start enrollment process for an endpoint', action: 'Start enrollment for endpoint' },
  { name: 'Trigger Intune Installation', value: 'triggerIntuneInstallation', description: 'Trigger installation of baramundi Management Agent via Intune', action: 'Trigger Intune installation' },
  { name: 'Update', value: 'update', description: 'Update an endpoint', action: 'Update an endpoint' },
  // Logical Group Operations
  { name: 'Get Logical Group', value: 'getLogicalGroup', description: 'Get a logical group by ID', action: 'Get a logical group' },
  { name: 'Get Logical Groups', value: 'getLogicalGroups', description: 'Get many logical groups', action: 'Get many logical groups' },
  { name: 'Create Logical Group', value: 'createLogicalGroup', description: 'Create a new logical group', action: 'Create a logical group' },
  { name: 'Update Logical Group', value: 'updateLogicalGroup', description: 'Update a logical group', action: 'Update a logical group' },
  { name: 'Delete Logical Group', value: 'deleteLogicalGroup', description: 'Delete a logical group', action: 'Delete a logical group' },
  // Static Group Operations
  { name: 'Get Static Group', value: 'getStaticGroup', description: 'Get a static group by ID', action: 'Get a static group' },
  { name: 'Get Static Groups', value: 'getStaticGroups', description: 'Get many static groups', action: 'Get many static groups' },
  { name: 'Create Static Group', value: 'createStaticGroup', description: 'Create a new static group', action: 'Create a static group' },
  { name: 'Update Static Group', value: 'updateStaticGroup', description: 'Update a static group', action: 'Update a static group' },
  { name: 'Delete Static Group', value: 'deleteStaticGroup', description: 'Delete a static group', action: 'Delete a static group' },
  // Dynamic Group Operations (Read-only)
  { name: 'Get Dynamic Group', value: 'getDynamicGroup', description: 'Get a dynamic group by ID', action: 'Get a dynamic group' },
  { name: 'Get Dynamic Groups', value: 'getDynamicGroups', description: 'Get many dynamic groups', action: 'Get many dynamic groups' },
  // Maintenance Window — common create/delete/get
  { name: 'Create Endpoint Maintenance Window', value: 'createEndpointMaintenanceWindow', description: 'Create a maintenance window for an endpoint', action: 'Create endpoint maintenance window' },
  { name: 'Delete Endpoint Maintenance Window', value: 'deleteEndpointMaintenanceWindow', description: 'Delete a maintenance window for an endpoint', action: 'Delete endpoint maintenance window' },
  { name: 'Get Endpoint Maintenance Window', value: 'getEndpointMaintenanceWindow', description: 'Get the maintenance window for an endpoint', action: 'Get endpoint maintenance window' },
  { name: 'Create Group Maintenance Window', value: 'createGroupMaintenanceWindow', description: 'Create a maintenance window for a group', action: 'Create group maintenance window' },
  { name: 'Delete Group Maintenance Window', value: 'deleteGroupMaintenanceWindow', description: 'Delete a maintenance window for a group', action: 'Delete group maintenance window' },
  { name: 'Get Group Maintenance Window', value: 'getGroupMaintenanceWindow', description: 'Get the maintenance window for a logical group', action: 'Get group maintenance window' },
  // Sub-group / Endpoints by group queries
  { name: 'Get Logical Group Sub-Groups', value: 'getLogicalGroupSubGroups', description: 'Get sub-groups of a logical group', action: 'Get logical group sub-groups' },
  { name: 'Get Endpoints by Logical Group', value: 'getEndpointsByLogicalGroup', description: 'Get endpoints in a logical group', action: 'Get endpoints by logical group' },
  { name: 'Get Endpoints by Static Group', value: 'getEndpointsByStaticGroup', description: 'Get endpoints in a static group', action: 'Get endpoints by static group' },
  { name: 'Get Endpoints by Dynamic Group', value: 'getEndpointsByDynamicGroup', description: 'Get endpoints in a dynamic group', action: 'Get endpoints by dynamic group' },
  { name: 'Get Endpoints by AD User', value: 'getEndpointsByADUser', description: 'Get endpoints assigned to an AD user', action: 'Get endpoints by AD user' },
  // Type-specific operations (Phase 9)
  { name: 'Get Many (By Platform Type)', value: 'getTypedEndpoints', description: 'Get many endpoints filtered by platform type (Windows/Android/iOS/Linux/Mac/Network)', action: 'Get many typed endpoints' },
  { name: 'Get (By Platform Type)', value: 'getTypedEndpoint', description: 'Get a single endpoint by ID and platform type', action: 'Get typed endpoint' },
  { name: 'Update (By Platform Type)', value: 'updateTypedEndpoint', description: 'Update an endpoint using its type-specific API path', action: 'Update typed endpoint' },
  { name: 'Delete (By Platform Type)', value: 'deleteTypedEndpoint', description: 'Delete an endpoint using its type-specific API path', action: 'Delete typed endpoint' },
  { name: 'Start Enrollment (By Platform Type)', value: 'startTypedEnrollment', description: 'Start enrollment for Windows, Android, iOS, or Mac endpoint', action: 'Start typed enrollment' },
  { name: 'Get Typed Endpoints By Group', value: 'getTypedEndpointsByGroup', description: 'Get endpoints of a specific platform type in a group', action: 'Get typed endpoints by group' },
];

/** Operations shown when bmsVersion = 25R2 */
export const endpointOperations25R2: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['endpoint'], bmsVersion: ['25R2'] } },
    options: [
      ...COMMON_ENDPOINT_OPTIONS,
      // Maintenance Window — PUT (25R2 only, replaced by PATCH in 26R1)
      { name: 'Replace Endpoint Maintenance Window (PUT)', value: 'putEndpointMaintenanceWindow', description: 'Replace a maintenance window for an endpoint with a full body (bMS 25R2)', action: 'Replace endpoint maintenance window' },
      { name: 'Replace Group Maintenance Window (PUT)', value: 'putGroupMaintenanceWindow', description: 'Replace a maintenance window for a group with a full body (bMS 25R2)', action: 'Replace group maintenance window' },
      // Industrial endpoints (25R2 only — removed in 26R1)
      { name: 'Get Industrial Endpoints', value: 'getIndustrialEndpoints', description: 'Get all industrial endpoints (bMS 25R2 only)', action: 'Get industrial endpoints' },
      { name: 'Get Industrial Endpoint', value: 'getIndustrialEndpoint', description: 'Get an industrial endpoint by ID (bMS 25R2 only)', action: 'Get industrial endpoint' },
      { name: 'Create Industrial Endpoint', value: 'createIndustrialEndpoint', description: 'Create a new industrial endpoint (bMS 25R2 only)', action: 'Create industrial endpoint' },
      { name: 'Update Industrial Endpoint', value: 'updateIndustrialEndpoint', description: 'Update an industrial endpoint (bMS 25R2 only)', action: 'Update industrial endpoint' },
      { name: 'Delete Industrial Endpoint', value: 'deleteIndustrialEndpoint', description: 'Delete an industrial endpoint (bMS 25R2 only)', action: 'Delete industrial endpoint' },
      { name: 'Get Industrial Endpoints By Group', value: 'getIndustrialEndpointsByGroup', description: 'Get industrial endpoints in a logical group, static group, or UDG (bMS 25R2 only)', action: 'Get industrial endpoints by group' },
    ],
    // eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options -- 'getMany' is in COMMON_ENDPOINT_OPTIONS spread; ESLint cannot resolve spread
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
      ...COMMON_ENDPOINT_OPTIONS,
      // Maintenance Window — PATCH (26R1+)
      { name: 'Update Endpoint Maintenance Window (PATCH)', value: 'updateEndpointMaintenanceWindow', description: 'Update a maintenance window for an endpoint using JSON Patch (bMS 26R1+)', action: 'Update endpoint maintenance window' },
      { name: 'Update Group Maintenance Window (PATCH)', value: 'updateGroupMaintenanceWindow', description: 'Update a maintenance window for a group using JSON Patch (bMS 26R1+)', action: 'Update group maintenance window' },
      // EntraId Operations (26R1+)
      { name: 'Set Entra ID Data', value: 'setEntraIdData', description: 'Create or update Entra ID data for an endpoint (bMS 26R1+)', action: 'Set Entra ID data for endpoint' },
      { name: 'Delete Entra ID Data', value: 'deleteEntraIdData', description: 'Delete Entra ID data for an endpoint (bMS 26R1+)', action: 'Delete Entra ID data for endpoint' },
      { name: 'Get Entra ID Data By Device ID', value: 'getEntraIdDataByDeviceId', description: 'Get Entra ID endpoint data by Entra ID device ID (bMS 26R1+)', action: 'Get Entra ID data by device ID' },
      // UnmanagedEndpoints Operations (26R1+)
      { name: 'Get Unmanaged Endpoints', value: 'getUnmanagedEndpoints', description: 'Get all unmanaged endpoints (bMS 26R1+)', action: 'Get unmanaged endpoints' },
      { name: 'Get Unmanaged Endpoint', value: 'getUnmanagedEndpoint', description: 'Get an unmanaged endpoint by ID (bMS 26R1+)', action: 'Get unmanaged endpoint' },
      { name: 'Delete Unmanaged Endpoint', value: 'deleteUnmanagedEndpoint', description: 'Delete an unmanaged endpoint by ID (bMS 26R1+)', action: 'Delete unmanaged endpoint' },
      { name: 'Get Endpoints by UDG', value: 'getEndpointsByUDG', description: 'Get endpoints in a Universal Dynamic Group (bMS 26R1+)', action: 'Get endpoints by UDG' },
    ],
    // eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-options -- 'getMany' is in COMMON_ENDPOINT_OPTIONS spread; ESLint cannot resolve spread
    default: 'getMany',
  },
];

/** @deprecated Use endpointOperations25R2 and endpointOperations26R1 instead */
export const endpointOperations: INodeProperties[] = [...endpointOperations25R2, ...endpointOperations26R1];

export const endpointFields: INodeProperties[] = [
  // ----------------------------------
  //         endpoint:get, endpoint:delete
  // ----------------------------------
  {
    displayName: 'Endpoint Name or ID',
    name: 'endpointSelection',
    type: 'options',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['get', 'delete'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getEndpoints',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['get', 'delete'],
        endpointSelection: ['__custom__'],
      },
    },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'Enter the endpoint GUID manually',
  },

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
        displayName: 'Organizational Unit ID',
        name: 'orgUnitId',
        type: 'string',
        default: '',
        description: 'Filter endpoints by organizational unit GUID',
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
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['create'],
        endpointType: ['windows', 'linux'],
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
        description: 'The name of the domain the client is joined to (Windows only)',
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
        description: 'Primary subnet mask (Windows only)',
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
        description: 'The UUID of the endpoint (Windows only)',
      },
    ],
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
        endpointType: ['mac', 'android', 'ios'],
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
        description: 'Host name of the endpoint (optional for Mac)',
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
        default: 'Corporate',
        options: [
          { name: 'Corporate', value: 'Corporate' },
          { name: 'Personal', value: 'Personal' },
        ],
        description: 'Owner type of the device',
      },
      {
        displayName: 'Registered User',
        name: 'registeredUser',
        type: 'string',
        default: '',
        description: 'Registered user of the endpoint',
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
  //         endpoint:update
  // ----------------------------------
  {
    displayName: 'Endpoint Name or ID',
    name: 'endpointSelection',
    type: 'options',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['update'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getEndpoints',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['update'],
        endpointSelection: ['__custom__'],
      },
    },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'Enter the endpoint GUID manually',
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
        displayName: 'Domain',
        name: 'domain',
        type: 'string',
        default: '',
        description: 'Domain name',
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
  {
    displayName: 'Endpoint Name or ID',
    name: 'endpointSelection',
    type: 'options',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['startEnrollment'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getEndpoints',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['startEnrollment'],
        endpointSelection: ['__custom__'],
      },
    },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'Enter the endpoint GUID manually',
  },
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
        displayName: 'Email Recipient',
        name: 'emailRecipient',
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
  {
    displayName: 'Endpoint Name or ID',
    name: 'endpointSelection',
    type: 'options',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['triggerIntuneInstallation'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getEndpoints',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['triggerIntuneInstallation'],
        endpointSelection: ['__custom__'],
      },
    },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'Enter the endpoint GUID manually',
  },

  // ----------------------------------
  //         endpoint: Group ID field (all group operations)
  // ----------------------------------
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['getLogicalGroup', 'updateLogicalGroup', 'deleteLogicalGroup', 'getStaticGroup', 'updateStaticGroup', 'deleteStaticGroup', 'getDynamicGroup'],
      },
    },
    description: 'The GUID of the group',
  },

  // ----------------------------------
  //         endpoint:getLogicalGroups, getStaticGroups, getDynamicGroups
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['getLogicalGroups', 'getStaticGroups', 'getDynamicGroups'],
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
        operation: ['getLogicalGroups', 'getStaticGroups', 'getDynamicGroups'],
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
        operation: ['getLogicalGroups', 'getStaticGroups', 'getDynamicGroups'],
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
  //         endpoint:createLogicalGroup, createStaticGroup
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['createLogicalGroup', 'createStaticGroup'],
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
        resource: ['endpoint'],
        operation: ['createLogicalGroup', 'createStaticGroup'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the group',
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
  //         endpoint:updateLogicalGroup, updateStaticGroup
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['updateLogicalGroup', 'updateStaticGroup'],
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
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the group',
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
  //         endpoint:createEndpointMaintenanceWindow, updateEndpointMaintenanceWindow, deleteEndpointMaintenanceWindow
  // ----------------------------------
  {
    displayName: 'Endpoint Name or ID',
    name: 'endpointSelection',
    type: 'options',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['createEndpointMaintenanceWindow', 'updateEndpointMaintenanceWindow', 'deleteEndpointMaintenanceWindow', 'putEndpointMaintenanceWindow'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getEndpoints',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['createEndpointMaintenanceWindow', 'updateEndpointMaintenanceWindow', 'deleteEndpointMaintenanceWindow', 'putEndpointMaintenanceWindow'],
        endpointSelection: ['__custom__'],
      },
    },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'Enter the endpoint GUID manually',
  },
  {
    displayName: 'Window ID',
    name: 'windowId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['updateEndpointMaintenanceWindow', 'deleteEndpointMaintenanceWindow', 'putEndpointMaintenanceWindow'],
      },
    },
    description: 'The GUID of the maintenance window',
  },
  {
    displayName: 'Maintenance Window (JSON)',
    name: 'maintenanceWindowJson',
    type: 'json',
    required: true,
    default: '{"maintenanceWindowDefinitionType":"daily","intervals":[]}',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['putEndpointMaintenanceWindow'],
        bmsVersion: ['25R2'],
      },
    },
    description: 'Full MaintenanceWindow JSON body for PUT replacement (bMS 25R2). See API docs for schema.',
  },
  {
    displayName: 'Start Time',
    name: 'startTime',
    type: 'string',
    required: true,
    default: '',
    placeholder: '2026-01-20T08:00:00Z',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['createEndpointMaintenanceWindow'],
      },
    },
    description: 'Start time of the maintenance window (ISO 8601 format)',
  },
  {
    displayName: 'End Time',
    name: 'endTime',
    type: 'string',
    required: true,
    default: '',
    placeholder: '2026-01-20T18:00:00Z',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['createEndpointMaintenanceWindow'],
      },
    },
    description: 'End time of the maintenance window (ISO 8601 format)',
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
        operation: ['createEndpointMaintenanceWindow'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the maintenance window',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the maintenance window',
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
        operation: ['updateEndpointMaintenanceWindow'],
        bmsVersion: ['26R1'],
      },
    },
    options: [
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'string',
        default: '',
        placeholder: '2026-01-20T08:00:00Z',
        description: 'Start time of the maintenance window (ISO 8601 format)',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'string',
        default: '',
        placeholder: '2026-01-20T18:00:00Z',
        description: 'End time of the maintenance window (ISO 8601 format)',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the maintenance window',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the maintenance window',
      },
    ],
  },

  // ----------------------------------
  //         endpoint:createGroupMaintenanceWindow, updateGroupMaintenanceWindow, deleteGroupMaintenanceWindow
  // ----------------------------------
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['createGroupMaintenanceWindow', 'updateGroupMaintenanceWindow', 'deleteGroupMaintenanceWindow', 'putGroupMaintenanceWindow'],
      },
    },
    description: 'The GUID of the group',
  },
  {
    displayName: 'Group Type',
    name: 'groupType',
    type: 'options',
    required: true,
    default: 'logical',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['createGroupMaintenanceWindow', 'updateGroupMaintenanceWindow', 'deleteGroupMaintenanceWindow', 'putGroupMaintenanceWindow'],
      },
    },
    options: [
      { name: 'Logical', value: 'logical' },
      { name: 'Static', value: 'static' },
      { name: 'Dynamic', value: 'dynamic' },
    ],
    description: 'Type of the group',
  },
  {
    displayName: 'Window ID',
    name: 'windowId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['updateGroupMaintenanceWindow', 'deleteGroupMaintenanceWindow', 'putGroupMaintenanceWindow'],
      },
    },
    description: 'The GUID of the maintenance window',
  },
  {
    displayName: 'Maintenance Window (JSON)',
    name: 'maintenanceWindowJson',
    type: 'json',
    required: true,
    default: '{"maintenanceWindowDefinitionType":"daily","intervals":[]}',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['putGroupMaintenanceWindow'],
        bmsVersion: ['25R2'],
      },
    },
    description: 'Full MaintenanceWindow JSON body for PUT replacement (bMS 25R2). See API docs for schema.',
  },
  {
    displayName: 'Start Time',
    name: 'startTime',
    type: 'string',
    required: true,
    default: '',
    placeholder: '2026-01-20T08:00:00Z',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['createGroupMaintenanceWindow'],
      },
    },
    description: 'Start time of the maintenance window (ISO 8601 format)',
  },
  {
    displayName: 'End Time',
    name: 'endTime',
    type: 'string',
    required: true,
    default: '',
    placeholder: '2026-01-20T18:00:00Z',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['createGroupMaintenanceWindow'],
      },
    },
    description: 'End time of the maintenance window (ISO 8601 format)',
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
        operation: ['createGroupMaintenanceWindow'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the maintenance window',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the maintenance window',
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
        operation: ['updateGroupMaintenanceWindow'],
        bmsVersion: ['26R1'],
      },
    },
    options: [
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'string',
        default: '',
        placeholder: '2026-01-20T08:00:00Z',
        description: 'Start time of the maintenance window (ISO 8601 format)',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'string',
        default: '',
        placeholder: '2026-01-20T18:00:00Z',
        description: 'End time of the maintenance window (ISO 8601 format)',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the maintenance window',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the maintenance window',
      },
    ],
  },

  // ----------------------------------
  //         EntraId operations (26R1+)
  // ----------------------------------
  {
    displayName: 'Endpoint Name or ID',
    name: 'endpointSelection',
    type: 'options',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['setEntraIdData', 'deleteEntraIdData'],
        bmsVersion: ['26R1'],
      },
    },
    typeOptions: {
      loadOptionsMethod: 'getEndpoints',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['endpoint'],
        operation: ['setEntraIdData', 'deleteEntraIdData'],
        bmsVersion: ['26R1'],
        endpointSelection: ['__custom__'],
      },
    },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'Enter the endpoint GUID manually',
  },
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
  //         UnmanagedEndpoints operations (26R1+)
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
  //  Phase 8C — new field params
  // ----------------------------------
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointMaintenanceWindow'] } },
    description: 'The GUID of the endpoint',
  },
  {
    displayName: 'Logical Group ID',
    name: 'logicalGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getGroupMaintenanceWindow', 'getLogicalGroupSubGroups', 'getEndpointsByLogicalGroup'] } },
    description: 'The GUID of the logical group',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getLogicalGroupSubGroups', 'getEndpointsByLogicalGroup', 'getEndpointsByStaticGroup', 'getEndpointsByDynamicGroup', 'getEndpointsByADUser', 'getEndpointsByUDG'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getLogicalGroupSubGroups', 'getEndpointsByLogicalGroup', 'getEndpointsByStaticGroup', 'getEndpointsByDynamicGroup', 'getEndpointsByADUser', 'getEndpointsByUDG'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['getLogicalGroupSubGroups', 'getEndpointsByLogicalGroup', 'getEndpointsByStaticGroup', 'getEndpointsByDynamicGroup', 'getEndpointsByADUser', 'getEndpointsByUDG'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
  {
    displayName: 'Static Group ID',
    name: 'staticGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByStaticGroup'] } },
    description: 'The GUID of the static group',
  },
  {
    displayName: 'Dynamic Group ID',
    name: 'dynamicGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByDynamicGroup'] } },
    description: 'The GUID of the dynamic group',
  },
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
    displayName: 'Universal Dynamic Group ID',
    name: 'udgId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getEndpointsByUDG'], bmsVersion: ['26R1'] } },
    description: 'The GUID of the Universal Dynamic Group (bMS 26R1+)',
  },

  // ----------------------------------
  //  Phase 9: Type-specific operations
  // ----------------------------------
  {
    displayName: 'Platform Type',
    name: 'platformType',
    type: 'options',
    required: true,
    default: 'windows',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getTypedEndpoints', 'getTypedEndpoint', 'updateTypedEndpoint', 'deleteTypedEndpoint', 'startTypedEnrollment', 'getTypedEndpointsByGroup'] } },
    options: [
      { name: 'Android', value: 'android' },
      { name: 'iOS', value: 'ios' },
      { name: 'Linux', value: 'linux' },
      { name: 'Mac', value: 'mac' },
      { name: 'Network', value: 'network' },
      { name: 'Windows', value: 'windows' },
    ],
    description: 'The endpoint platform type',
  },
  {
    displayName: 'Endpoint ID',
    name: 'typedEndpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getTypedEndpoint', 'updateTypedEndpoint', 'deleteTypedEndpoint', 'startTypedEnrollment'] } },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'The GUID of the endpoint',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getTypedEndpoints', 'getTypedEndpointsByGroup'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['endpoint'], operation: ['getTypedEndpoints', 'getTypedEndpointsByGroup'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['getTypedEndpoints', 'getTypedEndpointsByGroup'] } },
    options: [
      { displayName: 'Search Query', name: 'searchQuery', type: 'string', default: '', description: 'Filter results by name' },
      { displayName: 'Order By', name: 'orderBy', type: 'string', default: '', placeholder: 'Name asc', description: 'Sort order' },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['updateTypedEndpoint'] } },
    options: [
      { displayName: 'Display Name', name: 'displayName', type: 'string', default: '' },
      { displayName: 'Primary IP', name: 'primaryIP', type: 'string', default: '' },
      { displayName: 'Primary MAC', name: 'primaryMAC', type: 'string', default: '' },
      { displayName: 'Logical Group ID', name: 'logicalGroupId', type: 'string', default: '' },
    ],
  },
  {
    displayName: 'Enrollment Options',
    name: 'enrollmentOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['startTypedEnrollment'] } },
    options: [
      { displayName: 'Email Recipient', name: 'emailRecipient', type: 'string', default: '', description: 'Email address to send enrollment instructions to' },
      { displayName: 'Email Language ID', name: 'emailLanguageId', type: 'string', default: '', description: 'Language ID for the enrollment email' },
    ],
  },
  {
    displayName: 'Group Type',
    name: 'groupType',
    type: 'options',
    required: true,
    default: 'logical',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getTypedEndpointsByGroup'] } },
    options: [
      { name: 'AD User', value: 'adUser', description: 'Get typed endpoints assigned to an AD user' },
      { name: 'Dynamic Group', value: 'dynamic', description: 'Windows endpoints only — /DynamicGroups/{id}/{Type}Endpoints' },
      { name: 'Logical Group', value: 'logical' },
      { name: 'Static Group', value: 'static' },
      { name: 'Universal Dynamic Group (26R1)', value: 'udg', description: 'Available in bMS 26R1 only for non-industrial types' },
    ],
    description: 'The type of group to query',
  },
  {
    displayName: 'Group ID',
    name: 'typedGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['endpoint'], operation: ['getTypedEndpointsByGroup'] } },
    placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    description: 'The GUID of the group',
  },

  // ----------------------------------
  //  Phase 9: Industrial endpoint fields (25R2 only)
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
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['endpoint'], operation: ['createIndustrialEndpoint'] } },
    options: [
      { displayName: 'Primary IP', name: 'primaryIP', type: 'string', default: '' },
      { displayName: 'Primary MAC', name: 'primaryMAC', type: 'string', default: '' },
      { displayName: 'Logical Group ID', name: 'logicalGroupId', type: 'string', default: '' },
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
