import * as process from 'node:process';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { afterEach, describe, test, expect } from 'vitest';
import { copyPackageFiles, getProjectDir } from '~/index.js';
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
		expect(fs.existsSync('dist/custom-folder/custom-folder-file')).toBe(true);
	});

	test('successfully gets the correct project directory', () => {
		const projectFixturePath = path.join(
			projectTestPath,
			'fixtures/my-project'
		);
		const subprojectFolderPath = `file://${path.join(
			projectFixturePath,
			'packages/subproject/subproject-folder'
		)}`;
		expect(getProjectDir(subprojectFolderPath)).toBe(
			path.join(projectFixturePath, 'packages/subproject')
		);
		expect(getProjectDir(subprojectFolderPath, { monorepoRoot: false })).toBe(
			path.join(projectFixturePath, 'packages/subproject')
		);
		expect(getProjectDir(subprojectFolderPath, { monorepoRoot: true })).toBe(
			projectFixturePath
		);
	});
});
