import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Small',
  describe: (l) => ({
    description: l.text(`Our first model with audio input capabilities for instruct use cases.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our first model with audio input capabilities for instruct use cases.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-small-25-07',
  releaseDate: '2025-07-15',
  version: '25.07',
  frontier: true,
  class: 'Specialist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/voxtral-small',
  status: 'Active',
  avatar: { icon: 'voxtral', backgroundColor: 'pink' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Voxtral-Small-24B-2507',
      parameters: '24',
      minGpuRam: {
        bf16: '54',
        fp8: '27',
        fp4: '14',
        fp4_16: null,
      },
      active: '24',
      contextSize: '32k',
    }
  ],
  bloglink: 'https://mistral.ai/news/voxtral',
  paperlink: 'https://arxiv.org/pdf/2507.13264',
  contextLength: '32k',
  ratings: { 
    speed: 3.0,
    performance: 3.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.004, denominator: '/Min' },
      { type: 'flat', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.3, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['voxtral-small-2507', 'voxtral-small-latest'] },
  capabilities: {
    input: ['audio', 'text'],
    output: ['text'],
    features: ['structured-outputs', 'document-qna', 'prefix', 'chat-completions', 'batching', 'function-calling'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
