# bConnect n8n Connector Coverage Analysis

## Executive Summary

- Total API Endpoints: 228
- Implemented in n8n: 130
- Missing from n8n: 98
- Coverage: 57.0%

## ActiveDirectory
n8n Action: `activeDirectory`
Coverage: 0/16 (0.0%)

### Missing Endpoints (16/16)

- GET `/v2.0/ADGroups` - Get all AD groups
  - OperationId: `GetADGroups`
- GET `/v2.0/ADGroups/{id}` - Get information for a specific AD group
  - OperationId: `GetADGroupById`
- GET `/v2.0/ADGroups/{adGroupId}/ADGroups` - Get AD Groups (sub groups) for a specific AD group
  - OperationId: `GetADGroupsByADGroupId`
- GET `/v2.0/OrgUnits/{orgUnitId}/ADGroups` - Gets AD groups by organization unit
  - OperationId: `GetADGroupsByOrgUnitId`
- GET `/v2.0/ADObjects` - Get all AD users and groups
  - OperationId: `GetADObjects`
- GET `/v2.0/ADObjects/{id}` - Get information for a specific AD object
  - OperationId: `GetADObjectById`
- GET `/v2.0/ADObjects/{id}/ADGroupMemberships` - Get the AD groups where the specified AD object is a member
  - OperationId: `GetADObjectMemberships`
- GET `/v2.0/ADGroups/{adGroupId}/ADObjects` - Get AD objects for a specific AD group
  - OperationId: `GetADObjectsByADGroupId`
- GET `/v2.0/OrgUnits/{orgUnitId}/ADObjects` - Gets all AD objects contained by a logical group
  - OperationId: `GetADObjectsByOrgUnitId`
- GET `/v2.0/ADUsers` - Get all AD users
  - OperationId: `GetADUsers`
- GET `/v2.0/ADUsers/{id}` - Get information for a specific AD user
  - OperationId: `GetADUserById`
- GET `/v2.0/ADGroups/{adGroupId}/ADUsers` - Get AD Users for a specific AD group
  - OperationId: `GetADUsersByADGroupId`
- GET `/v2.0/OrgUnits/{orgUnitId}/ADUsers` - Gets AD users by organization unit
  - OperationId: `GetADUsersByOrgUnitId`
- GET `/v2.0/OrgUnits` - Gets all org units
  - OperationId: `GetOrgUnits`
- GET `/v2.0/OrgUnits/{id}` - Gets an org unit by id
  - OperationId: `GetOrgUnit`
- GET `/v2.0/OrgUnits/{orgUnitId}/OrgUnits` - Gets all org units contained by an org unit
  - OperationId: `GetOrgUnitsByOrgUnitId`

---

## Assets
n8n Action: `asset`
Coverage: 20/24 (83.3%)

### Implemented Endpoints (20/24)

- POST `/v2.0/Assets` - Creates an asset
  - OperationId: `CreateAsset`
- GET `/v2.0/Assets/{id}` - Gets an asset by id
  - OperationId: `GetAsset`
- PATCH `/v2.0/Assets/{id}` - Updates an asset
  - OperationId: `UpdateAsset`
- DELETE `/v2.0/Assets/{id}` - Deletes an asset by id
  - OperationId: `DeleteAsset`
