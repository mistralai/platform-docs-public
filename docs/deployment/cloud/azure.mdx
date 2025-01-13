---
id: azure
title: Azure AI
sidebar_position: 3.21
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Introduction

Mistral AI's open and commercial models can be deployed on the Microsoft Azure AI cloud platform
in two ways:

- _Pay-as-you-go managed services_: Using Model-as-a-Service (MaaS) serverless API
  deployments billed on endpoint usage. No GPU capacity quota is required for deployment.

- _Real-time endpoints_: With quota-based billing tied to the underlying GPU
  infrastructure you choose to deploy.


This page focuses on the MaaS offering, where the following models are available:

- Mistral Large (24.11, 24.07)
- Mistral Small (24.09)
- Ministral 3B (24.10)
- Mistral Nemo 

For more details, visit the [models](../../../getting-started/models/models_overview) page.


## Getting started

The following sections outline the steps to deploy and query a Mistral model on the Azure AI MaaS platform.

### Deploying the model

Follow the instructions on the [Azure documentation](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-mistral?tabs=mistral-large#create-a-new-deployment)
to create a new deployment for the model of your choice. Once deployed, take
note of its corresponding URL and secret key.


### Querying the model

Deployed endpoints expose a REST API that you can query using Mistral's SDKs or
plain HTTP calls.

To run the examples below, set the following environment variables:
    - `AZUREAI_ENDPOINT`: Your endpoint URL, should be of the form `https://your-endpoint.inference.ai.azure.com/v1/chat/completions`.
    - `AZUREAI_API_KEY`: Your secret key.
<Tabs>
    <TabItem value="curl" label="cURL" default>
        ```bash
        curl --location $AZUREAI_ENDPOINT/v1/chat/completions \
            --header  "Content-Type: application/json" \
            --header "Authorization: Bearer $AZURE_API_KEY" \
            --data '{
          "model": "azureai",
          "messages": [
            {
              "role": "user",
              "content": "Who is the best French painter? Answer in one short sentence."
            }
          ]
        }'
        ```
    </TabItem>
    <TabItem value="python" label="Python">
        This code requires a virtual environment with the following packages:
        - `mistralai-azure>=1.0.0`

        ```python
        from mistralai_azure import MistralAzure
        import os

        endpoint = os.environ.get("AZUREAI_ENDPOINT", "")
        api_key = os.environ.get("AZUREAI_API_KEY", "")

        client = MistralAzure(azure_endpoint=endpoint,
                         azure_api_key=api_key)

        resp = client.chat.complete(messages=[
            {
                "role": "user",
                "content": "Who is the best French painter? Answer in one short sentence."
            },
        ], model="azureai")

        if resp:
            print(resp)
        ```
    </TabItem>
    <TabItem value="ts" label="TypeScript">
        This code requires the following package:
        - `@mistralai/mistralai-azure` (version >= `1.0.0`)

        ```typescript
        import { MistralAzure } from "@mistralai/mistralai-azure";

        const client = new MistralAzure({
            endpoint: process.env.AZUREAI_ENDPOINT || "",
            apiKey: process.env.AZUREAI_API_KEY || ""
        });

        async function chat_completion(user_msg: string) {
            const resp = await client.chat.complete({
                model: "azureai",
                messages: [
                    {
                        content: user_msg,
                        role: "user",
                    },
                ],
            });
            if (resp.choices && resp.choices.length > 0) {
                console.log(resp.choices[0]);
            }
        }

        chat_completion("Who is the best French painter? Answer in one short sentence.");
        ```
    </TabItem>
</Tabs>



## Going further

For more details and examples, refer to the following resources:
- [Release blog post for Mistral Large 2 and Mistral NeMo](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/ai-innovation-continues-introducing-mistral-large-2-and-mistral/ba-p/4200181).
- [Azure documentation for MaaS deployment of Mistral models](https://learn.microsoft.com/en-us/azure/ai-studio/how-to/deploy-models-mistral).
- [Azure ML examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/sdk/python/foundation-models/mistral) with several Mistral-based samples.

