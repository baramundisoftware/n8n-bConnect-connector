/**
 * Checks for the spec-conformance test: one recorded request against the
 * spec operation of its release. Field and parameter names compare
 * case-insensitively — bConnect (ASP.NET Core) binds them that way.
 */
import { explainMissingRoute, findOperation, type Release, type Schema, type SpecOperation } from './spec';
import type { Exercise, RecordedRequest } from './exerciser';

export interface Violation {
  kind: 'route' | 'query' | 'body-field' | 'body-required' | 'body-enum' | 'patch-path' | 'response-field' | 'no-request';
  detail: string;
}

const GUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
export const normalisePath = (p: string) => p.replace(GUID_RE, '{id}');

const lowerKeys = (s: Schema | undefined) =>
  new Map(Object.entries(s?.properties ?? {}).map(([k, v]) => [k.toLowerCase(), v] as const));

function checkObjectBody(op: SpecOperation, schema: Schema, body: Record<string, unknown>, prefix = ''): Violation[] {
  const out: Violation[] = [];
  const props = lowerKeys(schema);
  if (!props.size) return out; // free-form object
  const sent = new Set(Object.keys(body).map((k) => k.toLowerCase()));
  for (const [key, value] of Object.entries(body)) {
    const prop = props.get(key.toLowerCase());
    if (!prop) {
      out.push({ kind: 'body-field', detail: `${prefix}${key}` });
      continue;
    }
    const resolved = op.resolve(prop);
    if (resolved?.enum && typeof value === 'string') {
      const allowed = resolved.enum.map((e) => String(e).toLowerCase());
      if (!allowed.includes(value.toLowerCase())) {
        out.push({ kind: 'body-enum', detail: `${prefix}${key}=${value} (allowed: ${resolved.enum.join(', ')})` });
      }
    }
  }
  for (const req of schema.required ?? []) {
    if (!sent.has(req.toLowerCase())) out.push({ kind: 'body-required', detail: `${prefix}${req}` });
  }
  return out;
}

function checkPatch(op: SpecOperation, body: unknown[]): Violation[] {
  const target = op.getResponse;
  const props = lowerKeys(target);
  if (!props.size && !op.patchExamplePaths.size) return [];
  const out: Violation[] = [];
  for (const entry of body) {
    const path = String((entry as { path?: unknown })?.path ?? '');
    const first = path.split('/')[1] ?? '';
    const known = props.has(first.toLowerCase()) || op.patchExamplePaths.has(first.toLowerCase());
    if (first && !known) out.push({ kind: 'patch-path', detail: `/${first}` });
  }
  return out;
}

/**
 * The properties of a response schema, with oneOf/anyOf variants merged (polymorphic
 * endpoints). Undefined when the schema does not list properties — a free-form object or
 * a dictionary — so nothing can be checked.
 */
function responseProperties(op: SpecOperation, schema: Schema | undefined): Map<string, Schema> | undefined {
  const s = op.resolve(schema);
  if (!s) return undefined;
  const variants = s.oneOf ?? s.anyOf;
  if (variants) {
    const merged = new Map<string, Schema>();
    for (const v of variants) {
      const props = responseProperties(op, v);
      if (!props) return undefined;
      for (const [k, p] of props) merged.set(k, p);
    }
    return merged;
  }
  if (s.type === 'array') return new Map();
  if (!s.properties || Object.keys(s.properties).length === 0) return undefined;
  return new Map(Object.entries(s.properties));
}

/**
 * Response fields the code read, against the operation's response schema. JavaScript
 * property access is case-sensitive, so unlike request fields the case must match.
 * `data[].name` is `name` in the items of the `data` array.
 */
function checkResponseReads(op: SpecOperation, req: RecordedRequest): Violation[] {
  const out: Violation[] = [];
  const where = `${req.method} ${normalisePath(req.path)}`;
  for (const read of [...req.reads].sort()) {
    let props = responseProperties(op, op.response);
    let missing: string | undefined;
    const parts = read.split('.');
    for (const [i, part] of parts.entries()) {
      if (!props) break;
      const key = part.replace(/\[\]$/, '');
      const prop = props.get(key);
      if (!prop) {
        missing = key;
        break;
      }
      if (i < parts.length - 1) props = responseProperties(op, op.resolve(prop)?.items);
    }
    if (missing === undefined) continue;
    const other = [...props!.keys()].find((k) => k.toLowerCase() === missing!.toLowerCase());
    out.push({ kind: 'response-field', detail: `${where} ${read}${other ? ` (spec: ${other})` : ''}` });
  }
  return out;
}

export function checkRequest(release: Release, req: RecordedRequest): Violation[] {
  const path = normalisePath(req.path);
  const op = findOperation(release, req.method, req.path);
  if (!op) {
    return [{ kind: 'route', detail: `${req.method} ${path} - ${explainMissingRoute(release, req.method, req.path)}` }];
  }
  const out: Violation[] = [];
  for (const key of Object.keys(req.qs)) {
    if (!op.queryParams.has(key.toLowerCase())) out.push({ kind: 'query', detail: `${req.method} ${path} ?${key}` });
  }
  if (req.reads) out.push(...checkResponseReads(op, req));
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body !== undefined) {
    const where = `${req.method} ${path}`;
    const tag = (v: Violation): Violation => ({ ...v, detail: `${where} ${v.detail}` });
    if (Array.isArray(req.body)) {
      if (req.method === 'PATCH') out.push(...checkPatch(op, req.body).map(tag));
      else {
        const items = op.resolve(op.body?.items);
        if (items) for (const el of req.body) if (el && typeof el === 'object') out.push(...checkObjectBody(op, items, el as Record<string, unknown>).map(tag));
      }
    } else if (req.body && typeof req.body === 'object' && op.body) {
      out.push(...checkObjectBody(op, op.body, req.body as Record<string, unknown>).map(tag));
    }
  }
  return out;
}

export function checkExercise(ex: Exercise): Violation[] {
  if (ex.requests.length === 0) {
    return [{ kind: 'no-request', detail: ex.error ? `error: ${ex.error}` : 'no HTTP request sent' }];
  }
  return ex.requests.flatMap((r) => checkRequest(ex.release, r));
}

export const keyOf = (ex: Pick<Exercise, 'release' | 'node' | 'resource' | 'operation'>, v: Violation) =>
  `${ex.release} ${ex.node}/${ex.resource}.${ex.operation} ${v.kind}: ${v.detail}`;
