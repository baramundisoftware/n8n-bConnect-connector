/**
 * Unit Tests for listSearch methods (resourceLocator support)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IExecuteFunctions, IDataObject, INodeExecutionData, ILoadOptionsFunctions } from 'n8n-workflow';
import { endpointSearch, jobDefinitionSearch, jobFolderSearch } from '../../../../nodes/shared/loadOptions';

function createMockLoadOptionsFunctions(mockResponse: any = {}): ILoadOptionsFunctions {
  return {
    getNodeParameter: vi.fn(() => ''),
    getCredentials: vi.fn(async () => ({
      baseUrl: 'https://bms-win22srv:444/bconnect',
      username: 'Administrator',
      password: 'test-password-do-not-use',
      ignoreSslIssues: false,
    })),
    helpers: {
      httpRequest: vi.fn(async () => mockResponse),
      returnJsonArray: vi.fn((data: IDataObject | IDataObject[]) => {
        const array = Array.isArray(data) ? data : [data];
        return array.map(item => ({ json: item })) as INodeExecutionData[];
      }),
    },
    getNode: vi.fn(() => ({
      name: 'Baramundi',
      type: 'n8n-nodes-baramundi.baramundi',
      typeVersion: 1,
      position: [0, 0],
      parameters: {},
    })),
  } as unknown as ILoadOptionsFunctions;
}

describe('listSearch methods', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('endpointSearch', () => {
    it('should return endpoints without filter', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [
          { id: 'aaa-bbb', displayName: 'Server01', hostName: 'srv01.local' },
          { id: 'ccc-ddd', displayName: 'Server02' },
        ],
        hasNextPage: false,
        totalItems: 2,
      });

      const result = await endpointSearch.call(mockCtx);

      expect(result.results).toHaveLength(2);
      expect(result.results[0]).toEqual({ name: 'Server01 (srv01.local)', value: 'aaa-bbb' });
      expect(result.results[1]).toEqual({ name: 'Server02', value: 'ccc-ddd' });
      expect(result.paginationToken).toBeUndefined();
    });

    it('should support filter and pagination', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [{ id: 'eee-fff', displayName: 'WinServer', hostName: 'win.local' }],
        hasNextPage: true,
        totalItems: 100,
      });

      const result = await endpointSearch.call(mockCtx, 'Win', '2');

      expect(result.results).toHaveLength(1);
      expect(result.results[0].name).toBe('WinServer (win.local)');
      expect(result.paginationToken).toBe('3');

      // Verify the API was called with search query and page
      const httpRequest = mockCtx.helpers.httpRequest as ReturnType<typeof vi.fn>;
      const callArg = httpRequest.mock.calls[0][0];
      expect(callArg.qs.SearchQuery).toContain('Win');
      expect(callArg.qs.Page).toBe(2);
    });

    it('should return empty results for invalid OData filter', async () => {
      const mockCtx = createMockLoadOptionsFunctions({});

      const result = await endpointSearch.call(mockCtx, 'bad"input');

      expect(result.results).toHaveLength(0);
    });
  });

  describe('jobDefinitionSearch', () => {
    it('should return job definitions without filter', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [
          { id: 'job-1', name: 'Deploy App', type: 'Install' },
          { id: 'job-2', name: 'Patch Windows' },
        ],
        hasNextPage: false,
        totalItems: 2,
      });

      const result = await jobDefinitionSearch.call(mockCtx);

      expect(result.results).toHaveLength(2);
      expect(result.results[0]).toEqual({ name: 'Deploy App [Install]', value: 'job-1' });
      expect(result.results[1]).toEqual({ name: 'Patch Windows', value: 'job-2' });
      expect(result.paginationToken).toBeUndefined();
    });

    it('should support filter with pagination', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [{ id: 'job-3', name: 'Update', type: 'Script' }],
        hasNextPage: true,
        totalItems: 50,
      });

      const result = await jobDefinitionSearch.call(mockCtx, 'Update', '1');

      expect(result.results).toHaveLength(1);
      expect(result.paginationToken).toBe('2');
    });
  });

  describe('jobFolderSearch', () => {
    it('should return job folders without filter', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [
          { id: 'folder-1', name: 'Production' },
          { id: 'folder-2', name: 'Staging' },
        ],
        hasNextPage: false,
        totalItems: 2,
      });

      const result = await jobFolderSearch.call(mockCtx);

      expect(result.results).toHaveLength(2);
      expect(result.results[0]).toEqual({ name: 'Production', value: 'folder-1' });
      expect(result.results[1]).toEqual({ name: 'Staging', value: 'folder-2' });
    });

    it('should handle pagination token', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [{ id: 'folder-3', name: 'Archive' }],
        hasNextPage: true,
        totalItems: 100,
      });

      const result = await jobFolderSearch.call(mockCtx, '', '5');

      expect(result.results).toHaveLength(1);
      expect(result.paginationToken).toBe('6');
    });
  });
});
