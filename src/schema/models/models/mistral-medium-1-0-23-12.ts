import { StaticModel } from '../schema';
export default {
  name: 'Mistral Medium 1.0',
  describe: (l) => ({
    description: l.text(`Our first SOTA enterprise grade model.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our first SOTA enterprise grade model.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-medium-1-0-23-12',
  releaseDate: '2023-12-11',
  version: '23.12',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-medium-1',
  status: 'Retired',
  avatar: { icon: 'mistral-medium', backgroundColor: 'blue' },
  weights: [],
  bloglink: 'https://mistral.ai/news/la-plateforme',
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
  identifiers: { apiNames: ['mistral-medium-2312'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '2024-11-30', retirementDate: '2025-06-16', replacement: 'Mistral Medium 3.1'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
