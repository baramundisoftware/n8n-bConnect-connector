# n8n-nodes-baramundi — Task Board

**Requirements**: [Requirements.md](./Requirements.md)
**Node**: `nodes/Baramundi/Baramundi.node.ts`
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

**Goal**: Add `CreateNetworkEndpoint` to the `create` operation. Network is the only platform type missing from the endpoint type dropdown. It requires `displayName` + `primaryIP` (required per OpenAPI spec).

**Prerequisite**: Phase 9 complete.

### Backlog

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P10.1 | Add `network` to `endpointType` dropdown in `endpoint.fields.ts`; add `primaryIP` required field for network type; add `network` to `endpointMap` in `endpoint.execute.ts` | Backend Developer | HIGH | Phase 9 done |
| P10.2 | Write unit tests for `create` with network type | Test Engineer | HIGH | P10.1 |
| P10.3 | Build + lint + full test run — 0 errors | QA Engineer | HIGH | P10.2 |
| P10.4 | Bump version, update CHANGELOG, update analysis files | DevOps Engineer | MEDIUM | P10.3 |

### Done

*(empty)*

---

## Phase 11 — Example Workflows for Senior IT Administrators

**Goal**: Replace the two trivial placeholder workflows with a library of production-ready workflow templates that demonstrate real IT automation scenarios. Assess existing workflows for accuracy first, then build the new set.

**Current state**: `example-workflows/` has 2 workflows (Jan 2026, day-one placeholders):
- `01-list-endpoints.json` — manual trigger → getMany endpoints. No practical value.
- `02-search-and-report.json` — search by "WIN" prefix → reshape. Outdated field names (`DisplayName`, `Id` — V2.0 uses camelCase).

Both are pre-Phase 8 and reference fields that no longer exist. They need to be replaced, not extended.

### Backlog

| ID | Task | Priority |
|----|------|----------|
| P11E.1 | Audit existing 2 workflows — fix field names or delete | HIGH |
| P11E.2 | Create workflow: **Endpoint Compliance Report** — get all endpoints, check compliance status (26R1), output CSV/table for weekly review | HIGH |
| P11E.3 | Create workflow: **Job Failure Alert** — scheduled trigger, query job instances with status=Failed, send summary notification (email/Teams/Slack) | HIGH |
| P11E.4 | Create workflow: **New Endpoint Onboarding** — webhook trigger on enrollment, add to logical group, set standard variables, execute baseline job | HIGH |
| P11E.5 | Create workflow: **Vulnerability Scan Cycle** — trigger VA job per group, wait, query fresh CVE detections + rule violations, deliver prioritised remediation report with escalation gate | HIGH |
| P11E.5b | Create workflow: **Stale Endpoint Report** — find endpoints with no contact in 30+ days, generate report for IT review | MEDIUM |
| P11E.6 | Create workflow: **Software License Audit** — get all installed software across fleet, aggregate by publisher, compare against licensed list | MEDIUM |
| P11E.7 | Create workflow: **Security Incident Response** — scheduled scan for active Defender threats, enrich with endpoint details, create ticket / send alert | MEDIUM |
| P11E.8 | Create workflow: **Patch Compliance Dashboard** — query update management status, group by patch level, output summary for management reporting | MEDIUM |
| P11E.9 | Create workflow: **BitLocker Key Retrieval** — form-triggered, retrieve recovery key for specific endpoint, log access for audit trail | LOW |
| P11E.10 | Create workflow: **Maintenance Window Scheduler** — read schedule from Google Sheets / external source, set maintenance windows on endpoint groups | LOW |
| P11E.11 | Update `example-workflows/README.md` — document all workflows, prerequisites, how to adapt credentials and IDs | HIGH |

### Suggested Workflow Details

**P11E.2 — Windows Patch Cycle** ⭐
The end-to-end monthly/patch-Tuesday workflow. Sets maintenance windows on all Windows endpoint groups, triggers the update job, monitors execution, and produces a completion report.

Steps:
1. **Trigger**: Schedule node (e.g. Patch Tuesday — 2nd Tuesday of month, 22:00)
2. **Get target groups**: `endpoint.getLogicalGroups` — fetch all groups tagged for patching
3. **Set maintenance windows**: `endpoint.updateGroupMaintenanceWindow` (or `putGroupMaintenanceWindow` for full replace) — set start/end window per group
4. **Trigger patch job**: `job.startJobInstance` — start the configured Windows Update job definition for each group
5. **Wait**: n8n Wait node (e.g. 4 hours)
6. **Check job results**: `job.getEndpointJobInstances` — get instance status per endpoint
7. **Summarise**: Code node — count succeeded/failed/pending per group
8. **Report**: Send HTML email or Teams message — "Patch cycle complete: 247 succeeded, 3 failed"
9. **On failure**: Filter failed instances → `endpoint.get` for hostname/IP → escalation alert

