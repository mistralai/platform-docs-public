import { StaticModel } from '../schema';
export default {
  name: 'Devstral 2',
  description: `Our frontier code agents model for solving software engineering tasks; excels at using tools to explore codebases, editing multiple files and power software engineering agents.`,
  shortDescription: `Our frontier code agents model for solving software engineering tasks.`,
  slug: 'devstral-2-25-12',
  releaseDate: 'December 9, 2025',
  version: '25.12',
  frontier: true,
  class: 'Specialist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/devstral-2',
  status: 'Active',
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
  contextLength: '256k',
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 4.0, label: 'Very Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: true,
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
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
