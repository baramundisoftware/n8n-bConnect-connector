import type { INodeProperties } from 'n8n-workflow';

export const serverManagementOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['serverManagement'],
      },
    },
    options: [
      {
        name: 'Cancel Scheduled Restart',
        value: 'cancelScheduledRestart',
        action: 'Cancel scheduled restart',
      },
      {
        name: 'Get API Keys',
        value: 'getApiKeys',
        description: 'Get all API keys (requires bMS 26R1+)',
        action: 'Get API keys',
      },
      {
        name: 'Get Cloud Connectors',
        value: 'getCloudConnectors',
        description: 'Get all cloud connectors',
        action: 'Get cloud connectors',
      },
      {
        name: 'Get DIP Status',
        value: 'getDipStatus',
        description: 'Get Distributed Installation Points status',
        action: 'Get DIP status',
      },
      {
        name: 'Get DIPs MSW Cleanup',
        value: 'getDipsMSWCleanup',
        description: 'Trigger DIPs MSW cleanup (requires bMS 26R1+)',
        action: 'Get DIPs MSW cleanup',
      },
      {
        name: 'Get Download Job',
        value: 'getDownloadJob',
        description: 'Get a download job by ID (requires bMS 26R1+)',
        action: 'Get download job',
      },
      {
        name: 'Get Download Jobs',
        value: 'getDownloadJobs',
        description: 'Get all download jobs (requires bMS 26R1+)',
        action: 'Get download jobs',
      },
      {
        name: 'Get Gateway',
        value: 'getGateway',
        description: 'Get gateway information',
        action: 'Get gateway',
      },
      {
        name: 'Get Management Server',
        value: 'getManagementServer',
        description: 'Get management server information',
        action: 'Get management server',
      },
      {
        name: 'Get PXE Relays',
        value: 'getPxeRelays',
        description: 'Get all PXE relays',
        action: 'Get PXE relays',
      },
      {
        name: 'Get VPN Appliance',
        value: 'getVpnAppliance',
        description: 'Get VPN appliance information',
        action: 'Get VPN appliance',
      },
      {
        name: 'Restart Management Server',
        value: 'restartManagementServer',
        description: 'Restart the baramundi Management Server',
        action: 'Restart management server',
      },
      {
        name: 'Simulate MSW Cleanup',
        value: 'simulateMSWCleanup',
        description: 'Simulate MSW cleanup (requires bMS 26R1+)',
        action: 'Simulate MSW cleanup',
      },
    ],
    default: 'getManagementServer',
  },
];

