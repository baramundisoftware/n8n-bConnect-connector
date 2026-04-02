# n8n-nodes-baramundi

An n8n community node for integrating with [baramundi Management Suite](https://www.baramundi.com/) via the bConnect REST API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Development Setup (DevContainer)](#development-setup-devcontainer)
  - [Production Installation](#production-installation)
- [Building](#building)
- [Testing](#testing)
- [Running n8n with Custom Node](#running-n8n-with-custom-node)
- [Credentials Configuration](#credentials-configuration)
- [bMS Version Targeting](#bms-version-targeting)
- [Available Resources & Operations](#available-resources--operations)
- [Example Workflows](#example-workflows)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

This node allows you to automate interactions with baramundi Management Suite, enabling IT administrators to:

- **Enhanced User Experience**: Dynamic dropdown menus populate automatically from your baramundi server
  - Select endpoints, jobs, and organizational units from searchable dropdowns
  - Custom GUID fallback option for advanced use cases
  - Real-time API data loading with intelligent caching

- **Endpoints**: List, get, search, update, delete, and start enrollment on managed devices
- **Jobs**: Create, update, delete, execute jobs on endpoints, view job execution history, and manage kiosk releases
- **Organizational Units**: List, get, and navigate the organizational structure
- **Software Management**: Manage software inventory, applications, and OS installations
- **Mobile Device Management**: Handle iOS/Android devices, VPP licenses, and mobile app configurations
- **Security Features**: BitLocker management, SSH key deployment, and setup file integrity verification
- **Compliance & Inventory**: Track hardware/software inventory, custom attributes, and compliance violations

## Quick Start

```bash
cd /home/ansible/MCP/n8nconnector
npm install && npm run build
./start-n8n-dev.sh
```

Then open **http://localhost:5678** (allow 2–5 minutes on first run).

### Your First Workflow

1. Click **"+ Create new workflow"** → **"Add first step"**
2. Search for **"Manual Trigger"** and add it
3. Click **"+"** after the trigger → search **"Baramundi"** and add it
4. In the Baramundi node:
   - **Credential**: select your baramundi credential (or add one via *Credentials → Add Credential → baramundi bConnect API*)
   - **Resource**: `Endpoint` · **Operation**: `Get Many` · **Return All**: on
5. Click **"Test workflow"** — your endpoints should appear

> If the Baramundi node doesn't show up: run `npm run build`, then restart with `./start-n8n-dev.sh`.

---

## Installation

### Development Setup (DevContainer)

This project is designed to work within the claudinno DevContainer environment.

#### Prerequisites

- Docker and Docker Compose
- VS Code with Remote - Containers extension
- Access to a baramundi Management Server with bConnect API enabled

#### Steps

1. **Open the DevContainer**
   ```bash
   cd /workspaces/claudinno
   code .
   # VS Code will prompt to reopen in container
   ```

2. **Navigate to the n8nconnector directory**
   ```bash
   cd /workspaces/claudinno/n8nconnector
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

### Production Installation

#### npm (for self-hosted n8n)

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Install the package
npm install n8n-nodes-baramundi
```

#### Docker

If running n8n in Docker, create a custom Dockerfile:

```dockerfile
FROM n8nio/n8n:latest

USER root
RUN cd /usr/local/lib/node_modules/n8n && \
    npm install n8n-nodes-baramundi
USER node
```

## Building

### Build the TypeScript code

```bash
cd /workspaces/claudinno/n8nconnector

# Install dependencies (if not done)
npm install

# Build the project
npm run build
```

The build output will be in the `dist/` directory.

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Development mode with hot reload |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |

## Testing

### Run unit tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

**Current Test Status:**
- **633 tests passing** (23 skipped)
- **86.35% code coverage**
- All loadOptions-enabled operations tested (endpoints, jobs, org units)
- System tests validate live API integration

### Manual Testing with n8n

See [Running n8n with Custom Node](#running-n8n-with-custom-node) section below.

**LoadOptions Feature Testing:**

For comprehensive UI testing of the smart dropdown feature, use the [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) manual testing guide. This checklist covers:

- ✅ Endpoint operations (6 operations with dropdowns)
- ✅ Job operations (6 operations with dropdowns)
- ✅ Error handling and edge cases
- ✅ Workflow integration scenarios
- ✅ User experience and accessibility

The testing checklist ensures all dropdown functionality works correctly including:
- API data loading and population
- Search/filter capabilities
- Custom GUID fallback mode
- Error recovery and empty state handling

## Running n8n with Custom Node

### Option 1: Using n8n-node-dev (Recommended for Development)

```bash
cd /workspaces/claudinno/n8nconnector

# Start n8n with your custom node loaded
npx @n8n/node-cli dev
```

This will:
- Build the node automatically
- Start n8n on http://localhost:5678
- Watch for file changes and rebuild

### Option 2: Link to Local n8n Installation

```bash
# Build the node
npm run build

# Create a symlink in n8n's custom directory
mkdir -p ~/.n8n/custom
ln -s /workspaces/claudinno/n8nconnector ~/.n8n/custom/n8n-nodes-baramundi

# Start n8n
npx n8n start
```

### Option 3: Docker Compose (Production-like)

Create a `docker-compose.yml` in the n8nconnector directory:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_CUSTOM_EXTENSIONS=/home/node/custom
      - GENERIC_TIMEZONE=Europe/Berlin
    volumes:
      - n8n_data:/home/node/.n8n
      - ./dist:/home/node/custom/n8n-nodes-baramundi/dist:ro
      - ./package.json:/home/node/custom/n8n-nodes-baramundi/package.json:ro
    restart: unless-stopped

volumes:
  n8n_data:
```

Run with:
```bash
npm run build
docker-compose up -d
```

Access n8n at: http://localhost:5678

### Option 4: Quick Test Script

Create and run this script for quick testing:

```bash
#!/bin/bash
# test-n8n.sh

cd /workspaces/claudinno/n8nconnector

# Build the node
npm run build

# Set custom extensions path
export N8N_CUSTOM_EXTENSIONS=/workspaces/claudinno/n8nconnector

# Start n8n
npx n8n start
```

## Credentials Configuration

After starting n8n, configure the baramundi bConnect credentials:

1. Open n8n in your browser (http://localhost:5678)
2. Go to **Credentials** > **Add Credential**
3. Search for **baramundi bConnect API**
4. Fill in the required fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Server URL** | Base URL of your bConnect API | `https://bms-server:444/bconnect` |
| **Username** | bConnect API username | `Administrator` |
| **Password** | bConnect API password | `your-password` |
| **Ignore SSL Issues** | Enable for self-signed certificates | `true` |

### Testing Credentials

Click **Test Credential** to verify the connection. This calls `/v2.0/endpoints?PageSize=1` to validate access.

## bMS Version Targeting

The node requires you to select your **baramundi Management Suite version** before choosing a resource. This ensures only operations supported by your server version are shown, preventing API errors at runtime.

### Setting the version

In any Baramundi node, the first parameter is **baramundi Management Suite Version**:

| Option | Targets |
|--------|---------|
| `25R2` | bMS 25R2 — shows only operations available in that release |
| `26R1` | bMS 26R1 — shows all operations including 26R1 additions (default) |

### Version compatibility table

| Feature / Resource | 25R2 | 26R1 |
|---|:---:|:---:|
| Endpoints (core CRUD, search, groups) | ✅ | ✅ |
| Jobs, Assets, Software (core), Variables | ✅ | ✅ |
| Active Directory, Defense Control (core) | ✅ | ✅ |
| Server Management (core), Update Management | ✅ | ✅ |
| Maintenance Window — PUT (full replace) | ✅ | — |
| Maintenance Window — PATCH (partial update) | — | ✅ |
| Compliance (Rules, Vulnerabilities, Violations) | — | ✅ |
| Universal Dynamic Groups | — | ✅ |
| EntraId data (Endpoint) | — | ✅ |
| Unmanaged Endpoints | — | ✅ |
| BitLocker Secrets V2.0 | — | ✅ |
| Software Bundles & Bundle Folders | — | ✅ |
| Assets by AD Object / Org Unit | — | ✅ |
| API Keys, Download Jobs | — | ✅ |
| DIP MSW Cleanup / Simulate MSW Cleanup | — | ✅ |

> **Note**: The `25R2` version option will remain available until baramundi Management Suite 25R2 reaches end-of-life (expected ~2028).

## Available Nodes & Resources

The connector provides **6 specialized n8n nodes**, each covering a domain of baramundi Management Suite. Together they expose **~321 operations** across **28 resources**.

### Baramundi Endpoint (~92 ops)

| Resource | Description | Ops |
|----------|-------------|-----|
| Endpoint | Core endpoint CRUD, search, enrollment, Entra ID, unmanaged endpoints | 16 |
| Logical Group | Logical group CRUD, sub-groups, get endpoints | 7 |
| Static Group | Static group CRUD, get endpoints | 6 |
| Dynamic Group | Dynamic group queries, get endpoints | 3 |
| Maintenance Window | Endpoint and group maintenance windows (create/get/update/delete) | 10 |
| Typed Endpoint | Platform-typed CRUD (Windows, Linux, macOS, Android, iOS, Network) + Industrial (25R2) | 12 |

### Baramundi Job (~37 ops)

| Resource | Description | Ops |
|----------|-------------|-----|
| Job Definition | Job CRUD, execute, get by folder | 7 |
| Job Folder | Folder CRUD, sub-folders | 6 |
| Job Instance | Instance monitoring, group assignment, start/stop/resume | 16 |
| Kiosk Release | Kiosk release lifecycle, get by endpoint/group/AD object | 8 |

### Baramundi Asset (~43 ops)

| Resource | Description | Ops |
|----------|-------------|-----|
| Asset | Asset CRUD, get by endpoint/AD object/group/org unit | 9 |
| Asset Type | Asset type definitions | 4 |
| Asset Folder | Stock and type folder management | 13 |

### Baramundi Software (~56 ops)

| Resource | Description | Ops |
|----------|-------------|-----|
| Software | Installed software queries | 4 |
| Software Bundle | Bundle + folder + application management (26R1+) | 15 |
| Update Management | Windows update management | 3 |
| Variable | Variable definitions and instances | 13 |
| Universal Dynamic Group | UDG groups and folders (26R1+) | 6 |

### Baramundi Admin (~60 ops)

| Resource | Description | Ops |
|----------|-------------|-----|
| AD User | Active Directory user queries | 4 |
| AD Group | Active Directory group queries | 4 |
| AD Object | AD object queries + group memberships | 5 |
| Org Unit | Organizational unit queries | 3 |
| Server Management | Server infrastructure, DIP, download jobs, API keys | 13 |
| Microservice | Microservice start/stop/restart | 5 |
| Operating System | OS installation management | 9 |

### Baramundi Security (~33 ops)

| Resource | Description | Ops |
|----------|-------------|-----|
| Security | Security groups, profiles, access rights | 12 |
| Compliance | Compliance rules, vulnerabilities, violations (26R1+) | 8 |
| Defense Control | BitLocker, Defender, local admin management | 13 |

### Selection Features

- **Smart Dropdowns**: Search through up to 100 items from your baramundi server
- **Custom GUID**: Enter any GUID manually for advanced scenarios
- **Truncation indicator**: When more than 100 items exist, a notice is shown

## Example Workflows

See `example-workflows/` for importable n8n workflow JSON files.

## Project Structure

```
n8nconnector/
├── credentials/
│   └── BconnectApi.credentials.ts       # Basic Auth credential type
├── nodes/shared/                        # Shared infrastructure (all nodes import from here)
│   ├── transport/requestApi.ts          # HTTP client, pagination, retry, backoff
│   ├── utils/                           # types, validation, errorMessages
│   └── loadOptions.ts                   # Dropdown population functions
├── nodes/BaramundiEndpoint/             # Endpoint, groups, maintenance windows (~92 ops)
│   ├── BaramundiEndpoint.node.ts
│   └── actions/                         # endpoint, logicalGroup, staticGroup, dynamicGroup,
│                                        #   maintenanceWindow, typedEndpoint
├── nodes/BaramundiAsset/                # Asset, asset types, folders (~43 ops)
├── nodes/BaramundiJob/                  # Job definitions, folders, instances, kiosk (~37 ops)
├── nodes/BaramundiSoftware/             # Software, bundles, updates, variables, UDG (~56 ops)
├── nodes/BaramundiAdmin/                # AD, server management, microservices, OS (~60 ops)
├── nodes/BaramundiSecurity/             # Security, compliance, defense control (~33 ops)
├── test/
│   ├── unit/                            # Vitest unit tests (mocked apiRequest)
│   └── system/                          # Live bConnect API tests (skipped in CI)
├── example-workflows/                   # n8n workflow JSON templates
├── docs/                                # ADRs, SDLC pipeline docs
├── dist/                                # Compiled output (generated)
├── Tasks.md                             # Project task tracking
├── Requirements.md                      # Requirements with MoSCoW priorities
├── CHANGELOG.md
└── README.md
```

## API Reference

This node uses the baramundi bConnect REST API V2.0.

- **Base URL**: `https://<bms-server>:444/bconnect`
- **Authentication**: HTTP Basic Auth
- **Response Format**: JSON with pagination (`{ Data: [...], TotalCount: n }`)

### Pagination

The node handles pagination automatically when using "Return All" option:
- Page size: 100 items per request
- Safety limit: 50 pages maximum (5000 items default cap)

## Compatibility

| Component | Version |
|-----------|---------|
| n8n | 1.0.0+ |
| Node.js | 18.0.0+ |
| baramundi bConnect API | V2.0 |

## Troubleshooting

### SSL Certificate Errors

If using self-signed certificates, enable **Ignore SSL Issues** in credentials.

### Authentication Failures

1. Verify username/password are correct
2. Ensure the user has bConnect API permissions in baramundi
3. Check that the bConnect API is enabled on your BMS server

### Connection Timeouts

1. Verify network connectivity to the BMS server
2. Check firewall rules for port 444
3. Ensure the BMS server is running

### Empty Results

1. Verify the user has permissions to view endpoints/jobs
2. Check if the search query is too restrictive
3. Try increasing the page size

### Dropdown Not Loading

If dropdowns don't populate with options:

1. **Check Credentials**: Ensure baramundi credentials are configured and tested
2. **API Connectivity**: Verify the bConnect API is accessible from n8n
3. **Permissions**: Confirm the API user has read permissions for endpoints/jobs
4. **Fallback Available**: You can always select "Enter Custom GUID..." to manually enter a GUID
5. **Logs**: Check n8n logs for API errors (`~/.n8n/logs/`)

The dropdown feature requires:
- Valid baramundi bConnect API credentials
- Network access to the bConnect API server
- bConnect API v2.0 enabled on baramundi Management Server

## Useful Commands

```bash
./start-n8n-dev.sh      # Start n8n (recommended)
pkill -f n8n            # Stop n8n
npm run build           # Rebuild node
npm test                # Run tests
npm run test:coverage   # Run tests with coverage report
ps aux | grep n8n       # Check n8n status
tail -f /tmp/n8n.log    # View logs
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Submit a pull request

### Development Guidelines

- Follow n8n node development patterns
- Use TypeScript strict mode
- Add JSDoc comments for public methods
- Run `npm run lint` before committing

## License

[MIT](LICENSE.md)

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [baramundi bConnect API Documentation](https://docs.baramundi.com/)
- [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)
- [bConnect MCP Server](../bConnect-MCP/) - Reference implementation with 117 tools
