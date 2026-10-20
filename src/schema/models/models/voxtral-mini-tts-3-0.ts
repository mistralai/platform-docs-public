import { StaticModel } from '../schema';
export default {
  name: 'Voxtral TTS 3',
  describe: (l) => ({
    description: l.text(`Our state-of-the-art text-to-speech model with zero-shot voice cloning and professional voice cloning. Supports 9 languages, streaming with ~90 ms time-to-first-audio, 5 output formats, 34 emotion tags, and 2 pace tags.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`State-of-the-art TTS with zero-shot and professional voice cloning, 9 languages, and streaming.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-mini-tts-3-0',
  releaseDate: '2026-10-20',
  version: '3.0',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: null,
  status: 'PublicPreview',
  avatar: { icon: 'voxtral', backgroundColor: 'pink' },
  weights: [],
  bloglink: null,
  paperlink: null,
  contextLength: null,
  ratings: {
    speed: 4.5,
    performance: 4.0,
    input: 4.5,
    output: 4.0,
  },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'range', price: 13.0, denominator: '/M Chars' },
    ],
    output: [],
  },
  identifiers: { apiNames: ['voxtral-mini-tts-3-0', 'voxtral-mini-tts-3', 'voxtral-mini-tts-latest', 'voxtral-mini-tts-realtime-3-0', 'voxtral-mini-tts-realtime-3', 'voxtral-mini-tts-realtime-latest'] },
  capabilities: {
    input: ['text', 'audio'],
    output: ['audio'],
    features: ['tts', 'voice-cloning'],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/audio/text-to-speech',
  legacy: false,
} as const satisfies StaticModel;