- GET `/v2.0/AssetStock/Assets` - Gets assets contained by the asset stock
  - OperationId: `GetAssetsAssetStock`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/Assets` - Gets all assets contained by logical group
  - OperationId: `GetAssetsByLogicalGroup`
- GET `/v2.0/WindowsEndpoint/{endpointId}/Assets` - Gets all assets contained by windows endpoint
  - OperationId: `GetAssetsByWindowsEndpoint`
- POST `/v2.0/AssetStock/Folders` - Creates a folder according to the specified properties
  - OperationId: `CreateAssetStockFolder`
- GET `/v2.0/AssetStock/Folders/{id}` - Gets a folder by id
  - OperationId: `GetAssetStockFolder`
- PATCH `/v2.0/AssetStock/Folders/{id}` - Updates a folder according to the specified properties
  - OperationId: `UpdateAssetStockFolder`
- DELETE `/v2.0/AssetStock/Folders/{id}` - Deletes a folder by id
  - OperationId: `DeleteAssetStockFolder`
- GET `/v2.0/AssetStock/Folders/{folderId}/Folders` - Gets all folders contained by a folder
  - OperationId: `GetAssetStockFoldersByParentId`
- POST `/v2.0/AssetTypes/Folders` - Creates a folder according to the specified properties
  - OperationId: `CreateAssetTypeFolder`
- GET `/v2.0/AssetTypes/Folders/{id}` - Gets a folder by id
  - OperationId: `GetAssetTypeFolder`
- PATCH `/v2.0/AssetTypes/Folders/{id}` - Updates a folder according to the specified properties
  - OperationId: `UpdateAssetTypeFolder`
- DELETE `/v2.0/AssetTypes/Folders/{id}` - Deletes a folder by id
  - OperationId: `DeleteAssetTypeFolder`
- GET `/v2.0/AssetTypes/Folders/{folderId}/Folders` - Gets all folders contained by a folder
  - OperationId: `GetAssetTypeFoldersByParentId`
- POST `/v2.0/AssetTypes` - Creates an asset type
  - OperationId: `CreateAssetType`
- GET `/v2.0/AssetTypes/{id}` - Gets an asset type by id
  - OperationId: `GetAssetType`
- DELETE `/v2.0/AssetTypes/{id}` - Deletes an asset type by id
  - OperationId: `DeleteAssetType`

### Missing Endpoints (4/24)

- GET `/v2.0/Assets` - Gets all assets
  - OperationId: `GetAssets`
- GET `/v2.0/AssetStock/Folders` - Gets all folders
  - OperationId: `GetAssetStockFolders`
- GET `/v2.0/AssetTypes/Folders` - Gets all folders
  - OperationId: `GetAssetTypeFolders`
- GET `/v2.0/AssetTypes` - Gets all assets types
  - OperationId: `GetAssetTypes`

---

## DefenseControl
n8n Action: `defenseControl`
Coverage: 0/11 (0.0%)

### Missing Endpoints (11/11)

- GET `/v2.0/BitLocker/WindowsEndpoints` - Get information concerning BitLocker for all windows endpoints
  - OperationId: `GetBitLockerStates`
- GET `/v2.0/BitLocker/WindowsEndpoints/{id}` - Get information concerning BitLocker for a specific windows endpoint
  - OperationId: `GetBitLockerStatesByWindowsEndpointId`
- GET `/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id}` - Get local admin account information for a specific windows endpoint
  - OperationId: `GetLocalAdminUserCredentialsByWindowsEndpointId`
- PATCH `/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id}` - Change the expiration date of local admin account for a specific windows endpoint. You can only patch the 'requested expiration date'. Setting the property to a date in the past will trigger the generation of new credentials on the endpoint. The requested expiration date is set until the client acknowledges the request. After acknowledging the request, the 'requested expiration date' will be set to 'null' and the 'expiration date' will contain the new expiration date. You can trigger an immediate update of the expiration date on an endpoint by using the 'TriggerUpdateOnClient' [POST] action.
  - OperationId: `PatchLocalAdminUserCredentialsForWindowsEndpointId`
- POST `/v2.0/LocalAdministrativeAccounts/WindowsEndpoints/{id}/TriggerUpdateOnClient` - Request a client to immediately update the expiration date of its' local administrative account. This only works if the client is online. You can specify a timeout with the 'timeout' query parameter. The default timeout is 30 seconds
  - OperationId: `TriggerUpdateOnClient`
- GET `/v2.0/MicrosoftDefender/Threats` - Get all threats found by Microsoft Defender
  - OperationId: `GetMicrosoftDefenderThreats`
- GET `/v2.0/MicrosoftDefender/Threats/{id}` - Get a threat by id
  - OperationId: `GetMicrosoftDefenderThreat`
- GET `/v2.0/MicrosoftDefender/WindowsEndpoints/{endpointId}/Threats` - Get all threats found by Microsoft Defender for a specific windows endpoint
  - OperationId: `GetMicrosoftDefenderThreatsByWindowsEndpointId`
- GET `/v2.0/MicrosoftDefender/LogicalGroups/{logicalGroupId}/Threats` - Get all threats found by Microsoft Defender for a specific logical group
  - OperationId: `GetMicrosoftDefenderThreatsByLogicalGroupId`
- GET `/v2.0/MicrosoftDefender/WindowsEndpoints` - Retrieves information concerning Microsoft Defender state on windows endpoints
  - OperationId: `GetMicrosoftDefenderStates`
- GET `/v2.0/MicrosoftDefender/WindowsEndpoints/{id}` - Retrieves information concerning Microsoft Defender state for a single windows endpoint
  - OperationId: `GetMicrosoftDefenderStatesByWindowsEndpointId`

---

## Endpoints
n8n Action: `endpoint`
Coverage: 80/89 (89.9%)

### Implemented Endpoints (80/89)

- POST `/v2.0/AndroidEndpoints` - Creates an android endpoint according to the specified properties
  - OperationId: `CreateAndroidEndpoint`
- GET `/v2.0/AndroidEndpoints/{id}` - Gets an android endpoint by id
  - OperationId: `GetAndroidEndpoint`
- PATCH `/v2.0/AndroidEndpoints/{id}` - Modifies an android endpoint according to the specified properties
  - OperationId: `UpdateAndroidEndpoint`
- DELETE `/v2.0/AndroidEndpoints/{id}` - Deletes an endpoint by id
  - OperationId: `DeleteAndroidEndpoint`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/AndroidEndpoints` - Gets all android endpoints contained by a logical group
  - OperationId: `GetAndroidEndpointsByLogicalGroupId`
- GET `/v2.0/StaticGroups/{staticGroupId}/AndroidEndpoints` - Gets all android endpoints contained by a static group
  - OperationId: `GetAndroidEndpointsByStaticGroupId`
