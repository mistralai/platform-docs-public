import { StaticModel } from '../schema';
export default {
  name: 'Mistral 7B',
  describe: (l) => ({
    description: l.text(`An update to our first open model with better context.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`An update to our first open model with better context.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-7b-0-2',
  releaseDate: '2023-12-11',
  version: '0.2',
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
      url: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2',
      parameters: '7',
      minGpuRam: {
        bf16: '20',
        fp8: '10',
        fp4: '5',
        fp4_16: null,
      },
      active: '7',
      contextSize: '32k',
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
        fp4_16: null,
      },
      active: '7',
      contextSize: '32k',
    }
  ],
  bloglink: null,
  paperlink: null,
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
  identifiers: { apiNames: ['open-mistral-7b'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '2024-11-30', retirementDate: '2025-03-30', replacement: 'Ministral 3 8B'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
