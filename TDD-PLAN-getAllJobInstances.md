# TDD Implementation Plan: Get All Job Instances Operation

## Executive Summary

**Feature:** Add new operation `getAllJobInstances` to retrieve all job instances without requiring a specific job ID filter.

**Problem:** Current `getInstances` operation hardcodes `SearchQuery: JobDefinitionId eq '{jobId}'`, making it impossible to retrieve all job instances across all jobs.

**Solution:** Add new operation that calls `/jobs/v2.0/JobInstances` without mandatory job filter, while maintaining optional filtering capabilities.

**Approach:** Test-Driven Development (TDD) with comprehensive unit and system tests.

---

## Current State Analysis

### 1. Current Implementation (job.execute.ts:82-113)

```typescript
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
    SearchQuery: `JobDefinitionId eq '${jobId}'`,  // <-- HARDCODED FILTER
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
```

**Issues:**
- Requires `jobSelection` and `jobId` parameters (lines 86-89)
- Always filters by `JobDefinitionId eq '${jobId}'` (line 94)
- Cannot retrieve all job instances across multiple jobs

### 2. Current UI Fields (job.fields.ts:349-419)

- `jobSelection`: Required dropdown (lines 352-373)
- `jobId`: Required string when custom (lines 375-389)
- `returnAll`: Boolean (lines 390-401)
- `limit`: Number when returnAll=false (lines 402-419)

### 3. Current Test Coverage

**Unit Tests (job.execute.test.ts:432-580):**
- ✅ Fetch job instances with pagination
- ✅ Fetch all job instances when returnAll=true
- ✅ Handle empty job instances
- ✅ Handle errors when fetching job instances

**System Tests (job.system.test.ts:114-143):**
- ✅ Fetch job instances for specific job

---

## Target State Design

### 1. New Operation: `getAllJobInstances`

**Purpose:** Retrieve ALL job instances across all jobs without mandatory filters.

**API Call:**
```http
GET /jobs/v2.0/JobInstances
Query Parameters (optional):
  - PageSize: number (pagination)
  - Page: number (pagination)
  - SearchQuery: string (optional filter, e.g., "Status eq 'Running'")
  - OrderBy: string (optional sort, e.g., "StartTime desc")
```

**Key Differences from `getInstances`:**
| Aspect | getInstances | getAllJobInstances |
|--------|--------------|---------------------|
| Job ID | Required | Not required |
| Filter | Hardcoded `JobDefinitionId eq '{jobId}'` | Optional via `searchQuery` |
| Use Case | Get instances for specific job | Get all instances system-wide |

### 2. Implementation Design

```typescript
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
```

### 3. UI Fields Design

```typescript
// Add to jobOperations array in job.fields.ts
{
  name: 'Get All Job Instances',
  value: 'getAllJobInstances',
  description: 'Get all job instances across all jobs',
  action: 'Get all job instances',
}

// Field definitions (similar to getMany pattern)
{
  displayName: 'Return All',
  name: 'returnAll',
  type: 'boolean',
  default: false,
  displayOptions: {
    show: {
      resource: ['job'],
      operation: ['getAllJobInstances'],
    },
  },
  description: 'Whether to return all results or only up to a given limit',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  typeOptions: { minValue: 1 },
  default: 50,
  displayOptions: {
    show: {
      resource: ['job'],
      operation: ['getAllJobInstances'],
      returnAll: [false],
    },
  },
  description: 'Max number of results to return',
},
{
  displayName: 'Options',
  name: 'options',
  type: 'collection',
  placeholder: 'Add Option',
  default: {},
  displayOptions: {
    show: {
      resource: ['job'],
      operation: ['getAllJobInstances'],
    },
  },
  options: [
    {
      displayName: 'Search Query',
      name: 'searchQuery',
      type: 'string',
      default: '',
      description: 'OData filter query (e.g., "Status eq \'Running\'" or "JobDefinitionId eq \'{guid}\'")',
    },
    {
      displayName: 'Order By',
      name: 'orderBy',
      type: 'string',
      default: '',
      placeholder: 'StartTime desc',
      description: 'Sort order (e.g., "StartTime desc", "Status asc")',
    },
  ],
},
```

