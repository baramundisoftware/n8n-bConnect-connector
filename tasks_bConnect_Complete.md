# bConnect V2.0 API - Complete Implementation Tasks

**Objective:** Implement all 91 missing V2.0 operations to achieve 100% OpenAPI specification coverage in the n8n connector.

**Current Status (updated 2026-04-01):**
- All Priority 2 operations (28 ops across Jobs, AD, Assets, Variables) implemented in Phase 8 (2026-03-31)
- All Priority 3 platform-specific endpoint operations implemented in Phase 9 (2026-04-01)
- **547 unit tests passing, 0 lint errors**

> This document is now a historical reference. See [Tasks.md](./Tasks.md) for authoritative phase status.

**Original Analysis Date**: 2026-01-23

---

## Summary by Priority

### Priority 1: Critical Missing Operations (0 operations)
✅ **All critical CRUD operations are already implemented**
- All core Create, Read, Update, Delete operations exist
- All essential endpoint management operations exist
- All essential job management operations exist

### Priority 2: High Value Missing Operations (28 operations)
Operations that provide significant value for automation workflows:
- **Jobs Module**: 12 contextual query operations
- **Active Directory Module**: 6 nested relationship operations
- **Assets Module**: 8 folder hierarchy operations
- **Variables Module**: 2 contextual query operations

### Priority 3: Platform-Specific Endpoints (63 operations)
Platform-specific endpoint operations currently consolidated into universal operations:
- Android-specific operations (9)
- iOS-specific operations (9)
- Linux-specific operations (9)
- Mac-specific operations (9)
- Industrial-specific operations (9)
- Network-specific operations (9)
- Multiple platform queries per group type (9)

---

## Module Status Overview

| Module | Spec Ops | Implemented | Coverage | Status |
|--------|----------|-------------|----------|--------|
| DefenseControl | 11 | 11 | 100.0% | ✅ COMPLETE |
| OperatingSystems | 9 | 9 | 100.0% | ✅ COMPLETE |
| ServerManagement | 25 | 25 | 100.0% | ✅ COMPLETE |
| Software | 4 | 4 | 100.0% | ✅ COMPLETE |
| UpdateManagement | 3 | 3 | 100.0% | ✅ COMPLETE |
| Variables | 13 | 13 | 100.0% | ✅ COMPLETE (Phase 8F) |
| Assets | 24 | 24 | 100.0% | ✅ COMPLETE (Phase 8B) |
| Jobs | 34 | 34 | 100.0% | ✅ COMPLETE (Phase 8D) |
| ActiveDirectory | 16 | 16 | 100.0% | ✅ COMPLETE (Phase 8A) |
| Endpoints | 89 | 89 | 100.0% | ✅ COMPLETE (Phase 8C + 9) |

\* Low coverage due to platform consolidation strategy, not missing functionality

---

## Priority 2: High Value Operations (28 operations)

### Task 2.1: Jobs Module - Contextual Query Operations (12 operations)

**Value Proposition**: Enable querying job instances and kiosk releases by context (endpoint, group, job definition), critical for reporting and monitoring workflows.

**Implementation Complexity**: Medium (API calls exist, need wrapper functions)

**Operations to Implement**:

#### Job Folder Hierarchy (2 operations)
1. `GET /v2.0/Folders/{folderId}/Folders` - Get subfolders by parent folder
   - **operationId**: `GetFoldersByFolderId`
   - **Use Case**: Navigate job folder hierarchy
   - **Function Name**: `getJobFoldersByParentId`

2. `GET /v2.0/Folders/{folderId}/JobDefinitions` - Get job definitions in folder
   - **operationId**: `GetJobDefinitionsByFolderId`
   - **Use Case**: List jobs in specific folder
   - **Function Name**: `getJobDefinitionsByFolderId`

