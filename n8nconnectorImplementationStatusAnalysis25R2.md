# n8n Connector Implementation Status Analysis — bMS 25R2

**Generated:** 2026-03-31
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
| GET | /v2.0/ADGroups/{adGroupId}/ADGroups | GetADGroupsByADGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/OrgUnits/{orgUnitId}/ADGroups | GetADGroupsByOrgUnitId | :white_check_mark: `activeDirectory.getADGroupsByOrgUnit` |

### AD Objects
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ADObjects | GetADObjects | :white_check_mark: `activeDirectory.getADObjects` |
| GET | /v2.0/ADObjects/{id} | GetADObjectById | :white_check_mark: `activeDirectory.getADObject` |
| GET | /v2.0/ADObjects/{id}/ADGroupMemberships | GetADObjectMemberships | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADGroups/{adGroupId}/ADObjects | GetADObjectsByADGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/OrgUnits/{orgUnitId}/ADObjects | GetADObjectsByOrgUnitId | :x: **NOT IMPLEMENTED** |

### AD Users
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/ADUsers | GetADUsers | :white_check_mark: `activeDirectory.getADUsers` |
| GET | /v2.0/ADUsers/{id} | GetADUserById | :white_check_mark: `activeDirectory.getADUser` |
| GET | /v2.0/ADGroups/{adGroupId}/ADUsers | GetADUsersByADGroupId | :white_check_mark: `activeDirectory.getADUsersByGroup` |
| GET | /v2.0/OrgUnits/{orgUnitId}/ADUsers | GetADUsersByOrgUnitId | :x: **NOT IMPLEMENTED** |

### Organizational Units
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/OrgUnits | GetOrgUnits | :white_check_mark: `activeDirectory.getOrgUnits` |
| GET | /v2.0/OrgUnits/{id} | GetOrgUnit | :white_check_mark: `activeDirectory.getOrgUnit` |
| GET | /v2.0/OrgUnits/{orgUnitId}/OrgUnits | GetOrgUnitsByOrgUnitId | :x: **NOT IMPLEMENTED** |

**Active Directory Summary: 10/17 implemented (58.8%)**

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
| GET | /v2.0/AssetStock/Folders/{id} | GetAssetStockFolder | :x: **NOT IMPLEMENTED** (single folder by ID) |
| PATCH | /v2.0/AssetStock/Folders/{id} | UpdateAssetStockFolder | :white_check_mark: `asset.updateAssetStockFolder` |
| DELETE | /v2.0/AssetStock/Folders/{id} | DeleteAssetStockFolder | :white_check_mark: `asset.deleteAssetStockFolder` |
| GET | /v2.0/AssetStock/Folders/{id}/Folders | GetAssetStockFoldersByParentId | :x: **NOT IMPLEMENTED** |

### Asset Type Folders
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AssetTypes/Folders | GetAssetTypeFolders | :x: **NOT IMPLEMENTED** |
| POST | /v2.0/AssetTypes/Folders | CreateAssetTypeFolder | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/AssetTypes/Folders/{id} | GetAssetTypeFolder | :x: **NOT IMPLEMENTED** |
| PATCH | /v2.0/AssetTypes/Folders/{id} | UpdateAssetTypeFolder | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/AssetTypes/Folders/{id} | DeleteAssetTypeFolder | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/AssetTypes/Folders/{id}/Folders | GetAssetTypeFoldersByParentId | :x: **NOT IMPLEMENTED** |

### Asset Types
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/AssetTypes | GetAssetTypes | :white_check_mark: `asset.getAssetTypes` |
| POST | /v2.0/AssetTypes | CreateAssetType | :white_check_mark: `asset.createAssetType` |
| GET | /v2.0/AssetTypes/{id} | GetAssetType | :white_check_mark: `asset.getAssetType` |
| DELETE | /v2.0/AssetTypes/{id} | DeleteAssetType | :white_check_mark: `asset.deleteAssetType` |

