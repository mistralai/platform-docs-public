import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small 2.0',
  describe: (l) => ({
    description: l.text(`An update to our efficient small model with open weights under an MRL license.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`An update to our efficient small model with open weights under an MRL license.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-small-2-0-24-09',
  releaseDate: '2024-09-17',
  version: '24.09',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-small-2',
  status: 'Retired',
  avatar: { icon: 'mistral-small', backgroundColor: 'gray' },
  weights: [
    {
      name: 'Weights',
      license: 'MRL',
      licenseUrl: 'https://mistral.ai/static/licenses/MRL-0.1.md',
      url: 'https://huggingface.co/mistralai/Mistral-Small-Instruct-2409',
      parameters: '22',
      minGpuRam: {
        bf16: '52',
        fp8: '26',
        fp4: '13',
        fp4_16: null,
      },
      active: '22',
      contextSize: '32k',
    }
  ],
  bloglink: 'https://mistral.ai/news/september-24-release',
  paperlink: null,
  contextLength: '32k',
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
      { type: 'range', price: 0.3, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['mistral-small-2409'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2025-11-06', retirementDate: '2025-11-30', replacement: 'Mistral Small 3.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