---

## TDD Implementation Plan

### Phase 1: RED - Write Failing Tests (30 mins)

#### Task 1.1: Unit Tests for getAllJobInstances

**File:** `test/nodes/Baramundi/actions/job/job.execute.test.ts`

**Location:** After line 580 (after getInstances tests)

**Tests to Write:**

1. **Test: Fetch all job instances with pagination**
   ```typescript
   it('should fetch all job instances with pagination (no job filter)', async () => {
     const mockInstances = {
       currentPage: 0,
       pageSize: 50,
       totalPages: 1,
       totalItems: 5,
       hasPreviousPage: false,
       hasNextPage: false,
       data: [
         { id: 'inst-1', jobDefinitionId: 'job-1', status: 'Completed' },
         { id: 'inst-2', jobDefinitionId: 'job-2', status: 'Running' },
         { id: 'inst-3', jobDefinitionId: 'job-1', status: 'Failed' },
         { id: 'inst-4', jobDefinitionId: 'job-3', status: 'Pending' },
         { id: 'inst-5', jobDefinitionId: 'job-2', status: 'Completed' },
       ],
     };

     const mockContext = createMockExecuteFunctions(
       { returnAll: false, limit: 50 },
       {},
       mockInstances
     );

     const result = await job.getAllJobInstances.call(mockContext, 0);

     expect(result).toBeDefined();
     expect(result).toHaveLength(5);
     // Verify instances from DIFFERENT jobs are returned
     const jobIds = result.map(r => r.json.jobDefinitionId);
     expect(new Set(jobIds).size).toBeGreaterThan(1);
     expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
       expect.objectContaining({
         method: 'GET',
         url: expect.stringContaining(`/jobs/v2.0/JobInstances`),
         qs: expect.objectContaining({
           PageSize: 50,
           Page: 0,
         }),
       })
     );
     // CRITICAL: Verify NO hardcoded SearchQuery filter
     const callArgs = (mockContext.helpers.httpRequest as any).mock.calls[0][0];
     expect(callArgs.qs.SearchQuery).toBeUndefined();
   });
   ```

2. **Test: Fetch all instances when returnAll=true**
   ```typescript
   it('should fetch all job instances when returnAll is true', async () => {
     const mockPage1 = {
       currentPage: 0,
       pageSize: 2,
       totalPages: 2,
       totalItems: 3,
       hasPreviousPage: false,
       hasNextPage: true,
       data: [
         { id: 'inst-1', jobDefinitionId: 'job-1', status: 'Completed' },
         { id: 'inst-2', jobDefinitionId: 'job-2', status: 'Running' },
       ],
     };

     const mockPage2 = {
       currentPage: 1,
       pageSize: 2,
       totalPages: 2,
       totalItems: 3,
       hasPreviousPage: true,
       hasNextPage: false,
       data: [
         { id: 'inst-3', jobDefinitionId: 'job-3', status: 'Pending' },
       ],
     };

     const mockContext = createMockExecuteFunctions(
       { returnAll: true },
       {},
       {},
       [mockPage1, mockPage2]
     );

     const result = await job.getAllJobInstances.call(mockContext, 0);

     expect(result).toBeDefined();
     expect(result).toHaveLength(3);
     expect(result[0].json.id).toBe('inst-1');
     expect(result[2].json.id).toBe('inst-3');
     expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
   });
   ```

