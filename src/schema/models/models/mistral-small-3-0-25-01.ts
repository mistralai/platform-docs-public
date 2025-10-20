import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small 3.0',
  description: `A small efficient and powerfull 24B open model for personal or commercial use.`,
  shortDescription: `A small efficient and powerfull 24B open model for personal or commercial use.`,
  slug: 'mistral-small-3-0-25-01',
  releaseDate: 'January 30, 2025',
  version: '25.01',
  type: 'Open',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'mistral-small', backgroundColor: 'pink' },
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
      },
      active: '24',
      contextSize: '32',
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
      },
      active: '24',
      contextSize: '32',
    }
  ],
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
  identifiers: { apiNames: ['mistral-small-2501'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'agents-conversations', 'connectors', 'batching'],
    finetuning: [],
  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
