# @baramundi/n8n-nodes-baramundi-management-suite — Installation Guide

This guide provides detailed instructions for installing the baramundi community node for n8n.

> [!NOTE]
> The package is on npm as `@baramundi/n8n-nodes-baramundi-management-suite` from version 0.11.0 on. Versions up to 0.10.0 exist only as
> release files, under the old name `n8n-nodes-baramundi-management-suite`; to move from one of
> those, see [Upgrade](#from-0100-or-earlier-the-package-was-renamed).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
   - [Method 1: n8n Community Nodes (Recommended)](#method-1-n8n-community-nodes-recommended)
   - [Method 2: Install from the Release File](#method-2-install-from-the-release-file)
   - [Method 3: Docker Installation](#method-3-docker-installation)
3. [Verify Package Integrity](#verify-package-integrity)
4. [Verify Installation](#verify-installation)
5. [Upgrade](#upgrade)
6. [Configure Credentials](#configure-credentials)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing, ensure you have:

- **n8n**: Version 2.9.0 or higher (self-hosted — n8n Cloud only allows verified community nodes)
- **Node.js**: Version 22.23.4 or higher (24.x: 24.22.1 or higher; 26.x: 26.12.1 or higher) on the n8n host (already included in the official n8n Docker image)
- **npm**: To install the release file
- **baramundi Management Suite**: With bConnect API enabled (V2.0, bMS 2025 R2, 2026 R1 or 2026 R2)
- **Network Access**: Connection to the baramundi Management Server on port 444

---

## Installation Methods

### Method 1: n8n Community Nodes (Recommended)

1. In n8n, open **Settings > Community Nodes** and click **Install**.
2. Enter `@baramundi/n8n-nodes-baramundi-management-suite`, confirm that you understand the risks of community nodes, and click
   **Install**.
3. The six baramundi nodes appear in the nodes panel; search for "baramundi".

The same from the command line, in n8n's nodes folder:

```bash
mkdir -p ~/.n8n/nodes && cd ~/.n8n/nodes
npm install @baramundi/n8n-nodes-baramundi-management-suite
```

Then restart n8n. Each version on npm carries a provenance statement that links it to the GitHub
Actions run that built it; `npm audit signatures` checks it.

---

### Method 2: Install from the Release File

Use this when the n8n server cannot reach the npm registry.

Each [GitHub release](https://github.com/baramundisoftware/n8n-bConnect-connector/releases)
contains two files:

- `baramundi-n8n-nodes-baramundi-management-suite-<version>.tgz` — the package
- `baramundi-n8n-nodes-baramundi-management-suite-<version>.tgz.sha256` — its SHA-256 checksum

The examples below use version `0.11.0`; replace it with the version you downloaded.

#### Step 1: Download

Download both files from the
[latest release](https://github.com/baramundisoftware/n8n-bConnect-connector/releases/latest),
or on the n8n server:

```bash
VERSION=0.11.0
BASE=https://github.com/baramundisoftware/n8n-bConnect-connector/releases/download/v$VERSION
curl -fLO "$BASE/baramundi-n8n-nodes-baramundi-management-suite-$VERSION.tgz"
curl -fLO "$BASE/baramundi-n8n-nodes-baramundi-management-suite-$VERSION.tgz.sha256"
```

If the n8n server has no internet access, download the files elsewhere and copy them over
(SCP/SFTP, network share).

#### Step 2: Verify the Checksum

```bash
sha256sum -c baramundi-n8n-nodes-baramundi-management-suite-0.11.0.tgz.sha256
```

See [Verify Package Integrity](#verify-package-integrity).

#### Step 3: Install into the n8n Nodes Folder

```bash
mkdir -p ~/.n8n/nodes
cd ~/.n8n/nodes
npm install /path/to/baramundi-n8n-nodes-baramundi-management-suite-0.11.0.tgz
```

`~/.n8n` is the n8n user folder of the account that runs n8n (or the folder set in `N8N_USER_FOLDER`).

#### Step 4: Restart n8n

```bash
# If running n8n as a service
sudo systemctl restart n8n

# If running n8n manually: stop it (Ctrl+C) and start it again
n8n start
```

---

### Method 3: Docker Installation

To install from npm, use `npm install --ignore-scripts @baramundi/n8n-nodes-baramundi-management-suite` in place of the `COPY` line and
the `.tgz` path below. For the release file, put the downloaded `.tgz` next to your `Dockerfile` or
`docker-compose.yml`.

#### Option A: Custom Dockerfile

```dockerfile
FROM n8nio/n8n:latest

USER root
COPY baramundi-n8n-nodes-baramundi-management-suite-0.11.0.tgz /tmp/package.tgz
RUN mkdir -p /home/node/.n8n/nodes && \
    cd /home/node/.n8n/nodes && \
    npm init -y && \
    npm install --ignore-scripts /tmp/package.tgz && \
    rm /tmp/package.tgz && \
    chown -R node:node /home/node/.n8n/nodes
USER node
```

Build and run:

```bash
docker build -t n8n-baramundi .
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8n-baramundi
```

> **Note**: If `/home/node/.n8n` is a volume, Docker copies the image's `nodes` folder into the
> volume only when the volume is first created. To upgrade later, see [Upgrade](#upgrade).

#### Option B: Docker Compose

**docker-compose.yml**:
```yaml
services:
  n8n:
    build:
      context: .
      dockerfile_inline: |
        FROM n8nio/n8n:latest
        USER root
        COPY baramundi-n8n-nodes-baramundi-management-suite-0.11.0.tgz /tmp/package.tgz
        RUN mkdir -p /home/node/.n8n/nodes && \
            cd /home/node/.n8n/nodes && \
            npm init -y && \
            npm install --ignore-scripts /tmp/package.tgz && \
            rm /tmp/package.tgz && \
            chown -R node:node /home/node/.n8n/nodes
        USER node
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

```bash
docker compose up -d --build
```

---

## Verify Package Integrity

Every release includes a SHA-256 checksum file. Run the check in the folder that contains both files:

```bash
sha256sum -c baramundi-n8n-nodes-baramundi-management-suite-0.11.0.tgz.sha256
```

Expected output:
```
baramundi-n8n-nodes-baramundi-management-suite-0.11.0.tgz: OK
```

On Windows (PowerShell), compare the hash with the value in the `.sha256` file:

```powershell
Get-FileHash .\baramundi-n8n-nodes-baramundi-management-suite-0.11.0.tgz -Algorithm SHA256
```

If the checksum does not match, do **not** install the package. Download it again from the
GitHub release page, and report a persistent mismatch as described in [SECURITY.md](SECURITY.md).

---

## Verify Installation

After installation, verify the node is available:

### In the n8n UI

1. Open n8n in your browser: `http://your-server:5678`
2. Create a new workflow
3. Click **+** to add a node
4. Search for **"baramundi"**
5. You should see 6 nodes: baramundi Endpoint, Asset, Job, Software, Admin, Security

### Via npm

```bash
cd ~/.n8n/nodes
npm list @baramundi/n8n-nodes-baramundi-management-suite
```

Expected output:
```
nodes
└── @baramundi/n8n-nodes-baramundi-management-suite@0.11.0
```

---

## Upgrade

### Host installation

Download the new release file, verify it, and install it over the old version:

```bash
cd ~/.n8n/nodes
npm install /path/to/baramundi-n8n-nodes-baramundi-management-suite-<new-version>.tgz
```

Then restart n8n.

### Docker

Rebuild the image with the new `.tgz`. If `/home/node/.n8n` is a volume, the volume still holds the
old version; install the new one inside the running container and restart it:

```bash
docker cp baramundi-n8n-nodes-baramundi-management-suite-<new-version>.tgz n8n:/tmp/package.tgz
docker exec -it n8n sh -c "cd /home/node/.n8n/nodes && npm install --ignore-scripts /tmp/package.tgz"
docker restart n8n
```

### From 0.10.0 or earlier: the package was renamed

Up to 0.10.0 the package was called `n8n-nodes-baramundi-management-suite`; it is now
`@baramundi/n8n-nodes-baramundi-management-suite`. n8n keeps the package name in every node of a
workflow (`"type": "n8n-nodes-baramundi-management-suite.baramundiEndpoint"`), so after the switch
those nodes show as unknown until the workflows use the new name. Credentials keep working: their
type (`bconnectApi`) does not contain the package name.

1. Export the workflows that use baramundi nodes (in n8n: **⋯ → Download**, or
   `n8n export:workflow --all --output=workflows.json`).
2. Remove the old package and install the new one, then restart n8n:

   ```bash
   cd ~/.n8n/nodes
   npm uninstall n8n-nodes-baramundi-management-suite
   npm install /path/to/baramundi-n8n-nodes-baramundi-management-suite-<new-version>.tgz
   ```

3. Replace the old node type prefix in the exported files and import them again (in n8n:
   **⋯ → Import from File**, or `n8n import:workflow --input=workflows.json`):

   ```bash
   sed -i 's#"n8n-nodes-baramundi-management-suite\.#"@baramundi/n8n-nodes-baramundi-management-suite.#g' workflows.json
   ```

---

## Configure Credentials

### Step 1: Create Credential

1. Open n8n in your browser
2. Navigate to **Credentials** (left sidebar)
3. Click **Add Credential**
4. Search for "baramundi"
5. Select **baramundi bConnect API**

### Step 2: Enter Connection Details

| Field | Description | Example |
|-------|-------------|---------|
| **Server URL** | Base URL of your bConnect API | `https://bms-server:444/bconnect` |
| **Authentication Method** | **API Key** (recommended) or **Basic Auth** | `API Key` |
| **API Key** | Generated in the bMS console under **Server Management > API Keys** | — |
| **Username** / **Password** | For Basic Auth: a Windows/AD account with bConnect access | `DOMAIN\svc-n8n` |
| **Ignore SSL Issues** | Enable only for self-signed certificates in test environments | ☐ |

> **Security Note**: Enabling "Ignore SSL Issues" disables TLS certificate validation for this connection, which exposes API traffic to man-in-the-middle attacks. Use only in isolated test environments. The recommended approach is to import your bMS server's CA certificate into the n8n host's trust store.

### Step 3: Test Credential

1. Click **Test Credential** button
2. Wait for validation
3. If successful, you'll see a green checkmark
4. Click **Save**

### Common Test Errors

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Check server URL and ensure bConnect API is running |
| `ENOTFOUND` | Verify server hostname/IP is correct |
| `401 Unauthorized` | Check API key, or username and password |
| `SSL certificate problem` | Install the CA certificate (see below), or enable "Ignore SSL Issues" for testing only |
| `Network timeout` | Check firewall rules for port 444 |

---

## Troubleshooting

### "Package version does not exist" in Community Nodes

The package name is `@baramundi/n8n-nodes-baramundi-management-suite`. The old unscoped name
`n8n-nodes-baramundi-management-suite` was never on npm; versions up to 0.10.0 exist only as
[release files](#method-2-install-from-the-release-file).

### Node Not Appearing in n8n

1. Verify installation: `cd ~/.n8n/nodes && npm list @baramundi/n8n-nodes-baramundi-management-suite`
2. Check n8n version: `n8n --version` (must be 2.9.0 or higher)
3. Restart n8n completely
4. Check the n8n log output for errors mentioning `baramundi`

### Permission Errors During Installation

```bash
sudo chown -R $USER ~/.n8n
```

### SSL Certificate Errors

Install the CA certificate that signed your bMS server certificate in the system trust store:

```bash
# Linux (Ubuntu/Debian)
sudo cp your-bms-ca.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
# then restart n8n
```

### Docker Issues

```bash
# Check container logs
docker logs n8n

# Verify package inside container
docker exec -it n8n sh -c "cd /home/node/.n8n/nodes && npm list @baramundi/n8n-nodes-baramundi-management-suite"
```

---

## Uninstallation

```bash
cd ~/.n8n/nodes
npm uninstall @baramundi/n8n-nodes-baramundi-management-suite
# Restart n8n
```

---

## Getting Help

- **Documentation**: See [README.md](README.md) for usage guide
- **Bugs and feature requests**: [GitHub issues](https://github.com/baramundisoftware/n8n-bConnect-connector/issues)
- **Security issues**: Report privately as described in [SECURITY.md](SECURITY.md) (not public issues)
- **n8n Community**: https://community.n8n.io

---

**Package**: `@baramundi/n8n-nodes-baramundi-management-suite`
**License**: MIT
