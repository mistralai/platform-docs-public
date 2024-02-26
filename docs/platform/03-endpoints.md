# Endpoints and benchmarks

We provide five different API endpoints to serve our generative models with different price/performance tradeoffs and one embedding endpoint for our embedding model. 

## Mistral AI generative models

Mistral AI provides five API endpoints for its five Large Language Models:
- `open-mistral-7b` (aka `mistral-tiny-2312`)
- `open-mixtral-8x7b` (aka `mistral-small-2312`)
- `mistral-small-latest` (aka `mistral-small-2402`)
- `mistral-medium-latest` (aka `mistral-medium-2312`)
- `mistral-large-latest` (aka `mistral-large-2402`)

## Mistral AI embedding model
Embedding models enable retrieval and retrieval-augmented generation applications.

Mistral AI embedding endpoint outputs vectors in `1024` dimensions. It achieves a retrieval score of 55.26 on MTEB.

API name: `mistral-embed`

## Benchmarks results
The following tables gather results on a suite of  commonly used benchmarks for each of our model. Check out our [model selection](../guides/06-model-selection.md) guide to explore further the performance, speed, and cost trade-offs, and discuss how to select the appropriate model for different use cases.

### General knowledge, common sense and reasoning

| Model | MMLU | hellaswag (10-shot) | winograde (5-shot) | arc challenge (25-shot) | TriviaQA (5-shot) | TruthfulQA |
| --- | ---- | ---|---|---|---|---|
| Mistral 7B | 62.5% | 83.1% | 78.0% | 78.1% | 68.8% | 42.35% |
| Mixtral 8x7B | 70.6% | 86.7% | 81.2% | 85.8% | 78.38% | 47.5% |
| Mistral Small | 72.2% | 86.9% | 84.7% | 86.9% | 79.5% | 51.7% |
| Mistral Medium | 75.3% | 88.0% | 88% | 89.9% | 81.1% | 47% |
| Mistral Large | 81.2% | 89.2% | 86.7% | 94.0% | 82.7% | 50.6% |


### Coding

| Model | HumanE pass@1 | MBPP pass@1 |
| --- | ---- | ---|
| Mistral 7B | 26.2% | 50.2% |
| Mistral 8x7B | 40.2% | 60.7% |
| Mistral Small | 44.5% | 61.5% |
| Mistral Medium | 38.4% | 62.3% | 
| Mistral Large | 45.1% | 73.2% |


### Multi-lingual

| Model | FR Arc-C | FR HellaS | FR MMLU | DE Arc-C | DE HellaS | DE MMLU | ES Arc-C | ES HellaS | ES MMLU | IT Arc-C | IT HellaS | IT MMLU | 
| --- | ---- | --- | --- | ---- | --- | --- | ---- | --- | --- | ---- | --- | --- |
| Mistral 7B | 44.2% | 63.9% | 50.6% | 39.9% | 58.4% | 49.6% | 43.9% | 64.8% | 51.4% | 41.2% | 60.8% | 51.3% | 
| Mistral 8x7B | 54.3% | 76.0% | 66.1% | 52.7% | 71.0% | 64.9% | 53.7% | 76.3% | 67.5% | 51.1% | 72.9% | 65.9% |
| Mistral Small | 58.8% | 77.4% | 68.4% | 53.0% | 72.9% | 70.1% | 55.9% | 78.2% | 69.7% | 53.7% | 75.1% | 69.5% | 
| Mistral Medium | 58.2% | 77.4% | 70.9% | 54.3% | 73.0% | 71.5% | 55.4% | 77.6% | 72.5% | 52.8% | 75.1% | 70.9% | 
| Mistral Large | 62.3% | 80.3% | 79.3% | 57.6% | 77.2% | 78.2% | 61.7% | 81.9% | 79.7% | 60.3% | 77.8% | 78.9% | 

