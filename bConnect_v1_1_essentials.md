# bConnect V1.1 API - Essential Knowledge

**Document Version:** 1.1
**Last Updated:** 2026-01-22
**Status:** Production-validated knowledge from live API testing + Official API Reference (Pages 101-151)

---

## Table of Contents

1. [Overview](#overview)
2. [API Architecture](#api-architecture)
3. [Key Differences vs V2.0](#key-differences-vs-v20)
4. [URL Patterns](#url-patterns)
5. [Authentication](#authentication)
6. [Pagination](#pagination)
7. [Query Parameters](#query-parameters)
8. [Response Structures](#response-structures)
9. [Property Naming Conventions](#property-naming-conventions)
10. [Implemented Controllers](#implemented-controllers)
11. [Error Handling](#error-handling)
12. [Common Pitfalls](#common-pitfalls)
13. [Security Considerations](#security-considerations)
14. [Implementation Patterns](#implementation-patterns)

---

## Overview

bConnect V1.1 is the **legacy API** for baramundi Management Suite, providing access to specialized features not yet available in V2.0. While V2.0 is the modern, RESTful API with comprehensive pagination and filtering, V1.1 remains essential for:

- **BitLocker Secrets Management** (recovery keys, TPM passwords, PINs)
- **Compliance Violations** (CVE tracking, MDM policy violations)
- **Detailed Inventory Data** (file scans, WMI scans, custom scans, registry scans)
- **Hardware Profiles** (hardware configuration queries)
- **Boot Environments** (PXE boot management)
- **Apple VPP Management** (iOS/Mac app licensing) - Not yet implemented
- **SSH Server Management** (Linux/Unix endpoints) - Not yet implemented
- **Setup File Integrity** (security verification) - Not yet implemented

**Design Philosophy:** V1.1 predates modern REST conventions and has unique quirks that must be understood for successful implementation.

---

## API Architecture

### Base URL Structure

```
https://bms-win22srv:444/bconnect/v1.1/{ControllerName}
```

**Examples:**
- `https://bms-win22srv:444/bconnect/v1.1/ComplianceViolations`
- `https://bms-win22srv:444/bconnect/v1.1/EndpointSecrets`
- `https://bms-win22srv:444/bconnect/v1.1/HardwareProfiles`
- `https://bms-win22srv:444/bconnect/v1.1/InventoryDataWMIScans`

### Controller Naming

V1.1 controllers use **PascalCase** with descriptive names:
- `ComplianceViolations` (not `compliance-violations`)
- `EndpointSecrets` (not `endpoint-secrets`)
- `InventoryDataWMIScans` (not `inventory-data-wmi-scans`)

---

## Key Differences vs V2.0

| Aspect | V1.1 | V2.0 |
|--------|------|------|
| **URL Structure** | `/v1.1/{Controller}` | `/{module}/v2.0/{Resource}` |
| **ID Passing** | Query parameter `?ID={guid}` | Path parameter `/{id}` |
| **Pagination** | **NOT SUPPORTED** (HTTP 400 error) | Full support with `Page`, `PageSize` |
| **Filtering** | Limited or none | `SearchQuery`, `OrderBy` |
| **Property Names** | **PascalCase** (`Id`, `Name`, `EndpointId`) | **camelCase** (`id`, `name`, `endpointId`) |
| **Response Wrapper** | `{Data: [...], TotalCount: N}` | `{data: [...], totalPages: N, ...}` |
| **Parameter Validation** | **Strict** (rejects unknown params) | Tolerant (ignores unknown params) |
| **OpenAPI Specs** | **None available** | Available at `/openapi/v2.0/` |
| **Design Pattern** | Query-string based, legacy | RESTful, modern |

---

## URL Patterns

### Pattern 1: Get All Resources

```http
GET /v1.1/{ControllerName}
```

**Example:**
```http
GET /v1.1/ComplianceViolations
```

**Response:**
```json
{
  "Data": [
    {"Id": "CVE-2024-1234", "Severity": "Critical", ...},
    {"Id": "CVE-2024-5678", "Severity": "High", ...}
  ],
  "TotalCount": 2
}
```

### Pattern 2: Get by ID (Query Parameter)

```http
GET /v1.1/{ControllerName}?ID={guid}
```

**Example:**
```http
GET /v1.1/HardwareProfiles?ID={12345678-1234-1234-1234-123456789012}
```

**Response:**
```json
{
  "Data": {
    "Id": "{12345678-1234-1234-1234-123456789012}",
    "Name": "Standard Workstation",
    "Manufacturer": "Dell",
    "CpuSpeed": 3400,
    "Memory": 16384
  },
  "TotalCount": 1
}
```

### Pattern 3: Get by Endpoint ID

```http
GET /v1.1/{ControllerName}?EndpointID={guid}
```

**Example:**
```http
GET /v1.1/EndpointSecrets?EndpointId={0FB6B08E-9F32-41E3-938F-0B74870BECC2}
```

**Response:**
```json
{
  "EndpointId": "{0FB6B08E-9F32-41E3-938F-0B74870BECC2}",
  "VolumeSecretEntries": [
    {
      "VolumeGuid": "{volume-guid-1}",
      "RecoveryPassword": "123456-234567-345678-...",
      "TpmOwnerAuth": "base64encodedstring=="
    }
  ]
}
```

### Pattern 4: Get by Template Name (URL Encoded)

```http
GET /v1.1/InventoryDataWMIScans?TemplateName={name}
```

**Example:**
```http
GET /v1.1/InventoryDataWMIScans?TemplateName=Network%20Configuration
```

**Important:** Always use `encodeURIComponent()` for template names with spaces or special characters.

### Pattern 5: Get Latest Scan

```http
GET /v1.1/InventoryDataWMIScans?TemplateName={name}&Scan=Latest
```

**Note:** The value `Latest` is **case-sensitive** and passed as-is (not URL encoded).

### Pattern 6: Get Specific Scan by Timestamp

```http
GET /v1.1/InventoryDataWMIScans?TemplateName={name}&Scan={timestamp}
```

**Example:**
```http
GET /v1.1/InventoryDataWMIScans?TemplateName=Network%20Configuration&Scan=2026-01-22T08%3A30%3A00Z
```

**Important:** UTC timestamps must be URL encoded (`encodeURIComponent('2026-01-22T08:30:00Z')`).

---

## Authentication

V1.1 uses the **same authentication** as V2.0:

```http
Authorization: Basic {base64(username:password)}
```

**Credentials Configuration:**
- Base URL: `https://bms-win22srv:444/bconnect`
- Username: `Administrator` (or other authorized user)
- Password: (configured password)
- SSL Verification: Can be disabled with `ignoreSslIssues` option

**Important:** V1.1 endpoints respect the same security groups and permissions as V2.0.

---

## Pagination

### ⚠️ Critical: V1.1 Does NOT Support Pagination

**This will fail:**
```http
GET /v1.1/ComplianceViolations?PageSize=50&Page=0
```

**Error:**
```json
{
  "Message": "Invalid request. Unexpected parameters: PageSize=50&Page=0",
  "StatusCode": 400
}
```

**Workaround:**
- V1.1 always returns **all results** in a single response
- For large datasets, implement **client-side pagination** if needed
- Monitor response size and performance

**Implemented Controllers and Typical Response Sizes:**
- `ComplianceViolations`: 1407 violations (~2 MB)
- `HardwareProfiles`: ~50 profiles (~100 KB)
- `BootEnvironment`: ~20 environments (~50 KB)
- `EndpointSecrets`: 1 endpoint, multiple volumes (~10 KB)
- `InventoryDataWMIScans`: Varies by template (100 KB - 5 MB)

---

## Query Parameters

### Supported Parameters by Controller

| Controller | Supported Parameters | Notes |
|------------|---------------------|-------|
| `ComplianceViolations` | None for list, `/{id}` for single | No filtering, client-side only |
| `EndpointSecrets` | `EndpointId={guid}` | Required parameter |
| `HardwareProfiles` | `ID={guid}` (optional) | Get all or get one |
| `BootEnvironment` | `ID={guid}` (optional) | Get all or get one |
| `InventoryDataFileScans` | `EndpointID={guid}` | Optional filter |
| `InventoryDataWMIScans` | `EndpointID={guid}`, `TemplateName={name}`, `Scan={time\|Latest}` | Combinable |
| `InventoryDataCustomScans` | `EndpointID={guid}`, `TemplateName={name}`, `Scan={time\|Latest}` | Combinable |
| `InventoryDataRegistryScans` | `EndpointID={guid}` | Optional filter |

### Parameter Case Sensitivity

**⚠️ V1.1 parameters are case-sensitive:**
- `EndpointID` ✅ (correct)
- `EndpointId` ❌ (wrong - will be rejected)
- `ID` ✅ (correct)
- `Id` ❌ (wrong)

**Exception:** Based on actual API testing, some controllers accept both `EndpointId` and `EndpointID`. Always check API responses.

### Parameter Validation

V1.1 **strictly validates** all parameters:

```http
GET /v1.1/HardwareProfiles?unknownParam=value
```

**Error:**
```json
{
  "Message": "Invalid request. Unexpected parameters: unknownParam=value",
  "StatusCode": 400
}
```

**Best Practice:** Only include documented parameters for each controller.

---

## Response Structures

### Standard Response Wrapper

Most V1.1 controllers return data wrapped in a `Data` property:

```json
{
  "Data": [...] or {...},
  "TotalCount": 123
}
```

**Exceptions:**
- `EndpointSecrets`: Returns unwrapped object directly
- Some specialized controllers may have custom response structures

### Single Item vs Array

**Get All (returns array):**
```json
{
  "Data": [
    {"Id": "1", "Name": "Item 1"},
    {"Id": "2", "Name": "Item 2"}
  ],
  "TotalCount": 2
}
```

**Get by ID (returns single object or array with one item):**
```json
{
  "Data": {
    "Id": "1",
    "Name": "Item 1"
  },
  "TotalCount": 1
}
```

**Implementation Pattern:**
```typescript
const data = (response.Data || response) as any[];
return this.helpers.returnJsonArray(Array.isArray(data) ? data : [data]);
```

---

## Property Naming Conventions

### V1.1 Uses PascalCase

All property names in V1.1 responses use **PascalCase**:

```json
{
  "Id": "{guid}",
  "Name": "Example",
  "EndpointId": "{endpoint-guid}",
  "DisplayName": "Example Display",
  "ParentId": "{parent-guid}",
  "GuidParent": "{parent-guid}",
  "HierarchyPath": "\\Root\\Child",
  "CpuSpeed": 3400,
  "Memory": 16384,
  "SerialNumber": "ABC123",
  "ManufacturerName": "Dell Inc.",
  "VolumeSecretEntries": [...],
  "RecoveryPassword": "123456-234567-...",
  "TpmOwnerAuth": "base64string=="
}
```

### Common Property Names

| Property | Description | Example |
|----------|-------------|---------|
| `Id` | Unique identifier (GUID or string) | `"{12345678-...}"` or `"CVE-2024-1234"` |
| `Guid` | Alternative GUID property | `"{12345678-...}"` |
| `Name` | Resource name | `"Standard Workstation"` |
| `DisplayName` | Human-readable name | `"My Endpoint"` |
| `EndpointId` | Foreign key to endpoint | `"{0FB6B08E-...}"` |
| `ParentId` | Parent resource ID | `"{parent-guid}"` |
| `GuidParent` | Alternative parent GUID | `"{parent-guid}"` |
| `HierarchyPath` | Path in hierarchy | `"\\Root\\OU\\Child"` |
| `TemplateName` | Scan template name | `"Network Configuration"` |
| `ScanTime` | Scan timestamp | `"2026-01-22T08:30:00Z"` |

---

## Implemented Controllers

### 1. InventoryDataHardwareScans

**Controller:** `InventoryDataHardwareScans`
**Spec Reference:** Page 54
**Operations:** 3 (all read-only)

**Operations:**
```typescript
// Get hardware scan by endpoint
GET /v1.1/InventoryDataHardwareScans?EndpointID={guid}

// Get hardware scan by endpoint and template (Windows only)
GET /v1.1/InventoryDataHardwareScans?EndpointID={guid}&TemplateName={name}

// Get hardware scan by endpoint, template, and scan time (Windows only)
GET /v1.1/InventoryDataHardwareScans?EndpointID={guid}&TemplateName={name}&Scan={time|Latest}
```

**Response Example:**
```json
{
  "Data": {
    "EndpointId": "{endpoint-guid}",
    "TemplateName": "Hardware Inventory",
    "ScanTime": "2026-01-22T08:30:00Z",
    "HardwareData": {
      "Manufacturer": "Dell Inc.",
      "Model": "OptiPlex 7090",
      "SerialNumber": "ABC123",
      "Memory": 16384,
      "CPUSpeed": 3400
    }
  },
  "TotalCount": 1
}
```

**Key Features:**
- Cross-platform support (Windows, iOS, Android, Mac)
- Template-based scanning (Windows only)
- Historical scan data with timestamps
- Latest scan retrieval

**Limitations:**
- TemplateName and Scan parameters are ignored for non-Windows endpoints
- No pagination support

---

### 2. InventoryDataSnmpScans

**Controller:** `InventoryDataSnmpScans`
**Spec Reference:** Page 55
**Operations:** 1 (read-only)

**Operations:**
```typescript
// Get SNMP scan data by endpoint
GET /v1.1/InventoryDataSnmpScans?EndpointID={guid}
```

**Response Example:**
```json
{
  "Data": {
    "EndpointId": "{endpoint-guid}",
    "SnmpData": {
      "sysDescr": "Cisco IOS Software...",
      "sysObjectID": "1.3.6.1.4.1.9.1.123",
      "sysUpTime": "1234567890",
      "sysContact": "admin@company.com",
      "sysName": "router-01",
      "sysLocation": "Data Center A"
    }
  },
  "TotalCount": 1
}
```

**Use Cases:**
- Network device inventory
- SNMP-enabled device management
- Infrastructure monitoring

**Permissions Required:**
- Read rights on "Inventoried Files" node
- Read rights on corresponding endpoint

---

### 3. InventoryOverviews

**Controller:** `InventoryOverviews`
**Spec Reference:** Page 55
**Operations:** 2 (all read-only)

**Operations:**
```typescript
// Get all inventory overviews
GET /v1.1/InventoryOverviews

// Get inventory overview by endpoint
GET /v1.1/InventoryOverviews?EndpointID={guid}
```

**Response Example:**
```json
{
  "Data": {
    "EndpointId": "{endpoint-guid}",
    "CustomScans": [
      {
        "TemplateName": "Custom Application Check",
        "LastScanTime": "2026-01-22T08:30:00Z"
      }
    ],
    "WmiScans": [
      {
        "TemplateName": "Network Configuration",
        "LastScanTime": "2026-01-22T08:25:00Z"
      }
    ],
    "HardwareScans": [
      {
        "TemplateName": "Hardware Inventory",
        "LastScanTime": "2026-01-22T08:20:00Z"
      }
    ]
  },
  "TotalCount": 1
}
```

**Key Features:**
- Overview of Custom, WMI, and Hardware scans
- Scan timestamp tracking
- Quick scan status check

**Limitations:**
- Windows endpoints only
- Read-only access

---

### 4. InventoryAppScans

**Controller:** `InventoryAppScans`
**Spec Reference:** Page 56
**Operations:** 2 (all read-only)

**Operations:**
```typescript
// Get all app scan data
GET /v1.1/InventoryAppScans

// Get app scan data by endpoint
GET /v1.1/InventoryAppScans?EndpointID={guid}
```

**Response Example:**
```json
{
  "Data": [
    {
      "EndpointId": "{endpoint-guid}",
      "Apps": [
        {
          "Name": "Microsoft Teams",
          "Version": "1.5.00.12345",
          "Publisher": "Microsoft Corporation",
          "InstallDate": "2026-01-15T00:00:00Z"
        }
      ],
      "ScanTime": "2026-01-22T08:30:00Z"
    }
  ],
  "TotalCount": 1
}
```

**Key Features:**
- Mobile device app inventory (Android and iOS only)
- App version tracking
- Publisher information
- Install date tracking

**Limitations:**
- Mobile devices only (Android and iOS)
- No pagination support

---

### 5. SoftwareScanRules

**Controller:** `SoftwareScanRules`
**Spec Reference:** Page 57
**Operations:** 1 (read-only)

**Operations:**
```typescript
// Get all software scan rules
GET /v1.1/SoftwareScanRules
```

**Response Example:**
```json
{
  "Data": [
    {
      "Id": "006548b4-d65b-4e6a-870e-a9f1eb8542f5",
      "Category": "ManagedSoftware",
      "Comment": "",
      "IsMswRule": true,
      "Protected": true,
      "Rules": "chlcdfkeanhekcdakeigla…hlniifpakf",
      "SoftwareManufacturer": "VideoLan",
      "SoftwareName": "VLC",
      "SoftwareVersion": "2.1.1-x64"
    }
  ],
  "TotalCount": 1
}
```

**Key Features:**
- Client software inventory rules
- Managed software tracking
- Software detection patterns
- Windows endpoints only

**Permissions Required:**
- Read rights on "Software scan rules" node in Inventory module

---

### 6. SoftwareScanRuleCounts

**Controller:** `SoftwareScanRuleCounts`
**Spec Reference:** Page 58
**Operations:** 1 (read-only)

**Operations:**
```typescript
// Get all software scan rule counts
GET /v1.1/SoftwareScanRuleCounts
```

**Response Example:**
```json
{
  "Data": [
    {
      "InstalledCount": 50,
      "InstalledEndpoints": [
        {
          "Id": "17B65E8A-DBF3-456C-B5A5-38E596F01C20",
          "Name": "WIN10-ENT"
        }
      ],
      "SoftwareScanRule": {
        "Id": "006548b4-d65b-4e6a-870e-a9f1eb8542f5",
        "Category": "ManagedSoftware",
        "SoftwareManufacturer": "Oracle",
        "SoftwareName": "Java JRE",
        "SoftwareVersion": "8.0.111.14-x64"
      }
    }
  ],
  "TotalCount": 1
}
```

**Key Features:**
- Software installation counts
- Endpoint lists per software
- License management support
- Windows endpoints only

**Permissions Required:**
- Read rights on "Licenses" node in Licenses module

---

### 7. EndpointInvSoftware

**Controller:** `EndpointInvSoftware`
**Spec Reference:** Page 59
**Operations:** 1 (read-only)

**Operations:**
```typescript
// Get all endpoint inventory software links
GET /v1.1/EndpointInvSoftware
```

**Response Example:**
```json
{
  "Data": [
    {
      "ConflictedRules": 0,
      "GuidEndpoint": "26c2712a-7f5e-4307-b675-8139accf4b4d",
      "GuidRule": "04b2928e-645b-4a99-8a2c-746fdc2c122d",
      "InventoryPath": "$Registry$",
      "InventoryVersion": "8.8.9.237",
      "LastSeen": "2013-05-22T09:30:56+02:00"
    }
  ],
  "TotalCount": 1
}
```

**Key Features:**
- Links endpoints to inventoried software
- Software version tracking per endpoint
- Last seen timestamps
- Conflict detection
- Windows endpoints only

**Permissions Required:**
- Read rights on corresponding Endpoint objects
- Read rights on "Software scan rules" node

---

### 8. Images

**Controller:** `Images`
**Spec Reference:** Page 60
**Operations:** 1 (read-only)

**Operations:**
```typescript
// Get image by ID
GET /v1.1/Images?Id={image-id}
```

**Response Example:**
```json
{
  "Id": "B227BAACC41C9D51BD03B823E785A084",
  "MimeType": "image/jpeg",
  "Data": "..."
}
```

**Key Features:**
- Job-related image retrieval
- Base64-encoded image data
- MIME type support

**Use Cases:**
- Job icon/image retrieval
- Visual job representation

---

### 9. Compliance Violations (CVE Tracking)

**Controller:** `ComplianceViolations`
**Spec Reference:** Page 73
**Operations:** 2 (all read-only)

**Operations:**
```typescript
// Get all compliance violations
GET /v1.1/ComplianceViolations

// Get violations by endpoint
GET /v1.1/ComplianceViolations?EndpointId={guid}
```

**Response Example:**
```json
{
  "Data": [
    {
      "Id": "CVE-2024-1234",
      "EndpointId": "{0FB6B08E-9F32-41E3-938F-0B74870BECC2}",
      "Severity": "Critical",
      "CvssScore": 9.8,
      "Title": "Remote Code Execution Vulnerability",
      "AffectedProduct": "Microsoft Windows 10",
      "PublishedDate": "2024-01-15T00:00:00Z"
    }
  ],
  "TotalCount": 1407
}
```

**Key Features:**
- CVE (Common Vulnerabilities and Exposures) tracking
- MDM policy violations
- Industrial compliance violations
- Severity levels: Critical, High, Medium, Low
- CVSS scores for risk assessment

**Limitations:**
- No server-side endpoint filtering (use client-side filtering)
- No pagination (returns all violations)

---

### 10. BitLocker Secrets (Security Critical ⚠️)

**Controller:** `EndpointSecrets`
**Spec Reference:** Page 65
**Operations:** 5 (all read-only)

**Operations:**
```typescript
// Get all secrets for endpoint
GET /v1.1/EndpointSecrets?EndpointId={guid}

// Get BitLocker recovery password for volume (client-side filtering)
GET /v1.1/EndpointSecrets?EndpointId={guid}
// Filter: volumeEntry.VolumeGuid === volumeGuid

// Get TPM owner password for volume (client-side filtering)
GET /v1.1/EndpointSecrets?EndpointId={guid}
// Filter: volumeEntry.VolumeGuid === volumeGuid

// Get BitLocker PIN for endpoint
GET /v1.1/EndpointSecrets?EndpointId={guid}
// Return: secrets.Pin

// Get all volume secrets (client-side filtering)
GET /v1.1/EndpointSecrets?EndpointId={guid}
// Filter: volumeEntry.VolumeGuid === volumeGuid
```

**Response Example:**
```json
{
  "EndpointId": "{0FB6B08E-9F32-41E3-938F-0B74870BECC2}",
  "Pin": "1234",
  "VolumeSecretEntries": [
    {
      "VolumeGuid": "{volume-guid-1}",
      "RecoveryPassword": "123456-234567-345678-456789-567890-678901-789012-890123",
      "TpmOwnerAuth": "base64encodedstring=="
    }
  ]
}
```

**⚠️ CRITICAL SECURITY WARNINGS:**

1. **BitLocker Recovery Passwords**: Allow decryption of BitLocker-protected volumes - Full access to encrypted data
2. **TPM Owner Passwords**: Provide administrative access to Trusted Platform Module chip - Hardware-level security control
3. **BitLocker PINs**: Used for pre-boot authentication - System access control
4. **Access Control**: All access MUST be audited and restricted to authorized security administrators only
5. **No Caching**: Secrets must NEVER be cached or stored in plaintext
6. **Audit Logging**: Every access should be logged with user identity, timestamp, and purpose
7. **Compliance**: May be subject to regulatory requirements (GDPR, HIPAA, SOC2, etc.)

**Implementation Notes:**
- Response is **NOT wrapped** in `Data` property
- Volume-specific operations require **client-side filtering** from full endpoint secrets
- GUID matching is **case-insensitive** for reliability
- Returns `null` for non-existent volumes (not HTTP 404)

---

### 11. Hardware Profiles

**Controller:** `HardwareProfiles`
**Spec Reference:** Page 40
**Operations:** 2 (read-only)

**Operations:**
```typescript
// Get all hardware profiles
GET /v1.1/HardwareProfiles

// Get specific hardware profile
GET /v1.1/HardwareProfiles?ID={guid}
```

**Response Example:**
```json
{
  "Data": [
    {
      "Id": "{12345678-1234-1234-1234-123456789012}",
      "Name": "Standard Workstation",
      "Manufacturer": "Dell Inc.",
      "Model": "OptiPlex 7090",
      "CpuSpeed": 3400,
      "Memory": 16384,
      "DiskSize": 512000
    }
  ],
  "TotalCount": 1
}
```

**Use Cases:**
- Hardware inventory reporting
- Standardization compliance
- Asset management integration

---

### 12. Boot Environment

**Controller:** `BootEnvironment`
**Spec Reference:** Page 41
**Operations:** 2 (read-only)

**Operations:**
```typescript
// Get all boot environments
GET /v1.1/BootEnvironment

// Get specific boot environment
GET /v1.1/BootEnvironment?ID={guid}
```

**Response Example:**
```json
{
  "Data": [
    {
      "Id": "{boot-env-guid}",
      "Name": "Windows 11 Professional",
      "Bootpath": "\\Boot\\Images\\Win11Pro.wim",
      "Comment": "Standard Windows 11 deployment",
      "ShowInBootMenu": true,
      "ReinstallSystem": false,
      "Architecture": "x64",
      "Type": "WIM"
    }
  ],
  "TotalCount": 1
}
```

**Use Cases:**
- PXE boot menu management
- OS deployment automation
- Boot environment inventory

---

### 13. Inventory Data - File Scans

**Controller:** `InventoryDataFileScans`
**Spec Reference:** Page 51
**Operations:** 3 (2 read + 1 delete)

**Operations:**
```typescript
// Get all file scan data
GET /v1.1/InventoryDataFileScans

// Get file scan data by endpoint
GET /v1.1/InventoryDataFileScans?EndpointID={guid}

// Delete file scan data by endpoint
DELETE /v1.1/InventoryDataFileScans?EndpointID={guid}
```

**Response Example:**
```json
{
  "Data": [
    {
      "EndpointId": "{endpoint-guid}",
      "TemplateName": "Software License Files",
      "ScanTime": "2026-01-22T08:30:00Z",
      "Files": [
        {
          "Path": "C:\\Program Files\\App\\license.dat",
          "Size": 4096,
          "Modified": "2025-12-01T10:00:00Z"
        }
      ]
    }
  ],
  "TotalCount": 1
}
```

---

### 14. Inventory Data - WMI Scans

**Controller:** `InventoryDataWMIScans`
**Spec Reference:** Page 52
**Operations:** 6 (all read-only)

**Operations:**
```typescript
// Get all WMI scan data
GET /v1.1/InventoryDataWMIScans

// Get by template name
GET /v1.1/InventoryDataWMIScans?TemplateName={name}

// Get latest by template
GET /v1.1/InventoryDataWMIScans?TemplateName={name}&Scan=Latest

// Get by endpoint
GET /v1.1/InventoryDataWMIScans?EndpointID={guid}

// Get by endpoint and template
GET /v1.1/InventoryDataWMIScans?EndpointID={guid}&TemplateName={name}

// Get by all parameters
GET /v1.1/InventoryDataWMIScans?EndpointID={guid}&TemplateName={name}&Scan={time}
```

**Response Example:**
```json
{
  "Data": [
    {
      "EndpointId": "{endpoint-guid}",
      "TemplateName": "Network Configuration",
      "ScanTime": "2026-01-22T08:30:00Z",
      "WmiData": {
        "Win32_NetworkAdapter": [
          {
            "Name": "Intel(R) Ethernet Connection",
            "MACAddress": "00:11:22:33:44:55",
            "Speed": "1000000000"
          }
        ]
      }
    }
  ],
  "TotalCount": 1
}
```

**Important URL Encoding:**
```typescript
// Template names with spaces MUST be encoded
const templateName = "Network Configuration";
const encoded = encodeURIComponent(templateName);
// GET /v1.1/InventoryDataWMIScans?TemplateName=Network%20Configuration

// Scan times MUST be encoded
const scanTime = "2026-01-22T08:30:00Z";
const encodedTime = encodeURIComponent(scanTime);
// GET /v1.1/InventoryDataWMIScans?Scan=2026-01-22T08%3A30%3A00Z

// "Latest" is passed as-is (NOT encoded)
// GET /v1.1/InventoryDataWMIScans?Scan=Latest
```

---

### 15. Inventory Data - Custom Scans

**Controller:** `InventoryDataCustomScans`
**Spec Reference:** Page 53
**Operations:** 6 (all read-only)

**Operations:** Same as WMI Scans (see above)

**Response Example:**
```json
{
  "Data": [
    {
      "EndpointId": "{endpoint-guid}",
      "TemplateName": "Custom Application Check",
      "ScanTime": "2026-01-22T08:30:00Z",
      "CustomData": {
        "ApplicationVersion": "2.5.1",
        "LicenseStatus": "Valid",
        "InstallDate": "2025-06-15"
      }
    }
  ],
  "TotalCount": 1
}
```

---

### 16. Inventory Data - Registry Scans

**Controller:** `InventoryDataRegistryScans`
**Spec Reference:** Page 50
**Operations:** 3 (2 read + 1 delete)

**Operations:**
```typescript
// Get all registry scan data
GET /v1.1/InventoryDataRegistryScans

// Get by endpoint
GET /v1.1/InventoryDataRegistryScans?EndpointID={guid}

// Delete by endpoint
DELETE /v1.1/InventoryDataRegistryScans?EndpointID={guid}
```

**Response Example:**
```json
{
  "Data": [
    {
      "EndpointId": "{endpoint-guid}",
      "TemplateName": "Software Inventory",
      "ScanTime": "2026-01-22T08:30:00Z",
      "RegistryEntries": [
        {
          "Key": "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion",
          "Value": "ProgramFilesDir",
          "Data": "C:\\Program Files"
        }
      ]
    }
  ],
  "TotalCount": 1
}
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning | Example Scenario |
|------|---------|------------------|
| 200 | Success | Valid request returned data |
| 400 | Bad Request | Unknown parameter, invalid GUID format |
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource with specified ID doesn't exist |
| 500 | Internal Server Error | API bug or server issue |

### Error Response Format

```json
{
  "Message": "Invalid request. Unexpected parameters: PageSize=50",
  "StatusCode": 400,
  "StackTrace": "..." // Only in development mode
}
```

### Common Error Scenarios

**1. Unknown Parameters (HTTP 400)**
```http
GET /v1.1/HardwareProfiles?PageSize=50&Page=0
```
```json
{
  "Message": "Invalid request. Unexpected parameters: PageSize=50&Page=0",
  "StatusCode": 400
}
```

**2. Invalid GUID Format (HTTP 400)**
```http
GET /v1.1/HardwareProfiles?ID=invalid-guid
```
```json
{
  "Message": "Invalid GUID format",
  "StatusCode": 400
}
```

**3. Resource Not Found (HTTP 404)**
```http
GET /v1.1/ComplianceViolations/CVE-9999-99999
```
```json
{
  "Message": "The requested resource was not found",
  "StatusCode": 404
}
```

**4. Route Not Available (HTTP 400)**
```http
GET /v1.1/orgunits/{id}/children
```
```json
{
  "Message": "Route data could not be determined",
  "StatusCode": 400
}
```

### Error Handling Best Practices

```typescript
try {
  const response = await apiRequest.call(this, 'GET', '/v1.1/ComplianceViolations');
  return this.helpers.returnJsonArray(response.Data || response);
} catch (error: any) {
  // V1.1 specific error handling
  if (error.statusCode === 400) {
    // Bad request - likely parameter issue
    throw new NodeOperationError(
      this.getNode(),
      `Invalid V1.1 API request: ${error.message}. Check parameter names (case-sensitive).`
    );
  }

  if (error.statusCode === 404) {
    // Not found - return empty array instead of error for flexibility
    return this.helpers.returnJsonArray([]);
  }

  // Re-throw other errors
  throw error;
}
```

---

## Common Pitfalls

### 1. Using Pagination Parameters

**❌ WRONG:**
```typescript
const qs = {
  PageSize: 50,
  Page: 0
};
const response = await apiRequest.call(this, 'GET', '/v1.1/ComplianceViolations', {}, qs);
// ERROR: HTTP 400 - Unexpected parameters
```

**✅ CORRECT:**
```typescript
// V1.1 doesn't support pagination - fetch all at once
const response = await apiRequest.call(this, 'GET', '/v1.1/ComplianceViolations');
const data = response.Data || response;
return this.helpers.returnJsonArray(Array.isArray(data) ? data : [data]);
```

---

### 2. Wrong Property Name Casing

**❌ WRONG:**
```typescript
const filtered = allViolations.filter(v => v.endpointId === targetEndpointId);
// Won't match - V1.1 uses PascalCase "EndpointId"
```

**✅ CORRECT:**
```typescript
const filtered = allViolations.filter(v =>
  v.EndpointId && // PascalCase!
  v.EndpointId.toLowerCase() === targetEndpointId.toLowerCase()
);
```

---

### 3. Forgetting URL Encoding

**❌ WRONG:**
```typescript
const url = `/v1.1/InventoryDataWMIScans?TemplateName=${templateName}`;
// Spaces and special characters will break the URL
```

**✅ CORRECT:**
```typescript
const url = `/v1.1/InventoryDataWMIScans?TemplateName=${encodeURIComponent(templateName)}`;
```

---

### 4. Using RESTful Path Parameters

**❌ WRONG:**
```typescript
const url = `/v1.1/HardwareProfiles/${hardwareProfileId}`;
// V1.1 doesn't use RESTful paths
```

**✅ CORRECT:**
```typescript
const url = `/v1.1/HardwareProfiles?ID=${hardwareProfileId}`;
```

---

### 5. Assuming V2.0 Response Structure

**❌ WRONG:**
```typescript
const data = response.data; // V2.0 uses lowercase "data"
```

**✅ CORRECT:**
```typescript
const data = response.Data || response; // V1.1 uses PascalCase "Data"
```

---

### 6. Not Handling Missing Routes

**❌ WRONG:**
```typescript
// Assuming all V2.0 routes exist in V1.1
const response = await apiRequest.call(this, 'GET', `/v1.1/orgunits/${id}/children`);
// ERROR: Route data could not be determined
```

**✅ CORRECT:**
```typescript
// Check V1.1 spec documentation first
// Some V2.0 routes don't exist in V1.1
// Implement workarounds or client-side solutions
```

---

## Security Considerations

### BitLocker Secrets - Special Handling Required

**Access Control:**
- Restrict access to security administrators only
- Implement role-based access control (RBAC)
- Use baramundi security groups to limit access

**Audit Logging:**
```typescript
// Log every access to BitLocker secrets
console.warn(`⚠️ SECURITY AUDIT: BitLocker secret accessed`);
console.warn(`   User: ${context.user}`);
console.warn(`   Endpoint: ${endpointId}`);
console.warn(`   Operation: ${operation}`);
console.warn(`   Timestamp: ${new Date().toISOString()}`);
```

**Never Cache Secrets:**
```typescript
// ❌ WRONG - Never cache secrets
const cachedSecrets = {}; // Don't do this!

// ✅ CORRECT - Fetch fresh every time
const secrets = await getEndpointSecrets.call(this, endpointId);
```

**Secure Transmission:**
- Always use HTTPS (enforce SSL)
- Never log secrets in plaintext
- Redact secrets in error messages

**Compliance:**
- Document all access in audit logs
- Implement retention policies
- Follow GDPR/HIPAA requirements if applicable

---

## Implementation Patterns

### Pattern 1: Basic Get All

```typescript
export async function getMany(this: IExecuteFunctions): Promise<INodeExecutionData[]> {
  const response = await apiRequest.call(this, 'GET', '/v1.1/ControllerName');
  const data = (response.Data || response) as any[];
  return this.helpers.returnJsonArray(Array.isArray(data) ? data : [data]);
}
```

### Pattern 2: Get by ID

```typescript
export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const resourceId = this.getNodeParameter('resourceId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/v1.1/ControllerName?ID=${resourceId}`);
  const data = response.Data || response;
  return this.helpers.returnJsonArray(data);
}
```

### Pattern 3: Client-Side Filtering

```typescript
export async function getByEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;

  // Fetch all resources
  const response = await apiRequest.call(this, 'GET', '/v1.1/ControllerName');
  const allData = Array.isArray(response.Data) ? response.Data : [response.Data];

  // Filter client-side (case-insensitive)
  const filtered = allData.filter((item: any) =>
    item.EndpointId &&
    typeof item.EndpointId === 'string' &&
    item.EndpointId.toLowerCase() === endpointId.toLowerCase()
  );

  return this.helpers.returnJsonArray(filtered);
}
```

### Pattern 4: URL Encoding for Query Parameters

```typescript
export async function getByTemplate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const templateName = this.getNodeParameter('templateName', index) as string;

  // URL encode template name
  const encodedTemplate = encodeURIComponent(templateName);
  const url = `/v1.1/InventoryDataWMIScans?TemplateName=${encodedTemplate}`;

  const response = await apiRequest.call(this, 'GET', url);
  const data = response.Data || response;
  return this.helpers.returnJsonArray(Array.isArray(data) ? data : [data]);
}
```

### Pattern 5: Latest Scan

```typescript
export async function getLatest(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const templateName = this.getNodeParameter('templateName', index) as string;

  // "Latest" is NOT URL encoded
  const encodedTemplate = encodeURIComponent(templateName);
  const url = `/v1.1/InventoryDataWMIScans?TemplateName=${encodedTemplate}&Scan=Latest`;

  const response = await apiRequest.call(this, 'GET', url);
  const data = response.Data || response;
  return this.helpers.returnJsonArray(Array.isArray(data) ? data : [data]);
}
```

### Pattern 6: Specific Scan by Timestamp

```typescript
export async function getByTimestamp(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const templateName = this.getNodeParameter('templateName', index) as string;
  const scanTime = this.getNodeParameter('scanTime', index) as string;

  // Both template and timestamp need encoding
  const encodedTemplate = encodeURIComponent(templateName);
  const encodedTime = encodeURIComponent(scanTime);
  const url = `/v1.1/InventoryDataWMIScans?TemplateName=${encodedTemplate}&Scan=${encodedTime}`;

  const response = await apiRequest.call(this, 'GET', url);
  const data = response.Data || response;
  return this.helpers.returnJsonArray(Array.isArray(data) ? data : [data]);
}
```

### Pattern 7: DELETE Operation

```typescript
export async function deleteByEndpoint(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const endpointId = this.getNodeParameter('endpointId', index) as string;

  const response = await apiRequest.call(
    this,
    'DELETE',
    `/v1.1/InventoryDataFileScans?EndpointID=${endpointId}`
  );

  return this.helpers.returnJsonArray({ success: true, endpointId });
}
```

---

## Data Objects Reference (V1.1 Spec Pages 101-151)

### Core Endpoint Data Objects

#### 7.8.3 StorageVolumes

Properties for storage volume information:

```json
{
  "DriveLetter": "C:",
  "Label": "System",
  "FileSystem": "NTFS",
  "FileSystemType": 3,
  "ByteSize": 512000000000,
  "ByteSizeRemaining": 200000000000,
  "IsSystemVolume": true,
  "BitLockerVolumeData": { /* see below */ },
  "VolumeID": "{volume-guid}",
  "PartitionType": "GPT"
}
```

**FileSystemType Codes:**
- 0: Unknown
- 1: FAT
- 2: FAT32
- 3: NTFS
- 4: EXFAT
- 5: CSVFS
- 6: ReFS

#### 7.8.4 BitLockerVolumeData

BitLocker encryption status and protection information:

```json
{
  "ConversionStatus": 1,
  "EncryptionPercentage": 100,
  "SuspendCount": 0,
  "BitLockerVersion": 2,
  "ProtectionStatus": 1,
  "LockStatus": 1
}
```

**ConversionStatus Codes:**
- 0: Fully decrypted
- 1: Fully encrypted
- 2: Encryption in progress
- 3: Decryption in progress
- 4: Encryption paused
- 5: Decryption paused
- 6: Unknown

**BitLockerVersion:**
- 0: Unknown
- 1: Vista
- 2: Win7+

**ProtectionStatus:**
- 0: Unprotected
- 1: Protected
- 2: Unknown

**LockStatus:**
- 0: Unknown
- 1: Unlocked
- 2: Locked

#### 7.8.5 Software

Software inventory structure:

```json
{
  "Id": "{software-guid}",
  "Name": "Microsoft Office",
  "Version": "16.0.12345.67890",
  "Package": "com.microsoft.office",
  "Manufacturer": "Microsoft Corporation"
}
```

#### 7.8.6 SNMPDeviceData

SNMP network device information:

```json
{
  "SNMPName": "switch-01",
  "Description": "Cisco Catalyst 3750",
  "VendorId": 9,
  "UpTime": "45.12:34:56.789",
  "PrimaryMAC": "00:1A:2B:3C:4D:5E",
  "LastContact": "2026-01-22T10:30:00Z",
  "Comment": "Main distribution switch",
  "PrimaryIP": "192.168.1.1",
  "DetectionRules": [
    {
      "TypeId": "cisco-switch",
      "Name": "Cisco Switch Detection"
    }
  ]
}
```

#### 7.8.7 IndustrialData

Industrial control device information (Siemens SIMATIC S7):

```json
{
  "GatewayType": "SiemensSimaticS7",
  "Url": "http://192.168.1.100",
  "Port": 102,
  "SnmpConfiguration": { /* see 7.8.9 */ },
  "LastInventory": "2026-01-22T08:00:00Z",
  "ModelType": "CPU 1516-3 PN/DP",
  "IndustrialCPU": "S7-1500",
  "FirmwareVersion": "V2.8.3",
  "HardwareVersion": "1.0",
  "OrderNumber": "6ES7516-3AN02-0AB0",
  "UpTime": 3456789,
  "Contact": "engineering@company.com",
  "Location": "Production Line 1"
}
```

**Access Codes:**
- R: Read only
- C: Can be set on create
- U: Can be updated

**GatewayTypes:** SiemensSimaticS7

#### 7.8.8 MicrosoftDefenderData

Windows Defender antivirus status (comprehensive):

```json
{
  "AntimalwareEngineVersion": "1.1.19700.2",
  "AntimalwareProductVersion": "4.18.2211.5",
  "AntimalwareRunningMode": "Normal",
  "AntimalwareServiceActive": true,
  "AntimalwareServiceVersion": "4.18.2211.5",
  "AntispywareActive": true,
  "AntispywareDefinitionCreation": "2026-01-22T06:00:00Z",
  "AntispywareDefinitionVersion": "1.381.123.0",
  "AntivirusActive": true,
  "AntivirusDefinitionCreation": "2026-01-22T06:00:00Z",
  "AntivirusDefinitionVersion": "1.381.123.0",
  "BehaviorMonitoringActive": true,
  "LastFullScanEndTime": "2026-01-21T22:00:00Z",
  "IoavProtectionActive": true,
  "TamperProtectionActive": true,
  "NetworkInspectionSystemActive": true,
  "NetworkInspectionSystemEngineVersion": "2.1.19700.2",
  "NetworkInspectionSystemDefinitionCreation": "2026-01-22T06:00:00Z",
  "NetworkInspectionSystemDefinitionVersion": "1.381.123.0",
  "OnAccessProtectionActive": true,
  "LastQuickScanEndTime": "2026-01-22T08:00:00Z",
  "RealTimeProtectionActive": true,
  "RealTimeScanDirection": "ScanIncomingAndOutgoingFiles",
  "HighestSeverity": "None",
  "ActiveThreats": 0,
  "ResolvedThreats": 5
}
```

**HighestSeverity Values:**
- None
- Low
- Moderate
- High
- Severe

**RealTimeScanDirection Values:**
- ScanIncomingAndOutgoingFiles
- ScanIncomingFilesOnly
- ScanOutgoingFilesOnly

#### 7.8.9 SnmpConfiguration

SNMP v1/v2c/v3 configuration:

```json
{
  "Version": 3,
  "Community": "public",
  "Username": "snmpuser",
  "Authentication": "SHA",
  "AuthenticationPassword": "***",
  "Encryption": "AES",
  "EncryptionPassword": "***",
  "ContextName": "default",
  "ContextEngineId": "80001f8880"
}
```

**Version Codes:**
- 1: V1
- 2: V2c
- 3: V3

**Authentication Types:**
- NoAuth
- MD5 (96 bit)
- SHA (96 bit)
- SHA256 (196 or 256 bit)

**Encryption Algorithms:**
- NoEncrypt
- DES
- AES
- TDES
- AES192
- AES256

#### 7.8.10 WindowsModernManagementData

Autopilot and Modern Management status:

```json
{
  "IsAutopilotDevice": false,
  "ModernManagementState": "NotManaged"
}
```

**ModernManagementState Values:**
- NotManaged
- Managed
- ManagedAndBaramundiAgentInstalling
- ManagedAndBaramundiAgentInstalled

### Job-Related Objects

#### 7.10 Job

Complete job definition structure (Windows/Mobile/Universal):

```json
{
  "Id": "{job-guid}",
  "ParentId": "{parent-ou-guid}",
  "Name": "Deploy Office 365",
  "DisplayName": "Microsoft Office 365 Deployment",
  "Type": "Windows",
  "Initiator": "Administrator",
  "Category": "Software Deployment",
  "Description": "Deploys Office 365 to workstations",
  "Comments": "Corporate standard deployment",
  "IconId": "{icon-guid}",
  "Destructive": false,
  "JobExecutionTimeout": 3600,
  "AbortOnError": true,
  "RemoveInstanceAfterCompletion": false,
  "Steps": [ /* see 7.10.2 */ ],
  "WindowsProperties": { /* see 7.10.7 */ },
  "MobileAndMacProperties": { /* see 7.10.6 */ },
  "UniversalProperties": { /* see 7.10.15 */ }
}
```

**Job Types:**
- Windows
- Mobile
- Universal

**Access Codes:**
- R: Read only
- C: Create
- C1-C5: Create (platform-specific)
- U: Update
- U1-U5: Update (platform-specific)

#### 7.10.3 Step Types

**Windows Job Steps:**
- CloningBackup, SoftwareDeploy, SoftwareDeployUninstall
- InventoryScan, PatchScan, ManagedSoftwareScan
- PXEBoot, OSInstall, CloningImaging, CloningSysprep
- WipeDisk, PersonalBackup, PersonalRestore
- DesasterBackup, DesasterRestore
- Citrix_AppConfig_ServerConfig, Citrix_Publish, Citrix_Retract, Citrix_ServerInstallation
- ApplyEnergyPolicy, ServerSideAction, ComplianceScan
- VirtualizationControlVM, VirtualizationCreateVMFromProfile
- PatchManagement, Deploy, ManagedSoftware, NetworkScan
- MicrosoftUpdateInventory, UpdateMicrosoftDefenderDefinitions
- RunMicrosoftDefenderScan, MicrosoftUpgradeInstallation

**Mobile and Mac Job Steps:**
- ApplicationExecuteJobStep, ApplicationInstallJobStep, ApplicationUninstallJobStep
- ApplicationConfigureJobStep, ApplicationRemoveConfigurationJobStep
- ExecuteCommandJobStep, HardwareInventoryJobStep, SoftwareInventoryJobStep
- LockJobStep, UnlockJobStep
- ProfileInstallJobStep, ProfileJobStep, ProfileUninstallJobStep
- ServerSideActionJobStep, SSHExecutionJobStep
- OSUpdateJobStep, WaitJobStep, WipeJobStep

**Universal Job Steps:**
- HardwareInventory

#### 7.10.7 WindowsProperties

Windows-specific job configuration (extensive):

```json
{
  "Priority": 50,
  "MaxConcurrentTargets": 10,
  "Unlocksequence": "1234",
  "MinBandwidth": 1000000,
  "CustomTrayInfo": "Installing Office 365...",
  "CustomTrayInfoShutdown": "Installation complete, rebooting...",
  "MandatoryTime": "2026-01-23T00:00:00Z",
  "MaxDelayMinutes": 240,
  "RemindInterval": "OneHour",
  "UserActionType": "CanDelay",
  "KeyMouseLockType": "DetermineAutomatically",
  "PrePostInstallType": "ExecutePreAndPostInstallSteps",
  "JobStartType": "Active",
  "AtEndOfJobAction": "NoAdditionalAction",
  "InfoWindowType": "DetermineAutomatically",
  "AutoAssignment": "<xml>...</xml>",
  "Prerequisites": "<xml>...</xml>",
  "Options": { /* WindowsJobOptions */ },
  "Validity": { /* JobValidity */ },
  "Interval": { /* JobInterval */ },
  "RetryInterval": { /* JobRetryInterval */ }
}
```

**RemindInterval Values:**
- None, FiveMinutes, TenMinutes, FifteenMinutes, ThirtyMinutes
- OneHour, TwoHours, FourHours, Degressive

**UserActionType Values:**
- CanNotInfluence
- CanDelay
- CanDenyOrDelay
- UserConsentRequired

**KeyMouseLockType Values:**
- DetermineAutomatically
- LockAccordingToSoftwareConfiguration
- Lock
- DoNotLock

**PrePostInstallType Values:**
- ExecutePreAndPostInstallSteps
- DoNotExecutePreAndPostInstallSteps
- ExecuteOnlyPreInstallSteps
- ExecuteOnlyPostInstallSteps

**JobStartType Values:**
- Active
- Passive
- ActiveWol
- ActiveOnline
- ActiveShutdown
- ActiveShutdownAndOnline

**AtEndOfJobAction Values:**
- NoAdditionalAction
- ShutdownSystem
- ShutdownSystemIfStartedWithWoL
- RestartSystem

**InfoWindowType Values:**
- DetermineAutomatically
- ShowAlways
- ShowNever
- ShowOnlyWhenBooting

#### 7.10.6 MobileAndMacProperties

Mobile and Mac job configuration:

```json
{
  "ShowInKiosk": true,
  "CanRunOnMobileDevice": true,
  "CanRunOnMac": false,
  "RequriredComplianceLevel": "Compliant",
  "Repetition": 86400,
  "RescheduleOnError": true,
  "AssignOnEndpointCreation": false
}
```

**RequiredComplianceLevel Values:**
- Unknown
- Compliant
- NotCompliant_Info
- NotCompliant_Warning
- NotCompliant_Severe
- ComplianceInactive

**Repetition:** 0 or >= 3600 (1 hour) and < 31449600 (52 weeks)

#### 7.11 JobInstance

Job execution instance (cross-platform):

```json
{
  "Id": "{instance-guid}",
  "EndpointId": "{endpoint-guid}",
  "EndpointName": "WORKSTATION-01",
  "JobDefinitionId": "{job-guid}",
  "JobDefinitionName": "Deploy Office",
  "JobDefinitionDisplayName": "Office 365 Deployment",
  "TimeStart": "2026-01-22T09:00:00Z",
  "TimeNext": "2026-01-22T09:15:00Z",
  "TimeLastAction": "2026-01-22T09:10:00Z",
  "Executed": 1,
  "Retried": 0,
  "HasDenied": 0,
  "State": 5,
  "StateText": "Running",
  "Properties": [{"Key": "...", "Value": "..."}],
  "Created": "2026-01-22T08:00:00Z",
  "ExecutionCountError": 0,
  "ExecutionCountSuccess": 0,
  "ExecutionDate": "2026-01-22T09:00:00Z",
  "Initiator": "Administrator",
  "BmsNetState": 1,
  "EndpointCategory": 1,
  "Steps": [ /* see 7.11.1, 7.11.2 */ ],
  "JobDefinition": { /* Job object */ }
}
```

**EndpointCategory Codes:**
- -1: Any
- 0: Unknown
- 1: MicrosoftWindows
- 2: GoogleAndroid
- 3: AppleIOS
- 4: AppleMac
- 6: Network
- 7: Industrial

**BmsNetState Codes (recommended over deprecated State):**
- -1: Unknown
- 0: Assigned
- 1: Running
- 2: FinishedSuccess
- 3: FinishedError
- 4: FinishedCanceled
- 5: ReScheduled
- 6: ReScheduledError
- 7: WaitingForUser
- 8: RequirementsNotMet
- 9: Downloading
- 10: SkippedDueToIncompatibility
- 11: NonBlockingWaitingForUser

### Inventory Objects

#### 7.18 Inventory

Cross-platform inventory container:

```json
{
  "EndpointId": "{endpoint-guid}",
  "Scans": [
    {
      "Time": "2026-01-22T08:00:00Z",
      "Template": "Hardware Inventory",
      "Data": [ /* DataRegistry, DataFile, DataWMI, DataCustom, DataHardware */ ]
    }
  ]
}
```

#### 7.18.2 DataRegistry

Registry scan data:

```json
{
  "Name": "Office Version",
  "Version": "16.0.12345",
  "Company": "Microsoft Corporation",
  "ProductName": "Microsoft Office 365"
}
```

#### 7.18.3 DataFile

File scan data:

```json
{
  "Name": "WINWORD.EXE",
  "Path": "C:\\Program Files\\Microsoft Office\\root\\Office16",
  "Size": 25600000,
  "LastWriteTime": "2025-12-15T10:00:00Z",
  "Version": "16.0.12345.67890",
  "Company": "Microsoft Corporation",
  "ProductName": "Microsoft Word",
  "ProductVersion": "16.0.12345.67890",
  "OriginalName": "WinWord.exe",
  "Description": "Microsoft Word"
}
```

#### 7.18.4 DataWMI

WMI scan data (hierarchical):

```json
{
  "ClassName": "Win32_NetworkAdapter",
  "Items": [
    {
      "Child": null,
      "Properties": [
        {"Name": "Name", "Value": "Intel(R) Ethernet Connection"},
        {"Name": "MACAddress", "Value": "00:11:22:33:44:55"},
        {"Name": "Speed", "Value": "1000000000"}
      ]
    }
  ]
}
```

#### 7.18.5 DataCustom

Custom inventory scan data (recursive):

```json
{
  "Name": "Application Configuration",
  "Properties": [
    {"Name": "LicenseStatus", "Value": "Valid"},
    {"Name": "Version", "Value": "2.5.1"}
  ],
  "SubNodes": [
    {
      "Name": "Features",
      "Properties": [
        {"Name": "AdvancedReporting", "Value": "Enabled"}
      ],
      "SubNodes": []
    }
  ]
}
```

#### 7.18.6 DataHardware

Hardware inventory scan data (recursive):

```json
{
  "Name": "System",
  "Properties": [
    {"Name": "Manufacturer", "Value": "Dell Inc."},
    {"Name": "Model", "Value": "OptiPlex 7090"},
    {"Name": "SerialNumber", "Value": "ABC123XYZ"}
  ],
  "SubNodes": [
    {
      "Name": "Processor",
      "Properties": [
        {"Name": "Name", "Value": "Intel Core i7-10700"},
        {"Name": "Cores", "Value": "8"},
        {"Name": "Speed", "Value": "2900"}
      ],
      "SubNodes": []
    }
  ]
}
```

#### 7.18.7 DataSnmp

SNMP scan data:

```json
{
  "Name": "sysDescr",
  "ObjectId": "1.3.6.1.2.1.1.1.0",
  "PropertyId": "sysDescr",
  "Found": true,
  "Value": "Cisco IOS Software, Version 15.2(4)E5"
}
```

### Application Management Objects

#### 7.17 Application

Windows application definition (extensive):

```json
{
  "Id": "{app-guid}",
  "Name": "Microsoft Office 365",
  "Comment": "Corporate standard office suite",
  "ParentId": "{ou-guid}",
  "Version": "16.0.12345",
  "Vendor": "Microsoft Corporation",
  "Category": "Productivity",
  "ValidForOS": ["Windows10_x64", "Windows11_x64"],
  "EnableAUT": true,
  "Installation": { /* InstallationData */ },
  "Uninstallation": { /* UninstallationData */ },
  "ConsistencyChecks": "<xml>...</xml>",
  "Files": [
    {
      "Source": "\\\\fileserver\\software\\Office365\\setup.exe",
      "Type": "File"
    }
  ],
  "Cost": 99.99,
  "SecurityContext": "LocalSystem",
  "Licenses": [
    {
      "Count": 500,
      "LicenseKey": "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
      "Offline": 450,
      "Online": 50
    }
  ],
  "MSW": false,
  "AUT": [ /* AUTFileRule */ ],
  "SoftwareDependencies": [ /* SoftwareDependency */ ],
  "SoftwareLicenseActions": [ /* SoftwareLicenseAction */ ],
  "Parameters": [ /* Parameter */ ],
  "Hashes": [ /* ApplicationHash */ ]
}
```

**ValidForOS Values (Windows):**
- NT4, Windows2000, WindowsXP, WindowsServer2003
- WindowsVista, WindowsServer2008, Windows7, WindowsServer2008R2
- Windows8, WindowsServer2012_x64
- Windows10, Windows10_x64, WindowsServer2016_x64, WindowsServer2019_x64
- Windows11_x64, WindowsServer2022_x64
- (Plus _x64 variants for older OSes)

**SecurityContext Values:**
- AnyUser
- InstallUser
- LocalInstallUser
- LocalSystem
- LoggedOnUser
- RegisteredUser
- SpecifiedUser

**File Types:**
- FolderWithSubFolders
- SingleFolder
- File

#### 7.17.9 ApplicationHash

Application file integrity (Managed Software):

```json
{
  "FilePath": "setup.exe",
  "Sha256Hash": "a1b2c3d4e5f6...",
  "IgnoreHashing": false,
  "LastChangeBy": 1,
  "LastChangeByUser": "Administrator",
  "LastChanged": "2026-01-15T10:00:00Z"
}
```

**LastChangeBy Codes:**
- 0: File Importer
- 1: User
- 2: Copy

### VPP (Volume Purchase Program) Objects

#### 7.31 VPPUser

Apple VPP user management:

```json
{
  "Id": "{vpp-user-guid}",
  "Email": "user@company.com",
  "ManagedAppleId": "user@company.appleid.com",
  "ItunesStoreHash": "abc123def456",
  "InviteUrl": "https://buy.itunes.apple.com/...",
  "Status": "Associated",
  "UserId": "apple-user-id-12345",
  "IsManagedAppleId": true,
  "ADObjectId": "{ad-user-guid}",
  "EmailLanguageId": "en-US"
}
```

**Status Values:**
- Registered
- Associated
- Retired
- Deleted

**Default EmailLanguageId:** "de-DE" or "en-US"

#### 7.32 VPPLicenseAssociation

VPP license assignment:

```json
{
  "Id": "{license-association-guid}",
  "ClientUserIdStr": "{vpp-user-guid}",
  "LicenseIdStr": "{license-guid}",
  "BmsNetEndpoint": "{endpoint-guid}",
  "SerialNumber": "C02XYZ123ABC",
  "AdamId": "409203825",
  "ShouldBeDisassociated": false,
  "BundleId": "com.microsoft.office.word"
}
```

### Microsoft Update Management

#### 7.33 MicrosoftUpdateInventories

Update inventory container:

```json
{
  "Endpoints": [
    {
      "EndpointID": "{endpoint-guid}",
      "UpdateInformation": [ /* MicrosoftUpdateInventoryInformation */ ]
    }
  ]
}
```

#### 7.35 MicrosoftUpdateInventoryInformation

Detailed update information:

```json
{
  "IsInstalled": false,
  "UpdateId": "12345678-90ab-cdef-1234-567890abcdef",
  "RevisionNumber": "202",
  "Classification": "SecurityUpdates",
  "Products": ["Windows 10", "Windows 11"],
  "Title": "2026-01 Cumulative Update for Windows 10",
  "Type": "Software",
  "SupportURL": "https://support.microsoft.com/kb/5012345",
  "InstallationDeadline": "2026-02-01T00:00:00Z",
  "LastDeploymentChangeTime": "2026-01-15T10:00:00Z",
  "MsrcSeverity": "Critical",
  "KBArticleIDs": ["KB5012345"],
  "MoreInfoUrls": ["https://support.microsoft.com/help/5012345"],
  "SecurityBulletinIDs": ["MS26-001"],
  "CveIDs": ["CVE-2026-0001", "CVE-2026-0002"],
  "Description": "This update includes quality improvements..."
}
```

**Type Values:**
- Software
- Driver

**MsrcSeverity Values:**
- Low
- Medium
- High
- Critical
- (null when not set)

#### 7.38 MicrosoftUpdateProfile

Update deployment profile:

```json
{
  "Id": "{profile-guid}",
  "Name": "Standard Workstation Profile",
  "Comment": "30-day deferral for testing",
  "UpdateDeferralPeriodInDays": 30,
  "BlockedUpdates": ["update-id-1", "update-id-2"],
  "BlockedClassifications": ["Upgrades"],
  "BlockedProducts": ["Windows 10 LTSB"]
}
```

**UpdateDeferralPeriodInDays:** Range [0, 30], Default: 0
**Default BlockedClassifications:** ["Upgrades"] if not specified

#### 7.39 MicrosoftUpdateManagementSetting

Global update settings:

```json
{
  "Key": "InventoryValidityPeriod",
  "Value": "7"
}
```

**Available Keys:**
- InventoryValidityPeriod
- MissingUpdateTolerancePeriod
- DefaultUpdateProfileId

### Compliance and Security

#### 7.36 ComplianceViolation

Security and policy violations:

```json
{
  "CveId": "CVE-2026-0001",
  "MdmComplianceRuleId": "{rule-guid}",
  "EndpointId": "{endpoint-guid}",
  "Endpoint": "WORKSTATION-01",
  "Name": "Missing Security Update",
  "Products": "Windows 10",
  "CvssScore": 9.8,
  "Severity": "Critical",
  "Description": "Critical vulnerability in Windows kernel...",
  "ComplianceType": "Windows",
  "State": "Active",
  "MdmRuleType": "Unknown"
}
```

**Severity Values:**
- Unknown
- None
- Low
- Medium
- High
- Critical

**ComplianceType Values:**
- Windows
- Mobile Devices & macOS
- Industrial

**State Values:**
- Unknown
- Active
- Ignored
- Conditional Ignored
- Resolved

**MdmRuleType Values (Mobile/macOS):**
- Unknown, Jailbreak, Blacklisted App, Whitelisted App
- Missing App, Outdated Info, Operating System
- Geo Fence, Invalid App Version

#### 7.37 VulnerabilityExclusion

CVE exclusion management:

```json
{
  "CveName": "CVE-2026-0001",
  "CveId": "CVE-2026-0001",
  "OriginName": "WORKSTATION-01",
  "OriginId": "{endpoint-guid}",
  "Initiator": "SecurityAdmin",
  "Added": "2026-01-22T10:00:00Z",
  "Reason": "Mitigated by network segmentation",
  "Status": "Exclusion"
}
```

**Status Values:**
- Exclusion
- Revoked exclusion

#### 7.40 MicrosoftDefenderThreat

Detected threat information (comprehensive):

```json
{
  "Id": "{threat-guid}",
  "Name": "Trojan:Win32/Phonzy.A",
  "IsActive": false,
  "Severity": "Severe",
  "Category": "Trojan",
  "ThreatType": "KnownBad",
  "DomainUser": "COMPANY\\user",
  "ProcessName": "malicious.exe",
  "FileNames": "C:\\Temp\\malicious.exe\nC:\\Users\\user\\Downloads\\malware.dll",
  "ActionSuccess": true,
  "ExecutionStatus": "NotExecuting",
  "ThreatStatus": "Quarantined",
  "DetectionSource": "RealTime",
  "CleaningAction": "Quarantine",
  "AdditionalActions": 0,
  "DetectionTime": "2026-01-22T09:00:00Z",
  "RemediationTime": "2026-01-22T09:01:00Z",
  "LastStatusChangedTime": "2026-01-22T09:01:00Z",
  "EndpointId": "{endpoint-guid}",
  "EndpointName": "WORKSTATION-01"
}
```

**Severity Values:**
- UnknownSeverity, Low, Moderate, High, Severe

**Category Values:** (50+ categories including)
- Invalid, Adware, Spyware, PasswordStealer, TrojanDownloader
- Worm, Backdoor, RemoteAccessTrojan, Trojan, Virus
- Exploit, Tool, Behavior, Vulnerabilty, Policy
- (Full list in spec pages 146-148)

**ThreatType Values:**
- KnownBad, BehaviorType, UnknownType, KnownGood, NriType

**ExecutionStatus Values:**
- UnknownExecutionStatus, BlockedExecutionStatus
- AllowedExecutionStatus, Executing, NotExecuting

**ThreatStatus Values:**
- UnknownStatus, Detected, Cleaned, Quarantined, Removed
- Allowed, Blocked, CleanFailed, QuarantineFailed
- RemoveFailed, AllowFailed, Abandoned, BlockedFailed

**DetectionSource Values:**
- UnknownDetectionSourceType, User, System, RealTime
- Ioav, Nri, IeProtect, Elam
- LocalAttestation, RemoteAttestation

**CleaningAction Values:**
- UnknownCleaningAction, Clean, Quarantine, Remove
- Allow, Userdefined, Noaction, Block

**AdditionalActions Bit Flags:**
- 0x00000000: None
- 0x00000002: Full scan required
- 0x00000008: Reboot required
- 0x00000010: Manual steps required
- 0x00008000: Offline scan required

### Network and Infrastructure

#### 7.42 IpNetwork

IP network configuration:

```json
{
  "ID": "{network-guid}",
  "Name": "Headquarters LAN",
  "Dips": "192.168.1.0/24",
  "WolRelay": "192.168.1.1",
  "BandwidthMode": 2,
  "MaxBandwidthKbits": 10000,
  "DuplicateWolToThisNetwork": true,
  "Scopes": [
    {
      "NetworkAddress": "192.168.1.0",
      "SubnetMask": "255.255.255.0"
    }
  ],
  "VLSM": true
}
```

**BandwidthMode Values:**
- 0: AllowAll
- 1: BlockAll
- 2: UseBandwidth

#### 7.46 EndpointSSHInfo

SSH server information (Linux/Unix):

```json
{
  "EndpointId": "{endpoint-guid}",
  "Port": 22,
  "SshVersion": "OpenSSH_8.2p1 Ubuntu-4ubuntu0.5",
  "DiscoveredOn": "2026-01-15T10:00:00Z",
  "HostKeys": [
    {
      "KeyType": "ssh-rsa",
      "KeyData": "AAAAB3NzaC1yc2EAAAADAQABAAAB..."
    }
  ]
}
```

**Port:** Range [1-65535] or null

#### 7.44 PinnedBmaSetupFilesInformation

Setup file integrity verification:

```json
{
  "PinnedBmaSetupFiles": [
    {
      "RelativeFilePath": "setup\\baramundi-agent.msi",
      "Hash": "a1b2c3d4e5f6789..."
    }
  ]
}
```

**Hash:** SHA-256 checksum (lowercase hexadecimal)

### Additional Objects

#### 7.9 NewEndpoint

New endpoint creation response:

```json
{
  "EnrollmentToken": "abc123def456...",
  "TokenValidUntil": "2026-01-29T10:00:00Z",
  "Endpoint": { /* Endpoint object */ }
}
```

**Note:** EnrollmentToken and TokenValidUntil are null for WindowsEndpoints

#### 7.25 Image

Binary image data:

```json
{
  "Id": "B227BAACC41C9D51BD03B823E785A084",
  "MimeType": "image/png",
  "Data": "iVBORw0KGgoAAAANSUhEUg..."
}
```

#### 7.26 VariableDefinition

Custom variable definition:

```json
{
  "Id": "{variable-guid}",
  "Scope": "Device",
  "Category": "Custom",
  "Name": "DeploymentGroup",
  "Type": "String",
  "Value": "Pilot",
  "Comments": "For phased deployments"
}
```

**Type Values:**
- Unknown, Number, String, Date
- Checkbox, Dropdownbox, DropdownListbox
- Filelink, Folder, Password, Certificate

**Scope Values:**
- Device (WindowsEndpoint + MacEndpoint)
- MobileDevice (DEPRECATED, use AndroidDevice/IOSDevice)
- Job (WindowsJob)
- OrgUnit (Logical Groups only)
- Software (Windows applications)
- Hardwareprofile, AdObject, Bulletin, Component
- ICDevice, NetworkDevice, AndroidDevice, IOSDevice

#### 7.41 ModernEnrollmentActivationResult

Native enrollment activation response:

```json
{
  "EndpointId": "{endpoint-guid}",
  "EnrollmentUrl": "https://bms-server/enroll/abc123",
  "EnrollmentTokenValidUntilUTC": "2026-01-29T10:00:00Z",
  "ErrorSendingEmail": false,
  "ErrorDetail": null
}
```

**Note:** ErrorSendingEmail and ErrorDetail only present when applicable

---

## Testing Strategy

### Unit Tests (Mocked API)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as controller from './controller.execute';

describe('V1.1 Controller Tests', () => {
  it('should get all resources with PascalCase properties', async () => {
    const mockContext = createMockExecuteFunctions({
      Data: [
        { Id: '1', Name: 'Test', EndpointId: '{guid}' }, // PascalCase!
      ],
      TotalCount: 1,
    });

    const result = await controller.getMany.call(mockContext);

    expect(result).toHaveLength(1);
    expect(result[0].json).toHaveProperty('Id'); // Not 'id'!
  });
});
```

### System Tests (Live API)

```typescript
describe('V1.1 System Tests', () => {
  it('should reject pagination parameters', async () => {
    const context = createSystemTestContext({}, config);

    try {
      // This should fail with HTTP 400
      await apiRequest.call(context, 'GET', '/v1.1/ComplianceViolations', {}, {
        PageSize: 50,
        Page: 0,
      });

      expect.fail('Should have thrown error for pagination');
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('Unexpected parameters');
    }
  });

  it('should handle case-insensitive GUID matching', async () => {
    const endpointId = '{0FB6B08E-9F32-41E3-938F-0B74870BECC2}';
    const lowerCaseId = endpointId.toLowerCase();

    const result1 = await getByEndpoint.call(context, endpointId);
    const result2 = await getByEndpoint.call(context, lowerCaseId);

    // Both should return same results
    expect(result1).toEqual(result2);
  });
});
```

---

## TDD Methodology for V1.1

### Red Phase: Write Failing Test

```typescript
it('should get hardware profile by ID using query parameter', async () => {
  const mockContext = createMockExecuteFunctions({
    Data: { Id: '{test-id}', Name: 'Test Profile' },
  });

  const result = await hardwareProfiles.get.call(mockContext, 0);

  expect(result).toHaveLength(1);
  expect(result[0].json.Id).toBe('{test-id}');
});
```

### Green Phase: Implement to Pass

```typescript
export async function get(this: IExecuteFunctions, index: number) {
  const profileId = this.getNodeParameter('profileId', index) as string;
  const response = await apiRequest.call(this, 'GET', `/v1.1/HardwareProfiles?ID=${profileId}`);
  return this.helpers.returnJsonArray(response.Data || response);
}
```

### Refactor Phase: Validate with Live API

```typescript
it('should work with real API', async () => {
  const context = createSystemTestContext({ profileId: '{real-guid}' }, config);
  const result = await hardwareProfiles.get.call(context, 0);

  expect(result).toBeDefined();
  expect(result[0].json).toHaveProperty('Id');
  expect(result[0].json).toHaveProperty('Name');
  expect(result[0].json).toHaveProperty('Manufacturer');
});
```

---

## Summary

### When to Use V1.1

Use V1.1 **only** when the feature is not available in V2.0:
- ✅ BitLocker secrets management
- ✅ CVE compliance violations
- ✅ Detailed inventory scans (file, WMI, custom, registry)
- ✅ Hardware profiles (if not in V2.0)
- ✅ Boot environments (if not in V2.0)

### When to Use V2.0

Use V2.0 for **everything else**:
- ✅ Endpoint management
- ✅ Job execution
- ✅ Asset tracking
- ✅ Active Directory queries
- ✅ Server management
- ✅ Variables
- ✅ Pagination and filtering needed

### Key Takeaways

1. **No Pagination** - V1.1 returns all results in one response
2. **PascalCase** - All properties use PascalCase (not camelCase)
3. **Query Parameters** - IDs passed as `?ID={guid}` (not path parameters)
4. **Strict Validation** - Unknown parameters cause HTTP 400 errors
5. **URL Encoding** - Always encode template names and timestamps
6. **Case-Insensitive GUIDs** - Implement case-insensitive matching for reliability
7. **Client-Side Filtering** - Many operations require client-side filtering
8. **Security Critical** - BitLocker secrets require special security handling

---

**End of Document**
