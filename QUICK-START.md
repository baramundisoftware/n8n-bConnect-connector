# Quick Start Guide - Baramundi n8n Connector

## Current Status

n8n is currently starting for the first time. This involves:
1. ✅ TypeScript build completed (0 errors)
2. ⏳ Installing n8n dependencies (takes 2-5 minutes on first run)
3. ⏳ Starting n8n server on port 5678

**Please wait 2-5 minutes** for the initial setup to complete.

## How to Know When n8n is Ready

### Option 1: Check the terminal
You'll see a message like:
```
Editor is now accessible via:
http://localhost:5678/
```

### Option 2: Test the connection
```bash
curl http://localhost:5678
```

### Option 3: Open in browser
Try opening: **http://localhost:5678** or **http://172.20.194.206:5678**

---

## Finding the Baramundi Node

Once n8n starts successfully:

### Step 1: Access n8n
Open your browser and go to **http://localhost:5678**

### Step 2: Create First Workflow
- Click **"+ Create new workflow"** or the **"+"** button
- Click **"Add first step"** or the **"+"** on the canvas

### Step 3: Search for Baramundi
In the node search box, type:
- **"Baramundi"** or
- **"bConnect"** or
- **"baramundi"** (lowercase)

### Step 4: If You Don't See It

If the Baramundi node doesn't appear, it means n8n didn't load the custom node. Here's what to do:

#### Solution 1: Restart with the script (recommended)
```bash
cd /home/ansible/claudinno/n8nconnector
./start-n8n-dev.sh
```

#### Solution 2: Manual restart
```bash
# Stop n8n
pkill -f n8n

# Start in dev mode
cd /home/ansible/claudinno/n8nconnector
npm run dev
```

#### Solution 3: Check the build
```bash
cd /home/ansible/claudinno/n8nconnector

# Verify dist folder exists
ls -la dist/nodes/Baramundi/

# Should see: Baramundi.node.js

# Rebuild if needed
npm run build
```

---

##Configure Credentials (One-Time Setup)

Before using workflows, set up your baramundi connection:

### Step 1: Add Credential
1. In n8n, click **Credentials** (left sidebar)
2. Click **"Add Credential"**
3. Search for **"baramundi bConnect API"**
4. Click on it

### Step 2: Fill in Details
| Field | Value | Notes |
|-------|-------|-------|
| **Server URL** | `https://bms-win22srv:444/bconnect` | Your baramundi server base URL |
| **Username** | `Administrator` | Or your username |
| **Password** | `baramundi-2008` | Your password |
| **Ignore SSL Issues** | ✅ **Enable** | For self-signed certificates |

**Note**: The connector automatically uses V2.0 API for endpoint operations (with modern pagination support).

### Step 3: Test Connection
1. Click **"Test Credential"**
2. Should show: ✅ **"Credential test successful"**
3. Click **"Save"**

---

## Your First Workflow

### Simple Test: List Endpoints

1. **Create New Workflow**
   - Click **"+"** → **"Create new workflow"**

2. **Add Manual Trigger**
   - Click **"Add first step"**
   - Search: **"Manual Trigger"** or **"When clicking 'Test workflow'"**
   - Click to add it

3. **Add Baramundi Node**
   - Click the **"+"** after the trigger
   - Search: **"Baramundi"**
   - Click to add it

4. **Configure Baramundi Node**
   - **Credential**: Select your baramundi credential (from above)
   - **Resource**: **Endpoint**
   - **Operation**: **Get Many**
   - **Return All**: Toggle **ON**

5. **Execute**
   - Click **"Test workflow"** button (top right)
   - You should see your baramundi endpoints!

---

## Troubleshooting

### Problem: Can't find Baramundi node

**Check 1:** Is n8n running in dev mode?
```bash
ps aux | grep "n8n-node dev"
# Should show a running process
```

**Check 2:** Is the node compiled?
```bash
ls dist/nodes/Baramundi/Baramundi.node.js
# Should exist
```

**Check 3:** Rebuild and restart
```bash
cd /home/ansible/claudinno/n8nconnector
npm run build
./start-n8n-dev.sh
```

### Problem: Credential test fails

**Error: Connection refused**
- Check server URL: `https://bms-win22srv:444/bconnect`
- Verify baramundi server is running
- Check network connectivity

**Error: SSL certificate error**
- Enable **"Ignore SSL Issues"** checkbox
- Verify NODE_TLS_REJECT_UNAUTHORIZED=0 if using environment variable

**Error: 401 Unauthorized**
- Check username and password
- Verify user has bConnect API permissions in baramundi

### Problem: n8n won't start

**Check logs:**
```bash
tail -50 /tmp/n8n.log
```

**Kill and restart:**
```bash
pkill -f n8n
cd /home/ansible/claudinno/n8nconnector
./start-n8n-dev.sh
```

**Check port 5678:**
```bash
ss -tuln | grep 5678
# Should show LISTEN state
```

---

## Example Workflows

Pre-built workflow templates are available in:
```
/home/ansible/claudinno/n8nconnector/example-workflows/
```

### Import a Workflow

1. In n8n: **Workflows** → **Import from File**
2. Select: `example-workflows/01-list-endpoints.json`
3. Click **"Import"**
4. Select your credential
5. Click **"Execute Workflow"**

### Available Templates

- **01-list-endpoints.json** - Simple endpoint listing
- **02-search-and-report.json** - Search and process results

---

## Available Operations

### Endpoint Resource
- **Get** - Single endpoint by ID
- **Get Many** - List all endpoints (with pagination)
- **Search** - Find endpoints by name
- **Delete** - Remove an endpoint

### Job Resource
- **Get** - Single job by ID
- **Get Many** - List all jobs
- **Execute** - Run job on endpoints
- **Get Instances** - View execution history

### Organizational Unit Resource
- **Get** - Single OU by ID
- **Get Many** - List all OUs
- **Get Children** - List child OUs

---

## Next Steps

1. ⏳ **Wait for n8n to finish starting** (2-5 minutes)
2. 🌐 **Open http://localhost:5678** in your browser
3. 🔑 **Set up credentials** (one-time)
4. ✨ **Create your first workflow** (use the simple test above)
5. 📚 **Explore example workflows**
6. 🚀 **Build automation for your environment**

---

## Useful Commands

```bash
# Start n8n (recommended)
./start-n8n-dev.sh

# Stop n8n
pkill -f n8n

# Rebuild node
npm run build

# Run tests
npm test

# Check n8n status
ps aux | grep n8n

# View logs
tail -f /tmp/n8n.log
```

---

## Getting Help

If the Baramundi node still doesn't appear after following this guide:

1. Check build output: `npm run build`
2. Verify files exist: `ls dist/nodes/Baramundi/`
3. Check n8n logs: `tail -50 /tmp/n8n.log`
4. Restart n8n: `./start-n8n-dev.sh`

If you see the node but it's not working:
1. Test credentials
2. Check baramundi server is accessible
3. Review error messages in workflow execution
