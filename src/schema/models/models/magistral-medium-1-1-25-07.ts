import { StaticModel } from '../schema';
export default {
  name: 'Magistral Medium 1.1',
  description: `Our frontier-class reasoning model released July 2025.`,
  shortDescription: `Our frontier-class reasoning model released July 2025.`,
  slug: 'magistral-medium-1-1-25-07',
  releaseDate: 'July 24, 2025',
  version: '25.07',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/magistral-medium-1',
  status: 'Retired',
  avatar: { icon: 'magistral', backgroundColor: 'beige' },
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
  identifiers: { apiNames: ['magistral-medium-2507'] },
  capabilities: {
    input: ['text'],
    output: ['reasoning', 'text'],
    features: ['function-calling', 'document-qna', 'chat-completions', 'batching'],
    finetuning: [],
  },
  metadata: {deprecationDate: 'October 31, 2025', retirementDate: 'November 30, 2025', replacement: 'Magistral Medium 1.2'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
