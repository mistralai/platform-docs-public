import { StaticModel } from '../schema';
export default {
  name: 'Mistral Large 3',
  describe: (l) => ({
    description: l.text(`Mistral Large 3, is a state-of-the-art, open-weight, general-purpose multimodal model with a granular Mixture-of-Experts architecture. It features 41B active parameters and 675B total parameters.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A state-of-the-art, open-weight, general-purpose multimodal model.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-large-3-25-12',
  releaseDate: '2025-12-02',
  version: '25.12',
  frontier: true,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-large-3',
  status: 'Active',
  avatar: { icon: 'mistral-large', backgroundColor: 'red' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mistral-Large-3-675B-Instruct-2512',
      parameters: '675',
      minGpuRam: {
        bf16: '1800',
        fp8: '900',
        fp4: '450',
        fp4_16: '360',
      },
      active: '41',
      contextSize: '256k',
    }
  ],
  bloglink: 'https://mistral.ai/news/mistral-3',
  paperlink: null,
  contextLength: '256k',
  ratings: { 
    speed: 2.0,
    performance: 4.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.5, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 1.5, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['mistral-large-2512', 'mistral-large-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching', 'agents-conversations', 'connectors'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
