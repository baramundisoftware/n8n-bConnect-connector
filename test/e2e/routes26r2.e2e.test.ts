/**
 * E2E Tests — the operations bMS 26R2 added (#93)
 * Runs against bConnect-Mock on localhost:8765 started with BCONNECT_BMS_VERSION=26r2, and only
 * when BCONNECT_BMS_VERSION says so. Strict: no tryOp, the mock implements every route here.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { createRealContext, checkMockAvailable, MOCK_URL, MOCK_USER, MOCK_PASS } from './helpers';
import * as threshold from '../../nodes/BaramundiSoftware/actions/threshold/threshold.execute';
import * as sm from '../../nodes/shared/actions/serverManagement/serverManagement.execute';
import * as ep from '../../nodes/BaramundiEndpoint/actions/endpoint/endpoint.execute';

const auth = { Authorization: `Basic ${Buffer.from(`${MOCK_USER}:${MOCK_PASS}`).toString('base64')}` };
const get = async (path: string) => (await fetch(`${MOCK_URL}${path}`, { headers: auth })).json() as Promise<any>;

const is26R2 = (process.env.BCONNECT_BMS_VERSION || '').toUpperCase() === '26R2';

let available = false;
let udgIds: string[] = [];
let profileId = '';
let intuneId = '';
let localId = '';

beforeAll(async () => {
  available = is26R2 && (await checkMockAvailable());
  if (!available) {
    if (is26R2) console.warn('⚠ bConnectMock not running — 26R2 E2E tests skipped');
    return;
  }
  expect((await (await fetch('http://localhost:8765/health')).json()).bmsVersion).toBe('26r2');
  udgIds = (await get('/universaldynamicgroups/v2.0/UniversalDynamicGroups')).data.map((g: any) => g.id);
  profileId = (await get('/servermanagement/v2.0/SecurityProfiles')).data[0].id;
  const win = (await get('/endpoints/v2.0/WindowsEndpoints?PageSize=500')).data;
  intuneId = win.find((e: any) => e.coManagement === 'Intune').id;
  localId = win.find((e: any) => e.coManagement === 'None').id;
});

describe('26R2: thresholds', () => {
  it('getMany / getByGroup / get', async () => {
    if (!available) return;
    const all = await threshold.getMany.call(createRealContext({ returnAll: true, options: {} }), 0);
    expect(all.length).toBeGreaterThan(0);
    const limited = await threshold.getMany.call(createRealContext({ returnAll: false, limit: 2, options: { orderBy: 'Value desc' } }), 0);
    expect(limited.length).toBeLessThanOrEqual(2);
    const first = all[0].json;
    const byGroup = await threshold.getByGroup.call(createRealContext({ dynamicGroupId: first.dynamicGroupId, returnAll: true, options: {} }), 0);
    expect(byGroup.map((t) => t.json.id)).toContain(first.id);
    const one = await threshold.get.call(createRealContext({ thresholdId: first.id }), 0);
    expect(one[0].json).toEqual(first);
  });

  it('create / update / delete', async () => {
    if (!available) return;
    const created = await threshold.create.call(createRealContext({
      dynamicGroupId: udgIds[udgIds.length - 1], securityProfileId: profileId, value: 7, type: 'LowerLimit', severity: 'Info', isActive: true,
      additionalFields: { comment: 'n8n e2e' },
    }), 0);
    const t = created[0].json;
    expect(t).toMatchObject({ value: 7, type: 'LowerLimit', severity: 'Info', isActive: true, comment: 'n8n e2e' });
    const updated = await threshold.update.call(createRealContext({ thresholdId: t.id, updateFields: { value: 9, isActive: false, severity: 'Warning' } }), 0);
    expect(updated[0].json).toMatchObject({ id: t.id, value: 9, isActive: false, severity: 'Warning' });
    const deleted = await threshold.deleteThreshold.call(createRealContext({ thresholdId: t.id }), 0);
    expect(deleted[0].json).toEqual({ success: true, deletedId: t.id });
    await expect(threshold.get.call(createRealContext({ thresholdId: t.id }), 0)).rejects.toThrow();
  });
});

describe('26R2: API keys', () => {
  it('create returns the secret; get / update / delete', async () => {
    if (!available) return;
    const created = await sm.createApiKey.call(createRealContext({
      apiKeyName: `n8n-e2e-${Date.now()}`, securityProfileIds: profileId,
      apiKeyFields: { comment: 'e2e', expirationDate: '2027-06-30T00:00:00', isActive: true },
    }), 0);
    const k = created[0].json;
    expect(k).toMatchObject({ comment: 'e2e', expirationDate: '2027-06-30', isActive: true });
    expect(k.apiKeySecret).toMatch(/^[\w-]{43}$/);
    const read = await sm.getApiKey.call(createRealContext({ apiKeyId: k.id }), 0);
    expect(read[0].json.id).toBe(k.id);
    expect(read[0].json).not.toHaveProperty('apiKeySecret');
    const listed = await sm.getApiKeys.call(createRealContext({ returnAll: true }), 0);
    expect(listed.map((x) => x.json.id)).toContain(k.id);
    const updated = await sm.updateApiKey.call(createRealContext({ apiKeyId: k.id, apiKeyUpdateFields: { isActive: false, comment: 'paused' } }), 0);
    expect(updated[0].json).toMatchObject({ id: k.id, isActive: false, comment: 'paused' });
    const deleted = await sm.deleteApiKey.call(createRealContext({ apiKeyId: k.id }), 0);
    expect(deleted[0].json).toEqual({ success: true, deletedId: k.id });
    await expect(sm.getApiKey.call(createRealContext({ apiKeyId: k.id }), 0)).rejects.toThrow();
  });
});

describe('26R2: Intune remote actions and Entra ID data', () => {
  it.each(['intuneSync', 'intuneReboot', 'intuneRetire', 'intuneAutopilotReset', 'intuneFreshStart', 'intuneWipe'])(
    '%s succeeds on an Intune endpoint, fails on a local one', async (op) => {
      if (!available) return;
      const ok = await ep.intuneRemoteAction.call(createRealContext({ endpointId: intuneId, keepUserData: true, keepEnrollmentData: true }), 0, op);
      expect(ok[0].json).toEqual({ success: true, endpointId: intuneId, action: op });
      await expect(ep.intuneRemoteAction.call(createRealContext({ endpointId: localId }), 0, op)).rejects.toThrow();
    });

  it('getEntraIdData by endpoint after setEntraIdData', async () => {
    if (!available) return;
    const deviceId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    await ep.setEntraIdData.call(createRealContext({ endpointId: intuneId, entraIdDeviceId: deviceId, additionalFields: {} }), 0);
    const data = await ep.getEntraIdData.call(createRealContext({ endpointId: intuneId }), 0);
    expect(data[0].json).toMatchObject({ entraIdDeviceId: deviceId });
  });
});

describe('26R2: removed route', () => {
  it('GET /CloudConnectors is gone', async () => {
    if (!available) return;
    await expect(sm.getCloudConnectors.call(createRealContext({ returnAll: false, limit: 5 }), 0)).rejects.toThrow();
  });
});
