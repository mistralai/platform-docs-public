import { StaticModel } from '../schema';
export default {
  name: 'Ministral 3 14B',
  description: `Ministral 3 14B is the largest model in the Ministral 3 family, offering state-of-the-art capabilities and performance comparable to its larger Mistral Small 3.2 24B counterpart. Optimized for local deployment, it delivers high performance across diverse hardware, including local setups. `,
  shortDescription: `A powerful model offering best-in-class text and vision capabilities. `,
  slug: 'ministral-3-14b-25-12',
  releaseDate: 'December 2, 2025',
  version: '25.12',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/ministral-3-14b',
  status: 'Active',
  avatar: { icon: 'ministral', backgroundColor: 'beige' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Ministral-3-14B-Instruct-2512',
      parameters: '14',
      minGpuRam: {
        bf16: '93',
        fp8: '47',
        fp4: '24',
        fp4_16: '11',
      },
      active: '14',
      contextSize: '256k',
    },    {
      name: 'Reasoning Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Ministral-3-14B-Reasoning-2512',
      parameters: '14',
      minGpuRam: {
        bf16: '93',
        fp8: '47',
        fp4: '24',
        fp4_16: '11',
      },
      active: '14',
      contextSize: '256k',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Ministral-3-14B-Base-2512',
      parameters: '14',
      minGpuRam: {
        bf16: '93',
        fp8: '47',
        fp4: '24',
        fp4_16: '11',
      },
      active: '14',
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
      { type: 'range', price: 0.2, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.2, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['ministral-14b-2512', 'ministral-14b-latest'] },
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
