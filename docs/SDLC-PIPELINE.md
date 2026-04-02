# SDLC Pipeline — Claude Code Slash Command Architecture

## Overview

This document describes the full Software Development Lifecycle (SDLC) pipeline
implemented as Claude Code slash commands. The pipeline extends the inner build
loop (`/process-start-task`) with phase-gate commands that enforce design review,
code review, security scanning, QA validation, and release management.

**Current version**: 0.8.2
**Workflow model:** Trunk-based development on `master` (solo developer).
No feature branches or pull requests. The gates enforce quality and security
directly before pushing to `origin/master`.

---

## The Gap: What `/process-start-task` Covers

The core task executor handles:

- Reading `Tasks.md` and dispatching the right developer role
- TDD implementation loop (Red → Green → Refactor)
- Lint, type-check, unit test pass
- Git commit per task

It does **not** cover: design approval, code review, security scanning, E2E
testing, UAT sign-off, versioning, or publishing.

---

## Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  PHASE START  (new phase begins on master)                   │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
          ┌────────────────────────────┐
          │   /process-design-review   │
          │                            │
          │  Roles: architect,         │
          │         product-owner      │
          │                            │
          │  • Read Requirements.md    │
          │  • Draft/review ADR        │
          │  • Define API contract     │
          │  • Identify security risks │
          │  • ⛔ USER SIGN-OFF        │
          └────────────┬───────────────┘
                       │ ✅ Design approved
                       ▼
          ┌────────────────────────────┐
          │   /process-start-task      │
          │   (loops until phase done) │
          │                            │
          │  Roles: all developer      │
          │         roles              │
          │                            │
          │  • TDD per task            │
          │  • Lint + type-check       │
          │  • Unit tests pass         │
          │  • Commit to master        │
          └────────────┬───────────────┘
                       │ ✅ All tasks committed (local)
                       ▼
          ┌────────────────────────────┐
          │   /process-pr-review       │
          │   (push gate, not PR)      │
          │                            │
          │  Roles: security-engineer, │
          │         qa-engineer,       │
          │         lead-dev           │
          │                            │
          │  • npm audit (no high/crit)│
          │  • License compliance      │
          │  • semgrep SAST scan       │
          │  • Secrets scan            │
          │  • Full unit test suite    │
          │  • AI code review summary  │
          │  • ⛔ USER SIGN-OFF        │
          │  • git push origin master  │
          └────────────┬───────────────┘
                       │ ✅ Pushed to origin/master
                       ▼
          ┌────────────────────────────┐
          │   /process-qa-gate         │
          │                            │
          │  Roles: qa-engineer,       │
          │         perf-engineer      │
          │                            │
          │  • E2E tests (bConnectMock)│
          │  • System tests (live API) │
          │  • Regression suite        │
          │  • Performance baseline    │
          │  • UAT checklist           │
          │  • ⛔ USER SIGN-OFF        │
          └────────────┬───────────────┘
                       │ ✅ QA passed
                       ▼
          ┌────────────────────────────┐
          │   /process-release         │
          │                            │
          │  Roles: tech-writer,       │
          │         devops-engineer    │
          │                            │
          │  • Semver bump             │
          │  • CHANGELOG.md update     │
          │  • git tag -s vX.Y.Z       │
          │  • SBOM generation          │
          │  • GPG sign tarball         │
          │  • npm publish --provenance │
          │  • GitHub Release + assets  │
          │  • Post-publish smoke test  │
          └────────────────────────────┘
                       │
                       ▼
               PHASE COMPLETE
         (restart Claude, next phase)
