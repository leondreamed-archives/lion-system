import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import { fileURLToPath } from 'node:url';

/**
 * Gets the base project directory (for monorepos, the root project) using
 * the following heuristic:
 * - There must be a package.json file in the base project directory root
 * - If the directory with a package.json does not have a pnpm-lock.yaml, it
 * means that the project is part of a monorepo.
 * - If a monorepo was detected, that means that the base directory must have a
 * pnpm-workspace.yaml file with a `packages` property that has a matching glob
 * entry that matches
 */
export function getProjectDir(pathUrl: string) {
	let curDirectory = path.dirname(fileURLToPath(pathUrl));

	// If pnpm-lock.yaml doesn't exist in the directory, continue checking in the above directory
	while (!fs.existsSync(path.join(curDirectory, 'pnpm-lock.yaml'))) {
		curDirectory = path.dirname(curDirectory);
	}

	// Check whether there is a package.json

	return curDirectory;
}

export function chProjectDir(pathUrl: string) {
	const projectPath = getProjectDir(pathUrl);
	process.chdir(projectPath);
}
