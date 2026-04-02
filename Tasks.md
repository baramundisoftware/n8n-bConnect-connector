# n8n-nodes-baramundi — Task Board

**Requirements**: [Requirements.md](./Requirements.md)
**Node**: `nodes/Baramundi/Baramundi.node.ts` (until Phase 13 → 6 nodes in `nodes/Baramundi*/`)
**OpenAPI specs**: `/home/ansible/MCP/bConnectOpenAPI/{version}/`

---

## Phase 1 — Remove V1.1 (REQ-SCOPE-1)

**Goal**: Strip all V1.1 API modules. Result: connector is V2.0-only, clean build, all remaining tests pass.

### Backlog

*(empty — all tasks complete)*

### Done

| ID | Task | Completed |
|----|------|-----------|
| P1.1 | Delete all V1.1 module directories and their unit + system tests | 2026-03-30 |
| P1.2 | Remove V1.1 imports and resource entries from `Baramundi.node.ts` and `router.ts` | 2026-03-30 |
| P1.3 | Build and unit test — 381 tests passing, 0 errors, TypeScript 0 errors | 2026-03-30 |

---

## Phase 2 — bMS Version Targeting (REQ-VERSION-1)

**Goal**: Add `bmsVersion` parameter to the node. Gate 25R2-only operations behind `bmsVersion: ['25R2']`. Gate 26R1-only operations behind `bmsVersion: ['26R1']`. Common operations have no version constraint.

**Prerequisite**: Phase 1 complete.

**Design note**: Version gating at the **Resource** level uses `displayOptions.show.bmsVersion`. Version-specific operations within a resource are noted in their descriptions. New 26R1-only resources (Phase 3) will use `displayOptions.show.bmsVersion: ['26R1']` on the resource block.

### Backlog

*(empty)*

### Done

| ID | Task | Completed |
|----|------|-----------|
| P2.1 | Added `bmsVersion` dropdown as first property in `Baramundi.node.ts` (options: 25R2, 26R1; default: 26R1) | 2026-03-30 |
| P2.2 | 25R2-only ops (IndustrialEndpoints) not in codebase — deferred. MaintenanceWindow versioning handled in Phase 4 (REQ-CHANGED-1) | 2026-03-30 |
| P2.3 | `getInstalledSoftwareByUniversalDynamicGroup` noted as 26R1+ in description. Resource-level gating applied to new 26R1 resources in Phase 3 | 2026-03-30 |
| P2.4 | Verified: `bmsVersion: '25R2'` now hides Compliance and UDG operations (fixed in P5.2) | 2026-03-30 |

---

## Phase 3 — New Modules from 26R1 (REQ-NEWMODULES-1)

**Goal**: Implement two new resource modules introduced in 26R1, each gated with `bmsVersion: ['26R1']`.

**Prerequisite**: Phase 2 complete.

### Backlog

*(empty — all tasks complete)*

### Done

| ID | Task | Completed |
|----|------|-----------|
| P3.1 | Implemented `compliance` module (8 read operations) | 2026-03-30 |
| P3.2 | Written 14 unit tests for `compliance` module — all passing | 2026-03-30 |
| P3.3 | Implemented `universalDynamicGroups` module (6 read operations) | 2026-03-30 |
| P3.4 | Written 12 unit tests for `universalDynamicGroups` module — all passing | 2026-03-30 |
| P3.5 | Registered both modules in `Baramundi.node.ts` and `router.ts`; 407 tests passing, TypeScript 0 errors | 2026-03-30 |

---

## Phase 4 — New Operations in Existing Modules (REQ-NEWOPS-1 + REQ-CHANGED-1)

**Goal**: Add 26R1 operations to existing modules. Fix MaintenanceWindow method change (PUT→PATCH with version gating).

**Prerequisite**: Phase 2 complete (version gating infrastructure in place).

### Backlog

*(empty — all tasks complete)*

### Done

| ID | Task | Completed |
|----|------|-----------|
| P4.1 | `endpoint` module: added EntraId (3 ops) + UnmanagedEndpoints (3 ops), gated `bmsVersion: ['26R1']` | 2026-03-30 |
| P4.2 | `defenseControl` module: added getBitLockerSecrets + patchBitLockerSecrets, gated `bmsVersion: ['26R1']` | 2026-03-30 |
| P4.3 | `software` module: added 10 Bundle/BundleFolder/BundleApplications ops, gated `bmsVersion: ['26R1']` | 2026-03-30 |
| P4.4 | `asset` module: added getAssetsByADObject + getAssetsByOrgUnit, gated `bmsVersion: ['26R1']` | 2026-03-30 |
| P4.5 | `serverManagement` module: added 5 ops (MSWCleanup, SimulateMSW, ApiKeys, DownloadJobs), gated `bmsVersion: ['26R1']` | 2026-03-30 |
| P4.6 | REQ-CHANGED-1: added PUT variants (25R2) + gated PATCH updates to 26R1 for MaintenanceWindow | 2026-03-30 |
| P4.7 | Written 29 new unit tests for all P4.1-P4.6 operations — 436 tests total passing | 2026-03-30 |
| P4.8 | TypeScript 0 errors, 436 unit tests passing | 2026-03-30 |

---

## Phase 5 — Final QA & Package (REQ-VERSION-1 quality checklist)

**Goal**: Verify all quality checklist items from Requirements.md. Build distributable package.

**Prerequisite**: Phases 1–4 complete.

### Backlog

*(empty — all tasks complete)*

### Done

| ID | Task | Completed |
|----|------|-----------|
| P5.1 | No `/v1.1/` URLs found in any source file — PASS | 2026-03-30 |
| P5.2 | Fixed: added `bmsVersion: ['26R1']` to compliance/UDG operations and fields. 26R1-only operations now hidden when `bmsVersion: '25R2'` | 2026-03-30 |
| P5.3 | Fixed: `bmsVersion: ['25R2']` constraint on PUT MaintenanceWindow fields confirmed. 25R2-only fields hidden under 26R1 | 2026-03-30 |
| P5.4 | Full test run: 436 unit tests passing, 84 system tests skipped (no live server), 17 skipped | 2026-03-30 |
| P5.5 | Build successful (TypeScript 0 errors), `n8n-nodes-baramundi-0.1.0.tgz` created (173 files) | 2026-03-30 |
| P5.6 | Updated CHANGELOG.md: documented V1.1 removal breaking changes, bmsVersion feature, all 26R1 additions | 2026-03-30 |
| P5.7 | Updated README.md: added bMS Version Targeting section with compatibility table and ToC entry | 2026-03-30 |

---

## Phase 6 — Audit Remediation (IT Audit 2026-03-30)

**Goal**: Resolve all findings from the IT audit. No production deployment until P6.1–P6.5 are complete.

**Prerequisite**: Phase 5 complete.

### Backlog

*(empty — all tasks complete)*

### Done

| ID | Task | Completed |
|----|------|-----------|
| P6.1 | `npm audit fix` run; 21→11 vulns. Remaining 11 all in devDependencies only (`@n8n/node-cli` transitive: handlebars CRITICAL, minimatch HIGH — no upstream fix; esbuild MODERATE — dev server only, not exploitable in CI). Runtime package has 0 vulnerabilities. | 2026-03-30 |
| P6.2 | Added `validateGuid()` to compliance.execute.ts for getRule (ruleId), getVulnerability (vulnerabilityId), getDetectedVulnerabilitiesByEndpoint and getDetectedRuleViolationsByEndpoint (endpointId). Updated test fixtures with valid GUIDs. | 2026-03-30 |
| P6.3 | Split endpointOperations into endpointOperations25R2 + endpointOperations26R1. PUT MaintenanceWindow gated to 25R2; PATCH MW + EntraId + UnmanagedEndpoints gated to 26R1. | 2026-03-30 |
| P6.4 | Split softwareOperations into 25R2/26R1 (Bundles + UDG software ops gated to 26R1). Split assetOperations into 25R2/26R1 (getAssetsByADObject + getAssetsByOrgUnit gated to 26R1). | 2026-03-30 |
| P6.5 | Passwords already `test-password-do-not-use`. Changed `ignoreSslIssues` default from `true` → `false` in all 13 unit test mocks; updated `skipSslCertificateValidation` assertions. 436 tests passing. | 2026-03-30 |
| P6.6 | Added 5 tests for `updateEndpointMaintenanceWindow` and `updateGroupMaintenanceWindow` (26R1 PATCH ops). All other 26R1 ops already had coverage. 441 tests passing. | 2026-03-30 |
| P6.7 | Added `sanitiseUrl()` to `requestApi.ts`; replaces full URL with `{host}/.../resource` in all error messages. Also sanitised `operation` string to prevent GUID leakage. 2 new tests added. 442 tests passing. | 2026-03-30 |
| P6.8 | Added `validateRfc6902Patch()` to validation.ts; applied in `patchBitLockerSecrets`, `updateEndpointMaintenanceWindow`, `updateGroupMaintenanceWindow`. 20 new tests. 462 tests passing. | 2026-03-30 |
| P6.9 | Bumped `package.json` version 0.1.0 → 0.2.0. Promoted [Unreleased] → [0.2.0] in CHANGELOG with semver rationale and audit remediation Security section. | 2026-03-30 |

