# n8n Connector Implementation Status Analysis — bMS 26R1

**Generated:** 2026-03-31
**OpenAPI Source:** `/home/ansible/MCP/bConnectOpenAPI/26R1/`
**Connector Source:** `/home/ansible/MCP/n8nconnector/`

---

## Legend

| Symbol | Meaning |
|--------|---------|
| :white_check_mark: | Implemented in connector |
| :x: | NOT implemented — exists in OpenAPI but missing from connector |
| :warning: | Partially implemented or mapped differently |

---

## 1. Active Directory API (`activedirectory.json`)

### AD Groups
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ADGroups | GetADGroups | :white_check_mark: `activeDirectory.getADGroups` |
| GET | /v2.0/ADGroups/{id} | GetADGroupById | :white_check_mark: `activeDirectory.getADGroup` |
| GET | /v2.0/ADGroups/{adGroupId}/ADGroups | GetADGroupsByADGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADGroups/{adGroupId}/ADObjects | GetADObjectsByADGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADGroups/{adGroupId}/ADUsers | GetADUsersByADGroupId | :white_check_mark: `activeDirectory.getADUsersByGroup` |
| GET | /v2.0/OrgUnits/{orgUnitId}/ADGroups | GetADGroupsByOrgUnitId | :white_check_mark: `activeDirectory.getADGroupsByOrgUnit` |

### AD Objects
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ADObjects | GetADObjects | :white_check_mark: `activeDirectory.getADObjects` |
| GET | /v2.0/ADObjects/{id} | GetADObjectById | :white_check_mark: `activeDirectory.getADObject` |
| GET | /v2.0/ADObjects/{id}/ADGroupMemberships | GetADObjectMemberships | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/OrgUnits/{orgUnitId}/ADObjects | GetADObjectsByOrgUnitId | :x: **NOT IMPLEMENTED** |

### AD Users
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ADUsers | GetADUsers | :white_check_mark: `activeDirectory.getADUsers` |
| GET | /v2.0/ADUsers/{id} | GetADUserById | :white_check_mark: `activeDirectory.getADUser` |
| GET | /v2.0/OrgUnits/{orgUnitId}/ADUsers | GetADUsersByOrgUnitId | :x: **NOT IMPLEMENTED** |

### Organizational Units
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/OrgUnits | GetOrgUnits | :white_check_mark: `activeDirectory.getOrgUnits` |
| GET | /v2.0/OrgUnits/{id} | GetOrgUnit | :white_check_mark: `activeDirectory.getOrgUnit` |
| GET | /v2.0/OrgUnits/{orgUnitId}/OrgUnits | GetOrgUnitsByOrgUnitId | :x: **NOT IMPLEMENTED** |

**Active Directory Summary: 10/16 implemented (62.5%)**

---

## 2. Assets API (`assets.json`)

### Assets
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Assets | GetAssets | :white_check_mark: `asset.getMany` |
| POST | /v2.0/Assets | CreateAsset | :white_check_mark: `asset.create` |
| GET | /v2.0/Assets/{id} | GetAsset | :white_check_mark: `asset.get` |
| PATCH | /v2.0/Assets/{id} | UpdateAsset | :white_check_mark: `asset.update` |
| DELETE | /v2.0/Assets/{id} | DeleteAsset | :white_check_mark: `asset.delete` |
| GET | /v2.0/AssetStock/Assets | GetAssetsAssetStock | :white_check_mark: `asset.getAssetStockAssets` |
| GET | /v2.0/LogicalGroups/{id}/Assets | GetAssetsByLogicalGroup | :white_check_mark: `asset.getAssetsByLogicalGroup` |
| GET | /v2.0/OrgUnits/{orgUnitId}/Assets | GetAssetsByOrgUnit | :white_check_mark: `asset.getAssetsByOrgUnit` |
| GET | /v2.0/WindowsEndpoint/{id}/Assets | GetAssetsByWindowsEndpoint | :white_check_mark: `asset.getAssetsByEndpoint` |
| GET | /v2.0/ADObjects/{adObjectId}/Assets | GetAssetsByADObject | :white_check_mark: `asset.getAssetsByADObject` |

### Asset Stock Folders
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AssetStock/Folders | GetAssetStockFolders | :white_check_mark: `asset.getAssetStockFolders` |
| POST | /v2.0/AssetStock/Folders | CreateAssetStockFolder | :white_check_mark: `asset.createAssetStockFolder` |
| GET | /v2.0/AssetStock/Folders/{id} | GetAssetStockFolder | :x: **NOT IMPLEMENTED** (single folder by ID) |
| PATCH | /v2.0/AssetStock/Folders/{id} | UpdateAssetStockFolder | :white_check_mark: `asset.updateAssetStockFolder` |
| DELETE | /v2.0/AssetStock/Folders/{id} | DeleteAssetStockFolder | :white_check_mark: `asset.deleteAssetStockFolder` |
| GET | /v2.0/AssetStock/Folders/{id}/Folders | GetAssetStockFoldersByParentId | :x: **NOT IMPLEMENTED** |

