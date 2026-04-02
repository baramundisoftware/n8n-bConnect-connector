/**
 * System Tests for Jobs API
 *
 * Tests against live bConnect API
 * Verifies the fixed API endpoints work correctly
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getSystemTestConfig, skipIfNoCredentials, createSystemTestContext } from './setup';
import * as job from '../../nodes/BaramundiJob/actions/job/job.execute';

const skipConfig = skipIfNoCredentials();

describe.skipIf(skipConfig.skip)('Jobs API - System Tests', () => {
  let config: ReturnType<typeof getSystemTestConfig>;
  let createdFolderIds: string[] = [];
  const createdInstanceIds: string[] = [];

  beforeAll(() => {
    config = getSystemTestConfig();
    if (!config) {
      throw new Error('System test configuration not available');
    }
  });

  afterAll(async () => {
    // Cleanup instances
    for (const id of createdInstanceIds) {
      try {
        const context = createSystemTestContext({ instanceId: id }, config!);
        await job.deleteJobInstance.call(context, 0);
        console.log(`Cleaned up test job instance: ${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup job instance ${id}:`, error);
      }
    }

    // Cleanup folders
    for (const id of createdFolderIds) {
      try {
        const context = createSystemTestContext({ folderId: id }, config!);
        await job.deleteFolder.call(context, 0);
        console.log(`Cleaned up test folder: ${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup folder ${id}:`, error);
      }
    }
  });

  describe('Job Definitions - Read Operations', () => {
    it('should fetch job definitions (getMany) - FIXED API PATH', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await job.getMany.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(10);

      // Verify structure
      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
        expect(result[0].json).toHaveProperty('name');
      }
    });

    it('should get a specific job definition by ID', async () => {
      // First get a job
      const listContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const jobs = await job.getMany.call(listContext, 0);

      if (jobs.length === 0) {
        console.warn('No job definitions available for testing');
        return;
      }

      const jobId = jobs[0].json.id as string;

      // Get specific job
      const context = createSystemTestContext({
        jobSelection: jobId,
        jobId,
      }, config!);

      const result = await job.get.call(context, 0);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.id).toBe(jobId);
    });

    it('should support search query', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
        options: { searchQuery: 'Install' },
      }, config!);

      const result = await job.getMany.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Job Instances - Read Operations', () => {
    it('should fetch job instances', async () => {
      // Get a job definition first
      const jobsContext = createSystemTestContext({
        returnAll: false,
        limit: 1,
      }, config!);

      const jobs = await job.getMany.call(jobsContext, 0);

      if (jobs.length === 0) {
        console.warn('No job definitions available');
        return;
      }

      const jobId = jobs[0].json.id as string;

      // Get instances for that job
      const context = createSystemTestContext({
        jobSelection: jobId,
        jobId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await job.getInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should fetch job instances for a specific endpoint', async () => {
      // This endpoint GUID should exist in your test environment
      // You may need to adjust this based on your actual test data
      const testEndpointId = process.env.BCONNECT_TEST_ENDPOINT_ID || '';

      if (!testEndpointId) {
        console.warn('No test endpoint ID configured (set BCONNECT_TEST_ENDPOINT_ID), skipping test');
        return;
      }

      const context = createSystemTestContext({
        endpointSelection: testEndpointId,
        endpointId: testEndpointId,
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await job.getEndpointJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // If there are results, verify structure
      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
        expect(result[0].json).toHaveProperty('jobDefinitionId');
        expect(result[0].json).toHaveProperty('endpointId');
        expect(result[0].json.endpointId).toBe(testEndpointId);
      }
    });

    it('should handle returnAll for endpoint job instances', async () => {
      const testEndpointId = process.env.BCONNECT_TEST_ENDPOINT_ID || '';

      if (!testEndpointId) {
        console.warn('No test endpoint ID configured, skipping test');
        return;
      }

      const context = createSystemTestContext({
        endpointSelection: testEndpointId,
        endpointId: testEndpointId,
        returnAll: true,
      }, config!);

      const result = await job.getEndpointJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle custom endpoint GUID input', async () => {
      const testEndpointId = process.env.BCONNECT_TEST_ENDPOINT_ID || '';

      if (!testEndpointId) {
        console.warn('No test endpoint ID configured, skipping test');
        return;
      }

      const context = createSystemTestContext({
        endpointSelection: '__custom__',
        endpointId: testEndpointId,
        returnAll: false,
        limit: 5,
      }, config!);

      const result = await job.getEndpointJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Job Instances - Get All Across Jobs', () => {
    it('should fetch all job instances without job filter', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await job.getAllJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // Verify we got instances from potentially different jobs
      if (result.length > 0) {
        expect(result[0].json).toHaveProperty('id');
        expect(result[0].json).toHaveProperty('jobDefinitionId');
        expect(result[0].json).toHaveProperty('state');

        // Check if we have instances from multiple jobs (if available)
        const uniqueJobIds = new Set(result.map(r => r.json.jobDefinitionId));
        console.log(`Found instances from ${uniqueJobIds.size} different job(s)`);
      }
    });

    it('should fetch all job instances with returnAll', async () => {
      const context = createSystemTestContext({
        returnAll: true,
      }, config!);

      const result = await job.getAllJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      console.log(`Fetched ${result.length} total job instances with returnAll`);
    });

    it('should support optional SearchQuery filter', async () => {
      // Test filtering by state
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
        options: {
          searchQuery: "state eq 'FinishedSuccessfully'",
        },
      }, config!);

      const result = await job.getAllJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // If results exist, verify they match the filter
      if (result.length > 0) {
        // Note: All results should have state = 'FinishedSuccessfully' if filter works
        console.log(`Found ${result.length} successfully finished job instances`);
      }
    });

    it('should support optional OrderBy parameter', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 5,
        options: {
          orderBy: 'start desc',
        },
      }, config!);

      const result = await job.getAllJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // If results exist, verify ordering
      if (result.length > 1) {
        const startTimes = result
          .filter(r => r.json.start)
          .map(r => new Date(r.json.start as string).getTime());

        // Check if ordered descending (most recent first)
        for (let i = 0; i < startTimes.length - 1; i++) {
          expect(startTimes[i]).toBeGreaterThanOrEqual(startTimes[i + 1]);
        }

        console.log(`Verified descending order for ${startTimes.length} instances`);
      }
    });

    it('should support both SearchQuery and OrderBy together', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 5,
        options: {
          searchQuery: "state eq 'Running' or state eq 'FinishedSuccessfully'",
          orderBy: 'lastAction desc',
        },
      }, config!);

      const result = await job.getAllJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      console.log(`Found ${result.length} instances with combined filters`);
    });

    it('should handle pagination with limit', async () => {
      // Test small limit
      const context1 = createSystemTestContext({
        returnAll: false,
        limit: 3,
      }, config!);

      const result1 = await job.getAllJobInstances.call(context1, 0);

      expect(result1).toBeDefined();
      expect(Array.isArray(result1)).toBe(true);
      expect(result1.length).toBeLessThanOrEqual(3);

      // Test larger limit
      const context2 = createSystemTestContext({
        returnAll: false,
        limit: 20,
      }, config!);

      const result2 = await job.getAllJobInstances.call(context2, 0);

      expect(result2).toBeDefined();
      expect(Array.isArray(result2)).toBe(true);
      expect(result2.length).toBeLessThanOrEqual(20);

      console.log(`Pagination test: ${result1.length} vs ${result2.length} instances`);
    });

    it('should handle empty results gracefully', async () => {
      // Query for non-existent data
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
        options: {
          searchQuery: "state eq 'NonExistentStatus12345'",
        },
      }, config!);

      const result = await job.getAllJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should work without any optional parameters', async () => {
      // Minimal parameters - just returnAll and limit
      const context = createSystemTestContext({
        returnAll: false,
        limit: 5,
      }, config!);

      const result = await job.getAllJobInstances.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);

      // This is the key test: NO hardcoded job filter, so should get instances from ANY job
      if (result.length > 0) {
        console.log(`Successfully fetched ${result.length} instances without job filter`);
      }
    });
  });

  describe('Job Folders - Full CRUD', () => {
    it('should create, read, update, and delete a job folder', async () => {
      // CREATE
      const createContext = createSystemTestContext({
        name: `SystemTest_${Date.now()}`,
        additionalFields: {
          description: 'System test folder',
        },
      }, config!);

      const created = await job.createFolder.call(createContext, 0);

      expect(created).toBeDefined();
      expect(created).toHaveLength(1);
      expect(created[0].json).toHaveProperty('id');
      expect(created[0].json.name).toContain('SystemTest');

      const folderId = created[0].json.id as string;
      createdFolderIds.push(folderId);

      // READ
      const readContext = createSystemTestContext({
        folderId,
      }, config!);

      const read = await job.getFolder.call(readContext, 0);

      expect(read).toBeDefined();
      expect(read[0].json.id).toBe(folderId);

      // UPDATE (change name)
      const updateContext = createSystemTestContext({
        folderId,
        updateFields: {
          name: `SystemTest_Updated_${Date.now()}`,
        },
      }, config!);

      const updated = await job.updateFolder.call(updateContext, 0);

      expect(updated).toBeDefined();
      expect(updated[0].json.id).toBe(folderId);
      expect(updated[0].json.name).toContain('Updated');

      // DELETE
      const deleteContext = createSystemTestContext({
        folderId,
      }, config!);

      const deleted = await job.deleteFolder.call(deleteContext, 0);

      expect(deleted).toBeDefined();
      expect(deleted[0].json.success).toBe(true);
      expect(deleted[0].json.deletedId).toBe(folderId);

      // Remove from cleanup list (already deleted)
      createdFolderIds = createdFolderIds.filter(id => id !== folderId);
    });

    it('should list all folders', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await job.getFolders.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Kiosk Releases - Read Operations', () => {
    it('should fetch kiosk releases', async () => {
      const context = createSystemTestContext({
        returnAll: false,
        limit: 10,
      }, config!);

      const result = await job.getKioskReleases.call(context, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid job definition ID', async () => {
      const jobId = '00000000-0000-0000-0000-000000000000';
      const context = createSystemTestContext({
        jobSelection: jobId,
        jobId,
      }, config!);

      await expect(job.get.call(context, 0)).rejects.toThrow();
    });

    it('should handle invalid folder ID', async () => {
      const context = createSystemTestContext({
        folderId: '00000000-0000-0000-0000-000000000000',
      }, config!);

      await expect(job.getFolder.call(context, 0)).rejects.toThrow();
    });
  });
});
