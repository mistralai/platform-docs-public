import { StaticModel } from '../schema';
export default {
  name: 'Magistral Small 1.2',
  description: `Our small multimodal reasoning model update of September 2025.`,
  shortDescription: `Our small multimodal reasoning model.`,
  slug: 'magistral-small-1-2-25-09',
  releaseDate: 'September 18, 2025',
  version: '25.09',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'magistral', backgroundColor: 'yellow' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Magistral-Small-2509',
      parameters: '24',
      minGpuRam: {
        bf16: '78',
        fp8: '39',
        fp4: '20',
      },
      active: '24',
      contextSize: '128k',
    }
  ],
  contextLength: '128k',
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
  identifiers: { apiNames: ['magistral-small-2509', 'magistral-small-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['reasoning', 'text'],
    features: ['function-calling', 'document-qna', 'chat-completions', 'batching'],
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