- GET `/v2.0/ADUsers/{adUserId}/AndroidEndpoints` - Gets all android endpoints assigned to a specific registered user
  - OperationId: `GetAndroidEndpointsByADObjectId`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/AndroidEndpoints` - Gets all android endpoints contained by a universal dynamic group
  - OperationId: `GetAndroidEndpointsByUniversalDynamicGroupId`
- POST `/v2.0/AndroidEndpoints/{id}/StartEnrollment` - Provides functionality to trigger enrollment state of a Android endpoint.By specifying an e-mail recipient, you can also have a corresponding e-mail with the enrollment information sent automatically.The EmailLanguageId holds the identifier of the email template, which will be used for the email enrollment message sent to the recipient.By default “de-DE” and “en-US” are available. If this property is not set, the Email template with the Id “en-US” will be used.
  - OperationId: `StartAndroidEndpointEnrollment`
- GET `/v2.0/Endpoints/{id}` - Gets an endpoint by id
  - OperationId: `GetEndpoint`
- DELETE `/v2.0/Endpoints/{id}` - Deletes an endpoint by id
  - OperationId: `DeleteEndpoint`
- GET `/v2.0/ADUsers/{adUserId}/Endpoints` - Gets all endpoints assigned to a specific registered user
  - OperationId: `GetEndpointsByADObjectId`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/Endpoints` - Gets all endpoints contained by a logical group
  - OperationId: `GetEndpointsByLogicalGroupId`
- GET `/v2.0/StaticGroups/{staticGroupId}/Endpoints` - Gets all endpoints contained by a static group
  - OperationId: `GetEndpointsByStaticGroupId`
- GET `/v2.0/DynamicGroups/{dynamicGroupId}/Endpoints` - Gets all endpoints contained by a dynamic group
  - OperationId: `GetEndpointsByDynamicGroupId`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/Endpoints` - Gets all endpoints contained by a universal dynamic group
  - OperationId: `GetEndpointsByUniversalDynamicGroupId`
- GET `/v2.0/Endpoints/{id}/MaintenanceWindow` - Gets the maintenance window of the endpoint
  - OperationId: `GetMaintenanceWindowForEndpointById`
- POST `/v2.0/Endpoints/{id}/MaintenanceWindow` - Creates a maintenance window for the endpoint
  - OperationId: `CreateMaintenanceWindowForEndpointById`
- PUT `/v2.0/Endpoints/{id}/MaintenanceWindow` - Updates the maintenance window of the endpoint
  - OperationId: `UpdateMaintenanceWindowForEndpointById`
- DELETE `/v2.0/Endpoints/{id}/MaintenanceWindow` - Deletes the maintenance window of the endpoint
  - OperationId: `DeleteMaintenanceWindowForEndpointById`
- POST `/v2.0/IndustrialEndpoints` - Creates an industrial endpoint according to the specified properties
  - OperationId: `CreateIndustrialEndpoint`
- GET `/v2.0/IndustrialEndpoints/{id}` - Gets an industrial endpoint by id
  - OperationId: `GetIndustrialEndpoint`
- PATCH `/v2.0/IndustrialEndpoints/{id}` - Updates an industrial endpoint according to the specified properties
  - OperationId: `UpdateIndustrialEndpoint`
- DELETE `/v2.0/IndustrialEndpoints/{id}` - Deletes an endpoint by id
  - OperationId: `DeleteIndustrialEndpoint`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/IndustrialEndpoints` - Gets all industrial endpoints contained by a logical group
  - OperationId: `GetIndustrialEndpointsByLogicalGroupId`
- GET `/v2.0/StaticGroups/{staticGroupId}/IndustrialEndpoints` - Gets all industrial endpoints contained by a static group
  - OperationId: `GetIndustrialEndpointsByStaticGroupId`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/IndustrialEndpoints` - Gets all industrial endpoints contained by a universal dynamic group
  - OperationId: `GetIndustrialEndpointsByUniversalDynamicGroupId`
- POST `/v2.0/IosEndpoints` - Creates an iOS endpoint according to the specified properties
  - OperationId: `CreateIOSEndpoint`
- GET `/v2.0/IosEndpoints/{id}` - Gets an iOS endpoint by id
  - OperationId: `GetIOSEndpoint`
- PATCH `/v2.0/IosEndpoints/{id}` - Modifies an iOS endpoint according to the specified properties
  - OperationId: `UpdateIOSEndpoint`
- DELETE `/v2.0/IosEndpoints/{id}` - Deletes an endpoint by id
  - OperationId: `DeleteIOSEndpoint`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/IosEndpoints` - Gets all iOS endpoints contained by a logical group
  - OperationId: `GetIOSEndpointsByLogicalGroupId`
- GET `/v2.0/StaticGroups/{staticGroupId}/IosEndpoints` - Gets all iOS endpoints contained by a static group
  - OperationId: `GetIOSEndpointsByStaticGroupId`
