import type { INodeProperties } from 'n8n-workflow';

export const activeDirectoryOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
      },
    },
    options: [
      {
        name: 'Get AD Group',
        value: 'getADGroup',
        description: 'Get a single AD group by ID',
        action: 'Get an AD group',
      },
      {
        name: 'Get AD Groups',
        value: 'getADGroups',
        description: 'Get many Active Directory groups',
        action: 'Get AD groups',
      },
      {
        name: 'Get AD Groups by OU',
        value: 'getADGroupsByOrgUnit',
        description: 'Get AD groups in an organizational unit',
        action: 'Get AD groups by organizational unit',
      },
      {
        name: 'Get AD Object',
        value: 'getADObject',
        description: 'Get a single AD object by ID',
        action: 'Get an AD object',
      },
      {
        name: 'Get AD Objects',
        value: 'getADObjects',
        description: 'Get many Active Directory objects',
        action: 'Get AD objects',
      },
      {
        name: 'Get AD User',
        value: 'getADUser',
        description: 'Get a single AD user by ID',
        action: 'Get an AD user',
      },
      {
        name: 'Get AD Users',
        value: 'getADUsers',
        description: 'Get many Active Directory users',
        action: 'Get AD users',
      },
      {
        name: 'Get AD Users by Group',
        value: 'getADUsersByGroup',
        description: 'Get AD users in a group',
        action: 'Get AD users by group',
      },
      {
        name: 'Get Organizational Unit',
        value: 'getOrgUnit',
        description: 'Get a single organizational unit by ID',
        action: 'Get an organizational unit',
      },
      {
        name: 'Get Organizational Units',
        value: 'getOrgUnits',
        description: 'Get many AD organizational units',
        action: 'Get organizational units',
      },
      {
        name: 'Get AD Groups by AD Group',
        value: 'getADGroupsByADGroup',
        description: 'Get AD sub-groups in an AD group',
        action: 'Get AD groups by AD group',
      },
      {
        name: 'Get AD Objects by AD Group',
        value: 'getADObjectsByADGroup',
        description: 'Get AD objects in an AD group',
        action: 'Get AD objects by AD group',
      },
      {
        name: 'Get AD Object Group Memberships',
        value: 'getADObjectMemberships',
        description: 'Get AD group memberships of an AD object',
        action: 'Get AD object group memberships',
      },
      {
        name: 'Get AD Objects by OU',
        value: 'getADObjectsByOrgUnit',
        description: 'Get AD objects in an organizational unit',
        action: 'Get AD objects by organizational unit',
      },
      {
        name: 'Get AD Users by OU',
        value: 'getADUsersByOrgUnit',
        description: 'Get AD users in an organizational unit',
        action: 'Get AD users by organizational unit',
      },
      {
        name: 'Get OUs by OU',
        value: 'getOrgUnitsByOrgUnit',
        description: 'Get sub-organizational units in an organizational unit',
        action: 'Get organizational units by organizational unit',
      },
    ],
    default: 'getADGroups',
  },
];

