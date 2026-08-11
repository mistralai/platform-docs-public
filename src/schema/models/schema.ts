import { ModelColor } from '@/lib/colors';
import type { AvatarIconVariant } from '@/lib/icons';
import { EndpointKey } from './endpoints';
import type { Lingo } from '@lingo.dev/react';

export type StarRating = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

export type PricingDenominator =
  | '/M Tokens'
  | '/M Chars'
  | '/Min'
  | '/1000 Pages'
  | '/1000 Annotated Pages';

export type ModelClass = 'Generalist' | 'Specialist';
export type ModelType = 'Premier' | 'Open' | 'Labs';
export type ModelStatus = 'PublicPreview' | 'GA' | 'Deprecated' | 'Retired';

export interface ModelPricingFlat {
  type: 'flat';
  free: boolean;
  price: number;
  priceEur?: number;
  denominator: PricingDenominator;
}
export interface ModelPricingRange {
  type: 'range';
  free: boolean;
  input: number;
  inputEur?: number;
  denominator: PricingDenominator;
  output: number;
  outputEur?: number;
}

export interface ModelPricingCustom {
  type: 'custom';
  free: boolean;
  input: { type: 'range' | 'flat'; price: number; priceEur?: number; denominator: PricingDenominator; label?: string }[];
  output: { type: 'range' | 'flat'; price: number; priceEur?: number; denominator: PricingDenominator; label?: string }[];
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
// AVAILABLES: Modality, Feature
// ------------------------------------------------------------

export const AVAILABLE_MODALITIES = {
  text: { name: 'Text', description: 'Text' },
  image: { name: 'Image', description: 'Image' },
  audio: { name: 'Audio', description: 'Audio' },
  vision: { name: 'Vision', description: 'Vision' },
  document: { name: 'Document', description: 'Document' },
  reasoning: { name: 'Reasoning', description: 'Reasoning' },
  embeddings: { name: 'Embeddings', description: 'Embeddings' },
  scores: { name: 'Scores', description: 'Scores' },
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
    link: '/studio/conversations/chat-completion',
    endpoints: ['chat-completions'],
  },
  'function-calling': {
    name: 'Function Calling',
    link: '/studio/conversations/function-calling',
    endpoints: ['chat-completions', 'conversations'],
  },
  'agents-conversations': {
    name: 'Agents & Conversations',
    link: '/studio/agents/agents-api',
    endpoints: ['agents', 'conversations'],
  },
  connectors: {
    name: 'Built-In Tools',
    link: '/studio/agents/agent-tools',
    endpoints: ['agents', 'conversations'],
  },
  'structured-outputs': {
    name: 'Structured Outputs',
    link: '/studio/conversations/structured-output',
    endpoints: ['chat-completions', 'conversations'],
  },
  'predicted-outputs': {
    name: 'Predicted Outputs',
    link: '/studio/conversations/advanced/predicted-outputs',
    endpoints: ['chat-completions', 'conversations'],
  },
  prefix: {
    name: 'Prefix',
    link: '/studio/conversations/chat-completion#other-useful-features',
    endpoints: ['chat-completions', 'conversations'],
  },
  ocr: { name: 'OCR', link: '/studio/document-processing/overview', endpoints: ['ocr'] },
  'annotations-structured-ocr': {
    name: 'Annotations - Structured',
    link: '/studio/document-processing/annotations',
    endpoints: ['ocr'],
  },
  'bbox-extraction': {
    name: 'BBox Extraction',
    link: '/studio/document-processing/basic_ocr',
    endpoints: ['ocr'],
  },
  'document-qna': {
    name: 'Document QnA',
    link: '/studio/document-processing/document_qna',
    endpoints: ['chat-completions', 'conversations'],
  },
  fim: {
    name: 'FIM',
    link: '/mistral-vibe/using-fim-api',
    endpoints: ['fim-completions'],
  },
  embeddings: {
    name: 'Embeddings',
    link: '/studio/knowledge-rag/embeddings',
    endpoints: ['embeddings'],
  },
  moderations: {
    name: 'Moderations',
    link: '/studio/safety-moderation',
    endpoints: ['moderations'],
  },
  'chat-moderations': {
    name: 'Chat Moderations',
    link: '/studio/safety-moderation',
    endpoints: ['chat-moderations'],
  },
  transcriptions: {
    name: 'Transcriptions',
    link: '/studio/audio/speech_to_text',
    endpoints: ['audio-transcriptions'],
  },
  tts: {
    name: 'Text to Speech',
    link: '/studio/audio/text_to_speech',
    endpoints: ['audio-speech'],
  },
  'voice-cloning': {
    name: 'Voice Cloning',
    link: '/studio/audio/text_to_speech/voices',
    endpoints: ['audio-speech'],
  },
  timestamps: {
    name: 'Timestamps',
    link: '/studio/audio/speech_to_text/offline_transcription#transcription-with-timestamps',
    endpoints: ['audio-transcriptions'],
  },
  batching: {
    name: 'Batching',
    link: '/studio/batch-processing',
    endpoints: ['batch'],
  },
} as const satisfies Features;
export type FeatureKey = keyof typeof AVAILABLE_FEATURES;

// ------------------------------------------------------------
// Model
// ------------------------------------------------------------

export type MinGpuRam = {
  bf16: string | null;
  fp8: string | null;
  fp4: string | null;
  fp4_16: string | null;
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
  url: string | null;
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
}
export interface ModelAvatar {
  icon: AvatarIconVariant;
  backgroundColor: ModelColor;
}
export interface ModelDescriptions {
  description: string;
  shortDescription: string;
}

export interface ModelExternalLink {
  href: string;
  label: string;
}

export type ModelTag = 'third-party';

export interface ModelTemplate<
  K extends string = string,
  S extends string = string,
> {
  name: K;
  /**
   * Localizable description pair. Called at render time with a Lingo instance
   * obtained from `useLingo()` (client) or `getLingo()` (server).
   */
  describe: (l: Lingo) => ModelDescriptions;
  slug: S;
  /** ISO 8601 date string (YYYY-MM-DD). */
  releaseDate?: string;
  version?: string;
  frontier: boolean;
  class: ModelClass;
  type: ModelType;
  legacy?: boolean;
  status: ModelStatus;
  avatar?: ModelAvatar;
  bloglink?: string | null;
  paperlink?: string | null;
  externalLinks?: ModelExternalLink[];
  tags?: ModelTag[];
  pricingLayout?: 'stacked';
  performanceMaxStars?: StarRating;
  usageExample?: 'zai-glm-5-2';
  weights: ModelWeight[];
  contextLength?: string | undefined | null;
  outputTokenLimit?: string | undefined | null;
  ratings: {
    speed: StarRating;
    performance: StarRating;
    input: StarRating;
    output: StarRating;
  };
  hideRatings?: boolean;
  pricing: ModelPricing;
  identifiers: ModelIdentifier;
  capabilities: ModelCapabilities;
  relatedModels?: K[];
  metadata?: {
    parameters?: string;
    deprecated?: boolean;
    /** ISO 8601 date string (YYYY-MM-DD). */
    deprecationDate?: string;
    /** ISO 8601 date string (YYYY-MM-DD). */
    retirementDate?: string;
    replacement?: K;
  };
  playground?: string | undefined;
  legalButton?: ModelLegalButton;
  /**
   * Usefull to override the default behaviour in the compare model button
   */
  modelsToCompare?: [string] | [string, string];
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
