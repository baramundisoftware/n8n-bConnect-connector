# Contributing to n8n-bConnect-connector

Thank you for your interest in contributing! This document provides guidelines for developers contributing to this project.

## Getting Started

### Prerequisites

- **Node.js:** >= 22.16.0
- **npm:** >= 11 (`npm install -g npm@11`; Node 22 ships npm 10, which rejects lockfiles written by npm 11 — the version CI and Dependabot use)
- **n8n:** >= 2.9.0 (for local testing)

### Initial Setup

```bash
git clone https://github.com/baramundisoftware/n8n-bConnect-connector.git
cd n8n-bConnect-connector
npm install
npm run build
npm test
```

### Local Development with n8n

```bash
./start-n8n-dev.sh    # builds + starts n8n on http://localhost:5678
```

---

## Project Structure

```
n8n-bConnect-connector/
├── credentials/                   # n8n credential types
│   └── BconnectApi.credentials.ts
├── nodes/shared/                  # Shared infrastructure
│   ├── transport/requestApi.ts    # HTTP client, pagination, retry
│   ├── utils/                     # Types, validation, error messages
│   └── loadOptions.ts             # Dropdown population functions
├── nodes/Baramundi*/              # 6 node implementations
│   ├── Baramundi*.node.ts         # Node entry point
│   └── actions/                   # Resource + operation definitions
├── test/
│   ├── unit/                      # Vitest unit tests (mocked HTTP)
│   └── system/                    # Live bConnect API tests (skipped in CI)
├── example-workflows/             # n8n workflow JSON templates
└── CHANGELOG.md
```

---

## Development Workflow

### Adding a New Operation

1. Add field definitions to `actions/<module>/<module>.fields.ts`
2. Add execute logic to `actions/<module>/<module>.execute.ts`
3. Register the operation in `actions/<module>/index.ts`
4. Add case to `actions/router.ts`
5. Write unit test in `test/unit/<module>.execute.test.ts`

### Version Gating

Operations available only in a specific bMS version:

```typescript
// 26R1 only
displayOptions: { show: { bmsVersion: ['26R1'] } }

// 25R2 only
displayOptions: { show: { bmsVersion: ['25R2'] } }

// Both versions: no displayOptions version constraint
```

### GUID / Resource Locator Fields

Always extract using the helper:

```typescript
import { extractResourceLocatorValue } from '../../utils/validation';
const endpointId = extractResourceLocatorValue(
  this.getNodeParameter('endpointId', i)
);
```

---

## Code Quality Standards

- **TypeScript strict mode** enabled
- **No `any` types** — use `unknown` and type guards
- **ESLint** with `eslint-plugin-n8n-nodes-base` rules
- **Prettier** for formatting

```bash
npm run lint           # Check code style
npm run build          # TypeScript compilation
npm test               # Run unit tests
npm run test:coverage  # With coverage report
npm run check:spec     # Spec-conformance check only (also part of npm test)
```

### Coverage Target

Minimum **80% branch coverage**. CI enforces this.

---

## Commit Messages

Follow conventional commits:

```
feat(endpoints): add OS version filtering
fix(pagination): correct off-by-one error in page calculation
test(security): add unit tests for compliance operations
docs(readme): update installation instructions
```

---

## Pull Request Process

1. Run all checks locally:
   ```bash
   npm run lint
   npm run build
   npm test
   npm run test:coverage
   ```

2. Push your branch and create a PR:
   - Keep PRs focused — one feature or fix per PR
   - Include a summary of changes and test plan
   - Update CHANGELOG.md for user-facing changes

3. After approval: squash and merge, then delete the branch.

---

## Testing

- **Unit tests** (`test/unit/`): mock `apiRequest` — no real HTTP calls
- **System tests** (`test/system/`): require `BMS_URL` env var pointing to a live bMS server, skipped in CI
- Use [bConnect-Mock](https://github.com/baramundisoftware/bConnect-Mock) for integration testing without a real bMS

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Spec conformance

`test/conformance/` calls every operation the editor offers, for bMS 25R2 and 26R1 and for
every value of every option field (e.g. each Endpoint Type), and
checks the HTTP requests against `docs/openapi/<release>`: route and module prefix, query
parameters, request body fields, required fields, enum values and JSON Patch paths.

Known violations are listed in `test/conformance/baseline.json`, each with the issue that
fixes it (or `"accepted: <reason>"` for a verified, deliberate deviation). The check fails on
a **new** violation, and on a baseline entry that **no longer occurs**: when your change fixes
one, remove its entry.

```bash
npm run check:spec                                   # run
SPEC_BASELINE=prune npm run check:spec               # remove entries your fix resolved
SPEC_BASELINE=add-new npm run check:spec             # add new violations (issue 0) to triage
SPEC_REPORT=report.md npm run check:spec             # write all violations, grouped
```

