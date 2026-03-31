import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';

import * as variable from '../../../../../nodes/Baramundi/actions/variable/variable.execute';

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
			password: 'test-password-do-not-use',
			ignoreSslIssues: credentials.ignoreSslIssues ?? false,
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
// VARIABLE DEFINITIONS TESTS
// ============================================================================

describe('Variable Definitions Operations', () => {
	describe('getVariableDefinitions()', () => {
		it('should fetch all variable definitions with pagination', async () => {
			const mockDefinitions = {
				currentPage: 0,
				pageSize: 50,
				totalPages: 1,
				totalItems: 2,
				data: [
					{ id: 'var-def-1', name: 'InstallDir', dataType: 'String' },
					{ id: 'var-def-2', name: 'Version', dataType: 'String' },
				],
			};

			const mockContext = createMockExecuteFunctions(
				{ returnAll: false, limit: 50 },
				{},
				mockDefinitions,
			);

			const result = await variable.getVariableDefinitions.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(result).toHaveLength(2);
			expect(result[0].json.name).toBe('InstallDir');
		});

		it('should fetch all variable definitions when returnAll is true', async () => {
			const mockDefinitions = {
				currentPage: 0,
				pageSize: 100,
				totalPages: 1,
				totalItems: 5,
				hasNextPage: false,
				data: [
					{ id: 'var-1', name: 'Var1' },
					{ id: 'var-2', name: 'Var2' },
					{ id: 'var-3', name: 'Var3' },
					{ id: 'var-4', name: 'Var4' },
					{ id: 'var-5', name: 'Var5' },
				],
			};

			const mockContext = createMockExecuteFunctions(
				{ returnAll: true },
				{},
				mockDefinitions,
			);

			// Mock apiRequestAllItems (returns array directly)
			const result = await variable.getVariableDefinitions.call(mockContext, 0);

			expect(result).toBeDefined();
		});
	});

	describe('getVariableDefinition()', () => {
		it('should fetch a single variable definition by ID', async () => {
			const mockDefinition = {
				id: 'var-def-123',
				name: 'ServerPath',
				dataType: 'String',
				defaultValue: 'C:\\Program Files',
			};

			const mockContext = createMockExecuteFunctions(
				{ variableDefinitionId: 'var-def-123' },
				{},
				mockDefinition,
			);

			const result = await variable.getVariableDefinition.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe('ServerPath');
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: expect.stringContaining('/variables/v2.0/VariableDefinitions/var-def-123'),
				}),
			);
		});
	});

	describe('createVariableDefinition()', () => {
		it('should create a new variable definition', async () => {
			const mockCreated = {
				id: 'var-def-new',
				name: 'CustomVar',
				dataType: 'String',
				defaultValue: 'test',
			};

			const mockContext = createMockExecuteFunctions(
				{
					name: 'CustomVar',
					dataType: 'String',
					additionalFields: { defaultValue: 'test' },
				},
				{},
				mockCreated,
			);

			const result = await variable.createVariableDefinition.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe('CustomVar');
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: expect.stringContaining('/variables/v2.0/VariableDefinitions'),
				}),
			);
		});
	});

	describe('updateVariableDefinition()', () => {
		it('should update a variable definition using PATCH', async () => {
			const mockUpdated = {
				id: 'var-def-123',
				name: 'UpdatedVar',
				dataType: 'String',
			};

			const mockContext = createMockExecuteFunctions(
				{
					variableDefinitionId: 'var-def-123',
					updateFields: { name: 'UpdatedVar' },
				},
				{},
				mockUpdated,
			);

			const result = await variable.updateVariableDefinition.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe('UpdatedVar');
		});

		it('should throw error when no fields to update', async () => {
			const mockContext = createMockExecuteFunctions({
				variableDefinitionId: 'var-def-123',
				updateFields: {},
			});

			await expect(variable.updateVariableDefinition.call(mockContext, 0)).rejects.toThrow(
				'No fields to update',
			);
		});
	});

	describe('deleteVariableDefinition()', () => {
		it('should delete a variable definition', async () => {
			const mockContext = createMockExecuteFunctions(
				{ variableDefinitionId: 'var-def-123' },
				{},
				{},
			);

			const result = await variable.deleteVariableDefinition.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			expect(result[0].json.deletedId).toBe('var-def-123');
		});
	});
});

// ============================================================================
// VARIABLE INSTANCES TESTS
// ============================================================================

describe('Variable Instances Operations', () => {
	describe('getVariableInstances()', () => {
		it('should fetch all variable instances with pagination', async () => {
			const mockInstances = {
				currentPage: 0,
				pageSize: 50,
				data: [
					{ id: 'inst-1', variableDefinitionId: 'var-def-1', value: 'C:\\Apps' },
					{ id: 'inst-2', variableDefinitionId: 'var-def-2', value: 'D:\\Data' },
				],
			};

			const mockContext = createMockExecuteFunctions(
				{ returnAll: false, limit: 50 },
				{},
				mockInstances,
			);

			const result = await variable.getVariableInstances.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(result).toHaveLength(2);
		});
	});

	describe('getVariableInstance()', () => {
		it('should fetch a single variable instance by ID', async () => {
			const mockInstance = {
				id: 'inst-123',
				variableDefinitionId: 'var-def-1',
				value: 'CustomValue',
			};

			const mockContext = createMockExecuteFunctions(
				{ variableInstanceId: 'inst-123' },
				{},
				mockInstance,
			);

			const result = await variable.getVariableInstance.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.value).toBe('CustomValue');
		});
	});

	describe('updateVariableInstance()', () => {
		it('should update a variable instance value using PATCH', async () => {
			const mockUpdated = {
				id: 'inst-123',
				value: 'NewValue',
			};

			const mockContext = createMockExecuteFunctions(
				{
					variableInstanceId: 'inst-123',
					updateFields: { value: 'NewValue' },
				},
				{},
				mockUpdated,
			);

			const result = await variable.updateVariableInstance.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.value).toBe('NewValue');
		});
	});
});

