import { StaticModel } from '../schema';
export default {
  name: 'Magistral Medium 1.2',
  describe: (l) => ({
    description: l.text(`Our frontier-class multimodal reasoning model update of September 2025.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our frontier-class multimodal reasoning model.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'magistral-medium-1-2-25-09',
  releaseDate: '2025-09-18',
  version: '25.09',
  frontier: true,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/magistral-medium-1',
  status: 'Active',
  avatar: { icon: 'magistral', backgroundColor: 'beige' },
  weights: [],
  bloglink: null,
  paperlink: null,
  contextLength: '128k',
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
  identifiers: { apiNames: ['magistral-medium-2509', 'magistral-medium-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['reasoning', 'text'],
    features: ['function-calling', 'document-qna', 'chat-completions', 'batching'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
