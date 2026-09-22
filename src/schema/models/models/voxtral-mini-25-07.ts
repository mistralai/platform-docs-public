import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Mini',
  describe: (l) => ({
    description: l.text(`A mini version of our first audio input model.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A mini version of our first audio input model.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-mini-25-07',
  releaseDate: '2025-07-15',
  version: '25.07',
  frontier: true,
  class: 'Specialist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/voxtral-small',
  status: 'Deprecated',
  avatar: { icon: 'voxtral', backgroundColor: 'pink' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Voxtral-Mini-3B-2507',
      parameters: '4',
      minGpuRam: {
        bf16: '14',
        fp8: '7',
        fp4: '4',
        fp4_16: null,
      },
      active: '4',
      contextSize: '32k',
    }
  ],
  bloglink: 'https://mistral.ai/news/voxtral',
  paperlink: 'https://arxiv.org/pdf/2507.13264',
  contextLength: '32k',
  ratings: { 
    speed: 4.0,
    performance: 2.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.001, denominator: '/Min' },
      { type: 'flat', price: 0.04, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.04, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['voxtral-mini-2507', 'voxtral-mini-latest'] },
  capabilities: {
    input: ['audio', 'text'],
    output: ['text'],
    features: ['structured-outputs', 'document-qna', 'prefix', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2026-02-27', retirementDate: '2026-05-31', replacement: 'Voxtral Mini Transcribe 2'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
