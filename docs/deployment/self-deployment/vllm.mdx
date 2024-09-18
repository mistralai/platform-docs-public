---
id: vllm
title: vLLM
sidebar_position: 3.31
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[vLLM](https://github.com/vllm-project/vllm) is an open-source LLM inference and serving 
engine. It is particularly appropriate as a target platform for self-deploying Mistral 
models on-premise.

## Pre-requisites

- The hardware requirements for vLLM are listed on its [installation documentation page](https://docs.vllm.ai/en/latest/getting_started/installation.html).
- By default, vLLM sources the model weights from Hugging Face. To access Mistral model
  repositories you need to be authenticated on Hugging Face, so an access
  token `HF_TOKEN` with the `READ` permission will be required. You should also make sure that you have
  accepted the conditions of access on each model card page.
- If you already have the model artifacts on your infrastructure you can use 
  them directly by pointing vLLM to their local path instead of a Hugging Face
  model ID. In this scenario you will be able to skip all Hugging Face related 
  setup steps.


## Getting started

The following sections will guide you through the process of deploying and
querying Mistral models on vLLM.

### Installing vLLM

- Create a Python virtual environment and install the `vllm` package (version 
  `>=0.6.1.post1` to ensure maximum compatibility with all Mistral models).

- Authenticate on the HuggingFace Hub using your access token `$HF_TOKEN` :
  ```bash
  huggingface-cli login --token $HF_TOKEN
  ```

### Offline mode inference

When using vLLM in _offline mode_ the model is loaded and used for one-off
batch inference workloads.

<Tabs>
    <TabItem value="vllm-batch-nemo" label="Text input (Mistral NeMo)">

        ```python
        from vllm import LLM
        from vllm.sampling_params import SamplingParams

        model_name = "mistralai/Mistral-NeMo-Instruct-2407"
        sampling_params = SamplingParams(max_tokens=8192)

        llm = LLM(
            model=model_name,
            tokenizer_mode="mistral",
            load_format="mistral",
            config_format="mistral",
        )

        messages = [
            {
                "role": "user",
                "content": "Who is the best French painter. Answer with detailed explanations.",
            }
        ]

        res = llm.chat(messages=messages, sampling_params=sampling_params)
        print(res[0].outputs[0].text)

        ```

    </TabItem>

        <TabItem value="vllm-batch-small" label="Text input (Mistral Small)">

        ```python
        from vllm import LLM
        from vllm.sampling_params import SamplingParams

        model_name = "mistralai/Mistral-Small-Instruct-2409"
        sampling_params = SamplingParams(max_tokens=8192)

        llm = LLM(
            model=model_name,
            tokenizer_mode="mistral",
            load_format="mistral",
            config_format="mistral",
        )

        messages = [
            {
                "role": "user",
                "content": "Who is the best French painter. Answer with detailed explanations.",
            }
        ]

        res = llm.chat(messages=messages, sampling_params=sampling_params)
        print(res[0].outputs[0].text)

        ```

    </TabItem>

    <TabItem value="vllm-batch-pixtral" label="Image + text input (Pixtral-12B)">
        Suppose you want to caption the following images:
          <center>
              <a href="https://picsum.photos/id/1/512/512"><img alt="" src="/img/laptop.png" width="20%"/></a>
              <a href="https://picsum.photos/id/11/512/512"><img alt="" src="/img/countryside.png"  width="20%"/></a>
              <a href="https://picsum.photos/id/111/512/512"><img alt="" src="/img/vintage_car.png"  width="20%"/></a>
          </center>

        You can do so by running the following code:

        ```python
        from vllm import LLM
        from vllm.sampling_params import SamplingParams

        model_name = "mistralai/Pixtral-12B-2409"
        max_img_per_msg = 3

        sampling_params = SamplingParams(max_tokens=8192)
        llm = LLM(
            model=model_name,
            tokenizer_mode="mistral",
            load_format="mistral",
            config_format="mistral",
            limit_mm_per_prompt={"image": max_img_per_msg},
        )

        urls = [f"https://picsum.photos/id/{id}/512/512" for id in ["1", "11", "111"]]

        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Describe this image"},
                    ] + [{"type": "image_url", "image_url": {"url": f"{u}"}} for u in urls],
            },
        ]

        res = llm.chat(messages=messages, sampling_params=sampling_params)
        print(res[0].outputs[0].text)
        ```
    </TabItem>
</Tabs>

### Server mode inference

In _server mode_, vLLM spawns an HTTP server that continuously
waits for clients to connect and send requests concurrently.
The server exposes a REST API that implements the OpenAI protocol,
allowing you to directly reuse existing code relying on the OpenAI API.

<Tabs>
    <TabItem value="vllm-server-text" label="Text input (Mistral NeMo)">
        Start the inference server to deploy your model, e.g. for Mistral NeMo:

          ```bash
          vllm serve mistralai/Mistral-Nemo-Instruct-2407 \
            --tokenizer_mode mistral \
            --config_format mistral \
            --load_format mistral
          ```

        You can now run inference requests with text input:

          <Tabs>
            <TabItem value="vllm-infer-nemo-curl" label="cURL">
                ```bash
                curl --location 'http://localhost:8000/v1/chat/completions' \
                    --header 'Content-Type: application/json' \
                    --header 'Authorization: Bearer token' \
                    --data '{
                        "model": "mistralai/Mistral-Nemo-Instruct-2407",
                        "messages": [
                          {
                            "role": "user",
                            "content": "Who is the best French painter? Answer in one short sentence."
                          }
                        ]
                      }'
                ```
            </TabItem>
            <TabItem value="vllm-infer-nemo-python" label="Python">
                ```python
                import httpx

                url = 'http://localhost:8000/v1/chat/completions'
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token'
                }
                data = {
                    "model": "mistralai/Mistral-Nemo-Instruct-2407",
                    "messages": [
                        {
                            "role": "user",
                            "content": "Who is the best French painter? Answer in one short sentence."
                        }
                    ]
                }

                response = httpx.post(url, headers=headers, json=data)

                print(response.json())

                ```
            </TabItem>
          </Tabs>

    </TabItem>

        <TabItem value="vllm-server-text-small" label="Text input (Mistral Small)">
        Start the inference server to deploy your model, e.g. for Mistral Small:

          ```bash
          vllm serve mistralai/Mistral-Small-Instruct-2409 \
            --tokenizer_mode mistral \
            --config_format mistral \
            --load_format mistral
          ```

        You can now run inference requests with text input:

          <Tabs>
            <TabItem value="vllm-infer-small-curl" label="cURL">
                ```bash
                curl --location 'http://localhost:8000/v1/chat/completions' \
                    --header 'Content-Type: application/json' \
                    --header 'Authorization: Bearer token' \
                    --data '{
                        "model": "mistralai/Mistral-Small-Instruct-2409",
                        "messages": [
                          {
                            "role": "user",
                            "content": "Who is the best French painter? Answer in one short sentence."
                          }
                        ]
                      }'
                ```
            </TabItem>
            <TabItem value="vllm-infer-small-python" label="Python">
                ```python
                import httpx

                url = 'http://localhost:8000/v1/chat/completions'
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token'
                }
                data = {
                    "model": "mistralai/Mistral-Small-Instruct-2409",
                    "messages": [
                        {
                            "role": "user",
                            "content": "Who is the best French painter? Answer in one short sentence."
                        }
                    ]
                }

                response = httpx.post(url, headers=headers, json=data)

                print(response.json())

                ```
            </TabItem>
          </Tabs>

    </TabItem>

    <TabItem value="vllm-server-mm" label="Image + text input (Pixtral-12B)">


Start the inference server to deploy your model, e.g. for Pixtral-12B:

    ```bash
    vllm serve mistralai/Pixtral-12B-2409 \
        --tokenizer_mode mistral \
        --config_format mistral \
        --load_format mistral
    ```
:::info

- The default number of image inputs per prompt is set to 1. To increase it, set the
  `--limit_mm_per_prompt` option (e.g. `--limit_mm_per_prompt 'image=4'`).

- If you encounter memory issues, set the `--max_model_len` option to reduce the
  memory requirements of vLLM (e.g. `--max_model_len 16384`). More troubleshooting
  details can be found in the 
  [vLLM documentation](https://qwen.readthedocs.io/en/latest/deployment/vllm.html#troubleshooting).

:::

You can now run inference requests with images and text inputs. Suppose you
want to caption the following image:

        <center>
            <a href="https://picsum.photos/id/237/512/512"><img alt="" src="/img/doggo.png"  width="20%"/></a>
        </center>
        <br/>

You can prompt the model and retrieve its response like so:
    <Tabs>
        <TabItem value="vllm-infer-pixtral-curl" label="cURL">
        ```bash
        curl --location 'http://localhost:8000/v1/chat/completions' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer token' \
        --data '{
            "model": "mistralai/Pixtral-12B-2409",
            "messages": [
              {
                "role": "user",
                "content": [
                    {"type" : "text", "text": "Describe this image in a short sentence."},
                    {"type": "image_url", "image_url": {"url": "https://picsum.photos/id/237/200/300"}}
                ]
              }
            ]
          }'
          ```
        </TabItem>
        <TabItem value="vllm-infer-pixtral-python" label="Python">
      ```python
        import httpx

        url = "http://localhost:8000/v1/chat/completions"
        headers = {"Content-Type": "application/json", "Authorization": "Bearer token"}
        data = {
            "model": "mistralai/Pixtral-12B-2409",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Describe this image in a short sentence."},
                        {
                            "type": "image_url",
                            "image_url": {"url": "https://picsum.photos/id/237/200/300"},
                        },
                    ],
                }
            ],
        }

        response = httpx.post(url, headers=headers, json=data)

        print(response.json())
        ```
        </TabItem>
    </Tabs>



    </TabItem>
</Tabs>

## Deploying with Docker

If you are looking to deploy vLLM as a containerized inference server you can leverage
the project's official Docker image (see more details in the 
[vLLM Docker documentation](https://docs.vllm.ai/en/latest/serving/deploying_with_docker.html)).

- Set the HuggingFace access token environment variable in your shell:
  ```bash
  export HF_TOKEN=your-access-token
  ```

- Run the Docker command to start the container:
  <Tabs>
    <TabItem value="vllm-docker-nemo" label="Mistral NeMo">
        ```bash
        docker run --runtime nvidia --gpus all \
            -v ~/.cache/huggingface:/root/.cache/huggingface \
            --env "HUGGING_FACE_HUB_TOKEN=${HF_TOKEN}" \
            -p 8000:8000 \
            --ipc=host \
            vllm/vllm-openai:latest \
            --model mistralai/Mistral-NeMo-Instruct-2407 \
            --tokenizer_mode mistral \
            --load_format mistral \
            --config_format mistral
        ```
    </TabItem>

    <TabItem value="vllm-docker-small" label="Mistral Small">
        ```bash
        docker run --runtime nvidia --gpus all \
            -v ~/.cache/huggingface:/root/.cache/huggingface \
            --env "HUGGING_FACE_HUB_TOKEN=${HF_TOKEN}" \
            -p 8000:8000 \
            --ipc=host \
            vllm/vllm-openai:latest \
            --model mistralai/Mistral-Small-Instruct-2409 \
            --tokenizer_mode mistral \
            --load_format mistral \
            --config_format mistral
        ```
    </TabItem>

    <TabItem value="vllm-docker-pixtral" label="Pixtral-12B">
        ```bash
        docker run --runtime nvidia --gpus all \
            -v ~/.cache/huggingface:/root/.cache/huggingface \
            --env "HUGGING_FACE_HUB_TOKEN=${HF_TOKEN}" \
            -p 8000:8000 \
            --ipc=host \
            vllm/vllm-openai:latest \
            --model mistralai/Pixtral-12B-2409 \
            --tokenizer_mode mistral \
            --load_format mistral \
            --config_format mistral 
        ```
    </TabItem>
  </Tabs>
  
Once the container is up and running you will be able to run inference on your model
using the same code as in a standalone deployment.

