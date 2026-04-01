# n8n-nodes-baramundi - Task Board

## Project Goal

Create an n8n community node for baramundi Management Suite (bConnect API) to enable workflow automation for IT endpoint management. The connector targets **bConnect V2.0 API only**, supporting bMS versions 25R2 and 26R1. V1.1 API is not supported (see REQ-SCOPE-1 in Requirements.md).

---

## InWork

*Currently active tasks*

### 🎯 Recently Completed (2026-01-22)

**LoadOptions Implementation for Enhanced UX** ✅ COMPLETE
- **Objective**: Replace manual GUID entry with dynamic dropdown lists for endpoints and jobs
- **Scope**: 6 endpoint operations + 6 job operations (12 total operations enhanced)
- **Implementation**:
  - Added 6 loadOptions methods to `Baramundi.node.ts` (getEndpoints, getJobDefinitions, getOrgUnits, getLogicalGroups, getStaticGroups, getDynamicGroups)
  - Implemented hybrid dropdown pattern (API-loaded dropdown + custom GUID fallback)
  - Updated field definitions in `endpoint.fields.ts` and `job.fields.ts`
  - Updated execute logic in `endpoint.execute.ts` and `job.execute.ts`
  - Fixed and validated 140 unit tests (75 endpoint + 62 job + 3 compilation fixes)
  - Fixed and validated 7 system tests (4 endpoint + 3 job)
  - Note: V1.1 modules (setupIntegrity, ssh, vpp, etc.) subsequently removed per REQ-SCOPE-1
  - Built and deployed package to running n8n instance
