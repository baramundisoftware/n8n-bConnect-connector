# n8n-nodes-baramundi - UX Improvements Guide

## Overview

This document provides detailed explanations and implementation guidance for the UX improvement tasks identified in the project. These improvements aim to enhance the user experience when working with the baramundi n8n node.

---

## 1. Resource Locator for Endpoint Selection

### What is a Resource Locator?

A **Resource Locator** is an advanced n8n UI component that provides a user-friendly way to select resources (like endpoints, jobs, groups, etc.) through multiple methods:
- **By ID**: Direct GUID input (current implementation)
- **By List**: Dropdown list fetched from the API
- **By URL**: Parse resource from a URL
- **From Previous Node**: Use output from previous workflow step

### Current State

Currently, endpoint selection uses a basic `string` field type:

```typescript
{
  displayName: 'Endpoint ID',
  name: 'endpointId',
  type: 'string',  // ← Basic string input
  required: true,
  default: '',
  description: 'The GUID of the endpoint',
}
```

**User Pain Points:**
- Users must manually find and copy GUIDs from baramundi console
- No autocomplete or search functionality
- Error-prone manual GUID entry
- No validation until API call

### Proposed Implementation

```typescript
{
  displayName: 'Endpoint',
  name: 'endpointId',
  type: 'resourceLocator',  // ← Enhanced UI component
  default: { mode: 'id', value: '' },
  required: true,
  displayOptions: {
    show: {
      resource: ['endpoint'],
      operation: ['get', 'delete', 'update', 'startEnrollment'],
    },
  },
  modes: [
    {
      displayName: 'By ID',
      name: 'id',
      type: 'string',
      validation: [
        {
          type: 'regex',
          properties: {
            regex: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
            errorMessage: 'Not a valid GUID',
          },
        },
      ],
      placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    },
    {
      displayName: 'From List',
      name: 'list',
      type: 'list',
      typeOptions: {
        searchListMethod: 'endpointSearch',
        searchable: true,
        searchFilterRequired: false,
      },
    },
    {
      displayName: 'By URL',
      name: 'url',
      type: 'string',
      placeholder: 'https://bms-server/endpoint/{guid}',
      extractValue: {
        type: 'regex',
        regex: '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
      },
    },
  ],
  description: 'The endpoint to operate on',
}
```

### Required Method Implementation

Add search method to `Baramundi.node.ts`:

