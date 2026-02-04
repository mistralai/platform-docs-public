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
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/voxtral-small',
  status: 'Active',
  avatar: { icon: 'voxtral', backgroundColor: 'pink' },
  weights: [],
  bloglink: 'https://mistral.ai/news/voxtral',
  paperlink: null,
  contextLength: '32k',
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.002, denominator: '/Min' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['voxtral-mini-transcribe-realtime-2602', 'voxtral-mini-transcribe-realtime-latest'] },
  capabilities: {
    input: ['audio'],
    output: ['text'],
    features: ['timestamps', 'transcriptions'],
    finetuning: [],
  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
