import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../transport/requestApi';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobSelection = this.getNodeParameter('jobSelection', index) as string;
  const jobId = jobSelection === '__custom__'
    ? this.getNodeParameter('jobId', index) as string
    : jobSelection;
  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/JobDefinitions/${jobId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getMany(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/jobs/v2.0/JobDefinitions', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/jobs/v2.0/JobDefinitions', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function execute(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobSelection = this.getNodeParameter('jobSelection', index) as string;
  const jobId = jobSelection === '__custom__'
    ? this.getNodeParameter('jobId', index) as string
    : jobSelection;
  const endpointIdsString = this.getNodeParameter('endpointIds', index) as string;
  const options = this.getNodeParameter('options', index, {}) as {
    comment?: string;
    priority?: string;
  };

  const endpointIds = endpointIdsString.split(',').map((id) => id.trim());

  const body: Record<string, unknown> = {
    jobDefinitionId: jobId,
    endpointId: endpointIds[0],  // API accepts one endpoint at a time
  };

  if (options.comment) {
    body.comment = options.comment;
  }

  if (options.priority) {
    body.priority = options.priority;
  }

  const response = await apiRequest.call(this, 'POST', `/jobs/v2.0/JobInstances`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getInstances(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobSelection = this.getNodeParameter('jobSelection', index) as string;
  const jobId = jobSelection === '__custom__'
    ? this.getNodeParameter('jobId', index) as string
    : jobSelection;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  const qs: Record<string, string | number> = {
    SearchQuery: `JobDefinitionId eq '${jobId}'`,
  };

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this,
      'GET',
      `/jobs/v2.0/JobInstances`,
      {},
      qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/JobInstances`, {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getAllJobInstances(
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

  // Optional filters (NOT hardcoded)
  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this,
      'GET',
      `/jobs/v2.0/JobInstances`,
      {},
      qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/JobInstances`, {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

// ============================================================================
// JOB INSTANCE OPERATIONS
// ============================================================================

export async function getJobInstance(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const instanceId = this.getNodeParameter('instanceId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/JobInstances/${instanceId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getEndpointJobInstances(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  const qs: Record<string, string | number> = {};

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this,
      'GET',
      `/jobs/v2.0/Endpoints/${endpointId}/JobInstances`,
      {},
      qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/Endpoints/${endpointId}/JobInstances`, {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function startJobInstance(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const instanceId = this.getNodeParameter('instanceId', index) as string;
  await apiRequest.call(this, 'POST', `/jobs/v2.0/JobInstances/${instanceId}/Start`);
  return this.helpers.returnJsonArray({ success: true, startedId: instanceId } as IDataObject);
}

export async function stopJobInstance(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const instanceId = this.getNodeParameter('instanceId', index) as string;
  await apiRequest.call(this, 'POST', `/jobs/v2.0/JobInstances/${instanceId}/Stop`);
  return this.helpers.returnJsonArray({ success: true, stoppedId: instanceId });
}

export async function resumeJobInstance(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const instanceId = this.getNodeParameter('instanceId', index) as string;
  await apiRequest.call(this, 'POST', `/jobs/v2.0/JobInstances/${instanceId}/Resume`);
  return this.helpers.returnJsonArray({ success: true, resumedId: instanceId });
}

export async function deleteJobInstance(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const instanceId = this.getNodeParameter('instanceId', index) as string;
  await apiRequest.call(this, 'DELETE', `/jobs/v2.0/JobInstances/${instanceId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: instanceId });
}

// ============================================================================
// JOB FOLDER OPERATIONS
// ============================================================================

export async function getFolders(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/jobs/v2.0/Folders', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/jobs/v2.0/Folders', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = this.getNodeParameter('folderId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/Folders/${folderId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/jobs/v2.0/Folders', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = this.getNodeParameter('folderId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

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

  await apiRequest.call(this, 'PATCH', `/jobs/v2.0/Folders/${folderId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/Folders/${folderId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = this.getNodeParameter('folderId', index) as string;
  await apiRequest.call(this, 'DELETE', `/jobs/v2.0/Folders/${folderId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: folderId });
}

// ============================================================================
// KIOSK RELEASE OPERATIONS
// ============================================================================

export async function getKioskReleases(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/jobs/v2.0/KioskReleases', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/jobs/v2.0/KioskReleases', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getKioskRelease(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const releaseId = this.getNodeParameter('releaseId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/KioskReleases/${releaseId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createKioskRelease(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobDefinitionSelection = this.getNodeParameter('jobDefinitionSelection', index) as string;
  const jobDefinitionId = jobDefinitionSelection === '__custom__'
    ? this.getNodeParameter('jobDefinitionId', index) as string
    : jobDefinitionSelection;
  const targetType = this.getNodeParameter('targetType', index) as string;
  const targetId = this.getNodeParameter('targetId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    jobDefinitionId,
    targetType,
    targetId,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/jobs/v2.0/KioskReleases', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function withdrawKioskRelease(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const releaseId = this.getNodeParameter('releaseId', index) as string;
  await apiRequest.call(this, 'DELETE', `/jobs/v2.0/KioskReleases/${releaseId}`);
  return this.helpers.returnJsonArray({ success: true, withdrawnId: releaseId });
}

// ============================================================================
// JOB DEFINITION CRUD OPERATIONS
// ============================================================================

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const type = this.getNodeParameter('type', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    type,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/jobs/v2.0/JobDefinitions', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobSelection = this.getNodeParameter('jobSelection', index) as string;
  const jobId = jobSelection === '__custom__'
    ? this.getNodeParameter('jobId', index) as string
    : jobSelection;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

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

  await apiRequest.call(this, 'PATCH', `/jobs/v2.0/JobDefinitions/${jobId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/JobDefinitions/${jobId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteJob(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobSelection = this.getNodeParameter('jobSelection', index) as string;
  const jobId = jobSelection === '__custom__'
    ? this.getNodeParameter('jobId', index) as string
    : jobSelection;
  await apiRequest.call(this, 'DELETE', `/jobs/v2.0/JobDefinitions/${jobId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: jobId });
}
