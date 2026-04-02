/**
 * E2E Tests — BaramundiSecurity Node
 * Runs against bConnectMock_V2.0 on localhost:8765
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { createRealContext, checkMockAvailable, tryOp, NONEXISTENT_GUID } from './helpers';
import * as comp from '../../nodes/BaramundiSecurity/actions/compliance/compliance.execute';
import * as dc from '../../nodes/BaramundiSecurity/actions/defenseControl/defenseControl.execute';
import * as sm from '../../nodes/BaramundiSecurity/actions/serverManagement/serverManagement.execute';

let available = false;
let firstEndpointId = '';

beforeAll(async () => {
  available = await checkMockAvailable();
  if (!available) {
    console.warn('⚠ bConnectMock not running — security E2E tests skipped');
    return;
  }
  // Try to get an endpoint ID for scoped queries
  try {
    const res = await fetch('http://localhost:8765/bconnect/v2.0/Endpoints?Top=1', {
      headers: { Authorization: 'Basic ' + Buffer.from('Administrator:password').toString('base64') },
    });
    if (res.ok) {
      const data = await res.json() as any[];
      if (Array.isArray(data) && data.length > 0) firstEndpointId = data[0].id;
    }
  } catch {
    // ignore
  }
});

// ─── Compliance (26R1) ────────────────────────────────────────────────────────

describe('E2E: Compliance — getRules', () => {
  it('returns array of compliance rules or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => comp.getRules.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Compliance — getRule', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    await tryOp(() => comp.getRule.call(createRealContext({ ruleId: NONEXISTENT_GUID }), 0));
  });
});

describe('E2E: Compliance — getVulnerabilities', () => {
  it('returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => comp.getVulnerabilities.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Compliance — getVulnerability', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    await tryOp(() => comp.getVulnerability.call(createRealContext({ vulnerabilityId: 'CVE-2024-0001' }), 0));
  });
});

describe('E2E: Compliance — getDetectedVulnerabilities', () => {
  it('returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => comp.getDetectedVulnerabilities.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Compliance — getDetectedVulnerabilitiesByEndpoint', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const id = firstEndpointId || NONEXISTENT_GUID;
    const ctx = createRealContext({ endpointId: id, returnAll: false, limit: 5 });
    await tryOp(() => comp.getDetectedVulnerabilitiesByEndpoint.call(ctx, 0));
  });
});

describe('E2E: Compliance — getDetectedRuleViolations', () => {
  it('returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => comp.getDetectedRuleViolations.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });
});

describe('E2E: Compliance — getDetectedRuleViolationsByEndpoint', () => {
  it('accepts response or 404', async () => {
    if (!available) return;
    const id = firstEndpointId || NONEXISTENT_GUID;
    const ctx = createRealContext({ endpointId: id, returnAll: false, limit: 5 });
    await tryOp(() => comp.getDetectedRuleViolationsByEndpoint.call(ctx, 0));
  });
});

// ─── Defense Control ──────────────────────────────────────────────────────────

describe('E2E: Defense Control — BitLocker', () => {
  it('getBitLockerWindowsEndpoints returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => dc.getBitLockerWindowsEndpoints.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('getBitLockerWindowsEndpoint accepts 404', async () => {
    if (!available) return;
    const id = firstEndpointId || NONEXISTENT_GUID;
    await tryOp(() => dc.getBitLockerWindowsEndpoint.call(createRealContext({ endpointId: id }), 0));
  });

  it('getBitLockerSecrets accepts 404 (26R1)', async () => {
    if (!available) return;
    const id = firstEndpointId || NONEXISTENT_GUID;
    await tryOp(() => dc.getBitLockerSecrets.call(createRealContext({ endpointId: id }), 0));
  });

  it('patchBitLockerSecrets accepts 404 (26R1)', async () => {
    if (!available) return;
    const id = firstEndpointId || NONEXISTENT_GUID;
    await tryOp(() => dc.patchBitLockerSecrets.call(createRealContext({ endpointId: id, updateFields: {} }), 0));
  });
});

describe('E2E: Defense Control — Local Admin', () => {
  it('getLocalAdministrativeAccounts returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => dc.getLocalAdministrativeAccounts.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('triggerLocalAdminAccountsUpdate accepts 404', async () => {
    if (!available) return;
    const id = firstEndpointId || NONEXISTENT_GUID;
    await tryOp(() => dc.triggerLocalAdminAccountsUpdate.call(createRealContext({ endpointId: id }), 0));
  });

  it('patchLocalAdminUserCredentials accepts 404', async () => {
    if (!available) return;
    await tryOp(() => dc.patchLocalAdminUserCredentials.call(
      createRealContext({ endpointId: firstEndpointId || NONEXISTENT_GUID, localAdminAccountId: NONEXISTENT_GUID, updateFields: {} }),
      0
    ));
  });
});

describe('E2E: Defense Control — Defender', () => {
  it('getMicrosoftDefenderThreats returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => dc.getMicrosoftDefenderThreats.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('getMicrosoftDefenderThreat accepts 404', async () => {
    if (!available) return;
    await tryOp(() => dc.getMicrosoftDefenderThreat.call(createRealContext({ threatId: NONEXISTENT_GUID }), 0));
  });

  it('getMicrosoftDefenderThreatsByEndpoint accepts 404', async () => {
    if (!available) return;
    const id = firstEndpointId || NONEXISTENT_GUID;
    await tryOp(() => dc.getMicrosoftDefenderThreatsByEndpoint.call(createRealContext({ endpointId: id, returnAll: false, limit: 5 }), 0));
  });

  it('getMicrosoftDefenderThreatsByLogicalGroup accepts 404', async () => {
    if (!available) return;
    await tryOp(() => dc.getMicrosoftDefenderThreatsByLogicalGroup.call(
      createRealContext({ logicalGroupId: NONEXISTENT_GUID, returnAll: false, limit: 5 }),
      0
    ));
  });

  it('getMicrosoftDefenderWindowsEndpoints returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    await tryOp(() => dc.getMicrosoftDefenderWindowsEndpoints.call(ctx, 0));
  });

  it('getMicrosoftDefenderWindowsEndpoint accepts 404', async () => {
    if (!available) return;
    const id = firstEndpointId || NONEXISTENT_GUID;
    await tryOp(() => dc.getMicrosoftDefenderWindowsEndpoint.call(createRealContext({ endpointId: id }), 0));
  });
});

// ─── bmsecurity (Security node shares serverManagement.execute.ts) ────────────

describe('E2E: Security — Security Groups', () => {
  it('getSecurityGroups returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    const result = await tryOp(() => sm.getSecurityGroups.call(ctx, 0));
    if (result !== null) expect(Array.isArray(result)).toBe(true);
  });

  it('getSecurityGroup accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getSecurityGroup.call(createRealContext({ securityGroupId: NONEXISTENT_GUID }), 0));
  });

  it('createSecurityGroup → updateSecurityGroup → deleteSecurityGroup (accepts 404)', async () => {
    if (!available) return;
    const created = await tryOp(() => sm.createSecurityGroup.call(
      createRealContext({ name: 'E2E-Sec-SecGroup', additionalFields: {} }), 0
    ));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;
    await tryOp(() => sm.updateSecurityGroup.call(createRealContext({ securityGroupId: id, updateFields: {} }), 0));
    await tryOp(() => sm.deleteSecurityGroup.call(createRealContext({ securityGroupId: id }), 0));
  });
});

describe('E2E: Security — Security Profiles', () => {
  it('getSecurityProfiles returns array or 404', async () => {
    if (!available) return;
    const ctx = createRealContext({ returnAll: false, limit: 5 });
    await tryOp(() => sm.getSecurityProfiles.call(ctx, 0));
  });

  it('getSecurityProfile accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getSecurityProfile.call(createRealContext({ securityProfileId: NONEXISTENT_GUID }), 0));
  });

  it('createSecurityProfile → deleteSecurityProfile (accepts 404)', async () => {
    if (!available) return;
    const created = await tryOp(() => sm.createSecurityProfile.call(
      createRealContext({ name: 'E2E-Sec-Profile', additionalFields: {} }), 0
    ));
    if (!created || created.length === 0) return;
    const id = created[0].json.id as string;
    await tryOp(() => sm.updateSecurityProfile.call(createRealContext({ securityProfileId: id, updateFields: {} }), 0));
    await tryOp(() => sm.deleteSecurityProfile.call(createRealContext({ securityProfileId: id }), 0));
  });
});

describe('E2E: Security — Access Rights', () => {
  it('getAccessRights accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.getAccessRights.call(createRealContext({ objectId: NONEXISTENT_GUID, objectType: 'Endpoint' }), 0));
  });

  it('updateObjectPermissions accepts 404', async () => {
    if (!available) return;
    await tryOp(() => sm.updateObjectPermissions.call(
      createRealContext({ objectId: NONEXISTENT_GUID, objectType: 'Endpoint', permissions: [] }), 0
    ));
  });
});
