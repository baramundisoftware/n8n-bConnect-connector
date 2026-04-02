# ADR-002: resourceLocator UX — Breaking Change Scope and Migration
Date: 2026-04-02
Status: Proposed

## Context

REQ-UX-1 requires replacing plain GUID `string` fields (endpointId, jobDefinitionId)
with n8n `resourceLocator` components. This enables type-ahead search, GUID
validation, and "By URL" mode in the n8n UI.

A `resourceLocator` field stores its value as an **object**
`{ mode: 'list'|'id'|'url', value: string }` instead of a plain string.
Existing saved workflows store a plain string for these fields.

**Breaking change**: Any workflow saved with v0.4.x that uses Endpoint or Job
operations with a hardcoded GUID will fail to load correctly in v1.0.0 unless
backward compatibility is handled.

## Decision

Implement resourceLocator with **backward-compatible value extraction** using
the existing `extractResourceLocatorValue()` helper in `utils/validation.ts`:

```typescript
// Handles both legacy string and new resourceLocator object
function extractResourceLocatorValue(value: string | IDataObject): string {
  if (typeof value === 'string') return value;        // v0.4.x compat
  return value.value as string;                       // v1.0.0 resourceLocator
}
```

This means:
- Saved workflows from v0.4.x continue to work (the string value passes through)
- New workflows use the resourceLocator UI (better UX)
- No migration script needed

## Consequences

**Easier:**
- Zero migration burden for users upgrading from v0.4.x to v1.0.0
- The helper already exists — implementation is mechanical
- Both modes are tested by existing unit tests (string path) + new tests (object path)

**Harder:**
- Every execute file that reads an endpoint/job GUID must use the helper
- Must not use `this.getNodeParameter('endpointId')` directly — always via helper

**Risks accepted:**
- The `value.value` extraction assumes n8n always provides a string in the
  `value` field of the resourceLocator object. This is guaranteed by the n8n
  framework for `id` and `list` modes. `url` mode would require URL parsing —
  not supported in v1.0.0 (document as known limitation).
