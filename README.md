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

## Available Resources & Operations

### Endpoint

Manage endpoints (devices) in baramundi.

| Operation | Description | Selection Method |
|-----------|-------------|------------------|
| **Get** | Retrieve a single endpoint by ID | Dropdown or custom GUID |
| **Get Many** | List endpoints with pagination | N/A |
| **Search** | Search endpoints by name | N/A |
| **Update** | Modify endpoint properties | Dropdown or custom GUID |
| **Delete** | Remove an endpoint | Dropdown or custom GUID |
| **Start Enrollment** | Initiate endpoint enrollment | Dropdown or custom GUID |

**Selection Features:**
- **Smart Dropdown**: Search through up to 100 endpoints from your baramundi server
- **Custom GUID**: Enter any endpoint GUID manually for advanced scenarios
- **Real-time Loading**: Endpoints populated directly from your baramundi API

**Get Many Options:**
- `orderBy`: Sort order (e.g., `DisplayName asc`, `LastContact desc`)
- `orgUnitId`: Filter by organizational unit GUID

### Job

Manage jobs and job execution.

| Operation | Description | Selection Method |
|-----------|-------------|------------------|
| **Get** | Retrieve a single job definition by ID | Dropdown or custom GUID |
| **Get Many** | List jobs with pagination | N/A |
| **Execute** | Run a job on endpoints | Dropdown or custom GUID |
| **Get Instances** | View job execution history for a specific job | Dropdown or custom GUID |
| **Get All Job Instances** | View all job instances across all jobs | N/A |
| **Create Kiosk Release** | Create kiosk app release | Dropdown or custom GUID |
| **Update** | Modify job definition properties | Dropdown or custom GUID |
| **Delete** | Remove a job definition | Dropdown or custom GUID |

**Selection Features:**
- **Smart Dropdown**: Browse up to 100 job definitions with type labels (e.g., "Windows Update [Deployment]")
- **Custom GUID**: Enter any job GUID manually for scripting scenarios
- **Searchable**: Filter jobs by name instantly

**Execute Options:**
- `comment`: Optional comment for the job execution
- `priority`: `Low`, `Normal`, or `High`

**Get All Job Instances Options:**
- `returnAll`: Fetch all job instances (with automatic pagination) or limit results
- `limit`: Maximum number of instances to return (default: 50)
- `searchQuery`: OData filter query (e.g., `state eq 'Running'`, `state eq 'FinishedSuccessfully'`)
- `orderBy`: Sort order (e.g., `start desc`, `lastAction desc`)

**Key Difference:**
- **Get Instances**: Requires a specific job ID and retrieves instances for that job only
- **Get All Job Instances**: No job ID required - retrieves instances from all jobs, with optional filters

### Organizational Unit

Manage organizational units (logical groups).

| Operation | Description | Selection Method |
|-----------|-------------|------------------|
| **Get** | Retrieve a single OU by ID | Dropdown or custom GUID |
| **Get Many** | List organizational units | N/A |
| **Get Children** | List child OUs of a parent | Dropdown or custom GUID |

**Selection Features:**
- **Smart Dropdown**: Navigate organizational structure with searchable dropdown
- **Custom GUID**: Enter OU GUID manually when needed

## Example Workflows

### Using the Smart Dropdown Feature

The baramundi node includes intelligent dropdown menus that make it easy to select endpoints, jobs, and organizational units without needing to know their GUIDs.

**Example: Execute a Job on an Endpoint**

1. Add a **Baramundi** node to your workflow
2. Select **Resource**: `Job`
3. Select **Operation**: `Execute`
4. **Job Selection**: Click the dropdown and search for your job (e.g., "Windows Update")
   - The dropdown automatically loads up to 100 jobs from your baramundi server
   - Jobs display with type labels: "Windows Update [Deployment]"
   - Use the search box to filter jobs by name
5. **Endpoint IDs**: Enter endpoint GUIDs (or use expressions from previous nodes)
6. Configure optional settings (comment, priority)
7. Execute the workflow

**Custom GUID Fallback**: For advanced scenarios (expressions, scripts, or dynamic values), select "Enter Custom GUID..." from any dropdown to manually enter a GUID.

### 1. Deploy Software to New Endpoints

```
Trigger (Schedule)
    → baramundi: Search endpoints (filter: new)
    → IF: Missing required software
    → baramundi: Execute deployment job (use dropdown to select job)
    → Slack: Notify IT team
```

### 2. Daily Compliance Report

```
Trigger (Cron: 0 8 * * *)
    → baramundi: Get Many endpoints
    → Code: Analyze compliance status
    → IF: Non-compliant endpoints found
    → Email: Send compliance report
    → Spreadsheet: Log results
```

### 3. Automated Endpoint Cleanup

```
Trigger (Weekly)
    → baramundi: Get Many endpoints
    → Code: Filter inactive (>90 days)
    → baramundi: Delete endpoint (use dropdown to select, for each)
    → Database: Archive endpoint data
```

### 4. Job Execution Monitoring

```
Trigger (Every 5 minutes)
    → baramundi: Get Job Instances (use dropdown to select job)
    → IF: Failed jobs found
    → PagerDuty: Create incident
    → Slack: Alert on-call team
```

### 5. Interactive Workflow with Dropdown Selection

```
Trigger (Webhook)
    → baramundi: Get endpoint (use dropdown to browse and select)
    → baramundi: Execute job on endpoint (use dropdown to select job)
    → HTTP Response: Return job execution status
```

**Benefits:**
- No need to look up GUIDs in baramundi console
- Searchable dropdowns for quick filtering
- Type-safe selections reduce errors
- Fallback to custom GUID for dynamic scenarios

## Project Structure

```
n8nconnector/
├── credentials/
│   └── BconnectApi.credentials.ts    # Authentication configuration
├── nodes/
│   └── Baramundi/
│       ├── Baramundi.node.ts         # Main node definition
│       ├── baramundi.svg             # Node icon
│       ├── transport/
│       │   └── requestApi.ts         # API request helpers with pagination
│       └── actions/
│           ├── router.ts             # Request routing logic
│           ├── endpoint/
│           │   ├── index.ts
│           │   ├── endpoint.fields.ts    # UI field definitions
│           │   └── endpoint.execute.ts   # Operation implementations
│           ├── job/
│           │   ├── index.ts
│           │   ├── job.fields.ts
│           │   └── job.execute.ts
│           └── orgUnit/
│               ├── index.ts
│               ├── orgUnit.fields.ts
│               └── orgUnit.execute.ts
├── dist/                             # Compiled output (generated)
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
├── tasks.md                          # Project task tracking
└── README.md                         # This file
```

## API Reference

This node uses the baramundi bConnect REST API V2.0.

- **Base URL**: `https://<bms-server>:444/bconnect`
- **Authentication**: HTTP Basic Auth
- **Response Format**: JSON with pagination (`{ Data: [...], TotalCount: n }`)

### Pagination

The node handles pagination automatically when using "Return All" option:
- Page size: 100 items per request
- Safety limit: 1000 pages maximum

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
