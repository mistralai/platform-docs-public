---
sidebar_position: 1
slug: /
---

# Introduction

Mistral AI currently provides two types of access to Large Language Models: 
- An API providing pay-as-you-go access to our latest models,
- Open source models available under the [Apache 2.0](https://github.com/apache/.github/blob/main/LICENSE) License, available on [Hugging Face](https://huggingface.co/mistralai) or directly from [the documentation](/models).

## Where to start?

### API Access
Our API is currently in beta to ramp up the load and provide good quality of service. Access the [platform](https://console.mistral.ai/) to join the waitlist. Once your subscription is active, you can immediately use our `chat` endpoint: 

```bash
curl --location "https://api.mistral.ai/v1/chat/completions" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
    "model": "mistral-tiny",
    "messages": [{"role": "user", "content": "Who is the most renowned French painter?"}]
  }'
```

Or our embeddings endpoint:

```bash
curl --location "https://api.mistral.ai/v1/embeddings" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
    "model": "mistral-embed",
    "input": ["Embed this sentence.", "As well as this one."]
  }'
```

For a full description of the models offered on the API, head on to the **[model docs](./models)**.

For more examples on how to use our platform, head on to our **[platform docs](./platform/01-overview.md)**.

### Raw model weights

Raw model weights can be used in several ways: 
- For self-deployment, on cloud or on premise, using either [TensorRT-LLM](./self-deployment/trtllm) or [vLLM](./self-deployment/vllm), head on to **[Deployment](./self-deployment/skypilot)**
- For research, head-on to our [reference implementation repository](https://github.com/mistralai/mistral-src),
- For local deployment on consumer grade hardware, check out the [llama.cpp](https://github.com/ggerganov/llama.cpp) project or [Ollama](https://ollama.ai/).


## Get Help

Join our [Discord community](https://discord.gg/mistralai) to discuss our models and talk to our engineers. Alternatively, reach out to our [business team](https://mistral.ai/contact/) if you have enterprise needs, want more information about our products or if there are missing features you would like us to add.


## Contributing

Mistral AI is committed to open source software development and welcomes external contributions. Please open a PR!
