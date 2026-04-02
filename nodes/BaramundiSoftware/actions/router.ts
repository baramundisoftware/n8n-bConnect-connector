import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { software } from './software';
import { universalDynamicGroups } from './universalDynamicGroups';
import { updateManagement } from './updateManagement';
import { variable } from './variable';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;

  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      let responseData: INodeExecutionData[] = [];

      switch (resource) {
        case 'software':
          switch (operation) {
            case 'getInstalledWindowsSoftware': responseData = await software.getInstalledWindowsSoftware.call(this, i); break;
            case 'getInstalledSoftwareByEndpoint': responseData = await software.getInstalledSoftwareByEndpoint.call(this, i); break;
            case 'getInstalledSoftwareByLogicalGroup': responseData = await software.getInstalledSoftwareByLogicalGroup.call(this, i); break;
            case 'getInstalledSoftwareByUniversalDynamicGroup': responseData = await software.getInstalledSoftwareByUniversalDynamicGroup.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "software"`);
          }
          break;

        case 'softwareBundle':
          switch (operation) {
            case 'getBundles': responseData = await software.getBundles.call(this, i); break;
            case 'getBundle': responseData = await software.getBundle.call(this, i); break;
            case 'createBundle': responseData = await software.createBundle.call(this, i); break;
            case 'deleteBundle': responseData = await software.deleteBundle.call(this, i); break;
            case 'getBundleFolders': responseData = await software.getBundleFolders.call(this, i); break;
            case 'getBundleFolder': responseData = await software.getBundleFolder.call(this, i); break;
            case 'getBundleSubFolders': responseData = await software.getBundleSubFolders.call(this, i); break;
            case 'createBundleFolder': responseData = await software.createBundleFolder.call(this, i); break;
            case 'deleteBundleFolder': responseData = await software.deleteBundleFolder.call(this, i); break;
            case 'getBundleApplicationsByBundle': responseData = await software.getBundleApplicationsByBundle.call(this, i); break;
            case 'addApplicationToBundle': responseData = await software.addApplicationToBundle.call(this, i); break;
            case 'replaceApplicationInBundle': responseData = await software.replaceApplicationInBundle.call(this, i); break;
            case 'updateBundleFolder': responseData = await software.updateBundleFolder.call(this, i); break;
            case 'getBundleApplications': responseData = await software.getBundleApplications.call(this, i); break;
            case 'deleteBundleApplication': responseData = await software.deleteBundleApplication.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "softwareBundle"`);
          }
          break;

        case 'updateManagement':
          switch (operation) {
            case 'getWindowsEndpoints': responseData = await updateManagement.getWindowsEndpoints.call(this, i); break;
            case 'getWindowsEndpoint': responseData = await updateManagement.getWindowsEndpoint.call(this, i); break;
            case 'updateWindowsEndpoint': responseData = await updateManagement.updateWindowsEndpoint.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "updateManagement"`);
          }
          break;

        case 'variable':
          switch (operation) {
            case 'getVariableDefinitions': responseData = await variable.getVariableDefinitions.call(this, i); break;
            case 'getVariableDefinition': responseData = await variable.getVariableDefinition.call(this, i); break;
            case 'createVariableDefinition': responseData = await variable.createVariableDefinition.call(this, i); break;
            case 'updateVariableDefinition': responseData = await variable.updateVariableDefinition.call(this, i); break;
            case 'deleteVariableDefinition': responseData = await variable.deleteVariableDefinition.call(this, i); break;
            case 'getVariableInstances': responseData = await variable.getVariableInstances.call(this, i); break;
            case 'getVariableInstance': responseData = await variable.getVariableInstance.call(this, i); break;
            case 'updateVariableInstance': responseData = await variable.updateVariableInstance.call(this, i); break;
            case 'getVariableInstancesByEndpoint': responseData = await variable.getVariableInstancesByEndpoint.call(this, i); break;
            case 'getVariableInstancesByLogicalGroup': responseData = await variable.getVariableInstancesByLogicalGroup.call(this, i); break;
            case 'getVariableInstancesByADObject': responseData = await variable.getVariableInstancesByADObject.call(this, i); break;
            case 'getVariableInstancesByApplication': responseData = await variable.getVariableInstancesByApplication.call(this, i); break;
            case 'getVariableInstancesByJobDefinition': responseData = await variable.getVariableInstancesByJobDefinition.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "variable"`);
          }
          break;

        case 'universalDynamicGroups':
          switch (operation) {
            case 'getMany': responseData = await universalDynamicGroups.getMany.call(this, i); break;
            case 'get': responseData = await universalDynamicGroups.get.call(this, i); break;
            case 'getFolders': responseData = await universalDynamicGroups.getFolders.call(this, i); break;
            case 'getFolder': responseData = await universalDynamicGroups.getFolder.call(this, i); break;
            case 'getSubFolders': responseData = await universalDynamicGroups.getSubFolders.call(this, i); break;
            case 'getGroupsByFolder': responseData = await universalDynamicGroups.getGroupsByFolder.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "universalDynamicGroups"`);
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
      throw error;
    }
  }

  return [returnData];
}
