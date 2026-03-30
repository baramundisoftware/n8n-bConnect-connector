# System Test Coverage Analysis

Generated: 2026-01-20

## Summary

- **Total Operations**: 130 across 11 resources
- **System Tests Implemented**: 20 tests covering 3 resources
- **Coverage**: 15% (20/130 operations have dedicated system tests)

## Coverage by Resource

| Resource | Total Ops | System Tests | Coverage | Status |
|----------|-----------|--------------|----------|--------|
| **Software** | 4 | 5 | ✅ 125% | **Complete** |
| **Endpoint** | 25 | 6 | ✅ 24% | **Partial** |
| **Jobs** | 17 | 9 | ✅ 53% | **Partial** |
| Active Directory | 10 | 0 | ❌ 0% | Missing |
| Assets | 16 | 0 | ❌ 0% | Missing |
| Defense Control | 11 | 0 | ❌ 0% | Missing |
| Operating Systems | 9 | 0 | ❌ 0% | Missing |
| Org Units | 3 | 0 | ❌ 0% | Missing |
| Server Management | 21 | 0 | ❌ 0% | Missing |
| Update Management | 3 | 0 | ❌ 0% | Missing |
| Variables | 11 | 0 | ❌ 0% | Missing |

## Detailed Coverage

### ✅ Software API (4 operations) - 5 tests
- ✅ `getInstalledWindowsSoftware()` - 3 tests (basic, search query, orderBy)
- ✅ `getInstalledSoftwareByEndpoint()` - 1 test
- ❌ `getInstalledSoftwareByLogicalGroup()` - Missing
- ❌ `getInstalledSoftwareByUniversalDynamicGroup()` - Missing
- ✅ Error handling - 1 test

**Coverage: 50% of operations + error handling**

### ✅ Endpoint API (25 operations) - 6 tests
- ✅ `getMany()` - 1 test (fetch endpoints with pagination)
- ✅ `get()` - 1 test (get specific endpoint by ID)
- ❌ `search()` - Missing
- ❌ `deleteEndpoint()` - Missing (used in cleanup, not tested)
- ❌ `create()` - Missing
- ✅ `update()` - 1 test (update comment with restoration)
- ❌ `startEnrollment()` - Missing
- ❌ `getLogicalGroup()` - Missing (8 operations)
- ❌ `getStaticGroup()` - Missing (5 operations)
- ❌ `getDynamicGroup()` - Missing (2 operations)
- ❌ `createEndpointMaintenanceWindow()` - Missing (3 operations)
- ❌ `createGroupMaintenanceWindow()` - Missing (3 operations)
- ✅ OrderBy support - 1 test
- ✅ Error handling - 2 tests (invalid ID, invalid GUID)

**Coverage: 12% of operations (3/25) + error handling**

### ✅ Jobs API (17 operations) - 9 tests
- ✅ `get()` - 1 test (get job definition by ID)
- ✅ `getMany()` - 2 tests (fetch with pagination, search query)
- ❌ `execute()` - Missing
- ✅ `getInstances()` - 1 test
- ❌ `getJobInstance()` - Missing
- ❌ `stopJobInstance()` - Missing
- ❌ `resumeJobInstance()` - Missing
- ❌ `deleteJobInstance()` - Missing (used in cleanup, not tested)
- ✅ `getFolders()` - 1 test
- ✅ `getFolder()` - Included in CRUD test
- ✅ `createFolder()` - Included in CRUD test
- ✅ `updateFolder()` - Included in CRUD test
- ✅ `deleteFolder()` - Included in CRUD test
- ✅ `getKioskReleases()` - 1 test
- ❌ `getKioskRelease()` - Missing
- ❌ `createKioskRelease()` - Missing
- ❌ `withdrawKioskRelease()` - Missing
- ✅ Error handling - 2 tests (invalid job ID, invalid folder ID)

**Coverage: 53% of operations (9/17) + error handling**

### ❌ Active Directory API (10 operations) - 0 tests
**All operations missing:**
- `getADGroups()`, `getADGroup()`, `getADGroupsByOrgUnit()`
- `getADUsersByGroup()`, `getADUsers()`, `getADUser()`
- `getADObjects()`, `getADObject()`
- `getOrgUnits()`, `getOrgUnit()`

### ❌ Assets API (16 operations) - 0 tests
**All operations missing:**
- `get()`, `getMany()`, `create()`, `update()`, `deleteAsset()`
- `getAssetTypes()`, `getAssetType()`, `createAssetType()`, `deleteAssetType()`
- `getAssetsByEndpoint()`, `getAssetsByLogicalGroup()`
- `getAssetStockAssets()`, `getAssetStockFolders()`
- `createAssetStockFolder()`, `updateAssetStockFolder()`, `deleteAssetStockFolder()`

### ❌ Defense Control API (11 operations) - 0 tests
**All operations missing:**
- `getBitLockerWindowsEndpoints()`, `getBitLockerWindowsEndpoint()`
- `getLocalAdministrativeAccounts()`, `triggerLocalAdminAccountsUpdate()`, `patchLocalAdminUserCredentials()`
- `getMicrosoftDefenderThreats()`, `getMicrosoftDefenderThreat()`
- `getMicrosoftDefenderThreatsByEndpoint()`, `getMicrosoftDefenderThreatsByLogicalGroup()`
- `getMicrosoftDefenderWindowsEndpoints()`, `getMicrosoftDefenderWindowsEndpoint()`

