import { StaticModel } from '../schema';
export default {
  name: 'Devstral Medium 1.0',
  describe: (l) => ({
    description: l.text(`An enterprise grade text model, that excels at using tools to explore codebases, editing multiple files and power software engineering agents.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`An enterprise grade text model, that excels at SWE use cases.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'devstral-medium-1-0-25-07',
  releaseDate: '2025-07-10',
  version: '25.07',
  frontier: false,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/devstral-medium-1',
  status: 'Deprecated',
  avatar: { icon: 'devstral', backgroundColor: 'green' },
  weights: [],
  bloglink: 'https://mistral.ai/news/devstral-2507',
  paperlink: null,
  contextLength: '128k',
  ratings: { 
    speed: 3.0,
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
  identifiers: { apiNames: ['devstral-medium-2507'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2026-02-27', retirementDate: '2026-05-31', replacement: 'Devstral 2'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