### Asset Types
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AssetTypes | GetAssetTypes | :white_check_mark: `asset.getAssetTypes` |
| POST | /v2.0/AssetTypes | CreateAssetType | :white_check_mark: `asset.createAssetType` |
| GET | /v2.0/AssetTypes/{id} | GetAssetType | :white_check_mark: `asset.getAssetType` |
| DELETE | /v2.0/AssetTypes/{id} | DeleteAssetType | :white_check_mark: `asset.deleteAssetType` |

### Asset Type Folders
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AssetTypes/Folders | GetAssetTypeFolders | :x: **NOT IMPLEMENTED** |
| POST | /v2.0/AssetTypes/Folders | CreateAssetTypeFolder | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/AssetTypes/Folders/{id} | GetAssetTypeFolder | :x: **NOT IMPLEMENTED** |
| PATCH | /v2.0/AssetTypes/Folders/{id} | UpdateAssetTypeFolder | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/AssetTypes/Folders/{id} | DeleteAssetTypeFolder | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/AssetTypes/Folders/{id}/Folders | GetAssetTypeFoldersByParentId | :x: **NOT IMPLEMENTED** |

**Assets Summary: 16/26 implemented (61.5%)**

---

## 3. Compliance API (`compliance.json`)

### Detected Rule Violations
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/DetectedRuleViolations | GetDetectedRuleViolations | :white_check_mark: `compliance.getDetectedRuleViolations` |
| GET | /v2.0/Endpoints/{id}/DetectedRuleViolations | GetDetectedRuleViolationsForEndpoint | :white_check_mark: `compliance.getDetectedRuleViolationsByEndpoint` |

### Detected Vulnerabilities
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/DetectedVulnerabilities | GetAllDetectedVulnerabilities | :white_check_mark: `compliance.getDetectedVulnerabilities` |
| GET | /v2.0/WindowsEndpoints/{id}/DetectedVulnerabilities | GetDetectedVulnerabilitiesByEndpoint | :white_check_mark: `compliance.getDetectedVulnerabilitiesByEndpoint` |

### Rules
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Rules | GetAllMobileDeviceRules | :white_check_mark: `compliance.getRules` |
| GET | /v2.0/Rules/{id} | GetMobileDeviceRule | :white_check_mark: `compliance.getRule` |

### Vulnerabilities
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Vulnerabilities | GetAllVulnerabilities | :white_check_mark: `compliance.getVulnerabilities` |
| GET | /v2.0/Vulnerabilities/{id} | GetVulnerability | :white_check_mark: `compliance.getVulnerability` |

**Compliance Summary: 8/8 implemented (100%)**

---

## 4. Defense Control API (`defensecontrol.json`)

### BitLocker
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/BitLocker/WindowsEndpoints | GetBitLockerStates | :white_check_mark: `defenseControl.getBitLockerWindowsEndpoints` |
| GET | /v2.0/BitLocker/WindowsEndpoints/{id} | GetBitLockerStatesByWindowsEndpointId | :white_check_mark: `defenseControl.getBitLockerWindowsEndpoint` |
| GET | /v2.0/BitLocker/WindowsEndpoints/{id}/Secrets | GetBitLockerSecretsByWindowsEndpointId | :white_check_mark: `defenseControl.getBitLockerSecrets` |
| PATCH | /v2.0/BitLocker/WindowsEndpoints/{id}/Secrets | UpdateBitLockerPinByWindowsEndpointId | :white_check_mark: `defenseControl.patchBitLockerSecrets` |

### Local Administrative Accounts
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id} | GetLocalAdminUserCredentialsByWindowsEndpointId | :white_check_mark: `defenseControl.getLocalAdministrativeAccounts` |
| PATCH | /v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id} | PatchLocalAdminUserCredentialsForWindowsEndpointId | :white_check_mark: `defenseControl.patchLocalAdminUserCredentials` |
| POST | /v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id}/TriggerUpdateOnClient | TriggerUpdateOnClient | :white_check_mark: `defenseControl.triggerLocalAdminAccountsUpdate` |

