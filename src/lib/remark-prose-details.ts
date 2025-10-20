import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const proseHeadingsClassNames =
  'prose-headings:first:mt-0 prose-h1:mt-[1.6em] prose-h1:mb-[0.6em] prose-h2:mt-[1.4em] prose-h2:mb-[0.5em] prose-h3:mt-[1.15em] prose-h3:mb-[0.4em] prose-h4:mt-[1em] prose-h4:mb-[0.35em] prose-h5:mt-[0.9em] prose-h5:mb-[0.3em] prose-h6:mt-[0.75em] prose-h6:mb-[0.25em]';

const proseDivisorClassNames = 'prose-hr:border-secondary-foreground';

const proseDetailsClassNames =
  '[&_details]:text-foreground/80 [&_details_+_h1]:mt-0';

const proseClassNames = [
  'prose prose-neutral max-w-none',
  proseHeadingsClassNames,
  proseDivisorClassNames,
  proseDetailsClassNames,
];

export const remarkDetailsClasses: Plugin = () => {
  return (tree: any) => {
    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name === 'details') {
        // Add Tailwind classes or whatever you want
        node.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'className',
          value: proseClassNames.join(' '),
        });
      }
    });
  };
};
