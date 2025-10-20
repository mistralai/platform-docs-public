import remarkHeadingId from 'remark-heading-id';

export { remarkHeadingId };
export default remarkHeadingId;
// @legacy
// import { visit } from 'unist-util-visit';
// import { getHeadingText, uniqueHeadingId } from '../heading-utils';

// export function remarkHeadingId() {
//   return (tree: any) => {
//     if (!tree) {
//       console.error('[remark-heading-id] Error: Tree is undefined');
//       return;
//     }

//     // Almacenar IDs usados dentro de este archivo
//     const usedIds = new Set<string>();

//     // Visitar todos los nodos de tipo heading
//     visit(tree, 'heading', (node: any) => {
//       if (!node || typeof node.depth !== 'number') {
//         console.warn('[remark-heading-id] Warning: Invalid heading node', node);
//         return;
//       }

//       const text = getHeadingText(node);
//       if (!text) {
//         console.warn(
//           `[remark-heading-id] Warning: Empty text for heading at depth ${node.depth}`
//         );
//       }

//       const finalId = uniqueHeadingId(text, usedIds);

//       node.data = node.data || {};
//       node.data.hProperties = node.data.hProperties || {};
//       node.data.hProperties.id = finalId;
//       usedIds.add(finalId);
//     });
//   };
// }
// export default remarkHeadingId;
