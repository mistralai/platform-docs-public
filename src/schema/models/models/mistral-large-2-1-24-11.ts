import { StaticModel } from '../schema';
export default {
  name: 'Mistral Large 2.1',
  description: `Our top-tier large model for high-complexity tasks with the lastest version released November 2024.`,
  shortDescription: `Our top-tier large model for high-complexity tasks with the lastest version released November 2024.`,
  slug: 'mistral-large-2-1-24-11',
  releaseDate: 'November 18, 2024',
  version: '24.11',
  type: 'Frontier',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'mistral-large', backgroundColor: 'green' },
  weights: [
    {
      name: 'Weights',
      license: 'MRL',
      licenseUrl: 'https://mistral.ai/static/licenses/MRL-0.1.md',
      url: 'https://huggingface.co/mistralai/Mistral-Large-Instruct-2411',
      parameters: '123',
      minGpuRam: {
        bf16: '297',
        fp8: '149',
        fp4: '75',
      },
      active: '123',
      contextSize: '128k',
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
  identifiers: { apiNames: ['mistral-large-2411'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'predicted-outputs', 'document-qna', 'prefix', 'chat-completions', 'batching'],
    finetuning: ['text'],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