3. **Test: Support optional SearchQuery filter**
   ```typescript
   it('should support optional SearchQuery filter', async () => {
     const mockInstances = {
       currentPage: 0,
       pageSize: 50,
       totalPages: 1,
       totalItems: 2,
       hasPreviousPage: false,
       hasNextPage: false,
       data: [
         { id: 'inst-1', status: 'Running' },
         { id: 'inst-2', status: 'Running' },
       ],
     };

     const mockContext = createMockExecuteFunctions(
       {
         returnAll: false,
         limit: 50,
         options: { searchQuery: "Status eq 'Running'" },
       },
       {},
       mockInstances
     );

     await job.getAllJobInstances.call(mockContext, 0);

     expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
       expect.objectContaining({
         qs: expect.objectContaining({
           SearchQuery: "Status eq 'Running'",
         }),
       })
     );
   });
   ```

4. **Test: Support optional OrderBy**
   ```typescript
   it('should support optional OrderBy parameter', async () => {
     const mockInstances = {
       currentPage: 0,
       pageSize: 50,
       totalPages: 1,
       totalItems: 2,
       hasPreviousPage: false,
       hasNextPage: false,
       data: [
         { id: 'inst-2', startTime: '2026-01-26T12:00:00Z' },
         { id: 'inst-1', startTime: '2026-01-26T10:00:00Z' },
       ],
     };

     const mockContext = createMockExecuteFunctions(
       {
         returnAll: false,
         limit: 50,
         options: { orderBy: 'StartTime desc' },
       },
       {},
       mockInstances
     );

     await job.getAllJobInstances.call(mockContext, 0);

     expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
       expect.objectContaining({
         qs: expect.objectContaining({
           OrderBy: 'StartTime desc',
         }),
       })
     );
   });
   ```

5. **Test: Handle empty results**
   ```typescript
   it('should handle empty job instances', async () => {
     const mockEmptyInstances = {
       currentPage: 0,
       pageSize: 50,
       totalPages: 0,
       totalItems: 0,
       hasPreviousPage: false,
       hasNextPage: false,
       data: [],
     };

     const mockContext = createMockExecuteFunctions(
       { returnAll: false, limit: 50 },
       {},
       mockEmptyInstances
     );

     const result = await job.getAllJobInstances.call(mockContext, 0);

     expect(result).toBeDefined();
     expect(result).toHaveLength(0);
   });
   ```

6. **Test: Handle errors**
   ```typescript
   it('should handle errors when fetching all job instances', async () => {
     const mockContext = createMockExecuteFunctions({
       returnAll: false,
       limit: 50,
     });

     mockContext.helpers.httpRequest = vi.fn(async () => {
       const error: any = new Error('API Error');
       error.statusCode = 500;
       throw error;
     });

     await expect(job.getAllJobInstances.call(mockContext, 0)).rejects.toThrow('API Error');
   });
   ```

7. **Test: Combine SearchQuery and OrderBy**
   ```typescript
   it('should support both SearchQuery and OrderBy together', async () => {
     const mockInstances = {
       currentPage: 0,
       pageSize: 50,
       totalPages: 1,
       totalItems: 1,
       hasPreviousPage: false,
       hasNextPage: false,
       data: [
         { id: 'inst-1', status: 'Running', startTime: '2026-01-26T10:00:00Z' },
       ],
     };

     const mockContext = createMockExecuteFunctions(
       {
         returnAll: false,
         limit: 50,
         options: {
           searchQuery: "Status eq 'Running'",
           orderBy: 'StartTime desc',
         },
       },
       {},
       mockInstances
     );

     await job.getAllJobInstances.call(mockContext, 0);

     expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
       expect.objectContaining({
         qs: expect.objectContaining({
           SearchQuery: "Status eq 'Running'",
           OrderBy: 'StartTime desc',
         }),
       })
     );
   });
   ```

**Expected Result:** All tests FAIL (RED phase) because `getAllJobInstances` doesn't exist yet.

**Validation Command:**
```bash
cd /home/ansible/claudinno/n8nconnector
npm test -- job.execute.test.ts
```

---

### Phase 2: GREEN - Implement Feature (45 mins)

#### Task 2.1: Add Operation to job.fields.ts

**File:** `nodes/Baramundi/actions/job/job.fields.ts`

