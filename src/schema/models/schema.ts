import { ModelColor } from '@/lib/colors';
import type { AvatarIconVariant } from '@/lib/icons';
import { EndpointKey } from './endpoints';

export type StarRating = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export interface ModelRating {
  stars: StarRating;
  label: string;
}

export interface ModelPricingFlat {
  type: 'flat';
  free: boolean;
  price: number;
  denominator: string;
}
export interface ModelPricingRange {
  type: 'range';
  free: boolean;
  input: number;
  denominator: string;
  output: number;
}

export interface ModelPricingCustom {
  type: 'custom';
  free: boolean;
  input: { type: 'range' | 'flat'; price: number; denominator: string }[];
  output: { type: 'range' | 'flat'; price: number; denominator: string }[];
}

export type ModelPricing =
  | ModelPricingFlat
  | ModelPricingRange
  | ModelPricingCustom;
export interface ModelEndpoint {
  name: string;
  path: string;
  available: boolean;
  type?: 'chat' | 'embeddings' | 'completion' | 'fim' | 'transcription';
}

export interface ModelIdentifier {
  apiNames: string[];
  aliases?: string[];
}

export type ModelLegalButton = null | undefined | 'DEFAULT' | string;

// ------------------------------------------------------------
// AVAILABLES: Modality, Feature, Finetuning
// ------------------------------------------------------------

export const AVAILABLE_MODALITIES = {
  text: { name: 'Text', description: 'Text' },
  image: { name: 'Image', description: 'Image' },
  audio: { name: 'Audio', description: 'Audio' },
  vision: { name: 'Vision', description: 'Vision' },
  document: { name: 'Document', description: 'Document' },
  reasoning: { name: 'Reasoning', description: 'Reasoning' },
  embeddings: { name: 'Embeddings', description: 'Embeddings' },
} as const;
export type ModalityKey = keyof typeof AVAILABLE_MODALITIES;

type Features = Record<
  string,
  {
    name: string;
    link: string;
    endpoints: EndpointKey[];
  }
>;
export const AVAILABLE_FEATURES = {
  'chat-completions': {
    name: 'Chat Completions',
    link: '/capabilities/completion',
    endpoints: ['chat-completions'],
  },
  'function-calling': {
    name: 'Function Calling',
    link: '/capabilities/function_calling',
    endpoints: ['chat-completions', 'conversations'],
  },
  'agents-conversations': {
    name: 'Agents & Conversations',
    link: '/agents/agents',
    endpoints: ['agents', 'conversations'],
  },
  connectors: {
    name: 'Built-In Tools',
    link: '/agents/tools',
    endpoints: ['agents', 'conversations'],
  },
  'structured-outputs': {
    name: 'Structured Outputs',
    link: '/capabilities/structured_output',
    endpoints: ['chat-completions', 'conversations'],
  },
  'predicted-outputs': {
    name: 'Predicted Outputs',
    link: '/capabilities/predicted_outputs',
    endpoints: ['chat-completions', 'conversations'],
  },
  prefix: {
    name: 'Prefix',
    link: '/capabilities/completion/usage#other-useful-features',
    endpoints: ['chat-completions', 'conversations'],
  },
  ocr: { name: 'OCR', link: '/capabilities/document_ai', endpoints: ['ocr'] },
  'annotations-structured-ocr': {
    name: 'Annotations - Structured',
    link: '/capabilities/document_ai/annotations',
    endpoints: ['ocr'],
  },
  'bbox-extraction': {
    name: 'BBox Extraction',
    link: '/capabilities/document_ai/basic_ocr',
    endpoints: ['ocr'],
  },
  'document-qna': {
    name: 'Document QnA',
    link: '/capabilities/document_ai/document_qna',
    endpoints: ['chat-completions', 'conversations'],
  },
  fim: {
    name: 'FIM',
    link: '/capabilities/fim',
    endpoints: ['fim-completions'],
  },
  embeddings: {
    name: 'Embeddings',
    link: '/capabilities/embeddings',
    endpoints: ['embeddings'],
  },
  moderations: {
    name: 'Moderations',
    link: '/capabilities/guardrailing',
    endpoints: ['moderations'],
  },
  'chat-moderations': {
    name: 'Chat Moderations',
    link: '/capabilities/guardrailing',
    endpoints: ['chat-moderations'],
  },
  transcriptions: {
    name: 'Transcriptions',
    link: '/capabilities/audio_transcription#transcription',
    endpoints: ['audio-transcriptions'],
  },
  timestamps: {
    name: 'Timestamps',
    link: '/capabilities/audio_transcription#transcription-with-timestamps',
    endpoints: ['audio-transcriptions'],
  },
  batching: {
    name: 'Batching',
    link: '/capabilities/batch',
    endpoints: ['batch'],
  },
} as const satisfies Features;
export type FeatureKey = keyof typeof AVAILABLE_FEATURES;

export const AVAILABLE_FINETUNING = {
  text: { name: 'Text' },
  vision: { name: 'Vision' },
  classifier: { name: 'Classifier' },
} as const;
export type FinetuningKey = keyof typeof AVAILABLE_FINETUNING;

// ------------------------------------------------------------
// Model
// ------------------------------------------------------------

export type MinGpuRam = {
  bf16: string|null;
  fp8: string|null;
  fp4: string|null;
  fp4_16: string|null;
};

export const isMinGpuRam = (value: unknown): value is MinGpuRam => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'bf16' in value &&
    'fp4' in value &&
    'fp8' in value &&
    'fp4_16' in value
  );
};
export interface ModelWeight {
  name: string;
  url: string;
  license?: string;
  licenseUrl: string;
  parameters: string;
  minGpuRam: MinGpuRam;
  minRam?: string;
  active: string;
  contextSize: string;
}
export interface ModelCapabilities {
  input: ModalityKey[];
  output: ModalityKey[];
  features: FeatureKey[];
  finetuning: FinetuningKey[];
}
export interface ModelAvatar {
  icon: AvatarIconVariant;
  backgroundColor: ModelColor;
}
export interface ModelTemplate<
  K extends string = string,
  S extends string = string,
> {
  name: K;
  description: string;
  shortDescription: string;
  slug: S;
  releaseDate?: string;
  version?: string;
  frontier: boolean;
  class: 'Generalist' | 'Specialist';
  type: 'Premier' | 'Open' | 'Labs';
  legacy?: boolean;
  status: 'Deprecated' | 'Retired' | 'Active';
  avatar?: ModelAvatar;
  weights: ModelWeight[];
  contextLength?: string | undefined | null;
  ratings: {
    speed: ModelRating;
    performance: ModelRating;
    input: ModelRating;
    output: ModelRating;
  };
  pricing: ModelPricing;
  identifiers: ModelIdentifier;
  capabilities: ModelCapabilities;
  relatedModels?: K[];
  metadata?: {
    parameters?: string;
    deprecated?: boolean;
    deprecationDate?: string;
    retirementDate?: string;
    replacement?: K;
  };
  playground?: string | undefined;
  legalButton?: ModelLegalButton;
}

// dup detector

export type StaticModel = Readonly<ModelTemplate<any, any>>;

// 4 Type helpers
export type Names<T> = T extends readonly any[]
  ? T[number] extends { name: infer N }
    ? Extract<N, string>
    : never
  : never;
export type Slugs<T> = T extends readonly any[]
  ? T[number] extends { slug: infer S }
    ? Extract<S, string>
    : never
  : never;

// factory function to define models
export const defineModels = <
  T extends readonly ModelTemplate<Names<T>, Slugs<T>>[],
>(
  t: T
) => t;
