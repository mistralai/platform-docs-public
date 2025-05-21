---
id: weights
title: Model weights
slug: weights
---

We open-source both pre-trained models and instruction-tuned models. These models are not tuned for safety as we want to empower users to test and refine moderation based on their use cases. For safer models, follow our [guardrailing tutorial](/capabilities/guardrailing).

## License
- Mistral 7B, Mixtral 8x7B, Mixtral 8x22B, Codestral Mamba, Mathstral, Mistral Nemo, Pixtral 12B, Mistral Small and Devstral Small are under [Apache 2 License](https://choosealicense.com/licenses/apache-2.0/), which permits their use without any constraints.
- Codestral is under [Mistral AI Non-Production (MNPL) License](https://mistral.ai/licences/MNPL-0.1.md).
- Ministral 8B, Mistral Large, and Pixtral Large are under [Mistral Research License](https://mistral.ai/licenses/MRL-0.1.md). 

:::note[ ]
If you are interested in purchasing a commercial license for our models, please [contact our team](https://mistral.ai/contact/)
:::

## Downloading

| Model               |Download links|Features|
|--------------------|:--------------------|:--------------------|
| Mistral-7B-v0.1  | [Hugging Face](https://huggingface.co/mistralai/Mistral-7B-v0.1) <br/> [raw_weights](https://models.mistralcdn.com/mistral-7b-v0-1/mistral-7B-v0.1.tar) (md5sum: `37dab53973db2d56b2da0a033a15307f`) |- 32k vocabulary size <br/> - Rope Theta = 1e4 <br/> - With sliding window|
| Mistral-7B-Instruct-v0.2  | [Hugging Face](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2) <br/> [raw_weights](https://models.mistralcdn.com/mistral-7b-v0-2/Mistral-7B-v0.2-Instruct.tar) (md5sum: `fbae55bc038f12f010b4251326e73d39`) | - 32k vocabulary size <br/> - Rope Theta = 1e6 <br/> - No sliding window |
| Mistral-7B-v0.3  | [Hugging Face](https://huggingface.co/mistralai/Mistral-7B-v0.3) <br/> [raw_weights](https://models.mistralcdn.com/mistral-7b-v0-3/mistral-7B-v0.3.tar) (md5sum: `0663b293810d7571dad25dae2f2a5806`) |- Extended vocabulary to 32768 <br/> |
| Mistral-7B-Instruct-v0.3  | [Hugging Face](https://huggingface.co/mistralai/Mistral-7B-v0.3) <br/> [raw_weights](https://models.mistralcdn.com/mistral-7b-v0-3/mistral-7B-v0.3.tar) (md5sum: `80b71fcb6416085bcb4efad86dfb4d52`) |- Extended vocabulary to 32768 <br/> - Supports v3 Tokenizer <br/> - Supports function calling|
| Mixtral-8x7B-v0.1   | [Hugging Face](https://huggingface.co/mistralai/Mixtral-8x7B-v0.1) |- 32k vocabulary size <br/> - Rope Theta = 1e6|
| Mixtral-8x7B-Instruct-v0.1  | [Hugging Face](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) <br/> [raw_weights](https://models.mistralcdn.com/mixtral-8x7b-v0-1/Mixtral-8x7B-v0.1-Instruct.tar) (md5sum: `8e2d3930145dc43d3084396f49d38a3f`) |- 32k vocabulary size <br/> - Rope Theta = 1e6|
| Mixtral-8x7B-v0.3  | Updated model coming soon!  |- Extended vocabulary to 32768 <br/> - Supports v3 Tokenizer |
| Mixtral-8x7B-Instruct-v0.3  |Updated model coming soon!   |- Extended vocabulary to 32768 <br/> - Supports v3 Tokenizer <br/> - Supports function calling|
| Mixtral-8x22B-v0.1  | [Hugging Face](https://huggingface.co/mistralai/Mixtral-8x22B-v0.1) <br/> [raw_weights](magnet:?xt=urn:btih:9238b09245d0d8cd915be09927769d5f7584c1c9&dn=mixtral-8x22b&tr=udp%3A%2F%http://2Fopen.demonii.com%3A1337%2Fannounce&tr=http%3A%2F%https://t.co/OdtBUsbeV5%3A1337%2Fannounce) (md5sum: `0535902c85ddbb04d4bebbf4371c6341`) |- 32k vocabulary size |
| Mixtral-8x22B-Instruct-v0.1/ <br/> Mixtral-8x22B-Instruct-v0.3 | [Hugging Face](https://huggingface.co/mistralai/Mixtral-8x22B-Instruct-v0.1) <br/> [raw_weights](https://models.mistralcdn.com/mixtral-8x22b-v0-3/mixtral-8x22B-Instruct-v0.3.tar) (md5sum: `471a02a6902706a2f1e44a693813855b`)|- 32768 vocabulary size |
| Mixtral-8x22B-v0.3  | [raw_weights](https://models.mistralcdn.com/mixtral-8x22b-v0-3/mixtral-8x22B-v0.3.tar) (md5sum: `a2fa75117174f87d1197e3a4eb50371a`) | - 32768 vocabulary size <br/> - Supports v3 Tokenizer |
| Codestral-22B-v0.1  | [Hugging Face](https://huggingface.co/mistralai/Codestral-22B-v0.1) <br/> [raw_weights](https://models.mistralcdn.com/codestral-22b-v0-1/codestral-22B-v0.1.tar) (md5sum: `1ea95d474a1d374b1d1b20a8e0159de3`) | - 32768 vocabulary size <br/> - Supports v3 Tokenizer |
| Codestral-Mamba-7B-v0.1  | [Hugging Face](https://huggingface.co/mistralai/mamba-codestral-7B-v0.1) <br/> [raw_weights](https://models.mistralcdn.com/codestral-mamba-7b-v0-1/codestral-mamba-7B-v0.1.tar) (md5sum: `d3993e4024d1395910c55db0d11db163`) | - 32768 vocabulary size <br/> - Supports v3 Tokenizer |
| Mathstral-7B-v0.1  | [Hugging Face](https://huggingface.co/mistralai/mathstral-7B-v0.1) <br/> [raw_weights](https://models.mistralcdn.com/mathstral-7b-v0-1/mathstral-7B-v0.1.tar) (md5sum: `5f05443e94489c261462794b1016f10b`) | - 32768 vocabulary size <br/> - Supports v3 Tokenizer |
| Mistral-Nemo-Base-2407  | [Hugging Face](https://huggingface.co/mistralai/Mistral-Nemo-Base-2407) <br/> [raw_weights](https://models.mistralcdn.com/mistral-nemo-2407/mistral-nemo-base-2407.tar) (md5sum: `c5d079ac4b55fc1ae35f51f0a3c0eb83`) | - 128k vocabulary size <br/> - Supports v3 tekken.json tokenizer |  
| Mistral-Nemo-Instruct-2407  | [Hugging Face](https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407) <br/> [raw_weights](https://models.mistralcdn.com/mistral-nemo-2407/mistral-nemo-instruct-2407.tar) (md5sum: `296fbdf911cb88e6f0be74cd04827fe7`) | - 128k vocabulary size <br/> - Supports v3 tekken.json tokenizer <br/> - Supports function calling |
| Mistral-Large-Instruct-2407  | [Hugging Face](https://huggingface.co/mistralai/Mistral-Large-Instruct-2407) <br/> [raw_weights](https://models.mistralcdn.com/mistral-large-2407/mistral-large-instruct-2407.tar) (md5sum: `fc602155f9e39151fba81fcaab2fa7c4`)| - 32768 vocabulary size <br/> - Supports v3 Tokenizer <br/> - Supports function calling |
| Pixtral-2409 | [Hugging Face](https://huggingface.co/mistralai/Pixtral-12B-2409) | - 128k vocabulary size <br/> - Supports v3 tekken.json tokenizer <br/> - Supports function calling <br/> - Supports images |
| Mistral-Small-Instruct-2409 | [Hugging Face](https://huggingface.co/mistralai/Mistral-Small-Instruct-2409) | - 32768 vocabulary size <br/> - Supports v3 Tokenizer <br/> - Supports function calling |
| Ministral-8B-Instruct-2410 | [Hugging Face](https://huggingface.co/mistralai/Ministral-8B-Instruct-2410) | - 128k vocabulary size <br/> - Supports v3 tekken.json tokenizer <br/> - Supports function calling |
| Mistral-Large-Instruct-2411  | [Hugging Face](https://huggingface.co/mistralai/Mistral-Large-Instruct-2411)| - 32768 vocabulary size <br/> - Supports v7 tokenizer <br/> - Supports function calling |
| Pixtral-Large-Instruct-2411  | [Hugging Face](https://huggingface.co/mistralai/Pixtral-Large-Instruct-2411)| - 32768 vocabulary size <br/> - Supports v7 tokenizer <br/> - Supports function calling <br/> - Supports images |
| Mistral-Small-Base-2501  | [Hugging Face](https://huggingface.co/mistralai/Mistral-Small-Base-2501)| - 128k vocabulary size <br/> - Supports v7 tekken.json tokenizer <br/> - Supports function calling |
| Mistral-Small-Instruct-2501  | [Hugging Face](https://huggingface.co/mistralai/Mistral-Small-Instruct-2501)| - 128k vocabulary size <br/> - Supports v7 tekken.json tokenizer <br/> - Supports function calling |
| Mistral-Small-Base-2503  | [Hugging Face](https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Base-2503)| - 128k vocabulary size <br/> - Supports v7 tekken.json tokenizer <br/> - Supports function calling <br/> - Supports images |
| Mistral-Small-Instruct-2503  | [Hugging Face](https://huggingface.co/mistralai/Mistral-Small-3.1-24B-Instruct-2503)| - 128k vocabulary size <br/> - Supports v7 tekken.json tokenizer <br/> - Supports function calling <br/> - Supports images |
| Devstral-Small-2505  | [Hugging Face](https://huggingface.co/mistralai/Devstral-Small-2505)| - 128k vocabulary size <br/> - Supports v7 tekken.json tokenizer <br/> - Supports function calling |

## Sizes

| Name               | Number of parameters | Number of active parameters | Min. GPU RAM for inference (GB) |
|--------------------|:--------------------:|:---------------------------:|:-------------------------------:|
| Mistral-7B-v0.3    | 7.3B                 | 7.3B                        | 16                              |
| Mixtral-8x7B-v0.1  | 46.7B                  | 12.9B                         | 100                             |
| Mixtral-8x22B-v0.3  | 140.6B                  | 39.1B                         | 300                             |
| Codestral-22B-v0.1  | 22.2B | 22.2B | 60 |
| Codestral-Mamba-7B-v0.1  | 7.3B | 7.3B | 16 |
| Mathstral-7B-v0.1  | 7.3B | 7.3B | 16 |
| Mistral-Nemo-Instruct-2407  | 12B | 12B | 28 - bf16 <br/> 16 - fp8 |
| Mistral-Large-Instruct-2407  | 123B | 123B | 250 |
| Pixtral-2409 |  12B | 12B | 28 - bf16 <br/> 16 - fp8 |
| Mistral-Small-2409 | 22B | 22B | 60 |
| Ministral-8B-2410 | 8B | 8B | 24 |
| Mistral-Large-Instruct-2411  | 123B | 123B | 250 |
| Pixtral-Large-Instruct-2411  | 124B | 124B | 250 |
| Mistral-Small-Base-2501  | 24B | 24B | 60 |
| Mistral-Small-Instruct-2501  | 24B | 24B | 60 |
| Mistral-Small-Base-2503  | 24B | 24B | 60 |
| Mistral-Small-Instruct-2503  | 24B | 24B | 60 |
| Devstral-Small-2505  | 24B | 24B | 60 |

## How to run? 
Check out [mistral-inference](https://github.com/mistralai/mistral-inference/), a Python package for running our models. You can install `mistral-inference` by
```
pip install mistral-inference
``` 

To learn more about how to use mistral-inference, take a look at the [README](https://github.com/mistralai/mistral-inference/blob/main/README.md) and dive into this colab notebook to get started:

<a target="_blank" href="https://colab.research.google.com/github/mistralai/mistral-inference/blob/main/tutorials/getting_started.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>
