/**
 * Table of Contents utilities for cookbook pages
 *
 * These utilities help generate table of contents for cookbook content,
 * supporting both markdown files and Jupyter notebooks.
 */

export interface TocItem {
  value: string;
  depth: number;
  id: string;
}

export interface TableOfContentsData {
  toc: TocItem[];
  headingIds: string[];
  filteredToc: TocItem[];
  shouldShow: boolean;
}

export interface TableOfContentsOptions {
  maxDepth?: number;
  minItems?: number;
}

/**
 * Extract headings from markdown content
 */
export function extractHeadingsFromMarkdown(content: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const depth = headingMatch[1].length;
      const value = headingMatch[2].trim();
      const id = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      headings.push({
        value,
        depth,
        id,
      });
    }
  }

  return headings;
}

/**
 * Extract headings from Jupyter notebook content
 */
export function extractHeadingsFromNotebook(
  notebookContent: string
): TocItem[] {
  try {
    const notebook = JSON.parse(notebookContent);
    const headings: TocItem[] = [];

    if (!notebook.cells) return headings;

    for (const cell of notebook.cells) {
      if (cell.cell_type === 'markdown' && cell.source) {
        const source = Array.isArray(cell.source)
          ? cell.source.join('')
          : cell.source;

        const cellHeadings = extractHeadingsFromMarkdown(source);
        headings.push(...cellHeadings);
      }
    }

    return headings;
  } catch (error) {
    console.warn('Failed to parse notebook for heading extraction:', error);
    return [];
  }
}

/**
 * Extract headings from DOM elements
 * Useful for client-side TOC generation after content is rendered
 */
export function extractHeadingsFromDOM(
  containerSelector: string = '[data-cookbook-content]'
): TocItem[] {
  if (typeof window === 'undefined') return [];

  const container = document.querySelector(containerSelector);
  if (!container) return [];

  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const toc: TocItem[] = [];

  headings.forEach(heading => {
    const tagName = heading.tagName.toLowerCase();
    const depth = parseInt(tagName.charAt(1));
    const value = heading.textContent || '';
    const id =
      heading.id ||
      value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

    // Set ID if not present
    if (!heading.id) {
      heading.id = id;
    }

    toc.push({
      value,
      depth,
      id,
    });
  });

  return toc;
}

/**
 * Generate table of contents data for cookbook content
 */
export function generateCookbookTableOfContents(
  content: string,
  isNotebook: boolean,
  options: TableOfContentsOptions = {}
): TableOfContentsData {
  const { maxDepth = 3, minItems = 1 } = options;

  // Extract headings based on content type
  const toc = isNotebook
    ? extractHeadingsFromNotebook(content)
    : extractHeadingsFromMarkdown(content);

  // Filter by max depth
  const filteredToc = toc.filter(item => item.depth <= maxDepth);

  // Generate heading IDs for active detection
  const headingIds = filteredToc.map(item => item.id);

  // Determine if TOC should be shown
  const shouldShow = filteredToc.length >= minItems;

  return {
    toc,
    headingIds,
    filteredToc,
    shouldShow,
  };
}

/**
 * Simple utility to create TOC data from existing TOC items
 */
export function createSimpleTocData(
  tocItems: TocItem[],
  options: TableOfContentsOptions = {}
): TableOfContentsData {
  const { maxDepth = 3, minItems = 1 } = options;

  const filteredToc = tocItems.filter(item => item.depth <= maxDepth);
  const headingIds = tocItems.map(item => item.id);

  return {
    toc: tocItems,
    headingIds,
    filteredToc,
    shouldShow: filteredToc.length >= minItems,
  };
}