```typescript
export class Baramundi implements INodeType {
  description: INodeTypeDescription = {
    // ... existing config ...

    methods: {
      listSearch: {
        // Search endpoints for resource locator
        async endpointSearch(
          this: ILoadOptionsFunctions,
          filter?: string,
        ): Promise<INodeListSearchResult> {
          const returnData: INodeListSearchItems[] = [];

          // Build search query
          const searchQuery = filter || '';
          const page = 0;
          const pageSize = 50;

          // Call API to fetch endpoints
          const response = await apiRequest.call(
            this,
            'GET',
            '/v2.0/Endpoints',
            {},
            { SearchQuery: searchQuery, Page: page, PageSize: pageSize },
          );

          // Format results for dropdown
          for (const endpoint of response.items || []) {
            returnData.push({
              name: `${endpoint.displayName} (${endpoint.hostName || 'N/A'})`,
              value: endpoint.id,
              url: `https://your-bms-server/endpoint/${endpoint.id}`,
            });
          }

          return {
            results: returnData,
            paginationToken: response.items.length === pageSize ? 'hasMore' : undefined,
          };
        },
      },
    },
  };
}
```

### Benefits

✅ **Better UX**: Users can search and select endpoints by name instead of GUID
✅ **Validation**: GUID format validation prevents errors
✅ **Flexibility**: Multiple input methods (ID, list, URL)
✅ **Integration**: Can use output from previous workflow nodes
✅ **Discoverability**: Users can browse available endpoints

### Files to Modify

- `nodes/Baramundi/Baramundi.node.ts` - Add `methods.listSearch.endpointSearch`
- `nodes/Baramundi/actions/endpoint/endpoint.fields.ts` - Update `endpointId` field definition
- `nodes/Baramundi/actions/endpoint/endpoint.execute.ts` - Handle resourceLocator value extraction

### Implementation Priority

**HIGH** - Endpoints are the most frequently used resource in baramundi workflows.

---

## 2. Resource Locator for Job Selection

### What is Job Selection?

Jobs are automation tasks in baramundi (software deployment, scripts, updates, etc.). Users frequently need to:
- Execute jobs on endpoints
- Get job execution status
- Manage job definitions
- Create kiosk releases

### Current State

Job selection uses basic string fields:

```typescript
{
  displayName: 'Job ID',
  name: 'jobId',
  type: 'string',  // ← Basic string input
  required: true,
  default: '',
  description: 'The GUID of the job',
}
```

**User Pain Points:**
- No visibility into available jobs
- Must copy GUIDs from baramundi console
- Cannot search or filter jobs
- No job name/description shown

### Proposed Implementation

```typescript
{
  displayName: 'Job',
  name: 'jobId',
  type: 'resourceLocator',
  default: { mode: 'list', value: '' },
  required: true,
  displayOptions: {
    show: {
      resource: ['job'],
      operation: ['get', 'execute', 'update', 'delete', 'getInstances'],
    },
  },
  modes: [
    {
      displayName: 'From List',
      name: 'list',
      type: 'list',
      typeOptions: {
        searchListMethod: 'jobDefinitionSearch',
        searchable: true,
        searchFilterRequired: false,
      },
    },
    {
      displayName: 'By ID',
      name: 'id',
      type: 'string',
      validation: [
        {
          type: 'regex',
          properties: {
            regex: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
            errorMessage: 'Not a valid GUID',
          },
        },
      ],
      placeholder: 'e.g. 87654321-4321-4321-4321-210987654321',
    },
    {
      displayName: 'By Name',
      name: 'name',
      type: 'string',
      placeholder: 'e.g. Install Office 2021',
      extractValue: {
        type: 'currentNodeParameter',
        parameter: 'jobId.value',
      },
    },
  ],
  description: 'The job definition to work with',
}
```

### Required Method Implementation

```typescript
methods: {
  listSearch: {
    // Search job definitions for resource locator
    async jobDefinitionSearch(
      this: ILoadOptionsFunctions,
      filter?: string,
    ): Promise<INodeListSearchResult> {
      const returnData: INodeListSearchItems[] = [];

      // Build search query
      const searchQuery = filter || '';
      const page = 0;
      const pageSize = 50;

      // Call API to fetch job definitions
      const response = await apiRequest.call(
        this,
        'GET',
        '/v2.0/JobDefinitions',
        {},
        { SearchQuery: searchQuery, Page: page, PageSize: pageSize, OrderBy: 'Name asc' },
      );

      // Format results for dropdown
      for (const job of response.items || []) {
        const jobType = job.type || 'Unknown';
        const description = job.description ? ` - ${job.description.substring(0, 50)}` : '';

        returnData.push({
          name: `${job.name} [${jobType}]${description}`,
          value: job.id,
          url: `https://your-bms-server/job/${job.id}`,
        });
      }

      return {
        results: returnData,
        paginationToken: response.items.length === pageSize ? 'hasMore' : undefined,
      };
    },

    // Search job folders for resource locator
    async jobFolderSearch(
      this: ILoadOptionsFunctions,
      filter?: string,
    ): Promise<INodeListSearchResult> {
      const returnData: INodeListSearchItems[] = [];

      const searchQuery = filter || '';
      const page = 0;
      const pageSize = 50;

      const response = await apiRequest.call(
        this,
        'GET',
        '/v2.0/JobFolders',
        {},
        { SearchQuery: searchQuery, Page: page, PageSize: pageSize },
      );

      for (const folder of response.items || []) {
        returnData.push({
          name: folder.name,
          value: folder.id,
        });
      }

      return { results: returnData };
    },
  },
},
```

### Additional Enhancements

**Job Type Filtering:**
```typescript
{
  displayName: 'Job Type Filter',
  name: 'jobTypeFilter',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['job'],
      operation: ['execute'],
      'jobId.mode': ['list'],
    },
  },
  options: [
    { name: 'All Types', value: '' },
    { name: 'Windows', value: 'Windows' },
    { name: 'Mobile', value: 'Mobile' },
    { name: 'Universal', value: 'Universal' },
  ],
  default: '',
  description: 'Filter jobs by type',
}
```

### Benefits

✅ **Job Discovery**: Browse and search available jobs
✅ **Context**: See job type and description in dropdown
✅ **Efficiency**: No need to switch to baramundi console
✅ **Accuracy**: Reduce GUID typos and wrong job selection
✅ **Workflow Building**: Faster workflow development

### Files to Modify

- `nodes/Baramundi/Baramundi.node.ts` - Add `methods.listSearch.jobDefinitionSearch`
- `nodes/Baramundi/actions/job/job.fields.ts` - Update `jobId`, `folderId`, `instanceId` fields
- `nodes/Baramundi/actions/job/job.execute.ts` - Handle resourceLocator value extraction

### Implementation Priority

**HIGH** - Jobs are core to baramundi automation workflows.

---

## 3. Improve Error Messages

### Current Error Handling

Currently, errors from the API are passed through with minimal context:

```typescript
// Current error handling in transport/requestApi.ts
catch (error: any) {
  if (error.response?.status === 401) {
    throw new NodeApiError(this.getNode(), error, {
      message: 'Authentication failed',
    });
  }
  throw error;  // ← Generic error passthrough
}
```

**User Pain Points:**
- Generic "Request failed with status 400" messages
- No guidance on how to fix the issue
- API error codes not translated to human-readable messages
- Missing context about what operation failed

### Proposed Error Handling Strategy

#### 3.1 Contextual Error Messages

```typescript
// Enhanced error handling with context
export async function apiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  endpoint: string,
  body?: any,
  qs?: any,
): Promise<any> {
  const operation = this.getNodeParameter('operation', 0) as string;
  const resource = this.getNodeParameter('resource', 0) as string;

  try {
    // ... API call ...
  } catch (error: any) {
    const status = error.response?.status;
    const apiError = error.response?.data?.error;
    const message = error.response?.data?.message;

    // Build contextual error message
    let errorMessage = `Failed to ${operation} ${resource}`;

    // Add specific error details based on status code
    if (status === 400) {
      errorMessage += ': Invalid request parameters';
      if (apiError?.details) {
        errorMessage += `\nDetails: ${JSON.stringify(apiError.details, null, 2)}`;
      }
    } else if (status === 401) {
      errorMessage += ': Authentication failed. Check your bConnect credentials';
    } else if (status === 403) {
      errorMessage += ': Access denied. Your user lacks required permissions';
      errorMessage += `\nRequired permission: ${apiError?.requiredPermission || 'Unknown'}`;
    } else if (status === 404) {
      errorMessage += ': Resource not found';
      if (endpoint.includes('Endpoints')) {
        errorMessage += '\nThe endpoint GUID may be invalid or the endpoint was deleted';
      } else if (endpoint.includes('Job')) {
        errorMessage += '\nThe job GUID may be invalid or the job was deleted';
      }
    } else if (status === 409) {
      errorMessage += ': Conflict - Resource already exists';
    } else if (status === 422) {
      errorMessage += ': Validation failed';
      if (message) {
        errorMessage += `\n${message}`;
      }
    } else if (status === 500) {
      errorMessage += ': Internal server error in baramundi Management Suite';
    }

    // Add troubleshooting hints
    errorMessage += '\n\nTroubleshooting:';
    if (status === 401) {
      errorMessage += '\n- Verify bConnect API credentials';
      errorMessage += '\n- Check if user account is active';
      errorMessage += '\n- Ensure SSL certificate validation is configured correctly';
    } else if (status === 403) {
      errorMessage += '\n- Grant required permissions in baramundi console';
      errorMessage += '\n- Check security group membership';
      errorMessage += '\n- Verify object-level permissions';
    } else if (status === 404) {
      errorMessage += '\n- Use the resource locator to select valid resources';
      errorMessage += '\n- Verify the GUID format is correct';
    }

    throw new NodeApiError(this.getNode(), error, {
      message: errorMessage,
      description: apiError?.message || message,
      httpCode: status?.toString(),
    });
  }
}
```

#### 3.2 Operation-Specific Error Messages

```typescript
// In execute functions, add operation-specific error handling
export async function createEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  try {
    // ... endpoint creation logic ...
  } catch (error: any) {
    // Enhance error with operation-specific context
    if (error.message?.includes('DisplayName')) {
      throw new NodeOperationError(
        this.getNode(),
        'Endpoint creation failed: Display name is required and must be unique',
        { itemIndex: index },
      );
    }

    if (error.message?.includes('HostName')) {
      throw new NodeOperationError(
        this.getNode(),
        'Endpoint creation failed: Host name is required for Windows and Linux endpoints',
        { itemIndex: index },
      );
    }

    // Re-throw with enhanced context
    throw error;
  }
}
```

#### 3.3 Validation Error Messages

```typescript
// Add pre-flight validation with helpful messages
export async function executeJob(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobId = this.getNodeParameter('jobId', index) as string;
  const endpointIds = this.getNodeParameter('endpointIds', index) as string;

  // Validate job ID format
  const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!guidRegex.test(jobId)) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid Job ID format: "${jobId}". Expected a GUID like "12345678-1234-1234-1234-123456789012"`,
      {
        itemIndex: index,
        description: 'Use the resource locator to select a job from the list',
      },
    );
  }

  // Validate endpoint IDs
  const endpointIdArray = endpointIds.split(',').map(id => id.trim());
  for (const id of endpointIdArray) {
    if (!guidRegex.test(id)) {
      throw new NodeOperationError(
        this.getNode(),
        `Invalid Endpoint ID in list: "${id}". All endpoint IDs must be valid GUIDs`,
        {
          itemIndex: index,
          description: 'Provide comma-separated GUIDs or use the resource locator',
        },
      );
    }
  }

  // ... execute job ...
}
```

