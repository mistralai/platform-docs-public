import { StaticModel } from '../schema';
export default {
  name: 'Mistral Medium 3',
  description: `Our frontier-class multimodal model released May 2025. Learn more in our [blog post](https://mistral.ai/news/mistral-medium-3/)`,
  shortDescription: `Our frontier-class multimodal model released May 2025.`,
  slug: 'mistral-medium-3-25-05',
  releaseDate: 'May 7, 2025',
  version: '25.05',
  type: 'Frontier',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'mistral-medium', backgroundColor: 'yellow' },
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
  identifiers: { apiNames: ['mistral-medium-2505'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'agents-conversations', 'connectors', 'batching', 'predicted-outputs'],
    finetuning: [],
  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
