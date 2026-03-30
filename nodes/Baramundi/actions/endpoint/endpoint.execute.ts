import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../transport/requestApi';
import {
	validateGuid,
	validateDisplayName,
	validateEmail,
	validateMacAddress,
	validateIpv4Address,
	validateMaintenanceWindow,
	validateRfc6902Patch,
} from '../../utils/validation';

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;

  // Validate GUID format
  const validation = validateGuid(endpointId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/Endpoints/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getMany(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    orderBy?: string;
    orgUnitId?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (options.orgUnitId) {
    qs.OrgUnitId = options.orgUnitId;
  }

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/endpoints/v2.0/Endpoints', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;

    const response = await apiRequest.call(this, 'GET', '/endpoints/v2.0/Endpoints', {}, qs);
    const data = (response.data as IDataObject[]) || [];

    return this.helpers.returnJsonArray(data);
  }
}

export async function search(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const searchQuery = this.getNodeParameter('searchQuery', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  const qs: Record<string, string | number> = {
    SearchQuery: searchQuery,
  };

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', '/endpoints/v2.0/Endpoints', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;

    const response = await apiRequest.call(this, 'GET', '/endpoints/v2.0/Endpoints', {}, qs);
    const data = (response.data as IDataObject[]) || [];

    return this.helpers.returnJsonArray(data);
  }
}

