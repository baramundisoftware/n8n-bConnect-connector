import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../transport/requestApi';

// ============================================================================
// AD GROUPS OPERATIONS
// ============================================================================

export async function getADGroups(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/activedirectory/v2.0/ADGroups', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/activedirectory/v2.0/ADGroups', {}, qs);
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getADGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const adGroupId = this.getNodeParameter('adGroupId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/activedirectory/v2.0/ADGroups/${adGroupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getADGroupsByOrgUnit(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const orgUnitId = this.getNodeParameter('orgUnitId', index) as string;
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
      `/activedirectory/v2.0/OrgUnits/${orgUnitId}/ADGroups`,
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
      `/activedirectory/v2.0/OrgUnits/${orgUnitId}/ADGroups`,
      {},
      qs,
    );
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getADUsersByGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const adGroupId = this.getNodeParameter('adGroupId', index) as string;
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
      `/activedirectory/v2.0/ADGroups/${adGroupId}/ADUsers`,
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
      `/activedirectory/v2.0/ADGroups/${adGroupId}/ADUsers`,
      {},
      qs,
    );
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

// ============================================================================
// AD USERS OPERATIONS
// ============================================================================

export async function getADUsers(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/activedirectory/v2.0/ADUsers', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/activedirectory/v2.0/ADUsers', {}, qs);
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getADUser(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const adUserId = this.getNodeParameter('adUserId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/activedirectory/v2.0/ADUsers/${adUserId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// AD OBJECTS OPERATIONS
// ============================================================================

export async function getADObjects(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/activedirectory/v2.0/ADObjects', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/activedirectory/v2.0/ADObjects', {}, qs);
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getADObject(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const adObjectId = this.getNodeParameter('adObjectId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/activedirectory/v2.0/ADObjects/${adObjectId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// AD ORGANIZATIONAL UNITS OPERATIONS
// ============================================================================

export async function getOrgUnits(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/activedirectory/v2.0/OrgUnits', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/activedirectory/v2.0/OrgUnits', {}, qs);
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getOrgUnit(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const orgUnitId = this.getNodeParameter('orgUnitId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/activedirectory/v2.0/OrgUnits/${orgUnitId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}