- GET `/v2.0/ADUsers/{adUserId}/IosEndpoints` - Gets all iOS endpoints assigned to a specific registered user
  - OperationId: `GetIOSEndpointsByADObjectId`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/IosEndpoints` - Gets all iOS endpoints contained by a universal dynamic group
  - OperationId: `GetIOSEndpointsByUniversalDynamicGroupId`
- POST `/v2.0/IosEndpoints/{id}/StartEnrollment` - Provides functionality to trigger enrollment state of a iOS endpoint.By specifying an e-mail recipient, you can also have a corresponding e-mail with the enrollment information sent automatically.The EmailLanguageId holds the identifier of the email template, which will be used for the email enrollment message sent to the recipient.By default “de-DE” and “en-US” are available. If this property is not set, the Email template with the Id “en-US” will be used.
  - OperationId: `StartIosEndpointEnrollment`
- POST `/v2.0/LinuxEndpoints` - Creates a Linux endpoint according to the specified properties
  - OperationId: `CreateLinuxEndpoint`
- GET `/v2.0/LinuxEndpoints/{id}` - Gets a Linux endpoint by ID
  - OperationId: `GetLinuxEndpoint`
- DELETE `/v2.0/LinuxEndpoints/{id}` - Deletes an endpoint by ID
  - OperationId: `DeleteLinuxEndpoint`
- PATCH `/v2.0/LinuxEndpoints/{id}` - Updates a Linux endpoint according to the specified properties
  - OperationId: `UpdateLinuxEndpoint`
- GET `/v2.0/ADUsers/{adUserId}/LinuxEndpoints` - Gets all Linux endpoints assigned to a specific AD user
  - OperationId: `GetLinuxEndpointsByADObjectId`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/LinuxEndpoints` - Gets all Linux endpoints contained by a logical group
  - OperationId: `GetLinuxEndpointsByLogicalGroupId`
- GET `/v2.0/StaticGroups/{staticGroupId}/LinuxEndpoints` - Gets all Linux endpoints contained by a static group
  - OperationId: `GetLinuxEndpointsByStaticGroupId`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/LinuxEndpoints` - Gets all Linux endpoints contained by a universal dynamic group
  - OperationId: `GetLinuxEndpointsByUniversalDynamicGroupId`
- POST `/v2.0/LogicalGroups` - Creates a logical group according to the specified properties
  - OperationId: `CreateLogicalGroup`
- GET `/v2.0/LogicalGroups/{id}` - Gets a logical group by id
  - OperationId: `GetLogicalGroup`
- PATCH `/v2.0/LogicalGroups/{id}` - Updates a logical group according to the specified properties
  - OperationId: `UpdateLogicalGroup`
- DELETE `/v2.0/LogicalGroups/{id}` - Deletes a logical group by id. Group must be empty in order to be deleted
  - OperationId: `DeleteLogicalGroup`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/LogicalGroups` - Gets all logical groups contained by a logical group
  - OperationId: `GetLogicalGroupsByLogicalGroupId`
- GET `/v2.0/LogicalGroups/{id}/MaintenanceWindow` - Gets the maintenance window of the logical group
  - OperationId: `GetMaintenanceWindowForLogicalGroupById`
- POST `/v2.0/LogicalGroups/{id}/MaintenanceWindow` - Creates a maintenance window for the logical group
  - OperationId: `CreateMaintenanceWindowForLogicalGroupById`
- PUT `/v2.0/LogicalGroups/{id}/MaintenanceWindow` - Updates the maintenance window of the logical group
  - OperationId: `UpdateMaintenanceWindowForLogicalGroupById`
- DELETE `/v2.0/LogicalGroups/{id}/MaintenanceWindow` - Deletes the maintenance window of the logical group
  - OperationId: `DeleteMaintenanceWindowForLogicalGroupById`
- POST `/v2.0/MacEndpoints` - Creates an mac endpoint according to the specified properties
  - OperationId: `CreateMacEndpoint`
- GET `/v2.0/MacEndpoints/{id}` - Gets an macOS endpoint by id
  - OperationId: `GetMacEndpoint`
- PATCH `/v2.0/MacEndpoints/{id}` - Updates an mac endpoint according to the specified properties
  - OperationId: `UpdateMacEndpoint`
- DELETE `/v2.0/MacEndpoints/{id}` - Deletes an endpoint by id
  - OperationId: `DeleteMacEndpoint`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/MacEndpoints` - Gets all macOS endpoints contained by a logical group
  - OperationId: `GetMacEndpointsByLogicalGroupId`
- GET `/v2.0/StaticGroups/{staticGroupId}/MacEndpoints` - Gets all macOS endpoints contained by a static group
  - OperationId: `GetMacEndpointsByStaticGroupId`
- GET `/v2.0/ADUsers/{adUserId}/MacEndpoints` - Gets all macOS endpoints assigned to a specific registered user
  - OperationId: `GetMacEndpointsByADObjectId`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/MacEndpoints` - Gets all macOS endpoints contained by a universal dynamic group
  - OperationId: `GetMacEndpointsByUniversalDynamicGroupId`
