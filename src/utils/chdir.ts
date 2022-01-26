import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import { fileURLToPath } from 'node:url';
import { pkgUpSync } from 'pkg-up';

export function getProjectDir(pathUrl: string) {
	const pathDirectory = path.dirname(fileURLToPath(pathUrl));
	const getPackageJson = (cwd: string) => {
		const packageJsonPath = pkgUpSync({ cwd });
		if (packageJsonPath === undefined) {
			throw new Error('No project found.');
		}

		const packageJson = JSON.parse(
			fs.readFileSync(packageJsonPath).toString()
		) as {
			type: string;
		};

		return { packageJson, packageJsonPath };
	};

	let { packageJson, packageJsonPath } = getPackageJson(pathDirectory);

	// If the package.json only has "type": "module", search for another one
	while (
		packageJson.type === 'module' &&
		Object.keys(packageJson).length === 1
	) {
		const curDirectory = path.dirname(packageJsonPath);
		({ packageJson, packageJsonPath } = getPackageJson(curDirectory));
	}

	const projectPath = path.dirname(packageJsonPath);
	return projectPath;
}

export function chProjectDir(pathUrl: string) {
	const projectPath = getProjectDir(pathUrl);
	process.chdir(projectPath);
}
