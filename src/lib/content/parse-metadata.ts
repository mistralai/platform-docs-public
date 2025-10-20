import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';

export function parseFrontmatter(content: string): {
  metadata: any;
  content: string;
} {
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ['yaml']);
    const tree: any = processor.parse(content);
    const yamlNode = Array.isArray(tree.children)
      ? tree.children.find((n: any) => n.type === 'yaml')
      : undefined;

    const metadata = yamlNode?.value
      ? (() => {
          try {
            const parsed = matter(`---\n${yamlNode.value}\n---\n`);
            return parsed.data ?? {};
          } catch {
            return {} as any;
          }
        })()
      : {};
    const body = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '');

    return { metadata, content: body };
  } catch {
    return { metadata: {}, content };
  }
}
