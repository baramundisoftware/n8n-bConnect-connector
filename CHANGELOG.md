# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Lint passes again: the lowercase "baramundi" display names are exempted from n8n's title-case rule
- Runtime dependency audit is clean: axios 1.20 (also forced under `n8n-workflow` via `overrides`)

### Changed
- GitHub Actions CI restored for the public repository (lint, build, unit tests, license check; audit reported)
- Dependabot also keeps the GitHub Actions in `ci.yml` up to date
- Dev dependencies: prettier 3.9.9, typescript-eslint 8.71 (supersedes Dependabot PR #20)
- Test toolchain: vitest and @vitest/coverage-v8 1.6 → 5.0, @types/node 20 → 22 (matches the Node ≥ 22.16 engines floor); clears the critical dev-only advisories (supersedes #23, #24)
- Build toolchain: @n8n/node-cli 0.34 → 0.51 (compiled output unchanged); axios override now applies tree-wide (also pinned by @n8n/backend-network); top-level `dist/*.png` excluded from the package because the new build copies untracked root images (supersedes #27, #28)
- eslint-plugin-n8n-nodes-base 1.16 → 2.0 (only breaking change: ESLint ≥ 8.40; we use 9.29) (supersedes #31)
- CI runs npm 11 on every job (as Dependabot does): npm 10 on Node 22 rejected Dependabot's lockfiles, so every Dependabot PR failed `npm ci` there; CONTRIBUTING now asks for npm ≥ 11

### Documentation
- README and INSTALLATION.md: install from the GitHub release `.tgz` until the package is on npm (Community Nodes install fails with "Package version does not exist", #21); INSTALLATION.md updated to 0.9.1, SHA-256 verification instead of the GPG steps releases don't ship, prerequisites aligned (n8n ≥ 2.9, Node ≥ 22.16), API key credentials, upgrade section

### Added
- CODEOWNERS, issue forms (bug report, change proposal) and a pull request template

## [0.9.1] - 2026-06-09

### Fixed
- Renamed LICENSE.md to LICENSE for proper GitHub license detection
- Split third-party notices into separate THIRD-PARTY-LICENSES file
- Updated SECURITY.md supported version from 0.8.x to 0.9.x
- Resolved runtime uuid vulnerability via npm audit fix

### Added
- CONTRIBUTING.md with development guidelines
- Dependabot configuration for automated dependency updates
- `.editorconfig` and `.nvmrc` for contributor consistency

## [0.9.0] - 2026-06-09

Initial release. n8n community node for baramundi Management Suite via the bConnect REST API.

- 6 nodes: Endpoint, Job, Asset, Software, Admin, Security
- 229 operations across 27 resources
- Compatible with baramundi Management Suite 25R2 and 26R1
- Authentication via Basic Auth or API Key
- Dynamic dropdown menus populated from your bMS server
- 4 example workflows included
- 1072 unit tests, 80% branch coverage
