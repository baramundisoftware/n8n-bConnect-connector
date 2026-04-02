# CLAUDE.md — n8n-nodes-baramundi

## Project Overview

n8n community node for **baramundi Management Suite (bMS)** via the bConnect REST API.
Enables IT administrators to automate endpoint management, job execution, software
deployment, compliance checks, and MDM operations from n8n workflows.

**npm package**: `n8n-nodes-baramundi-management-solution`
**Current version**: 0.6.0 (not yet published — targeting v1.0.0 as first release)
**License**: MIT

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.x (strict mode) |
| Runtime | Node.js ≥ 18 |
| Framework | n8n node framework (`n8n-workflow` peer dep) |
| Build | `@n8n/node-cli build` → `dist/` |
| Tests | Vitest 1.x |
| Lint | ESLint 9 + `eslint-plugin-n8n-nodes-base` |
| Format | Prettier |
| CI | GitHub Actions (`.github/workflows/ci.yml`) |

---

## Repository Structure

```
n8nconnector/
├── credentials/
│   └── BconnectApi.credentials.ts    # Basic Auth credential type
├── nodes/shared/                     # Shared infrastructure (all nodes import from here)
│   ├── transport/requestApi.ts       # HTTP client, pagination, retry
│   ├── utils/                        # types, validation, errorMessages
│   └── loadOptions.ts                # Dropdown population functions
├── nodes/BaramundiEndpoint/          # Endpoint (with endpointType), groups, maintenance windows (~85 ops)
├── nodes/BaramundiAsset/             # Asset, asset types, folders (~43 ops)
├── nodes/BaramundiJob/               # Job definitions, folders, instances, kiosk (~37 ops)
├── nodes/BaramundiSoftware/          # Software, bundles, updates, variables, UDG (~56 ops)
├── nodes/BaramundiAdmin/             # AD, server management, microservices, OS (~60 ops)
├── nodes/BaramundiSecurity/          # Security, compliance, defense control (~33 ops)
├── test/
│   ├── unit/                         # Vitest unit tests (mocked apiRequest)
│   └── system/                       # Live bConnect API tests (skipped in CI)
├── example-workflows/                # n8n workflow JSON templates
├── docs/
│   ├── adr/                          # Architectural Decision Records
│   └── SDLC-PIPELINE.md              # Claude Code SDLC pipeline docs
├── reports/                          # Analysis and audit reports
├── Tasks.md                          # Task board (Backlog / Done)
├── Requirements.md                   # Requirements with MoSCoW priorities
└── CHANGELOG.md
```

---

## Conventions

### Adding a new operation
1. Add field definitions to `actions/<module>/<module>.fields.ts`
2. Add execute logic to `actions/<module>/<module>.execute.ts`
3. Register operation in `actions/<module>/index.ts`
4. Add case to `actions/router.ts`
5. Write unit test in `test/unit/<module>.execute.test.ts`

### Version gating
- Operations only in 26R1: `displayOptions: { show: { bmsVersion: ['26R1'] } }`
- Operations only in 25R2: `displayOptions: { show: { bmsVersion: ['25R2'] } }`
- Operations in both: no `displayOptions` version constraint

### GUID / resourceLocator fields
Always extract using the helper — never call `getNodeParameter()` directly for ID fields:
```typescript
import { extractResourceLocatorValue } from '../../utils/validation';
const endpointId = extractResourceLocatorValue(
  this.getNodeParameter('endpointId', i)
);
```

### API base URL
`https://<serverUrl>/v2.0/<Resource>` — serverUrl comes from credentials, no trailing slash.

### Pagination
Use `apiRequestAllItems()` for "Return All" operations. Safety cap: 1000 pages.

### Tests
- Mock `apiRequest` at the module level — do not make real HTTP calls in unit tests
- System tests in `test/system/` require env var `BMS_URL` to run
- Coverage target: ≥ 80%

---

## Key Files

| File | Purpose |
|---|---|
| `nodes/Baramundi*/Baramundi*.node.ts` | 6 node entry points — resource list, `bmsVersion`, `loadOptions` |
| `nodes/shared/transport/requestApi.ts` | All HTTP logic — auth, retry, pagination |
| `nodes/Baramundi*/actions/router.ts` | Per-node `resource` + `operation` → execute function dispatch |
| `credentials/BconnectApi.credentials.ts` | Credential fields + `testCredentials` |
| `test/unit/` | Unit tests — one file per action module |

---

## OpenAPI Specs

Located at `/home/ansible/MCP/bConnectOpenAPI/`:
- `25R2/` — 10 spec files (bMS 25R2)
- `26R1/` — 12 spec files (bMS 26R1, adds compliance + universaldynamicgroups)

These are the source of truth for all operation paths, parameters, and response schemas.

---

## bConnect Server (Dev/Test)

- URL: `https://bms-win22srv:444/bconnect`
- Username: `Administrator`
- SSL: self-signed certificate → enable "Ignore SSL Issues" in credentials

---

## Release Process

Use SDLC pipeline commands. See `docs/SDLC-PIPELINE.md` for full pipeline.

Short path:
```
/process-start-task  →  /process-pr-review  →  /process-qa-gate  →  /process-release
```

Target: **v1.0.0** as first public npm release (after Phase 10 + Phase 11 + Phase 12 UX complete).

---

## CI

GitHub Actions at `.github/workflows/ci.yml`:
- Triggers on push to `master`
- Steps: `npm ci` → lint → build → unit tests → `npm audit`
- System tests skipped (require live BMS server)

---

## Known Deferred Items

- `IndustrialEndpoints` (25R2-only): deferred until explicitly requested
- Version auto-detection from `/bconnect/v2.0/Info`: future enhancement
- REQ-PUBLISH-2 (n8n registry): BLOCKED — awaiting baramundi management approval
