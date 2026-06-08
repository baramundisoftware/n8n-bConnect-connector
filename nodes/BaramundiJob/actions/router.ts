import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { job } from './job';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;

  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      let responseData: INodeExecutionData[] = [];

      switch (resource) {
        case 'jobDefinition':
          switch (operation) {
            case 'get': responseData = await job.get.call(this, i); break;
            case 'getMany': responseData = await job.getMany.call(this, i); break;
            case 'create': responseData = await job.create.call(this, i); break;
            case 'update': responseData = await job.update.call(this, i); break;
            case 'delete': responseData = await job.deleteJob.call(this, i); break;
            case 'execute': responseData = await job.execute.call(this, i); break;
            case 'getJobDefinitionsByFolder': responseData = await job.getJobDefinitionsByFolder.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "jobDefinition"`);
          }
          break;

        case 'jobFolder':
          switch (operation) {
            case 'getFolders': responseData = await job.getFolders.call(this, i); break;
            case 'getFolder': responseData = await job.getFolder.call(this, i); break;
            case 'createFolder': responseData = await job.createFolder.call(this, i); break;
            case 'updateFolder': responseData = await job.updateFolder.call(this, i); break;
            case 'deleteFolder': responseData = await job.deleteFolder.call(this, i); break;
            case 'getSubFolders': responseData = await job.getSubFolders.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "jobFolder"`);
          }
          break;

        case 'jobInstance':
          switch (operation) {
            case 'getInstances': responseData = await job.getInstances.call(this, i); break;
            case 'getAllJobInstances': responseData = await job.getAllJobInstances.call(this, i); break;
            case 'getJobInstance': responseData = await job.getJobInstance.call(this, i); break;
            case 'getEndpointJobInstances': responseData = await job.getEndpointJobInstances.call(this, i); break;
            case 'startJobInstance': responseData = await job.startJobInstance.call(this, i); break;
            case 'stopJobInstance': responseData = await job.stopJobInstance.call(this, i); break;
            case 'resumeJobInstance': responseData = await job.resumeJobInstance.call(this, i); break;
            case 'deleteJobInstance': responseData = await job.deleteJobInstance.call(this, i); break;
            case 'getJobInstancesByLogicalGroup': responseData = await job.getJobInstancesByLogicalGroup.call(this, i); break;
            case 'getJobInstancesByStaticGroup': responseData = await job.getJobInstancesByStaticGroup.call(this, i); break;
            case 'getJobInstancesByDynamicGroup': responseData = await job.getJobInstancesByDynamicGroup.call(this, i); break;
            case 'getJobInstancesByUDG': responseData = await job.getJobInstancesByUDG.call(this, i); break;
            case 'assignJobToLogicalGroup': responseData = await job.assignJobToLogicalGroup.call(this, i); break;
            case 'assignJobToStaticGroup': responseData = await job.assignJobToStaticGroup.call(this, i); break;
            case 'assignJobToDynamicGroup': responseData = await job.assignJobToDynamicGroup.call(this, i); break;
            case 'assignJobToUDG': responseData = await job.assignJobToUDG.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "jobInstance"`);
          }
          break;

        case 'kioskRelease':
          switch (operation) {
            case 'getKioskReleases': responseData = await job.getKioskReleases.call(this, i); break;
            case 'getKioskRelease': responseData = await job.getKioskRelease.call(this, i); break;
            case 'createKioskRelease': responseData = await job.createKioskRelease.call(this, i); break;
            case 'withdrawKioskRelease': responseData = await job.withdrawKioskRelease.call(this, i); break;
            case 'getKioskReleasesByJobDefinition': responseData = await job.getKioskReleasesByJobDefinition.call(this, i); break;
            case 'getKioskReleasesByEndpoint': responseData = await job.getKioskReleasesByEndpoint.call(this, i); break;
            case 'getKioskReleasesByLogicalGroup': responseData = await job.getKioskReleasesByLogicalGroup.call(this, i); break;
            case 'getKioskReleasesByADObject': responseData = await job.getKioskReleasesByADObject.call(this, i); break;
            default:
              throw new NodeOperationError(this.getNode(), `Unknown operation "${operation}" for resource "kioskRelease"`);
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
