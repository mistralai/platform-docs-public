import { StaticModel } from '../schema';
export default {
  name: 'Magistral Small 1.1',
  description: `Our small reasoning model released July 2025.`,
  shortDescription: `Our small reasoning model released July 2025.`,
  slug: 'magistral-small-1-1-25-07',
  releaseDate: 'July 24, 2025',
  version: '25.07',
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
      url: 'https://huggingface.co/mistralai/Magistral-Small-2507',
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
  contextLength: '40k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    input: [
      { type: 'range', price: 0.5, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 1.5, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['magistral-small-2507'] },
  capabilities: {
    input: ['text'],
    output: ['reasoning', 'text'],
    features: ['function-calling', 'document-qna', 'chat-completions', 'batching'],
    finetuning: [],
  },
  metadata: {deprecationDate: 'October 31, 2025', retirementDate: 'November 30, 2025', replacement: 'Magistral Small 1.2'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
