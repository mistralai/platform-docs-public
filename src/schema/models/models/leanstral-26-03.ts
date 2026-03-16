import { StaticModel } from '../schema';
export default {
  name: 'Leanstral',
  description: `Our first open-source code agent designed for Lean 4, built for formal proof engineering in realistic repositories. 119B parameters with 6.5B active.`,
  shortDescription: `Open-source code agent for Lean 4 formal proof engineering.`,
  slug: 'leanstral-26-03',
  releaseDate: 'March 16, 2026',
  version: '26.03',
  frontier: false,
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
<<<<<<< HEAD
      url: 'https://huggingface.co/mistralai/Leanstral-2603',
=======
      url: 'https://huggingface.co/mistralai/Leanstral-120B-A6B-2603',
>>>>>>> public/main
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
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 3.5, label: 'Very Smart' },
    input: { stars: 4.0, label: 'Fast' },
    output: { stars: 3.5, label: 'Fast' },
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
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
