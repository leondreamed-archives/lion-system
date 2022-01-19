import * as fs from 'node:fs';

export function rmDist() {
	fs.rmSync('dist', { recursive: true, force: true });
}
