---
sidebar_position: 3
slug: models
---

# Open-weight models

We open-source both pre-trained models and fine-tuned models. These models are not tuned for safety as we want to empower users to test and refine moderation based on their use cases. For safer models, follow our [guardrailing tutorial](./platform/04-guardrailing.md).

## Mistral 7B

Mistral 7B is the first dense model released by Mistral AI. At the time of the release, it matched the capabilities of models up to 30B parameters. Learn more on our [blog post](https://mistral.ai/news/announcing-mistral-7b/).

## Mixtral 8X7B

Mixtral 8X7B is a sparse mixture of experts model. As such, it leverages up to 45B parameters but only uses about 12B during inference, leading to better inference throughput at the cost of more vRAM. Learn more on the dedicated [blog post](https://mistral.ai/news/mixtral-of-experts/).

## Downloading

- Mistral-7B-v0.1: [Hugging Face](https://huggingface.co/mistralai/Mistral-7B-v0.1) // [raw_weights](https://files.mistral-7b-v0-1.mistral.ai/mistral-7B-v0.1.tar) (md5sum: `37dab53973db2d56b2da0a033a15307f`).
- Mistral-7B-Instruct-v0.2: [Hugging Face](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2) // [raw_weights](https://files.mistral-7b-v0-2.mistral.ai/Mistral-7B-v0.2-Instruct.tar) (md5sum: `fbae55bc038f12f010b4251326e73d39`).
- Mixtral-8x7B-v0.1: [Hugging Face](https://huggingface.co/mistralai/Mixtral-8x7B-v0.1).
- Mixtral-8x7B-Instruct-v0.1: [Hugging Face](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) // [raw_weights](https://files.mixtral-8x7b-v0-1.mistral.ai/Mixtral-8x7B-v0.1-Instruct.tar) (md5sum: `8e2d3930145dc43d3084396f49d38a3f`).

## Sizes

| Name               | Number of parameters | Number of active parameters | Min. GPU RAM for inference (GB) |
|--------------------|:--------------------:|:---------------------------:|:-------------------------------:|
| Mistral-7B-v0.2    | 7.3B                 | 7.3B                        | 16                              |
| Mistral-8X7B-v0.1  | 46.7B                  | 12.9B                         | 100                             |

## Chat template

The template used to build a prompt for the Instruct model is defined as follows:
```
<s>[INST] Instruction [/INST] Model answer</s>[INST] Follow-up instruction [/INST]
```

Note that `<s>` and `</s>` are special tokens for beginning of string (BOS) and end of string (EOS) while `[INST]` and `[/INST]` are regular strings.

:::note

This format must be strictly respected. Otherwise, the model will generate sub-optimal outputs.

:::

As a reference, here is the format used to tokenize instructions during fine-tuning:

```
[START_SYMBOL_ID] + 
tok("[INST]") + tok(USER_MESSAGE_1) + tok("[/INST]") +
tok(BOT_MESSAGE_1) + [END_SYMBOL_ID] +
…
tok("[INST]") + tok(USER_MESSAGE_N) + tok("[/INST]") +
tok(BOT_MESSAGE_N) + [END_SYMBOL_ID]
```

:::note

The function `tok` should never generate the EOS token. However, FastChat (used in vLLM) sends the full prompt as a string, which might lead to incorrect tokenization of the EOS token and prompt injection. Users are encouraged to send tokens instead, as described above.

:::