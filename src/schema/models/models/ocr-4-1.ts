import { StaticModel } from '../schema';
export default {
  name: 'OCR 4.1',
  describe: (l) => ({
    description: l.text(`Our latest OCR service powering our Document AI stack, with native paragraph-level bounding box extraction, structural block labels, and block-level confidence scores.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our latest OCR service with paragraph-level bounding boxes, structural block labels, and block-level confidence scores.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'ocr-4-1',
  releaseDate: '2026-07-16',
  version: '4.1',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-ocr',
  status: 'GA',
  avatar: { icon: 'ocr', backgroundColor: 'red' },
  weights: [],
  bloglink: null,
  paperlink: null,
  contextLength: null,
  ratings: {
    speed: 4.0,
    performance: 4.0, input: 4.0, output: 3.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 4.0, priceEur: 3.5, denominator: '/1000 Pages' },
      { type: 'flat', price: 5.0, priceEur: 4.38, denominator: '/1000 Annotated Pages' }
    ],
    output: [

    ]
  },
  identifiers: { apiNames: ['mistral-ocr-4-1', 'mistral-ocr-4', 'mistral-ocr-latest'] },
  capabilities: {
    input: ['image', 'document'],
    output: ['text', 'image'],
    features: ['bbox-extraction', 'ocr', 'annotations-structured-ocr', 'batching'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/document-ai/ocr-playground',
  legacy: false,
} as const satisfies StaticModel;
