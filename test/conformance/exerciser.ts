/**
 * Exerciser for the spec-conformance check.
 *
 * For one node + release + resource + operation it builds the parameters the
 * n8n editor would hold — every property visible under the displayOptions,
 * with its default — fills in sample values, calls node.execute() with a fake
 * IExecuteFunctions and records every HTTP request apiRequest() sends.
 *
 * Two passes:
 * - `required`: defaults everywhere, sample values only where the default is
 *   empty (what a user must enter);
 * - `all`: every optional field filled too — collections completely, booleans
 *   true — so request bodies and query strings built from options show up.
 */
import type { IExecuteFunctions, IHttpRequestOptions, INodeProperties, INodeType } from 'n8n-workflow';

import { BaramundiAdmin } from '../../nodes/BaramundiAdmin/BaramundiAdmin.node';
import { BaramundiAsset } from '../../nodes/BaramundiAsset/BaramundiAsset.node';
import { BaramundiEndpoint } from '../../nodes/BaramundiEndpoint/BaramundiEndpoint.node';
import { BaramundiJob } from '../../nodes/BaramundiJob/BaramundiJob.node';
import { BaramundiSecurity } from '../../nodes/BaramundiSecurity/BaramundiSecurity.node';
import { BaramundiSoftware } from '../../nodes/BaramundiSoftware/BaramundiSoftware.node';
import type { Release } from './spec';

export const NODES: INodeType[] = [
  new BaramundiEndpoint(),
  new BaramundiAsset(),
  new BaramundiJob(),
  new BaramundiSoftware(),
  new BaramundiAdmin(),
  new BaramundiSecurity(),
];

export type Pass = 'required' | 'all';
export const GUID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const BASE_URL = 'https://bms.example.com:444/bconnect';

export interface RecordedRequest {
  method: string;
  path: string;
  qs: Record<string, unknown>;
  body: unknown;
}

export interface Exercise {
  node: string;
  release: Release;
  resource: string;
  operation: string;
  pass: Pass;
  requests: RecordedRequest[];
  /** Error thrown before any request was sent (validation, missing parameter, …) */
  error?: string;
}

type Params = Record<string, unknown>;

function isVisible(p: INodeProperties, params: Params): boolean {
  const { show, hide } = p.displayOptions ?? {};
  if (show) {
    for (const [key, allowed] of Object.entries(show)) {
      if (!(key in params)) return false;
      if (!(allowed as unknown[]).includes(params[key])) return false;
    }
  }
  if (hide) {
    for (const [key, denied] of Object.entries(hide)) {
      if (key in params && (denied as unknown[]).includes(params[key])) return false;
    }
  }
  return true;
}

function sampleString(name: string): string {
  const n = name.toLowerCase();
  if (/(^|[a-z])(id|ids|guid)$/.test(n) || n.endsWith('guid')) return GUID;
  if (n.includes('mac')) return 'AA:BB:CC:DD:EE:FF';
  if (/(^ip|ipaddress|primaryip|subnet)/.test(n)) return '10.0.0.1';
  if (n.includes('mail') || n === 'registereduser' || n.endsWith('upn')) return 'user@example.com';
  // Future and ordered, so start/end validation passes
  if (n.startsWith('end') || n.includes('enddate') || n.includes('endtime')) return '2099-01-01T02:00:00.000Z';
  if (n.includes('date') || n.endsWith('time') || n.endsWith('at')) return '2099-01-01T00:00:00.000Z';
  if (n.includes('url')) return 'https://example.com';
  if (n.includes('port')) return '22';
  if (n === 'orderby') return 'DisplayName asc';
  return 'zzSample';
}

