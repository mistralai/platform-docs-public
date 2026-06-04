import { StaticModel } from '../schema';
export default {
  name: 'Leanstral',
  describe: (l) => ({
    description: l.text(`Our first open-source code agent designed for Lean 4, built for formal proof engineering in realistic repositories. 119B parameters with 6.5B active.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Open-source code agent for Lean 4 formal proof engineering.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'leanstral-26-03',
  releaseDate: '2026-03-16',
  version: '26.03',
  frontier: true,
  class: 'Specialist',
  type: 'Labs',
  legalButton: null,
  status: 'Active',
  avatar: { icon: 'leanstral', backgroundColor: 'teal' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Leanstral-2603',
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
    free: true,
    input: [
      { type: 'range', price: 0.0, denominator: '/M Tokens' },
    ],
    output: [
      { type: 'range', price: 0.0, denominator: '/M Tokens' },
    ],
  },
  identifiers: { apiNames: ['labs-leanstral-2603'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['chat-completions', 'function-calling', 'agents-conversations', 'structured-outputs'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
