import { StaticModel } from '../schema';
export default {
  name: 'Ministral 3B',
  description: `World’s best edge model.`,
  shortDescription: `World’s best edge model.`,
  slug: 'ministral-3b-24-1',
  releaseDate: 'October 9, 2024',
  version: '24.1',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/ministral-1-3b',
  status: 'Deprecated',
  avatar: { icon: 'ministral', backgroundColor: 'lime' },
  weights: [],
  contextLength: '128k',
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 1.0, label: 'Basic' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.04, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.04, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['ministral-3b-2410'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],
    finetuning: ['text', 'classifier'],
  },
  metadata: {deprecationDate: 'December 2, 2025', retirementDate: 'December 31, 2025', replacement: 'Ministral 3 3B'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
