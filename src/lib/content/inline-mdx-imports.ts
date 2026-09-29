import path from 'path';
import { readFile } from 'fs/promises';

interface MdxImport {
  name: string;
  importPath: string;
  fullStatement: string;
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

export function removeAllImports(content: string): string {
  return content.replace(/^import\s+.*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '');
}

export function cleanupContent(content: string): string {
  let result = content.replace(/^\s*\n/gm, '\n');
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.trim();
  return result;
}

/**
 * Replace every imported MDX partial (`import Tab from './tab/_page.mdx'`
 * rendered as `<Tab />` or `<Tab></Tab>`) with the partial's own content,
 * recursively. Build scripts that read raw MDX (raw `.md` exports, llms.txt)
 * need this: without it, pages built from partials lose their content.
 */
export async function resolveAndInlineMdxImports(
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
    // A replacer function inserts the content verbatim: a string replacement
    // would interpret `$$`, `$&`, `$'`... found in code samples and outputs.
    result = result.replace(selfClosingRegex, () => importedContent);
    result = result.replace(openCloseRegex, () => importedContent);
  }
  return result;
}
