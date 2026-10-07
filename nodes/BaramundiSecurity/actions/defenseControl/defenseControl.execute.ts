import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import { validateGuid, validateRfc6902Patch, validateODataString , extractResourceLocatorValue } from '../../../shared/utils/validation';

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
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const _endpointIdValidation = validateGuid(endpointId);
  if (!_endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
  }
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
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const _endpointIdValidation = validateGuid(endpointId);
  if (!_endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/defensecontrol/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function triggerLocalAdminAccountsUpdate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const _endpointIdValidation = validateGuid(endpointId);
  if (!_endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
  }
  await apiRequest.call(this, 'POST', `/defensecontrol/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/${endpointId}/TriggerUpdateOnClient`);
  return this.helpers.returnJsonArray({ success: true, endpointId });
}

export async function patchLocalAdminUserCredentials(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const _endpointIdValidation = validateGuid(endpointId);
  if (!_endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
  }
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  // Build JSON Patch document for PATCH request
  const patchOperations: Array<{op: string; path: string; value: unknown}> = [];

  for (const [key, value] of Object.entries(updateFields)) {
    if (value !== undefined && value !== null && value !== '') {
      patchOperations.push({
        op: 'replace',
        // LocalAdminAccountWindowsEndpoint: the properties live under /LocalAdminAccount
        path: `/LocalAdminAccount/${key.charAt(0).toUpperCase()}${key.slice(1)}`,
        value,
      });
    }
  }

  if (patchOperations.length === 0) {
    throw new NodeOperationError(this.getNode(), 'No fields to update specified');
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
  const _threatIdValidation = validateGuid(threatId);
  if (!_threatIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _threatIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/defensecontrol/v2.0/MicrosoftDefender/Threats/${threatId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getMicrosoftDefenderThreatsByEndpoint(
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
  const _logicalGroupIdValidation = validateGuid(logicalGroupId);
  if (!_logicalGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _logicalGroupIdValidation.errors.join(', '), { itemIndex: index });
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
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const _endpointIdValidation = validateGuid(endpointId);
  if (!_endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/defensecontrol/v2.0/MicrosoftDefender/WindowsEndpoints/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ============================================================================
// BITLOCKER SECRETS OPERATIONS (26R1+)
// ============================================================================

export async function getBitLockerSecrets(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const _endpointIdValidation = validateGuid(endpointId);
  if (!_endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/defensecontrol/v2.0/BitLocker/WindowsEndpoints/${endpointId}/Secrets`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function patchBitLockerSecrets(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const _endpointIdValidation = validateGuid(endpointId);
  if (!_endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), _endpointIdValidation.errors.join(', '), { itemIndex: index });
  }
  const patchOperations = this.getNodeParameter('patchOperations', index) as string;

  let body: IDataObject[];
  try {
    body = JSON.parse(patchOperations) as IDataObject[];
  } catch {
    throw new NodeOperationError(this.getNode(), 'patchOperations must be a valid JSON array');
  }

  const validation = validateRfc6902Patch(body);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid RFC 6902 patch document:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const response = await apiRequest.call(this, 'PATCH', `/defensecontrol/v2.0/BitLocker/WindowsEndpoints/${endpointId}/Secrets`, body as unknown as IDataObject);
  return this.helpers.returnJsonArray(response as IDataObject);
}