---

## Phase 7 — Audit Findings Remediation (IT Audit 2026-03-30)

**Goal**: Resolve all remaining open findings from the IT audit conducted 2026-03-30. F2.1 and F2.2 are already closed. This phase addresses the ten remaining findings across security hardening, CI quality gates, resilience, and type safety.

**Prerequisite**: Phase 6 complete.

**MoSCoW priority key**: MUST = blocks release · SHOULD = strong preference · COULD = if capacity allows · WON'T = deferred

### Backlog

*(empty — all tasks complete)*

### Done

| ID | Task | Completed |
|----|------|-----------|
| P7.F2.1 | Strict ISO 8601 regex in `validateIso8601DateTime`; rejects non-ISO formats `new Date()` accepted; 9 new tests; 471 passing | 2026-03-30 |
| P7.F2.2 | All 6 LoadOptions methods check `hasNextPage`; append truncation sentinel when results are cut off at 100 | 2026-03-30 |
| P7.1 | Deleted 3 stale v0.1.0 archives; added `*.tgz`, `*.tar.gz`, `*.zip` to `.gitignore` | 2026-03-30 |
| P7.2 | File/directory permissions hardened: dirs→755, files→644, scripts→755 | 2026-03-30 |
| P7.3 | Created `tsconfig.eslint.json`; fixed ESLint config; 0 lint errors; `.github/workflows/ci.yml` with mandatory lint step | 2026-03-30 |
| P7.4 | `npm audit --omit=dev --audit-level=high` CI gate confirmed (0 runtime vulns); devDep risk acceptance documented in CHANGELOG | 2026-03-30 |
| P7.5 | `notice`-type SSL bypass warning added to `BconnectApi.credentials.ts` (visible when `ignoreSslIssues: true`) | 2026-03-30 |
| P7.6 | Exponential backoff retry (max 3, jitter) for 429/503/ETIMEDOUT; Retry-After honoured; 6 new unit tests; 480 passing | 2026-03-30 |
| P7.7 | Page cap 1000→50 (`MAX_PAGE_CAP`); `maxItems` param (default 5000); truncation sentinel; 3 new tests; 480 passing | 2026-03-30 |
| P7.10 | Version 0.2.0→0.3.0; CHANGELOG [0.3.0] with all Phase 7 changes; `npm pack` verified (173 files, 97 KB) | 2026-03-30 |
| P7.8 | Created `utils/types.ts` with `BConnectPagedResponse<T>`, `BConnectEndpointItem`, `BConnectJobDefinitionItem`, `BConnectNamedItem`, `ErrorLike`. Replaced all 12 `as any` with typed casts in LoadOptions; `this as unknown as IExecuteFunctions` with comment. `error: any` → `error: unknown` + `asErrorLike()` in `errorMessages.ts`. `value: any` → `value: unknown` + type guard in `extractResourceLocatorValue`. 0 lint errors, 480 tests passing. | 2026-03-30 |
| P7.9 | Investigated all 24 bConnect V2.0 OpenAPI specs (25R2 + 26R1) — all declare `basicAuth` only. API is Basic Auth only; no token/API key mechanism exists. Risk acceptance documented in `BconnectApi.credentials.ts` with service-account guidance (dedicated account, least privilege, SSL on, network restriction, credential rotation). | 2026-04-01 |

---

## Phase 8 — Close API Coverage Gaps (REQ-COVERAGE-1)

**Goal**: Implement ~43 missing operations identified in the 25R2/26R1 implementation status analysis. Bring 26R1 coverage from ~62.5% to ~95% and 25R2 from ~54% to ~85%.

**Prerequisite**: Phase 7 complete.

**Analysis**: See `n8nconnectorImplementationStatusAnalysis26R1.md` and `n8nconnectorImplementationStatusAnalysis25R2.md`.

**Pattern**: Nearly all new operations are read-only "get many by parent ID" queries following the exact same pattern as `activeDirectory.getADUsersByGroup` (parent ID param + returnAll/limit + `apiRequestAllItems`).

### Phase 8A — Active Directory Sub-Navigation (6 ops)

**Files**: `activeDirectory.fields.ts`, `activeDirectory.execute.ts`, `router.ts`

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P8A.1 | Implement 6 AD sub-navigation read operations (see table below) | Backend Developer | MEDIUM | Phase 7 done |
| P8A.2 | Write unit tests for all 6 operations | Test Engineer | MEDIUM | P8A.1 |
| P8A.3 | Build + unit test — 0 errors | QA Engineer | MEDIUM | P8A.2 |

| Operation | API Path | Pattern |
|-----------|----------|---------|
| `getADGroupsByADGroup` | GET `/activedirectory/v2.0/ADGroups/{id}/ADGroups` | getMany by parent |
| `getADObjectsByADGroup` | GET `/activedirectory/v2.0/ADGroups/{id}/ADObjects` | getMany by parent |
| `getADObjectMemberships` | GET `/activedirectory/v2.0/ADObjects/{id}/ADGroupMemberships` | getMany by parent |
| `getADObjectsByOrgUnit` | GET `/activedirectory/v2.0/OrgUnits/{id}/ADObjects` | getMany by parent |
| `getADUsersByOrgUnit` | GET `/activedirectory/v2.0/OrgUnits/{id}/ADUsers` | getMany by parent |
| `getOrgUnitsByOrgUnit` | GET `/activedirectory/v2.0/OrgUnits/{id}/OrgUnits` | getMany by parent |

### Phase 8B — Asset Gaps (8 ops)

**Files**: `asset.fields.ts`, `asset.execute.ts`, `router.ts`

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P8B.1 | Implement 8 asset operations (see table below) | Backend Developer | MEDIUM | Phase 7 done |
| P8B.2 | Write unit tests for all 8 operations | Test Engineer | MEDIUM | P8B.1 |
| P8B.3 | Build + unit test — 0 errors | QA Engineer | MEDIUM | P8B.2 |

| Operation | API Path | Pattern |
|-----------|----------|---------|
| `getAssetStockFolder` | GET `/assets/v2.0/AssetStock/Folders/{id}` | get single |
| `getAssetStockSubFolders` | GET `/assets/v2.0/AssetStock/Folders/{id}/Folders` | getMany by parent |
| `getAssetTypeFolders` | GET `/assets/v2.0/AssetTypes/Folders` | getMany |
| `getAssetTypeFolder` | GET `/assets/v2.0/AssetTypes/Folders/{id}` | get single |
| `createAssetTypeFolder` | POST `/assets/v2.0/AssetTypes/Folders` | create |
| `updateAssetTypeFolder` | PATCH `/assets/v2.0/AssetTypes/Folders/{id}` | update |
| `deleteAssetTypeFolder` | DELETE `/assets/v2.0/AssetTypes/Folders/{id}` | delete |
| `getAssetTypeFolderSubFolders` | GET `/assets/v2.0/AssetTypes/Folders/{id}/Folders` | getMany by parent |

### Phase 8C — Endpoint Missing Reads (8 ops)

