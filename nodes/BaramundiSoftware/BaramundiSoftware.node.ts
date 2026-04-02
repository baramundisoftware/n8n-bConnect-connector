import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
  softwareFields,
  softwareOperations25R2Trimmed,
  softwareOperations26R1Trimmed,
  softwareBundleOperations,
  softwareBundleFields,
} from './actions/software/software.fields';
import { universalDynamicGroupsOperations, universalDynamicGroupsFields } from './actions/universalDynamicGroups/universalDynamicGroups.fields';
import { updateManagementOperations, updateManagementFields } from './actions/updateManagement/updateManagement.fields';
import { variableOperations, variableFields } from './actions/variable/variable.fields';
import { router } from './actions/router';

export class BaramundiSoftware implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Baramundi Software',
    name: 'baramundiSoftware',
    icon: 'file:baramundi.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage software, bundles, updates, variables, and universal dynamic groups via bConnect API',
    defaults: {
      name: 'Baramundi Software',
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
            name: 'Software',
            value: 'software',
            description: 'Query installed software inventory',
          },
          {
            name: 'Software Bundle',
            value: 'softwareBundle',
            description: 'Manage software bundles and applications',
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
        default: 'software',
      },
      // Operations
      ...softwareOperations25R2Trimmed,
      ...softwareOperations26R1Trimmed,
      ...softwareBundleOperations,
      ...universalDynamicGroupsOperations,
      ...updateManagementOperations,
      ...variableOperations,
      // Fields
      ...softwareFields,
      ...softwareBundleFields,
      ...universalDynamicGroupsFields,
      ...updateManagementFields,
      ...variableFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await router.call(this);
  }
}
