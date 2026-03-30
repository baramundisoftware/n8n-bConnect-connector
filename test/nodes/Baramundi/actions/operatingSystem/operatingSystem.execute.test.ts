import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';

import * as operatingSystem from '../../../../../nodes/Baramundi/actions/operatingSystem/operatingSystem.execute';

// Mock helper function to create IExecuteFunctions
function createMockExecuteFunctions(
	nodeParameters: Record<string, any> = {},
	credentials: Record<string, any> = {},
	mockResponse: any = {},
): IExecuteFunctions {
	return {
		getNodeParameter: vi.fn((paramName: string, itemIndex: number, fallback?: any) => {
			return nodeParameters[paramName] ?? fallback;
		}),
		getCredentials: vi.fn(async () => ({
			baseUrl: credentials.baseUrl || 'https://bms-win22srv:444/bconnect',
			username: 'testuser',
			password: 'testpass',
			ignoreSslIssues: credentials.ignoreSslIssues ?? true,
		})),
		helpers: {
			httpRequest: vi.fn(async () => mockResponse),
			returnJsonArray: vi.fn((data: IDataObject | IDataObject[]) => {
				const array = Array.isArray(data) ? data : [data];
				return array.map((item) => ({ json: item, pairedItem: { item: 0 } }));
			}),
		} as any,
		continueOnFail: vi.fn(() => false),
		getNode: vi.fn(() => ({ name: 'Test Node', type: 'test', typeVersion: 1, position: [0, 0], parameters: {} })),
	} as unknown as IExecuteFunctions;
}

// ============================================================================
// FOLDERS TESTS
// ============================================================================

describe('OS Folders Operations', () => {
	describe('getFolders()', () => {
		it('should fetch all OS folders with pagination', async () => {
			const mockFolders = {
				currentPage: 0,
				pageSize: 50,
				totalPages: 1,
				totalItems: 2,
				data: [
					{ id: 'folder-1', name: 'Windows 10', parentId: null },
					{ id: 'folder-2', name: 'Windows 11', parentId: null },
				],
			};

			const mockContext = createMockExecuteFunctions(
				{ returnAll: false, limit: 50 },
				{},
				mockFolders,
			);

			const result = await operatingSystem.getFolders.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(result).toHaveLength(2);
			expect(result[0].json.name).toBe('Windows 10');
		});
	});

	describe('getFolder()', () => {
		it('should fetch a single OS folder by ID', async () => {
			const mockFolder = {
				id: 'folder-123',
				name: 'Windows Server 2022',
				parentId: 'parent-1',
			};

			const mockContext = createMockExecuteFunctions(
				{ folderId: 'folder-123' },
				{},
				mockFolder,
			);

			const result = await operatingSystem.getFolder.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe('Windows Server 2022');
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: expect.stringContaining('/operatingsystems/v2.0/Folders/folder-123'),
				}),
			);
		});
	});

	describe('getFoldersByFolderId()', () => {
		it('should fetch subfolders of a folder', async () => {
			const mockSubfolders = {
				currentPage: 0,
				pageSize: 50,
				data: [
					{ id: 'sub-1', name: 'Pro', parentId: 'folder-123' },
					{ id: 'sub-2', name: 'Enterprise', parentId: 'folder-123' },
				],
			};

			const mockContext = createMockExecuteFunctions(
				{ folderId: 'folder-123', returnAll: false, limit: 50 },
				{},
				mockSubfolders,
			);

			const result = await operatingSystem.getFoldersByFolderId.call(mockContext, 0);

			expect(result).toHaveLength(2);
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining('/Folders/folder-123/Folders'),
				}),
			);
		});
	});

	describe('createFolder()', () => {
		it('should create a new OS folder', async () => {
			const mockCreated = {
				id: 'folder-new',
				name: 'Windows 12',
				parentId: null,
			};

			const mockContext = createMockExecuteFunctions(
				{
					name: 'Windows 12',
					additionalFields: {},
				},
				{},
				mockCreated,
			);

			const result = await operatingSystem.createFolder.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe('Windows 12');
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: expect.stringContaining('/operatingsystems/v2.0/Folders'),
				}),
			);
		});
	});

	describe('updateFolder()', () => {
		it('should update an OS folder using PATCH', async () => {
			const mockUpdated = {
				id: 'folder-123',
				name: 'Updated Name',
			};

			const mockContext = createMockExecuteFunctions(
				{
					folderId: 'folder-123',
					updateFields: { name: 'Updated Name' },
				},
				{},
				mockUpdated,
			);

			const result = await operatingSystem.updateFolder.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe('Updated Name');
		});

		it('should throw error when no fields to update', async () => {
			const mockContext = createMockExecuteFunctions({
				folderId: 'folder-123',
				updateFields: {},
			});

			await expect(operatingSystem.updateFolder.call(mockContext, 0)).rejects.toThrow(
				'No fields to update',
			);
		});
	});

	describe('deleteFolder()', () => {
		it('should delete an OS folder', async () => {
			const mockContext = createMockExecuteFunctions(
				{ folderId: 'folder-123' },
				{},
				{},
			);

			const result = await operatingSystem.deleteFolder.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			expect(result[0].json.deletedId).toBe('folder-123');
		});
	});
});

