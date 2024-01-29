import Benchmark from '@site/static/img/mistral_family.png';

# Endpoints

We provide different endpoints with different price/performance tradeoffs. Our endpoints depend on internal models.
 Some of them are [open-weight](../../models), which allow users to deploy them on their own, on arbitrary infrastructure.
 See [Self-deployment](../../self-deployment/overview) for details.

## Generative endpoints

All our generative endpoints can reason on contexts up to 32k tokens and follow fine-grained instructions.
The following table gathers benchmarks for each endpoint.


<table>
  <tr>
    <th></th>
    <th>Mistral-tiny</th>
    <th>Mistral-small</th>
    <th>Mistral-medium</th>
  </tr>
  <tr>
    <td><b>MMLU</b> <br/>(MCQ in 57 subjects)</td>
    <td>63.0%</td>
    <td>70.6%</td>
    <td><b>75.3%</b></td>
  </tr>
  <tr>
    <td><b>HellaSwag</b> <br/> (10-shot)</td>
    <td>83.1%</td>
    <td>86.7%</td>
    <td><b>88.0%</b></td>
  </tr>
  <tr>
    <td><b>ARC Challenge</b> <br/> (25-shot)</td>
    <td>78.1%</td>
    <td>85.8%</td>
    <td><b>89.9%</b></td>
  </tr>
  <tr>
    <td><b>WinoGrande</b> <br/> (5-shot)</td>
    <td>78.0%</td>
    <td>81.2%</td>
    <td><b>88.0%</b></td>
  </tr>
  <tr>
    <td><b>MBPP</b> <br/> (pass@1)</td>
    <td>30.5%</td>
    <td>60.7%</td>
    <td><b>62.3%</b></td>
  </tr>
  <tr>
    <td><b>GSM-8K</b> <br/> (5-shot)</td>
    <td>36.5%</td>
    <td>58.4%</td>
    <td><b>66.7%</b></td>
  </tr>
  <tr>
    <td><b>MT Bench</b> <br/> (for Instruct models)</td>
    <td>7.61</td>
    <td>8.30</td>
    <td><b>8.61</b></td>
  </tr>
</table>

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


