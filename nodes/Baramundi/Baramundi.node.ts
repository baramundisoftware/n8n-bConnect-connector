import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { activeDirectoryFields, activeDirectoryOperations } from './actions/activeDirectory/activeDirectory.fields';
import { assetFields, assetOperations25R2, assetOperations26R1 } from './actions/asset/asset.fields';
import { complianceFields, complianceOperations } from './actions/compliance/compliance.fields';
import { universalDynamicGroupsFields, universalDynamicGroupsOperations } from './actions/universalDynamicGroups/universalDynamicGroups.fields';
import { defenseControlFields, defenseControlOperations } from './actions/defenseControl/defenseControl.fields';
import { endpointFields, endpointOperations25R2, endpointOperations26R1 } from './actions/endpoint/endpoint.fields';
import { jobFields, jobOperations } from './actions/job/job.fields';
import { operatingSystemFields, operatingSystemOperations } from './actions/operatingSystem/operatingSystem.fields';
import { serverManagementFields, serverManagementOperations } from './actions/serverManagement/serverManagement.fields';
import { softwareFields, softwareOperations25R2, softwareOperations26R1 } from './actions/software/software.fields';
import { updateManagementFields, updateManagementOperations } from './actions/updateManagement/updateManagement.fields';
import { variableFields, variableOperations } from './actions/variable/variable.fields';
import { router } from './actions/router';

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
          {
            name: 'Active Directory',
            value: 'activeDirectory',
            description: 'Query Active Directory groups, users, and objects',
          },
          {
            name: 'Asset',
            value: 'asset',
            description: 'Manage assets in baramundi',
          },
          {
            name: 'Defense Control',
            value: 'defenseControl',
            description: 'Manage BitLocker, local admin accounts, and Microsoft Defender',
          },
          {
            name: 'Endpoint',
            value: 'endpoint',
            description: 'Manage endpoints (devices) in baramundi',
          },
          {
            name: 'Job',
            value: 'job',
            description: 'Manage jobs and job execution',
          },
          {
            name: 'Operating System',
            value: 'operatingSystem',
            description: 'Manage OS folders and endpoint OS configurations',
          },
          {
            name: 'Server Management',
            value: 'serverManagement',
            description: 'Manage baramundi server infrastructure and security',
          },
          {
            name: 'Software',
            value: 'software',
            description: 'Query installed Windows software inventory',
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
          {
            name: 'Compliance',
            value: 'compliance',
            description: 'Query compliance rules, vulnerabilities, and violations (requires bMS 26R1+)',
          },
          {
            name: 'Universal Dynamic Group',
            value: 'universalDynamicGroups',
            description: 'Manage universal dynamic groups and folders (requires bMS 26R1+)',
          },
        ],
        default: 'endpoint',
      },
      // Operations
      ...complianceOperations,
      ...universalDynamicGroupsOperations,
      ...activeDirectoryOperations,
      ...assetOperations25R2,
      ...assetOperations26R1,
      ...defenseControlOperations,
      ...endpointOperations25R2,
      ...endpointOperations26R1,
      ...jobOperations,
      ...operatingSystemOperations,
      ...serverManagementOperations,
      ...softwareOperations25R2,
      ...softwareOperations26R1,
      ...updateManagementOperations,
      ...variableOperations,
      // Fields
      ...complianceFields,
      ...universalDynamicGroupsFields,
      ...activeDirectoryFields,
      ...assetFields,
      ...defenseControlFields,
      ...endpointFields,
      ...jobFields,
      ...operatingSystemFields,
      ...serverManagementFields,
      ...softwareFields,
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
          const response = await apiRequest.call(
            this as any,
            'GET',
            '/endpoints/v2.0/Endpoints',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'DisplayName asc' }
          );

          const data = (response.data as any[]) || [];
          const truncated = (response.hasNextPage as boolean) || false;

          const options: INodePropertyOptions[] = data.map((endpoint: any) => ({
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
            this as any,
            'GET',
            '/jobs/v2.0/JobDefinitions',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const data = (response.data as any[]) || [];
          const truncated = (response.hasNextPage as boolean) || false;

          const options: INodePropertyOptions[] = data.map((job: any) => ({
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
            this as any,
            'GET',
            '/organizationalunits/v2.0/OrganizationalUnits',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const data = (response.data as any[]) || [];
          const truncated = (response.hasNextPage as boolean) || false;

          const options: INodePropertyOptions[] = data.map((orgUnit: any) => ({
            name: orgUnit.name || orgUnit.id,
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
            this as any,
            'GET',
            '/endpoints/v2.0/LogicalGroups',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const data = (response.data as any[]) || [];
          const truncated = (response.hasNextPage as boolean) || false;

          const options: INodePropertyOptions[] = data.map((group: any) => ({
            name: group.name || group.id,
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
            this as any,
            'GET',
            '/endpoints/v2.0/StaticGroups',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const data = (response.data as any[]) || [];
          const truncated = (response.hasNextPage as boolean) || false;

          const options: INodePropertyOptions[] = data.map((group: any) => ({
            name: group.name || group.id,
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
            this as any,
            'GET',
            '/endpoints/v2.0/DynamicGroups',
            {},
            { PageSize: 100, Page: 0, OrderBy: 'Name asc' }
          );

          const data = (response.data as any[]) || [];
          const truncated = (response.hasNextPage as boolean) || false;

          const options: INodePropertyOptions[] = data.map((group: any) => ({
            name: group.name || group.id,
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
