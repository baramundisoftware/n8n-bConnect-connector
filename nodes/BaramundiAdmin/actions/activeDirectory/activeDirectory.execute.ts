import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import { validateGuid, validateODataString } from '../../../shared/utils/validation';

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
  const _adGroupIdValidation = validateGuid(adGroupId);
  if (!_adGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _adGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/activedirectory/v2.0/ADGroups/${adGroupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getADGroupsByOrgUnit(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const orgUnitId = this.getNodeParameter('orgUnitId', index) as string;
  const _orgUnitIdValidation = validateGuid(orgUnitId);
  if (!_orgUnitIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _orgUnitIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const _adGroupIdValidation = validateGuid(adGroupId);
  if (!_adGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _adGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const _adUserIdValidation = validateGuid(adUserId);
  if (!_adUserIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _adUserIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const _adObjectIdValidation = validateGuid(adObjectId);
  if (!_adObjectIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _adObjectIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const _orgUnitIdValidation = validateGuid(orgUnitId);
  if (!_orgUnitIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _orgUnitIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/activedirectory/v2.0/OrgUnits/${orgUnitId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// AD SUB-NAVIGATION OPERATIONS (Phase 8A)
// ============================================================================

export async function getADGroupsByADGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const adGroupId = this.getNodeParameter('adGroupId', index) as string;
  const _adGroupIdValidation = validateGuid(adGroupId);
  if (!_adGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _adGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    qs.SearchQuery = options.searchQuery;
  }
  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this, 'GET', `/activedirectory/v2.0/ADGroups/${adGroupId}/ADGroups`, {}, qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this, 'GET', `/activedirectory/v2.0/ADGroups/${adGroupId}/ADGroups`, {}, qs,
    );
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getADObjectsByADGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const adGroupId = this.getNodeParameter('adGroupId', index) as string;
  const _adGroupIdValidation = validateGuid(adGroupId);
  if (!_adGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _adGroupIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    qs.SearchQuery = options.searchQuery;
  }
  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this, 'GET', `/activedirectory/v2.0/ADGroups/${adGroupId}/ADObjects`, {}, qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this, 'GET', `/activedirectory/v2.0/ADGroups/${adGroupId}/ADObjects`, {}, qs,
    );
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getADObjectMemberships(
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
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    qs.SearchQuery = options.searchQuery;
  }
  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this, 'GET', `/activedirectory/v2.0/ADObjects/${adObjectId}/ADGroupMemberships`, {}, qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this, 'GET', `/activedirectory/v2.0/ADObjects/${adObjectId}/ADGroupMemberships`, {}, qs,
    );
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getADObjectsByOrgUnit(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const orgUnitId = this.getNodeParameter('orgUnitId', index) as string;
  const _orgUnitIdValidation = validateGuid(orgUnitId);
  if (!_orgUnitIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _orgUnitIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    qs.SearchQuery = options.searchQuery;
  }
  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this, 'GET', `/activedirectory/v2.0/OrgUnits/${orgUnitId}/ADObjects`, {}, qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this, 'GET', `/activedirectory/v2.0/OrgUnits/${orgUnitId}/ADObjects`, {}, qs,
    );
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getADUsersByOrgUnit(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const orgUnitId = this.getNodeParameter('orgUnitId', index) as string;
  const _orgUnitIdValidation = validateGuid(orgUnitId);
  if (!_orgUnitIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _orgUnitIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    qs.SearchQuery = options.searchQuery;
  }
  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this, 'GET', `/activedirectory/v2.0/OrgUnits/${orgUnitId}/ADUsers`, {}, qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this, 'GET', `/activedirectory/v2.0/OrgUnits/${orgUnitId}/ADUsers`, {}, qs,
    );
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}

export async function getOrgUnitsByOrgUnit(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const orgUnitId = this.getNodeParameter('orgUnitId', index) as string;
  const _orgUnitIdValidation = validateGuid(orgUnitId);
  if (!_orgUnitIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _orgUnitIdValidation.errors.join(', '), { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    searchQuery?: string;
    orderBy?: string;
  };

  const qs: Record<string, string | number> = {};
  if (options.searchQuery) {
    const sqValidation = validateODataString(options.searchQuery, 'Search Query');
    if (!sqValidation.valid) throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
    qs.SearchQuery = options.searchQuery;
  }
  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    qs.OrderBy = options.orderBy;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(
      this, 'GET', `/activedirectory/v2.0/OrgUnits/${orgUnitId}/OrgUnits`, {}, qs,
    );
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(
      this, 'GET', `/activedirectory/v2.0/OrgUnits/${orgUnitId}/OrgUnits`, {}, qs,
    );
    const data = (response.data || response) as IDataObject[];
    return this.helpers.returnJsonArray(data);
  }
}