#### Job Instance Contextual Queries (6 operations)
3. `GET /v2.0/JobDefinitions/{jobDefinitionId}/JobInstances` - Get instances by job definition
   - **operationId**: `GetJobInstancesByJobDefinitionId`
   - **Use Case**: Track execution history of specific job
   - **Function Name**: `getJobInstancesByJobDefinitionId`
   - **Priority**: HIGH - Critical for job monitoring

4. `GET /v2.0/Endpoints/{endpointId}/JobInstances` - Get job instances by endpoint
   - **operationId**: `GetJobInstancesByEndpointId`
   - **Use Case**: View all jobs executed on specific endpoint
   - **Function Name**: `getJobInstancesByEndpointId`
   - **Priority**: HIGH - Critical for endpoint troubleshooting

5. `GET /v2.0/LogicalGroups/{logicalGroupId}/JobInstances` - Get instances by logical group
   - **operationId**: `GetJobInstancesByLogicalGroupId`
   - **Use Case**: Track job execution across group
   - **Function Name**: `getJobInstancesByLogicalGroupId`

6. `GET /v2.0/StaticGroups/{staticGroupId}/JobInstances` - Get instances by static group
   - **operationId**: `GetJobInstancesByStaticGroupId`
   - **Use Case**: Track job execution across static group
   - **Function Name**: `getJobInstancesByStaticGroupId`

7. `GET /v2.0/DynamicGroups/{dynamicGroupId}/JobInstances` - Get instances by dynamic group
   - **operationId**: `GetJobInstancesByDynamicGroupId`
   - **Use Case**: Track job execution across dynamic group
   - **Function Name**: `getJobInstancesByDynamicGroupId`

8. `GET /v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/JobInstances` - Get instances by universal dynamic group
   - **operationId**: `GetJobInstancesByUniversalDynamicGroupId`
   - **Use Case**: Track job execution across universal dynamic group
   - **Function Name**: `getJobInstancesByUniversalDynamicGroupId`

#### Kiosk Release Contextual Queries (4 operations)
9. `GET /v2.0/ADObjects/{adObjectId}/KioskReleases` - Get kiosk releases by AD object
   - **operationId**: `GetKioskReleasesByAdObjectId`
   - **Use Case**: View self-service releases for user/computer
   - **Function Name**: `getKioskReleasesByAdObjectId`

10. `GET /v2.0/JobDefinitions/{jobDefinitionId}/KioskReleases` - Get releases by job definition
    - **operationId**: `GetKioskReleasesByJobDefinitionId`
    - **Use Case**: View all kiosk releases of specific job
    - **Function Name**: `getKioskReleasesByJobDefinitionId`

11. `GET /v2.0/Endpoints/{endpointId}/KioskReleases` - Get kiosk releases by endpoint
    - **operationId**: `GetKioskReleasesByEndpointId`
    - **Use Case**: View self-service releases available to endpoint
    - **Function Name**: `getKioskReleasesByEndpointId`

12. `GET /v2.0/LogicalGroups/{logicalGroupId}/KioskReleases` - Get releases by logical group
    - **operationId**: `GetKioskReleasesByLogicalGroupId`
    - **Use Case**: View kiosk releases for group
    - **Function Name**: `getKioskReleasesByLogicalGroupId`

**Implementation Steps**:
1. Add 12 operations to `nodes/Baramundi/actions/job/job.fields.ts`
2. Implement 12 functions in `nodes/Baramundi/actions/job/job.execute.ts`
3. Add 12 router cases in `nodes/Baramundi/actions/router.ts`
4. Create 24 unit tests (2 per operation: success + error handling)
5. Create 12 system tests (live API validation)
6. Update documentation

**Estimated Effort**: 8-12 hours

---

### Task 2.2: Active Directory Module - Nested Relationship Operations (6 operations)

**Value Proposition**: Enable querying AD hierarchies and group memberships, essential for reporting and access control workflows.

**Implementation Complexity**: Low-Medium (straightforward GET operations)

**Operations to Implement**:

#### AD Group Nested Queries (2 operations)
1. `GET /v2.0/ADGroups/{adGroupId}/ADGroups` - Get subgroups of AD group
   - **operationId**: `GetADGroupsByADGroupId`
   - **Use Case**: Navigate nested AD group structure
   - **Function Name**: `getADGroupsByADGroupId`

2. `GET /v2.0/ADGroups/{adGroupId}/ADObjects` - Get AD objects in group
   - **operationId**: `GetADObjectsByADGroupId`
   - **Use Case**: List all objects (users, computers, groups) in AD group
   - **Function Name**: `getADObjectsByADGroupId`

#### AD Object Membership Query (1 operation)
3. `GET /v2.0/ADObjects/{id}/ADGroupMemberships` - Get group memberships for AD object
   - **operationId**: `GetADObjectMemberships`
   - **Use Case**: List all groups an AD object belongs to
   - **Function Name**: `getADObjectGroupMemberships`
   - **Priority**: HIGH - Critical for access reporting

#### Organizational Unit Nested Queries (3 operations)
4. `GET /v2.0/OrgUnits/{orgUnitId}/ADObjects` - Get AD objects in OU
   - **operationId**: `GetADObjectsByOrgUnitId`
   - **Use Case**: List all AD objects in organizational unit
   - **Function Name**: `getADObjectsByOrgUnitId`

5. `GET /v2.0/OrgUnits/{orgUnitId}/ADUsers` - Get AD users in OU
   - **operationId**: `GetADUsersByOrgUnitId`
   - **Use Case**: List users in organizational unit
   - **Function Name**: `getADUsersByOrgUnitId`

6. `GET /v2.0/OrgUnits/{orgUnitId}/OrgUnits` - Get sub-OUs by parent OU
   - **operationId**: `GetOrgUnitsByOrgUnitId`
   - **Use Case**: Navigate OU hierarchy
   - **Function Name**: `getOrgUnitsByOrgUnitId`

**Implementation Steps**:
1. Add 6 operations to `nodes/Baramundi/actions/activeDirectory/activeDirectory.fields.ts`
2. Implement 6 functions in `nodes/Baramundi/actions/activeDirectory/activeDirectory.execute.ts`
3. Add 6 router cases in `nodes/Baramundi/actions/router.ts`
4. Create 12 unit tests (2 per operation)
5. Create 6 system tests
6. Update documentation

**Estimated Effort**: 4-6 hours

---

### Task 2.3: Assets Module - Folder Hierarchy Operations (8 operations)

**Value Proposition**: Enable complete asset folder management, critical for organizing asset inventory.

**Implementation Complexity**: Low (similar patterns to existing folder operations)

**Operations to Implement**:

#### Asset Stock Folder Hierarchy (1 operation)
1. `GET /v2.0/AssetStock/Folders/{folderId}/Folders` - Get subfolders in asset stock
   - **operationId**: `GetAssetStockFoldersByParentId`
   - **Use Case**: Navigate asset stock folder hierarchy
   - **Function Name**: `getAssetStockFoldersByParentId`

#### Asset Type Folder Operations (7 operations)
2. `GET /v2.0/AssetTypes/Folders` - Get all asset type folders
   - **operationId**: `GetAssetTypeFolders`
   - **Use Case**: List asset type folder structure
   - **Function Name**: `getAssetTypeFolders`

3. `GET /v2.0/AssetTypes/Folders/{id}` - Get asset type folder by ID
   - **operationId**: `GetAssetTypeFolder`
   - **Use Case**: View specific asset type folder details
   - **Function Name**: `getAssetTypeFolder`

4. `POST /v2.0/AssetTypes/Folders` - Create asset type folder
   - **operationId**: `CreateAssetTypeFolder`
   - **Use Case**: Organize asset types into folders
   - **Function Name**: `createAssetTypeFolder`

5. `PATCH /v2.0/AssetTypes/Folders/{id}` - Update asset type folder
   - **operationId**: `UpdateAssetTypeFolder`
   - **Use Case**: Rename/modify asset type folder
   - **Function Name**: `updateAssetTypeFolder`

