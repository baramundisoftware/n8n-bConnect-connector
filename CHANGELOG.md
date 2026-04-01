# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.1] - 2026-04-01

> **Semver rationale**: Patch bump. Security hardening only — no new operations, no breaking changes.

### Security

- **F-2026-01** (MEDIUM): Added `validateGuid()` + `NodeOperationError` guards to all `*Id` URL path parameters across 8 previously unprotected execute modules: `activeDirectory`, `defenseControl`, `operatingSystem`, `serverManagement`, `software`, `universalDynamicGroups`, `updateManagement`, `variable`. Prevents malformed or injected values from reaching the API.
- **F-2026-02** (LOW): Added `validateGuid()` to 13 unvalidated `Id` parameters in `job.execute.ts` Phase 8D gap functions (`getJobDefinitionsByFolder`, `getKioskReleasesByJobDefinition`, `getJobInstancesByGroup` variants, `assignJobTo*` variants, `getKioskReleasesByEndpoint/LogicalGroup/ADObject`). Closes OData injection surface in `getInstances`.
- **F-2026-03** (LOW): Fixed file permissions — `chmod 644` on all `.ts` files that had mode `664` (`Baramundi.node.ts`, `utils/types.ts`, all `*.fields.ts`). Added CI step to prevent regression.

## [0.4.0] - 2026-03-31

> **Semver rationale**: Minor bump. Phase 8 adds ~43 new read/write operations across 6 resource modules (activeDirectory, asset, endpoint, job, software, variable). No breaking changes to existing operations.

### Added (Phase 8 — API Coverage Gaps)

#### Active Directory (Phase 8A — 6 new operations)
- `getADGroupsByADGroup`: Get sub-groups within an AD group
- `getADObjectsByADGroup`: Get AD objects in an AD group
- `getADObjectMemberships`: Get AD group memberships of an AD object
- `getADObjectsByOrgUnit`: Get AD objects in an organizational unit
- `getADUsersByOrgUnit`: Get AD users in an organizational unit
- `getOrgUnitsByOrgUnit`: Get sub-OUs within an organizational unit

#### Asset (Phase 8B — 8 new operations)
- `getAssetStockFolder`: Get a single asset stock folder by ID
- `getAssetStockSubFolders`: Get sub-folders of an asset stock folder
- `getAssetTypeFolders`: Get all asset type folders
- `getAssetTypeFolder`: Get a single asset type folder by ID
- `createAssetTypeFolder`: Create a new asset type folder
- `updateAssetTypeFolder`: Update an asset type folder (PATCH)
- `deleteAssetTypeFolder`: Delete an asset type folder
- `getAssetTypeFolderSubFolders`: Get sub-folders of an asset type folder

#### Endpoint (Phase 8C — 8 new operations)
- `getEndpointMaintenanceWindow`: Get the maintenance window for an endpoint
- `getGroupMaintenanceWindow`: Get the maintenance window for a logical group
- `getLogicalGroupSubGroups`: Get sub-groups of a logical group
- `getEndpointsByLogicalGroup`: Get endpoints in a logical group
- `getEndpointsByStaticGroup`: Get endpoints in a static group
- `getEndpointsByDynamicGroup`: Get endpoints in a dynamic group
- `getEndpointsByADUser`: Get endpoints assigned to an AD user
- `getEndpointsByUDG`: Get endpoints in a Universal Dynamic Group (26R1+)

#### Job (Phase 8D — 14 new operations)
- `getSubFolders`: Get sub-folders of a job folder
- `getJobDefinitionsByFolder`: Get job definitions in a folder
- `getKioskReleasesByJobDefinition`: Get kiosk releases for a job definition
- `getJobInstancesByLogicalGroup/StaticGroup/DynamicGroup/UDG`: Job instances by group type
- `assignJobToLogicalGroup/StaticGroup/DynamicGroup/UDG`: Assign job definition to group
- `getKioskReleasesByEndpoint`: Get kiosk releases for an endpoint
- `getKioskReleasesByLogicalGroup`: Get kiosk releases for a logical group
- `getKioskReleasesByADObject`: Get kiosk releases for an AD object

#### Software (Phase 8E — 5 new operations, all 26R1+)
- `addApplicationToBundle`: Add an application to a bundle
- `replaceApplicationInBundle`: Update a bundle application via PATCH
- `updateBundleFolder`: Update a bundle folder
- `getBundleApplications`: Get all bundle applications
- `deleteBundleApplication`: Delete a bundle application

