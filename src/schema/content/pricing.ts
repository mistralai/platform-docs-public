import { ModelSlug } from '@/schema/models';
import type { Lingo } from '@lingo.dev/react';

/**
 * A pricing table group. Edit `PRICING_TABLES` below to choose which models
 * appear in which table, and how tables are organized (e.g. by typology:
 * flagship, specialized, experiments). Models are referenced by slug, so they
 * must exist in `MODELS` (see `src/schema/models/models`).
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

export const PRICING_TABLES: PricingTableGroup[] = [
  {
    id: 'flagship',
    title: l => l.text('Flagship models', { context: 'Heading for flagship model pricing table' }),
    description: l => l.text('Premier frontier models for the most demanding workloads.', { context: 'Description for flagship model pricing table' }),
    slugs: [
      'mistral-large-3-25-12',
      'mistral-medium-3-5-26-04',
      'mistral-small-4-0-26-03',
      'ministral-3-14b-25-12',
      'ministral-3-8b-25-12',
      'ministral-3-3b-25-12',
    ],
  },
  {
    id: 'code',
    title: l => l.text('Code models', { context: 'Heading for code model family' }),
    description: undefined,
    slugs: [
      'codestral-25-08',
      'codestral-embed-25-05',
    ],
  },
  {
    id: 'specialized',
    title: l => l.text('Specialized models', { context: 'Heading for specialized model pricing table' }),
    description: l =>
      l.text('Models built for specific tasks such as code, vision, OCR, and audio.', { context: 'Description for specialized model pricing table' }),
    slugs: [

      'ocr-4-0',
      'voxtral-mini-transcribe-26-02',
      'voxtral-tts-26-03',
      'mistral-moderation-26-03',
    ],
  },
  {
    id: 'experiments',
    title: l => l.text('Experiments', { context: 'Heading for experimental model pricing table' }),
    description: l => l.text('Research previews and experimental releases.', { context: 'Description for experimental model pricing table' }),
    slugs: [
      'leanstral-1-5',

    ],
  },
];
