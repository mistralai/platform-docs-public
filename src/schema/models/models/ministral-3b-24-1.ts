import { StaticModel } from '../schema';
export default {
  name: 'Ministral 3B',
  description: `World’s best edge model.`,
  shortDescription: `World’s best edge model.`,
  slug: 'ministral-3b-24-1',
  releaseDate: 'October 9, 2024',
  version: '24.1',
  frontier: true,
  class: 'Generalist',
  type: 'Premier',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'ministral', backgroundColor: 'lime' },
  weights: [],
  contextLength: '128k',
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 1.0, label: 'Basic' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    input: [
      { type: 'range', price: 0.04, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.04, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['ministral-3b-2410', 'ministral-3b-latest'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],
    finetuning: ['text', 'classifier'],
  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