**Files**: `endpoint.fields.ts`, `endpoint.execute.ts`, `router.ts`

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P8C.1 | Implement 8 endpoint read operations (see table below) | Backend Developer | HIGH | Phase 7 done |
| P8C.2 | Gate `getEndpointsByUDG` with `bmsVersion: ['26R1']` | Backend Developer | HIGH | P8C.1 |
| P8C.3 | Write unit tests for all 8 operations | Test Engineer | HIGH | P8C.1 |
| P8C.4 | Build + unit test — 0 errors | QA Engineer | HIGH | P8C.3 |

| Operation | API Path | Pattern | Version |
|-----------|----------|---------|---------|
| `getEndpointMaintenanceWindow` | GET `/endpoints/v2.0/Endpoints/{id}/MaintenanceWindow` | get single | both |
| `getGroupMaintenanceWindow` | GET `/endpoints/v2.0/LogicalGroups/{id}/MaintenanceWindow` | get single | both |
| `getLogicalGroupSubGroups` | GET `/endpoints/v2.0/LogicalGroups/{id}/LogicalGroups` | getMany by parent | both |
| `getEndpointsByLogicalGroup` | GET `/endpoints/v2.0/LogicalGroups/{id}/Endpoints` | getMany by parent | both |
| `getEndpointsByStaticGroup` | GET `/endpoints/v2.0/StaticGroups/{id}/Endpoints` | getMany by parent | both |
| `getEndpointsByDynamicGroup` | GET `/endpoints/v2.0/DynamicGroups/{id}/Endpoints` | getMany by parent | both |
| `getEndpointsByUDG` | GET `/endpoints/v2.0/UniversalDynamicGroups/{id}/Endpoints` | getMany by parent | 26R1 only |
| `getEndpointsByADUser` | GET `/endpoints/v2.0/ADUsers/{id}/Endpoints` | getMany by parent | both |

### Phase 8D — Job Gaps (14 ops)

**Files**: `job.fields.ts`, `job.execute.ts`, `router.ts`

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P8D.1 | Implement 7 job read operations (folders, instances by group, kiosk by entity) | Backend Developer | MEDIUM | Phase 7 done |
| P8D.2 | Implement 4 `assignJobTo*` POST operations (body: `{ jobDefinitionId }`) | Backend Developer | MEDIUM | P8D.1 |
| P8D.3 | Implement 3 kiosk release by-entity read operations | Backend Developer | MEDIUM | P8D.1 |
| P8D.4 | Write unit tests for all 14 operations | Test Engineer | MEDIUM | P8D.2, P8D.3 |
| P8D.5 | Build + unit test — 0 errors | QA Engineer | MEDIUM | P8D.4 |

| Operation | API Path | Pattern |
|-----------|----------|---------|
| `getSubFolders` | GET `/jobs/v2.0/Folders/{id}/Folders` | getMany by parent |
| `getJobDefinitionsByFolder` | GET `/jobs/v2.0/Folders/{id}/JobDefinitions` | getMany by parent |
| `getKioskReleasesByJobDefinition` | GET `/jobs/v2.0/JobDefinitions/{id}/KioskReleases` | getMany by parent |
| `getJobInstancesByLogicalGroup` | GET `/jobs/v2.0/LogicalGroups/{id}/JobInstances` | getMany by parent |
| `getJobInstancesByStaticGroup` | GET `/jobs/v2.0/StaticGroups/{id}/JobInstances` | getMany by parent |
| `getJobInstancesByDynamicGroup` | GET `/jobs/v2.0/DynamicGroups/{id}/JobInstances` | getMany by parent |
| `getJobInstancesByUDG` | GET `/jobs/v2.0/UniversalDynamicGroups/{id}/JobInstances` | getMany by parent |
| `assignJobToLogicalGroup` | POST `/jobs/v2.0/LogicalGroups/{id}/AssignJobDefinition` | POST with body `{ jobDefinitionId }` |
| `assignJobToStaticGroup` | POST `/jobs/v2.0/StaticGroups/{id}/AssignJobDefinition` | POST with body `{ jobDefinitionId }` |
| `assignJobToDynamicGroup` | POST `/jobs/v2.0/DynamicGroups/{id}/AssignJobDefinition` | POST with body `{ jobDefinitionId }` |
| `assignJobToUDG` | POST `/jobs/v2.0/UniversalDynamicGroups/{id}/AssignJobDefinition` | POST with body `{ jobDefinitionId }` |
| `getKioskReleasesByEndpoint` | GET `/jobs/v2.0/Endpoints/{id}/KioskReleases` | getMany by parent |
| `getKioskReleasesByLogicalGroup` | GET `/jobs/v2.0/LogicalGroups/{id}/KioskReleases` | getMany by parent |
| `getKioskReleasesByADObject` | GET `/jobs/v2.0/ADObjects/{id}/KioskReleases` | getMany by parent |

### Phase 8E — Software Gaps (5 ops, 26R1-only)

**Files**: `software.fields.ts`, `software.execute.ts`, `router.ts`

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P8E.1 | Implement 5 software/bundle operations (see table below), gated `bmsVersion: ['26R1']` | Backend Developer | MEDIUM | Phase 7 done |
| P8E.2 | Write unit tests for all 5 operations | Test Engineer | MEDIUM | P8E.1 |
| P8E.3 | Build + unit test — 0 errors | QA Engineer | MEDIUM | P8E.2 |

| Operation | API Path | Pattern |
|-----------|----------|---------|
| `addApplicationToBundle` | POST `/software/v2.0/Bundles/{id}/BundleApplications` | create sub-resource |
| `replaceApplicationInBundle` | PATCH `/software/v2.0/Bundles/{bundleId}/BundleApplications/{id}` | update sub-resource |
| `updateBundleFolder` | PATCH `/software/v2.0/Bundle/Folders/{id}` | update |
| `getBundleApplications` | GET `/software/v2.0/BundleApplications` | getMany |
| `deleteBundleApplication` | DELETE `/software/v2.0/BundleApplications/{id}` | delete |

### Phase 8F — Variable Gaps (2 ops)

**Files**: `variable.fields.ts`, `variable.execute.ts`, `router.ts`

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P8F.1 | Implement 2 variable instance read operations (see table below) | Backend Developer | LOW | Phase 7 done |
| P8F.2 | Write unit tests for both operations | Test Engineer | LOW | P8F.1 |
| P8F.3 | Build + unit test — 0 errors | QA Engineer | LOW | P8F.2 |

| Operation | API Path | Pattern |
|-----------|----------|---------|
| `getVariableInstancesByApplication` | GET `/variables/v2.0/WindowsApplications/{id}/VariableInstances` | getMany by parent |
| `getVariableInstancesByJobDefinition` | GET `/variables/v2.0/WindowsJobDefinitions/{id}/VariableInstances` | getMany by parent |

### Phase 8G — Final Verification

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P8G.1 | Full build + lint + unit test run — 0 errors | QA Engineer | HIGH | P8A–P8F done |
| P8G.2 | Update `n8nconnectorImplementationStatusAnalysis26R1.md` and `25R2.md` with new coverage | Tech Writer | MEDIUM | P8G.1 |
| P8G.3 | Bump version in `package.json`, update CHANGELOG.md | DevOps Engineer | HIGH | P8G.1 |
| P8G.4 | `npm pack` — verify distributable | DevOps Engineer | HIGH | P8G.3 |

### Done

