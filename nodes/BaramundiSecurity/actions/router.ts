import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { toItemError } from '../../shared/utils/nodeError';

import { serverManagement } from './serverManagement';
import { compliance } from './compliance';
import { defenseControl } from './defenseControl';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;

  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      let responseData: INodeExecutionData[] = [];

      switch (resource) {
        case 'bmsecurity':
          switch (operation) {
            case 'getSecurityGroups': responseData = await serverManagement.getSecurityGroups.call(this, i); break;
            case 'getSecurityGroup': responseData = await serverManagement.getSecurityGroup.call(this, i); break;
            case 'createSecurityGroup': responseData = await serverManagement.createSecurityGroup.call(this, i); break;
            case 'updateSecurityGroup': responseData = await serverManagement.updateSecurityGroup.call(this, i); break;
            case 'deleteSecurityGroup': responseData = await serverManagement.deleteSecurityGroup.call(this, i); break;
            case 'getSecurityProfiles': responseData = await serverManagement.getSecurityProfiles.call(this, i); break;
            case 'getSecurityProfile': responseData = await serverManagement.getSecurityProfile.call(this, i); break;
            case 'createSecurityProfile': responseData = await serverManagement.createSecurityProfile.call(this, i); break;
            case 'updateSecurityProfile': responseData = await serverManagement.updateSecurityProfile.call(this, i); break;
            case 'deleteSecurityProfile': responseData = await serverManagement.deleteSecurityProfile.call(this, i); break;
            case 'getAccessRights': responseData = await serverManagement.getAccessRights.call(this, i); break;
            case 'updateObjectPermissions': responseData = await serverManagement.updateObjectPermissions.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "bmsecurity"`);
          }
          break;

        case 'compliance':
          switch (operation) {
            case 'getRules': responseData = await compliance.getRules.call(this, i); break;
            case 'getRule': responseData = await compliance.getRule.call(this, i); break;
            case 'getVulnerabilities': responseData = await compliance.getVulnerabilities.call(this, i); break;
            case 'getVulnerability': responseData = await compliance.getVulnerability.call(this, i); break;
            case 'getDetectedVulnerabilities': responseData = await compliance.getDetectedVulnerabilities.call(this, i); break;
            case 'getDetectedVulnerabilitiesByEndpoint': responseData = await compliance.getDetectedVulnerabilitiesByEndpoint.call(this, i); break;
            case 'getDetectedRuleViolations': responseData = await compliance.getDetectedRuleViolations.call(this, i); break;
            case 'getDetectedRuleViolationsByEndpoint': responseData = await compliance.getDetectedRuleViolationsByEndpoint.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "compliance"`);
          }
          break;

        case 'defenseControl':
          switch (operation) {
            case 'getBitLockerWindowsEndpoints': responseData = await defenseControl.getBitLockerWindowsEndpoints.call(this, i); break;
            case 'getBitLockerWindowsEndpoint': responseData = await defenseControl.getBitLockerWindowsEndpoint.call(this, i); break;
            case 'getLocalAdministrativeAccounts': responseData = await defenseControl.getLocalAdministrativeAccounts.call(this, i); break;
            case 'triggerLocalAdminAccountsUpdate': responseData = await defenseControl.triggerLocalAdminAccountsUpdate.call(this, i); break;
            case 'patchLocalAdminUserCredentials': responseData = await defenseControl.patchLocalAdminUserCredentials.call(this, i); break;
            case 'getMicrosoftDefenderThreats': responseData = await defenseControl.getMicrosoftDefenderThreats.call(this, i); break;
            case 'getMicrosoftDefenderThreat': responseData = await defenseControl.getMicrosoftDefenderThreat.call(this, i); break;
            case 'getMicrosoftDefenderThreatsByEndpoint': responseData = await defenseControl.getMicrosoftDefenderThreatsByEndpoint.call(this, i); break;
            case 'getMicrosoftDefenderThreatsByLogicalGroup': responseData = await defenseControl.getMicrosoftDefenderThreatsByLogicalGroup.call(this, i); break;
            case 'getMicrosoftDefenderWindowsEndpoints': responseData = await defenseControl.getMicrosoftDefenderWindowsEndpoints.call(this, i); break;
            case 'getMicrosoftDefenderWindowsEndpoint': responseData = await defenseControl.getMicrosoftDefenderWindowsEndpoint.call(this, i); break;
            case 'getBitLockerSecrets': responseData = await defenseControl.getBitLockerSecrets.call(this, i); break;
            case 'patchBitLockerSecrets': responseData = await defenseControl.patchBitLockerSecrets.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "defenseControl"`);
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
