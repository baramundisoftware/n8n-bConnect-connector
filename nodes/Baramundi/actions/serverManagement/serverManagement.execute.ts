import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../transport/requestApi';

// ============================================================================
// SERVER INFORMATION OPERATIONS
// ============================================================================

export async function getManagementServer(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/ManagementServer');
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getGateway(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/Gateway');
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getDipStatus(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/Dips');
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getVpnAppliance(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/VpnAppliance');
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// MICROSERVICES OPERATIONS
// ============================================================================

export async function getMicroservices(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/Microservices');
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getMicroservice(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const microserviceId = this.getNodeParameter('microserviceId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/servermanagement/v2.0/Microservices/${microserviceId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// INFRASTRUCTURE OPERATIONS
// ============================================================================

export async function getCloudConnectors(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/CloudConnectors');
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getPxeRelays(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/PxeRelays');
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// SECURITY GROUPS OPERATIONS
// ============================================================================

export async function getSecurityGroups(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/servermanagement/v2.0/SecurityGroups', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/SecurityGroups', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getSecurityGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const securityGroupId = this.getNodeParameter('securityGroupId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/servermanagement/v2.0/SecurityGroups/${securityGroupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createSecurityGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/servermanagement/v2.0/SecurityGroups', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateSecurityGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const securityGroupId = this.getNodeParameter('securityGroupId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  // Build JSON Patch document for PATCH request
  const patchOperations: Array<{op: string; path: string; value: any}> = [];

  for (const [key, value] of Object.entries(updateFields)) {
    if (value !== undefined && value !== null && value !== '') {
      patchOperations.push({
        op: 'replace',
        path: `/${key}`,
        value,
      });
    }
  }

  if (patchOperations.length === 0) {
    throw new Error('No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/servermanagement/v2.0/SecurityGroups/${securityGroupId}`, patchOperations);

  // Fetch updated security group to return
  const response = await apiRequest.call(this, 'GET', `/servermanagement/v2.0/SecurityGroups/${securityGroupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteSecurityGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const securityGroupId = this.getNodeParameter('securityGroupId', index) as string;
  await apiRequest.call(this, 'DELETE', `/servermanagement/v2.0/SecurityGroups/${securityGroupId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: securityGroupId });
}

// ============================================================================
// SECURITY PROFILES OPERATIONS
// ============================================================================

export async function getSecurityProfiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/servermanagement/v2.0/SecurityProfiles', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/SecurityProfiles', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getSecurityProfile(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const securityProfileId = this.getNodeParameter('securityProfileId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/servermanagement/v2.0/SecurityProfiles/${securityProfileId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createSecurityProfile(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/servermanagement/v2.0/SecurityProfiles', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateSecurityProfile(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const securityProfileId = this.getNodeParameter('securityProfileId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  // Build JSON Patch document for PATCH request
  const patchOperations: Array<{op: string; path: string; value: any}> = [];

  for (const [key, value] of Object.entries(updateFields)) {
    if (value !== undefined && value !== null && value !== '') {
      patchOperations.push({
        op: 'replace',
        path: `/${key}`,
        value,
      });
    }
  }

  if (patchOperations.length === 0) {
    throw new Error('No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/servermanagement/v2.0/SecurityProfiles/${securityProfileId}`, patchOperations);

  // Fetch updated security profile to return
  const response = await apiRequest.call(this, 'GET', `/servermanagement/v2.0/SecurityProfiles/${securityProfileId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteSecurityProfile(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const securityProfileId = this.getNodeParameter('securityProfileId', index) as string;
  await apiRequest.call(this, 'DELETE', `/servermanagement/v2.0/SecurityProfiles/${securityProfileId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: securityProfileId });
}

// ============================================================================
// OBJECT PERMISSIONS OPERATIONS
// ============================================================================

export async function getAccessRights(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const objectId = this.getNodeParameter('objectId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/servermanagement/v2.0/Objects/${objectId}/Rights`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateObjectPermissions(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const objectId = this.getNodeParameter('objectId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  // Build JSON Patch document for PATCH request
  const patchOperations: Array<{op: string; path: string; value: any}> = [];

  if (updateFields.securityProfileAccessRights) {
    const rights = typeof updateFields.securityProfileAccessRights === 'string'
      ? JSON.parse(updateFields.securityProfileAccessRights as string)
      : updateFields.securityProfileAccessRights;

    patchOperations.push({
      op: 'replace',
      path: '/securityProfileAccessRights',
      value: rights,
    });
  }

  if (patchOperations.length === 0) {
    throw new Error('No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/servermanagement/v2.0/Objects/${objectId}`, patchOperations);

  // Fetch updated object permissions to return
  const response = await apiRequest.call(this, 'GET', `/servermanagement/v2.0/Objects/${objectId}/Rights`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// SERVER CONTROL OPERATIONS
// ============================================================================

export async function restartManagementServer(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  await apiRequest.call(this, 'POST', '/servermanagement/v2.0/Restart');
  return this.helpers.returnJsonArray({ success: true, action: 'restart' });
}

export async function cancelScheduledRestart(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  await apiRequest.call(this, 'POST', '/servermanagement/v2.0/CancelScheduledRestart');
  return this.helpers.returnJsonArray({ success: true, action: 'cancel_restart' });
}

export async function startMicroservice(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const microserviceId = this.getNodeParameter('microserviceId', index) as string;
  await apiRequest.call(this, 'POST', `/servermanagement/v2.0/Microservices/${microserviceId}/Start`);
  return this.helpers.returnJsonArray({ success: true, microserviceId, action: 'start' });
}

export async function stopMicroservice(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const microserviceId = this.getNodeParameter('microserviceId', index) as string;
  await apiRequest.call(this, 'POST', `/servermanagement/v2.0/Microservices/${microserviceId}/Stop`);
  return this.helpers.returnJsonArray({ success: true, microserviceId, action: 'stop' });
}

export async function restartMicroservice(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const microserviceId = this.getNodeParameter('microserviceId', index) as string;
  await apiRequest.call(this, 'POST', `/servermanagement/v2.0/Microservices/${microserviceId}/Restart`);
  return this.helpers.returnJsonArray({ success: true, microserviceId, action: 'restart' });
}

// ============================================================================
// DIPS / API KEYS / DOWNLOAD JOBS (bMS 26R1+)
// ============================================================================

export async function getDipsMSWCleanup(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'POST', '/servermanagement/v2.0/Dips/MSWCleanup');
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function simulateMSWCleanup(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'POST', '/servermanagement/v2.0/Dips/SimulateMSWCleanup');
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getApiKeys(
  this: IExecuteFunctions,
  _index: number,
): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/ApiKeys');
  return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
}

export async function getDownloadJobs(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  const qs: Record<string, string | number> = {};

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/servermanagement/v2.0/DownloadJobs', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/servermanagement/v2.0/DownloadJobs', {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getDownloadJob(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const downloadJobId = this.getNodeParameter('downloadJobId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/servermanagement/v2.0/DownloadJobs/${downloadJobId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}
