# UX Improvements - Quick Start Guide

## For Developers Ready to Implement

This guide provides copy-paste code examples to quickly implement the UX improvements. For detailed explanations, see [UX_IMPROVEMENTS_GUIDE.md](./UX_IMPROVEMENTS_GUIDE.md).

---

## 1. Endpoint Resource Locator (FASTEST WIN)

### Step 1: Add Search Method to Baramundi.node.ts

```typescript
// In nodes/Baramundi/Baramundi.node.ts

export class Baramundi implements INodeType {
  description: INodeTypeDescription = {
    // ... existing config ...

    // ADD THIS SECTION
    methods: {
      listSearch: {
        // Search endpoints for resource locator
        async endpointSearch(
          this: ILoadOptionsFunctions,
          filter?: string,
        ): Promise<INodeListSearchResult> {
          const returnData: INodeListSearchItems[] = [];

          // Import apiRequest at top of file
          const { apiRequest } = await import('./transport/requestApi');

          try {
            // Call API to fetch endpoints
            const response = await apiRequest.call(
              this,
              'GET',
              '/v2.0/Endpoints',
              {},
              {
                SearchQuery: filter || '',
                Page: 0,
                PageSize: 50,
                OrderBy: 'DisplayName asc',
              },
            );

            // Format results for dropdown
            for (const endpoint of response.items || []) {
              const hostname = endpoint.hostName || endpoint.serialNumber || 'N/A';
              const osType = endpoint.operatingSystemType || '';

              returnData.push({
                name: `${endpoint.displayName} (${hostname})${osType ? ` [${osType}]` : ''}`,
                value: endpoint.id,
                url: `${this.getCredentials('bconnectApi')?.baseUrl}/v2.0/Endpoints/${endpoint.id}`,
              });
            }
          } catch (error: any) {
            // Handle API errors gracefully
            console.error('Error fetching endpoints for search:', error.message);
            // Return empty list on error
            return { results: [] };
          }

          return {
            results: returnData,
            paginationToken: returnData.length === 50 ? 'hasMore' : undefined,
          };
        },
      },
    },
  };
}
```

### Step 2: Update Endpoint Field Definition

```typescript
// In nodes/Baramundi/actions/endpoint/endpoint.fields.ts

// REPLACE THIS:
{
  displayName: 'Endpoint ID',
  name: 'endpointId',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['endpoint'],
      operation: ['get', 'delete'],
    },
  },
  description: 'The GUID of the endpoint',
}

// WITH THIS:
{
  displayName: 'Endpoint',
  name: 'endpointId',
  type: 'resourceLocator',
  default: { mode: 'list', value: '' },
  required: true,
  displayOptions: {
    show: {
      resource: ['endpoint'],
      operation: ['get', 'delete', 'update', 'startEnrollment'],
    },
  },
  modes: [
    {
      displayName: 'From List',
      name: 'list',
      type: 'list',
      hint: 'Search endpoints by name',
      typeOptions: {
        searchListMethod: 'endpointSearch',
        searchable: true,
        searchFilterRequired: false,
      },
    },
    {
      displayName: 'By ID',
      name: 'id',
      type: 'string',
      hint: 'Enter endpoint GUID directly',
      validation: [
        {
          type: 'regex',
          properties: {
            regex: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
            errorMessage: 'Not a valid GUID (format: 12345678-1234-1234-1234-123456789012)',
          },
        },
      ],
      placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
    },
    {
      displayName: 'By URL',
      name: 'url',
      type: 'string',
      hint: 'Extract GUID from URL',
      placeholder: 'e.g. https://bms-server/bconnect/v2.0/Endpoints/{guid}',
      extractValue: {
        type: 'regex',
        regex: '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
      },
    },
  ],
  description: 'The endpoint to operate on',
}
```

### Step 3: Handle Resource Locator Value in Execute Functions

