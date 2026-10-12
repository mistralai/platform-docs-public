/**
 * Markdown for docs content rendered from data rather than MDX: the changelog,
 * the models overview, every model card, API pricing, the model selection
 * guide, and the data components MDX pages embed (release notes, glossary,
 * model tables). Without these the llms files hold none of the pages readers
 * ask about most.
 *
 * Imports `@/schema/models` and `@/schema/content/pricing` directly: the
 * `@/schema` barrel pulls in the cookbook build output.
 */
import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { createElement, Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createLingo } from '@lingo.dev/react';
import { loadMessages } from '@/i18n/messages';
import { parseFrontmatter } from '@/lib/content/parse-metadata';
import { getGlossaryData } from '@/components/common/interactive-glossary/glossary-data';
import { getReleaseNotes } from '@/data/releases';
import {
  getModelLicenses,
  getModelUrl,
  isLegacyModel,
  models,
  nonLegacyModels,
  type Model,
  type ModelPricing,
} from '@/schema/models';
import { PRICING_TABLES } from '@/schema/content/pricing';
import { formatPriceValue } from '@/schema/models/pricing-currency';
import { modelStatus } from '@/schema/models/i18n';

const CHANGELOG_DIR = path.join(process.cwd(), 'changelog', 'en');

export interface GeneratedPage {
  /** Route without a leading slash, e.g. `resources/changelogs`. */
  slug: string;
  title: string;
  description: string;
  content: string;
}

export type Lingo = ReturnType<typeof createLingo>;

export function englishLingo(): Lingo {
  return createLingo('en', loadMessages('en'));
}

function apiName(model: Model): string {
  const name = model.identifiers.apiNames[0];
  return name ? `\`${name}\`` : '';
}

function formatPrice(price: number, denominator: string): string {
  return `$${formatPriceValue(price)} ${denominator}`;
}

/** A custom pricing part; a temporary discount reads as a sale, with the regular price. */
function partPrice(part: { price: number; denominator: string; originalPrice?: number }): string {
  const price = formatPrice(part.price, part.denominator);
  return part.originalPrice === undefined
    ? price
    : `${price} (sale price, regular $${formatPriceValue(part.originalPrice)})`;
}

function pricingLines(pricing: ModelPricing): string[] {
  const free = pricing.free ? ['Free'] : [];
  switch (pricing.type) {
    case 'flat':
      return [...free, formatPrice(pricing.price, pricing.denominator)];
    case 'range':
      return [
        ...free,
        `Input ${formatPrice(pricing.input, pricing.denominator)}`,
        `Output ${formatPrice(pricing.output, pricing.denominator)}`,
      ];
    case 'custom':
      return [
        ...free,
        ...pricing.input.map(part => `${part.label ?? 'Input'} ${partPrice(part)}`),
        ...pricing.output.map(part => `${part.label ?? 'Output'} ${partPrice(part)}`),
      ];
  }
}

function modelLink(model: Model): string {
  return `[${model.name}](${getModelUrl(model)})`;
}

function replacementLink(model: Model): string | undefined {
  const name = model.metadata?.replacement;
  const replacement = name ? models.find(candidate => candidate.name === name) : undefined;
  return replacement ? modelLink(replacement) : name;
}

function rating(value: number): string {
  return `${value}/5`;
}

/** Parameter counts are stored as plain billions ("52") or with a unit ("1.05T"). */
function withUnit(count: string): string {
  return /[A-Za-z]$/.test(count) ? count : `${count}B`;
}

function openWeights(model: Model): string {
  return model.weights
    .map(weight => {
      const size = weight.active && weight.active !== weight.parameters
        ? `${withUnit(weight.parameters)} parameters, ${withUnit(weight.active)} active`
        : weight.parameters && `${withUnit(weight.parameters)} parameters`;
      return [weight.url ? `[${weight.name}](${weight.url})` : weight.name, size, weight.license]
        .filter(Boolean)
        .join(', ');
    })
    .join('; ');
}

