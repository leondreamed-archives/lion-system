import * as fs from 'node:fs';
import * as path from 'node:path';
import type { PackageJson } from 'type-fest';

import { transformPackageJson } from '~/utils/package-json.js';

export const packageFiles = ['readme.md', 'license', 'package.json'];

type CopyPackageFilesProps = {
	additionalFiles?: string[];
	/**
		Whether or not to also create a CommonJS bundle for the project

		@default true
	*/
	commonjs?: boolean;
};

export async function copyPackageFiles({
	additionalFiles,
	commonjs,
}: CopyPackageFilesProps = {}) {
	if (!fs.existsSync('dist')) {
		fs.mkdirSync('dist');
	}

	for (const packageFilePath of [...packageFiles, ...(additionalFiles ?? [])]) {
		if (fs.existsSync(packageFilePath)) {
			const distPackageFilePath = path.join('dist', packageFilePath);
			fs.cpSync(packageFilePath, distPackageFilePath, {
				recursive: true,
			});

			if (path.parse(packageFilePath).base === 'package.json') {
				const transformedPackageJson =
					// eslint-disable-next-line no-await-in-loop
					await transformPackageJson({
						pkg: JSON.parse(
							fs.readFileSync(distPackageFilePath, 'utf8')
						) as PackageJson,
						pkgPath: distPackageFilePath,
						commonjs,
					});

				fs.writeFileSync(
					distPackageFilePath,
					JSON.stringify(transformedPackageJson, null, '\t')
				);
			}
		}
	}
}