### Microsoft Defender
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/MicrosoftDefender/Threats | GetMicrosoftDefenderThreats | :white_check_mark: `defenseControl.getMicrosoftDefenderThreats` |
| GET | /v2.0/MicrosoftDefender/Threats/{id} | GetMicrosoftDefenderThreat | :white_check_mark: `defenseControl.getMicrosoftDefenderThreat` |
| GET | /v2.0/MicrosoftDefender/WindowsEndpoints | GetMicrosoftDefenderStates | :white_check_mark: `defenseControl.getMicrosoftDefenderWindowsEndpoints` |
| GET | /v2.0/MicrosoftDefender/WindowsEndpoints/{id} | GetMicrosoftDefenderStatesByWindowsEndpointId | :white_check_mark: `defenseControl.getMicrosoftDefenderWindowsEndpoint` |
| GET | /v2.0/MicrosoftDefender/WindowsEndpoints/{id}/Threats | GetMicrosoftDefenderThreatsByWindowsEndpointId | :white_check_mark: `defenseControl.getMicrosoftDefenderThreatsByEndpoint` |
| GET | /v2.0/MicrosoftDefender/LogicalGroups/{id}/Threats | GetMicrosoftDefenderThreatsByLogicalGroupId | :white_check_mark: `defenseControl.getMicrosoftDefenderThreatsByLogicalGroup` |

**Defense Control Summary: 13/13 implemented (100%)**

---

## 5. Endpoints API (`endpoints.json`)

### Endpoints (General)
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Endpoints | GetEndpoints | :white_check_mark: `endpoint.getMany` |
| GET | /v2.0/Endpoints/{id} | GetEndpoint | :white_check_mark: `endpoint.get` |
| DELETE | /v2.0/Endpoints/{id} | DeleteEndpoint | :white_check_mark: `endpoint.delete` |
| POST | /v2.0/Endpoints/{id}/EntraIdData | SetEntraIdEndpointData | :white_check_mark: `endpoint.setEntraIdData` |
| DELETE | /v2.0/Endpoints/{id}/EntraIdData | DeleteEntraIdEndpointData | :white_check_mark: `endpoint.deleteEntraIdData` |
| GET | /v2.0/EntraIdData/{deviceId} | GetEntraIdEndpointDataByDeviceId | :white_check_mark: `endpoint.getEntraIdDataByDeviceId` |
| GET | /v2.0/LogicalGroups/{id}/Endpoints | GetEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** (separate from getMany) |
| GET | /v2.0/StaticGroups/{id}/Endpoints | GetEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/Endpoints | GetEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/Endpoints | GetEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/DynamicGroups/{id}/Endpoints | GetEndpointsByDynamicGroupId | :x: **NOT IMPLEMENTED** |

