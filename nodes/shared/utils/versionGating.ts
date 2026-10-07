import type { INodeProperties } from 'n8n-workflow';

/**
 * Offer some options of a property only for bMS 26R1.
 *
 * Every property named `name` that is not already tied to a bmsVersion is
 * replaced by two copies: a 25R2 copy without the 26R1-only options and a
 * 26R1 copy with all of them. A 25R2 copy left without options is dropped.
 * Used for operation and resource lists whose routes exist in 26R1 only.
 */
export function only26R1Options(props: INodeProperties[], only26R1: string[], name = 'operation'): INodeProperties[] {
	const later = new Set(only26R1);
	return props.flatMap((p) => {
		const show = p.displayOptions?.show ?? {};
		const options = (p.options ?? []) as Array<{ value: unknown }>;
		if (p.name !== name || 'bmsVersion' in show || !options.some((o) => later.has(String(o.value)))) return [p];

		const forVersion = (version: string, opts: Array<{ value: unknown }>): INodeProperties => {
			const values = opts.map((o) => o.value);
			return {
				...p,
				displayOptions: { ...p.displayOptions, show: { ...show, bmsVersion: [version] } },
				options: opts as INodeProperties['options'],
				default: values.includes(p.default) ? p.default : (values[0] as INodeProperties['default']),
			};
		};
		const options25R2 = options.filter((o) => !later.has(String(o.value)));
		return [...(options25R2.length ? [forVersion('25R2', options25R2)] : []), forVersion('26R1', options)];
	});
}
