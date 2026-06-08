import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Mini Transcribe Realtime',
  describe: (l) => ({
    description: l.text(`An efficient audio input model, pre-trained and optimized for live transcription purposes only.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`An efficient audio input model, pre-trained and optimized for live transcription purposes.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-mini-transcribe-realtime-26-02',
  releaseDate: '2026-02-04',
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
  paperlink: 'https://arxiv.org/abs/2602.11298',
  contextLength: '--',
  ratings: { 
    speed: 4.0,
    performance: 4.0, input: 4.0, output: 2.0 },
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
    features: ['transcriptions'],

  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
