import { StaticModel } from '../schema';
export default {
  name: 'Voxtral Small Transcribe 3',
  describe: (l) => ({
    description: l.text(`Voxtral Small Transcribe 3 is our flagship transcription and diarization model. It achieves SOTA transcription scores, outperforming Microsoft AI Transcribe 2, Whisper large-v3, GPT-Transcribe, Scribe v2, and Gemini 3.5 Transcribe. It also supports translation, speech Q&A, summarization, and function calling.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Flagship transcription and diarization model with SOTA accuracy.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'voxtral-small-transcribe-3-0',
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
    speed: 3.5,
    performance: 4.5,
    input: 4.0,
    output: 2.0,
  },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 0.004, denominator: '/Min' },
    ],
    output: [],
  },
  identifiers: { apiNames: ['voxtral-small-transcribe-3-0', 'voxtral-small-transcribe-3', 'voxtral-small-transcribe-latest'] },
  capabilities: {
    input: ['audio'],
    output: ['text'],
    features: ['timestamps', 'transcriptions'],
  },
  metadata: {},
  playground: 'https://console.mistral.ai/build/audio/speech-to-text',
  legacy: false,
} as const satisfies StaticModel;
