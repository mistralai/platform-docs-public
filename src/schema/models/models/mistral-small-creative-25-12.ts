import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small Creative',
  description: `An experimental specialized small model trained on meticulously curated data, designed for creative writing, narrative generation, roleplay and character-driven dialog, general-purpose instruction following and conversational agents.`,
  shortDescription: `A specialized model designed for creative writing and dynamic character interaction.`,
  slug: 'mistral-small-creative-25-12',
  releaseDate: 'December 16, 2025',
  version: '25.12',
  frontier: false,
  class: 'Specialist',
  type: 'Labs',
  legalButton: 'DEFAULT',
  status: 'Active',
  avatar: { icon: 'mistral-small', backgroundColor: 'pink' },
  weights: [],
  contextLength: '32k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.3, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['labs-mistral-small-creative'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['document-qna', 'chat-completions', 'batching', 'structured-outputs'],
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
