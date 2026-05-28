import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small Creative',
  describe: (l) => ({
    description: l.text(`An experimental specialized small model trained on meticulously curated data, designed for creative writing, narrative generation, roleplay and character-driven dialog, general-purpose instruction following and conversational agents.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A specialized model designed for creative writing and dynamic character interaction.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-small-creative-25-12',
  releaseDate: '2025-12-11',
  version: '25.12',
  frontier: false,
  class: 'Specialist',
  type: 'Labs',
  legalButton: 'DEFAULT',
  status: 'Deprecated',
  avatar: { icon: 'mistral-small', backgroundColor: 'yellow' },
  weights: [],
  bloglink: null,
  paperlink: null,
  contextLength: '32k',
  ratings: { 
    speed: 3.0,
    performance: 3.0, input: 4.0, output: 2.0 },
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
    features: ['document-qna', 'chat-completions', 'batching', 'structured-outputs', 'function-calling'],

  },
  metadata: {deprecationDate: '2026-03-31', retirementDate: '2026-04-30', replacement: 'Mistral Nemo 12B'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
