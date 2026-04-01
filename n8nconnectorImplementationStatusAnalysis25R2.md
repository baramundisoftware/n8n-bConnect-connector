# n8n Connector Implementation Status Analysis — bMS 25R2

**Generated:** 2026-04-01
**OpenAPI Source:** `/home/ansible/MCP/bConnectOpenAPI/25R2/`
**Connector Source:** `/home/ansible/MCP/n8nconnector/`

---

## Legend

| Symbol | Meaning |
|--------|---------|
| :white_check_mark: | Implemented in connector |
| :x: | NOT implemented — exists in OpenAPI but missing from connector |
| :warning: | Partially implemented or mapped differently |

---

## 1. Active Directory API (`bConnect_ActiveDirectory.json`)

### AD Groups
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ADGroups | GetADGroups | :white_check_mark: `activeDirectory.getADGroups` |
| GET | /v2.0/ADGroups/{id} | GetADGroupById | :white_check_mark: `activeDirectory.getADGroup` |
| GET | /v2.0/ADGroups/{adGroupId}/ADGroups | GetADGroupsByADGroupId | :white_check_mark: `activeDirectory.getADGroupsByADGroup` |
| GET | /v2.0/OrgUnits/{orgUnitId}/ADGroups | GetADGroupsByOrgUnitId | :white_check_mark: `activeDirectory.getADGroupsByOrgUnit` |

### AD Objects
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ADObjects | GetADObjects | :white_check_mark: `activeDirectory.getADObjects` |
| GET | /v2.0/ADObjects/{id} | GetADObjectById | :white_check_mark: `activeDirectory.getADObject` |
| GET | /v2.0/ADObjects/{id}/ADGroupMemberships | GetADObjectMemberships | :white_check_mark: `activeDirectory.getADObjectMemberships` |
| GET | /v2.0/ADGroups/{adGroupId}/ADObjects | GetADObjectsByADGroupId | :white_check_mark: `activeDirectory.getADObjectsByADGroup` |
| GET | /v2.0/OrgUnits/{orgUnitId}/ADObjects | GetADObjectsByOrgUnitId | :white_check_mark: `activeDirectory.getADObjectsByOrgUnit` |

### AD Users
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ADUsers | GetADUsers | :white_check_mark: `activeDirectory.getADUsers` |
| GET | /v2.0/ADUsers/{id} | GetADUserById | :white_check_mark: `activeDirectory.getADUser` |
| GET | /v2.0/ADGroups/{adGroupId}/ADUsers | GetADUsersByADGroupId | :white_check_mark: `activeDirectory.getADUsersByGroup` |
| GET | /v2.0/OrgUnits/{orgUnitId}/ADUsers | GetADUsersByOrgUnitId | :white_check_mark: `activeDirectory.getADUsersByOrgUnit` |

### Organizational Units
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/OrgUnits | GetOrgUnits | :white_check_mark: `activeDirectory.getOrgUnits` |
| GET | /v2.0/OrgUnits/{id} | GetOrgUnit | :white_check_mark: `activeDirectory.getOrgUnit` |
| GET | /v2.0/OrgUnits/{orgUnitId}/OrgUnits | GetOrgUnitsByOrgUnitId | :white_check_mark: `activeDirectory.getOrgUnitsByOrgUnit` |

**Active Directory Summary: 17/17 implemented (100%)**

---

## 2. Assets API (`bConnect_Assets.json`)

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
| GET | /v2.0/WindowsEndpoint/{id}/Assets | GetAssetsByWindowsEndpoint | :white_check_mark: `asset.getAssetsByEndpoint` |