#### Variable (Phase 8F — 2 new operations)
- `getVariableInstancesByApplication`: Get variable instances for a Windows application
- `getVariableInstancesByJobDefinition`: Get variable instances for a Windows job definition

### Tests
- Added 44 new unit tests; total 526 passing (from 480)

## [0.3.1] - 2026-03-31

> **Semver rationale**: Patch bump. All changes are non-breaking quality fixes: lint errors, type safety, file permissions. No new features or API changes.

### Fixed (IT Audit 2026-03-31 — Findings F7.1–F7.4)

- **F7.1 — Eliminate `no-explicit-any` warnings**: Replaced `value: any` with `value: unknown` in `patchOperations` arrays across 8 action execute files (asset, defenseControl, endpoint, job, operatingSystem, serverManagement, updateManagement, variable). RFC 6902 patch value is intentionally untyped but `unknown` is the correct TypeScript widened type.
- **F7.2 — Lint: 0 errors, 0 warnings**: Fixed 30 lint errors introduced by `eslint-plugin-n8n-nodes-base` upgrading from 1.16.3 → 1.16.6 (new rules: `node-param-display-name-wrong-for-dynamic-options`, `node-param-description-wrong-for-dynamic-options`, `node-param-default-wrong-for-options`). All dynamic dropdown fields now use n8n-standard "Name or ID" displayName and "Choose from the list…" description. Sorted 9 options arrays alphabetically. Removed 2 omittable descriptions identical to option name. Added `eslint-disable` comments with rationale for 3 spread-operator false positives.
- **F7.3 — `tsconfig.eslint.json` permissions**: Normalised from 664 to 644 (consistent with all other config files).
- **F7.4 — `error as JsonObject` forced cast**: Added `toJsonObject(e: unknown): JsonObject` helper in `requestApi.ts`. All 4 `NodeApiError` throw sites now use the helper instead of an unguarded type assertion. Handles non-object thrown values (strings, null) safely.
- **INF-1 — `test/system/job.system.test.ts` permissions**: Normalised from 664 to 644.

## [0.3.0] - 2026-03-30

> **Semver rationale**: Minor version bump. All changes are backwards-compatible additions or non-breaking hardening. No API operations removed.

### Security (IT Audit 2026-03-30 — Findings F1.2, F2.1, F2.2, F3.1, F3.2, F5.1, F5.2, F6.2)

- **F1.2 — SSL bypass warning**: Added `notice`-type UI warning in `BconnectApi` credentials visible when `Ignore SSL Issues` is enabled. Warning names MitM risk and recommends CA import as the preferred alternative.
- **F2.1 — Strict ISO 8601 validation**: Replaced permissive `new Date()` check with a strict regex. Rejects human-readable strings (`March 30, 2026`), date-only (`2026-01-22`), and space-separated formats. 9 new unit tests.
- **F3.1 — CI security audit gate**: Added `.github/workflows/ci.yml` enforcing `npm audit --omit=dev --audit-level=high`. Runtime package confirmed at 0 vulnerabilities. DevDependency risk acceptance documented below.
- **F3.2 — Stale archive removal**: Deleted three v0.1.0 distribution archives that predated Phase 6 security fixes. Added `*.tgz`, `*.tar.gz`, `*.zip` to `.gitignore`.
- **F5.1 — File permission hardening**: All source directories set to `755`, all source files to `644`, executable scripts to `755`.
- **F5.2 — ESLint CI enforcement**: Fixed ESLint configuration (`tsconfig.eslint.json` added, test file overrides), lint now passes with 0 errors. `npm run lint` is a required CI step.
- **F6.2 — HTTP retry with exponential backoff**: `apiRequest()` now retries up to 3 times on HTTP 429, 503, and ETIMEDOUT errors. Backoff is exponential (100ms × 2^attempt) with jitter. Respects `Retry-After` header. Non-retryable 4xx errors fail immediately.

### Changed

- **F2.2 — Dropdown truncation indicator**: All six `LoadOptions` dropdowns (endpoints, jobs, org units, logical groups, static groups, dynamic groups) now append a `"— showing first 100 results, use GUID input for more —"` option when the API response indicates more pages exist.
- **F6.1 — Pagination safety cap**: `apiRequestAllItems()` cap reduced from 1000 pages to 50 pages (`MAX_PAGE_CAP`). New optional `maxItems` parameter (default 5000) stops collection early and appends a `{ _truncated: true, _message: "..." }` sentinel to the result set so callers can surface a warning to users.

### Security — DevDependency Risk Acceptance (IT Audit F3.1)

