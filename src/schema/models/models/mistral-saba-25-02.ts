import { StaticModel } from '../schema';
export default {
  name: 'Mistral Saba',
  description: `A finetuned Small model trained on meticulously curated datasets from across the Middle East and South Asia.`,
  shortDescription: `A finetuned Small model trained on meticulously curated datasets.`,
  slug: 'mistral-saba-25-02',
  releaseDate: 'February 17, 2025',
  version: '25.02',
  frontier: false,
  class: 'Specialist',
  type: 'Premier',
  compliance: '',
  status: 'Retired',
  avatar: { icon: 'mistral-saba', backgroundColor: 'red' },
  weights: [],
  contextLength: '32k',
  ratings: { 
    speed: { stars: 0.0, label: 'Slow' },
    performance: { stars: 0.0, label: 'Basic' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
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
    finetuning: [],
  },
  metadata: {deprecationDate: 'June 10, 2025', retirementDate: 'September 30, 2025', replacement: 'Mistral Small 3.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