export const serverManagementFields: INodeProperties[] = [
  // ============================================================================
  // MICROSERVICES OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         serverManagement:getMicroservice
  // ----------------------------------
  {
    displayName: 'Microservice ID',
    name: 'microserviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['getMicroservice', 'startMicroservice', 'stopMicroservice', 'restartMicroservice'],
      },
    },
    description: 'The GUID of the microservice',
  },

  // ============================================================================
  // SECURITY GROUPS OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         serverManagement:getSecurityGroups
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['getSecurityGroups', 'getSecurityProfiles'],
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
        resource: ['serverManagement'],
        operation: ['getSecurityGroups', 'getSecurityProfiles'],
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
        resource: ['serverManagement'],
        operation: ['getSecurityGroups', 'getSecurityProfiles'],
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
  //         serverManagement:getSecurityGroup
  // ----------------------------------
  {
    displayName: 'Security Group ID',
    name: 'securityGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['getSecurityGroup', 'updateSecurityGroup', 'deleteSecurityGroup'],
      },
    },
    description: 'The GUID of the security group',
  },

  // ----------------------------------
  //         serverManagement:createSecurityGroup
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['createSecurityGroup'],
      },
    },
    description: 'The name of the security group',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['createSecurityGroup'],
      },
    },
    options: [
      {
        displayName: 'Security Profile IDs',
        name: 'profiles',
        type: 'string',
        default: '',
        description: 'Comma-separated GUIDs of the security profiles to assign',
      },
    ],
  },

  // ----------------------------------
  //         serverManagement:updateSecurityGroup
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['updateSecurityGroup'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the security group',
      },
    ],
  },

  // ============================================================================
  // SECURITY PROFILES OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         serverManagement:getSecurityProfile
  // ----------------------------------
  {
    displayName: 'Security Profile ID',
    name: 'securityProfileId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['getSecurityProfile', 'updateSecurityProfile', 'deleteSecurityProfile'],
      },
    },
    description: 'The GUID of the security profile',
  },

  // ----------------------------------
  //         serverManagement:createSecurityProfile
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['createSecurityProfile'],
      },
    },
    description: 'The name of the security profile (max 50 characters)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['createSecurityProfile'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the security profile (max 255 characters)',
      },
      {
        displayName: 'Display Administrator Identities',
        name: 'displayAdministratorIdentities',
        type: 'boolean',
        default: false,
        description: 'Whether the security profile can see administrative user names',
      },
      {
        displayName: 'Display Endpoint User Identities',
        name: 'displayEndpointUserIdentities',
        type: 'boolean',
        default: false,
        description: 'Whether the security profile can see end user names',
      },
    ],
  },

  // ----------------------------------
  //         serverManagement:updateSecurityProfile
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['updateSecurityProfile'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the security profile',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the security profile',
      },
      {
        displayName: 'Display Administrator Identities',
        name: 'displayAdministratorIdentities',
        type: 'boolean',
        default: false,
        description: 'Whether the security profile can see administrative user names',
      },
      {
        displayName: 'Display Endpoint User Identities',
        name: 'displayEndpointUserIdentities',
        type: 'boolean',
        default: false,
        description: 'Whether the security profile can see end user names',
      },
    ],
  },

  // ============================================================================
  // OBJECT PERMISSIONS OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         serverManagement:getAccessRights
  // ----------------------------------
  {
    displayName: 'Object ID',
    name: 'objectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['getAccessRights', 'updateObjectPermissions'],
      },
    },
    description: 'The GUID of the object',
  },

  // ----------------------------------
  //         serverManagement:updateObjectPermissions
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['updateObjectPermissions'],
      },
    },
    options: [
      {
        displayName: 'Inherit Rights',
        name: 'inheritRights',
        type: 'boolean',
        default: true,
        description: 'Whether the object inherits permissions from its parent',
      },
      {
        displayName: 'Security Profile Permissions',
        name: 'securityProfilePermissions',
        type: 'json',
        default: '[{"securityProfileId":"","permissions":["Read"]}]',
        description: 'JSON array replacing the object permissions: [{ "securityProfileId": "<GUID>", "permissions": ["Read", "Modify", "JobControl", …] }]',
      },
    ],
  },

  // ============================================================================
  // DOWNLOAD JOBS OPERATIONS (bMS 26R1+)
  // ============================================================================

  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['getDownloadJobs'],
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
        resource: ['serverManagement'],
        operation: ['getDownloadJobs'],
        bmsVersion: ['26R1'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Download Job ID',
    name: 'downloadJobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['serverManagement'],
        operation: ['getDownloadJob'],
        bmsVersion: ['26R1'],
      },
    },
    description: 'The GUID of the download job',
  },
];

// ============================================================================
// MICROSERVICE RESOURCE
// ============================================================================

export const microserviceOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['microservice'],
      },
    },
    options: [
      {
        name: 'Get Microservice',
        value: 'getMicroservice',
        description: 'Get a single microservice by ID',
        action: 'Get a microservice',
      },
      {
        name: 'Get Microservices',
        value: 'getMicroservices',
        description: 'Get all microservices',
        action: 'Get microservices',
      },
      {
        name: 'Restart Microservice',
        value: 'restartMicroservice',
        description: 'Restart a microservice',
        action: 'Restart microservice',
      },
      {
        name: 'Start Microservice',
        value: 'startMicroservice',
        description: 'Start a microservice',
        action: 'Start microservice',
      },
      {
        name: 'Stop Microservice',
        value: 'stopMicroservice',
        description: 'Stop a microservice',
        action: 'Stop microservice',
      },
    ],
    default: 'getMicroservices',
  },
];

export const microserviceFields: INodeProperties[] = [
  {
    displayName: 'Microservice ID',
    name: 'microserviceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['microservice'],
        operation: ['getMicroservice', 'startMicroservice', 'stopMicroservice', 'restartMicroservice'],
      },
    },
    description: 'The GUID of the microservice',
  },
];

// ============================================================================
// BMSECURITY RESOURCE
// ============================================================================

