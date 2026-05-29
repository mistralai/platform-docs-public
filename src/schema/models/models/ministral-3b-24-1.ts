import { StaticModel } from '../schema';
export default {
  name: 'Ministral 3B',
  describe: (l) => ({
    description: l.text(`World’s best edge model.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`World’s best edge model.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'ministral-3b-24-1',
  releaseDate: '2024-10-09',
  version: '24.1',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/ministral-1-3b',
  status: 'Deprecated',
  avatar: { icon: 'ministral', backgroundColor: 'lime' },
  weights: [],
  bloglink: 'https://mistral.ai/news/ministraux',
  paperlink: null,
  contextLength: '128k',
  ratings: { 
    speed: 4.0,
    performance: 1.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.04, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.04, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['ministral-3b-2410'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2025-12-02', retirementDate: '2025-12-31', replacement: 'Ministral 3 3B'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
