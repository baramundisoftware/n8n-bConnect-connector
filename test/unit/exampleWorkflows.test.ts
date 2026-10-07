/**
 * The example workflows in example-workflows/ must keep working with the nodes as they are:
 * every baramundi node uses an operation the editor offers for its bMS release and only
 * parameters the node defines, and every job instance state a Code node compares with is one
 * bConnect reports. The examples are what users import first; they had drifted (states
 * 'Succeeded'/'Failed' that bConnect never returns, so the failure alert could never fire).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { NODES, operationsOf } from '../conformance/exerciser';
import { RELEASES, type Release } from '../conformance/spec';

const DIR = join(__dirname, '../../example-workflows');
const PACKAGE = 'n8n-nodes-baramundi-management-suite.';

interface WorkflowNode {
  name: string;
  type: string;
  parameters?: Record<string, unknown>;
}

const workflows = readdirSync(DIR)
  .filter((f) => f.endsWith('.json'))
  .map((file) => ({ file, nodes: JSON.parse(readFileSync(join(DIR, file), 'utf8')).nodes as WorkflowNode[] }));

/** JobInstance.state values of both specs. */
const JOB_STATES = new Set(
  RELEASES.flatMap((release) => {
    const file = readdirSync(join(__dirname, '../../docs/openapi', release)).find((f) => /^bConnect_Jobs\.json$/i.test(f))!;
    const doc = JSON.parse(readFileSync(join(__dirname, '../../docs/openapi', release, file), 'utf8'));
    return doc.components.schemas.State.enum as string[];
  }),
);

/** String literals a Code node compares a `state` with: `.state === 'X'` and `…_STATES = ['X', …]`. */
function comparedStates(code: string): string[] {
  const out: string[] = [];
  for (const m of code.matchAll(/\.state\s*[!=]==?\s*'([^']*)'/g)) out.push(m[1]);
  for (const m of code.matchAll(/_STATES\s*=\s*\[([^\]]*)\]/g)) {
    for (const s of m[1].matchAll(/'([^']*)'/g)) out.push(s[1]);
  }
  return out;
}

describe('example workflows', () => {
  it('finds the example workflows', () => {
    expect(workflows.length).toBeGreaterThanOrEqual(4);
  });

  for (const { file, nodes } of workflows) {
    describe(file, () => {
      for (const n of nodes.filter((x) => x.type.startsWith(PACKAGE))) {
        it(`${n.name}: operation and parameters exist`, () => {
          const node = NODES.find((x) => PACKAGE + x.description.name === n.type);
          expect(node, `unknown node type ${n.type}`).toBeDefined();
          const p = n.parameters ?? {};
          const release = (p.bmsVersion ?? '26R1') as Release;
          const offered = operationsOf(node!, release).some((o) => o.resource === p.resource && o.operation === p.operation);
          expect(offered, `${String(p.resource)}.${String(p.operation)} is not offered for ${release}`).toBe(true);
          const defined = new Set(node!.description.properties.map((x) => x.name));
          expect(Object.keys(p).filter((k) => !defined.has(k))).toEqual([]);
        });
      }

      const code = nodes.filter((x) => typeof x.parameters?.jsCode === 'string');
      if (code.length) {
        it('compares job instance states only with states bConnect reports', () => {
          const unknown = code.flatMap((x) =>
            comparedStates(x.parameters!.jsCode as string).filter((s) => !JOB_STATES.has(s)).map((s) => `${x.name}: '${s}'`),
          );
          expect(unknown).toEqual([]);
        });
      }
    });
  }

  it('recognises a state bConnect does not report', () => {
    expect(comparedStates("const ok = i.json.state === 'Succeeded'; const FAILED_STATES = ['FinishedWithError', 'Failed'];")).toEqual([
      'Succeeded',
      'FinishedWithError',
      'Failed',
    ]);
    expect(JOB_STATES.has('Failed')).toBe(false);
    expect(JOB_STATES.has('FinishedWithError')).toBe(true);
  });
});
