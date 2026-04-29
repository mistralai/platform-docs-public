import { StaticModel } from '../schema';
export default {
  name: 'Mistral Medium 3.5',
  description: `Our frontier-class multimodal model optimized for agentic and coding use cases. Releases as open weights under a Modified MIT license.`,
  shortDescription: `Our frontier-class multimodal model optimized for agentic and coding use cases.`,
  slug: 'mistral-medium-3-5-26-04',
  releaseDate: 'April 2026',
  version: '3.5',
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
    speed: { stars: 2.0, label: 'Slow' },
    performance: { stars: 4.5, label: 'Exceptional' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 1.5, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 7.5, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['mistral-medium-3.5', 'mistral-medium-3'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['reasoning', 'text'],
    features: ['structured-outputs', 'function-calling', 'predicted-outputs', 'document-qna', 'prefix', 'batching', 'agents-conversations', 'chat-completions', 'connectors'],
    finetuning: ['text'],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
