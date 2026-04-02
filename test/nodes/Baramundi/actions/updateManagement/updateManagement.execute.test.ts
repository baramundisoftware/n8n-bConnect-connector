import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import * as updateManagement from '../../../../../nodes/BaramundiSoftware/actions/updateManagement/updateManagement.execute';

function createMockExecuteFunctions(nodeParameters: Record<string, any> = {}, credentials: Record<string, any> = {}, mockResponse: any = {}): IExecuteFunctions {
	return {
		getNodeParameter: vi.fn((paramName: string, itemIndex: number, fallback?: any) => nodeParameters[paramName] ?? fallback),
		getCredentials: vi.fn(async () => ({ baseUrl: credentials.baseUrl || 'https://bms-win22srv:444/bconnect', username: 'testuser', password: 'test-password-do-not-use', ignoreSslIssues: credentials.ignoreSslIssues ?? false })),
		helpers: { httpRequest: vi.fn(async () => mockResponse), returnJsonArray: vi.fn((data: IDataObject | IDataObject[]) => { const array = Array.isArray(data) ? data : [data]; return array.map((item) => ({ json: item, pairedItem: { item: 0 } })); }) } as any,
		continueOnFail: vi.fn(() => false),
		getNode: vi.fn(() => ({ name: 'Test Node', type: 'test', typeVersion: 1, position: [0, 0], parameters: {} })),
	} as unknown as IExecuteFunctions;
}

describe('Update Management Operations', () => {
	it('should fetch all Windows endpoints update info', async () => {
		const mockEndpoints = { currentPage: 0, pageSize: 50, data: [{ id: 'ep-1', displayName: 'PC-001' }, { id: 'ep-2', displayName: 'PC-002' }] };
		const mockContext = createMockExecuteFunctions({ returnAll: false, limit: 50 }, {}, mockEndpoints);
		const result = await updateManagement.getWindowsEndpoints.call(mockContext, 0);
		expect(result).toHaveLength(2);
	});

	it('should fetch single Windows endpoint update info', async () => {
		const mockEndpoint = { id: 'ep-123', displayName: 'PC-001', updateProfileId: 'profile-1' };
		const mockContext = createMockExecuteFunctions({ endpointId: '11111111-1111-1111-1111-111111111111' }, {}, mockEndpoint);
		const result = await updateManagement.getWindowsEndpoint.call(mockContext, 0);
		expect(result).toHaveLength(1);
		expect(result[0].json.updateProfileId).toBe('profile-1');
	});

	it('should update Windows endpoint update config', async () => {
		const mockUpdated = { id: 'ep-123', updateProfileId: 'profile-new' };
		const mockContext = createMockExecuteFunctions({ endpointId: '11111111-1111-1111-1111-111111111111', updateFields: { updateProfileId: 'profile-new' } }, {}, mockUpdated);
		const result = await updateManagement.updateWindowsEndpoint.call(mockContext, 0);
		expect(result).toHaveLength(1);
		expect(result[0].json.updateProfileId).toBe('profile-new');
	});

	it('should throw error when no fields to update', async () => {
		const mockContext = createMockExecuteFunctions({ endpointId: '11111111-1111-1111-1111-111111111111', updateFields: {} });
		await expect(updateManagement.updateWindowsEndpoint.call(mockContext, 0)).rejects.toThrow('No fields to update');
	});
});
