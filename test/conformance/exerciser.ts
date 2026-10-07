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
 *   true — so request bodies and query strings built from options show up;
 * - `variant`: the `all` pass once per value of every option field (top level
 *   and inside collections), so routes and bodies chosen by an option — e.g.
 *   Group Type = static — are checked too, not only the default.
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

/** `variant` = the `all` pass with one option field set to a non-default value */
export type Pass = 'required' | 'all' | 'variant';
export const GUID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
const BASE_URL = 'https://bms.example.com:444/bconnect';

export interface RecordedRequest {
  method: string;
  path: string;
  qs: Record<string, unknown>;
  body: unknown;
  /** Response fields the code read, e.g. `hasNextPage`, `data[].displayName` (see trackReads) */
  reads: Set<string>;
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
  /** For `variant`: the option that was changed, e.g. `groupType=static` */
  variant?: string;
}

/** One option value to try: a top-level options field, or one inside a collection. */
export interface OptionVariant {
  path: [string] | [string, string];
  value: unknown;
  label: string;
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
      // A non-empty default is a valid example value (e.g. "22:00", a JSON template): use it
      if (!empty) return d;
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
  variant?: OptionVariant,
): Params {
  const fill: Pass = pass === 'variant' ? 'all' : pass;
  const params: Params = { bmsVersion: release, resource, operation };
  if (variant?.path.length === 1) params[variant.path[0]] = variant.value;
  // Visibility can depend on other non-core parameters (returnAll → limit), so iterate.
  for (let round = 0; round < 4; round++) {
    for (const p of node.description.properties) {
      if (p.name in params || p.type === 'notice' || !isVisible(p, params)) continue;
      params[p.name] = sampleValue(p, fill);
    }
  }
  if (variant?.path.length === 2) {
    const [coll, field] = variant.path;
    if (params[coll] && typeof params[coll] === 'object') params[coll] = { ...(params[coll] as Params), [field]: variant.value };
  }
  return params;
}

const CORE = new Set(['bmsVersion', 'resource', 'operation']);

