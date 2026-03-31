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
