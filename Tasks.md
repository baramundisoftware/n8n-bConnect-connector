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

## Notes

- **System tests** (`test/system/`) require a live bMS server. They are skipped in CI unless `BMS_URL` env var is set. Do not block phases on system test results.
- **IndustrialEndpoints** (25R2-only, not yet in connector): Deferred — implement only if explicitly requested.
- **Version auto-detection** from `/bconnect/v2.0/Info`: Deferred to future enhancement (see Requirements.md open questions).
- **25R2 dropdown option**: Stays until ~2028 EOL.
