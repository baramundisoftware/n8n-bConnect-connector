# Threat Model — n8n-nodes-baramundi v0.6.0

**Date**: 2026-04-02
**Auditor**: Security Engineer (Claude Code SDLC)
**Scope**: Full codebase review of n8n-nodes-baramundi v0.6.0 (6 nodes, ~321 operations)
**Status**: Complete — 1 HIGH finding, 1 LOW, 2 INFO/ACCEPTED

---

## 1. System Context

```
┌─────────────┐     HTTPS/Basic Auth     ┌──────────────────┐
│  n8n Server  │ ◄──────────────────────► │  bMS bConnect    │
│  (trusted)   │                          │  REST API V2.0   │
└──────┬───────┘                          └──────────────────┘
       │
       │ n8n workflow execution
       │
┌──────┴───────┐
│  n8n Nodes   │  ← This connector (6 nodes, ~321 ops)
│  (this code) │
└──────────────┘
```

### Trust Boundaries

| ID | Boundary | Description |
|---|---|---|
| TB-1 | Workflow author → Node parameters | User-controlled input via n8n UI or expressions |
| TB-2 | n8n node → bConnect API | HTTP over network (Basic Auth, TLS) |
| TB-3 | bConnect API → bMS database | Server-side, out of scope for this review |

### Threat Actors

| ID | Actor | Capability |
|---|---|---|
| TA-1 | Malicious n8n workflow author | Can create/edit workflows, supply arbitrary parameter values via expressions |
| TA-2 | Network attacker (MitM) | Can intercept n8n ↔ bMS traffic if TLS is disabled |
| TA-3 | Supply chain | Compromised npm dependency injecting malicious code |

---

## 2. OWASP Top 10 Assessment

| # | Risk | Status | Detail |
|---|------|--------|--------|
| A01 | Broken Access Control | **N/A** | Auth delegated to bConnect (Basic Auth). Node has no own authz layer. bConnect enforces RBAC server-side. |
| A02 | Cryptographic Failures | **PASS** | Credentials stored in n8n encrypted credential store. TLS enabled by default (`ignoreSslIssues: false`). MitM warning displayed when TLS bypass is enabled. Password field masked in UI (`typeOptions: { password: true }`). |
| A03 | Injection | **1 FINDING** | OData injection in `endpoint.search()` — see F-2026-04 below. All other 50+ search/filter sites validated. |
| A04 | Insecure Design | **PASS** | Threat model reviewed. Defense-in-depth: GUID validation on all path params, OData validation on query params, RFC 6902 validation on PATCH bodies, URL sanitization in error messages. |
| A05 | Security Misconfiguration | **PASS** | `ignoreSslIssues` defaults to `false`. No default credentials. No debug logging in production code. |
| A06 | Vulnerable Components | **ACCEPTED** | lodash HIGH in n8n-workflow peer dep (upstream, `_.template`/`_.unset` not used by this connector). See F-2026-07. |
| A07 | Auth Failures | **N/A** | No auth endpoints in this code. Rate limiting handled by bConnect server-side. Connector retries 429 with exponential backoff (max 3). |
| A08 | Data Integrity Failures | **PASS** | RFC 6902 JSON Patch validation before PATCH requests. GUID format validation on all ID parameters. Strict ISO 8601 datetime validation. |
| A09 | Logging Failures | **PASS** | URLs sanitized in error messages (GUIDs stripped). No credentials in error messages. No `console.log` in production code. |
| A10 | SSRF | **N/A** | `baseUrl` sourced from n8n credentials (encrypted store), not from workflow parameters. Cannot be redirected by workflow expressions. |

---

## 3. Existing Security Controls

The following security controls were implemented in prior audit phases (Phase 6, 7, 9):

