import { StaticModel } from '../schema';
export default {
  name: 'Mistral Small 4',
  describe: (l) => ({
    description: l.text(`Our powerful hybrid model unifying instruct, reasoning, and coding capabilities in a single model. 119B parameters with 6.5B active.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Hybrid model unifying instruct, reasoning, and coding in a single efficient model.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-small-4-0-26-03',
  releaseDate: '2026-03-16',
  version: '26.03',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'DEFAULT',
  status: 'Active',
  avatar: { icon: 'mistral-small', backgroundColor: 'orange' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Small-4-2603',
      parameters: '119',
      minGpuRam: {
        bf16: '238',
        fp8: '119',
        fp4: '60',
        fp4_16: null,
      },
      active: '6.5',
      contextSize: '256k',
    },
  ],
  bloglink: null,
  paperlink: null,
  contextLength: '256k',
  ratings: {
    speed: 4.0,
    performance: 3.5,
    input: 4.0,
    output: 3.5,
  },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.15, denominator: '/M Tokens' },
    ],
    output: [
      { type: 'range', price: 0.6, denominator: '/M Tokens' },
    ],
  },
  identifiers: { apiNames: ['mistral-small-2603', 'mistral-small-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['chat-completions', 'function-calling', 'agents-conversations', 'connectors', 'structured-outputs', 'predicted-outputs', 'document-qna', 'prefix', 'batching'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
