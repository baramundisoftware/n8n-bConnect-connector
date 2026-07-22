# n8n-nodes-baramundi-management-suite — Installation Guide

This guide provides detailed instructions for installing the baramundi community node for n8n.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
   - [Method 1: File Transfer Installation (Recommended)](#method-1-file-transfer-installation-recommended)
   - [Method 2: npm Registry (when available)](#method-2-npm-registry-when-available)
   - [Method 3: Docker Installation](#method-3-docker-installation)
3. [Verify Package Integrity](#verify-package-integrity)
4. [Verify Installation](#verify-installation)
5. [Configure Credentials](#configure-credentials)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing, ensure you have:

- **n8n**: Version 1.0.0 or higher
- **Node.js**: Version 18.0.0 or higher (Node.js 22 recommended)
- **baramundi Management Suite**: With bConnect API enabled (V2.0, bMS 25R2 or 26R1)
- **Network Access**: Connection to baramundi Management Server on port 444

---

## Installation Methods

### Method 1: File Transfer Installation (Recommended)

The package is distributed as a tarball file (`n8n-nodes-baramundi-management-suite-<version>.tgz`).

#### Step 1: Verify Package Integrity

Before installing, verify the GPG signature to ensure the package has not been tampered with. See [Verify Package Integrity](#verify-package-integrity) below.

#### Step 2: Transfer the File

Transfer the `.tgz` file to your n8n server using your preferred method:
- SCP/SFTP
- Network share
- USB drive

#### Step 3: Install from Tarball

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Install from the tarball
npm install /path/to/n8n-nodes-baramundi-management-suite-0.8.4.tgz
```

#### Step 4: Restart n8n

```bash
# If running n8n as a service
sudo systemctl restart n8n

# If running n8n manually
pkill -f "n8n start"
n8n start
```

---

### Method 2: npm Registry (when available)

> **Note**: npm registry publishing is pending approval. This method will be available in a future release.

```bash
cd ~/.n8n/custom
npm install n8n-nodes-baramundi-management-suite
n8n restart
```

If you don't have a `custom` directory, create it first:
```bash
mkdir -p ~/.n8n/custom
```

---

### Method 3: Docker Installation

#### Option A: Custom Dockerfile

```dockerfile
FROM n8nio/n8n:latest

USER root

# Install from tarball
COPY n8n-nodes-baramundi-management-suite-0.8.4.tgz /tmp/
RUN cd /usr/local/lib/node_modules/n8n && \
    npm install /tmp/n8n-nodes-baramundi-management-suite-0.8.4.tgz && \
    rm /tmp/*.tgz

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

#### Option B: Docker Compose with Volume Mount

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_CUSTOM_EXTENSIONS=/home/node/custom
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n-nodes-baramundi-management-suite-0.8.4.tgz:/tmp/package.tgz:ro
    command: >
      sh -c "
        mkdir -p /home/node/custom &&
        cd /home/node/custom &&
        npm install /tmp/package.tgz &&
        n8n start
      "

volumes:
  n8n_data:
```

```bash
docker-compose up -d
```

---

## Verify Package Integrity

Distribution tarballs are GPG-signed. Each release includes two files:

- `n8n-nodes-baramundi-management-suite-<version>.tgz` — the package
- `n8n-nodes-baramundi-management-suite-<version>.tgz.asc` — the detached GPG signature

### Step 1: Import the Signing Key (first time only)

```bash
# Import the baramundi signing key
gpg --import baramundi-signing-key.asc
```

The signing key fingerprint is:
- **Key**: RSA 4096-bit
- **Identity**: `bernd.wiedemann@baramundi.com`
- **Expires**: 2028-04-01

### Step 2: Verify the Signature

```bash
gpg --verify n8n-nodes-baramundi-management-suite-0.8.4.tgz.asc \
             n8n-nodes-baramundi-management-suite-0.8.4.tgz
```

Expected output:
```
gpg: Good signature from "Bernd Wiedemann <bernd.wiedemann@baramundi.com>"
```

If you see `BAD signature`, do **not** install the package — contact support@baramundi.com.

### Step 3: Verify the SHA checksum (alternative)

Each release also includes a SHA-256 checksum. Verify with:

```bash
sha256sum -c n8n-nodes-baramundi-management-suite-0.8.4.tgz.sha256
```

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
cd ~/.n8n/custom
npm list n8n-nodes-baramundi-management-suite
```

Expected output:
```
custom
└── n8n-nodes-baramundi-management-suite@0.8.4
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
| **Username** | bConnect API username | `Administrator` |
| **Password** | bConnect API password | `your-password` |
| **Ignore SSL Issues** | Enable for self-signed certificates | ✅ (for self-signed certs) |

> **Security Note**: Enabling "Ignore SSL Issues" disables TLS certificate validation for this connection, which exposes API traffic to man-in-the-middle attacks. Use only in isolated test environments. The recommended approach is to import your bMS server's CA certificate into the n8n host's trust store.

### Step 3: Test Credential

1. Click **Test Credential** button
2. Wait for validation (calls `/v2.0/endpoints?PageSize=1`)
3. If successful, you'll see a green checkmark
4. Click **Save**

### Common Test Errors

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Check server URL and ensure bConnect API is running |
| `ENOTFOUND` | Verify server hostname/IP is correct |
| `401 Unauthorized` | Check username and password |
| `SSL certificate problem` | Enable "Ignore SSL Issues" or install CA cert |
| `Network timeout` | Check firewall rules for port 444 |

---

## Troubleshooting

### Node Not Appearing in n8n

1. Verify installation: `cd ~/.n8n/custom && npm list n8n-nodes-baramundi-management-suite`
2. Check n8n version: `n8n --version` (must be 1.0.0+)
3. Restart n8n completely: `pkill -9 -f "n8n" && n8n start`
4. Check logs: `tail -f ~/.n8n/logs/n8n.log | grep -i baramundi`

### Permission Errors During Installation

```bash
sudo chown -R $USER ~/.n8n
```

### SSL Certificate Errors

Install the baramundi CA certificate in the system trust store:

```bash
# Linux (Ubuntu/Debian)
sudo cp baramundi-cert.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
n8n restart
```

### Docker Issues

```bash
# Check container logs
docker logs n8n

# Verify package inside container
docker exec -it n8n sh -c "cd /usr/local/lib/node_modules/n8n && npm list n8n-nodes-baramundi-management-suite"
```

---

## Uninstallation

```bash
cd ~/.n8n/custom
npm uninstall n8n-nodes-baramundi-management-suite
# Restart n8n
```

---

## Getting Help

- **Documentation**: See [README.md](README.md) for usage guide
- **Security Issues**: Report to support@baramundi.com (not public issues)
- **baramundi Support**: support@baramundi.com
- **n8n Community**: https://community.n8n.io

---

**Package**: `n8n-nodes-baramundi-management-suite`
**Version**: 0.8.4
**Last Updated**: 2026-04-02
**License**: MIT