6. `DELETE /v2.0/AssetTypes/Folders/{id}` - Delete asset type folder
   - **operationId**: `DeleteAssetTypeFolder`
   - **Use Case**: Remove empty asset type folder
   - **Function Name**: `deleteAssetTypeFolder`

7. `GET /v2.0/AssetTypes/Folders/{folderId}/Folders` - Get subfolders by parent
   - **operationId**: `GetAssetTypeFoldersByParentId`
   - **Use Case**: Navigate asset type folder hierarchy
   - **Function Name**: `getAssetTypeFoldersByParentId`

8. *(Duplicate removed - already covered above)*

**Implementation Steps**:
1. Add 7 operations to `nodes/Baramundi/actions/asset/asset.fields.ts`
2. Implement 7 functions in `nodes/Baramundi/actions/asset/asset.execute.ts`
3. Add 7 router cases in `nodes/Baramundi/actions/router.ts`
4. Create 14 unit tests (2 per operation)
5. Create 7 system tests
6. Update documentation

**Estimated Effort**: 4-6 hours

---

### Task 2.4: Variables Module - Contextual Query Operations (2 operations)

**Value Proposition**: Enable querying variable instances by Windows applications and job definitions.

**Implementation Complexity**: Low (simple GET operations)

**Operations to Implement**:

1. `GET /v2.0/WindowsJobDefinitions/{windowsJobDefinitionId}/VariableInstances` - Get variable instances by job definition
   - **operationId**: `GetVariableInstancesByWindowsJobDefinitonId` (note: typo in spec)
   - **Use Case**: View variables used in specific job
   - **Function Name**: `getVariableInstancesByWindowsJobDefinitionId`

2. `GET /v2.0/WindowsApplications/{windowsApplicationId}/VariableInstances` - Get variable instances by Windows application
   - **operationId**: `GetVariableInstancesByWindowsApplicationId`
   - **Use Case**: View variables used in specific application
   - **Function Name**: `getVariableInstancesByWindowsApplicationId`

**Implementation Steps**:
1. Add 2 operations to `nodes/Baramundi/actions/variable/variable.fields.ts`
2. Implement 2 functions in `nodes/Baramundi/actions/variable/variable.execute.ts`
3. Add 2 router cases in `nodes/Baramundi/actions/router.ts`
4. Create 4 unit tests (2 per operation)
5. Create 2 system tests
6. Update documentation

**Estimated Effort**: 2-3 hours

---

## Priority 3: Platform-Specific Endpoint Operations (63 operations)

**Strategic Decision Required**: The n8n connector currently consolidates platform-specific operations into universal operations for better UX.

**Question for Product Owner/Architect**:
- **Option A**: Keep consolidated approach (better UX, fewer operations)
- **Option B**: Implement all 63 platform-specific operations (100% spec compliance, more verbose)
- **Option C**: Hybrid - implement only the most commonly used platform-specific operations

### Current Consolidation Strategy

The connector uses these universal operations:
- `get` - Works for any endpoint platform (Windows, Linux, Mac, Android, iOS, Industrial, Network)
- `getMany` - Returns endpoints regardless of platform
- `create` - Creates endpoint for any platform (platform determined by parameters)
- `update` - Updates any endpoint type
- `delete` - Deletes any endpoint type

### Platform-Specific Operations Breakdown

#### Android Endpoints (9 operations)
- `GET /v2.0/AndroidEndpoints` - GetAndroidEndpoints
- `POST /v2.0/AndroidEndpoints` - CreateAndroidEndpoint
- `GET /v2.0/AndroidEndpoints/{id}` - GetAndroidEndpoint
- `PATCH /v2.0/AndroidEndpoints/{id}` - UpdateAndroidEndpoint
- `DELETE /v2.0/AndroidEndpoints/{id}` - DeleteAndroidEndpoint
- `POST /v2.0/AndroidEndpoints/{id}/StartEnrollment` - StartAndroidEndpointEnrollment
- `GET /v2.0/LogicalGroups/{logicalGroupId}/AndroidEndpoints` - GetAndroidEndpointsByLogicalGroupId
- `GET /v2.0/StaticGroups/{staticGroupId}/AndroidEndpoints` - GetAndroidEndpointsByStaticGroupId
- `GET /v2.0/ADUsers/{adUserId}/AndroidEndpoints` - GetAndroidEndpointsByADObjectId