**Assets Summary: 14/24 implemented (58.3%)**

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
| GET | /v2.0/LogicalGroups/{id}/Endpoints | GetEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/Endpoints | GetEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/DynamicGroups/{id}/Endpoints | GetEndpointsByDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/Endpoints | GetEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/Endpoints | GetEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### Windows Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/WindowsEndpoints | GetWindowsEndpoints | :warning: Via `endpoint.getMany` |
| POST | /v2.0/WindowsEndpoints | CreateWindowsEndpoint | :white_check_mark: `endpoint.create` |
| GET | /v2.0/WindowsEndpoints/{id} | GetWindowsEndpoint | :warning: Via `endpoint.get` |
| PATCH | /v2.0/WindowsEndpoints/{id} | UpdateWindowsEndpoint | :white_check_mark: `endpoint.update` |
| DELETE | /v2.0/WindowsEndpoints/{id} | DeleteWindowsEndpoint | :warning: Via `endpoint.delete` |
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
| GET | /v2.0/AndroidEndpoints | GetAndroidEndpoints | :warning: Via `endpoint.getMany` |
| POST | /v2.0/AndroidEndpoints | CreateAndroidEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/AndroidEndpoints/{id} | GetAndroidEndpoint | :warning: Via `endpoint.get` |
| PATCH | /v2.0/AndroidEndpoints/{id} | UpdateAndroidEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/AndroidEndpoints/{id} | DeleteAndroidEndpoint | :warning: Via `endpoint.delete` |
| POST | /v2.0/AndroidEndpoints/{id}/StartEnrollment | StartAndroidEndpointEnrollment | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LogicalGroups/{id}/AndroidEndpoints | GetAndroidEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/AndroidEndpoints | GetAndroidEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/AndroidEndpoints | GetAndroidEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/AndroidEndpoints | GetAndroidEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### iOS Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/IosEndpoints | GetIOSEndpoints | :warning: Via `endpoint.getMany` |
| POST | /v2.0/IosEndpoints | CreateIOSEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/IosEndpoints/{id} | GetIOSEndpoint | :warning: Via `endpoint.get` |
| PATCH | /v2.0/IosEndpoints/{id} | UpdateIOSEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/IosEndpoints/{id} | DeleteIOSEndpoint | :warning: Via `endpoint.delete` |
| POST | /v2.0/IosEndpoints/{id}/StartEnrollment | StartIosEndpointEnrollment | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LogicalGroups/{id}/IosEndpoints | GetIOSEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/IosEndpoints | GetIOSEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/IosEndpoints | GetIOSEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/IosEndpoints | GetIOSEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### Industrial Endpoints (25R2-specific, not in 26R1)
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/IndustrialEndpoints | GetIndustrialEndpoints | :x: **NOT IMPLEMENTED** |
| POST | /v2.0/IndustrialEndpoints | CreateIndustrialEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/IndustrialEndpoints/{id} | GetIndustrialEndpoint | :x: **NOT IMPLEMENTED** |
| PATCH | /v2.0/IndustrialEndpoints/{id} | UpdateIndustrialEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/IndustrialEndpoints/{id} | DeleteIndustrialEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LogicalGroups/{id}/IndustrialEndpoints | GetIndustrialEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/IndustrialEndpoints | GetIndustrialEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/IndustrialEndpoints | GetIndustrialEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |

### Linux Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/LinuxEndpoints | GetLinuxEndpoints | :warning: Via `endpoint.getMany` |
| POST | /v2.0/LinuxEndpoints | CreateLinuxEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LinuxEndpoints/{id} | GetLinuxEndpoint | :warning: Via `endpoint.get` |
| PATCH | /v2.0/LinuxEndpoints/{id} | UpdateLinuxEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/LinuxEndpoints/{id} | DeleteLinuxEndpoint | :warning: Via `endpoint.delete` |
| GET | /v2.0/LogicalGroups/{id}/LinuxEndpoints | GetLinuxEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/LinuxEndpoints | GetLinuxEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/LinuxEndpoints | GetLinuxEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/LinuxEndpoints | GetLinuxEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### macOS Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/MacEndpoints | GetMacEndpoints | :warning: Via `endpoint.getMany` |
| POST | /v2.0/MacEndpoints | CreateMacEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/MacEndpoints/{id} | GetMacEndpoint | :warning: Via `endpoint.get` |
| PATCH | /v2.0/MacEndpoints/{id} | UpdateMacEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/MacEndpoints/{id} | DeleteMacEndpoint | :warning: Via `endpoint.delete` |
| POST | /v2.0/MacEndpoints/{id}/StartEnrollment | StartMacEndpointEnrollment | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LogicalGroups/{id}/MacEndpoints | GetMacEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/MacEndpoints | GetMacEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/MacEndpoints | GetMacEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/ADUsers/{id}/MacEndpoints | GetMacEndpointsByADObjectId | :x: **NOT IMPLEMENTED** |

