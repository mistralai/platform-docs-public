import path from 'path';
import fs from 'fs/promises';

function stripFrontmatter(markdown: string): string {
  if (!markdown) return markdown;
  if (!markdown.startsWith('---')) return markdown;
  const endIndex = markdown.indexOf('\n---', 3);
  if (endIndex === -1) return markdown;
  const after = markdown.slice(endIndex + 4);
  return after.replace(/^\s*\n/, '');
}

function cleanInlineMarkdown(text: string): string {
  let t = text.trim();
  t = t.replace(/!\[[^\]]*\]\([^\)]*\)/g, '');
  t = t.replace(/\[[^\]]*\]\([^\)]*\)/g, '$1');
  t = t.replace(/[`*_~]/g, '');
  t = t.replace(/<[^>]+>/g, '');
  t = t.replace(/\s{2,}/g, ' ');
  return t.trim();
}

function extractH1FromNotebook(notebookJson: string): string | null {
  try {
    const nb = JSON.parse(notebookJson);
    const cells: any[] = Array.isArray(nb?.cells) ? nb.cells : [];
    for (const cell of cells) {
      if (cell?.cell_type === 'markdown') {
        const source = Array.isArray(cell.source)
          ? cell.source.join('')
          : typeof cell.source === 'string'
          ? cell.source
          : '';
        const title = extractH1FromMarkdown(source);
        if (title) return title;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function slugToTitle(slug: string): string {
  const pathWithoutExtension = slug.replace(/\.(ipynb|md)$/, '');
  const parts = pathWithoutExtension.split('/');

  let lastPart = parts[parts.length - 1];

  if (lastPart.toLowerCase() === 'readme') {
    lastPart = parts[parts.length - 2] || lastPart;
  }

  return lastPart
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
function isInCodeBlock(lines: string[], currentIndex: number): boolean {
  // Check if we're inside a code block (between ``` marks)
  let inCodeBlock = false;
  for (let i = 0; i <= currentIndex; i++) {
    if (lines[i].trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }
  }
  return inCodeBlock;
}
function extractTitleFromMarkdownContent(content: string): {
  title: string | null;
  contentWithoutTitle: string;
} {
  let title: string | null = null;
  const original = content;
  let bodyStartIndex = 0;

  if (original.startsWith('---')) {
    const endIndex = original.indexOf('\n---', 3);
    if (endIndex !== -1) bodyStartIndex = endIndex + 4;
  }

  const before = original.slice(0, bodyStartIndex);
  const body = original.slice(bodyStartIndex);
  const lines = body.split(/\r?\n/);

  // Find and remove title from content
  for (let i = 0; i < lines.length; i++) {
    if (isInCodeBlock(lines, i)) continue;

    // Check for HTML titles first
    const htmlTitle = cleanHtmlTitle(lines[i]);
    if (htmlTitle) {
      title = htmlTitle;
      lines.splice(i, 1);
      // Remove related HTML tags if they span multiple lines
      while (i > 0 && (lines[i-1].includes('<center') || lines[i-1].includes('<p'))) {
        lines.splice(i-1, 1);
        i--;
      }
      while (i < lines.length && lines[i].includes('</center') || lines[i].includes('</p')) {
        lines.splice(i, 1);
      }
      break;
    }

    // Check for markdown headings
    const atxMatch = lines[i].match(/^\s{0,3}[#]{1,2}\s+(.+?)(\s+#+\s*)?$/);
    if (atxMatch && atxMatch[1]) {
      title = cleanInlineMarkdown(atxMatch[1]);
      const removeCount = 1 + (lines[i + 1] !== undefined && lines[i + 1].trim() === '' ? 1 : 0);
      lines.splice(i, removeCount);
      break;
    }

    // Check for setext-style headings
    if (i < lines.length - 1) {
      const textLine = lines[i];
      const underline = lines[i + 1];
      if (/^\s{0,3}={2,}\s*$/.test(underline) && textLine.trim().length > 0) {
        title = cleanInlineMarkdown(textLine);
        const removeCount = 2 + (lines[i + 2] !== undefined && lines[i + 2].trim() === '' ? 1 : 0);
        lines.splice(i, removeCount);
        break;
      }
    }
  }

  const contentWithoutTitle = before + lines.join('\n');
  return { title, contentWithoutTitle };
}

function cleanHtmlTitle(html: string): string | null {
  // Match <h1> tags and extract content
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    return cleanInlineMarkdown(h1Match[1]);
  }

  // Match common center-aligned title patterns
  const centerTitleMatch = html.match(
    /<(center|p\s+[^>]*align=["']?center["']?[^>]*)>.*?<h1[^>]*>(.*?)<\/h1>.*?<\/\1>/i
  );
  if (centerTitleMatch && centerTitleMatch[2]) {
    return cleanInlineMarkdown(centerTitleMatch[2]);
  }

  // Match simple paragraph titles
  const pTitleMatch = html.match(
    /<p[^>]*>(.*?)<\/p>/i
  );
  if (pTitleMatch) {
    const content = cleanInlineMarkdown(pTitleMatch[1]);
    // Only return if it looks like a title (not too long, no multiple sentences)
    if (content.split(' ').length < 10 && !/[.!?]/.test(content)) {
      return content;
    }
  }

  return null;
}

function extractH1FromMarkdown(markdown: string): string | null {
  if (!markdown) return null;

  // First try HTML titles
  const htmlTitle = cleanHtmlTitle(markdown);
  if (htmlTitle) return htmlTitle;

  const withoutFm = stripFrontmatter(markdown);
  const lines = withoutFm.split(/\r?\n/);

  // Then try markdown headings (existing logic)
  for (let i = 0; i < lines.length; i++) {
    if (isInCodeBlock(lines, i)) continue;

    const atxMatch = lines[i].match(/^\s{0,3}#\s+(.+?)(\s+#+\s*)?$/);
    if (atxMatch && atxMatch[1]) {
      return cleanInlineMarkdown(atxMatch[1]);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (isInCodeBlock(lines, i)) continue;

    const atxMatch = lines[i].match(/^\s{0,3}##\s+(.+?)(\s+#+\s*)?$/);
    if (atxMatch && atxMatch[1]) {
      return cleanInlineMarkdown(atxMatch[1]);
    }
  }

  for (let i = 0; i < lines.length - 1; i++) {
    if (isInCodeBlock(lines, i)) continue;

    const textLine = lines[i];
    const underline = lines[i + 1];
    if (/^\s{0,3}={2,}\s*$/.test(underline) && textLine.trim().length > 0) {
      return cleanInlineMarkdown(textLine);
    }
  }

  return null;
}
function extractTitleFromNotebookContent(content: string): {
  title: string | null;
  contentWithoutTitle: string;
} {
  try {
    const nb = JSON.parse(content);
    const cells: any[] = Array.isArray(nb?.cells) ? nb.cells : [];
    let title: string | null = null;

    for (let i = 0; i < cells.length && !title; i++) {
      const cell = cells[i];
      if (cell?.cell_type === 'markdown') {
        const source = Array.isArray(cell.source)
          ? cell.source.join('')
          : typeof cell.source === 'string'
          ? cell.source
          : '';

        // Try to extract and remove title from this cell
        const htmlTitle = cleanHtmlTitle(source);
        if (htmlTitle) {
          title = htmlTitle;
          // Remove the entire cell containing HTML title
          cells.splice(i, 1);
          i--; // Adjust index after removal
          continue;
        }

        const lines = source.split(/\r?\n/);
        let cellModified = false;

        for (let j = 0; j < lines.length; j++) {
          if (isInCodeBlock(lines, j)) continue;

          // Check for markdown headings
          const atxMatch = lines[j].match(/^\s{0,3}[#]{1,2}\s+(.+?)(\s+#+\s*)?$/);
          if (atxMatch && atxMatch[1]) {
            title = cleanInlineMarkdown(atxMatch[1]);
            const removeCount = 1 + (lines[j + 1] !== undefined && lines[j + 1].trim() === '' ? 1 : 0);
            lines.splice(j, removeCount);
            cellModified = true;
            break;
          }

          // Check for setext-style headings
          if (j < lines.length - 1) {
            const textLine = lines[j];
            const underline = lines[j + 1];
            if (/^\s{0,3}={2,}\s*$/.test(underline) && textLine.trim().length > 0) {
              title = cleanInlineMarkdown(textLine);
              const removeCount = 2 + (lines[j + 2] !== undefined && lines[j + 2].trim() === '' ? 1 : 0);
              lines.splice(j, removeCount);
              cellModified = true;
              break;
            }
          }
        }

        if (cellModified) {
          const newSource = lines.join('\n');
          if (Array.isArray(cell.source)) {
            cell.source = newSource.split('\n').map((line: string) => line + '\n');
            if (cell.source.length > 0) {
              cell.source[cell.source.length - 1] = cell.source[cell.source.length - 1].replace(/\n$/, '');
            }
          } else {
            cell.source = newSource;
          }

          // Remove cell if empty after title removal
          if (!newSource.trim()) {
            cells.splice(i, 1);
            i--; // Adjust index after removal
          }
        }
      }
    }

    const contentWithoutTitle = JSON.stringify({ ...nb, cells }, null, 2);
    return {
      title: title || extractH1FromNotebook(content),
      contentWithoutTitle,
    };
  } catch {
    return {
      title: extractH1FromNotebook(content),
      contentWithoutTitle: content,
    };
  }
}

function extractTitleFromContent(
  content: string | null,
  p: string
): {
  title: string | null;
  contentWithoutTitle: string | null;
  titleFromSlug: string | null;
} {
  if (!content)
    return { title: null, contentWithoutTitle: null, titleFromSlug: null };

  const titleFromSlug = slugToTitle(p);
  const isNotebook = p.endsWith('.ipynb');

  const result = isNotebook
    ? extractTitleFromNotebookContent(content)
    : extractTitleFromMarkdownContent(content);

  return {
    title: result.title,
    contentWithoutTitle: result.contentWithoutTitle,
    titleFromSlug,
  };
}

/**
 * Get the content of a cookbook file
 * @param p - The path to the cookbook file
 * @param options - The options for the content
 * @param options.withTitle - Whether to include the title in the content
 * @returns The content of the cookbook file
 */

const defaultOptions = {
  withTitle: true,
};

export const getCookbookContent = async (
  p: string,
  options?: typeof defaultOptions
) => {
  const { withTitle } = { ...defaultOptions, ...options };
  try {
    const filePath = path.join(process.cwd(), 'static', 'cookbooks', p);
    const content = await fs.readFile(filePath, 'utf-8');

    if (withTitle) {
      return content;
    }
    const { contentWithoutTitle } = extractTitleFromContent(content, p);
    return contentWithoutTitle;
  } catch (error) {
    console.warn(`Failed to read file ${p}:`, error);
    return null;
  }
};

export const getCookbookContentWithTitle = async (p: string) => {
  try {
    const filePath = path.join(process.cwd(), 'static', 'cookbooks', p);
    const content = await fs.readFile(filePath, 'utf-8');
    const titleInfo = extractTitleFromContent(content, p);
    return {
      content,
      ...titleInfo,
    };
  } catch (error) {
    console.warn(`Failed to read file ${p}:`, error);
    return {
      content: null,
      title: null,
      contentWithoutTitle: null,
      titleFromSlug: null,
    };
  }
};
