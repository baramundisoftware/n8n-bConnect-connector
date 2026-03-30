import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../transport/requestApi';

// ============================================================================
// BITLOCKER OPERATIONS
// ============================================================================

export async function getBitLockerWindowsEndpoints(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/defensecontrol/v2.0/BitLocker/WindowsEndpoints', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/defensecontrol/v2.0/BitLocker/WindowsEndpoints', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getBitLockerWindowsEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/defensecontrol/v2.0/BitLocker/WindowsEndpoints/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// LOCAL ADMINISTRATIVE ACCOUNTS OPERATIONS
// ============================================================================

export async function getLocalAdministrativeAccounts(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/defensecontrol/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function triggerLocalAdminAccountsUpdate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;
  await apiRequest.call(this, 'POST', `/defensecontrol/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/${endpointId}/TriggerUpdateOnClient`);
  return this.helpers.returnJsonArray({ success: true, endpointId });
}

export async function patchLocalAdminUserCredentials(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;
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

  const response = await apiRequest.call(this, 'PATCH', `/defensecontrol/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/${endpointId}`, patchOperations);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// MICROSOFT DEFENDER THREATS OPERATIONS
// ============================================================================

export async function getMicrosoftDefenderThreats(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/defensecontrol/v2.0/MicrosoftDefender/Threats', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/defensecontrol/v2.0/MicrosoftDefender/Threats', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getMicrosoftDefenderThreat(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const threatId = this.getNodeParameter('threatId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/defensecontrol/v2.0/MicrosoftDefender/Threats/${threatId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getMicrosoftDefenderThreatsByEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;
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
    const response = await apiRequestAllItems.call(
      this,
      'GET',
      `/defensecontrol/v2.0/MicrosoftDefender/WindowsEndpoints/${endpointId}/Threats`,
      {},
      qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this,
      'GET',
      `/defensecontrol/v2.0/MicrosoftDefender/WindowsEndpoints/${endpointId}/Threats`,
      {},
      qs,
    );
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getMicrosoftDefenderThreatsByLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const logicalGroupId = this.getNodeParameter('logicalGroupId', index) as string;
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
    const response = await apiRequestAllItems.call(
      this,
      'GET',
      `/defensecontrol/v2.0/MicrosoftDefender/LogicalGroups/${logicalGroupId}/Threats`,
      {},
      qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this,
      'GET',
      `/defensecontrol/v2.0/MicrosoftDefender/LogicalGroups/${logicalGroupId}/Threats`,
      {},
      qs,
    );
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

// ============================================================================
// MICROSOFT DEFENDER ENDPOINTS OPERATIONS
// ============================================================================

export async function getMicrosoftDefenderWindowsEndpoints(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/defensecontrol/v2.0/MicrosoftDefender/WindowsEndpoints', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/defensecontrol/v2.0/MicrosoftDefender/WindowsEndpoints', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getMicrosoftDefenderWindowsEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/defensecontrol/v2.0/MicrosoftDefender/WindowsEndpoints/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}
