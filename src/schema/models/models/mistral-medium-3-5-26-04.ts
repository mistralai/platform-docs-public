import { StaticModel } from '../schema';
export default {
  name: 'Mistral Medium 3.5',
  describe: (l) => ({
    description: l.text(`Our frontier-class multimodal model optimized for agentic and coding use cases. Released as open weights under a Modified MIT license.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our frontier-class multimodal model optimized for agentic and coding use cases.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-medium-3-5-26-04',
  releaseDate: '2026-04-28',
  version: '26.04',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-medium-3',
  status: 'Active',
  avatar: { icon: 'mistral-medium', backgroundColor: 'blue' },
  weights: [
    {
      name: 'Weights',
      license: 'Modified MIT',
      licenseUrl: 'https://huggingface.co/mistralai/Mistral-Medium-3.5-128B/blob/main/LICENSE',
      url: 'https://huggingface.co/mistralai/Mistral-Medium-3.5-128B',
      parameters: '128',
      minGpuRam: {
        bf16: '256',
        fp8: '128',
        fp4: '64',
        fp4_16: null,
      },
      active: '128',
      contextSize: '256k',
    },
  ],
  bloglink: 'https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5',
  paperlink: null,
  contextLength: '256k',
  ratings: {
    speed: 2.0,
    performance: 4.5,
    input: 4.0,
    output: 2.0,
  },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 1.5, denominator: '/M Tokens' },
    ],
    output: [
      { type: 'range', price: 7.5, denominator: '/M Tokens' },
    ],
  },
  identifiers: { apiNames: ['mistral-medium-3-5', 'mistral-medium-3', 'mistral-medium-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['reasoning', 'text'],
    features: ['structured-outputs', 'function-calling', 'predicted-outputs', 'document-qna', 'prefix', 'batching', 'agents-conversations', 'chat-completions', 'connectors'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