Key operations: `endpoint.getLogicalGroups`, `endpoint.putGroupMaintenanceWindow`, `job.startJobInstance`, `job.getEndpointJobInstances`, `job.getJobInstance`

---

**P11E.3 — Windows Devices with Patch Problems** ⭐
Identifies endpoints where the last patch job failed or never ran. Gives the IT team an actionable list before the next patch cycle.

Steps:
1. **Trigger**: Schedule (daily 07:00, or manually before patch review meeting)
2. **Get all Windows endpoints**: `endpoint.getTypedEndpoints` (platformType: windows, returnAll)
3. **Get recent job instances**: `job.getAllJobInstances` — filter to Windows Update job definition, last 30 days
4. **Join**: Code node — for each endpoint, find its latest update job instance; flag endpoints with status=Failed, status=Stopped, or no instance in 30 days
5. **Enrich failures**: `job.getJobInstance` — get error detail for failed instances
6. **Group by failure type**: Code node — categorise by error code / failure reason
7. **Output**: Spreadsheet rows or HTML table — endpoint name, last patch attempt, status, error, responsible group

Key operations: `endpoint.getTypedEndpoints`, `job.getAllJobInstances`, `job.getJobInstance`, `job.getEndpointJobInstances`

---

**P11E.4 — Windows Devices with Critical CVEs** ⭐ (26R1 only)
Daily scan for endpoints with detected critical vulnerabilities. Produces a prioritised remediation list for the security team.

Steps:
1. **Trigger**: Schedule (daily 06:00)
2. **Get all detected vulnerabilities**: `compliance.getDetectedVulnerabilities` (returnAll) — all active CVE detections
3. **Filter critical**: Code node — keep only entries where `severity = Critical` or `cvssScore >= 9.0`
4. **Get per-endpoint detail**: `compliance.getDetectedVulnerabilitiesByEndpoint` for each affected endpoint ID — full CVE list per machine
5. **Enrich with endpoint info**: `endpoint.get` — hostname, primary user, logical group
6. **Enrich with CVE details**: `compliance.getVulnerability` — CVE description, affected software, patch availability
7. **Deduplicate and rank**: Code node — sort by CVSS score desc, deduplicate endpoints
8. **Output**: Send to security team — table of endpoint / CVE / score / patch available / responsible group
9. **Optional escalation**: If any endpoint has CVSS ≥ 9.5 and no patch available → immediate alert

Key operations: `compliance.getDetectedVulnerabilities`, `compliance.getDetectedVulnerabilitiesByEndpoint`, `compliance.getVulnerability`, `endpoint.get`

---

**P11E.5 — Vulnerability Scan Cycle** ⭐ (26R1 only)
End-to-end automated vulnerability assessment: triggers the baramundi Vulnerability Assessment job across all endpoint groups, waits for completion, queries the fresh CVE results, and delivers a prioritised remediation report — all without manual console interaction.

Steps:
1. **Trigger**: Schedule node (weekly, e.g. Sunday 01:00) or manual trigger before security review
2. **Get target groups**: `endpoint.getLogicalGroups` (returnAll) — fetch all groups in scope for scanning
3. **Assign and start scan job**: For each group → `job.assignJobToLogicalGroup` (Vulnerability Assessment job definition ID) → `job.startJobInstance` — kick off the scan job per group
4. **Wait for completion**: n8n Wait node (e.g. 2 hours) — allow scan to complete across fleet
5. **Verify job results**: `job.getJobInstancesByLogicalGroup` per group — confirm all instances reached status=Succeeded or flag any failures
6. **Query fresh CVE detections**: `compliance.getDetectedVulnerabilities` (returnAll) — all currently detected CVEs after the scan
7. **Query rule violations**: `compliance.getDetectedRuleViolations` (returnAll) — compliance policy breaches detected alongside CVEs
8. **Enrich with CVE details**: `compliance.getVulnerability` for each unique CVE ID — description, CVSS score, affected component, patch availability
9. **Per-endpoint breakdown**: `compliance.getDetectedVulnerabilitiesByEndpoint` for top offenders — full exposure list per machine
10. **Enrich with endpoint info**: `endpoint.get` — hostname, primary user, logical group, last contact
11. **Prioritise**: Code node — rank by CVSS score desc, group by: Critical (≥9.0) / High (7.0–8.9) / Medium / Low
12. **Report**: Send structured report to security team:
    - Summary: total endpoints scanned, % with critical CVEs, new vs previously known
    - Critical CVE table: CVE ID / CVSS / affected endpoints / patch available
    - Top 10 most exposed endpoints
    - Compliance rule violation summary
13. **Escalation gate**: If any new Critical CVE (CVSS ≥ 9.0) detected since last run → immediate alert to security lead

