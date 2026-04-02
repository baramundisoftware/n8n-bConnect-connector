# SDLC Pipeline — Claude Code Slash Command Architecture

## Overview

This document describes the full Software Development Lifecycle (SDLC) pipeline
implemented as Claude Code slash commands. The pipeline extends the inner build
loop (`/process-start-task`) with phase-gate commands that enforce design review,
code review, security scanning, QA validation, and release management.

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
│  PHASE START  (new phase or feature branch)                  │
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
          │  • Commit per task         │
          └────────────┬───────────────┘
                       │ ✅ All tasks committed
                       ▼
          ┌────────────────────────────┐
          │   /process-pr-review       │
          │                            │
          │  Roles: security-engineer, │
          │         qa-engineer,       │
          │         lead-dev           │
          │                            │
          │  • git push + open PR      │
          │  • npm audit (no high/crit)│
          │  • semgrep SAST scan       │
          │  • Secrets scan            │
          │  • Full unit test suite    │
          │  • AI code review summary  │
          │  • ⛔ USER SIGN-OFF        │
          └────────────┬───────────────┘
                       │ ✅ PR approved + merged
                       ▼
          ┌────────────────────────────┐
          │   /process-qa-gate         │
          │                            │
          │  Roles: qa-engineer,       │
          │         perf-engineer      │
          │                            │
          │  • E2E tests (live API)    │
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
          │  • git tag vX.Y.Z          │
          │  • npm publish             │
          │  • GitHub Release          │
          │  • Post-publish smoke test │
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
| `/process-pr-review` | Post-commit | ✅ Required | security-engineer, qa-engineer, lead-dev |
| `/process-qa-gate` | Pre-release | ✅ Required | qa-engineer, perf-engineer |
| `/process-release` | Release | ✅ Required | tech-writer, devops-engineer |

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
| `/security-engineer` | pr-review | OWASP, SAST, dependency scan, secrets |
| `/qa-engineer` | pr-review, qa-gate | Integration, E2E, UAT |
| `/perf-engineer` | qa-gate | Benchmarks, performance regression |
| `/tech-writer` | release | CHANGELOG, release notes, README |
| `/devops-engineer` | release | Semver, git tag, npm publish, GitHub Release |

No new roles are required. All ten existing roles cover the full pipeline.

---

## Security Integration

Security is not a single step — it runs at three checkpoints:

### 1. Design Review (`/process-design-review`)
- Threat model for new features
- Identify SSRF/injection risks before code is written
- Review credential handling design
- SSL/TLS strategy documented

### 2. PR Review (`/process-pr-review`) — Primary security gate
```bash
# Dependency vulnerabilities
npm audit --audit-level=high       # blocks on high/critical

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
| Critical / High | **BLOCK** — must fix before PR merges |
| Medium | Document + create follow-up task |
| Low / Info | Log in security findings section of PR |

### 3. QA Gate (`/process-qa-gate`)
- Live API integration tests validate no credential exposure in logs
- SSL bypass feature (`Ignore SSL Issues`) explicitly tested and documented
- SSRF vector (user-supplied server URL) validated against allowlist behavior

### Project-Specific Security Concerns (n8n bConnect node)

| Risk | Location | Mitigation |
|---|---|---|
| SSRF | `Server URL` credential field | Validate URL format; document that only internal BMS URLs should be used |
| Credential exposure | API request logging | Verify Basic Auth header is never logged by transport layer |
| SSL bypass | `Ignore SSL Issues` flag | Feature intentional; must be documented as risk-accepted |
| Dependency chain | `node_modules` | `npm audit` on every PR, Dependabot alerts enabled |

---

## Required Tools / Extensions

### Already Available
- `npm audit` — dependency vulnerability scan
- `npx` — runs semgrep, secretlint without global install
- `gh` (GitHub CLI) — PR creation, release management
- `git` — tagging, branching

### Install Once (recommended global)
```bash
# Secrets scanning
npm install -g secretlint @secretlint/secretlint-rule-preset-recommend

# CHANGELOG generation
npm install -g conventional-changelog-cli

# Local GitHub Actions runner (optional, for CI validation)
# https://github.com/nektos/act
brew install act   # or: apt install act
```

### GitHub Repository Settings
- **Branch protection on `main`**: require PR + status checks before merge
- **Dependabot alerts**: enable in repo Settings → Security
- **GitHub Actions**: CI workflow (`.github/workflows/ci.yml`) must exist and pass
- **npm token**: stored as `NPM_TOKEN` in GitHub repo secrets for publish step

### CI Workflow Requirements
The `/process-pr-review` command expects a passing CI run. The existing
`.github/workflows/` must include at minimum:
- `npm ci`
- `npm run lint`
- `npm run type-check`  
- `npm test`
- `npm audit --audit-level=high`

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

For the full pipeline to work, the project needs:

| File / Setting | Required By | Purpose |
|---|---|---|
| `Tasks.md` | all process commands | Task backlog and done tracking |
| `Requirements.md` | design-review, release | Requirements and acceptance criteria |
| `CLAUDE.md` | all commands | Project context, conventions |
| `.github/workflows/ci.yml` | pr-review | Automated build + test on PR |
| `CHANGELOG.md` | release | Release history |
| `NPM_TOKEN` (GitHub secret) | release | npm publish authentication |
| Branch protection on `main` | pr-review | Enforce PR workflow |
| Dependabot enabled | ongoing | Automated dependency alerts |

---

*Document version: 1.0 — 2026-04-02*
