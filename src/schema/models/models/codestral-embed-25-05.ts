import { StaticModel } from '../schema';
export default {
  name: 'Codestral Embed',
  describe: (l) => ({
    description: l.text(`Our state-of-the-art semantic for extracting representation of code extracts`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our state-of-the-art semantic for extracting representation of code extracts`, { context: 'Short description of an AI model' }),
  }),
  slug: 'codestral-embed-25-05',
  releaseDate: '2025-05-28',
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
    speed: 4.0,
    performance: 4.0, input: 4.0, output: 2.0 },
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

  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
