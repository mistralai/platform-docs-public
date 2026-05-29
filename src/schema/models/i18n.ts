import type { Lingo } from '@lingo.dev/react';
import type {
  FeatureKey,
  ModalityKey,
  ModelClass,
  ModelStatus,
  ModelType,
  PricingDenominator,
  StarRating,
} from './schema';

export interface RatingLabel {
  stars: StarRating;
  label: string;
}

function speedLikeLabel(stars: StarRating, l: Lingo): string {
  if (stars <= 2) return l.text('Slow', { context: 'Label for an AI model speed rating' });
  if (stars <= 3.5) return l.text('Moderate', { context: 'Label for an AI model speed rating' });
  if (stars <= 4) return l.text('Fast', { context: 'Label for an AI model speed rating' });
  return l.text('Very Fast', { context: 'Label for an AI model speed rating' });
}

export function speedRating(stars: StarRating, l: Lingo): RatingLabel {
  return { stars, label: speedLikeLabel(stars, l) };
}

export function inputRating(stars: StarRating, l: Lingo): RatingLabel {
  return { stars, label: speedLikeLabel(stars, l) };
}

export function outputRating(stars: StarRating, l: Lingo): RatingLabel {
  return { stars, label: speedLikeLabel(stars, l) };
}

export function performanceRating(stars: StarRating, l: Lingo): RatingLabel {
  let label: string;
  if (stars <= 1) {
    label = l.text('Basic', { context: 'Label for an AI model capability rating' });
  } else if (stars <= 2.5) {
    label = l.text('Moderate', { context: 'Label for an AI model capability rating' });
  } else if (stars <= 3.5) {
    label = l.text('Smart', { context: 'Label for an AI model capability rating' });
  } else {
    label = l.text('Very Smart', { context: 'Label for an AI model capability rating' });
  }
  return { stars, label };
}

export function pricingDenominator(key: PricingDenominator, l: Lingo): string {
  switch (key) {
    case '/M Tokens':
      return l.text('/M Tokens', { context: 'Pricing unit meaning "per million tokens"' });
    case '/M Chars':
      return l.text('/M Chars', { context: 'Pricing unit meaning "per million characters"' });
    case '/Min':
      return l.text('/Min', { context: 'Price denominator suffix meaning "per minute" (audio models)' });
    case '/1000 Pages':
      return l.text('/1000 Pages', { context: 'Price denominator suffix meaning "per 1000 pages" (OCR models)' });
    case '/1000 Annotated Pages':
      return l.text('/1000 Annotated Pages', { context: 'Price denominator suffix meaning "per 1000 annotated pages" (OCR models with annotations)' });
  }
}

export function modelClass(key: ModelClass, l: Lingo): string {
  switch (key) {
    case 'Generalist':
      return l.text('Generalist', { context: 'Label for a general-purpose AI model' });
    case 'Specialist':
      return l.text('Specialist', { context: 'Label for a domain-specific AI model' });
  }
}

export function modelType(key: ModelType, l: Lingo): string {
  switch (key) {
    case 'Premier':
      return l.text('Premier', { context: 'Badge for a top-tier commercial AI model' });
    case 'Open':
      return l.text('Open', { context: 'Badge for an open-weights AI model' });
    case 'Labs':
      return l.text('Labs', { context: 'Badge for an experimental AI model' });
  }
}

export function modelStatus(key: ModelStatus, l: Lingo): string {
  switch (key) {
    case 'Active':
      return l.text('Active', { context: 'Status label for an AI model that is currently available' });
    case 'Deprecated':
      return l.text('Deprecated', { context: 'Status label for an AI model that is being phased out but still available' });
    case 'Retired':
      return l.text('Retired', { context: 'Status label for an AI model that is no longer available' });
  }
}

export function modalityLabel(key: ModalityKey, l: Lingo): string {
  switch (key) {
    case 'text':
      return l.text('Text', { context: 'Label for an AI model capability: text input/output' });
    case 'image':
      return l.text('Image', { context: 'Label for an AI model capability: image input/output' });
    case 'audio':
      return l.text('Audio', { context: 'Label for an AI model capability: audio input/output' });
    case 'vision':
      return l.text('Vision', { context: 'Label for an AI model capability: vision-understanding' });
    case 'document':
      return l.text('Document', { context: 'Label for an AI model capability: document input/output' });
    case 'reasoning':
      return l.text('Reasoning', { context: 'Label for an AI model capability: reasoning/thinking' });
    case 'embeddings':
      return l.text('Embeddings', { context: 'Label for an AI model capability: vector embeddings output' });
    case 'scores':
      return l.text('Scores', { context: 'Label for an AI model capability: scoring/moderation output' });
  }
}

export function featureLabel(key: FeatureKey, l: Lingo): string {
  switch (key) {
    case 'chat-completions':
      return l.text('Chat Completions', { context: 'Name of an API feature supported by an AI model' });
    case 'function-calling':
      return l.text('Function Calling', { context: 'Name of an API feature supported by an AI model' });
    case 'agents-conversations':
      return l.text('Agents & Conversations', { context: 'Name of an API feature supported by an AI model' });
    case 'connectors':
      return l.text('Built-In Tools', { context: 'Name of an API feature supported by an AI model' });
    case 'structured-outputs':
      return l.text('Structured Outputs', { context: 'Name of an API feature supported by an AI model' });
    case 'predicted-outputs':
      return l.text('Predicted Outputs', { context: 'Name of an API feature supported by an AI model' });
    case 'prefix':
      return l.text('Prefix', { context: 'Name of an API feature supported by an AI model' });
    case 'ocr':
      return l.text('OCR', { context: 'Name of an AI model API feature: Optical Character Recognition' });
    case 'annotations-structured-ocr':
      return l.text('Annotations - Structured', { context: 'Name of an AI model API feature: structured annotations for OCR' });
    case 'bbox-extraction':
      return l.text('BBox Extraction', { context: 'Name of an AI model API feature: bounding-box extraction for OCR' });
    case 'document-qna':
      return l.text('Document QnA', { context: 'Name of an AI model API feature: question-answering over documents' });
    case 'fim':
      return l.text('FIM', { context: 'Name of an AI model API feature: Fill-In-the-Middle code completion' });
    case 'embeddings':
      return l.text('Embeddings', { context: 'Name of an AI model API feature: vector embeddings' });
    case 'moderations':
      return l.text('Moderations', { context: 'Name of an AI model API feature: content moderation' });
    case 'chat-moderations':
      return l.text('Chat Moderations', { context: 'Name of an AI model API feature: chat-scoped content moderation' });
    case 'transcriptions':
      return l.text('Transcriptions', { context: 'Name of an AI model API feature: audio speech-to-text' });
    case 'tts':
      return l.text('Text to Speech', { context: 'Name of an AI model API feature: audio text-to-speech' });
    case 'timestamps':
      return l.text('Timestamps', { context: 'Name of an AI model API feature: word-level timestamps in audio transcriptions' });
    case 'batching':
      return l.text('Batching', { context: 'Name of an AI model API feature: batch request processing' });
  }
}

export function modelTypeTooltip(key: ModelType, l: Lingo): string {
  switch (key) {
    case 'Premier':
      return l.text('A model that is at the cutting edge of technology for enterprise use.', { context: 'Tooltip explaining the Premier AI model tier' });
    case 'Open':
      return l.text('An Open Weight model that is available to the public.', { context: 'Tooltip explaining open weights' });
    case 'Labs':
      return l.text('Experimental, fast moving, and may offer lower QoS.', { context: 'Tooltip explaining the Labs AI model tier' });
  }
}