#### 3.4 User-Friendly Error Messages Map

```typescript
// Create error message translation map
const ERROR_MESSAGES: Record<string, string> = {
  'ENDPOINT_NOT_FOUND': 'The endpoint was not found. It may have been deleted or the GUID is incorrect.',
  'JOB_NOT_FOUND': 'The job definition was not found. Verify the job still exists in baramundi.',
  'INSUFFICIENT_PERMISSIONS': 'Your user account lacks the required permissions for this operation.',
  'INVALID_GUID': 'The provided GUID is not in the correct format.',
  'DUPLICATE_NAME': 'An object with this name already exists. Choose a different name.',
  'INVALID_PARAMETER': 'One or more parameters are invalid or missing.',
  'NETWORK_ERROR': 'Unable to connect to baramundi server. Check your network and server URL.',
};

function translateError(apiErrorCode: string): string {
  return ERROR_MESSAGES[apiErrorCode] || 'An unexpected error occurred';
}
```

### Benefits

✅ **Clarity**: Users understand what went wrong
✅ **Actionable**: Clear guidance on how to fix issues
✅ **Context**: Operation and resource information included
✅ **Troubleshooting**: Built-in hints for common problems
✅ **Developer Experience**: Faster debugging and issue resolution

### Files to Modify

- `nodes/Baramundi/transport/requestApi.ts` - Enhanced error handling
- All `*.execute.ts` files - Operation-specific validation and errors
- Create new `nodes/Baramundi/utils/errorMessages.ts` - Error translation map

