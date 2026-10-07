# Example Workflows

Production-ready n8n workflow templates for the baramundi Management Suite connector.

## Prerequisites

- n8n with `n8n-nodes-baramundi-management-suite` installed
- **bConnect API credential** configured (Credentials > Add > "baramundi bConnect API"):
  - Server URL: `https://your-bms-server:444/bconnect`
  - Username / Password: service account with bConnect API access
  - Ignore SSL Issues: enable for self-signed certificates
- baramundi Management Suite **25R2** or **26R1** (workflows note version requirements)

## How to Import

1. Open n8n
2. Click **Workflows** > **Import from File**
3. Select a `.json` file from this directory
4. Update the **bConnect API credential** on each baramundi node
5. Replace placeholder GUIDs (e.g. `YOUR-WINDOWS-UPDATE-JOB-DEFINITION-GUID`) with your actual IDs
6. Adjust schedule triggers to match your maintenance windows

## Workflows

### 01-patch-cycle.json — Patch Tuesday Cycle

**Purpose**: End-to-end monthly patching — sets a nightly maintenance window (22:00–04:00) on every logical group, starts the Windows Update job on each endpoint of those groups, waits for completion, and sends an HTML report with a styled failure table.

**Trigger**: Schedule (2nd Tuesday of month, 22:00)

**Nodes**: baramundi Endpoint (Logical Group, Maintenance Window) + baramundi Job (Job Instance) + Code + Email

**What to customise**:
- Replace `YOUR-WINDOWS-UPDATE-JOB-DEFINITION-GUID` with your Windows Update job definition ID
- Adjust the cron expression and the maintenance window intervals for your patch window
- Adjust the wait duration (default: 4 hours)
- Configure the Send Report Email node with your SMTP credentials (disabled by default)

**bMS version**: 25R2 or 26R1

---

### 02-job-failure-alert.json — Job Failure Alert

**Purpose**: Monitors all job instances every 6 hours. If any failed in the last 24 hours, groups them by job definition, enriches with the job name, and formats a notification message.

**Trigger**: Schedule (every 6 hours)

**Nodes**: baramundi Job (Job Instance, Job Definition) + Code + If

**What to customise**:
- Add a Slack, Teams, or Email node after "Format Notification" to deliver the alert
- Adjust the schedule interval
- Change the 24-hour lookback window in the Code node

**bMS version**: 25R2 or 26R1

---

### 03-critical-cves.json — Critical CVE Report (26R1)

**Purpose**: Daily scan for endpoints with critical vulnerabilities (CVSS >= 9.0). Enriches each finding with CVE details and endpoint information, then produces a prioritised remediation list.

**Trigger**: Schedule (daily 06:00)

**Nodes**: baramundi Security (Compliance) + baramundi Endpoint + Code + If

**What to customise**:
- Adjust the CVSS threshold in the Filter Critical code node (default: 9.0)
- Add a notification node after "Build Remediation Report" to send results to your security team

**bMS version**: 26R1 only (uses Compliance module)

---

### 04-stale-endpoint-report.json — Stale Endpoint Report

**Purpose**: Monthly report of endpoints that haven't been seen in 30+ days. Aggregates stale devices by logical group for IT review and potential cleanup.

**Trigger**: Schedule (1st Monday of month, 08:00)

**Nodes**: baramundi Endpoint + Code + If

**What to customise**:
- Change `STALE_DAYS` in the Code node (default: 30)
- Add an Email or spreadsheet node after "Aggregate by Group" to deliver the report

**bMS version**: 25R2 or 26R1

## Tips

- **Start with a manual trigger** while testing — change to Schedule once confirmed working
- **Use "Return All"** for complete datasets, or set a limit for testing
- **resourceLocator fields** support search-by-name — click the field and type to find endpoints/jobs
- **Code nodes** use JavaScript — access input with `$input.all()`, return with `return [{ json: {...} }]`
- All baramundi nodes require the same `bconnectApi` credential — configure it once, reuse everywhere