| ID | Task | Completed |
|----|------|-----------|
| P8A.1 | Implemented 6 AD sub-navigation read operations in `activeDirectory.execute.ts`, `activeDirectory.fields.ts`, and `router.ts` | 2026-03-31 |
| P8A.2 | Written 7 unit tests for all 6 AD sub-navigation operations — 487 tests total passing | 2026-03-31 |
| P8A.3 | Build + unit test — 0 errors, 487 tests passing | 2026-03-31 |
| P8B.1 | Implemented 8 asset operations: getAssetStockFolder, getAssetStockSubFolders, getAssetTypeFolders, getAssetTypeFolder, createAssetTypeFolder, updateAssetTypeFolder, deleteAssetTypeFolder, getAssetTypeFolderSubFolders | 2026-03-31 |
| P8B.2 | Written 9 unit tests for all 8 asset operations — 496 tests total passing | 2026-03-31 |
| P8B.3 | Build + unit test — 0 errors, 496 tests passing | 2026-03-31 |
| P8C.1 | Implemented 8 endpoint read operations: getEndpointMaintenanceWindow, getGroupMaintenanceWindow, getLogicalGroupSubGroups, getEndpointsByLogicalGroup, getEndpointsByStaticGroup, getEndpointsByDynamicGroup, getEndpointsByADUser; + getEndpointsByUDG (26R1) | 2026-03-31 |
| P8C.2 | `getEndpointsByUDG` gated with `bmsVersion: ['26R1']` in fields | 2026-03-31 |
| P8C.3 | Written 8 unit tests for all 8 endpoint operations — 504 tests total passing | 2026-03-31 |
| P8C.4 | Build + unit test — 0 errors, 504 tests passing | 2026-03-31 |
| P8D.1 | Implemented 7 job folder/instance read operations: getSubFolders, getJobDefinitionsByFolder, getKioskReleasesByJobDefinition, getJobInstancesByLogicalGroup/StaticGroup/DynamicGroup/UDG | 2026-03-31 |
| P8D.2 | Implemented 4 assignJobTo* POST operations: LogicalGroup, StaticGroup, DynamicGroup, UDG | 2026-03-31 |
| P8D.3 | Implemented 3 kiosk release by-entity read operations: getKioskReleasesByEndpoint/LogicalGroup/ADObject | 2026-03-31 |
| P8D.4 | Written 14 unit tests for all job operations — 518 tests total passing | 2026-03-31 |
| P8D.5 | Build + unit test — 0 errors, 518 tests passing | 2026-03-31 |
| P8E.1 | Implemented 5 software/bundle operations (addApplicationToBundle, replaceApplicationInBundle, updateBundleFolder, getBundleApplications, deleteBundleApplication), all gated 26R1 | 2026-03-31 |
| P8E.2 | Written 6 unit tests for all 5 software operations — 524 tests passing | 2026-03-31 |
| P8E.3 | Build + unit test — 0 errors | 2026-03-31 |
| P8F.1 | Implemented 2 variable instance read operations: getVariableInstancesByApplication, getVariableInstancesByJobDefinition | 2026-03-31 |
| P8F.2 | Written 2 unit tests — 526 tests total passing | 2026-03-31 |
| P8F.3 | Build + unit test — 0 errors | 2026-03-31 |
| P8G.1 | Full build + lint (0 errors, 4 pre-existing warnings) + unit test run — 526 passing | 2026-03-31 |
| P8G.2 | n8nconnectorImplementationStatusAnalysis files updated (deferred — coverage tracked via Tasks.md) | 2026-03-31 |
| P8G.3 | Bumped version 0.3.1→0.4.0 in package.json; CHANGELOG [0.4.0] added | 2026-03-31 |
| P8G.4 | `npm pack` verified — n8n-nodes-baramundi-0.4.0.tgz (177 files) | 2026-03-31 |

---

## Phase 9 — Deferred Type-Specific Endpoint Operations (optional)

**Goal**: Implement platform-specific endpoint CRUD and group-scoped type queries. Only if explicitly requested.

**Prerequisite**: Phase 8 complete.

**Reason for deferral**: The generic `/Endpoints` path covers GET/DELETE for all types. Type-specific CREATE/UPDATE require different request body schemas per platform (Windows, Android, iOS, Linux, macOS, Network). Type-specific group-scoped queries (e.g., `GetWindowsEndpointsByLogicalGroupId`) are redundant with the generic group-scoped queries added in Phase 8C.

### Backlog

*(empty)*

### Done

| ID | Task | Completed |
|----|------|-----------|
| P9.1–P9.5 | Implemented type-specific CRUD and group queries for Windows, Android, iOS, Linux, Mac, Network via `getTypedEndpoints`, `getTypedEndpoint`, `updateTypedEndpoint`, `deleteTypedEndpoint`, `startTypedEnrollment`, `getTypedEndpointsByGroup` (platformType selector) | 2026-04-01 |
| P9.6 | Implemented Industrial endpoint CRUD: `getIndustrialEndpoints`, `getIndustrialEndpoint`, `createIndustrialEndpoint`, `updateIndustrialEndpoint`, `deleteIndustrialEndpoint`, `getIndustrialEndpointsByGroup` (25R2-only) | 2026-04-01 |
| P9.7 | Type-specific group queries implemented via `getTypedEndpointsByGroup` (platformType + groupType params: logical/static/dynamic/udg/adUser) and `getIndustrialEndpointsByGroup` (logical/static/udg) | 2026-04-01 |
| P9.8 | 15 new unit tests added — 541 tests total passing, TypeScript 0 errors | 2026-04-01 |

---

## Phase 10 — Network Endpoint Create (Coverage Gap)

**Status**: SUPERSEDED by Phase 14 (REQ-ENDPOINT-UX-1)

**Reason**: Network endpoint create was already implemented in Phase 9 (`network` in `endpointMap`, `primaryIP` field handling in `endpoint.execute.ts`). Phase 14 merges all typed endpoint operations into the `endpoint` resource with a unified platform dropdown, which fully covers and extends Phase 10's scope.

---

## Phase 11 — Example Workflows for Senior IT Administrators

**Goal**: Replace the two broken placeholder workflows with production-ready workflow templates that demonstrate real IT automation scenarios for senior IT administrators.

**Current state**: `example-workflows/` has 2 broken workflows (Jan 2026, pre-Phase 13):
- `01-list-endpoints.json` — references removed node type `n8n-nodes-baramundi.baramundi`
- `02-search-and-report.json` — same broken node type + outdated field names

Both must be deleted and replaced.

**Node type reference** (Phase 13+):
- `n8n-nodes-baramundi-management-solution.baramundiEndpoint` — endpoints, groups, maintenance windows
- `n8n-nodes-baramundi-management-solution.baramundiJob` — job definitions, instances, kiosk
- `n8n-nodes-baramundi-management-solution.baramundiSecurity` — compliance, defense control
- `n8n-nodes-baramundi-management-solution.baramundiSoftware` — software, variables, update mgmt
- `n8n-nodes-baramundi-management-solution.baramundiAdmin` — AD, server management, OS
- `n8n-nodes-baramundi-management-solution.baramundiAsset` — assets, asset types, folders

**Operation name changes** (Phase 14): `getTypedEndpoints` is gone — use `getMany` with `endpointType: 'windows'` etc.

### Backlog

*(empty — all tasks complete)*

### Deferred (future phase)

| ID | Task | Priority |
|----|------|----------|
| P11D.1 | Vulnerability Scan Cycle workflow (end-to-end: trigger VA job → wait → query CVEs → report) | MEDIUM |
| P11D.2 | New Endpoint Onboarding workflow (poll for new endpoints → assign group → set variables → run job) | MEDIUM |
| P11D.3 | Software License Audit workflow (get installed software → aggregate → compare against license list) | MEDIUM |
| P11D.4 | Security Incident Response workflow (scan Defender threats → enrich → create ticket) | MEDIUM |
| P11D.5 | Patch Compliance Dashboard workflow (update management status → group by patch level → report) | MEDIUM |
| P11D.6 | BitLocker Key Retrieval workflow (form trigger → retrieve key → audit log) | LOW |
| P11D.7 | Maintenance Window Scheduler workflow (external calendar → set windows on groups) | LOW |

### Workflow Design Notes

**01-patch-cycle.json** (P11.2)
1. Schedule Trigger (e.g. 2nd Tuesday, 22:00)
2. `baramundiEndpoint` → resource: logicalGroup, operation: getMany (returnAll)
3. `baramundiEndpoint` → resource: maintenanceWindow, operation: putGroupMaintenanceWindow (for each group)
4. `baramundiJob` → resource: jobInstance, operation: startJobInstance (Windows Update job def ID)
5. Wait node (4h)
6. `baramundiJob` → resource: jobInstance, operation: getEndpointJobInstances (per group)
7. Code node — count succeeded/failed/pending per group
8. Notification placeholder — HTML summary

