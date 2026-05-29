import { StaticModel } from '../schema';
export default {
  name: 'Mistral Moderation 2',
  describe: (l) => ({
    description: l.text(`Our latest moderation model with 128k context window and jailbreaking detection. Strong performance on complex multilingual data including long multi-turn conversations.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our latest moderation model with 128k context window and jailbreaking detection.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-moderation-26-03',
  releaseDate: '2026-03-01',
  version: '26.03',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-moderation',
  status: 'Active',
  avatar: { icon: 'moderation', backgroundColor: 'beige' },
  weights: [],
  bloglink: null,
  paperlink: null,
  contextLength: '128k',
  ratings: {
    speed: 5.0,
    performance: 3.5, input: 5.0, output: 2.0 },
  pricing: {
    type: 'flat',
    free: true,
    price: 0,
    denominator: '/M Tokens',
  },
  identifiers: { apiNames: ['mistral-moderation-2603'] },
  capabilities: {
    input: ['text'],
    output: ['scores'],
    features: ['moderations', 'batching'],

  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
