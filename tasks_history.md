# n8n-nodes-baramundi — Historical Task Archive

> **Note**: This file consolidates four retired task files:
> `tasks.md`, `tasks_todo.md`, `tasks_bConnect_Complete.md`, `tasks_done.md`.
> Active phase history is in [Tasks.md](./Tasks.md).

---

## Part 1 — Project Overview (as of 2026-04-01)

### Scope Decision

**bConnect V2.0 API Only** (REQ-SCOPE-1) — supports bMS 25R2 and 26R1. V1.1 API is not supported.

### Final Implementation State

- 13 modules implemented, 100% V2.0 API coverage (251 ops for 25R2, 280 ops for 26R1)
- 550 unit tests passing, 0 lint errors, clean build
- 112 system tests passing against bConnectMock_V2.0, 6 skipped by design
- Full CRUD, pagination, filtering, version-gating (REQ-VERSION-1)

### Key Achievements

- V2.0 API only — clean, no legacy V1.1 complexity (REQ-SCOPE-1)
- Version-gated — 25R2 and 26R1 supported with per-version operation visibility (REQ-VERSION-1)
- More V2.0 operations than reference implementation (+34 operations vs bConnect-MCP at the time of Phase 8)
- System test coverage against bConnectMock_V2.0 (integration tests)
- TDD methodology throughout

---

## Part 2 — Gap Analysis & Phase 8/9 Planning (2026-01-23)

*Original analysis identifying the 91 missing operations that were implemented in Phases 8 and 9.*

### Summary by Priority

**Priority 1: Critical Missing Operations** — 0 (all CRUD already existed)

**Priority 2: High Value Missing Operations** — 28 operations implemented in Phase 8 (2026-03-31)
- Jobs Module: 12 contextual query operations
- Active Directory Module: 6 nested relationship operations
- Assets Module: 8 folder hierarchy operations
- Variables Module: 2 contextual query operations

**Priority 3: Platform-Specific Endpoint Operations** — 63 operations implemented in Phase 9 (2026-04-01)
- Android, iOS, Linux, Mac, Industrial, Network platform-specific CRUD + enrollment + group queries

### Module Status at Analysis Time (2026-01-23) — 25R2 Baseline

| Module | Spec Ops | Implemented | Coverage |
|--------|----------|-------------|----------|
| DefenseControl | 11 | 11 | 100% |
| OperatingSystems | 9 | 9 | 100% |
| ServerManagement | 25 | 25 | 100% |
| Software | 4 | 4 | 100% |
| UpdateManagement | 3 | 3 | 100% |
| Variables | 13 | 13 | 100% |
| Assets | 24 | 24 | 100% |
| Jobs | 34 | 34 | 100% |
| ActiveDirectory | 16 | 16 | 100% |
| Endpoints | 89 | 89 | 100% (pre-Phase 9 typed ops) |

### Phase 8 Task Details

#### Task 2.1 — Jobs Module Contextual Queries (12 operations)
- `GET /v2.0/Folders/{folderId}/Folders` — GetFoldersByFolderId
- `GET /v2.0/Folders/{folderId}/JobDefinitions` — GetJobDefinitionsByFolderId
- `GET /v2.0/JobDefinitions/{jobDefinitionId}/JobInstances` — GetJobInstancesByJobDefinitionId
- `GET /v2.0/Endpoints/{endpointId}/JobInstances` — GetJobInstancesByEndpointId
- `GET /v2.0/LogicalGroups/{logicalGroupId}/JobInstances` — GetJobInstancesByLogicalGroupId
- `GET /v2.0/StaticGroups/{staticGroupId}/JobInstances` — GetJobInstancesByStaticGroupId
- `GET /v2.0/DynamicGroups/{dynamicGroupId}/JobInstances` — GetJobInstancesByDynamicGroupId
- `GET /v2.0/UniversalDynamicGroups/{udg}/JobInstances` — GetJobInstancesByUniversalDynamicGroupId
- `GET /v2.0/ADObjects/{adObjectId}/KioskReleases` — GetKioskReleasesByAdObjectId
- `GET /v2.0/JobDefinitions/{jobDefinitionId}/KioskReleases` — GetKioskReleasesByJobDefinitionId
- `GET /v2.0/Endpoints/{endpointId}/KioskReleases` — GetKioskReleasesByEndpointId
- `GET /v2.0/LogicalGroups/{logicalGroupId}/KioskReleases` — GetKioskReleasesByLogicalGroupId

