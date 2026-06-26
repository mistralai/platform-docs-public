import { StaticModel } from '../schema';
export default {
  name: 'OCR 3',
  describe: (l) => ({
    description: l.text(`Our OCR service powering our Document AI stack that enables our users to extract interleaved text and images. OCR 4 is available as the newer model. OCR 3 remains available for existing integrations and production workloads.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our OCR service powering our Document AI stack. OCR 4 is available as the newer model. OCR 3 remains available for existing integrations and production workloads.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'ocr-3-25-12',
  releaseDate: '2025-12-18',
  version: '25.12',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-ocr',
  status: 'Active',
  avatar: { icon: 'ocr', backgroundColor: 'red' },
  weights: [],
  bloglink: 'https://mistral.ai/news/mistral-ocr-3',
  paperlink: null,
  contextLength: null,
  ratings: { 
    speed: 4.0,
    performance: 3.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 2.0, denominator: '/1000 Pages' },
      { type: 'flat', price: 3.0, denominator: '/1000 Annotated Pages' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['mistral-ocr-2512'] },
  capabilities: {
    input: ['image', 'document'],
    output: ['text', 'image'],
    features: ['ocr', 'annotations-structured-ocr', 'batching'],

  },
  metadata: { replacement: 'OCR 4' },
  playground: 'https://console.mistral.ai/build/document-ai/ocr-playground',
  legacy: false,
} as const satisfies StaticModel;