- POST `/v2.0/MacEndpoints/{id}/StartEnrollment` - Provides functionality to trigger enrollment state of a mac endpoint.By specifying an e-mail recipient, you can also have a corresponding e-mail with the enrollment information sent automatically.The EmailLanguageId holds the identifier of the email template, which will be used for the email enrollment message sent to the recipient.By default “de-DE” and “en-US” are available. If this property is not set, the Email template with the Id “en-US” will be used.
  - OperationId: `StartMacEndpointEnrollment`
- POST `/v2.0/NetworkEndpoints` - Creates a network endpoint
  - OperationId: `CreateNetworkEndpoint`
- GET `/v2.0/NetworkEndpoints/{id}` - Gets a network endpoint by id
  - OperationId: `GetNetworkEndpoint`
- DELETE `/v2.0/NetworkEndpoints/{id}` - Deletes an endpoint by id
  - OperationId: `DeleteNetworkEndpoint`
- PATCH `/v2.0/NetworkEndpoints/{id}` - Updates an network endpoint
  - OperationId: `UpdateNetworkEndpoint`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/NetworkEndpoints` - Gets all network endpoints contained by a logical group
  - OperationId: `GetNetworkEndpointsByLogicalGroupId`
- GET `/v2.0/StaticGroups/{staticGroupId}/NetworkEndpoints` - Gets all network endpoints contained by a static group
  - OperationId: `GetNetworkEndpointsByStaticGroupId`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/NetworkEndpoints` - Gets all network endpoints contained by a universal dynamic group
  - OperationId: `GetNetworkEndpointsByUniversalDynamicGroupId`
- POST `/v2.0/WindowsEndpoints` - Creates a windows endpoint
  - OperationId: `CreateWindowsEndpoint`
- GET `/v2.0/WindowsEndpoints/{id}` - Gets a windows endpoint by id
  - OperationId: `GetWindowsEndpoint`
- PATCH `/v2.0/WindowsEndpoints/{id}` - Updates an windows endpoint
  - OperationId: `UpdateWindowsEndpoint`
- DELETE `/v2.0/WindowsEndpoints/{id}` - Deletes an endpoint by id
  - OperationId: `DeleteWindowsEndpoint`
- POST `/v2.0/WindowsEndpoints/{id}/StartEnrollment` - Provides functionality to trigger enrollment state of a Windows endpoint. This means the endpoint will be set to Internet mode, the public key (if existing) is deleted and the enrollment data is generated / overwritten. By specifying an e-mail recipient, you can also have a corresponding e-mail with the enrollment information sent automatically.
  - OperationId: `StartWindowsEndpointEnrollment`
- POST `/v2.0/WindowsEndpoints/{id}/TriggerInstallationViaIntune` - Provides functionality to trigger the installation and the enrollment of the baramundi Management Agent on a Windows endpoint, which is managed with Intune.Co-management must be configured for this operation.
  - OperationId: `TriggerInstallationViaIntune`
- GET `/v2.0/ADUsers/{adUserId}/WindowsEndpoints` - Gets all windows endpoints assigned to a specific registered user
  - OperationId: `GetWindowsEndpointsByADObjectId`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/WindowsEndpoints` - Gets all windows endpoints contained by a logical group
  - OperationId: `GetWindowsEndpointsByLogicalGroupId`
- GET `/v2.0/StaticGroups/{staticGroupId}/WindowsEndpoints` - Gets all windows endpoints contained by a static group
  - OperationId: `GetWindowsEndpointsByStaticGroupId`
- GET `/v2.0/DynamicGroups/{dynamicGroupId}/WindowsEndpoints` - Gets all windows endpoints contained by a dynamic group
  - OperationId: `GetWindowsEndpointsByDynamicGroupId`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/WindowsEndpoints` - Gets all windows endpoints contained by a universal dynamic group
  - OperationId: `GetWindowsEndpointsByUniversalDynamicGroupId`

### Missing Endpoints (9/89)

- GET `/v2.0/AndroidEndpoints` - Gets all android endpoints
  - OperationId: `GetAndroidEndpoints`
- GET `/v2.0/Endpoints` - Gets all endpoints
  - OperationId: `GetEndpoints`
- GET `/v2.0/IndustrialEndpoints` - Gets all industrial endpoints
  - OperationId: `GetIndustrialEndpoints`
- GET `/v2.0/IosEndpoints` - Gets all iOS endpoints
  - OperationId: `GetIOSEndpoints`
- GET `/v2.0/LinuxEndpoints` - Gets all Linux endpoints
  - OperationId: `GetLinuxEndpoints`
- GET `/v2.0/LogicalGroups` - Gets all logical groups
  - OperationId: `GetLogicalGroups`
- GET `/v2.0/MacEndpoints` - Gets all macOS endpoints
  - OperationId: `GetMacEndpoints`
- GET `/v2.0/NetworkEndpoints` - Gets all network endpoints
  - OperationId: `GetNetworkEndpoints`
- GET `/v2.0/WindowsEndpoints` - Gets all windows endpoints
  - OperationId: `GetWindowsEndpoints`