#### iOS Endpoints (9 operations)
- Similar pattern to Android

#### Linux Endpoints (9 operations)
- Similar pattern to Android

#### Mac Endpoints (9 operations)
- Similar pattern to Android

#### Industrial Endpoints (9 operations)
- Similar pattern to Android

#### Network Endpoints (9 operations)
- Similar pattern to Android

#### Universal Dynamic Group Queries (9 operations)
- `GET /v2.0/UniversalDynamicGroups/{id}/AndroidEndpoints`
- `GET /v2.0/UniversalDynamicGroups/{id}/IosEndpoints`
- `GET /v2.0/UniversalDynamicGroups/{id}/LinuxEndpoints`
- `GET /v2.0/UniversalDynamicGroups/{id}/MacEndpoints`
- `GET /v2.0/UniversalDynamicGroups/{id}/IndustrialEndpoints`
- `GET /v2.0/UniversalDynamicGroups/{id}/NetworkEndpoints`
- `GET /v2.0/UniversalDynamicGroups/{id}/WindowsEndpoints`
- `GET /v2.0/UniversalDynamicGroups/{id}/Endpoints` (all platforms)

**Analysis**:
- **Benefit of Platform-Specific**: Explicit API, type safety, clearer intent
- **Benefit of Consolidated**: Simpler UX, fewer operations to learn, single workflow pattern
- **Current State**: Consolidated approach works well, no user complaints
- **API Parity**: Platform-specific would match bConnect MCP server exactly

**Recommendation**:
- **If goal is 100% spec compliance**: Implement all 63 operations (20-30 hours effort)
- **If goal is best UX**: Keep consolidated approach (0 hours effort)
- **Hybrid approach**: Add platform-specific operations as "advanced" operations while keeping consolidated ones as "recommended" (30-40 hours effort)

---

## Implementation Roadmap

### Phase 1: High-Value Contextual Queries (2-3 weeks)
**Effort**: 18-27 hours
**Impact**: High - Enables critical reporting and monitoring workflows

1. **Week 1**: Task 2.1 - Jobs Module (12 operations, 8-12 hours)
2. **Week 2**: Task 2.2 - Active Directory Module (6 operations, 4-6 hours)
3. **Week 3**: Task 2.3 - Assets Module (8 operations, 4-6 hours) + Task 2.4 - Variables Module (2 operations, 2-3 hours)

**Deliverable**: 28 new operations, 56 unit tests, 28 system tests

### Phase 2: Platform-Specific Operations (4-6 weeks) - OPTIONAL
**Effort**: 20-30 hours (if chosen)
**Impact**: Medium - Achieves 100% spec compliance, explicit platform APIs

1. **Week 4-5**: Android, iOS, Linux platform-specific operations (27 operations)
2. **Week 6-7**: Mac, Industrial, Network platform-specific operations (27 operations)
3. **Week 8-9**: Universal dynamic group platform queries (9 operations)

**Deliverable**: 63 new operations, 126 unit tests, 63 system tests

### Phase 3: Documentation and Polish (1 week)
**Effort**: 8-10 hours
**Impact**: High - Ensures users can discover and use new operations

1. Update README.md with complete operation list
2. Create workflow examples demonstrating new operations
3. Update API reference documentation
4. Create migration guide if platform-specific operations added

---

## Testing Strategy

### Unit Tests (TDD Approach)
- **Coverage Target**: 90%+ for all new operations
- **Test Cases per Operation**:
  - Happy path with valid data
  - Error handling (404, 400, 401, 403)
  - Parameter validation (GUID format, required fields)
  - Edge cases (empty results, pagination)

