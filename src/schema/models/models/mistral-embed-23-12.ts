import { StaticModel } from '../schema';
export default {
  name: 'Mistral Embed',
  describe: (l) => ({
    description: l.text(`Our state-of-the-art semantic for extracting representation of code extracts`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our state-of-the-art semantic for extracting representation of code extracts`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-embed-23-12',
  releaseDate: '2023-12-11',
  version: '23.12',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-embed',
  status: 'Active',
  avatar: { icon: 'mistral-embed', backgroundColor: 'beige' },
  weights: [],
  bloglink: 'https://mistral.ai/news/la-plateforme',
  paperlink: null,
  contextLength: '8k',
  ratings: { 
    speed: 4.0,
    performance: 2.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['mistral-embed-2312', 'mistral-embed'] },
  capabilities: {
    input: ['text'],
    output: ['embeddings'],
    features: ['embeddings', 'batching'],

  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