### Asset Stock Folders
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AssetStock/Folders | GetAssetStockFolders | :white_check_mark: `asset.getAssetStockFolders` |
| POST | /v2.0/AssetStock/Folders | CreateAssetStockFolder | :white_check_mark: `asset.createAssetStockFolder` |
| GET | /v2.0/AssetStock/Folders/{id} | GetAssetStockFolder | :white_check_mark: `asset.getAssetStockFolder` |
| PATCH | /v2.0/AssetStock/Folders/{id} | UpdateAssetStockFolder | :white_check_mark: `asset.updateAssetStockFolder` |
| DELETE | /v2.0/AssetStock/Folders/{id} | DeleteAssetStockFolder | :white_check_mark: `asset.deleteAssetStockFolder` |
| GET | /v2.0/AssetStock/Folders/{id}/Folders | GetAssetStockFoldersByParentId | :white_check_mark: `asset.getAssetStockSubFolders` |

### Asset Type Folders
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AssetTypes/Folders | GetAssetTypeFolders | :white_check_mark: `asset.getAssetTypeFolders` |
| POST | /v2.0/AssetTypes/Folders | CreateAssetTypeFolder | :white_check_mark: `asset.createAssetTypeFolder` |
| GET | /v2.0/AssetTypes/Folders/{id} | GetAssetTypeFolder | :white_check_mark: `asset.getAssetTypeFolder` |
| PATCH | /v2.0/AssetTypes/Folders/{id} | UpdateAssetTypeFolder | :white_check_mark: `asset.updateAssetTypeFolder` |
| DELETE | /v2.0/AssetTypes/Folders/{id} | DeleteAssetTypeFolder | :white_check_mark: `asset.deleteAssetTypeFolder` |
| GET | /v2.0/AssetTypes/Folders/{id}/Folders | GetAssetTypeFoldersByParentId | :white_check_mark: `asset.getAssetTypeFolderSubFolders` |

### Asset Types
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AssetTypes | GetAssetTypes | :white_check_mark: `asset.getAssetTypes` |
| POST | /v2.0/AssetTypes | CreateAssetType | :white_check_mark: `asset.createAssetType` |
| GET | /v2.0/AssetTypes/{id} | GetAssetType | :white_check_mark: `asset.getAssetType` |
| DELETE | /v2.0/AssetTypes/{id} | DeleteAssetType | :white_check_mark: `asset.deleteAssetType` |

**Assets Summary: 24/24 implemented (100%)**

> **Note:** 25R2 does NOT have `GetAssetsByOrgUnit` or `GetAssetsByADObject` — those are 26R1-only.

---

## 3. Defense Control API (`bConnect_DefenseControl.json`)

### BitLocker
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/BitLocker/WindowsEndpoints | GetBitLockerStates | :white_check_mark: |
| GET | /v2.0/BitLocker/WindowsEndpoints/{id} | GetBitLockerStatesByWindowsEndpointId | :white_check_mark: |

> **Note:** 25R2 does NOT have BitLocker Secrets endpoints — those are 26R1-only.

### Local Administrative Accounts
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id} | GetLocalAdminUserCredentialsByWindowsEndpointId | :white_check_mark: |
| PATCH | /v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id} | PatchLocalAdminUserCredentialsForWindowsEndpointId | :white_check_mark: |
| POST | /v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id}/TriggerUpdateOnClient | TriggerUpdateOnClient | :white_check_mark: |

### Microsoft Defender
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/MicrosoftDefender/Threats | GetMicrosoftDefenderThreats | :white_check_mark: |
| GET | /v2.0/MicrosoftDefender/Threats/{id} | GetMicrosoftDefenderThreat | :white_check_mark: |
| GET | /v2.0/MicrosoftDefender/WindowsEndpoints | GetMicrosoftDefenderStates | :white_check_mark: |
| GET | /v2.0/MicrosoftDefender/WindowsEndpoints/{id} | GetMicrosoftDefenderStatesByWindowsEndpointId | :white_check_mark: |
| GET | /v2.0/MicrosoftDefender/WindowsEndpoints/{id}/Threats | GetMicrosoftDefenderThreatsByWindowsEndpointId | :white_check_mark: |
| GET | /v2.0/MicrosoftDefender/LogicalGroups/{id}/Threats | GetMicrosoftDefenderThreatsByLogicalGroupId | :white_check_mark: |

**Defense Control Summary: 11/11 implemented (100%)**

---

## 4. Endpoints API (`bConnect_Endpoints.json`)

