---
id: models_overview
title: Models Overview
slug: models_overview
---


Mistral provides two types of models: free models and premier models. 

:::note[ ]
- For API pricing details, please visit our [pricing page](https://mistral.ai/technology/#pricing). 
- If you are interested in purchasing a commercial license for our models, please [contact our team](https://mistral.ai/contact/).
:::

### Premier models

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Mistral Large  |:heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)| :heavy_check_mark: |Our top-tier reasoning model for high-complexity tasks with the lastest version released November 2024. Learn more on our [blog post](https://mistral.ai/news/pixtral-large/) | 128k   | `mistral-large-latest`| 24.11|
| Pixtral Large  |:heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)| :heavy_check_mark: |Our frontier-class multimodal model released November 2024. Learn more on our [blog post](https://mistral.ai/news/pixtral-large/)| 128k   | `pixtral-large-latest`| 24.11|
| Ministral 3B | | :heavy_check_mark: | World’s best edge model. Learn more on our [blog post](https://mistral.ai/news/ministraux/) | 128k  | `ministral-3b-latest` | 24.10|
| Ministral 8B | :heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md)| :heavy_check_mark: |Powerful edge model with extremely high performance/price ratio. Learn more on our [blog post](https://mistral.ai/news/ministraux/) | 128k  | `ministral-8b-latest` | 24.10|
| Mistral Small | :heavy_check_mark: <br/> [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md) | :heavy_check_mark: | Our latest enterprise-grade small model with the lastest version v2 released September 2024. Learn more on our [blog post](https://mistral.ai/news/september-24-release/) | 32k  | `mistral-small-latest` | 24.09|
| Codestral |:heavy_check_mark: <br/> [Mistral Non-Production License](https://mistral.ai/licenses/MNPL-0.1.md) | :heavy_check_mark: | Our cutting-edge language model for coding released May 2024 | 32k  | `codestral-latest` | 24.05|
| Mistral Embed | | :heavy_check_mark: | Our state-of-the-art semantic for extracting representation of text extracts | 8k  | `mistral-embed` | 23.12|
| Mistral Moderation | | :heavy_check_mark: | Our moderation service that enables our users to detect harmful text content | 8k  | `mistral-moderation-latest` | 24.11|


### Free models

- **Latest models**

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Pixtral | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | A 12B model with image understanding capabilities in addition to text. Learn more on our [blog post](https://mistral.ai/news/pixtral-12b/)| 128k  | `pixtral-12b-2409` | 24.09|

- **Research models**

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Mistral Nemo | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our best multilingual open source model released July 2024. Learn more on our [blog post](https://mistral.ai/news/mistral-nemo/) | 128k  | `open-mistral-nemo`| 24.07|
| Codestral Mamba | :heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our first mamba 2 open source model released July 2024. Learn more on our [blog post](https://mistral.ai/news/codestral-mamba/) | 256k  | `open-codestral-mamba`| v0.1|
| Mathstral | :heavy_check_mark: <br/> Apache2 |  | Our first math open source model released July 2024. Learn more on our [blog post](https://mistral.ai/news/mathstral/) | 32k  | NA| v0.1|


- **Legacy models**

| Model               | Weight availability|Available via API| Description | Max Tokens| API Endpoints|Version|
|--------------------|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|:--------------------:|
| Mistral 7B    | :heavy_check_mark: <br/> Apache2 |:heavy_check_mark: | Our first dense model released September 2023. Learn more on our [blog post](https://mistral.ai/news/announcing-mistral-7b/)| 32k | `open-mistral-7b`| v0.3|
| Mixtral 8x7B  |:heavy_check_mark: <br/> Apache2 | :heavy_check_mark: |Our first sparse mixture-of-experts released December 2023. Learn more on our [blog post](https://mistral.ai/news/mixtral-of-experts/)| 32k  | `open-mixtral-8x7b`| v0.1|
| Mixtral 8x22B  |:heavy_check_mark: <br/> Apache2 | :heavy_check_mark: | Our best open source model to date released April 2024. Learn more on our [blog post](https://mistral.ai/news/mixtral-8x22b/)| 64k  | `open-mixtral-8x22b`| v0.1|


## API versioning 

Mistral AI API are versions with specific release dates. 
To prevent any disruptions due to model updates and breaking changes, 
it is recommended to use the dated versions of the Mistral AI API. 
Additionally, be prepared for the deprecation of certain endpoints in the coming months.

Here are the details of the available versions:
- `mistral-large-latest`: currently points to `mistral-large-2411`. `mistral-large-2407` and `mistral-large-2402` will be deprecated shortly. 
- `pixtral-large-latest`: currently points to `pixtral-large-2411`. 
- `mistral-moderation-latest`: currently points to `mistral-moderation-2411`.
- `ministral-3b-latest`: currently points to `ministral-3b-2410`.
- `ministral-8b-latest`: currently points to `ministral-8b-2410`.
- `open-mistral-nemo`: currently points to `open-mistral-nemo-2407`.
- `mistral-small-latest`: currently points to `mistral-small-2409`. `mistral-small-2402` is deprecated.
- `mistral-medium-latest`: currently points to `mistral-medium-2312`. 
The previous `mistral-medium` has been dated and tagged as `mistral-medium-2312`. 
Mistral Medium will be deprecated shortly.
- `codestral-latest`: currently points to `codestral-2405`.
