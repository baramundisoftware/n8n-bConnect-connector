import type { INodeProperties } from 'n8n-workflow';
import { endpointLocator } from '../../../shared/resourceLocators';

const GUID_REGEX = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

function jobDefinitionLocator(
  displayOptions: INodeProperties['displayOptions'],
): INodeProperties {
  return {
    displayName: 'Job Definition',
    name: 'jobId',
    type: 'resourceLocator',
    required: true,
    default: { mode: 'list', value: '' },
    displayOptions,
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        typeOptions: {
          searchListMethod: 'jobDefinitionSearch',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: GUID_REGEX,
              errorMessage: 'Not a valid GUID (expected: 12345678-1234-1234-1234-123456789012)',
            },
          },
        ],
        placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
      },
      {
        displayName: 'By URL',
        name: 'url',
        type: 'string',
        placeholder: 'https://bms-server/job/{guid}',
        extractValue: {
          type: 'regex',
          regex: '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
        },
      },
    ],
    description: 'The job definition to operate on',
  };
}

function jobFolderLocator(
  displayOptions: INodeProperties['displayOptions'],
): INodeProperties {
  return {
    displayName: 'Job Folder',
    name: 'folderId',
    type: 'resourceLocator',
    required: true,
    default: { mode: 'list', value: '' },
    displayOptions,
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        typeOptions: {
          searchListMethod: 'jobFolderSearch',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: GUID_REGEX,
              errorMessage: 'Not a valid GUID (expected: 12345678-1234-1234-1234-123456789012)',
            },
          },
        ],
        placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
      },
      {
        displayName: 'By URL',
        name: 'url',
        type: 'string',
        placeholder: 'https://bms-server/folder/{guid}',
        extractValue: {
          type: 'regex',
          regex: '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
        },
      },
    ],
    description: 'The job folder to operate on',
  };
}

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
      { name: 'Assign Job to Dynamic Group', value: 'assignJobToDynamicGroup', description: 'Assign a job definition to a dynamic group', action: 'Assign job to dynamic group' },
      { name: 'Assign Job to Logical Group', value: 'assignJobToLogicalGroup', description: 'Assign a job definition to a logical group', action: 'Assign job to logical group' },
      { name: 'Assign Job to Static Group', value: 'assignJobToStaticGroup', description: 'Assign a job definition to a static group', action: 'Assign job to static group' },
      { name: 'Assign Job to UDG', value: 'assignJobToUDG', description: 'Assign a job definition to a Universal Dynamic Group', action: 'Assign job to UDG' },
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
      { name: 'Get Job Definitions by Folder', value: 'getJobDefinitionsByFolder', description: 'Get job definitions in a folder', action: 'Get job definitions by folder' },
      {
        name: 'Get Job Instance',
        value: 'getJobInstance',
        description: 'Get a specific job instance by ID',
        action: 'Get a job instance',
      },
      { name: 'Get Job Instances by Dynamic Group', value: 'getJobInstancesByDynamicGroup', description: 'Get job instances for a dynamic group', action: 'Get job instances by dynamic group' },
      { name: 'Get Job Instances by Logical Group', value: 'getJobInstancesByLogicalGroup', description: 'Get job instances for a logical group', action: 'Get job instances by logical group' },
      { name: 'Get Job Instances by Static Group', value: 'getJobInstancesByStaticGroup', description: 'Get job instances for a static group', action: 'Get job instances by static group' },
      { name: 'Get Job Instances by UDG', value: 'getJobInstancesByUDG', description: 'Get job instances for a Universal Dynamic Group', action: 'Get job instances by UDG' },
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
      { name: 'Get Kiosk Releases by AD Object', value: 'getKioskReleasesByADObject', description: 'Get kiosk releases for an AD object', action: 'Get kiosk releases by AD object' },
      { name: 'Get Kiosk Releases by Endpoint', value: 'getKioskReleasesByEndpoint', description: 'Get kiosk releases for an endpoint', action: 'Get kiosk releases by endpoint' },
      { name: 'Get Kiosk Releases by Job Definition', value: 'getKioskReleasesByJobDefinition', description: 'Get kiosk releases for a job definition', action: 'Get kiosk releases by job definition' },
      { name: 'Get Kiosk Releases by Logical Group', value: 'getKioskReleasesByLogicalGroup', description: 'Get kiosk releases for a logical group', action: 'Get kiosk releases by logical group' },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many jobs',
        action: 'Get many jobs',
      },
      { name: 'Get Sub-Folders', value: 'getSubFolders', description: 'Get sub-folders of a job folder', action: 'Get job sub-folders' },
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
    ],
    default: 'getMany',
  },
];

