import type { INodeProperties } from 'n8n-workflow';

/** bMS versions the nodes support, oldest first (values of the `bmsVersion` parameter). */
export const BMS_VERSIONS = ['25R2', '26R1', '26R2'] as const;
export type BmsVersion = (typeof BMS_VERSIONS)[number];

/** `bmsVersion` values for features added in 26R1: use in `displayOptions.show`. */
export const SINCE_26R1: BmsVersion[] = ['26R1', '26R2'];

/** `bmsVersion` values for features added in 26R2. */
export const SINCE_26R2: BmsVersion[] = ['26R2'];

/**
 * Offer some options of a property only for some bMS versions.
 *
 * `availableIn` maps an option value to the versions that have it; options it
 * does not name exist in every version. Every property named `name` that has a
 * gated option is replaced by one copy per distinct option list, shown for the
 * versions that share it; a property already tied to some bmsVersions is split
 * among those only. A copy left without options is dropped.
 */
export function versionedOptions(
	props: INodeProperties[],
	availableIn: Record<string, readonly BmsVersion[]>,
	name = 'operation',
): INodeProperties[] {
	return props.flatMap((p) => {
		const show = p.displayOptions?.show ?? {};
		const options = (p.options ?? []) as Array<{ value: unknown }>;
		if (p.name !== name || !options.some((o) => String(o.value) in availableIn)) return [p];

		const shownIn = (show.bmsVersion as BmsVersion[] | undefined) ?? BMS_VERSIONS;
		const copies = new Map<string, { versions: BmsVersion[]; options: Array<{ value: unknown }> }>();
		for (const version of BMS_VERSIONS.filter((v) => shownIn.includes(v))) {
			const opts = options.filter((o) => availableIn[String(o.value)]?.includes(version) ?? true);
			if (!opts.length) continue;
			const key = opts.map((o) => String(o.value)).join('\n');
			const copy = copies.get(key) ?? { versions: [], options: opts };
			copy.versions.push(version);
			copies.set(key, copy);
		}
		return [...copies.values()].map(({ versions, options: opts }): INodeProperties => {
			const values = opts.map((o) => o.value);
			return {
				...p,
				displayOptions: { ...p.displayOptions, show: { ...show, bmsVersion: versions } },
				options: opts as INodeProperties['options'],
				default: values.includes(p.default) ? p.default : (values[0] as INodeProperties['default']),
			};
		});
	});
}

/** Offer some options of a property only from bMS 26R1 on (see {@link versionedOptions}). */
export function since26R1Options(props: INodeProperties[], since26R1: string[], name = 'operation'): INodeProperties[] {
	return versionedOptions(props, Object.fromEntries(since26R1.map((v) => [v, SINCE_26R1])), name);
}