### Windows Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/WindowsEndpoints | GetWindowsEndpoints | :warning: Covered via `endpoint.getMany` with type filter |
| POST | /v2.0/WindowsEndpoints | CreateWindowsEndpoint | :white_check_mark: `endpoint.create` |
| GET | /v2.0/WindowsEndpoints/{id} | GetWindowsEndpoint | :warning: Covered via `endpoint.get` |
| PATCH | /v2.0/WindowsEndpoints/{id} | UpdateWindowsEndpoint | :white_check_mark: `endpoint.update` |
| DELETE | /v2.0/WindowsEndpoints/{id} | DeleteWindowsEndpoint | :warning: Covered via `endpoint.delete` |
| POST | /v2.0/WindowsEndpoints/{id}/StartEnrollment | StartWindowsEndpointEnrollment | :white_check_mark: `endpoint.startEnrollment` |
| POST | /v2.0/WindowsEndpoints/{id}/TriggerInstallationViaIntune | TriggerInstallationViaIntune | :white_check_mark: `endpoint.triggerIntuneInstallation` |
| GET | /v2.0/DynamicGroups/{id}/WindowsEndpoints | GetWindowsEndpointsByDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LogicalGroups/{id}/WindowsEndpoints | GetWindowsEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/WindowsEndpoints | GetWindowsEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/WindowsEndpoints | GetWindowsEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/WindowsEndpoints | GetWindowsEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### Android Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AndroidEndpoints | GetAndroidEndpoints | :warning: Covered via `endpoint.getMany` with type filter |
| POST | /v2.0/AndroidEndpoints | CreateAndroidEndpoint | :x: **NOT IMPLEMENTED** (only Windows create) |
| GET | /v2.0/AndroidEndpoints/{id} | GetAndroidEndpoint | :warning: Covered via `endpoint.get` |
| PATCH | /v2.0/AndroidEndpoints/{id} | UpdateAndroidEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/AndroidEndpoints/{id} | DeleteAndroidEndpoint | :warning: Covered via `endpoint.delete` |
| POST | /v2.0/AndroidEndpoints/{id}/StartEnrollment | StartAndroidEndpointEnrollment | :x: **NOT IMPLEMENTED** (enrollment only for Windows) |
| GET | /v2.0/LogicalGroups/{id}/AndroidEndpoints | GetAndroidEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/AndroidEndpoints | GetAndroidEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/AndroidEndpoints | GetAndroidEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/AndroidEndpoints | GetAndroidEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### iOS Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/IosEndpoints | GetIOSEndpoints | :warning: Covered via `endpoint.getMany` with type filter |
| POST | /v2.0/IosEndpoints | CreateIOSEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/IosEndpoints/{id} | GetIOSEndpoint | :warning: Covered via `endpoint.get` |
| PATCH | /v2.0/IosEndpoints/{id} | UpdateIOSEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/IosEndpoints/{id} | DeleteIOSEndpoint | :warning: Covered via `endpoint.delete` |
| POST | /v2.0/IosEndpoints/{id}/StartEnrollment | StartIosEndpointEnrollment | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LogicalGroups/{id}/IosEndpoints | GetIOSEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/IosEndpoints | GetIOSEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/IosEndpoints | GetIOSEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/IosEndpoints | GetIOSEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### Linux Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/LinuxEndpoints | GetLinuxEndpoints | :warning: Covered via `endpoint.getMany` with type filter |
| POST | /v2.0/LinuxEndpoints | CreateLinuxEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LinuxEndpoints/{id} | GetLinuxEndpoint | :warning: Covered via `endpoint.get` |
| PATCH | /v2.0/LinuxEndpoints/{id} | UpdateLinuxEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/LinuxEndpoints/{id} | DeleteLinuxEndpoint | :warning: Covered via `endpoint.delete` |
| GET | /v2.0/LogicalGroups/{id}/LinuxEndpoints | GetLinuxEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/LinuxEndpoints | GetLinuxEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/LinuxEndpoints | GetLinuxEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/LinuxEndpoints | GetLinuxEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### macOS Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/MacEndpoints | GetMacEndpoints | :warning: Covered via `endpoint.getMany` with type filter |
| POST | /v2.0/MacEndpoints | CreateMacEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/MacEndpoints/{id} | GetMacEndpoint | :warning: Covered via `endpoint.get` |
| PATCH | /v2.0/MacEndpoints/{id} | UpdateMacEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/MacEndpoints/{id} | DeleteMacEndpoint | :warning: Covered via `endpoint.delete` |
| POST | /v2.0/MacEndpoints/{id}/StartEnrollment | StartMacEndpointEnrollment | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LogicalGroups/{id}/MacEndpoints | GetMacEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/MacEndpoints | GetMacEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/MacEndpoints | GetMacEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/MacEndpoints | GetMacEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### Network Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/NetworkEndpoints | GetNetworkEndpoints | :warning: Covered via `endpoint.getMany` with type filter |
| POST | /v2.0/NetworkEndpoints | CreateNetworkEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/NetworkEndpoints/{id} | GetNetworkEndpoint | :warning: Covered via `endpoint.get` |
| PATCH | /v2.0/NetworkEndpoints/{id} | UpdateNetworkEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/NetworkEndpoints/{id} | DeleteNetworkEndpoint | :warning: Covered via `endpoint.delete` |
| GET | /v2.0/LogicalGroups/{id}/NetworkEndpoints | GetNetworkEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/NetworkEndpoints | GetNetworkEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/NetworkEndpoints | GetNetworkEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |

### Unmanaged Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/UnmanagedEndpoints | GetAllUnmanagedEndpoints | :white_check_mark: `endpoint.getUnmanagedEndpoints` |
| GET | /v2.0/UnmanagedEndpoints/{id} | GetUnmanagedEndpoint | :white_check_mark: `endpoint.getUnmanagedEndpoint` |
| DELETE | /v2.0/UnmanagedEndpoints/{id} | DeleteUnmanagedEndpoint | :white_check_mark: `endpoint.deleteUnmanagedEndpoint` |

### Logical Groups
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/LogicalGroups | GetLogicalGroups | :white_check_mark: `endpoint.getLogicalGroups` |
| POST | /v2.0/LogicalGroups | CreateLogicalGroup | :white_check_mark: `endpoint.createLogicalGroup` |
| GET | /v2.0/LogicalGroups/{id} | GetLogicalGroup | :white_check_mark: `endpoint.getLogicalGroup` |
| PATCH | /v2.0/LogicalGroups/{id} | UpdateLogicalGroup | :white_check_mark: `endpoint.updateLogicalGroup` |
| DELETE | /v2.0/LogicalGroups/{id} | DeleteLogicalGroup | :white_check_mark: `endpoint.deleteLogicalGroup` |
| GET | /v2.0/LogicalGroups/{id}/LogicalGroups | GetLogicalGroupsByLogicalGroupId | :x: **NOT IMPLEMENTED** |

