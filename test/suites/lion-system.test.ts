import process from 'node:process';
import * as fs from 'node:fs';
import { copyPackageFiles } from '~/utils/index.js';

afterAll(() => {
	fs.rmSync('dist', { recursive: true, force: true });
});

test('successfully copies files', async () => {
	process.chdir('test/fixtures/my-project');
	await copyPackageFiles(['custom-file', 'custom-folder']);
	expect(fs.existsSync('dist/readme.md')).toBe(true);
	expect(fs.existsSync('dist/custom-file')).toBe(true);
	expect(fs.existsSync('dist/custom-folder')).toBe(true);
	expect(fs.existsSync('dist/custom-folder/some-file')).toBe(true);
});