---

## Jobs
n8n Action: `job`
Coverage: 30/34 (88.2%)

### Implemented Endpoints (30/34)

- POST `/v2.0/Folders` - Creates a folder according to the specified properties
  - OperationId: `CreateFolder`
- GET `/v2.0/Folders/{id}` - Gets a folder by id
  - OperationId: `GetFolder`
- PATCH `/v2.0/Folders/{id}` - Updates a folder according to the specified properties
  - OperationId: `UpdateFolder`
- DELETE `/v2.0/Folders/{id}` - Deletes a folder by id
  - OperationId: `DeleteFolder`
- GET `/v2.0/Folders/{folderId}/Folders` - Gets all folders contained by a folder
  - OperationId: `GetFoldersByFolderId`
- GET `/v2.0/JobDefinitions/{id}` - Gets a job definition by id
  - OperationId: `GetJobDefinition`
- GET `/v2.0/Folders/{folderId}/JobDefinitions` - Gets all job definitions contained in the specified folder
  - OperationId: `GetJobDefinitionsByFolderId`
- POST `/v2.0/JobInstances` - Assigns a job definition to an endpoint
  - OperationId: `CreateJobInstance`
- GET `/v2.0/JobInstances/{id}` - Gets a job instance by id
  - OperationId: `GetJobInstance`
- DELETE `/v2.0/JobInstances/{id}` - Deletes a job instance by id
  - OperationId: `DeleteJobInstance`
- POST `/v2.0/JobInstances/{id}/Start` - Starts a job instance
  - OperationId: `StartJobInstance`
- POST `/v2.0/JobInstances/{id}/Stop` - Stops a job instance
  - OperationId: `StopJobInstance`
- POST `/v2.0/JobInstances/{id}/Resume` - Resumes a job instance for windows devices
  - OperationId: `ResumeJobInstance`
- GET `/v2.0/JobDefinitions/{jobDefinitionId}/JobInstances` - Gets all job instances by job definition id
  - OperationId: `GetJobInstancesByJobDefinitionId`
- GET `/v2.0/Endpoints/{endpointId}/JobInstances` - Gets all job instances assigned to a specific endpoint
  - OperationId: `GetJobInstancesByEndpointId`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/JobInstances` - Gets all job instances assigned to endpoints contained by a specific logical group
  - OperationId: `GetJobInstancesByLogicalGroupId`
- POST `/v2.0/LogicalGroups/{logicalGroupId}/AssignJobDefinition` - Assigns a job definition to endpoints contained by the specified logical group
  - OperationId: `AssignJobDefinitionToLogicalGroup`
- GET `/v2.0/StaticGroups/{staticGroupId}/JobInstances` - Gets all job instances assigned to endpoints contained by a specific static group
  - OperationId: `GetJobInstancesByStaticGroupId`
- POST `/v2.0/StaticGroups/{staticGroupId}/AssignJobDefinition` - Assigns a job definition to endpoints contained by the specified static group
  - OperationId: `AssignJobDefinitionToStaticGroup`
- GET `/v2.0/DynamicGroups/{dynamicGroupId}/JobInstances` - Gets all job instances assigned to endpoints contained by a specific dynamic group
  - OperationId: `GetJobInstancesByDynamicGroupId`
- POST `/v2.0/DynamicGroups/{dynamicGroupId}/AssignJobDefinition` - Assigns a job definition to endpoints contained by the specified dynamic group
  - OperationId: `AssignJobDefinitionToWindowsDynamicGroup`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/JobInstances` - Gets all job instances assigned to endpoints contained by a specific universal dynamic group
  - OperationId: `GetJobInstancesByUniversalDynamicGroupId`
- POST `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/AssignJobDefinition` - Assigns a job definition to endpoints contained by the specified universal dynamic group
  - OperationId: `AssignJobDefinitionToUniversalDynamicGroup`
- POST `/v2.0/KioskReleases` - Assigns a job definition to a target object. This can be an AD object, a logical group or an endpoint.The target is therefore able to login at baramundi Kiosk portal as a user or a device and choose the assigned job definition for execution on a specific endpoint.For kiosk release assignment JobAssignTarget rights on the job definition and SystemOrAdObjectAssignJob rights on the assignment target are required.
  - OperationId: `CreateKioskRelease`
- GET `/v2.0/KioskReleases/{id}` - Gets an assigned kiosk release by id
  - OperationId: `GetKioskRelease`
- DELETE `/v2.0/KioskReleases/{id}` - Withdraws a kiosk release
  - OperationId: `WithdrawKioskRelease`
- GET `/v2.0/ADObjects/{adObjectId}/KioskReleases` - Gets all kiosk releases assigned to a specific ad user
  - OperationId: `GetKioskReleasesByAdObjectId`
- GET `/v2.0/JobDefinitions/{jobDefinitionId}/KioskReleases` - Gets all kiosk releases assigned to a specific job definition
  - OperationId: `GetKioskReleasesByJobDefinitionId`