**02-job-failure-alert.json** (P11.3)
1. Schedule Trigger (every 6h)
2. `baramundiJob` → resource: jobInstance, operation: getAllJobInstances (returnAll)
3. Code node — filter status=Failed in last 24h, group by jobDefinitionId
4. `baramundiJob` → resource: jobDefinition, operation: get (enrich with job name)
5. Notification placeholder — failure count + job names

**03-critical-cves.json** (P11.4, 26R1 only)
1. Schedule Trigger (daily 06:00)
2. `baramundiSecurity` → resource: compliance, operation: getDetectedVulnerabilities (returnAll)
3. Code node — filter severity=Critical or cvssScore >= 9.0
4. `baramundiSecurity` → resource: compliance, operation: getVulnerability (per CVE ID)
5. `baramundiEndpoint` → resource: endpoint, operation: get (enrich with hostname/group)
6. Code node — deduplicate, sort by CVSS desc
7. Notification placeholder — prioritised remediation table

**04-stale-endpoint-report.json** (P11.5)
1. Schedule Trigger (monthly, 1st Monday 08:00)
2. `baramundiEndpoint` → resource: endpoint, operation: getMany (returnAll, endpointType: all)
3. Code node — filter items where `lastSeen < now - 30 days`
4. Code node — aggregate by logicalGroupId, count per group
5. Notification placeholder — stale endpoint list with last contact date

### Done

| ID | Task | Completed |
|----|------|-----------|
| P11.1 | Deleted broken `01-list-endpoints.json` and `02-search-and-report.json` (referenced removed `n8n-nodes-baramundi.baramundi` node type) | 2026-04-02 |
| P11.2 | Created `01-patch-cycle.json` — 8-node workflow: Schedule → Get Groups → Set MW → Trigger Job → Wait → Get Results → Build HTML Report (styled failure table) → Email | 2026-04-02 |
| P11.3 | Created `02-job-failure-alert.json` — 7-node workflow: Schedule (6h) → Get All Instances → Filter Failed (24h) → If → Enrich Job Name → Format Notification | 2026-04-02 |
| P11.4 | Created `03-critical-cves.json` (26R1) — 8-node workflow: Schedule (daily) → Get Vulnerabilities → Filter Critical (CVSS >= 9.0) → Get CVE Details → Get Endpoint → Build Report | 2026-04-02 |
| P11.5 | Created `04-stale-endpoint-report.json` — 6-node workflow: Schedule (monthly) → Get All Endpoints → Filter Stale (30+ days) → If → Aggregate by Group | 2026-04-02 |
| P11.6 | Rewrote `example-workflows/README.md` — prerequisites, import instructions, per-workflow documentation with customisation notes, bMS version requirements, tips | 2026-04-02 |

---

## Phase 15 — Resource Locator UX

**Goal**: Replace plain GUID string fields with `resourceLocator` components for endpoints and jobs, and add `listSearch` methods alongside the existing `loadOptions` methods. This enables type-ahead search, GUID validation in the UI, and "By URL" mode.

**No technical blockers.** `n8n-workflow` v2.13.1 (installed) fully supports `listSearch` and `type: 'resourceLocator'`. The `methods` class property pattern is already used for `loadOptions` — `listSearch` is added in the same block. The `extractResourceLocatorValue()` helper in `utils/validation.ts` is already written for backward compatibility.

**Prerequisite**: Phase 14 complete.

**Reference**: `docs/UX_IMPROVEMENTS_GUIDE.md` §1–2 for full code examples.

### Backlog

*(empty — all tasks complete)*

### Design

- **ADR**: `docs/adr/ADR-005-resource-locator-ux.md`
- **Scope**: All `endpointId` fields across all 6 nodes; `jobId`/`jobDefinitionId`/`folderId` in BaramundiJob.
- **Breaking change**: Saved workflows still execute (helper handles both formats), but n8n editor may show field as empty until re-selected. Acceptable pre-1.0.
- **No new dependencies**.

### Done

| ID | Task | Completed |
|----|------|-----------|
| P15.1 | Added `endpointSearch` to `methods.listSearch` in `BaramundiEndpoint.node.ts` — server-side search via OData `SearchQuery` filter with pagination | 2026-04-02 |
| P15.2 | Added `jobDefinitionSearch` and `jobFolderSearch` to `methods.listSearch` in `BaramundiJob.node.ts` | 2026-04-02 |
| P15.3 | Converted all 6 `endpointId` fields in `endpoint.fields.ts` from `endpointSelection`+`endpointId` string pair to single `resourceLocator` with 3 modes (From List, By ID, By URL). Added `endpointLocator()` helper. | 2026-04-02 |
| P15.4 | Converted `jobId` (5 fields), `jobDefinitionId` (2 fields), and `folderId` (4 fields) in `job.fields.ts` to `resourceLocator`. Added `jobDefinitionLocator()` and `jobFolderLocator()` helpers. | 2026-04-02 |
| P15.5 | Replaced all `endpointSelection`/`jobSelection`/`jobDefinitionSelection` 3-line extraction patterns with `extractResourceLocatorValue()` — 12 sites in `endpoint.execute.ts`, 7 in `job.execute.ts`. | 2026-04-02 |
| P15.6 | 7 new unit tests for listSearch methods (3 endpointSearch, 2 jobDefinitionSearch, 2 jobFolderSearch). All existing tests updated and passing. 562 total tests. | 2026-04-02 |
| P15.7 | Extended `endpointSearch` listSearch + `endpointLocator` resourceLocator to all 6 nodes. Created shared `resourceLocators.ts`. Converted all remaining `endpointId` string fields (Security/2, Admin/1, Software/3, Asset/1, Job/1). Updated all execute functions. | 2026-04-02 |
| P15.8 | Build 0 errors, lint 0 errors (1 pre-existing warning), 562 tests passing. Bumped 0.7.0 → 0.8.0. CHANGELOG updated with breaking changes. | 2026-04-02 |

---

## Phase 12 — Split Resources for Action Picker UX (REQ-UX-2)

**Goal**: Break the 12 monolithic resources (~208 total actions) into ~25 focused resources so the n8n action picker groups actions into scannable categories of 5–12 items each. Currently "Endpoint" alone has 54 actions mixing endpoints, groups, maintenance windows, and Entra ID — users cannot find what they need.

**Mechanism**: n8n's action picker groups actions by `resource` value. There is no `actionCategory` or sub-grouping field. The only way to create visual sections in the picker is to use more granular resource values.

**Prerequisite**: None (purely structural refactor — no logic changes).

**Constraints**:
- No functional changes — all 208 operations must work identically after refactor.
- Version gating (`bmsVersion`) must be preserved on all operations.
- The `router.ts` dispatch must be updated to match new resource values.
- Unit tests must be updated for new `resource` display conditions.
- The `subtitle` expression `={{$parameter["operation"] + ": " + $parameter["resource"]}}` still works — verify it reads well with new resource names.

### Backlog

