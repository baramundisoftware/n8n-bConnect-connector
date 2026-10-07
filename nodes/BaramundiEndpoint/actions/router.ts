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
        case 'endpoint': {
          const bmsVersionEndpoint = this.getNodeParameter('bmsVersion', 0, '26R1') as string;
          const industrialOps = new Set([
            'getIndustrialEndpoints',
            'getIndustrialEndpoint',
            'createIndustrialEndpoint',
            'updateIndustrialEndpoint',
            'deleteIndustrialEndpoint',
            'getIndustrialEndpointsByGroup',
          ]);
          if (bmsVersionEndpoint === '26R1' && industrialOps.has(operation)) {
            throw new NodeOperationError(
              this.getNode(),
              `Operation "${operation}" is only available in bMS 25R2. ` +
                'Industrial Endpoints are not supported in bMS 26R1.',
              { itemIndex: i },
            );
          }
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
            case 'getEndpointsByGroup':
              responseData = await endpoint.getEndpointsByGroup.call(this, i);
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
                `Unknown operation "${operation}" for resource "endpoint"`,
              );
          }
          break;
        }

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

        case 'maintenanceWindow': {
          const bmsVersion = this.getNodeParameter('bmsVersion', 0, '26R1') as string;
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
              if (bmsVersion === '26R1') {
                throw new NodeOperationError(
                  this.getNode(),
                  'Operation "Replace Endpoint Maintenance Window" (PUT) is only available in bMS 25R2. ' +
                    'In bMS 26R1, use "Update Endpoint Maintenance Window" (PATCH) instead. ' +
                    'Note: the request body format differs between PUT and PATCH.',
                  { itemIndex: i },
                );
              }
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
              if (bmsVersion === '26R1') {
                throw new NodeOperationError(
                  this.getNode(),
                  'Operation "Replace Group Maintenance Window" (PUT) is only available in bMS 25R2. ' +
                    'In bMS 26R1, use "Update Group Maintenance Window" (PATCH) instead. ' +
                    'Note: the request body format differs between PUT and PATCH.',
                  { itemIndex: i },
                );
              }
              responseData = await endpoint.putGroupMaintenanceWindow.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "maintenanceWindow"`,
              );
          }
          break;
        }

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
