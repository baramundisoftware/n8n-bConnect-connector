import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
  jobDefinitionOperations,
  jobDefinitionFields,
  jobFolderOperations,
  jobFolderFields,
  jobInstanceOperations,
  jobInstanceFields,
  kioskReleaseOperations,
  kioskReleaseFields,
} from './actions/job/job.fields';
import { router } from './actions/router';
import { getJobDefinitions, jobDefinitionSearch, jobFolderSearch, endpointSearch } from '../shared/loadOptions';

export class BaramundiJob implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Baramundi Job',
    name: 'baramundiJob',
    icon: 'file:baramundi.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage job definitions, folders, instances, and kiosk releases via bConnect API',
    defaults: {
      name: 'Baramundi Job',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'bconnectApi',
        required: true,
      },
    ],
    requestDefaults: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      baseURL: '={{$credentials.baseUrl}}',
      skipSslCertificateValidation: '={{$credentials.ignoreSslIssues}}',
    },
    properties: [
      {
        displayName: 'Baramundi Management Suite Version',
        name: 'bmsVersion',
        type: 'options',
        required: true,
        noDataExpression: true,
        default: '26R1',
        description: 'Select the version of your baramundi Management Suite installation. Only operations supported by this version are shown.',
        options: [
          { name: '25R2', value: '25R2' },
          { name: '26R1', value: '26R1' },
        ],
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Job Definition',
            value: 'jobDefinition',
            description: 'Manage job definitions (scripts and deployments)',
          },
          {
            name: 'Job Folder',
            value: 'jobFolder',
            description: 'Manage job definition folders',
          },
          {
            name: 'Job Instance',
            value: 'jobInstance',
            description: 'Manage and monitor job execution instances',
          },
          {
            name: 'Kiosk Release',
            value: 'kioskRelease',
            description: 'Manage kiosk software releases',
          },
        ],
        default: 'jobDefinition',
      },
      // Operations
      ...jobDefinitionOperations,
      ...jobFolderOperations,
      ...jobInstanceOperations,
      ...kioskReleaseOperations,
      // Fields
      ...jobDefinitionFields,
      ...jobFolderFields,
      ...jobInstanceFields,
      ...kioskReleaseFields,
    ],
  };

  methods = {
    loadOptions: {
      getJobDefinitions,
    },
    listSearch: {
      jobDefinitionSearch,
      jobFolderSearch,
      endpointSearch,
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await router.call(this);
  }
}
