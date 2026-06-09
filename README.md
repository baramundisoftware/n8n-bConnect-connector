# n8n-nodes-baramundi-management-suite

[![CI](https://github.com/baramundisoftware/n8n-bConnect-connector/actions/workflows/ci.yml/badge.svg)](https://github.com/baramundisoftware/n8n-bConnect-connector/actions/workflows/ci.yml)

Automate your **baramundi Management Suite** (bMS) from [n8n](https://n8n.io/) workflows. This community node connects n8n to your bMS via the bConnect REST API — manage endpoints, run jobs, deploy software, check compliance, and more.

**229 operations** across **6 nodes**, compatible with **baramundi 25R2 and 26R1**.

---

## What You Need

- An **n8n instance** (version 2.9.0 or later) — [install n8n](https://docs.n8n.io/hosting/)
- A **baramundi Management Suite** (25R2 or 26R1) with bConnect API enabled
- Your **bMS server address** (e.g. `https://bms.company.com:444/bconnect`)
- A **bMS user account** with API access, or an **API key**
  (generate one in the baramundi management console under **Server Management > API Keys**)

### Network Requirements

- Port **444** (HTTPS) must be open between your n8n server and your bMS server

---

## Getting Started

### Step 1: Install the Node

In your n8n instance, go to **Settings > Community Nodes** and install:

```
n8n-nodes-baramundi-management-suite
```

Or via CLI in your n8n data directory:

```bash
npm install n8n-nodes-baramundi-management-suite
```

### Step 2: Add Your bMS Credentials

1. In n8n, go to **Credentials > Add Credential**
2. Search for **baramundi bConnect API**
3. Fill in:

| Field | What to enter | Example |
|-------|---------------|---------|
| **Server URL** | Your bMS bConnect URL | `https://bms.company.com:444/bconnect` |
| **Authentication Method** | Basic Auth or API Key | `API Key` |
| **API Key** | Your bConnect API key | `2D34AB0B...` |

4. Click **Test Credential** — you should see a green checkmark

### Step 3: Create Your First Workflow

1. Click **"+ Create new workflow"** > **"Add first step"**
2. Add a **Manual Trigger**
3. Click **"+"** after the trigger > search **"Baramundi"** > add it
4. In the Baramundi node:
   - **Credential**: select your baramundi credential
   - **bMS Version**: select `26R1` or `25R2` (matching your server)
   - **Resource**: `Endpoint`
   - **Operation**: `Get Many`
   - **Return All**: on
5. Click **"Test workflow"**

You should see your managed endpoints appear as JSON output.

### Step 4: What's Next

Try these common workflows:

- **List all Windows endpoints** — Endpoint > Get Many > Filter by endpoint type
- **Run a job** — Job > Execute > select a job instance
- **Check compliance** — Security > List Detected Vulnerabilities (26R1 only)
- **Software inventory** — Software > Get Installed Software > by endpoint

See the [example workflows](example-workflows/) for ready-to-use templates.

---

## Docker Installation

If running n8n in Docker, install the node into a custom image:

```dockerfile
FROM n8nio/n8n:latest
USER root
RUN cd /usr/local/lib/node_modules/n8n && \
    npm install n8n-nodes-baramundi-management-suite
USER node
```

See [INSTALLATION.md](INSTALLATION.md) for detailed Docker and file-transfer install options.

---

## Credentials Configuration

### Authentication Methods

| Method | When to use |
|--------|-------------|
| **API Key** (recommended) | Generate in bMS console under **Server Management > API Keys**. Simpler, no password rotation needed. |
| **Basic Auth** | Uses a Windows/AD username and password. Works with any existing bMS admin account. |

### How to Find Your bMS Server URL

1. Open the **baramundi Management Center** on your bMS server
2. The server address is the machine name or IP where bMS is installed
3. bConnect listens on **port 444** by default (HTTPS)
4. Your URL will be: `https://<server-name>:444/bconnect`

### How to Generate an API Key

1. Open the **baramundi Management Center**
2. Go to **Server Management > API Keys**
3. Click **Create New API Key**
4. Give it a descriptive name (e.g. "n8n Connector")
5. Copy the generated key — you won't see it again

### SSL / TLS Certificates

If your bMS server uses a self-signed or internal CA certificate:

**Quick fix (test only):** Enable **Ignore SSL Issues** in the credential form.

**Production (recommended):** Set the CA certificate path before starting n8n:

```bash
NODE_EXTRA_CA_CERTS=/path/to/your-internal-ca.pem
```

For Docker, mount the certificate and add the environment variable:

```yaml
environment:
  - NODE_EXTRA_CA_CERTS=/certs/internal-ca.pem
volumes:
  - ./internal-ca.pem:/certs/internal-ca.pem:ro
```

---

## bMS Version Targeting

Every Baramundi node has a **bMS Version** dropdown as its first parameter. Selecting your version filters operations to only what your server supports.

| Setting | Shows |
|---------|-------|
| `26R1` (default) | All 229 operations including compliance, UDGs, bundles |
| `25R2` | 180 operations — excludes 26R1-only features |

---

## Available Nodes

| Node | Operations | What it does |
|------|-----------|--------------|
| **Baramundi Endpoint** | 49 | Endpoints (all types), logical/static/dynamic groups, maintenance windows |
| **Baramundi Admin** | 43 | Active Directory, server management, microservices, OS config |
| **Baramundi Software** | 41 | Software inventory, bundles, updates, variables, Universal Dynamic Groups |
| **Baramundi Job** | 37 | Job definitions, execution, instances, folders, kiosk releases |
| **Baramundi Security** | 33 | Compliance, BitLocker, Defender, local admin accounts |
| **Baramundi Asset** | 26 | Asset inventory, asset types, stock/type folders |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **SSL certificate error** | Enable "Ignore SSL Issues" in credential (test only), or set `NODE_EXTRA_CA_CERTS` (production) |
| **Authentication failed** | Verify credentials. Check the user/API key has bConnect API permissions in bMS. |
| **Connection timeout** | Check network connectivity and firewall rules. bConnect default port is 444. |
| **Empty results** | Check API user permissions. Try enabling "Return All" to get more than one page. |
| **Dropdowns not loading** | Test your credential first. Use "Enter Custom GUID" as fallback. |
| **Operation not visible** | Check the bMS Version dropdown matches your server (25R2 vs 26R1). |

---

## Example Workflows

Ready-to-use workflow templates in the [`example-workflows/`](example-workflows/) directory:

| Workflow | Description |
|----------|-------------|
| [Patch Cycle Report](example-workflows/01-patch-cycle.json) | List endpoints with pending Windows updates |
| [Job Failure Alert](example-workflows/02-job-failure-alert.json) | Monitor job instances and alert on failures |
| [Critical CVEs](example-workflows/03-critical-cves.json) | Find endpoints with critical vulnerabilities (26R1) |
| [Stale Endpoint Report](example-workflows/04-stale-endpoint-report.json) | Find endpoints not seen in the last 30 days |

Import any workflow via **n8n > Workflows > Import from File**.

---

## Security

**Runtime package has zero known vulnerabilities.** `npm audit` may report issues from build tools (`@n8n/node-cli`, `vitest`) and peer dependencies (`n8n-workflow`) — these are not present in the published `dist/` package.

Report security issues to **bernd.wiedemann@baramundi.com** (not via public GitHub issues).

---

## Compatibility

| Component | Version |
|-----------|---------|
| n8n | 2.9.0+ |
| Node.js (to run n8n) | 22.16+ |
| baramundi bConnect API | V2.0 |
| baramundi bMS | 25R2, 26R1 |

---

## Development

```bash
git clone https://github.com/baramundisoftware/n8n-bConnect-connector.git
cd n8n-bConnect-connector
npm install
./start-n8n-dev.sh        # builds + starts n8n on http://localhost:5678
```

```bash
npm run build              # compile TypeScript
npm test                   # run unit tests (1072 tests)
npm run test:coverage      # with coverage report
npm run lint               # ESLint
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Run `npm run lint` and `npm test` before submitting
5. Open a pull request

---

## License

[MIT](LICENSE)

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [baramundi bConnect API Documentation](https://docs.baramundi.com/)
- [Changelog](CHANGELOG.md)
