import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { endpoint } from './endpoint';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;

  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      let responseData: INodeExecutionData[] = [];

      switch (resource) {
        case 'endpoint':
          switch (operation) {
            case 'create':
              responseData = await endpoint.create.call(this, i);
              break;
            case 'delete':
              responseData = await endpoint.deleteEndpoint.call(this, i);
              break;
            case 'get':
              responseData = await endpoint.get.call(this, i);
              break;
            case 'getMany':
              responseData = await endpoint.getMany.call(this, i);
              break;
            case 'search':
              responseData = await endpoint.search.call(this, i);
              break;
            case 'startEnrollment':
              responseData = await endpoint.startEnrollment.call(this, i);
              break;
            case 'triggerIntuneInstallation':
              responseData = await endpoint.triggerIntuneInstallation.call(this, i);
              break;
            case 'update':
              responseData = await endpoint.update.call(this, i);
              break;
            case 'setEntraIdData':
              responseData = await endpoint.setEntraIdData.call(this, i);
              break;
            case 'deleteEntraIdData':
              responseData = await endpoint.deleteEntraIdData.call(this, i);
              break;
            case 'getEntraIdDataByDeviceId':
              responseData = await endpoint.getEntraIdDataByDeviceId.call(this, i);
              break;
            case 'getUnmanagedEndpoints':
              responseData = await endpoint.getUnmanagedEndpoints.call(this, i);
              break;
            case 'getUnmanagedEndpoint':
              responseData = await endpoint.getUnmanagedEndpoint.call(this, i);
              break;
            case 'deleteUnmanagedEndpoint':
              responseData = await endpoint.deleteUnmanagedEndpoint.call(this, i);
              break;
            case 'getEndpointsByLogicalGroup':
              responseData = await endpoint.getEndpointsByLogicalGroup.call(this, i);
              break;
            case 'getEndpointsByStaticGroup':
              responseData = await endpoint.getEndpointsByStaticGroup.call(this, i);
              break;
            case 'getEndpointsByDynamicGroup':
              responseData = await endpoint.getEndpointsByDynamicGroup.call(this, i);
              break;
            case 'getEndpointsByUDG':
              responseData = await endpoint.getEndpointsByUDG.call(this, i);
              break;
            case 'getEndpointsByADUser':
              responseData = await endpoint.getEndpointsByADUser.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "endpoint"`,
              );
          }
          break;

        case 'logicalGroup':
          switch (operation) {
            case 'getLogicalGroup':
              responseData = await endpoint.getLogicalGroup.call(this, i);
              break;
            case 'getLogicalGroups':
              responseData = await endpoint.getLogicalGroups.call(this, i);
              break;
            case 'createLogicalGroup':
              responseData = await endpoint.createLogicalGroup.call(this, i);
              break;
            case 'updateLogicalGroup':
              responseData = await endpoint.updateLogicalGroup.call(this, i);
              break;
            case 'deleteLogicalGroup':
              responseData = await endpoint.deleteLogicalGroup.call(this, i);
              break;
            case 'getLogicalGroupSubGroups':
              responseData = await endpoint.getLogicalGroupSubGroups.call(this, i);
              break;
            case 'getEndpointsByLogicalGroup':
              responseData = await endpoint.getEndpointsByLogicalGroup.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "logicalGroup"`,
              );
          }
          break;

        case 'staticGroup':
          switch (operation) {
            case 'getStaticGroup':
              responseData = await endpoint.getStaticGroup.call(this, i);
              break;
            case 'getStaticGroups':
              responseData = await endpoint.getStaticGroups.call(this, i);
              break;
            case 'createStaticGroup':
              responseData = await endpoint.createStaticGroup.call(this, i);
              break;
            case 'updateStaticGroup':
              responseData = await endpoint.updateStaticGroup.call(this, i);
              break;
            case 'deleteStaticGroup':
              responseData = await endpoint.deleteStaticGroup.call(this, i);
              break;
            case 'getEndpointsByStaticGroup':
              responseData = await endpoint.getEndpointsByStaticGroup.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "staticGroup"`,
              );
          }
          break;

        case 'dynamicGroup':
          switch (operation) {
            case 'getDynamicGroup':
              responseData = await endpoint.getDynamicGroup.call(this, i);
              break;
            case 'getDynamicGroups':
              responseData = await endpoint.getDynamicGroups.call(this, i);
              break;
            case 'getEndpointsByDynamicGroup':
              responseData = await endpoint.getEndpointsByDynamicGroup.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "dynamicGroup"`,
              );
          }
          break;

        case 'maintenanceWindow':
          switch (operation) {
            case 'createEndpointMaintenanceWindow':
              responseData = await endpoint.createEndpointMaintenanceWindow.call(this, i);
              break;
            case 'updateEndpointMaintenanceWindow':
              responseData = await endpoint.updateEndpointMaintenanceWindow.call(this, i);
              break;
            case 'deleteEndpointMaintenanceWindow':
              responseData = await endpoint.deleteEndpointMaintenanceWindow.call(this, i);
              break;
            case 'getEndpointMaintenanceWindow':
              responseData = await endpoint.getEndpointMaintenanceWindow.call(this, i);
              break;
            case 'putEndpointMaintenanceWindow':
              responseData = await endpoint.putEndpointMaintenanceWindow.call(this, i);
              break;
            case 'createGroupMaintenanceWindow':
              responseData = await endpoint.createGroupMaintenanceWindow.call(this, i);
              break;
            case 'updateGroupMaintenanceWindow':
              responseData = await endpoint.updateGroupMaintenanceWindow.call(this, i);
              break;
            case 'deleteGroupMaintenanceWindow':
              responseData = await endpoint.deleteGroupMaintenanceWindow.call(this, i);
              break;
            case 'getGroupMaintenanceWindow':
              responseData = await endpoint.getGroupMaintenanceWindow.call(this, i);
              break;
            case 'putGroupMaintenanceWindow':
              responseData = await endpoint.putGroupMaintenanceWindow.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "maintenanceWindow"`,
              );
          }
          break;

        case 'typedEndpoint':
          switch (operation) {
            case 'getTypedEndpoints':
              responseData = await endpoint.getTypedEndpoints.call(this, i);
              break;
            case 'getTypedEndpoint':
              responseData = await endpoint.getTypedEndpoint.call(this, i);
              break;
            case 'updateTypedEndpoint':
              responseData = await endpoint.updateTypedEndpoint.call(this, i);
              break;
            case 'deleteTypedEndpoint':
              responseData = await endpoint.deleteTypedEndpoint.call(this, i);
              break;
            case 'startTypedEnrollment':
              responseData = await endpoint.startTypedEnrollment.call(this, i);
              break;
            case 'getTypedEndpointsByGroup':
              responseData = await endpoint.getTypedEndpointsByGroup.call(this, i);
              break;
            case 'getIndustrialEndpoints':
              responseData = await endpoint.getIndustrialEndpoints.call(this, i);
              break;
            case 'getIndustrialEndpoint':
              responseData = await endpoint.getIndustrialEndpoint.call(this, i);
              break;
            case 'createIndustrialEndpoint':
              responseData = await endpoint.createIndustrialEndpoint.call(this, i);
              break;
            case 'updateIndustrialEndpoint':
              responseData = await endpoint.updateIndustrialEndpoint.call(this, i);
              break;
            case 'deleteIndustrialEndpoint':
              responseData = await endpoint.deleteIndustrialEndpoint.call(this, i);
              break;
            case 'getIndustrialEndpointsByGroup':
              responseData = await endpoint.getIndustrialEndpointsByGroup.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "typedEndpoint"`,
              );
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
