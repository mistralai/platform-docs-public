import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Mini Transcribe 3',
  describe: (l) => ({
    description: l.text(`Voxtral Mini Transcribe 3 achieves strong transcription and diarization performance at a competitive price point. It ranks 3rd on the FLEURS multilingual transcription and English diarization benchmarks, surpassing state-of-the-art models such as Gemini 3.5 Transcribe, while being small enough to be deployed in resource-constrained environments.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Strong transcription and diarization at a competitive price point.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-mini-transcribe-3-0',
  releaseDate: '2026-10-20',
  version: '3.0',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/voxtral-small',
  status: 'PublicPreview',
  avatar: { icon: 'voxtral', backgroundColor: 'pink' },
  weights: [],
  bloglink: null,
  paperlink: null,
  contextLength: '32k',
  ratings: {
    speed: 4.0,
    performance: 4.0,
    input: 4.0,
    output: 2.0,
  },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.0035, denominator: '/Min' },
    ],
    output: [],
  },
  identifiers: { apiNames: ['voxtral-mini-transcribe-3-0', 'voxtral-mini-transcribe-3', 'voxtral-mini-transcribe-latest'] },
  capabilities: {
    input: ['audio'],
    output: ['text'],
    features: ['timestamps', 'transcriptions'],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/audio/speech-to-text',
  legacy: false,
} as const satisfies StaticModel;