The following vulnerabilities remain in `devDependencies` after `npm audit fix`. They have **no upstream fix** available at the time of writing (2026-03-30) and are **not present in the runtime distribution** (confirmed via `npm audit --omit=dev`).

| Package | Severity | Path | Status |
|---|---|---|---|
| `handlebars` | CRITICAL | `@n8n/node-cli` → `eslint-plugin-n8n-nodes-base` → `handlebars` | No fix available upstream |
| `minimatch` | HIGH | `@n8n/node-cli` → `@typescript-eslint` → `minimatch` | No fix available upstream |
| `esbuild` | MODERATE | `@n8n/node-cli` → `esbuild` | Affects dev server only, not exploitable in CI |

**Risk acceptance**: These vulnerabilities affect only the build toolchain running on developer workstations and CI agents. The runtime npm package (`dist/`) has zero vulnerabilities. Build agents must be treated as trusted environments and not shared with untrusted workloads. This risk acceptance will be reviewed when upstream packages release fixes.

**CI gate added**: `npm audit --omit=dev --audit-level=high` is enforced in `.github/workflows/ci.yml`. Any runtime vulnerability at HIGH or above will block the pipeline.

## [0.2.0] - 2026-03-30

> **Semver rationale**: This is a **minor** version bump (0.1.0 → 0.2.0) despite the V1.1 removal breaking change, because the package has not yet reached stable 1.0.0. Under semver §4, breaking changes in pre-1.0 releases may be reflected as minor increments. The V1.1 removal is documented prominently in the Breaking Changes section so downstream users can plan migrations.

### Breaking Changes

- **V1.1 API modules removed**: All V1.1 API operations have been removed. The connector now exposes only bConnect V2.0 API operations. Workflows using the following resources must be migrated to the V2.0 equivalents listed below:

| Removed Resource | V2.0 Replacement |
|---|---|
| BitLocker Secrets (V1.1) | Defense Control → Get/Update BitLocker Secrets (26R1+) |
| Compliance Violations (V1.1) | Compliance → Get Detected Rule Violations (26R1+) |
| Org Units (V1.1) | Endpoint → Group operations |
| Endpoint Inventory Software (V1.1) | Software → Get Installed Windows Software |
| Boot Environments, Hardware Profiles, Images, SSH, VPP, Inventory scans | No direct replacement — remove from workflows |

### Added

- **`bmsVersion` parameter**: New required parameter added before the Resource selector. Select your baramundi Management Suite version (25R2 or 26R1) to show only operations supported by that version. Default: `26R1`.

- **Compliance module** (26R1+): New resource for querying compliance data
  - Get Rules / Get Rule by ID
  - Get Vulnerabilities / Get Vulnerability by ID
  - Get Detected Vulnerabilities (all endpoints or per Windows endpoint)
  - Get Detected Rule Violations (all endpoints or per endpoint)

- **Universal Dynamic Groups module** (26R1+): New resource for managing universal dynamic groups
  - Get Groups / Get Group by ID
  - Get Groups by Folder
  - Get Folders / Get Folder by ID / Get Sub-Folders

- **Endpoint module — EntraId operations** (26R1+):
  - Set Entra ID Data (POST)
  - Delete Entra ID Data (DELETE)
  - Get Entra ID Data by Endpoint ID
  - Get Entra ID Data by Device ID

- **Endpoint module — Unmanaged Endpoints** (26R1+):
  - List Unmanaged Endpoints
  - Get Unmanaged Endpoint by ID
  - Delete Unmanaged Endpoint

- **Defense Control module — BitLocker Secrets V2.0** (26R1+):
  - Get BitLocker Secrets (`GET /v2.0/BitLocker/WindowsEndpoints/{id}/Secrets`)
  - Update BitLocker Secrets (`PATCH /v2.0/BitLocker/WindowsEndpoints/{id}/Secrets`)

- **Software module — Bundle operations** (26R1+):
  - List/Get/Create Bundles
  - List Bundle Applications / Delete Bundle Application
  - List/Get/Create/Update/Delete Bundle Folders

- **Asset module** (26R1+):
  - Get Assets by AD Object
  - Get Assets by Org Unit

- **Server Management module** (26R1+):
  - Perform MSW Cleanup (POST — deletes unused software files on Master DIP)
  - Simulate MSW Cleanup (POST — dry-run preview)
  - List API Keys
  - List/Get Download Jobs

