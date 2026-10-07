/**
 * Unit Tests for listSearch methods (resourceLocator support)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IExecuteFunctions, IDataObject, INodeExecutionData, ILoadOptionsFunctions } from 'n8n-workflow';
import {
  getEndpoints,
  getJobDefinitions,
  getOrgUnits,
  getLogicalGroups,
  endpointSearch,
  jobDefinitionSearch,
  jobFolderSearch,
} from '../../../../nodes/shared/loadOptions';
import { httpRequestWithAuthentication } from '../../../helpers/httpRequestWithAuthentication';

function createMockLoadOptionsFunctions(mockResponse: any = {}): ILoadOptionsFunctions {
  return {
    getNodeParameter: vi.fn(() => ''),
    getCurrentNodeParameter: vi.fn(() => undefined),
    getCredentials: vi.fn(async () => ({
      baseUrl: 'https://bms.example.com:444/bconnect',
      username: 'Administrator',
      password: 'test-password-do-not-use',
      ignoreSslIssues: false,
    })),
    helpers: {
      httpRequestWithAuthentication,
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

describe('getOptions methods', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEndpoints', () => {
    it('should return endpoint options', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [
          { id: 'aaa', displayName: 'Server01', hostName: 'srv01.local' },
          { id: 'bbb', displayName: 'Server02' },
        ],
        hasNextPage: false,
      });
      const result = await getEndpoints.call(mockCtx);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ name: 'Server01 (srv01.local)', value: 'aaa' });
      expect(result[1]).toEqual({ name: 'Server02', value: 'bbb' });
    });

    it('should add truncation notice when hasNextPage is true', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [{ id: 'aaa', displayName: 'Server01' }],
        hasNextPage: true,
      });
      const result = await getEndpoints.call(mockCtx);
      expect(result).toHaveLength(2);
      expect(result[1].name).toContain('showing first 100');
    });

    // A dropdown that cannot load says so instead of showing an empty list (#41)
    it('should report an error instead of returning an empty list', async () => {
      const mockCtx = createMockLoadOptionsFunctions({});
      (mockCtx.helpers.httpRequest as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'));
      await expect(getEndpoints.call(mockCtx)).rejects.toThrow(/Could not load endpoints: .*fail/);
    });

    it('should return an empty list when bConnect returns no data', async () => {
      const mockCtx = createMockLoadOptionsFunctions({ data: [], hasNextPage: false });
      await expect(getEndpoints.call(mockCtx)).resolves.toEqual([]);
    });
  });

  describe('getJobDefinitions', () => {
    it('should return job options with type labels', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [
          { id: 'j1', name: 'Deploy', type: 'Install' },
          { id: 'j2', name: 'Patch' },
        ],
        hasNextPage: false,
      });
      const result = await getJobDefinitions.call(mockCtx);
      expect(result[0]).toEqual({ name: 'Deploy [Install]', value: 'j1' });
      expect(result[1]).toEqual({ name: 'Patch', value: 'j2' });
    });

    it('should report an error instead of returning an empty list', async () => {
      const mockCtx = createMockLoadOptionsFunctions({});
      (mockCtx.helpers.httpRequest as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'));
      await expect(getJobDefinitions.call(mockCtx)).rejects.toThrow(/Could not load job definitions: .*fail/);
    });
  });

  describe('getOrgUnits', () => {
    it('should return org unit options', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [{ id: 'ou1', name: 'HQ' }, { id: 'ou2' }],
        hasNextPage: false,
      });
      const result = await getOrgUnits.call(mockCtx);
      expect(result[0]).toEqual({ name: 'HQ', value: 'ou1' });
      expect(result[1]).toEqual({ name: 'ou2', value: 'ou2' });
    });

    // Org units live in the Active Directory module (#38)
    it('should request /activedirectory/v2.0/OrgUnits', async () => {
      const mockCtx = createMockLoadOptionsFunctions({ data: [], hasNextPage: false });
      await getOrgUnits.call(mockCtx);
      expect(mockCtx.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'GET', url: '/activedirectory/v2.0/OrgUnits' }),
      );
    });

    it('should report an error instead of returning an empty list', async () => {
      const mockCtx = createMockLoadOptionsFunctions({});
      (mockCtx.helpers.httpRequest as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('404 Not Found'));
      await expect(getOrgUnits.call(mockCtx)).rejects.toThrow(/Could not load org units: .*404/);
    });
  });

  describe('getLogicalGroups (getNamedItems)', () => {
    it('should return group options via getNamedItems', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [{ id: 'g1', name: 'Group A' }],
        hasNextPage: false,
      });
      const result = await getLogicalGroups.call(mockCtx);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: 'Group A', value: 'g1' });
    });



    it('should add truncation notice when hasNextPage is true (getNamedItems)', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [{ id: 'g1', name: 'Group1' }],
        hasNextPage: true,
      });
      const result = await getLogicalGroups.call(mockCtx);
      expect(result).toHaveLength(2);
      expect(result[1].name).toContain('showing first 100');
    });

    it('should report an error instead of returning an empty list (getNamedItems)', async () => {
      const mockCtx = createMockLoadOptionsFunctions({});
      (mockCtx.helpers.httpRequest as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'));
      await expect(getLogicalGroups.call(mockCtx)).rejects.toThrow(/Could not load logical groups: .*fail/);
    });
  });
});

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

    it('should return empty results for invalid OData filter', async () => {
      const mockCtx = createMockLoadOptionsFunctions({});
      const result = await jobDefinitionSearch.call(mockCtx, 'bad"input');
      expect(result.results).toHaveLength(0);
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

    it('should support filter parameter', async () => {
      const mockCtx = createMockLoadOptionsFunctions({
        data: [{ id: 'folder-4', name: 'Prod' }],
        hasNextPage: false,
      });
      const result = await jobFolderSearch.call(mockCtx, 'Prod');
      expect(result.results).toHaveLength(1);
      const httpRequest = mockCtx.helpers.httpRequest as ReturnType<typeof vi.fn>;
      expect(httpRequest.mock.calls[0][0].qs.SearchQuery).toContain('Prod');
    });

    it('should return empty results for invalid OData filter', async () => {
      const mockCtx = createMockLoadOptionsFunctions({});
      const result = await jobFolderSearch.call(mockCtx, 'bad"input');
      expect(result.results).toHaveLength(0);
    });
  });
});