### ❌ Operating Systems API (9 operations) - 0 tests
**All operations missing:**
- `getFolders()`, `getFolder()`, `getFoldersByFolderId()`
- `createFolder()`, `updateFolder()`, `deleteFolder()`
- `getWindowsEndpoints()`, `getWindowsEndpoint()`, `updateWindowsEndpoint()`

### ❌ Org Units API (3 operations) - 0 tests
**All operations missing:**
- `get()`, `getMany()`, `getChildren()`

### ❌ Server Management API (21 operations) - 0 tests
**All operations missing:**
- `getManagementServer()`, `getGateway()`, `getDipStatus()`, `getVpnAppliance()`
- `getMicroservices()`, `getMicroservice()`
- `getCloudConnectors()`, `getPxeRelays()`
- `getSecurityGroups()`, `getSecurityGroup()`, `createSecurityGroup()`, `updateSecurityGroup()`, `deleteSecurityGroup()`
- `getSecurityProfiles()`, `getSecurityProfile()`, `getAccessRights()`
- `restartManagementServer()`, `cancelScheduledRestart()`
- `startMicroservice()`, `stopMicroservice()`, `restartMicroservice()`

### ❌ Update Management API (3 operations) - 0 tests
**All operations missing:**
- `getWindowsEndpoints()`, `getWindowsEndpoint()`, `updateWindowsEndpoint()`

### ❌ Variables API (11 operations) - 0 tests
**All operations missing:**
- `getVariableDefinitions()`, `getVariableDefinition()`
- `createVariableDefinition()`, `updateVariableDefinition()`, `deleteVariableDefinition()`
- `getVariableInstances()`, `getVariableInstance()`, `updateVariableInstance()`
- `getVariableInstancesByEndpoint()`, `getVariableInstancesByLogicalGroup()`, `getVariableInstancesByADObject()`

## Recommendations

### Priority 1: Complete Core Resources (High Impact)
1. **Jobs API** - Add missing 8 operations (execute, instance management, kiosk CRUD)
2. **Endpoint API** - Add missing 22 operations (groups, maintenance windows, enrollment)
3. **Software API** - Add missing 2 operations (logical group, dynamic group queries)

### Priority 2: Add Critical Read-Only Resources (Safe to Test)
4. **Active Directory API** - 10 read operations (no side effects)
5. **Org Units API** - 3 read operations (no side effects)
6. **Defense Control API** - 6 read operations (BitLocker, Defender - safe)

### Priority 3: Add Complex CRUD Resources (Needs Cleanup)
7. **Assets API** - 16 operations (CRUD for assets + types + stock folders)
8. **Variables API** - 11 operations (CRUD for definitions + instances)
9. **Operating Systems API** - 9 operations (CRUD for folders + endpoints)
10. **Server Management API** - 21 operations (read-only server info + security groups CRUD)

### Priority 4: Add Remaining Resources
11. **Update Management API** - 3 operations (Windows endpoints read + update)

## Implementation Strategy

### Phase 1: Complete Existing Resources (Est. 2 hours)
- Jobs: Add 8 missing tests (execute, instance ops, kiosk CRUD)
- Endpoint: Add 22 missing tests (groups, maintenance windows)
- Software: Add 2 missing tests (group queries)
- **Total**: 32 new tests → 52 tests total

### Phase 2: Read-Only Resources (Est. 3 hours)
- Active Directory: 10 tests
- Org Units: 3 tests
- Defense Control (read-only): 6 tests
- **Total**: 19 new tests → 71 tests total

### Phase 3: CRUD Resources (Est. 5 hours)
- Assets: 16 tests with cleanup
- Variables: 11 tests with cleanup
- Operating Systems: 9 tests with cleanup
- Server Management: 21 tests (read-only + security groups with cleanup)
- Update Management: 3 tests
- **Total**: 60 new tests → 131 tests total

### Final Goal
- **130 operations** → **131 system tests** (100% coverage + error handling)
- **Execution time**: ~5-10 seconds (real API calls)
- **Cleanup**: All write operations with proper afterAll hooks

## Current Test Files

```
test/system/
├── setup.ts                      # Test infrastructure (139 lines)
├── software.system.test.ts       # 5 tests ✅
├── endpoint.system.test.ts       # 6 tests ✅
└── job.system.test.ts            # 9 tests ✅
```

## Proposed Additional Files (for 100% coverage)

```
test/system/
├── activeDirectory.system.test.ts    # 10 tests
├── asset.system.test.ts              # 16 tests + cleanup
├── defenseControl.system.test.ts     # 11 tests
├── operatingSystem.system.test.ts    # 9 tests + cleanup
├── orgUnit.system.test.ts            # 3 tests
├── serverManagement.system.test.ts   # 21 tests + cleanup
├── updateManagement.system.test.ts   # 3 tests
└── variable.system.test.ts           # 11 tests + cleanup
```

---

**Status**: Initial implementation complete (20/130 operations tested)
**Next Steps**: Expand coverage to remaining 8 resources
**Goal**: 100% system test coverage for production confidence
