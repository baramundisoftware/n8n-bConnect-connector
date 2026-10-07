import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { get, getMany, execute, getInstances, getAllJobInstances, getJobInstance, getEndpointJobInstances, startJobInstance, stopJobInstance, resumeJobInstance, deleteJobInstance, getFolders, getFolder, createFolder, updateFolder, deleteFolder, getKioskReleases, getKioskRelease, createKioskRelease, withdrawKioskRelease, getSubFolders, getJobDefinitionsByFolder, getKioskReleasesByJobDefinition, getJobInstancesByLogicalGroup, getJobInstancesByStaticGroup, getJobInstancesByDynamicGroup, getJobInstancesByUDG, assignJobToLogicalGroup, assignJobToStaticGroup, assignJobToDynamicGroup, assignJobToUDG, getKioskReleasesByEndpoint, getKioskReleasesByLogicalGroup, getKioskReleasesByADObject } from '../../../../../nodes/BaramundiJob/actions/job/job.execute';

// Mock helper function to create IExecuteFunctions
function createMockExecuteFunctions(
  params: Record<string, any> = {},
  credentials: Record<string, any> = {},
  mockResponse: any = {},
  mockResponses: any[] = [],
): IExecuteFunctions {
  let callIndex = 0;

  const httpRequest = vi.fn(async () => {
    if (mockResponses.length > 0) {
      const response = mockResponses[callIndex] || mockResponse;
      callIndex++;
      return response;
    }
    return mockResponse;
  });

  return {
    getNodeParameter: vi.fn((name: string, index: number, defaultValue?: any) => {
      return params[name] !== undefined ? params[name] : defaultValue;
    }),
    getCredentials: vi.fn(async () => ({
      baseUrl: 'https://bms.example.com:444/bconnect',
      username: 'Administrator',
      password: 'test-password-do-not-use',
      ignoreSslIssues: false,
      ...credentials,
    })),
    helpers: {
      httpRequest,
      returnJsonArray: vi.fn((data: any) => {
        if (Array.isArray(data)) {
          return data.map((item) => ({ json: item })) as INodeExecutionData[];
        }
        return [{ json: data }] as INodeExecutionData[];
      }),
    },
    getNode: vi.fn(() => ({
      id: 'test-node-id',
      name: 'Baramundi',
      type: 'n8n-nodes-baramundi.baramundi',
      typeVersion: 1,
      position: [0, 0],
      parameters: {},
    })),
  } as unknown as IExecuteFunctions;
}

