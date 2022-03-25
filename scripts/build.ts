import { execaCommandSync as exec } from 'execa';
import { chProjectDir, rmDist, copyPackageFiles } from '../src/index.js';

chProjectDir(import.meta.url);
rmDist();
exec('tsc');
exec('tsc-alias');
copyPackageFiles();
