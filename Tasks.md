# n8n-nodes-baramundi — Task Board

**Requirements**: [Requirements.md](./Requirements.md)
**Node**: `nodes/Baramundi/Baramundi.node.ts`
**OpenAPI specs**: `/home/ansible/MCP/bConnectOpenAPI/{version}/`

---

## Phase 1 — Remove V1.1 (REQ-SCOPE-1)

**Goal**: Strip all V1.1 API modules. Result: connector is V2.0-only, clean build, all remaining tests pass.

### Backlog

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P1.1 | Delete all V1.1 module directories and their unit + system tests | Backend Developer | HIGH | — |
| P1.2 | Remove V1.1 imports and resource entries from `Baramundi.node.ts` and `router.ts` | Backend Developer | HIGH | P1.1 |
| P1.3 | Build (`npm run build`) and unit test (`npm run test:unit`) — verify 0 errors, all remaining tests pass | QA Engineer | HIGH | P1.2 |

**V1.1 modules to delete** (directories under `nodes/Baramundi/actions/` and matching test directories):

| Module dir | Unit test | System test |
|---|---|---|
| `bitLockerSecrets/` | `test/nodes/.../bitLockerSecrets/` | `test/system/bitLockerSecrets.system.test.ts` |
| `bootEnvironment/` | `test/nodes/.../bootEnvironment/` | `test/system/bootEnvironment.system.test.ts` |
| `complianceViolations/` | `test/nodes/.../complianceViolations/` | `test/system/complianceViolations.system.test.ts` |
| `endpointInvSoftware/` | `test/nodes/.../endpointInvSoftware/` | `test/system/endpointInvSoftware.system.test.ts` |
| `hardwareProfiles/` | `test/nodes/.../hardwareProfiles/` | *(check if exists)* |
| `images/` | `test/nodes/.../images/` | `test/system/images.system.test.ts` |
| `inventoryAppScans/` | `test/nodes/.../inventoryAppScans/` | *(check if exists)* |
| `inventoryDataCustomScans/` | `test/nodes/.../inventoryDataCustomScans/` | `test/system/inventoryDataCustomScans.system.test.ts` |
| `inventoryDataFileScans/` | `test/nodes/.../inventoryDataFileScans/` | *(check if exists)* |
| `inventoryDataHardwareScans/` | `test/nodes/.../inventoryDataHardwareScans/` | `test/system/inventoryDataHardwareScans.system.test.ts` |
| `inventoryDataRegistryScans/` | `test/nodes/.../inventoryDataRegistryScans/` | *(check if exists)* |
| `inventoryDataSnmpScans/` | `test/nodes/.../inventoryDataSnmpScans/` | `test/system/inventoryDataSnmpScans.system.test.ts` |
| `inventoryDataWMIScans/` | `test/nodes/.../inventoryDataWMIScans/` | `test/system/inventoryDataWMIScans.system.test.ts` |
| `inventoryOverviews/` | `test/nodes/.../inventoryOverviews/` | `test/system/inventoryOverviews.system.test.ts` |
| `orgUnit/` | `test/nodes/.../orgUnit/` | `test/system/orgUnit.system.test.ts` |
| `setupIntegrity/` | `test/nodes/.../setupIntegrity/` | `test/system/setupIntegrity.system.test.ts` |
| `softwareScanRuleCounts/` | `test/nodes/.../softwareScanRuleCounts/` | `test/system/softwareScanRuleCounts.system.test.ts` |
| `softwareScanRules/` | `test/nodes/.../softwareScanRules/` | `test/system/softwareScanRules.system.test.ts` |
| `ssh/` | `test/nodes/.../ssh/` | `test/system/ssh.system.test.ts` |
| `vpp/` | `test/nodes/.../vpp/` | `test/system/vpp.system.test.ts` |

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

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P2.4 | Manual UI verify: `bmsVersion: '25R2'` hides 26R1-only resources (after Phase 3 resources are added) | QA Engineer | HIGH | Phase 3 done |

### Done

| ID | Task | Completed |
|----|------|-----------|
| P2.1 | Added `bmsVersion` dropdown as first property in `Baramundi.node.ts` (options: 25R2, 26R1; default: 26R1) | 2026-03-30 |
| P2.2 | 25R2-only ops (IndustrialEndpoints) not in codebase — deferred. MaintenanceWindow versioning handled in Phase 4 (REQ-CHANGED-1) | 2026-03-30 |
| P2.3 | `getInstalledSoftwareByUniversalDynamicGroup` noted as 26R1+ in description. Resource-level gating applied to new 26R1 resources in Phase 3 | 2026-03-30 |

---

## Phase 3 — New Modules from 26R1 (REQ-NEWMODULES-1)

**Goal**: Implement two new resource modules introduced in 26R1, each gated with `bmsVersion: ['26R1']`.

**Prerequisite**: Phase 2 complete.

### Backlog

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P3.1 | Implement `compliance` module (8 read operations: Rules, Vulnerabilities, DetectedVulnerabilities, DetectedRuleViolations) | Backend Developer | HIGH | Phase 2 done |
| P3.2 | Write unit tests for `compliance` module | Test Engineer | HIGH | P3.1 |
| P3.3 | Implement `universalDynamicGroups` module (6 read operations: list/get groups + folder navigation) | Backend Developer | MEDIUM | Phase 2 done |
| P3.4 | Write unit tests for `universalDynamicGroups` module | Test Engineer | MEDIUM | P3.3 |
| P3.5 | Register both new modules in `Baramundi.node.ts` and `router.ts`; build and test | Backend Developer | HIGH | P3.1, P3.3 |