**Location:** After line 56 (after 'Get Instances' operation)

**Code:**
```typescript
{
  name: 'Get All Job Instances',
  value: 'getAllJobInstances',
  description: 'Get all job instances across all jobs (no job filter required)',
  action: 'Get all job instances',
},
```

#### Task 2.2: Add Field Definitions to job.fields.ts

**File:** `nodes/Baramundi/actions/job/job.fields.ts`

**Location:** After line 419 (after getInstances fields)

**Code:**
```typescript
// ----------------------------------
//         job:getAllJobInstances
// ----------------------------------
{
  displayName: 'Return All',
  name: 'returnAll',
  type: 'boolean',
  default: false,
  displayOptions: {
    show: {
      resource: ['job'],
      operation: ['getAllJobInstances'],
    },
  },
  description: 'Whether to return all results or only up to a given limit',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  typeOptions: {
    minValue: 1,
  },
  default: 50,
  displayOptions: {
    show: {
      resource: ['job'],
      operation: ['getAllJobInstances'],
      returnAll: [false],
    },
  },
  description: 'Max number of results to return',
},
{
  displayName: 'Options',
  name: 'options',
  type: 'collection',
  placeholder: 'Add Option',
  default: {},
  displayOptions: {
    show: {
      resource: ['job'],
      operation: ['getAllJobInstances'],
    },
  },
  options: [
    {
      displayName: 'Search Query',
      name: 'searchQuery',
      type: 'string',
      default: '',
      description: 'OData filter query. Examples: "Status eq \'Running\'", "JobDefinitionId eq \'{guid}\'", "StartTime gt 2026-01-20"',
      placeholder: "Status eq 'Running'",
    },
    {
      displayName: 'Order By',
      name: 'orderBy',
      type: 'string',
      default: '',
      placeholder: 'StartTime desc',
      description: 'Sort order (e.g., "StartTime desc", "Status asc", "JobDefinitionId asc")',
    },
  ],
},
```

#### Task 2.3: Implement getAllJobInstances Function

**File:** `nodes/Baramundi/actions/job/job.execute.ts`

**Location:** After line 113 (after getInstances function)

**Code:**
```typescript
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
```

#### Task 2.4: Update Router

**File:** Find the router file that maps operations to functions

**Likely Location:** `nodes/Baramundi/Baramundi.node.ts` or similar

**Action:** Add mapping for `getAllJobInstances` operation:
```typescript
case 'getAllJobInstances':
  returnData = await job.getAllJobInstances.call(this, i);
  break;
```

**Validation Command:**
```bash
cd /home/ansible/claudinno/n8nconnector
npm test -- job.execute.test.ts
```

**Expected Result:** All unit tests PASS (GREEN phase).

---

### Phase 3: System Tests (30 mins)

#### Task 3.1: Write System Tests

**File:** `test/system/job.system.test.ts`

**Location:** After line 216 (after getEndpointJobInstances tests)

