import process from 'node:process';
import path from 'node:path';
import * as fs from 'node:fs';
import { copyPackageFiles, getProjectDir } from '~/utils/index.js';
import { projectTestPath } from '~test/utils/paths.js';

afterEach(() => {
	fs.rmSync('dist', { recursive: true, force: true });
});

describe('successfully copies files', () => {
	test('successfully copies files', () => {
		process.chdir(path.join(projectTestPath, 'fixtures/my-project'));
		copyPackageFiles(['custom-file', 'custom-folder']);
		expect(fs.existsSync('dist/readme.md')).toBe(true);
		expect(fs.existsSync('dist/custom-file')).toBe(true);
		expect(fs.existsSync('dist/custom-folder')).toBe(true);
		expect(fs.existsSync('dist/custom-folder/some-file')).toBe(true);
	});

	test('successfully gets the correct project directory', () => {
		const projectFixturePath = path.join(
			projectTestPath,
			'fixtures/my-project'
		);
		const customFolderPath = `file://${path.join(
			projectFixturePath,
			'custom-folder'
		)}`;
		expect(getProjectDir(customFolderPath)).toBe(projectFixturePath);
	});
});