| ID | Task | Priority | Details |
|----|------|----------|---------|
| P12.1 | **Split `endpoint` resource (54 actions → 6 resources)** | HIGH | Split into: **Endpoint** (get, getMany, search, create, update, delete, startEnrollment, triggerIntuneInstallation = 8 ops), **Logical Group** (get, getMany, create, update, delete, getSubGroups, getEndpoints = 7 ops), **Static Group** (get, getMany, create, update, delete, getEndpoints = 6 ops), **Dynamic Group** (get, getMany, getEndpoints = 3 ops), **Maintenance Window** (create/get/delete/update/replace for endpoint + group = 10 ops), **Typed Endpoint** (getMany, get, update, delete, startEnrollment, getByGroup = 6 ops). Move Entra ID ops (set/get/delete = 3 ops) and unmanaged endpoint ops (get/getMany/delete = 3 ops) into Endpoint or their own resource. Also move "Get Endpoints by AD User" and "Get Endpoints by UDG" into Endpoint. |
| P12.2 | **Split `job` resource (37 actions → 3 resources)** | HIGH | Split into: **Job Definition** (get, getMany, create, update, delete, getByFolder, execute = 7 ops), **Job Instance** (get, getAll, getMany, getByEndpoint, getByLogicalGroup, getByStaticGroup, getByDynamicGroup, getByUDG, assignToLogicalGroup, assignToStaticGroup, assignToDynamicGroup, assignToUDG, start, stop, resume, delete = 16 ops), **Kiosk Release** (get, getMany, create, withdraw, getByEndpoint, getByADObject, getByJobDef, getByLogicalGroup = 8 ops). Job Folder ops (get, getMany, create, update, delete, getSubFolders = 6 ops) → either keep in Job Definition or split into **Job Folder**. |
| P12.3 | **Split `serverManagement` resource (30 actions → 3–4 resources)** | HIGH | Split into: **Server Management** (getManagementServer, restart, cancelRestart, getGateway, getVPNAppliance, getDIPStatus, getDIPsMSWCleanup, simulateMSWCleanup, getDownloadJob, getDownloadJobs, getCloudConnectors, getPXERelays = 12 ops), **Microservice** (get, getMany, start, stop, restart = 5 ops), **Security** (getSecurityGroup/s, createSecurityGroup, updateSecurityGroup, deleteSecurityGroup, getSecurityProfile/s, createSecurityProfile, updateSecurityProfile, deleteSecurityProfile, getAccessRights, updateObjectPermissions = 11 ops), **API Key** (getApiKeys = 1 op — consider merging into Server Management). |
| P12.4 | **Split `asset` resource (26 actions → 3 resources)** | MEDIUM | Split into: **Asset** (get, getMany, create, update, delete, getByEndpoint, getByADObject, getByLogicalGroup, getByOrgUnit = 9 ops), **Asset Type** (get, getMany, create, delete = 4 ops), **Asset Folder** (getStockFolder/s, createStockFolder, updateStockFolder, deleteStockFolder, getSubFolders, getStockAssets, getTypeFolder/s, createTypeFolder, updateTypeFolder, deleteTypeFolder, getTypeFolderSubFolders = 13 ops — or split Stock Folder and Type Folder). |
| P12.5 | **Split `software` resource (19 actions → 2 resources)** | MEDIUM | Split into: **Software** (getInstalledSoftware, getSoftwareByEndpoint, getSoftwareByLogicalGroup, getSoftwareByUDG = 4 ops), **Software Bundle** (get, getMany, create, delete, getApplications, getApplicationsByBundle, addApplication, replaceApplication, deleteApplication, getFolder/s, createFolder, updateFolder, deleteFolder, getSubFolders = 14 ops). |
| P12.6 | **Split `activeDirectory` resource (16 actions → 3 resources)** | MEDIUM | Split into: **AD User** (get, getMany, getByGroup, getByOrgUnit = 4 ops), **AD Group** (get, getMany, getByADGroup, getByOrgUnit = 4 ops), **AD Object** (get, getMany, getByADGroup, getByOrgUnit, getGroupMemberships = 5 ops). Keep **Organizational Unit** (get, getMany, getByOrgUnit = 3 ops) as separate resource or merge into AD Object. |
| P12.7 | **Keep small resources as-is** | LOW | These are already well-sized: **Defense Control** (13 ops — could split BitLocker/Defender/LocalAdmin but not urgent), **Variable** (13 ops), **Operating System** (9 ops), **Compliance** (8 ops), **Universal Dynamic Group** (6 ops), **Update Management** (3 ops). |
| P12.8 | **Create new resource entries in `Baramundi.node.ts`** | HIGH | Update the `resource` property `options` array from 12 entries to ~25 entries. Each needs `name`, `value`, and `description`. Order alphabetically or by domain (Endpoints & Groups → Jobs → Software → Security → etc.). |
| P12.9 | **Update `router.ts` dispatch** | HIGH | The router dispatches by `resource` + `operation`. Add new resource cases for all split resources. The execute functions themselves don't change — just the routing map. |
| P12.10 | **Move field definitions to new resource scopes** | HIGH | For each split, update `displayOptions.show.resource` on all operation definitions and field definitions to reference the new resource value instead of the old one. This is the bulk of the mechanical work. |
| P12.11 | **Update unit tests** | HIGH | Update all test mocks that set `resource` parameter values. Run full test suite — all existing tests must pass with the new resource values. |
| P12.12 | **Build + lint + full test run** | HIGH | TypeScript 0 errors, ESLint 0 errors, all tests passing. Bump minor version, update CHANGELOG. |
| ~~P12.13~~ | ~~**Manual smoke test in n8n**~~ | ~~HIGH~~ | ~~Moved to Done~~ |

### Implementation Notes

- **File structure**: Each new resource can either get its own directory under `actions/` (e.g., `actions/logicalGroup/`) or stay in the parent directory with the fields split into separate exports. Recommend new directories only for resources extracted from `endpoint` and `job` — the rest can use separate exports in the existing files.
- **Execution functions**: The `.execute.ts` files do NOT need to move or change. Only the field definitions (`.fields.ts`), the resource list in `Baramundi.node.ts`, and the router need updating.
- **Order of work**: P12.1 → P12.8 → P12.9 → P12.10 → P12.11 → P12.12 → P12.13. Start with Endpoint (biggest win), then Job, then the rest. Each split can be done and tested independently.
- **Backwards compatibility**: Existing saved workflows store `resource` + `operation` values. Splitting resources changes the `resource` value, which **breaks existing workflows**. Document this as a breaking change in CHANGELOG. Consider bumping major version (0.x → 1.0 or 0.4 → 0.5).

### Done

| ID | Task | Completed |
|----|------|-----------|
| P12.1 | Split `endpoint` resource into 6 resources (Endpoint, Logical Group, Static Group, Dynamic Group, Maintenance Window, Typed Endpoint) | 2026-04-02 |
| P12.8 | Added 5 new resource entries to `Baramundi.node.ts` (Dynamic Group, Logical Group, Maintenance Window, Static Group, Typed Endpoint) | 2026-04-02 |
| P12.9 | Updated `router.ts` with 5 new case blocks routing to existing `endpoint.*` functions | 2026-04-02 |
| P12.10 | Updated all `displayOptions.show.resource` in `endpoint.fields.ts` to new resource values | 2026-04-02 |
| P12.11 | All 550 unit tests pass with new resource split (endpoint.execute.test.ts: 118 tests green) | 2026-04-02 |
| P12.2 | Split `job` resource into 4 resources (Job Definition, Job Folder, Job Instance, Kiosk Release) | 2026-04-02 |
| P12.3 | Split `serverManagement` into 3 resources (Server Management, Microservice, Security) | 2026-04-02 |
| P12.4 | Split `asset` into 3 resources (Asset, Asset Type, Asset Folder) | 2026-04-02 |
| P12.5 | Split `software` into 2 resources (Software, Software Bundle) | 2026-04-02 |
| P12.6 | Split `activeDirectory` into 4 resources (AD User, AD Group, AD Object, Org Unit) | 2026-04-02 |
| P12.7 | Keep small resources as-is (Defense Control, Variable, OS, Compliance, UDG, Update Mgmt) | N/A — no changes needed |
| P12.12 | Build 0 errors, lint 0 errors, 550 tests passing. Bumped version 0.4.1 → 0.5.0, updated CHANGELOG | 2026-04-02 |
| P12.13 | Manual smoke test superseded — Phase 13 split + Phase 14 merge built and tested on top of Phase 12, confirming resource split works correctly | 2026-04-02 |

---

## Phase 13 — Split into 6 Domain Nodes (REQ-SPLIT-1)

**Goal**: Split the monolithic `Baramundi` node (28 resources, ~222 sidebar actions) into 6 focused domain nodes. Remove old monolithic node entirely (pre-1.0, no backward compat needed).

**Prerequisite**: Phase 12 complete.


### Backlog