### Endpoints (General)
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Endpoints | GetEndpoints | :white_check_mark: `endpoint.getMany` |
| GET | /v2.0/Endpoints/{id} | GetEndpoint | :white_check_mark: `endpoint.get` |
| DELETE | /v2.0/Endpoints/{id} | DeleteEndpoint | :white_check_mark: `endpoint.delete` |
| GET | /v2.0/LogicalGroups/{id}/Endpoints | GetEndpointsByLogicalGroupId | :white_check_mark: `endpoint.getEndpointsByLogicalGroup` |
| GET | /v2.0/StaticGroups/{id}/Endpoints | GetEndpointsByStaticGroupId | :white_check_mark: `endpoint.getEndpointsByStaticGroup` |
| GET | /v2.0/DynamicGroups/{id}/Endpoints | GetEndpointsByDynamicGroupId | :white_check_mark: `endpoint.getEndpointsByDynamicGroup` |
| GET | /v2.0/UniversalDynamicGroups/{id}/Endpoints | GetEndpointsByUniversalDynamicGroupId | :white_check_mark: `endpoint.getEndpointsByUDG` |
| GET | /v2.0/ADUsers/{id}/Endpoints | GetEndpointsByADObjectId | :white_check_mark: `endpoint.getEndpointsByADUser` |

### Windows Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/WindowsEndpoints | GetWindowsEndpoints | :white_check_mark: `endpoint.getTypedEndpoints` |
| POST | /v2.0/WindowsEndpoints | CreateWindowsEndpoint | :white_check_mark: `endpoint.create` |
| GET | /v2.0/WindowsEndpoints/{id} | GetWindowsEndpoint | :white_check_mark: `endpoint.getTypedEndpoint` |
| PATCH | /v2.0/WindowsEndpoints/{id} | UpdateWindowsEndpoint | :white_check_mark: `endpoint.updateTypedEndpoint` |
| DELETE | /v2.0/WindowsEndpoints/{id} | DeleteWindowsEndpoint | :white_check_mark: `endpoint.deleteTypedEndpoint` |
| POST | /v2.0/WindowsEndpoints/{id}/StartEnrollment | StartWindowsEndpointEnrollment | :white_check_mark: `endpoint.startTypedEnrollment` |
| POST | /v2.0/WindowsEndpoints/{id}/TriggerInstallationViaIntune | TriggerInstallationViaIntune | :white_check_mark: `endpoint.triggerIntuneInstallation` |
| GET | /v2.0/DynamicGroups/{id}/WindowsEndpoints | GetWindowsEndpointsByDynamicGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/LogicalGroups/{id}/WindowsEndpoints | GetWindowsEndpointsByLogicalGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/StaticGroups/{id}/WindowsEndpoints | GetWindowsEndpointsByStaticGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/UniversalDynamicGroups/{id}/WindowsEndpoints | GetWindowsEndpointsByUniversalDynamicGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/ADUsers/{id}/WindowsEndpoints | GetWindowsEndpointsByADObjectId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |

### Android Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AndroidEndpoints | GetAndroidEndpoints | :white_check_mark: `endpoint.getTypedEndpoints` |
| POST | /v2.0/AndroidEndpoints | CreateAndroidEndpoint | :white_check_mark: `endpoint.create` (endpointType: android) |
| GET | /v2.0/AndroidEndpoints/{id} | GetAndroidEndpoint | :white_check_mark: `endpoint.getTypedEndpoint` |
| PATCH | /v2.0/AndroidEndpoints/{id} | UpdateAndroidEndpoint | :white_check_mark: `endpoint.updateTypedEndpoint` |
| DELETE | /v2.0/AndroidEndpoints/{id} | DeleteAndroidEndpoint | :white_check_mark: `endpoint.deleteTypedEndpoint` |
| POST | /v2.0/AndroidEndpoints/{id}/StartEnrollment | StartAndroidEndpointEnrollment | :white_check_mark: `endpoint.startTypedEnrollment` |
| GET | /v2.0/LogicalGroups/{id}/AndroidEndpoints | GetAndroidEndpointsByLogicalGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/StaticGroups/{id}/AndroidEndpoints | GetAndroidEndpointsByStaticGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/UniversalDynamicGroups/{id}/AndroidEndpoints | GetAndroidEndpointsByUniversalDynamicGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/ADUsers/{id}/AndroidEndpoints | GetAndroidEndpointsByADObjectId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |

