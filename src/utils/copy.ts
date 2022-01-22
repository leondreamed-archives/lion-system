import * as path from 'node:path';
import * as fs from 'node:fs';

export const packageFiles = ['readme.md', 'license', 'package.json'];

export async function copyPackageFiles(additionalFiles?: string[]) {
	if (!fs.existsSync('dist')) {
		await fs.promises.mkdir('dist');
	}

	await Promise.all(
		[...packageFiles, ...(additionalFiles ?? [])].map(async (packageFile) => {
			if (fs.existsSync(packageFile)) {
				await fs.promises.cp(packageFile, path.join('dist', packageFile), {
					recursive: true,
				});
			}
		})
	);
}

export function copyPackageFilesSync(additionalFiles?: string[]) {
	if (!fs.existsSync('dist')) {
		fs.mkdirSync('dist');
	}

	for (const packageFile of [...packageFiles, ...(additionalFiles ?? [])]) {
		if (fs.existsSync(packageFile)) {
			fs.cpSync(packageFile, path.join('dist', packageFile), {
				recursive: true,
			});
		}
	}
}

