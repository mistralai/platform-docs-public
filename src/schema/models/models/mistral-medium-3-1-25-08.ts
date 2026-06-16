import { StaticModel } from '../schema';
export default {
  name: 'Mistral Medium 3.1',
  describe: (l) => ({
    description: l.text(`Our frontier-class multimodal model released August 2025. Improving tone and performance.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our frontier-class multimodal model released August 2025.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-medium-3-1-25-08',
  releaseDate: '2025-08-12',
  version: '25.08',
  frontier: true,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-medium-3',
  status: 'Deprecated',
  avatar: { icon: 'mistral-medium', backgroundColor: 'blue' },
  weights: [],
  bloglink: null,
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
  identifiers: { apiNames: ['mistral-medium-2508'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'predicted-outputs', 'document-qna', 'prefix', 'batching', 'agents-conversations', 'chat-completions', 'connectors'],

  },
  metadata: {deprecationDate: '2026-05-22', retirementDate: '2026-08-31', replacement: 'Mistral Medium 3.5'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
