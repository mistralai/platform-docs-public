import { unified } from 'unified';
import type { PluggableList } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { admonitionDirective, remarkHeadingId } from '@/lib/frontmatter';
import { visit } from 'unist-util-visit';
import { slugify, uniqueHeadingId } from '../heading-utils';

export function getRemarkPluginsForReactMarkdown(): PluggableList {
  return [
    remarkFrontmatter,
    remarkGfm,
    remarkDirective,
    admonitionDirective,
    remarkHeadingId,
  ];
}

export function createBaseMdxProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkDirective)
    .use(admonitionDirective)
    .use(remarkGfm)
    .use(remarkHeadingId);
}

export function createMdxTextExtractorProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm)
    .use(remarkDirective)
    .use(admonitionDirective)
    .use(remarkHeadingId);
}

function getNodeText(node: any): string {
  if (!node.children) return '';
  return node.children
    .map((child: any) =>
      child.type === 'text' ? child.value : getNodeText(child)
    )
    .join('');
}

export function rehypeHeadingId() {
  return (tree: any) => {
    const used = new Set<string>();
    visit(tree, 'element', (node: any) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;

      const text = getNodeText(node);
      let slug = slugify(text);
      slug = uniqueHeadingId(slug, used);

      node.properties = node.properties || {};
      node.properties.id = slug;
      used.add(slug);
    });
  };
}
