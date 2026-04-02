import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
  activeDirectoryFields,
  activeDirectoryOperations,
  adUserOperations, adUserFields,
  adGroupOperations, adGroupFields,
  adObjectOperations, adObjectFields,
  orgUnitOperations, orgUnitFields,
} from './actions/activeDirectory/activeDirectory.fields';
import {
  assetFields,
  assetOperations25R2Trimmed,
  assetOperations26R1Trimmed,
  assetTypeOperations, assetTypeFields,
  assetFolderOperations, assetFolderFields,
} from './actions/asset/asset.fields';
import { complianceFields, complianceOperations } from './actions/compliance/compliance.fields';
import { universalDynamicGroupsFields, universalDynamicGroupsOperations } from './actions/universalDynamicGroups/universalDynamicGroups.fields';
import { defenseControlFields, defenseControlOperations } from './actions/defenseControl/defenseControl.fields';
import {
  dynamicGroupFields,
  dynamicGroupOperations,
  endpointFields,
  endpointOperations25R2,
  endpointOperations26R1,
  logicalGroupFields,
  logicalGroupOperations,
  maintenanceWindowFields,
  maintenanceWindowOperations25R2,
  maintenanceWindowOperations26R1,
  staticGroupFields,
  staticGroupOperations,
  typedEndpointFields,
  typedEndpointOperations25R2,
  typedEndpointOperations26R1,
} from './actions/endpoint/endpoint.fields';
import {
  jobDefinitionFields,
  jobDefinitionOperations,
  jobFolderFields,
  jobFolderOperations,
  jobInstanceFields,
  jobInstanceOperations,
  kioskReleaseFields,
  kioskReleaseOperations,
} from './actions/job/job.fields';
import { operatingSystemFields, operatingSystemOperations } from './actions/operatingSystem/operatingSystem.fields';
import {
  serverManagementFields,
  serverManagementOperations,
  microserviceFields,
  microserviceOperations,
  bmsecurityFields,
  bmsecurityOperations,
} from './actions/serverManagement/serverManagement.fields';
import {
  softwareFields,
  softwareOperations25R2Trimmed,
  softwareOperations26R1Trimmed,
  softwareBundleOperations, softwareBundleFields,
} from './actions/software/software.fields';
import { updateManagementFields, updateManagementOperations } from './actions/updateManagement/updateManagement.fields';
import { variableFields, variableOperations } from './actions/variable/variable.fields';
import { router } from './actions/router';
import type {
  BConnectEndpointItem,
  BConnectJobDefinitionItem,
  BConnectNamedItem,
  BConnectPagedResponse,
} from './utils/types';

