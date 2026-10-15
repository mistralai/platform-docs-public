import { StaticModel } from '../schema';

export default {
  name: 'Timestral 1.0',
  describe: (l) => ({
    description: l.text(`Timestral 1.0 is a time series foundation model for zero-shot forecasting. It ranks first among pretrained and zero-shot models on GIFT-Eval, TIME, and fev-bench, with support for contexts up to 32K timesteps, past-only and known-future covariates, and probabilistic quantile outputs.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A time series foundation model for zero-shot forecasting with covariate support and probabilistic outputs.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'timestral-1-0',
  version: '1.0',
  frontier: true,
  class: 'Specialist',
  type: 'Premier',
  legalButton: null,
  status: 'PublicPreview',
  avatar: { icon: 'timestral', backgroundColor: 'purple' },
  weights: [
    {
      name: 'Weights',
      license: 'Modified MIT',
      licenseUrl: 'https://huggingface.co/mistralai/Timestral-209M/blob/main/LICENSE',
      url: 'https://huggingface.co/mistralai/Timestral-209M',
      parameters: '209M',
      minGpuRam: {
        bf16: null,
        fp8: null,
        fp4: null,
        fp4_16: null,
      },
      active: '209M',
      contextSize: '32K',
    },
  ],
  bloglink: 'https://mistral.ai/news/timestral',
  paperlink: null,
  contextLength: '32K',
  ratings: {
    speed: 0.0,
    performance: 0.0,
    input: 0.0,
    output: 0.0,
  },
  hideRatings: true,
  pricing: {
    type: 'custom',
    free: false,
    input: [],
    output: [],
  },
  identifiers: { apiNames: ['timestral-1-0'] },
  capabilities: {
    input: ['timeseries'],
    output: ['timeseries'],
    features: [],
  },
  metadata: { parameters: '209M total and active' },
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
