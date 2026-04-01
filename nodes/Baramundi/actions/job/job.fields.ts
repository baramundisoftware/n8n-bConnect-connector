import type { INodeProperties } from 'n8n-workflow';

export const jobOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['job'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new job definition',
        action: 'Create a job definition',
      },
      {
        name: 'Create Folder',
        value: 'createFolder',
        description: 'Create a new job folder',
        action: 'Create a job folder',
      },
      {
        name: 'Create Kiosk Release',
        value: 'createKioskRelease',
        description: 'Create a new kiosk release',
        action: 'Create a kiosk release',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a job definition',
        action: 'Delete a job definition',
      },
      {
        name: 'Delete Folder',
        value: 'deleteFolder',
        description: 'Delete a job folder',
        action: 'Delete a job folder',
      },
      {
        name: 'Delete Job Instance',
        value: 'deleteJobInstance',
        description: 'Delete a job instance',
        action: 'Delete a job instance',
      },
      {
        name: 'Execute',
        value: 'execute',
        description: 'Execute a job on one or more endpoints',
        action: 'Execute a job',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a job by ID',
        action: 'Get a job',
      },
      {
        name: 'Get All Job Instances',
        value: 'getAllJobInstances',
        description: 'Get all job instances across all jobs (no job filter required)',
        action: 'Get all job instances',
      },
      {
        name: 'Get Endpoint Job Instances',
        value: 'getEndpointJobInstances',
        description: 'Get all job instances for a specific endpoint',
        action: 'Get endpoint job instances',
      },
      {
        name: 'Get Folder',
        value: 'getFolder',
        description: 'Get a job folder by ID',
        action: 'Get a job folder',
      },
      {
        name: 'Get Folders',
        value: 'getFolders',
        description: 'Get many job folders',
        action: 'Get job folders',
      },
      {
        name: 'Get Instances',
        value: 'getInstances',
        description: 'Get job instances (execution history)',
        action: 'Get job instances',
      },
      {
        name: 'Get Job Instance',
        value: 'getJobInstance',
        description: 'Get a specific job instance by ID',
        action: 'Get a job instance',
      },
      {
        name: 'Get Kiosk Release',
        value: 'getKioskRelease',
        description: 'Get a kiosk release by ID',
        action: 'Get a kiosk release',
      },
      {
        name: 'Get Kiosk Releases',
        value: 'getKioskReleases',
        description: 'Get many kiosk releases',
        action: 'Get kiosk releases',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many jobs',
        action: 'Get many jobs',
      },
      {
        name: 'Resume Job Instance',
        value: 'resumeJobInstance',
        description: 'Resume a stopped job instance',
        action: 'Resume a job instance',
      },
      {
        name: 'Start Job Instance',
        value: 'startJobInstance',
        description: 'Start a job instance',
        action: 'Start a job instance',
      },
      {
        name: 'Stop Job Instance',
        value: 'stopJobInstance',
        description: 'Stop a running job instance',
        action: 'Stop a job instance',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a job definition',
        action: 'Update a job definition',
      },
      {
        name: 'Update Folder',
        value: 'updateFolder',
        description: 'Update a job folder',
        action: 'Update a job folder',
      },
      {
        name: 'Withdraw Kiosk Release',
        value: 'withdrawKioskRelease',
        description: 'Withdraw (delete) a kiosk release',
        action: 'Withdraw a kiosk release',
      },
      // Phase 8D
      { name: 'Get Sub-Folders', value: 'getSubFolders', description: 'Get sub-folders of a job folder', action: 'Get job sub-folders' },
      { name: 'Get Job Definitions by Folder', value: 'getJobDefinitionsByFolder', description: 'Get job definitions in a folder', action: 'Get job definitions by folder' },
      { name: 'Get Kiosk Releases by Job Definition', value: 'getKioskReleasesByJobDefinition', description: 'Get kiosk releases for a job definition', action: 'Get kiosk releases by job definition' },
      { name: 'Get Job Instances by Logical Group', value: 'getJobInstancesByLogicalGroup', description: 'Get job instances for a logical group', action: 'Get job instances by logical group' },
      { name: 'Get Job Instances by Static Group', value: 'getJobInstancesByStaticGroup', description: 'Get job instances for a static group', action: 'Get job instances by static group' },
      { name: 'Get Job Instances by Dynamic Group', value: 'getJobInstancesByDynamicGroup', description: 'Get job instances for a dynamic group', action: 'Get job instances by dynamic group' },
      { name: 'Get Job Instances by UDG', value: 'getJobInstancesByUDG', description: 'Get job instances for a Universal Dynamic Group', action: 'Get job instances by UDG' },
      { name: 'Assign Job to Logical Group', value: 'assignJobToLogicalGroup', description: 'Assign a job definition to a logical group', action: 'Assign job to logical group' },
      { name: 'Assign Job to Static Group', value: 'assignJobToStaticGroup', description: 'Assign a job definition to a static group', action: 'Assign job to static group' },
      { name: 'Assign Job to Dynamic Group', value: 'assignJobToDynamicGroup', description: 'Assign a job definition to a dynamic group', action: 'Assign job to dynamic group' },
      { name: 'Assign Job to UDG', value: 'assignJobToUDG', description: 'Assign a job definition to a Universal Dynamic Group', action: 'Assign job to UDG' },
      { name: 'Get Kiosk Releases by Endpoint', value: 'getKioskReleasesByEndpoint', description: 'Get kiosk releases for an endpoint', action: 'Get kiosk releases by endpoint' },
      { name: 'Get Kiosk Releases by Logical Group', value: 'getKioskReleasesByLogicalGroup', description: 'Get kiosk releases for a logical group', action: 'Get kiosk releases by logical group' },
      { name: 'Get Kiosk Releases by AD Object', value: 'getKioskReleasesByADObject', description: 'Get kiosk releases for an AD object', action: 'Get kiosk releases by AD object' },
    ],
    default: 'getMany',
  },
];