### Network Endpoints
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/NetworkEndpoints | GetNetworkEndpoints | :warning: Via `endpoint.getMany` |
| POST | /v2.0/NetworkEndpoints | CreateNetworkEndpoint | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/NetworkEndpoints/{id} | GetNetworkEndpoint | :warning: Via `endpoint.get` |
| PATCH | /v2.0/NetworkEndpoints/{id} | UpdateNetworkEndpoint | :x: **NOT IMPLEMENTED** |
| DELETE | /v2.0/NetworkEndpoints/{id} | DeleteNetworkEndpoint | :warning: Via `endpoint.delete` |
| GET | /v2.0/LogicalGroups/{id}/NetworkEndpoints | GetNetworkEndpointsByLogicalGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/StaticGroups/{id}/NetworkEndpoints | GetNetworkEndpointsByStaticGroupId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/UniversalDynamicGroups/{id}/NetworkEndpoints | GetNetworkEndpointsByUniversalDynamicGroupId | :x: **NOT IMPLEMENTED** |

### Logical Groups
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/LogicalGroups | GetLogicalGroups | :white_check_mark: |
| POST | /v2.0/LogicalGroups | CreateLogicalGroup | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id} | GetLogicalGroup | :white_check_mark: |
| PATCH | /v2.0/LogicalGroups/{id} | UpdateLogicalGroup | :white_check_mark: |
| DELETE | /v2.0/LogicalGroups/{id} | DeleteLogicalGroup | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id}/LogicalGroups | GetLogicalGroupsByLogicalGroupId | :x: **NOT IMPLEMENTED** |

### Maintenance Windows
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/Endpoints/{id}/MaintenanceWindow | GetMaintenanceWindowForEndpointById | :x: **NOT IMPLEMENTED** (get) |
| POST | /v2.0/Endpoints/{id}/MaintenanceWindow | CreateMaintenanceWindowForEndpointById | :white_check_mark: |
| PUT | /v2.0/Endpoints/{id}/MaintenanceWindow | UpdateMaintenanceWindowForEndpointById | :white_check_mark: `endpoint.putEndpointMaintenanceWindow` |
| DELETE | /v2.0/Endpoints/{id}/MaintenanceWindow | DeleteMaintenanceWindowForEndpointById | :white_check_mark: |
| GET | /v2.0/LogicalGroups/{id}/MaintenanceWindow | GetMaintenanceWindowForLogicalGroupById | :x: **NOT IMPLEMENTED** (get) |
| POST | /v2.0/LogicalGroups/{id}/MaintenanceWindow | CreateMaintenanceWindowForLogicalGroupById | :white_check_mark: |
| PUT | /v2.0/LogicalGroups/{id}/MaintenanceWindow | UpdateMaintenanceWindowForLogicalGroupById | :white_check_mark: `endpoint.putGroupMaintenanceWindow` |
| DELETE | /v2.0/LogicalGroups/{id}/MaintenanceWindow | DeleteMaintenanceWindowForLogicalGroupById | :white_check_mark: |

> **Note:** 25R2 uses PUT for maintenance window updates; 26R1 uses PATCH. The connector implements both (`put*MaintenanceWindow` for 25R2, `update*MaintenanceWindow` for 26R1).

**Endpoints Summary: ~30/112 directly implemented + many covered via unified operations (~45% effective coverage)**

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
| GET | /v2.0/Folders/{id}/Folders | GetFoldersByFolderId | :x: **NOT IMPLEMENTED** |