| Control | Implementation | Coverage |
|---|---|---|
| GUID validation | `validateGuid()` on all `*Id` URL path parameters | All execute files (verified Phase 9) |
| OData injection prevention | `validateODataString()` blocks `"`, `;`, control chars | 50+ call sites (1 gap found — F-2026-04) |
| RFC 6902 patch validation | `validateRfc6902Patch()` validates op/path/value structure | `patchBitLockerSecrets`, `updateEndpointMaintenanceWindow`, `updateGroupMaintenanceWindow` |
| URL sanitization | `sanitiseUrl()` strips GUIDs from error messages | All `NodeApiError` throw sites in `requestApi.ts` |
| Pagination DoS protection | `MAX_PAGE_CAP = 50`, `maxItems = 5000` default | `apiRequestAllItems()` |
| Retry with backoff | Exponential backoff + jitter for 429/503/ETIMEDOUT | `apiRequest()`, max 3 retries |
| SSL bypass warning | `notice`-type UI warning when `ignoreSslIssues: true` | `BconnectApi.credentials.ts` |
| Credential hygiene | Password masked, secure default, service-account guidance | `BconnectApi.credentials.ts` |
| Dropdown truncation indicator | Sentinel option when LoadOptions results exceed 100 | All 6 LoadOptions methods |
| ISO 8601 strict validation | Regex + Date constructor double-check | `validateIso8601DateTime()` |
| Display name validation | Length limit (255), Windows filename char rejection | `validateDisplayName()` |
| Type safety | `unknown` instead of `any` in all utility functions | `errorMessages.ts`, `validation.ts`, `requestApi.ts` |
| CI security gates | `npm audit --omit=dev --audit-level=high`, ESLint, file permission check | `.github/workflows/ci.yml` |

---

## 4. Findings

### F-2026-04 — OData Injection in endpoint.search() (HIGH)

**CWE**: CWE-943 (Improper Neutralization of Special Elements in Data Query Logic)
**File**: `nodes/BaramundiEndpoint/actions/endpoint/endpoint.execute.ts:114`
**Status**: OPEN

**Description**: The `search()` function passes the `searchQuery` parameter directly to the bConnect API without calling `validateODataString()`:

```typescript
export async function search(this: IExecuteFunctions, index: number) {
  const searchQuery = this.getNodeParameter('searchQuery', index) as string;
  const qs: Record<string, string | number> = {
    SearchQuery: searchQuery,  // ← No validateODataString() call
  };
  // ...
}
```

Every other `searchQuery` usage in the codebase (50+ instances across all 6 nodes) validates via:

```typescript
const sqValidation = validateODataString(options.searchQuery, 'Search Query');
if (!sqValidation.valid) {
  throw new NodeOperationError(this.getNode(), sqValidation.errors.join('\n'), { itemIndex: index });
}
qs.SearchQuery = options.searchQuery;
```

**Impact**: A workflow author could inject arbitrary OData filter expressions (e.g., `contains(password,'a')`) that bypass intended query scope or extract unauthorized data via the bConnect API. Requires TA-1 (malicious workflow author) with access to edit workflows.

**Severity**: **HIGH** — Consistent with prior findings F-2026-01/F-2026-02 (Phase 9 GUID injection gaps).

**Mitigation**: Add `validateODataString()` call before use, matching the pattern at line 488 of the same file. This is a 3-line fix.

**Risk if unpatched**: An n8n user with workflow-editing access can craft OData injection payloads. Mitigated partially by bConnect's own server-side access controls, but the connector should validate at the boundary.

---

### F-2026-05 — additionalFields Passed to API Without Field-Level Validation (LOW)

**CWE**: CWE-20 (Improper Input Validation)
**Files**: Multiple create/update operations across all 6 nodes
**Status**: ACCEPTED

**Description**: Create operations spread `additionalFields` directly into request bodies without per-field validation:

```typescript
const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
const body = { name, ...additionalFields };
```

Update operations build JSON Patch arrays from `updateFields` without value-level validation:

```typescript
for (const [key, value] of Object.entries(updateFields)) {
  patchOperations.push({ op: 'replace', path: `/${key}`, value });
}
```

**Affected operations** (representative, not exhaustive):
- `asset.create()`, `asset.update()`
- `serverManagement.createSecurityGroup()`, `serverManagement.updateSecurityGroup()`
- `software.createBundle()`, `software.createBundleFolder()`
- `operatingSystem.createFolder()`
- All PATCH operations using the `updateFields` pattern