// ============================================================================
// WINDOWS ENDPOINTS TESTS
// ============================================================================

describe('OS Windows Endpoints Operations', () => {
	describe('getWindowsEndpoints()', () => {
		it('should fetch all Windows endpoints OS info with pagination', async () => {
			const mockEndpoints = {
				currentPage: 0,
				pageSize: 50,
				data: [
					{ id: 'ep-1', displayName: 'PC-001', operatingSystemName: 'Windows 10' },
					{ id: 'ep-2', displayName: 'PC-002', operatingSystemName: 'Windows 11' },
				],
			};

			const mockContext = createMockExecuteFunctions(
				{ returnAll: false, limit: 50 },
				{},
				mockEndpoints,
			);

			const result = await operatingSystem.getWindowsEndpoints.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(result).toHaveLength(2);
		});
	});

	describe('getWindowsEndpoint()', () => {
		it('should fetch a single Windows endpoint OS info by ID', async () => {
			const mockEndpoint = {
				id: 'ep-123',
				displayName: 'PC-001',
				operatingSystemName: 'Windows 10 Pro',
				osInstallFolderId: 'folder-1',
			};

			const mockContext = createMockExecuteFunctions(
				{ endpointId: 'ep-123' },
				{},
				mockEndpoint,
			);

			const result = await operatingSystem.getWindowsEndpoint.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.operatingSystemName).toBe('Windows 10 Pro');
		});
	});

	describe('updateWindowsEndpoint()', () => {
		it('should update Windows endpoint OS config using PATCH', async () => {
			const mockUpdated = {
				id: 'ep-123',
				osInstallFolderId: 'folder-new',
			};

			const mockContext = createMockExecuteFunctions(
				{
					endpointId: 'ep-123',
					updateFields: { osInstallFolderId: 'folder-new' },
				},
				{},
				mockUpdated,
			);

			const result = await operatingSystem.updateWindowsEndpoint.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.osInstallFolderId).toBe('folder-new');
		});
	});
});

// ============================================================================
// CREDENTIAL CONFIGURATION TESTS
// ============================================================================

describe('Credential Configuration', () => {
	it('should use correct baseURL from credentials', async () => {
		const mockContext = createMockExecuteFunctions(
			{ folderId: 'folder-1' },
			{ baseUrl: 'https://custom-server:444/bconnect' },
			{ id: 'folder-1', name: 'Test' },
		);

		await operatingSystem.getFolder.call(mockContext, 0);

		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				baseURL: 'https://custom-server:444/bconnect',
				url: '/operatingsystems/v2.0/Folders/folder-1',
			}),
		);
	});
});