// ============================================================================
// VARIABLE INSTANCES BY ENTITY TESTS
// ============================================================================

describe('Variable Instances By Entity Operations', () => {
	describe('getVariableInstancesByEndpoint()', () => {
		it('should fetch variable instances for a specific endpoint', async () => {
			const mockInstances = {
				currentPage: 0,
				pageSize: 50,
				data: [
					{ id: 'inst-1', endpointId: 'ep-123', value: 'Value1' },
					{ id: 'inst-2', endpointId: 'ep-123', value: 'Value2' },
				],
			};

			const mockContext = createMockExecuteFunctions(
				{ endpointId: 'ep-123', returnAll: false, limit: 50 },
				{},
				mockInstances,
			);

			const result = await variable.getVariableInstancesByEndpoint.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(result).toHaveLength(2);
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining('/Endpoints/ep-123/VariableInstances'),
				}),
			);
		});
	});

	describe('getVariableInstancesByLogicalGroup()', () => {
		it('should fetch variable instances for a logical group', async () => {
			const mockInstances = {
				currentPage: 0,
				pageSize: 50,
				data: [{ id: 'inst-1', value: 'GroupValue' }],
			};

			const mockContext = createMockExecuteFunctions(
				{ logicalGroupId: 'lg-123', returnAll: false, limit: 50 },
				{},
				mockInstances,
			);

			const result = await variable.getVariableInstancesByLogicalGroup.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining('/LogicalGroups/lg-123/VariableInstances'),
				}),
			);
		});
	});

	describe('getVariableInstancesByADObject()', () => {
		it('should fetch variable instances for an AD object', async () => {
			const mockInstances = {
				currentPage: 0,
				pageSize: 50,
				data: [{ id: 'inst-1', value: 'ADValue' }],
			};

			const mockContext = createMockExecuteFunctions(
				{ adObjectId: 'ad-123', returnAll: false, limit: 50 },
				{},
				mockInstances,
			);

			const result = await variable.getVariableInstancesByADObject.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining('/ADObjects/ad-123/VariableInstances'),
				}),
			);
		});
	});
});

// ============================================================================
// CREDENTIAL CONFIGURATION TESTS
// ============================================================================

describe('Credential Configuration', () => {
	it('should use correct baseURL from credentials', async () => {
		const mockContext = createMockExecuteFunctions(
			{ variableDefinitionId: 'var-1' },
			{ baseUrl: 'https://custom-server:444/bconnect' },
			{ id: 'var-1', name: 'Test' },
		);

		await variable.getVariableDefinition.call(mockContext, 0);

		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				baseURL: 'https://custom-server:444/bconnect',
				url: '/variables/v2.0/VariableDefinitions/var-1',
			}),
		);
	});

	it('should handle SSL configuration', async () => {
		const mockContext = createMockExecuteFunctions(
			{ variableDefinitionId: 'var-1' },
			{ ignoreSslIssues: false },
			{ id: 'var-1', name: 'Test' },
		);

		await variable.getVariableDefinition.call(mockContext, 0);

		expect(mockContext.helpers.httpRequest).toHaveBeenCalled();
	});
});

describe('Variable Phase 8F — Application/JobDefinition Instances', () => {
  const pageResp = (items: any[]) => ({
    currentPage: 0, pageSize: 50, totalPages: 1, totalItems: items.length,
    hasPreviousPage: false, hasNextPage: false, data: items,
  });

  function createCtx(params: Record<string, any>, response: any) {
    return {
      getNodeParameter: vi.fn((name: string, _i: number, def?: any) => params[name] ?? def),
      getCredentials: vi.fn(async () => ({ baseUrl: 'https://bms:444/bconnect', username: 'u', password: 'test-password-do-not-use', ignoreSslIssues: false })),
      helpers: {
        httpRequest: vi.fn(async () => response),
        returnJsonArray: vi.fn((data: any) => (Array.isArray(data) ? data : [data]).map((j: any) => ({ json: j }))),
      },
      getNode: vi.fn(() => ({ name: 'Baramundi', type: 'n8n-nodes-baramundi.baramundi', typeVersion: 1, position: [0,0], parameters: {} })),
    } as any;
  }

  it('getVariableInstancesByApplication — returns instances for a Windows application', async () => {
    const ctx = createCtx({ applicationId: 'app-1', returnAll: false, limit: 50 }, pageResp([{ id: 'vi-1', name: 'VAR1' }]));
    const result = await variable.getVariableInstancesByApplication.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/variables/v2.0/WindowsApplications/app-1/VariableInstances') }));
  });

  it('getVariableInstancesByJobDefinition — returns instances for a job definition', async () => {
    const ctx = createCtx({ jobDefinitionId: 'jd-1', returnAll: false, limit: 50 }, pageResp([{ id: 'vi-2', name: 'VAR2' }, { id: 'vi-3', name: 'VAR3' }]));
    const result = await variable.getVariableInstancesByJobDefinition.call(ctx, 0);
    expect(result).toHaveLength(2);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/variables/v2.0/WindowsJobDefinitions/jd-1/VariableInstances') }));
  });
});
