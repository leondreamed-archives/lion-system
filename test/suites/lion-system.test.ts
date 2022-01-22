import process from 'node:process';
import * as fs from 'node:fs';
import { copyPackageFiles, copyPackageFilesSync } from '~/utils/index.js';

afterEach(() => {
	fs.rmSync('dist', { recursive: true, force: true });
});

describe('successfully copies files', () => {
	process.chdir('test/fixtures/my-project');

	test('successfully copies files asynchronously', async () => {
		await copyPackageFiles(['custom-file', 'custom-folder']);
		expect(fs.existsSync('dist/readme.md')).toBe(true);
		expect(fs.existsSync('dist/custom-file')).toBe(true);
		expect(fs.existsSync('dist/custom-folder')).toBe(true);
		expect(fs.existsSync('dist/custom-folder/some-file')).toBe(true);
	});

	test('successfully copies files synchronously', () => {
		copyPackageFilesSync(['custom-file', 'custom-folder']);
		expect(fs.existsSync('dist/readme.md')).toBe(true);
		expect(fs.existsSync('dist/custom-file')).toBe(true);
		expect(fs.existsSync('dist/custom-folder')).toBe(true);
		expect(fs.existsSync('dist/custom-folder/some-file')).toBe(true);
	});
});