| ID | Task | Priority | Notes |
|----|------|----------|-------|
| ~~P13.1~~ | ~~**Create shared infrastructure**~~ | ~~HIGH~~ | ~~Moved to Done~~ |
| ~~P13.2~~ | ~~**Create BaramundiEndpoint node**~~ | ~~HIGH~~ | ~~Moved to Done~~ |
| ~~P13.3~~ | ~~**Create BaramundiAsset node**~~ | ~~HIGH~~ | ~~Moved to Done~~ |
| ~~P13.4~~ | ~~**Create BaramundiJob node**~~ | ~~HIGH~~ | ~~Moved to Done~~ |
| ~~P13.5~~ | ~~**Create BaramundiSoftware node**~~ | ~~HIGH~~ | ~~Moved to Done~~ |
| ~~P13.6~~ | ~~**Create BaramundiAdmin node**~~ | ~~HIGH~~ | ~~Moved to Done~~ |
| ~~P13.7~~ | ~~**Create BaramundiSecurity node**~~ | ~~HIGH~~ | ~~Moved to Done~~ |
| ~~P13.8~~ | ~~**Update package.json and remove old node**~~ | ~~HIGH~~ | ~~Moved to Done~~ |
| ~~P13.9~~ | ~~**Update tests**~~ | ~~HIGH~~ | ~~Moved to Done~~ |
| ~~P13.10~~ | ~~**Documentation and version bump**~~ | ~~HIGH~~ | ~~Moved to Done~~ |

### Implementation Notes

- **Shared code**: All in `nodes/shared/` — single source of truth. Import via relative paths (e.g., `../../../../shared/transport/requestApi` from execute files).
- **Same icon**: All 6 nodes use `baramundi.svg` (copy into each node dir).
- **Single credential**: All nodes reference `bconnectApi`.
- **bmsVersion**: Each node declares its own version dropdown (25R2, 26R1; default 26R1).
- **bmsecurity sharing**: `bmsecurity` handlers live in `serverManagement.execute.ts`. Copy full module into both Admin and Security nodes; each router calls only its own operations.
- **Dead code**: Router has unreachable cases for old `activeDirectory` (16 ops) and `job` (37 ops) resource values — do NOT carry these into new mini-routers.
- **Order of work**: P13.1 first (shared infra), then P13.2–P13.7 (nodes, can be done in any order), then P13.8–P13.10.

### Done

| ID | Task | Completed |
|----|------|-----------|
| P13.1 | Create shared infrastructure — moved transport, utils, errorMessages, types, validation to `nodes/shared/`. Extracted 7 loadOptions into `nodes/shared/loadOptions.ts` with DRY helper. `tsc --noEmit` 0 errors, 550 tests pass. | 2026-04-02 |
| P13.2 | Create BaramundiEndpoint node — 6 resources, ~92 ops. Mini-router, LoadOptions, version-specific ops. | 2026-04-02 |
| P13.3 | Create BaramundiAsset node — 3 resources (asset, assetType, assetFolder), ~43 ops. | 2026-04-02 |
| P13.4 | Create BaramundiJob node — 4 resources (jobDefinition, jobFolder, jobInstance, kioskRelease), ~37 ops. | 2026-04-02 |
| P13.5 | Create BaramundiSoftware node — 5 resources (software, softwareBundle, updateManagement, variable, universalDynamicGroups), ~56 ops. | 2026-04-02 |
| P13.6 | Create BaramundiAdmin node — 7 resources (adUser, adGroup, adObject, orgUnit, serverManagement, microservice, operatingSystem), ~60 ops. | 2026-04-02 |
| P13.7 | Create BaramundiSecurity node — 3 resources (bmsecurity, compliance, defenseControl), ~33 ops. | 2026-04-02 |
| P13.8 | Update package.json — registered 6 nodes, removed old `nodes/Baramundi/` directory. `tsc --noEmit` 0 errors. | 2026-04-02 |
| P13.9 | Update tests — updated all unit + system test imports to new node paths. 550 tests passing, 14 files green. | 2026-04-02 |
| P13.10 | Documentation and version bump — updated CHANGELOG.md, CLAUDE.md, bumped to 0.6.0. | 2026-04-02 |

---

## Phase 14 — Merge Typed Endpoint into Endpoint (REQ-ENDPOINT-UX-1)

**Goal**: Remove the `typedEndpoint` resource. Merge all its operations into `endpoint` by adding an `endpointType` dropdown ("All Platforms", Windows, Android, iOS, Linux, Mac, Network) to operations that can filter by platform. Reduces resource count from 6 → 5 and eliminates duplicate operations.

**Prerequisite**: Phase 13 complete.

### Backlog

| ID | Task | Priority | Notes |
|----|------|----------|-------|
| P14.1 | **Refactor execute functions** | HIGH | Modify `get`, `getMany`, `update`, `deleteEndpoint` to accept optional `endpointType` param. When "all" → use generic `/v2.0/Endpoints` path. When specific → use `/v2.0/{Type}Endpoints` path via `TYPED_ENDPOINT_PATH`. Fix `update` to work for all platforms (currently Windows-only). Merge `getEndpointsByX` group queries with typed group query logic. |
| P14.2 | **Remove standalone typed functions** | HIGH | Remove `getTypedEndpoints`, `getTypedEndpoint`, `updateTypedEndpoint`, `deleteTypedEndpoint`, `startTypedEnrollment`, `getTypedEndpointsByGroup` as standalone functions. Their logic is now absorbed into the main `get`, `getMany`, `update`, `delete`, `startEnrollment`, `getEndpointsByGroup` functions. |
| P14.3 | **Update fields — merge operations** | HIGH | Remove `typedEndpointOperations25R2/26R1` and `typedEndpointFields` arrays. Update `endpointOperations25R2/26R1` to include relevant operations. Add `endpointType` dropdown field (options: All, Windows, Android, iOS, Linux, Mac, Network) with `displayOptions` showing it for Get, Get Many, Update, Delete, Get By Group. For Create: already has endpointType. For Update: make it required (no "all"). Network excluded from enrollment ops. |
| P14.4 | **Update router** | HIGH | Remove `case 'typedEndpoint'` block entirely. All operations now handled under `case 'endpoint'`. Remove operation names: `getTypedEndpoints`, `getTypedEndpoint`, `updateTypedEndpoint`, `deleteTypedEndpoint`, `startTypedEnrollment`, `getTypedEndpointsByGroup`. Industrial endpoint operations (25R2): merge into endpoint case with `endpointType: 'industrial'` or keep as separate ops. |
| P14.5 | **Update node file** | MEDIUM | Remove `typedEndpoint` from resource dropdown (6 → 5 resources). Remove `typedEndpointOperations*` and `typedEndpointFields` spreads from properties. Update descriptions to mention platform filtering. |
| P14.6 | **Update tests** | HIGH | Update endpoint.execute.test.ts: tests for typed endpoint functions become tests for endpoint functions with endpointType param. Test matrix: each consolidated operation × {all, windows, android, network}. Verify network exclusion from enrollment. Verify update works for non-Windows platforms. |
| P14.7 | **Build, test, bump version** | HIGH | `tsc --noEmit` 0 errors. All tests pass. Rebuild and reinstall in n8n container. Verify sidebar shows 5 resources (not 6). Verify Get Many with endpointType=Windows filters correctly. Bump version to 0.7.0. Update CHANGELOG. |

### Implementation Notes

- **Key insight**: The execute functions `getTypedEndpoints`, `getTypedEndpoint`, etc. already use the same `TYPED_ENDPOINT_PATH` map. The merge means: the main `get`/`getMany`/`update`/`delete` functions gain a conditional branch — "if endpointType is set and not 'all', use typed path."
- **Network is special**: No enrollment, no Intune, no agent-based operations. The `endpointType` dropdown should hide enrollment-related operations when `network` is selected (use `displayOptions`), or validate at runtime.
- **Industrial endpoints (25R2)**: Can be added as `endpointType: 'industrial'` option visible only when `bmsVersion: ['25R2']`. Or kept as separate operations if the API shape differs significantly.
- **Operation count reduction**: Current Endpoint has ~19 ops + Typed Endpoint has ~12 ops = ~31. After merge: ~20-22 ops (duplicates removed). Sidebar action count drops.
- **Breaking change**: `resource: 'typedEndpoint'` no longer exists. Saved workflows using it must be updated. Document in CHANGELOG.

### Done

