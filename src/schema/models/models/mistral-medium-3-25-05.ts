import { StaticModel } from '../schema';
export default {
  name: 'Mistral Medium 3',
  describe: (l) => ({
    description: l.text(`Our frontier-class multimodal model released May 2025. Learn more in our [blog post](https://mistral.ai/news/mistral-medium-3/)`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our frontier-class multimodal model released May 2025.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-medium-3-25-05',
  releaseDate: '2025-05-07',
  version: '25.05',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-medium-3',
  status: 'Deprecated',
  avatar: { icon: 'mistral-medium', backgroundColor: 'blue' },
  weights: [],
  bloglink: 'https://mistral.ai/news/mistral-medium-3/',
  paperlink: null,
  contextLength: '128k',
  ratings: { 
    speed: 2.0,
    performance: 4.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.4, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 2.0, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['mistral-medium-2505'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'agents-conversations', 'connectors', 'batching', 'predicted-outputs'],

  },
  metadata: {deprecationDate: '2026-05-22', retirementDate: '2026-08-31', replacement: 'Mistral Medium 3.5'},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
