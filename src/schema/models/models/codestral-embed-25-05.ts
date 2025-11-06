import { StaticModel } from '../schema';
export default {
  name: 'Codestral Embed',
  description: `Our state-of-the-art semantic for extracting representation of code extracts`,
  shortDescription: `Our state-of-the-art semantic for extracting representation of code extracts`,
  slug: 'codestral-embed-25-05',
  releaseDate: 'May 28, 2025',
  version: '25.05',
  type: 'Frontier',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'codestral-embed', backgroundColor: 'beige' },
  weights: [],
  contextLength: '8k',
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 4.0, label: 'Very Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    input: [
      { type: 'flat', price: 0.15, denominator: '/M Tokens' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['codestral-embed'] },
  capabilities: {
    input: ['text'],
    output: [],
    features: ['embeddings', 'batching'],
    finetuning: [],
  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
