import { StaticModel } from '../schema';
export default {
  name: 'Mixtral 8x22B',
  describe: (l) => ({
    description: l.text(`A large open MoE model competing with much larger dense models.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A large open MoE model competing with much larger dense models.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mixtral-8x22b-0-1-0-3',
  releaseDate: '2024-04-17',
  version: '0.1-0.3',
  frontier: false,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mixtral-8-22b',
  status: 'Retired',
  avatar: { icon: 'mistral-7b', backgroundColor: 'yellow' },
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
        fp4_16: null,
      },
      active: '39',
      contextSize: '64k',
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
        fp4_16: null,
      },
      active: '39',
      contextSize: '64k',
    }
  ],
  bloglink: 'https://mistral.ai/news/mixtral-8x22b',
  paperlink: null,
  contextLength: '64k',
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
  identifiers: { apiNames: ['open-mixtral-8x22b'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '2024-11-30', retirementDate: '2025-03-30', replacement: 'Mistral Small 4'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
