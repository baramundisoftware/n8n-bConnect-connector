# ADR-006: Artifact Signing Strategy for v1.0.0
Date: 2026-04-02
Status: Accepted

## Context

REQ-SEC-SIGN requires that release artifacts be signed so that users can verify
integrity and authenticity before installation. Two signing mechanisms are available:

1. **npm provenance** (Sigstore / OIDC) — `npm publish --provenance` generates a
   cryptographically verifiable link between the published package and the GitHub
   Actions run that built it. Requires no external certificate. Verifiable via
   `npm audit signatures`.

2. **GPG detach-signature** — `gpg --detach-sign` produces a `.asc` file attached
   to the GitHub Release, allowing users to verify the tarball before installing.
   Requires a signing key. Currently: personal RSA-4096 key for
   `bernd.wiedemann@baramundi.com` (expires 2028-04-01). A baramundi corporate
   code-signing certificate is not yet provisioned.

## Decision

Use **both mechanisms** for v1.0.0:

- **npm provenance** as the primary integrity mechanism for npmjs.com consumers.
  Zero infrastructure requirement; Sigstore provides a public, auditable transparency log.
  Added to `release.yml` as `npm publish --access public --provenance`.

- **GPG tarball signing** with the personal `bernd.wiedemann@baramundi.com` key as
  the secondary mechanism for users who download the `.tgz` directly from the
  GitHub Release. The key fingerprint is documented in `INSTALLATION.md`.
  When a baramundi corporate certificate becomes available, re-sign with the
  corporate key and update `INSTALLATION.md` accordingly (no code change needed).

The GPG key used is a personal key at a professional email address. This is an
accepted interim posture: the key is 4096-bit RSA, expires 2028-04-01, and the
private key is held only by the maintainer. Risk: key compromise would allow a
malicious actor to produce a valid `.asc` signature. Mitigation: npm provenance
via Sigstore provides an independent, non-GPG integrity path that is not affected
by GPG key compromise.

## Consequences

**Easier**:
- npm users get automatic integrity verification via `npm audit signatures`
- GitHub Release consumers can verify the tarball with `gpg --verify`
- Both mechanisms operate independently — compromise of one does not affect the other

**Harder**:
- Release workflow requires both an npm token (for publish) and GPG key passphrase
  (for signing) as GitHub Secrets
- When baramundi corporate cert is provisioned, a re-signing of historical releases
  is optional but recommended for auditability

**Risks accepted**:
- GPG key is personal, not a baramundi organisational cert — documented and accepted
  until corporate cert is provisioned
- `npm publish --provenance` requires the `id-token: write` permission in CI
  (already present in ci.yml)
