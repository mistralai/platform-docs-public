import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small 2.0',
  description: `An update to our efficient small model with open weights under an MRL license.`,
  shortDescription: `An update to our efficient small model with open weights under an MRL license.`,
  slug: 'mistral-small-2-0-24-09',
  releaseDate: 'September 17, 2024',
  version: '24.09',
  type: 'Frontier',
  compliance: '',
  status: 'Deprecated',
  avatar: { icon: 'mistral-small', backgroundColor: 'beige' },
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
      },
      active: '22',
      contextSize: '32k',
    }
  ],
  contextLength: '32k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 2.0, label: 'Moderate' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
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
    finetuning: [],
  },
  metadata: {deprecationDate: 'November 6, 2025', retirementDate: 'November 30, 2025', replacement: 'Mistral Small 3.2'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
