import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { resolve as importMetaResolve } from 'import-meta-resolve';
import * as fs from 'node:fs';
import { builtinModules } from 'node:module';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ExternalOption, Plugin, RollupOptions } from 'rollup';
import { rollup } from 'rollup';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import type { PackageJson } from 'type-fest';

type CreateCommonjsBundleProps = {
	pkgPath: string;
	pkg: PackageJson;
	rollupOptions?: RollupOptions & { extendPlugins?: Plugin[] };
};
/**
	Bundles all dependencies with Rollup to produce a CommonJS bundle
*/
export async function createCommonjsBundle({
	pkgPath,
	pkg,
	rollupOptions,
}: CreateCommonjsBundleProps) {
	if (pkg.exports === undefined || pkg.exports === null) {
		return pkg;
	}

	if (typeof pkg.exports !== 'string') {
		throw new TypeError(
			'Using an object with `exports` is not supported (yet)'
		);
	}

	const pkgDir = path.dirname(pkgPath);
	const tsconfigPath = path.join(pkgDir, 'tsconfig.json');

	// Weird typing for `plugins` comes from rollup
	const plugins: Array<false | null | undefined | Plugin> = [
		json(),
		nodeResolve(),
		commonjs(),
		peerDepsExternal({
			packageJsonPath: pkgPath,
		}) as Plugin,
	];

	if (rollupOptions?.extendPlugins !== undefined) {
		plugins.push(...rollupOptions.extendPlugins);
	}

	if (fs.existsSync(tsconfigPath)) {
		plugins.push(
			typescript({
				tsconfig: tsconfigPath,
				tslib: fileURLToPath(await importMetaResolve('tslib', import.meta.url)),
			})
		);
	}

	let external: ExternalOption = builtinModules.flatMap((module) => [
		module,
		`node:${module}`,
	]);

	if (rollupOptions?.external) {
		if (typeof rollupOptions.external === 'function') {
			external = rollupOptions.external;
		} else {
			external.push(...[rollupOptions.external].flat());
		}
	}

	const bundle = await rollup({
		plugins,
		input: path.join(pkgDir, pkg.exports),
		...rollupOptions,
		external,
	});

	fs.mkdirSync('dist', { recursive: true });

	await bundle.write({
		file: './dist/index.cjs',
		format: 'commonjs',
		inlineDynamicImports: true,
	});

	const exportsWithoutExtension = path.join(
		path.dirname(pkg.exports),
		path.parse(pkg.exports).name
	);

	pkg.exports = {
		import: `./${exportsWithoutExtension}.js`,
		require: './index.cjs',
	};
}
