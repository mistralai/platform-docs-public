import { StaticModel } from '../schema';
export default {
  name: 'Ministral 8B',
  description: `Powerful edge model with extremely high performance/price ratio. Learn more in our [blog post](https://mistral.ai/news/ministraux/)`,
  shortDescription: `Powerful edge model with extremely high performance/price ratio.`,
  slug: 'ministral-8b-24-1',
  releaseDate: 'October 9, 2024',
  version: '24.1',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/ministral-1-8b',
  status: 'Deprecated',
  avatar: { icon: 'ministral', backgroundColor: 'purple' },
  weights: [
    {
      name: 'Weights',
      license: 'MRL',
      licenseUrl: 'https://mistral.ai/static/licenses/MRL-0.1.md',
      url: 'https://huggingface.co/mistralai/Ministral-8B-Instruct-2410',
      parameters: '8',
      minGpuRam: {
        bf16: '42',
        fp8: '21',
        fp4: '11',
        fp4_16: '8',
      },
      active: '8',
      contextSize: '128k',
    }
  ],
  contextLength: '128k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 2.0, label: 'Moderate' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.1, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['ministral-8b-2410'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],
    finetuning: ['text'],
  },
  metadata: {deprecationDate: 'December 2, 2025', retirementDate: 'December 31, 2025', replacement: 'Ministral 3 8B'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
