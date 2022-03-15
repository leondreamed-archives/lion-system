import { setProperty, deepKeys, getProperty } from 'dot-prop';

/**
 * Rewrites `./dist/<path>` paths in an object to `./<path>` paths
 * @param json An object or JSON string
 * @returns An object with the dist paths
 */
export function rewriteDistPaths(json: string | Record<string, unknown>) {
	const obj =
		typeof json === 'string'
			? (JSON.parse(json) as Record<string, unknown>)
			: json;

	for (const property of deepKeys(obj)) {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		const value = getProperty(json, property) as unknown;
		if (typeof value === 'string' && value.startsWith('./dist')) {
			setProperty(obj, property, value.replace(/^\.\/dist\//, './'));
		}
	}

	return obj;
}
