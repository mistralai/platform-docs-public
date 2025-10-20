import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Mini Transcribe',
  description: `An efficient audio input model, fine-tuned and optimized for transcription purposes only.`,
  shortDescription: `An efficient audio input model, fine-tuned and optimized for transcription purposes.`,
  slug: 'voxtral-mini-transcribe-25-07',
  releaseDate: 'July 15, 2025',
  version: '25.07',
  type: 'Frontier',
  compliance: '',
  status: 'Active',
  avatar: { icon: 'voxtral', backgroundColor: 'purple' },
  weights: [],
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    input: [
      { type: 'flat', price: 0.002, denominator: '/Min' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['voxtral-mini-2507', 'voxtral-mini-latest'] },
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
