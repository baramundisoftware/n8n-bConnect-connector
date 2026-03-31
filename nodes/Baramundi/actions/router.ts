import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { activeDirectory } from './activeDirectory';
import { asset } from './asset';
import { compliance } from './compliance';
import { universalDynamicGroups } from './universalDynamicGroups';
import { defenseControl } from './defenseControl';
import { endpoint } from './endpoint';
import { job } from './job';
import { operatingSystem } from './operatingSystem';
import { serverManagement } from './serverManagement';
import { software } from './software';
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
        case 'activeDirectory':
          switch (operation) {
            case 'getADGroups':
              responseData = await activeDirectory.getADGroups.call(this, i);
              break;
            case 'getADGroup':
              responseData = await activeDirectory.getADGroup.call(this, i);
              break;
            case 'getADGroupsByOrgUnit':
              responseData = await activeDirectory.getADGroupsByOrgUnit.call(this, i);
              break;
            case 'getADUsersByGroup':
              responseData = await activeDirectory.getADUsersByGroup.call(this, i);
              break;
            case 'getADUsers':
              responseData = await activeDirectory.getADUsers.call(this, i);
              break;
            case 'getADUser':
              responseData = await activeDirectory.getADUser.call(this, i);
              break;
            case 'getADObjects':
              responseData = await activeDirectory.getADObjects.call(this, i);
              break;
            case 'getADObject':
              responseData = await activeDirectory.getADObject.call(this, i);
              break;
            case 'getOrgUnits':
              responseData = await activeDirectory.getOrgUnits.call(this, i);
              break;
            case 'getOrgUnit':
              responseData = await activeDirectory.getOrgUnit.call(this, i);
              break;
            case 'getADGroupsByADGroup':
              responseData = await activeDirectory.getADGroupsByADGroup.call(this, i);
              break;
            case 'getADObjectsByADGroup':
              responseData = await activeDirectory.getADObjectsByADGroup.call(this, i);
              break;
            case 'getADObjectMemberships':
              responseData = await activeDirectory.getADObjectMemberships.call(this, i);
              break;
            case 'getADObjectsByOrgUnit':
              responseData = await activeDirectory.getADObjectsByOrgUnit.call(this, i);
              break;
            case 'getADUsersByOrgUnit':
              responseData = await activeDirectory.getADUsersByOrgUnit.call(this, i);
              break;
            case 'getOrgUnitsByOrgUnit':
              responseData = await activeDirectory.getOrgUnitsByOrgUnit.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "activeDirectory"`,
              );
          }
          break;

        case 'asset':
          switch (operation) {
            case 'get':
              responseData = await asset.get.call(this, i);
              break;
            case 'getMany':
              responseData = await asset.getMany.call(this, i);
              break;
            case 'create':
              responseData = await asset.create.call(this, i);
              break;
            case 'update':
              responseData = await asset.update.call(this, i);
              break;
            case 'delete':
              responseData = await asset.deleteAsset.call(this, i);
              break;
            case 'getAssetTypes':
              responseData = await asset.getAssetTypes.call(this, i);
              break;
            case 'getAssetType':
              responseData = await asset.getAssetType.call(this, i);
              break;
            case 'createAssetType':
              responseData = await asset.createAssetType.call(this, i);
              break;
            case 'deleteAssetType':
              responseData = await asset.deleteAssetType.call(this, i);
              break;
            case 'getAssetsByEndpoint':
              responseData = await asset.getAssetsByEndpoint.call(this, i);
              break;
            case 'getAssetsByLogicalGroup':
              responseData = await asset.getAssetsByLogicalGroup.call(this, i);
              break;
            case 'getAssetStockAssets':
              responseData = await asset.getAssetStockAssets.call(this, i);
              break;
            case 'getAssetStockFolders':
              responseData = await asset.getAssetStockFolders.call(this, i);
              break;
            case 'createAssetStockFolder':
              responseData = await asset.createAssetStockFolder.call(this, i);
              break;
            case 'updateAssetStockFolder':
              responseData = await asset.updateAssetStockFolder.call(this, i);
              break;
            case 'deleteAssetStockFolder':
              responseData = await asset.deleteAssetStockFolder.call(this, i);
              break;
            case 'getAssetsByADObject':
              responseData = await asset.getAssetsByADObject.call(this, i);
              break;
            case 'getAssetsByOrgUnit':
              responseData = await asset.getAssetsByOrgUnit.call(this, i);
              break;
            case 'getAssetStockFolder':
              responseData = await asset.getAssetStockFolder.call(this, i);
              break;
            case 'getAssetStockSubFolders':
              responseData = await asset.getAssetStockSubFolders.call(this, i);
              break;
            case 'getAssetTypeFolders':
              responseData = await asset.getAssetTypeFolders.call(this, i);
              break;
            case 'getAssetTypeFolder':
              responseData = await asset.getAssetTypeFolder.call(this, i);
              break;
            case 'createAssetTypeFolder':
              responseData = await asset.createAssetTypeFolder.call(this, i);
              break;
            case 'updateAssetTypeFolder':
              responseData = await asset.updateAssetTypeFolder.call(this, i);
              break;
            case 'deleteAssetTypeFolder':
              responseData = await asset.deleteAssetTypeFolder.call(this, i);
              break;
            case 'getAssetTypeFolderSubFolders':
              responseData = await asset.getAssetTypeFolderSubFolders.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "asset"`,
              );
          }
          break;

        case 'defenseControl':
          switch (operation) {
            case 'getBitLockerWindowsEndpoints':
              responseData = await defenseControl.getBitLockerWindowsEndpoints.call(this, i);
              break;
            case 'getBitLockerWindowsEndpoint':
              responseData = await defenseControl.getBitLockerWindowsEndpoint.call(this, i);
              break;
            case 'getLocalAdministrativeAccounts':
              responseData = await defenseControl.getLocalAdministrativeAccounts.call(this, i);
              break;
            case 'triggerLocalAdminAccountsUpdate':
              responseData = await defenseControl.triggerLocalAdminAccountsUpdate.call(this, i);
              break;
            case 'patchLocalAdminUserCredentials':
              responseData = await defenseControl.patchLocalAdminUserCredentials.call(this, i);
              break;
            case 'getMicrosoftDefenderThreats':
              responseData = await defenseControl.getMicrosoftDefenderThreats.call(this, i);
              break;
            case 'getMicrosoftDefenderThreat':
              responseData = await defenseControl.getMicrosoftDefenderThreat.call(this, i);
              break;
            case 'getMicrosoftDefenderThreatsByEndpoint':
              responseData = await defenseControl.getMicrosoftDefenderThreatsByEndpoint.call(this, i);
              break;
            case 'getMicrosoftDefenderThreatsByLogicalGroup':
              responseData = await defenseControl.getMicrosoftDefenderThreatsByLogicalGroup.call(this, i);
              break;
            case 'getMicrosoftDefenderWindowsEndpoints':
              responseData = await defenseControl.getMicrosoftDefenderWindowsEndpoints.call(this, i);
              break;
            case 'getMicrosoftDefenderWindowsEndpoint':
              responseData = await defenseControl.getMicrosoftDefenderWindowsEndpoint.call(this, i);
              break;
            case 'getBitLockerSecrets':
              responseData = await defenseControl.getBitLockerSecrets.call(this, i);
              break;
            case 'patchBitLockerSecrets':
              responseData = await defenseControl.patchBitLockerSecrets.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "defenseControl"`,
              );
          }
          break;

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
            case 'getDynamicGroup':
              responseData = await endpoint.getDynamicGroup.call(this, i);
              break;
            case 'getDynamicGroups':
              responseData = await endpoint.getDynamicGroups.call(this, i);
              break;
            case 'createEndpointMaintenanceWindow':
              responseData = await endpoint.createEndpointMaintenanceWindow.call(this, i);
              break;
            case 'updateEndpointMaintenanceWindow':
              responseData = await endpoint.updateEndpointMaintenanceWindow.call(this, i);
              break;
            case 'deleteEndpointMaintenanceWindow':
              responseData = await endpoint.deleteEndpointMaintenanceWindow.call(this, i);
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
            case 'putEndpointMaintenanceWindow':
              responseData = await endpoint.putEndpointMaintenanceWindow.call(this, i);
              break;
            case 'putGroupMaintenanceWindow':
              responseData = await endpoint.putGroupMaintenanceWindow.call(this, i);
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
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "endpoint"`,
              );
          }
          break;

        case 'job':
          switch (operation) {
            case 'get':
              responseData = await job.get.call(this, i);
              break;
            case 'getMany':
              responseData = await job.getMany.call(this, i);
              break;
            case 'create':
              responseData = await job.create.call(this, i);
              break;
            case 'update':
              responseData = await job.update.call(this, i);
              break;
            case 'delete':
              responseData = await job.deleteJob.call(this, i);
              break;
            case 'execute':
              responseData = await job.execute.call(this, i);
              break;
            case 'getInstances':
              responseData = await job.getInstances.call(this, i);
              break;
            case 'getAllJobInstances':
              responseData = await job.getAllJobInstances.call(this, i);
              break;
            case 'getJobInstance':
              responseData = await job.getJobInstance.call(this, i);
              break;
            case 'getEndpointJobInstances':
              responseData = await job.getEndpointJobInstances.call(this, i);
              break;
            case 'startJobInstance':
              responseData = await job.startJobInstance.call(this, i);
              break;
            case 'stopJobInstance':
              responseData = await job.stopJobInstance.call(this, i);
              break;
            case 'resumeJobInstance':
              responseData = await job.resumeJobInstance.call(this, i);
              break;
            case 'deleteJobInstance':
              responseData = await job.deleteJobInstance.call(this, i);
              break;
            case 'getFolders':
              responseData = await job.getFolders.call(this, i);
              break;
            case 'getFolder':
              responseData = await job.getFolder.call(this, i);
              break;
            case 'createFolder':
              responseData = await job.createFolder.call(this, i);
              break;
            case 'updateFolder':
              responseData = await job.updateFolder.call(this, i);
              break;
            case 'deleteFolder':
              responseData = await job.deleteFolder.call(this, i);
              break;
            case 'getKioskReleases':
              responseData = await job.getKioskReleases.call(this, i);
              break;
            case 'getKioskRelease':
              responseData = await job.getKioskRelease.call(this, i);
              break;
            case 'createKioskRelease':
              responseData = await job.createKioskRelease.call(this, i);
              break;
            case 'withdrawKioskRelease':
              responseData = await job.withdrawKioskRelease.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "job"`,
              );
          }
          break;

        case 'operatingSystem':
          switch (operation) {
            case 'getFolders':
              responseData = await operatingSystem.getFolders.call(this, i);
              break;
            case 'getFolder':
              responseData = await operatingSystem.getFolder.call(this, i);
              break;
            case 'getFoldersByFolderId':
              responseData = await operatingSystem.getFoldersByFolderId.call(this, i);
              break;
            case 'createFolder':
              responseData = await operatingSystem.createFolder.call(this, i);
              break;
            case 'updateFolder':
              responseData = await operatingSystem.updateFolder.call(this, i);
              break;
            case 'deleteFolder':
              responseData = await operatingSystem.deleteFolder.call(this, i);
              break;
            case 'getWindowsEndpoints':
              responseData = await operatingSystem.getWindowsEndpoints.call(this, i);
              break;
            case 'getWindowsEndpoint':
              responseData = await operatingSystem.getWindowsEndpoint.call(this, i);
              break;
            case 'updateWindowsEndpoint':
              responseData = await operatingSystem.updateWindowsEndpoint.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "operatingSystem"`,
              );
          }
          break;

        case 'serverManagement':
          switch (operation) {
            case 'getManagementServer':
              responseData = await serverManagement.getManagementServer.call(this, i);
              break;
            case 'getGateway':
              responseData = await serverManagement.getGateway.call(this, i);
              break;
            case 'getDipStatus':
              responseData = await serverManagement.getDipStatus.call(this, i);
              break;
            case 'getVpnAppliance':
              responseData = await serverManagement.getVpnAppliance.call(this, i);
              break;
            case 'getMicroservices':
              responseData = await serverManagement.getMicroservices.call(this, i);
              break;
            case 'getMicroservice':
              responseData = await serverManagement.getMicroservice.call(this, i);
              break;
            case 'getCloudConnectors':
              responseData = await serverManagement.getCloudConnectors.call(this, i);
              break;
            case 'getPxeRelays':
              responseData = await serverManagement.getPxeRelays.call(this, i);
              break;
            case 'getSecurityGroups':
              responseData = await serverManagement.getSecurityGroups.call(this, i);
              break;
            case 'getSecurityGroup':
              responseData = await serverManagement.getSecurityGroup.call(this, i);
              break;
            case 'createSecurityGroup':
              responseData = await serverManagement.createSecurityGroup.call(this, i);
              break;
            case 'updateSecurityGroup':
              responseData = await serverManagement.updateSecurityGroup.call(this, i);
              break;
            case 'deleteSecurityGroup':
              responseData = await serverManagement.deleteSecurityGroup.call(this, i);
              break;
            case 'getSecurityProfiles':
              responseData = await serverManagement.getSecurityProfiles.call(this, i);
              break;
            case 'getSecurityProfile':
              responseData = await serverManagement.getSecurityProfile.call(this, i);
              break;
            case 'createSecurityProfile':
              responseData = await serverManagement.createSecurityProfile.call(this, i);
              break;
            case 'updateSecurityProfile':
              responseData = await serverManagement.updateSecurityProfile.call(this, i);
              break;
            case 'deleteSecurityProfile':
              responseData = await serverManagement.deleteSecurityProfile.call(this, i);
              break;
            case 'getAccessRights':
              responseData = await serverManagement.getAccessRights.call(this, i);
              break;
            case 'updateObjectPermissions':
              responseData = await serverManagement.updateObjectPermissions.call(this, i);
              break;
            case 'restartManagementServer':
              responseData = await serverManagement.restartManagementServer.call(this, i);
              break;
            case 'cancelScheduledRestart':
              responseData = await serverManagement.cancelScheduledRestart.call(this, i);
              break;
            case 'startMicroservice':
              responseData = await serverManagement.startMicroservice.call(this, i);
              break;
            case 'stopMicroservice':
              responseData = await serverManagement.stopMicroservice.call(this, i);
              break;
            case 'restartMicroservice':
              responseData = await serverManagement.restartMicroservice.call(this, i);
              break;
            case 'getDipsMSWCleanup':
              responseData = await serverManagement.getDipsMSWCleanup.call(this, i);
              break;
            case 'simulateMSWCleanup':
              responseData = await serverManagement.simulateMSWCleanup.call(this, i);
              break;
            case 'getApiKeys':
              responseData = await serverManagement.getApiKeys.call(this, i);
              break;
            case 'getDownloadJobs':
              responseData = await serverManagement.getDownloadJobs.call(this, i);
              break;
            case 'getDownloadJob':
              responseData = await serverManagement.getDownloadJob.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "serverManagement"`,
              );
          }
          break;

        case 'software':
          switch (operation) {
            case 'getInstalledWindowsSoftware':
              responseData = await software.getInstalledWindowsSoftware.call(this, i);
              break;
            case 'getInstalledSoftwareByEndpoint':
              responseData = await software.getInstalledSoftwareByEndpoint.call(this, i);
              break;
            case 'getInstalledSoftwareByLogicalGroup':
              responseData = await software.getInstalledSoftwareByLogicalGroup.call(this, i);
              break;
            case 'getInstalledSoftwareByUniversalDynamicGroup':
              responseData = await software.getInstalledSoftwareByUniversalDynamicGroup.call(this, i);
              break;
            case 'getBundles':
              responseData = await software.getBundles.call(this, i);
              break;
            case 'getBundle':
              responseData = await software.getBundle.call(this, i);
              break;
            case 'createBundle':
              responseData = await software.createBundle.call(this, i);
              break;
            case 'deleteBundle':
              responseData = await software.deleteBundle.call(this, i);
              break;
            case 'getBundleFolders':
              responseData = await software.getBundleFolders.call(this, i);
              break;
            case 'getBundleFolder':
              responseData = await software.getBundleFolder.call(this, i);
              break;
            case 'getBundleSubFolders':
              responseData = await software.getBundleSubFolders.call(this, i);
              break;
            case 'createBundleFolder':
              responseData = await software.createBundleFolder.call(this, i);
              break;
            case 'deleteBundleFolder':
              responseData = await software.deleteBundleFolder.call(this, i);
              break;
            case 'getBundleApplicationsByBundle':
              responseData = await software.getBundleApplicationsByBundle.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "software"`,
              );
          }
          break;

        case 'updateManagement':
          switch (operation) {
            case 'getWindowsEndpoints':
              responseData = await updateManagement.getWindowsEndpoints.call(this, i);
              break;
            case 'getWindowsEndpoint':
              responseData = await updateManagement.getWindowsEndpoint.call(this, i);
              break;
            case 'updateWindowsEndpoint':
              responseData = await updateManagement.updateWindowsEndpoint.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "updateManagement"`,
              );
          }
          break;

        case 'variable':
          switch (operation) {
            case 'getVariableDefinitions':
              responseData = await variable.getVariableDefinitions.call(this, i);
              break;
            case 'getVariableDefinition':
              responseData = await variable.getVariableDefinition.call(this, i);
              break;
            case 'createVariableDefinition':
              responseData = await variable.createVariableDefinition.call(this, i);
              break;
            case 'updateVariableDefinition':
              responseData = await variable.updateVariableDefinition.call(this, i);
              break;
            case 'deleteVariableDefinition':
              responseData = await variable.deleteVariableDefinition.call(this, i);
              break;
            case 'getVariableInstances':
              responseData = await variable.getVariableInstances.call(this, i);
              break;
            case 'getVariableInstance':
              responseData = await variable.getVariableInstance.call(this, i);
              break;
            case 'updateVariableInstance':
              responseData = await variable.updateVariableInstance.call(this, i);
              break;
            case 'getVariableInstancesByEndpoint':
              responseData = await variable.getVariableInstancesByEndpoint.call(this, i);
              break;
            case 'getVariableInstancesByLogicalGroup':
              responseData = await variable.getVariableInstancesByLogicalGroup.call(this, i);
              break;
            case 'getVariableInstancesByADObject':
              responseData = await variable.getVariableInstancesByADObject.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "variable"`,
              );
          }
          break;

        case 'compliance':
          switch (operation) {
            case 'getRules':
              responseData = await compliance.getRules.call(this, i);
              break;
            case 'getRule':
              responseData = await compliance.getRule.call(this, i);
              break;
            case 'getVulnerabilities':
              responseData = await compliance.getVulnerabilities.call(this, i);
              break;
            case 'getVulnerability':
              responseData = await compliance.getVulnerability.call(this, i);
              break;
            case 'getDetectedVulnerabilities':
              responseData = await compliance.getDetectedVulnerabilities.call(this, i);
              break;
            case 'getDetectedVulnerabilitiesByEndpoint':
              responseData = await compliance.getDetectedVulnerabilitiesByEndpoint.call(this, i);
              break;
            case 'getDetectedRuleViolations':
              responseData = await compliance.getDetectedRuleViolations.call(this, i);
              break;
            case 'getDetectedRuleViolationsByEndpoint':
              responseData = await compliance.getDetectedRuleViolationsByEndpoint.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "compliance"`,
              );
          }
          break;

        case 'universalDynamicGroups':
          switch (operation) {
            case 'getMany':
              responseData = await universalDynamicGroups.getMany.call(this, i);
              break;
            case 'get':
              responseData = await universalDynamicGroups.get.call(this, i);
              break;
            case 'getFolders':
              responseData = await universalDynamicGroups.getFolders.call(this, i);
              break;
            case 'getFolder':
              responseData = await universalDynamicGroups.getFolder.call(this, i);
              break;
            case 'getSubFolders':
              responseData = await universalDynamicGroups.getSubFolders.call(this, i);
              break;
            case 'getGroupsByFolder':
              responseData = await universalDynamicGroups.getGroupsByFolder.call(this, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Unknown operation "${operation}" for resource "universalDynamicGroups"`,
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
