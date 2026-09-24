/**
 * Deterministic llms.txt / llms-full.txt generator (build-time, no API calls).
 *
 * Follows the llmstxt.org v2 proposal: llms.txt is a curated map of the
 * documentation — one H2 section per top-level docs area, one link per
 * public page, every link pointing to the markdown version of the page
 * (same URL with a `.md` extension, produced by `rawmdx:export`). llms-full.txt
 * concatenates the cleaned content of every listed page.
 *
 * Determinism rules: no network, no LLM, no timestamps — identical inputs
 * always produce identical outputs, so the files can be regenerated at
 * every build without review.
 */
import path from 'node:path';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { parseFrontmatter } from '@/lib/content/parse-metadata';
import { isDocsRouteHidden } from '@/lib/content/hidden';

const ROOT = process.cwd();
const DOCS_ROOT = path.join(ROOT, 'src', 'content', 'en', 'docs');
const OUT_DIR = path.join(ROOT, 'public');
const BASE_URL = 'https://docs.mistral.ai';

// Parity with the previous generator: these trees are not part of the map.
const EXCLUDED_PATH_TOKENS = ['changelog', 'stories', 'story', 'robots'];

interface PageEntry {
  title: string;
  description: string;
  url: string;
  section: string;
  content: string;
}

function isRoutablePage(relativePath: string): boolean {
  const parts = relativePath.split(path.sep);
  if (parts[parts.length - 1] !== 'page.mdx') return false;
  for (const part of parts.slice(0, -1)) {
    if (part.startsWith('_')) return false;
    if (part.startsWith('[') && part.endsWith(']')) return false;
  }
  const route = path.dirname(relativePath).split(path.sep).join('/');
  if (isDocsRouteHidden(route)) return false;
  return !EXCLUDED_PATH_TOKENS.some(token => route.toLowerCase().includes(token));
}

async function listPages(dir: string, base: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listPages(full, base)));
    } else if (entry.isFile() && entry.name === 'page.mdx') {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

/** Title-case a kebab-case folder name: "getting-started" -> "Getting started". */
function sectionLabel(folder: string): string {
  const ACRONYMS = new Set(['api', 'rbac', 'sso', 'mcp', 'sdk']);
  return folder
    .split('-')
    .map(word =>
      ACRONYMS.has(word)
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
}

function firstBodyParagraph(body: string): string {
  const stripped = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{4,}.*$/gm, '');
  const lines = stripped.split('\n');
  for (const line of lines) {
    const text = line.trim();
    if (!text) continue;
    if (text.startsWith('#')) continue;
    if (text.startsWith(':::')) continue;
    if (text.startsWith('{/*')) continue;
    if (text.startsWith('|') || text.startsWith('-')) continue;
    return text;
  }
  return '';
}

function cleanDescription(text: string): string {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  const sentence = collapsed.split(/(?<=[.!?]) (?=[A-Z0-9])/)[0] ?? collapsed;
  const trimmed = sentence.replace(/["`*]/g, '').trim();
  return trimmed.length > 220 ? `${trimmed.slice(0, 217)}...` : trimmed;
}

function cleanFullContent(body: string): string {
  return body
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

async function buildEntries(): Promise<PageEntry[]> {
  const relativePaths = (await listPages(DOCS_ROOT, DOCS_ROOT))
    .filter(isRoutablePage)
    .sort();

  const entries: PageEntry[] = [];
  for (const relativePath of relativePaths) {
    const source = await readFile(path.join(DOCS_ROOT, relativePath), 'utf8');
    const { metadata, content } = parseFrontmatter(source);

    const slug = path
      .dirname(relativePath)
      .split(path.sep)
      .join('/');
    const url = `${BASE_URL}/${slug}.md`;
    const folder = slug.includes('/') ? slug.split('/')[0] : slug;
    const section = sectionLabel(folder);

    const firstHeading = content.match(/^#\s+(.+)$/m);
    const title =
      (typeof metadata?.title === 'string' && metadata.title.trim()) ||
      firstHeading?.[1]?.trim() ||
      sectionLabel(path.basename(slug));

    const rawDescription =
      (typeof metadata?.description === 'string' && metadata.description) ||
      firstBodyParagraph(content);
    const description = cleanDescription(rawDescription);

    entries.push({
      title,
      description,
      url,
      section,
      content: cleanFullContent(content),
    });
  }
  return entries;
}

async function writeLlmsTxt(entries: PageEntry[]): Promise<void> {
  const sections = new Map<string, PageEntry[]>();
  for (const entry of entries) {
    const list = sections.get(entry.section) ?? [];
    list.push(entry);
    sections.set(entry.section, list);
  }

  const lines: string[] = [
    '# Mistral AI',
    '',
    '> Developer documentation for the Mistral AI platform: API references, product guides, and quickstarts for Le Chat, Vibe, Mistral AI Studio, and the Mistral API.',
    '',
    'Every link points to the markdown version of a page (same URL with a `.md` extension), served for LLM consumption. Fetch the page URL without the extension for the rendered HTML version.',
    '',
  ];

  for (const section of Array.from(sections.keys()).sort()) {
    lines.push(`## ${section}`, '');
    for (const entry of sections.get(section)!) {
      lines.push(
        `- [${entry.title}](${entry.url}): ${entry.description}`
      );
    }
    lines.push('');
  }

  lines.push(
    '## Optional',
    '',
    `- [Full documentation as a single file](${BASE_URL}/llms-full.txt): every page listed above concatenated, for offline context loading`,
    `- [OpenAPI specification](${BASE_URL}/openapi.yaml): the public machine-readable Mistral API specification`,
    ''
  );

  await writeFile(path.join(OUT_DIR, 'llms.txt'), lines.join('\n'), 'utf8');
}

async function writeLlmsFullTxt(entries: PageEntry[]): Promise<void> {
  const parts: string[] = [
    '# Mistral AI — full documentation',
    '',
    `Concatenation of every public documentation page. Individual pages are also available as markdown at their URL with a \`.md\` extension; see ${BASE_URL}/llms.txt for the index.`,
    '',
  ];
  for (const entry of entries) {
    parts.push(`[${entry.title}]`);
    parts.push(`Source: ${entry.url}`);
    parts.push('');
    parts.push(entry.content);
    parts.push('', '');
  }
  await writeFile(
    path.join(OUT_DIR, 'llms-full.txt'),
    parts.join('\n'),
    'utf8'
  );
}

async function main(): Promise<void> {
  const start = Date.now();
  await mkdir(OUT_DIR, { recursive: true });
  const entries = await buildEntries();
  if (entries.length === 0) {
    throw new Error('No documentation pages found — refusing to write empty llms files');
  }
  await writeLlmsTxt(entries);
  await writeLlmsFullTxt(entries);
  console.log(
    `✓ llms.txt (${entries.length} pages) and llms-full.txt generated in ${Date.now() - start}ms`
  );
}

main();
