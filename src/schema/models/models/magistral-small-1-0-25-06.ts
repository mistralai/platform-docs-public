import { StaticModel } from '../schema';
export default {
  name: 'Magistral Small 1.0',
  describe: (l) => ({
    description: l.text(`Our first small reasoning model released June 2025. Learn more in our [blog post](https://mistral.ai/news/magistral/)`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our first small reasoning model released June 2025.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'magistral-small-1-0-25-06',
  releaseDate: '2025-06-10',
  version: '25.06',
  frontier: false,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/magistral-small-1',
  status: 'Retired',
  avatar: { icon: 'magistral', backgroundColor: 'beige' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Magistral-Small-2506',
      parameters: '24',
      minGpuRam: {
        bf16: '56',
        fp8: '28',
        fp4: '14',
        fp4_16: null,
      },
      active: '24',
      contextSize: '40k',
    }
  ],
  bloglink: 'https://mistral.ai/news/magistral',
  paperlink: 'https://arxiv.org/pdf/2506.10910',
  contextLength: '40k',
  ratings: { 
    speed: 3.0,
    performance: 3.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.5, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 1.5, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['magistral-small-2506'] },
  capabilities: {
    input: ['text'],
    output: ['reasoning', 'text'],
    features: ['function-calling', 'document-qna', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2025-10-31', retirementDate: '2025-11-30', replacement: 'Magistral Small 1.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
