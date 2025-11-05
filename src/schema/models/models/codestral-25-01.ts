import { StaticModel } from '../schema';
export default {
  name: 'Codestral',
  description: `Our cutting-edge language model for coding. Codestral specializes in low-latency, high-frequency tasks such as fill-in-the-middle (FIM), code correction and test generation.`,
  shortDescription: `Our cutting-edge language model for coding.`,
  slug: 'codestral-25-01',
  releaseDate: 'January 13, 2025',
  version: '25.01',
  type: 'Frontier',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'codestral', backgroundColor: 'pink' },
  weights: [],
  contextLength: '128k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
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
    finetuning: [],
  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
