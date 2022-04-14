import { execaCommandSync as exec, execaSync } from 'execa';
import * as fs from 'node:fs';
import * as path from 'node:path';
import process from 'node:process';

import { getCurrentGitBranch } from '~/utils/git.js';
import { getProjectDir } from '~/utils/project-dir.js';

export function preCommit() {
	if (getCurrentGitBranch() === 'dev') return;

	try {
		exec('pnpm exec lint-staged', { stdio: 'inherit' });
	} catch {
		process.exit(1);
	}
}

export function prePush() {
	if (getCurrentGitBranch() === 'dev') return;

	try {
		const monorepoDir = getProjectDir(process.cwd(), { monorepoRoot: true });
		if (fs.existsSync(path.join(monorepoDir, 'pnpm-workspace.yaml'))) {
			exec('pnpm run -w tc', { stdio: 'inherit' });
		} else {
			exec('pnpm run tc', { stdio: 'inherit' });
		}
	} catch {
		process.exit(1);
	}
}

export function commitMsg() {
	const message = process.argv.at(-1);

	if (message === undefined) {
		throw new Error('No message provided.');
	}

	try {
		execaSync('pnpm', ['exec', 'commitlint', '--edit', message], {
			stdio: 'inherit',
		});
	} catch {
		process.exit(1);
	}
}
