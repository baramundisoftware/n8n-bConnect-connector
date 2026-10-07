# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation
- README: operation counts updated to the current nodes (219 in total; 211 for 26 R1, 171 for 25 R2 — some operations exist in 25 R2 only)

### Removed
- **Endpoint → Static Group**: *Get*, *Get Many*, *Create*, *Update*, *Delete*, and **Dynamic Group**: *Get*, *Get Many*. bConnect exposes these groups only through sub-routes; `/endpoints/v2.0/StaticGroups` and `/DynamicGroups` are in neither spec and return *404* on a live bMS 26R1 — the operations could never succeed. *Get Endpoints by Static/Dynamic Group*, *Assign Job to Static/Dynamic Group* and job instances by group remain (#60)
- **Job → Job Definition → Create / Update / Delete**: job definitions are read-only in bConnect. A live bMS 26R1 answers `POST`/`PATCH`/`DELETE /jobs/v2.0/JobDefinitions` with *405 Method Not Allowed*, and neither the 25R2 nor the 26R1 spec has these methods — the operations could never succeed (#42)

### Fixed
- **Connection errors name the server again**: when bConnect could not be reached (connection refused, unknown host, timeout, connection reset, host unreachable, DNS failure), n8n replaced the node's message with its own generic text, e.g. *The service refused the connection - perhaps it is offline*, so the server URL and the troubleshooting steps were lost, including in the output of *Continue on Fail*. The node's message is now kept, and connection reset, aborted, host unreachable and DNS failures are reported as network errors instead of *bConnect API Error*
- **Org Unit dropdown** (Admin) listed nothing: it requested a path bConnect does not have. It now loads org units from `/activedirectory/v2.0/OrgUnits` (#38)
- **Dropdowns show why they are empty**: when loading fails (wrong Server URL, missing permissions, unreachable server), the dropdown now shows *Could not load …* with the reason instead of an empty list. An empty list now means bConnect returned no data (#41)
- **bMS 25 R2 no longer offers what only exists in 26 R1** (#39): the resources *Compliance* (Security), *Software Bundle* and *Universal Dynamic Groups* (Software), and the operations *Get API Keys*, *MSW Cleanup*, *Simulate MSW Cleanup*, *Get Download Job(s)* (Admin → Server Management) and *Get / Patch BitLocker Secrets* (Security → Defense Control). Before, they showed an empty form or failed with "Could not get parameter"
- **Endpoint → Get Many**: the *Organizational Unit ID* filter was silently ignored by bConnect (no such parameter) and was replaced by **Display Name** and **Host Name** filters (Host Name is not available for Android/iOS). **Get Unmanaged Endpoints** no longer sends paging parameters the route does not define; *Limit* is applied to the result (#46)
- **Maintenance windows now match bConnect** (#44). bConnect maintenance windows are recurring schedules, not one-off time ranges; the old *Start Time / End Time / Description / Comment* fields and the *Replace (PUT)* JSON default (`"daily"`) were rejected or ignored. Create, Replace (25 R2) and Update (26 R1) now share the same fields:
  - **Definition Type**: Everyday, Workday / Weekend, Individual Weekday, Unrestricted (26 R1 adds Anytime and Never)
  - **Intervals**: period (Everyday, Workdays, Weekends or a weekday) with start and end as `HH:MM` (24:00 = end of day), validated before sending
  - Group maintenance windows exist for **logical groups** only — the *Group Type* field (static/dynamic, routes bConnect does not have) was removed
  - Saved workflows using maintenance window operations need the new fields filled in
- **Example workflow 01 (Patch Tuesday)**: sets a nightly 22:00–04:00 window and starts the update job **on each endpoint** of the groups. Before, it passed maintenance-window IDs as endpoint IDs, so no job was assigned on a real bMS
- **Security → bMS Security**: *Create Security Group* offers **Security Profile IDs** (sent as `profiles`) instead of a *Description* bConnect does not have; *Update Security Group* no longer sends a description. **Update Object Permissions** now changes **Inherit Rights** and **Security Profile Permissions** — the old *Security Profile Access Rights* patched a property that does not exist (#45)
- **Security → Defense Control → Patch Local Admin User Credentials**: *Expiry Date* is now **Requested Expiration Date** and patches `/LocalAdminAccount/RequestedExpirationDate` — before, the change was not applied (#45)
- **Admin → Operating System → Update Windows Endpoint**: offers the properties bConnect can change — Boot Environment ID, Hardware Profile ID, Is OS Install Allowed, Inherits Auto Installation — instead of a non-existent *OS Install Folder ID* (#45)
- **Software Bundle → Replace Application in Bundle** no longer sends a *Priority* bConnect does not accept (#45)
- **Software → Variable → Create Variable Definition** could not succeed: bConnect requires **Category** and **Scopes**, which the form did not offer. Both were added (scopes per bMS version), *Data Type* became **Type** with the values bConnect supports (String, Integer, Password, Date, Drop-Down List, Drop-Down Editable List, Checkbox, File Link, Folder — the old *Boolean*/*DateTime* do not exist), and *Description* became **Comment**. *Update Variable Definition* offers Category and Comment instead of Description (#45)
- **Software Bundle → Create**: *Type* is now a choice of **Install / Uninstall** (was free text). **Add Application to Bundle** no longer sends a *Priority* bConnect does not accept (#45)
- **Job → Execute** assigned the job **only to the first** of several comma-separated endpoint IDs and silently dropped the rest. It now creates one job instance per endpoint and validates every ID first. The *Comment* and *Priority* options (not supported by bConnect, ignored) were replaced by **Start If Already Assigned** (#45)
- **Job → Kiosk Release → Create** now sends what bConnect expects: a single **Assignment Target ID** (user, endpoint or group). *Target Type*, *Valid From/Until* and *Comment* were removed — bConnect has no such fields, and the required `assignmentTargetId` was missing (#45)
- **Job → Folder Create / Update**: *Description* is now **Comment** (#45)
- **Endpoint node fields follow the bConnect schemas** (#45, Endpoint part):
  - **Create Endpoint**: each platform shows only the fields bConnect accepts for it — *Owner* is now **Company / Private** (was *Corporate / Personal*, rejected); Android and iOS no longer offer *Host Name*; Linux no longer offers *Domain*, *Primary Subnet Mask* and *UUID* (Windows only)
  - **Update Endpoint**: *Domain* is only offered for Windows endpoints
  - **Start Enrollment**: *Email Recipient* is now **Enrollment Email Address** and is sent as `enrollmentMailAddress` — the old field was ignored, so no enrollment mail was sent. Auto-detect no longer routes Linux endpoints to a non-existent enrollment route
  - **Logical Group Create / Update**: the *Description* field was removed — bConnect has no such property (use *Comment*)
  - **Create Industrial Endpoint (25 R2)**: the required **Primary IP**, **Port** and **SNMP Configuration** were added
- **Asset node now sends what bConnect accepts** (#37). Before, Asset → Create always failed with 400 and several fields were silently ignored:
  - **Create Asset**: *Display Name* is now **Name**, and the required **Owner Type** and **Owner ID** were added (AD Object and Org Unit owners need bMS 26 R1). Additional fields follow the bConnect schema: Comments, Contact, Cost Center, Inventory Number, URL, Purchase Date/Price, Operating Cost, Energy On/Off. *Serial Number, Manufacturer, Model, Location* were removed — bConnect has no such asset fields
  - **Update Asset**: the same fields (plus Name, Owner); the old ones produced JSON Patch paths bConnect does not know
  - **Create Asset Type**: the required **Owner ID** was added; *Description* replaced by the schema's fields
  - **Asset stock / asset type folders**: *Description* is now **Comment**, *Parent Folder ID* sends `parentId`
  - **Get Many Assets**: the *Asset Type ID* filter (ignored by bConnect) was replaced by **Display Name**, which bConnect supports
  - Saved workflows using these operations need the new fields filled in
- Endpoint → Maintenance Window → **Get Group Maintenance Window** works again: it read a parameter the form does not have and failed on every run (#43)
- A Server URL with a trailing space or slash no longer breaks every request with 404; the URL is trimmed before use (#34)
- The credential **Test** button now really checks the connection: it requests `/endpoints/v2.0/Endpoints` (the old path did not exist) and fails on HTTP errors, with clear messages for 401 (credentials), 403 (permissions) and 404 (Server URL). Before, it reported success even with a wrong URL or password (#35)

### Added
- CI job **integration (bConnect-Mock)**: runs the E2E and system tests against a live bConnect-Mock container on every pull request, so they cannot silently go stale again (#40)
- Spec-conformance check (`npm run check:spec`, part of the unit tests): calls every operation the editor offers, per bMS release and for every value of every option field, plus every dropdown and search function, and checks the HTTP requests against the 25R2/26R1 OpenAPI specs — route and module prefix, query parameters, body fields, required fields, enum values, JSON Patch paths. Known violations are baselined against their issues (#37, #39, #42–#46). JSON Patch paths are also accepted when the spec's own PATCH example uses them
- **npm publishing workflow** (`.github/workflows/publish.yml`, #21): on a version tag it runs the full gate, checks that tag, `package.json` and CHANGELOG agree, and publishes to npm with a provenance statement (required by n8n for verified community nodes); pre-releases go to the `next` dist-tag. Publishing stays off until the repository variable `NPM_PUBLISH_ENABLED` is set, and each publish waits for approval in the `npm` environment. `make publish` no longer publishes from a local machine
- CI enforces a coverage floor: `npm run test:coverage` fails below 94 % statements, 83 % branches, 96 % functions, 95 % lines (the gate job runs it). New transport tests cover API-key auth, `Retry-After` handling and the network/SSL/HTTP/unknown error paths (`requestApi.ts` branches 72 % → 98 %)

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
