import { StaticModel } from '../schema';
export default {
  name: 'Mistral Moderation',
  describe: (l) => ({
    description: l.text(`Our moderation service that enables our users to detect harmful text content`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our moderation service that enables our users to detect harmful text content.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-moderation-24-11',
  releaseDate: '2024-11-06',
  version: '24.11',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-moderation',
  status: 'Deprecated',
  avatar: { icon: 'moderation', backgroundColor: 'beige' },
  weights: [],
  bloglink: 'https://mistral.ai/news/mistral-moderation',
  paperlink: null,
  contextLength: '8k',
  ratings: { 
    speed: 4.0,
    performance: 3.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['mistral-moderation-2411'] },
  capabilities: {
    input: ['text'],
    output: ['scores'],
    features: ['moderations', 'batching'],

  },
  metadata: {deprecationDate: '2026-03-31', retirementDate: '2026-06-30', replacement: 'Mistral Moderation 2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
