import * as path from 'node:path';
import * as fs from 'node:fs';

export const packageFiles = ['readme.md', 'license', 'package.json'];

export async function copyPackageFiles() {
	if (!fs.existsSync('dist')) {
		await fs.promises.mkdir('dist');
	}

	await Promise.all(
		packageFiles.map(async (packageFile) => {
			if (fs.existsSync(packageFile)) {
				await fs.promises.copyFile(packageFile, path.join('dist', packageFile));
			}
		})
	);
}
