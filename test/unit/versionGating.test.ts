import { describe, it, expect } from 'vitest';
import type { INodeProperties } from 'n8n-workflow';
import { since26R1Options, versionedOptions } from '../../nodes/shared/utils/versionGating';

const ops = (values: string[], dflt = values[0]): INodeProperties => ({
  displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true, default: dflt,
  displayOptions: { show: { resource: ['x'] } },
  options: values.map((v) => ({ name: v, value: v })),
});

// #39: options whose routes exist from 26R1 on must not be offered for 25R2
describe('since26R1Options', () => {
  it('splits a list into a 25R2 copy without the newer options and a full copy for 26R1 and later', () => {
    const [p25, p26] = since26R1Options([ops(['a', 'b', 'c'])], ['b']);
    expect(p25.displayOptions?.show).toEqual({ resource: ['x'], bmsVersion: ['25R2'] });
    expect((p25.options as any[]).map((o) => o.value)).toEqual(['a', 'c']);
    expect(p26.displayOptions?.show).toEqual({ resource: ['x'], bmsVersion: ['26R1', '26R2'] });
    expect((p26.options as any[]).map((o) => o.value)).toEqual(['a', 'b', 'c']);
  });

  it('moves the 25R2 default off a removed option', () => {
    const [p25, p26] = since26R1Options([ops(['a', 'b'], 'b')], ['b']);
    expect(p25.default).toBe('a');
    expect(p26.default).toBe('b');
  });

  it('drops the 25R2 copy when nothing is left', () => {
    const out = since26R1Options([ops(['b'])], ['b']);
    expect(out).toHaveLength(1);
    expect(out[0].displayOptions?.show?.bmsVersion).toEqual(['26R1', '26R2']);
  });

  it('leaves other properties, already version-gated ones and unaffected lists alone', () => {
    const gated: INodeProperties = { ...ops(['b']), displayOptions: { show: { bmsVersion: ['26R1'] } } };
    const other: INodeProperties = { displayName: 'X', name: 'x', type: 'string', default: '' };
    const plain = ops(['a']);
    expect(since26R1Options([gated, other, plain], ['b'])).toEqual([gated, other, plain]);
  });

  it('works on resource lists', () => {
    const res: INodeProperties = { ...ops(['compliance', 'defenseControl']), name: 'resource', displayOptions: undefined };
    const [r25, r26] = since26R1Options([res], ['compliance'], 'resource');
    expect((r25.options as any[]).map((o) => o.value)).toEqual(['defenseControl']);
    expect(r25.default).toBe('defenseControl');
    expect((r26.options as any[]).map((o) => o.value)).toEqual(['compliance', 'defenseControl']);
  });
});

// #93: 26R2 removes routes as well as adding them
describe('versionedOptions', () => {
  it('makes one copy per distinct option list', () => {
    const out = versionedOptions([ops(['a', 'new', 'old'])], { new: ['26R1', '26R2'], old: ['25R2', '26R1'] });
    expect(out.map((p) => [p.displayOptions?.show?.bmsVersion, (p.options as any[]).map((o) => o.value)])).toEqual([
      [['25R2'], ['a', 'old']],
      [['26R1'], ['a', 'new', 'old']],
      [['26R2'], ['a', 'new']],
    ]);
  });

  it('shares a copy between versions with the same options', () => {
    const out = versionedOptions([ops(['a', 'old'])], { old: ['25R2', '26R1'] });
    expect(out.map((p) => p.displayOptions?.show?.bmsVersion)).toEqual([['25R2', '26R1'], ['26R2']]);
  });

  it('splits a property already gated to some versions among those only', () => {
    const gated = { ...ops(['a', 'new']), displayOptions: { show: { resource: ['r'], bmsVersion: ['26R1', '26R2'] } } };
    const out = versionedOptions([gated], { new: ['26R2'] });
    expect(out.map((p) => [p.displayOptions?.show, (p.options as any[]).map((o) => o.value)])).toEqual([
      [{ resource: ['r'], bmsVersion: ['26R1'] }, ['a']],
      [{ resource: ['r'], bmsVersion: ['26R2'] }, ['a', 'new']],
    ]);
  });

  it('moves the default off an option a version lacks', () => {
    const [, p26r2] = versionedOptions([ops(['old', 'a'], 'old')], { old: ['25R2', '26R1'] });
    expect(p26r2.default).toBe('a');
  });
});
