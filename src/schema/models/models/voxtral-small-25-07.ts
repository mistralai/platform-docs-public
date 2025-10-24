import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Small',
  description: `Our first model with audio input capabilities for instruct use cases.`,
  shortDescription: `Our first model with audio input capabilities for instruct use cases.`,
  slug: 'voxtral-small-25-07',
  releaseDate: 'July 15, 2025',
  version: '25.07',
  type: 'Open',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'voxtral', backgroundColor: 'beige' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Voxtral-Small-24B-2507',
      parameters: '24',
      minGpuRam: {
        bf16: '54',
        fp8: '27',
        fp4: '14',
      },
      active: '24',
      contextSize: '32',
    }
  ],
  ratings: { 
    speed: { stars: 3.0, label: 'Moderate' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    input: [
      { type: 'range', price: 0.004, denominator: '/Min' },
      { type: 'flat', price: 0.1, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.3, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['voxtral-small-2507', 'voxtral-small-latest'] },
  capabilities: {
    input: ['audio', 'text'],
    output: ['text'],
    features: ['structured-outputs', 'document-qna', 'prefix', 'chat-completions', 'batching', 'function-calling'],
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