**Code:**
```typescript
describe('Get All Job Instances - System Tests', () => {
  it('should fetch all job instances without job filter', async () => {
    const context = createSystemTestContext({
      returnAll: false,
      limit: 20,
    }, config!);

    const result = await job.getAllJobInstances.call(context, 0);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // If there are results, verify they come from different jobs
    if (result.length > 1) {
      const jobIds = result.map(r => r.json.jobDefinitionId);
      const uniqueJobIds = new Set(jobIds);
      console.log(`Found ${result.length} instances from ${uniqueJobIds.size} different jobs`);
      // Expect instances from multiple jobs (unless test system has very few instances)
      expect(uniqueJobIds.size).toBeGreaterThanOrEqual(1);

      // Verify structure
      expect(result[0].json).toHaveProperty('id');
      expect(result[0].json).toHaveProperty('jobDefinitionId');
      expect(result[0].json).toHaveProperty('status');
    }
  });

  it('should fetch all job instances when returnAll is true', async () => {
    const context = createSystemTestContext({
      returnAll: true,
    }, config!);

    const result = await job.getAllJobInstances.call(context, 0);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    console.log(`Total job instances retrieved: ${result.length}`);
  });

  it('should support SearchQuery filter for specific job', async () => {
    // First get a job ID
    const jobsContext = createSystemTestContext({
      returnAll: false,
      limit: 1,
    }, config!);

    const jobs = await job.getMany.call(jobsContext, 0);

    if (jobs.length === 0) {
      console.warn('No jobs available for testing');
      return;
    }

    const jobId = jobs[0].json.id as string;

    // Now use getAllJobInstances with filter
    const context = createSystemTestContext({
      returnAll: false,
      limit: 10,
      options: { searchQuery: `JobDefinitionId eq '${jobId}'` },
    }, config!);

    const result = await job.getAllJobInstances.call(context, 0);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // All results should have the specified jobId
    result.forEach(instance => {
      expect(instance.json.jobDefinitionId).toBe(jobId);
    });
  });

  it('should support SearchQuery filter by status', async () => {
    const context = createSystemTestContext({
      returnAll: false,
      limit: 10,
      options: { searchQuery: "Status eq 'Completed'" },
    }, config!);

    const result = await job.getAllJobInstances.call(context, 0);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // All results should have status 'Completed'
    result.forEach(instance => {
      expect(instance.json.status).toBe('Completed');
    });
  });

  it('should support OrderBy parameter', async () => {
    const context = createSystemTestContext({
      returnAll: false,
      limit: 10,
      options: { orderBy: 'StartTime desc' },
    }, config!);

    const result = await job.getAllJobInstances.call(context, 0);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // Verify results are ordered by StartTime descending
    if (result.length > 1) {
      const startTimes = result.map(r => new Date(r.json.startTime as string).getTime());
      for (let i = 0; i < startTimes.length - 1; i++) {
        expect(startTimes[i]).toBeGreaterThanOrEqual(startTimes[i + 1]);
      }
    }
  });

  it('should support both SearchQuery and OrderBy together', async () => {
    const context = createSystemTestContext({
      returnAll: false,
      limit: 10,
      options: {
        searchQuery: "Status eq 'Completed'",
        orderBy: 'StartTime desc',
      },
    }, config!);

    const result = await job.getAllJobInstances.call(context, 0);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // Verify all have status Completed
    result.forEach(instance => {
      expect(instance.json.status).toBe('Completed');
    });

    // Verify ordered by StartTime desc
    if (result.length > 1) {
      const startTimes = result.map(r => new Date(r.json.startTime as string).getTime());
      for (let i = 0; i < startTimes.length - 1; i++) {
        expect(startTimes[i]).toBeGreaterThanOrEqual(startTimes[i + 1]);
      }
    }
  });

  it('should respect limit parameter', async () => {
    const testLimit = 5;
    const context = createSystemTestContext({
      returnAll: false,
      limit: testLimit,
    }, config!);

    const result = await job.getAllJobInstances.call(context, 0);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(testLimit);
  });
});
```

**Validation Command:**
```bash
cd /home/ansible/claudinno/n8nconnector
npm run test:system -- job.system.test.ts
```

**Expected Result:** All system tests PASS against live bConnect API.

---

### Phase 4: REFACTOR - Code Optimization (20 mins)

#### Task 4.1: Extract Common Query Building Logic

**File:** `nodes/Baramundi/actions/job/job.execute.ts`

**Optional Refactoring:** If you notice similar query building logic across functions, consider extracting to a helper:

```typescript
// Helper function (add at top of file)
function buildQueryParams(
  options: { searchQuery?: string; orderBy?: string } = {},
  returnAll: boolean,
  limit?: number,
): Record<string, string | number> {
  const qs: Record<string, string | number> = {};

  if (options.searchQuery) {
    qs.SearchQuery = options.searchQuery;
  }

  if (options.orderBy) {
    qs.OrderBy = options.orderBy;
  }

  if (!returnAll && limit) {
    qs.PageSize = limit;
    qs.Page = 0;
  }

  return qs;
}
```

