import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Mini Transcribe Realtime 3',
  describe: (l) => ({
    description: l.text(`Voxtral Realtime Transcribe 3 is a realtime transcription model built for agentic use-cases. It achieves state-of-the-art streaming transcription with configurable latency (80 ms to 2,400 ms), built-in end-of-turn detection, context biasing, and speaker diarization, all in a single streaming session over WebSocket.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Realtime transcription model for agentic use-cases with configurable latency and turn detection.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-mini-transcribe-realtime-3-0',
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
  contextLength: '--',
  ratings: {
    speed: 4.5,
    performance: 4.0,
    input: 4.0,
    output: 2.0,
  },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.008, denominator: '/Min' },
    ],
    output: [],
  },
  identifiers: { apiNames: ['voxtral-mini-transcribe-realtime-3-0', 'voxtral-mini-transcribe-realtime-3', 'voxtral-mini-transcribe-realtime-latest'] },
  capabilities: {
    input: ['audio'],
    output: ['text'],
    features: ['transcriptions'],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/audio/realtime',
  legacy: false,
} as const satisfies StaticModel;