```typescript
// In nodes/Baramundi/actions/endpoint/endpoint.execute.ts

// ADD this helper function at the top of the file
function extractResourceLocatorValue(value: any): string {
  if (typeof value === 'string') {
    return value; // Old string format (backward compatible)
  }
  if (typeof value === 'object' && value.value) {
    return value.value; // New resourceLocator format
  }
  return '';
}

// THEN UPDATE all functions that use endpointId:
export async function getEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  // CHANGE FROM:
  // const endpointId = this.getNodeParameter('endpointId', index) as string;

  // TO:
  const endpointIdParam = this.getNodeParameter('endpointId', index);
  const endpointId = extractResourceLocatorValue(endpointIdParam);

  // ... rest of function stays the same
}

// Apply the same change to:
// - deleteEndpoint()
// - updateEndpoint()
// - startEnrollment()
// - Any other function using endpointId parameter
```

### Step 4: Test It!

1. Build the node: `npm run build`
2. Open n8n and add a baramundi node
3. Select "Endpoint" resource
4. Select "Get" operation
5. Click on the "Endpoint" field - you should see a dropdown!
6. Try searching for an endpoint by name

---

## 2. Job Resource Locator (SECOND FASTEST WIN)

### Step 1: Add Job Search Methods

```typescript
// In nodes/Baramundi/Baramundi.node.ts, add to methods.listSearch:

methods: {
  listSearch: {
    // ... endpointSearch from above ...

    // Search job definitions
    async jobDefinitionSearch(
      this: ILoadOptionsFunctions,
      filter?: string,
    ): Promise<INodeListSearchResult> {
      const returnData: INodeListSearchItems[] = [];

      const { apiRequest } = await import('./transport/requestApi');

      try {
        const response = await apiRequest.call(
          this,
          'GET',
          '/v2.0/JobDefinitions',
          {},
          {
            SearchQuery: filter || '',
            Page: 0,
            PageSize: 50,
            OrderBy: 'Name asc',
          },
        );

        for (const job of response.items || []) {
          const jobType = job.type || 'Unknown';
          const description = job.description
            ? ` - ${job.description.substring(0, 50)}${job.description.length > 50 ? '...' : ''}`
            : '';

          returnData.push({
            name: `${job.name} [${jobType}]${description}`,
            value: job.id,
            url: `${this.getCredentials('bconnectApi')?.baseUrl}/v2.0/JobDefinitions/${job.id}`,
          });
        }
      } catch (error: any) {
        console.error('Error fetching jobs:', error.message);
        return { results: [] };
      }

      return {
        results: returnData,
        paginationToken: returnData.length === 50 ? 'hasMore' : undefined,
      };
    },

    // Search job folders
    async jobFolderSearch(
      this: ILoadOptionsFunctions,
      filter?: string,
    ): Promise<INodeListSearchResult> {
      const returnData: INodeListSearchItems[] = [];

      const { apiRequest } = await import('./transport/requestApi');

      try {
        const response = await apiRequest.call(
          this,
          'GET',
          '/v2.0/JobFolders',
          {},
          {
            SearchQuery: filter || '',
            Page: 0,
            PageSize: 50,
            OrderBy: 'Name asc',
          },
        );

        for (const folder of response.items || []) {
          returnData.push({
            name: folder.name,
            value: folder.id,
          });
        }
      } catch (error: any) {
        console.error('Error fetching job folders:', error.message);
        return { results: [] };
      }

      return { results: returnData };
    },
  },
},
```

### Step 2: Update Job Field Definitions

```typescript
// In nodes/Baramundi/actions/job/job.fields.ts

// Find all instances of jobId field and replace with:
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
      hint: 'Search jobs by name',
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
      hint: 'Enter job GUID directly',
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
  ],
  description: 'The job definition to work with',
}

// Also update folderId field:
{
  displayName: 'Folder',
  name: 'folderId',
  type: 'resourceLocator',
  default: { mode: 'list', value: '' },
  required: true,
  displayOptions: {
    show: {
      resource: ['job'],
      operation: ['getFolder', 'updateFolder', 'deleteFolder'],
    },
  },
  modes: [
    {
      displayName: 'From List',
      name: 'list',
      type: 'list',
      typeOptions: {
        searchListMethod: 'jobFolderSearch',
        searchable: true,
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
    },
  ],
  description: 'The job folder',
}
```

### Step 3: Update Job Execute Functions