### Implementation Priority

**MEDIUM-HIGH** - Significantly improves troubleshooting and user support.

---

## 4. Add Parameter Validation

### Current Validation

Currently, validation is minimal:
- Required fields enforced by n8n
- No format validation (except basic type checking)
- No value range validation
- No cross-field validation

### Proposed Validation Strategy

#### 4.1 Field-Level Validation

```typescript
// GUID validation
{
  displayName: 'Endpoint ID',
  name: 'endpointId',
  type: 'string',
  required: true,
  default: '',
  validateType: 'string',
  validation: [
    {
      type: 'regex',
      properties: {
        regex: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
        errorMessage: 'Must be a valid GUID (e.g., 12345678-1234-1234-1234-123456789012)',
      },
    },
  ],
}

// String length validation
{
  displayName: 'Display Name',
  name: 'displayName',
  type: 'string',
  required: true,
  default: '',
  validation: [
    {
      type: 'stringLength',
      properties: {
        min: 1,
        max: 255,
        errorMessage: 'Display name must be between 1 and 255 characters',
      },
    },
  ],
}

// Email validation
{
  displayName: 'Email Recipient',
  name: 'emailRecipient',
  type: 'string',
  default: '',
  validation: [
    {
      type: 'regex',
      properties: {
        regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        errorMessage: 'Must be a valid email address',
      },
    },
  ],
}

// MAC address validation
{
  displayName: 'Primary MAC',
  name: 'primaryMAC',
  type: 'string',
  default: '',
  placeholder: 'AA:BB:CC:DD:EE:FF',
  validation: [
    {
      type: 'regex',
      properties: {
        regex: '^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$',
        errorMessage: 'Must be a valid MAC address (e.g., AA:BB:CC:DD:EE:FF)',
      },
    },
  ],
}

// IP address validation
{
  displayName: 'Primary IP',
  name: 'primaryIP',
  type: 'string',
  default: '',
  validation: [
    {
      type: 'regex',
      properties: {
        regex: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
        errorMessage: 'Must be a valid IPv4 address (e.g., 192.168.1.100)',
      },
    },
  ],
}

// Number range validation
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
  default: 50,
  validation: [
    {
      type: 'number',
      properties: {
        min: 1,
        max: 1000,
        errorMessage: 'Limit must be between 1 and 1000',
      },
    },
  ],
}
```

