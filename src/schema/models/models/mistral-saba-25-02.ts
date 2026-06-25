import { StaticModel } from '../schema';
export default {
  name: 'Mistral Saba',
  describe: (l) => ({
    description: l.text(`A finetuned Small model trained on meticulously curated datasets from across the Middle East and South Asia.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A finetuned Small model trained on meticulously curated datasets.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-saba-25-02',
  releaseDate: '2025-02-17',
  version: '25.02',
  frontier: false,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-saba',
  status: 'Retired',
  avatar: { icon: 'mistral-saba', backgroundColor: 'amber' },
  weights: [],
  bloglink: 'https://mistral.ai/news/mistral-saba',
  paperlink: null,
  contextLength: '32k',
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
  identifiers: { apiNames: ['mistral-saba-2502', 'mistral-saba-latest'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '2025-06-10', retirementDate: '2025-09-30', replacement: 'Mistral Small 4'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