### Job Definitions
| Method | Path | OperationId | Status |
|--------|------|-------------|--------|
| GET | /v2.0/JobDefinitions | GetJobDefinitions | :white_check_mark: |
| GET | /v2.0/JobDefinitions/{id} | GetJobDefinition | :white_check_mark: |
| GET | /v2.0/Folders/{id}/JobDefinitions | GetJobDefinitionsByFolderId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/JobDefinitions/{id}/JobInstances | GetJobInstancesByJobDefinitionId | :white_check_mark: |
| GET | /v2.0/JobDefinitions/{id}/KioskReleases | GetKioskReleasesByJobDefinitionId | :x: **NOT IMPLEMENTED** |

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
| GET | /v2.0/KioskReleases | GetKioskReleases | :white_check_mark: |
| POST | /v2.0/KioskReleases | CreateKioskRelease | :white_check_mark: |
| GET | /v2.0/KioskReleases/{id} | GetKioskRelease | :white_check_mark: |
| DELETE | /v2.0/KioskReleases/{id} | WithdrawKioskRelease | :white_check_mark: |
| GET | /v2.0/ADObjects/{id}/KioskReleases | GetKioskReleasesByAdObjectId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/JobDefinitions/{id}/KioskReleases | GetKioskReleasesByJobDefinitionId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/Endpoints/{id}/KioskReleases | GetKioskReleasesByEndpointId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/LogicalGroups/{id}/KioskReleases | GetKioskReleasesByLogicalGroupId | :x: **NOT IMPLEMENTED** |

**Jobs Summary: 19/33 implemented (57.6%)**

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
| GET | /v2.0/WindowsJobDefinitions/{id}/VariableInstances | GetVariableInstancesByWindowsJobDefinitonId | :x: **NOT IMPLEMENTED** |
| GET | /v2.0/WindowsApplications/{id}/VariableInstances | GetVariableInstancesByWindowsApplicationId | :x: **NOT IMPLEMENTED** |

**Variables Summary: 11/13 implemented (84.6%)**

---

## Overall Summary — 25R2

| API Module | Implemented | Total | Coverage |
|------------|------------|-------|----------|
| Active Directory | 10 | 17 | 58.8% |
| Assets | 14 | 24 | 58.3% |
| Defense Control | 11 | 11 | **100%** |
| Endpoints | ~30 | 112 | ~27% (45% effective) |
| Jobs | 19 | 33 | 57.6% |
| Operating Systems | 9 | 9 | **100%** |
| Server Management | 25 | 25 | **100%** |
| Software | 4 | 4 | **100%** |
| Update Management | 3 | 3 | **100%** |
| Variables | 11 | 13 | 84.6% |
| **TOTAL** | **~136** | **~251** | **~54.2%** |

### APIs NOT in 25R2 (26R1-only)
- **Compliance API** — entire module (8 endpoints)
- **Universal Dynamic Groups API** — entire module (6 endpoints)
- **Software Bundles** — Bundles, Bundle Folders, Bundle Applications (16 endpoints)
- **Entra ID Data** — set/get/delete (3 endpoints)
- **Unmanaged Endpoints** — get/delete (3 endpoints)
- **API Keys, Download Jobs, DIP MSW Cleanup** (5 endpoints)
- **BitLocker Secrets** (2 endpoints)

### Key Gaps (25R2-specific)

1. **Industrial Endpoints:** Entire sub-resource (8 endpoints) — present in 25R2 but NOT in 26R1 and NOT implemented in connector.
2. **Endpoints — type-specific operations:** Same gap as 26R1 — create/update/enrollment only for Windows.
3. **Endpoints — group-scoped queries:** Not implemented for any endpoint type.
4. **Asset Type Folders:** Entire sub-resource not implemented (6 endpoints).
5. **Job Assignment:** AssignJobDefinition to groups not implemented.
6. **Variable Instances** by WindowsApplication and WindowsJobDefinition not implemented.
7. **Active Directory** sub-navigation (ADGroups by ADGroup, ADObjects by ADGroup/OrgUnit, etc.) partially missing.
8. **Maintenance Window GET:** Cannot retrieve existing maintenance windows (only create/update/delete).

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
