import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small 3.1',
  description: `A new leader in the small models category with image understanding capabilities, released March 2025.`,
  shortDescription: `A new leader in the small models category with image understanding capabilities.`,
  slug: 'mistral-small-3-1-25-03',
  releaseDate: 'March 17, 2025',
  version: '25.03',
  frontier: false,
  class: 'Generalist',
  type: 'Open',
  compliance: '',
  status: 'Deprecated',
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
      },
      active: '24',
      contextSize: '128k',
    }
  ],
  contextLength: '128k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
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
    finetuning: [],
  },
  metadata: {deprecationDate: 'November 6, 2025', retirementDate: 'November 30, 2025', replacement: 'Mistral Small 3.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
