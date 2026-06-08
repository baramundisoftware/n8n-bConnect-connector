/**
 * Automated API Path Validation (P16.4)
 *
 * Extracts all hardcoded API paths from execute files and validates them
 * against the OpenAPI spec JSON files. Catches path drift before it reaches
 * production.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// ─── Load all OpenAPI spec paths ────────────────────────────────────────────

function loadSpecPaths(): Set<string> {
  const specBase = process.env.OPENAPI_BASE || path.join(__dirname, '../../docs/openapi');
  const specDirs = [
    path.join(specBase, '26R1'),
    path.join(specBase, '25R2'),
  ];
  const paths = new Set<string>();

  for (const dir of specDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
      const spec = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
      for (const p of Object.keys(spec.paths || {})) {
        // Normalize: replace {paramName} with {id} for matching
        const normalized = p.replace(/\{[^}]+\}/g, '{id}');
        paths.add(normalized);
      }
    }
  }
  return paths;
}

// ─── Extract connector paths from execute files ─────────────────────────────

function extractConnectorPaths(): Array<{ path: string; file: string; line: number }> {
  const nodesDir = path.join(__dirname, '../../nodes');
  const results: Array<{ path: string; file: string; line: number }> = [];

  // Recursively find *.execute.ts files
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.execute.ts')) {
        const content = fs.readFileSync(full, 'utf-8');
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          // Match apiRequest/apiRequestAllItems calls with path strings
          const match = lines[i].match(/apiRequest(?:AllItems)?\.call\(this,\s*'[A-Z]+',\s*[`']([^`']+)[`']/);
          if (match) {
            let apiPath = match[1];
            // Handle template literals: replace ${...} with {id}
            apiPath = apiPath.replace(/\$\{[^}]+\}/g, '{id}');
            results.push({
              path: apiPath,
              file: path.relative(nodesDir, full),
              line: i + 1,
            });
          }
        }
      }
    }
  }

  walk(nodesDir);
  return results;
}

// ─── Strip domain prefix from connector path ────────────────────────────────
// Connector uses: /endpoints/v2.0/Endpoints
// OpenAPI has:    /v2.0/Endpoints

function stripDomainPrefix(connectorPath: string): string {
  return connectorPath.replace(/^\/[a-z]+(?:mgmt)?\/(v2\.0\/)/, '/$1');
}

// ─── Known exceptions ───────────────────────────────────────────────────────
// Paths that are valid but not in the OpenAPI spec (undocumented API or
// sub-resource paths that combine specs). Document why each is accepted.

const KNOWN_EXCEPTIONS = new Set([
  // StaticGroups/DynamicGroups base CRUD — undocumented but works on real bMS (P16.3)
  '/v2.0/StaticGroups',
  '/v2.0/StaticGroups/{id}',
  '/v2.0/DynamicGroups',
  '/v2.0/DynamicGroups/{id}',
  // Cross-spec sub-resource paths (endpoint spec references job/AD/UDG entities)
  '/v2.0/UniversalDynamicGroups/{id}/Endpoints',
  '/v2.0/ADUsers/{id}/Endpoints',
  // IndustrialEndpoints — 25R2 only, handled by version gating
  '/v2.0/IndustrialEndpoints',
  '/v2.0/IndustrialEndpoints/{id}',
  // Dynamic paths using template variables (${typePath}, ${groupTypePath})
  // These resolve at runtime to valid paths like /v2.0/WindowsEndpoints/{id}
  // or /v2.0/LogicalGroups/{id}/MaintenanceWindow
  '/v2.0/{id}/{id}',
  '/v2.0/{id}/{id}/MaintenanceWindow',
]);

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('API Path Validation against OpenAPI Specs', () => {
  const specPaths = loadSpecPaths();
  const connectorPaths = extractConnectorPaths();

  it('should have loaded OpenAPI spec paths', () => {
    expect(specPaths.size).toBeGreaterThan(100);
  });

  it('should have extracted connector paths', () => {
    expect(connectorPaths.length).toBeGreaterThan(50);
  });

  it('all connector paths should exist in OpenAPI specs (or be known exceptions)', () => {
    const unmatched: Array<{ path: string; stripped: string; file: string; line: number }> = [];

    for (const entry of connectorPaths) {
      const stripped = stripDomainPrefix(entry.path);
      if (specPaths.has(stripped)) continue;
      if (KNOWN_EXCEPTIONS.has(stripped)) continue;
      unmatched.push({ ...entry, stripped });
    }

    if (unmatched.length > 0) {
      const report = unmatched
        .map(u => `  ${u.file}:${u.line}  ${u.path}  →  ${u.stripped}`)
        .join('\n');
      expect.fail(
        `${unmatched.length} connector path(s) not found in OpenAPI specs:\n${report}\n\n` +
        `If a path is valid but undocumented, add it to KNOWN_EXCEPTIONS in this test.`,
      );
    }
  });
});