describe('Job Operations', () => {
  describe('get()', () => {
    it('should fetch a single job by ID', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const mockJob = {
        id: jobId,
        name: 'Windows Update Deployment',
        description: 'Deploy critical Windows updates',
        type: 'Deployment',
      };

      const mockContext = createMockExecuteFunctions(
        { jobId },
        {},
        mockJob
      );

      const result = await get.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockJob);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/jobs/v2.0/JobDefinitions/${jobId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent jobs', async () => {
      const jobId = '88888888-8888-8888-8888-888888888888';
      const mockContext = createMockExecuteFunctions({ jobId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(get.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  describe('getMany()', () => {
    it('should fetch multiple jobs with pagination', async () => {
      const mockJobs = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'job-1', name: 'Windows Update', type: 'Deployment' },
          { id: 'job-2', name: 'Software Installation', type: 'Deployment' },
          { id: 'job-3', name: 'Inventory Scan', type: 'Inventory' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockJobs
      );

      const result = await getMany.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.id).toBe('job-1');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/jobs/v2.0/JobDefinitions'),
          qs: expect.objectContaining({
            PageSize: 50,
            Page: 0,
          }),
        })
      );
    });

    it('should fetch all jobs when returnAll is true', async () => {
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'job-1', name: 'Job 1' },
          { id: 'job-2', name: 'Job 2' },
        ],
      };

      const mockPage2 = {
        currentPage: 1,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: true,
        hasNextPage: false,
        data: [
          { id: 'job-3', name: 'Job 3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getMany.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.id).toBe('job-1');
      expect(result[2].json.id).toBe('job-3');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should support SearchQuery option', async () => {
      const mockJobs = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'job-1', name: 'Windows Update', type: 'Deployment' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { searchQuery: 'Windows' },
        },
        {},
        mockJobs
      );

      await getMany.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            SearchQuery: 'Windows',
          }),
        })
      );
    });

    it('should support OrderBy option', async () => {
      const mockJobs = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'job-2', name: 'Job B' },
          { id: 'job-1', name: 'Job A' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { orderBy: 'Name desc' },
        },
        {},
        mockJobs
      );

      await getMany.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            OrderBy: 'Name desc',
          }),
        })
      );
    });

    it('should handle empty results', async () => {
      const mockEmptyJobs = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 0,
        totalItems: 0,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockEmptyJobs
      );

      const result = await getMany.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });
  });

  describe('execute()', () => {
    it('should execute a job on a single endpoint', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockResponse = {
        jobInstanceId: 'instance-123',
        status: 'Pending',
        endpointIds: [endpointId],
      };

      const mockContext = createMockExecuteFunctions(
        { jobId,
          endpointIds: endpointId,
        },
        {},
        mockResponse
      );

      const result = await execute.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining(`/jobs/v2.0/JobInstances`),
          body: expect.objectContaining({
            endpointId, jobDefinitionId: jobId,
          }),
        })
      );
    });

    it('should execute a job on multiple endpoints', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const endpointIds = '11111111-1111-1111-1111-111111111111, 22222222-2222-2222-2222-222222222222, 33333333-3333-3333-3333-333333333333';
      const mockResponse = {
        jobInstanceId: 'instance-123',
        status: 'Pending',
        endpointIds: ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'],
      };

      const mockContext = createMockExecuteFunctions(
        { jobId,
          endpointIds,
        },
        {},
        mockResponse
      );

      const result = await execute.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            endpointId: '11111111-1111-1111-1111-111111111111', jobDefinitionId: jobId,
          }),
        })
      );
    });

    // JobInstanceForCreation: jobDefinitionId, endpointId, startIfAlreadyAssigned (#45)
    it('should send startIfAlreadyAssigned when set', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockContext = createMockExecuteFunctions(
        { jobId, endpointIds: endpointId, options: { startIfAlreadyAssigned: true } },
        {},
        { id: 'instance-123' }
      );

      await execute.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { jobDefinitionId: jobId, endpointId, startIfAlreadyAssigned: true },
        })
      );
    });

    it('should create one job instance per endpoint', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const ids = ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'];
      const mockContext = createMockExecuteFunctions(
        { jobId, endpointIds: ` ${ids.join(' , ')} `, options: {} },
        {},
        { id: 'instance' }
      );

      const result = await execute.call(mockContext, 0);

      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(3);
      ids.forEach((endpointId, n) => {
        expect(mockContext.helpers.httpRequest).toHaveBeenNthCalledWith(
          n + 1,
          expect.objectContaining({ method: 'POST', body: { jobDefinitionId: jobId, endpointId } }),
        );
      });
    });

    it('should reject invalid endpoint IDs before sending anything', async () => {
      const mockContext = createMockExecuteFunctions(
        { jobId: '12345678-1234-1234-1234-123456789abc', endpointIds: '11111111-1111-1111-1111-111111111111, nope', options: {} },
        {},
        {}
      );

      await expect(execute.call(mockContext, 0)).rejects.toThrow(/Invalid endpoint ID\(s\): nope/);
      expect(mockContext.helpers.httpRequest).not.toHaveBeenCalled();
    });

    it('should handle errors when executing job', async () => {
      const jobId = '88888888-8888-8888-8888-888888888888';
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockContext = createMockExecuteFunctions(
        { jobId,
        endpointIds: endpointId,
      });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Job not found');
        error.statusCode = 404;
        throw error;
      });

      await expect(execute.call(mockContext, 0)).rejects.toThrow('Job not found');
    });
  });

  describe('getInstances()', () => {
    it('should fetch job instances with pagination', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const mockInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          {
            id: 'instance-1',
            jobId,
            status: 'Completed',
            startTime: '2026-01-20T10:00:00Z',
          },
          {
            id: 'instance-2',
            jobId,
            status: 'Running',
            startTime: '2026-01-20T11:00:00Z',
          },
          {
            id: 'instance-3',
            jobId,
            status: 'Failed',
            startTime: '2026-01-20T12:00:00Z',
          },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { jobId,
          returnAll: false,
          limit: 50,
        },
        {},
        mockInstances
      );

      const result = await getInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.status).toBe('Completed');
      expect(result[1].json.status).toBe('Running');
      expect(result[2].json.status).toBe('Failed');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/jobs/v2.0/JobInstances`),
          qs: expect.objectContaining({
            PageSize: 50,
            Page: 0,
          }),
        })
      );
    });

    it('should fetch all job instances when returnAll is true', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'instance-1', status: 'Completed' },
          { id: 'instance-2', status: 'Running' },
        ],
      };

      const mockPage2 = {
        currentPage: 1,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: true,
        hasNextPage: false,
        data: [
          { id: 'instance-3', status: 'Pending' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { jobId,
          returnAll: true,
        },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.id).toBe('instance-1');
      expect(result[2].json.id).toBe('instance-3');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should handle empty job instances', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const mockEmptyInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 0,
        totalItems: 0,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [],
      };

      const mockContext = createMockExecuteFunctions(
        { jobId,
          returnAll: false,
          limit: 50,
        },
        {},
        mockEmptyInstances
      );

      const result = await getInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });

    it('should handle errors when fetching job instances', async () => {
      const jobId = '88888888-8888-8888-8888-888888888888';
      const mockContext = createMockExecuteFunctions(
        { jobId,
        returnAll: false,
        limit: 50,
      });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Job not found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getInstances.call(mockContext, 0)).rejects.toThrow('Job not found');
    });
  });

  describe('getAllJobInstances()', () => {
    it('should fetch all job instances with pagination (no job filter)', async () => {
      const mockInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 5,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'inst-1', jobDefinitionId: 'job-1', status: 'Completed' },
          { id: 'inst-2', jobDefinitionId: 'job-2', status: 'Running' },
          { id: 'inst-3', jobDefinitionId: 'job-1', status: 'Failed' },
          { id: 'inst-4', jobDefinitionId: 'job-3', status: 'Pending' },
          { id: 'inst-5', jobDefinitionId: 'job-2', status: 'Completed' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockInstances
      );

      const result = await getAllJobInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(5);
      // Verify instances from DIFFERENT jobs are returned
      const jobIds = result.map(r => r.json.jobDefinitionId);
      expect(new Set(jobIds).size).toBeGreaterThan(1);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/jobs/v2.0/JobInstances`),
          qs: expect.objectContaining({
            PageSize: 50,
            Page: 0,
          }),
        })
      );
      // CRITICAL: Verify NO hardcoded SearchQuery filter
      const callArgs = (mockContext.helpers.httpRequest as any).mock.calls[0][0];
      expect(callArgs.qs.SearchQuery).toBeUndefined();
    });

    it('should fetch all job instances when returnAll is true', async () => {
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'inst-1', jobDefinitionId: 'job-1', status: 'Completed' },
          { id: 'inst-2', jobDefinitionId: 'job-2', status: 'Running' },
        ],
      };

      const mockPage2 = {
        currentPage: 1,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: true,
        hasNextPage: false,
        data: [
          { id: 'inst-3', jobDefinitionId: 'job-3', status: 'Pending' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getAllJobInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.id).toBe('inst-1');
      expect(result[2].json.id).toBe('inst-3');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should support optional SearchQuery filter', async () => {
      const mockInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'inst-1', status: 'Running' },
          { id: 'inst-2', status: 'Running' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { searchQuery: 'Status eq Running' },
        },
        {},
        mockInstances
      );

      await getAllJobInstances.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            SearchQuery: 'Status eq Running',
          }),
        })
      );
    });

    it('should support optional OrderBy parameter', async () => {
      const mockInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'inst-2', startTime: '2026-01-26T12:00:00Z' },
          { id: 'inst-1', startTime: '2026-01-26T10:00:00Z' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: { orderBy: 'StartTime desc' },
        },
        {},
        mockInstances
      );

      await getAllJobInstances.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            OrderBy: 'StartTime desc',
          }),
        })
      );
    });

    it('should handle empty job instances', async () => {
      const mockEmptyInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 0,
        totalItems: 0,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockEmptyInstances
      );

      const result = await getAllJobInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });

    it('should handle errors when fetching all job instances', async () => {
      const mockContext = createMockExecuteFunctions({
        returnAll: false,
        limit: 50,
      });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('API Error');
        error.statusCode = 500;
        throw error;
      });

      await expect(getAllJobInstances.call(mockContext, 0)).rejects.toThrow('API Error');
    });

    it('should support both SearchQuery and OrderBy together', async () => {
      const mockInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'inst-1', status: 'Running', startTime: '2026-01-26T10:00:00Z' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          returnAll: false,
          limit: 50,
          options: {
            searchQuery: 'Status eq Running',
            orderBy: 'StartTime desc',
          },
        },
        {},
        mockInstances
      );

      await getAllJobInstances.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            SearchQuery: 'Status eq Running',
            OrderBy: 'StartTime desc',
          }),
        })
      );
    });
  });

  describe('Credential Configuration', () => {
    it('should use correct base URL from credentials', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const mockJob = { id: jobId, name: 'Test Job' };

      const mockContext = createMockExecuteFunctions({ jobId },
        { baseUrl: 'https://custom-bms-server:443/bconnect' },
        mockJob
      );

      await get.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom-bms-server:443/bconnect',
        })
      );
    });

    it('should use SSL skip option from credentials', async () => {
      const jobId = '12345678-1234-1234-1234-123456789abc';
      const mockJob = { id: jobId, name: 'Test Job' };

      const mockContext = createMockExecuteFunctions({ jobId },
        { ignoreSslIssues: true },
        mockJob
      );

      await get.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          skipSslCertificateValidation: true,
        })
      );
    });
  });

  describe('getJobInstance()', () => {
    it('should fetch a single job instance by ID', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockInstance = {
        id: instanceId,
        jobDefinitionId: 'job-123',
        status: 'Running',
        startTime: '2026-01-20T10:00:00Z',
        endpointId: 'endpoint-456',
      };

      const mockContext = createMockExecuteFunctions(
        { instanceId },
        {},
        mockInstance
      );

      const result = await getJobInstance.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockInstance);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/jobs/v2.0/JobInstances/${instanceId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent job instances', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockContext = createMockExecuteFunctions({ instanceId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getJobInstance.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  describe('getEndpointJobInstances()', () => {
    it('should fetch job instances for a specific endpoint with pagination', async () => {
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          {
            id: 'instance-1',
            jobDefinitionId: 'job-123',
            endpointId,
            status: 'Completed',
            startTime: '2026-01-20T10:00:00Z',
          },
          {
            id: 'instance-2',
            jobDefinitionId: 'job-456',
            endpointId,
            status: 'Running',
            startTime: '2026-01-20T11:00:00Z',
          },
          {
            id: 'instance-3',
            jobDefinitionId: 'job-789',
            endpointId,
            status: 'Failed',
            startTime: '2026-01-20T12:00:00Z',
          },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointId,
          returnAll: false,
          limit: 50,
        },
        {},
        mockInstances
      );

      const result = await getEndpointJobInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.status).toBe('Completed');
      expect(result[1].json.status).toBe('Running');
      expect(result[2].json.status).toBe('Failed');
      expect(result[0].json.endpointId).toBe(endpointId);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/jobs/v2.0/Endpoints/${endpointId}/JobInstances`),
          qs: expect.objectContaining({
            PageSize: 50,
            Page: 0,
          }),
        })
      );
    });

    it('should fetch all endpoint job instances when returnAll is true', async () => {
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'instance-1', endpointId, status: 'Completed' },
          { id: 'instance-2', endpointId, status: 'Running' },
        ],
      };

      const mockPage2 = {
        currentPage: 1,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: true,
        hasNextPage: false,
        data: [
          { id: 'instance-3', endpointId, status: 'Pending' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointId,
          returnAll: true,
        },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getEndpointJobInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(result[0].json.id).toBe('instance-1');
      expect(result[2].json.id).toBe('instance-3');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should handle custom endpoint GUID input', async () => {
      const customEndpointId = '11111111-1111-1111-1111-111111111111';
      const mockInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 1,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'instance-1', endpointId: customEndpointId, status: 'Running' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
                    endpointId: customEndpointId,
          returnAll: false,
          limit: 50,
        },
        {},
        mockInstances
      );

      const result = await getEndpointJobInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining(`/jobs/v2.0/Endpoints/${customEndpointId}/JobInstances`),
        })
      );
    });

    it('should handle empty job instances for endpoint', async () => {
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockEmptyInstances = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 0,
        totalItems: 0,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [],
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointId,
          returnAll: false,
          limit: 50,
        },
        {},
        mockEmptyInstances
      );

      const result = await getEndpointJobInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });

    it('should handle errors when fetching endpoint job instances', async () => {
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockContext = createMockExecuteFunctions({
        endpointId,
        endpointId,
        returnAll: false,
        limit: 50,
      });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Endpoint not found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getEndpointJobInstances.call(mockContext, 0)).rejects.toThrow('Endpoint not found');
    });

    it('should support different page sizes', async () => {
      const endpointId = '11111111-1111-1111-1111-111111111111';
      const mockInstances = {
        currentPage: 0,
        pageSize: 10,
        totalPages: 1,
        totalItems: 5,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'instance-1', endpointId, status: 'Completed' },
          { id: 'instance-2', endpointId, status: 'Running' },
          { id: 'instance-3', endpointId, status: 'Pending' },
          { id: 'instance-4', endpointId, status: 'Failed' },
          { id: 'instance-5', endpointId, status: 'Completed' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        {
          endpointId,
          endpointId,
          returnAll: false,
          limit: 10,
        },
        {},
        mockInstances
      );

      const result = await getEndpointJobInstances.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(5);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            PageSize: 10,
            Page: 0,
          }),
        })
      );
    });
  });

  describe('startJobInstance()', () => {
    it('should start a job instance', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockResponse = { success: true };

      const mockContext = createMockExecuteFunctions(
        { instanceId },
        {},
        mockResponse
      );

      const result = await startJobInstance.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toEqual({ success: true, startedId: instanceId });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining(`/jobs/v2.0/JobInstances/${instanceId}/Start`),
        })
      );
    });

    it('should handle errors when starting job instance', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockContext = createMockExecuteFunctions({ instanceId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Cannot start completed job');
        error.statusCode = 400;
        throw error;
      });

      await expect(startJobInstance.call(mockContext, 0)).rejects.toThrow('Cannot start completed job');
    });
  });

  describe('stopJobInstance()', () => {
    it('should stop a running job instance', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockResponse = { success: true };

      const mockContext = createMockExecuteFunctions(
        { instanceId },
        {},
        mockResponse
      );

      const result = await stopJobInstance.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toEqual({ success: true, stoppedId: instanceId });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining(`/jobs/v2.0/JobInstances/${instanceId}/Stop`),
        })
      );
    });

    it('should handle errors when stopping job instance', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockContext = createMockExecuteFunctions({ instanceId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Cannot stop completed job');
        error.statusCode = 400;
        throw error;
      });

      await expect(stopJobInstance.call(mockContext, 0)).rejects.toThrow('Cannot stop completed job');
    });
  });

  describe('resumeJobInstance()', () => {
    it('should resume a paused job instance', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockResponse = { success: true };

      const mockContext = createMockExecuteFunctions(
        { instanceId },
        {},
        mockResponse
      );

      const result = await resumeJobInstance.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toEqual({ success: true, resumedId: instanceId });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining(`/jobs/v2.0/JobInstances/${instanceId}/Resume`),
        })
      );
    });

    it('should handle errors when resuming job instance', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockContext = createMockExecuteFunctions({ instanceId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Cannot resume running job');
        error.statusCode = 400;
        throw error;
      });

      await expect(resumeJobInstance.call(mockContext, 0)).rejects.toThrow('Cannot resume running job');
    });
  });

  describe('deleteJobInstance()', () => {
    it('should delete a job instance', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockResponse = {};

      const mockContext = createMockExecuteFunctions(
        { instanceId },
        {},
        mockResponse
      );

      const result = await deleteJobInstance.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toEqual({ success: true, deletedId: instanceId });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: expect.stringContaining(`/jobs/v2.0/JobInstances/${instanceId}`),
        })
      );
    });

    it('should handle 404 errors when deleting non-existent instance', async () => {
      const instanceId = '99999999-9999-9999-9999-999999999999';
      const mockContext = createMockExecuteFunctions({ instanceId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(deleteJobInstance.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  describe('getFolders()', () => {
    it('should fetch all job folders', async () => {
      const mockFolders = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'folder-1', name: 'Deployments', parentId: null },
          { id: 'folder-2', name: 'Security Patches', parentId: 'folder-1' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockFolders
      );

      const result = await getFolders.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result[0].json.name).toBe('Deployments');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/jobs/v2.0/Folders'),
        })
      );
    });

    it('should fetch all folders when returnAll is true', async () => {
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'folder-1', name: 'Folder 1' },
          { id: 'folder-2', name: 'Folder 2' },
        ],
      };

      const mockPage2 = {
        currentPage: 1,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: true,
        hasNextPage: false,
        data: [
          { id: 'folder-3', name: 'Folder 3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getFolders.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('getFolder()', () => {
    it('should fetch a single folder by ID', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockFolder = {
        id: folderId,
        name: 'Security Patches',
        parentId: 'folder-parent',
        description: 'Critical security updates',
      };

      const mockContext = createMockExecuteFunctions(
        { folderId },
        {},
        mockFolder
      );

      const result = await getFolder.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockFolder);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/jobs/v2.0/Folders/${folderId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent folders', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockContext = createMockExecuteFunctions({ folderId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getFolder.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  describe('createFolder()', () => {
    it('should create a new job folder', async () => {
      const folderName = 'New Deployments';
      const mockResponse = {
        id: 'folder-new',
        name: folderName,
        parentId: null,
      };

      const mockContext = createMockExecuteFunctions(
        { name: folderName },
        {},
        mockResponse
      );

      const result = await createFolder.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.name).toBe(folderName);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/jobs/v2.0/Folders'),
          body: expect.objectContaining({
            name: folderName,
          }),
        })
      );
    });

    it('should create folder with parent and description', async () => {
      const folderName = 'Sub Folder';
      const parentId = 'folder-parent';
      const description = 'Nested folder for organization';
      const mockResponse = {
        id: 'folder-new',
        name: folderName,
        parentId,
        description,
      };

      const mockContext = createMockExecuteFunctions(
        {
          name: folderName,
          additionalFields: { parentId, description },
        },
        {},
        mockResponse
      );

      const result = await createFolder.call(mockContext, 0);

      expect(result[0].json.parentId).toBe(parentId);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            name: folderName,
            parentId,
            description,
          }),
        })
      );
    });

    it('should handle 409 errors when creating duplicate folder', async () => {
      const folderName = 'Existing Folder';
      const mockContext = createMockExecuteFunctions({ name: folderName });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Folder already exists');
        error.statusCode = 409;
        throw error;
      });

      await expect(createFolder.call(mockContext, 0)).rejects.toThrow('Folder already exists');
    });
  });

  describe('updateFolder()', () => {
    it('should update folder with single field', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const newName = 'Updated Folder Name';
      const mockResponse = {
        id: folderId,
        name: newName,
      };

      const mockContext = createMockExecuteFunctions(
        {
          folderId,
          updateFields: { name: newName },
        },
        {},
        {},
        [{}, mockResponse]
      );

      const result = await updateFolder.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json.name).toBe(newName);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          url: expect.stringContaining(`/jobs/v2.0/Folders/${folderId}`),
          body: expect.arrayContaining([
            expect.objectContaining({
              op: 'replace',
              path: '/name',
              value: newName,
            }),
          ]),
        })
      );
    });

    it('should update folder with multiple fields', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockResponse = {
        id: folderId,
        name: 'New Name',
        description: 'New Description',
      };

      const mockContext = createMockExecuteFunctions(
        {
          folderId,
          updateFields: {
            name: 'New Name',
            description: 'New Description',
          },
        },
        {},
        {},
        [{}, mockResponse]
      );

      await updateFolder.call(mockContext, 0);

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PATCH',
          body: expect.arrayContaining([
            expect.objectContaining({ path: '/name' }),
            expect.objectContaining({ path: '/description' }),
          ]),
        })
      );
    });

    it('should throw error when no fields to update', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockContext = createMockExecuteFunctions({
        folderId,
        updateFields: {},
      });

      await expect(updateFolder.call(mockContext, 0)).rejects.toThrow('No fields to update specified');
    });

    it('should ignore empty values in update', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockResponse = { id: folderId, name: 'Name' };

      const mockContext = createMockExecuteFunctions(
        {
          folderId,
          updateFields: { name: 'Name', description: '' },
        },
        {},
        {},
        [{}, mockResponse]
      );

      await updateFolder.call(mockContext, 0);

      const callBody = (mockContext.helpers.httpRequest as any).mock.calls[0][0].body;
      expect(callBody).toHaveLength(1);
      expect(callBody[0].path).toBe('/name');
    });

    it('should handle 404 errors when updating non-existent folder', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockContext = createMockExecuteFunctions({
        folderId,
        updateFields: { name: 'New Name' },
      });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(updateFolder.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  describe('deleteFolder()', () => {
    it('should delete a folder', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockResponse = {};

      const mockContext = createMockExecuteFunctions(
        { folderId },
        {},
        mockResponse
      );

      const result = await deleteFolder.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toEqual({ success: true, deletedId: folderId });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: expect.stringContaining(`/jobs/v2.0/Folders/${folderId}`),
        })
      );
    });

    it('should handle 404 errors when deleting non-existent folder', async () => {
      const folderId = '77777777-7777-7777-7777-777777777777';
      const mockContext = createMockExecuteFunctions({ folderId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(deleteFolder.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  describe('getKioskReleases()', () => {
    it('should fetch all kiosk releases', async () => {
      const mockReleases = {
        currentPage: 0,
        pageSize: 50,
        totalPages: 1,
        totalItems: 2,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: 'release-1', jobDefinitionId: 'job-1', targetType: 'Endpoint' },
          { id: 'release-2', jobDefinitionId: 'job-2', targetType: 'LogicalGroup' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: false, limit: 50 },
        {},
        mockReleases
      );

      const result = await getKioskReleases.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/jobs/v2.0/KioskReleases'),
        })
      );
    });

    it('should fetch all kiosk releases when returnAll is true', async () => {
      const mockPage1 = {
        currentPage: 0,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: true,
        data: [
          { id: 'release-1', jobDefinitionId: 'job-1' },
          { id: 'release-2', jobDefinitionId: 'job-2' },
        ],
      };

      const mockPage2 = {
        currentPage: 1,
        pageSize: 2,
        totalPages: 2,
        totalItems: 3,
        hasPreviousPage: true,
        hasNextPage: false,
        data: [
          { id: 'release-3', jobDefinitionId: 'job-3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(
        { returnAll: true },
        {},
        {},
        [mockPage1, mockPage2]
      );

      const result = await getKioskReleases.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe('getKioskRelease()', () => {
    it('should fetch a single kiosk release by ID', async () => {
      const releaseId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const mockRelease = {
        id: releaseId,
        jobDefinitionId: '88888888-8888-8888-8888-888888888888',
        targetType: 'LogicalGroup',
        targetId: '22222222-2222-2222-2222-222222222222',
      };

      const mockContext = createMockExecuteFunctions(
        { releaseId },
        {},
        mockRelease
      );

      const result = await getKioskRelease.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockRelease);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining(`/jobs/v2.0/KioskReleases/${releaseId}`),
        })
      );
    });

    it('should handle 404 errors for non-existent kiosk releases', async () => {
      const releaseId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const mockContext = createMockExecuteFunctions({ releaseId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(getKioskRelease.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });

  // KioskReleaseForCreation: assignmentTargetId and jobDefinitionId, both required (#45)
  describe('createKioskRelease()', () => {
    it('should create a new kiosk release', async () => {
      const jobDefinitionId = '88888888-8888-8888-8888-888888888888';
      const assignmentTargetId = '80808080-8080-8080-8080-808080808080';
      const mockContext = createMockExecuteFunctions(
        { jobDefinitionId, assignmentTargetId },
        {},
        { id: 'release-new', jobDefinitionId, assignmentTargetId }
      );

      const result = await createKioskRelease.call(mockContext, 0);

      expect(result[0].json.jobDefinitionId).toBe(jobDefinitionId);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/jobs/v2.0/KioskReleases'),
          body: { jobDefinitionId, assignmentTargetId },
        })
      );
    });

    it('should reject an invalid assignment target ID', async () => {
      const mockContext = createMockExecuteFunctions({
        jobDefinitionId: '88888888-8888-8888-8888-888888888888',
        assignmentTargetId: 'not-a-guid',
      });
      await expect(createKioskRelease.call(mockContext, 0)).rejects.toThrow(/GUID/i);
    });

    it('should handle 409 errors when creating duplicate kiosk release', async () => {
      const mockContext = createMockExecuteFunctions({
        jobDefinitionId: '88888888-8888-8888-8888-888888888888',
        assignmentTargetId: '80808080-8080-8080-8080-808080808080',
      });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Kiosk release already exists');
        error.statusCode = 409;
        throw error;
      });

      await expect(createKioskRelease.call(mockContext, 0)).rejects.toThrow('Kiosk release already exists');
    });
  });

  describe('withdrawKioskRelease()', () => {
    it('should withdraw (delete) a kiosk release', async () => {
      const releaseId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const mockResponse = {};

      const mockContext = createMockExecuteFunctions(
        { releaseId },
        {},
        mockResponse
      );

      const result = await withdrawKioskRelease.call(mockContext, 0);

      expect(result).toBeDefined();
      expect(result[0].json).toEqual({ success: true, withdrawnId: releaseId });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: expect.stringContaining(`/jobs/v2.0/KioskReleases/${releaseId}`),
        })
      );
    });

    it('should handle 404 errors when withdrawing non-existent release', async () => {
      const releaseId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const mockContext = createMockExecuteFunctions({ releaseId });

      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Not Found');
        error.statusCode = 404;
        throw error;
      });

      await expect(withdrawKioskRelease.call(mockContext, 0)).rejects.toThrow('Not Found');
    });
  });
});

describe('Job Phase 8D - Folder/Group/Kiosk Navigation', () => {
  const pageResponse = (items: any[]) => ({
    currentPage: 0, pageSize: 50, totalPages: 1, totalItems: items.length,
    hasPreviousPage: false, hasNextPage: false, data: items,
  });

  function createCtx(params: Record<string, any>, response: any) {
    return {
      getNodeParameter: vi.fn((name: string, _idx: number, def?: any) => params[name] ?? def),
      getCredentials: vi.fn(async () => ({ baseUrl: 'https://bms:444/bconnect', username: 'u', password: 'test-password-do-not-use', ignoreSslIssues: false })),
      helpers: {
        httpRequest: vi.fn(async () => response),
        returnJsonArray: vi.fn((data: any) => (Array.isArray(data) ? data : [data]).map((j: any) => ({ json: j }))),
      },
      getNode: vi.fn(() => ({ name: 'Baramundi', type: 'n8n-nodes-baramundi.baramundi', typeVersion: 1, position: [0,0], parameters: {} })),
    } as any;
  }

  it('getSubFolders — returns sub-folders for a folder', async () => {
    const ctx = createCtx({ folderId: '77777777-7777-7777-7777-777777777777', returnAll: false, limit: 50 }, pageResponse([{ id: 'sf-1', name: 'Sub' }]));
    const result = await getSubFolders.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/jobs/v2.0/Folders/77777777-7777-7777-7777-777777777777/Folders') }));
  });

  it('getJobDefinitionsByFolder — returns job defs in a folder', async () => {
    const ctx = createCtx({ folderId: '77777777-7777-7777-7777-777777777777', returnAll: false, limit: 50 }, pageResponse([{ id: 'jd-1' }, { id: 'jd-2' }]));
    const result = await getJobDefinitionsByFolder.call(ctx, 0);
    expect(result).toHaveLength(2);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/jobs/v2.0/Folders/77777777-7777-7777-7777-777777777777/JobDefinitions') }));
  });

  it('getKioskReleasesByJobDefinition — returns kiosk releases for a job def', async () => {
    const ctx = createCtx({ jobId: '88888888-8888-8888-8888-888888888888', returnAll: false, limit: 50 }, pageResponse([{ id: 'kr-1' }]));
    const result = await getKioskReleasesByJobDefinition.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/jobs/v2.0/JobDefinitions/88888888-8888-8888-8888-888888888888/KioskReleases') }));
  });

  it('getJobInstancesByLogicalGroup — returns job instances', async () => {
    const ctx = createCtx({ logicalGroupId: '22222222-2222-2222-2222-222222222222', returnAll: false, limit: 50 }, pageResponse([{ id: 'ji-1' }]));
    const result = await getJobInstancesByLogicalGroup.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/jobs/v2.0/LogicalGroups/22222222-2222-2222-2222-222222222222/JobInstances') }));
  });

  it('getJobInstancesByStaticGroup — returns job instances', async () => {
    const ctx = createCtx({ staticGroupId: '50505050-5050-5050-5050-505050505050', returnAll: false, limit: 50 }, pageResponse([{ id: 'ji-2' }, { id: 'ji-3' }]));
    const result = await getJobInstancesByStaticGroup.call(ctx, 0);
    expect(result).toHaveLength(2);
  });

  it('getJobInstancesByDynamicGroup — returns job instances', async () => {
    const ctx = createCtx({ dynamicGroupId: '60606060-6060-6060-6060-606060606060', returnAll: false, limit: 50 }, pageResponse([{ id: 'ji-4' }]));
    const result = await getJobInstancesByDynamicGroup.call(ctx, 0);
    expect(result).toHaveLength(1);
  });

  it('getJobInstancesByUDG — returns job instances', async () => {
    const ctx = createCtx({ udgId: '70707070-7070-7070-7070-707070707070', returnAll: false, limit: 50 }, pageResponse([{ id: 'ji-5' }]));
    const result = await getJobInstancesByUDG.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/jobs/v2.0/UniversalDynamicGroups/70707070-7070-7070-7070-707070707070/JobInstances') }));
  });

  it('assignJobToLogicalGroup — POSTs with jobDefinitionId', async () => {
    const ctx = createCtx({ logicalGroupId: '22222222-2222-2222-2222-222222222222', jobDefinitionId: '88888888-8888-8888-8888-888888888888' }, { success: true });
    const result = await assignJobToLogicalGroup.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'POST', url: expect.stringContaining('/jobs/v2.0/LogicalGroups/22222222-2222-2222-2222-222222222222/AssignJobDefinition') }));
  });

  it('assignJobToStaticGroup — POSTs with jobDefinitionId', async () => {
    const ctx = createCtx({ staticGroupId: '50505050-5050-5050-5050-505050505050', jobDefinitionId: '88888888-8888-8888-8888-888888888888' }, { success: true });
    const result = await assignJobToStaticGroup.call(ctx, 0);
    expect(result).toHaveLength(1);
  });

  it('assignJobToDynamicGroup — POSTs with jobDefinitionId', async () => {
    const ctx = createCtx({ dynamicGroupId: '60606060-6060-6060-6060-606060606060', jobDefinitionId: '88888888-8888-8888-8888-888888888888' }, { success: true });
    const result = await assignJobToDynamicGroup.call(ctx, 0);
    expect(result).toHaveLength(1);
  });

  it('assignJobToUDG — POSTs with jobDefinitionId', async () => {
    const ctx = createCtx({ udgId: '70707070-7070-7070-7070-707070707070', jobDefinitionId: '88888888-8888-8888-8888-888888888888' }, { success: true });
    const result = await assignJobToUDG.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/jobs/v2.0/UniversalDynamicGroups/70707070-7070-7070-7070-707070707070/AssignJobDefinition') }));
  });

  it('getKioskReleasesByEndpoint — returns kiosk releases', async () => {
    const ctx = createCtx({ endpointId: '11111111-1111-1111-1111-111111111111', returnAll: false, limit: 50 }, pageResponse([{ id: 'kr-2' }]));
    const result = await getKioskReleasesByEndpoint.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/jobs/v2.0/Endpoints/11111111-1111-1111-1111-111111111111/KioskReleases') }));
  });

  it('getKioskReleasesByLogicalGroup — returns kiosk releases', async () => {
    const ctx = createCtx({ logicalGroupId: '22222222-2222-2222-2222-222222222222', returnAll: false, limit: 50 }, pageResponse([{ id: 'kr-3' }, { id: 'kr-4' }]));
    const result = await getKioskReleasesByLogicalGroup.call(ctx, 0);
    expect(result).toHaveLength(2);
  });

  it('getKioskReleasesByADObject — returns kiosk releases', async () => {
    const ctx = createCtx({ adObjectId: '66666666-6666-6666-6666-666666666666', returnAll: false, limit: 50 }, pageResponse([{ id: 'kr-5' }]));
    const result = await getKioskReleasesByADObject.call(ctx, 0);
    expect(result).toHaveLength(1);
    expect(ctx.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('/jobs/v2.0/ADObjects/66666666-6666-6666-6666-666666666666/KioskReleases') }));
  });
});

describe('Validation error paths', () => {
  function createMock(params: Record<string, any>) {
    return {
      getNodeParameter: vi.fn((name: string, _idx: number, def?: any) => params[name] ?? def),
      getCredentials: vi.fn(async () => ({ baseUrl: 'https://bms:444/bconnect', username: 'u', password: 'test-password-do-not-use', ignoreSslIssues: false })),
      helpers: {
        httpRequest: vi.fn(),
        returnJsonArray: vi.fn((data: any) => (Array.isArray(data) ? data : [data]).map((j: any) => ({ json: j }))),
      },
      getNode: vi.fn(() => ({ name: 'Baramundi', type: 'n8n-nodes-baramundi.baramundi', typeVersion: 1, position: [0,0], parameters: {} })),
    } as any;
  }

  it('should throw NodeOperationError for invalid GUID in jobId (get)', async () => {
    const mock = createMock({ jobId: 'not-a-guid' });
    await expect(get.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in jobId (execute)', async () => {
    const mock = createMock({ jobId: 'not-a-guid', targetId: '11111111-1111-1111-1111-111111111111', targetType: 'LogicalGroup' });
    await expect(execute.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in jobId (getInstances)', async () => {
    const mock = createMock({ jobId: 'not-a-guid', returnAll: false, limit: 10, options: {} });
    await expect(getInstances.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in instanceId (getJobInstance)', async () => {
    const mock = createMock({ instanceId: 'not-a-guid' });
    await expect(getJobInstance.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in endpointId (getEndpointJobInstances)', async () => {
    const mock = createMock({ endpointId: 'not-a-guid', returnAll: false, limit: 10, options: {} });
    await expect(getEndpointJobInstances.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in instanceId (startJobInstance)', async () => {
    const mock = createMock({ instanceId: 'not-a-guid' });
    await expect(startJobInstance.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in instanceId (stopJobInstance)', async () => {
    const mock = createMock({ instanceId: 'not-a-guid' });
    await expect(stopJobInstance.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in instanceId (resumeJobInstance)', async () => {
    const mock = createMock({ instanceId: 'not-a-guid' });
    await expect(resumeJobInstance.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in instanceId (deleteJobInstance)', async () => {
    const mock = createMock({ instanceId: 'not-a-guid' });
    await expect(deleteJobInstance.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in folderId (getFolder)', async () => {
    const mock = createMock({ folderId: 'not-a-guid' });
    await expect(getFolder.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in folderId (deleteFolder)', async () => {
    const mock = createMock({ folderId: 'not-a-guid' });
    await expect(deleteFolder.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in releaseId (getKioskRelease)', async () => {
    const mock = createMock({ releaseId: 'not-a-guid' });
    await expect(getKioskRelease.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid GUID in releaseId (withdrawKioskRelease)', async () => {
    const mock = createMock({ releaseId: 'not-a-guid' });
    await expect(withdrawKioskRelease.call(mock, 0)).rejects.toThrow();
  });



  it('should throw NodeOperationError for invalid OData searchQuery in getMany', async () => {
    const mock = createMock({ returnAll: false, limit: 10, options: { searchQuery: 'name eq "test"' } });
    await expect(getMany.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData orderBy in getMany', async () => {
    const mock = createMock({ returnAll: false, limit: 10, options: { orderBy: 'name "desc"' } });
    await expect(getMany.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getAllJobInstances', async () => {
    const mock = createMock({ returnAll: false, limit: 10, options: { searchQuery: 'name eq "test"' } });
    await expect(getAllJobInstances.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getFolders', async () => {
    const mock = createMock({ returnAll: false, limit: 10, options: { searchQuery: 'name eq "test"' } });
    await expect(getFolders.call(mock, 0)).rejects.toThrow();
  });

  it('should throw NodeOperationError for invalid OData searchQuery in getKioskReleases', async () => {
    const mock = createMock({ returnAll: false, limit: 10, options: { searchQuery: 'name eq "test"' } });
    await expect(getKioskReleases.call(mock, 0)).rejects.toThrow();
  });
});

describe('Job returnAll: true branches', () => {
  const multiPage1 = {
    currentPage: 0, pageSize: 2, totalPages: 2, totalItems: 3,
    hasPreviousPage: false, hasNextPage: true,
    data: [{ id: 'j1' }, { id: 'j2' }],
  };
  const multiPage2 = {
    currentPage: 1, pageSize: 2, totalPages: 2, totalItems: 3,
    hasPreviousPage: true, hasNextPage: false,
    data: [{ id: 'j3' }],
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

  it('getSubFolders returnAll=true', async () => {
    const ctx = createReturnAllCtx({ folderId: '77777777-7777-7777-7777-777777777777', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getSubFolders.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getJobDefinitionsByFolder returnAll=true', async () => {
    const ctx = createReturnAllCtx({ folderId: '77777777-7777-7777-7777-777777777777', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getJobDefinitionsByFolder.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getKioskReleasesByJobDefinition returnAll=true', async () => {
    const ctx = createReturnAllCtx({ jobId: '88888888-8888-8888-8888-888888888888', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getKioskReleasesByJobDefinition.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getJobInstancesByLogicalGroup returnAll=true', async () => {
    const ctx = createReturnAllCtx({ logicalGroupId: '22222222-2222-2222-2222-222222222222', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getJobInstancesByLogicalGroup.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getJobInstancesByStaticGroup returnAll=true', async () => {
    const ctx = createReturnAllCtx({ staticGroupId: '33333333-3333-3333-3333-333333333333', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getJobInstancesByStaticGroup.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getJobInstancesByDynamicGroup returnAll=true', async () => {
    const ctx = createReturnAllCtx({ dynamicGroupId: '44444444-4444-4444-4444-444444444444', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getJobInstancesByDynamicGroup.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getJobInstancesByUDG returnAll=true', async () => {
    const ctx = createReturnAllCtx({ udgId: '55555555-5555-5555-5555-555555555555', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getJobInstancesByUDG.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getKioskReleasesByEndpoint returnAll=true', async () => {
    const ctx = createReturnAllCtx({ endpointId: '11111111-1111-1111-1111-111111111111', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getKioskReleasesByEndpoint.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getKioskReleasesByLogicalGroup returnAll=true', async () => {
    const ctx = createReturnAllCtx({ logicalGroupId: '22222222-2222-2222-2222-222222222222', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getKioskReleasesByLogicalGroup.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getKioskReleasesByADObject returnAll=true', async () => {
    const ctx = createReturnAllCtx({ adObjectId: '66666666-6666-6666-6666-666666666666', returnAll: true }, [multiPage1, multiPage2]);
    const result = await getKioskReleasesByADObject.call(ctx, 0);
    expect(result).toHaveLength(3);
  });

  it('getKioskReleases returnAll=true', async () => {
    const ctx = createReturnAllCtx({ returnAll: true, options: {} }, [multiPage1, multiPage2]);
    const result = await getKioskReleases.call(ctx, 0);
    expect(result).toHaveLength(3);
  });
});
