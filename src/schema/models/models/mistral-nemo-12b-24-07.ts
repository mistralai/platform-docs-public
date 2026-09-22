import { StaticModel } from '../schema';
export default {
  name: 'Mistral Nemo 12B',
  describe: (l) => ({
    description: l.text(`Our best multilingual open source model released July 2024.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our best multilingual open source model released July 2024.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-nemo-12b-24-07',
  releaseDate: '2024-07-18',
  version: '24.07',
  frontier: false,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/open-mistral-nemo-2407',
  status: 'Deprecated',
  avatar: { icon: 'mistral-nemo', backgroundColor: 'red' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407',
      parameters: '12',
      minGpuRam: {
        bf16: '56',
        fp8: '28',
        fp4: '14',
        fp4_16: null,
      },
      active: '12',
      contextSize: '128k',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Nemo-Base-2407',
      parameters: '12',
      minGpuRam: {
        bf16: '56',
        fp8: '28',
        fp4: '14',
        fp4_16: null,
      },
      active: '12',
      contextSize: '128k',
    },    {
      name: 'FP8 Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Nemo-Instruct-FP8-2407',
      parameters: '12',
      minGpuRam: {
        bf16: '56',
        fp8: '28',
        fp4: '14',
        fp4_16: null,
      },
      active: '12',
      contextSize: '128k',
    }
  ],
  bloglink: 'https://mistral.ai/news/mistral-nemo',
  paperlink: null,
  contextLength: '128k',
  ratings: { 
    speed: 3.0,
    performance: 2.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.15, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.15, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['open-mistral-nemo-2407', 'open-mistral-nemo'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2026-05-22', retirementDate: '2026-07-31', replacement: 'Ministral 3 8B'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
