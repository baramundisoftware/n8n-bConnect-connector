/**
 * Checks for the spec-conformance test: one recorded request against the
 * spec operation of its release. Field and parameter names compare
 * case-insensitively — bConnect (ASP.NET Core) binds them that way.
 */
import { explainMissingRoute, findOperation, type Release, type Schema, type SpecOperation } from './spec';
import type { Exercise, RecordedRequest } from './exerciser';

export interface Violation {
  kind: 'route' | 'query' | 'body-field' | 'body-required' | 'body-enum' | 'patch-path' | 'no-request';
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
  if (!props.size) return [];
  const out: Violation[] = [];
  for (const entry of body) {
    const path = String((entry as { path?: unknown })?.path ?? '');
    const first = path.split('/')[1] ?? '';
    if (first && !props.has(first.toLowerCase())) out.push({ kind: 'patch-path', detail: `/${first}` });
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
