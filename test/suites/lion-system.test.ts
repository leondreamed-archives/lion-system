import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import { afterEach, describe, expect, test } from 'vitest';

import {
	copyPackageFiles,
	getProjectDir,
	rewritePackageJsonPaths,
	transformPackageJson,
} from '~/index.js';
import { projectTestPath } from '~test/utils/paths.js';

afterEach(() => {
	fs.rmSync('dist', { recursive: true, force: true });
});

describe('successfully copies files', () => {
	test('successfully copies files', async () => {
		process.chdir(path.join(projectTestPath, 'fixtures/my-project'));
		await copyPackageFiles({
			additionalFiles: [
				'custom-file',
				'custom-folder',
				'src/file1.html',
				'./src/file2.html',
			],
		});
		expect(fs.existsSync('dist/readme.md')).toBe(true);
		expect(fs.existsSync('dist/custom-file')).toBe(true);
		expect(fs.existsSync('dist/custom-folder')).toBe(true);
		expect(fs.existsSync('dist/custom-folder/custom-folder-file')).toBe(true);
		expect(fs.existsSync('dist/file1.html')).toBe(true);
		expect(fs.existsSync('dist/file2.html')).toBe(true);
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

test('rewriteDistPaths() works', async () => {
	const beforeObj = {
		icons: './dist/icons.png',
		main: './src/index.js',
		folder: './',
		contributes: {
			languages: [
				{
					configuration: './dist/syntaxes/jslatex-language-configuration.json',
					icon: {
						light: './icons/jslatex.png',
						dark: './icons/jslatex.png',
					},
				},
			],
			grammars: [
				{
					path: './dist/syntaxes/JSLaTeX.tmLanguage.json',
					embeddedLanguages: {
						'source.js': 'javascript',
						'meta.embedded.block.latex': 'latex',
					},
				},
			],
		},
	};

	const afterObj = {
		icons: './icons.png',
		main: './index.js',
		folder: './',
		contributes: {
			languages: [
				{
					configuration: './syntaxes/jslatex-language-configuration.json',
					icon: {
						light: './icons/jslatex.png',
						dark: './icons/jslatex.png',
					},
				},
			],
			grammars: [
				{
					path: './syntaxes/JSLaTeX.tmLanguage.json',
					embeddedLanguages: {
						'source.js': 'javascript',
						'meta.embedded.block.latex': 'latex',
					},
				},
			],
		},
	};

	expect(rewritePackageJsonPaths(beforeObj)).toEqual(afterObj);
});

describe('commonjs bundle', () => {
	test('works with commonjs-bundle/', async () => {
		process.chdir(path.join(projectTestPath, 'fixtures/commonjs-bundle'));
		await fs.promises.mkdir('dist');

		const pkg = await transformPackageJson();

		expect(pkg.exports).toEqual({
			import: './index.js',
			require: './index.cjs',
		});
		expect(fs.existsSync('./dist/index.cjs')).toBe(true);
	});
});
