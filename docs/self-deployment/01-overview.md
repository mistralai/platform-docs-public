# Self-deployment

Mistral AI provides ready-to-use Docker images on the Github registry. The weights are distributed separately.

To run these images, you need a cloud virtual machine matching the requirements for a given model. These requirements can be found in the [model description](../models.md).

We recommend two different serving frameworks for our models :
- [vLLM](https://vllm.readthedocs.io/): A python only serving framework which deploys an API matching OpenAI's spec. vLLM provides paged attention kernel to improve serving throughput.
- NVidias's [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) served with Nvidia's [Triton Inference Server](https://github.com/triton-inference-server) : TensorRT-LLM provides a DSL to build fast inference engines with dedicated kernels for large language models. Triton Inference Server allows efficient serving of these inference engines.

These images can be run locally, or on your favorite cloud provider, using [SkyPilot](https://skypilot.readthedocs.io/en/latest/).
