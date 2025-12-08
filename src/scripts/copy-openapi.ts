import { join } from 'node:path';
import fse from 'fs-extra';

const SOURCE_FILE = 'openapi.yaml';
const DEST_DIR = 'public';
const DEST_FILE = join(DEST_DIR, 'openapi.yaml');

const copyOpenApi = async (): Promise<void> => {
  try {
    await fse.ensureDir(DEST_DIR);
    await fse.copy(SOURCE_FILE, DEST_FILE, { overwrite: true });
    console.log(`✓ Copied ${SOURCE_FILE} to ${DEST_FILE}`);
  } catch (error) {
    console.error(`Error copying ${SOURCE_FILE}:`, error);
    process.exit(1);
  }
};

copyOpenApi();