export const activeDirectoryFields: INodeProperties[] = [
  // ----------------------------------
  //         activeDirectory:getADGroups
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADGroups'],
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
        resource: ['activeDirectory'],
        operation: ['getADGroups'],
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
        resource: ['activeDirectory'],
        operation: ['getADGroups'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter AD groups by name',
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
  //         activeDirectory:getADGroup
  // ----------------------------------
  {
    displayName: 'AD Group ID',
    name: 'adGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADGroup'],
      },
    },
    description: 'The GUID of the Active Directory group',
  },

  // ----------------------------------
  //         activeDirectory:getADGroupsByOrgUnit
  // ----------------------------------
  {
    displayName: 'Organizational Unit ID',
    name: 'orgUnitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADGroupsByOrgUnit'],
      },
    },
    description: 'The GUID of the organizational unit',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADGroupsByOrgUnit'],
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
        resource: ['activeDirectory'],
        operation: ['getADGroupsByOrgUnit'],
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
        resource: ['activeDirectory'],
        operation: ['getADGroupsByOrgUnit'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter AD groups by name',
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
  //         activeDirectory:getADUsersByGroup
  // ----------------------------------
  {
    displayName: 'AD Group ID',
    name: 'adGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADUsersByGroup'],
      },
    },
    description: 'The GUID of the Active Directory group',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADUsersByGroup'],
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
        resource: ['activeDirectory'],
        operation: ['getADUsersByGroup'],
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
        resource: ['activeDirectory'],
        operation: ['getADUsersByGroup'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter AD users by name',
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
  //         activeDirectory:getADUsers
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADUsers'],
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
        resource: ['activeDirectory'],
        operation: ['getADUsers'],
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
        resource: ['activeDirectory'],
        operation: ['getADUsers'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter AD users by name',
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
  //         activeDirectory:getADUser
  // ----------------------------------
  {
    displayName: 'AD User ID',
    name: 'adUserId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADUser'],
      },
    },
    description: 'The GUID of the Active Directory user',
  },

  // ----------------------------------
  //         activeDirectory:getADObjects
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjects'],
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
        resource: ['activeDirectory'],
        operation: ['getADObjects'],
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
        resource: ['activeDirectory'],
        operation: ['getADObjects'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter AD objects by name',
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
  //         activeDirectory:getADObject
  // ----------------------------------
  {
    displayName: 'AD Object ID',
    name: 'adObjectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObject'],
      },
    },
    description: 'The GUID of the Active Directory object',
  },

  // ----------------------------------
  //         activeDirectory:getOrgUnits
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getOrgUnits'],
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
        resource: ['activeDirectory'],
        operation: ['getOrgUnits'],
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
        resource: ['activeDirectory'],
        operation: ['getOrgUnits'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter organizational units by name',
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
  //         activeDirectory:getOrgUnit
  // ----------------------------------
  {
    displayName: 'Organizational Unit ID',
    name: 'orgUnitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getOrgUnit'],
      },
    },
    description: 'The GUID of the organizational unit',
  },

  // ----------------------------------
  //  activeDirectory:getADGroupsByADGroup
  // ----------------------------------
  {
    displayName: 'AD Group ID',
    name: 'adGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADGroupsByADGroup'],
      },
    },
    description: 'The GUID of the parent AD group',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADGroupsByADGroup'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADGroupsByADGroup'],
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
        resource: ['activeDirectory'],
        operation: ['getADGroupsByADGroup'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter AD groups by name',
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
  //  activeDirectory:getADObjectsByADGroup
  // ----------------------------------
  {
    displayName: 'AD Group ID',
    name: 'adGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjectsByADGroup'],
      },
    },
    description: 'The GUID of the AD group',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjectsByADGroup'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjectsByADGroup'],
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
        resource: ['activeDirectory'],
        operation: ['getADObjectsByADGroup'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter AD objects by name',
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
  //  activeDirectory:getADObjectMemberships
  // ----------------------------------
  {
    displayName: 'AD Object ID',
    name: 'adObjectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjectMemberships'],
      },
    },
    description: 'The GUID of the AD object',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjectMemberships'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjectMemberships'],
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
        resource: ['activeDirectory'],
        operation: ['getADObjectMemberships'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter group memberships by name',
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
  //  activeDirectory:getADObjectsByOrgUnit
  // ----------------------------------
  {
    displayName: 'Organizational Unit ID',
    name: 'orgUnitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjectsByOrgUnit'],
      },
    },
    description: 'The GUID of the organizational unit',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjectsByOrgUnit'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADObjectsByOrgUnit'],
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
        resource: ['activeDirectory'],
        operation: ['getADObjectsByOrgUnit'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter AD objects by name',
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
  //  activeDirectory:getADUsersByOrgUnit
  // ----------------------------------
  {
    displayName: 'Organizational Unit ID',
    name: 'orgUnitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADUsersByOrgUnit'],
      },
    },
    description: 'The GUID of the organizational unit',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADUsersByOrgUnit'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getADUsersByOrgUnit'],
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
        resource: ['activeDirectory'],
        operation: ['getADUsersByOrgUnit'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter AD users by name',
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
  //  activeDirectory:getOrgUnitsByOrgUnit
  // ----------------------------------
  {
    displayName: 'Organizational Unit ID',
    name: 'orgUnitId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getOrgUnitsByOrgUnit'],
      },
    },
    description: 'The GUID of the parent organizational unit',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getOrgUnitsByOrgUnit'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: {
      show: {
        resource: ['activeDirectory'],
        operation: ['getOrgUnitsByOrgUnit'],
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
        resource: ['activeDirectory'],
        operation: ['getOrgUnitsByOrgUnit'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter organizational units by name',
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
];