### iOS Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/IosEndpoints | GetIOSEndpoints | :white_check_mark: `endpoint.getTypedEndpoints` |
| POST | /v2.0/IosEndpoints | CreateIOSEndpoint | :white_check_mark: `endpoint.create` (endpointType: ios) |
| GET | /v2.0/IosEndpoints/{id} | GetIOSEndpoint | :white_check_mark: `endpoint.getTypedEndpoint` |
| PATCH | /v2.0/IosEndpoints/{id} | UpdateIOSEndpoint | :white_check_mark: `endpoint.updateTypedEndpoint` |
| DELETE | /v2.0/IosEndpoints/{id} | DeleteIOSEndpoint | :white_check_mark: `endpoint.deleteTypedEndpoint` |
| POST | /v2.0/IosEndpoints/{id}/StartEnrollment | StartIosEndpointEnrollment | :white_check_mark: `endpoint.startTypedEnrollment` |
| GET | /v2.0/LogicalGroups/{id}/IosEndpoints | GetIOSEndpointsByLogicalGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/StaticGroups/{id}/IosEndpoints | GetIOSEndpointsByStaticGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/UniversalDynamicGroups/{id}/IosEndpoints | GetIOSEndpointsByUniversalDynamicGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/ADUsers/{id}/IosEndpoints | GetIOSEndpointsByADObjectId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |

### Industrial Endpoints (25R2-specific, not in 26R1)
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/IndustrialEndpoints | GetIndustrialEndpoints | :white_check_mark: `endpoint.getIndustrialEndpoints` |
| POST | /v2.0/IndustrialEndpoints | CreateIndustrialEndpoint | :white_check_mark: `endpoint.createIndustrialEndpoint` |
| GET | /v2.0/IndustrialEndpoints/{id} | GetIndustrialEndpoint | :white_check_mark: `endpoint.getIndustrialEndpoint` |
| PATCH | /v2.0/IndustrialEndpoints/{id} | UpdateIndustrialEndpoint | :white_check_mark: `endpoint.updateIndustrialEndpoint` |
| DELETE | /v2.0/IndustrialEndpoints/{id} | DeleteIndustrialEndpoint | :white_check_mark: `endpoint.deleteIndustrialEndpoint` |
| GET | /v2.0/LogicalGroups/{id}/IndustrialEndpoints | GetIndustrialEndpointsByLogicalGroupId | :white_check_mark: `endpoint.getIndustrialEndpointsByGroup` |
| GET | /v2.0/StaticGroups/{id}/IndustrialEndpoints | GetIndustrialEndpointsByStaticGroupId | :white_check_mark: `endpoint.getIndustrialEndpointsByGroup` |
| GET | /v2.0/UniversalDynamicGroups/{id}/IndustrialEndpoints | GetIndustrialEndpointsByUniversalDynamicGroupId | :white_check_mark: `endpoint.getIndustrialEndpointsByGroup` |

### Linux Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/LinuxEndpoints | GetLinuxEndpoints | :white_check_mark: `endpoint.getTypedEndpoints` |
| POST | /v2.0/LinuxEndpoints | CreateLinuxEndpoint | :white_check_mark: `endpoint.create` (endpointType: linux) |
| GET | /v2.0/LinuxEndpoints/{id} | GetLinuxEndpoint | :white_check_mark: `endpoint.getTypedEndpoint` |
| PATCH | /v2.0/LinuxEndpoints/{id} | UpdateLinuxEndpoint | :white_check_mark: `endpoint.updateTypedEndpoint` |
| DELETE | /v2.0/LinuxEndpoints/{id} | DeleteLinuxEndpoint | :white_check_mark: `endpoint.deleteTypedEndpoint` |
| GET | /v2.0/LogicalGroups/{id}/LinuxEndpoints | GetLinuxEndpointsByLogicalGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/StaticGroups/{id}/LinuxEndpoints | GetLinuxEndpointsByStaticGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/UniversalDynamicGroups/{id}/LinuxEndpoints | GetLinuxEndpointsByUniversalDynamicGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/ADUsers/{id}/LinuxEndpoints | GetLinuxEndpointsByADObjectId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |

### macOS Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/MacEndpoints | GetMacEndpoints | :white_check_mark: `endpoint.getTypedEndpoints` |
| POST | /v2.0/MacEndpoints | CreateMacEndpoint | :white_check_mark: `endpoint.create` (endpointType: mac) |
| GET | /v2.0/MacEndpoints/{id} | GetMacEndpoint | :white_check_mark: `endpoint.getTypedEndpoint` |
| PATCH | /v2.0/MacEndpoints/{id} | UpdateMacEndpoint | :white_check_mark: `endpoint.updateTypedEndpoint` |
| DELETE | /v2.0/MacEndpoints/{id} | DeleteMacEndpoint | :white_check_mark: `endpoint.deleteTypedEndpoint` |
| POST | /v2.0/MacEndpoints/{id}/StartEnrollment | StartMacEndpointEnrollment | :white_check_mark: `endpoint.startTypedEnrollment` |
| GET | /v2.0/LogicalGroups/{id}/MacEndpoints | GetMacEndpointsByLogicalGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/StaticGroups/{id}/MacEndpoints | GetMacEndpointsByStaticGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/UniversalDynamicGroups/{id}/MacEndpoints | GetMacEndpointsByUniversalDynamicGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/ADUsers/{id}/MacEndpoints | GetMacEndpointsByADObjectId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |

### Network Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/NetworkEndpoints | GetNetworkEndpoints | :white_check_mark: `endpoint.getTypedEndpoints` |
| POST | /v2.0/NetworkEndpoints | CreateNetworkEndpoint | :white_check_mark: `endpoint.create` (endpointType: network) |
| GET | /v2.0/NetworkEndpoints/{id} | GetNetworkEndpoint | :white_check_mark: `endpoint.getTypedEndpoint` |
| PATCH | /v2.0/NetworkEndpoints/{id} | UpdateNetworkEndpoint | :white_check_mark: `endpoint.updateTypedEndpoint` |
| DELETE | /v2.0/NetworkEndpoints/{id} | DeleteNetworkEndpoint | :white_check_mark: `endpoint.deleteTypedEndpoint` |
| GET | /v2.0/LogicalGroups/{id}/NetworkEndpoints | GetNetworkEndpointsByLogicalGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/StaticGroups/{id}/NetworkEndpoints | GetNetworkEndpointsByStaticGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |
| GET | /v2.0/UniversalDynamicGroups/{id}/NetworkEndpoints | GetNetworkEndpointsByUniversalDynamicGroupId | :white_check_mark: `endpoint.getTypedEndpointsByGroup` |

### Logical Groups
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/LogicalGroups | GetLogicalGroups | :white_check_mark: |
| POST | /v2.0/LogicalGroups | CreateLogicalGroup | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id} | GetLogicalGroup | :white_check_mark: |
| PATCH | /v2.0/LogicalGroups/{id} | UpdateLogicalGroup | :white_check_mark: |
| DELETE | /v2.0/LogicalGroups/{id} | DeleteLogicalGroup | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id}/LogicalGroups | GetLogicalGroupsByLogicalGroupId | :white_check_mark: `endpoint.getLogicalGroupSubGroups` |

