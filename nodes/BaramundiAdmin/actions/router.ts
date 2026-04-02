import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { activeDirectory } from './activeDirectory';
import { serverManagement } from './serverManagement';
import { operatingSystem } from './operatingSystem';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;

  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      let responseData: INodeExecutionData[] = [];

      switch (resource) {
        case 'adUser':
          switch (operation) {
            case 'getADUsers': responseData = await activeDirectory.getADUsers.call(this, i); break;
            case 'getADUser': responseData = await activeDirectory.getADUser.call(this, i); break;
            case 'getADUsersByGroup': responseData = await activeDirectory.getADUsersByGroup.call(this, i); break;
            case 'getADUsersByOrgUnit': responseData = await activeDirectory.getADUsersByOrgUnit.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "adUser"`);
          }
          break;

        case 'adGroup':
          switch (operation) {
            case 'getADGroups': responseData = await activeDirectory.getADGroups.call(this, i); break;
            case 'getADGroup': responseData = await activeDirectory.getADGroup.call(this, i); break;
            case 'getADGroupsByADGroup': responseData = await activeDirectory.getADGroupsByADGroup.call(this, i); break;
            case 'getADGroupsByOrgUnit': responseData = await activeDirectory.getADGroupsByOrgUnit.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "adGroup"`);
          }
          break;

        case 'adObject':
          switch (operation) {
            case 'getADObjects': responseData = await activeDirectory.getADObjects.call(this, i); break;
            case 'getADObject': responseData = await activeDirectory.getADObject.call(this, i); break;
            case 'getADObjectsByADGroup': responseData = await activeDirectory.getADObjectsByADGroup.call(this, i); break;
            case 'getADObjectsByOrgUnit': responseData = await activeDirectory.getADObjectsByOrgUnit.call(this, i); break;
            case 'getADObjectMemberships': responseData = await activeDirectory.getADObjectMemberships.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "adObject"`);
          }
          break;

        case 'orgUnit':
          switch (operation) {
            case 'getOrgUnits': responseData = await activeDirectory.getOrgUnits.call(this, i); break;
            case 'getOrgUnit': responseData = await activeDirectory.getOrgUnit.call(this, i); break;
            case 'getOrgUnitsByOrgUnit': responseData = await activeDirectory.getOrgUnitsByOrgUnit.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "orgUnit"`);
          }
          break;

        case 'serverManagement':
          switch (operation) {
            case 'getManagementServer': responseData = await serverManagement.getManagementServer.call(this, i); break;
            case 'getGateway': responseData = await serverManagement.getGateway.call(this, i); break;
            case 'getDipStatus': responseData = await serverManagement.getDipStatus.call(this, i); break;
            case 'getVpnAppliance': responseData = await serverManagement.getVpnAppliance.call(this, i); break;
            case 'getCloudConnectors': responseData = await serverManagement.getCloudConnectors.call(this, i); break;
            case 'getPxeRelays': responseData = await serverManagement.getPxeRelays.call(this, i); break;
            case 'restartManagementServer': responseData = await serverManagement.restartManagementServer.call(this, i); break;
            case 'cancelScheduledRestart': responseData = await serverManagement.cancelScheduledRestart.call(this, i); break;
            case 'getDipsMSWCleanup': responseData = await serverManagement.getDipsMSWCleanup.call(this, i); break;
            case 'simulateMSWCleanup': responseData = await serverManagement.simulateMSWCleanup.call(this, i); break;
            case 'getApiKeys': responseData = await serverManagement.getApiKeys.call(this, i); break;
            case 'getDownloadJobs': responseData = await serverManagement.getDownloadJobs.call(this, i); break;
            case 'getDownloadJob': responseData = await serverManagement.getDownloadJob.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "serverManagement"`);
          }
          break;

        case 'microservice':
          switch (operation) {
            case 'getMicroservices': responseData = await serverManagement.getMicroservices.call(this, i); break;
            case 'getMicroservice': responseData = await serverManagement.getMicroservice.call(this, i); break;
            case 'startMicroservice': responseData = await serverManagement.startMicroservice.call(this, i); break;
            case 'stopMicroservice': responseData = await serverManagement.stopMicroservice.call(this, i); break;
            case 'restartMicroservice': responseData = await serverManagement.restartMicroservice.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "microservice"`);
          }
          break;

        case 'operatingSystem':
          switch (operation) {
            case 'getFolders': responseData = await operatingSystem.getFolders.call(this, i); break;
            case 'getFolder': responseData = await operatingSystem.getFolder.call(this, i); break;
            case 'getFoldersByFolderId': responseData = await operatingSystem.getFoldersByFolderId.call(this, i); break;
            case 'createFolder': responseData = await operatingSystem.createFolder.call(this, i); break;
            case 'updateFolder': responseData = await operatingSystem.updateFolder.call(this, i); break;
            case 'deleteFolder': responseData = await operatingSystem.deleteFolder.call(this, i); break;
            case 'getWindowsEndpoints': responseData = await operatingSystem.getWindowsEndpoints.call(this, i); break;
            case 'getWindowsEndpoint': responseData = await operatingSystem.getWindowsEndpoint.call(this, i); break;
            case 'updateWindowsEndpoint': responseData = await operatingSystem.updateWindowsEndpoint.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "operatingSystem"`);
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
