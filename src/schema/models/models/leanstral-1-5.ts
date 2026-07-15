import { StaticModel } from '../schema';
export default {
  name: 'Leanstral 1.5',
  describe: (l) => ({
    description: l.text(`An updated Lean 4 formal proof engineering model optimised for automated theorem proving and autoformalization. 119B total parameters, 6.5B active.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Updated code agent for Lean 4 formal proof engineering and automated theorem proving.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'leanstral-1-5',
  releaseDate: '2026-06-30',
  version: '1.5',
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
      url: 'https://huggingface.co/mistralai/Leanstral-1.5-119B-A6B',
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
  bloglink: 'https://mistral.ai/news/leanstral-1-5/',
  paperlink: null,
  contextLength: '256k',
  outputTokenLimit: '128k',
  ratings: {
    speed: 4.0,
    performance: 4.0,
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
  identifiers: { apiNames: ['labs-leanstral-1-5'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['chat-completions', 'function-calling', 'agents-conversations', 'structured-outputs'],
  },
  metadata: { retirementDate: '2026-09-30' },
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