export const jobFields: INodeProperties[] = [
  // ----------------------------------
  //         job:get
  // ----------------------------------
  jobDefinitionLocator({
    show: {
      resource: ['job'],
      operation: ['get'],
    },
  }),

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
  jobDefinitionLocator({
    show: {
      resource: ['job'],
      operation: ['execute'],
    },
  }),
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
  jobDefinitionLocator({
    show: {
      resource: ['job'],
      operation: ['getInstances'],
    },
  }),
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
    displayName: 'Endpoint',
    name: 'endpointId',
    type: 'resourceLocator',
    required: true,
    default: { mode: 'id', value: '' },
    displayOptions: {
      show: {
        resource: ['job'],
        operation: ['getEndpointJobInstances'],
      },
    },
    modes: [
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: GUID_REGEX,
              errorMessage: 'Not a valid GUID (expected: 12345678-1234-1234-1234-123456789012)',
            },
          },
        ],
        placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
      },
      {
        displayName: 'By URL',
        name: 'url',
        type: 'string',
        placeholder: 'https://bms-server/endpoint/{guid}',
        extractValue: {
          type: 'regex',
          regex: '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
        },
      },
    ],
    description: 'The endpoint to query job instances for',
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
  jobFolderLocator({
    show: {
      resource: ['job'],
      operation: ['getFolder'],
    },
  }),

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
  jobFolderLocator({
    show: {
      resource: ['job'],
      operation: ['updateFolder'],
    },
  }),
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
  jobFolderLocator({
    show: {
      resource: ['job'],
      operation: ['deleteFolder'],
    },
  }),

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
    ...jobDefinitionLocator({
      show: {
        resource: ['job'],
        operation: ['createKioskRelease'],
      },
    }),
    name: 'jobDefinitionId',
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
  jobDefinitionLocator({
    show: {
      resource: ['job'],
      operation: ['update'],
    },
  }),
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
  jobDefinitionLocator({
    show: {
      resource: ['job'],
      operation: ['delete'],
    },
  }),

  // ----------------------------------
  //  Phase 8D — new fields
  // ----------------------------------
  jobFolderLocator({
    show: { resource: ['job'], operation: ['getSubFolders', 'getJobDefinitionsByFolder'] },
  }),
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
    ...jobDefinitionLocator({
      show: { resource: ['job'], operation: ['assignJobToLogicalGroup', 'assignJobToStaticGroup', 'assignJobToDynamicGroup', 'assignJobToUDG'] },
    }),
    name: 'jobDefinitionId',
  },
  endpointLocator({ show: { resource: ['job'], operation: ['getKioskReleasesByEndpoint'] } }),
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

// ============================================================================
// NEW SPLIT RESOURCE EXPORTS — P12.2
// ============================================================================

// Helper: clone a field array replacing resource value
function withResource(fields: INodeProperties[], newResource: string): INodeProperties[] {
  return fields.map((f) => {
    const clone = JSON.parse(JSON.stringify(f)) as INodeProperties;
    if (clone.displayOptions?.show?.resource) {
      clone.displayOptions.show.resource = [newResource];
    }
    return clone;
  });
}

// ── Operation lists per resource ─────────────────────────────────────────────

