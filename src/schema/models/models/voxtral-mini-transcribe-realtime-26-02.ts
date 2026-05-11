import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Mini Transcribe Realtime',
  description: `An efficient audio input model, fine-tuned and optimized for live transcription purposes only.`,
  shortDescription: `An efficient audio input model, fine-tuned and optimized for live transcription purposes.`,
  slug: 'voxtral-mini-transcribe-realtime-26-02',
  releaseDate: 'February 4, 2026',
  version: '26.02',
  frontier: true,
  class: 'Specialist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/voxtral-small',
  status: 'Active',
  avatar: { icon: 'voxtral', backgroundColor: 'pink' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Voxtral-Mini-4B-Realtime-2602',
      parameters: '4',
      minGpuRam: {
        bf16: '14',
        fp8: null,
        fp4: null,
        fp4_16: null,
      },
      active: '4',
      contextSize: '--',
    }
  ],
  bloglink: 'https://mistral.ai/news/voxtral-transcribe-2',
  paperlink: null,
  contextLength: '--',
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.006, denominator: '/Min' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['voxtral-mini-transcribe-realtime-2602', 'voxtral-mini-transcribe-realtime-latest'] },
  capabilities: {
    input: ['audio'],
    output: ['text'],
    features: ['timestamps', 'transcriptions'],

  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
