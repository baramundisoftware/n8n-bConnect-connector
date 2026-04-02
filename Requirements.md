# n8n-nodes-baramundi — Requirements

**Project**: n8n community node for baramundi Management Suite (bMS) via bConnect API
**Persona**: IT administrator using n8n to automate endpoint management workflows
**Node package**: `n8n-nodes-baramundi`
**Main node file**: `nodes/Baramundi/Baramundi.node.ts`

---

## Scope and Constraints

### ✅ REQ-SCOPE-1 — V2.0 API Only

**Status**: COMPLETED ✅ 2026-03-30

**Description**: The connector exposes **only bConnect V2.0 API** operations. All V1.1 operations are removed.

**Rationale**: V1.1 is a legacy API with different authentication patterns, inconsistent response shapes, and non-standard pagination. V2.0 is the strategic, fully-supported API. V1.1 operations complicate maintenance, testing, and version-targeting (see REQ-VERSION-1). baramundi GmbH recommends V2.0 for all new integrations.

**Modules to remove** (currently implemented as V1.1):

| Module directory | V1.1 resource |
|---|---|
| `actions/bitLockerSecrets/` | BitLocker Secrets (V1.1) — superseded by V2.0 in 26R1 |
| `actions/bootEnvironment/` | Boot Environments |
| `actions/complianceViolations/` | Compliance Violations (V1.1) — superseded by V2.0 Compliance in 26R1 |
| `actions/hardwareProfiles/` | Hardware Profiles |
| `actions/images/` | Images |
| `actions/inventoryAppScans/` | Inventory App Scans |
| `actions/inventoryDataCustomScans/` | Inventory Custom Scans |
| `actions/inventoryDataFileScans/` | Inventory File Scans |
| `actions/inventoryDataHardwareScans/` | Inventory Hardware Scans |
| `actions/inventoryDataRegistryScans/` | Inventory Registry Scans |
| `actions/inventoryDataSnmpScans/` | Inventory SNMP Scans |
| `actions/inventoryDataWMIScans/` | Inventory WMI Scans |
| `actions/inventoryOverviews/` | Inventory Overviews |
| `actions/orgUnit/` | Org Units (V1.1) |
| `actions/setupIntegrity/` | Setup Integrity |
| `actions/softwareScanRuleCounts/` | Software Scan Rule Counts |
| `actions/softwareScanRules/` | Software Scan Rules |
| `actions/ssh/` | SSH |
| `actions/vpp/` | Apple VPP |
| `actions/endpointInvSoftware/` | Endpoint Inventory Software — confirmed V1.1 (`GET /v1.1/EndpointInvSoftware`). V2.0 equivalent: `GET /v2.0/WindowsEndpoints/{endpointId}/InstalledWindowsSoftware` already in `software` module. |

**Quality**:
- [x] No V1.1 base URL (`/bconnect/v1.1/`) appears in any execute file
- [x] No imports from removed module directories in `router.ts` or `Baramundi.node.ts`
- [x] All removed resources removed from `Resource` dropdown
- [x] All tests referencing removed modules are deleted

---

### ✅ REQ-SCOPE-2 — No Documentation Endpoints

**Status**: COMPLETED ✅

**Description**: The connector does not expose bConnect endpoints whose sole purpose is serving API documentation or diagnostic/informational metadata (not management operations).

**Clarification needed**: Confirm with baramundi product team which specific paths are classified as "documentation endpoints" (Doku-Methoden). Until confirmed, the following categories are excluded by definition:

- Endpoints returning HTML, Markdown, or text/plain documentation content
- Swagger/OpenAPI self-description endpoints (`/swagger`, `/swagger.json`, `/api-docs`)
- Any path with tag `Documentation`, `Help`, or `Doku` in the OpenAPI spec

**Confirmed in scope (not doku)**: `POST /v2.0/Dips/MSWCleanup` and `POST /v2.0/Dips/SimulateMSWCleanup` are server management operations (DIP = Distribution Infrastructure Platform) and are included in the connector.

**Quality**:
- [ ] Product team has provided definitive list of "Doku-Methoden" to exclude
- [ ] List is referenced and checked against each version's OpenAPI spec

---

## ✅ REQ-VERSION-1 — bMS Version Targeting

**Status**: COMPLETED ✅ 2026-03-30

**Description**: The connector must know which version of baramundi Management Suite it targets. It exposes **only** the operations defined in the OpenAPI spec for that version. Operations not present in the targeted version are hidden from the n8n UI.

### Rationale

Different bMS versions expose different API operations:

| Version | Operation count | Notable additions vs previous |
|---|---|---|
| 25R2 | 228 | IndustrialEndpoints, MaintenanceWindow (PUT) |
| 26R1 | 264 | +36 ops: Compliance V2.0, UniversalDynamicGroups, Bundles, EntraId, UnmanagedEndpoints, BitLocker Secrets V2.0, DownloadJobs, ApiKeys |
| 26R2 (future) | TBD | TBD — spec added when released |

Showing 26R1 operations to a 25R2 server causes runtime API errors (404). Showing only valid operations prevents user confusion and avoids invalid workflow configurations.

### Design Decision: `bmsVersion` Node Parameter

The connector exposes `bmsVersion` as a **required node-level parameter** (dropdown), placed before the `Resource` selector.

**Why node parameter (not credential field)**:
- n8n `displayOptions.show` can only reference **other node parameters**, not credential fields
- `displayOptions` is the mechanism used to conditionally show/hide resources and operations
- A credential field alone cannot drive UI visibility — it requires a node parameter

**Why not credential field**:
- Credentials are environment-scoped (a production bMS server has a fixed version)
- However, since `displayOptions` cannot read credentials, an additional node parameter is still required
- Optional enhancement (post-initial): auto-detect version from `/bconnect/v2.0/Info` endpoint and pre-fill the parameter

**Node parameter definition**:
```typescript
{
  displayName: 'baramundi Management Suite Version',
  name: 'bmsVersion',
  type: 'options',
  required: true,
  noDataExpression: true,
  default: '26R1',
  description: 'Select the version of your baramundi Management Suite installation. Only operations supported by this version are shown.',
  options: [
    { name: '25R2', value: '25R2' },
    { name: '26R1', value: '26R1' },
    // 26R2 added here when spec is available
  ],
}
```

### Version-Specific Operation Visibility Rules

Operations fall into three categories:

**Category A — Common (all versions)**: No `displayOptions.bmsVersion` constraint needed. Available since at least 25R2 and unchanged in subsequent versions.

**Category B — Version-specific (present in some versions only)**: Requires `displayOptions.show.bmsVersion` constraint.

**Category C — Removed in newer version**: Requires `displayOptions.show.bmsVersion` to limit to the version(s) where it exists.

#### Version difference matrix (25R2 vs 26R1)

| Operation | 25R2 | 26R1 | displayOptions constraint |
|---|---|---|---|
| IndustrialEndpoints CRUD | ✅ | ❌ | `bmsVersion: ['25R2']` |
| Endpoint MaintenanceWindow (PUT) | ✅ | ❌ (replaced by PATCH) | `bmsVersion: ['25R2']` |
| LogicalGroup MaintenanceWindow (PUT) | ✅ | ❌ (replaced by PATCH) | `bmsVersion: ['25R2']` |
| Endpoint MaintenanceWindow (PATCH) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| LogicalGroup MaintenanceWindow (PATCH) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| EntraId data (GET/DELETE/POST) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| UnmanagedEndpoints (GET/DELETE) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| Compliance — Rules (GET) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| Compliance — Vulnerabilities (GET) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| Compliance — DetectedVulnerabilities (GET) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| Compliance — DetectedRuleViolations (GET) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| UniversalDynamicGroups CRUD | ❌ | ✅ | `bmsVersion: ['26R1']` |
| Bundles / BundleApplications CRUD | ❌ | ✅ | `bmsVersion: ['26R1']` |
| BitLocker Secrets V2.0 (GET/PATCH) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| DownloadJobs (GET) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| ApiKeys (GET) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| Assets by ADObject (GET) | ❌ | ✅ | `bmsVersion: ['26R1']` |
| Assets by OrgUnit (GET) | ❌ | ✅ | `bmsVersion: ['26R1']` |

**Note**: Operations not in this table are common to both versions (Category A) and need no version constraint.

### OpenAPI Spec as Source of Truth

The version-difference matrix above is derived from the OpenAPI specs in `/home/ansible/MCP/bConnectOpenAPI/`:

```
bConnectOpenAPI/
├── 25R2/                         # bMS 25R2 V2.0 specs (10 files)
│   ├── bConnect_ActiveDirectory.json
│   ├── bConnect_Assets.json
│   ├── bConnect_DefenseControl.json
│   ├── bConnect_Endpoints.json
│   ├── bConnect_Jobs.json
│   ├── bConnect_OperatingSystems.json
│   ├── bConnect_ServerManagement.json
│   ├── bConnect_Software.json
│   ├── bConnect_UpdateManagement.json
│   └── bConnect_Variables.json
└── 26R1/                         # bMS 26R1 V2.0 specs (12 files, +compliance +universaldynamicgroups)
    ├── activedirectory.json
    ├── assets.json
    ├── compliance.json            # NEW in 26R1
    ├── defensecontrol.json
    ├── endpoints.json
    ├── jobs.json
    ├── operatingsystems.json
    ├── servermanagement.json
    ├── software.json
    ├── universaldynamicgroups.json  # NEW in 26R1
    ├── updatemanagement.json
    └── variables.json
```

**Process for adding a new bMS version (e.g., 26R2)**:

1. Place new OpenAPI specs in `/home/ansible/MCP/bConnectOpenAPI/26R2/`
2. Run diff analysis against previous version (26R1) to identify added/removed paths
3. Add `'26R2'` to the `bmsVersion` dropdown options in `Baramundi.node.ts`
4. For each new operation: implement module code, add `displayOptions.show.bmsVersion: ['26R2']` (or add `'26R2'` to existing constraint if already in 26R1)
5. For each removed operation: add version exclusion to `displayOptions`
6. Update version difference matrix in this document

**Quality**:
- [x] `bmsVersion` parameter is the first parameter in the node (before `resource`)
- [x] All 25R2-only operations have `displayOptions.show.bmsVersion: ['25R2']`
- [x] All 26R1-only operations have `displayOptions.show.bmsVersion: ['26R1']`
- [x] Common operations have no `bmsVersion` constraint (they work for all versions)
- [x] Adding `bmsVersion: '25R2'` hides all 26R1-only resource options from `Resource` dropdown
- [x] No runtime API 404 errors when using correct version targeting
- [ ] Version matrix table in this document is regenerated whenever a new spec is added (deferred to next version release)

---

## ✅ REQ-NEWMODULES-1 — New V2.0 Modules from 26R1

**Status**: COMPLETED ✅ 2026-03-30

**Description**: 26R1 introduces two new spec files not present in 25R2. These require new module implementations in the connector.

### Compliance Module (26R1+)

**Spec file**: `bConnectOpenAPI/26R1/compliance.json`
**New resource**: `Compliance` in Resource dropdown
**displayOptions constraint**: `bmsVersion: ['26R1']`

Operations to implement:

| Operation | Method | Path | Read/Write |
|---|---|---|---|
| Get compliance rules | GET | `/v2.0/Rules` | Read |
| Get compliance rule | GET | `/v2.0/Rules/{id}` | Read |
| Get vulnerabilities | GET | `/v2.0/Vulnerabilities` | Read |
| Get vulnerability | GET | `/v2.0/Vulnerabilities/{id}` | Read |
| Get detected vulnerabilities | GET | `/v2.0/DetectedVulnerabilities` | Read |
| Get endpoint detected vulnerabilities | GET | `/v2.0/WindowsEndpoints/{endpointId}/DetectedVulnerabilities` | Read |
| Get detected rule violations | GET | `/v2.0/DetectedRuleViolations` | Read |
| Get endpoint detected rule violations | GET | `/v2.0/Endpoints/{endpointId}/DetectedRuleViolations` | Read |

**Module file**: `nodes/Baramundi/actions/compliance/`

### Universal Dynamic Groups Module (26R1+)

**Spec file**: `bConnectOpenAPI/26R1/universaldynamicgroups.json`
**New resource**: `Universal Dynamic Group` in Resource dropdown
**displayOptions constraint**: `bmsVersion: ['26R1']`

Operations to implement (verify exact paths from spec):

| Operation | Method | Path | Read/Write |
|---|---|---|---|
| List universal dynamic groups | GET | `/v2.0/UniversalDynamicGroups` | Read |
| Get universal dynamic group | GET | `/v2.0/UniversalDynamicGroups/{id}` | Read |
| List folders | GET | `/v2.0/UniversalDynamicGroupsFolder` | Read |
| Get folder | GET | `/v2.0/UniversalDynamicGroupsFolder/{id}` | Read |
| List subfolders | GET | `/v2.0/UniversalDynamicGroupsFolder/{folderId}/Folders` | Read |
| List groups in folder | GET | `/v2.0/Folders/{folderId}/UniversalDynamicGroups` | Read |

**Module file**: `nodes/Baramundi/actions/universalDynamicGroups/`

**Quality**:
- [x] Compliance resource only visible when `bmsVersion` is `26R1` or later
- [x] Universal Dynamic Groups resource only visible when `bmsVersion` is `26R1` or later
- [x] Full spec review completed for each new module before implementation

---

## ✅ REQ-NEWOPS-1 — New Operations in Existing Modules (26R1)

**Status**: COMPLETED ✅ 2026-03-30

**Description**: Several existing modules gain new operations in 26R1. These must be added with correct version constraints.

### Endpoints Module Additions (26R1)

| Operation | Method | Path | displayOptions |
|---|---|---|---|
| Get EntraId data | GET | `/v2.0/Endpoints/{endpointId}/EntraIdData` | `bmsVersion: ['26R1']` |
| Get EntraId data by device | GET | `/v2.0/EntraIdData/{deviceId}` | `bmsVersion: ['26R1']` |
| Delete EntraId data | DELETE | `/v2.0/Endpoints/{endpointId}/EntraIdData` | `bmsVersion: ['26R1']` |
| Enroll EntraId | POST | `/v2.0/Endpoints/{endpointId}/EntraIdData` | `bmsVersion: ['26R1']` |
| List unmanaged endpoints | GET | `/v2.0/UnmanagedEndpoints` | `bmsVersion: ['26R1']` |
| Get unmanaged endpoint | GET | `/v2.0/UnmanagedEndpoints/{id}` | `bmsVersion: ['26R1']` |
| Delete unmanaged endpoint | DELETE | `/v2.0/UnmanagedEndpoints/{id}` | `bmsVersion: ['26R1']` |

### DefenseControl Module Additions (26R1)

| Operation | Method | Path | displayOptions |
|---|---|---|---|
| Get BitLocker secrets V2.0 | GET | `/v2.0/BitLocker/WindowsEndpoints/{id}/Secrets` | `bmsVersion: ['26R1']` |
| Update BitLocker secrets V2.0 | PATCH | `/v2.0/BitLocker/WindowsEndpoints/{id}/Secrets` | `bmsVersion: ['26R1']` |

**Note**: The existing V1.1 BitLocker Secrets module is removed (REQ-SCOPE-1). The V2.0 BitLocker Secrets operations (26R1+) replace it but with different fields and schema.

### Software Module Additions (26R1)

| Operation | Method | Path | displayOptions |
|---|---|---|---|
| List bundles | GET | `/v2.0/Bundles` | `bmsVersion: ['26R1']` |
| Get bundle | GET | `/v2.0/Bundles/{id}` | `bmsVersion: ['26R1']` |
| Create bundle | POST | `/v2.0/Bundles` | `bmsVersion: ['26R1']` — **Write** |
| List bundle applications | GET | `/v2.0/BundleApplications` | `bmsVersion: ['26R1']` |
| Delete bundle application | DELETE | `/v2.0/BundleApplications/{id}` | `bmsVersion: ['26R1']` — **Write** |
| List bundle folders | GET | `/v2.0/Bundle/Folders` | `bmsVersion: ['26R1']` |
| Get bundle folder | GET | `/v2.0/Bundle/Folders/{id}` | `bmsVersion: ['26R1']` |
| Create bundle folder | POST | `/v2.0/Bundle/Folders` | `bmsVersion: ['26R1']` — **Write** |
| Update bundle folder | PATCH | `/v2.0/Bundle/Folders/{id}` | `bmsVersion: ['26R1']` — **Write** |
| Delete bundle folder | DELETE | `/v2.0/Bundle/Folders/{id}` | `bmsVersion: ['26R1']` — **Write** |

### Assets Module Additions (26R1)

| Operation | Method | Path | displayOptions |
|---|---|---|---|
| Get assets by AD object | GET | `/v2.0/ADObjects/{adObjectId}/Assets` | `bmsVersion: ['26R1']` |
| Get assets by org unit | GET | `/v2.0/OrgUnits/{orgUnitId}/Assets` | `bmsVersion: ['26R1']` |

### ServerManagement Module Additions (26R1)

**Dips** (Distribution Infrastructure Platform — server infrastructure management):

| Operation | Method | Path | displayOptions | Note |
|---|---|---|---|---|
| Get DIP status | GET | `/v2.0/Dips` | none (common, 25R2+) | Read — already in 25R2 |
| Perform MSW cleanup | POST | `/v2.0/Dips/MSWCleanup` | `bmsVersion: ['26R1']` | **Write** — deletes unused software files on Master DIP |
| Simulate MSW cleanup | POST | `/v2.0/Dips/SimulateMSWCleanup` | `bmsVersion: ['26R1']` | **Write** — dry-run preview, no destructive effect |

**Other additions**:

| Operation | Method | Path | displayOptions |
|---|---|---|---|
| List API keys | GET | `/v2.0/ApiKeys` | `bmsVersion: ['26R1']` |
| List download jobs | GET | `/v2.0/DownloadJobs` | `bmsVersion: ['26R1']` |
| Get download job | GET | `/v2.0/DownloadJobs/{id}` | `bmsVersion: ['26R1']` |

---

## ✅ REQ-CHANGED-1 — Changed Operations Between Versions

**Status**: COMPLETED ✅ 2026-03-30

**Description**: Some operations change HTTP method or signature between versions. Both variants must be implemented with correct version gating.

### Maintenance Window: PUT (25R2) → PATCH (26R1)

In 25R2, maintenance windows use `PUT` (full replacement).
In 26R1, maintenance windows use `PATCH` (partial update via JSON Patch).
These are **not the same operation** and must be presented as separate versioned operations.

| Operation | 25R2 | 26R1 |
|---|---|---|
| Set endpoint maintenance window | `PUT /v2.0/Endpoints/{id}/MaintenanceWindow` | `PATCH /v2.0/Endpoints/{id}/MaintenanceWindow` |
| Set logical group maintenance window | `PUT /v2.0/LogicalGroups/{id}/MaintenanceWindow` | `PATCH /v2.0/LogicalGroups/{id}/MaintenanceWindow` |

**Implementation**: Two separate operation entries in the `endpoint` / `orgUnit` resource with distinct `displayOptions.show.bmsVersion` constraints.

---

## ✅ REQ-CREDENTIALS-1 — Credential Definition

**Status**: COMPLETED ✅

**Description**: The `BconnectApi` credential stores connection details for a bConnect server.

**Current fields**:
- `baseUrl` — Base URL of the bConnect server (e.g., `https://bms-server:444/bconnect`)
- `username` / `password` — Basic auth credentials
- `ignoreSslIssues` — Skip TLS certificate validation

**No change required**: The credential does not store `bmsVersion`. Version selection is handled at the node level (see REQ-VERSION-1) because n8n `displayOptions` cannot reference credential fields.

---

## ✅ REQ-EXISTING-1 — Existing V2.0 Common Operations

**Status**: COMPLETED ✅ (subject to V1.1 removal and version gating)

**Description**: The following modules are fully implemented in V2.0 and common to all supported versions (25R2+). They require no version constraint after V1.1 modules are removed.

| Module | Resource name | Operations |
|---|---|---|
| activeDirectory | Active Directory | ~8 ops |
| asset | Asset | ~15 ops |
| defenseControl | Defense Control | ~11 V2.0 ops |
| endpoint | Endpoint | ~40+ ops |
| job | Job | ~20+ ops |
| operatingSystem | Operating System | ~5 ops |
| serverManagement | Server Management | ~15 ops |
| software | Software | ~10 ops |
| updateManagement | Update Management | ~10 ops |
| variable | Variable | ~13 ops |

**Note**: `defenseControl` gains additional version-gated operations in 26R1 (see REQ-NEWOPS-1).

---

## Process: Adding a Future bMS Version

When a new bMS version (e.g., 26R2) is released:

1. **Add spec**: Place OpenAPI JSON files in `/home/ansible/MCP/bConnectOpenAPI/26R2/`
2. **Diff**: Run path comparison against 26R1 specs to identify additions, removals, and changes
3. **Update dropdown**: Add `{ name: '26R2', value: '26R2' }` to `bmsVersion` options
4. **Propagate existing 26R1 ops**: For operations currently constrained to `bmsVersion: ['26R1']` that still exist in 26R2, extend to `bmsVersion: ['26R1', '26R2']`
5. **New ops**: Implement new module code with `bmsVersion: ['26R2']`
6. **Removed ops**: Add version ceiling to `displayOptions` for removed operations
7. **Update this document**: Refresh version difference matrix and operation tables

---

## Open Questions

1. ~~**Doku-Methoden (REQ-SCOPE-2)**~~ — **Resolved**: Satisfied by REQ-SCOPE-1 (V1.1 removal). No V2.0 documentation endpoints exist. ✅

2. ~~**`endpointInvSoftware` module**~~ — **Resolved**: Confirmed V1.1. Removed per REQ-SCOPE-1. V2.0 equivalent (`InstalledWindowsSoftware`) already covered by the `software` module. ✅

3. **Version auto-detection**: Should the connector attempt to auto-detect bMS version from `/bconnect/v2.0/Info` or similar endpoint and pre-fill `bmsVersion`? Deferred to future enhancement.

4. **25R2 sunset**: Expected end-of-life ~2028. The `25R2` option stays in the `bmsVersion` dropdown until then. Plan removal when EOL is officially confirmed.

---

## Audit Findings Phase — IT Audit 2026-03-30

**Source**: Full IT audit conducted 2026-03-30.
**Scope**: Source code, dependency chain, test coverage, credentials, file-system posture.

| ID | Finding | Severity | Status |
|---|---|---|---|
| REQ-AUDIT-F1.1 | Basic Auth only — no token/API key support | MEDIUM | ✅ DONE |
| REQ-AUDIT-F1.2 | SSL bypass silently disables TLS — no UI warning | MEDIUM | ✅ DONE |
| REQ-AUDIT-F2.1 | ISO 8601 validator too permissive (`new Date()` accepts non-ISO) | MEDIUM | ✅ DONE |
| REQ-AUDIT-F2.2 | Dropdown loaders silently truncate at 100 items | MEDIUM | ✅ DONE |
| REQ-AUDIT-F3.1 | Critical/High CVEs in devDependencies (handlebars, minimatch) | HIGH | ✅ DONE |
| REQ-AUDIT-F3.2 | Stale v0.1.0 distribution archives committed to repo | HIGH | ✅ DONE |
| REQ-AUDIT-F4.1 | 12 `as any` casts in `Baramundi.node.ts` LoadOptions | LOW | ✅ DONE |
| REQ-AUDIT-F4.2 | `any` parameters in error/validation utilities | LOW | ✅ DONE |
| REQ-AUDIT-F5.1 | World-writable file permissions (777/666) | HIGH | ✅ DONE |
| REQ-AUDIT-F5.2 | ESLint binary non-executable — linting not enforced in CI | MEDIUM | ✅ DONE |
| REQ-AUDIT-F6.1 | Pagination cap allows 100K-item fetches (DoS risk) | MEDIUM | ✅ DONE |
| REQ-AUDIT-F6.2 | No retry/backoff on HTTP 429/503 | MEDIUM | ✅ DONE |

---

### ✅ REQ-AUDIT-F2.1 — Strict ISO 8601 Datetime Validation

**Status**: COMPLETED ✅ 2026-03-30

**Description**: `validateIso8601DateTime()` used `new Date()` as its sole parse check, which silently accepts non-ISO formats such as `"March 30, 2026"`, `"01/22/2026"`, and `"2026-01-22 10:30:00"` (space separator). These are forwarded to the bConnect API, producing unclear errors.

**Implementation**: Replaced with a strict regex (`ISO8601_STRICT`) that enforces `YYYY-MM-DDTHH:MM:SS[.sss][Z|±HH:MM]` before falling through to `new Date()` as a secondary calendar sanity check (catches e.g. Feb 30). 9 new unit tests added; all 105 validation tests pass.

**Quality**:
- [x] Strict regex enforces `T` separator, numeric month/day/hour ranges
- [x] Date-only strings (`2026-01-22`) rejected
- [x] Space-separated strings (`2026-01-22 10:30:00`) rejected
- [x] Human-readable strings (`March 30, 2026`, `01/22/2026`) rejected
- [x] Valid forms with Z, ±HH:MM offset, and milliseconds still accepted
- [x] 105 validation unit tests passing

---

### ✅ REQ-AUDIT-F2.2 — Dropdown Loader Truncation Indicator

**Status**: COMPLETED ✅ 2026-03-30

**Description**: All six `LoadOptions` methods (`getEndpoints`, `getJobDefinitions`, `getOrgUnits`, `getLogicalGroups`, `getStaticGroups`, `getDynamicGroups`) fetched only the first page (100 items). In environments with >100 items the dropdown silently omitted remaining entries, potentially causing operators to select wrong targets.

**Implementation**: Each method now reads `response.hasNextPage` from the bConnect V2.0 paginated response. When `true`, a sentinel option `"— showing first 100 results, use GUID input for more —"` is appended to the dropdown. No additional API calls are made.

**Quality**:
- [x] All 6 LoadOptions methods check `hasNextPage`
- [x] Truncation sentinel appended only when `hasNextPage === true`
- [x] No sentinel shown when all items fit in first page
- [x] 471 unit tests passing

---

### ✅ REQ-AUDIT-F1.1 — Token / API Key Authentication Support

**Status**: COMPLETED ✅ 2026-04-01 — Risk acceptance (Basic Auth only)