**Note:** Only refactor if it improves readability without breaking tests. Re-run all tests after refactoring.

---

### Phase 5: Documentation (15 mins)

#### Task 5.1: Update CHANGELOG.md

**File:** `CHANGELOG.md`

**Content:**
```markdown
## [Unreleased]

### Added
- **Job Instances:** New operation `Get All Job Instances` to retrieve all job instances across all jobs without requiring a specific job ID filter
  - Supports optional `SearchQuery` filter (e.g., `Status eq 'Running'`, `JobDefinitionId eq '{guid}'`)
  - Supports optional `OrderBy` parameter (e.g., `StartTime desc`)
  - Supports pagination with `returnAll` and `limit` parameters
  - Use case: Get overview of all job executions system-wide, filter by status, or find instances by custom criteria

### Changed
- **Job Operations:** Clarified difference between `Get Instances` (requires job ID) and `Get All Job Instances` (no job filter required)
```

#### Task 5.2: Update README.md

**File:** `README.md`

**Section:** Under "Job Operations" section

**Content:**
```markdown
#### Get All Job Instances

Retrieve all job instances across all jobs without requiring a specific job ID.

**Use Cases:**
- Get system-wide overview of all job executions
- Find job instances by status (e.g., all running/failed jobs)
- Monitor job execution history across multiple jobs
- Custom filtering using OData SearchQuery

**Parameters:**
- `returnAll`: Boolean - Retrieve all instances (true) or limit results (false)
- `limit`: Number - Max results to return (default: 50, only when returnAll=false)
- `options.searchQuery`: String (optional) - OData filter query
  - Examples: `Status eq 'Running'`, `JobDefinitionId eq '{guid}'`, `StartTime gt 2026-01-20`
- `options.orderBy`: String (optional) - Sort order
  - Examples: `StartTime desc`, `Status asc`, `JobDefinitionId asc`

**Example Workflows:**
1. Get all running job instances:
   ```
   Operation: Get All Job Instances
   SearchQuery: Status eq 'Running'
   ```

2. Get recent job executions (last 100):
   ```
   Operation: Get All Job Instances
   Limit: 100
   OrderBy: StartTime desc
   ```

3. Get all instances for specific job:
   ```
   Operation: Get All Job Instances
   SearchQuery: JobDefinitionId eq '{your-job-guid}'
   ```

**Comparison with "Get Instances":**
- **Get Instances**: Requires specific job ID, always filters by that job
- **Get All Job Instances**: No job filter required, retrieve instances from all jobs
```

#### Task 5.3: Add Usage Examples

**File:** Create `docs/examples/getAllJobInstances.md` (optional)

**Content:**
```markdown
# Get All Job Instances - Usage Examples

## Basic Usage

### Get all job instances (limited to 50)
```json
{
  "resource": "job",
  "operation": "getAllJobInstances",
  "returnAll": false,
  "limit": 50
}
```

### Get ALL job instances (no limit)
```json
{
  "resource": "job",
  "operation": "getAllJobInstances",
  "returnAll": true
}
```

## Advanced Filtering

### Get all running job instances
```json
{
  "resource": "job",
  "operation": "getAllJobInstances",
  "returnAll": false,
  "limit": 100,
  "options": {
    "searchQuery": "Status eq 'Running'"
  }
}
```

### Get all failed job instances in last 24h
```json
{
  "resource": "job",
  "operation": "getAllJobInstances",
  "returnAll": false,
  "limit": 100,
  "options": {
    "searchQuery": "Status eq 'Failed' and StartTime gt 2026-01-25T00:00:00Z",
    "orderBy": "StartTime desc"
  }
}
```

### Get instances for specific job (alternative to Get Instances)
```json
{
  "resource": "job",
  "operation": "getAllJobInstances",
  "returnAll": true,
  "options": {
    "searchQuery": "JobDefinitionId eq 'your-job-guid-here'"
  }
}
```

## Monitoring Workflows

### 1. Daily Job Execution Report
- Operation: Get All Job Instances
- SearchQuery: `StartTime gt 2026-01-26T00:00:00Z`
- OrderBy: `StartTime desc`
- Use output to create report of all jobs executed today

### 2. Failed Job Alert System
- Operation: Get All Job Instances
- SearchQuery: `Status eq 'Failed'`
- OrderBy: `StartTime desc`
- Limit: 50
- Use with n8n Email/Slack node to send alerts

### 3. Job Performance Analysis
- Operation: Get All Job Instances
- ReturnAll: true
- OrderBy: `Duration desc`
- Analyze which jobs take longest to execute
```

