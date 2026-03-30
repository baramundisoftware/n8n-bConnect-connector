# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Job Operations - Get All Job Instances**: New operation to retrieve job instances across all jobs without requiring a specific job ID
  - Supports pagination with `returnAll` and `limit` parameters
  - Optional OData filters: `searchQuery` (e.g., `state eq 'Running'`) and `orderBy` (e.g., `start desc`)
  - Retrieves instances from multiple jobs in a single operation
  - Complements existing `Get Instances` operation (which requires a job ID)
  - Fully tested with 7 unit tests and 8 system tests

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
| baramundi bConnect API V2.0   | Latest       | ✅ Primary   |
| baramundi bConnect API V1.1   | Latest       | ✅ Fallback  |
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