function sampleValue(p: INodeProperties, pass: Pass): unknown {
  const d = p.default as unknown;
  const empty = d === '' || d === undefined || d === null;
  switch (p.type) {
    case 'options': {
      const values = (p.options ?? []).map((o) => (o as { value: unknown }).value);
      return values.includes(d) ? d : values[0];
    }
    case 'multiOptions': {
      const values = (p.options ?? []).map((o) => (o as { value: unknown }).value);
      return Array.isArray(d) && d.length ? d : values.slice(0, 1);
    }
    case 'boolean':
      return pass === 'all' ? true : d ?? false;
    case 'number':
      return typeof d === 'number' && d !== 0 ? d : 1;
    case 'dateTime':
      return '2026-01-01T00:00:00.000Z';
    case 'json':
      return empty ? '{}' : d;
    case 'resourceLocator':
      return { __rl: true, mode: 'id', value: GUID };
    case 'collection': {
      if (pass === 'required') return d ?? {};
      const out: Params = {};
      for (const opt of (p.options ?? []) as INodeProperties[]) out[opt.name] = sampleValue(opt, 'all');
      return out;
    }
    case 'fixedCollection': {
      if (pass === 'required') return d ?? {};
      const out: Params = {};
      for (const group of (p.options ?? []) as Array<{ name: string; values: INodeProperties[] }>) {
        const entry: Params = {};
        for (const v of group.values ?? []) entry[v.name] = sampleValue(v, 'all');
        out[group.name] = p.typeOptions?.multipleValues ? [entry] : entry;
      }
      return out;
    }
    case 'string':
    default:
      if (pass === 'required' && !empty) return d;
      if (pass === 'all' && !empty && typeof d === 'string' && /^[[{]/.test(d)) return d;
      return sampleString(p.name);
  }
}

/** The parameters the editor holds for this operation. */
export function buildParams(
  node: INodeType,
  release: Release,
  resource: string,
  operation: string,
  pass: Pass,
): Params {
  const params: Params = { bmsVersion: release, resource, operation };
  // Visibility can depend on other non-core parameters (returnAll → limit), so iterate.
  for (let round = 0; round < 4; round++) {
    for (const p of node.description.properties) {
      if (p.name in params || p.type === 'notice' || !isVisible(p, params)) continue;
      params[p.name] = sampleValue(p, pass);
    }
  }
  return params;
}

/** Resources, and per resource the operations the editor offers for a release. */
export function operationsOf(node: INodeType, release: Release): Array<{ resource: string; operation: string }> {
  const out: Array<{ resource: string; operation: string }> = [];
  const resources = node.description.properties
    .filter((p) => p.name === 'resource' && isVisible(p, { bmsVersion: release }))
    .flatMap((p) => (p.options ?? []).map((o) => (o as { value: string }).value));
  for (const resource of [...new Set(resources)]) {
    const ctx = { bmsVersion: release, resource };
    const ops = node.description.properties
      .filter((p) => p.name === 'operation' && isVisible(p, ctx))
      .flatMap((p) => (p.options ?? []).map((o) => (o as { value: string }).value));
    for (const operation of [...new Set(ops)]) out.push({ resource, operation });
  }
  return out;
}

function getPath(obj: Params, path: string): unknown {
  return path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Params)[k] : undefined), obj);
}

/** Generic response: a page with one item, plus the fields single-object reads look for. */
function fakeResponse(): Record<string, unknown> {
  const item = { id: GUID, name: 'zzSample', displayName: 'zzSample', guid: GUID };
  return { ...item, data: [item], hasNextPage: false, totalCount: 1, value: [item] };
}

export async function exercise(
  node: INodeType,
  release: Release,
  resource: string,
  operation: string,
  pass: Pass,
): Promise<Exercise> {
  const params = buildParams(node, release, resource, operation, pass);
  const requests: RecordedRequest[] = [];
  const ctx = {
    getInputData: () => [{ json: {} }],
    getNodeParameter: (name: string, _i: number, ...fallback: unknown[]) => {
      if (name in params) return params[name];
      const nested = getPath(params, name);
      if (nested !== undefined) return nested;
      if (fallback.length) return fallback[0];
      throw new Error(`Could not get parameter "${name}"`);
    },
    getCurrentNodeParameter: (name: string) => params[name],
    getNode: () => ({ name: node.description.displayName, type: node.description.name, typeVersion: 1, position: [0, 0], parameters: params }),
    getCredentials: async () => ({
      baseUrl: BASE_URL, authMethod: 'basicAuth', username: 'u', password: 'p', ignoreSslIssues: false,
    }),
    continueOnFail: () => false,
    helpers: {
      httpRequest: async (o: IHttpRequestOptions) => {
        requests.push({
          method: String(o.method ?? 'GET').toUpperCase(),
          path: String(o.url ?? '').split('?')[0],
          qs: { ...((o.qs as Record<string, unknown>) ?? {}) },
          body: o.body,
        });
        return fakeResponse();
      },
      returnJsonArray: (d: unknown) => (Array.isArray(d) ? d : [d]).map((json) => ({ json })),
    },
    logger: { debug() {}, info() {}, warn() {}, error() {} },
  } as unknown as IExecuteFunctions;

  let error: string | undefined;
  try {
    await node.execute!.call(ctx);
  } catch (e) {
    // Errors after a request was sent come from the fake response shape — not a spec question.
    if (requests.length === 0) error = (e as Error).message.split('\n')[0];
  }
  return { node: node.description.name, release, resource, operation, pass, requests, error };
}
