---
id: text_vision_finetuning
title: Text & Vision Fine-tuning
slug: text_vision_finetuning
sidebar_position: 1
---

# Text & Vision Fine-tuning

:::warning[Deprecated]
This feature is deprecated and is no longer actively supported.
:::

Fine-tuning allows you to tailor a pre-trained language model to your specific needs by training it on your dataset. This guide explains how to fine-tune text and vision models, from preparing your data to training, whether you aim to improve domain-specific understanding or adapt to a unique conversational style.

You can both finetune directly in the [AI Studio](https://console.mistral.ai/build/finetuned-models) or via our API.

<SectionTab as="h1" sectionId="before-you-start">Before You Start</SectionTab>

### Dataset

To fine-tune a model, you need to provide a dataset that contains the data you want to train on, it is also recommended to have a validation dataset and a test dataset.

The dataset must be in a specific format, and you can upload it to the Mistral Cloud before launching the fine-tuning job.

<ExplorerTabs id="dataset">
  <ExplorerTab value="dataset-format" label="Dataset Format">
    Data must be stored in JSON Lines (`.jsonl`) files, which allow storing multiple JSON objects, each on a new line.

SFT Datasets should follow an instruction-following format representing a user-assistant conversation. Each JSON data sample should either consist of only user and assistant messages or include function-calling logic.

<ExplorerTabs id="dataset-format">
    <ExplorerTab value="default-instruct" label="Text Instruct">
        Conversational text only data between user and assistant, which can be one-turn or multi-turn.

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

- Conversational data must be stored under the `"messages"` key as a list.
- Each list item is a dictionary containing the `"content"` and `"role"` keys. `"role"` is a string: `"system"`, `"user"`, `"assistant"` or `"tool"`.
- Loss computation is performed only on tokens corresponding to assistant messages (`"role" == "assistant"`).

While text-only fine-tuning covers multiple use cases, you can also fine-tune the vision capabilities of our models. This allows you to create models that can understand and generate responses based on both text and image inputs.
    </ExplorerTab>
    <ExplorerTab value="vision-instruct" label="Vision Instruct">
        Conversational text and image input data between user and assistant, which can be one-turn or multi-turn.

```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": "User Image URL, usually in a base64 format." // "data:image/jpeg;base64,{image_base64}"
        },
        {
          "type": "text",
          "text": "User interaction n°1"
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
          "type": "image_url",
          "image_url": "User Image URL, usually in a base64 format." // "data:image/jpeg;base64,{image_base64}"
        },
        {
          "type": "text",
          "text": "User interaction n°2"
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

- Conversational data must be stored under the `"messages"` key as a list.
- Each list item is a dictionary containing the `"content"` and `"role"` keys. `"role"` is a string: `"system"`, `"user"`, `"assistant"` or `"tool"`.
- Content can be a list of dictionaries, each containing a `"type"` key and either `"text"` or `"image_url"` keys.
- Loss computation is performed only on tokens corresponding to assistant messages (`"role" == "assistant"`).
    </ExplorerTab>
    <ExplorerTab value="function-calling-instruct" label="Function Calling Instruct">
        Conversational data with tool usage between user and assistant, which can be one-turn or multi-turn. Example:

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
    </ExplorerTab>
</ExplorerTabs>

Note that the files must be in JSONL format, meaning every JSON object must be flattened into a single line, and each JSON object is on a new line.

Raw `.jsonl` file example:

```json
{"messages": [{"role": "user","content": "..."},{"role": "assistant","content": "..."},...]}
{"messages": [{"role": "user","content": "..."},{"role": "assistant","content": "..."},...]}
{"messages": [{"role": "user","content": "..."},{"role": "assistant","content": "..."},...]}
{"messages": [{"role": "user","content": "..."},{"role": "assistant","content": "..."},...]}
...
```
  </ExplorerTab>
  <ExplorerTab value="upload-a-file" label="Upload a file">
    Once you have the data file with the right format,
you can upload the data file to the Mistral Client,
making them available for use in fine-tuning jobs.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>
    <Tabs groupId="sdk-version">
        <TabItem value="v1" label="V1" default>

```python
from mistralai.client import Mistral
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
        <TabItem value="v2" label="V2">

```python
from mistralai.client import Mistral
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
    </Tabs>
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

const training_file = fs.readFileSync('training_file.jsonl');
const training_data = await client.files.upload({
  file: {
    fileName: 'training_file.jsonl',
    content: training_file,
  },
});

const validation_file = fs.readFileSync('validation_file.jsonl');
const validation_data = await client.files.upload({
  file: {
    fileName: 'validation_file.jsonl',
    content: validation_file,
  },
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
  </ExplorerTab>
</ExplorerTabs>

<SectionTab as="h1" sectionId="jobs-management">Jobs Management</SectionTab>

### Create and Manage Fine-tuning Jobs

To create your custom model, you need to create a fine-tuning job. You can fully manage jobs via our API, from creation, to starting, monitoring and cancellation.

<ExplorerTabs id="jobs-management">
  <ExplorerTab value="fine-tuning-job" label="Fine-tuning Job">
    A fine-tuning job corresponds to a single training run. You can create a fine-tuning job with the following parameters:

<SectionTab as="h3" variant="secondary" sectionId="create-fine-tuning-job">Create a fine-tuning job</SectionTab>

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
- hyperparameters: two adjustable hyperparameters, "training_steps" and "learning_rate", that users can modify.
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

    </TabItem>
    <TabItem value="typescript" label="typescript">

```typescript
const createdJob = await client.fineTuning.jobs.create({
  model: 'open-mistral-7b',
  trainingFiles: [{ fileId: training_data.id, weight: 1 }],
  validationFiles: [validation_data.id],
  hyperparameters: {
    trainingSteps: 10,
    learningRate: 0.0001,
  },
  autoStart: false,
  //  integrations=[
  //      {
  //          project: "finetuning",
  //          apiKey: "WANDB_KEY",
  //      }
  //  ]
});
```

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

    </TabItem>
</Tabs>

<SectionTab as="h3" variant="secondary" sectionId="job-status">Job Status</SectionTab>

After creating a fine-tuning job, you can check the job status using:

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python 
client.fine_tuning.jobs.get(job_id = created_jobs.id)
```

    </TabItem>
    <TabItem value="typescript" label="typescript">

```typescript
await client.fineTuning.jobs.get({ jobId: createdJob.id });
```

    </TabItem>
    <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/fine_tuning/jobs/<jobid> \
--header "Authorization: Bearer $MISTRAL_API_KEY"
```

    </TabItem>
</Tabs>

<SectionTab as="h3" variant="secondary" sectionId="start-fine-tuning-job">Start a fine-tuning job</SectionTab>

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
await client.fineTuning.jobs.start({ jobId: createdJob.id });
```

    </TabItem>
    <TabItem value="curl" label="curl">

```bash
curl -X POST https://api.mistral.ai/v1/fine_tuning/jobs/<jobid>/start \
--header "Authorization: Bearer $MISTRAL_API_KEY"
```

    </TabItem>
</Tabs>
  </ExplorerTab>
  <ExplorerTab value="List/retrieve/cancel-jobs" label="List/retrieve/cancel jobs">
    You can also list jobs, retrieve a job, or cancel a job.

<SectionTab as="h3" variant="secondary" sectionId="list-jobs">List jobs</SectionTab>

You can filter and view a list of jobs using various parameters such as `page`, `page_size`, `model`, `created_after`, `created_by_me`, `status`, `wandb_project`, `wandb_name`, and `suffix`. Check out our [API specs](https://docs.mistral.ai/api/#tag/fine-tuning) for details.

<Tabs groupId="code">
    <TabItem value="python" label="python" default>

```python
jobs = client.fine_tuning.jobs.list()
```

    </TabItem>
    <TabItem value="typescript" label="typescript">

```typescript
const jobs = await client.fineTuning.jobs.list();
```

    </TabItem>
    <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/fine_tuning/jobs \
--header "Authorization: Bearer $MISTRAL_API_KEY"
```

    </TabItem>
</Tabs>

<SectionTab as="h3" variant="secondary" sectionId="retrieve-job">Retrieve a job</SectionTab>

You can retrieve a job and information by its ID.

<Tabs groupId="code">
    <TabItem value="python" label="python" default>

```python
retrieved_jobs = client.fine_tuning.jobs.get(job_id = created_jobs.id)
```

    </TabItem>
    <TabItem value="typescript" label="typescript">

```typescript
const retrievedJob = await client.fineTuning.jobs.get({ jobId: createdJob.id });
```

    </TabItem>
    <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/fine_tuning/jobs/<jobid> \
--header "Authorization: Bearer $MISTRAL_API_KEY"
```

    </TabItem>
</Tabs>

<SectionTab as="h3" variant="secondary" sectionId="cancel-job">Cancel a job</SectionTab>

You can also cancel a job by its ID if needed.

<Tabs groupId="code">
    <TabItem value="python" label="python" default>

```python
canceled_jobs = client.fine_tuning.jobs.cancel(job_id = created_jobs.id)
```

    </TabItem>
    <TabItem value="typescript" label="typescript">

```typescript
const canceledJob = await client.fineTuning.jobs.cancel({
  jobId: createdJob.id,
});
```

    </TabItem>
    <TabItem value="curl" label="curl">

```bash
curl -X POST https://api.mistral.ai/v1/fine_tuning/jobs/<jobid>/cancel \
--header "Authorization: Bearer $MISTRAL_API_KEY"
```

    </TabItem>
</Tabs>
  </ExplorerTab>
</ExplorerTabs>

<SectionTab as="h1" sectionId="fine-tuned-models">Fine-tuned Model</SectionTab>

### Use and Delete Fine-tuned Models

Once your fine-tuning job is done, you can use your fine-tuned custom model in your applications.

<SectionTab as="h2" variant="secondary" sectionId="use-finetuned-model">Use a fine-tuned model</SectionTab>

Below is an example of how to use a fine-tuned model to classify your data.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
# You will be able to see the fine-tuned model name via `retrieved_job.fine_tuned_model`
chat_response = client.chat.complete(
    model=retrieved_job.fine_tuned_model,
    messages = [{"role":'user', "content":'What is the best French cheese?'}]
)
```

  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
// You will be able to see the fine-tuned model name via `retrievedJob.fine_tuned_model`
const chatResponse = await client.chat.complete({
  model: retrievedJob.fine_tuned_model,
  messages: [{ role: 'user', content: 'What is the best French cheese?' }],
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
    "model": "ft:open-mistral-7b:XXX:20240430:XXX",
    "messages": [{"role": "user", "content": "Who is the most renowned French painter?"}]
  }'
```

  </TabItem>

</Tabs>

<SectionTab as="h2" variant="secondary" sectionId="delete-finetuned-model">Delete a fine-tuned model</SectionTab>

You can delete a fine-tuned model if you no longer need it.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
client.models.delete(model_id=retrieved_job.fine_tuned_model)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
await client.models.delete({ modelId: retrieved_job.fine_tuned_model });
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl --location --request DELETE 'https://api.mistral.ai/v1/models/ft:classifier:ministral-3b-latest:XXX:20250401:XXX' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>
</Tabs>

<SectionTab sectionId="faq">FAQ</SectionTab>

<Faq>
  <FaqItem question="How to validate data format?">

- Mistral API: We currently validate each file when you upload the dataset.

- `mistral-finetune`: You can run the [data validation script](https://github.com/mistralai/mistral-finetune/blob/main/utils/validate_data.py) to validate the data and run the [reformat data script](https://github.com/mistralai/mistral-finetune/blob/main/utils/reformat_data.py) to reformat the data to the right format:
<Tabs>
  <TabItem value="bash" label="bash">
  ```bash
  # download the reformat script
  wget https://raw.githubusercontent.com/mistralai/mistral-finetune/main/utils/reformat_data.py
  # download the validation script
  wget https://raw.githubusercontent.com/mistralai/mistral-finetune/main/utils/validate_data.py
  # reformat data
  python reformat_data.py data.jsonl
  # validate data
  python validate_data.py data.jsonl
  ```
  </TabItem>
</Tabs>
  However, it's important to note that these scripts might not detect all problematic cases. Therefore, you may need to manually validate and correct any unique edge cases in your data.
  </FaqItem>
  <FaqItem question="What's the size limit of the training data?">

While the size limit for an individual training data file is 512MB, there's no limitation on the number of files you can upload. You can upload multiple files and reference them when creating the job.
  </FaqItem>
  <FaqItem question="What's the size limit of the validation data?">

The size limit for the validation data is 1MB. As a rule of thumb:

`validation_set_max_size = min(1MB, 5% of training data)`
  </FaqItem>
  <FaqItem question="What happens if I try to create a job that already exists?">

At job creation, you will receive a `409 Conflict` error in case a similar job is already running / validated / queued. This mechanism helps avoid inadvertently creating duplicate jobs, saving resources and preventing redundancy.
  </FaqItem>
  <FaqItem question="What if I upload an already existing file?">

If a file is uploaded and matches an existing file in both content and name, the pre-existing file is returned instead of creating a new one.
  </FaqItem>
  <FaqItem question="How many epochs are in the training process?">

A general rule of thumb is: Num epochs = max_steps / file_of_training_jsonls_in_MB. For instance, if your training file is 100MB and you set max_steps=1000, the training process will roughly perform 10 epochs.
  </FaqItem>
  <FaqItem question="Where can I find information on cost/ ETA / number of tokens / number of passes over each files?">

Mistral API: When you create a fine-tuning job, you should automatically see these info with the default `auto_start=False` argument.

Note that the `dry_run=True` argument will be removed in September.

`mistral-finetune`: You can use the following script to find out: https://github.com/mistralai/mistral-finetune/blob/main/utils/validate_data.py. This script accepts a .yaml training file as input and returns the number of tokens the model is being trained on.
  </FaqItem>
  <FaqItem question="How to estimate cost of a fine-tuning job?">

For Mistral API, you can use the `auto_start=False` argument as mentioned in the previous question.
  </FaqItem>
  <FaqItem question="What is the recommended learning rate?">

For LoRA fine-tuning, we recommend 1e-4 (default) or 1e-5.

Note that the learning rate we define is the peak learning rate, instead of a flat learning rate. The learning rate follows a linear warmup and cosine decay schedule. During the warmup phase, the learning rate is linearly increased from a small initial value to a larger value over a certain number of training steps. After the warmup phase, the learning rate is decayed using a cosine function.
  </FaqItem>
  <FaqItem question="Is the fine-tuning API compatible with OpenAI data format?">

Yes, we support OpenAI format.
  </FaqItem>
  <FaqItem question="What if my file size is larger than 500MB and I get the error message `413 Request Entity Too Large`?">

You can split your data file into chunks. Here is an example:

<Tabs>
  <TabItem value="python" label="python">
```py
import json
from datasets import load_dataset

# get data from hugging face

ds = load_dataset("HuggingFaceH4/ultrachat_200k",split="train_gen")

# save data into .jsonl. This file is about 1.3GB

with open('train.jsonl', 'w') as f:
for line in ds:
json.dump(line, f)
f.write('\n')

# reformat data

!wget https://raw.githubusercontent.com/mistralai/mistral-finetune/main/utils/reformat_data.py
!python reformat_data.py train.jsonl

# Split file into three chunks

input_file = "train.jsonl"
output_files = ["train_1.jsonl", "train_2.jsonl", "train_3.jsonl"]

# open the output files

output_file_objects = [open(file, "w") for file in output_files]

# counter for output files

counter = 0
with open(input_file, "r") as f_in: # read the input file line by line
for line in f_in: # parse the line as JSON
data = json.loads(line) # write the data to the current output file
output_file_objects[counter].write(json.dumps(data) + "\n") # increment the counter
counter = (counter + 1) % 3

# close the output files

for file in output_file_objects:
file.close()

# now you should see three jsonl files under 500MB

```
  </TabItem>
</Tabs>
  </FaqItem>
</Faq>