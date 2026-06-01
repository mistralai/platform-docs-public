import { StaticModel } from '../schema';
export default {
  name: 'Devstral Small 1.1',
  describe: (l) => ({
    description: l.text(`An update to our open source model that excels at using tools to explore codebases, editing multiple files and power software engineering agents. Learn more in our [blog post](https://mistral.ai/news/devstral-2507)`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`An update to our open source model that excels at SWE use cases.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'devstral-small-1-1-25-07',
  releaseDate: '2025-07-10',
  version: '25.07',
  frontier: false,
  class: 'Specialist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/devstral-small-1',
  status: 'Deprecated',
  avatar: { icon: 'devstral', backgroundColor: 'green' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Devstral-Small-2507',
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
  bloglink: 'https://mistral.ai/news/devstral-2507',
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
  identifiers: { apiNames: ['devstral-small-2507'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2026-02-27', retirementDate: '2026-05-31', replacement: 'Devstral 2'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
