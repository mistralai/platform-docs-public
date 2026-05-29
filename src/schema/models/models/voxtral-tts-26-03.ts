import { StaticModel } from '../schema';
export default {
  name: 'Voxtral TTS',
  describe: (l) => ({
    description: l.text(`Our state-of-the-art text-to-speech model with zero-shot voice cloning. Supports 9 languages, streaming with ~90ms time-to-first-audio, and no transcript required for voice prompts.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`State-of-the-art TTS with zero-shot voice cloning and multilingual support.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-tts-26-03',
  releaseDate: '2026-03-23',
  version: '26.03',
  frontier: true,
  class: 'Specialist',
  type: 'Open',
  legalButton: null,
  status: 'Active',
  avatar: { icon: 'voxtral', backgroundColor: 'pink' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Voxtral-4B-TTS-2603',
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
      { type: 'range', price: 0.0, denominator: '/M Chars' },
    ],
    output: [
      { type: 'range', price: 16.0, denominator: '/M Chars' },
    ],
  },
  identifiers: { apiNames: ['voxtral-mini-tts-2603'] },
  capabilities: {
    input: ['text', 'audio'],
    output: ['audio'],
    features: ['tts'],

  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
