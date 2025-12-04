import { StaticModel } from '../schema';
export default {
  name: 'OCR',
  description: `Our first OCR optimized model.`,
  shortDescription: `Our first OCR optimized model.`,
  slug: 'ocr-25-03',
  releaseDate: 'March 6, 2025',
  version: '25.03',
  frontier: false,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-ocr',
  status: 'Deprecated',
  avatar: { icon: 'ocr', backgroundColor: 'gray' },
  weights: [],
  contextLength: null,
  ratings: { 
    speed: { stars: 0.0, label: 'Slow' },
    performance: { stars: 0.0, label: 'Basic' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
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
    finetuning: [],
  },
  metadata: {deprecationDate: 'December 2, 2025', retirementDate: 'December 31, 2025', replacement: 'OCR'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
