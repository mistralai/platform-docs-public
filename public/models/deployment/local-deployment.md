---
id: self_deployment_overview
title: Self-Deployment
slug: overview
---

# Self-Deployment

Mistral AI models support **self-deployment on your own infrastructure** through various
inference engines:
- [vLLM](https://vllm.readthedocs.io/) (recommended). A
highly-optimized Python-only serving framework which can expose an OpenAI-compatible
API.
- [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM).
- [TGI](https://huggingface.co/docs/text-generation-inference/index).

To simplify infrastructure management, consider tools like
[SkyPilot](https://skypilot.readthedocs.io) or [Cerebrium](https://www.cerebrium.ai).

:::tip
For full-stack enterprise deployment, from efficient model inference to team management, [reach out to us](https://mistral.ai/contact).
:::