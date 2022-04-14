import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as fs from 'node:fs';
import { builtinModules } from 'node:module';
import * as path from 'node:path';
import { rollup } from 'rollup';
import type { PackageJson } from 'type-fest';

/**
	Bundles all dependencies with Rollup to produce a CommonJS bundle
*/
export async function createCommonjsBundle({
	pkgPath,
	pkg,
}: {
	pkgPath: string;
	pkg: PackageJson;
}) {
	if (pkg.exports === undefined || pkg.exports === null) {
		return pkg;
	}

	if (typeof pkg.exports !== 'string') {
		throw new TypeError(
			'Using an object with `exports` is not supported (yet)'
		);
	}

	const bundle = await rollup({
		plugins: [json(), nodeResolve(), commonjs(), typescript()],
		input: path.join(path.dirname(pkgPath), pkg.exports),
		external: builtinModules.flatMap((module) => [module, `node:${module}`]),
	});

	if (!fs.existsSync('dist')) {
		fs.mkdirSync('dist');
	}

	await bundle.write({
		file: './dist/index.cjs',
		format: 'commonjs',
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
