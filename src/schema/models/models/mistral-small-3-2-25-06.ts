import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small 3.2',
  describe: (l) => ({
    description: l.text(`An update to our previous small model, released June 2025.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`An update to our previous small model, released June 2025.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-small-3-2-25-06',
  releaseDate: '2025-06-20',
  version: '25.06',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-small-3',
  status: 'Deprecated',
  avatar: { icon: 'mistral-small', backgroundColor: 'purple' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Small-3.2-24B-Instruct-2506',
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
      { type: 'range', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.3, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['mistral-small-2506'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'agents-conversations', 'batching', 'connectors', 'predicted-outputs'],

  },
  metadata: { deprecationDate: '2026-04-30', retirementDate: '2026-07-31', replacement: 'Mistral Small 4' },
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