```

---

## Command Reference

| Command | Gate | Human Sign-off | Roles Invoked |
|---|---|:---:|---|
| `/process-design-review` | Pre-build | ✅ Required | architect, product-owner |
| `/process-start-task` | Build loop | — | all developer roles |
| `/process-pr-review` | Push gate | ✅ Required | security-engineer, qa-engineer, lead-dev |
| `/process-qa-gate` | Pre-release | ✅ Required | qa-engineer, perf-engineer |
| `/process-release` | Release | ✅ Required | tech-writer, devops-engineer |

> **Note on `/process-pr-review`:** Despite the name, this project uses trunk-based
> development — no PRs are opened. The command runs all security and code review
> checks locally, presents a summary, and pushes directly to `origin/master` after
> your approval. If this project moves to a team workflow, only this step changes.

---

## Roles Required

All roles are globally defined in `~/.claude/commands/`.

| Role Command | Used In | Primary Responsibility |
|---|---|---|
| `/architect` | design-review | ADRs, API contracts, design sign-off |
| `/product-owner` | design-review | Acceptance criteria, requirements validation |
| `/lead-dev` | start-task, pr-review | Implementation, code review |
| `/backend-dev` | start-task | API, business logic |
| `/test-engineer` | start-task | Unit tests (TDD) |
| `/security-engineer` | pr-review | OWASP, SAST, SCA, dependency scan, license compliance, secrets |
| `/qa-engineer` | pr-review, qa-gate | Integration, E2E, UAT |
| `/perf-engineer` | qa-gate | Benchmarks, performance regression |
| `/tech-writer` | release | CHANGELOG, release notes, README |
| `/devops-engineer` | release | Semver, git tag, SBOM, signing, npm publish, GitHub Release |

No new roles are required. All ten existing roles cover the full pipeline.

---

## Security Integration

Security is not a single step — it runs at five checkpoints:

### 1. Design Review (`/process-design-review`)
- Threat model for new features
- Identify SSRF/injection risks before code is written
- Review credential handling design
- SSL/TLS strategy documented

### 2. Push Gate (`/process-pr-review`) — Primary security gate
```bash
# Dependency vulnerabilities
npm audit --audit-level=high       # blocks on high/critical

# SCA — License compliance (REQ-SEC-SCA)
npx license-checker --production --failOn "GPL-3.0-only;GPL-3.0-or-later;AGPL-3.0-only;AGPL-3.0-or-later;SSPL-1.0"

# Secrets scanning
npx secretlint "**/*"              # blocks on credential leaks

# Static analysis (SAST)
npx semgrep --config=auto src/     # OWASP ruleset

# Type safety
npm run type-check                 # no implicit any, strict mode
```

Findings are classified:

| Severity | Action |
|---|---|
| Critical / High | **BLOCK** — must fix before push |
| Medium | Document + create follow-up task in `Tasks.md` |
| Low / Info | Log in code review summary |

### 3. QA Gate (`/process-qa-gate`)
- E2E tests against bConnectMock (`docker-compose.test.yml`) — all 6 nodes, ~210 tests
- System tests against live bMS server (`test/system/`, requires `BMS_URL` env var)
- Live API integration tests validate no credential exposure in logs
- SSL bypass feature (`Ignore SSL Issues`) explicitly tested and documented
- SSRF vector (user-supplied server URL) validated against allowlist behavior

### 4. Release Gate (`/process-release`) — Signing & SBOM
```bash
# SBOM generation (CycloneDX)
npm run sbom                        # → sbom.json (attached to GitHub Release)

# GPG sign tarball with baramundi certificate (REQ-SEC-SIGN)
gpg --detach-sign --armor n8n-nodes-baramundi-management-solution-*.tgz

# npm provenance (Sigstore — automatic in GitHub Actions)
npm publish --provenance --access public
```

Release assets (uploaded to GitHub Release):
- `n8n-nodes-baramundi-management-solution-<version>.tgz` — the package
- `n8n-nodes-baramundi-management-solution-<version>.tgz.asc` — GPG detach-signature
- `sbom.json` — CycloneDX Software Bill of Materials

### 5. Continuous Monitoring — Mend (prepared, not yet active)

Mend (formerly WhiteSource) configuration is committed at `.whitesource`. It activates
automatically when the Mend GitHub App is installed on the repository. Provides:
- Reachability analysis (is the vulnerable code path actually called?)
- License audit trail with policy engine
- Automated fix PRs for vulnerable dependencies
- Historical vulnerability trend tracking

### Project-Specific Security Concerns (n8n bConnect node)

| Risk | Location | Mitigation |
|---|---|---|
| SSRF | `Server URL` credential field | Validate URL format; document that only internal BMS URLs should be used |
| Credential exposure | API request logging | Verify Basic Auth header is never logged by transport layer |
| SSL bypass | `Ignore SSL Issues` flag | Feature intentional; must be documented as risk-accepted |
| Dependency chain | `node_modules` | `npm audit` + GitHub Dependency Review + license-checker on every push gate; Dependabot alerts enabled; Mend prepared |
| Unsigned artifacts | npm tarball, GitHub Release | npm provenance (Sigstore) + GPG detach-signature with baramundi certificate |
| No SBOM | Published package | CycloneDX SBOM generated and attached to every GitHub Release |

---

## Required Tools / Extensions

### Already Available
- `npm audit` — dependency vulnerability scan
- `npx` — runs semgrep, secretlint, license-checker, cyclonedx without global install
- `gh` (GitHub CLI) — release management, CI status checks
- `git` — tagging, branching
- `docker` / `docker compose` — bConnectMock for E2E tests
- `gpg` — tarball signing with baramundi certificate

### Install Once (recommended global)
```bash
# Secrets scanning
npm install -g secretlint @secretlint/secretlint-rule-preset-recommend

