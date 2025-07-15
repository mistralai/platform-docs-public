---
id: models_overview
title: Models Overview
slug: models_overview
---


Mistral provides two types of models: open models and premier models. 

:::note[ ]
- For API pricing details, please visit our [pricing page](https://mistral.ai/pricing#api-pricing). 
- If you are interested in purchasing a commercial license for our models, please [contact our team](https://mistral.ai/en/contact).
:::

### Premier models

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Mistral Medium 3 | | :heavy_check_mark: | Our frontier-class multimodal model released May 2025. Learn more in our [blog post](https://mistral.ai/news/mistral-medium-3/) | 128k | `mistral-medium-2505` | 25.05|
| Magistral Medium | | :heavy_check_mark: | Our frontier-class reasoning model released June 2025. Learn more in our [blog post](https://mistral.ai/news/magistral/) | 40k | `magistral-medium-2506` | 25.06|
| Codestral 2 | | :heavy_check_mark: | Our cutting-edge language model for coding with the second version released January 2025, Codestral specializes in low-latency, high-frequency tasks such as fill-in-the-middle (FIM), code correction and test generation. Learn more in our [blog post](https://mistral.ai/news/codestral-2501/) | 256k  | `codestral-2501` | 25.01|
| Devstral Medium | | :heavy_check_mark: | An enterprise grade text model, that excels at using tools to explore codebases, editing multiple files and power software engineering agents. Learn more in our [blog post](https://mistral.ai/news/devstral-2507) | 128k  | `devstral-medium-2507` | 25.07|
| Mistral OCR 2 | | :heavy_check_mark: | Our OCR service powering our Document AI stack that enables our users to extract interleaved text and images |  | `mistral-ocr-2505` | 25.05|
| Ministral 3B | | :heavy_check_mark: | World’s best edge model. Learn more in our [blog post](https://mistral.ai/news/ministraux/) | 128k  | `ministral-3b-2410` | 24.10|
| Ministral 8B | :heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)| :heavy_check_mark: |Powerful edge model with extremely high performance/price ratio. Learn more in our [blog post](https://mistral.ai/news/ministraux/) | 128k  | `ministral-8b-2410` | 24.10|
| Mistral Large 2.1 |:heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)| :heavy_check_mark: | Our top-tier large model for high-complexity tasks with the lastest version released November 2024. Learn more in our [blog post](https://mistral.ai/news/pixtral-large/) | 128k  | `mistral-large-2411` | 24.11|
| Pixtral Large |:heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)| :heavy_check_mark: | Our first frontier-class multimodal model released November 2024. Learn more in our [blog post](https://mistral.ai/news/pixtral-large/) | 128k  | `pixtral-large-2411` | 24.11|
| Mistral Small 2| :heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md) | :heavy_check_mark: | Our updated small version, released September 2024. Learn more in our [blog post](https://mistral.ai/news/september-24-release) | 32k  | `mistral-small-2407` | 24.07|
| Mistral Embed | | :heavy_check_mark: | Our state-of-the-art semantic for extracting representation of text extracts | 8k  | `mistral-embed` | 23.12|
| Codestral Embed | | :heavy_check_mark: | Our state-of-the-art semantic for extracting representation of code extracts | 8k  | `codestral-embed` | 25.05|
| Mistral Moderation | | :heavy_check_mark: | Our moderation service that enables our users to detect harmful text content | 8k  | `mistral-moderation-2411` | 24.11|

### Open models

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Voxtral Small | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our first model with audio input capabilities for instruct use cases.  | 32k  | `voxtral-small-2507` | 25.07|
| Voxtral Mini | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | A mini version of our first audio input model.  | 32k | `voxtral-mini-2507` | 25.07|
| Mistral Small 3.2 | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | An update to our previous small model, released June 2025. | 128k  | `mistral-small-2506` | 25.06|
| Magistral Small | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our small reasoning model released June 2025. Learn more in our [blog post](https://mistral.ai/news/magistral/) | 40k | `magistral-small-2506` | 25.06|
| Devstral Small 1.1 | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | An update to our open source model that excels at using tools to explore codebases, editing multiple files and power software engineering agents. Learn more in our [blog post](https://mistral.ai/news/devstral-2507) | 128k  | `devstral-small-2507` | 25.07|
| Mistral Small 3.1 | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | A new leader in the small models category with image understanding capabilities, released March 2025. Learn more in our [blog post](https://mistral.ai/news/mistral-small-3-1/) | 128k  | `mistral-small-2503` | 25.03|
| Mistral Small 3| :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | A new leader in the small models category, released January 2025. Learn more in our [blog post](https://mistral.ai/news/mistral-small-3) | 32k  | `mistral-small-2501` | 25.01|
| Devstral Small 1| :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | A 24B text model, open source model that excels at using tools to explore codebases, editing multiple files and power software engineering agents. Learn more in our [blog post](https://mistral.ai/news/devstral/) | 128k  | `devstral-small-2505` | 25.05|
| Codestral Mamba | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our first mamba 2 open source model released July 2024. Learn more in our [blog post](https://mistral.ai/news/codestral-mamba/) | 256k  | `open-codestral-mamba`| v0.1|
| Pixtral 12B | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | A 12B model with image understanding capabilities in addition to text. Learn more in our [blog post](https://mistral.ai/news/pixtral-12b/)| 128k  | `pixtral-12b-2409` | 24.09|
| Mistral Nemo 12B | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our best multilingual open source model released July 2024. Learn more in our [blog post](https://mistral.ai/news/mistral-nemo/) | 128k  | `open-mistral-nemo`| 24.07|
| Mathstral 7B | :heavy_check_mark: <br/> Apache2 |  | Our first math open source model released July 2024. Learn more in our [blog post](https://mistral.ai/news/mathstral/) | 32k  | | v0.1|

## API versioning 

Mistral AI API are versions with specific release dates. 
To prevent any disruptions due to model updates and breaking changes, 
it is recommended to use the dated versions of the Mistral AI API. 
Additionally, be prepared for the deprecation of certain endpoints in the coming months.

Here are the details of the available versions:
- `magistral-medium-latest`: currently points to `magistral-medium-2506`. 
- `magistral-small-latest`: currently points to `magistral-small-2506`. 
- `mistral-medium-latest`: currently points to `mistral-medium-2505`. 
- `mistral-large-latest`: currently points to `mistral-large-2411`. 
- `pixtral-large-latest`: currently points to `pixtral-large-2411`. 
- `mistral-moderation-latest`: currently points to `mistral-moderation-2411`.
- `ministral-3b-latest`: currently points to `ministral-3b-2410`.
- `ministral-8b-latest`: currently points to `ministral-8b-2410`.
- `open-mistral-nemo`: currently points to `open-mistral-nemo-2407`.
- `mistral-small-latest`: currently points to `mistral-small-2506`.
- `devstral-small-latest`: currently points to `devstral-small-2507`
- `devstral-medium-latest`: currently points to `devstral-medium-2507`
- `mistral-saba-latest`: currently points to `mistral-saba-2502`. 
- `codestral-latest`: currently points to `codestral-2501`.
- `mistral-ocr-latest`: currently points to `mistral-ocr-2505`.
- `voxtral-small-latest`: currently points to `voxtral-small-2507`.
- `voxtral-mini-latest`: currently points to `voxtral-mini-2507`.

## Model deprecation
### Overview
Our model offering is continuously refreshed with newer, better models. As part of this process, we deprecate and retire older models. This document provides information about which models are currently available, deprecated, or retired.

### Terminology
- Deprecation date: The date to mark the model as deprecated. When a model is deprecated, it continues to be available for use by customers with existing deployments until the model is retired. 
- Retirement date: The date to mark the model as retired. When a model is retired from la Plateforme, it is no longer available for use, and when prompted, it will return an error response.

### How to Prepare for Model Retirements and Version Upgrades
To prepare for model retirements and version upgrades, we recommend that customers evaluate their applications with the new models and versions and assess their behavior. We also recommend that customers update their applications to use the new models and versions before the retirement date

### Legacy models

| Model               | Weight availability|API Endpoints|Version|Deprecation date|Retirement date|Alternative model|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Mistral 7B    | :heavy_check_mark: <br/> Apache2| `open-mistral-7b`| v0.3|2024/11/30|2025/03/30| `ministral-8b-latest`|
| Mixtral 8x7B  |:heavy_check_mark: <br/> Apache2| `open-mixtral-8x7b`| v0.1| 2024/11/30|2025/03/30| `mistral-small-latest`|
| Mixtral 8x22B  |:heavy_check_mark: <br/> Apache2| `open-mixtral-8x22b`| v0.1|2024/11/30|2025/03/30| `mistral-small-latest`|
| Mistral Medium 2312  |  | `mistral-medium-2312`| 23.12 |2024/11/30|2025/06/16|`mistral-medium-latest`|
| Mistral Small 2402|  | `mistral-small-2402` | 24.02|2024/11/30|2025/06/16| `mistral-small-latest`|
| Mistral Large 2402  | | `mistral-large-2402`| 24.02|2024/11/30|2025/06/16| `mistral-medium-latest` | 
| Mistral Large 2407  | :heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)  | `mistral-large-2407`| 24.02|2024/11/30|2025/03/30| `mistral-medium-latest`|
| Codestral 2405 |:heavy_check_mark: <br/> [Mistral Non-Production License](https://mistral.ai/licenses/MNPL-0.1.md) | `codestral-2405` | 24.05|2024/12/02|2025/06/16| `codestral-latest`|
| Mistral OCR 2503 | | `mistral-ocr-2503` | 25.03| 2025/06/10|2026/03/31| `mistral-ocr-latest`|
| Mistral Saba 2502 | | `mistral-saba-2502` | 25.02| 2025/06/10|2025/09/30| `mistral-small-latest`|
