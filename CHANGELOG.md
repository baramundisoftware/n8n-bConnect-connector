# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