export async function deleteEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;

  // Validate GUID format
  const validation = validateGuid(endpointId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/Endpoints/${endpointId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: endpointId });
}

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointType = this.getNodeParameter('endpointType', index) as string;
  const displayName = this.getNodeParameter('displayName', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  // Validate display name
  const displayNameValidation = validateDisplayName(displayName);
  if (!displayNameValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid display name:\n${displayNameValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // Validate optional fields
  const errors: string[] = [];

  // Validate primary MAC address if provided
  if (additionalFields.primaryMAC) {
    const macValidation = validateMacAddress(additionalFields.primaryMAC as string);
    if (!macValidation.valid) {
      errors.push(...macValidation.errors.map((e) => `Primary MAC: ${e}`));
    }
  }

  // Validate primary IP address if provided
  if (additionalFields.primaryIP) {
    const ipValidation = validateIpv4Address(additionalFields.primaryIP as string);
    if (!ipValidation.valid) {
      errors.push(...ipValidation.errors.map((e) => `Primary IP: ${e}`));
    }
  }

  // Validate logical group ID if provided
  if (additionalFields.logicalGroupId) {
    const groupValidation = validateGuid(additionalFields.logicalGroupId as string);
    if (!groupValidation.valid) {
      errors.push(...groupValidation.errors.map((e) => `Logical Group ID: ${e}`));
    }
  }

  if (errors.length > 0) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid parameters:\n${errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // Determine API endpoint based on type
  const endpointMap: Record<string, string> = {
    windows: '/endpoints/v2.0/WindowsEndpoints',
    linux: '/endpoints/v2.0/LinuxEndpoints',
    mac: '/endpoints/v2.0/MacEndpoints',
    android: '/endpoints/v2.0/AndroidEndpoints',
    ios: '/endpoints/v2.0/IosEndpoints',
  };

  const apiEndpoint = endpointMap[endpointType];
  if (!apiEndpoint) {
    throw new Error(`Unknown endpoint type: ${endpointType}`);
  }

  // Build request body based on endpoint type
  const body: IDataObject = {
    displayName,
    ...additionalFields,
  };

  // Add hostName for Windows and Linux (required)
  if (endpointType === 'windows' || endpointType === 'linux') {
    const hostName = this.getNodeParameter('hostName', index) as string;
    body.hostName = hostName;
  }

  const response = await apiRequest.call(this, 'POST', apiEndpoint, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  // Validate endpoint ID
  const guidValidation = validateGuid(endpointId);
  if (!guidValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${guidValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // Validate update fields
  const errors: string[] = [];

  if (updateFields.displayName) {
    const nameValidation = validateDisplayName(updateFields.displayName as string);
    if (!nameValidation.valid) {
      errors.push(...nameValidation.errors.map((e) => `Display Name: ${e}`));
    }
  }

  if (updateFields.primaryMAC) {
    const macValidation = validateMacAddress(updateFields.primaryMAC as string);
    if (!macValidation.valid) {
      errors.push(...macValidation.errors.map((e) => `Primary MAC: ${e}`));
    }
  }

  if (updateFields.primaryIP) {
    const ipValidation = validateIpv4Address(updateFields.primaryIP as string);
    if (!ipValidation.valid) {
      errors.push(...ipValidation.errors.map((e) => `Primary IP: ${e}`));
    }
  }

  if (updateFields.logicalGroupId) {
    const groupValidation = validateGuid(updateFields.logicalGroupId as string);
    if (!groupValidation.valid) {
      errors.push(...groupValidation.errors.map((e) => `Logical Group ID: ${e}`));
    }
  }

  if (errors.length > 0) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid update parameters:\n${errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // Build JSON Patch document for PATCH request
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
    throw new Error('No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/WindowsEndpoints/${endpointId}`, patchOperations);

  // Fetch updated endpoint to return
  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/WindowsEndpoints/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function startEnrollment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;
  const enrollmentOptions = this.getNodeParameter('enrollmentOptions', index, {}) as IDataObject;

  // Validate endpoint ID
  const guidValidation = validateGuid(endpointId);
  if (!guidValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${guidValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // Validate email recipient if provided
  if (enrollmentOptions.emailRecipient) {
    const emailValidation = validateEmail(enrollmentOptions.emailRecipient as string);
    if (!emailValidation.valid) {
      throw new NodeOperationError(
        this.getNode(),
        `Invalid email recipient:\n${emailValidation.errors.join('\n')}`,
        { itemIndex: index },
      );
    }
  }

  // First, get the endpoint to determine its type
  const endpoint = await apiRequest.call(this, 'GET', `/endpoints/v2.0/Endpoints/${endpointId}`);
  const endpointType = (endpoint.type as string) || 'Windows';

  // Map endpoint type to enrollment endpoint
  const enrollmentEndpointMap: Record<string, string> = {
    WindowsEndpoint: `/endpoints/v2.0/WindowsEndpoints/${endpointId}/StartEnrollment`,
    LinuxEndpoint: `/endpoints/v2.0/LinuxEndpoints/${endpointId}/StartEnrollment`,
    MacEndpoint: `/endpoints/v2.0/MacEndpoints/${endpointId}/StartEnrollment`,
    AndroidEndpoint: `/endpoints/v2.0/AndroidEndpoints/${endpointId}/StartEnrollment`,
    IosEndpoint: `/endpoints/v2.0/IosEndpoints/${endpointId}/StartEnrollment`,
  };

  const enrollmentEndpoint = enrollmentEndpointMap[endpointType];
  if (!enrollmentEndpoint) {
    throw new Error(`Enrollment not supported for endpoint type: ${endpointType}`);
  }

  // Build enrollment request body
  const body: IDataObject = {};
  if (enrollmentOptions.emailRecipient) {
    body.emailRecipient = enrollmentOptions.emailRecipient;
  }
  if (enrollmentOptions.emailLanguageId) {
    body.emailLanguageId = enrollmentOptions.emailLanguageId;
  }

  const response = await apiRequest.call(this, 'POST', enrollmentEndpoint, body);
  return this.helpers.returnJsonArray({
    success: true,
    endpointId,
    enrollmentStatus: response || 'Enrollment started',
  });
}

export async function triggerIntuneInstallation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;

  // Validate endpoint ID
  const guidValidation = validateGuid(endpointId);
  if (!guidValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${guidValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // Trigger Intune installation for Windows endpoint
  await apiRequest.call(this, 'POST', `/endpoints/v2.0/WindowsEndpoints/${endpointId}/TriggerInstallationViaIntune`);
  return this.helpers.returnJsonArray({
    success: true,
    endpointId,
    action: 'triggerIntuneInstallation',
  });
}

// ============================================================================
// LOGICAL GROUP OPERATIONS
// ============================================================================

export async function getLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/LogicalGroups/${groupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getLogicalGroups(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/endpoints/v2.0/LogicalGroups', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/endpoints/v2.0/LogicalGroups', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function createLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/endpoints/v2.0/LogicalGroups', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
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
    throw new Error('No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/LogicalGroups/${groupId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/LogicalGroups/${groupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/LogicalGroups/${groupId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: groupId });
}

// ============================================================================
// STATIC GROUP OPERATIONS
// ============================================================================

export async function getStaticGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/StaticGroups/${groupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getStaticGroups(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/endpoints/v2.0/StaticGroups', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/endpoints/v2.0/StaticGroups', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

export async function createStaticGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', '/endpoints/v2.0/StaticGroups', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateStaticGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
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
    throw new Error('No fields to update specified');
  }

  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/StaticGroups/${groupId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/StaticGroups/${groupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteStaticGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/StaticGroups/${groupId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: groupId });
}

// ============================================================================
// DYNAMIC GROUP OPERATIONS (READ-ONLY)
// ============================================================================

export async function getDynamicGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/DynamicGroups/${groupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getDynamicGroups(
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
    const response = await apiRequestAllItems.call(this, 'GET', '/endpoints/v2.0/DynamicGroups', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/endpoints/v2.0/DynamicGroups', {}, qs);
    const data = (response.data as IDataObject[]) || [];
    return this.helpers.returnJsonArray(data);
  }
}

// ============================================================================
// MAINTENANCE WINDOW OPERATIONS
// ============================================================================

export async function createEndpointMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;
  const startTime = this.getNodeParameter('startTime', index) as string;
  const endTime = this.getNodeParameter('endTime', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  // Validate endpoint ID
  const guidValidation = validateGuid(endpointId);
  if (!guidValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${guidValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // Validate maintenance window times
  const windowValidation = validateMaintenanceWindow(startTime, endTime);
  if (!windowValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid maintenance window:\n${windowValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const body: IDataObject = {
    startTime,
    endTime,
    ...additionalFields,
  };

  const response = await apiRequest.call(this, 'POST', `/endpoints/v2.0/WindowsEndpoints/${endpointId}/MaintenanceWindows`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateEndpointMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;
  const windowId = this.getNodeParameter('windowId', index) as string;
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
    throw new Error('No fields to update specified');
  }

  const mwValidation = validateRfc6902Patch(patchOperations);
  if (!mwValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid RFC 6902 patch document:\n${mwValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/WindowsEndpoints/${endpointId}/MaintenanceWindows/${windowId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/WindowsEndpoints/${endpointId}/MaintenanceWindows/${windowId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteEndpointMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;
  const windowId = this.getNodeParameter('windowId', index) as string;

  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/WindowsEndpoints/${endpointId}/MaintenanceWindows/${windowId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: windowId });
}

export async function createGroupMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupType = this.getNodeParameter('groupType', index) as string;
  const startTime = this.getNodeParameter('startTime', index) as string;
  const endTime = this.getNodeParameter('endTime', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    startTime,
    endTime,
    ...additionalFields,
  };

  const groupTypeMap: Record<string, string> = {
    logical: 'LogicalGroups',
    static: 'StaticGroups',
    dynamic: 'DynamicGroups',
  };

  const groupTypePath = groupTypeMap[groupType];
  const response = await apiRequest.call(this, 'POST', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindows`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateGroupMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupType = this.getNodeParameter('groupType', index) as string;
  const windowId = this.getNodeParameter('windowId', index) as string;
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
    throw new Error('No fields to update specified');
  }

  const groupMwValidation = validateRfc6902Patch(patchOperations);
  if (!groupMwValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid RFC 6902 patch document:\n${groupMwValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const groupTypeMap: Record<string, string> = {
    logical: 'LogicalGroups',
    static: 'StaticGroups',
    dynamic: 'DynamicGroups',
  };

  const groupTypePath = groupTypeMap[groupType];
  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindows/${windowId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindows/${windowId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteGroupMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupType = this.getNodeParameter('groupType', index) as string;
  const windowId = this.getNodeParameter('windowId', index) as string;

  const groupTypeMap: Record<string, string> = {
    logical: 'LogicalGroups',
    static: 'StaticGroups',
    dynamic: 'DynamicGroups',
  };

  const groupTypePath = groupTypeMap[groupType];
  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindows/${windowId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: windowId });
}

// ----------------------------------
//   MaintenanceWindow PUT variants (25R2)
// ----------------------------------

export async function putEndpointMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;
  const windowId = this.getNodeParameter('windowId', index) as string;
  const maintenanceWindowJson = this.getNodeParameter('maintenanceWindowJson', index) as string;

  const validation = validateGuid(endpointId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  let body: IDataObject;
  try {
    body = JSON.parse(maintenanceWindowJson) as IDataObject;
  } catch {
    throw new Error('maintenanceWindowJson must be a valid JSON object');
  }

  const response = await apiRequest.call(this, 'PUT', `/endpoints/v2.0/WindowsEndpoints/${endpointId}/MaintenanceWindows/${windowId}`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function putGroupMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupType = this.getNodeParameter('groupType', index) as string;
  const windowId = this.getNodeParameter('windowId', index) as string;
  const maintenanceWindowJson = this.getNodeParameter('maintenanceWindowJson', index) as string;

  const groupTypeMap: Record<string, string> = {
    logical: 'LogicalGroups',
    static: 'StaticGroups',
    dynamic: 'DynamicGroups',
  };

  let body: IDataObject;
  try {
    body = JSON.parse(maintenanceWindowJson) as IDataObject;
  } catch {
    throw new Error('maintenanceWindowJson must be a valid JSON object');
  }

  const groupTypePath = groupTypeMap[groupType];
  const response = await apiRequest.call(this, 'PUT', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindows/${windowId}`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ----------------------------------
//   EntraId operations (26R1+)
// ----------------------------------

export async function setEntraIdData(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;

  const validation = validateGuid(endpointId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const entraIdDeviceId = this.getNodeParameter('entraIdDeviceId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
    entraIdTenantId?: string;
    entraIdUserId?: string;
  };

  const body: IDataObject = { entraIdDeviceId };
  if (additionalFields.entraIdTenantId) body.entraIdTenantId = additionalFields.entraIdTenantId;
  if (additionalFields.entraIdUserId) body.entraIdUserId = additionalFields.entraIdUserId;

  const response = await apiRequest.call(this, 'POST', `/endpoints/v2.0/Endpoints/${endpointId}/EntraIdData`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteEntraIdData(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointSelection = this.getNodeParameter('endpointSelection', index) as string;
  const endpointId = endpointSelection === '__custom__'
    ? this.getNodeParameter('endpointId', index) as string
    : endpointSelection;

  const validation = validateGuid(endpointId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/Endpoints/${endpointId}/EntraIdData`);
  return this.helpers.returnJsonArray({ success: true, deletedEndpointId: endpointId });
}

export async function getEntraIdDataByDeviceId(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const deviceId = this.getNodeParameter('deviceId', index) as string;

  const validation = validateGuid(deviceId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid device ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/EntraIdData/${deviceId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ----------------------------------
//   UnmanagedEndpoints operations (26R1+)
// ----------------------------------

export async function getUnmanagedEndpoints(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;

  if (returnAll) {
    const data = await apiRequestAllItems.call(this, 'GET', '/endpoints/v2.0/UnmanagedEndpoints', {}, {});
    return this.helpers.returnJsonArray(data as IDataObject[]);
  }

  const qs: Record<string, number> = { PageSize: limit, Page: 0 };
  const response = await apiRequest.call(this, 'GET', '/endpoints/v2.0/UnmanagedEndpoints', {}, qs);
  const data = (response.data as IDataObject[]) || [];
  return this.helpers.returnJsonArray(data);
}

export async function getUnmanagedEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const id = this.getNodeParameter('unmanagedEndpointId', index) as string;

  const validation = validateGuid(id);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid unmanaged endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/UnmanagedEndpoints/${id}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteUnmanagedEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const id = this.getNodeParameter('unmanagedEndpointId', index) as string;

  const validation = validateGuid(id);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid unmanaged endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/UnmanagedEndpoints/${id}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: id });
}
