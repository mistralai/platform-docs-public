import path from 'path';
import { readdir, mkdir, readFile, writeFile, unlink, rm } from 'fs/promises';
import { isDocsRouteHidden } from '@/lib/content/hidden';

const DOCS_ROOT = path.join(process.cwd(), 'src', 'content', 'en', 'docs');
const OUT_ROOT = path.join(process.cwd(), 'public');

interface MdxImport {
  name: string;
  importPath: string;
  fullStatement: string;
}

async function ensureDirectoryExists(directoryPath: string): Promise<void> {
  await mkdir(directoryPath, { recursive: true });
}

/**
 * Delete every `.md` file under `public/` that this run does not regenerate.
 * All `.md` files under `public/` are raw exports — nothing else writes there
 * — so a full sweep keeps renamed or deleted pages from leaving stale files
 * behind on the live site.
 */
async function pruneOrphanExports(destinations: Set<string>): Promise<void> {
  const stale: string[] = [];

  async function sweep(dir: string): Promise<void> {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const fullPath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        await sweep(fullPath);
      } else if (dirent.isFile() && dirent.name.toLowerCase().endsWith('.md')) {
        const relative = path
          .relative(OUT_ROOT, fullPath)
          .split(path.sep)
          .join('/');
        if (!destinations.has(relative)) stale.push(fullPath);
      }
    }
  }

  try {
    await sweep(OUT_ROOT);
  } catch {
    return;
  }

  await Promise.all(
    stale.map(async filePath => {
      await unlink(filePath);
      // Remove now-empty directories left behind by pruned exports.
      try {
        let dir = path.dirname(filePath);
        while (dir.startsWith(OUT_ROOT) && dir !== OUT_ROOT) {
          const entries = await readdir(dir);
          if (entries.length > 0) break;
          await rm(dir, { recursive: true });
          dir = path.dirname(dir);
        }
      } catch {
        // Concurrent prunes can remove the same parent directory first.
      }
    })
  );
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

function parseMdxImports(content: string): MdxImport[] {
  const imports: MdxImport[] = [];
  const importRegex =
    /^import\s+(\w+)\s+from\s+['"]([^'"]+\.mdx)['"]\s*;?\s*$/gm;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push({
      name: match[1],
      importPath: match[2],
      fullStatement: match[0],
    });
  }
  return imports;
}

function removeAllImports(content: string): string {
  return content.replace(/^import\s+.*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '');
}

function cleanupContent(content: string): string {
  let result = content.replace(/^\s*\n/gm, '\n');
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.trim();
  return result;
}

async function resolveAndInlineMdxImports(
  content: string,
  currentFileDir: string,
  visited: Set<string> = new Set()
): Promise<string> {
  const mdxImports = parseMdxImports(content);
  if (mdxImports.length === 0) {
    return content;
  }
  let result = content;
  for (const imp of mdxImports) {
    const resolvedPath = path.resolve(currentFileDir, imp.importPath);
    if (visited.has(resolvedPath)) {
      result = result.replace(imp.fullStatement, '');
      continue;
    }
    visited.add(resolvedPath);
    let importedContent = '';
    try {
      importedContent = await readFile(resolvedPath, 'utf8');
    } catch {
      result = result.replace(imp.fullStatement, '');
      continue;
    }
    const importedDir = path.dirname(resolvedPath);
    importedContent = await resolveAndInlineMdxImports(
      importedContent,
      importedDir,
      visited
    );
    importedContent = removeAllImports(importedContent);
    importedContent = cleanupContent(importedContent);
    result = result.replace(imp.fullStatement, '');
    const selfClosingRegex = new RegExp(`<${imp.name}\\s*/>`, 'g');
    const openCloseRegex = new RegExp(
      `<${imp.name}\\s*>\\s*</${imp.name}>`,
      'g'
    );
    result = result.replace(selfClosingRegex, importedContent);
    result = result.replace(openCloseRegex, importedContent);
  }
  return result;
}

async function processFile(sourcePath: string): Promise<string> {
  const content = await readFile(sourcePath, 'utf8');
  const sourceDir = path.dirname(sourcePath);
  let processed = await resolveAndInlineMdxImports(content, sourceDir);
  processed = removeAllImports(processed);
  processed = cleanupContent(processed);
  return processed;
}

async function main(): Promise<void> {
  await ensureDirectoryExists(OUT_ROOT);
  let mdxFiles: string[] = [];
  try {
    mdxFiles = await listMdxFiles(DOCS_ROOT, DOCS_ROOT);
  } catch {
    mdxFiles = [];
  }
  const mappings = mdxFiles
    .filter(relativePath => {
      const baseLower = path.basename(relativePath).toLowerCase();
      const route = path.dirname(relativePath).replace(/\\/g, '/');
      const parts = route.split('/');
      // Mirror the site's route collector: pages under `_`-prefixed or
      // dynamic (`[slug]`) directories are not publicly routable, so they
      // must not get a public `.md` export either.
      const routable = parts.every(
        part => !part.startsWith('_') && !(part.startsWith('[') && part.endsWith(']'))
      );
      return (
        baseLower === 'page.mdx' && routable && !isDocsRouteHidden(route)
      );
    })
    .map(relativePath => {
      const parsed = path.parse(relativePath);
      const parentDirName = path.basename(parsed.dir);
      const parentParentDir = path.dirname(parsed.dir);
      const destinationRelative = path.join(
        parentParentDir,
        `${parentDirName}.md`
      );
      return {
        sourcePath: path.join(DOCS_ROOT, relativePath),
        destinationRelative,
      };
    });

  // Prune stale exports: every `.md` under `public/` is an export of this
  // run (nothing else writes there), so remove the ones this run does not
  // regenerate — renamed or deleted pages leave no orphan behind.
  const destinations = new Set(
    mappings.map(m => m.destinationRelative.replace(/\\/g, '/'))
  );
  await pruneOrphanExports(destinations);

  await Promise.all(
    mappings.map(async m => {
      const destinationPath = path.join(OUT_ROOT, m.destinationRelative);
      await ensureDirectoryExists(path.dirname(destinationPath));
      const processedContent = await processFile(m.sourcePath);
      await writeFile(destinationPath, processedContent, 'utf8');
    })
  );
}

main();