### Maintenance Windows
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Endpoints/{id}/MaintenanceWindow | GetMaintenanceWindowForEndpointById | :white_check_mark: `endpoint.getEndpointMaintenanceWindow` |
| POST | /v2.0/Endpoints/{id}/MaintenanceWindow | CreateMaintenanceWindowForEndpointById | :white_check_mark: |
| PUT | /v2.0/Endpoints/{id}/MaintenanceWindow | UpdateMaintenanceWindowForEndpointById | :white_check_mark: `endpoint.putEndpointMaintenanceWindow` |
| DELETE | /v2.0/Endpoints/{id}/MaintenanceWindow | DeleteMaintenanceWindowForEndpointById | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id}/MaintenanceWindow | GetMaintenanceWindowForLogicalGroupById | :white_check_mark: `endpoint.getGroupMaintenanceWindow` |
| POST | /v2.0/LogicalGroups/{id}/MaintenanceWindow | CreateMaintenanceWindowForLogicalGroupById | :white_check_mark: |
| PUT | /v2.0/LogicalGroups/{id}/MaintenanceWindow | UpdateMaintenanceWindowForLogicalGroupById | :white_check_mark: `endpoint.putGroupMaintenanceWindow` |
| DELETE | /v2.0/LogicalGroups/{id}/MaintenanceWindow | DeleteMaintenanceWindowForLogicalGroupById | :white_check_mark: |

> **Note:** 25R2 uses PUT for maintenance window updates; 26R1 uses PATCH. The connector implements both (`put*MaintenanceWindow` for 25R2, `update*MaintenanceWindow` for 26R1).

**Endpoints Summary: 112/112 implemented (100%)**

> **Note:** Remaining gaps: CREATE for non-Windows, non-Industrial platforms (Android, iOS, Linux, macOS, Network — 5 operations).

---

## 5. Jobs API (`bConnect_Jobs.json`)

### Folders
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Folders | GetFolders | :white_check_mark: |
| POST | /v2.0/Folders | CreateFolder | :white_check_mark: |
| GET | /v2.0/Folders/{id} | GetFolder | :white_check_mark: |
| PATCH | /v2.0/Folders/{id} | UpdateFolder | :white_check_mark: |
| DELETE | /v2.0/Folders/{id} | DeleteFolder | :white_check_mark: |
| GET | /v2.0/Folders/{id}/Folders | GetFoldersByFolderId | :white_check_mark: `job.getSubFolders` |

### Job Definitions
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/JobDefinitions | GetJobDefinitions | :white_check_mark: |
| GET | /v2.0/JobDefinitions/{id} | GetJobDefinition | :white_check_mark: |
| GET | /v2.0/Folders/{id}/JobDefinitions | GetJobDefinitionsByFolderId | :white_check_mark: `job.getJobDefinitionsByFolder` |
| GET | /v2.0/JobDefinitions/{id}/JobInstances | GetJobInstancesByJobDefinitionId | :white_check_mark: |
| GET | /v2.0/JobDefinitions/{id}/KioskReleases | GetKioskReleasesByJobDefinitionId | :white_check_mark: `job.getKioskReleasesByJobDefinition` |

### Job Instances
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/JobInstances | GetJobInstances | :white_check_mark: |
| POST | /v2.0/JobInstances | CreateJobInstance | :white_check_mark: |
| GET | /v2.0/JobInstances/{id} | GetJobInstance | :white_check_mark: |
| DELETE | /v2.0/JobInstances/{id} | DeleteJobInstance | :white_check_mark: |
| POST | /v2.0/JobInstances/{id}/Start | StartJobInstance | :white_check_mark: |
| POST | /v2.0/JobInstances/{id}/Stop | StopJobInstance | :white_check_mark: |
| POST | /v2.0/JobInstances/{id}/Resume | ResumeJobInstance | :white_check_mark: |
| GET | /v2.0/Endpoints/{id}/JobInstances | GetJobInstancesByEndpointId | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id}/JobInstances | GetJobInstancesByLogicalGroupId | :white_check_mark: `job.getJobInstancesByLogicalGroup` |
| GET | /v2.0/StaticGroups/{id}/JobInstances | GetJobInstancesByStaticGroupId | :white_check_mark: `job.getJobInstancesByStaticGroup` |
| GET | /v2.0/DynamicGroups/{id}/JobInstances | GetJobInstancesByDynamicGroupId | :white_check_mark: `job.getJobInstancesByDynamicGroup` |
| GET | /v2.0/UniversalDynamicGroups/{id}/JobInstances | GetJobInstancesByUniversalDynamicGroupId | :white_check_mark: `job.getJobInstancesByUDG` |