---

## Phase 6: Integration Testing (20 mins)

#### Task 6.1: Test in n8n Workflow

**Steps:**

1. Build the connector:
   ```bash
   cd /home/ansible/claudinno/n8nconnector
   npm run build
   ```

2. Create test workflow in n8n:
   ```json
   {
     "nodes": [
       {
         "name": "Get All Job Instances",
         "type": "n8n-nodes-baramundi.baramundi",
         "position": [250, 300],
         "parameters": {
           "resource": "job",
           "operation": "getAllJobInstances",
           "returnAll": false,
           "limit": 20,
           "options": {}
         }
       }
     ]
   }
   ```

3. Run workflow and verify:
   - ✅ Returns instances from multiple jobs
   - ✅ No job filter required
   - ✅ Results include jobDefinitionId, status, startTime, etc.

4. Test with filters:
   ```json
   {
     "parameters": {
       "resource": "job",
       "operation": "getAllJobInstances",
       "returnAll": false,
       "limit": 50,
       "options": {
         "searchQuery": "Status eq 'Running'",
         "orderBy": "StartTime desc"
       }
     }
   }
   ```

5. Verify results are filtered and sorted correctly.

---

## Testing Checklist

### Unit Tests (✅ All Must Pass)
- [ ] Fetch all job instances with pagination (no job filter)
- [ ] Fetch all instances when returnAll=true
- [ ] Support optional SearchQuery filter
- [ ] Support optional OrderBy parameter
- [ ] Handle empty results
- [ ] Handle errors
- [ ] Combine SearchQuery and OrderBy
- [ ] Verify NO hardcoded SearchQuery in request

### System Tests (✅ All Must Pass)
- [ ] Fetch all job instances without job filter (live API)
- [ ] Fetch all instances when returnAll=true (live API)
- [ ] Support SearchQuery filter for specific job (live API)
- [ ] Support SearchQuery filter by status (live API)
- [ ] Support OrderBy parameter (live API)
- [ ] Support both SearchQuery and OrderBy together (live API)
- [ ] Respect limit parameter (live API)

### Integration Tests (✅ Manual Verification)
- [ ] Operation appears in n8n UI dropdown
- [ ] Field definitions render correctly
- [ ] Can fetch all instances without specifying job
- [ ] Can filter by status using SearchQuery
- [ ] Can sort using OrderBy
- [ ] Results contain instances from multiple jobs
- [ ] Pagination works correctly

---

## File Change Summary

### Files to Modify

1. **nodes/Baramundi/actions/job/job.fields.ts**
   - Add `getAllJobInstances` to operations array (line ~57)
   - Add field definitions for operation (after line 419)

2. **nodes/Baramundi/actions/job/job.execute.ts**
   - Add `getAllJobInstances` function (after line 113)
   - Export function at top of file

3. **nodes/Baramundi/Baramundi.node.ts** (or router file)
   - Add case for `getAllJobInstances` operation

4. **test/nodes/Baramundi/actions/job/job.execute.test.ts**
   - Add 7 unit tests for `getAllJobInstances` (after line 580)

