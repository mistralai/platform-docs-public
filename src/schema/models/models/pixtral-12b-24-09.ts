import { StaticModel } from '../schema';
export default {
  name: 'Pixtral 12B',
  description: `A 12B model with image understanding capabilities in addition to text.`,
  shortDescription: `A 12B model with image understanding capabilities in addition to text.`,
  slug: 'pixtral-12b-24-09',
  releaseDate: 'September 11, 2024',
  version: '24.09',
  frontier: false,
  class: 'Generalist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/pixtral-12b',
  status: 'Deprecated',
  avatar: { icon: 'pixtral', backgroundColor: 'orange' },
  weights: [
    {
      name: 'Instruct Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Pixtral-12B-2409',
      parameters: '12',
      minGpuRam: {
        bf16: '56',
        fp8: '28',
        fp4: '14',
        fp4_16: null,
      },
      active: '12',
      contextSize: '128k',
    },    {
      name: 'Base Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Pixtral-12B-Base-2409',
      parameters: '12',
      minGpuRam: {
        bf16: '56',
        fp8: '28',
        fp4: '14',
        fp4_16: null,
      },
      active: '12',
      contextSize: '128k',
    }
  ],
  bloglink: 'https://mistral.ai/news/pixtral-12b',
  paperlink: 'https://arxiv.org/pdf/2410.07073',
  contextLength: '128k',
  ratings: { 
    speed: { stars: 2.0, label: 'Slow' },
    performance: { stars: 2.0, label: 'Moderate' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 0.15, denominator: '/M Tokens' }
    ],
    output: [
      { type: 'range', price: 0.15, denominator: '/M Tokens' }
    ]
  },
  identifiers: { apiNames: ['pixtral-12b-2409'] },
  capabilities: {
    input: ['text', 'image'],
    output: ['text'],
    features: ['structured-outputs', 'function-calling', 'document-qna', 'prefix', 'chat-completions', 'batching'],
    finetuning: ['text', 'vision'],
  },
  metadata: {deprecationDate: 'December 2, 2025', retirementDate: 'December 31, 2025', replacement: 'Ministral 3 14B'},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: true,
} as const satisfies StaticModel;
