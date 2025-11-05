import { StaticModel } from '../schema';
export default {
  name: 'Pixtral Large',
  description: `Our first frontier-class multimodal model released November 2024. Learn more in our [blog post](https://mistral.ai/news/pixtral-large/)`,
  shortDescription: `Our first frontier-class multimodal model released November 2024.`,
  slug: 'pixtral-large-24-11',
  releaseDate: 'November 18, 2024',
  version: '24.11',
  type: 'Frontier',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'mistral-large', backgroundColor: 'red' },
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
      },
      active: '124',
      contextSize: '',
    }
  ],
  contextLength: '128k',
  ratings: { 
    speed: { stars: 1.0, label: 'Slow' },
    performance: { stars: 4.0, label: 'Very Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
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
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