function modelCard(model: Model, l: Lingo): GeneratedPage {
  const { description, shortDescription } = model.describe(l);
  const facts: [string, string | undefined | null][] = [
    ['API names', model.identifiers.apiNames.map(name => `\`${name}\``).join(', ')],
    ['Status', modelStatus(model.status, l)],
    ['Type', `${model.type}, ${model.class}`],
    ['Release date', model.releaseDate],
    ['Version', model.version],
    ['Context length', model.contextLength],
    ['Output token limit', model.outputTokenLimit],
    ['Parameters', model.metadata?.parameters],
    ['Input', model.capabilities.input.join(', ')],
    ['Output', model.capabilities.output.join(', ')],
    ['Features', model.capabilities.features.join(', ')],
    ['Speed rating', model.hideRatings ? undefined : rating(model.ratings.speed)],
    ['Performance rating', model.hideRatings ? undefined : rating(model.ratings.performance)],
    ['Pricing', pricingLines(model.pricing).join('; ')],
    ['Licenses', getModelLicenses(model).join(', ')],
    ['Open weights', openWeights(model)],
    ['Deprecation date', model.metadata?.deprecationDate],
    ['Retirement date', model.metadata?.retirementDate],
    ['Replacement', replacementLink(model)],
  ];
  const content = [
    `# ${model.name}`,
    '',
    description,
    '',
    ...facts.filter(([, value]) => value).map(([label, value]) => `- ${label}: ${value}`),
  ].join('\n');
  return {
    slug: getModelUrl(model).slice(1),
    title: model.name,
    description: shortDescription,
    content,
  };
}

/** A table of models; deprecated and retired ones also show their dates and replacement. */
export function modelTable(rows: Model[], l: Lingo): string {
  const showLifecycle = rows.some(isLegacyModel);
  const header = showLifecycle
    ? ['| Model | API name | Status | Context | Summary | Deprecation | Retirement | Replacement |', '| --- | --- | --- | --- | --- | --- | --- | --- |']
    : ['| Model | API name | Status | Context | Summary |', '| --- | --- | --- | --- | --- |'];
  const lines = rows.map(model => {
    const cells = [modelLink(model), apiName(model), modelStatus(model.status, l), model.contextLength ?? '', model.describe(l).shortDescription];
    if (showLifecycle) {
      cells.push(model.metadata?.deprecationDate ?? '', model.metadata?.retirementDate ?? '', replacementLink(model) ?? '');
    }
    return `| ${cells.join(' | ')} |`;
  });
  return [...header, ...lines].join('\n');
}

function modelsOverview(l: Lingo): GeneratedPage {
  return {
    slug: 'models',
    title: 'Models Overview',
    description: 'Every Mistral model with its API name, status and context length, including deprecated and retired models.',
    content: [
      '# Models Overview',
      '',
      modelTable(nonLegacyModels, l),
      '',
      '## Deprecated and retired models',
      '',
      'A deprecated model still answers requests until its retirement date. A retired model no longer does: use its replacement.',
      '',
      modelTable(models.filter(isLegacyModel), l),
    ].join('\n'),
  };
}

function modelSelectionGuide(l: Lingo): GeneratedPage {
  const rows = nonLegacyModels.map(model => {
    const cells = [
      modelLink(model),
      apiName(model),
      `${model.type}, ${model.class}`,
      model.hideRatings ? '' : rating(model.ratings.speed),
      model.hideRatings ? '' : rating(model.ratings.performance),
      model.capabilities.input.join(', '),
      model.capabilities.output.join(', '),
      model.contextLength ?? '',
      pricingLines(model.pricing).join('<br>'),
      getModelLicenses(model).join(', '),
    ];
    return `| ${cells.join(' | ')} |`;
  });
  return {
    slug: 'inference/model-selection-guide',
    title: 'Model Selection Guide',
    description: 'Compare current Mistral models on speed, performance, modalities, context size, pricing and license.',
    content: [
      '# Model Selection Guide',
      '',
      'Compare current Mistral models side by side. Ratings go from 0 to 5. Open a model card for its full description, features and limits.',
      '',
      '| Model | API name | Type | Speed | Performance | Input | Output | Context | Price | License |',
      '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
      ...rows,
    ].join('\n'),
  };
}

