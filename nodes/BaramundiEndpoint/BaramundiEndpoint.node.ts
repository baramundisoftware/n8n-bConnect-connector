import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
  dynamicGroupFields,
  dynamicGroupOperations,
  endpointFields,
  endpointOperations25R2,
  endpointOperations26R1,
  endpointTypeFields,
  logicalGroupFields,
  logicalGroupOperations,
  maintenanceWindowFields,
  maintenanceWindowOperations25R2,
  maintenanceWindowOperations26R1,
  staticGroupFields,
  staticGroupOperations,
} from './actions/endpoint/endpoint.fields';
import { router } from './actions/router';
import {
  getEndpoints,
  getLogicalGroups,
  getStaticGroups,
  getDynamicGroups,
  endpointSearch,
} from '../shared/loadOptions';

export class BaramundiEndpoint implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'baramundi Endpoint',
    name: 'baramundiEndpoint',
    icon: 'file:baramundi.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage endpoints, groups, and maintenance windows via bConnect API',
    defaults: {
      name: 'baramundi Endpoint',
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
        displayName: 'baramundi Management Suite Version',
        name: 'bmsVersion',
        type: 'options',
        required: true,
        noDataExpression: true,
        default: '26R1',
        description: 'Select the version of your baramundi Management Suite installation. Only operations supported by this version are shown.',
        options: [
          { name: '25 R2', value: '25R2' },
          { name: '26 R1', value: '26R1' },
        ],
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Dynamic Group',
            value: 'dynamicGroup',
            description: 'Query dynamic endpoint groups',
          },
          {
            name: 'Endpoint',
            value: 'endpoint',
            description: 'Manage endpoints (devices) in baramundi',
          },
          {
            name: 'Logical Group',
            value: 'logicalGroup',
            description: 'Manage logical endpoint groups',
          },
          {
            name: 'Maintenance Window',
            value: 'maintenanceWindow',
            description: 'Manage endpoint and group maintenance windows',
          },
          {
            name: 'Static Group',
            value: 'staticGroup',
            description: 'Manage static endpoint groups',
          },
        ],
        default: 'endpoint',
      },
      // Operations
      ...dynamicGroupOperations,
      ...endpointOperations25R2,
      ...endpointOperations26R1,
      ...logicalGroupOperations,
      ...maintenanceWindowOperations25R2,
      ...maintenanceWindowOperations26R1,
      ...staticGroupOperations,
      // Fields
      ...dynamicGroupFields,
      ...endpointFields,
      ...endpointTypeFields,
      ...logicalGroupFields,
      ...maintenanceWindowFields,
      ...staticGroupFields,
    ],
  };

  methods = {
    loadOptions: {
      getEndpoints,
      getLogicalGroups,
      getStaticGroups,
      getDynamicGroups,
    },
    listSearch: {
      endpointSearch,
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await router.call(this);
  }
}
