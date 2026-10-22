import { nonLegacyModels, type ModelSlug } from '@/schema/models';
import type { Lingo } from '@lingo.dev/react';

/**
 * A pricing table group. Edit `PRICING_TABLES` below to choose which models
 * appear in which table. The grouping mirrors the models catalog page
 * (`src/app/[locale]/(docs)/models/models-catalog-page.tsx`) so that the
 * pricing page and the models page present the same sections: Generalist,
 * OCR, Audio, Code, Embedding, Moderation and safety, Time series, and
 * Other specialist. Models are referenced by slug and filtered to non-legacy
 * (GA / Public Preview) models, matching the models page. The Voice Agents
 * section is rendered separately in the pricing page component.
 */
export interface PricingTableGroup {
  /** Anchor id for the section. */
  id: string;
  /** Heading text for the table. */
  title: (l: Lingo) => string;
  /** Optional subtitle shown under the heading. */
  description?: (l: Lingo) => string;
  slugs: ModelSlug[];
}

const nonLegacySlugs = new Set(nonLegacyModels.map(model => model.slug));

/** Keep only the non-legacy (GA / Public Preview) entries of a slug list. */
const nonLegacy = (slugs: ModelSlug[]): ModelSlug[] =>
  slugs.filter(slug => nonLegacySlugs.has(slug));

const generalistSlugs: ModelSlug[] = nonLegacyModels
  .filter(model => model.class === 'Generalist')
  .map(model => model.slug);

const specialistSlugs: ModelSlug[] = nonLegacyModels
  .filter(model => model.class === 'Specialist')
  .map(model => model.slug);

// Explicit specialist slug lists, kept in sync with the models catalog page.
const ocrSlugs: ModelSlug[] = nonLegacy([
  'ocr-4-1',
  'ocr-4-0',
  'ocr-3-25-12',
  'ocr-2-25-05',
  'ocr-25-03',
]);
const audioSlugs: ModelSlug[] = nonLegacy([
  'voxtral-mini-transcribe-3-0',
  'voxtral-mini-transcribe-realtime-3-0',
  'voxtral-small-transcribe-3-0',
  'voxtral-mini-tts-3-0',
  'voxtral-mini-transcribe-26-02',
  'voxtral-mini-transcribe-realtime-26-02',
  'voxtral-tts-26-03',
  'voxtral-small-25-07',
  'voxtral-mini-25-07',
  'voxtral-mini-transcribe-25-07',
]);
const codeSlugs: ModelSlug[] = nonLegacy([
  'codestral-25-08',
  'codestral-25-01',
  'codestral-24-05',
  'codestral-mamba-7b-0-1',
]);
const embeddingSlugs: ModelSlug[] = nonLegacy([
  'codestral-embed-25-05',
  'mistral-embed-23-12',
]);
const moderationSlugs: ModelSlug[] = nonLegacy([
  'mistral-moderation-26-03',
  'mistral-moderation-24-11',
  'shieldstral-1-0',
]);
const timeSeriesSlugs: ModelSlug[] = nonLegacy([
  'timestral-1-0-209m',
  'timestral-1-0-123m',
  'timestral-1-0-28m',
  'timestral-1-0-5m',
]);

const explicitSpecialistSlugs = new Set<ModelSlug>([
  ...ocrSlugs,
  ...audioSlugs,
  ...codeSlugs,
  ...embeddingSlugs,
  ...moderationSlugs,
  ...timeSeriesSlugs,
]);

const otherSpecialistSlugs: ModelSlug[] = specialistSlugs.filter(
  slug => !explicitSpecialistSlugs.has(slug)
);

export const PRICING_TABLES: PricingTableGroup[] = [
  {
    id: 'generalist-models',
    title: l => l.text('Generalist models', { context: 'Heading for generalist AI models' }),
    description: l => l.text('Text and multimodal models for broad reasoning, coding, tool use, and agentic tasks.', { context: 'Description for generalist AI model group' }),
    slugs: generalistSlugs,
  },
  {
    id: 'ocr-models',
    title: l => l.text('OCR models', { context: 'Heading for OCR model family' }),
    description: l => l.text('Models for document understanding, text extraction, and structured OCR outputs.', { context: 'Description for OCR model group' }),
    slugs: ocrSlugs,
  },
  {
    id: 'audio-models',
    title: l => l.text('Audio models', { context: 'Heading for audio model family' }),
    description: l => l.text('Models for speech transcription, realtime transcription, and speech generation.', { context: 'Description for audio model group' }),
    slugs: audioSlugs,
  },
  {
    id: 'code-models',
    title: l => l.text('Code models', { context: 'Heading for code model family' }),
    description: l => l.text('Specialized models for code generation, completion, and software engineering agents.', { context: 'Description for code model group' }),
    slugs: codeSlugs,
  },
  {
    id: 'embedding-models',
    title: l => l.text('Embedding models', { context: 'Heading for embedding model family' }),
    description: l => l.text('Models that turn text or code into vectors for retrieval and similarity search.', { context: 'Description for embedding model group' }),
    slugs: embeddingSlugs,
  },
  {
    id: 'moderation-safety-models',
    title: l => l.text('Moderation and safety models', { context: 'Heading for moderation and safety model family' }),
    description: l => l.text('Models for safety filtering, moderation, and policy checks.', { context: 'Description for moderation and safety model group' }),
    slugs: moderationSlugs,
  },
  {
    id: 'time-series-models',
    title: l => l.text('Time series models', { context: 'Heading for time series model family' }),
    description: l => l.text('Models for zero-shot time series forecasting with covariate support and probabilistic outputs.', { context: 'Description for time series model group' }),
    slugs: timeSeriesSlugs,
  },
  ...otherSpecialistSlugs.length > 0
    ? [{
        id: 'other-specialist-models',
        title: l => l.text('Other specialist models', { context: 'Heading for other specialist model family' }),
        description: l => l.text('Specialized models for focused domains and task-specific workloads.', { context: 'Description for other specialist model group' }),
        slugs: otherSpecialistSlugs,
      }]
    : [],
];
