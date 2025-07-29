## Introduction

Fine-tuning is a powerful technique for customizing and optimizing the performance of large language models (LLMs) for specific use cases. By further training a pre-trained LLM on a labeled dataset related to a particular task, fine-tuning can improve the model's performance. This can be done with a large model for complex or dissimilar tasks, or with a smaller model to match the performance of a larger model, potentially leading to latency and cost benefits. The performance increase varies depending on the use cases. 

Mistral AI provides a fine-tuning API through [La Plateforme](https://console.mistral.ai/), making it easy to fine-tune all of our open-source and commercial models. For those interested in experimenting with different parameters and gaining a more in-depth understanding of the fine-tuning process, we also provide access to our open-source codebase [mistral-finetune](https://github.com/mistralai/mistral-finetune/). However, we recommend using our API for all fine-tuning as it does not require GPUs, comes with various options, and also allows for the fine-tuning of our commercial models. 

In this guide, we will cover the following topics:
- Prepare the dataset 
- End-to-end examples with Mistral API
- End-to-end examples with `mistral-finetune`
