import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { toItemError } from '../../shared/utils/nodeError';

import { asset } from './asset';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;

  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      let responseData: INodeExecutionData[] = [];

      switch (resource) {
        case 'asset':
          switch (operation) {
            case 'get': responseData = await asset.get.call(this, i); break;
            case 'getMany': responseData = await asset.getMany.call(this, i); break;
            case 'create': responseData = await asset.create.call(this, i); break;
            case 'update': responseData = await asset.update.call(this, i); break;
            case 'delete': responseData = await asset.deleteAsset.call(this, i); break;
            case 'getAssetsByEndpoint': responseData = await asset.getAssetsByEndpoint.call(this, i); break;
            case 'getAssetsByLogicalGroup': responseData = await asset.getAssetsByLogicalGroup.call(this, i); break;
            case 'getAssetsByADObject': responseData = await asset.getAssetsByADObject.call(this, i); break;
            case 'getAssetsByOrgUnit': responseData = await asset.getAssetsByOrgUnit.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "asset"`);
          }
          break;

        case 'assetType':
          switch (operation) {
            case 'getAssetTypes': responseData = await asset.getAssetTypes.call(this, i); break;
            case 'getAssetType': responseData = await asset.getAssetType.call(this, i); break;
            case 'createAssetType': responseData = await asset.createAssetType.call(this, i); break;
            case 'deleteAssetType': responseData = await asset.deleteAssetType.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "assetType"`);
          }
          break;

        case 'assetFolder':
          switch (operation) {
            case 'getAssetStockAssets': responseData = await asset.getAssetStockAssets.call(this, i); break;
            case 'getAssetStockFolders': responseData = await asset.getAssetStockFolders.call(this, i); break;
            case 'createAssetStockFolder': responseData = await asset.createAssetStockFolder.call(this, i); break;
            case 'updateAssetStockFolder': responseData = await asset.updateAssetStockFolder.call(this, i); break;
            case 'deleteAssetStockFolder': responseData = await asset.deleteAssetStockFolder.call(this, i); break;
            case 'getAssetStockFolder': responseData = await asset.getAssetStockFolder.call(this, i); break;
            case 'getAssetStockSubFolders': responseData = await asset.getAssetStockSubFolders.call(this, i); break;
            case 'getAssetTypeFolders': responseData = await asset.getAssetTypeFolders.call(this, i); break;
            case 'getAssetTypeFolder': responseData = await asset.getAssetTypeFolder.call(this, i); break;
            case 'createAssetTypeFolder': responseData = await asset.createAssetTypeFolder.call(this, i); break;
            case 'updateAssetTypeFolder': responseData = await asset.updateAssetTypeFolder.call(this, i); break;
            case 'deleteAssetTypeFolder': responseData = await asset.deleteAssetTypeFolder.call(this, i); break;
            case 'getAssetTypeFolderSubFolders': responseData = await asset.getAssetTypeFolderSubFolders.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "assetFolder"`);
          }
          break;

        default:
          throw new NodeOperationError(this.getNode(), `Unknown resource "${resource}"`);
      }

      returnData.push(...responseData);
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
        continue;
      }
      throw toItemError(this.getNode(), error, i);
    }
  }

  return [returnData];
}
