import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small 3.0',
  describe: (l) => ({
    description: l.text(`A small efficient and powerfull 24B open model for personal or commercial use.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A small efficient and powerfull 24B open model for personal or commercial use.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-small-3-0-25-01',
  releaseDate: '2025-01-30',
  version: '25.01',
  frontier: false,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-small-3',
  status: 'Retired',
  avatar: { icon: 'mistral-small', backgroundColor: 'purple' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Small-24B-Instruct-2501',
      parameters: '24',
      minGpuRam: {
        bf16: '54',
        fp8: '27',
        fp4: '14',
        fp4_16: null,
      },
      active: '24',
      contextSize: '32k',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Small-24B-Base-2501',
      parameters: '24',
      minGpuRam: {
        bf16: '54',
        fp8: '27',
        fp4: '14',
        fp4_16: null,
      },
      active: '24',
      contextSize: '32k',
    }
  ],
  bloglink: 'https://mistral.ai/news/mistral-small-3',
  paperlink: null,
  contextLength: '32k',
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
  identifiers: { apiNames: ['mistral-small-2501'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'agents-conversations', 'connectors', 'batching'],

  },
  metadata: {deprecationDate: '2025-11-06', retirementDate: '2025-11-30', replacement: 'Mistral Small 4'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
