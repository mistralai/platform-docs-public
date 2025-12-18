import { StaticModel } from '../schema';
export default {
  name: 'OCR 3',
  description: `Our OCR service powering our Document AI stack that enables our users to extract interleaved text and images`,
  shortDescription: `Our OCR service powering our Document AI stack.`,
  slug: 'ocr-3-25-12',
  releaseDate: 'December 15, 2025',
  version: '25.12',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-ocr',
  status: 'Active',
  avatar: { icon: 'ocr', backgroundColor: 'red' },
  weights: [],
  contextLength: null,
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
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
  identifiers: { apiNames: ['mistral-ocr-2512', 'mistral-ocr-latest'] },
  capabilities: {
    input: ['image', 'document'],
    output: ['text', 'image'],
    features: ['bbox-extraction', 'ocr', 'annotations-structured-ocr', 'batching'],
    finetuning: [],
  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
