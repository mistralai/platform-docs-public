import { StaticModel } from '../schema';
export default {
  name: 'OCR',
  describe: (l) => ({
    description: l.text(`Our first OCR optimized model.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our first OCR optimized model.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'ocr-25-03',
  releaseDate: '2025-03-06',
  version: '25.03',
  frontier: false,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-ocr',
  status: 'Deprecated',
  avatar: { icon: 'ocr', backgroundColor: 'gray' },
  weights: [],
  bloglink: 'https://mistral.ai/news/mistral-ocr',
  paperlink: null,
  contextLength: null,
  ratings: { 
    speed: 0.0,
    performance: 0.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['mistral-ocr-2503'] },
  capabilities: {
    input: ['image', 'document'],
    output: ['text', 'image'],
    features: [],

  },
  metadata: {deprecationDate: '2025-12-02', retirementDate: '2025-12-31', replacement: 'OCR 3'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
