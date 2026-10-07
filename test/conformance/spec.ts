/**
 * OpenAPI spec access for the spec-conformance check.
 *
 * Loads docs/openapi/<release>/*.json. Each file is one bConnect module; its
 * `servers` URL names the module prefix the connector puts in front of the
 * spec path (`…/bconnect/endpoints` → `/endpoints/v2.0/Endpoints`).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const RELEASES = ['25R2', '26R1'] as const;
export type Release = (typeof RELEASES)[number];

export type Schema = {
  $ref?: string;
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  type?: string;
  enum?: unknown[];
  items?: Schema;
  properties?: Record<string, Schema>;
  required?: string[];
  additionalProperties?: boolean | Schema;
  nullable?: boolean;
};

export interface SpecOperation {
  release: Release;
  module: string;
  method: string;
  /** Spec path, e.g. /v2.0/Endpoints/{endpointId} */
  path: string;
  matcher: RegExp;
  queryParams: Set<string>;
  /** Resolved request body schema, if any */
  body?: Schema;
  /** Resolved 200 response schema of the GET on the same path (JSON Patch targets) */
  getResponse?: Schema;
  resolve: (s: Schema | undefined) => Schema | undefined;
}

const SPEC_ROOT = join(__dirname, '../../docs/openapi');

function makeResolver(doc: { components?: { schemas?: Record<string, Schema> } }) {
  const schemas = doc.components?.schemas ?? {};
  const resolve = (s: Schema | undefined, depth = 0): Schema | undefined => {
    if (!s || depth > 20) return s;
    if (s.$ref) return resolve(schemas[s.$ref.split('/').pop() as string], depth + 1);
    if (s.allOf) {
      const merged: Schema = { type: 'object', properties: {}, required: [] };
      for (const part of s.allOf) {
        const r = resolve(part, depth + 1) ?? {};
        if (r.enum) return { ...r, nullable: s.nullable ?? r.nullable };
        if (r.type && r.type !== 'object' && !r.properties) return r;
        Object.assign(merged.properties!, r.properties ?? {});
        merged.required!.push(...(r.required ?? []));
        if (r.items) return r;
      }
      return merged;
    }
    return s;
  };
  return (s: Schema | undefined) => resolve(s);
}

function jsonSchemaOf(content: Record<string, { schema?: Schema }> | undefined): Schema | undefined {
  if (!content) return undefined;
  const entry = content['application/json'] ?? content['application/json-patch+json'] ?? Object.values(content)[0];
  return entry?.schema;
}

function loadRelease(release: Release): SpecOperation[] {
  const dir = join(SPEC_ROOT, release);
  const ops: SpecOperation[] = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const doc = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    const module = String(doc.servers?.[0]?.url ?? '').split('/bconnect/')[1]?.replace(/\/$/, '').toLowerCase();
    if (!module) throw new Error(`${release}/${file}: cannot read module from servers URL`);
    const resolve = makeResolver(doc);
    for (const [path, item] of Object.entries<Record<string, any>>(doc.paths ?? {})) {
      const shared = (item.parameters ?? []) as Array<{ name: string; in: string }>;
      const getResponse = resolve(jsonSchemaOf(item.get?.responses?.['200']?.content));
      for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
        const op = item[method];
        if (!op) continue;
        const params = [...shared, ...((op.parameters ?? []) as Array<{ name: string; in: string }>)];
        const matcher = new RegExp(
          '^' + path.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?\{[^}]+\\?\}/g, '[^/]+') + '$',
          'i',
        );
        ops.push({
          release,
          module,
          method: method.toUpperCase(),
          path,
          matcher,
          queryParams: new Set(params.filter((p) => p.in === 'query').map((p) => p.name.toLowerCase())),
          body: resolve(jsonSchemaOf(op.requestBody?.content)),
          getResponse,
          resolve,
        });
      }
    }
  }
  return ops;
}

export const SPEC: Record<Release, SpecOperation[]> = {
  '25R2': loadRelease('25R2'),
  '26R1': loadRelease('26R1'),
};

/** Find the spec operation for a connector request path like /endpoints/v2.0/Endpoints/{guid}. */
export function findOperation(release: Release, method: string, requestPath: string): SpecOperation | undefined {
  const m = requestPath.match(/^\/([^/]+)(\/v2\.0\/.*)$/i);
  if (!m) return undefined;
  const [, module, rest] = m;
  return SPEC[release].find(
    (o) => o.method === method && o.module === module.toLowerCase() && o.matcher.test(rest.replace(/\/$/, '')),
  );
}

/** Same route in another module or release — used to explain a route violation. */
export function explainMissingRoute(release: Release, method: string, requestPath: string): string {
  const m = requestPath.match(/^\/([^/]+)(\/v2\.0\/.*)$/i);
  if (!m) return 'path is not /<module>/v2.0/…';
  const rest = m[2].replace(/\/$/, '');
  const other = RELEASES.find((r) => r !== release)!;
  const sameModuleOther = findOperation(other, method, requestPath);
  if (sameModuleOther) return `only in ${other}`;
  const anyModule = SPEC[release].find((o) => o.method === method && o.matcher.test(rest));
  if (anyModule) return `route exists under module "${anyModule.module}", not "${m[1]}"`;
  const anyMethod = SPEC[release].find((o) => o.module === m[1].toLowerCase() && o.matcher.test(rest));
  if (anyMethod) return `path exists, but not for ${method}`;
  return 'not in spec';
}
