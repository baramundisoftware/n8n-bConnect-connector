# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.9.x   | Yes       |
| < 0.9   | No        |

## Reporting a Vulnerability

Please report security vulnerabilities to **support@baramundi.com** rather than opening a public issue. Include:

- Description of the vulnerability and its potential impact
- Steps to reproduce
- Affected version(s)

We aim to acknowledge reports within 2 business days and provide a fix timeline within 7 days for critical findings.

---

## Accepted Risks

### Dev-dependency audit risk (D-4)

**Scope:** `devDependencies` only (e.g. `typescript`, `vitest`, `eslint` and related plugins).

**Rationale:** Dev dependencies are never included in the production bundle (`dist/`). They are used exclusively at build time and in test execution on developer machines and CI runners. A vulnerability in a dev-only package cannot be exploited by end users of the n8n node.

**Control:** `npm audit --omit=dev --audit-level=critical` runs in CI on every push (see `.github/workflows/ci.yml`). This gate blocks production-dependency vulnerabilities from merging.

**Accepted condition:** Moderate or high advisories in `devDependencies` that have no available fix (e.g. transitive peer-dependency conflicts) are accepted as low operational risk. These must be reviewed and re-evaluated whenever a fix becomes available or at each minor release.

### Runtime peer-dependency findings

Two HIGH lodash advisories (GHSA-r5fr-rjxr-66jc, GHSA-f23m-r3pf-42rh) exist in `n8n-workflow` peer dependency. The affected functions (`_.template`, `_.omit`) are never called by this connector. No upstream fix is available.

**Last reviewed:** 2026-04-02
