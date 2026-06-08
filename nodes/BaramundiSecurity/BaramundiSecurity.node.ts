import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
  bmsecurityOperations, bmsecurityFields,
} from './actions/serverManagement/serverManagement.fields';
import { complianceOperations, complianceFields } from './actions/compliance/compliance.fields';
import { defenseControlOperations, defenseControlFields } from './actions/defenseControl/defenseControl.fields';
import { router } from './actions/router';
import { endpointSearch } from '../shared/loadOptions';

export class BaramundiSecurity implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Baramundi Security',
    name: 'baramundiSecurity',
    icon: 'file:baramundi.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage security profiles, compliance rules, and defense controls via bConnect API',
    defaults: {
      name: 'Baramundi Security',
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
            name: 'Security',
            value: 'bmsecurity',
            description: 'Manage security groups, profiles, and access rights',
          },
        ],
        default: 'bmsecurity',
      },
      // Operations
      ...bmsecurityOperations,
      ...complianceOperations,
      ...defenseControlOperations,
      // Fields
      ...bmsecurityFields,
      ...complianceFields,
      ...defenseControlFields,
    ],
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
