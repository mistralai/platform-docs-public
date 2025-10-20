import { visit } from 'unist-util-visit';
import path from 'node:path';

interface Options {
  basePrefix: string;
  slug: string;
  attachments?: Record<string, Record<string, string>>;
}

export function remarkCookbookImageBase({
  basePrefix,
  slug,
  attachments,
}: Options) {
  return (tree: any) => {
    visit(tree, 'image', (node: any) => {
      const url: string = node.url || '';
      if (!url) return;

      if (url.startsWith('attachment:')) {
        const attachmentKey = url.replace('attachment:', '');
        const attachment = attachments?.[attachmentKey];
        if (attachment) {
          const keys = Object.keys(attachment);
          const key = keys[0];
          if (key && attachment[key]) {
            node.url = `data:${key};base64,${attachment[key]}`;
            node.alt = attachmentKey;
          }
        }
        return;
      }

      if (
        url.startsWith('/') ||
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('data:')
      ) {
        return;
      }

      const joined = path.posix.normalize(`/cookbooks/${basePrefix}/${url}`);
      node.url = joined;
    });
  };
}
