import { StaticModel } from '../schema';
export default {
  name: 'Codestral',
  describe: (l) => ({
    description: l.text(`Our cutting-edge language model for code completion released end of July 2025, Codestral specializes in low-latency, high-frequency tasks such as fill-in-the-middle (FIM) and code generation.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our cutting-edge language model for code completion released end of July 2025.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'codestral-25-08',
  releaseDate: '2025-07-30',
  version: '25.08',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/codestral',
  status: 'Active',
  avatar: { icon: 'codestral', backgroundColor: 'yellow' },
  weights: [],
  bloglink: 'https://mistral.ai/news/codestral-25-08',
  paperlink: null,
  contextLength: '128k',
  ratings: { 
    speed: 3.0,
    performance: 4.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.3, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.9, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['codestral-2508', 'codestral-latest'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'predicted-outputs', 'document-qna', 'prefix', 'batching', 'chat-completions', 'fim'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