### Job Definition Assignment
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| POST | /v2.0/LogicalGroups/{id}/AssignJobDefinition | AssignJobDefinitionToLogicalGroup | :white_check_mark: `job.assignJobToLogicalGroup` |
| POST | /v2.0/StaticGroups/{id}/AssignJobDefinition | AssignJobDefinitionToStaticGroup | :white_check_mark: `job.assignJobToStaticGroup` |
| POST | /v2.0/DynamicGroups/{id}/AssignJobDefinition | AssignJobDefinitionToWindowsDynamicGroup | :white_check_mark: `job.assignJobToDynamicGroup` |
| POST | /v2.0/UniversalDynamicGroups/{id}/AssignJobDefinition | AssignJobDefinitionToUniversalDynamicGroup | :white_check_mark: `job.assignJobToUDG` |

### Kiosk Releases
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/KioskReleases | GetKioskReleases | :white_check_mark: |
| POST | /v2.0/KioskReleases | CreateKioskRelease | :white_check_mark: |
| GET | /v2.0/KioskReleases/{id} | GetKioskRelease | :white_check_mark: |
| DELETE | /v2.0/KioskReleases/{id} | WithdrawKioskRelease | :white_check_mark: |
| GET | /v2.0/ADObjects/{id}/KioskReleases | GetKioskReleasesByAdObjectId | :white_check_mark: `job.getKioskReleasesByADObject` |
| GET | /v2.0/JobDefinitions/{id}/KioskReleases | GetKioskReleasesByJobDefinitionId | :white_check_mark: `job.getKioskReleasesByJobDefinition` |
| GET | /v2.0/Endpoints/{id}/KioskReleases | GetKioskReleasesByEndpointId | :white_check_mark: `job.getKioskReleasesByEndpoint` |
| GET | /v2.0/LogicalGroups/{id}/KioskReleases | GetKioskReleasesByLogicalGroupId | :white_check_mark: `job.getKioskReleasesByLogicalGroup` |

**Jobs Summary: 33/33 implemented (100%)**

---

## 6. Operating Systems API (`bConnect_OperatingSystems.json`)

| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Folders | GetFolders | :white_check_mark: |
| POST | /v2.0/Folders | CreateFolder | :white_check_mark: |
| GET | /v2.0/Folders/{id} | GetFolder | :white_check_mark: |
| PATCH | /v2.0/Folders/{id} | UpdateFolder | :white_check_mark: |
| DELETE | /v2.0/Folders/{id} | DeleteFolder | :white_check_mark: |
| GET | /v2.0/Folders/{id}/Folders | GetFoldersByFolderId | :white_check_mark: |
| GET | /v2.0/WindowsEndpoints | GetWindowsEndpoints | :white_check_mark: |
| GET | /v2.0/WindowsEndpoints/{id} | GetWindowsEndpoint | :white_check_mark: |
| PATCH | /v2.0/WindowsEndpoints/{id} | UpdateWindowsEndpoint | :white_check_mark: |

**Operating Systems Summary: 9/9 implemented (100%)**

---

## 7. Server Management API (`bConnect_ServerManagement.json`)

### Management Server
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ManagementServer | GetManagementServer | :white_check_mark: |
| POST | /v2.0/Restart | RestartBaramundiManagementServer | :white_check_mark: |
| POST | /v2.0/CancelScheduledRestart | CancelScheduledRestartBaramundiManagementServer | :white_check_mark: |

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
| GET | /v2.0/Dips | GetDipStatus | :white_check_mark: |

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

**Server Management Summary: 25/25 implemented (100%)**

> **Note:** 25R2 does NOT have ApiKeys, DownloadJobs, or DIP MSW Cleanup/Simulate endpoints — those are 26R1-only.

---

## 8. Software API (`bConnect_Software.json`)

| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/InstalledWindowsSoftware | GetInstalledWindowsSoftware | :white_check_mark: |
| GET | /v2.0/WindowsEndpoints/{id}/InstalledWindowsSoftware | GetInstalledWindowsSoftwareByEndpointId | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id}/InstalledWindowsSoftware | GetInstalledWindowsSoftwareByLogicalGroupId | :white_check_mark: |
| GET | /v2.0/UniversalDynamicGroups/{id}/InstalledWindowsSoftware | GetInstalledWindowsSoftwareByUniversalDynamicGroupId | :white_check_mark: |

**Software Summary: 4/4 implemented (100%)**

> **Note:** 25R2 does NOT have Bundles, Bundle Folders, or Bundle Applications — those are 26R1-only.

---

## 9. Update Management API (`bConnect_UpdateManagement.json`)

| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/WindowsEndpoints | GetWindowsEndpoints | :white_check_mark: |
| GET | /v2.0/WindowsEndpoints/{id} | GetWindowsEndpoint | :white_check_mark: |
| PATCH | /v2.0/WindowsEndpoints/{id} | UpdateWindowsEndpoint | :white_check_mark: |

**Update Management Summary: 3/3 implemented (100%)**

---

## 10. Variables API (`bConnect_Variables.json`)

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
| GET | /v2.0/WindowsJobDefinitions/{id}/VariableInstances | GetVariableInstancesByWindowsJobDefinitonId | :white_check_mark: `variable.getVariableInstancesByJobDefinition` |
| GET | /v2.0/WindowsApplications/{id}/VariableInstances | GetVariableInstancesByWindowsApplicationId | :white_check_mark: `variable.getVariableInstancesByApplication` |

**Variables Summary: 13/13 implemented (100%)**

---

## Overall Summary — 25R2

| API Module | Implemented | Total | Coverage |
|------------|------------|-------|----------|
| Active Directory | 17 | 17 | **100%** |
| Assets | 24 | 24 | **100%** |
| Defense Control | 11 | 11 | **100%** |
| Endpoints | 112 | 112 | **100%** |
| Jobs | 33 | 33 | **100%** |
| Operating Systems | 9 | 9 | **100%** |
| Server Management | 25 | 25 | **100%** |
| Software | 4 | 4 | **100%** |
| Update Management | 3 | 3 | **100%** |
| Variables | 13 | 13 | **100%** |
| **TOTAL** | **251** | **251** | **100%** |

### APIs NOT in 25R2 (26R1-only)
- **Compliance API** — entire module (8 endpoints)
- **Universal Dynamic Groups API** — entire module (6 endpoints)
- **Software Bundles** — Bundles, Bundle Folders, Bundle Applications (16 endpoints)
- **Entra ID Data** — set/get/delete (3 endpoints)
- **Unmanaged Endpoints** — get/delete (3 endpoints)
- **API Keys, Download Jobs, DIP MSW Cleanup** (5 endpoints)
- **BitLocker Secrets** (2 endpoints)

### Key Gaps (25R2-specific)

None. All 251 API operations are implemented. The unified `endpoint.create` function handles all platform types (windows, android, ios, linux, mac, network) via the `endpointType` parameter.

### 25R2 vs 26R1 Differences

| Feature | 25R2 | 26R1 |
|---------|------|------|
| Industrial Endpoints | :white_check_mark: Available | :x: Removed |
| Compliance API | :x: | :white_check_mark: New |
| Universal Dynamic Groups API | :x: | :white_check_mark: New |
| Software Bundles | :x: | :white_check_mark: New |
| Entra ID Data | :x: | :white_check_mark: New |
| Unmanaged Endpoints | :x: | :white_check_mark: New |
| API Keys | :x: | :white_check_mark: New |
| Download Jobs | :x: | :white_check_mark: New |
| DIP MSW Cleanup | :x: | :white_check_mark: New |
| BitLocker Secrets | :x: | :white_check_mark: New |
| Maintenance Window Update | PUT (full replace) | PATCH (partial update) |
