import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems } from '../../../shared/transport/requestApi';
import {
	validateGuid,
	validateDisplayName,
	validateEmail,
	validateMacAddress,
	validateIpv4Address,
	validateMaintenanceWindow,
	validateRfc6902Patch,
	validateODataString,
	extractResourceLocatorValue,
} from '../../../shared/utils/validation';

const TYPED_ENDPOINT_PATH: Record<string, string> = {
  windows: 'WindowsEndpoints',
  android: 'AndroidEndpoints',
  ios: 'IosEndpoints',
  linux: 'LinuxEndpoints',
  mac: 'MacEndpoints',
  network: 'NetworkEndpoints',
};

const ENROLLMENT_SUPPORTED_TYPES = new Set(['windows', 'android', 'ios', 'mac']);

const GROUP_TYPE_PATH: Record<string, string> = {
  logical: 'LogicalGroups',
  static: 'StaticGroups',
  dynamic: 'DynamicGroups',
  udg: 'UniversalDynamicGroups',
  adUser: 'ADUsers',
};

export async function get(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const endpointType = this.getNodeParameter('endpointType', index, 'all') as string;

  // Validate GUID format
  const validation = validateGuid(endpointId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const typePath = endpointType !== 'all' ? TYPED_ENDPOINT_PATH[endpointType] : null;
  const url = typePath
    ? `/endpoints/v2.0/${typePath}/${endpointId}`
    : `/endpoints/v2.0/Endpoints/${endpointId}`;

  const response = await apiRequest.call(this, 'GET', url);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getMany(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointType = this.getNodeParameter('endpointType', index, 'all') as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as {
    orderBy?: string;
    orgUnitId?: string;
  };

  const qs: Record<string, string | number> = {};

  if (options.orderBy) {
    const obValidation = validateODataString(options.orderBy, 'Order By');
    if (!obValidation.valid) {
      throw new NodeOperationError(this.getNode(), obValidation.errors.join('\n'), { itemIndex: index });
    }
    qs.OrderBy = options.orderBy;
  }

  if (options.orgUnitId) {
    qs.OrgUnitId = options.orgUnitId;
  }

  const typePath = endpointType !== 'all' ? TYPED_ENDPOINT_PATH[endpointType] : null;
  if (endpointType !== 'all' && !typePath) {
    throw new NodeOperationError(this.getNode(), `Unknown platform type: ${endpointType}`, { itemIndex: index });
  }
  const url = typePath ? `/endpoints/v2.0/${typePath}` : '/endpoints/v2.0/Endpoints';

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', url, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;

    const response = await apiRequest.call(this, 'GET', url, {}, qs);
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

  const sqValidation = validateODataString(searchQuery, 'Search Query');
  if (!sqValidation.valid) {
    throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
  }

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
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const endpointType = this.getNodeParameter('endpointType', index, 'all') as string;

  // Validate GUID format
  const validation = validateGuid(endpointId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const typePath = endpointType !== 'all' ? TYPED_ENDPOINT_PATH[endpointType] : null;
  const url = typePath
    ? `/endpoints/v2.0/${typePath}/${endpointId}`
    : `/endpoints/v2.0/Endpoints/${endpointId}`;

  await apiRequest.call(this, 'DELETE', url);
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
    android: '/endpoints/v2.0/AndroidEndpoints',
    ios: '/endpoints/v2.0/IosEndpoints',
    linux: '/endpoints/v2.0/LinuxEndpoints',
    mac: '/endpoints/v2.0/MacEndpoints',
    network: '/endpoints/v2.0/NetworkEndpoints',
    windows: '/endpoints/v2.0/WindowsEndpoints',
  };

  const apiEndpoint = endpointMap[endpointType];
  if (!apiEndpoint) {
    throw new NodeOperationError(this.getNode(), `Unknown endpoint type: ${endpointType}`);
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

  // Add primaryIP for Network (required)
  if (endpointType === 'network') {
    const primaryIP = this.getNodeParameter('primaryIP', index) as string;
    const ipValidation = validateIpv4Address(primaryIP);
    if (!ipValidation.valid) {
      throw new NodeOperationError(
        this.getNode(),
        `Invalid primary IP address:\n${ipValidation.errors.join('\n')}`,
        { itemIndex: index },
      );
    }
    body.primaryIP = primaryIP;
  }

  const response = await apiRequest.call(this, 'POST', apiEndpoint, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const endpointType = this.getNodeParameter('endpointType', index, 'windows') as string;
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
    throw new NodeOperationError(this.getNode(), 'No fields to update specified');
  }

  const typePath = TYPED_ENDPOINT_PATH[endpointType] ?? 'WindowsEndpoints';
  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/${typePath}/${endpointId}`, patchOperations);

  // Fetch updated endpoint to return
  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/${typePath}/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function startEnrollment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
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

  // Resolve enrollment URL: use explicit endpointType if provided, else look up from API
  const explicitType = this.getNodeParameter('endpointType', index, '') as string;
  let enrollmentEndpoint: string;

  if (explicitType && explicitType !== 'all') {
    if (!ENROLLMENT_SUPPORTED_TYPES.has(explicitType)) {
      throw new NodeOperationError(this.getNode(), `Enrollment not supported for platform type: ${explicitType}`, { itemIndex: index });
    }
    const typePath = TYPED_ENDPOINT_PATH[explicitType];
    enrollmentEndpoint = `/endpoints/v2.0/${typePath}/${endpointId}/StartEnrollment`;
  } else {
    // Fall back to API lookup
    const ep = await apiRequest.call(this, 'GET', `/endpoints/v2.0/Endpoints/${endpointId}`);
    const apiType = (ep.type as string) || 'Windows';
    const enrollmentEndpointMap: Record<string, string> = {
      WindowsEndpoint: `/endpoints/v2.0/WindowsEndpoints/${endpointId}/StartEnrollment`,
      LinuxEndpoint: `/endpoints/v2.0/LinuxEndpoints/${endpointId}/StartEnrollment`,
      MacEndpoint: `/endpoints/v2.0/MacEndpoints/${endpointId}/StartEnrollment`,
      AndroidEndpoint: `/endpoints/v2.0/AndroidEndpoints/${endpointId}/StartEnrollment`,
      IosEndpoint: `/endpoints/v2.0/IosEndpoints/${endpointId}/StartEnrollment`,
    };
    const mappedEndpoint = enrollmentEndpointMap[apiType];
    if (!mappedEndpoint) {
      throw new NodeOperationError(this.getNode(), `Enrollment not supported for endpoint type: ${apiType}`);
    }
    enrollmentEndpoint = mappedEndpoint;
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
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));

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
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
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

  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/LogicalGroups/${groupId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/LogicalGroups/${groupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
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

  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/StaticGroups/${groupId}`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/StaticGroups/${groupId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteStaticGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
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

  const response = await apiRequest.call(this, 'POST', `/endpoints/v2.0/Endpoints/${endpointId}/MaintenanceWindow`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateEndpointMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  // MaintenanceWindow is a singleton per endpoint/group — no windowId needed
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

  const mwValidation = validateRfc6902Patch(patchOperations);
  if (!mwValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid RFC 6902 patch document:\n${mwValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/Endpoints/${endpointId}/MaintenanceWindow`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/Endpoints/${endpointId}/MaintenanceWindow`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteEndpointMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Get endpoint ID from either dropdown selection or custom GUID input
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  // MaintenanceWindow is a singleton per endpoint/group — no windowId needed

  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/Endpoints/${endpointId}/MaintenanceWindow`);
  return this.helpers.returnJsonArray({ success: true });
}

export async function createGroupMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const response = await apiRequest.call(this, 'POST', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindow`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateGroupMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const groupType = this.getNodeParameter('groupType', index) as string;
  // MaintenanceWindow is a singleton per endpoint/group — no windowId needed
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
  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindow`, patchOperations);

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindow`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteGroupMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const groupType = this.getNodeParameter('groupType', index) as string;
  // MaintenanceWindow is a singleton per endpoint/group — no windowId needed

  const groupTypeMap: Record<string, string> = {
    logical: 'LogicalGroups',
    static: 'StaticGroups',
    dynamic: 'DynamicGroups',
  };

  const groupTypePath = groupTypeMap[groupType];
  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindow`);
  return this.helpers.returnJsonArray({ success: true });
}

// ----------------------------------
//   MaintenanceWindow PUT variants (25R2)
// ----------------------------------

export async function putEndpointMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  // MaintenanceWindow is a singleton per endpoint — no windowId needed
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
    throw new NodeOperationError(this.getNode(), 'maintenanceWindowJson must be a valid JSON object');
  }

  const response = await apiRequest.call(this, 'PUT', `/endpoints/v2.0/Endpoints/${endpointId}/MaintenanceWindow`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function putGroupMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const groupType = this.getNodeParameter('groupType', index) as string;
  // MaintenanceWindow is a singleton per endpoint/group — no windowId needed
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
    throw new NodeOperationError(this.getNode(), 'maintenanceWindowJson must be a valid JSON object');
  }

  const groupTypePath = groupTypeMap[groupType];
  const response = await apiRequest.call(this, 'PUT', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindow`, body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

// ----------------------------------
//   EntraId operations (26R1+)
// ----------------------------------

export async function setEntraIdData(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));

  const validation = validateGuid(endpointId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  const entraIdDeviceId = this.getNodeParameter('entraIdDeviceId', index) as string;
  const entraIdDeviceIdValidation = validateGuid(entraIdDeviceId);
  if (!entraIdDeviceIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid entra ID device ID:\n${entraIdDeviceIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
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
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));

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

// ============================================================================
// ENDPOINT GROUP/MAINTENANCE READS (Phase 8C)
// ============================================================================

export async function getEndpointMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = extractResourceLocatorValue(this.getNodeParameter('endpointId', index));
  const endpointIdValidation = validateGuid(endpointId);
  if (!endpointIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid endpoint ID:\n${endpointIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/Endpoints/${endpointId}/MaintenanceWindow`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getGroupMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // Same fields as the other group maintenance-window operations (groupId + groupType)
  const groupId = this.getNodeParameter('groupId', index) as string;
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const groupType = this.getNodeParameter('groupType', index) as string;

  const groupTypeMap: Record<string, string> = {
    logical: 'LogicalGroups',
    static: 'StaticGroups',
    dynamic: 'DynamicGroups',
  };

  const groupTypePath = groupTypeMap[groupType];
  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/${groupTypePath}/${groupId}/MaintenanceWindow`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getLogicalGroupSubGroups(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const logicalGroupId = this.getNodeParameter('logicalGroupId', index) as string;
  const logicalGroupIdValidation = validateGuid(logicalGroupId);
  if (!logicalGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid logical group ID:\n${logicalGroupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

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
    const response = await apiRequestAllItems.call(this, 'GET', `/endpoints/v2.0/LogicalGroups/${logicalGroupId}/LogicalGroups`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/LogicalGroups/${logicalGroupId}/LogicalGroups`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getEndpointsByLogicalGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const logicalGroupId = this.getNodeParameter('logicalGroupId', index) as string;
  const logicalGroupIdValidation = validateGuid(logicalGroupId);
  if (!logicalGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid logical group ID:\n${logicalGroupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

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
    const response = await apiRequestAllItems.call(this, 'GET', `/endpoints/v2.0/LogicalGroups/${logicalGroupId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/LogicalGroups/${logicalGroupId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getEndpointsByStaticGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const staticGroupId = this.getNodeParameter('staticGroupId', index) as string;
  const staticGroupIdValidation = validateGuid(staticGroupId);
  if (!staticGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid static group ID:\n${staticGroupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

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
    const response = await apiRequestAllItems.call(this, 'GET', `/endpoints/v2.0/StaticGroups/${staticGroupId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/StaticGroups/${staticGroupId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getEndpointsByDynamicGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const dynamicGroupId = this.getNodeParameter('dynamicGroupId', index) as string;
  const dynamicGroupIdValidation = validateGuid(dynamicGroupId);
  if (!dynamicGroupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid dynamic group ID:\n${dynamicGroupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

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
    const response = await apiRequestAllItems.call(this, 'GET', `/endpoints/v2.0/DynamicGroups/${dynamicGroupId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/DynamicGroups/${dynamicGroupId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getEndpointsByUDG(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const udgId = this.getNodeParameter('udgId', index) as string;
  const udgIdValidation = validateGuid(udgId);
  if (!udgIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid UDG ID:\n${udgIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

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
    const response = await apiRequestAllItems.call(this, 'GET', `/endpoints/v2.0/UniversalDynamicGroups/${udgId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/UniversalDynamicGroups/${udgId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getEndpointsByADUser(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const adUserId = this.getNodeParameter('adUserId', index) as string;
  const adUserIdValidation = validateGuid(adUserId);
  if (!adUserIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid AD user ID:\n${adUserIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

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
    const response = await apiRequestAllItems.call(this, 'GET', `/endpoints/v2.0/ADUsers/${adUserId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/ADUsers/${adUserId}/Endpoints`, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

// ============================================================================
// ENDPOINT GET-BY-GROUP (consolidates typed endpoint group queries)
// ============================================================================

export async function getEndpointsByGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointType = this.getNodeParameter('endpointType', index, 'all') as string;
  const groupType = this.getNodeParameter('groupType', index) as string;
  const groupId = this.getNodeParameter('typedGroupId', index) as string;
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

  const groupTypePath = GROUP_TYPE_PATH[groupType];
  if (!groupTypePath) throw new NodeOperationError(this.getNode(), `Unknown group type: ${groupType}`, { itemIndex: index });

  const typePath = endpointType !== 'all' ? TYPED_ENDPOINT_PATH[endpointType] : null;
  if (endpointType !== 'all' && !typePath) {
    throw new NodeOperationError(this.getNode(), `Unknown platform type: ${endpointType}`, { itemIndex: index });
  }

  const endpointSegment = typePath ?? 'Endpoints';
  const url = `/endpoints/v2.0/${groupTypePath}/${groupId}/${endpointSegment}`;

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
    const response = await apiRequestAllItems.call(this, 'GET', url, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', url, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

// ============================================================================
// INDUSTRIAL ENDPOINT OPERATIONS (25R2 only)
// ============================================================================

export async function getIndustrialEndpoints(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

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
    const response = await apiRequestAllItems.call(this, 'GET', '/endpoints/v2.0/IndustrialEndpoints', {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', '/endpoints/v2.0/IndustrialEndpoints', {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}

export async function getIndustrialEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('industrialEndpointId', index) as string;

  const guidValidation = validateGuid(endpointId);
  if (!guidValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid endpoint ID:\n${guidValidation.errors.join('\n')}`, { itemIndex: index });
  }

  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/IndustrialEndpoints/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function createIndustrialEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const displayName = this.getNodeParameter('displayName', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const displayNameValidation = validateDisplayName(displayName);
  if (!displayNameValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid display name:\n${displayNameValidation.errors.join('\n')}`, { itemIndex: index });
  }

  const body: IDataObject = { displayName, ...additionalFields };
  const response = await apiRequest.call(this, 'POST', '/endpoints/v2.0/IndustrialEndpoints', body);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function updateIndustrialEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('industrialEndpointId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const guidValidation = validateGuid(endpointId);
  if (!guidValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid endpoint ID:\n${guidValidation.errors.join('\n')}`, { itemIndex: index });
  }

  const patchOperations: Array<{op: string; path: string; value: unknown}> = [];
  for (const [key, value] of Object.entries(updateFields)) {
    if (value !== undefined && value !== null && value !== '') {
      patchOperations.push({ op: 'replace', path: `/${key}`, value });
    }
  }
  if (patchOperations.length === 0) throw new NodeOperationError(this.getNode(), 'No fields to update specified');

  await apiRequest.call(this, 'PATCH', `/endpoints/v2.0/IndustrialEndpoints/${endpointId}`, patchOperations);
  const response = await apiRequest.call(this, 'GET', `/endpoints/v2.0/IndustrialEndpoints/${endpointId}`);
  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteIndustrialEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('industrialEndpointId', index) as string;

  const guidValidation = validateGuid(endpointId);
  if (!guidValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid endpoint ID:\n${guidValidation.errors.join('\n')}`, { itemIndex: index });
  }

  await apiRequest.call(this, 'DELETE', `/endpoints/v2.0/IndustrialEndpoints/${endpointId}`);
  return this.helpers.returnJsonArray({ success: true, deletedId: endpointId });
}

export async function getIndustrialEndpointsByGroup(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const groupType = this.getNodeParameter('industrialGroupType', index) as string;
  const groupId = this.getNodeParameter('industrialGroupId', index) as string;
  const groupIdValidation = validateGuid(groupId);
  if (!groupIdValidation.valid) {
    throw new NodeOperationError(this.getNode(), `Invalid group ID:\n${groupIdValidation.errors.join('\n')}`, { itemIndex: index });
  }
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const limit = this.getNodeParameter('limit', index, 50) as number;
  const options = this.getNodeParameter('options', index, {}) as { searchQuery?: string; orderBy?: string };

  const industrialGroupTypeMap: Record<string, string> = {
    logical: 'LogicalGroups',
    static: 'StaticGroups',
    udg: 'UniversalDynamicGroups',
  };

  const groupTypePath = industrialGroupTypeMap[groupType];
  if (!groupTypePath) throw new NodeOperationError(this.getNode(), `Unknown group type: ${groupType}`, { itemIndex: index });

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

  const url = `/endpoints/v2.0/${groupTypePath}/${groupId}/IndustrialEndpoints`;

  if (returnAll) {
    const response = await apiRequestAllItems.call(this, 'GET', url, {}, qs);
    return this.helpers.returnJsonArray(response as IDataObject[]);
  } else {
    qs.PageSize = limit;
    qs.Page = 0;
    const response = await apiRequest.call(this, 'GET', url, {}, qs);
    return this.helpers.returnJsonArray((response.data as IDataObject[]) || []);
  }
}