- **Test Results**: 633 tests passing (23 skipped), 86.35% coverage
- **Impact**: Significantly improved UX - users can now select endpoints/jobs from searchable dropdowns instead of manually entering GUIDs
- **Status**: Deployed to n8n (http://localhost:5678) and ready for manual UI testing

_(No other tasks currently in progress)_

---

## Todo

### 🎯 V2.0 API Implementation Status - Core Complete, 91 Operations Remaining

**Summary (2026-01-23):**
- **Total Operations Implemented**: 137/228 V2.0 operations (60.1% spec coverage) — V2.0 only per REQ-SCOPE-1
- **Status**: All essential CRUD operations complete, contextual queries pending
- **Test Coverage**: 547 unit tests passing (118 skipped) + system tests

**📋 Complete Gap Analysis**: See [tasks_bConnect_Complete.md](./tasks_bConnect_Complete.md) for detailed roadmap to 100% V2.0 spec coverage

**Coverage by Module**:
- ✅ **100% Complete (5 modules)**: DefenseControl, OperatingSystems, ServerManagement, Software, UpdateManagement
- ⚠️ **Partial (4 modules)**: Jobs (64.7%), Assets (66.7%), ActiveDirectory (62.5%), Variables (84.6%)
- ❌ **Low (1 module)**: Endpoints (29.2% - due to platform consolidation strategy)

**Recently Added Operations (Session 2026-01-23):**
- [x] POST `/v2.0/JobInstances/{id}/Start` - Start job instance ✅
- [x] POST `/v2.0/SecurityProfiles` - Create security profile ✅
- [x] PATCH `/v2.0/SecurityProfiles/{id}` - Update security profile ✅
- [x] DELETE `/v2.0/SecurityProfiles/{id}` - Delete security profile ✅
- [x] PATCH `/v2.0/Objects/{id}` - Update object permissions ✅
- [x] POST `/v2.0/WindowsEndpoints/{id}/TriggerInstallationViaIntune` - Intune integration ✅

**Verification Confirmation:**
The following operations were previously reported as "missing" but verification confirms they were already implemented:

#### Software Module (4 operations) ✅ ALREADY IMPLEMENTED
- [x] getInstalledWindowsSoftware - GET `/v2.0/InstalledWindowsSoftware`
- [x] getInstalledWindowsSoftwareById - GET `/v2.0/WindowsEndpoints/{id}/InstalledWindowsSoftware`
- [x] getWindowsSoftwareInstalledOnEndpoints - GET `/v2.0/LogicalGroups/{id}/InstalledWindowsSoftware`
- [x] getWindowsSoftwareInstalledOnEndpoint - Dynamic group support
  - Implementation: `nodes/Baramundi/actions/software/software.execute.ts`

#### DefenseControl Module (11 operations) ✅ ALREADY IMPLEMENTED
**BitLocker Operations:**
- [x] getBitLockerRecoveryKeys - GET `/v2.0/BitLocker/WindowsEndpoints`
- [x] getBitLockerRecoveryKey - GET `/v2.0/BitLocker/WindowsEndpoints/{id}`
- [x] deleteBitLockerRecoveryKey - DELETE `/v2.0/BitLocker/WindowsEndpoints/{id}`

**Local Admin Accounts:**
- [x] getLocalAdminPasswords - GET `/v2.0/LocalAdministrativeAccounts/WindowsEndpoints`
- [x] getLocalAdminPassword - GET `/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id}`
- [x] rotateLocalAdminPassword - POST `/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id}/TriggerUpdateOnClient`

**Microsoft Defender:**
- [x] getDefenderExclusions - GET `/v2.0/MicrosoftDefender/Exclusions`
- [x] getDefenderExclusionsByEndpoint - GET `/v2.0/MicrosoftDefender/WindowsEndpoints/{id}/Exclusions`
- [x] createDefenderExclusion - POST `/v2.0/MicrosoftDefender/Exclusions`
- [x] updateDefenderExclusion - PATCH `/v2.0/MicrosoftDefender/Exclusions/{id}`
- [x] deleteDefenderExclusion - DELETE `/v2.0/MicrosoftDefender/Exclusions/{id}`
  - Implementation: `nodes/Baramundi/actions/defenseControl/defenseControl.execute.ts`

**Note**: The "17 missing endpoints" claim from the previous session was inaccurate. Most endpoints already existed in the codebase. Only 6 new operations were actually implemented in this session.

### ⭐ High Priority - V2.0 Core Resources

#### 1. Endpoints API (Extend)
- [x] **Add Endpoint CRUD operations** ✅ COMPLETE
  - [x] Create Windows endpoint
  - [x] Create Linux endpoint
  - [x] Create Mac endpoint
  - [x] Create Android endpoint
  - [x] Create iOS endpoint
  - [x] Update endpoint properties (PATCH)
  - [x] Start enrollment for endpoint
- [x] **Add Group operations** ✅ COMPLETE (15 operations)
  - [x] Get/Get Many/Create/Update/Delete Logical Groups (5 operations)
  - [x] Get/Get Many/Create/Update/Delete Static Groups (5 operations)
  - [x] Get/Get Many Dynamic Groups (2 operations, read-only)
  - [x] List endpoints in groups (3 operations: logical, static, dynamic)
- [x] **Add Maintenance Window operations** ✅ COMPLETE (6 operations)
  - [x] Create/Update/Delete maintenance window for endpoint (3 operations)
  - [x] Create/Update/Delete maintenance window for group (3 operations)

#### 2. Jobs API ✅ COMPLETE (Read & Execute Operations)
- [x] **Job Definitions** (Basic operations complete - 2/7 operations)
  - [x] Get job definition by ID
  - [x] List all job definitions
  - [ ] Create job definition (Write operation - Future)
  - [ ] Update job definition (Write operation - Future)
  - [ ] Delete job definition (Write operation - Future)
- [x] **Job Instances** ✅ COMPLETE (8 operations)
  - [x] Get job instances by job definition
  - [x] Start job execution
  - [x] Get specific job instance details
  - [x] Stop job execution
  - [x] Resume job execution
  - [x] Delete job instance
- [x] **Job Folders** ✅ COMPLETE (5 operations)
  - [x] List job folders (with pagination)
  - [x] Get job folder by ID
  - [x] Create job folder
  - [x] Update job folder (PATCH with JSON Patch)
  - [x] Delete job folder
- [x] **Kiosk Releases** ✅ COMPLETE (4 operations)
  - [x] List kiosk releases (with pagination)
  - [x] Get kiosk release by ID
  - [x] Create kiosk release
  - [x] Withdraw (delete) kiosk release

#### 3. Assets API ✅ COMPLETE (Full CRUD + Organization + Stock)
- [x] **Asset Management** ✅ COMPLETE (5 operations)
  - [x] Get asset by ID
  - [x] List all assets
  - [x] Create asset
  - [x] Update asset (PATCH)
  - [x] Delete asset
- [x] **Asset Types** ✅ COMPLETE (4 operations)
  - [x] List all asset types (with pagination)
  - [x] Get asset type by ID
  - [x] Create asset type
  - [x] Delete asset type
- [x] **Asset Organization** ✅ COMPLETE (2 operations)
  - [x] Get assets by endpoint
  - [x] Get assets by logical group
- [x] **Asset Stock** ✅ COMPLETE (4 operations)
  - [x] List asset stock assets (with pagination)
  - [x] List asset stock folders (with pagination)
  - [x] Create asset stock folder
  - [x] Update asset stock folder (PATCH)
  - [x] Delete asset stock folder

### ⚡ Medium Priority - V2.0 Extended Resources

#### 4. Active Directory API ✅ COMPLETE (Read-Only Operations)
- [x] **AD Groups** ✅ COMPLETE (4 operations)
  - [x] List AD groups (with pagination)
  - [x] Get AD group by ID
  - [x] Get AD groups by organizational unit
  - [x] Get AD users by group (group members)
- [x] **AD Users** ✅ COMPLETE (2 operations)
  - [x] List AD users (with pagination)
  - [x] Get AD user by ID
- [x] **AD Objects** ✅ COMPLETE (2 operations)
  - [x] List AD objects (with pagination)
  - [x] Get AD object by ID
- [x] **AD Organizational Units** ✅ COMPLETE (2 operations)
  - [x] List AD OUs (with pagination)
  - [x] Get AD OU by ID

#### 5. Server Management API ✅ COMPLETE (21 Operations)
- [x] **Server Information** ✅ COMPLETE (4 operations)
  - [x] Get management server information
  - [x] Get gateway information
  - [x] Get DIP status
  - [x] Get VPN appliance information
- [x] **Microservices** ✅ COMPLETE (7 operations)
  - [x] List all microservices
  - [x] Get microservice by ID
  - [x] Start microservice
  - [x] Stop microservice
  - [x] Restart microservice
- [x] **Infrastructure** ✅ COMPLETE (2 operations)
  - [x] List cloud connectors
  - [x] List PXE relays
- [x] **Security Groups** ✅ COMPLETE (5 operations)
  - [x] List security groups (with pagination)
  - [x] Get security group by ID
  - [x] Create security group
  - [x] Update security group (PATCH)
  - [x] Delete security group
- [x] **Security Profiles** ✅ COMPLETE (2 operations)
  - [x] List security profiles (with pagination)
  - [x] Get security profile by ID
- [x] **Object Permissions** ✅ COMPLETE (1 operation)
  - [x] Get access rights for object
- [x] **Server Control** ✅ COMPLETE (2 operations)
  - [x] Restart management server
  - [x] Cancel scheduled restart

#### 6. Defense Control API ✅ COMPLETE (11 Operations)
- [x] **BitLocker** ✅ COMPLETE (2 operations)
  - [x] List BitLocker Windows endpoints (with pagination)
  - [x] Get BitLocker Windows endpoint by ID
- [x] **Local Admin Accounts** ✅ COMPLETE (3 operations)
  - [x] Get local administrative accounts for endpoint
  - [x] Trigger local admin accounts update
  - [x] Patch local admin user credentials (PATCH)
- [x] **Microsoft Defender Threats** ✅ COMPLETE (4 operations)
  - [x] List all Microsoft Defender threats (with pagination)
  - [x] Get Microsoft Defender threat by ID
  - [x] Get threats by endpoint
  - [x] Get threats by logical group
- [x] **Microsoft Defender Endpoints** ✅ COMPLETE (2 operations)
  - [x] List Microsoft Defender Windows endpoints (with pagination)
  - [x] Get Microsoft Defender Windows endpoint by ID

#### 7. Variables API ✅ COMPLETE (11 Operations)
- [x] **Variable Definitions** ✅ COMPLETE (5 operations)
  - [x] List all variable definitions (with pagination)
  - [x] Get variable definition by ID
  - [x] Create variable definition
  - [x] Update variable definition (PATCH)
  - [x] Delete variable definition
- [x] **Variable Instances** ✅ COMPLETE (6 operations)
  - [x] List all variable instances (with pagination)
  - [x] Get variable instance by ID
  - [x] Update variable instance (PATCH)
  - [x] Get variable instances by endpoint
  - [x] Get variable instances by logical group
  - [x] Get variable instances by AD object

#### 8. Operating Systems API ✅ COMPLETE (9 Operations)
- [x] **OS Folders** ✅ COMPLETE (5 operations)
  - [x] List OS folders (with pagination)
  - [x] Get OS folder by ID
  - [x] Get folders by parent folder ID (with pagination)
  - [x] Update OS folder (PATCH)
  - [x] Delete OS folder
- [x] **Windows Endpoints** ✅ COMPLETE (4 operations)
  - [x] List Windows endpoints (with pagination)
  - [x] Get Windows endpoint by ID
  - [x] Create Windows endpoint
  - [x] Update Windows endpoint (PATCH)

#### 9. Software API ✅ COMPLETE (5 Operations)
- [x] **Software Inventory** ✅ COMPLETE (5 operations)
  - [x] List all installed Windows software (with pagination)
  - [x] Get installed software by endpoint
  - [x] Get installed software by logical group
  - [x] Get installed software by universal dynamic group (not available in all versions)

#### 10. Update Management API ✅ COMPLETE (3 Operations)
- [x] **Windows Updates** ✅ COMPLETE (3 operations)
  - [x] List Windows endpoints (with pagination)
  - [x] Get Windows endpoint by ID
  - [x] Get single update by endpoint and update ID

### 🧪 Testing & Quality (TDD Methodology)

- [x] **Unit Tests - 547 passing, 118 skipped** ✅ (V2.0 only, per REQ-SCOPE-1)
  - [x] Endpoint operations ✅ COMPLETE
  - [x] Jobs API operations ✅ COMPLETE
  - [x] Assets API operations ✅ COMPLETE
  - [x] Server Management API ✅ COMPLETE
  - [x] Active Directory API ✅ COMPLETE
  - [x] Defense Control API ✅ COMPLETE
  - [x] Variables API ✅ COMPLETE
  - [x] Operating Systems API ✅ COMPLETE
  - [x] Software API ✅ COMPLETE
  - [x] Update Management API ✅ COMPLETE
  - [x] Transport layer ✅ COMPLETE
  - [x] Coverage: 90-100% for all implemented modules ✅ Target exceeded

- [x] **System Tests** ✅ (Live bConnect V2.0 API validation, per REQ-SCOPE-1)
  - [x] Endpoints API ✅
  - [x] Jobs API ✅
  - [x] Assets API ✅
  - [x] Server Management API ✅
  - [x] Active Directory API ✅
  - [x] Defense Control API ✅
  - [x] Variables API ✅
  - [x] Operating Systems API ✅
  - [x] Software API ✅
  - [x] Update Management API ✅
  - [x] Compliance API ✅
  - [x] **TDD Methodology**: Tests written first, then validated against live API
  - [x] **Infrastructure**: test/system/setup.ts with environment-based configuration
  - [x] Test against live BMS server (https://bms-win22srv:444/bconnect)
  - [x] Test credential validation, error handling (404, 400, invalid IDs)
  - [x] Test CRUD operations with cleanup, pagination and filtering

- [ ] **MSW Integration Tests** (Future - Optional Enhancement)
  - [ ] Set up MSW for mocked HTTP tests (faster CI/CD pipeline)
  - [ ] Create realistic mock data from real API responses
  - [ ] Test full request/response cycles without live API dependency

### 📚 Documentation & Polish

- [ ] **Documentation**
  - [ ] Add screenshots to README
  - [ ] Create video tutorial
  - [ ] Document all V2.0 resources (V1.1 removed per REQ-SCOPE-1)
  - [ ] Create workflow examples for each resource

- [x] **UX Improvements - Phase 1: LoadOptions Implementation** ✅ COMPLETE
  - [x] **Add loadOptions for endpoint selection** (HIGH PRIORITY) ✅ COMPLETE
    - [x] Implement `getEndpoints` loadOptions method in Baramundi.node.ts
    - [x] Add hybrid dropdown pattern in endpoint.fields.ts (6 operations)
    - [x] Update endpoint.execute.ts to handle selection parameters (6 functions)
    - [x] Fix and validate all endpoint unit tests (75 tests passing)
    - [x] Fix and validate endpoint system tests (4 tests fixed)
    - Benefits: Dynamic endpoint dropdown, searchable list, fallback to custom GUID
    - Files: `Baramundi.node.ts`, `endpoint.fields.ts`, `endpoint.execute.ts`
  - [x] **Add loadOptions for job selection** (HIGH PRIORITY) ✅ COMPLETE
    - [x] Implement `getJobDefinitions` loadOptions method in Baramundi.node.ts
    - [x] Add hybrid dropdown pattern in job.fields.ts (6 operations: get, execute, getInstances, createKioskRelease, update, delete)
    - [x] Update job.execute.ts to handle selection parameters (6 functions)
    - [x] Fix and validate all job unit tests (62 tests passing)
    - [x] Fix and validate job system tests (3 tests fixed)
    - [x] Build package successfully with all TypeScript fixes
    - [x] Deploy to n8n instance and restart service
    - Benefits: Dynamic job dropdown with type info, searchable list, fallback to custom GUID
    - Files: `Baramundi.node.ts`, `job.fields.ts`, `job.execute.ts`
    - Implementation: Hybrid dropdown showing top 100 jobs with "Enter Custom GUID..." fallback option
  - [x] **Add loadOptions for organizational groups** ✅ COMPLETE
    - [x] Implement `getOrgUnits`, `getLogicalGroups`, `getStaticGroups`, `getDynamicGroups` methods
    - [x] Available for use in future endpoint/job operations
    - Files: `Baramundi.node.ts`
- [ ] **UX Improvements - Phase 2: Advanced Features** (FUTURE)
  - [ ] **Upgrade to resourceLocator for endpoint selection** (MEDIUM PRIORITY)
    - Enhance current loadOptions to full resourceLocator component
    - Implement `endpointSearch` method in Baramundi.node.ts
    - Support 3 modes: By ID (with GUID validation), From List (searchable dropdown), By URL
    - Benefits: Advanced search, autocomplete, richer UI/UX
    - Files: `Baramundi.node.ts` (add methods.listSearch), `endpoint.fields.ts`, `endpoint.execute.ts`
  - [ ] **Upgrade to resourceLocator for job selection** (MEDIUM PRIORITY)
    - Enhance current loadOptions to full resourceLocator component
    - Implement `jobDefinitionSearch` and `jobFolderSearch` methods
    - Show job type, description in dropdown for better context
    - Benefits: Advanced job discovery, richer context display
    - Files: `Baramundi.node.ts`, `job.fields.ts`, `job.execute.ts`
  - [ ] **Improve error messages** (MEDIUM-HIGH PRIORITY)
    - Enhance `transport/requestApi.ts` with contextual error handling
    - Add HTTP status code translation (400, 401, 403, 404, 409, 422, 500)
    - Provide troubleshooting hints for common errors
    - Add operation-specific error messages in execute functions
    - Create error translation map for baramundi API error codes
    - Benefits: Clear error explanations, actionable guidance, faster troubleshooting
    - Files: `transport/requestApi.ts`, all `*.execute.ts`, create `utils/errorMessages.ts`
  - [ ] **Add parameter validation** (MEDIUM PRIORITY)
    - Create `utils/validation.ts` with validation utilities
    - Add field-level validation: GUID format, email, MAC address, IP address, string length
    - Add runtime validation in execute functions: validateGuid(), validateGuidList(), validateMaintenanceWindow()
    - Add cross-field validation (e.g., start time before end time)
    - Write comprehensive unit tests for validation logic
    - Benefits: Early error detection, data integrity, fewer failed API calls, better UX
    - Files: Create `utils/validation.ts`, update all `*.fields.ts` and `*.execute.ts` files

- [ ] **Publishing**
  - [ ] Finalize package metadata
  - [ ] Add LICENSE.md file
  - [ ] Create CHANGELOG.md
  - [ ] Make the n8n Collector available to ship via file transfer
  - [ ] Submit to n8n community nodes registry [BLOCKED ]- Only when this allowed by baramundi management

---

**Note**: For completed tasks and implementation history, see [tasks_done.md](./tasks_done.md)

---

## ── SESSION 2026-04-01 ── AUDIT REMEDIATION & ROADMAP ──────────────────────

---

## 🔐 IMMEDIATE — Release v0.4.2 (REQ-RELEASE-1)

**Objective**: Package today's security audit fixes as a clean versioned release.

- [ ] **Bump version to 0.4.2 in `package.json`**
- [ ] **Update `CHANGELOG.md`** with v0.4.2 entry:
  - SECURITY: validateGuid() added to all *Id params in asset.execute.ts (V-1/V-2 — CRITICAL)
  - SECURITY: validateGuid() added to getEndpointMaintenanceWindow / getGroupMaintenanceWindow (V-3 — CRITICAL)
  - SECURITY: validateODataString() added to all SearchQuery/OrderBy params across 12 modules (V-4 — HIGH)
  - SECURITY: Hardcoded fallback credentials removed from test/system/setup.ts (A-1 — MEDIUM)
  - SECURITY: ESLint rule require-guid-validation added; caught 26 additional unvalidated params (MEDIUM)
  - DOCS: SECURITY.md created with vulnerability reporting and dev-dependency risk acceptance (D-4)
  - TEST: Negative GUID test cases added to asset.execute.test.ts (T-3)
  - UX: hint added to all returnAll parameters documenting 5,000-item cap (AP-3)
- [ ] **Run full CI pipeline locally**: `npm run lint && npm run build && npm test`
- [ ] **Rebuild distribution package**: `npm pack`
- [ ] **Git commit + tag**: `git tag v0.4.2`

---

## ⭐ HIGH PRIORITY — V2.0 API Gap Coverage

### H-1 · Active Directory Contextual Navigation (REQ-API-AD-1)

**Target**: 6 missing AD operations → Active Directory reaches 100% spec coverage

- [ ] **H-1.1** `activeDirectory.getADGroupsByADGroup` — `GET /v2.0/ADGroups/{adGroupId}/ADGroups`
  - Add to `activeDirectory.execute.ts`: validateGuid(adGroupId), pagination, OData
  - Add to `activeDirectory.fields.ts`: operation entry + parameters
  - Tests: 2 unit tests (happy path + invalid GUID)

- [ ] **H-1.2** `activeDirectory.getADObjectsByADGroup` — `GET /v2.0/ADGroups/{adGroupId}/ADObjects`
  - Add to execute + fields; validateGuid(adGroupId); pagination + OData

- [ ] **H-1.3** `activeDirectory.getADObjectMemberships` — `GET /v2.0/ADObjects/{id}/ADGroupMemberships`
  - Add to execute + fields; validateGuid(adObjectId); no pagination (list of memberships)

- [ ] **H-1.4** `activeDirectory.getADObjectsByOrgUnit` — `GET /v2.0/OrgUnits/{orgUnitId}/ADObjects`
  - Add to execute + fields; validateGuid(orgUnitId); pagination + OData

- [ ] **H-1.5** `activeDirectory.getADUsersByOrgUnit` — `GET /v2.0/OrgUnits/{orgUnitId}/ADUsers`
  - Add to execute + fields; validateGuid(orgUnitId); pagination + OData

- [ ] **H-1.6** `activeDirectory.getOrgUnitsByOrgUnit` — `GET /v2.0/OrgUnits/{orgUnitId}/OrgUnits`
  - Add to execute + fields; validateGuid(orgUnitId); pagination + OData

- [ ] **H-1.7** Add to `Baramundi.node.ts` router: wire all 6 new operations
- [ ] **H-1.8** Verify: `npm run lint && npm test` — zero errors, ≥ 90% AD coverage

---

### H-2 · Job Folder Navigation & Kiosk Context (REQ-API-JOB-1)

**Target**: 6 missing job read operations

- [ ] **H-2.1** `job.getFolderSubFolders` — `GET /v2.0/Folders/{id}/Folders`
  - validateGuid(folderId); pagination + OData

- [ ] **H-2.2** `job.getJobDefinitionsByFolder` — `GET /v2.0/Folders/{id}/JobDefinitions`
  - validateGuid(folderId); pagination + OData

- [ ] **H-2.3** `job.getKioskReleasesByJobDefinition` — `GET /v2.0/JobDefinitions/{id}/KioskReleases`
  - validateGuid(jobDefinitionId); pagination

- [ ] **H-2.4** `job.getKioskReleasesByEndpoint` — `GET /v2.0/Endpoints/{id}/KioskReleases`
  - validateGuid(endpointId); pagination

- [ ] **H-2.5** `job.getKioskReleasesByLogicalGroup` — `GET /v2.0/LogicalGroups/{id}/KioskReleases`
  - validateGuid(logicalGroupId); pagination

- [ ] **H-2.6** `job.getKioskReleasesByADObject` — `GET /v2.0/ADObjects/{id}/KioskReleases`
  - validateGuid(adObjectId); pagination

- [ ] **H-2.7** Wire all 6 into router; 2 unit tests each; `npm test` clean

---

### H-3 · Job Instances by Group + Job Assignment (REQ-API-JOB-2)

**Target**: 4 group-based job instance queries + 4 job assignment operations

- [ ] **H-3.1** `job.getJobInstancesByLogicalGroup` — `GET /v2.0/LogicalGroups/{id}/JobInstances`
- [ ] **H-3.2** `job.getJobInstancesByStaticGroup` — `GET /v2.0/StaticGroups/{id}/JobInstances`
- [ ] **H-3.3** `job.getJobInstancesByDynamicGroup` — `GET /v2.0/DynamicGroups/{id}/JobInstances`
- [ ] **H-3.4** `job.getJobInstancesByUDG` — `GET /v2.0/UniversalDynamicGroups/{id}/JobInstances`
  - All four: validateGuid on group ID; pagination + OData; 2 unit tests each

- [ ] **H-3.5** `job.assignJobDefinitionToLogicalGroup` — `POST /v2.0/LogicalGroups/{id}/AssignJobDefinition`
- [ ] **H-3.6** `job.assignJobDefinitionToStaticGroup` — `POST /v2.0/StaticGroups/{id}/AssignJobDefinition`
- [ ] **H-3.7** `job.assignJobDefinitionToDynamicGroup` — `POST /v2.0/DynamicGroups/{id}/AssignJobDefinition`
- [ ] **H-3.8** `job.assignJobDefinitionToUDG` — `POST /v2.0/UniversalDynamicGroups/{id}/AssignJobDefinition`
  - All four: validateGuid on group ID; use jobSelection hybrid-dropdown for job ID input; validateGuid on jobDefinitionId; 2 unit tests each

- [ ] **H-3.9** Wire all 8 into router; `npm test` clean

---

### H-4 · Variable Instances by Application and Job Definition (REQ-API-VAR-1)

**Target**: 2 missing variable instance queries → Variables reaches 100%

- [ ] **H-4.1** `variable.getVariableInstancesByWindowsApplication` — `GET /v2.0/WindowsApplications/{id}/VariableInstances`
  - validateGuid(windowsApplicationId); pagination + OData

- [ ] **H-4.2** `variable.getVariableInstancesByWindowsJobDefinition` — `GET /v2.0/WindowsJobDefinitions/{id}/VariableInstances`
  - validateGuid(windowsJobDefinitionId); pagination + OData

- [ ] **H-4.3** Wire into router; 2 unit tests each; `npm test` clean

---

## ⚡ MEDIUM PRIORITY — Platform Endpoints & UX

### M-1 · Platform-Specific Endpoint CRUD (REQ-API-ENDPOINT-1)

**Target**: Create + Update + Enrollment for Android, iOS, Linux, macOS, Network

- [ ] **M-1.1** Implement `endpoint.createAndroidEndpoint` + `endpoint.updateAndroidEndpoint` + `endpoint.startAndroidEnrollment`
  - POST/PATCH `/v2.0/AndroidEndpoints`, POST `/v2.0/AndroidEndpoints/{id}/StartEnrollment`
  - Fields: MDM enrolment type, device name; validateGuid on update/enrollment

- [ ] **M-1.2** Implement `endpoint.createIosEndpoint` + `endpoint.updateIosEndpoint` + `endpoint.startIosEnrollment`
  - POST/PATCH `/v2.0/IosEndpoints`, POST `/v2.0/IosEndpoints/{id}/StartEnrollment`

- [ ] **M-1.3** Implement `endpoint.createLinuxEndpoint` + `endpoint.updateLinuxEndpoint`
  - POST/PATCH `/v2.0/LinuxEndpoints`

- [ ] **M-1.4** Implement `endpoint.createMacEndpoint` + `endpoint.updateMacEndpoint` + `endpoint.startMacEnrollment`
  - POST/PATCH `/v2.0/MacEndpoints`, POST `/v2.0/MacEndpoints/{id}/StartEnrollment`

- [ ] **M-1.5** Implement `endpoint.createNetworkEndpoint` + `endpoint.updateNetworkEndpoint`
  - POST/PATCH `/v2.0/NetworkEndpoints`

- [ ] **M-1.6** Wire all into router; 2 unit tests per platform per operation; `npm test` clean

---

### M-2 · Group-Scoped Endpoint Queries (REQ-API-ENDPOINT-2)

**Target**: 10 "endpoints in group" query operations (generic + Windows)

- [ ] **M-2.1** `endpoint.getEndpointsByLogicalGroup` — `GET /v2.0/LogicalGroups/{id}/Endpoints`
- [ ] **M-2.2** `endpoint.getEndpointsByStaticGroup` — `GET /v2.0/StaticGroups/{id}/Endpoints`
- [ ] **M-2.3** `endpoint.getEndpointsByDynamicGroup` — `GET /v2.0/DynamicGroups/{id}/Endpoints`
- [ ] **M-2.4** `endpoint.getEndpointsByUDG` — `GET /v2.0/UniversalDynamicGroups/{id}/Endpoints`
- [ ] **M-2.5** `endpoint.getEndpointsByADUser` — `GET /v2.0/ADUsers/{id}/Endpoints`
- [ ] **M-2.6** `endpoint.getWindowsEndpointsByLogicalGroup` — `GET /v2.0/LogicalGroups/{id}/WindowsEndpoints`
- [ ] **M-2.7** `endpoint.getWindowsEndpointsByStaticGroup` — `GET /v2.0/StaticGroups/{id}/WindowsEndpoints`
- [ ] **M-2.8** `endpoint.getWindowsEndpointsByDynamicGroup` — `GET /v2.0/DynamicGroups/{id}/WindowsEndpoints`
- [ ] **M-2.9** `endpoint.getWindowsEndpointsByUDG` — `GET /v2.0/UniversalDynamicGroups/{id}/WindowsEndpoints`
- [ ] **M-2.10** `endpoint.getWindowsEndpointsByADUser` — `GET /v2.0/ADUsers/{id}/WindowsEndpoints`
  - All: validateGuid on group/user ID; pagination + OData; 2 unit tests each

- [ ] **M-2.11** Wire all 10 into router; `npm test` clean

---

### M-3 · Bundle Application Management (REQ-API-SOFTWARE-1)

**Target**: 5 missing bundle/application operations → Software reaches 100%

- [ ] **M-3.1** `software.addApplicationToBundle` — `POST /v2.0/Bundles/{id}/BundleApplications`
  - validateGuid(bundleId); request body: application ID + version

- [ ] **M-3.2** `software.replaceApplicationInBundle` — `PATCH /v2.0/Bundles/{bundleId}/BundleApplications/{appId}`
  - validateGuid on both bundleId and appId

- [ ] **M-3.3** `software.getBundleApplications` — `GET /v2.0/BundleApplications`
  - Pagination + OData

- [ ] **M-3.4** `software.deleteBundleApplication` — `DELETE /v2.0/BundleApplications/{id}`
  - validateGuid(bundleApplicationId)

- [ ] **M-3.5** `software.updateBundleFolder` — `PATCH /v2.0/Bundle/Folders/{id}`
  - validateGuid(folderId); JSON Patch body; validateRfc6902Patch

- [ ] **M-3.6** Wire all 5 into router; 2 unit tests each; `npm test` clean

---

### M-4 · resourceLocator for Endpoint and Job Selection (REQ-UX-1)

**Target**: Replace hybrid loadOptions dropdowns with full resourceLocator component

- [ ] **M-4.1** Add `listSearch.searchEndpoints` method to `Baramundi.node.ts`
  - Calls `GET /v2.0/Endpoints?SearchQuery={filter}&PageSize=50`
  - Returns `{ results: [{ name, value }], paginationToken }` format
  - Apply validateODataString on the filter parameter

- [ ] **M-4.2** Add `listSearch.searchJobDefinitions` method to `Baramundi.node.ts`
  - Calls `GET /v2.0/JobDefinitions?SearchQuery={filter}&PageSize=50`
  - Returns name + type info in display label

- [ ] **M-4.3** Update `endpoint.fields.ts`: change `endpointSelection` fields (6 operations) from `options` type to `resourceLocator` with `{ extractValue: true, modes: ['list', 'id'] }`

- [ ] **M-4.4** Update `job.fields.ts`: same change for `jobSelection` fields (6 operations)

- [ ] **M-4.5** Update `endpoint.execute.ts` and `job.execute.ts`: replace manual `__custom__` branch logic with `extractResourceLocatorValue()` (already in `validation.ts`)

- [ ] **M-4.6** Update all affected unit tests; verify no regressions; `npm test` clean

---

### M-5 · Contextual Error Messages (REQ-UX-2)

**Target**: HTTP errors translated to actionable n8n messages

- [ ] **M-5.1** Add `translateHttpError(status: number, context: string): string` helper to `requestApi.ts`
  - Map 400/401/403/404/409/422/500/503 to plain-language messages (see REQ-UX-2 table)

- [ ] **M-5.2** Wrap axios error handling in `apiRequest()` — call `translateHttpError` before throwing `NodeOperationError`

- [ ] **M-5.3** Include operation context in error message: resource type + operation name + ID if available

- [ ] **M-5.4** Write 8 unit tests in `requestApi.test.ts` — one per HTTP status code, asserting correct translated message

- [ ] **M-5.5** `npm run lint && npm test` clean

---

## 📦 LOW PRIORITY — Publishing

### L-1 · Distribution Package (REQ-PUBLISH-1)

- [ ] **L-1.1** Audit `package.json` `files` array — confirm it excludes `test/`, `*.test.ts`, `*.config.*`, `eslint-rules/`, `.github/`
- [ ] **L-1.2** Verify `package.json` metadata: `name`, `version`, `description`, `author`, `license`, `keywords`, `n8n.nodes`, `n8n.credentials`
- [ ] **L-1.3** Run `npm pack --dry-run` — review file list, confirm no test assets or dev configs included
- [ ] **L-1.4** Run `npm pack` — produce `n8n-nodes-baramundi-X.Y.Z.tgz`
- [ ] **L-1.5** Install test: create a temp n8n environment, `npm install <path/to/tgz>`, restart n8n, verify node appears
- [ ] **L-1.6** Update `INSTALLATION.md` with current version number and install command
- [ ] **L-1.7** Place `.tgz` artifact in agreed handoff location

---

### L-2 · n8n Community Registry Submission (REQ-PUBLISH-2) [BLOCKED]

**Blocked by**: baramundi management approval

- [ ] **L-2.1** [BLOCKED] Confirm approval received from management
- [ ] **L-2.2** Verify npm package name `n8n-nodes-baramundi` is available: `npm view n8n-nodes-baramundi`
- [ ] **L-2.3** Add n8n community node badges to `README.md`
- [ ] **L-2.4** Ensure README has n8n node manager install instructions (`Settings → Community Nodes → Install → n8n-nodes-baramundi`)
- [ ] **L-2.5** `npm publish --access public`
- [ ] **L-2.6** Verify install from n8n UI on a test instance
- [ ] **L-2.7** Submit PR to n8n-io/n8n community integration list
