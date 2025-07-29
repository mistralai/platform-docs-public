---
id: text_vision_finetuning
title: Text & Vision Fine-tuning
slug: text_vision_finetuning
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Fine-tuning allows you to tailor a pre-trained language model to your specific needs by training it on your dataset. This guide explains how to fine-tune text and vision models, from preparing your data to training, whether you aim to improve domain-specific understanding or adapt to a unique conversational style.

:::tip[ ]
For detailed end-to-end fine-tuning examples and FAQ, check out our [fine-tuning guide](../../../guides/finetuning).
:::

You can both finetune directly in [la plateforme](https://console.mistral.ai/build/finetuned-models) or via our API.

## Dataset Format

Data must be stored in JSON Lines (`.jsonl`) files, which allow storing multiple JSON objects, each on a new line.

SFT Datasets should follow an instruction-following format representing a user-assistant conversation. Each JSON data sample should either consist of only user and assistant messages or include function-calling logic.

### 1. Default Instruct

Conversational data between user and assistant, which can be one-turn or multi-turn. 

#### Text only template

```json
{
    "messages": [
        {
            "role": "user",
            "content": "User interaction n°1"
        },
        {
            "role": "assistant",
            "content": "Bot interaction n°1"
        },
        {
            "role": "user",
            "content": "User interaction n°2"
        },
        {
            "role": "assistant",
            "content": "Bot interaction n°2"
        }
    ]
}
```

Note that the files must be in JSONL format, meaning every JSON object must be flattened into a single line, and each JSON object is on a new line.
<details>

<summary><b>Raw `.jsonl` file example.</b></summary>

```json
{"messages": [{"role": "user","content": "..."},{"role": "assistant","content": "..."},...]}
{"messages": [{"role": "user","content": "..."},{"role": "assistant","content": "..."},...]}
{"messages": [{"role": "user","content": "..."},{"role": "assistant","content": "..."},...]}
{"messages": [{"role": "user","content": "..."},{"role": "assistant","content": "..."},...]}
...
```

</details>

- Conversational data must be stored under the `"messages"` key as a list.
- Each list item is a dictionary containing the `"content"` and `"role"` keys. `"role"` is a string: `"system"`, `"user"`, `"assistant"` or `"tool"`.
- Loss computation is performed only on tokens corresponding to assistant messages (`"role" == "assistant"`).

While text-only fine-tuning covers multiple use cases, you can also fine-tune the vision capabilities of our models. This allows you to create models that can understand and generate responses based on both text and image inputs.

#### Vision template

```json
{
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type":"image_url",
                    "image_url":"User Image URL, usually in a base64 format." // "data:image/jpeg;base64,{image_base64}"
                },
                {
                    "type":"text",
                    "text":"User interaction n°1"
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Bot interaction n°1"
        },
        {
            "role": "user",
            "content": [
                {
                    "type":"image_url",
                    "image_url":"User Image URL, usually in a base64 format." // "data:image/jpeg;base64,{image_base64}"
                },
                {
                    "type":"text",
                    "text":"User interaction n°2"
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Bot interaction n°2"
        }
    ]
}
```

- Content can be a list of dictionaries, each containing a `"type"` key and either `"text"` or `"image_url"` keys.

### 2. Function-calling Instruct

Conversational data with tool usage. Example:

```json
{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant with access to the following functions to help the user. You can use the functions if needed."
        },
        {
            "role": "user",
            "content": "Can you help me generate an anagram of the word 'listen'?"
        },
        {
            "role": "assistant",
            "tool_calls": [
                {
                    "id": "TX92Jm8Zi",
                    "type": "function",
                    "function": {
                        "name": "generate_anagram",
                        "arguments": "{\"word\": \"listen\"}"
                    }
                }
            ]
        },
        {
            "role": "tool",
            "content": "{\"anagram\": \"silent\"}",
            "tool_call_id": "TX92Jm8Zi"
        },
        {
            "role": "assistant",
            "content": "The anagram of the word 'listen' is 'silent'."
        },
        {
            "role": "user",
            "content": "That's amazing! Can you generate an anagram for the word 'race'?"
        },
        {
            "role": "assistant",
            "tool_calls": [
                {
                    "id": "3XhQnxLsT",
                    "type": "function",
                    "function": {
                        "name": "generate_anagram",
                        "arguments": "{\"word\": \"race\"}"
                    }
                }
            ]
        }
    ],
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "generate_anagram",
                "description": "Generate an anagram of a given word",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "word": {
                            "type": "string",
                            "description": "The word to generate an anagram of"
                        }
                    },
                    "required": ["word"]
                }
            }
        }
    ]
}
```

- Conversational data must be stored under the `"messages"` key as a list.
- Each message is a dictionary containing the `"role"` and `"content"` or `"tool_calls"` keys. `"role"` should be one of `"system"`, `"user"`, `"assistant"` or `"tool"`.
- Only messages of type `"assistant"` can have a `"tool_calls"` key, representing the assistant performing a call to an available tool.
- An assistant message with a `"tool_calls"` key cannot have a `"content"` key and must be followed by a `"tool"` message, which in turn must be followed by another assistant message.
- The `"tool_call_id"` of tool messages must match the `"id"` of at least one of the previous assistant messages.
- Both `"id"` and `"tool_call_id"` are randomly generated strings of exactly 9 characters. We recommend generating these automatically in a data preparation script as done [here](https://github.com/mistralai/mistral-finetune/blob/208b25c0f7299bb78d06cea25b82adee03834319/utils/reformat_data_glaive.py#L74).
- The `"tools"` key must include definitions of all tools used in the conversation.
- Loss computation is performed only on tokens corresponding to assistant messages (`"role" == "assistant"`).

## Upload a file
Once you have the data file with the right format,
you can upload the data file to the Mistral Client,
making them available for use in fine-tuning jobs.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
from mistralai import Mistral
import os

api_key = os.environ["MISTRAL_API_KEY"]

client = Mistral(api_key=api_key)

training_data = client.files.upload(
    file={
        "file_name": "training_file.jsonl",
        "content": open("training_file.jsonl", "rb"),
    }
)

validation_data = client.files.upload(
    file={
        "file_name": "validation_file.jsonl",
        "content": open("validation_file.jsonl", "rb"),
    }
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from '@mistralai/mistralai';
import fs from 'fs';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const training_file = fs.readFileSync('training_file.jsonl');
const training_data = await client.files.upload({
    file: {
        fileName: "training_file.jsonl",
        content: training_file,
    }
});

const validation_file = fs.readFileSync('validation_file.jsonl');
const validation_data = await client.files.upload({
    file: {
        fileName: "validation_file.jsonl",
        content: validation_file,
    }
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/files \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@training_file.jsonl"

curl https://api.mistral.ai/v1/files \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@validation_file.jsonl"
```
  </TabItem>

</Tabs>

## Create a fine-tuning job
The next step is to create a fine-tuning job. 
- model: the specific model you would like to fine-tune. The choices are:
  - Text Only:
    - `open-mistral-7b`
    - `mistral-small-latest`
    - `codestral-latest`
    - `open-mistral-nemo`
    - `mistral-large-latest`
    - `ministral-8b-latest`
    - `ministral-3b-latest`
  - Vision:
    - `pixtral-12b-latest`
- training_files: a collection of training file IDs, which can consist of a single file or multiple files
- validation_files: a collection of validation file IDs, which can consist of a single file or multiple files
- hyperparameters:  two adjustable hyperparameters, "training_steps" and "learning_rate", that users can modify.
- auto_start:
    - `auto_start=True`: Your job will be launched immediately after validation.
    - `auto_start=False` (default): You can manually start the training after validation by sending a POST request to `/fine_tuning/jobs/<uuid>/start`.
- integrations: external integrations we support such as Weights and Biases for metrics tracking during training.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
# create a fine-tuning job
created_jobs = client.fine_tuning.jobs.create(
    model="open-mistral-7b",
    training_files=[{"file_id": training_data.id, "weight": 1}],
    validation_files=[validation_data.id],
    hyperparameters={
        "training_steps": 10,
        "learning_rate":0.0001
    },
    auto_start=False,
#   integrations=[
#       {
#           "project": "finetuning",
#           "api_key": "WANDB_KEY",
#       }
#   ]
)
```

After creating a fine-tuning job, you can check the job status using
`client.fine_tuning.jobs.get(job_id = created_jobs.id)`.
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
const createdJob = await client.fineTuning.jobs.create({
    model: 'open-mistral-7b',
    trainingFiles: [{fileId: training_data.id, weight: 1}],
    validationFiles: [validation_data.id],
    hyperparameters: {
      trainingSteps: 10,
      learningRate: 0.0001,
    },
    autoStart:false,
//  integrations=[
//      {
//          project: "finetuning",
//          apiKey: "WANDB_KEY",
//      }
//  ]
});
```

After creating a fine-tuning job, you can check the job status using
`client.fineTuning.jobs.get({ jobId: createdJob.id })`.
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/fine_tuning/jobs \
--header "Authorization: Bearer $MISTRAL_API_KEY" \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data '{
  "model": "open-mistral-7b",
  "training_files": [
    "<uuid>"
  ],
  "validation_files": [
    "<uuid>"
  ],
  "hyperparameters": {
    "training_steps": 10,
    "learning_rate": 0.0001
  },
  "auto_start": false
}'
```

After creating a fine-tuning job, you can check the job status using:
```bash
curl https://api.mistral.ai/v1/fine_tuning/jobs/<jobid> \
--header "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>

</Tabs>

Initially, the job status will be `"QUEUED"`.
After a brief period, the status will update to `"VALIDATED"`.
At this point, you can proceed to start the fine-tuning job:

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
# start a fine-tuning job
client.fine_tuning.jobs.start(job_id = created_jobs.id)

created_jobs
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
await client.fineTuning.jobs.start({jobId: createdJob.id})
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl -X POST https://api.mistral.ai/v1/fine_tuning/jobs/<jobid>/start \
--header "Authorization: Bearer $MISTRAL_API_KEY"
```
  </TabItem>

</Tabs>

## List/retrieve/cancel jobs
You can also list jobs, retrieve a job, or cancel a job.

You can filter and view a list of jobs using various parameters such as
`page`, `page_size`, `model`, `created_after`, `created_by_me`, `status`, `wandb_project`, `wandb_name`, and `suffix`. Check out our [API specs](https://docs.mistral.ai/api/#tag/fine-tuning) for details.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
# List jobs
jobs = client.fine_tuning.jobs.list()
print(jobs)

# Retrieve a jobs
retrieved_jobs = client.fine_tuning.jobs.get(job_id = created_jobs.id)
print(retrieved_jobs)

# Cancel a jobs
canceled_jobs = client.fine_tuning.jobs.cancel(job_id = created_jobs.id)
print(canceled_jobs)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
// List jobs
const jobs = await client.fineTuning.jobs.list();

// Retrieve a job
const retrievedJob = await client.fineTuning.jobs.get({ jobId: createdJob.id })

// Cancel a job
const canceledJob = await client.fineTuning.jobs.cancel({
  jobId: createdJob.id,
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
# List jobs
curl https://api.mistral.ai/v1/fine_tuning/jobs \
--header "Authorization: Bearer $MISTRAL_API_KEY"

# Retrieve a job
curl https://api.mistral.ai/v1/fine_tuning/jobs/<jobid> \
--header "Authorization: Bearer $MISTRAL_API_KEY"

# Cancel a job
curl -X POST https://api.mistral.ai/v1/fine_tuning/jobs/<jobid>/cancel \
--header "Authorization: Bearer $MISTRAL_API_KEY"
```
  </TabItem>

</Tabs>


## Use a fine-tuned model
When a fine-tuned job is finished, you will be able to see the fine-tuned model name via `retrieved_jobs.fine_tuned_model`. Then you can use our `chat` endpoint to chat with the fine-tuned model:

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
chat_response = client.chat.complete(
    model=retrieved_job.fine_tuned_model,
    messages = [{"role":'user', "content":'What is the best French cheese?'}]
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
const chatResponse = await client.chat.complete({
  model: retrievedJob.fine_tuned_model,
  messages: [{role: 'user', content: 'What is the best French cheese?'}],
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl "https://api.mistral.ai/v1/chat/completions" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
    "model": "ft:open-mistral-7b:daf5e488:20240430:c1bed559",
    "messages": [{"role": "user", "content": "Who is the most renowned French painter?"}]
  }'
```
  </TabItem>

</Tabs>

## Delete a fine-tuned model

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
client.models.delete(model_id=retrieved_job.fine_tuned_model)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
await client.models.delete({modelId:retrieved_job.fine_tuned_model})
```

  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location --request DELETE 'https://api.mistral.ai/v1/models/ft:open-mistral-7b:XXX:20240531:XXX' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY"
```
  </TabItem>

</Tabs>

import FAQ from "../../guides/finetuning_sections/_04_faq.md";

<FAQ />