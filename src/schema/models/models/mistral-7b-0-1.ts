import { StaticModel } from '../schema';
export default {
  name: 'Mistral 7B',
  describe: (l) => ({
    description: l.text(`Our very first open model, SOTA competing against models up to 2 to 3x larger.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our very first open model, SOTA competing against models up to 2 to 3x larger.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-7b-0-1',
  releaseDate: '2023-09-27',
  version: '0.1',
  frontier: false,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-7-b',
  status: 'Retired',
  avatar: { icon: 'mistral-7b', backgroundColor: 'gray' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.1',
      parameters: '7',
      minGpuRam: {
        bf16: '16',
        fp8: '8',
        fp4: '4',
        fp4_16: null,
      },
      active: '7',
      contextSize: '8k',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-7B-v0.1',
      parameters: '7',
      minGpuRam: {
        bf16: '16',
        fp8: '8',
        fp4: '4',
        fp4_16: null,
      },
      active: '7',
      contextSize: '8k',
    }
  ],
  bloglink: 'https://mistral.ai/news/announcing-mistral-7b',
  paperlink: 'https://arxiv.org/pdf/2310.06825',
  contextLength: '8k',
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
  metadata: {deprecationDate: '2024-11-30', retirementDate: '2025-03-30', replacement: 'Ministral 3 8B'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
