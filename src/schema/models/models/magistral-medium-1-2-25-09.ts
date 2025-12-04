import { StaticModel } from '../schema';
export default {
  name: 'Magistral Medium 1.2',
  description: `Our frontier-class multimodal reasoning model update of September 2025.`,
  shortDescription: `Our frontier-class multimodal reasoning model.`,
  slug: 'magistral-medium-1-2-25-09',
  releaseDate: 'September 18, 2025',
  version: '25.09',
  frontier: true,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/magistral-medium-1',
  status: 'Active',
  avatar: { icon: 'magistral', backgroundColor: 'beige' },
  weights: [],
  contextLength: '128k',
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
  identifiers: { apiNames: ['magistral-medium-2509', 'magistral-medium-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['reasoning', 'text'],
    features: ['function-calling', 'document-qna', 'chat-completions', 'batching'],
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
