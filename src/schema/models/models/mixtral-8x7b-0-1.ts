import { StaticModel } from '../schema';
export default {
  name: 'Mixtral 8x7B',
  describe: (l) => ({
    description: l.text(`Our first open MoE model, SOTA competing against models up to 2 to 3x larger.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our first open MoE model, SOTA competing against models up to 2 to 3x larger.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mixtral-8x7b-0-1',
  releaseDate: '2023-12-11',
  version: '0.1',
  frontier: false,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mixtral-8-7b',
  status: 'Retired',
  avatar: { icon: 'mistral-7b', backgroundColor: 'green' },
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
        fp4_16: null,
      },
      active: '13',
      contextSize: '32k',
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
        fp4_16: null,
      },
      active: '13',
      contextSize: '32k',
    }
  ],
  bloglink: 'https://mistral.ai/news/mixtral-of-experts',
  paperlink: 'https://arxiv.org/pdf/2401.04088',
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
  identifiers: { apiNames: ['open-mixtral-8x7b'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '2024-11-30', retirementDate: '2025-03-30', replacement: 'Mistral Small 3.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
