import { deepKeys, getProperty, setProperty } from 'dot-prop';
import * as fs from 'node:fs';
import rfdc from 'rfdc';
import type { PackageJson } from 'type-fest';

import { createCommonjsBundle } from '~/utils/publish.js';

/**
	Rewrites `./dist/<path>` and `./src/<path>` paths in an object to `./<path>` paths
	@param json An object or JSON string
	@returns An object with the dist paths
*/
export function rewritePackageJsonPaths(pkg: PackageJson): PackageJson {
	for (const property of deepKeys(pkg)) {
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
		const value = getProperty(pkg, property) as unknown;
		if (typeof value === 'string') {
			if (value.startsWith('./dist')) {
				setProperty(pkg, property, value.replace(/^\.\/dist\//, './'));
			} else if (value.startsWith('./src')) {
				setProperty(pkg, property, value.replace(/^\.\/src\//, './'));
			}
		}
	}

	return pkg;
}

export function removePreinstallScript(pkg: PackageJson) {
	if (pkg.scripts?.preinstall === 'pnpm build') {
		delete pkg.scripts.preinstall;
	}

	return pkg;
}

const clone = rfdc();

/**
	Transforms a `package.json` file from a source package.json to a distribution package.json to be published onto `npm`
 */
export async function transformPackageJson(
	pkgOrJson?: string | PackageJson,
	{ commonjs = true }: { commonjs?: boolean } = {}
): Promise<PackageJson> {
	if (pkgOrJson === undefined) {
		pkgOrJson = await fs.promises.readFile('package.json', 'utf8');
	}

	const pkg =
		typeof pkgOrJson === 'string'
			? (JSON.parse(pkgOrJson) as PackageJson)
			: clone(pkgOrJson);

	rewritePackageJsonPaths(pkg);
	removePreinstallScript(pkg);

	if (commonjs) {
		await createCommonjsBundle(pkg);
	}

	return pkg;
}
