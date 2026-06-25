import { StaticModel } from '../schema';
export default {
  name: 'Mathstral 7B',
  describe: (l) => ({
    description: l.text(`A math dedicated model for research purposes under an open license.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A math dedicated model for research purposes.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'mathstral-7b-0-1',
  releaseDate: '2024-07-16',
  version: '0.1',
  frontier: false,
  class: 'Specialist',
  type: 'Open',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mathstral-7b',
  status: 'Retired',
  avatar: { icon: 'mathstral', backgroundColor: 'beige' },
  weights: [
    {
      name: 'Weights',
      license: 'Apache 2.0',
      licenseUrl: 'https://www.apache.org/licenses/LICENSE-2.0.txt',
      url: 'https://huggingface.co/mistralai/Mathstral-7B-v0.1',
      parameters: '7',
      minGpuRam: {
        bf16: '20',
        fp8: '10',
        fp4: '5',
        fp4_16: null,
      },
      active: '7',
      contextSize: '32k',
    }
  ],
  bloglink: 'https://mistral.ai/news/mathstral',
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
  identifiers: { apiNames: [] },
  capabilities: {
    input: ['text'],
    output: ['text'],
    features: [],

  },
  metadata: {deprecationDate: '', retirementDate: '', replacement: 'Mistral Small 4'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
