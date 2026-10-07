/**
 * Spec-conformance check.
 *
 * Calls every operation the editor offers — per bMS release, node, resource
 * and operation, once with required input, once with every optional field, and
 * once per value of every option field — records the HTTP requests and checks them against that release's OpenAPI
 * spec (docs/openapi/<release>): route incl. module prefix, query parameters,
 * request body fields / required fields / enum values, JSON Patch paths.
 *
 * Known violations live in baseline.json as { "<key>": <issue number> }, or
 * { "<key>": "accepted: <reason>" } for a deliberate, verified deviation
 * (e.g. an undocumented route that works on a real bMS). A new violation
 * fails; so does a baseline entry that no longer occurs (the fix is proven —
 * remove it) and an entry with neither an issue number nor a reason.
 *
 *   npx vitest run test/conformance                         # run
 *   SPEC_BASELINE=prune  npx vitest run test/conformance    # drop entries that no longer occur
 *   SPEC_BASELINE=add-new npx vitest run test/conformance   # add new violations with issue 0, to triage
 *   SPEC_REPORT=report.md npx vitest run test/conformance   # write all violations, grouped
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

import { checkExercise, checkRequest, keyOf } from './checks';
import { NODES, exercise, operationsOf, optionVariants, type Exercise } from './exerciser';
import { RELEASES, SPEC } from './spec';

const BASELINE_PATH = join(__dirname, 'baseline.json');
const baseline: Record<string, number | string> = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const mode = process.env.SPEC_BASELINE ?? '';

const exercises: Exercise[] = [];
const found = new Map<string, Exercise>();

beforeAll(async () => {
  for (const release of RELEASES) {
    for (const node of NODES) {
      for (const { resource, operation } of operationsOf(node, release)) {
        for (const pass of ['required', 'all'] as const) {
          exercises.push(await exercise(node, release, resource, operation, pass));
        }
        // An update with nothing to change rightly sends nothing in the `required` pass:
        // "no request" is a finding only when neither pass sent one.
        const both = exercises.slice(-2);
        const anyRequest = both.some((e) => e.requests.length > 0);
        for (const ex of both) {
          for (const v of checkExercise(ex)) {
            if (v.kind === 'no-request' && (anyRequest || ex.pass === 'required')) continue;
            found.set(keyOf(ex, v), ex);
          }
        }
        // Every other value of every option field. Sample data may not satisfy every
        // combination, so here only a form/code mismatch counts as "no request".
        for (const variant of optionVariants(node, release, resource, operation)) {
          const ex = await exercise(node, release, resource, operation, 'variant', variant);
          exercises.push(ex);
          for (const v of checkExercise(ex)) {
            if (v.kind === 'no-request' && !/Could not get parameter/.test(v.detail)) continue;
            found.set(keyOf(ex, v), ex);
          }
        }
      }
    }
  }
  if (mode === 'add-new' || mode === 'prune') {
    const next: Record<string, number | string> = {};
    for (const [k, issue] of Object.entries(baseline)) if (mode === 'add-new' || found.has(k)) next[k] = issue;
    if (mode === 'add-new') for (const k of found.keys()) if (!(k in next)) next[k] = 0;
    // Code-point order (not localeCompare): stable across machines, minimal diffs
    const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
    writeFileSync(BASELINE_PATH, JSON.stringify(sorted, null, 2) + '\n');
  }
  if (process.env.SPEC_REPORT) {
    const byKind = new Map<string, string[]>();
    for (const k of [...found.keys()].sort()) {
      const kind = k.split(' ')[2].replace(/:$/, '');
      byKind.set(kind, [...(byKind.get(kind) ?? []), k]);
    }
    const lines = [`# Spec conformance report`, '', `${exercises.length} exercises, ${found.size} violations`, ''];
    for (const [kind, keys] of byKind) lines.push(`## ${kind} (${keys.length})`, '', ...keys.map((k) => `- ${k}`), '');
    writeFileSync(process.env.SPEC_REPORT, lines.join('\n'));
  }
}, 120_000);

describe('spec conformance', () => {
  it('loads both specs and exercises every node', () => {
    expect(SPEC['25R2'].length).toBeGreaterThan(150);
    expect(SPEC['26R1'].length).toBeGreaterThan(200);
    for (const node of NODES) expect(exercises.some((e) => e.node === node.description.name)).toBe(true);
  });

  it('has no violations beyond the baseline', () => {
    const fresh = [...found.keys()].filter((k) => !(k in baseline)).sort();
    expect(fresh, `New spec violations — fix them, or baseline them with an issue number:\n${fresh.join('\n')}`).toEqual([]);
  });

  it('has no baseline entries that no longer occur', () => {
    const stale = Object.keys(baseline).filter((k) => !found.has(k)).sort();
    expect(stale, `Fixed — remove from baseline.json (SPEC_BASELINE=prune):\n${stale.join('\n')}`).toEqual([]);
  });

  it('has an issue number or an acceptance reason for every baseline entry', () => {
    const tracked = (v: number | string) => (typeof v === 'number' ? v > 0 : /^accepted: \S/.test(v));
    const untracked = Object.entries(baseline).filter(([, v]) => !tracked(v)).map(([k]) => k);
    expect(untracked, `Baseline entries without an issue:\n${untracked.join('\n')}`).toEqual([]);
  });
});

// The checks themselves, on known-bad requests.
describe('spec conformance checks', () => {
  const req = (method: string, path: string, body?: unknown, qs: Record<string, unknown> = {}) => ({ method, path, qs, body });

  it('accepts a correct request', () => {
    expect(checkRequest('26R1', req('GET', '/endpoints/v2.0/Endpoints', undefined, { PageSize: 1 }))).toEqual([]);
  });

  it('flags a path that is not in the spec', () => {
    expect(checkRequest('26R1', req('GET', '/organizationalunits/v2.0/OrganizationalUnits'))[0].kind).toBe('route');
  });

  it('flags a wrong module prefix', () => {
    const [v] = checkRequest('26R1', req('GET', '/jobs/v2.0/OrgUnits'));
    expect(v.detail).toContain('module "activedirectory"');
  });

  it('flags a 26R1-only route used with 25R2', () => {
    const [v] = checkRequest('25R2', req('GET', '/compliance/v2.0/DetectedVulnerabilities'));
    expect(v?.detail ?? '').toMatch(/only in 26R1|not in spec/);
  });

  it('flags unknown query parameters', () => {
    expect(checkRequest('26R1', req('GET', '/endpoints/v2.0/Endpoints', undefined, { Bogus: 1 }))[0].kind).toBe('query');
  });

  it('flags unknown and missing required body fields', () => {
    const kinds = checkRequest('26R1', req('POST', '/assets/v2.0/Assets', { assetTypeId: 'x', displayName: 'n' })).map((v) => v.kind);
    expect(kinds).toContain('body-field');
    expect(kinds).toContain('body-required');
  });

  it('flags enum values the spec does not allow', () => {
    const v = checkRequest('26R1', req('POST', '/assets/v2.0/Assets', { assetTypeId: 'x', name: 'n', ownerId: 'x', ownerType: 'Bogus' }));
    expect(v.map((x) => x.kind)).toContain('body-enum');
  });

  it('flags JSON Patch paths the target resource does not have', () => {
    const v = checkRequest('26R1', req('PATCH', '/assets/v2.0/Assets/a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', [{ op: 'replace', path: '/serialNumber', value: 'x' }]));
    expect(v.map((x) => x.kind)).toContain('patch-path');
  });
});
