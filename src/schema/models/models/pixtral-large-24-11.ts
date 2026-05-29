import { StaticModel } from '../schema';
export default {
  name: 'Pixtral Large',
  describe: (l) => ({
    description: l.text(`Our first frontier-class multimodal model released November 2024. Learn more in our [blog post](https://mistral.ai/news/pixtral-large/)`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our first frontier-class multimodal model released November 2024.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'pixtral-large-24-11',
  releaseDate: '2024-11-18',
  version: '24.11',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/pixtral-large',
  status: 'Deprecated',
  avatar: { icon: 'mistral-large', backgroundColor: 'orange' },
  weights: [
    {
      name: 'Weights',
      license: 'MRL',
      licenseUrl: 'https://mistral.ai/static/licenses/MRL-0.1.md',
      url: 'https://huggingface.co/mistralai/Pixtral-Large-Instruct-2411',
      parameters: '124',
      minGpuRam: {
        bf16: '297',
        fp8: '149',
        fp4: '75',
        fp4_16: '66',
      },
      active: '124',
      contextSize: '128k',
    }
  ],
  bloglink: 'https://mistral.ai/news/pixtral-large',
  paperlink: null,
  contextLength: '128k',
  ratings: { 
    speed: 1.0,
    performance: 4.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 2.0, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 6.0, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['pixtral-large-2411', 'pixtral-large-latest'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'predicted-outputs', 'document-qna', 'prefix', 'chat-completions', 'batching'],

  },
metadata: {deprecationDate: '2026-02-27', retirementDate: '2026-05-31', replacement: 'Mistral Medium 3.5'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
