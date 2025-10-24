import { StaticModel } from '../schema';
export default {
  name: 'Mixtral 8x22B',
  description: `A large open MoE model competing with much larger dense models.`,
  shortDescription: `A large open MoE model competing with much larger dense models.`,
  slug: 'mixtral-8x22b-0-1-0-3',
  releaseDate: 'April 17, 2024',
  version: '0.1-0.3',
  type: 'Open',
  compliance: '',
  status: 'Retired',
  avatar: { icon: 'mistral-7b', backgroundColor: 'gray' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mixtral-8x22B-Instruct-v0.1',
      parameters: '141',
      minGpuRam: {
        bf16: '283',
        fp8: '142',
        fp4: '71',
      },
      active: '39',
      contextSize: '64',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mixtral-8x22B-v0.1',
      parameters: '141',
      minGpuRam: {
        bf16: '283',
        fp8: '142',
        fp4: '71',
      },
      active: '39',
      contextSize: '64',
    }
  ],
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
  identifiers: { apiNames: ['open-mixtral-8x22b'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],
    finetuning: [],
  },
  metadata: {deprecationDate: 'November 30, 2024', retirementDate: 'March 30, 2025', replacement: 'Mistral Small 3.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
