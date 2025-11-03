import { TocItem } from '@/schema';
import { slugify, uniqueHeadingId } from '@/lib/heading-utils';

// Function to generate TOC from markdown or IPython notebook content
function extractMarkdownText(content: string): string {
  if (Array.isArray(content)) {
    return content.join('');
  }
  return String(content || '');
}

function processLines(
  lines: string[],
  usedIds: Set<string>,
  ignoreH1: boolean = false
): TocItem[] {
  let h1Found = false;
  const toc: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (ignoreH1 && line.trim().startsWith('# ')) continue;
    if (!h1Found && line.trim().startsWith('# ')) {
      h1Found = true;
      continue;
    }
    if (ignoreH1 && h1Found) continue;
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    const headingMatch = line.match(/^\s*(#{1,6})\s+(.+?)\s*$/);
    if (headingMatch) {
      const depth = headingMatch[1].length;
      const value = headingMatch[2].trim();
      const slug = slugify(value);
      const id = uniqueHeadingId(slug, usedIds);
      toc.push({ id, value, depth });
    }
  }

  return toc;
}

export function generateCookbookToc(
  content: string | undefined | null,
  isNotebook: boolean,
  options: { ignoreH1?: boolean } = {}
): TocItem[] {
  if (!content) return [];

  const { ignoreH1 = true } = options;

  const usedIds = new Set<string>();

  try {
    if (isNotebook) {
      const notebook = JSON.parse(content);
      const allLines: string[] = [];

      for (const cell of notebook.cells || []) {
        if (cell.cell_type === 'markdown') {
          const source = extractMarkdownText(cell.source);
          allLines.push(...source.split(/\r?\n/));
        }
      }

      return processLines(allLines, usedIds, ignoreH1);
    } else {
      const lines = content.split(/\r?\n/);
      return processLines(lines, usedIds, ignoreH1);
    }
  } catch (error) {
    console.error('Error generating TOC:', error);
    return [];
  }
}
