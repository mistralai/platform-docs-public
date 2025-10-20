// lib/remark/admonitionDirective.ts
import { visit } from 'unist-util-visit';

const SUPPORTED = new Set([
  'info',
  'note',
  'tip',
  'caution',
  'warning',
  'danger',
  'success',
]);

export function admonitionDirective() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== 'containerDirective') return;
      const kind = String(node.name || '').toLowerCase();

      // allow aliases
      const normalized =
        kind === 'warn'
          ? 'warning'
          : kind === 'error'
          ? 'danger'
          : kind === 'title'
          ? 'note'
          : SUPPORTED.has(kind)
          ? kind
          : 'note';

      node.type = 'mdxJsxFlowElement';
      node.name = 'Admonition';

      // map directive attributes → props
      const attrs = node.attributes || {};
      const props: any[] = Object.keys(attrs).map(name => ({
        type: 'mdxJsxAttribute',
        name,
        value: String((attrs as any)[name]),
      }));

      // type prop
      props.push({ type: 'mdxJsxAttribute', name: 'type', value: normalized });

      // label → title prop (:::type[My Title])
      if (node.label) {
        props.push({
          type: 'mdxJsxAttribute',
          name: 'title',
          value: String(node.label),
        });
      }

      node.attributes = props;
      // node.children stays as the inner content
    });
  };
}
