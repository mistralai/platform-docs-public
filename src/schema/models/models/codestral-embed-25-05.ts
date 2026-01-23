import { StaticModel } from '../schema';
export default {
  name: 'Codestral Embed',
  description: `Our state-of-the-art semantic for extracting representation of code extracts`,
  shortDescription: `Our state-of-the-art semantic for extracting representation of code extracts`,
  slug: 'codestral-embed-25-05',
  releaseDate: 'May 28, 2025',
  version: '25.05',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/codestral',
  status: 'Active',
  avatar: { icon: 'codestral-embed', backgroundColor: 'orange' },
  weights: [],
  bloglink: 'https://mistral.ai/news/codestral-embed',
  paperlink: null,
  contextLength: '8k',
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 4.0, label: 'Very Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.15, denominator: '/M Tokens' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['codestral-embed-2505', 'codestral-embed'] },
  capabilities: {
    input: ['text'],
    output: ['embeddings'],
    features: ['embeddings', 'batching'],
    finetuning: [],
  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
