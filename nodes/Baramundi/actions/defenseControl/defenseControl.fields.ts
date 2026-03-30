import type { INodeProperties } from 'n8n-workflow';

export const defenseControlOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['defenseControl'],
      },
    },
    options: [
      {
        name: 'Get BitLocker Endpoints',
        value: 'getBitLockerWindowsEndpoints',
        description: 'Get many BitLocker endpoints',
        action: 'Get BitLocker endpoints',
      },
      {
        name: 'Get BitLocker Endpoint',
        value: 'getBitLockerWindowsEndpoint',
        description: 'Get a single BitLocker endpoint by ID',
        action: 'Get a BitLocker endpoint',
      },
      {
        name: 'Get Local Admin Accounts',
        value: 'getLocalAdministrativeAccounts',
        description: 'Get local administrative accounts for an endpoint',
        action: 'Get local admin accounts',
      },
      {
        name: 'Trigger Local Admin Update',
        value: 'triggerLocalAdminAccountsUpdate',
        description: 'Trigger update on client',
        action: 'Trigger local admin update',
      },
      {
        name: 'Patch Local Admin Credentials',
        value: 'patchLocalAdminUserCredentials',
        description: 'Update local admin credentials',
        action: 'Patch local admin credentials',
      },
      {
        name: 'Get Defender Threats',
        value: 'getMicrosoftDefenderThreats',
        description: 'Get many Microsoft Defender threats',
        action: 'Get Defender threats',
      },
      {
        name: 'Get Defender Threat',
        value: 'getMicrosoftDefenderThreat',
        description: 'Get a single threat by ID',
        action: 'Get a Defender threat',
      },
      {
        name: 'Get Threats by Endpoint',
        value: 'getMicrosoftDefenderThreatsByEndpoint',
        description: 'Get threats for a specific endpoint',
        action: 'Get threats by endpoint',
      },
      {
        name: 'Get Threats by Logical Group',
        value: 'getMicrosoftDefenderThreatsByLogicalGroup',
        description: 'Get threats for a logical group',
        action: 'Get threats by logical group',
      },
      {
        name: 'Get Defender Endpoints',
        value: 'getMicrosoftDefenderWindowsEndpoints',
        description: 'Get many Defender endpoints',
        action: 'Get Defender endpoints',
      },
      {
        name: 'Get Defender Endpoint',
        value: 'getMicrosoftDefenderWindowsEndpoint',
        description: 'Get a single Defender endpoint by ID',
        action: 'Get a Defender endpoint',
      },
    ],
    default: 'getBitLockerWindowsEndpoints',
  },
];

export const defenseControlFields: INodeProperties[] = [
  // ============================================================================
  // BITLOCKER OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         defenseControl:getBitLockerWindowsEndpoints
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['defenseControl'],
        operation: [
          'getBitLockerWindowsEndpoints',
          'getMicrosoftDefenderThreats',
          'getMicrosoftDefenderThreatsByEndpoint',
          'getMicrosoftDefenderThreatsByLogicalGroup',
          'getMicrosoftDefenderWindowsEndpoints',
        ],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
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
        resource: ['defenseControl'],
        operation: [
          'getBitLockerWindowsEndpoints',
          'getMicrosoftDefenderThreats',
          'getMicrosoftDefenderThreatsByEndpoint',
          'getMicrosoftDefenderThreatsByLogicalGroup',
          'getMicrosoftDefenderWindowsEndpoints',
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
        resource: ['defenseControl'],
        operation: [
          'getBitLockerWindowsEndpoints',
          'getMicrosoftDefenderThreats',
          'getMicrosoftDefenderThreatsByEndpoint',
          'getMicrosoftDefenderThreatsByLogicalGroup',
          'getMicrosoftDefenderWindowsEndpoints',
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
  //         defenseControl:getBitLockerWindowsEndpoint
  // ----------------------------------
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['defenseControl'],
        operation: [
          'getBitLockerWindowsEndpoint',
          'getLocalAdministrativeAccounts',
          'triggerLocalAdminAccountsUpdate',
          'patchLocalAdminUserCredentials',
          'getMicrosoftDefenderThreatsByEndpoint',
          'getMicrosoftDefenderWindowsEndpoint',
        ],
      },
    },
    description: 'The GUID of the endpoint',
  },

  // ============================================================================
  // LOCAL ADMIN ACCOUNTS OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         defenseControl:patchLocalAdminUserCredentials
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['defenseControl'],
        operation: ['patchLocalAdminUserCredentials'],
      },
    },
    options: [
      {
        displayName: 'Expiry Date',
        name: 'expiryDate',
        type: 'dateTime',
        default: '',
        description: 'New expiry date for local admin account',
      },
    ],
  },

  // ============================================================================
  // MICROSOFT DEFENDER THREATS OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         defenseControl:getMicrosoftDefenderThreat
  // ----------------------------------
  {
    displayName: 'Threat ID',
    name: 'threatId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['defenseControl'],
        operation: ['getMicrosoftDefenderThreat'],
      },
    },
    description: 'The GUID of the threat',
  },

  // ----------------------------------
  //         defenseControl:getMicrosoftDefenderThreatsByLogicalGroup
  // ----------------------------------
  {
    displayName: 'Logical Group ID',
    name: 'logicalGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['defenseControl'],
        operation: ['getMicrosoftDefenderThreatsByLogicalGroup'],
      },
    },
    description: 'The GUID of the logical group',
  },
];