**Investigation (2026-04-01)**: All 24 OpenAPI spec files across both 25R2 and 26R1 declare `basicAuth` as the sole security scheme. The `GET /v2.0/ApiKeys` endpoint manages bConnect API keys but does not enable token-based authentication for this connector. No OAuth 2.0, Bearer token, or API key authentication mechanism exists in the bConnect V2.0 API.

**Outcome**: Risk acceptance documented directly in `credentials/BconnectApi.credentials.ts` with service-account hardening guidance:
- Use a dedicated service account (least-privilege, no interactive logon)
- Rotate password on the bMS password policy schedule
- Store in n8n's encrypted credential store (never in workflow JSON)
- Keep `ignoreSslIssues: false` to prevent in-transit interception
- Restrict network access so only the n8n host can reach the bMS server

**Quality**:
- [x] bConnect API documentation reviewed for non-Basic auth support (all specs audited)
- [x] Risk acceptance documented; service-account guidance in `BconnectApi.credentials.ts`
- [x] Existing `BconnectApi` credential unchanged — no breaking changes to deployed workflows
- [ ] If baramundi adds token auth in a future release: implement `BconnectApiToken` at that time

---

### ✅ REQ-AUDIT-F1.2 — SSL Bypass UI Warning

**Status**: COMPLETED ✅ 2026-03-30

**Description**: The `ignoreSslIssues` field defaults to `false` (secure) but provides no UI warning when enabled. Users can silently open all API traffic to MitM attacks with no visible indication.

**Implementation**:
1. Add `notice`-type property after `ignoreSslIssues` in `BconnectApi.credentials.ts`, visible only when `ignoreSslIssues: true`:
   - Warning text: SSL validation disabled; MitM risk; test environments only; recommend CA import instead
2. README.md: add section on importing a custom CA for self-signed bMS certificates as the preferred alternative

**Quality**:
- [x] `notice` property implemented with `displayOptions: { show: { ignoreSslIssues: [true] } }`
- [x] Warning text names MitM risk and recommends CA import
- [ ] README.md CA import guidance added (deferred — no user request yet)
- [x] `ignoreSslIssues` default remains `false` in credential definition and all test mocks

---

### ✅ REQ-AUDIT-F3.1 — DevDependency CVE Monitoring

**Status**: COMPLETED ✅ 2026-03-30

**Description**: 11 vulnerabilities remain in `devDependencies` after `npm audit fix` (2026-03-30): `handlebars` CRITICAL and `minimatch` HIGH via `@n8n/node-cli` have no upstream fix. Runtime package has 0 CVEs.

**Requirements**:
1. Add CI gate: `npm audit --omit=dev --audit-level=high` must exit 0 (runtime-only check)
2. Track `@n8n/node-cli` upstream for handlebars/minimatch fixes; upgrade when available
3. Document current devDependency risk acceptance in SECURITY.md or CHANGELOG with rationale

**Quality**:
- [x] CI pipeline runs `npm audit --omit=dev --audit-level=high` as a required check (`.github/workflows/ci.yml`)
- [ ] Upstream issue filed or tracked for `@n8n/node-cli` handlebars/minimatch (monitor upstream; no fix available)
- [x] Risk acceptance note in CHANGELOG (v0.2.0 Security section)

---

### ✅ REQ-AUDIT-F3.2 — Remove Stale Distribution Archives

**Status**: COMPLETED ✅ 2026-03-30

**Description**: Three v0.1.0 distribution artifacts are present in the working directory (`n8n-nodes-baramundi-0.1.0.tgz`, `n8n-baramundi-distribution-v0.1.0.tar.gz`, `n8n-baramundi-distribution-v0.1.0.zip`). These predate Phase 6 security remediations and could be deployed by mistake.

**Implementation**:
1. Delete all three files
2. Add `*.tgz`, `*.tar.gz`, `*.zip` to `.gitignore`
3. Verify `.gitignore` also excludes `dist/` from version control

**Quality**:
- [x] All three v0.1.0 archives deleted from working directory
- [x] `.gitignore` excludes `*.tgz`, `*.tar.gz`, `*.zip`
- [x] `npm pack` remains the only mechanism for producing a distributable

---

### ✅ REQ-AUDIT-F4.1 — Replace `as any` Casts in LoadOptions

**Status**: COMPLETED ✅ 2026-03-30

**Description**: 12 `as any` casts in `Baramundi.node.ts` LoadOptions methods bypass TypeScript's type checker (`this as any`, `response.data as any[]`, `endpoint/job/group/orgUnit as any`). A malformed API response (object instead of array) produces unclear runtime failures.

**Implementation**: Define a typed bConnect V2.0 paginated response interface and use it in all LoadOptions methods.

```typescript
interface BConnectPagedResponse<T> {
  data: T[];
  totalItems: number;
  hasNextPage: boolean;
}
```

**Quality**:
- [x] `BConnectPagedResponse<T>` interface defined in `utils/types.ts`
- [x] All `response.data as any[]` casts replaced with typed access
- [x] `endpoint/job/group as any` casts replaced with typed interfaces per resource
- [x] `this as unknown as IExecuteFunctions` in LoadOptions documented with a comment explaining the n8n framework constraint
- [x] TypeScript strict mode still passing with 0 errors

---

### ✅ REQ-AUDIT-F4.2 — Replace `any` in Utility Function Signatures

**Status**: COMPLETED ✅ 2026-03-30

**Description**: Error utility functions use `error: any` parameters; `extractResourceLocatorValue` uses `value: any`. The `any` type disables type narrowing and allows invalid inputs to silently produce empty-string returns.

**Implementation**:
1. Change `error: any` to `error: unknown` in `errorMessages.ts` — add explicit type narrowing guards
2. Change `value: any` to `value: unknown` in `extractResourceLocatorValue` — add type guards for string and resourceLocator object

**Quality**:
- [x] All `error: any` parameters replaced with `error: unknown` + `asErrorLike()` guard in `errorMessages.ts`
- [x] All `value: any` parameters replaced with `value: unknown` + type guard in `extractResourceLocatorValue`
- [x] Explicit type narrowing (`typeof`, `instanceof`, `in`) used before accessing properties
- [x] 0 TypeScript errors, all existing tests passing

---

### ✅ REQ-AUDIT-F5.1 — File and Directory Permission Hardening

**Status**: COMPLETED ✅ 2026-03-30

**Description**: All project files are world-writable (`666`) and directories world-writable (`777`). On a shared system or container, any local process can modify source files or the compiled `dist/` output that n8n executes.

**Implementation**:
```bash
find /home/ansible/MCP/n8nconnector -type d -exec chmod 755 {} \;
find /home/ansible/MCP/n8nconnector -type f -exec chmod 644 {} \;
chmod 755 start-n8n-dev.sh
```

Add a CI step to verify permissions after checkout, or configure the repository's `umask` in the container entrypoint.

**Quality**:
- [x] All source files: `644` (owner rw, group/other r)
- [x] All directories: `755` (owner rwx, group/other rx)
- [x] Executable scripts (`start-n8n-dev.sh`): `755`
- [ ] CI pipeline does not run from a world-writable checkout (CI environment responsibility)

---

### ✅ REQ-AUDIT-F5.2 — ESLint CI Enforcement

**Status**: COMPLETED ✅ 2026-03-30

**Description**: The ESLint binary in `node_modules/.bin/` is not executable (`npm run lint` fails with `Permission denied`). This means linting — including 50+ n8n-specific security/convention rules — has not been running on recent commits.

**Implementation**:
1. Fix immediately: `chmod +x node_modules/.bin/eslint node_modules/.bin/eslint-config-prettier`
2. Add `npm run lint` as a required step in the CI pipeline (non-zero exit code blocks merge)
3. Address root cause: ensure `npm install` preserves executable bits (related to F5.1 permission issue)

**Quality**:
- [x] `npm run lint` exits 0 (0 errors, 4 pre-existing warnings from n8n-nodes-base display-name rules)
- [x] CI pipeline has a mandatory lint step that blocks on failure (`.github/workflows/ci.yml`)
- [x] All 50+ `n8n-nodes-base` ESLint rules enforced (configured via `tsconfig.eslint.json`)

---

### ✅ REQ-AUDIT-F6.1 — Pagination Cap and Max-Items Parameter

**Status**: COMPLETED ✅ 2026-03-30

**Description**: `apiRequestAllItems()` has a safety break at `page > 1000` (100,000 items). In large environments this can issue 1,000 sequential API calls, exhaust server resources, trigger rate-limits, time out the n8n worker, or exhaust worker memory.

**Implementation**:
1. Lower default cap to 50 pages (5,000 items)
2. Expose a `Max Items` user parameter on operations that call `apiRequestAllItems` (default 500, max 5,000)
3. Log a warning in the node output when the cap is reached: `{ warning: "Result set truncated at N items. Increase Max Items or filter results." }`

**Quality**:
- [x] Default page cap reduced to 50 (`MAX_PAGE_CAP = 50`)
- [x] `maxItems` parameter (default 5000) controls total item limit
- [x] Truncation sentinel included in output when cap is reached
- [x] 3 new unit tests; all passing