**Compliance operations** (spec: `bConnectOpenAPI/26R1/compliance.json`):
- `GET /v2.0/Rules` — list compliance rules
- `GET /v2.0/Rules/{id}` — get compliance rule
- `GET /v2.0/Vulnerabilities` — list vulnerabilities
- `GET /v2.0/Vulnerabilities/{id}` — get vulnerability
- `GET /v2.0/DetectedVulnerabilities` — list detected vulnerabilities
- `GET /v2.0/WindowsEndpoints/{endpointId}/DetectedVulnerabilities` — per endpoint
- `GET /v2.0/DetectedRuleViolations` — list detected rule violations
- `GET /v2.0/Endpoints/{endpointId}/DetectedRuleViolations` — per endpoint

**Universal Dynamic Groups operations** (spec: `bConnectOpenAPI/26R1/universaldynamicgroups.json`):
- `GET /v2.0/UniversalDynamicGroups` — list all
- `GET /v2.0/UniversalDynamicGroups/{id}` — get by ID
- `GET /v2.0/UniversalDynamicGroupsFolder` — list folders
- `GET /v2.0/UniversalDynamicGroupsFolder/{id}` — get folder
- `GET /v2.0/UniversalDynamicGroupsFolder/{folderId}/Folders` — list subfolders
- `GET /v2.0/Folders/{folderId}/UniversalDynamicGroups` — groups in folder

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

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P4.1 | `endpoint` module: add EntraId (4 ops) + UnmanagedEndpoints (3 ops), gated `bmsVersion: ['26R1']` | Backend Developer | HIGH | Phase 2 done |
| P4.2 | `defenseControl` module: add BitLocker Secrets V2.0 GET + PATCH, gated `bmsVersion: ['26R1']` | Backend Developer | HIGH | Phase 2 done |
| P4.3 | `software` module: add Bundles + BundleApplications + Bundle Folders (10 ops), gated `bmsVersion: ['26R1']` | Backend Developer | MEDIUM | Phase 2 done |
| P4.4 | `asset` module: add Get assets by ADObject + OrgUnit (2 ops), gated `bmsVersion: ['26R1']` | Backend Developer | MEDIUM | Phase 2 done |
| P4.5 | `serverManagement` module: add Dips MSWCleanup + SimulateMSWCleanup + ApiKeys + DownloadJobs (5 ops), gated `bmsVersion: ['26R1']` where applicable | Backend Developer | MEDIUM | Phase 2 done |
| P4.6 | REQ-CHANGED-1: MaintenanceWindow — gate existing PUT operations with `bmsVersion: ['25R2']`, add PATCH variants with `bmsVersion: ['26R1']` | Backend Developer | HIGH | Phase 2 done |
| P4.7 | Write unit tests for all new operations in P4.1–P4.6 | Test Engineer | HIGH | P4.1–P4.6 |
| P4.8 | Build and full unit test run — 0 errors, all tests pass | QA Engineer | HIGH | P4.7 |

### Done

| ID | Task | Completed |
|----|------|-----------|
| P4.1 | `endpoint` module: added EntraId (3 ops) + UnmanagedEndpoints (3 ops), gated `bmsVersion: ['26R1']` | 2026-03-30 |

---

## Phase 5 — Final QA & Package (REQ-VERSION-1 quality checklist)

**Goal**: Verify all quality checklist items from Requirements.md. Build distributable package.

**Prerequisite**: Phases 1–4 complete.

### Backlog

| ID | Task | Role | Priority | Depends on |
|----|------|------|----------|------------|
| P5.1 | Verify no `/v1.1/` URLs remain in any source file (`grep -r "v1.1" nodes/`) | QA Engineer | HIGH | Phase 4 done |
| P5.2 | Verify `bmsVersion: '25R2'` hides all 26R1-only resources in the node UI (manual `npx @n8n/node-cli dev`) | QA Engineer | HIGH | Phase 4 done |
| P5.3 | Verify `bmsVersion: '26R1'` hides all 25R2-only resources | QA Engineer | HIGH | Phase 4 done |
| P5.4 | Full test run including system tests (`npm run test`) — document pass/skip counts | QA Engineer | HIGH | Phase 4 done |
| P5.5 | Build package (`npm run build && npm pack`) — verify `.tgz` installs cleanly in n8n | DevOps Engineer | HIGH | P5.4 |
| P5.6 | Update CHANGELOG.md: document V1.1 removal, version targeting feature, new 26R1 operations | Technical Writer | MEDIUM | P5.5 |
| P5.7 | Update README.md: document `bmsVersion` parameter and version compatibility table | Technical Writer | MEDIUM | P5.5 |

### Done

*(empty)*

---

## Notes

- **System tests** (`test/system/`) require a live bMS server. They are skipped in CI unless `BMS_URL` env var is set. Do not block phases on system test results.
- **IndustrialEndpoints** (25R2-only, not yet in connector): Deferred — implement only if explicitly requested.
- **Version auto-detection** from `/bconnect/v2.0/Info`: Deferred to future enhancement (see Requirements.md open questions).
- **25R2 dropdown option**: Stays until ~2028 EOL.