- GET `/v2.0/Endpoints/{endpointId}/KioskReleases` - Gets all kiosk releases assigned to a specific endpoint
  - OperationId: `GetKioskReleasesByEndpointId`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/KioskReleases` - Gets all kiosk releases assigned to a specific logical group
  - OperationId: `GetKioskReleasesByLogicalGroupId`

### Missing Endpoints (4/34)

- GET `/v2.0/Folders` - Gets all folders
  - OperationId: `GetFolders`
- GET `/v2.0/JobDefinitions` - Gets all job definitions
  - OperationId: `GetJobDefinitions`
- GET `/v2.0/JobInstances` - Gets all job instances
  - OperationId: `GetJobInstances`
- GET `/v2.0/KioskReleases` - Gets all kiosk releases
  - OperationId: `GetKioskReleases`

---

## OperatingSystems
n8n Action: `operatingSystem`
Coverage: 0/9 (0.0%)

### Missing Endpoints (9/9)

- GET `/v2.0/Folders` - Gets all folders
  - OperationId: `GetFolders`
- POST `/v2.0/Folders` - Creates a folder according to the specified properties
  - OperationId: `CreateFolder`
- GET `/v2.0/Folders/{id}` - Gets a folder by id
  - OperationId: `GetFolder`
- PATCH `/v2.0/Folders/{id}` - Updates a folder according to the specified properties
  - OperationId: `UpdateFolder`
- DELETE `/v2.0/Folders/{id}` - Deletes a folder by id
  - OperationId: `DeleteFolder`
- GET `/v2.0/Folders/{folderId}/Folders` - Gets all folders contained by a folder
  - OperationId: `GetFoldersByFolderId`
- GET `/v2.0/WindowsEndpoints` - Gets OS install information for all windows endpoints
  - OperationId: `GetWindowsEndpoints`
- GET `/v2.0/WindowsEndpoints/{id}` - Gets OS install information for a specific windows endpoint
  - OperationId: `GetWindowsEndpoint`
- PATCH `/v2.0/WindowsEndpoints/{id}` - Sets the windows endpoint OS install configuration
  - OperationId: `UpdateWindowsEndpoint`

---

## ServerManagement
n8n Action: `serverManagement`
Coverage: 0/25 (0.0%)

### Missing Endpoints (25/25)

- GET `/v2.0/CloudConnectors` - Get all cloud connectors
  - OperationId: `GetCloudConnectors`
- GET `/v2.0/Dips` - Get DIP information
  - OperationId: `GetDipStatus`
- GET `/v2.0/Gateway` - Get gateway information
  - OperationId: `GetGateway`
- GET `/v2.0/ManagementServer` - Get information about the management server
  - OperationId: `GetManagementServer`
- POST `/v2.0/Restart` - Restart the management server. Requires server setting rights (43F30D47-4410-438E-AAD0-98157456322D)
  - OperationId: `RestartBaramundiManagementServer`
- POST `/v2.0/CancelScheduledRestart` - Cancel the scheduled restart of the management server. Requires server setting rights (43F30D47-4410-438E-AAD0-98157456322D)
  - OperationId: `CancelScheduledRestartBaramundiManagementServer`
- GET `/v2.0/Microservices` - Get all microservices
  - OperationId: `GetMicroservices`
- GET `/v2.0/Microservices/{id}` - Get a microservice
  - OperationId: `GetMicroservice`
- POST `/v2.0/Microservices/{id}/Start` - Starts microservice. Requires server setting rights (43F30D47-4410-438E-AAD0-98157456322D)
  - OperationId: `StartMicroservice`
- POST `/v2.0/Microservices/{id}/Stop` - Stops a microservice. Requires server setting rights (43F30D47-4410-438E-AAD0-98157456322D)
  - OperationId: `StopMicroservice`
- POST `/v2.0/Microservices/{id}/Restart` - Restart a microservice. Requires server setting rights (43F30D47-4410-438E-AAD0-98157456322D)
  - OperationId: `RestartMicroservice`
- GET `/v2.0/Objects/{id}/Rights` - Gets the access rights for an object.
  - OperationId: `GetAccessRights`
- PATCH `/v2.0/Objects/{id}` - Updates the modifiable values of the specified object permission
  - OperationId: `UpdateObjectPermission`
- GET `/v2.0/PxeRelays` - Get all PxE Relays
  - OperationId: `GetPxeRelays`
- GET `/v2.0/SecurityGroups` - Gets all security groups
  - OperationId: `GetSecurityGroups`
- POST `/v2.0/SecurityGroups` - Creates a security group according to the specified properties
  - OperationId: `CreateSecurityGroup`
- GET `/v2.0/SecurityGroups/{id}` - Gets a security group by id
  - OperationId: `GetSecurityGroup`
- DELETE `/v2.0/SecurityGroups/{id}` - Deletes a security group by id
  - OperationId: `DeleteSecurityGroup`
- PATCH `/v2.0/SecurityGroups/{id}` - Updates the modifiable values of the specified security group
  - OperationId: `UpdateSecurityGroup`
- GET `/v2.0/SecurityProfiles` - Gets all security profiles
  - OperationId: `GetSecurityProfiles`
- POST `/v2.0/SecurityProfiles` - Creates a security profile according to the specified properties
  - OperationId: `CreateSecurityProfile`
- GET `/v2.0/SecurityProfiles/{id}` - Gets a security profile by id
  - OperationId: `GetSecurityProfile`
- DELETE `/v2.0/SecurityProfiles/{id}` - Deletes a security profile by id
  - OperationId: `DeleteSecurityProfile`
- PATCH `/v2.0/SecurityProfiles/{id}` - Updates the modifiable values of the specified security profile
  - OperationId: `UpdateSecurityProfile`
- GET `/v2.0/VpnAppliance` - Get VPN Appliance
  - OperationId: `GetVpnAppliance`

---

## Software
n8n Action: `softwareScanRules`
Coverage: 0/4 (0.0%)

### Missing Endpoints (4/4)

- GET `/v2.0/InstalledWindowsSoftware` - Gets all installed Windows software
  - OperationId: `GetInstalledWindowsSoftware`
- GET `/v2.0/WindowsEndpoints/{endpointId}/InstalledWindowsSoftware` - Gets all installed Windows software of a specific endpoint
  - OperationId: `GetInstalledWindowsSoftwareByEndpointId`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/InstalledWindowsSoftware` - Gets all installed Windows software of endpoints contained by a specific logical group
  - OperationId: `GetInstalledWindowsSoftwareByLogicalGroupId`