---

### ✅ REQ-AUDIT-F6.2 — HTTP Retry with Exponential Backoff

**Status**: COMPLETED ✅ 2026-03-30

**Description**: `apiRequest()` has no retry logic. HTTP 429 (rate limit) and 503 (service unavailable) responses fail immediately. Workflows triggered at high frequency (cron) will produce cascading failures with no self-healing.

**Implementation**: Add retry logic in `requestApi.ts` for transient errors:
- Retry on: HTTP 429, 503, network timeouts (`ETIMEDOUT`)
- Maximum retries: 3
- Backoff: exponential with jitter — wait `(2^attempt × 100ms) + random(0–100ms)` before each retry
- Respect `Retry-After` header if present on 429 responses
- Do not retry on: 400, 401, 403, 404, 409, 422 (client errors — retrying won't help)

**Quality**:
- [x] Retry logic implemented for 429, 503, ETIMEDOUT in `requestApi.ts`
- [x] Maximum 3 retries with exponential backoff + jitter (`2^attempt × 100ms + random(0–100ms)`)
- [x] `Retry-After` header honoured on 429 responses
- [x] Client error codes (4xx except 429) are not retried
- [x] 6 new unit tests covering retry behaviour; all passing

---

## REQ-RELEASE-1 — v0.4.2 Security Patch Release

**Status**: OPEN

**Description**: The IT Audit (2026-04-01) identified and fixed 8 findings in a single session. These changes must be packaged as a versioned release with a proper CHANGELOG entry before any further development work.

**Scope of changes in this release**:
- V-1/V-2 (CRITICAL): `validateGuid()` added to all 18+ `*Id` parameters in `asset.execute.ts`
- V-3 (CRITICAL): `validateGuid()` added to `getEndpointMaintenanceWindow()` and `getGroupMaintenanceWindow()`; ESLint rule caught and fixed 26 additional unvalidated `*Id` params in `endpoint.execute.ts`
- V-4 (HIGH): `validateODataString()` added to `validation.ts`; applied to all 12 execute files (100+ call sites)
- A-1 (MEDIUM): Hardcoded fallback credentials removed from `test/system/setup.ts`
- ESLint rule `local/require-guid-validation` added to `eslint.config.mjs` — prevents future regression
- `SECURITY.md` created with vulnerability reporting policy and dev-dependency risk acceptance
- Negative GUID test cases added to `asset.execute.test.ts`
- `hint` property added to all `returnAll` parameters in all 12 fields files

**Quality**:
- [ ] `CHANGELOG.md` updated with v0.4.2 entry
- [ ] `package.json` version bumped to `0.4.2`
- [ ] All 547+ unit tests passing
- [ ] Zero ESLint errors
- [ ] Git tag `v0.4.2` created
- [ ] Distribution package rebuilt

---

## REQ-API-AD-1 — Active Directory Contextual Navigation

**Status**: OPEN

**Description**: The Active Directory module is missing 6 contextual read operations present in the 26R1 spec. These allow navigating the AD hierarchy (sub-groups within groups, objects within groups, OU children).

**Missing operations** (all GET, 26R1+):

| Operation | Path |
|---|---|
| Get AD groups by AD group | `GET /v2.0/ADGroups/{adGroupId}/ADGroups` |
| Get AD objects by AD group | `GET /v2.0/ADGroups/{adGroupId}/ADObjects` |
| Get AD object memberships | `GET /v2.0/ADObjects/{id}/ADGroupMemberships` |
| Get AD objects by org unit | `GET /v2.0/OrgUnits/{orgUnitId}/ADObjects` |
| Get AD users by org unit | `GET /v2.0/OrgUnits/{orgUnitId}/ADUsers` |
| Get org units by org unit | `GET /v2.0/OrgUnits/{orgUnitId}/OrgUnits` |

**Module**: `nodes/Baramundi/actions/activeDirectory/`

**Quality**:
- [ ] All 6 operations implemented in `activeDirectory.execute.ts`
- [ ] All 6 operations exposed in `activeDirectory.fields.ts` with correct `displayOptions`
- [ ] `validateGuid()` called on all ID parameters
- [ ] Pagination + OData validation applied where applicable
- [ ] Minimum 2 unit tests per operation
- [ ] Active Directory module coverage ≥ 90%

---

## REQ-API-ENDPOINT-1 — Platform-Specific Endpoint CRUD

**Status**: OPEN

**Description**: The connector currently only supports Windows endpoint Create and Update. The spec defines Create/Update/Enrollment for Android, iOS, Linux, macOS, and Network endpoints. Each platform has a distinct request body schema.

**Missing operations**:

| Platform | Create | Update (PATCH) | Start Enrollment |
|---|---|---|---|
| Android | `POST /v2.0/AndroidEndpoints` | `PATCH /v2.0/AndroidEndpoints/{id}` | `POST /v2.0/AndroidEndpoints/{id}/StartEnrollment` |
| iOS | `POST /v2.0/IosEndpoints` | `PATCH /v2.0/IosEndpoints/{id}` | `POST /v2.0/IosEndpoints/{id}/StartEnrollment` |
| Linux | `POST /v2.0/LinuxEndpoints` | `PATCH /v2.0/LinuxEndpoints/{id}` | — |
| macOS | `POST /v2.0/MacEndpoints` | `PATCH /v2.0/MacEndpoints/{id}` | `POST /v2.0/MacEndpoints/{id}/StartEnrollment` |
| Network | `POST /v2.0/NetworkEndpoints` | `PATCH /v2.0/NetworkEndpoints/{id}` | — |

**Design note**: Each platform's Create has different required fields (e.g., Android requires MDM enrolment type; iOS requires Apple Push Notification certificate). Use the `platformType` dropdown pattern already in place for `getMany`, extending it to create/update operations.

**Module**: `nodes/Baramundi/actions/endpoint/`

**Quality**:
- [ ] Create operation implemented for each of the 5 platforms
- [ ] Update (PATCH) operation implemented for each of the 5 platforms
- [ ] StartEnrollment implemented for Android, iOS, macOS
- [ ] `validateGuid()` on all ID parameters
- [ ] Platform-specific required fields documented in `displayName` / `description`
- [ ] Minimum 2 unit tests per platform per operation

---

## REQ-API-ENDPOINT-2 — Group-Scoped Endpoint Queries

**Status**: OPEN

**Description**: Multiple "get endpoints in group" operations exist in the spec but are not implemented. These are needed for group-targeted automation workflows (e.g., "patch all endpoints in logical group X").

**Missing operations** (all GET with pagination):

| Operation | Path |
|---|---|
| Endpoints by logical group | `GET /v2.0/LogicalGroups/{id}/Endpoints` |
| Endpoints by static group | `GET /v2.0/StaticGroups/{id}/Endpoints` |
| Endpoints by UDG | `GET /v2.0/UniversalDynamicGroups/{id}/Endpoints` |
| Endpoints by AD user | `GET /v2.0/ADUsers/{id}/Endpoints` |
| Endpoints by dynamic group | `GET /v2.0/DynamicGroups/{id}/Endpoints` |
| Windows endpoints by logical group | `GET /v2.0/LogicalGroups/{id}/WindowsEndpoints` |
| Windows endpoints by static group | `GET /v2.0/StaticGroups/{id}/WindowsEndpoints` |
| Windows endpoints by dynamic group | `GET /v2.0/DynamicGroups/{id}/WindowsEndpoints` |
| Windows endpoints by UDG | `GET /v2.0/UniversalDynamicGroups/{id}/WindowsEndpoints` |
| Windows endpoints by AD user | `GET /v2.0/ADUsers/{id}/WindowsEndpoints` |

(Android, iOS, Linux, macOS, Network equivalents exist — implement as a second pass after REQ-API-ENDPOINT-1 is done)

**Quality**:
- [ ] All 10 operations above implemented
- [ ] `validateGuid()` on all group/user ID parameters
- [ ] Pagination (`returnAll` + `limit`) + OData validation applied
- [ ] Minimum 2 unit tests per operation

---

## REQ-API-JOB-1 — Job Folder Navigation and Kiosk Context Queries

**Status**: OPEN

**Description**: Three read operations in the Jobs module are missing: sub-folder listing, job definitions by folder, and kiosk releases by job definition.

**Missing operations**:

| Operation | Path |
|---|---|
| Get sub-folders of a job folder | `GET /v2.0/Folders/{id}/Folders` |
| Get job definitions in a folder | `GET /v2.0/Folders/{id}/JobDefinitions` |
| Get kiosk releases by job definition | `GET /v2.0/JobDefinitions/{id}/KioskReleases` |
| Get kiosk releases by endpoint | `GET /v2.0/Endpoints/{id}/KioskReleases` |
| Get kiosk releases by logical group | `GET /v2.0/LogicalGroups/{id}/KioskReleases` |
| Get kiosk releases by AD object | `GET /v2.0/ADObjects/{id}/KioskReleases` |

**Module**: `nodes/Baramundi/actions/job/`

**Quality**:
- [ ] All 6 operations implemented
- [ ] `validateGuid()` on all ID parameters
- [ ] Minimum 2 unit tests per operation
- [ ] Jobs module spec coverage ≥ 85%

---

## REQ-API-JOB-2 — Job Instances by Group and Job Assignment

**Status**: OPEN

**Description**: Workflows often need to query job execution history per group, and assign jobs to groups. Neither is currently supported.

**Missing operations**:

| Operation | Path |
|---|---|
| Job instances by logical group | `GET /v2.0/LogicalGroups/{id}/JobInstances` |
| Job instances by static group | `GET /v2.0/StaticGroups/{id}/JobInstances` |
| Job instances by dynamic group | `GET /v2.0/DynamicGroups/{id}/JobInstances` |
| Job instances by UDG | `GET /v2.0/UniversalDynamicGroups/{id}/JobInstances` |
| Assign job to logical group | `POST /v2.0/LogicalGroups/{id}/AssignJobDefinition` |
| Assign job to static group | `POST /v2.0/StaticGroups/{id}/AssignJobDefinition` |
| Assign job to dynamic group | `POST /v2.0/DynamicGroups/{id}/AssignJobDefinition` |
| Assign job to UDG | `POST /v2.0/UniversalDynamicGroups/{id}/AssignJobDefinition` |

**Quality**:
- [ ] All 8 operations implemented
- [ ] `validateGuid()` on all ID parameters; `validateGuid()` on job definition ID in assign operations
- [ ] AssignJobDefinition uses the existing `jobSelection` hybrid-dropdown pattern for job ID input
- [ ] Minimum 2 unit tests per operation

---

## REQ-API-SOFTWARE-1 — Bundle Application Management

**Status**: OPEN

**Description**: Software bundles are manageable but their constituent applications cannot be added, replaced, or deleted. Top-level `BundleApplications` endpoints are also missing.

**Missing operations**:

| Operation | Path |
|---|---|
| Add application to bundle | `POST /v2.0/Bundles/{id}/BundleApplications` |
| Replace application in bundle | `PATCH /v2.0/Bundles/{bundleId}/BundleApplications/{appId}` |
| Get all bundle applications | `GET /v2.0/BundleApplications` |
| Delete bundle application | `DELETE /v2.0/BundleApplications/{id}` |
| Update bundle folder | `PATCH /v2.0/Bundle/Folders/{id}` |

**Module**: `nodes/Baramundi/actions/software/`

**Quality**:
- [ ] All 5 operations implemented
- [ ] `validateGuid()` on all ID parameters
- [ ] Minimum 2 unit tests per operation
- [ ] Software module coverage reaches 100%

---

## REQ-API-VAR-1 — Variable Instances by Application and Job Definition

**Status**: OPEN

**Description**: Two contextual variable instance queries are missing: by Windows application and by Windows job definition. These support automation that reads variables scoped to a specific managed application or job.

**Missing operations**:

| Operation | Path |
|---|---|
| Variable instances by Windows application | `GET /v2.0/WindowsApplications/{id}/VariableInstances` |
| Variable instances by Windows job definition | `GET /v2.0/WindowsJobDefinitions/{id}/VariableInstances` |

**Module**: `nodes/Baramundi/actions/variable/`

**Quality**:
- [ ] Both operations implemented
- [ ] `validateGuid()` on ID parameters
- [ ] Minimum 2 unit tests each
- [ ] Variables module reaches 100% spec coverage

---

## REQ-UX-1 — resourceLocator for Endpoint and Job Selection

**Status**: OPEN

**Description**: The current `loadOptions` dropdown for endpoint and job selection works but is limited — it shows top 100 items with no search. Upgrading to n8n's `resourceLocator` component provides full server-side search, multiple selection modes (by ID / from list), and a better form experience.

**Scope**:
- Endpoint selection: replace hybrid dropdown in `endpoint.fields.ts` with `resourceLocator` using `By ID` and `From List` modes
- Job selection: same upgrade in `job.fields.ts`
- Required new methods in `Baramundi.node.ts`: `listSearch.searchEndpoints`, `listSearch.searchJobDefinitions`
- Both search methods must support the `filter` parameter (user search string) and `paginationToken`

**Quality**:
- [ ] `resourceLocator` component used for endpointId in all 6 endpoint operations
- [ ] `resourceLocator` component used for jobId in all 6 job operations
- [ ] `listSearch.searchEndpoints` returns name + GUID, supports filter
- [ ] `listSearch.searchJobDefinitions` returns name + type + GUID, supports filter
- [ ] `extractResourceLocatorValue()` (already in `validation.ts`) used in all execute functions that receive the locator
- [ ] All existing unit tests pass; new tests cover locator value extraction

---

## REQ-UX-2 — Contextual Error Messages

**Status**: OPEN

**Description**: API errors currently surface as raw HTTP status codes and baramundi error objects. Users receive no actionable guidance. Common error patterns should be translated to human-readable messages with troubleshooting hints.

**HTTP status translations** (to be implemented in `requestApi.ts`):

| Status | Plain-language message |
|---|---|
| 400 | Bad request — check parameter values (field names, data types) |
| 401 | Authentication failed — verify username/password in credentials |
| 403 | Access denied — the account lacks permission for this operation |
| 404 | Resource not found — verify the ID exists and belongs to the correct bMS version |
| 409 | Conflict — a resource with this name or ID already exists |
| 422 | Unprocessable — the request body is structurally valid but failed business-rule validation |
| 500 | Server error — bConnect returned an internal error; check bMS server logs |
| 503 | Service unavailable — bConnect is starting up or overloaded; the node will retry automatically |

**Quality**:
- [ ] `requestApi.ts` wraps all non-2xx responses with translated message + original error detail
- [ ] Error message includes operation context (resource type, operation, ID if present)
- [ ] `NodeOperationError` used throughout (never plain `Error`)
- [ ] Minimum 8 new unit tests covering each HTTP status translation
- [ ] No raw `error.message` from axios propagated to the user without translation

---

## REQ-SPLIT-1 — Split into 6 Domain Nodes

**Status**: OPEN

**Description**: Split the monolithic `Baramundi` node (28 resources, ~222 sidebar actions) into 6 focused domain nodes. Each node covers a distinct management domain, reducing sidebar clutter and the in-editor resource dropdown from 28 entries to 3–7 per node.

**Rationale**: 222 actions in a single n8n node is overwhelming. n8n's standard pattern for large API surfaces is multiple nodes (e.g., Google Sheets / Drive / Docs). Splitting improves discoverability, reduces cognitive load, and makes each node's purpose immediately clear. Pre-1.0, no backward compat needed.

**Node definitions**:

| Node | Class | Resources | Ops | Source Modules |
|------|-------|-----------|-----|----------------|
| **Baramundi Endpoint** | `BaramundiEndpoint` | endpoint, logicalGroup, staticGroup, dynamicGroup, maintenanceWindow, typedEndpoint | ~92 | endpoint/ |
| **Baramundi Asset** | `BaramundiAsset` | asset, assetType, assetFolder | ~43 | asset/ |
| **Baramundi Job** | `BaramundiJob` | jobDefinition, jobFolder, jobInstance, kioskRelease | ~37 | job/ |
| **Baramundi Software** | `BaramundiSoftware` | software, softwareBundle, updateManagement, variable, universalDynamicGroups | ~56 | software/, universalDynamicGroups/, updateManagement/, variable/ |
| **Baramundi Admin** | `BaramundiAdmin` | adUser, adGroup, adObject, orgUnit, serverManagement, microservice, operatingSystem | ~60 | activeDirectory/, serverManagement/, operatingSystem/ |
| **Baramundi Security** | `BaramundiSecurity` | bmsecurity, compliance, defenseControl | ~33 | serverManagement/ (bmsecurity), compliance/, defenseControl/ |

**Shared infrastructure** (single source of truth in `nodes/shared/`):

| File | Purpose |
|------|---------|
| `shared/transport/requestApi.ts` | `apiRequest()`, `apiRequestAllItems()` with retry/backoff |
| `shared/utils/types.ts` | TypeScript interfaces (BConnectPagedResponse, etc.) |
| `shared/utils/validation.ts` | 11 validation functions (GUID, email, MAC, OData, etc.) |
| `shared/utils/errorMessages.ts` | HTTP error classification and troubleshooting hints |
| `shared/loadOptions.ts` | 7 dropdown population functions (getEndpoints, getJobDefinitions, etc.) |

### Node 1: Baramundi Endpoint

- **Class**: `BaramundiEndpoint`, **name**: `baramundiEndpoint`
- **Description**: Manage endpoints, groups, and maintenance windows via bConnect API

| Resource | Value | Ops | Source |
|----------|-------|-----|--------|
| Endpoint | `endpoint` | 54 | `actions/endpoint/` |
| Logical Group | `logicalGroup` | 7 | `actions/endpoint/` |
| Static Group | `staticGroup` | 6 | `actions/endpoint/` |
| Dynamic Group | `dynamicGroup` | 3 | `actions/endpoint/` |
| Maintenance Window | `maintenanceWindow` | 10 | `actions/endpoint/` |
| Typed Endpoint | `typedEndpoint` | 12 | `actions/endpoint/` |

- **LoadOptions**: `getEndpoints`, `getLogicalGroups`, `getStaticGroups`, `getDynamicGroups`
- **Version-specific operations**: `endpointOperations25R2/26R1`, `maintenanceWindowOperations25R2/26R1`, `typedEndpointOperations25R2/26R1`

### Node 2: Baramundi Asset

- **Class**: `BaramundiAsset`, **name**: `baramundiAsset`
- **Description**: Manage assets, asset types, and folders via bConnect API

| Resource | Value | Ops | Source |
|----------|-------|-----|--------|
| Asset | `asset` | 26 | `actions/asset/` |
| Asset Type | `assetType` | 4 | `actions/asset/` |
| Asset Folder | `assetFolder` | 13 | `actions/asset/` |

- **LoadOptions**: none
- **Version-specific operations**: `assetOperations25R2Trimmed/26R1Trimmed`

### Node 3: Baramundi Job

- **Class**: `BaramundiJob`, **name**: `baramundiJob`
- **Description**: Manage job definitions, folders, instances, and kiosk releases via bConnect API

| Resource | Value | Ops | Source |
|----------|-------|-----|--------|
| Job Definition | `jobDefinition` | 7 | `actions/job/` |
| Job Folder | `jobFolder` | 6 | `actions/job/` |
| Job Instance | `jobInstance` | 16 | `actions/job/` |
| Kiosk Release | `kioskRelease` | 8 | `actions/job/` |

- **LoadOptions**: `getJobDefinitions`
- **Version-specific operations**: none

### Node 4: Baramundi Software

- **Class**: `BaramundiSoftware`, **name**: `baramundiSoftware`
- **Description**: Manage software, bundles, updates, variables, and universal dynamic groups via bConnect API

| Resource | Value | Ops | Source |
|----------|-------|-----|--------|
| Software | `software` | 19 | `actions/software/` |
| Software Bundle | `softwareBundle` | 15 | `actions/software/` |
| Update Management | `updateManagement` | 3 | `actions/updateManagement/` |
| Variable | `variable` | 13 | `actions/variable/` |
| Universal Dynamic Group | `universalDynamicGroups` | 6 | `actions/universalDynamicGroups/` |

- **LoadOptions**: none
- **Version-specific operations**: `softwareOperations25R2Trimmed/26R1Trimmed`
- **Note**: `universalDynamicGroups` is 26R1+ only — hide via `displayOptions` when bmsVersion=25R2

### Node 5: Baramundi Admin

- **Class**: `BaramundiAdmin`, **name**: `baramundiAdmin`
- **Description**: Manage Active Directory, server infrastructure, and operating systems via bConnect API

| Resource | Value | Ops | Source |
|----------|-------|-----|--------|
| AD User | `adUser` | 4 | `actions/activeDirectory/` |
| AD Group | `adGroup` | 4 | `actions/activeDirectory/` |
| AD Object | `adObject` | 5 | `actions/activeDirectory/` |
| Org Unit | `orgUnit` | 3 | `actions/activeDirectory/` |
| Server Management | `serverManagement` | 30 | `actions/serverManagement/` |
| Microservice | `microservice` | 5 | `actions/serverManagement/` |
| Operating System | `operatingSystem` | 9 | `actions/operatingSystem/` |

- **LoadOptions**: `getOrgUnits`
- **Version-specific operations**: none

### Node 6: Baramundi Security

- **Class**: `BaramundiSecurity`, **name**: `baramundiSecurity`
- **Description**: Manage security profiles, compliance rules, and defense controls via bConnect API

| Resource | Value | Ops | Source |
|----------|-------|-----|--------|
| Security | `bmsecurity` | 12 | `actions/serverManagement/` |
| Compliance | `compliance` | 8 | `actions/compliance/` |
| Defense Control | `defenseControl` | 13 | `actions/defenseControl/` |

- **LoadOptions**: none
- **Version-specific operations**: none
- **Note**: `compliance` is 26R1+ only — hide via `displayOptions` when bmsVersion=25R2

### Target directory layout

```
nodes/
├── shared/
│   ├── transport/requestApi.ts
│   ├── utils/types.ts
│   ├── utils/validation.ts
│   ├── utils/errorMessages.ts
│   └── loadOptions.ts
├── BaramundiEndpoint/
│   ├── BaramundiEndpoint.node.ts
│   ├── baramundi.svg
│   └── actions/
│       ├── router.ts              (mini-router: endpoint resources only)
│       └── endpoint/              (moved from Baramundi/actions/endpoint/)
├── BaramundiAsset/
│   ├── BaramundiAsset.node.ts
│   ├── baramundi.svg
│   └── actions/
│       ├── router.ts
│       └── asset/
├── BaramundiJob/
│   ├── BaramundiJob.node.ts
│   ├── baramundi.svg
│   └── actions/
│       ├── router.ts
│       └── job/
├── BaramundiSoftware/
│   ├── BaramundiSoftware.node.ts
│   ├── baramundi.svg
│   └── actions/
│       ├── router.ts
│       ├── software/
│       ├── universalDynamicGroups/
│       ├── updateManagement/
│       └── variable/
├── BaramundiAdmin/
│   ├── BaramundiAdmin.node.ts
│   ├── baramundi.svg
│   └── actions/
│       ├── router.ts
│       ├── activeDirectory/
│       ├── serverManagement/
│       └── operatingSystem/
└── BaramundiSecurity/
    ├── BaramundiSecurity.node.ts
    ├── baramundi.svg
    └── actions/
        ├── router.ts
        ├── compliance/
        └── defenseControl/
```

### Each node must have

1. **bmsVersion dropdown** — options `25R2`, `26R1`; default `26R1`
2. **Resource dropdown** — only the resources assigned to that node
3. **Operations + Fields** — spread from fields files, filtered by resource assignment
4. **LoadOptions** — only the methods needed by that node's resources (import from `shared/loadOptions.ts`)
5. **execute()** — delegates to the node's mini-router
6. **Metadata** — `credentials: [{ name: 'bconnectApi', required: true }]`, same `requestDefaults`, `inputs`/`outputs` as current node

### Mini-router pattern

Each node gets its own router extracted from the monolithic `router.ts`:

```typescript
// Example: BaramundiEndpoint/actions/router.ts
import { endpoint } from './endpoint';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;
  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      let responseData: INodeExecutionData[] = [];
      switch (resource) {
        case 'endpoint':
          switch (operation) {
            case 'get': responseData = await endpoint.get.call(this, i); break;
            // ... only this node's operations
          }
          break;
        case 'logicalGroup':
          // ...
      }
      returnData.push(...responseData);
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: (error as Error).message } });
      } else { throw error; }
    }
  }
  return [returnData];
}
```

### Import path pattern

Action modules reach shared code via relative paths:
```typescript
// From BaramundiEndpoint/actions/endpoint/endpoint.execute.ts:
import { apiRequest } from '../../../../shared/transport/requestApi';
import { validateGuid } from '../../../../shared/utils/validation';
```

### Node registration (package.json)

```json
"n8n": {
  "n8nNodesApiVersion": 1,
  "nodes": [
    "dist/nodes/BaramundiEndpoint/BaramundiEndpoint.node.js",
    "dist/nodes/BaramundiAsset/BaramundiAsset.node.js",
    "dist/nodes/BaramundiJob/BaramundiJob.node.js",
    "dist/nodes/BaramundiSoftware/BaramundiSoftware.node.js",
    "dist/nodes/BaramundiAdmin/BaramundiAdmin.node.js",
    "dist/nodes/BaramundiSecurity/BaramundiSecurity.node.js"
  ],
  "credentials": [
    "dist/credentials/BconnectApi.credentials.js"
  ]
}
```

### Dead code to exclude

The monolithic router has unreachable cases for old resource values that no longer exist in the dropdown:
- `case 'activeDirectory':` (16 ops) — replaced by `adUser`, `adGroup`, `adObject`, `orgUnit`
- `case 'job':` (37 ops) — replaced by `jobDefinition`, `jobFolder`, `jobInstance`, `kioskRelease`

Do **NOT** carry these into the new mini-routers.

### bmsecurity handler sharing

The `bmsecurity` operations are implemented in `serverManagement.execute.ts`. Copy the full `serverManagement/` module into both BaramundiAdmin and BaramundiSecurity nodes. Each router calls only its own operations. Unused handlers are dead code but harmless. Optionally refactor into a separate `bmsecurity.execute.ts` later.

**Constraints**:
- All 6 nodes share the existing `bconnectApi` credential
- All nodes use the same `baramundi.svg` icon
- Each node declares its own `bmsVersion` dropdown (25R2, 26R1)
- Version-conditional resources (`compliance` = 26R1+, `universalDynamicGroups` = 26R1+) use `displayOptions`
- Old monolithic `Baramundi` node removed entirely (no deprecation wrapper)

**Quality**:
- [ ] `npm run build` compiles all 6 nodes without errors
- [ ] `npm test` — all existing tests pass with updated import paths
- [ ] Each node appears in n8n sidebar with correct name and icon
- [ ] Each node's resource dropdown shows only its assigned resources
- [ ] Version-conditional resources hidden when bmsVersion=25R2
- [ ] At least one operation per node executes successfully against bConnect API
- [ ] No node exceeds ~92 actions in sidebar (Endpoint is largest)
- [ ] `nodes/Baramundi/` directory fully removed
- [ ] `nodes/shared/` has no circular dependencies
- [ ] `package.json` registers all 6 nodes and single credential


---

## REQ-ENDPOINT-UX-1 — Merge Typed Endpoint into Endpoint Resource

**Status**: OPEN

**Description**: Remove the `typedEndpoint` resource from the Baramundi Endpoint node. Merge all typed endpoint operations into the `endpoint` resource by adding an `endpointType` / `platformType` dropdown (with an "All Platforms" option) to operations that can work cross-platform or platform-specific.

**Rationale**: IT administrators don't think in terms of "typed endpoints" — they think "I want to manage my iOS devices" or "show me all Linux servers." The current split creates confusion:

| Admin intent | Current UX problem |
|---|---|
| Create an iOS device | Must go to Endpoint → Create (not Typed Endpoint). Not discoverable. |
| List all Android devices | Endpoint → Get Many returns all types mixed. Must use Typed Endpoint → Get Many instead. |
| Update a Mac endpoint | Endpoint → Update is Windows-only. Must use Typed Endpoint → Update. |
| Manage network devices | Network has no enrollment/jobs but shares UI with managed device types. |

### Merged Operation Design

After merge, the `endpoint` resource has these operations. Each operation that supports platform filtering gets an `endpointType` dropdown with options: `all`, `windows`, `android`, `ios`, `linux`, `mac`, `network`.

| Operation | endpointType | Behavior |
|---|---|---|
| **Create** | required (no "all") | `POST /v2.0/{Type}Endpoints` — already implemented, has `endpointType` param |
| **Get** | optional, default "all" | "all" → `GET /v2.0/Endpoints/{id}`, specific → `GET /v2.0/{Type}Endpoints/{id}` |
| **Get Many** | optional, default "all" | "all" → `GET /v2.0/Endpoints`, specific → `GET /v2.0/{Type}Endpoints` |
| **Search** | n/a (generic only) | `GET /v2.0/Endpoints?SearchQuery=...` — keep as-is |
| **Update** | required (no "all") | `PATCH /v2.0/{Type}Endpoints/{id}` — now works for ALL platforms, not just Windows |
| **Delete** | optional, default "all" | "all" → `DELETE /v2.0/Endpoints/{id}`, specific → `DELETE /v2.0/{Type}Endpoints/{id}` |
| **Start Enrollment** | auto-detected or required | Enrollment not available for `network`. Auto-detect from endpoint type or require selection. |
| **Trigger Intune Installation** | n/a (Windows only) | Keep as-is, no endpointType needed |
| **Get By Group** | optional, default "all" | "all" → existing group query, specific → type-filtered group query |

**Operations that stay unchanged** (no endpointType needed):
- Entra ID: Set, Get, Delete (3 ops)
- Unmanaged Endpoints: Get, Get Many, Delete (3 ops)
- Maintenance Window operations (10 ops)
- Group query operations: getEndpointsByLogicalGroup, etc. (5 ops) — merge with getTypedEndpointsByGroup via endpointType filter

**Industrial Endpoints** (25R2 only): Merge into endpoint operations with `endpointType: 'industrial'` option (only shown when bmsVersion=25R2).

**Network endpoint special handling**:
- `network` excluded from Start Enrollment (network devices have no agent)
- `network` excluded from Trigger Intune Installation
- Create body differs: IP address/MAC fields instead of hostname
- Document clearly: "Network endpoints are unmanaged devices (switches, printers, APs)"

### UI Changes

1. **Remove `typedEndpoint` from resource dropdown** (6 → 5 resources in Baramundi Endpoint)
2. **Remove `typedEndpointOperations25R2/26R1`** field arrays entirely
3. **Remove `typedEndpointFields`** array entirely
4. **Add `endpointType` dropdown** to Get, Get Many, Update, Delete, Get By Group operations
5. **Update `endpointOperations25R2/26R1`** to include former typed endpoint operations
6. **Update operation descriptions** to make platform filtering obvious (e.g., "Get many endpoints — filter by platform type")

### Router Changes

1. **Remove `case 'typedEndpoint'`** from router
2. **Merge typed operations into `case 'endpoint'`** — the execute functions already exist, just need new operation value names
3. **Consolidate duplicate operations**: `getTypedEndpoints` becomes the implementation for `getMany` when endpointType != 'all'

### Execute Function Changes

1. **`get`**: Add conditional — if endpointType is specified and not 'all', use typed path
2. **`getMany`**: Add conditional — if endpointType is specified and not 'all', use typed path
3. **`update`**: Change from Windows-only to use `TYPED_ENDPOINT_PATH[endpointType]` (require endpointType)
4. **`deleteEndpoint`**: Add conditional for typed path
5. **`getEndpointsByLogicalGroup` etc.**: Add optional endpointType filter to use typed group query path
6. **Remove** standalone `getTypedEndpoints`, `getTypedEndpoint`, `updateTypedEndpoint`, `deleteTypedEndpoint`, `startTypedEnrollment`, `getTypedEndpointsByGroup` — logic absorbed into existing operations

**Quality**:
- [ ] `typedEndpoint` resource no longer appears in resource dropdown
- [ ] All operations formerly under Typed Endpoint accessible via Endpoint + endpointType filter
- [ ] Create works for all 6 platform types (unchanged)
- [ ] Get/Get Many with endpointType="all" returns cross-platform results (unchanged)
- [ ] Get/Get Many with specific endpointType returns platform-filtered results
- [ ] Update works for all 6 platform types (was Windows-only)
- [ ] Network excluded from enrollment operations
- [ ] Industrial endpoints accessible when bmsVersion=25R2
- [ ] Sidebar action count for Baramundi Endpoint decreases (fewer duplicate operations)
- [ ] `tsc --noEmit`: 0 errors
- [ ] All existing endpoint tests pass (updated for new operation structure)

---

## REQ-PUBLISH-1 — Distribution Package

**Status**: OPEN

**Description**: The connector must be distributable to baramundi customers via file transfer (npm package file), independent of the n8n community registry.

**Requirements**:
- `npm pack` produces a `.tgz` file installable via `npm install <file.tgz>` on a customer's n8n instance
- Package metadata in `package.json` is complete: `name`, `version`, `description`, `author`, `license`, `keywords`, `n8n.nodes`, `n8n.credentials`
- `INSTALLATION.md` covers: download, `npm install`, n8n restart, credential setup
- Package does not include `node_modules/`, `test/`, `*.test.ts`, system test files, or dev configs (`.eslintrc`, `vitest.config.ts`)
- `dist/` contains only compiled output; source TypeScript is not needed at runtime

**Quality**:
- [ ] `npm pack` completes without errors or warnings
- [ ] Resulting `.tgz` installs cleanly on a fresh n8n instance
- [ ] `package.json` fields: `name`, `version`, `description`, `author`, `license`, `keywords`, `n8n` block all correct
- [ ] `files` array in `package.json` excludes test assets and dev configs
- [ ] `INSTALLATION.md` is current and complete
- [ ] Distribution `.tgz` artifact is placed in a known location for handoff

---

## REQ-PUBLISH-2 — n8n Community Node Registry Submission

**Status**: BLOCKED — awaiting baramundi management approval

**Description**: Submit the package to the n8n community nodes registry (npm) so it can be installed directly from the n8n UI via the node manager.

**Pre-conditions**:
- [ ] baramundi management approves public release
- [ ] REQ-PUBLISH-1 complete (package metadata and build quality confirmed)
- [ ] README includes required n8n community node badges and n8n installation instructions
- [ ] Package name `n8n-nodes-baramundi` is available on npm (verify with `npm view n8n-nodes-baramundi`)
- [ ] npm account with publish rights is configured

**Steps** (when unblocked):
1. `npm publish --access public`
2. Submit to n8n community integration list (GitHub PR to n8n-io/n8n repository)
3. Monitor for community feedback and address within 30 days

**Quality**:
- [ ] Package published to npm registry
- [ ] Installable from n8n UI node manager
- [ ] n8n compatibility test: install + use on n8n v1.x LTS
