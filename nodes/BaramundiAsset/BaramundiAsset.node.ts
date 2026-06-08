import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {
  assetFields,
  assetOperations25R2Trimmed,
  assetOperations26R1Trimmed,
  assetTypeOperations,
  assetTypeFields,
  assetFolderOperations,
  assetFolderFields,
} from './actions/asset/asset.fields';
import { router } from './actions/router';
import { endpointSearch } from '../shared/loadOptions';

export class BaramundiAsset implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Baramundi Asset',
    name: 'baramundiAsset',
    icon: 'file:baramundi.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage assets, asset types, and folders via bConnect API',
    defaults: {
      name: 'Baramundi Asset',
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
            name: 'Asset',
            value: 'asset',
            description: 'Manage assets in baramundi',
          },
          {
            name: 'Asset Folder',
            value: 'assetFolder',
            description: 'Manage asset stock and type folders',
          },
          {
            name: 'Asset Type',
            value: 'assetType',
            description: 'Manage asset type definitions',
          },
        ],
        default: 'asset',
      },
      // Operations
      ...assetOperations25R2Trimmed,
      ...assetOperations26R1Trimmed,
      ...assetTypeOperations,
      ...assetFolderOperations,
      // Fields
      ...assetFields,
      ...assetTypeFields,
      ...assetFolderFields,
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