#### 4.2 Runtime Validation

Create validation utility:

```typescript
// nodes/Baramundi/utils/validation.ts

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate GUID format
 */
export function validateGuid(value: string): ValidationResult {
  const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!guidRegex.test(value)) {
    return {
      valid: false,
      errors: [`"${value}" is not a valid GUID format`],
    };
  }

  return { valid: true, errors: [] };
}

/**
 * Validate endpoint display name
 */
export function validateEndpointDisplayName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Display name cannot be empty');
  }

  if (name.length > 255) {
    errors.push('Display name must be 255 characters or less');
  }

  if (name.match(/[<>:"/\\|?*]/)) {
    errors.push('Display name contains invalid characters: < > : " / \\ | ? *');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate comma-separated GUID list
 */
export function validateGuidList(value: string): ValidationResult {
  const errors: string[] = [];
  const guids = value.split(',').map(g => g.trim()).filter(g => g.length > 0);

  if (guids.length === 0) {
    errors.push('At least one GUID is required');
  }

  for (const guid of guids) {
    const result = validateGuid(guid);
    if (!result.valid) {
      errors.push(...result.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate ISO 8601 date/time
 */
export function validateIso8601DateTime(value: string): ValidationResult {
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return {
        valid: false,
        errors: [`"${value}" is not a valid ISO 8601 date/time`],
      };
    }
    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: [`"${value}" is not a valid ISO 8601 date/time`],
    };
  }
}

/**
 * Validate maintenance window times
 */
export function validateMaintenanceWindow(startTime: string, endTime: string): ValidationResult {
  const errors: string[] = [];

  // Validate formats
  const startResult = validateIso8601DateTime(startTime);
  const endResult = validateIso8601DateTime(endTime);

  if (!startResult.valid) {
    errors.push(`Start time: ${startResult.errors.join(', ')}`);
  }

  if (!endResult.valid) {
    errors.push(`End time: ${endResult.errors.join(', ')}`);
  }

  // Validate start before end
  if (startResult.valid && endResult.valid) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      errors.push('Start time must be before end time');
    }

    // Validate not in the past
    const now = new Date();
    if (start < now) {
      errors.push('Start time cannot be in the past');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate JSON Patch operations
 */
export function validateJsonPatch(operations: any[]): ValidationResult {
  const errors: string[] = [];
  const validOps = ['add', 'remove', 'replace', 'move', 'copy', 'test'];

  if (!Array.isArray(operations)) {
    return {
      valid: false,
      errors: ['JSON Patch must be an array of operations'],
    };
  }

  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];

    if (!op.op) {
      errors.push(`Operation ${i}: Missing "op" field`);
    } else if (!validOps.includes(op.op)) {
      errors.push(`Operation ${i}: Invalid operation "${op.op}". Must be one of: ${validOps.join(', ')}`);
    }

    if (!op.path) {
      errors.push(`Operation ${i}: Missing "path" field`);
    } else if (!op.path.startsWith('/')) {
      errors.push(`Operation ${i}: Path must start with "/"`);
    }

    if (['add', 'replace', 'test'].includes(op.op) && !('value' in op)) {
      errors.push(`Operation ${i}: "${op.op}" operation requires a "value" field`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

#### 4.3 Validation in Execute Functions

```typescript
// Example: Validate in createEndpoint
export async function createEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const displayName = this.getNodeParameter('displayName', index) as string;
  const hostName = this.getNodeParameter('hostName', index, '') as string;
  const endpointType = this.getNodeParameter('endpointType', index) as string;

  // Validate display name
  const nameValidation = validateEndpointDisplayName(displayName);
  if (!nameValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid display name:\n${nameValidation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // Validate host name for Windows/Linux
  if (['windows', 'linux'].includes(endpointType) && !hostName) {
    throw new NodeOperationError(
      this.getNode(),
      'Host name is required for Windows and Linux endpoints',
      { itemIndex: index },
    );
  }

  // ... proceed with API call ...
}
```

#### 4.4 Cross-Field Validation

```typescript
// Example: Validate maintenance window
export async function createEndpointMaintenanceWindow(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;
  const startTime = this.getNodeParameter('startTime', index) as string;
  const endTime = this.getNodeParameter('endTime', index) as string;

  // Validate endpoint ID
  const guidValidation = validateGuid(endpointId);
  if (!guidValidation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID: ${guidValidation.errors.join(', ')}`,
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

  // ... proceed with API call ...
}
```

### Benefits

✅ **Early Error Detection**: Catch issues before API calls
✅ **User Guidance**: Clear validation messages guide correct input
✅ **Data Integrity**: Ensure data meets baramundi requirements
✅ **Reduced API Errors**: Fewer failed API calls due to invalid data
✅ **Better Testing**: Validation logic can be unit tested

### Files to Create/Modify

- Create `nodes/Baramundi/utils/validation.ts` - Validation utility functions
- Create `test/nodes/Baramundi/utils/validation.test.ts` - Validation unit tests
- Update all `*.fields.ts` files - Add validation rules to field definitions
- Update all `*.execute.ts` files - Add runtime validation calls

### Implementation Priority

**MEDIUM** - Improves data quality and reduces user errors, but doesn't block core functionality.

---

## Implementation Roadmap

### Phase 1: Resource Locators (2-3 weeks)
1. **Week 1**: Implement endpoint resource locator
   - Add `endpointSearch` method
   - Update endpoint field definitions
   - Test with real baramundi API
   - Update documentation

2. **Week 2**: Implement job resource locator
   - Add `jobDefinitionSearch` method
   - Add `jobFolderSearch` method
   - Update job field definitions
   - Test job selection workflows

3. **Week 3**: Additional resource locators
   - Implement group resource locator
   - Implement asset resource locator
   - Implement variable resource locator

### Phase 2: Error Messages (1-2 weeks)
1. **Week 4**: Enhanced error handling
   - Update `requestApi.ts` with contextual errors
   - Create error translation map
   - Add troubleshooting hints
   - Test error scenarios

2. **Week 5**: Operation-specific errors
   - Add validation errors to all execute functions
   - Create consistent error message patterns
   - Update documentation with error examples

### Phase 3: Parameter Validation (2-3 weeks)
1. **Week 6**: Create validation utilities
   - Implement `validation.ts` module
   - Write comprehensive unit tests
   - Document validation patterns

2. **Week 7-8**: Apply validation
   - Add field-level validation to all `*.fields.ts` files
   - Add runtime validation to all `*.execute.ts` files
   - Test validation across all operations

### Phase 4: Testing & Documentation (1 week)
1. **Week 9**: Integration testing
   - Test all resource locators
   - Test error scenarios
   - Test validation edge cases
   - Update system tests

2. **Week 10**: Documentation
   - Update README with new features
   - Create workflow examples using resource locators
   - Document common error messages
   - Create troubleshooting guide

---

## Testing Strategy

### Unit Tests

```typescript
// test/nodes/Baramundi/utils/validation.test.ts
describe('Validation Utilities', () => {
  describe('validateGuid', () => {
    it('should accept valid GUID', () => {
      const result = validateGuid('12345678-1234-1234-1234-123456789012');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid GUID format', () => {
      const result = validateGuid('not-a-guid');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('"not-a-guid" is not a valid GUID format');
    });
  });

  describe('validateMaintenanceWindow', () => {
    it('should reject start time in the past', () => {
      const pastTime = new Date(Date.now() - 86400000).toISOString();
      const futureTime = new Date(Date.now() + 86400000).toISOString();

      const result = validateMaintenanceWindow(pastTime, futureTime);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Start time cannot be in the past');
    });

    it('should reject start time after end time', () => {
      const start = '2026-12-31T23:59:59Z';
      const end = '2026-01-01T00:00:00Z';

      const result = validateMaintenanceWindow(start, end);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Start time must be before end time');
    });
  });
});
```

### Integration Tests

Test resource locators with mock API:

```typescript
describe('Resource Locators', () => {
  it('should search endpoints by name', async () => {
    // Mock API response
    vi.mocked(apiRequest).mockResolvedValue({
      items: [
        { id: 'guid-1', displayName: 'WS-001', hostName: 'ws001' },
        { id: 'guid-2', displayName: 'WS-002', hostName: 'ws002' },
      ],
    });

    const results = await endpointSearch.call(mockContext, 'WS');

    expect(results.results).toHaveLength(2);
    expect(results.results[0].name).toBe('WS-001 (ws001)');
    expect(results.results[0].value).toBe('guid-1');
  });
});
```

---

## Success Metrics

Track improvements after implementation:

1. **Resource Locators**
   - Reduction in invalid GUID errors: **Target 80% reduction**
   - User satisfaction: **Survey after 1 month**
   - Workflow creation time: **Measure 10 test workflows**

2. **Error Messages**
   - Support ticket reduction: **Track error-related tickets**
   - Time to resolution: **Measure average troubleshooting time**
   - User feedback: **Collect qualitative feedback**

3. **Parameter Validation**
   - Pre-submission error detection: **Measure validation catches**
   - Failed API call reduction: **Track 400/422 errors**
   - Data quality: **Monitor invalid data submissions**

---

## Additional Recommendations

### 1. Add Tooltips and Help Text

```typescript
{
  displayName: 'Endpoint ID',
  name: 'endpointId',
  type: 'resourceLocator',
  hint: 'Tip: Use the dropdown to search for endpoints by name',
  description: 'The endpoint to operate on',
  tooltip: {
    text: 'Select an endpoint from the list or enter a GUID directly. You can search by computer name or display name.',
  },
}
```

### 2. Add Field Dependencies

```typescript
// Show/hide fields based on other selections
{
  displayName: 'Host Name',
  name: 'hostName',
  type: 'string',
  displayOptions: {
    show: {
      endpointType: ['windows', 'linux'],  // Only show for Windows/Linux
    },
  },
}
```

### 3. Add Default Values from Context

```typescript
{
  displayName: 'Display Name',
  name: 'displayName',
  type: 'string',
  default: '={{ $json.hostname }}',  // Use value from previous node
  description: 'Display name for the endpoint',
}
```

### 4. Add Batch Operations

```typescript
// Support bulk operations with validation
{
  displayName: 'Endpoint IDs',
  name: 'endpointIds',
  type: 'string',
  typeOptions: {
    multipleValues: true,
    multipleValueButtonText: 'Add Endpoint',
  },
  default: [],
  description: 'One or more endpoint GUIDs',
}
```

---

## Conclusion

These UX improvements will significantly enhance the user experience of the n8n-nodes-baramundi package. By implementing resource locators, better error messages, and robust validation, users will:

- Build workflows faster with less trial-and-error
- Troubleshoot issues more efficiently
- Make fewer mistakes due to better guidance
- Have more confidence in their automation solutions

The phased implementation approach allows for iterative delivery and continuous user feedback throughout the development process.
