---
id: ibm-watsonx
title: IBM watsonx.ai
sidebar_position: 3.25
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Introduction

Mistral AI's Large model is available on the IBM watsonx.ai platform as a fully managed
solution, as well as an on-premise deployment.

## Getting started

The following solutions outline the steps to query Mistral Large on the SaaS version of
IBM watsonx.ai.

### Pre-requisites

The following items are required:

- An IBM watsonx project (`IBM_CLOUD_PROJECT_ID`)
- A Service ID with an access policy enabling the use of the Watson Lachine Learning service.

To enable access to the API, you must make sure that:
- Your Service ID has been added to the project as `EDITOR`,
- You have generated an API key (`IBM_CLOUD_API_KEY`) for your Service ID.

### Querying the model (chat completion)

You can query Mistral Large using either IBM's SDK or plain HTTP calls.

:::warning

The examples below leverage the `mistral-common` Python package to properly format
the user messages with special tokens. It is **strongly recommended to avoid passing
raw strings and handle special tokens manually**: this might result in silent
tokenization errors that would highly degrade the quality of the model output.

:::

<Tabs>
    <TabItem value="python" label="Python">
        You will need to run your code from a virtual environment with the following
        packages:

        - `httpx` (tested with `0.27.2`)
        - `ibm-watsonx-ai` (tested with `1.1.11`)
        - `mistral-common` (tested with `1.4.4`)

        In the following snippet, your API key will be used to generate an IAM token,
        then the call to the model is performed using this token for authentication.

        ```python
        from ibm_watsonx_ai import Credentials
        from ibm_watsonx_ai.foundation_models import ModelInference
        from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
        from mistral_common.tokens.tokenizers.mistral import MistralTokenizer
        from mistral_common.protocol.instruct.request import ChatCompletionRequest
        from mistral_common.protocol.instruct.messages import UserMessage

        import os
        import httpx

        IBM_CLOUD_REGIONS = {
                "dallas": "us-south",
                "london": "eu-gb",
                "frankfurt": "eu-de",
                "tokyo": "jp-tok"
                }

        IBM_CLOUD_PROJECT_ID = "xxx-xxx-xxx" # Replace with your project id


        def get_iam_token(api_key: str) -> str:
            """
            Return an IAM access token generated from an API key.
            """

            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            data = f"apikey={api_key}&grant_type=urn:ibm:params:oauth:grant-type:apikey"
            resp = httpx.post(
                url="https://iam.cloud.ibm.com/identity/token",
                headers=headers,
                data=data,
            )
            token = resp.json().get("access_token")
            return token


        def format_user_message(raw_user_msg: str) -> str:
            """
            Return a formatted prompt using the official Mistral tokenizer.
            """

            tokenizer = MistralTokenizer.v3()  # Use v3 for Mistral Large
            tokenized = tokenizer.encode_chat_completion(
                ChatCompletionRequest(
                    messages=[UserMessage(content=raw_user_msg)], model="mistral-large"
                )
            )
            return tokenized.text


        region = "frankfurt" # Define the region of your choice here
        api_key = os.environ["IBM_API_KEY"]
        access_token = get_iam_token(api_key=api_key)
        credentials = Credentials(url=f"https://{IBM_CLOUD_REGIONS[region]}.ml.cloud.ibm.com",
                                  token=access_token)

        params = {GenParams.MAX_NEW_TOKENS: 256, GenParams.TEMPERATURE: 0.0}
        model_inference = ModelInference(
            project_id=IBM_CLOUD_PROJECT_ID,
            model_id="mistralai/mistral-large",
            params=params,
            credentials=credentials,
        )
        user_msg_content = "Who is the best French painter? Answer in one short sentence."
        resp = model_inference.generate_text(prompt=format_user_message(user_msg_content))
        print(resp)

        ```

    </TabItem>
</Tabs>

## Going further

For more information and examples, you can check:

- The [IBM watsonx.ai Python SDK documentation](https://ibm.github.io/watsonx-ai-python-sdk/index.html)
- This [IBM Developer tutorial](https://developer.ibm.com/tutorials/awb-using-mistral-ai-llms-in-watsonx-ai-flows-engine/)
  on how to use Mistral Large with IBM watsonx.ai flows engine.
