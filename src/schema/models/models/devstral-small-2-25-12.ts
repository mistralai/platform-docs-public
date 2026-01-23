import { StaticModel } from '../schema';
export default {
  name: 'Devstral Small 2',
  description: `Our open source model that excels at using tools to explore codebases, editing multiple files and power software engineering agents.`,
  shortDescription: `Model that excels at using tools to explore codebases, editing multiple files and power software engineering agents.`,
  slug: 'devstral-small-2-25-12',
  releaseDate: 'December 9, 2025',
  version: '25.12',
  frontier: false,
  class: 'Specialist',
  type: 'Labs',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/devstral-small-2',
  status: 'Active',
  avatar: { icon: 'devstral', backgroundColor: 'green' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512',
      parameters: '24',
      minGpuRam: {
        bf16: '78',
        fp8: '39',
        fp4: '20',
        fp4_16: '16',
      },
      active: '24',
      contextSize: '256k',
    }
  ],
  bloglink: 'https://mistral.ai/news/devstral-2-vibe-cli',
  paperlink: null,
  contextLength: '256k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: true,
    input: [
      { type: 'range', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.3, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['labs-devstral-small-2512', 'devstral-small-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