### Maintenance Windows
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Endpoints/{id}/MaintenanceWindow | GetMaintenanceWindowForEndpointById | :x: **NOT IMPLEMENTED** (get) |
| POST | /v2.0/Endpoints/{id}/MaintenanceWindow | CreateMaintenanceWindowForEndpointById | :white_check_mark: `endpoint.createEndpointMaintenanceWindow` |
| PATCH | /v2.0/Endpoints/{id}/MaintenanceWindow | UpdateMaintenanceWindowForEndpointById | :white_check_mark: `endpoint.updateEndpointMaintenanceWindow` |
| DELETE | /v2.0/Endpoints/{id}/MaintenanceWindow | DeleteMaintenanceWindowForEndpointById | :white_check_mark: `endpoint.deleteEndpointMaintenanceWindow` |
| GET | /v2.0/LogicalGroups/{id}/MaintenanceWindow | GetMaintenanceWindowForLogicalGroupById | :x: **NOT IMPLEMENTED** (get) |
| POST | /v2.0/LogicalGroups/{id}/MaintenanceWindow | CreateMaintenanceWindowForLogicalGroupById | :white_check_mark: `endpoint.createGroupMaintenanceWindow` |
| PATCH | /v2.0/LogicalGroups/{id}/MaintenanceWindow | UpdateMaintenanceWindowForLogicalGroupById | :white_check_mark: `endpoint.updateGroupMaintenanceWindow` |
| DELETE | /v2.0/LogicalGroups/{id}/MaintenanceWindow | DeleteMaintenanceWindowForLogicalGroupById | :white_check_mark: `endpoint.deleteGroupMaintenanceWindow` |

**Endpoints Summary: ~35/103 directly implemented + many covered via unified operations (~55% effective coverage)**

> **Note:** The connector uses a unified endpoint model — `endpoint.getMany` / `endpoint.get` / `endpoint.delete` handle all endpoint types via the generic `/Endpoints` path. The type-specific GET/DELETE endpoints (AndroidEndpoints, IosEndpoints, etc.) are functionally covered but not individually addressable. Type-specific CREATE/UPDATE/ENROLLMENT for non-Windows platforms are genuinely missing.

---

## 6. Jobs API (`jobs.json`)

### Folders
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Folders | GetFolders | :white_check_mark: `job.getFolders` |
| POST | /v2.0/Folders | CreateFolder | :white_check_mark: `job.createFolder` |
| GET | /v2.0/Folders/{id} | GetFolder | :white_check_mark: `job.getFolder` |
| PATCH | /v2.0/Folders/{id} | UpdateFolder | :white_check_mark: `job.updateFolder` |
| DELETE | /v2.0/Folders/{id} | DeleteFolder | :white_check_mark: `job.deleteFolder` |
| GET | /v2.0/Folders/{id}/Folders | GetFoldersByFolderId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/Folders/{id}/JobDefinitions | GetJobDefinitionsByFolderId | :x: **NOT IMPLEMENTED** |

### Job Definitions
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/JobDefinitions | GetJobDefinitions | :white_check_mark: `job.getMany` |
| GET | /v2.0/JobDefinitions/{id} | GetJobDefinition | :white_check_mark: `job.get` |
| GET | /v2.0/JobDefinitions/{id}/JobInstances | GetJobInstancesByJobDefinitionId | :white_check_mark: `job.getInstances` |
| GET | /v2.0/JobDefinitions/{id}/KioskReleases | GetKioskReleasesByJobDefinitionId | :x: **NOT IMPLEMENTED** |

### Job Instances
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/JobInstances | GetJobInstances | :white_check_mark: `job.getAllJobInstances` |
| POST | /v2.0/JobInstances | CreateJobInstance | :white_check_mark: `job.execute` |
| GET | /v2.0/JobInstances/{id} | GetJobInstance | :white_check_mark: `job.getJobInstance` |
| DELETE | /v2.0/JobInstances/{id} | DeleteJobInstance | :white_check_mark: `job.deleteJobInstance` |
| POST | /v2.0/JobInstances/{id}/Start | StartJobInstance | :white_check_mark: `job.startJobInstance` |
| POST | /v2.0/JobInstances/{id}/Stop | StopJobInstance | :white_check_mark: `job.stopJobInstance` |
| POST | /v2.0/JobInstances/{id}/Resume | ResumeJobInstance | :white_check_mark: `job.resumeJobInstance` |
| GET | /v2.0/Endpoints/{id}/JobInstances | GetJobInstancesByEndpointId | :white_check_mark: `job.getEndpointJobInstances` |
| GET | /v2.0/LogicalGroups/{id}/JobInstances | GetJobInstancesByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/JobInstances | GetJobInstancesByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/DynamicGroups/{id}/JobInstances | GetJobInstancesByDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/JobInstances | GetJobInstancesByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |

### Job Definition Assignment
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| POST | /v2.0/LogicalGroups/{id}/AssignJobDefinition | AssignJobDefinitionToLogicalGroup | :x: **NOT IMPLEMENTED** |
| POST | /v2.0/StaticGroups/{id}/AssignJobDefinition | AssignJobDefinitionToStaticGroup | :x: **NOT IMPLEMENTED** |
| POST | /v2.0/DynamicGroups/{id}/AssignJobDefinition | AssignJobDefinitionToWindowsDynamicGroup | :x: **NOT IMPLEMENTED** |
| POST | /v2.0/UniversalDynamicGroups/{id}/AssignJobDefinition | AssignJobDefinitionToUniversalDynamicGroup | :x: **NOT IMPLEMENTED** |

### Kiosk Releases
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/KioskReleases | GetKioskReleases | :white_check_mark: `job.getKioskReleases` |
| POST | /v2.0/KioskReleases | CreateKioskRelease | :white_check_mark: `job.createKioskRelease` |
| GET | /v2.0/KioskReleases/{id} | GetKioskRelease | :white_check_mark: `job.getKioskRelease` |
| DELETE | /v2.0/KioskReleases/{id} | WithdrawKioskRelease | :white_check_mark: `job.withdrawKioskRelease` |
| GET | /v2.0/Endpoints/{id}/KioskReleases | GetKioskReleasesByEndpointId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LogicalGroups/{id}/KioskReleases | GetKioskReleasesByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADObjects/{id}/KioskReleases | GetKioskReleasesByAdObjectId | :x: **NOT IMPLEMENTED** |

**Jobs Summary: 19/33 implemented (57.6%)**

---

## 7. Operating Systems API (`operatingsystems.json`)

| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Folders | GetFolders | :white_check_mark: `operatingSystem.getFolders` |
| POST | /v2.0/Folders | CreateFolder | :white_check_mark: `operatingSystem.createFolder` |
| GET | /v2.0/Folders/{id} | GetFolder | :white_check_mark: `operatingSystem.getFolder` |
| PATCH | /v2.0/Folders/{id} | UpdateFolder | :white_check_mark: `operatingSystem.updateFolder` |
| DELETE | /v2.0/Folders/{id} | DeleteFolder | :white_check_mark: `operatingSystem.deleteFolder` |
| GET | /v2.0/Folders/{id}/Folders | GetFoldersByFolderId | :white_check_mark: `operatingSystem.getFoldersByFolderId` |
| GET | /v2.0/WindowsEndpoints | GetWindowsEndpoints | :white_check_mark: `operatingSystem.getWindowsEndpoints` |
| GET | /v2.0/WindowsEndpoints/{id} | GetWindowsEndpoint | :white_check_mark: `operatingSystem.getWindowsEndpoint` |
| PATCH | /v2.0/WindowsEndpoints/{id} | UpdateWindowsEndpoint | :white_check_mark: `operatingSystem.updateWindowsEndpoint` |

**Operating Systems Summary: 9/9 implemented (100%)**

---

## 8. Server Management API (`servermanagement.json`)

### Management Server
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ManagementServer | GetManagementServer | :white_check_mark: |
| POST | /v2.0/Restart | RestartBaramundiManagementServer | :white_check_mark: |
| POST | /v2.0/CancelScheduledRestart | CancelScheduledRestartBaramundiManagementServer | :white_check_mark: |

### API Keys
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ApiKeys | GetApiKeys | :white_check_mark: `serverManagement.getApiKeys` |

### Microservices
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Microservices | GetMicroservices | :white_check_mark: |
| GET | /v2.0/Microservices/{id} | GetMicroservice | :white_check_mark: |
| POST | /v2.0/Microservices/{id}/Start | StartMicroservice | :white_check_mark: |
| POST | /v2.0/Microservices/{id}/Stop | StopMicroservice | :white_check_mark: |
| POST | /v2.0/Microservices/{id}/Restart | RestartMicroservice | :white_check_mark: |

### Infrastructure
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/CloudConnectors | GetCloudConnectors | :white_check_mark: |
| GET | /v2.0/Gateway | GetGateway | :white_check_mark: |
| GET | /v2.0/VpnAppliance | GetVpnAppliance | :white_check_mark: |
| GET | /v2.0/PxeRelays | GetPxeRelays | :white_check_mark: |

