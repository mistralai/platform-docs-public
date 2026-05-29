import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small 3.1',
  describe: (l) => ({
    description: l.text(`A new leader in the small models category with image understanding capabilities, released March 2025.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A new leader in the small models category with image understanding capabilities.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-small-3-1-25-03',
  releaseDate: '2025-03-17',
  version: '25.03',
  frontier: false,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-small-3',
  status: 'Retired',
  avatar: { icon: 'mistral-small', backgroundColor: 'gray' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Instruct-2503',
      parameters: '24',
      minGpuRam: {
        bf16: '78',
        fp8: '39',
        fp4: '20',
        fp4_16: '16',
      },
      active: '24',
      contextSize: '128k',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Base-2503',
      parameters: '24',
      minGpuRam: {
        bf16: '78',
        fp8: '39',
        fp4: '20',
        fp4_16: '16',
      },
      active: '24',
      contextSize: '128k',
    }
  ],
  bloglink: 'https://mistral.ai/news/mistral-small-3-1 ',
  paperlink: null,
  contextLength: '128k',
  ratings: { 
    speed: 3.0,
    performance: 3.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.3, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['mistral-small-2503'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'agents-conversations', 'connectors', 'batching', 'predicted-outputs'],

  },
  metadata: {deprecationDate: '2025-11-06', retirementDate: '2025-11-30', replacement: 'Mistral Small 3.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
