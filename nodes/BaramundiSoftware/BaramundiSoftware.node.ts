import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import {
  softwareFields,
  softwareOperations25R2Trimmed,
  softwareOperations26R1Trimmed,
  softwareBundleOperations,
  softwareBundleFields,
} from './actions/software/software.fields';
import { thresholdOperations, thresholdFields } from './actions/threshold/threshold.fields';
import { universalDynamicGroupsOperations, universalDynamicGroupsFields } from './actions/universalDynamicGroups/universalDynamicGroups.fields';
import { updateManagementOperations, updateManagementFields } from './actions/updateManagement/updateManagement.fields';
import { variableOperations, variableFields } from './actions/variable/variable.fields';
import { SINCE_26R1, SINCE_26R2, versionedOptions } from '../shared/utils/versionGating';
import { router } from './actions/router';
import { endpointSearch } from '../shared/loadOptions';

export class BaramundiSoftware implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'baramundi Software',
    name: 'baramundiSoftware',
    icon: { light: 'file:../../icons/baramundi-management-suite.svg', dark: 'file:../../icons/baramundi-management-suite.svg' },
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage software, bundles, updates, variables, universal dynamic groups and their thresholds via bConnect API',
    defaults: {
      name: 'baramundi Software',
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
    // Universal Dynamic Groups and Software Bundles exist from 26R1 on, their thresholds from 26R2 on
    properties: versionedOptions([
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
            name: 'Universal Dynamic Group Threshold',
            value: 'threshold',
            description: 'Manage endpoint count thresholds of universal dynamic groups (requires bMS 26R2+)',
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
      ...thresholdOperations,
      ...updateManagementOperations,
      ...variableOperations,
      // Fields
      ...softwareFields,
      ...softwareBundleFields,
      ...universalDynamicGroupsFields,
      ...thresholdFields,
      ...updateManagementFields,
      ...variableFields,
    ], { universalDynamicGroups: SINCE_26R1, softwareBundle: SINCE_26R1, threshold: SINCE_26R2 }, 'resource'),
  };

  methods = {
    listSearch: {
      endpointSearch,
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    return await router.call(this);
  }
}
