import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

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
import { SINCE_26R1, SINCE_26R2, versionedOptions } from '../shared/utils/versionGating';
import { router } from './actions/router';
import { getOrgUnits, endpointSearch } from '../shared/loadOptions';

export class BaramundiAdmin implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'baramundi Admin',
    name: 'baramundiAdmin',
    icon: { light: 'file:../../icons/baramundi-management-suite.svg', dark: 'file:../../icons/baramundi-management-suite.svg' },
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage Active Directory, server infrastructure, and operating systems via bConnect API',
    defaults: {
      name: 'baramundi Admin',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
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
      baseURL: '={{ String($credentials.baseUrl).trim().replace(/\\/+$/, "") }}',
      skipSslCertificateValidation: '={{$credentials.ignoreSslIssues}}',
    },
    properties: [
      {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased -- baramundi is a lowercase brand name
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
          { name: '26 R2', value: '26R2' },
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
      // API key list, MSW cleanup and download jobs exist from 26R1 on, API key management from 26R2 on;
      // cloud connectors were removed in 26R2
      ...versionedOptions(serverManagementOperations, {
        getApiKeys: SINCE_26R1,
        getDipsMSWCleanup: SINCE_26R1,
        simulateMSWCleanup: SINCE_26R1,
        getDownloadJob: SINCE_26R1,
        getDownloadJobs: SINCE_26R1,
        getCloudConnectors: ['25R2', '26R1'],
        getApiKey: SINCE_26R2,
        createApiKey: SINCE_26R2,
        updateApiKey: SINCE_26R2,
        deleteApiKey: SINCE_26R2,
      }),
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
