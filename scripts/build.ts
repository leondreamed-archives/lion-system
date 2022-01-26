import * as path from 'node:path';
import * as fs from 'node:fs';
import process from 'node:process';
import { execaCommandSync as exec } from 'execa';
import { join } from 'desm';

process.chdir(join(import.meta.url, '..'));

exec('tsc');
for (const file of ['readme.md', 'package.json']) {
	fs.copyFileSync(file, path.join('dist', file));
}