Key operations: `endpoint.getLogicalGroups`, `job.assignJobToLogicalGroup`, `job.startJobInstance`, `job.getJobInstancesByLogicalGroup`, `compliance.getDetectedVulnerabilities`, `compliance.getDetectedRuleViolations`, `compliance.getVulnerability`, `compliance.getDetectedVulnerabilitiesByEndpoint`, `endpoint.get`

Note: Requires knowing the Vulnerability Assessment job definition ID (read once via `job.getJobs` filtered by name, store as workflow variable).

---

**P11E.6 — Job Failure Alert**
Uses: `job.getAllJobInstances` (filter status=Failed, last 24h) → group by jobDefinitionId → `job.getJob` to get job names → Notification node.
Trigger: Schedule (every 6h). Output: Teams/Slack message with failure count + job names.

**P11E.6 — New Endpoint Onboarding**
Uses: Schedule poll (every 15min) → `endpoint.getTypedEndpoints` (filter created in last 15min) → `endpoint.updateStaticGroup` membership → `variable.updateVariableInstance` to set asset owner, cost center → `job.startJobInstance` to run onboarding job.

**P11E.7 — Stale Endpoint Report**
Uses: `endpoint.getTypedEndpoints` (returnAll) → Code node filter `lastContact < now-30days` → aggregate by logical group → send report.
Trigger: Schedule (monthly). Output: Email with list of stale endpoints + last contact date.

**P11E.8 — Software License Audit**
Uses: `software.getInstalledWindowsSoftware` (returnAll) → Code node aggregate by `publisher`+`displayName` → count installs → compare against license sheet → flag over/under-licensed products.
Trigger: Schedule (monthly). Output: Spreadsheet with install counts vs license entitlements.

**P11E.9 — BitLocker Key Retrieval**
Uses: n8n Form trigger (IT helpdesk requests key) → `asset.getBitLockerSecret` → return key to requester → write audit log entry (date, requester, endpoint).
Note: Security-critical — add approval step before returning key.

**P11E.10 — Maintenance Window Scheduler (external calendar)**
Uses: Google Sheets / HTTP Request to fetch maintenance schedule → `endpoint.getLogicalGroups` → `endpoint.putGroupMaintenanceWindow` per group.
Trigger: Schedule (weekly, before patch Tuesday).

### Done

*(empty)*

---

## Phase 12 — Resource Locator UX

**Goal**: Replace plain GUID string fields with `resourceLocator` components for endpoints and jobs, and add `listSearch` methods alongside the existing `loadOptions` methods. This enables type-ahead search, GUID validation in the UI, and "By URL" mode.

**No technical blockers.** `n8n-workflow` v2.13.1 (installed) fully supports `listSearch` and `type: 'resourceLocator'`. The `methods` class property pattern is already used for `loadOptions` — `listSearch` is added in the same block. The `extractResourceLocatorValue()` helper in `utils/validation.ts` is already written for backward compatibility.

**Reference**: `docs/UX_IMPROVEMENTS_GUIDE.md` §1–2 for full code examples.

### Backlog

| ID | Task | Priority |
|----|------|----------|
| P11.1 | Add `endpointSearch` to `methods.listSearch` in `Baramundi.node.ts` — search Windows endpoints by name/hostname | HIGH |
| P11.2 | Add `jobDefinitionSearch` and `jobFolderSearch` to `methods.listSearch` | HIGH |
| P11.3 | Update `endpoint.fields.ts` — change `endpointId` fields from `type: 'string'` to `type: 'resourceLocator'` (By List / By ID / By URL modes) | HIGH |
| P11.4 | Update `job.fields.ts` — change `jobDefinitionId` and `folderId` fields to `resourceLocator` | HIGH |
| P11.5 | Update `endpoint.execute.ts` and `job.execute.ts` — use `extractResourceLocatorValue()` to handle both legacy string and new object format | HIGH |
| P11.6 | Unit tests for `listSearch` methods (mock `apiRequest`) | MEDIUM |
| P11.7 | Extend `listSearch` to other high-value resources: logical groups, variables, assets | LOW |
| P11.8 | Build + lint + full test run — 0 errors, bump version, update CHANGELOG | MEDIUM |

### Done

*(empty)*

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
| P12.13 | **Manual smoke test in n8n** | HIGH | Verify in the n8n action picker that: (1) resources appear as separate groups, (2) each group has a reasonable number of actions, (3) the subtitle displays correctly, (4) executing a workflow with the refactored node still works. |

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

---

## Notes

- **System tests** (`test/system/`) require a live bMS server. They are skipped in CI unless `BMS_URL` env var is set. Do not block phases on system test results.
- **IndustrialEndpoints** (25R2-only, not yet in connector): Deferred — implement only if explicitly requested.
- **Version auto-detection** from `/bconnect/v2.0/Info`: Deferred to future enhancement (see Requirements.md open questions).
- **25R2 dropdown option**: Stays until ~2028 EOL.