### System Tests (Live API Validation)
- **Coverage Target**: 1 test per operation minimum
- **Test Infrastructure**: Existing `test/system/setup.ts`
- **Test Strategy**:
  - Use live bConnect API (https://bms-win22srv:444/bconnect)
  - Create test data, execute operation, verify results, cleanup
  - Skip tests if prerequisites not met (e.g., no Android endpoints)

### Integration Tests (Optional - Future)
- End-to-end workflow tests using n8n test framework
- Test common use cases combining multiple operations

---

## Success Criteria

### Phase 1 Success Criteria (Phase 8 — completed 2026-03-31)
- [x] 28 new operations implemented
- [x] Tests passing (526 after Phase 8)
- [x] No regression in existing tests
- [x] Build succeeds without warnings

### Phase 2 Success Criteria (Phase 9 — completed 2026-04-01)
- [x] Platform-specific endpoint operations implemented (typed + industrial)
- [x] 15 new unit tests added (541 total)
- [x] TypeScript 0 errors
- [x] Backward compatibility maintained

### Overall Success Criteria
- [x] All meaningful V2.0 operations implemented
- [x] Test suite: 547 unit tests passing
- [x] 0 lint errors
- [x] Zero breaking changes to existing operations

---

## Risk Assessment

### Technical Risks
1. **API Changes**: bConnect API may differ from OpenAPI spec
   - **Mitigation**: System tests validate against live API, discover discrepancies early

2. **Breaking Changes**: New operations may conflict with existing ones
   - **Mitigation**: TDD approach, comprehensive unit tests, careful router design

3. **Performance**: Adding 91 operations may impact load time
   - **Mitigation**: Lazy loading, code splitting if needed

### Resource Risks
1. **Time Estimate Accuracy**: Estimates assume familiarity with codebase
   - **Mitigation**: Break into small tasks, track actual effort, adjust as needed

2. **Testing Infrastructure**: System tests require live bConnect server
   - **Mitigation**: Existing infrastructure in place, proven to work

### Business Risks
1. **ROI Uncertainty**: Platform-specific operations may have low usage
   - **Mitigation**: Phase 1 first (high ROI), defer Phase 2 until demand proven

2. **Maintenance Burden**: More operations = more code to maintain
   - **Mitigation**: Consistent patterns, comprehensive tests, good documentation

---

## Appendix A: Complete Missing Operations List

### Jobs Module (12 missing)
```
GET    /v2.0/Folders/{folderId}/Folders
GET    /v2.0/Folders/{folderId}/JobDefinitions
GET    /v2.0/JobDefinitions/{jobDefinitionId}/JobInstances
GET    /v2.0/Endpoints/{endpointId}/JobInstances
GET    /v2.0/LogicalGroups/{logicalGroupId}/JobInstances
GET    /v2.0/StaticGroups/{staticGroupId}/JobInstances
GET    /v2.0/DynamicGroups/{dynamicGroupId}/JobInstances
GET    /v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/JobInstances
GET    /v2.0/ADObjects/{adObjectId}/KioskReleases
GET    /v2.0/JobDefinitions/{jobDefinitionId}/KioskReleases
GET    /v2.0/Endpoints/{endpointId}/KioskReleases
GET    /v2.0/LogicalGroups/{logicalGroupId}/KioskReleases
```

### Active Directory Module (6 missing)
```
GET    /v2.0/ADGroups/{adGroupId}/ADGroups
GET    /v2.0/ADObjects/{id}/ADGroupMemberships
GET    /v2.0/ADGroups/{adGroupId}/ADObjects
GET    /v2.0/OrgUnits/{orgUnitId}/ADObjects
GET    /v2.0/OrgUnits/{orgUnitId}/ADUsers
GET    /v2.0/OrgUnits/{orgUnitId}/OrgUnits
```

### Assets Module (8 missing)
```
GET    /v2.0/AssetStock/Folders/{folderId}/Folders
GET    /v2.0/AssetTypes/Folders
GET    /v2.0/AssetTypes/Folders/{id}
POST   /v2.0/AssetTypes/Folders
PATCH  /v2.0/AssetTypes/Folders/{id}
DELETE /v2.0/AssetTypes/Folders/{id}
GET    /v2.0/AssetTypes/Folders/{folderId}/Folders
```

### Variables Module (2 missing)
```
GET    /v2.0/WindowsJobDefinitions/{windowsJobDefinitionId}/VariableInstances
GET    /v2.0/WindowsApplications/{windowsApplicationId}/VariableInstances
```

### Endpoints Module (63 missing - platform-specific operations)
See "Priority 3: Platform-Specific Endpoint Operations" section for details.

---

## Appendix B: Implementation Template

### Template for Adding New Operation

**File Structure**:
```
nodes/Baramundi/actions/{module}/{module}.fields.ts  - Field definitions
nodes/Baramundi/actions/{module}/{module}.execute.ts - Implementation
nodes/Baramundi/actions/router.ts                     - Router case
test/nodes/Baramundi/actions/{module}/{module}.execute.test.ts - Unit tests
test/system/{module}.system.test.ts                   - System tests
```

**Step-by-Step Process**:

1. **Add operation to fields** (`{module}.fields.ts`):
```typescript
{
  name: 'Operation Name',
  value: 'operationName',
  description: 'Brief description',
  action: 'Action verb',
},
```

2. **Add field definitions** (`{module}.fields.ts`):
```typescript
{
  displayName: 'Parameter Name',
  name: 'parameterId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['{module}'],
      operation: ['operationName'],
    },
  },
  default: '',
  description: 'Parameter description',
},
```

3. **Implement function** (`{module}.execute.ts`):
```typescript
export async function operationName(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const parameterId = this.getNodeParameter('parameterId', index) as string;

  const response = await apiRequest.call(
    this,
    'GET',
    `/v2.0/Path/${parameterId}`,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}
```

4. **Add router case** (`router.ts`):
```typescript
case 'operationName':
  responseData = await {module}.operationName.call(this, i);
  break;
```

5. **Write unit tests** (`{module}.execute.test.ts`):
```typescript
describe('operationName()', () => {
  it('should fetch data successfully', async () => {
    const parameterId = 'test-id';
    const mockResponse = { id: parameterId, name: 'Test' };

    const mockContext = createMockExecuteFunctions(
      { parameterId },
      {},
      mockResponse
    );

    const result = await operationName.call(mockContext, 0);

    expect(result).toBeDefined();
    expect(result[0].json.id).toBe(parameterId);
  });

  it('should handle errors', async () => {
    const mockContext = createMockExecuteFunctions({ parameterId: 'invalid' }, {}, {});
    mockContext.helpers.httpRequest = vi.fn(async () => {
      throw new Error('Not found');
    });

    await expect(operationName.call(mockContext, 0)).rejects.toThrow('Not found');
  });
});
```

6. **Write system test** (`{module}.system.test.ts`):
```typescript
it('should fetch data from live API', async () => {
  const context = createSystemTestContext();
  const result = await operationName.call(context, 0);

  expect(result).toBeDefined();
  expect(Array.isArray(result)).toBe(true);
});
```

---

## Appendix C: Comparison with bConnect MCP Server

The bConnect MCP server has a different operation granularity strategy:

**MCP Server**: 94 V2.0 tools
- Consolidates related operations into single tools with parameters
- Example: Single `listEndpoints` tool with `platform` parameter

**n8n Connector**: 137 V2.0 operations (V1.1 removed — REQ-SCOPE-1)
- More granular operations for specific use cases
- Example: Separate `getWindowsEndpoints`, `getLogicalGroups`, etc.

**Impact**: Direct operation count comparison is misleading. The n8n connector provides MORE specific V2.0 operations than MCP but fewer than the OpenAPI spec due to intelligent consolidation.

---

**Last Updated**: 2026-01-23
**Document Version**: 1.0
**Author**: Claude Code Analysis
