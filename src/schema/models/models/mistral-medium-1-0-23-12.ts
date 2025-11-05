import { StaticModel } from '../schema';
export default {
  name: 'Mistral Medium 1.0',
  description: `Our first SOTA enterprise grade model.`,
  shortDescription: `Our first SOTA enterprise grade model.`,
  slug: 'mistral-medium-1-0-23-12',
  releaseDate: 'December 11, 2023',
  version: '23.12',
  type: 'Frontier',
  compliance: '',
  status: 'Retired',
  avatar: { icon: 'mistral-medium', backgroundColor: 'blue' },
  weights: [],
  contextLength: '32k',
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
  identifiers: { apiNames: ['mistral-medium-2312'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],
    finetuning: [],
  },
  metadata: {deprecationDate: 'November 30, 2024', retirementDate: 'June 16, 2025', replacement: 'Mistral Medium 3.1'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
