import path from 'path';
import { readdir, mkdir, readFile, writeFile } from 'fs/promises';

const DOCS_ROOT = path.join(process.cwd(), 'src', 'app', '(docs)');
const OUT_ROOT = path.join(process.cwd(), 'public');

interface MdxImport {
  name: string;
  importPath: string;
  fullStatement: string;
}

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
      return baseLower === 'page.mdx';
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
      const processedContent = await processFile(m.sourcePath);
      await writeFile(destinationPath, processedContent, 'utf8');
    })
  );
}

main();
