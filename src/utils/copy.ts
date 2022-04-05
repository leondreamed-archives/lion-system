import * as path from 'node:path';
import * as fs from 'node:fs';
import { rewritePkgPaths } from '~/utils/paths.js';

export const packageFiles = ['readme.md', 'license', 'package.json'];

export function copyPackageFiles(additionalFiles?: string[]) {
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
				fs.writeFileSync(
					distPackageFilePath,
					JSON.stringify(
						rewritePkgPaths(fs.readFileSync(distPackageFilePath, 'utf8')),
						null,
						'\t'
					)
				);
			}
		}
	}
}
