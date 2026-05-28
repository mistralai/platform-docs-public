import { StaticModel } from '../schema';
export default {
  name: 'Codestral',
  describe: (l) => ({
    description: l.text(`Our first cutting-edge language model for coding and FIM, released under the MNPL license.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`Our first cutting-edge language model for coding and FIM.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'codestral-24-05',
  releaseDate: '2024-05-29',
  version: '24.05',
  frontier: false,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/codestral',
  status: 'Retired',
  avatar: { icon: 'codestral', backgroundColor: 'yellow' },
  weights: [
    {
      name: 'Weights',
      license: 'MNPL',
      licenseUrl: 'https://mistral.ai/static/licenses/MNPL-0.1.md',
      url: 'https://huggingface.co/mistralai/Codestral-22B-v0.1',
      parameters: '22',
      minGpuRam: {
        bf16: '52',
        fp8: '26',
        fp4: null,
        fp4_16: null,
      },
      active: '22',
      contextSize: '32k',
    }
  ],
  bloglink: 'https://mistral.ai/news/codestral',
  paperlink: null,
  contextLength: '32k',
  ratings: { 
    speed: 0.0,
    performance: 0.0, input: 4.0, output: 2.0 },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['codestral-2405'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '2024-12-02', retirementDate: '2025-06-16', replacement: 'Codestral'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
