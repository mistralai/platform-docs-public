import { StaticModel } from '../schema';
export default {
  name: 'Mistral 7B',
  description: `An update to our first open model with better context.`,
  shortDescription: `An update to our first open model with better context.`,
  slug: 'mistral-7b-0-2',
  releaseDate: 'December 11, 2023',
  version: '0.2',
  type: 'Open',
  compliance: '',
  status: 'Retired',
  avatar: { icon: 'mistral-7b', backgroundColor: 'pink' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2',
      parameters: '7',
      minGpuRam: {
        bf16: '20',
        fp8: '10',
        fp4: '5',
      },
      active: '7',
      contextSize: '32',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://models.mistralcdn.com/mistral-7b-v0-2/mistral-7B-v0.2.tar',
      parameters: '7',
      minGpuRam: {
        bf16: '20',
        fp8: '10',
        fp4: '5',
      },
      active: '7',
      contextSize: '32',
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
  identifiers: { apiNames: ['open-mistral-7b'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],
    finetuning: [],
  },
  metadata: {deprecationDate: 'November 30, 2024', retirementDate: 'March 30, 2025', replacement: 'Ministral 8B'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
