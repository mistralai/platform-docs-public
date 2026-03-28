import { StaticModel } from '../schema';
export default {
  name: 'Voxtral TTS',
  description: `Our state-of-the-art text-to-speech model with zero-shot voice cloning. Supports 9 languages, streaming with ~100ms time-to-first-audio, and no transcript required for voice prompts.`,
  shortDescription: `State-of-the-art TTS with zero-shot voice cloning and multilingual support.`,
  slug: 'voxtral-tts-26-03',
  releaseDate: 'March 23, 2026',
  version: '26.03',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
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
    speed: { stars: 4.5, label: 'Very Fast' },
    performance: { stars: 4.0, label: 'Smart' },
    input: { stars: 4.5, label: 'Very Fast' },
    output: { stars: 4.0, label: 'Fast' },
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
<<<<<<< HEAD
  identifiers: { apiNames: ['voxtral-mini-tts-2603'] },
=======
  identifiers: { apiNames: ['voxtral-tts-2603'] },
>>>>>>> public/main
  capabilities: {
    input: ['text', 'audio'],
    output: ['audio'],
    features: ['tts'],
    finetuning: [],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/playground',
  legacy: false,
} as const satisfies StaticModel;