/** Every non-default option value of the fields visible for this operation. */
export function optionVariants(node: INodeType, release: Release, resource: string, operation: string): OptionVariant[] {
  const params = buildParams(node, release, resource, operation, 'all');
  const visible = node.description.properties.filter(
    (p) => !CORE.has(p.name) && p.name in params && isVisible(p, params),
  );
  const out: OptionVariant[] = [];
  const valuesOf = (p: INodeProperties) => (p.options ?? []).map((o) => (o as { value: unknown }).value);
  for (const p of visible) {
    if (p.type === 'options') {
      for (const value of valuesOf(p)) {
        if (value !== params[p.name]) out.push({ path: [p.name], value, label: `${p.name}=${String(value)}` });
      }
    } else if (p.type === 'collection') {
      const current = (params[p.name] ?? {}) as Params;
      for (const sub of (p.options ?? []) as INodeProperties[]) {
        if (sub.type !== 'options') continue;
        for (const value of valuesOf(sub)) {
          if (value !== current[sub.name]) out.push({ path: [p.name, sub.name], value, label: `${p.name}.${sub.name}=${String(value)}` });
        }
      }
    }
  }
  return out;
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

/** Keys read by the language or tooling (await, coercion, inspection), not by code that wants a field. */
const NOT_FIELDS = new Set([
  'then', 'toJSON', 'toString', 'toLocaleString', 'valueOf', 'constructor', 'hasOwnProperty', 'isPrototypeOf',
  'propertyIsEnumerable', 'inspect', 'nodeType', 'asymmetricMatch', '$$typeof', '_isMockFunction',
]);

/**
 * Wrap a fake response object so every field the code reads by name lands in `reads`
 * (`prefix` + key). Copying the object — spread, Object.assign, JSON.stringify,
 * Object.entries — is not a read of a particular field: those first ask for the property
 * descriptor, which marks the following get as part of a copy.
 */
export function trackReads<T extends object>(target: T, prefix: string, reads: Set<string>): T {
  const copying = new Set<PropertyKey>();
  const record = (key: PropertyKey) => {
    if (typeof key === 'string' && !NOT_FIELDS.has(key)) reads.add(prefix + key);
  };
  return new Proxy(target, {
    get(t, key, receiver) {
      if (!copying.delete(key)) record(key);
      return Reflect.get(t, key, receiver);
    },
    has(t, key) {
      record(key);
      return Reflect.has(t, key);
    },
    getOwnPropertyDescriptor(t, key) {
      copying.add(key);
      return Reflect.getOwnPropertyDescriptor(t, key);
    },
  });
}

/** Generic response: a page with one item, plus the fields single-object reads look for. */
function fakeResponse(reads: Set<string>): Record<string, unknown> {
  const item = () => ({ id: GUID, name: 'zzSample', displayName: 'zzSample', guid: GUID });
  return trackReads(
    {
      ...item(),
      data: [trackReads(item(), 'data[].', reads)],
      hasNextPage: false,
      totalCount: 1,
      value: [trackReads(item(), 'value[].', reads)],
    },
    '',
    reads,
  );
}

function record(requests: RecordedRequest[], o: IHttpRequestOptions): Record<string, unknown> {
  const reads = new Set<string>();
  requests.push({
    method: String(o.method ?? 'GET').toUpperCase(),
    path: String(o.url ?? '').split('?')[0],
    qs: { ...((o.qs as Record<string, unknown>) ?? {}) },
    body: o.body,
    reads,
  });
  return fakeResponse(reads);
}

export async function exercise(
  node: INodeType,
  release: Release,
  resource: string,
  operation: string,
  pass: Pass,
  variant?: OptionVariant,
): Promise<Exercise> {
  const params = buildParams(node, release, resource, operation, pass, variant);
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
      httpRequest: async (o: IHttpRequestOptions) => record(requests, o),
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
  return { node: node.description.name, release, resource, operation, pass, requests, error, variant: variant?.label };
}

/**
 * Dropdown and search functions (methods.loadOptions / methods.listSearch) of a node.
 * They run in the editor, not in execute(), so the passes above never reach them.
 * listSearch is called with and without a filter; endpointSearch once per platform type.
 */
export async function exerciseMethods(node: INodeType, release: Release): Promise<Exercise[]> {
  const out: Exercise[] = [];
  const kinds = ['loadOptions', 'listSearch'] as const;
  for (const kind of kinds) {
    const methods = (node.methods?.[kind] ?? {}) as Record<string, (...args: unknown[]) => Promise<unknown>>;
    for (const [name, fn] of Object.entries(methods)) {
      const variants: Array<{ endpointType?: string; filter?: string }> =
        kind === 'listSearch' ? [{}, { filter: 'abc' }] : [{}];
      if (name === 'endpointSearch') {
        for (const endpointType of ['windows', 'android', 'ios', 'linux', 'mac', 'network']) variants.push({ endpointType, filter: 'abc' });
      }
      for (const v of variants) {
        const requests: RecordedRequest[] = [];
        const params: Params = { bmsVersion: release, endpointType: v.endpointType };
        const ctx = {
          getNodeParameter: (n: string, ...fallback: unknown[]) => (n in params ? params[n] : fallback[0]),
          getCurrentNodeParameter: (n: string) => params[n],
          getNode: () => ({ name: node.description.displayName, type: node.description.name, typeVersion: 1, position: [0, 0], parameters: params }),
          getCredentials: async () => ({ baseUrl: BASE_URL, authMethod: 'basicAuth', username: 'u', password: 'p', ignoreSslIssues: false }),
          helpers: {
            httpRequest: async (o: IHttpRequestOptions) => record(requests, o),
          },
          logger: { debug() {}, info() {}, warn() {}, error() {} },
        };
        let error: string | undefined;
        try {
          await fn.call(ctx, ...(kind === 'listSearch' ? [v.filter] : []));
        } catch (e) {
          if (requests.length === 0) error = (e as Error).message.split('\n')[0];
        }
        out.push({
          node: node.description.name, release, resource: kind, operation: name, pass: 'all', requests, error,
          variant: v.endpointType ? `endpointType=${v.endpointType}` : undefined,
        });
      }
    }
  }
  return out;
}