#### Task 2.2 — Active Directory Nested Relationships (6 operations)
- `GET /v2.0/ADGroups/{adGroupId}/ADGroups`
- `GET /v2.0/ADGroups/{adGroupId}/ADObjects`
- `GET /v2.0/ADObjects/{id}/ADGroupMemberships`
- `GET /v2.0/OrgUnits/{orgUnitId}/ADObjects`
- `GET /v2.0/OrgUnits/{orgUnitId}/ADUsers`
- `GET /v2.0/OrgUnits/{orgUnitId}/OrgUnits`

#### Task 2.3 — Assets Folder Hierarchy (8 operations)
- `GET /v2.0/AssetStock/Folders/{folderId}/Folders`
- `GET /v2.0/AssetTypes/Folders`
- `GET /v2.0/AssetTypes/Folders/{id}`
- `POST /v2.0/AssetTypes/Folders`
- `PATCH /v2.0/AssetTypes/Folders/{id}`
- `DELETE /v2.0/AssetTypes/Folders/{id}`
- `GET /v2.0/AssetTypes/Folders/{folderId}/Folders`

#### Task 2.4 — Variables Contextual Queries (2 operations)
- `GET /v2.0/WindowsJobDefinitions/{id}/VariableInstances`
- `GET /v2.0/WindowsApplications/{id}/VariableInstances`

### Phase 9 Platform-Specific Endpoints (63 operations)

Consolidated into typed operations via `platformType` selector rather than individual resources.
Covers Android, iOS, Linux, Mac, Industrial, Network: Get, GetMany, Create, Update, Delete, StartEnrollment, GetByGroup (LogicalGroup, StaticGroup, UDG, ADUser).

### Comparison with bConnect-MCP (at Phase 8 analysis time)

| Aspect | n8nconnector | bConnect-MCP |
|--------|-------------|--------------|
| Total Operations | 141 (128 V2.0 + 13 V1.1) | 117 (94 V2.0 + 23 V1.1) |
| V2.0 Coverage | 128 ops, 10 modules, 100% | 94 ops, ~75% |
| V1.1 Coverage | 13 ops (3 modules) | 23 ops (6 modules) |
| Unit Tests | 471 passing | 510 passing |
| System Tests | 110 (live API) | 0 |

---

## Part 3 — Iteration Diary (2026-01-20 to 2026-01-22)

*Day-by-day log of initial V1.1 and early V2.0 implementation work.*

---

### 2026-01-22 — BitLocker Secrets V1.1 API ✅

Implemented `bitLockerSecrets.execute.ts` (5 operations, all read-only, security-critical).
All access to cryptographic secrets (recovery passwords, TPM owner passwords, BitLocker PINs).
- 11 unit tests, 8 system test scenarios
- Unit tests: 471 passing (+11)

---

### 2026-01-22 — Compliance Violations V1.1 API ✅

Implemented `complianceViolations.execute.ts` (3 operations: all violations, by CVE ID, by endpoint).
Client-side endpoint filtering (V1.1 has no server-side endpoint filter).
- 6 unit tests, 6 system test scenarios
- Unit tests: 460 passing (+6)

---

### 2026-01-21 — Three Inventory Scan APIs (V1.1, pages 51–53) ✅

Implemented:
- `inventoryDataFileScans.execute.ts` (3 ops: list all, by endpoint, delete by endpoint)
- `inventoryDataWMIScans.execute.ts` (6 ops: by template, by endpoint, by template+endpoint, latest)
- `inventoryDataCustomScans.execute.ts` (6 ops: same pattern as WMI)

URL encoding for template names and timestamps. V1.1 patterns: no pagination, query params, PascalCase.
Unit tests: 318 passing (+23). V1.1 coverage: 60% of pages 1–53.

---

### 2026-01-21 — Hardware Profiles & Boot Environment V1.1 ✅

Implemented:
- `hardwareProfiles.execute.ts` (2 ops: list, get by ID via `?ID=`)
- `bootEnvironment.execute.ts` (2 ops: list, get by ID via `?ID=`)

Discovered V1.1 quirks: no pagination, `?ID={guid}` query params, PascalCase properties, HTTP 400 for unknown params.
Unit tests: 295 passing (+12). System tests: 123 passing (+8).

---

### 2026-01-21 — Test Fixes & Status Update ✅

Fixed orgUnit unit tests for V1.1 API (path `/v1.1/orgunits`, PascalCase props, removed pagination tests).
Marked Variables, Operating Systems, Software, Update Management APIs as COMPLETE.
Total: 276 unit tests passing.

---

### 2026-01-21 — Complete System Test Suite (45 new tests) ✅

System tests for Assets (14), Operating Systems (10), Server Management (21).

Key TDD discoveries:
- Asset types use `guid` property (not `assetTypeId`)
- Stock folders use `id` (not `folderId`)
- Windows Endpoints API doesn't support OrderBy
- Management Server uses `name`/`version`/`state` (not `hostName`)
- Access Rights requires `objectId` — can't test standalone

