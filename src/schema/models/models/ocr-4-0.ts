import { StaticModel } from '../schema';
export default {
  name: 'OCR 4',
  describe: (l) => ({
    description: l.text(`Our latest OCR service powering our Document AI stack, with native paragraph-level bounding box extraction and structural block labels.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our latest OCR service with paragraph-level bounding boxes and structural block labels.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'ocr-4-0',
  releaseDate: '2026-06-23',
  version: '4.0',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-ocr',
  status: 'Active',
  avatar: { icon: 'ocr', backgroundColor: 'red' },
  weights: [],
  bloglink: 'https://mistral.ai/news/ocr-4/',
  paperlink: null,
  contextLength: null,
  ratings: {
    speed: 4.0,
    performance: 4.0, input: 4.0, output: 3.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 4.0, denominator: '/1000 Pages' },
      { type: 'flat', price: 5.0, denominator: '/1000 Annotated Pages' }
    ],
    output: [

    ]
  },
  identifiers: { apiNames: ['mistral-ocr-4-0', 'mistral-ocr-4', 'mistral-ocr-latest'] },
  capabilities: {
    input: ['image', 'document'],
    output: ['text', 'image'],
    features: ['bbox-extraction', 'ocr', 'annotations-structured-ocr', 'batching'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/document-ai/ocr-playground',
  legacy: false,
} as const satisfies StaticModel;
