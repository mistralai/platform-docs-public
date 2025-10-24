import { StaticModel } from '../schema';
export default {
  name: 'Mixtral 8x7B',
  description: `Our first open MoE model, SOTA competing against models up to 2 to 3x larger.`,
  shortDescription: `Our first open MoE model, SOTA competing against models up to 2 to 3x larger.`,
  slug: 'mixtral-8x7b-0-1',
  releaseDate: 'December 11, 2023',
  version: '0.1',
  type: 'Open',
  compliance: '',
  status: 'Retired',
  avatar: { icon: 'mistral-7b', backgroundColor: 'beige' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1',
      parameters: '47',
      minGpuRam: {
        bf16: '94',
        fp8: '48',
        fp4: '13',
      },
      active: '13',
      contextSize: '32',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mixtral-8x7B-v0.1',
      parameters: '47',
      minGpuRam: {
        bf16: '94',
        fp8: '48',
        fp4: '13',
      },
      active: '13',
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
  identifiers: { apiNames: ['open-mixtral-8x7b'] },
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
