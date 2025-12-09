import { StaticModel } from '../schema';
export default {
  name: 'Mistral Next',
  description: `A prototype model, designed to be brief and concise.`,
  shortDescription: `A prototype model, designed to be brief and concise.`,
  slug: 'mistral-next',
  releaseDate: 'February 26, 2024',
  version: '',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-next',
  status: 'Retired',
  avatar: { icon: 'mistral-large', backgroundColor: 'orange' },
  weights: [],
  contextLength: null,
  ratings: { 
    speed: { stars: 0.0, label: 'Slow' },
    performance: { stars: 0.0, label: 'Basic' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
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
    finetuning: [],
  },
  metadata: {deprecationDate: '', retirementDate: '', replacement: 'Mistral Large 3'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