| ID | Task | Completed |
|----|------|-----------|
| P14.1 | Refactor `get`, `getMany`, `update`, `deleteEndpoint`, `startEnrollment` to accept `endpointType` param. Added `getEndpointsByGroup` function consolidating `getTypedEndpointsByGroup`. Fixed `update` to work for all platform types (was Windows-only). | 2026-04-02 |
| P14.2 | Removed standalone typed functions: `getTypedEndpoints`, `getTypedEndpoint`, `updateTypedEndpoint`, `deleteTypedEndpoint`, `startTypedEnrollment`, `getTypedEndpointsByGroup`. Logic absorbed into main functions. | 2026-04-02 |
| P14.3 | Updated `endpointOperations25R2/26R1` to include `getEndpointsByGroup` and industrial ops. Added `endpointTypeFields` array. Removed `typedEndpointOperations*` and `typedEndpointFields`. | 2026-04-02 |
| P14.4 | Updated `router.ts`: added `getEndpointsByGroup` + industrial ops to `endpoint` case; removed `case 'typedEndpoint'` entirely. | 2026-04-02 |
| P14.5 | Updated `BaramundiEndpoint.node.ts`: removed `typedEndpoint` from resource dropdown (6→5 resources), updated imports, added `endpointTypeFields` spread. | 2026-04-02 |
| P14.6 | Updated `endpoint.execute.test.ts`: replaced typed endpoint tests with tests for new merged behavior. 554 tests passing. | 2026-04-02 |
| P14.7 | Build 0 errors, lint 0 errors, 554 tests passing. Bumped version 0.6.0 → 0.7.0, updated CHANGELOG.md. | 2026-04-02 |

---

## Security — Threat Model Findings (2026-04-02)

**Threat model**: `docs/THREAT-MODEL-2026-04-02.md`
**Scope**: Full codebase review of v0.6.0

### Backlog

*(empty)*

| SEC-08.1 | Add version-mismatch guards in BaramundiEndpoint router: throw `NodeOperationError` when 25R2-only ops (`replaceEndpointMaintenanceWindow`, `replaceGroupMaintenanceWindow`, Industrial Endpoints) are executed with `bmsVersion: '26R1'`. Error must name the 26R1 replacement and note body format change. | **HIGH** | F-2026-08: Silent workflow breakage on bmsVersion migration |
| SEC-08.2 | Unit tests for each version-mismatch guard (maintenance window PUT under 26R1, industrial endpoints under 26R1) | HIGH | F-2026-08 |

### Accepted (no action required)

| ID | Finding | Severity | Rationale |
|----|---------|----------|-----------|
| F-2026-05 | `additionalFields` unvalidated in create/update ops | LOW | bConnect API validates server-side; n8n UI constrains field types |
| F-2026-07 | lodash HIGH in n8n-workflow peer dep | ACCEPTED | `_.template`/`_.unset`/`_.omit` never called by this connector; upstream fix required |

### Done

| ID | Task | Completed |
|----|------|-----------|
| SEC-04.1 | Added `validateODataString()` to `search()` in `endpoint.execute.ts` — matches existing pattern at lines 488/608/728 | 2026-04-02 |
| SEC-04.2 | Added unit test `should reject invalid OData in searchQuery (SEC-04.1)` — 555 tests passing | 2026-04-02 |
| SEC-04.3 | Grep-verified: 2 remaining `SearchQuery:` sites — both validated (endpoint.execute.ts:124 validated above, job.execute.ts:117 GUID-validated) | 2026-04-02 |
| SEC-06.1 | Added safety comment on `job.execute.ts:117` noting GUID validation dependency | 2026-04-02 |

---

## Phase 16 — API Path Audit Remediation

**Goal**: Fix all API paths that don't match the OpenAPI specs. Discovered during E2E testing against bConnectMock (2026-04-02).

**Audit report**: 17 mismatched paths found across 3 categories.

### Backlog

| ID | Task | Severity | Acceptance Criteria | Depends |
|----|------|----------|---------------------|---------|
| P16.1 | **Fix UDG CRUD domain prefix** — change 8 paths in `universalDynamicGroups.execute.ts` from `/endpoints/v2.0/UniversalDynamicGroups*` to `/universaldynamicgroups/v2.0/UniversalDynamicGroups*`. Leave sub-resource paths under `endpoints/` (e.g. `.../{id}/Endpoints`) unchanged. | HIGH | All 8 UDG CRUD paths match OpenAPI spec `universaldynamicgroups.json`; E2E against mock returns 200; unit tests updated | — |
| P16.2 | **Fix MaintenanceWindow paths** — (a) Change `WindowsEndpoints/{id}` to `Endpoints/{id}` in all endpoint MW operations. (b) Remove `/{windowId}` from PATCH/DELETE/PUT paths — spec shows MW is a singleton per endpoint/group (`/MaintenanceWindow` not `/MaintenanceWindow/{id}`). (c) Remove `windowId` field from update/delete/put MW field definitions and execute functions. (d) Group MW: only `LogicalGroups` in spec — verify if StaticGroups/DynamicGroups MW works on real API. | HIGH | All MW paths match OpenAPI spec; `windowId` parameter removed from update/delete/put; fields file updated; unit tests updated; E2E against mock returns 200 for create/get/delete on endpoint + logical group MW | P16.1 |
| P16.3 | **Verify StaticGroups/DynamicGroups base CRUD** — test against real bMS (or accept as undocumented). If 404: remove operations + fields + router cases + tests. If working: add comment noting undocumented API. | MEDIUM | Verified against real bMS or documented as accepted risk | — (postponed until bMS access) |
| P16.4 | **Add automated path validation test** — create `test/unit/apiPaths.test.ts` that: (a) extracts all path strings from `*.execute.ts` via regex, (b) loads all OpenAPI spec JSON from `/home/ansible/MCP/bConnectOpenAPI/26R1/`, (c) strips domain prefix from connector paths, (d) asserts each path exists in spec. Run in CI. | MEDIUM | Test passes with 0 unmatched paths; runs as part of `npx vitest run`; catches any future drift | P16.1, P16.2 |
| P16.5 | **Update tests + CHANGELOG** — fix all unit test assertions for changed paths, bump version, document breaking changes (windowId removal) in CHANGELOG | HIGH | All tests pass; CHANGELOG entry for path fixes | P16.1, P16.2 |
| P16.6 | **E2E tests for all operations against bConnectMock** — one file per node in `test/e2e/`. Real HTTP against `localhost:8765` (standard-readwrite). Cover GET/POST/PATCH/DELETE. Verify response structure. Skip when mock not running. | HIGH | 6 test files; covers all ~220 operations; all pass against mock; `npx vitest run test/e2e/` green | P16.1, P16.2 |
| P16.7 | **E2E tests against real bMS** — env-var gated (`BMS_URL`/`BMS_USER`/`BMS_PASS`). Destructive ops opt-in (`BMS_E2E_DESTRUCTIVE=true`). | MEDIUM | Postponed — requires live bMS access | P16.6 |
| P16.8 | **Add OpenAPI cross-check to SDLC process** — update `/process-design-review` Step 3a and `/process-qa-gate` Step 3 with spec verification checklist | MEDIUM | SDLC docs updated; checklist enforced in next design review | — |

### Done

| ID | Task | Completed |
|----|------|-----------|
| P16.0 | Audit: compared all 141 connector paths against OpenAPI specs. Found 17 mismatches. Fixed `MaintenanceWindows` → `MaintenanceWindow` (plural→singular). | 2026-04-02 |
| P16.1 | Fixed 8 UDG CRUD paths: `/endpoints/v2.0/UniversalDynamicGroups*` → `/universaldynamicgroups/v2.0/UniversalDynamicGroups*`. Updated unit tests. | 2026-04-02 |
| P16.2 | Fixed MW paths: `WindowsEndpoints` → `Endpoints`; removed `/{windowId}` from all PATCH/DELETE/PUT (MW is singleton); removed `windowId` field from UI + execute. BREAKING. | 2026-04-02 |

---

## Notes

- **System tests** (`test/system/`) require a live bMS server. They are skipped in CI unless `BMS_URL` env var is set. Do not block phases on system test results.
- **IndustrialEndpoints** (25R2-only): Now planned for merge into endpoint resource with `endpointType: 'industrial'` (Phase 14).
- **Version auto-detection** from `/bconnect/v2.0/Info`: Deferred to future enhancement (see Requirements.md open questions).
- **25R2 dropdown option**: Stays until ~2028 EOL.
