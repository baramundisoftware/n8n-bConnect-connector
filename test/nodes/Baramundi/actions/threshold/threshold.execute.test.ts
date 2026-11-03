import { describe, it, expect, vi } from 'vitest';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  getMany,
  getByGroup,
  get,
  create,
  update,
  deleteThreshold,
} from '../../../../../nodes/BaramundiSoftware/actions/threshold/threshold.execute';
import { httpRequestWithAuthentication } from '../../../../helpers/httpRequestWithAuthentication';

function createMockExecuteFunctions(
  params: Record<string, any> = {},
  mockResponse: any = {},
): IExecuteFunctions {
  return {
    getNodeParameter: vi.fn((name: string, _index: number, defaultValue?: any) => {
      return params[name] !== undefined ? params[name] : defaultValue;
    }),
    getCredentials: vi.fn(async () => ({
      baseUrl: 'https://bms-server:444/bconnect',
      username: 'admin',
      password: 'test-password-do-not-use',
      ignoreSslIssues: false,
    })),
    helpers: {
      httpRequestWithAuthentication,
      httpRequest: vi.fn(async () => mockResponse),
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

const THRESHOLD_ID = '71717171-7171-7171-7171-717171717171';
const GROUP_ID = '78787878-7878-7878-7878-787878787878';
const PROFILE_ID = '79797979-7979-7979-7979-797979797979';
const mockThreshold = {
  id: THRESHOLD_ID,
  dynamicGroupId: GROUP_ID,
  dynamicGroupName: 'Windows without updates',
  securityProfileId: PROFILE_ID,
  securityProfileName: 'Administrators',
  severity: 'Warning',
  value: 10,
  type: 'UpperLimit',
  isActive: true,
};
const pageResponse = (data: any[]) => ({ data, currentPage: 0, pageSize: 50, totalItems: data.length, hasNextPage: false });
const lastCall = (mock: IExecuteFunctions) => {
  const httpRequest = mock.helpers.httpRequest as ReturnType<typeof vi.fn>;
  return httpRequest.mock.calls[httpRequest.mock.calls.length - 1][0];
};

// #93: thresholds on universal dynamic groups, bMS 26R2
describe('Threshold Operations', () => {
  describe('getMany()', () => {
    it('returns one page of thresholds with search and order', async () => {
      const mock = createMockExecuteFunctions(
        { returnAll: false, limit: 10, options: { searchQuery: 'Windows', orderBy: 'Value desc' } },
        pageResponse([mockThreshold]),
      );
      const result = await getMany.call(mock, 0);
      expect(result.map((r) => r.json)).toEqual([mockThreshold]);
      const call = lastCall(mock);
      expect(call.method).toBe('GET');
      expect(call.url).toContain('/universaldynamicgroups/v2.0/Thresholds');
      expect(call.qs).toMatchObject({ SearchQuery: 'Windows', OrderBy: 'Value desc', PageSize: 10, Page: 0 });
    });

    it('returns all thresholds when returnAll is true', async () => {
      const mock = createMockExecuteFunctions({ returnAll: true, options: {} }, pageResponse([mockThreshold, mockThreshold]));
      const result = await getMany.call(mock, 0);
      expect(result).toHaveLength(2);
    });

    it('rejects an invalid order by value', async () => {
      const mock = createMockExecuteFunctions({ returnAll: false, limit: 10, options: { orderBy: "Value'; DROP" } });
      await expect(getMany.call(mock, 0)).rejects.toThrow();
    });
  });

  describe('getByGroup()', () => {
    it('lists the thresholds of a group', async () => {
      const mock = createMockExecuteFunctions({ dynamicGroupId: GROUP_ID, returnAll: false, limit: 5, options: {} }, pageResponse([mockThreshold]));
      const result = await getByGroup.call(mock, 0);
      expect(result).toHaveLength(1);
      expect(lastCall(mock).url).toContain(`/universaldynamicgroups/v2.0/UniversalDynamicGroups/${GROUP_ID}/Thresholds`);
    });

    it('rejects an invalid group ID', async () => {
      const mock = createMockExecuteFunctions({ dynamicGroupId: 'not-a-guid', returnAll: false, limit: 5 });
      await expect(getByGroup.call(mock, 0)).rejects.toThrow();
    });
  });

  describe('get()', () => {
    it('gets a threshold by ID', async () => {
      const mock = createMockExecuteFunctions({ thresholdId: THRESHOLD_ID }, mockThreshold);
      const result = await get.call(mock, 0);
      expect(result[0].json).toEqual(mockThreshold);
      expect(lastCall(mock).url).toContain(`/universaldynamicgroups/v2.0/Thresholds/${THRESHOLD_ID}`);
    });

    it('rejects an invalid threshold ID', async () => {
      const mock = createMockExecuteFunctions({ thresholdId: 'x' });
      await expect(get.call(mock, 0)).rejects.toThrow();
    });
  });

  describe('create()', () => {
    const params = {
      dynamicGroupId: GROUP_ID,
      securityProfileId: PROFILE_ID,
      value: 10,
      type: 'UpperLimit',
      severity: 'Warning',
      isActive: false,
      additionalFields: { comment: 'Too many unpatched endpoints' },
    };

    it('posts a ThresholdForCreation body', async () => {
      const mock = createMockExecuteFunctions(params, mockThreshold);
      const result = await create.call(mock, 0);
      expect(result[0].json).toEqual(mockThreshold);
      const call = lastCall(mock);
      expect(call.method).toBe('POST');
      expect(call.url).toContain('/universaldynamicgroups/v2.0/Thresholds');
      expect(call.body).toEqual({
        dynamicGroupId: GROUP_ID,
        securityProfileId: PROFILE_ID,
        value: 10,
        type: 'UpperLimit',
        severity: 'Warning',
        isActive: false,
        comment: 'Too many unpatched endpoints',
      });
    });

    it('leaves out an empty comment', async () => {
      const mock = createMockExecuteFunctions({ ...params, additionalFields: {} }, mockThreshold);
      await create.call(mock, 0);
      expect(lastCall(mock).body).not.toHaveProperty('comment');
    });

    it('rejects an invalid security profile ID', async () => {
      const mock = createMockExecuteFunctions({ ...params, securityProfileId: 'admins' });
      await expect(create.call(mock, 0)).rejects.toThrow();
    });

    it('rejects a comment over 4000 characters', async () => {
      const mock = createMockExecuteFunctions({ ...params, additionalFields: { comment: 'x'.repeat(4001) } });
      await expect(create.call(mock, 0)).rejects.toThrow(/4000/);
    });
  });

  describe('update()', () => {
    it('sends a JSON Patch with the spec paths and returns the updated threshold', async () => {
      const mock = createMockExecuteFunctions(
        { thresholdId: THRESHOLD_ID, updateFields: { value: 20, isActive: false, comment: '' } },
        { ...mockThreshold, value: 20, isActive: false },
      );
      const result = await update.call(mock, 0);
      expect(result[0].json).toMatchObject({ value: 20, isActive: false });
      const call = lastCall(mock);
      expect(call.method).toBe('PATCH');
      expect(call.url).toContain(`/universaldynamicgroups/v2.0/Thresholds/${THRESHOLD_ID}`);
      expect(call.body).toEqual([
        { op: 'replace', path: '/Value', value: 20 },
        { op: 'replace', path: '/IsActive', value: false },
        { op: 'replace', path: '/Comment', value: '' },
      ]);
    });

    it('refuses an update without fields', async () => {
      const mock = createMockExecuteFunctions({ thresholdId: THRESHOLD_ID, updateFields: {} });
      await expect(update.call(mock, 0)).rejects.toThrow(/No fields to update/);
    });
  });

  describe('deleteThreshold()', () => {
    it('deletes a threshold', async () => {
      const mock = createMockExecuteFunctions({ thresholdId: THRESHOLD_ID }, undefined);
      const result = await deleteThreshold.call(mock, 0);
      expect(result[0].json).toEqual({ success: true, deletedId: THRESHOLD_ID });
      const call = lastCall(mock);
      expect(call.method).toBe('DELETE');
      expect(call.url).toContain(`/universaldynamicgroups/v2.0/Thresholds/${THRESHOLD_ID}`);
    });
  });
});