export const jobFields: INodeProperties[] = [
  // ----------------------------------
  //         job:get
  // ----------------------------------
  {
    displayName: 'Job Name or ID',
    name: 'jobSelection',
    type: 'options',
    required: true,
    typeOptions: {
      loadOptionsMethod: 'getJobDefinitions',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    default: '__custom__',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['get'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['get'],
        jobSelection: ['__custom__'],
      },
    },
    description: 'The GUID of the job',
  },

  // ----------------------------------
  //         job:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['job'],
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
        resource: ['job'],
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
        resource: ['job'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter jobs by name',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        placeholder: 'Name asc',
        description: 'Sort order (e.g., "Name asc", "CreatedAt desc")',
      },
    ],
  },

  // ----------------------------------
  //         job:execute
  // ----------------------------------
  {
    displayName: 'Job Name or ID',
    name: 'jobSelection',
    type: 'options',
    required: true,
    typeOptions: {
      loadOptionsMethod: 'getJobDefinitions',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    default: '__custom__',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['execute'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['execute'],
        jobSelection: ['__custom__'],
      },
    },
    description: 'The GUID of the job to execute',
  },
  {
    displayName: 'Endpoint IDs',
    name: 'endpointIds',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['execute'],
      },
    },
    description: 'Comma-separated list of endpoint GUIDs to execute the job on',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['execute'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Optional comment for the job execution',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'Low', value: 'Low' },
          { name: 'Normal', value: 'Normal' },
          { name: 'High', value: 'High' },
        ],
        default: 'Normal',
        description: 'Priority of the job execution',
      },
    ],
  },

  // ----------------------------------
  //         job:getInstances
  // ----------------------------------
  {
    displayName: 'Job Name or ID',
    name: 'jobSelection',
    type: 'options',
    required: true,
    typeOptions: {
      loadOptionsMethod: 'getJobDefinitions',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    default: '__custom__',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getInstances'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getInstances'],
        jobSelection: ['__custom__'],
      },
    },
    description: 'The GUID of the job to get instances for',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getInstances'],
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
        resource: ['job'],
        operation: ['getInstances'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         job:getAllJobInstances
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getAllJobInstances'],
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
        resource: ['job'],
        operation: ['getAllJobInstances'],
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
        resource: ['job'],
        operation: ['getAllJobInstances'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'OData filter query. Examples: "Status eq \'Running\'", "JobDefinitionId eq \'{guid}\'", "StartTime gt 2026-01-20".',
        placeholder: "Status eq 'Running'",
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        placeholder: 'StartTime desc',
        description: 'Sort order (e.g., "StartTime desc", "Status asc", "JobDefinitionId asc")',
      },
    ],
  },

  // ----------------------------------
  //         job:getJobInstance
  // ----------------------------------
  {
    displayName: 'Instance ID',
    name: 'instanceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getJobInstance'],
      },
    },
    description: 'The GUID of the job instance',
  },

  // ----------------------------------
  //         job:getEndpointJobInstances
  // ----------------------------------
  {
    displayName: 'Endpoint Name or ID',
    name: 'endpointSelection',
    type: 'options',
    required: true,
    typeOptions: {
      loadOptionsMethod: 'getEndpoints',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    default: '__custom__',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getEndpointJobInstances'],
      },
    },
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
        resource: ['job'],
        operation: ['getEndpointJobInstances'],
        endpointSelection: ['__custom__'],
      },
    },
    description: 'The GUID of the endpoint',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getEndpointJobInstances'],
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
        resource: ['job'],
        operation: ['getEndpointJobInstances'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         job:startJobInstance
  // ----------------------------------
  {
    displayName: 'Instance ID',
    name: 'instanceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['startJobInstance'],
      },
    },
    description: 'The GUID of the job instance to start',
  },

  // ----------------------------------
  //         job:stopJobInstance
  // ----------------------------------
  {
    displayName: 'Instance ID',
    name: 'instanceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['stopJobInstance'],
      },
    },
    description: 'The GUID of the job instance to stop',
  },

  // ----------------------------------
  //         job:resumeJobInstance
  // ----------------------------------
  {
    displayName: 'Instance ID',
    name: 'instanceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['resumeJobInstance'],
      },
    },
    description: 'The GUID of the job instance to resume',
  },

  // ----------------------------------
  //         job:deleteJobInstance
  // ----------------------------------
  {
    displayName: 'Instance ID',
    name: 'instanceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['deleteJobInstance'],
      },
    },
    description: 'The GUID of the job instance to delete',
  },

  // ----------------------------------
  //         job:getFolders
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getFolders'],
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
        resource: ['job'],
        operation: ['getFolders'],
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
        resource: ['job'],
        operation: ['getFolders'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter folders by name',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        placeholder: 'Name asc',
        description: 'Sort order (e.g., "Name asc", "CreatedAt desc")',
      },
    ],
  },

  // ----------------------------------
  //         job:getFolder
  // ----------------------------------
  {
    displayName: 'Folder ID',
    name: 'folderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getFolder'],
      },
    },
    description: 'The GUID of the job folder',
  },

  // ----------------------------------
  //         job:createFolder
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['createFolder'],
      },
    },
    description: 'The name of the folder',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['createFolder'],
      },
    },
    options: [
      {
        displayName: 'Parent ID',
        name: 'parentId',
        type: 'string',
        default: '',
        description: 'GUID of the parent folder',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the folder',
      },
    ],
  },

  // ----------------------------------
  //         job:updateFolder
  // ----------------------------------
  {
    displayName: 'Folder ID',
    name: 'folderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['updateFolder'],
      },
    },
    description: 'The GUID of the job folder to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['updateFolder'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'New name for the folder',
      },
      {
        displayName: 'Parent ID',
        name: 'parentId',
        type: 'string',
        default: '',
        description: 'New parent folder GUID',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'New description for the folder',
      },
    ],
  },

  // ----------------------------------
  //         job:deleteFolder
  // ----------------------------------
  {
    displayName: 'Folder ID',
    name: 'folderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['deleteFolder'],
      },
    },
    description: 'The GUID of the job folder to delete',
  },

  // ----------------------------------
  //         job:getKioskReleases
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getKioskReleases'],
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
        resource: ['job'],
        operation: ['getKioskReleases'],
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
        resource: ['job'],
        operation: ['getKioskReleases'],
      },
    },
    options: [
      {
        displayName: 'Search Query',
        name: 'searchQuery',
        type: 'string',
        default: '',
        description: 'Filter kiosk releases',
      },
      {
        displayName: 'Order By',
        name: 'orderBy',
        type: 'string',
        default: '',
        placeholder: 'Name asc',
        description: 'Sort order (e.g., "Name asc", "CreatedAt desc")',
      },
    ],
  },

  // ----------------------------------
  //         job:getKioskRelease
  // ----------------------------------
  {
    displayName: 'Release ID',
    name: 'releaseId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getKioskRelease'],
      },
    },
    description: 'The GUID of the kiosk release',
  },

  // ----------------------------------
  //         job:createKioskRelease
  // ----------------------------------
  {
    displayName: 'Job Definition Name or ID',
    name: 'jobDefinitionSelection',
    type: 'options',
    required: true,
    typeOptions: {
      loadOptionsMethod: 'getJobDefinitions',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    default: '__custom__',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['createKioskRelease'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Job Definition ID',
    name: 'jobDefinitionId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['createKioskRelease'],
        jobDefinitionSelection: ['__custom__'],
      },
    },
    description: 'The GUID of the job definition',
  },
  {
    displayName: 'Target Type',
    name: 'targetType',
    type: 'options',
    required: true,
    options: [
      { name: 'Endpoint', value: 'Endpoint' },
      { name: 'Logical Group', value: 'LogicalGroup' },
      { name: 'Static Group', value: 'StaticGroup' },
      { name: 'Dynamic Group', value: 'DynamicGroup' },
    ],
    default: 'Endpoint',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['createKioskRelease'],
      },
    },
    description: 'The type of target for the kiosk release',
  },
  {
    displayName: 'Target ID',
    name: 'targetId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['createKioskRelease'],
      },
    },
    description: 'The GUID of the target (endpoint or group)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['createKioskRelease'],
      },
    },
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Optional comment for the kiosk release',
      },
      {
        displayName: 'Valid From',
        name: 'validFrom',
        type: 'dateTime',
        default: '',
        description: 'Start date/time when the release becomes available',
      },
      {
        displayName: 'Valid Until',
        name: 'validUntil',
        type: 'dateTime',
        default: '',
        description: 'End date/time when the release expires',
      },
    ],
  },

  // ----------------------------------
  //         job:withdrawKioskRelease
  // ----------------------------------
  {
    displayName: 'Release ID',
    name: 'releaseId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['withdrawKioskRelease'],
      },
    },
    description: 'The GUID of the kiosk release to withdraw',
  },

  // ============================================================================
  // JOB DEFINITION CRUD OPERATIONS
  // ============================================================================

  // ----------------------------------
  //         job:create
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['create'],
      },
    },
    description: 'The name of the job definition',
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    required: true,
    options: [
      { name: 'Windows', value: 'Windows' },
      { name: 'Mobile', value: 'Mobile' },
      { name: 'Universal', value: 'Universal' },
    ],
    default: 'Windows',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['create'],
      },
    },
    description: 'The type of job definition',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Display Name',
        name: 'displayName',
        type: 'string',
        default: '',
        description: 'Display name for the job',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the job',
      },
      {
        displayName: 'Comments',
        name: 'comments',
        type: 'string',
        default: '',
        description: 'Comments about the job',
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

  // ----------------------------------
  //         job:update
  // ----------------------------------
  {
    displayName: 'Job Name or ID',
    name: 'jobSelection',
    type: 'options',
    required: true,
    typeOptions: {
      loadOptionsMethod: 'getJobDefinitions',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    default: '__custom__',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['update'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['update'],
        jobSelection: ['__custom__'],
      },
    },
    description: 'The GUID of the job definition to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'New name for the job',
      },
      {
        displayName: 'Display Name',
        name: 'displayName',
        type: 'string',
        default: '',
        description: 'New display name for the job',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'New description for the job',
      },
      {
        displayName: 'Comments',
        name: 'comments',
        type: 'string',
        default: '',
        description: 'New comments for the job',
      },
    ],
  },

  // ----------------------------------
  //         job:delete
  // ----------------------------------
  {
    displayName: 'Job Name or ID',
    name: 'jobSelection',
    type: 'options',
    required: true,
    typeOptions: {
      loadOptionsMethod: 'getJobDefinitions',
    },
    options: [
      {
        name: 'Enter Custom GUID...',
        value: '__custom__',
      },
    ],
    default: '__custom__',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['delete'],
      },
    },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
  },
  {
    displayName: 'Job ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['delete'],
        jobSelection: ['__custom__'],
      },
    },
    description: 'The GUID of the job definition to delete',
  },

  // ----------------------------------
  //  Phase 8D — new fields
  // ----------------------------------
  {
    displayName: 'Folder ID',
    name: 'folderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['getSubFolders', 'getJobDefinitionsByFolder'] } },
    description: 'The GUID of the job folder',
  },
  {
    displayName: 'Job Definition ID',
    name: 'jobId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['getKioskReleasesByJobDefinition'] } },
    description: 'The GUID of the job definition',
  },
  {
    displayName: 'Logical Group ID',
    name: 'logicalGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['getJobInstancesByLogicalGroup', 'assignJobToLogicalGroup', 'getKioskReleasesByLogicalGroup'] } },
    description: 'The GUID of the logical group',
  },
  {
    displayName: 'Static Group ID',
    name: 'staticGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['getJobInstancesByStaticGroup', 'assignJobToStaticGroup'] } },
    description: 'The GUID of the static group',
  },
  {
    displayName: 'Dynamic Group ID',
    name: 'dynamicGroupId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['getJobInstancesByDynamicGroup', 'assignJobToDynamicGroup'] } },
    description: 'The GUID of the dynamic group',
  },
  {
    displayName: 'Universal Dynamic Group ID',
    name: 'udgId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['getJobInstancesByUDG', 'assignJobToUDG'] } },
    description: 'The GUID of the Universal Dynamic Group',
  },
  {
    displayName: 'Job Definition ID',
    name: 'jobDefinitionId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['assignJobToLogicalGroup', 'assignJobToStaticGroup', 'assignJobToDynamicGroup', 'assignJobToUDG'] } },
    description: 'The GUID of the job definition to assign',
  },
  {
    displayName: 'Endpoint ID',
    name: 'endpointId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['getKioskReleasesByEndpoint'] } },
    description: 'The GUID of the endpoint',
  },
  {
    displayName: 'AD Object ID',
    name: 'adObjectId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['job'], operation: ['getKioskReleasesByADObject'] } },
    description: 'The GUID of the AD object',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show: { resource: ['job'], operation: ['getSubFolders', 'getJobDefinitionsByFolder', 'getKioskReleasesByJobDefinition', 'getJobInstancesByLogicalGroup', 'getJobInstancesByStaticGroup', 'getJobInstancesByDynamicGroup', 'getJobInstancesByUDG', 'getKioskReleasesByEndpoint', 'getKioskReleasesByLogicalGroup', 'getKioskReleasesByADObject'] } },
    description: 'Whether to return all results or only up to a given limit',
    hint: 'Results are capped at 5,000 items regardless of this setting',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { resource: ['job'], operation: ['getSubFolders', 'getJobDefinitionsByFolder', 'getKioskReleasesByJobDefinition', 'getJobInstancesByLogicalGroup', 'getJobInstancesByStaticGroup', 'getJobInstancesByDynamicGroup', 'getJobInstancesByUDG', 'getKioskReleasesByEndpoint', 'getKioskReleasesByLogicalGroup', 'getKioskReleasesByADObject'], returnAll: [false] } },
    description: 'Max number of results to return',
  },
];
