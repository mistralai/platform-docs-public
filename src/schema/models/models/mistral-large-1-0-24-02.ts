import { StaticModel } from '../schema';
export default {
  name: 'Mistral Large 1.0',
  describe: (l) => ({
    description: l.text(`Our first and larger SOTA model for enterprise use cases with powerfull chat capabilities.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our first and larger SOTA model for enterprise use cases.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-large-1-0-24-02',
  releaseDate: '2024-02-26',
  version: '24.02',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-large-1',
  status: 'Retired',
  avatar: { icon: 'mistral-large', backgroundColor: 'yellow' },
  weights: [],
  bloglink: 'https://mistral.ai/news/mistral-large',
  paperlink: null,
  contextLength: '32k',
  ratings: { 
    speed: 0.0,
    performance: 0.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
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

  },
  metadata: {deprecationDate: '2024-11-30', retirementDate: '2025-06-16', replacement: 'Mistral Large 3'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
