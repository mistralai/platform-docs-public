import path from 'path';
import { readdir, mkdir, copyFile, readFile, writeFile } from 'fs/promises';

const DOCS_ROOT = path.join(process.cwd(), 'src', 'app', '(docs)');
const OUT_ROOT = path.join(process.cwd(), 'public');

async function ensureDirectoryExists(directoryPath: string): Promise<void> {
  await mkdir(directoryPath, { recursive: true });
}

async function listMdxFiles(
  directoryPath: string,
  basePath: string
): Promise<string[]> {
  const dirents = await readdir(directoryPath, { withFileTypes: true });
  const files: string[] = [];
  for (const dirent of dirents) {
    const fullPath = path.join(directoryPath, dirent.name);
    if (dirent.isDirectory()) {
      const childFiles = await listMdxFiles(fullPath, basePath);
      files.push(...childFiles);
    } else if (dirent.isFile() && dirent.name.toLowerCase().endsWith('.mdx')) {
      const relativePath = path.relative(basePath, fullPath);
      files.push(relativePath);
    }
  }
  return files;
}

async function main(): Promise<void> {
  await ensureDirectoryExists(OUT_ROOT);
  let mdxFiles: string[] = [];
  try {
    mdxFiles = await listMdxFiles(DOCS_ROOT, DOCS_ROOT);
  } catch {
    mdxFiles = [];
  }
  const mappings = mdxFiles.map(relativePath => {
    const parsed = path.parse(relativePath);
    let destinationRelative = relativePath;
    const baseLower = parsed.base.toLowerCase();
    if (
      baseLower === 'page.mdx' ||
      baseLower === '_page.mdx' ||
      baseLower === 'index.mdx'
    ) {
      const parentDirName = path.basename(parsed.dir);
      const parentParentDir = path.dirname(parsed.dir);
      destinationRelative = path.join(parentParentDir, `${parentDirName}.md`);
    }
    return {
      sourcePath: path.join(DOCS_ROOT, relativePath),
      destinationRelative,
    };
  });

  const topDirs = new Set(
    mappings
      .map(m => m.destinationRelative.replace(/\\/g, '/'))
      .filter(rel => rel.includes('/'))
      .map(rel => rel.split('/')[0])
  );
  const topLevelFiles = new Set(
    mappings
      .map(m => m.destinationRelative.replace(/\\/g, '/'))
      .filter(rel => !rel.includes('/'))
      .map(rel => 'public/' + rel)
  );
  const ignoreCandidates = Array.from(
    new Set([
      ...Array.from(topDirs).map(dir => 'public/' + dir),
      ...Array.from(topLevelFiles),
    ])
  );
  let gitignore = '';
  try {
    gitignore = await readFile(path.join(process.cwd(), '.gitignore'), 'utf8');
  } catch {}
  const existingLines = new Set(
    gitignore
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
  );
  const toAppend = ignoreCandidates.filter(line => !existingLines.has(line));
  if (toAppend.length > 0) {
    const updated =
      gitignore +
      (gitignore.endsWith('\n') || gitignore.length === 0 ? '' : '\n') +
      toAppend.join('\n') +
      '\n';
    await writeFile(path.join(process.cwd(), '.gitignore'), updated, 'utf8');
  }

  await Promise.all(
    mappings.map(async m => {
      const destinationPath = path.join(OUT_ROOT, m.destinationRelative);
      await ensureDirectoryExists(path.dirname(destinationPath));
      await copyFile(m.sourcePath, destinationPath);
    })
  );
}

main();
