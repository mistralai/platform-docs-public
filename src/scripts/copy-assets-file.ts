import { join, dirname } from 'node:path';
import { promises as fsp } from 'node:fs';
import fse from 'fs-extra';
import fg from 'fast-glob';

interface ManifestData {
  namespace: string;
  count: number;
  cleaned: boolean;
  at: string;
}

interface CopyOptions {
  overwrite: boolean;
  errorOnExist: boolean;
}

const SUBMODULE_DIR = process.env.COOKBOOKS_DIR || 'static/cookbooks';
const PUBLIC_DIR = 'public';
const NAMESPACE = process.env.COOKBOOKS_NS || 'cookbooks';
const DEST_ROOT = join(PUBLIC_DIR, NAMESPACE);

const DO_CLEAN = String(process.env.CLEAN || '').toLowerCase() === 'true';

const ASSET_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'webp',
  'avif',
  'svg',
  'gif',
  'mp3',
  'wav',
  'mp4',
  'webm',
] as const;

const PATTERN = `${SUBMODULE_DIR}/**/*.{${ASSET_EXTENSIONS.join(',')}}`;

const relativeFromSubmodule = (absolutePath: string): string =>
  absolutePath.replace(`${SUBMODULE_DIR}/`, '');

const cleanExistingFiles = async (wantedFiles: Set<string>): Promise<void> => {
  const existingFiles = await fg(`${DEST_ROOT}/**/*`, { onlyFiles: true });
  const existingRelative = existingFiles.map(path =>
    path.replace(`${DEST_ROOT}/`, '')
  );

  const filesToDelete = existingRelative.filter(file => !wantedFiles.has(file));

  await Promise.all(
    filesToDelete.map(file => fsp.unlink(join(DEST_ROOT, file)).catch(() => {}))
  );
};

const copyAssets = async (sourceFiles: string[]): Promise<number> => {
  let copiedCount = 0;

  const copyPromises = sourceFiles.map(async sourceFile => {
    const relativePath = relativeFromSubmodule(sourceFile);
    const destinationFile = join(DEST_ROOT, relativePath);

    await fse.ensureDir(dirname(destinationFile));

    const copyOptions: CopyOptions = {
      overwrite: true,
      errorOnExist: false,
    };

    await fse.copy(sourceFile, destinationFile, copyOptions);
    copiedCount++;
  });

  await Promise.all(copyPromises);
  return copiedCount;
};

const writeManifest = async (fileCount: number): Promise<void> => {
  const manifest: ManifestData = {
    namespace: NAMESPACE,
    count: fileCount,
    cleaned: DO_CLEAN,
    at: new Date().toISOString(),
  };

  await fse.writeJson(join(DEST_ROOT, '_manifest.json'), manifest, {
    spaces: 2,
  });
};

const syncCookbookAssets = async (): Promise<void> => {
  try {
    const sourceFiles = await fg(PATTERN, { dot: false, onlyFiles: true });
    const relativeFiles = sourceFiles.map(relativeFromSubmodule);

    await fse.ensureDir(DEST_ROOT);

    if (DO_CLEAN) {
      const wantedFilesSet = new Set(relativeFiles);
      await cleanExistingFiles(wantedFilesSet);
    }

    const copiedCount = await copyAssets(sourceFiles);
    await writeManifest(relativeFiles.length);

    console.log(
      `[cookbooks] Synced ${copiedCount} asset(s) into ${DEST_ROOT} (clean=${DO_CLEAN})`
    );
  } catch (error) {
    console.error('Error syncing cookbook assets:', error);
    process.exit(1);
  }
};

syncCookbookAssets();
