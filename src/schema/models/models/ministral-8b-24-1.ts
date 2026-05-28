import { StaticModel } from '../schema';
export default {
  name: 'Ministral 8B',
  describe: (l) => ({
    description: l.text(`Powerful edge model with extremely high performance/price ratio. Learn more in our [blog post](https://mistral.ai/news/ministraux/)`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Powerful edge model with extremely high performance/price ratio.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'ministral-8b-24-1',
  releaseDate: '2024-10-09',
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
  bloglink: 'https://mistral.ai/news/ministraux',
  paperlink: null,
  contextLength: '128k',
  ratings: { 
    speed: 3.0,
    performance: 2.0, input: 4.0, output: 2.0 },
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

  },
  metadata: {deprecationDate: '2025-12-02', retirementDate: '2025-12-31', replacement: 'Ministral 3 8B'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
