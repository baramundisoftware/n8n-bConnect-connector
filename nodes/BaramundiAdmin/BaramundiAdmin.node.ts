import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
  adUserOperations, adUserFields,
  adGroupOperations, adGroupFields,
  adObjectOperations, adObjectFields,
  orgUnitOperations, orgUnitFields,
} from './actions/activeDirectory/activeDirectory.fields';
import {
  serverManagementOperations, serverManagementFields,
  microserviceOperations, microserviceFields,
} from './actions/serverManagement/serverManagement.fields';
import { operatingSystemOperations, operatingSystemFields } from './actions/operatingSystem/operatingSystem.fields';
import { router } from './actions/router';
import { getOrgUnits, endpointSearch } from '../shared/loadOptions';

export class BaramundiAdmin implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'baramundi Admin',
    name: 'baramundiAdmin',
    icon: 'file:baramundi.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage Active Directory, server infrastructure, and operating systems via bConnect API',
    defaults: {
      name: 'baramundi Admin',
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
          { name: 'AD Group', value: 'adGroup', description: 'Query Active Directory groups' },
          { name: 'AD Object', value: 'adObject', description: 'Query Active Directory objects and memberships' },
          { name: 'AD User', value: 'adUser', description: 'Query Active Directory users' },
          {
            name: 'Microservice',
            value: 'microservice',
            description: 'Start, stop, and monitor baramundi microservices',
          },
          {
            name: 'Operating System',
            value: 'operatingSystem',
            description: 'Manage OS folders and endpoint OS configurations',
          },
          { name: 'Org Unit', value: 'orgUnit', description: 'Query Active Directory organizational units' },
          {
            name: 'Server Management',
            value: 'serverManagement',
            description: 'Manage baramundi server infrastructure (gateways, DIPs, cloud connectors)',
          },
        ],
        default: 'serverManagement',
      },
      // Operations
      ...adUserOperations,
      ...adGroupOperations,
      ...adObjectOperations,
      ...orgUnitOperations,
      ...serverManagementOperations,
      ...microserviceOperations,
      ...operatingSystemOperations,
      // Fields
      ...adUserFields,
      ...adGroupFields,
      ...adObjectFields,
      ...orgUnitFields,
      ...serverManagementFields,
      ...microserviceFields,
      ...operatingSystemFields,
    ],
  };

  methods = {
    loadOptions: {
      getOrgUnits,
    },
    listSearch: {
      endpointSearch,
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await router.call(this);
  }
}
