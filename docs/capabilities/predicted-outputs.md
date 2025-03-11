---
id: predicted-outputs
title: Predicted outputs
sidebar_position: 2.93
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


Predicted Outputs optimizes response time by leveraging known or predictable content. 
This approach minimizes latency while maintaining high output quality. In tasks such as editing large texts, modifying code, or generating template-based responses, significant portions of the output are often predetermined. By predefining these expected parts with Predicted Outputs, models can allocate more computational resources to the unpredictable elements, improving overall efficiency.

## Example: Code modification

Predicted Outputs shine in scenarios where you need to regenerate text documents or code files with minor modifications. The key parameter introduced is the `prediction` parameter, which enables users to define predicted outputs. For example, imagine you want your model to update the model used in a fine-tuning job. You can include the code snippet you'd like to modify as both the user prompt and the predicted output.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>
```python
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"

client = Mistral(api_key=api_key)

code = """
created_jobs = client.fine_tuning.jobs.create(
    model="open-mistral-7b", 
    training_files=[{"file_id": ultrachat_chunk_train.id, "weight": 1}],
    validation_files=[ultrachat_chunk_eval.id], 
    hyperparameters={
        "training_steps": 10,
        "learning_rate":0.0001
    },
    auto_start=False
)
"""

prompt = "Change the model name from open-mistral-7b to open-mistral-nemo. Respond only with code, no explanation, no formatting."

chat_response = client.chat.complete(
    model= model,
    messages = [
        {
            "role": "user",
            "content": prompt,
        },
        {
            "role": "user",
            "content": code
        },
    ],
    prediction = {
        "type": "content",
        "content": code
    }
)
print(chat_response.choices[0].message.content)
```

  </TabItem>

  <TabItem value="typescript" label="typescript">
```typescript
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const code = `
created_jobs = client.fine_tuning.jobs.create(
    model="open-mistral-7b", 
    training_files=[{"file_id": ultrachat_chunk_train.id, "weight": 1}],
    validation_files=[ultrachat_chunk_eval.id], 
    hyperparameters={
        "training_steps": 10,
        "learning_rate":0.0001
    },
    auto_start=False
)
`.trim();

const prompt = `Change the model name from open-mistral-7b to open-mistral-nemo. Respond only with code, no explanation, no formatting.`;

const chatResponse = await client.chat.complete({
    model: "mistral-large-latest",
    messages: [
        {
            role: 'user', 
            content: prompt
        },
        {
            role: "user",
            content: code
        },
    ],
    prediction: {
        type: "content",
        content: code 
    },
});

console.log('Chat:', chatResponse.choices[0].message.content);
```
  </TabItem>

  <TabItem value="curl" label="curl">
```bash
curl --location "https://api.mistral.ai/v1/chat/completions" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
    "model": "mistral-large-latest",
    "messages": [
        {"role": "user", "content": "Change the model name from open-mistral-7b to open-mistral-nemo. Respond only with code, no explanation, no formatting."},
        {"role": "user", "content": "$CODE"}
    ],
    "prediction": {
        "type": "content",
        "content": "$CODE"
    }
  }'
```
  </TabItem>
</Tabs>


## FAQ

### Which model supports predicted outputs?
As of now, `codestral-2501` and `mistral-large-2411` support predicted outputs.

### How does predicted outputs affect pricing? 
Currently, predicted outputs do not impact pricing.

### Which parameters are not supported when using Predicted Outputs?
`n` (number of completions to return for each request) is not supported when using predicted outputs.

### Does the Position of Certain Sentences or Words in the Prediction Matter?
No, the placement of sentences or words in your prediction does not affect its effectiveness. Predictions can appear anywhere within the generated response and still help reduce the API's output latency.