```typescript
// In nodes/Baramundi/actions/job/job.execute.ts

// Add the helper function (same as endpoint)
function extractResourceLocatorValue(value: any): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value.value) {
    return value.value;
  }
  return '';
}

// Update all functions that use jobId or folderId:
export async function getJob(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobIdParam = this.getNodeParameter('jobId', index);
  const jobId = extractResourceLocatorValue(jobIdParam);

  // ... rest stays the same
}

// Apply to:
// - executeJob()
// - getJobInstances()
// - deleteJob()
// - updateJob()
// - getFolder()
// - updateFolder()
// - deleteFolder()
```

---

## 3. Quick Error Message Improvement

### Step 1: Update requestApi.ts

```typescript
// In nodes/Baramundi/transport/requestApi.ts

export async function apiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: string,
  endpoint: string,
  body?: any,
  qs?: any,
): Promise<any> {
  try {
    // ... existing API call code ...

  } catch (error: any) {
    const status = error.response?.status;
    const apiError = error.response?.data;

    // Get operation context if available
    let operation = 'perform operation';
    let resource = 'resource';
    try {
      operation = this.getNodeParameter('operation', 0) as string;
      resource = this.getNodeParameter('resource', 0) as string;
    } catch {
      // Context not available in all cases
    }

    // Build contextual error message
    let errorMessage = `Failed to ${operation} ${resource}`;

    // Add specific error details based on status code
    switch (status) {
      case 400:
        errorMessage += ': Invalid request parameters';
        if (apiError?.message) {
          errorMessage += `\n${apiError.message}`;
        }
        break;

      case 401:
        errorMessage += ': Authentication failed';
        errorMessage += '\n\nCheck:';
        errorMessage += '\n- bConnect API credentials are correct';
        errorMessage += '\n- User account is active';
        errorMessage += '\n- SSL certificate settings';
        break;

      case 403:
        errorMessage += ': Access denied';
        errorMessage += '\n\nYour user lacks required permissions.';
        errorMessage += '\nGrant permissions in baramundi console security settings.';
        break;

      case 404:
        errorMessage += ': Resource not found';
        if (endpoint.includes('Endpoints')) {
          errorMessage += '\n\nThe endpoint may have been deleted or the GUID is invalid.';
          errorMessage += '\nTip: Use the resource locator to select a valid endpoint.';
        } else if (endpoint.includes('Job')) {
          errorMessage += '\n\nThe job may have been deleted or the GUID is invalid.';
          errorMessage += '\nTip: Use the resource locator to select a valid job.';
        }
        break;

      case 409:
        errorMessage += ': Conflict - Resource already exists';
        errorMessage += '\n\nA resource with this name or identifier already exists.';
        break;

      case 422:
        errorMessage += ': Validation failed';
        if (apiError?.message) {
          errorMessage += `\n${apiError.message}`;
        }
        break;

      case 500:
        errorMessage += ': Internal server error';
        errorMessage += '\n\nContact your baramundi administrator.';
        break;

      default:
        errorMessage += `: HTTP ${status}`;
        if (apiError?.message) {
          errorMessage += `\n${apiError.message}`;
        }
    }

    throw new NodeApiError(this.getNode(), error, {
      message: errorMessage,
      description: apiError?.error?.message || apiError?.message,
      httpCode: status?.toString(),
    });
  }
}
```

---

## 4. Quick Validation Implementation

### Step 1: Create Validation Utility

```typescript
// Create new file: nodes/Baramundi/utils/validation.ts

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate GUID format
 */
export function validateGuid(value: string): ValidationResult {
  const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!value || typeof value !== 'string') {
    return { valid: false, errors: ['GUID is required'] };
  }

  if (!guidRegex.test(value.trim())) {
    return {
      valid: false,
      errors: [`"${value}" is not a valid GUID format (expected: 12345678-1234-1234-1234-123456789012)`],
    };
  }

  return { valid: true, errors: [] };
}

/**
 * Validate comma-separated GUID list
 */
export function validateGuidList(value: string): ValidationResult {
  const errors: string[] = [];
  const guids = value.split(',').map(g => g.trim()).filter(g => g.length > 0);

  if (guids.length === 0) {
    return { valid: false, errors: ['At least one GUID is required'] };
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
 * Validate display name
 */
export function validateDisplayName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Display name cannot be empty');
  }

  if (name.length > 255) {
    errors.push('Display name must be 255 characters or less');
  }

  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    errors.push('Display name contains invalid characters: < > : " / \\ | ? *');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Step 2: Use in Execute Functions

```typescript
// Example in endpoint.execute.ts