**Impact**: LOW — The bConnect API validates and rejects invalid fields/values server-side (returns 400/422). The n8n UI constrains field types via `INodeProperties` definitions. Exploitation requires crafting malicious n8n expressions to bypass UI constraints, and even then the API rejects invalid payloads.

**Severity**: **LOW** — Defense-in-depth improvement, not a directly exploitable vulnerability.

**Recommendation**: No immediate action required. Consider adding type/range validation for security-critical fields (e.g., security profile creation, object permissions) in a future hardening phase.

---

### F-2026-06 — Template Literal OData Interpolation in job.getInstances() (INFO)

**CWE**: CWE-943 (Improper Neutralization of Special Elements in Data Query Logic)
**File**: `nodes/BaramundiJob/actions/job/job.execute.ts:116`
**Status**: NOTED

**Description**: A GUID value is interpolated into an OData query string via template literal:

```typescript
qs.SearchQuery = `JobDefinitionId eq '${jobId}'`;
```

The `jobId` is GUID-validated immediately before this line, so injection is not possible — only valid GUIDs (`[0-9a-fA-F-]`) can reach the template.

**Impact**: None — not exploitable due to preceding GUID validation.

**Severity**: **INFO** — The pattern is fragile and should be noted in code review guidelines. If this pattern is copied without the GUID validation guard, it becomes an injection vector.

**Recommendation**: Add a code comment noting the safety dependency on GUID validation. Consider using parameterized OData queries if the bConnect API supports them in a future version.

---

### F-2026-07 — lodash HIGH in n8n-workflow Peer Dependency (ACCEPTED)

**CWE**: CWE-1395 (Dependency on Vulnerable Third-Party Component)
**Package**: `lodash@4.17.23` via `n8n-workflow@2.13.1`
**Status**: ACCEPTED

**Description**: 3 HIGH severity vulnerabilities in lodash:
1. Code Injection via `_.template` (GHSA-r5fr-rjxr-66jc)
2. Prototype Pollution via `_.unset` (GHSA-f23m-r3pf-42rh)
3. Prototype Pollution via `_.omit` (GHSA-f23m-r3pf-42rh)

These are in `n8n-workflow`, a peer dependency. This connector cannot update lodash independently — it requires an upstream fix from n8n.

**Impact**: Theoretical — this connector never calls `_.template`, `_.unset`, or `_.omit` directly. The vulnerable functions are part of n8n's expression runtime, which is outside this connector's control.

**Severity**: **ACCEPTED** — Not fixable by this project. Documented for awareness.

**CI gate**: `npm audit --omit=dev --audit-level=high` in CI monitors for new runtime vulnerabilities. This finding is in a peer dependency and flagged by `npm audit` but not actionable.

---

### F-2026-08 — Silent Workflow Breakage on bmsVersion Migration (MEDIUM)

**CWE**: CWE-440 (Expected Behavior Violation)
**Files**: All 6 node routers, specifically BaramundiEndpoint
**Status**: OPEN

**Description**: When a customer upgrades their bMS server from 25R2 to 26R1 and changes the `bmsVersion` dropdown in their n8n node, workflows using 25R2-only operations break silently:

1. 25R2-only operations disappear from the n8n UI (`displayOptions` hides them)
2. The workflow JSON still contains the old operation value (e.g., `replaceEndpointMaintenanceWindow`)
3. The operation is invisible in the editor — the customer can't see or edit it
4. On execution, the router dispatches it, the execute function calls PUT on the 26R1 API
5. The 26R1 API returns 404/405 with **no indication that the version switch caused the failure**

**Affected operations**:

| 25R2 Operation | 26R1 Replacement | Body format change |
|---|---|---|
| `replaceEndpointMaintenanceWindow` (PUT) | `updateEndpointMaintenanceWindow` (PATCH) | Full object → JSON Patch array |
| `replaceGroupMaintenanceWindow` (PUT) | `updateGroupMaintenanceWindow` (PATCH) | Full object → JSON Patch array |
| Industrial Endpoints CRUD (5 ops) | No equivalent | Operations removed in 26R1 API |

**Impact**: Customer workflows fail with cryptic API errors after a routine bMS server upgrade. The customer has no way to diagnose the cause from the error message. They may waste significant time troubleshooting the bConnect API when the problem is a version-incompatible operation in their workflow.

