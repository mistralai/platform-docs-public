// remark-ensure-block-mdx.ts
import { visit, SKIP } from 'unist-util-visit';

type Options = { names?: string[] };

const DEFAULT_NAMES = ['SectionTab', 'SectionWrap'];

function isInlineTarget(n: any, names: Set<string>) {
  return n && n.type === 'mdxJsxTextElement' && names.has(n.name);
}

function promoteToFlow(node: any) {
  return { ...node, type: 'mdxJsxFlowElement' };
}

export function remarkEnsureBlockMdx(opts: Options = {}) {
  const NAME_SET = new Set(opts.names ?? DEFAULT_NAMES);

  return () => (tree: any) => {
    visit(
      tree,
      'paragraph',
      (para: any, index: number | undefined, parent: any) => {
        if (!parent || index == null) return;

        const children: any[] = Array.isArray(para.children)
          ? para.children
          : [];
        if (!children.some(c => isInlineTarget(c, NAME_SET))) return;

        const replacement: any[] = [];
        let buffer: any[] = [];

        const flush = () => {
          const trimmed = buffer.filter(
            c => !(c.type === 'text' && /^\s*$/.test(c?.value ?? ''))
          );
          if (trimmed.length)
            replacement.push({ type: 'paragraph', children: trimmed });
          buffer = [];
        };

        for (const child of children) {
          if (isInlineTarget(child, NAME_SET)) {
            flush();
            replacement.push(promoteToFlow(child));
          } else {
            buffer.push(child);
          }
        }
        flush();

        // Replace the original paragraph with the split paragraphs + flow components
        parent.children.splice(index, 1, ...replacement);

        // Don’t descend into (now replaced) node
        return SKIP;
      }
    );
  };
}

export default remarkEnsureBlockMdx;
