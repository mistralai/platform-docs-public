import { visit } from 'unist-util-visit';
import matter from 'gray-matter';

export default function inlineFrontmatter() {
  return function transformer(tree: any) {
    let yamlValue = '';
    if (Array.isArray(tree.children)) {
      for (const node of tree.children) {
        if (node && node.type === 'yaml' && typeof node.value === 'string') {
          yamlValue = node.value;
          break;
        }
      }
    }

    const frontmatterData = yamlValue
      ? (() => {
          try {
            return matter(`---\n${yamlValue}\n---\n`).data ?? {};
          } catch {
            return {} as any;
          }
        })()
      : {};

    if (!frontmatterData || typeof frontmatterData !== 'object') return;

    visit(tree, 'mdxTextExpression', (node: any) => {
      if (!node || typeof node.value !== 'string') return;
      const match = node.value.trim().match(/^frontmatter\.(.+)$/);
      if (!match) return;
      const path = match[1].trim();
      if (!path) return;
      const keys = path.split('.');
      let current: any = frontmatterData;
      for (const key of keys) {
        if (current && Object.prototype.hasOwnProperty.call(current, key)) {
          current = current[key];
        } else {
          current = undefined;
          break;
        }
      }
      if (
        current === undefined ||
        current === null ||
        typeof current === 'object' ||
        typeof current === 'function'
      ) {
        return;
      }
      node.type = 'text';
      node.value = String(current);
    });
  };
}
