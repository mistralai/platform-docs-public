import { StaticModel } from '../schema';
export default {
  name: 'Mistral Next',
  describe: (l) => ({
    description: l.text(`A prototype model, designed to be brief and concise.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A prototype model, designed to be brief and concise.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-next',
  releaseDate: '2024-02-26',
  version: '',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-next',
  status: 'Retired',
  avatar: { icon: 'mistral-large', backgroundColor: 'orange' },
  weights: [],
  bloglink: 'https://mistral.ai/news/le-chat-mistral',
  paperlink: null,
  contextLength: null,
  ratings: { 
    speed: 0.0,
    performance: 0.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: [] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '', retirementDate: '', replacement: 'Mistral Large 3'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
