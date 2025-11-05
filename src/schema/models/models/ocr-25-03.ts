import { StaticModel } from '../schema';
export default {
  name: 'OCR',
  description: `Our first OCR optimized model.`,
  shortDescription: `Our first OCR optimized model.`,
  slug: 'ocr-25-03',
  releaseDate: 'March 6, 2025',
  version: '25.03',
  type: 'Frontier',
  compliance: '',
  status: 'Deprecated',
  avatar: { icon: 'ocr', backgroundColor: 'purple' },
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
  metadata: {deprecationDate: 'June 10, 2025', retirementDate: 'March 31, 2026', replacement: 'OCR'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