- **Endpoint module — Maintenance Window versioning**:
  - Replace Maintenance Window (PUT) — gated to `bmsVersion: 25R2`
  - Update Maintenance Window (PATCH) — gated to `bmsVersion: 26R1`
  - Same gating applied to Group Maintenance Window operations

- **Job Operations - Get All Job Instances**: Retrieve job instances across all jobs without a job ID
  - Supports pagination with `returnAll` and `limit` parameters
  - Optional OData filters: `searchQuery` and `orderBy`

### Fixed

- Compliance and Universal Dynamic Groups operations now correctly hidden when `bmsVersion` is set to `25R2`

### Security (Audit Remediation 2026-03-30)

- **npm audit**: Reduced vulnerabilities from 21 → 11. Remaining 11 are all in `devDependencies` only (transitive via `@n8n/node-cli`): `handlebars` CRITICAL and `minimatch` HIGH have no upstream fix available; `esbuild` MODERATE affects only the dev server and is not exploitable in CI. **Runtime package has 0 vulnerabilities.**
- **GUID validation**: Added `validateGuid()` to compliance operations (`getRule`, `getVulnerability`, `getDetectedVulnerabilitiesByEndpoint`, `getDetectedRuleViolationsByEndpoint`). Invalid GUIDs now throw a `NodeOperationError` before any API call.
- **Version-gated operation dropdowns**: Split `endpointOperations`, `softwareOperations`, and `assetOperations` into 25R2/26R1 lists. PUT Maintenance Window operations are now hidden under 26R1; PATCH variants, EntraId, and Unmanaged Endpoints are hidden under 25R2.
- **Test mock security**: All unit test credential mocks changed from `ignoreSslIssues: true` to `ignoreSslIssues: false` (secure by default). Passwords were already `test-password-do-not-use`.
- **URL sanitisation in error messages**: API error messages no longer include full URLs with GUIDs or sensitive path segments. URLs are truncated to `{host}/.../{resource}` format.
- **RFC 6902 patch validation**: `patchBitLockerSecrets`, `updateEndpointMaintenanceWindow`, and `updateGroupMaintenanceWindow` now validate patch documents against RFC 6902 before sending to the API.

### Testing

- 462 unit tests passing (0 skipped)
- TypeScript strict mode: 0 errors

## [0.1.0] - 2026-01-22

### Added

#### Core Features
- **Baramundi node** for n8n workflow automation
- **bConnect API credentials** with SSL certificate bypass option
- **12 resource types** with comprehensive operation support:
  - Endpoints (devices)
  - Jobs (automation tasks)
  - Organizational Units
  - Software Management
  - Mobile Device Management (iOS/Android)
  - BitLocker Management
  - SSH Key Deployment
  - VPP License Management
  - Hardware/Software Inventory
  - Custom Attributes
  - Compliance Violations
  - Setup File Integrity

#### Enhanced User Experience (LoadOptions)
- **Smart dropdown menus** for selecting endpoints, jobs, and organizational units
- **Searchable dropdowns** with real-time API data loading (up to 100 items)
- **Custom GUID fallback** option for advanced scripting scenarios
- **Type labels** for job definitions (e.g., "Windows Update [Deployment]")
- **Hybrid selection pattern** combining dropdowns with manual input

#### Endpoint Operations
- `Get` - Retrieve single endpoint (dropdown selection)
- `Get Many` - List endpoints with pagination and filtering
- `Search` - Search endpoints by name
- `Update` - Modify endpoint properties (dropdown selection)
- `Delete` - Remove endpoint (dropdown selection)
- `Start Enrollment` - Initiate endpoint enrollment (dropdown selection)

#### Job Operations
- `Get` - Retrieve job definition (dropdown selection)
- `Get Many` - List job definitions with pagination
- `Execute` - Run job on endpoints (dropdown selection)
- `Get Instances` - View job execution history (dropdown selection)
- `Create Kiosk Release` - Create kiosk app release (dropdown selection)
- `Update` - Modify job definition (dropdown selection)
- `Delete` - Remove job definition (dropdown selection)

#### Organizational Unit Operations
- `Get` - Retrieve single OU (dropdown selection)
- `Get Many` - List organizational units
- `Get Children` - List child OUs (dropdown selection)

#### Software Management (V2.0)
- `Get Application` - Retrieve application details
- `Get Many Applications` - List applications with pagination
- `Get OS Installation` - Get OS installation info
- `Get Many OS Installations` - List OS installations
- `Update OS Installation` - Modify OS installation properties

