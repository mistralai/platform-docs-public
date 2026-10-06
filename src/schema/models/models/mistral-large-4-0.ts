import { StaticModel } from '../schema';
export default {
  name: 'Mistral Large 4',
  describe: (l) => ({
    description: l.text(`Mistral Large 4 is a state-of-the-art, open-weight, general-purpose multimodal model with a granular Mixture-of-Experts architecture. It features 52B active parameters and 1.05T total parameters, and a 1.6B vision encoder.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A state-of-the-art, open-weight, general-purpose multimodal model.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-large-4-0',
  slugAliases: ['mistral-large', 'mistral-large-4'],
  releaseDate: '2026-10-06',
  version: '26.10',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  legalButton: null,
  status: 'PublicPreview',
  avatar: { icon: 'mistral-large-4', backgroundColor: 'lechonk' },
  weights: [
    {
      name: 'Coming soon',
      license: '',
      licenseUrl: null,
      url: null,
      parameters: '1.05T',
      minGpuRam: {
        bf16: null,
        fp8: null,
        fp4: null,
        fp4_16: null,
      },
      active: '52',
      contextSize: '1M',
      visionEncoder: '1.6',
    }
  ],
  bloglink: null,
  paperlink: null,
  contextLength: '1M',
  ratings: {
    speed: 5.0,
    performance: 4.0, input: 4.0, output: 2.0 },
  pricingLayout: 'stacked',
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.68, denominator: '/M Tokens', label: 'Input', originalPrice: 1.36 },
      { type: 'range', price: 0.07, denominator: '/M Tokens', label: 'Cached input', originalPrice: 0.14 },
    ],
    output: [
      { type: 'range', price: 2.09, denominator: '/M Tokens', label: 'Output', originalPrice: 4.18 },
    ],
  },
  identifiers: { apiNames: ['mistral-large-4', 'mistral-large-4-0'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['reasoning', 'text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching', 'agents-conversations', 'connectors'],

  },
  metadata: { parameters: '1.05T' },
  usageExample: 'mistral-large-4-0',
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
