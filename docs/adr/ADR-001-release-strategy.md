# ADR-001: Release Strategy — v0.5.x Incremental vs v1.0.0 Consolidated
Date: 2026-04-02
Status: Proposed

## Context

The project has reached v0.5.0 (built, not published). Two significant features
remain before the first public npm/registry release:

- **Phase 10**: Network Endpoint Create (4 tasks, small)
- **Phase 12 UX**: resourceLocator components for Endpoint/Job fields (8 tasks,
  changes how GUIDs are stored in saved workflows — breaking change)

The Phase 12 resource split (already completed in v0.5.0) is also a breaking
change: `resource` values changed (e.g. `endpoint` split into `endpoint`,
`logicalGroup`, `staticGroup`, etc.), which breaks any saved n8n workflows from
v0.4.x.

The question: ship v0.5.0 now and resourceLocator as v0.6.0, or hold and ship
everything as v1.0.0?

## Decision

**Ship v1.0.0 as the first public release**, consolidating:
- Resource split (done)
- Network Endpoint Create (Phase 10)
- Example Workflows (Phase 11)
- resourceLocator UX (Phase 12 UX)

Do **not** publish v0.5.0 as an intermediate release.

## Consequences

**Easier:**
- Users migrate once (0.4.x → 1.0.0), not twice (0.4.x → 0.5.0 → 0.6.0)
- A v1.0.0 release is a stronger signal for the n8n community registry (REQ-PUBLISH-2)
- CHANGELOG is cleaner — one "major release" entry instead of two breaking minors
- No obligation to maintain a 0.5.x branch once 0.6.0 ships

**Harder:**
- Slight delay to first public release (Phase 10 + Phase 12 UX estimated: 2 sessions)
- Must hold the npm publish step until all phases complete

**Risks accepted:**
- The project has zero public users yet (not submitted to registry), so there is
  no installed base to protect with a phased rollout. The delay risk is negligible.
