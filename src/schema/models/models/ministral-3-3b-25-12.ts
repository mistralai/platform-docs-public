import { StaticModel } from '../schema';
export default {
  name: 'Ministral 3 3B',
  description: `Ministral 3 3B is the smallest and most efficient model in the Ministral 3 family, offering robust language and vision capabilities in a compact package. Designed for edge deployment, it delivers high performance across diverse hardware, including local setups.`,
  shortDescription: `A tiny and efficient model offering best-in-class text and vision capabilities. `,
  slug: 'ministral-3-3b-25-12',
  releaseDate: 'December 2, 2025',
  version: '25.12',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/ministral-3-3b',
  status: 'Active',
  avatar: { icon: 'ministral', backgroundColor: 'red' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512',
      parameters: '3',
      minGpuRam: {
        bf16: '43',
        fp8: '22',
        fp4: '11',
        fp4_16: '5',
      },
      active: '3',
      contextSize: '256k',
    },    {
      name: 'Reasoning Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Ministral-3-3B-Reasoning-2512',
      parameters: '3',
      minGpuRam: {
        bf16: '43',
        fp8: '22',
        fp4: '11',
        fp4_16: '5',
      },
      active: '3',
      contextSize: '256k',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Ministral-3-3B-Base-2512',
      parameters: '3',
      minGpuRam: {
        bf16: '43',
        fp8: '22',
        fp4: '11',
        fp4_16: '5',
      },
      active: '3',
      contextSize: '256k',
    }
  ],
  contextLength: '256k',
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 1.0, label: 'Basic' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    input: [
      { type: 'range', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.1, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['ministral-3b-2512', 'ministral-3b-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
