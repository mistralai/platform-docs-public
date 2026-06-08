import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Mini Transcribe',
  describe: (l) => ({
    description: l.text(`An efficient audio input model, pre-trained and optimized for transcription purposes only.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`An efficient audio input model, pre-trained and optimized for transcription purposes.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-mini-transcribe-25-07',
  releaseDate: '2025-07-15',
  version: '25.07',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/voxtral-small',
  status: 'Deprecated',
  avatar: { icon: 'voxtral', backgroundColor: 'pink' },
  weights: [],
  bloglink: 'https://mistral.ai/news/voxtral',
  paperlink: null,
  contextLength: '32k',
  ratings: { 
    speed: 4.0,
    performance: 3.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.002, denominator: '/Min' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['voxtral-mini-2507'] },
  capabilities: {
    input: ['audio'],
    output: ['text'],
    features: ['timestamps', 'transcriptions'],

  },
  metadata: {},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
