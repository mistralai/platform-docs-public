import { StaticModel } from '../schema';
export default {
  name: 'Devstral Small 1.0',
  describe: (l) => ({
    description: l.text(`A 24B text model, open source model that excels at using tools to explore codebases, editing multiple files and power software engineering agents.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A 24B text model, open source model that excels at SWE use cases.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'devstral-small-1-0-25-05',
  releaseDate: '2025-05-21',
  version: '25.05',
  frontier: false,
  class: 'Specialist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/devstral-small-1',
  status: 'Retired',
  avatar: { icon: 'devstral', backgroundColor: 'green' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Devstral-Small-2505',
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
  bloglink: 'https://mistral.ai/news/devstral',
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
  identifiers: { apiNames: ['devstral-small-2505'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2025-10-31', retirementDate: '2025-11-30', replacement: 'Mistral Medium 3.5'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
