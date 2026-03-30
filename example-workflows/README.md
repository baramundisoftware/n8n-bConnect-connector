# Example Workflows for n8n Baramundi Connector

This directory contains ready-to-use workflow templates for the n8n Baramundi connector.

## How to Import

1. Open n8n at http://localhost:5678
2. Click **Workflows** → **Import from File**
3. Select one of the JSON files from this directory
4. Configure credentials when prompted
5. Click **Execute** or **Test workflow** to run

## Available Workflows

### 01-list-endpoints.json
**Purpose**: Simple workflow to list all baramundi endpoints

**What it does**:
- Triggers manually
- Fetches all endpoints from baramundi
- Displays them in n8n

**Use case**: Testing connectivity and viewing your managed devices

---

### 02-search-and-report.json
**Purpose**: Search for specific endpoints and process results

**What it does**:
- Searches for endpoints matching "WIN" (Windows machines)
- Processes and formats the results
- Extracts key information (name, ID, last contact, user)

**Use case**: Finding specific devices and generating reports

**Customize**:
- Change `searchQuery` from "WIN" to your search term
- Modify the Code node to extract different fields

---

## Creating Your Own Workflows

### Basic Structure

Every workflow needs at least:
1. **Trigger** - When to run (Manual, Schedule, Webhook, etc.)
2. **Baramundi Node** - What to do with baramundi
3. **Processing** - Optional data transformation
4. **Output** - Email, Slack, Database, etc.

### Common Patterns

#### Pattern 1: Scheduled Maintenance
```
Schedule Trigger (daily)
  → Baramundi: Get endpoints
  → Code: Filter inactive
  → Baramundi: Execute cleanup job
  → Email: Send report
```

#### Pattern 2: Event-Driven Response
```
Webhook Trigger (from monitoring)
  → Baramundi: Search for endpoint
  → IF: Endpoint found
    → Baramundi: Execute remediation job
    → Slack: Notify team
```

#### Pattern 3: Compliance Monitoring
```
Schedule Trigger (weekly)
  → Baramundi: Get all endpoints
  → Code: Check compliance rules
  → IF: Non-compliant found
    → Baramundi: Get job instances
    → Database: Log violations
    → Email: Alert security team
```

## Tips for Building Workflows

1. **Start Simple**: Begin with manual triggers and basic operations
2. **Test Incrementally**: Add one node at a time and test
3. **Use Code Nodes**: JavaScript/Python for complex logic
4. **Error Handling**: Add IF nodes to handle errors gracefully
5. **Pagination**: Use "Return All" for complete results
6. **Credentials**: Test credentials before building complex workflows

## Credential Configuration

Before using these workflows, configure your baramundi credentials:

1. Go to **Credentials** → **Add Credential**
2. Search for "baramundi bConnect API"
3. Fill in:
   - **Server URL**: `https://bms-win22srv:444/bconnect`
   - **Username**: `Administrator`
   - **Password**: Your password
   - **Ignore SSL**: `true` (for self-signed certificates)
4. Click **Test** to verify

## Troubleshooting

### Workflow Not Finding Baramundi Node
- Ensure n8n is running with custom node: `npm run dev`
- Check that `dist/` folder contains compiled files
- Restart n8n if you just built the node

### Authentication Errors
- Verify credentials are correct
- Check server URL includes `/bconnect`
- Enable "Ignore SSL Issues" for self-signed certs
- Ensure user has bConnect API permissions

### Empty Results
- Verify search query is not too restrictive
- Check user permissions in baramundi
- Try "Get Many" instead of "Search"
- Increase page size or use "Return All"

## Next Steps

1. Import and test the basic workflows
2. Modify them to match your environment
3. Combine with other n8n nodes (Email, Slack, Database)
4. Set up scheduled automation
5. Build custom workflows for your use cases

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Baramundi bConnect API](https://docs.baramundi.com/)
- [Main README](../README.md)
