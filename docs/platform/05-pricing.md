# Pricing and rate limits

## Pay-as-you-go

The prices listed below are exclusive of VAT.

### Chat Completions API

| Model  | Endpoint  | Input | Output |
|-----------|-----------|-----------|-----------|
| Mistral 7B | `open-mistral-7b` | 0.25€ / 1M tokens | 0.25€ / 1M tokens |
| Mixtral 8x7B | `open-mixtral-8x7b` | 0.7€ / 1M tokens | 0.7€ / 1M tokens |
| Mistral-small | `mistral-small-latest` | 2€ / 1M tokens | 6€ / 1M tokens |
| Mistral-medium | `mistral-medium-latest` | 2.5€ / 1M tokens | 7.5€ / 1M tokens |
| Mistral-large | `mistral-large-latest` | 8€ / 1M tokens | 24€ / 1M tokens |

### Embeddings API

| Model  | Endpoint | Input |
|-----------|-----------|-----------|
| Mistral-embed | `mistral-embed` | 0.1€ / 1M tokens |

## Rate limits

All endpoints have a rate limit of 2 requests per second, 2 million tokens per minute, and 200 million tokens per month. You can check your current rate limits on the platform. If you need to increase them, please contact support with your estimated consumption and use case.

We will raise the limits for embedding models in the future.