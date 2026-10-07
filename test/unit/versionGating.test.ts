import { describe, it, expect } from 'vitest';
import type { INodeProperties } from 'n8n-workflow';
import { only26R1Options } from '../../nodes/shared/utils/versionGating';

const ops = (values: string[], dflt = values[0]): INodeProperties => ({
  displayName: 'Operation', name: 'operation', type: 'options', default: dflt,
  displayOptions: { show: { resource: ['x'] } },
  options: values.map((v) => ({ name: v, value: v })),
});

// #39: options whose routes exist in 26R1 only must not be offered for 25R2
describe('only26R1Options', () => {
  it('splits a list into a 25R2 copy without the 26R1-only options and a full 26R1 copy', () => {
    const [p25, p26] = only26R1Options([ops(['a', 'b', 'c'])], ['b']);
    expect(p25.displayOptions?.show).toEqual({ resource: ['x'], bmsVersion: ['25R2'] });
    expect((p25.options as any[]).map((o) => o.value)).toEqual(['a', 'c']);
    expect(p26.displayOptions?.show).toEqual({ resource: ['x'], bmsVersion: ['26R1'] });
    expect((p26.options as any[]).map((o) => o.value)).toEqual(['a', 'b', 'c']);
  });

  it('moves the 25R2 default off a removed option', () => {
    const [p25, p26] = only26R1Options([ops(['a', 'b'], 'b')], ['b']);
    expect(p25.default).toBe('a');
    expect(p26.default).toBe('b');
  });

  it('drops the 25R2 copy when nothing is left', () => {
    const out = only26R1Options([ops(['b'])], ['b']);
    expect(out).toHaveLength(1);
    expect(out[0].displayOptions?.show?.bmsVersion).toEqual(['26R1']);
  });

  it('leaves other properties, already version-gated ones and unaffected lists alone', () => {
    const gated: INodeProperties = { ...ops(['b']), displayOptions: { show: { bmsVersion: ['26R1'] } } };
    const other: INodeProperties = { displayName: 'X', name: 'x', type: 'string', default: '' };
    const plain = ops(['a']);
    expect(only26R1Options([gated, other, plain], ['b'])).toEqual([gated, other, plain]);
  });

  it('works on resource lists', () => {
    const res: INodeProperties = { ...ops(['compliance', 'defenseControl']), name: 'resource', displayOptions: undefined };
    const [r25, r26] = only26R1Options([res], ['compliance'], 'resource');
    expect((r25.options as any[]).map((o) => o.value)).toEqual(['defenseControl']);
    expect(r25.default).toBe('defenseControl');
    expect((r26.options as any[]).map((o) => o.value)).toEqual(['compliance', 'defenseControl']);
  });
});
