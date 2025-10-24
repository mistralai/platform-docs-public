import { StaticModel } from '../schema';
export default {
  name: 'Mistral Next',
  description: `A prototype model, designed to be brief and concise.`,
  shortDescription: `A prototype model, designed to be brief and concise.`,
  slug: 'mistral-next',
  releaseDate: 'February 26, 2024',
  version: '',
  type: 'Frontier',
  compliance: '',
  status: 'Retired',
  avatar: { icon: 'mistral-7b', backgroundColor: 'orange' },
  weights: [],
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
  identifiers: { apiNames: [] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],
    finetuning: [],
  },
  metadata: {deprecationDate: '', retirementDate: '', replacement: 'Mistral Medium 3.1'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
