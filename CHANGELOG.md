# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Endpoint → Maintenance Window → **Get Group Maintenance Window** works again: it read a parameter the form does not have and failed on every run (#43)
- A Server URL with a trailing space or slash no longer breaks every request with 404; the URL is trimmed before use (#34)
- The credential **Test** button now really checks the connection: it requests `/endpoints/v2.0/Endpoints` (the old path did not exist) and fails on HTTP errors, with clear messages for 401 (credentials), 403 (permissions) and 404 (Server URL). Before, it reported success even with a wrong URL or password (#35)

### Added
- Spec-conformance check (`npm run check:spec`, part of the unit tests): calls every operation the editor offers, per bMS release, and checks the HTTP requests against the 25R2/26R1 OpenAPI specs — route and module prefix, query parameters, body fields, required fields, enum values, JSON Patch paths. Known violations are baselined against their issues (#37, #39, #42–#46)

## [0.9.2] - 2026-10-06

Maintenance release. No operation, parameter or credential changes: existing workflows keep working.

### Changed
- Node names and labels use the lowercase brand ("baramundi Endpoint", "baramundi Management Suite Version", …) and the version options read "25 R2" / "26 R1". Display only — internal node names and option values (`25R2`, `26R1`) are unchanged
- Build toolchain moved to @n8n/node-cli 0.51; it produces byte-identical compiled output (#30)

### Security
- Runtime dependency audit is clean: axios 1.20 is enforced for the n8n packages that pin 1.18 (#22, #30)
- Development toolchain upgraded to clear critical and high advisories: vitest 5, @n8n/node-cli 0.51, eslint-plugin-n8n-nodes-base 2.0 (#26, #30, #32)
- Vulnerabilities can be reported privately through GitHub's private vulnerability reporting (see SECURITY.md) (#25)
- Repository hardening: CodeQL code scanning, secret scanning with push protection, protected `main` branch and release tags

### Documentation
- Installation instructions corrected: the package is not on npm yet, so install the release `.tgz` (Community Nodes install failed with "Package version does not exist") (#21, #29)
- INSTALLATION.md: SHA-256 verification, Docker and Docker Compose recipes, upgrade section, API key credentials, prerequisites aligned with the package (n8n ≥ 2.9, Node.js ≥ 22.16) (#29)
- README: Technical Preview notice and guidance on AI services, data privacy and token usage

### For contributors
- GitHub Actions CI on every pull request: lint, build, unit tests on Node 22.16 and 24, license check, dependency audit (#22)
- npm ≥ 11 required (matches CI and Dependabot) (#32)
- CODEOWNERS, issue forms (bug report, change proposal) and a pull request template (#22)

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