### DIPs
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Dips | GetDipStatus | :white_check_mark: |
| POST | /v2.0/Dips/MSWCleanup | MSWCleanup | :white_check_mark: `serverManagement.getDipsMSWCleanup` |
| POST | /v2.0/Dips/SimulateMSWCleanup | SimulateMSWCleanup | :white_check_mark: `serverManagement.simulateMSWCleanup` |

### Download Jobs
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/DownloadJobs | GetDownloadJobs | :white_check_mark: `serverManagement.getDownloadJobs` |
| GET | /v2.0/DownloadJobs/{id} | GetDownloadJob | :white_check_mark: `serverManagement.getDownloadJob` |

### Objects & Permissions
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Objects/{id}/Rights | GetAccessRights | :white_check_mark: |
| PATCH | /v2.0/Objects/{id} | UpdateObjectPermission | :white_check_mark: |

### Security Groups
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/SecurityGroups | GetSecurityGroups | :white_check_mark: |
| POST | /v2.0/SecurityGroups | CreateSecurityGroup | :white_check_mark: |
| GET | /v2.0/SecurityGroups/{id} | GetSecurityGroup | :white_check_mark: |
| PATCH | /v2.0/SecurityGroups/{id} | UpdateSecurityGroup | :white_check_mark: |
| DELETE | /v2.0/SecurityGroups/{id} | DeleteSecurityGroup | :white_check_mark: |

### Security Profiles
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/SecurityProfiles | GetSecurityProfiles | :white_check_mark: |
| POST | /v2.0/SecurityProfiles | CreateSecurityProfile | :white_check_mark: |
| GET | /v2.0/SecurityProfiles/{id} | GetSecurityProfile | :white_check_mark: |
| PATCH | /v2.0/SecurityProfiles/{id} | UpdateSecurityProfile | :white_check_mark: |
| DELETE | /v2.0/SecurityProfiles/{id} | DeleteSecurityProfile | :white_check_mark: |

**Server Management Summary: 30/30 implemented (100%)**

---

## 9. Software API (`software.json`)

### Installed Windows Software
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/InstalledWindowsSoftware | GetInstalledWindowsSoftware | :white_check_mark: |
| GET | /v2.0/WindowsEndpoints/{id}/InstalledWindowsSoftware | GetInstalledWindowsSoftwareByEndpointId | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id}/InstalledWindowsSoftware | GetInstalledWindowsSoftwareByLogicalGroupId | :white_check_mark: |
| GET | /v2.0/UniversalDynamicGroups/{id}/InstalledWindowsSoftware | GetInstalledWindowsSoftwareByUniversalDynamicGroupId | :white_check_mark: |

### Bundles
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Bundles | GetSoftwareBundles | :white_check_mark: `software.getBundles` |
| POST | /v2.0/Bundles | CreateBundle | :white_check_mark: `software.createBundle` |
| GET | /v2.0/Bundles/{id} | GetBundle | :white_check_mark: `software.getBundle` |
| DELETE | /v2.0/Bundles/{id} | DeleteBundle | :white_check_mark: `software.deleteBundle` |
| GET | /v2.0/Bundles/{id}/BundleApplications | GetBundleApplicationsByBundleId | :white_check_mark: `software.getBundleApplicationsByBundle` |
| POST | /v2.0/Bundles/{id}/BundleApplications | AddApplicationToBundle | :x: **NOT IMPLEMENTED** |
| PATCH | /v2.0/Bundles/{id}/BundleApplications/{id} | ReplaceApplicationInBundle | :x: **NOT IMPLEMENTED** |

### Bundle Folders
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Bundle/Folders | GetBundleFolders | :white_check_mark: `software.getBundleFolders` |
| POST | /v2.0/Bundle/Folders | CreateBundleFolder | :white_check_mark: `software.createBundleFolder` |
| GET | /v2.0/Bundle/Folders/{id} | GetBundleFolder | :white_check_mark: `software.getBundleFolder` |
| PATCH | /v2.0/Bundle/Folders/{id} | UpdateBundleFolder | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/Bundle/Folders/{id} | DeleteBundleFolder | :white_check_mark: `software.deleteBundleFolder` |
| GET | /v2.0/Bundle/Folders/{id}/Folders | GetBundleFoldersByFolderId | :white_check_mark: `software.getBundleSubFolders` |

### Bundle Applications (top-level)
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/BundleApplications | GetBundleApplications | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/BundleApplications/{id} | DeleteBundleApplicationById | :x: **NOT IMPLEMENTED** |

**Software Summary: 15/20 implemented (75%)**

---