import { validateGuid, validateDisplayName } from '../../utils/validation';
import { NodeOperationError } from 'n8n-workflow';

export async function createEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const displayName = this.getNodeParameter('displayName', index) as string;

  // Validate display name
  const validation = validateDisplayName(displayName);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid display name:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // ... rest of function
}

export async function getEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointIdParam = this.getNodeParameter('endpointId', index);
  const endpointId = extractResourceLocatorValue(endpointIdParam);

  // Validate GUID
  const validation = validateGuid(endpointId);
  if (!validation.valid) {
    throw new NodeOperationError(
      this.getNode(),
      `Invalid endpoint ID:\n${validation.errors.join('\n')}`,
      { itemIndex: index },
    );
  }

  // ... rest of function
}
```

---

## Testing Your Changes

### Manual Testing Checklist

**Resource Locators:**
- [ ] Dropdown appears when clicking field
- [ ] Search filters results correctly
- [ ] Selected value shows in field
- [ ] Old workflows with string GUIDs still work
- [ ] GUID validation rejects invalid format

**Error Messages:**
- [ ] 401 error shows authentication help
- [ ] 403 error shows permission guidance
- [ ] 404 error shows resource-specific hints
- [ ] Error messages include operation context

**Validation:**
- [ ] Invalid GUID shows clear error before API call
- [ ] Display name validation catches invalid characters
- [ ] Validation error messages are helpful

### Quick Test Workflow

1. Create new baramundi node
2. Select "Endpoint" → "Get"
3. Use dropdown to search for endpoint
4. Execute - should succeed
5. Change GUID to invalid format
6. Execute - should show validation error
7. Change to non-existent GUID
8. Execute - should show 404 with helpful message

---

## Common Issues & Solutions

**Issue: "Method endpointSearch not found"**
- Solution: Make sure `methods.listSearch` is added to `Baramundi.node.ts` description object
- Rebuild: `npm run build`

**Issue: "resourceLocator shows as string field"**
- Solution: Ensure you changed `type: 'string'` to `type: 'resourceLocator'`
- Check `displayName` is set (not just `name`)
- Rebuild and refresh n8n

**Issue: "Search returns no results but endpoints exist"**
- Solution: Check API permissions - user must have read access to endpoints
- Check network/SSL certificate issues
- Add console.log in search method to debug

**Issue: "Old workflows break with resourceLocator"**
- Solution: Use `extractResourceLocatorValue()` helper function
- This handles both old string format and new object format

---

## Performance Tips

**Optimize Search Methods:**
```typescript
// Cache results for 5 minutes
const CACHE_TTL = 5 * 60 * 1000;
const searchCache = new Map();

async endpointSearch(filter?: string): Promise<INodeListSearchResult> {
  const cacheKey = `endpoints:${filter || ''}`;
  const cached = searchCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.results;
  }

  // ... fetch from API ...

  searchCache.set(cacheKey, {
    results,
    timestamp: Date.now(),
  });

  return results;
}
```

**Debounce Search Input:**
```typescript
typeOptions: {
  searchListMethod: 'endpointSearch',
  searchable: true,
  searchFilterRequired: false,
  searchDebounceMs: 300,  // Wait 300ms after typing stops
}
```

---

## Next Steps

1. **Start with Endpoint Resource Locator** - Highest impact, quickest win
2. **Test thoroughly** with real baramundi server
3. **Gather user feedback** - Does search work as expected?
4. **Move to Job Resource Locator** - Similar pattern, easy to replicate
5. **Enhance error messages** - Immediate quality of life improvement
6. **Add validation** - Prevents errors before they happen

---

## Need Help?

- **Full Documentation:** [UX_IMPROVEMENTS_GUIDE.md](./UX_IMPROVEMENTS_GUIDE.md)
- **Summary:** [UX_IMPROVEMENTS_SUMMARY.md](./UX_IMPROVEMENTS_SUMMARY.md)
- **n8n Docs:** https://docs.n8n.io/integrations/creating-nodes/build/reference/ui-elements/#resource-locator

**Happy Coding! 🚀**
