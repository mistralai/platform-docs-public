import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Mini Transcribe 2',
  describe: (l) => ({
    description: l.text(`An efficient audio input model, fine-tuned and optimized for transcription purposes only.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`An efficient audio input model, fine-tuned and optimized for transcription purposes.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-mini-transcribe-26-02',
  releaseDate: '2026-02-04',
  version: '26.02',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/voxtral-small',
  status: 'Active',
  avatar: { icon: 'voxtral', backgroundColor: 'pink' },
  weights: [],
  bloglink: 'https://mistral.ai/news/voxtral-transcribe-2',
  paperlink: null,
  contextLength: '--',
  ratings: { 
    speed: 4.0,
    performance: 3.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.003, denominator: '/Min' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['voxtral-mini-2602', 'voxtral-mini-latest'] },
  capabilities: {
    input: ['audio'],
    output: ['text'],
    features: ['timestamps', 'transcriptions'],

  },
  metadata: {},
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
