import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# vLLM

vLLM can be deployed using a docker image we provide, or directly from the python package.

## With docker

On a GPU-enabled host, you can run the Mistral AI LLM Inference image with the following command to download the model from Hugging Face:
<Tabs>
  <TabItem value="mistral7b" label="Mistral-7B" default>

```bash
docker run --gpus all \
    -e HF_TOKEN=$HF_TOKEN -p 8000:8000 \
    ghcr.io/mistralai/mistral-src/vllm:latest \
    --host 0.0.0.0 \
    --model mistralai/Mistral-7B-Instruct-v0.2
```

  </TabItem>
  <TabItem value="mixtral8x7b" label="Mixtral-8X7B">

```bash
docker run --gpus all \
    -e HF_TOKEN=$HF_TOKEN -p 8000:8000 \
    ghcr.io/mistralai/mistral-src/vllm:latest \
    --host 0.0.0.0 \
    --model mistralai/Mixtral-8x7B-Instruct-v0.1 \
    --tensor-parallel-size 2 # adapt to your GPUs \
    --load-format pt # needed since both `pt` and `safetensors` are available
```

  </TabItem>
</Tabs>

Where `HF_TOKEN` is an environment variable containing your [Hugging Face user access token](https://huggingface.co/docs/hub/security-tokens).
This will spawn a vLLM instance exposing an OpenAI-like API, as documented in the [API section](/api).

:::info

If your GPU has CUDA capabilities below 8.0, you will see the error `ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0. Your XXX GPU has compute capability 7.0`. You need to pass the parameter `--dtype half` to the Docker command line.

:::

The dockerfile for this image can be found on our [reference implementation github](https://github.com/mistralai/mistral-src/blob/main/deploy/Dockerfile).

## Without docker

Alternatively, you can directly spawn a vLLM server on a GPU-enabled host with Cuda 11.8.

### Install vLLM

Firstly you need to install vLLM (or use `conda add vllm` if you are using Anaconda):

```bash
pip install vllm
```

### Log in to the Hugging Face hub

You will also need to log in to the Hugging Face hub using: 

```bash
huggingface-cli login
```

### Run the OpenAI compatible inference endpoint

You can then use the following command to start the server:
<Tabs>
  <TabItem value="mistral7b" label="Mistral-7B" default>

```bash
python -u -m vllm.entrypoints.openai.api_server \
       --host 0.0.0.0 \
       --model mistralai/Mistral-7B-Instruct-v0.2
```
  </TabItem>
  <TabItem value="mixtral8x7b" label="Mixtral-8X7B">

```bash
python -u -m vllm.entrypoints.openai.api_server \
       --host 0.0.0.0 \
       --model mistralai/Mixtral-8X7B-Instruct-v0.1 \
       --tensor-parallel-size 2 # adapt to your GPUs \
      --load-format pt # needed since both `pt` and `safetensors` are available
```

  </TabItem>
</Tabs>