import { StaticModel } from '../schema';
export default {
  name: 'Mistral Medium 3.1',
  description: `Our frontier-class multimodal model released August 2025. Improving tone and performance.`,
  shortDescription: `Our frontier-class multimodal model released August 2025.`,
  slug: 'mistral-medium-3-1-25-08',
  releaseDate: 'August 12, 2025',
  version: '25.08',
  frontier: true,
  class: 'Generalist',
  type: 'Premier',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'mistral-medium', backgroundColor: 'blue' },
  weights: [],
  contextLength: '128k',
  ratings: { 
    speed: { stars: 2.0, label: 'Slow' },
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
  identifiers: { apiNames: ['mistral-medium-2508', 'mistral-medium-latest', 'mistral-large-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'predicted-outputs', 'document-qna', 'prefix', 'batching', 'agents-conversations', 'chat-completions', 'connectors'],
    finetuning: ['text'],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
