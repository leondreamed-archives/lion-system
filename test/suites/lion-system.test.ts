import * as process from 'node:process';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { afterEach, describe, test, expect } from 'vitest';
import { copyPackageFiles, getProjectDir, rewriteDistPaths } from '~/index.js';
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

test('rewriteDistPaths() works', () => {
	const beforeObj = {
		icons: './dist/icons.png',
		main: './dist/index.js',
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

	expect(rewriteDistPaths(beforeObj)).toEqual(afterObj);
	expect(rewriteDistPaths(JSON.stringify(beforeObj))).toEqual(afterObj);
});