System tests: 110 total (92 passing, 18 skipped by design).

---

### 2026-01-20 — System Test Infrastructure + 8 APIs (64 tests) ✅

Created `test/system/setup.ts` with `createSystemTestContext()`, credential env vars, cleanup helpers.

System tests for: Software (7), Endpoints (13), Jobs (9), Active Directory (10), Org Units (3), Defense Control (11), Update Management (3), Variables (11).

Critical fix: Org Units V1.1 API path was `/v2.0/orgunits`, corrected to `/v1.1/orgunits`.

---

### 2026-01-20 — Server Management & Defense Control APIs (32 operations) ✅

**Server Management** (21 ops): ManagementServer, Gateway, DIP status, VPN, Microservices (start/stop/restart), CloudConnectors, PxeRelays, SecurityGroups (CRUD), SecurityProfiles, AccessRights, Server restart/cancel.

**Defense Control** (11 ops): BitLocker endpoints, LocalAdminAccounts (get/trigger/patch), MicrosoftDefender threats + endpoints.

Unit tests: 246 total (+38). Total operations: 105.

---

### 2026-01-20 — Assets API Extensions (11 operations) ✅

Asset Types (4 ops: list, get, create, delete), Asset Organization (2 ops: by endpoint, by group), Asset Stock (5 ops: list assets, list/create/update/delete folders).

Unit tests: 208 total (+15). Total operations: 73.

---

### 2026-01-20 — Active Directory API (10 operations) ✅

AD Groups (4), AD Users (2), AD Objects (2), Org Units (2). All read-only (V2.0 AD API is read-only).
Unit tests: 193 total (+20). Total operations: 62.

---

### 2026-01-20 — Jobs API Extension (12 operations) ✅

Job Instances (4: get, stop, resume, delete), Job Folders (5: CRUD), Kiosk Releases (4: CRUD).
Unit tests: 173 total (+31). Total operations: 52.

---

### 2026-01-20 — Groups & Maintenance Windows Discovery ✅

Discovered all group/maintenance operations were already implemented:
LogicalGroups (5), StaticGroups (5), DynamicGroups (2), MaintenanceWindows for endpoints (3) and groups (3).
Total operations: 40.

---

### 2026-01-20 — Fifth Iteration: Jobs, OrgUnits, Assets ✅

Jobs (4 ops), OrgUnits (3 ops), Assets (5 CRUD ops). Unit tests: 142 total.

---

### 2026-01-20 — Fourth Iteration: Start Enrollment ✅

`startEnrollment()` for Windows, Linux, Mac, Android, iOS. Auto-detects endpoint type. 47 unit tests.

---

### 2026-01-20 — Third Iteration: Multi-Platform Endpoint Create ✅

Unified `create()` with endpoint type selector (Windows, Linux, Mac, Android, iOS). 43 unit tests.

---

### 2026-01-20 — Second Iteration: Endpoint CRUD ✅

`create()` Windows, `update()` with JSON Patch. 38 unit tests.

---

### 2026-01-20 — First Iteration: Core Infrastructure ✅

Project scaffolding, credentials (HTTP Basic Auth, SSL bypass), transport layer (`apiRequest`, `apiRequestAllItems` with V2.0 pagination), Endpoints read operations. 28 unit tests.

V2.0 pagination format: `{data: [], hasNextPage, totalItems, currentPage, pageSize, totalPages}`.

---

### 2025-01 — Initial Setup

Basic Job, OrgUnit resources, main node structure. Hardcoded paths, pre-verification.

---

## Appendix — V1.1 API Quirks (documented during 2026-01-20/21 work)

- No pagination support — rejects `PageSize`, `Page`, `SearchQuery`, `OrderBy` params
- Query parameter IDs: `?EndpointID={guid}` not `/{guid}` in path
- Strict param validation: HTTP 400 for unknown parameters
- PascalCase property names: `Id`, `Guid`, `Name` (V2.0 uses camelCase)
- URL pattern: `/v1.1/<ControllerName>` (no module prefix)

## Appendix — Customer Use Cases (backlog ideas)

1. Automated Software Deployment — deploy to new endpoints automatically
2. Compliance Monitoring — daily reports on non-compliant endpoints
3. Endpoint Lifecycle — clean up inactive endpoints after X days
4. Job Monitoring — alert on failed job executions
5. Inventory Sync — sync endpoint data to external CMDB
6. Patch Management — trigger Windows updates on schedule
7. Security Response — isolate endpoints with Defender threats
8. Onboarding Automation — standard software on new endpoints
9. BitLocker Recovery — automated recovery key retrieval (audit logged)
10. Asset Management — hardware lifecycle and warranty tracking
