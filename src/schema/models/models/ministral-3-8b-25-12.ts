import { StaticModel } from '../schema';
export default {
  name: 'Ministral 3 8B',
  description: `Ministral 3 8B is a powerful and efficient model in the Ministral 3 family, offering best-in-class text and vision capabilities. Built for edge deployment, it delivers high performance across diverse hardware, including local setups.`,
  shortDescription: `A powerful and efficient model offering best-in-class text and vision capabilities. `,
  slug: 'ministral-3-8b-25-12',
  releaseDate: 'December 2, 2025',
  version: '25.12',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/ministral-3-8b',
  status: 'Active',
  avatar: { icon: 'ministral', backgroundColor: 'yellow' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Ministral-3-8B-Instruct-2512',
      parameters: '8',
      minGpuRam: {
        bf16: '67',
        fp8: '34',
        fp4: '17',
        fp4_16: '8',
      },
      active: '8',
      contextSize: '256k',
    },    {
      name: 'Reasoning Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Ministral-3-8B-Reasoning-2512',
      parameters: '8',
      minGpuRam: {
        bf16: '67',
        fp8: '34',
        fp4: '17',
        fp4_16: '8',
      },
      active: '8',
      contextSize: '256k',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Ministral-3-8B-Base-2512',
      parameters: '8',
      minGpuRam: {
        bf16: '67',
        fp8: '34',
        fp4: '17',
        fp4_16: '8',
      },
      active: '8',
      contextSize: '256k',
    }
  ],
  contextLength: '256k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 2.0, label: 'Moderate' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    input: [
      { type: 'range', price: 0.15, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.15, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['ministral-8b-2512', 'ministral-8b-latest'] },
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
