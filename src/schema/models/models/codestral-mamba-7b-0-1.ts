import { StaticModel } from '../schema';
export default {
  name: 'Codestral Mamba 7B',
  describe: (l) => ({
    description: l.text(`A coding dedicated model using a mamba 2 architecture for research purposes under an open license.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A coding dedicated model using a mamba 2 architecture for research purposes.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'codestral-mamba-7b-0-1',
  releaseDate: '2024-07-16',
  version: '0.1',
  frontier: false,
  class: 'Specialist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/codestral',
  status: 'Retired',
  avatar: { icon: 'codestral-mamba', backgroundColor: 'orange' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mamba-Codestral-7B-v0.1',
      parameters: '7',
      minGpuRam: {
        bf16: '20',
        fp8: '10',
        fp4: '5',
        fp4_16: null,
      },
      active: '7',
      contextSize: '256k',
    }
  ],
  bloglink: 'https://mistral.ai/news/codestral-mamba',
  paperlink: null,
  contextLength: '256k',
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
  identifiers: { apiNames: ['open-codestral-mamba'] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '2025-06-06', retirementDate: '2025-06-06', replacement: 'Codestral'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