5. **test/system/job.system.test.ts**
   - Add 7 system tests for `getAllJobInstances` (after line 216)

6. **CHANGELOG.md**
   - Add entry under [Unreleased] > Added

7. **README.md**
   - Update Job Operations section with new operation

---

## Estimated Timeline

| Phase | Task | Time | Cumulative |
|-------|------|------|------------|
| 1 | Write unit tests (RED) | 30 min | 0:30 |
| 2 | Implement feature (GREEN) | 45 min | 1:15 |
| 3 | Write system tests | 30 min | 1:45 |
| 4 | Refactor | 20 min | 2:05 |
| 5 | Documentation | 15 min | 2:20 |
| 6 | Integration testing | 20 min | 2:40 |
| **Total** | | **2h 40min** | |

---

## Success Criteria

✅ **Feature Complete When:**
1. All 7 unit tests pass
2. All 7 system tests pass against live API
3. Operation works in n8n workflow without errors
4. Can retrieve instances from multiple jobs (no job filter required)
5. Optional SearchQuery and OrderBy filters work correctly
6. Documentation updated (CHANGELOG, README)
7. Code follows existing patterns (similar to getMany)

✅ **Ready for Production When:**
1. Code review approved
2. All tests pass in CI/CD pipeline
3. Manual testing in n8n confirms functionality
4. No breaking changes to existing operations
5. Documentation complete and accurate

---

## Risk Mitigation

### Risk 1: API Returns Too Many Results
**Mitigation:**
- Default limit is 50 (same as other operations)
- Recommend using SearchQuery to filter large datasets
- Document pagination best practices

### Risk 2: Performance Impact on System
**Mitigation:**
- Use same pagination mechanism as existing operations
- Add warning in documentation about using returnAll on large systems
- Recommend filtering by date range for large datasets

### Risk 3: Breaking Existing Workflows
**Mitigation:**
- New operation, no changes to existing `getInstances`
- Existing workflows unchanged
- Backward compatible

---

## Next Steps After Implementation

1. **Monitor Usage:**
   - Check if users adopt `getAllJobInstances` for cross-job queries
   - Collect feedback on SearchQuery usability

2. **Potential Enhancements:**
   - Add preset filters (e.g., "Last 24 hours", "Failed only")
   - Add date range picker for easier time-based filtering
   - Add job name resolution (show job names instead of just GUIDs)

3. **Documentation:**
   - Add video tutorial/GIF showing operation in action
   - Create workflow templates for common use cases
   - Add troubleshooting section for OData query syntax

---

## Appendix: OData SearchQuery Examples

For user documentation:

```
# Status Filters
Status eq 'Running'
Status eq 'Completed'
Status eq 'Failed'
Status eq 'Pending'
Status ne 'Completed'  (not equal)

# Job Definition Filters
JobDefinitionId eq 'guid-here'
JobDefinitionId ne 'guid-here'

# Date/Time Filters
StartTime gt 2026-01-25T00:00:00Z  (greater than)
StartTime lt 2026-01-27T00:00:00Z  (less than)
StartTime ge 2026-01-26T00:00:00Z  (greater or equal)
StartTime le 2026-01-26T23:59:59Z  (less or equal)

# Combined Filters (use 'and' / 'or')
Status eq 'Failed' and StartTime gt 2026-01-25T00:00:00Z
Status eq 'Running' or Status eq 'Pending'
(Status eq 'Failed' or Status eq 'Completed') and StartTime gt 2026-01-25T00:00:00Z

# Endpoint Filters
EndpointId eq 'endpoint-guid'

# Complex Example
Status eq 'Completed' and StartTime gt 2026-01-20T00:00:00Z and EndpointId eq 'guid'
```

---

## Contact & Support

For questions about this implementation plan:
- Check existing `getMany` operation as reference pattern
- Review bConnect API documentation: `/home/ansible/claudinno/n8nconnector/bConnect_v1_1_essentials.md`
- Test API calls manually using n8n HTTP Request node before implementing