# CHANGELOG generation
npm install -g conventional-changelog-cli

# SBOM generation
npm install -g @cyclonedx/cyclonedx-npm

# License compliance
npm install -g license-checker
```

### GitHub Repository Settings
- **Dependabot alerts**: enable in repo Settings → Security → Dependabot
- **GitHub Actions**: CI workflow (`.github/workflows/ci.yml`) — runs on every push/PR to master
- **npm token**: stored as `NPM_TOKEN` in GitHub repo secrets for publish step
- **GPG signing key**: stored as `GPG_PRIVATE_KEY` + `GPG_PASSPHRASE` in GitHub repo secrets (for tarball signing)
- **Mend GitHub App**: install when baramundi Mend org is provisioned (`.whitesource` config ready)
- **Branch protection**: require CI status checks on `master`, disable force-push (when GitHub repo is created)
- **Signed git tags**: all release tags must use `git tag -s` (GPG-signed) — never `git tag -a`

### CI Workflow (`.github/workflows/ci.yml`)

Two jobs run on every push to `master` / PR against `master`:

**Job 1: `dependency-review`** (PRs only)
- `actions/dependency-review-action@v4` — blocks high/critical vulns and denied licenses (GPL-3.0, AGPL-3.0, SSPL-1.0)

**Job 2: `build-and-test`** (every push + PR)
- `npm ci`
- `npm run lint`
- `npm run build` (TypeScript compilation)
- `npm run test:unit` (Vitest — unit tests only, excludes `test/system/`)
- `npm audit --omit=dev --audit-level=high` (runtime deps only)
- `license-checker --production --failOn` (denied licenses)
- File permission check (all `.ts` files must be 644)

**Permissions**: `contents: read`, `id-token: write` (for future npm provenance)

---

## When to Use Which Commands

### Full feature development (typical)
```
/process-design-review  →  /process-start-task  →  /process-pr-review
```

### Patch / bugfix (no design change needed)
```
/process-start-task  →  /process-pr-review
```

### Release (after QA sign-off on accumulated changes)
```
/process-qa-gate  →  /process-release
```

### Emergency hotfix
```
/process-start-task  →  /process-pr-review  →  /process-release
```
*(skip qa-gate — document as risk-accepted in release notes)*

---

## Project Setup Requirements

| File / Setting | Required By | Purpose |
|---|---|---|
| `Tasks.md` | all process commands | Task backlog and done tracking |
| `Requirements.md` | design-review, release | Requirements and acceptance criteria |
| `CLAUDE.md` | all commands | Project context, conventions |
| `.github/workflows/ci.yml` | ongoing | CI: build, lint, test, audit, license check, dependency review |
| `CHANGELOG.md` | release | Release history |
| `.whitesource` | ongoing (when activated) | Mend SCA configuration — license policy, auto-remediation |
| `docker-compose.test.yml` | qa-gate | bConnectMock container for E2E tests |
| `vitest.config.ts` | build, test | Test runner configuration |
| `docs/adr/` | design-review | Architectural Decision Records (ADR-001, ADR-002, ADR-005) |
| `NPM_TOKEN` (GitHub secret) | release | npm publish authentication |
| `GPG_PRIVATE_KEY` (GitHub secret) | release | baramundi certificate for tarball signing |
| `GPG_PASSPHRASE` (GitHub secret) | release | Passphrase for GPG signing key |
| Dependabot enabled | ongoing | Automated dependency vulnerability alerts |

---

*Document version: 1.2 — 2026-04-02 (added SCA, artifact signing, SBOM, Mend; synced with actual CI/project state)*
