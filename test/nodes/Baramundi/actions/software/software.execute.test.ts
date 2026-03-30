import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import * as software from '../../../../../nodes/Baramundi/actions/software/software.execute';

function createMockExecuteFunctions(nodeParameters: Record<string, any> = {}, credentials: Record<string, any> = {}, mockResponse: any = {}): IExecuteFunctions {
	return {
		getNodeParameter: vi.fn((paramName: string, itemIndex: number, fallback?: any) => nodeParameters[paramName] ?? fallback),
		getCredentials: vi.fn(async () => ({ baseUrl: credentials.baseUrl || 'https://bms-win22srv:444/bconnect', username: 'testuser', password: 'testpass', ignoreSslIssues: credentials.ignoreSslIssues ?? true })),
		helpers: { httpRequest: vi.fn(async () => mockResponse), returnJsonArray: vi.fn((data: IDataObject | IDataObject[]) => { const array = Array.isArray(data) ? data : [data]; return array.map((item) => ({ json: item, pairedItem: { item: 0 } })); }) } as any,
		continueOnFail: vi.fn(() => false),
		getNode: vi.fn(() => ({ name: 'Test Node', type: 'test', typeVersion: 1, position: [0, 0], parameters: {} })),
	} as unknown as IExecuteFunctions;
}

describe('Software Operations', () => {
	it('should fetch all installed Windows software', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Adobe Reader' }, { id: 'sw-2', name: 'WinRAR' }] };
		const mockContext = createMockExecuteFunctions({ returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledWindowsSoftware.call(mockContext, 0);
		expect(result).toHaveLength(2);
	});

	it('should fetch installed software by endpoint', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Software 1' }] };
		const mockContext = createMockExecuteFunctions({ endpointId: 'ep-123', returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledSoftwareByEndpoint.call(mockContext, 0);
		expect(result).toBeDefined();
		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/WindowsEndpoints/ep-123/InstalledWindowsSoftware') }));
	});

	it('should fetch installed software by logical group', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Software 1' }] };
		const mockContext = createMockExecuteFunctions({ logicalGroupId: 'lg-123', returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledSoftwareByLogicalGroup.call(mockContext, 0);
		expect(result).toBeDefined();
		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/LogicalGroups/lg-123/InstalledWindowsSoftware') }));
	});

	it('should fetch installed software by universal dynamic group', async () => {
		const mockSoftware = { currentPage: 0, pageSize: 50, data: [{ id: 'sw-1', name: 'Software 1' }] };
		const mockContext = createMockExecuteFunctions({ universalDynamicGroupId: 'udg-123', returnAll: false, limit: 50 }, {}, mockSoftware);
		const result = await software.getInstalledSoftwareByUniversalDynamicGroup.call(mockContext, 0);
		expect(result).toBeDefined();
		expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/UniversalDynamicGroups/udg-123/InstalledWindowsSoftware') }));
	});
});
