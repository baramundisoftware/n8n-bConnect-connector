import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import { validateGuid, validateODataString, extractResourceLocatorValue } from '../../../shared/utils/validation';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobId = extractResourceLocatorValue(this.getNodeParameter('jobId', index));
  const _jobIdValidation = validateGuid(jobId);
  if (!_jobIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobIdValidation.errors.join(', '), { itemIndex: index });
  }
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
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
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
  const jobId = extractResourceLocatorValue(this.getNodeParameter('jobId', index));
  const _jobIdValidation = validateGuid(jobId);
  if (!_jobIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const jobId = extractResourceLocatorValue(this.getNodeParameter('jobId', index));
  const _jobIdValidation = validateGuid(jobId);
  if (!_jobIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  // Safety: jobId is GUID-validated above — template interpolation is not exploitable here.
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
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
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
  const _instanceIdValidation = validateGuid(instanceId);
  if (!_instanceIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _instanceIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/JobInstances/${instanceId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getEndpointJobInstances(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const _endpointIdValidation = validateGuid(endpointId);
  if (!_endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const _instanceIdValidation = validateGuid(instanceId);
  if (!_instanceIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _instanceIdValidation.errors.join(', '), { itemIndex: index });
  }
  await apiRequest.call(this, 'POST', `/jobs/v2.0/JobInstances/${instanceId}/Start`);
  return this.helpers.returnJsonArray({ success: true, startedId: instanceId } as IDataObject);
}

export async function stopJobInstance(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const instanceId = this.getNodeParameter('instanceId', index) as string;
  const _instanceIdValidation = validateGuid(instanceId);
  if (!_instanceIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _instanceIdValidation.errors.join(', '), { itemIndex: index });
  }
  await apiRequest.call(this, 'POST', `/jobs/v2.0/JobInstances/${instanceId}/Stop`);
  return this.helpers.returnJsonArray({ success: true, stoppedId: instanceId });
}

export async function resumeJobInstance(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const instanceId = this.getNodeParameter('instanceId', index) as string;
  const _instanceIdValidation = validateGuid(instanceId);
  if (!_instanceIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _instanceIdValidation.errors.join(', '), { itemIndex: index });
  }
  await apiRequest.call(this, 'POST', `/jobs/v2.0/JobInstances/${instanceId}/Resume`);
  return this.helpers.returnJsonArray({ success: true, resumedId: instanceId });
}

export async function deleteJobInstance(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const instanceId = this.getNodeParameter('instanceId', index) as string;
  const _instanceIdValidation = validateGuid(instanceId);
  if (!_instanceIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _instanceIdValidation.errors.join(', '), { itemIndex: index });
  }
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
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
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
  const folderId = extractResourceLocatorValue(this.getNodeParameter('folderId', index));
  const _folderIdValidation = validateGuid(folderId);
  if (!_folderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const folderId = extractResourceLocatorValue(this.getNodeParameter('folderId', index));
  const _folderIdValidation = validateGuid(folderId);
  if (!_folderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
  }
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const patchOperations: Array<{op: string; path: string; value: unknown}> = [];

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
    throw new NodeOperationError(this.getNode(), 'No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/jobs/v2.0/Folders/${folderId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/Folders/${folderId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = extractResourceLocatorValue(this.getNodeParameter('folderId', index));
  const _folderIdValidation = validateGuid(folderId);
  if (!_folderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
  }
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
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) {
      throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
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
  const _releaseIdValidation = validateGuid(releaseId);
  if (!_releaseIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _releaseIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/KioskReleases/${releaseId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createKioskRelease(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobDefinitionId = extractResourceLocatorValue(this.getNodeParameter('jobDefinitionId', index));
  const _jobDefinitionIdValidation = validateGuid(jobDefinitionId);
  if (!_jobDefinitionIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobDefinitionIdValidation.errors.join(', '), { itemIndex: index });
  }
  const targetType = this.getNodeParameter('targetType', index) as string;
  const targetId = this.getNodeParameter('targetId', index) as string;
  const _targetIdValidation = validateGuid(targetId);
  if (!_targetIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _targetIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const _releaseIdValidation = validateGuid(releaseId);
  if (!_releaseIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _releaseIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const jobId = extractResourceLocatorValue(this.getNodeParameter('jobId', index));
  const _jobIdValidation = validateGuid(jobId);
  if (!_jobIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobIdValidation.errors.join(', '), { itemIndex: index });
  }
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const patchOperations: Array<{op: string; path: string; value: unknown}> = [];

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
    throw new NodeOperationError(this.getNode(), 'No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/jobs/v2.0/JobDefinitions/${jobId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/JobDefinitions/${jobId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteJob(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobId = extractResourceLocatorValue(this.getNodeParameter('jobId', index));
  const _jobIdValidation = validateGuid(jobId);
  if (!_jobIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobIdValidation.errors.join(', '), { itemIndex: index });
  }
  await apiRequest.call(this, 'DELETE', `/jobs/v2.0/JobDefinitions/${jobId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: jobId });
}

// ============================================================================
// JOB GAPS (Phase 8D)
// ============================================================================

export async function getSubFolders(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = extractResourceLocatorValue(this.getNodeParameter('folderId', index));
  const _folderIdValidation = validateGuid(folderId);
  if (!_folderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/Folders/${folderId}/Folders`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/Folders/${folderId}/Folders`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getJobDefinitionsByFolder(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const folderId = extractResourceLocatorValue(this.getNodeParameter('folderId', index));
  const _folderIdValidation = validateGuid(folderId);
  if (!_folderIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _folderIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/Folders/${folderId}/JobDefinitions`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/Folders/${folderId}/JobDefinitions`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getKioskReleasesByJobDefinition(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobId = this.getNodeParameter('jobId', index) as string;
  const _jobIdValidation = validateGuid(jobId);
  if (!_jobIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/JobDefinitions/${jobId}/KioskReleases`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/JobDefinitions/${jobId}/KioskReleases`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getJobInstancesByLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const logicalGroupId = this.getNodeParameter('logicalGroupId', index) as string;
  const _logicalGroupIdValidation = validateGuid(logicalGroupId);
  if (!_logicalGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _logicalGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/LogicalGroups/${logicalGroupId}/JobInstances`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/LogicalGroups/${logicalGroupId}/JobInstances`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getJobInstancesByStaticGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const staticGroupId = this.getNodeParameter('staticGroupId', index) as string;
  const _staticGroupIdValidation = validateGuid(staticGroupId);
  if (!_staticGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _staticGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/StaticGroups/${staticGroupId}/JobInstances`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/StaticGroups/${staticGroupId}/JobInstances`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getJobInstancesByDynamicGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const dynamicGroupId = this.getNodeParameter('dynamicGroupId', index) as string;
  const _dynamicGroupIdValidation = validateGuid(dynamicGroupId);
  if (!_dynamicGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _dynamicGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/DynamicGroups/${dynamicGroupId}/JobInstances`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/DynamicGroups/${dynamicGroupId}/JobInstances`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getJobInstancesByUDG(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const udgId = this.getNodeParameter('udgId', index) as string;
  const _udgIdValidation = validateGuid(udgId);
  if (!_udgIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _udgIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/UniversalDynamicGroups/${udgId}/JobInstances`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/UniversalDynamicGroups/${udgId}/JobInstances`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function assignJobToLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const logicalGroupId = this.getNodeParameter('logicalGroupId', index) as string;
  const _logicalGroupIdValidation = validateGuid(logicalGroupId);
  if (!_logicalGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _logicalGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const jobDefinitionId = extractResourceLocatorValue(this.getNodeParameter('jobDefinitionId', index));
  const _jobDefinitionIdValidation = validateGuid(jobDefinitionId);
  if (!_jobDefinitionIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobDefinitionIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'POST', `/jobs/v2.0/LogicalGroups/${logicalGroupId}/AssignJobDefinition`, { jobDefinitionId });
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function assignJobToStaticGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const staticGroupId = this.getNodeParameter('staticGroupId', index) as string;
  const _staticGroupIdValidation = validateGuid(staticGroupId);
  if (!_staticGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _staticGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const jobDefinitionId = extractResourceLocatorValue(this.getNodeParameter('jobDefinitionId', index));
  const _jobDefinitionIdValidation = validateGuid(jobDefinitionId);
  if (!_jobDefinitionIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobDefinitionIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'POST', `/jobs/v2.0/StaticGroups/${staticGroupId}/AssignJobDefinition`, { jobDefinitionId });
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function assignJobToDynamicGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const dynamicGroupId = this.getNodeParameter('dynamicGroupId', index) as string;
  const _dynamicGroupIdValidation = validateGuid(dynamicGroupId);
  if (!_dynamicGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _dynamicGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const jobDefinitionId = extractResourceLocatorValue(this.getNodeParameter('jobDefinitionId', index));
  const _jobDefinitionIdValidation = validateGuid(jobDefinitionId);
  if (!_jobDefinitionIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobDefinitionIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'POST', `/jobs/v2.0/DynamicGroups/${dynamicGroupId}/AssignJobDefinition`, { jobDefinitionId });
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function assignJobToUDG(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const udgId = this.getNodeParameter('udgId', index) as string;
  const _udgIdValidation = validateGuid(udgId);
  if (!_udgIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _udgIdValidation.errors.join(', '), { itemIndex: index });
  }
  const jobDefinitionId = extractResourceLocatorValue(this.getNodeParameter('jobDefinitionId', index));
  const _jobDefinitionIdValidation = validateGuid(jobDefinitionId);
  if (!_jobDefinitionIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _jobDefinitionIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'POST', `/jobs/v2.0/UniversalDynamicGroups/${udgId}/AssignJobDefinition`, { jobDefinitionId });
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getKioskReleasesByEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const _endpointIdValidation = validateGuid(endpointId);
  if (!_endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/Endpoints/${endpointId}/KioskReleases`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/Endpoints/${endpointId}/KioskReleases`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getKioskReleasesByLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const logicalGroupId = this.getNodeParameter('logicalGroupId', index) as string;
  const _logicalGroupIdValidation = validateGuid(logicalGroupId);
  if (!_logicalGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _logicalGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/LogicalGroups/${logicalGroupId}/KioskReleases`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/LogicalGroups/${logicalGroupId}/KioskReleases`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getKioskReleasesByADObject(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const adObjectId = this.getNodeParameter('adObjectId', index) as string;
  const _adObjectIdValidation = validateGuid(adObjectId);
  if (!_adObjectIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _adObjectIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const qs: Record<string, string | number> = {};
  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', `/jobs/v2.0/ADObjects/${adObjectId}/KioskReleases`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit; qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/jobs/v2.0/ADObjects/${adObjectId}/KioskReleases`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}
