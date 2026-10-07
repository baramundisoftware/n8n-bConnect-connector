# n8n-nodes-baramundi-management-suite — Installation Guide

This guide provides detailed instructions for installing the baramundi community node for n8n.

> [!IMPORTANT]
> The package is **not published to the npm registry yet**. Installing it from
> **Settings > Community Nodes** in n8n, or with `npm install n8n-nodes-baramundi-management-suite`,
> fails with *"Package version does not exist"*. The n8n Community Nodes screen can only install
> packages from npm, so until the package is published, install it from the release file
> (Method 1 or Method 2 below).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
   - [Method 1: Install from the Release File (Recommended)](#method-1-install-from-the-release-file-recommended)
   - [Method 2: Docker Installation](#method-2-docker-installation)
   - [Method 3: npm Registry (not available yet)](#method-3-npm-registry-not-available-yet)
3. [Verify Package Integrity](#verify-package-integrity)
4. [Verify Installation](#verify-installation)
5. [Upgrade](#upgrade)
6. [Configure Credentials](#configure-credentials)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing, ensure you have:

- **n8n**: Version 2.9.0 or higher (self-hosted — n8n Cloud only allows verified community nodes)
- **Node.js**: Version 22.16 or higher on the n8n host (already included in the official n8n Docker image)
- **npm**: To install the release file
- **baramundi Management Suite**: With bConnect API enabled (V2.0, bMS 2025 R2 or 2026 R1)
- **Network Access**: Connection to the baramundi Management Server on port 444

---

## Installation Methods

### Method 1: Install from the Release File (Recommended)

Each [GitHub release](https://github.com/baramundisoftware/n8n-bConnect-connector/releases)
contains two files:

- `n8n-nodes-baramundi-management-suite-<version>.tgz` — the package
- `n8n-nodes-baramundi-management-suite-<version>.tgz.sha256` — its SHA-256 checksum

The examples below use version `0.10.0`; replace it with the version you downloaded.

#### Step 1: Download

Download both files from the
[latest release](https://github.com/baramundisoftware/n8n-bConnect-connector/releases/latest),
or on the n8n server:

```bash
VERSION=0.10.0
BASE=https://github.com/baramundisoftware/n8n-bConnect-connector/releases/download/v$VERSION
curl -fLO "$BASE/n8n-nodes-baramundi-management-suite-$VERSION.tgz"
curl -fLO "$BASE/n8n-nodes-baramundi-management-suite-$VERSION.tgz.sha256"
```

If the n8n server has no internet access, download the files elsewhere and copy them over
(SCP/SFTP, network share).

#### Step 2: Verify the Checksum

```bash
sha256sum -c n8n-nodes-baramundi-management-suite-0.10.0.tgz.sha256
```

See [Verify Package Integrity](#verify-package-integrity).

#### Step 3: Install into the n8n Nodes Folder

```bash
mkdir -p ~/.n8n/nodes
cd ~/.n8n/nodes
npm install /path/to/n8n-nodes-baramundi-management-suite-0.10.0.tgz
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

### Method 2: Docker Installation

Put the downloaded `.tgz` next to your `Dockerfile` or `docker-compose.yml`.

#### Option A: Custom Dockerfile

```dockerfile
FROM n8nio/n8n:latest

USER root
COPY n8n-nodes-baramundi-management-suite-0.10.0.tgz /tmp/package.tgz
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
        COPY n8n-nodes-baramundi-management-suite-0.10.0.tgz /tmp/package.tgz
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

### Method 3: npm Registry (not available yet)

> **Note**: npm registry publishing is pending approval. Once the package is published, you can
> install it from **Settings > Community Nodes** in n8n by entering
> `n8n-nodes-baramundi-management-suite`, or with:
>
> ```bash
> cd ~/.n8n/nodes
> npm install n8n-nodes-baramundi-management-suite
> ```
>
> Until then, these commands fail with *"Package version does not exist"* / `404 Not Found`.

---

## Verify Package Integrity

Every release includes a SHA-256 checksum file. Run the check in the folder that contains both files:

```bash
sha256sum -c n8n-nodes-baramundi-management-suite-0.10.0.tgz.sha256
```

Expected output:
```
n8n-nodes-baramundi-management-suite-0.10.0.tgz: OK
```

On Windows (PowerShell), compare the hash with the value in the `.sha256` file:

```powershell
Get-FileHash .\n8n-nodes-baramundi-management-suite-0.10.0.tgz -Algorithm SHA256
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
npm list n8n-nodes-baramundi-management-suite
```

Expected output:
```
nodes
└── n8n-nodes-baramundi-management-suite@0.10.0
```

---

## Upgrade

### Host installation

Download the new release file, verify it, and install it over the old version:

```bash
cd ~/.n8n/nodes
npm install /path/to/n8n-nodes-baramundi-management-suite-<new-version>.tgz
```

Then restart n8n.

### Docker

Rebuild the image with the new `.tgz`. If `/home/node/.n8n` is a volume, the volume still holds the
old version; install the new one inside the running container and restart it:

```bash
docker cp n8n-nodes-baramundi-management-suite-<new-version>.tgz n8n:/tmp/package.tgz
docker exec -it n8n sh -c "cd /home/node/.n8n/nodes && npm install --ignore-scripts /tmp/package.tgz"
docker restart n8n
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

The package is not on the npm registry yet. Install it from the release file
([Method 1](#method-1-install-from-the-release-file-recommended) or
[Method 2](#method-2-docker-installation)).

### Node Not Appearing in n8n

1. Verify installation: `cd ~/.n8n/nodes && npm list n8n-nodes-baramundi-management-suite`
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
docker exec -it n8n sh -c "cd /home/node/.n8n/nodes && npm list n8n-nodes-baramundi-management-suite"
```

---

## Uninstallation

```bash
cd ~/.n8n/nodes
npm uninstall n8n-nodes-baramundi-management-suite
# Restart n8n
```

---

## Getting Help

- **Documentation**: See [README.md](README.md) for usage guide
- **Bugs and feature requests**: [GitHub issues](https://github.com/baramundisoftware/n8n-bConnect-connector/issues)
- **Security issues**: Report privately as described in [SECURITY.md](SECURITY.md) (not public issues)
- **n8n Community**: https://community.n8n.io

---

**Package**: `n8n-nodes-baramundi-management-suite`
**License**: MIT