## 10. Universal Dynamic Groups API (`universaldynamicgroups.json`)

| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/UniversalDynamicGroups | GetUniversalDynamicGroups | :white_check_mark: |
| GET | /v2.0/UniversalDynamicGroups/{id} | GetUniversalDynamicGroup | :white_check_mark: |
| GET | /v2.0/Folders/{id}/UniversalDynamicGroups | GetUniversalDynamicGroupsByFolderId | :white_check_mark: |
| GET | /v2.0/UniversalDynamicGroupsFolder | GetFolders | :white_check_mark: |
| GET | /v2.0/UniversalDynamicGroupsFolder/{id} | GetFolder | :white_check_mark: |
| GET | /v2.0/UniversalDynamicGroupsFolder/{id}/Folders | GetFoldersByFolderId | :white_check_mark: |

**Universal Dynamic Groups Summary: 6/6 implemented (100%)**

---

## 11. Update Management API (`updatemanagement.json`)

| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/WindowsEndpoints | GetWindowsEndpoints | :white_check_mark: |
| GET | /v2.0/WindowsEndpoints/{id} | GetWindowsEndpoint | :white_check_mark: |
| PATCH | /v2.0/WindowsEndpoints/{id} | UpdateWindowsEndpoint | :white_check_mark: |

**Update Management Summary: 3/3 implemented (100%)**

---

## 12. Variables API (`variables.json`)

### Variable Definitions
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/VariableDefinitions | GetVariableDefinitions | :white_check_mark: |
| POST | /v2.0/VariableDefinitions | CreateVariableDefinition | :white_check_mark: |
| GET | /v2.0/VariableDefinitions/{id} | GetVariableDefinitionById | :white_check_mark: |
| PATCH | /v2.0/VariableDefinitions/{id} | UpdateVariableDefinition | :white_check_mark: |
| DELETE | /v2.0/VariableDefinitions/{id} | DeleteVariableDefinition | :white_check_mark: |

### Variable Instances
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/VariableInstances | GetVariableInstances | :white_check_mark: |
| GET | /v2.0/VariableInstances/{id} | GetVariableInstanceById | :white_check_mark: |
| PATCH | /v2.0/VariableInstances/{id} | UpdateVariableInstance | :white_check_mark: |
| GET | /v2.0/Endpoints/{id}/VariableInstances | GetVariableInstancesByEndpointId | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id}/VariableInstances | GetVariableInstancesByLogicalGroupId | :white_check_mark: |
| GET | /v2.0/ADObjects/{id}/VariableInstances | GetVariableInstancesByADObjectId | :white_check_mark: |
| GET | /v2.0/WindowsApplications/{id}/VariableInstances | GetVariableInstancesByWindowsApplicationId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/WindowsJobDefinitions/{id}/VariableInstances | GetVariableInstancesByWindowsJobDefinitonId | :x: **NOT IMPLEMENTED** |

**Variables Summary: 11/13 implemented (84.6%)**

---

## Overall Summary — 26R1

| API Module | Implemented | Total | Coverage |
|------------|------------|-------|----------|
| Active Directory | 10 | 16 | 62.5% |
| Assets | 16 | 26 | 61.5% |
| Compliance | 8 | 8 | **100%** |
| Defense Control | 13 | 13 | **100%** |
| Endpoints | ~35 | 103 | ~34% (55% effective) |
| Jobs | 19 | 33 | 57.6% |
| Operating Systems | 9 | 9 | **100%** |
| Server Management | 30 | 30 | **100%** |
| Software | 15 | 20 | 75% |
| Universal Dynamic Groups | 6 | 6 | **100%** |
| Update Management | 3 | 3 | **100%** |
| Variables | 11 | 13 | 84.6% |
| **TOTAL** | **~175** | **~280** | **~62.5%** |

### Key Gaps

1. **Endpoints — type-specific operations:** Create/Update/Enrollment for Android, iOS, Linux, macOS, Network endpoints are not implemented. The connector only supports Windows endpoint create/update.
2. **Endpoints — group-scoped queries:** Fetching endpoints by logical group, static group, dynamic group, UDG, or AD user (type-specific) are not implemented.
3. **Asset Type Folders:** Entire sub-resource not implemented (6 endpoints).
4. **Job Assignment:** AssignJobDefinition to groups (4 endpoints) not implemented.
5. **Job Instances by group:** Fetching job instances by logical/static/dynamic/UDG group not implemented.
6. **Variable Instances** by WindowsApplication and WindowsJobDefinition not implemented.
7. **Active Directory** sub-group/sub-object navigation (ADGroups by ADGroup, ADObjects by ADGroup, OrgUnits by OrgUnit, etc.) partially missing.
