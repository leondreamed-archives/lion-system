import * as fs from 'node:fs';
import * as path from 'node:path';

interface RmDistProps {
	removeFolder: boolean;
}
export function rmDist(props?: RmDistProps) {
	if (props?.removeFolder) {
		fs.rmSync('dist');
	} else {
		for (const file of fs.readdirSync('dist')) {
			if (file !== '.gitkeep') fs.rmSync(path.join('dist', file));
		}
	}
}