export const bmsecurityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
      },
    },
    options: [
      {
        name: 'Create Security Group',
        value: 'createSecurityGroup',
        description: 'Create a new security group',
        action: 'Create a security group',
      },
      {
        name: 'Create Security Profile',
        value: 'createSecurityProfile',
        description: 'Create a new security profile',
        action: 'Create a security profile',
      },
      {
        name: 'Delete Security Group',
        value: 'deleteSecurityGroup',
        description: 'Delete a security group',
        action: 'Delete a security group',
      },
      {
        name: 'Delete Security Profile',
        value: 'deleteSecurityProfile',
        description: 'Delete a security profile',
        action: 'Delete a security profile',
      },
      {
        name: 'Get Access Rights',
        value: 'getAccessRights',
        description: 'Get access rights for an object',
        action: 'Get access rights',
      },
      {
        name: 'Get Security Group',
        value: 'getSecurityGroup',
        description: 'Get a single security group by ID',
        action: 'Get a security group',
      },
      {
        name: 'Get Security Groups',
        value: 'getSecurityGroups',
        description: 'Get many security groups',
        action: 'Get security groups',
      },
      {
        name: 'Get Security Profile',
        value: 'getSecurityProfile',
        description: 'Get a single security profile by ID',
        action: 'Get a security profile',
      },
      {
        name: 'Get Security Profiles',
        value: 'getSecurityProfiles',
        description: 'Get many security profiles',
        action: 'Get security profiles',
      },
      {
        name: 'Update Object Permissions',
        value: 'updateObjectPermissions',
        description: 'Update permissions for an object',
        action: 'Update object permissions',
      },
      {
        name: 'Update Security Group',
        value: 'updateSecurityGroup',
        description: 'Update a security group',
        action: 'Update a security group',
      },
      {
        name: 'Update Security Profile',
        value: 'updateSecurityProfile',
        description: 'Update a security profile',
        action: 'Update a security profile',
      },
    ],
    default: 'getSecurityGroups',
  },
];

export const bmsecurityFields: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
        operation: ['getSecurityGroups', 'getSecurityProfiles'],
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
        resource: ['bmsecurity'],
        operation: ['getSecurityGroups', 'getSecurityProfiles'],
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
        resource: ['bmsecurity'],
        operation: ['getSecurityGroups', 'getSecurityProfiles'],
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
  {
    displayName: 'Security Group ID',
    name: 'securityGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
        operation: ['getSecurityGroup', 'updateSecurityGroup', 'deleteSecurityGroup'],
      },
    },
    description: 'The GUID of the security group',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
        operation: ['createSecurityGroup'],
      },
    },
    description: 'The name of the security group',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
        operation: ['createSecurityGroup'],
      },
    },
    options: [
      {
        displayName: 'Security Profile IDs',
        name: 'profiles',
        type: 'string',
        default: '',
        description: 'Comma-separated GUIDs of the security profiles to assign',
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
        resource: ['bmsecurity'],
        operation: ['updateSecurityGroup'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the security group',
      },
    ],
  },
  {
    displayName: 'Security Profile ID',
    name: 'securityProfileId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
        operation: ['getSecurityProfile', 'updateSecurityProfile', 'deleteSecurityProfile'],
      },
    },
    description: 'The GUID of the security profile',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
        operation: ['createSecurityProfile'],
      },
    },
    description: 'The name of the security profile (max 50 characters)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
        operation: ['createSecurityProfile'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the security profile (max 255 characters)',
      },
      {
        displayName: 'Display Administrator Identities',
        name: 'displayAdministratorIdentities',
        type: 'boolean',
        default: false,
        description: 'Whether the security profile can see administrative user names',
      },
      {
        displayName: 'Display Endpoint User Identities',
        name: 'displayEndpointUserIdentities',
        type: 'boolean',
        default: false,
        description: 'Whether the security profile can see end user names',
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
        resource: ['bmsecurity'],
        operation: ['updateSecurityProfile'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the security profile',
      },
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Comment for the security profile',
      },
      {
        displayName: 'Display Administrator Identities',
        name: 'displayAdministratorIdentities',
        type: 'boolean',
        default: false,
        description: 'Whether the security profile can see administrative user names',
      },
      {
        displayName: 'Display Endpoint User Identities',
        name: 'displayEndpointUserIdentities',
        type: 'boolean',
        default: false,
        description: 'Whether the security profile can see end user names',
      },
    ],
  },
  {
    displayName: 'Object ID',
    name: 'objectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
        operation: ['getAccessRights', 'updateObjectPermissions'],
      },
    },
    description: 'The GUID of the object',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['bmsecurity'],
        operation: ['updateObjectPermissions'],
      },
    },
    options: [
      {
        displayName: 'Inherit Rights',
        name: 'inheritRights',
        type: 'boolean',
        default: true,
        description: 'Whether the object inherits permissions from its parent',
      },
      {
        displayName: 'Security Profile Permissions',
        name: 'securityProfilePermissions',
        type: 'json',
        default: '[{"securityProfileId":"","permissions":["Read"]}]',
        description: 'JSON array replacing the object permissions: [{ "securityProfileId": "<GUID>", "permissions": ["Read", "Modify", "JobControl", …] }]',
      },
    ],
  },
];
