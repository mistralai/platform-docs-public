import { StaticModel } from '../schema';
export default {
  name: 'Codestral',
  description: `Our first cutting-edge language model for coding and FIM, released under the MNPL license.`,
  shortDescription: `Our first cutting-edge language model for coding and FIM.`,
  slug: 'codestral-24-05',
  releaseDate: 'May 29, 2024',
  version: '24.05',
  type: 'Frontier',
  compliance: '',
  status: 'Retired',
  avatar: { icon: 'codestral', backgroundColor: 'purple' },
  weights: [
    {
      name: 'Weights',
      license: 'MNPL',
      licenseUrl: 'https://mistral.ai/static/licenses/MNPL-0.1.md',
      url: 'https://huggingface.co/mistralai/Codestral-22B-v0.1',
      parameters: '22',
      minGpuRam: {
        bf16: '52',
        fp8: '26',
        fp4: '',
      },
      active: '22',
      contextSize: '32k',
    }
  ],
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
  identifiers: { apiNames: ['codestral-2405'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],
    finetuning: [],
  },
  metadata: {deprecationDate: 'December 2, 2024', retirementDate: 'June 16, 2025', replacement: 'Codestral'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
