# n8n-nodes-baramundi — Requirements

**Project**: n8n community node for baramundi Management Suite (bMS) via bConnect API
**Persona**: IT administrator using n8n to automate endpoint management workflows
**Node package**: `n8n-nodes-baramundi`
**Main node file**: `nodes/Baramundi/Baramundi.node.ts`

---

## Scope and Constraints

### ✅ REQ-SCOPE-1 — V2.0 API Only

**Status**: PLANNED 📋 (V1.1 removal required)

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
- [ ] No V1.1 base URL (`/bconnect/v1.1/`) appears in any execute file
- [ ] No imports from removed module directories in `router.ts` or `Baramundi.node.ts`
- [ ] All removed resources removed from `Resource` dropdown
- [ ] All tests referencing removed modules are deleted

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

**Status**: PLANNED 📋

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
- [ ] `bmsVersion` parameter is the first parameter in the node (before `resource`)
- [ ] All 25R2-only operations have `displayOptions.show.bmsVersion: ['25R2']`
- [ ] All 26R1-only operations have `displayOptions.show.bmsVersion: ['26R1']`
- [ ] Common operations have no `bmsVersion` constraint (they work for all versions)
- [ ] Adding `bmsVersion: '25R2'` hides all 26R1-only resource options from `Resource` dropdown
- [ ] No runtime API 404 errors when using correct version targeting
- [ ] Version matrix table in this document is regenerated whenever a new spec is added

---

## 📋 REQ-NEWMODULES-1 — New V2.0 Modules from 26R1

**Status**: PLANNED 📋

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
- [ ] Compliance resource only visible when `bmsVersion` is `26R1` or later
- [ ] Universal Dynamic Groups resource only visible when `bmsVersion` is `26R1` or later
- [ ] Full spec review completed for each new module before implementation

---

## 📋 REQ-NEWOPS-1 — New Operations in Existing Modules (26R1)

**Status**: PLANNED 📋

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

## 📋 REQ-CHANGED-1 — Changed Operations Between Versions

**Status**: PLANNED 📋

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