- GET `/v2.0/UniversalDynamicGroups/{universalDynamicGroupId}/InstalledWindowsSoftware` - Gets all installed Windows software of endpoints contained by a specific universal dynamic group
  - OperationId: `GetInstalledWindowsSoftwareByUniversalDynamicGroupId`

---

## UpdateManagement
n8n Action: `updateManagement`
Coverage: 0/3 (0.0%)

### Missing Endpoints (3/3)

- GET `/v2.0/WindowsEndpoints` - Get information concerning Microsoft Update Management for all windows endpoints
  - OperationId: `GetWindowsEndpoints`
- GET `/v2.0/WindowsEndpoints/{id}` - Get information concerning Microsoft Update Management for a specific windows endpoint
  - OperationId: `GetWindowsEndpoint`
- PATCH `/v2.0/WindowsEndpoints/{id}` - Sets Microsoft Update Management update profile for windows endpoint. Can be resetted with null as given value.
  - OperationId: `UpdateWindowsEndpoint`

---

## Variables
n8n Action: `variable`
Coverage: 0/13 (0.0%)

### Missing Endpoints (13/13)

- GET `/v2.0/VariableDefinitions` - Gets all variable definitions
  - OperationId: `GetVariableDefinitions`
- POST `/v2.0/VariableDefinitions` - Creates a new variable definition which leads to implicit creation of variable instances for all objects within the specified scopes
  - OperationId: `CreateVariableDefinition`
- GET `/v2.0/VariableDefinitions/{id}` - Gets a variable definition with the specified id
  - OperationId: `GetVariableDefinitionById`
- PATCH `/v2.0/VariableDefinitions/{id}` - Updates the modifiable values of the specified variable definition
  - OperationId: `UpdateVariableDefinition`
- DELETE `/v2.0/VariableDefinitions/{id}` - Deletes the variable definition with the specified id
  - OperationId: `DeleteVariableDefinition`
- GET `/v2.0/VariableInstances` - Gets all variable instances
  - OperationId: `GetVariableInstances`
- GET `/v2.0/VariableInstances/{id}` - Gets the variable instance with the specified id
  - OperationId: `GetVariableInstanceById`
- PATCH `/v2.0/VariableInstances/{id}` - Overrides the default value of the specified variable instance. Value can be reset to initial value by setting IsDefault property to true for all endpoint variable instances except windows endpoints.
  - OperationId: `UpdateVariableInstance`
- GET `/v2.0/Endpoints/{endpointId}/VariableInstances` - Gets all variable instances assigned to a specific endpoint
  - OperationId: `GetVariableInstancesByEndpointId`
- GET `/v2.0/LogicalGroups/{logicalGroupId}/VariableInstances` - Gets all variable instances assigned to a specific logical group
  - OperationId: `GetVariableInstancesByLogicalGroupId`
- GET `/v2.0/ADObjects/{adObjectId}/VariableInstances` - Gets all variable instances assigned to a specific AD object
  - OperationId: `GetVariableInstancesByADObjectId`
- GET `/v2.0/WindowsJobDefinitions/{windowsJobDefinitionId}/VariableInstances` - Gets all variable instances assigned to a specific windows job definition
  - OperationId: `GetVariableInstancesByWindowsJobDefinitonId`
- GET `/v2.0/WindowsApplications/{windowsApplicationId}/VariableInstances` - Gets all variable instances assigned to a specific windows application
  - OperationId: `GetVariableInstancesByWindowsApplicationId`

---

