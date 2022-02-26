import process from 'node:process';
import { execaCommandSync as exec, execaSync } from 'execa';

export function preCommit() {
	try {
		exec('pnpm exec lint-staged', { stdio: 'inherit' });
	} catch {
		process.exit(1);
	}
}

export function prePush() {
	try {
		exec('pnpm run tc', { stdio: 'inherit' });
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
