import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small 1.0',
  describe: (l) => ({
    description: l.text(`An enterprise grade small model for efficiency.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`An enterprise grade small model for efficiency.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-small-1-0-24-02',
  releaseDate: '2024-02-26',
  version: '24.02',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-small-1',
  status: 'Retired',
  avatar: { icon: 'mistral-small', backgroundColor: 'purple' },
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
  identifiers: { apiNames: ['mistral-small-2402'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '2024-11-30', retirementDate: '2025-06-16', replacement: 'Mistral Small 3.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
