import { StaticModel } from '../schema';
export default {
  name: 'Codestral',
  describe: (l) => ({
    description: l.text(`Our cutting-edge language model for coding. Codestral specializes in low-latency, high-frequency tasks such as fill-in-the-middle (FIM), code correction and test generation.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our cutting-edge language model for coding.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'codestral-25-01',
  releaseDate: '2025-01-13',
  version: '25.01',
  frontier: false,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/codestral',
  status: 'Retired',
  avatar: { icon: 'codestral', backgroundColor: 'orange' },
  weights: [],
  bloglink: 'https://mistral.ai/news/codestral-2501',
  paperlink: null,
  contextLength: '128k',
  ratings: {
    speed: 3.0,
    performance: 3.0, input: 4.0, output: 2.0 },
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
  identifiers: { apiNames: ['codestral-2501'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'predicted-outputs', 'document-qna', 'prefix', 'chat-completions', 'batching', 'fim'],

  },
  metadata: {deprecationDate: '2025-11-06', retirementDate: '2025-11-30', replacement: 'Codestral'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