/** The release notes page, newest note first, as `ReleaseNotesPage` renders it. */
export function releaseNotesMarkdown(): string {
  const notes = getReleaseNotes('en')
    .map(note => {
      const lines = [
        `### ${note.title}`,
        '',
        [note.date, note.type, note.area, note.availability, note.hosting].filter(Boolean).join(' · '),
        '',
        note.summary,
        '',
        note.whatsNew,
      ];
      if (note.keyCapabilities.length > 0) {
        lines.push('', ...note.keyCapabilities.map(capability => `- ${capability}`));
      }
      if (note.getStarted) {
        const link = note.getStarted.href ? ` [${note.getStarted.href.label}](${note.getStarted.href.url})` : '';
        lines.push('', `${note.getStarted.label}${link}`);
      }
      return lines.join('\n');
    })
    .join('\n\n');
  return [
    '# Release notes',
    '',
    'Follow shipped product updates across Vibe, Studio, Admin, models, and the API.',
    '',
    '## Latest updates',
    '',
    notes,
  ].join('\n');
}

function plainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The glossary, alphabetically, as `InteractiveGlossary` lists it. */
export function glossaryMarkdown(l: Lingo): string {
  return getGlossaryData(l)
    .sort((a, b) => a.term.localeCompare(b.term))
    .map(item => {
      const definition = plainText(renderToStaticMarkup(createElement(Fragment, null, item.definition)));
      return `- **${item.term}** (${item.categories.join(', ')}): ${definition}`;
    })
    .join('\n');
}

function pricingPage(l: Lingo): GeneratedPage {
  const bySlug = new Map(nonLegacyModels.map(model => [model.slug as string, model]));
  const sections = PRICING_TABLES.flatMap(table => {
    const rows = table.slugs
      .map(slug => bySlug.get(slug))
      .filter((model): model is Model => model !== undefined)
      .map(model => `| [${model.name}](${getModelUrl(model)}) | ${apiName(model)} | ${pricingLines(model.pricing).join('<br>')} |`);
    return [
      `## ${table.title(l)}`,
      '',
      ...(table.description ? [table.description(l), ''] : []),
      '| Model | API name | Price |',
      '| --- | --- | --- |',
      ...rows,
      '',
    ];
  });
  return {
    slug: 'inference/pricing',
    title: 'API pricing',
    description: 'Pricing for Mistral models through the API, organized by family.',
    content: ['# API pricing', '', ...sections].join('\n').trim(),
  };
}

async function changelogPage(): Promise<GeneratedPage> {
  const files = (await readdir(CHANGELOG_DIR)).filter(name => name.endsWith('.mdx')).sort().reverse();
  const entries: string[] = [];
  for (const file of files) {
    const { metadata, content } = parseFrontmatter(await readFile(path.join(CHANGELOG_DIR, file), 'utf8'));
    const date = typeof metadata?.date === 'string' ? metadata.date : path.basename(file, '.mdx');
    // `<Tag model/>` labels an entry's category; keep the category as text.
    const body = content.replace(/<Tag\s+(\w+)\s*\/>/g, '($1)').trim();
    entries.push(`## ${date}`, '', body, '');
  }
  return {
    slug: 'resources/changelogs',
    title: 'Changelog',
    description: 'Dated changes to Mistral models, the API and products, newest first.',
    content: ['# Changelog', '', ...entries].join('\n').trim(),
  };
}

export async function buildGeneratedPages(l: Lingo): Promise<GeneratedPage[]> {
  return [
    await changelogPage(),
    modelsOverview(l),
    // The site still serves deprecated and retired cards, and readers ask what replaced them.
    ...models.map(model => modelCard(model, l)),
    pricingPage(l),
    modelSelectionGuide(l),
  ];
}