const jobDefinitionOpValues = new Set([
  'get', 'getMany', 'create', 'update', 'delete', 'execute', 'getJobDefinitionsByFolder',
]);
const jobFolderOpValues = new Set([
  'getFolders', 'getFolder', 'createFolder', 'updateFolder', 'deleteFolder', 'getSubFolders',
]);
const jobInstanceOpValues = new Set([
  'getInstances', 'getAllJobInstances', 'getJobInstance', 'getEndpointJobInstances',
  'startJobInstance', 'stopJobInstance', 'resumeJobInstance', 'deleteJobInstance',
  'getJobInstancesByLogicalGroup', 'getJobInstancesByStaticGroup',
  'getJobInstancesByDynamicGroup', 'getJobInstancesByUDG',
  'assignJobToLogicalGroup', 'assignJobToStaticGroup', 'assignJobToDynamicGroup', 'assignJobToUDG',
]);
const kioskReleaseOpValues = new Set([
  'getKioskReleases', 'getKioskRelease', 'createKioskRelease', 'withdrawKioskRelease',
  'getKioskReleasesByJobDefinition', 'getKioskReleasesByEndpoint',
  'getKioskReleasesByLogicalGroup', 'getKioskReleasesByADObject',
]);

function filterOptions(
  ops: INodeProperties[],
  allowed: Set<string>,
  defaultOp: string,
): INodeProperties[] {
  return ops.map((prop) => {
    const clone = JSON.parse(JSON.stringify(prop)) as INodeProperties;
    if (Array.isArray(clone.options)) {
      clone.options = (clone.options as INodeProperties[]).filter(
        (o: INodeProperties) => allowed.has((o as unknown as { value: string }).value),
      );
    }
    clone.default = defaultOp;
    return clone;
  });
}

export const jobDefinitionOperations: INodeProperties[] = filterOptions(
  withResource(jobOperations, 'jobDefinition'),
  jobDefinitionOpValues,
  'getMany',
);

export const jobFolderOperations: INodeProperties[] = filterOptions(
  withResource(jobOperations, 'jobFolder'),
  jobFolderOpValues,
  'getFolders',
);

export const jobInstanceOperations: INodeProperties[] = filterOptions(
  withResource(jobOperations, 'jobInstance'),
  jobInstanceOpValues,
  'getInstances',
);

export const kioskReleaseOperations: INodeProperties[] = filterOptions(
  withResource(jobOperations, 'kioskRelease'),
  kioskReleaseOpValues,
  'getKioskReleases',
);

// ── Field lists per resource ─────────────────────────────────────────────────
// A field belongs to a resource if ALL the operation values in its displayOptions
// are in that resource's operation set.

function fieldsForResource(
  fields: INodeProperties[],
  allowed: Set<string>,
  newResource: string,
): INodeProperties[] {
  return fields
    .filter((f) => {
      const ops = f.displayOptions?.show?.operation as string[] | undefined;
      if (!ops) return false;
      return ops.some((op) => allowed.has(op));
    })
    .map((f) => {
      const clone = JSON.parse(JSON.stringify(f)) as INodeProperties;
      if (clone.displayOptions?.show?.resource) {
        clone.displayOptions.show.resource = [newResource];
      }
      // If the operation list has ops outside the allowed set, filter them
      const ops = clone.displayOptions?.show?.operation as string[] | undefined;
      if (ops) {
        clone.displayOptions!.show!.operation = ops.filter((op) => allowed.has(op));
      }
      return clone;
    });
}

export const jobDefinitionFields: INodeProperties[] = fieldsForResource(
  jobFields,
  jobDefinitionOpValues,
  'jobDefinition',
);

export const jobFolderFields: INodeProperties[] = fieldsForResource(
  jobFields,
  jobFolderOpValues,
  'jobFolder',
);

export const jobInstanceFields: INodeProperties[] = fieldsForResource(
  jobFields,
  jobInstanceOpValues,
  'jobInstance',
);

export const kioskReleaseFields: INodeProperties[] = fieldsForResource(
  jobFields,
  kioskReleaseOpValues,
  'kioskRelease',
);
