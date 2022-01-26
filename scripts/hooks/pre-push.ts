import process from 'node:process';
import { execaCommandSync as exec } from 'execa';
import { join } from 'desm';

process.chdir(join(import.meta.url, '../..'));

try {
	exec('pnpm run tc', { stdio: 'inherit' });
} catch {
	process.exit(-1);
}
