import { StaticModel } from '../schema';
export default {
  name: 'Magistral Small 1.2',
  describe: (l) => ({
    description: l.text(`Our small multimodal reasoning model update of September 2025.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our small multimodal reasoning model.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'magistral-small-1-2-25-09',
  releaseDate: '2025-09-18',
  version: '25.09',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/magistral-small-1',
  status: 'Deprecated',
  avatar: { icon: 'magistral', backgroundColor: 'beige' },
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
        fp4_16: '16',
      },
      active: '24',
      contextSize: '128k',
    }
  ],
  bloglink: null,
  paperlink: null,
  contextLength: '128k',
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
  identifiers: { apiNames: ['magistral-small-2509', 'magistral-small-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['reasoning', 'text'],
    features: ['function-calling', 'document-qna', 'chat-completions', 'batching'],

  },
  metadata: { deprecationDate: 'April 30, 2026', retirementDate: 'July 31, 2026', replacement: 'Mistral Small 4' },
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
