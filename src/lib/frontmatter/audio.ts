import { visit } from 'unist-util-visit';

export function remarkAudioToComponent() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === 'mdxJsxFlowElement' && node.name === 'audio') {
        node.name = 'Audio';
      }
    });
  };
}
