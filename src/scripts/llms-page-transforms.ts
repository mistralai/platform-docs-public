/**
 * Turns an MDX page's source into Markdown an LLM can use: data components
 * become the text they render, section tabs become headings, and links that
 * the site redirects point at their destination.
 */
import { redirects } from '../../redirect';
import { models, type Model } from '@/schema/models';
import { glossaryMarkdown, modelTable, releaseNotesMarkdown, type Lingo } from './llms-generated-pages';

const BASE_URL = 'https://docs.mistral.ai';

/** The model slugs a `slugs={...}` prop names: a literal list, or a filter on model type. */
function modelsFromSlugsProp(props: string): Model[] | undefined {
  const literal = props.match(/slugs=\{\s*\[([^\]]*)\]\s*\}/);
  if (literal) {
    const slugs = Array.from(literal[1].matchAll(/['"]([^'"]+)['"]/g), match => match[1]);
    return slugs.map(slug => models.find(model => model.slug === slug)).filter((model): model is Model => model !== undefined);
  }
  const byType = props.match(/model\.type\s*===\s*['"]([^'"]+)['"]/);
  return byType ? models.filter(model => model.type === byType[1]) : undefined;
}

type DataComponent = (props: string, l: Lingo) => string | undefined;

const DATA_COMPONENTS: Record<string, DataComponent> = {
  ReleaseNotesPage: () => releaseNotesMarkdown(),
  InteractiveGlossary: (_, l) => glossaryMarkdown(l),
  ModelCardsBySlug: (props, l) => {
    const rows = modelsFromSlugsProp(props);
    return rows && modelTable(rows, l);
  },
  ModelTable: (props, l) => {
    const rows = modelsFromSlugsProp(props);
    return rows && modelTable(rows, l);
  },
};

// Props can hold arrow functions, so a tag runs to the first `/>`, not the first `>`.
const DATA_COMPONENT_TAG = new RegExp(`<(${Object.keys(DATA_COMPONENTS).join('|')})\\b([\\s\\S]*?)\\/>`, 'g');

/** Replaces each self-closing data component with the Markdown it renders. */
export function expandDataComponents(content: string, l: Lingo): string {
  return content.replace(DATA_COMPONENT_TAG, (tag, name: string, props: string) => {
    const markdown = DATA_COMPONENTS[name](props, l);
    if (markdown === undefined) {
      console.warn(`llms: left <${name}> unexpanded, its props are not understood: ${props.trim()}`);
      return tag;
    }
    return markdown;
  });
}

/** The heading level `SectionTab` renders, mirroring its own `semanticAs`. */
function sectionTabLevel(attributes: string): number {
  const as = attributes.match(/\bas="h([1-6])"/)?.[1] ?? '2';
  const secondary = /\bvariant="secondary"/.test(attributes);
  if (secondary && (as === '1' || as === '2')) return 3;
  return as === '1' ? 2 : Number(as);
}

/** Turns each `<SectionTab>` that stands on its own lines into a Markdown heading. */
export function sectionTabsToHeadings(content: string): string {
  return content.replace(
    /^[ \t]*<SectionTab\b([^>]*)>([\s\S]*?)<\/SectionTab>[ \t]*$/gm,
    (_, attributes: string, children: string) => {
      const text = children.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      return text ? `${'#'.repeat(sectionTabLevel(attributes))} ${text}` : '';
    }
  );
}

interface CompiledRedirect {
  pattern: RegExp;
  params: string[];
  destination: string;
}

function compileRedirect(source: string, destination: string): CompiledRedirect {
  const params: string[] = [];
  const pattern = source
    .split('/')
    .map(segment => {
      const param = segment.match(/^:(\w+)(\*)?$/);
      if (!param) return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      params.push(param[1]);
      return param[2] ? '(.*)' : '([^/]+)';
    })
    .join('/')
    // `/:path*` also matches the bare prefix.
    .replace(/\/\(\.\*\)$/, '(?:/(.*))?');
  return { pattern: new RegExp(`^${pattern}$`), params, destination };
}

const COMPILED_REDIRECTS = redirects
  .filter(rule => rule.source.startsWith('/') && !('has' in rule) && !('missing' in rule))
  .map(rule => compileRedirect(rule.source, rule.destination));

/** Where the site sends a path, following chained redirects. */
export function resolveRedirects(pathname: string): string {
  let current = pathname;
  for (let hop = 0; hop < 5; hop++) {
    const rule = COMPILED_REDIRECTS.find(candidate => candidate.pattern.test(current));
    if (!rule) return current;
    const match = current.match(rule.pattern)!;
    let destination = rule.destination;
    rule.params.forEach((param, index) => {
      const value = match[index + 1] ?? '';
      destination = destination.replace(new RegExp(`/?:${param}\\*?`), value ? `/${value}` : '');
    });
    if (destination === current) return current;
    current = destination;
  }
  return current;
}

/** Points Markdown links and `href` props on the docs site at their redirect destination. */
export function rewriteRedirectedLinks(content: string): string {
  const rewrite = (prefix: string, host: string | undefined, pathname: string, suffix: string) =>
    `${prefix}${host ?? ''}${resolveRedirects(pathname)}${suffix}`;
  const docsHost = BASE_URL.replace(/[.]/g, '\\.');
  const target = `(${docsHost})?(\\/[^\\s)"'#?]*)([#?][^\\s)"']*)?`;
  return content
    .replace(new RegExp(`(\\]\\()${target}`, 'g'), (_, prefix, host, pathname, suffix = '') =>
      rewrite(prefix, host, pathname, suffix)
    )
    .replace(new RegExp(`(href=["'])${target}`, 'g'), (_, prefix, host, pathname, suffix = '') =>
      rewrite(prefix, host, pathname, suffix)
    );
}
