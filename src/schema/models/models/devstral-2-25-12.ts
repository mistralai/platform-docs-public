import { StaticModel } from '../schema';
export default {
  name: 'Devstral 2',
  describe: (l) => ({
    description: l.text(`Our frontier code agents model for solving software engineering tasks; excels at using tools to explore codebases, editing multiple files and power software engineering agents.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our frontier code agents model for solving software engineering tasks.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'devstral-2-25-12',
  releaseDate: '2025-12-09',
  version: '25.12',
  frontier: true,
  class: 'Specialist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/devstral-2',
  status: 'Deprecated',
  avatar: { icon: 'devstral', backgroundColor: 'green' },
  weights: [
    {
      name: 'Weights',
      license: 'Modified MIT',
      licenseUrl: 'https://huggingface.co/mistralai/Devstral-2-123B-Instruct-2512/blob/main/LICENSE',
      url: 'https://huggingface.co/mistralai/Devstral-2-123B-Instruct-2512',
      parameters: '123',
      minGpuRam: {
        bf16: '297',
        fp8: '149',
        fp4: '75',
        fp4_16: '66',
      },
      active: '123',
      contextSize: '256k',
    }
  ],
  bloglink: 'https://mistral.ai/news/devstral-2-vibe-cli',
  paperlink: null,
  contextLength: '256k',
  ratings: { 
    speed: 3.0,
    performance: 4.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.4, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 2.0, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['devstral-2512', 'devstral-latest', 'devstral-medium-latest'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],

  },
  metadata: {deprecationDate: '2026-05-22', retirementDate: '2026-07-31', replacement: 'Mistral Medium 3.5'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
