import { StaticModel } from '../schema';
export default {
  name: 'Mistral Large 2.0',
  describe: (l) => ({
    description: l.text(`A powerfull model with open weights under a MRL license, competing agains SOTA much larger models.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A powerfull model with open weights under a MRL license.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mistral-large-2-0-24-07',
  releaseDate: '2024-07-24',
  version: '24.07',
  frontier: false,
  class: 'Generalist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-large-2',
  status: 'Retired',
  avatar: { icon: 'mistral-large', backgroundColor: 'red' },
  weights: [
    {
      name: 'Weights',
      license: 'MRL',
      licenseUrl: 'https://mistral.ai/static/licenses/MRL-0.1.md',
      url: 'https://huggingface.co/mistralai/Mistral-Large-Instruct-2407',
      parameters: '123',
      minGpuRam: {
        bf16: '297',
        fp8: '149',
        fp4: '75',
        fp4_16: null,
      },
      active: '123',
      contextSize: '128k',
    }
  ],
  bloglink: 'https://mistral.ai/news/mistral-large-2407',
  paperlink: null,
  contextLength: '128k',
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
  identifiers: { apiNames: ['mistral-large-2407'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '2024-11-30', retirementDate: '2025-03-30', replacement: 'Mistral Large 3'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
