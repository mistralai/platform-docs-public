import { StaticModel } from '../schema';
export default {
  name: 'Magistral Medium 1.0',
  description: `Our first frontier-class reasoning model released June 2025. `,
  shortDescription: `Our first frontier-class reasoning model released June 2025`,
  slug: 'magistral-medium-1-0-25-06',
  releaseDate: 'June 10, 2025',
  version: '25.06',
  type: 'Frontier',
  compliance: '',
  status: 'Deprecated',
  avatar: { icon: 'magistral', backgroundColor: 'red' },
  weights: [],
  contextLength: '40k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 4.0, label: 'Very Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    input: [
      { type: 'range', price: 2.0, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 5.0, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['magistral-medium-2506'] },
  capabilities: {
    input: ['text'],
    output: ['reasoning', 'text'],
    features: ['function-calling', 'document-qna', 'chat-completions', 'batching'],
    finetuning: [],
  },
  metadata: {deprecationDate: 'October 31, 2025', retirementDate: 'November 30, 2025', replacement: 'Magistral Medium 1.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
