# ADR-005: Resource Locator UX for Endpoint and Job Selection
Date: 2026-04-02
Status: Proposed

## Context

Users must manually copy-paste GUIDs from the baramundi console to select endpoints and jobs. The current `type: 'string'` fields offer no autocomplete, no search, and no validation until the API call fails. n8n's `resourceLocator` component provides type-ahead search, GUID validation, and multiple selection modes (By ID / From List / By URL).

The `extractResourceLocatorValue()` helper already exists in `validation.ts` and handles both legacy `string` and new `{ mode, value }` formats. The `listSearch` method signature is supported by our installed `n8n-workflow` v2.13.1.

## Decision

1. **Scope**: Convert `endpointId` fields in `BaramundiEndpoint` and `jobDefinitionId` fields in `BaramundiJob` to `type: 'resourceLocator'`. Secondary `endpointId` references in other nodes (Security, Software, Asset, Admin) remain `type: 'string'` — they are used less frequently and upgrading them is deferred to P15.7.

2. **listSearch methods**: Add `endpointSearch` to `BaramundiEndpoint.node.ts` and `jobDefinitionSearch` + `jobFolderSearch` to `BaramundiJob.node.ts`. These call the existing paginated API with a `SearchQuery` filter parameter derived from the user's search string. Pagination via `paginationToken` (page number).

3. **Execute function changes**: Replace `this.getNodeParameter('endpointId', index) as string` with `extractResourceLocatorValue(this.getNodeParameter('endpointId', index))` in `endpoint.execute.ts` and similarly for `jobDefinitionId` in `job.execute.ts`. This is backward-compatible — the helper already handles both string and object formats.

4. **Field definition**: Each `endpointId` / `jobDefinitionId` field changes from `type: 'string'` to `type: 'resourceLocator'` with three modes: "By ID" (string with GUID regex validation), "From List" (searchable list via `listSearch`), "By URL" (regex extract GUID from URL).

5. **No new dependencies**.

## Consequences

### Easier
- Users can search endpoints/jobs by name instead of copy-pasting GUIDs
- GUID validation happens in the UI before execution
- "By URL" mode allows pasting bConnect console links

### Harder
- **Breaking change**: Saved workflows using `endpointId` or `jobDefinitionId` as plain strings will need to be re-saved. The execute functions handle both formats via `extractResourceLocatorValue()`, so workflows will still *execute* correctly — but the n8n UI editor may show the field as empty until re-selected. Since we're pre-1.0 and have no published workflows, this is acceptable.

### Risks accepted
- `listSearch` makes an API call on each keystroke (debounced by n8n). For large environments (>10k endpoints), the search endpoint must be performant. bConnect's `SearchQuery` OData filter is server-side, so this is acceptable.
- The `loadOptions` dropdown methods (`getEndpoints`, `getJobDefinitions`) remain for backward compat and for fields that still use `type: 'options'` (e.g., group selectors). No duplication — `listSearch` and `loadOptions` serve different UI components.
