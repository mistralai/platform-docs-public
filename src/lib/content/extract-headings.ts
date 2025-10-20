import { TocItem } from '@/schema';
import { remark } from 'remark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdx from 'remark-mdx';
import { visitParents } from 'unist-util-visit-parents';
import { visit } from 'unist-util-visit';
import { getHeadingText, slugify, uniqueHeadingId } from '@/lib/heading-utils';

type ExtractHeadingsFromContentOptions = {
  type?: 'headings' | 'section-tabs';
  log?: boolean;
  path?: string;
};

const baseExtractOptions: ExtractHeadingsFromContentOptions = {
  type: 'section-tabs',
  log: false,
  path: '',
};

export function extractHeadingsFromContent(
  content: string,
  options?: ExtractHeadingsFromContentOptions
): TocItem[] {
  const { type, log, path } = { ...baseExtractOptions, ...options };
  const headings: TocItem[] = [];

  try {
    const usedIds = new Set<string>();

    // Extract regular headings
    switch (type) {
      case 'headings':
        const tree = remark().parse(content);
        visit(tree, 'heading', (node: any) => {
          const depth = node.depth;
          const value = getHeadingText(node);
          if (value) {
            const id = uniqueHeadingId(value, usedIds);
            headings.push({ value, depth, id });
          }
        });
        break;
      case 'section-tabs':
        try {
          const extractedHeadings = extractSectionTabs(content, { path });
          headings.push(...extractedHeadings);
        } catch (mdxError) {
          console.warn('MDX parsing failed for SectionTabs:', mdxError);
        }
        break;
    }
  } catch (error) {
    console.warn('Failed to parse markdown for heading extraction:', error);
    return [];
  }

  return headings;
}

function extractTextFromChildren(children: any[]): string {
  return children
    .map((child: any) => {
      if (child.type === 'text') {
        return child.value;
      } else if (child.type === 'paragraph' && child.children) {
        return extractTextFromChildren(child.children);
      } else if (child.type === 'mdxJsxTextElement' && child.children) {
        return extractTextFromChildren(child.children);
      } else if (child.type === 'mdxTextExpression') {
        return child.value || '';
      }
      return '';
    })
    .join('');
}

export type ExtractHeadingsFromDOMOptions = {
  prefix?: string;
};

const baseOptions: ExtractHeadingsFromDOMOptions = {
  prefix: '[data-page-content]',
};

export function extractHeadingsFromDOM(
  options?: ExtractHeadingsFromDOMOptions
): TocItem[] {
  const { prefix } = { ...baseOptions, ...options };
  const headings = document.querySelectorAll(
    `${prefix} h1, ${prefix} h2, ${prefix} h3, ${prefix} h4, ${prefix} h5, ${prefix} h6`
  );

  const toc: TocItem[] = [];

  headings.forEach(heading => {
    const tagName = heading.tagName.toLowerCase();
    const depth = parseInt(tagName.charAt(1));
    const value = heading.textContent?.trim() || '';
    let id = heading.id; // Prefer existing id from plugin/render

    if (!id && value) {
      id = slugify(value); // Fallback to shared slugify if no id
      heading.id = id; // Set it if missing (though plugin should set it)
    }

    if (value) {
      toc.push({
        value,
        depth,
        id,
      });
    }
  });

  return toc;
}

type Heading = { value: string; depth: number; id: string };

function getAttr(attrs: any[] | undefined, name: string) {
  if (!Array.isArray(attrs)) return undefined;
  const found = attrs.find((a: any) => a?.name === name);
  return typeof found?.value === 'string' ? found.value : undefined;
}

function isMdxJsx(node: any) {
  return (
    node?.type === 'mdxJsxFlowElement' || node?.type === 'mdxJsxTextElement'
  );
}
function isSectionTab(node: any) {
  return isMdxJsx(node) && node?.name === 'SectionTab';
}
function isNestedInsideAnyJsx(ancestors: any[]) {
  return ancestors?.some?.(a => isMdxJsx(a));
}

// Optional: if you’d rather not add acorn-typescript, strip TS from ESM first.
function stripTsFromEsm(src: string) {
  return (
    src
      // drop "import type { X } from 'y'"
      .replace(/^\s*import\s+type\s+[^;]+;?\s*$/gm, '')
      // turn "export const foo: Foo = " into "export const foo = "
      .replace(
        /export\s+const\s+([A-Za-z_$][\w$]*)\s*:\s*[^=]+=/g,
        'export const $1 = '
      )
  );
}

export function extractSectionTabs(
  content: string,
  { allowTypeScript = true, log = false, path = '' } = {}
) {
  const usedIds = new Set<string>();
  const headings: Heading[] = [];

  const src = allowTypeScript ? content : stripTsFromEsm(content);
  try {
    const processor = makeProcessor();

    const tree = processor.parse(src);
    if (log) console.log('mdxTree', tree);

    visitParents(tree as any, (node: any, ancestors: any[]) => {
      if (!isSectionTab(node)) return;

      // Ignore SectionTab if wrapped inside any JSX (e.g., <Tabs>…)
      if (isNestedInsideAnyJsx(ancestors)) return;

      const attrs = Array.isArray(node.attributes) ? node.attributes : [];
      const sectionId = getAttr(attrs, 'sectionId');
      const as = getAttr(attrs, 'as'); // "h2" | "h3" | ...
      const depth = as && /^h[1-6]$/.test(as) ? parseInt(as.slice(1), 10) : 2;

      // Extract visible text (strips inner JSX)
      const value = (toString as any)(node)?.trim?.() ?? '';
      if (!value) return;

      const id = sectionId || uniqueHeadingId(value, usedIds);
      headings.push({ value, depth, id });
    });
  } catch (err: any) {
    console.warn(
      'MDX parsing failed for SectionTabs in ' + path + ':',
      err?.message || err
    );
    printContext(src, err?.position?.line, err?.position?.column);
    // Fallback: naive regex to avoid breaking the page build
    try {
      const re = /<SectionTab([^>]*)>([\s\S]*?)<\/SectionTab>/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(src))) {
        const attrs = m[1] || '';
        const text = (m[2] || '').replace(/<[^>]*>/g, '').trim();
        if (!text) continue;

        const sectionId = /sectionId=["']([^"']*)["']/.exec(attrs)?.[1] || null;
        const asMatch = /as=["']h([1-6])["']/.exec(attrs)?.[1];
        const depth = asMatch ? parseInt(asMatch, 10) : 2;

        const id = sectionId || uniqueHeadingId(text, usedIds);
        headings.push({ value: text, depth, id });
      }
    } catch {
      /* ignore */
    }
  }

  return headings;
}

const toString = (node: any) => {
  if (node.type === 'text') {
    return node.value;
  }
  if (node.children) {
    return node.children.map(toString).join('');
  }
  return '';
};

function printContext(src: string, line: number, column: number, context = 3) {
  const lines = src.split(/\r?\n/);
  const start = Math.max(0, line - 1 - context);
  const end = Math.min(lines.length, line - 1 + context);
  const gutterWidth = String(end + 1).length;

  for (let i = start; i <= end; i++) {
    const ln = String(i + 1).padStart(gutterWidth, ' ');
    const marker = i === line - 1 ? '>' : ' ';
    console.log(`${marker} ${ln} | ${lines[i]}`);
    if (i === line - 1) {
      const caret = ' '.repeat(column - 1);
      console.log(`  ${' '.repeat(gutterWidth)} | ${caret}^`);
    }
  }
}

function makeProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkMdx, {
      acornOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    });
}
