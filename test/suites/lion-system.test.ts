import process from 'node:process';
import * as fs from 'fs';
import { copyPackageFiles } from '~/utils/index.js';

afterAll(() => {
	fs.rmSync('dist', { recursive: true, force: true });
});

test("function doesn't error", async () => {
	process.chdir('test/fixtures/my-project');
	await copyPackageFiles();	
	expect(fs.existsSync('dist/readme.md')).toBe(true);
});