**Severity**: **MEDIUM** — Affects migration UX, not security. But can cause production workflow outages.

**Mitigation**: Add version-mismatch guards in the router. When a 25R2-only operation is executed under `bmsVersion: '26R1'`, throw a clear `NodeOperationError`:
- *"'Replace Maintenance Window' (PUT) is only available for bMS 25R2. For 26R1, use 'Update Maintenance Window' (PATCH) instead. Note: the request body format changed from full object replacement to JSON Patch array."*
- For Industrial Endpoints: *"Industrial Endpoint operations are only available for bMS 25R2 and are not supported in 26R1."*

---

## 5. SSRF Analysis

The `baseUrl` parameter (the bConnect server URL) is the primary SSRF-relevant input:

| Property | Value |
|---|---|
| Source | n8n credential store (encrypted) |
| Editable by | n8n admin (credential editor) |
| Exposed as workflow param? | No — only accessible via `this.getCredentials('bconnectApi')` |
| URL validation | None (relies on n8n credential UI + bConnect DNS resolution) |
| Internal network risk | An n8n admin could point `baseUrl` at an internal service. This is by design — bConnect servers are typically internal. |

**Conclusion**: SSRF is not a vulnerability in this context. The n8n admin who configures credentials already has full access to the n8n server's network. Restricting `baseUrl` would break legitimate use cases.

---

## 6. Credential Security Analysis

| Aspect | Status |
|---|---|
| Auth mechanism | HTTP Basic Auth (only option per bConnect OpenAPI specs) |
| Password storage | n8n encrypted credential store |
| Password UI | Masked (`typeOptions: { password: true }`) |
| Default SSL | Enabled (`ignoreSslIssues: false`) |
| SSL bypass warning | `notice`-type UI element when bypass enabled |
| Credential test | `GET /v2.0/WindowsEndpoints` with `ignoreHttpStatusErrors: true` |
| Credentials in logs | Not logged — sanitized in error messages |
| Credentials in dist | Not embedded — resolved at runtime from credential store |
| Service-account guidance | Documented in `BconnectApi.credentials.ts` header comment |

**Risk acceptance**: Basic Auth is the only authentication mechanism offered by the bConnect V2.0 API. Documented with hardening guidance (dedicated service account, password rotation, SSL enforcement, network restriction).

---

## 7. Summary

| ID | Finding | Severity | Status | Action Required |
|---|---|---|---|---|
| F-2026-04 | OData injection in `endpoint.search()` | **HIGH** | OPEN | Fix before v1.0.0 — add `validateODataString()` |
| F-2026-05 | additionalFields unvalidated | LOW | ACCEPTED | Server-side validation sufficient |
| F-2026-06 | Template literal OData pattern | INFO | NOTED | Add code comment |
| F-2026-07 | lodash in n8n-workflow peer dep | ACCEPTED | ACCEPTED | Upstream dependency |
| F-2026-08 | Silent workflow breakage on bmsVersion 25R2→26R1 migration | **MEDIUM** | OPEN | Add version-mismatch guards in router |

**Overall security posture**: GOOD. The codebase has comprehensive input validation infrastructure (GUID, OData, RFC 6902, ISO 8601, display name, MAC, IPv4) consistently applied across ~321 operations. One gap found (F-2026-04) is a straightforward fix. No critical vulnerabilities. No credential exposure risks.

---

## 8. Recommendations for v1.0.0

1. **Fix F-2026-04** — Add `validateODataString()` to `endpoint.search()` (3-line fix) — **DONE 2026-04-02**
2. **Add code comment** on `job.execute.ts:116` noting safety dependency on GUID validation — **DONE 2026-04-02**
3. **Fix F-2026-08** — Add version-mismatch guards in router for 25R2-only operations executed under 26R1. Prevents silent workflow breakage on bMS server upgrade.
4. **Monitor** n8n-workflow upstream for lodash update
5. **Consider** adding a custom ESLint rule to enforce `validateODataString()` on all `SearchQuery` assignments (similar to the existing GUID validation ESLint rule)
