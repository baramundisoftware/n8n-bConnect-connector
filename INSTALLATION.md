# n8n-nodes-baramundi Installation Guide

This guide provides detailed instructions for installing the baramundi community node for n8n.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
   - [Method 1: npm Install (Recommended)](#method-1-npm-install-recommended)
   - [Method 2: File Transfer Installation](#method-2-file-transfer-installation)
   - [Method 3: Docker Installation](#method-3-docker-installation)
3. [Verify Installation](#verify-installation)
4. [Configure Credentials](#configure-credentials)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing, ensure you have:

- **n8n**: Version 1.0.0 or higher
- **Node.js**: Version 18.0.0 or higher
- **baramundi Management Suite**: With bConnect API enabled (V2.0, bMS 25R2 or 26R1)
- **Network Access**: Connection to baramundi Management Server on port 444

---

## Installation Methods

### Method 1: npm Install (Recommended)

For self-hosted n8n installations:

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Install the package
npm install n8n-nodes-baramundi

# Restart n8n
n8n restart
```

**Note**: If you don't have a `custom` directory, create it first:
```bash
mkdir -p ~/.n8n/custom
```

---

### Method 2: File Transfer Installation

If you received the package as a tarball file (`n8n-nodes-baramundi-0.1.0.tgz`):

#### Step 1: Transfer the File

Transfer the `.tgz` file to your n8n server using your preferred method:
- SCP/SFTP
- USB drive
- Network share
- Email attachment (if file size permits)

#### Step 2: Install from Tarball

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Install from the tarball
npm install /path/to/n8n-nodes-baramundi-0.1.0.tgz

# Example: If the file is in your downloads folder
npm install ~/Downloads/n8n-nodes-baramundi-0.1.0.tgz
```

#### Step 3: Restart n8n

```bash
# If running n8n as a service
sudo systemctl restart n8n

# If running n8n manually
pkill -f "n8n start"
n8n start
```

---

### Method 3: Docker Installation

If running n8n in Docker, you have two options:

#### Option A: Custom Dockerfile

Create a custom Dockerfile that extends the n8n image:

```dockerfile
FROM n8nio/n8n:latest

USER root

# Install from npm
RUN cd /usr/local/lib/node_modules/n8n && \
    npm install n8n-nodes-baramundi

# OR install from tarball
# COPY n8n-nodes-baramundi-0.1.0.tgz /tmp/
# RUN cd /usr/local/lib/node_modules/n8n && \
#     npm install /tmp/n8n-nodes-baramundi-0.1.0.tgz

USER node
```

Build and run:

```bash
# Build the image
docker build -t n8n-baramundi .

# Run the container
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
      - ./n8n-nodes-baramundi-0.1.0.tgz:/tmp/package.tgz:ro
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

Start the container:
```bash
docker-compose up -d
```

---

## Verify Installation

After installation, verify the node is available:

### Method 1: Check in n8n UI

1. Open n8n in your browser: `http://your-server:5678`
2. Create a new workflow or open an existing one
3. Click the **+** button to add a node
4. Search for "baramundi"
5. You should see the **Baramundi** node in the results

### Method 2: Check npm Installation

```bash
cd ~/.n8n/custom
npm list n8n-nodes-baramundi
```

Expected output:
```
custom
└── n8n-nodes-baramundi@0.1.0
```

### Method 3: Check n8n Logs

```bash
# Check n8n logs for node loading
tail -f ~/.n8n/logs/n8n.log | grep -i baramundi
```

You should see messages indicating the node was loaded successfully.

---

## Configure Credentials

After installation, configure the baramundi bConnect API credentials:

### Step 1: Create Credential

1. Open n8n in your browser
2. Navigate to **Credentials** (left sidebar)
3. Click **Add Credential**
4. Search for "baramundi"
5. Select **baramundi bConnect API**

### Step 2: Enter Connection Details

| Field                  | Description                                      | Example                                     |
|------------------------|--------------------------------------------------|---------------------------------------------|
| **Server URL**         | Base URL of your bConnect API                    | `https://bms-server:444/bconnect`           |
| **Username**           | bConnect API username                            | `Administrator`                             |
| **Password**           | bConnect API password                            | `your-password`                             |
| **Ignore SSL Issues**  | Enable for self-signed certificates              | ✅ (for self-signed certs)                  |

### Step 3: Test Credential

1. Click **Test Credential** button
2. Wait for validation (calls `/v2.0/endpoints?PageSize=1`)
3. If successful, you'll see a green checkmark
4. Click **Save** to store the credential

### Common Test Errors

| Error Message                          | Solution                                                         |
|----------------------------------------|------------------------------------------------------------------|
| `ECONNREFUSED`                         | Check server URL and ensure bConnect API is running              |
| `ENOTFOUND`                            | Verify server hostname/IP is correct                             |
| `401 Unauthorized`                     | Check username and password                                      |
| `SSL certificate problem`              | Enable "Ignore SSL Issues" option                                |
| `Network timeout`                      | Check firewall rules for port 444                                |

---

## Troubleshooting

### Node Not Appearing in n8n

**Symptoms**: Can't find "baramundi" when searching for nodes

**Solutions**:
1. Verify installation:
   ```bash
   cd ~/.n8n/custom
   npm list n8n-nodes-baramundi
   ```

2. Check n8n version:
   ```bash
   n8n --version
   ```
   Must be ≥1.0.0

3. Restart n8n completely:
   ```bash
   pkill -9 -f "n8n"
   n8n start
   ```

4. Check for installation errors:
   ```bash
   cd ~/.n8n/custom
   npm install n8n-nodes-baramundi --loglevel verbose
   ```

---

### Permission Errors During Installation

**Symptoms**: `EACCES` errors during npm install

**Solutions**:
1. Fix npm permissions:
   ```bash
   sudo chown -R $USER ~/.n8n
   ```

2. Or use npm with sudo (not recommended):
   ```bash
   sudo npm install n8n-nodes-baramundi
   ```

---

### SSL Certificate Errors

**Symptoms**: `UNABLE_TO_VERIFY_LEAF_SIGNATURE` or `CERT_HAS_EXPIRED`

**Solutions**:
1. Enable "Ignore SSL Issues" in credentials
2. Or install the baramundi certificate in your system trust store:
   ```bash
   # Linux (Ubuntu/Debian)
   sudo cp baramundi-cert.crt /usr/local/share/ca-certificates/
   sudo update-ca-certificates

   # Restart n8n
   n8n restart
   ```

---

### Docker Installation Issues

**Symptoms**: Node not loading in Docker container

**Solutions**:
1. Check container logs:
   ```bash
   docker logs n8n
   ```

2. Verify the package was installed:
   ```bash
   docker exec -it n8n sh
   cd /usr/local/lib/node_modules/n8n
   npm list n8n-nodes-baramundi
   ```

3. Ensure custom extensions path is set:
   ```bash
   docker exec -it n8n env | grep N8N_CUSTOM
   ```

---

### Node.js Version Incompatibility

**Symptoms**: Installation fails with module compatibility errors

**Solutions**:
1. Check Node.js version:
   ```bash
   node --version
   ```
   Must be ≥18.0.0

2. Update Node.js if needed:
   ```bash
   # Using nvm
   nvm install 20
   nvm use 20

   # Or using apt (Ubuntu)
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

---

## Uninstallation

If you need to remove the node:

```bash
cd ~/.n8n/custom
npm uninstall n8n-nodes-baramundi
```

Then restart n8n.

---

## Getting Help

- **Documentation**: See [README.md](README.md) for usage guide
- **Issues**: Report bugs at https://github.com/baramundi-software/n8n-nodes-baramundi/issues
- **baramundi Support**: support@baramundi.com
- **n8n Community**: https://community.n8n.io

---

## Next Steps

After successful installation:

1. ✅ Configure baramundi credentials (see [Configure Credentials](#configure-credentials))
2. ✅ Review the [README.md](README.md) for feature overview
3. ✅ Try the example workflows in [README.md](README.md#example-workflows)
4. ✅ Check the [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for UI feature testing

---

**Package Version**: 0.1.0
**Last Updated**: 2026-01-22
**License**: MIT