export class Baramundi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'baramundi',
    name: 'baramundi',
    icon: 'file:baramundi.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with baramundi Management Suite via bConnect API',
    defaults: {
      name: 'baramundi',
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
          { name: 'AD Group', value: 'adGroup', description: 'Query Active Directory groups' },
          { name: 'AD Object', value: 'adObject', description: 'Query Active Directory objects and memberships' },
          { name: 'AD User', value: 'adUser', description: 'Query Active Directory users' },
          {
            name: 'Asset',
            value: 'asset',
            description: 'Manage assets in baramundi',
          },
          { name: 'Asset Folder', value: 'assetFolder', description: 'Manage asset stock and type folders' },
          { name: 'Asset Type', value: 'assetType', description: 'Manage asset type definitions' },
          {
            name: 'Compliance',
            value: 'compliance',
            description: 'Query compliance rules, vulnerabilities, and violations (requires bMS 26R1+)',
          },
          {
            name: 'Defense Control',
            value: 'defenseControl',
            description: 'Manage BitLocker, local admin accounts, and Microsoft Defender',
          },
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
            name: 'Security',
            value: 'bmsecurity',
            description: 'Manage security groups, profiles, and access rights',
          },
          {
            name: 'Server Management',
            value: 'serverManagement',
            description: 'Manage baramundi server infrastructure (gateways, DIPs, cloud connectors)',
          },
          {
            name: 'Software',
            value: 'software',
            description: 'Query installed software inventory',
          },
          { name: 'Software Bundle', value: 'softwareBundle', description: 'Manage software bundles and applications' },
          {
            name: 'Static Group',
            value: 'staticGroup',
            description: 'Manage static endpoint groups',
          },
          {
            name: 'Typed Endpoint',
            value: 'typedEndpoint',
            description: 'Manage endpoints by platform type (Windows, Android, iOS, Linux, Mac, Network)',
          },
          {
            name: 'Universal Dynamic Group',
            value: 'universalDynamicGroups',
            description: 'Manage universal dynamic groups and folders (requires bMS 26R1+)',
          },
          {
            name: 'Update Management',
            value: 'updateManagement',
            description: 'Manage Windows endpoint update profiles',
          },
          {
            name: 'Variable',
            value: 'variable',
            description: 'Manage baramundi variables and variable instances',
          },
        ],
        default: 'endpoint',
      },
      // Operations
      ...complianceOperations,
      ...universalDynamicGroupsOperations,
      ...activeDirectoryOperations,
      ...adUserOperations,
      ...adGroupOperations,
      ...adObjectOperations,
      ...orgUnitOperations,
      ...assetOperations25R2Trimmed,
      ...assetOperations26R1Trimmed,
      ...assetTypeOperations,
      ...assetFolderOperations,
      ...defenseControlOperations,
      ...dynamicGroupOperations,
      ...endpointOperations25R2,
      ...endpointOperations26R1,
      ...logicalGroupOperations,
      ...maintenanceWindowOperations25R2,
      ...maintenanceWindowOperations26R1,
      ...staticGroupOperations,
      ...typedEndpointOperations25R2,
      ...typedEndpointOperations26R1,
      ...jobDefinitionOperations,
      ...jobFolderOperations,
      ...jobInstanceOperations,
      ...kioskReleaseOperations,
      ...operatingSystemOperations,
      ...serverManagementOperations,
      ...microserviceOperations,
      ...bmsecurityOperations,
      ...softwareOperations25R2Trimmed,
      ...softwareOperations26R1Trimmed,
      ...softwareBundleOperations,
      ...updateManagementOperations,
      ...variableOperations,
      // Fields
      ...complianceFields,
      ...universalDynamicGroupsFields,
      ...activeDirectoryFields,
      ...adUserFields,
      ...adGroupFields,
      ...adObjectFields,
      ...orgUnitFields,
      ...assetFields,
      ...assetTypeFields,
      ...assetFolderFields,
      ...defenseControlFields,
      ...dynamicGroupFields,
      ...endpointFields,
      ...logicalGroupFields,
      ...maintenanceWindowFields,
      ...staticGroupFields,
      ...typedEndpointFields,
      ...jobDefinitionFields,
      ...jobFolderFields,
      ...jobInstanceFields,
      ...kioskReleaseFields,
      ...operatingSystemFields,
      ...serverManagementFields,
      ...microserviceFields,
      ...bmsecurityFields,
      ...softwareFields,
      ...softwareBundleFields,
      ...updateManagementFields,
      ...variableFields,
    ],
  };

  methods = {
    loadOptions: {
      // Get list of endpoints for dropdown selection
      async getEndpoints(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const { apiRequest } = await import('./transport/requestApi');

        try {
          // ILoadOptionsFunctions is structurally compatible with IExecuteFunctions
          // for the httpRequest + getCredentials subset that apiRequest uses.
          const response = await apiRequest.call(
            this as unknown as IExecuteFunctions,
            'GET',
            '/endpoints/v2.0/Endpoints',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'DisplayName asc' }
          );

          const paged = response as unknown as BConnectPagedResponse<BConnectEndpointItem>;
          const data = paged.data ?? [];
          const truncated = paged.hasNextPage ?? false;

          const options: INodePropertyOptions[] = data.map((endpoint) => ({
            name: `${endpoint.displayName}${endpoint.hostName ? ` (${endpoint.hostName})` : ''}`,
            value: endpoint.id,
          }));

          if (truncated) {
            options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
          }

          return options;
        } catch (_error) {
          // Return empty array if API call fails
          return [];
        }
      },

      // Get list of job definitions for dropdown selection
      async getJobDefinitions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const { apiRequest } = await import('./transport/requestApi');

        try {
          const response = await apiRequest.call(
            this as unknown as IExecuteFunctions,
            'GET',
            '/jobs/v2.0/JobDefinitions',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const paged = response as unknown as BConnectPagedResponse<BConnectJobDefinitionItem>;
          const data = paged.data ?? [];
          const truncated = paged.hasNextPage ?? false;

          const options: INodePropertyOptions[] = data.map((job) => ({
            name: `${job.name}${job.type ? ` [${job.type}]` : ''}`,
            value: job.id,
          }));

          if (truncated) {
            options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
          }

          return options;
        } catch (_error) {
          // Return empty array if API call fails
          return [];
        }
      },

      // Get list of organizational units for dropdown selection
      async getOrgUnits(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const { apiRequest } = await import('./transport/requestApi');

        try {
          const response = await apiRequest.call(
            this as unknown as IExecuteFunctions,
            'GET',
            '/organizationalunits/v2.0/OrganizationalUnits',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const paged = response as unknown as BConnectPagedResponse<BConnectNamedItem>;
          const data = paged.data ?? [];
          const truncated = paged.hasNextPage ?? false;

          const options: INodePropertyOptions[] = data.map((orgUnit) => ({
            name: orgUnit.name ?? orgUnit.id,
            value: orgUnit.id,
          }));

          if (truncated) {
            options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
          }

          return options;
        } catch (_error) {
          // Return empty array if API call fails
          return [];
        }
      },

      // Get list of logical groups for dropdown selection
      async getLogicalGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const { apiRequest } = await import('./transport/requestApi');

        try {
          const response = await apiRequest.call(
            this as unknown as IExecuteFunctions,
            'GET',
            '/endpoints/v2.0/LogicalGroups',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const paged = response as unknown as BConnectPagedResponse<BConnectNamedItem>;
          const data = paged.data ?? [];
          const truncated = paged.hasNextPage ?? false;

          const options: INodePropertyOptions[] = data.map((group) => ({
            name: group.name ?? group.id,
            value: group.id,
          }));

          if (truncated) {
            options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
          }

          return options;
        } catch (_error) {
          // Return empty array if API call fails
          return [];
        }
      },

      // Get list of static groups for dropdown selection
      async getStaticGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const { apiRequest } = await import('./transport/requestApi');

        try {
          const response = await apiRequest.call(
            this as unknown as IExecuteFunctions,
            'GET',
            '/endpoints/v2.0/StaticGroups',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const paged = response as unknown as BConnectPagedResponse<BConnectNamedItem>;
          const data = paged.data ?? [];
          const truncated = paged.hasNextPage ?? false;

          const options: INodePropertyOptions[] = data.map((group) => ({
            name: group.name ?? group.id,
            value: group.id,
          }));

          if (truncated) {
            options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
          }

          return options;
        } catch (_error) {
          // Return empty array if API call fails
          return [];
        }
      },

      // Get list of dynamic groups for dropdown selection
      async getDynamicGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const { apiRequest } = await import('./transport/requestApi');

        try {
          const response = await apiRequest.call(
            this as unknown as IExecuteFunctions,
            'GET',
            '/endpoints/v2.0/DynamicGroups',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const paged = response as unknown as BConnectPagedResponse<BConnectNamedItem>;
          const data = paged.data ?? [];
          const truncated = paged.hasNextPage ?? false;

          const options: INodePropertyOptions[] = data.map((group) => ({
            name: group.name ?? group.id,
            value: group.id,
          }));

          if (truncated) {
            options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
          }

          return options;
        } catch (_error) {
          // Return empty array if API call fails
          return [];
        }
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await router.call(this);
  }
}
