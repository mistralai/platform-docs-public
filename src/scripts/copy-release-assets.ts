import { join, dirname, relative, sep } from 'node:path';
import fse from 'fs-extra';
import fg from 'fast-glob';

const RELEASES_DIR = 'src/data/releases';
const DEST_ROOT = 'public/assets/releases';
const ASSET_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'webp',
  'avif',
  'svg',
  'gif',
] as const;

const PATTERN = `${RELEASES_DIR}/**/assets/*.{${ASSET_EXTENSIONS.join(',')}}`;

const toPosix = (path: string): string => path.split(sep).join('/');

const copyReleaseAssets = async (): Promise<void> => {
  const sourceFiles = await fg(PATTERN, { dot: false, onlyFiles: true });

  await Promise.all(
    sourceFiles.map(async sourceFile => {
      const destinationFile = join(DEST_ROOT, relative(RELEASES_DIR, sourceFile));
      await fse.ensureDir(dirname(destinationFile));
      await fse.copy(sourceFile, destinationFile, { overwrite: true, errorOnExist: false });
    })
  );

  console.log(`[releases] Synced ${sourceFiles.length} asset(s) into ${toPosix(DEST_ROOT)}`);
};

copyReleaseAssets().catch(error => {
  console.error('Error syncing release assets:', error);
  process.exit(1);
});
