import { ModelSlug } from '@/schema/models';

export const FEATURED_MODEL_NAMES: ModelSlug[] = [
  'ocr-4-0',
  'devstral-2-25-12',
  'mistral-medium-3-5-26-04',
];

export const LATEST_MODEL_NAMES: ModelSlug[] = [
  'mistral-medium-3-5-26-04',
  'mistral-small-4-0-26-03',
  'voxtral-mini-transcribe-realtime-26-02',
  'voxtral-tts-26-03',
  'ocr-4-0',
  'devstral-2-25-12',
];

export const FEATURED_MODEL_NAMES_MODELS_PAGE: ModelSlug[] = LATEST_MODEL_NAMES;

export const FEATURED_MODELS_COLOR_OVERRIDES = [
  'var(--color-mistral-color-1)',
  'var(--color-mistral-color-2)',
  'var(--color-mistral-color-3)',
  'var(--color-mistral-color-4)',
];

export const DEFAULT_BENCHMARK_MODELS: ModelSlug[] = [
  'ocr-4-0',
  'mistral-medium-3-5-26-04',
  'mistral-small-4-0-26-03',
];
