import { StaticModel } from '../schema';
export default {
  name: 'Magistral Medium 1.0',
  describe: (l) => ({
    description: l.text(`Our first frontier-class reasoning model released June 2025. `, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our first frontier-class reasoning model released June 2025`, { context: 'Short description of an AI model' }),
  }),
  slug: 'magistral-medium-1-0-25-06',
  releaseDate: '2025-06-10',
  version: '25.06',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/magistral-medium-1',
  status: 'Retired',
  avatar: { icon: 'magistral', backgroundColor: 'beige' },
  weights: [],
  bloglink: 'https://mistral.ai/news/magistral',
  paperlink: 'https://arxiv.org/pdf/2506.10910',
  contextLength: '40k',
  ratings: { 
    speed: 3.0,
    performance: 4.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 2.0, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 5.0, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['magistral-medium-2506'] },
  capabilities: {
    input: ['text'],
    output: ['reasoning', 'text'],
    features: ['function-calling', 'document-qna', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2025-10-31', retirementDate: '2025-11-30', replacement: 'Mistral Medium 3.5'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
