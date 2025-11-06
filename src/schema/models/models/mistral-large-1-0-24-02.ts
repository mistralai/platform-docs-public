import { StaticModel } from '../schema';
export default {
  name: 'Mistral Large 1.0',
  description: `Our first and larger SOTA model for enterprise use cases with powerfull chat capabilities.`,
  shortDescription: `Our first and larger SOTA model for enterprise use cases.`,
  slug: 'mistral-large-1-0-24-02',
  releaseDate: 'February 26, 2024',
  version: '24.02',
  type: 'Frontier',
  compliance: '',
  status: 'Retired',
  avatar: { icon: 'mistral-large', backgroundColor: 'red' },
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
  identifiers: { apiNames: ['mistral-large-2402'] },
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