#### Mobile Device Management (V1.1)
- `Get iOS Device` - Retrieve iOS device details
- `Get Many iOS Devices` - List iOS devices
- `Get Android Device` - Retrieve Android device details
- `Get Many Android Devices` - List Android devices
- `Get Mobile App` - Get mobile app configuration
- `Get Many Mobile Apps` - List mobile apps

#### Security & Compliance (V1.1)
- `Get BitLocker Status` - Retrieve BitLocker encryption status
- `Get Many BitLocker Statuses` - List BitLocker statuses
- `Get SSH Key` - Retrieve SSH public key
- `Deploy SSH Key` - Deploy SSH key to endpoints
- `Get Setup File Integrity` - Verify baramundi setup file hashes
- `Get Compliance Violations` - List compliance violations

#### Inventory Management (V1.1)
- `Get Hardware Inventory` - Retrieve hardware inventory data
- `Get Software Inventory` - Retrieve software inventory data
- `Get Custom Attribute` - Get custom attribute value
- `Set Custom Attribute` - Update custom attribute value

#### API Features
- **Automatic pagination** handling for "Return All" operations
- **Query parameter support** for filtering and sorting
- **Error handling** with informative error messages
- **SSL certificate bypass** for self-signed certificates
- **API version support**: V2.0 (primary) and V1.1 (specialized features)

### Testing
- **633 unit tests** passing (23 skipped)
- **86.35% code coverage**
- **System tests** for live API integration (7 tests)
- **LoadOptions integration tests** for all dropdown operations
- **Manual testing checklist** (350+ test cases)

### Documentation
- Comprehensive README.md with usage examples
- API reference documentation
- Example workflows (5 scenarios)
- Manual testing checklist (TESTING_CHECKLIST.md)
- Project structure documentation
- Troubleshooting guide

### Development Tools
- TypeScript 5.x with strict mode
- ESLint with n8n-nodes-base plugin
- Prettier code formatting
- Vitest test framework
- @n8n/node-cli for development
- Coverage reporting with @vitest/coverage-v8

### Infrastructure
- DevContainer support for development
- npm scripts for build, test, lint, format
- Docker Compose configuration
- Hot reload in development mode

## Release Notes

### What's New in 0.1.0

This is the initial release of the baramundi community node for n8n. The node provides comprehensive integration with baramundi Management Suite via the bConnect REST API, enabling IT administrators to automate endpoint management, software deployment, job execution, and mobile device management workflows.

**Key Highlights:**
- 🎯 **Smart Dropdowns** - Select endpoints, jobs, and OUs without looking up GUIDs
- 🔍 **Searchable Options** - Filter through hundreds of items instantly
- 🛡️ **12 Resource Types** - Comprehensive baramundi API coverage
- ✅ **Production Ready** - 633 tests, 86.35% coverage
- 📚 **Well Documented** - Complete guides and examples

**Supported baramundi Versions:**
- baramundi Management Suite with bConnect API V2.0 or V1.1
- Tested with baramundi Management Suite 2024

**Requirements:**
- n8n 1.0.0 or higher
- Node.js 18.0.0 or higher
- Valid baramundi Management Suite license with bConnect API access

### Migration Guide

This is the initial release - no migration required.

### Known Limitations

- **Dropdown Limit**: Smart dropdowns load up to 100 items (use "Return All" operations for larger datasets)
- **API Version**: Some features require V2.0 API (V1.1 fallback for specialized features)
- **Pagination**: "Return All" operations limited to 1000 pages (100,000 items) for safety
- **SSL Certificates**: Self-signed certificates require "Ignore SSL Issues" option enabled

### Breaking Changes

None - this is the initial release.

### Deprecations

None - this is the initial release.

## Compatibility Matrix

| Component                      | Version      | Status      |
|-------------------------------|--------------|-------------|
| n8n                           | ≥1.0.0       | ✅ Supported |
| Node.js                       | ≥18.0.0      | ✅ Supported |
| baramundi bConnect API V2.0   | 25R2 / 26R1  | ✅ Supported |
| TypeScript                    | ^5.4.0       | ✅ Dev Only  |

## Support

- **Documentation**: [README.md](README.md)
- **Issues**: https://github.com/baramundi-software/n8n-nodes-baramundi/issues
- **baramundi Support**: support@baramundi.com
- **n8n Community**: https://community.n8n.io

## Contributors

- Bernd Wiedemann (wiedemann.bernd@gmx.de) - Initial implementation

---

[Unreleased]: https://github.com/baramundi-software/n8n-nodes-baramundi/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/baramundi-software/n8n-nodes-baramundi/releases/tag/v0.1.0
