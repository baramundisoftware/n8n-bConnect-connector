import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';

import * as variable from '../../../../../nodes/BaramundiSoftware/actions/variable/variable.execute';

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
			baseUrl: credentials.baseUrl || 'https://bms.example.com:444/bconnect',
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
				id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				name: 'ServerPath',
				dataType: 'String',
				defaultValue: 'C:\\Program Files',
			};

			const mockContext = createMockExecuteFunctions(
				{ variableDefinitionId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' },
				{},
				mockDefinition,
			);

			const result = await variable.getVariableDefinition.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.name).toBe('ServerPath');
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: expect.stringContaining('/variables/v2.0/VariableDefinitions/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
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
				id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				name: 'UpdatedVar',
				dataType: 'String',
			};

			const mockContext = createMockExecuteFunctions(
				{
					variableDefinitionId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
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
				variableDefinitionId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
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
				{ variableDefinitionId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' },
				{},
				{},
			);

			const result = await variable.deleteVariableDefinition.call(mockContext, 0);

			expect(result).toHaveLength(1);
			expect(result[0].json.success).toBe(true);
			expect(result[0].json.deletedId).toBe('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
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
				id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
				variableDefinitionId: 'var-def-1',
				value: 'CustomValue',
			};

			const mockContext = createMockExecuteFunctions(
				{ variableInstanceId: 'cccccccc-cccc-cccc-cccc-cccccccccccc' },
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
				id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
				value: 'NewValue',
			};

			const mockContext = createMockExecuteFunctions(
				{
					variableInstanceId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
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
					{ id: 'inst-1', endpointId: '11111111-1111-1111-1111-111111111111', value: 'Value1' },
					{ id: 'inst-2', endpointId: '11111111-1111-1111-1111-111111111111', value: 'Value2' },
				],
			};

			const mockContext = createMockExecuteFunctions(
				{ endpointId: '11111111-1111-1111-1111-111111111111', returnAll: false, limit: 50 },
				{},
				mockInstances,
			);

			const result = await variable.getVariableInstancesByEndpoint.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(result).toHaveLength(2);
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining('/Endpoints/11111111-1111-1111-1111-111111111111/VariableInstances'),
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
				{ logicalGroupId: '22222222-2222-2222-2222-222222222222', returnAll: false, limit: 50 },
				{},
				mockInstances,
			);

			const result = await variable.getVariableInstancesByLogicalGroup.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining('/LogicalGroups/22222222-2222-2222-2222-222222222222/VariableInstances'),
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
				{ adObjectId: '66666666-6666-6666-6666-666666666666', returnAll: false, limit: 50 },
				{},
				mockInstances,
			);

			const result = await variable.getVariableInstancesByADObject.call(mockContext, 0);

			expect(result).toBeDefined();
			expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining('/ADObjects/66666666-6666-6666-6666-666666666666/VariableInstances'),
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
			{ variableDefinitionId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' },
			{ baseUrl: 'https://custom-server:444/bconnect' },
			{ id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Test' },
		);

		await variable.getVariableDefinition.call(mockContext, 0);

		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				baseURL: 'https://custom-server:444/bconnect',
				url: '/variables/v2.0/VariableDefinitions/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
			}),
		);
	});

	it('should handle SSL configuration', async () => {
		const mockContext = createMockExecuteFunctions(
			{ variableDefinitionId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' },
			{ ignoreSslIssues: false },
			{ id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Test' },
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
    const ctx = createCtx({ applicationId: 'dddddddd-dddd-dddd-dddd-dddddddddddd', returnAll: false, limit: 50 }, pageResp([{ id: 'vi-1', name: 'VAR1' }]));
    const result = await variable.getVariableInstancesByApplication.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/variables/v2.0/WindowsApplications/dddddddd-dddd-dddd-dddd-dddddddddddd/VariableInstances') }));
  });

  it('getVariableInstancesByJobDefinition — returns instances for a job definition', async () => {
    const ctx = createCtx({ jobDefinitionId: '88888888-8888-8888-8888-888888888888', returnAll: false, limit: 50 }, pageResp([{ id: 'vi-2', name: 'VAR2' }, { id: 'vi-3', name: 'VAR3' }]));
    const result = await variable.getVariableInstancesByJobDefinition.call(ctx, 0);
    expect(result).toHaveLength(2);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/variables/v2.0/WindowsJobDefinitions/88888888-8888-8888-8888-888888888888/VariableInstances') }));
  });
});

describe('returnAll: true branches', () => {
  const multiPage1 = {
    currentPage: 0, pageSize: 2, totalPages: 2, totalItems: 3,
    hasPreviousPage: false, hasNextPage: true,
    data: [{ id: 'v1' }, { id: 'v2' }],
  };
  const multiPage2 = {
    currentPage: 1, pageSize: 2, totalPages: 2, totalItems: 3,
    hasPreviousPage: true, hasNextPage: false,
    data: [{ id: 'v3' }],
  };

  function createReturnAllCtx(params: Record<string, any>, pages: any[]) {
    let callIndex = 0;
    return {
      getNodeParameter: vi.fn((name: string, _i: number, def?: any) => params[name] ?? def),
      getCredentials: vi.fn(async () => ({ baseUrl: 'https://bms:444/bconnect', username: 'u', password: 'test-password-do-not-use', ignoreSslIssues: false })),
      helpers: {
        httpRequest: vi.fn(async () => { const r = pages[callIndex] || pages[pages.length - 1]; callIndex++; return r; }),
        returnJsonArray: vi.fn((data: any) => (Array.isArray(data) ? data : [data]).map((j: any) => ({ json: j }))),
      },
      getNode: vi.fn(() => ({ name: 'Baramundi', type: 'test', typeVersion: 1, position: [0, 0], parameters: {} })),
    } as any;
  }

  it('getVariableDefinitions returnAll=true', async () => {
    const ctx = createReturnAllCtx({ returnAll: true, options: {} }, [multiPage1, multiPage2]);
    const result = await variable.getVariableDefinitions.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getVariableInstances returnAll=true', async () => {
    const ctx = createReturnAllCtx({ returnAll: true, options: {} }, [multiPage1, multiPage2]);
    const result = await variable.getVariableInstances.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getVariableInstancesByEndpoint returnAll=true', async () => {
    const ctx = createReturnAllCtx({ endpointId: '11111111-1111-1111-1111-111111111111', returnAll: true }, [multiPage1, multiPage2]);
    const result = await variable.getVariableInstancesByEndpoint.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getVariableInstancesByLogicalGroup returnAll=true', async () => {
    const ctx = createReturnAllCtx({ logicalGroupId: '22222222-2222-2222-2222-222222222222', returnAll: true }, [multiPage1, multiPage2]);
    const result = await variable.getVariableInstancesByLogicalGroup.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getVariableInstancesByADObject returnAll=true', async () => {
    const ctx = createReturnAllCtx({ adObjectId: '66666666-6666-6666-6666-666666666666', returnAll: true }, [multiPage1, multiPage2]);
    const result = await variable.getVariableInstancesByADObject.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getVariableInstancesByApplication returnAll=true', async () => {
    const ctx = createReturnAllCtx({ applicationId: 'dddddddd-dddd-dddd-dddd-dddddddddddd', returnAll: true }, [multiPage1, multiPage2]);
    const result = await variable.getVariableInstancesByApplication.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getVariableInstancesByJobDefinition returnAll=true', async () => {
    const ctx = createReturnAllCtx({ jobDefinitionId: '88888888-8888-8888-8888-888888888888', returnAll: true }, [multiPage1, multiPage2]);
    const result = await variable.getVariableInstancesByJobDefinition.call(ctx, 0);
    expect(result).toHaveLength(3);
  });
});

describe('Validation error paths', () => {
  it('should throw NodeOperationError for invalid GUID in variableDefinitionId (getVariableDefinition)', async () => {
    const mock = createMockExecuteFunctions({ variableDefinitionId: 'not-a-guid' });
    await expect(variable.getVariableDefinition.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in variableDefinitionId (deleteVariableDefinition)', async () => {
    const mock = createMockExecuteFunctions({ variableDefinitionId: 'not-a-guid' });
    await expect(variable.deleteVariableDefinition.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in variableInstanceId (getVariableInstance)', async () => {
    const mock = createMockExecuteFunctions({ variableInstanceId: 'not-a-guid' });
    await expect(variable.getVariableInstance.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getVariableDefinitions', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(variable.getVariableDefinitions.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getVariableDefinitions', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(variable.getVariableDefinitions.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getVariableInstances', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { searchQuery: 'name eq "test"' },
    });
    await expect(variable.getVariableInstances.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in variableDefinitionId (updateVariableDefinition)', async () => {
    const mock = createMockExecuteFunctions({ variableDefinitionId: 'not-a-guid', updateFields: { name: 'x' } });
    await expect(variable.updateVariableDefinition.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in variableInstanceId (updateVariableInstance)', async () => {
    const mock = createMockExecuteFunctions({ variableInstanceId: 'not-a-guid', updateFields: { value: 'x' } });
    await expect(variable.updateVariableInstance.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in endpointId (getVariableInstancesByEndpoint)', async () => {
    const mock = createMockExecuteFunctions({ endpointId: 'not-a-guid', returnAll: false, limit: 10, options: {} });
    await expect(variable.getVariableInstancesByEndpoint.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in logicalGroupId (getVariableInstancesByLogicalGroup)', async () => {
    const mock = createMockExecuteFunctions({ logicalGroupId: 'not-a-guid', returnAll: false, limit: 10, options: {} });
    await expect(variable.getVariableInstancesByLogicalGroup.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in adObjectId (getVariableInstancesByADObject)', async () => {
    const mock = createMockExecuteFunctions({ adObjectId: 'not-a-guid', returnAll: false, limit: 10, options: {} });
    await expect(variable.getVariableInstancesByADObject.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in applicationId (getVariableInstancesByApplication)', async () => {
    const mock = createMockExecuteFunctions({ applicationId: 'not-a-guid', returnAll: false, limit: 10, options: {} });
    await expect(variable.getVariableInstancesByApplication.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in jobDefinitionId (getVariableInstancesByJobDefinition)', async () => {
    const mock = createMockExecuteFunctions({ jobDefinitionId: 'not-a-guid', returnAll: false, limit: 10, options: {} });
    await expect(variable.getVariableInstancesByJobDefinition.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getVariableInstances', async () => {
    const mock = createMockExecuteFunctions({
      returnAll: false, limit: 10,
      options: { orderBy: 'name "desc"' },
    });
    await expect(variable.getVariableInstances.call(mock, 0)).rejects.toThrow();
  });
});
