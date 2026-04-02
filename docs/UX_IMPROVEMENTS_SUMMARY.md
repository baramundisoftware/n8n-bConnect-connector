# UX Improvements — Summary & Status

**Last Updated**: 2026-04-02  
**Connector Version**: 0.4.1

---

## Implementation Status Overview

| Task | Status | Details |
|------|--------|---------|
| Parameter Validation | ✅ Complete | `validation.ts`, 206 call sites |
| Dropdown Selection (loadOptions) | ✅ Complete | Endpoints + Job Definitions |
| Resource Locator (advanced search) | ❌ Not implemented | Blocked — see below |
| Enhanced Error Messages | ❌ Not implemented | Planned, not started |

---

## ✅ Done: Parameter Validation

`nodes/Baramundi/utils/validation.ts` — fully implemented and in use across all modules.

**Functions available:**
- `validateGuid()` — UUID format (36 chars, proper hyphen placement)
- `validateGuidList()` — comma-separated GUIDs
- `validateDisplayName()` — 1–255 chars, no invalid characters
- `validateEmail()` — RFC-compliant
- `validateMacAddress()` — IEEE MAC-48 (AA:BB:CC:DD:EE:FF)
- `validateIpv4Address()` — IPv4 (0.0.0.0–255.255.255.255)
- `validateIso8601DateTime()` — ISO 8601
- `validateMaintenanceWindow()` — cross-field (start < end, not in past)
- `extractResourceLocatorValue()` — backward-compatibility helper

**Coverage:** 80 unit tests, 100% code coverage. 206 call sites across execute modules.

---

## ✅ Done: Dropdown Selection via loadOptions

Rather than `resourceLocator` (which requires a newer n8n API — see below), dropdown selection was implemented using `loadOptionsMethod`. This provides a searchable dropdown without requiring n8n 1.x+.

**Implemented in:**
- `endpoint.fields.ts` — `getEndpoints` loadOptions (3 fields)
- `job.fields.ts` — `getJobDefinitions` loadOptions (7 fields), `getEndpoints` (1 field)

**Methods in `Baramundi.node.ts`:**
- `getEndpoints` — fetches Windows endpoints, shows `displayName (hostname)`
- `getJobDefinitions` — fetches job definitions, shows name + type

**Limitation:** Static dropdown — not searchable by typing, limited to ~50–100 items per load.

---

## ❌ Not Implemented: Resource Locator (advanced search)

The full `resourceLocator` component (type-ahead search, By URL mode, From Previous Node mode) was not implemented due to a version compatibility constraint.

**Root cause:** `methods.listSearch` and `type: 'resourceLocator'` require n8n-workflow 1.x+. The project's current n8n peer dependency targets an earlier API surface.

**Compilation errors when attempted:**
```
TS2353: Object literal may only specify known properties,
        and 'methods' does not exist in type 'INodeTypeDescription'.
```

**Status:** Deferred until n8n peer dependency is upgraded. When it is, the `loadOptions` dropdowns can be promoted to `resourceLocator` with full search. The `extractResourceLocatorValue()` helper in `validation.ts` is already written for backward compatibility during that migration.

**Reference implementation:** See `UX_IMPROVEMENTS_GUIDE.md` §1 for the full `resourceLocator` code.

---

## ❌ Not Implemented: Enhanced Error Messages

Planned improvement to `nodes/Baramundi/transport/requestApi.ts` — contextual error messages with HTTP status translation and troubleshooting hints.

**Current state:** Generic `NodeApiError` with raw API error message.

**Planned state:** Contextual messages per status code (400/401/403/404/409/422/500) with operation + resource context and actionable troubleshooting steps.

**Reference implementation:** See `UX_IMPROVEMENTS_IMPLEMENTATION_SUMMARY.md` §"In Progress" section for the planned `requestApi.ts` changes.

**Effort estimate:** 1–2 days. No blockers — can be implemented with current n8n version.

---

## Files Reference

| File | Purpose |
|------|---------|
| `UX_IMPROVEMENTS_GUIDE.md` | Detailed design rationale and full code examples for all 4 tasks |
| `UX_IMPROVEMENTS_IMPLEMENTATION_SUMMARY.md` | Implementation notes including the resource locator failure analysis |
| `UX_IMPROVEMENTS_QUICK_START.md` | Copy-paste code snippets for each task |
| `nodes/Baramundi/utils/validation.ts` | Validation library (implemented) |
| `nodes/Baramundi/Baramundi.node.ts` | loadOptions methods (implemented) |
