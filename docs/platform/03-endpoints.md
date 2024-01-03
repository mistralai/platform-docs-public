import Benchmark from '@site/static/img/mistral_family.png';

# Endpoints

We provide different endpoints with different price/performance tradeoffs. Our endpoints depend on internal models.
 Some of them are [open-weight](../../models), which allow users to deploy them on their own, on arbitrary infrastructure.
 See [Self-deployment](../../self-deployment/overview) for details.

## Generative endpoints

All our generative endpoints can reason on contexts up to 32k tokens and follow fine-grained instructions.
The following table gathers benchmarks for each endpoint.

<!-- <div style="text-align: center;"> -->
<img src={Benchmark} alt="Benchmark" width="500px" class="center"/>
<!-- </div> -->

We only provide chat access through our API. Users can access underlying base models for endpoints relying on 
[open-weight models](../../models).

### Tiny

This generative endpoint is best used for large batch processing tasks where cost is a significant factor 
but reasoning capabilities are not crucial.

Currently powered by Mistral-7B-v0.2, a better fine-tuning of the initial Mistral-7B released,
inspired by the fantastic work of the community.


API name: `mistral-tiny`

### Small

Higher reasoning capabilities and more capabilities.

The endpoint supports English, French, German, Italian, and Spanish and can produce and reason about code.

Currently powered Mixtral-8X7B-v0.1, a sparse mixture of experts model with 12B active parameters.


API name: `mistral-small`

### Medium

This endpoint currently relies on an internal prototype model.

API name: `mistral-medium`

## Embedding models

Embedding models enable retrieval and retrieval-augmented generation applications.

Our endpoint outputs vectors in `1024` dimensions. It achieves a retrieval score of 55.26 on MTEB.

API name: `mistral-embed`


