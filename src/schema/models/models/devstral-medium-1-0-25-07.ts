import { StaticModel } from '../schema';
export default {
  name: 'Devstral Medium 1.0',
  description: `An enterprise grade text model, that excels at using tools to explore codebases, editing multiple files and power software engineering agents.`,
  shortDescription: `An enterprise grade text model, that excels at SWE use cases.`,
  slug: 'devstral-medium-1-0-25-07',
  releaseDate: 'July 10, 2025',
  version: '25.07',
  type: 'Frontier',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'devstral', backgroundColor: 'green' },
  weights: [],
  contextLength: '128k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 4.0, label: 'Very Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    input: [
      { type: 'range', price: 0.4, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 2.0, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['devstral-medium-2507', 'devstral-medium-latest'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
