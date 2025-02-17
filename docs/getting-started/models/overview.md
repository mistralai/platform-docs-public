---
id: models_overview
title: Models Overview
slug: models_overview
---


Mistral provides two types of models: free models and premier models. 

:::note[ ]
- For API pricing details, please visit our [pricing page](https://mistral.ai/en/products/la-plateforme#pricing). 
- If you are interested in purchasing a commercial license for our models, please [contact our team](https://mistral.ai/en/contact).
:::

### Premier models

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Codestral | | :heavy_check_mark: | Our cutting-edge language model for coding with the second version released January 2025, Codestral specializes in low-latency, high-frequency tasks such as fill-in-the-middle (FIM), code correction and test generation. Learn more on our [blog post](https://mistral.ai/news/codestral-2501/) | 256k  | `codestral-latest` | 25.01|
| Mistral Large  |:heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)| :heavy_check_mark: |Our top-tier reasoning model for high-complexity tasks with the lastest version released November 2024. Learn more on our [blog post](https://mistral.ai/news/pixtral-large/) | 131k   | `mistral-large-latest`| 24.11|
| Pixtral Large  |:heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)| :heavy_check_mark: |Our frontier-class multimodal model released November 2024. Learn more on our [blog post](https://mistral.ai/news/pixtral-large/)| 131k   | `pixtral-large-latest`| 24.11|
| Mistral Saba  | | :heavy_check_mark: | A powerfull and efficient model for languages from the Middle East and South Asia. Learn more on our [blog post](https://mistral.ai/news/mistral-saba/)| 32k   | `mistral-saba-latest`| 25.02|
| Ministral 3B | | :heavy_check_mark: | World’s best edge model. Learn more on our [blog post](https://mistral.ai/news/ministraux/) | 131k  | `ministral-3b-latest` | 24.10|
| Ministral 8B | :heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)| :heavy_check_mark: |Powerful edge model with extremely high performance/price ratio. Learn more on our [blog post](https://mistral.ai/news/ministraux/) | 131k  | `ministral-8b-latest` | 24.10|
| Mistral Embed | | :heavy_check_mark: | Our state-of-the-art semantic for extracting representation of text extracts | 8k  | `mistral-embed` | 23.12|
| Mistral Moderation | | :heavy_check_mark: | Our moderation service that enables our users to detect harmful text content | 8k  | `mistral-moderation-latest` | 24.11|


### Free models

- **Latest models**

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Mistral Small | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | A new leader in the small models category with the lastest version v3 released January 2025. Learn more on our [blog post](https://mistral.ai/news/mistral-small-3/) | 32k  | `mistral-small-latest` | 25.01|
| Pixtral | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | A 12B model with image understanding capabilities in addition to text. Learn more on our [blog post](https://mistral.ai/news/pixtral-12b/)| 131k  | `pixtral-12b-2409` | 24.09|

- **Research models**

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Mistral Nemo | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our best multilingual open source model released July 2024. Learn more on our [blog post](https://mistral.ai/news/mistral-nemo/) | 131k  | `open-mistral-nemo`| 24.07|
| Codestral Mamba | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our first mamba 2 open source model released July 2024. Learn more on our [blog post](https://mistral.ai/news/codestral-mamba/) | 256k  | `open-codestral-mamba`| v0.1|
| Mathstral | :heavy_check_mark: <br/> Apache2 |  | Our first math open source model released July 2024. Learn more on our [blog post](https://mistral.ai/news/mathstral/) | 32k  | NA| v0.1|


## API versioning 

Mistral AI API are versions with specific release dates. 
To prevent any disruptions due to model updates and breaking changes, 
it is recommended to use the dated versions of the Mistral AI API. 
Additionally, be prepared for the deprecation of certain endpoints in the coming months.

Here are the details of the available versions:
- `mistral-large-latest`: currently points to `mistral-large-2411`. 
- `pixtral-large-latest`: currently points to `pixtral-large-2411`. 
- `mistral-moderation-latest`: currently points to `mistral-moderation-2411`.
- `ministral-3b-latest`: currently points to `ministral-3b-2410`.
- `ministral-8b-latest`: currently points to `ministral-8b-2410`.
- `open-mistral-nemo`: currently points to `open-mistral-nemo-2407`.
- `mistral-small-latest`: currently points to `mistral-small-2501`.
- `mistral-saba-latest`: currently points to `mistral-saba-2502`. 
- `codestral-latest`: currently points to `codestral-2501`.

## Model deprecation
### Overview
Our model offering is continuously refreshed with newer, better models. As part of this process, we deprecate and retire older models. This document provides information about which models are currently available, deprecated, or retired.

### Terminology
- Legacy date: The date to mark the model as legacy. On this date we will inform our customers that a specific model will be deprecated and retired soon.
- Deprecation date: The date to mark the model as deprecated. When a model is deprecated, it continues to be available for use by customers with existing deployments until the model is retired. 
- Retirement date: The date to mark the model as retired. When a model is retired from la Plateforme, it is no longer available for use, and when prompted, it will return an error response.

### How to Prepare for Model Retirements and Version Upgrades
To prepare for model retirements and version upgrades, we recommend that customers evaluate their applications with the new models and versions and assess their behavior. We also recommend that customers update their applications to use the new models and versions before the retirement date

### Legacy models

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|Legacy date|Deprecation on date|Retirement date|Alternative model|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Mistral 7B    | :heavy_check_mark: <br/> Apache2 |:heavy_check_mark: | Our first dense model released September 2023. Learn more on our [blog post](https://mistral.ai/news/announcing-mistral-7b/)| 32k | `open-mistral-7b`| v0.3|2024/11/25|2024/11/30|2025/03/30| `ministral-8b-latest`|
| Mixtral 8x7B  |:heavy_check_mark: <br/> Apache2 | :heavy_check_mark: |Our first sparse mixture-of-experts released December 2023. Learn more on our [blog post](https://mistral.ai/news/mixtral-of-experts/)| 32k  | `open-mixtral-8x7b`| v0.1| 2024/11/25|2024/11/30|2025/03/30| `mistral-small-latest`|
| Mixtral 8x22B  |:heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our best open source model to date released April 2024. Learn more on our [blog post](https://mistral.ai/news/mixtral-8x22b/)| 64k  | `open-mixtral-8x22b`| v0.1|2024/11/25|2024/11/30|2025/03/30| `mistral-small-latest`|
| Mistral Medium  | | :heavy_check_mark: | Ideal for intermediate tasks that require moderate reasoning | 32k  | `mistral-medium-2312`| 23.12 |2024/11/25|2024/11/30|2025/03/30|`mistral-small-latest`|
| Mistral Small 24.02|  | :heavy_check_mark: | Our latest enterprise-grade small model with the first version released Feb. 2024 | 32k  | `mistral-small-2402` | 24.09| 2024/11/25|2024/11/30|2025/03/30| `mistral-small-latest`|
| Mistral Large 24.02  | | :heavy_check_mark: |Our top-tier reasoning model for high-complexity tasks with the the first version released Feb. 2024. Learn more on our [blog post](https://mistral.ai/news/mistral-large/) | 32k   | `mistral-large-2402`| 24.02|2024/11/25|2024/11/30|2025/03/30| `mistral-large-latest` | 
| Mistral Large 24.07  | :heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md) | :heavy_check_mark: |Our top-tier reasoning model for high-complexity tasks with the the second version released July 2024. Learn more on our [blog post](https://mistral.ai/news/mistral-large-2407/) | 131k   | `mistral-large-2407`| 24.02|2024/11/25|2024/11/30|2025/03/30| `mistral-large-latest`|
| Codestral |:heavy_check_mark: <br/> [Mistral Non-Production License](https://mistral.ai/licenses/MNPL-0.1.md) | :heavy_check_mark: | Our cutting-edge language model for coding with the first version released [May 2024](https://mistral.ai/news/codestral/) | 32k  | `codestral-2405` | 24.05| 2024/12/02|2024/12/02|2025/03/30| `codestral-latest`|
