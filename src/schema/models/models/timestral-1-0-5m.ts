import { StaticModel } from '../schema';

export default {
  name: 'Timestral 1.0 5M',
  describe: (l) => ({
    description: l.text(`Timestral 1.0 5M is a time series foundation model for zero-shot forecasting. The smallest model in the Timestral family, it delivers fast, lightweight forecasts, with support for contexts up to 32K timesteps, past-only and known-future covariates, and probabilistic quantile outputs.`, { context: 'Full description of an AI model' }),
    shortDescription: l.text(`A time series foundation model for zero-shot forecasting with covariate support and probabilistic outputs.`, { context: 'Short description of an AI model' }),
  }),
  slug: 'timestral-1-0-5m',
  version: '1.0',
  frontier: false,
  class: 'Specialist',
  type: 'Premier',
  legalButton: null,
  status: 'PublicPreview',
  avatar: { icon: 'timestral', backgroundColor: 'purple' },
  weights: [
    {
      name: 'Weights',
      license: 'Modified MIT',
      licenseUrl: 'https://huggingface.co/mistralai/Timestral-5M/blob/main/LICENSE',
      url: 'https://huggingface.co/mistralai/Timestral-5M',
      parameters: '5M',
      minGpuRam: {
        bf16: null,
        fp8: null,
        fp4: null,
        fp4_16: null,
      },
      active: '5M',
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
  identifiers: { apiNames: ['timestral-1-0-5m'] },
  capabilities: {
    input: ['timeseries'],
    output: ['timeseries'],
    features: [],
  },
  metadata: { parameters: '5M total and active' },
  playground: '',
  legacy: false,
} as const satisfies StaticModel;
