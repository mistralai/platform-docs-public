import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## End-to-end example with Mistral API

<a target="_blank" href="https://colab.research.google.com/github/mistralai/cookbook/blob/main/mistral/fine_tune/mistral_finetune_api.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>


You can fine-tune Mistral’s open-weights models Mistral 7B and Mistral Small via Mistral API. Follow the steps below using Mistral's fine-tuning API.

### Prepare dataset
In this example, let’s use the [ultrachat_200k dataset](https://huggingface.co/datasets/HuggingFaceH4/ultrachat_200k). We load a chunk of the data into Pandas Dataframes, split the data into training and validation, and save the data into the required `jsonl` format for fine-tuning. 

```py
import pandas as pd
df = pd.read_parquet('https://huggingface.co/datasets/HuggingFaceH4/ultrachat_200k/resolve/main/data/test_gen-00000-of-00001-3d4cd8309148a71f.parquet')

df_train=df.sample(frac=0.995,random_state=200)
df_eval=df.drop(df_train.index)

df_train.to_json("ultrachat_chunk_train.jsonl", orient="records", lines=True)
df_eval.to_json("ultrachat_chunk_eval.jsonl", orient="records", lines=True)
```

### Reformat dataset
If you upload this `ultrachat_chunk_train.jsonl` to Mistral API, you might encounter an error message “Invalid file format” due to data formatting issues. To reformat the data into the correct format, you can download the reformat_data.py script and use it to validate and reformat both the training and evaluation data:

```bash
# download the validation and reformat script 
wget https://raw.githubusercontent.com/mistralai/mistral-finetune/main/utils/reformat_data.py

# validate and reformat the training data
python reformat_data.py ultrachat_chunk_train.jsonl

# validate the reformat the eval data 
python reformat_data.py ultrachat_chunk_eval.jsonl
```

:::important[ ]
This `reformat_data.py` script is tailored for the UltraChat data and may not be universally applicable to other datasets. Please modify this script and reformat your data accordingly.
:::

After running the script, few cases were removed from the training data. 

```
Skip 3674th sample
Skip 9176th sample
Skip 10559th sample
Skip 13293th sample
Skip 13973th sample
Skip 15219th sample
```

Let’s inspect one of these cases. There are two issues with this use case: 
- one of the assistant messages is an empty string; 
- the last message is not an assistant message. 

<img src="/img/guides/ft1.png" alt="drawing" width="700"/>


### Upload dataset
We can then upload both the training data and evaluation data to the Mistral Client, making them available for use in fine-tuning jobs. 

<Tabs>
  <TabItem value="python" label="python" default>

```python
from mistralai import Mistral
import os

api_key = os.environ["MISTRAL_API_KEY"]

client = Mistral(api_key=api_key)

ultrachat_chunk_train = client.files.upload(file={
    "file_name": "ultrachat_chunk_train.jsonl",
    "content": open("ultrachat_chunk_train.jsonl", "rb"),
})
ultrachat_chunk_eval = client.files.upload(file={
    "file_name": "ultrachat_chunk_eval.jsonl",
    "content": open("ultrachat_chunk_eval.jsonl", "rb"),
})
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const file = fs.readFileSync('ultrachat_chunk_train.jsonl');
const ultrachat_chunk_train = await client.files.create({ file });

const file = fs.readFileSync('ultrachat_chunk_eval.jsonl');
const ultrachat_chunk_eval = await client.files.create({ file });
```
  </TabItem>
  
  <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/files \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@ultrachat_chunk_train.jsonl"

curl https://api.mistral.ai/v1/files \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@ultrachat_chunk_eval.jsonl"
```
  </TabItem>

</Tabs>

Example output:

Note that you will need the file IDs for the next steps. 
```
{
    "id": "66f96d02-8b51-4c76-a5ac-a78e28b2584f",
    "object": "file",
    "bytes": 140893645,
    "created_at": 1717164199,
    "filename": "ultrachat_chunk_train.jsonl",
    "purpose": "fine-tune"
}

{
    "id": "84482011-dfe9-4245-9103-d28b6aef30d4",
    "object": "file",
    "bytes": 7247934,
    "created_at": 1717164200,
    "filename": "ultrachat_chunk_eval.jsonl",
    "purpose": "fine-tune"
}
```

### Create a fine-tuning job
Next, we can create a fine-tuning job:

<Tabs>
  <TabItem value="python" label="python" default>

```python
# create a fine-tuning job
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

# start a fine-tuning job
client.fine_tuning.jobs.start(job_id = created_jobs.id)

created_jobs
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
const createdJob = await client.jobs.create({
  model: 'open-mistral-7b',
  trainingFiles: [ultrachat_chunk_train.id],
  validationFiles: [ultrachat_chunk_eval.id],
  hyperparameters: {
    trainingSteps: 10,
    learningRate: 0.0001,
  },
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
  }
}'
```
  </TabItem>

</Tabs>

Example output:

```
{
    "id": "25d7efe6-6303-474f-9739-21fb0fccd469",
    "hyperparameters": {
        "training_steps": 10,
        "learning_rate": 0.0001
    },
    "fine_tuned_model": null,
    "model": "open-mistral-7b",
    "status": "QUEUED",
    "job_type": "FT",
    "created_at": 1717170356,
    "modified_at": 1717170357,
    "training_files": [
        "66f96d02-8b51-4c76-a5ac-a78e28b2584f"
    ],
    "validation_files": [
        "84482011-dfe9-4245-9103-d28b6aef30d4"
    ],
    "object": "job",
    "integrations": []
}
```


### Analyze and evaluate fine-tuned model

When we retrieve a model, we get the following metrics every 10% of the progress with a minimum of 10 steps in between:
- Training loss: the error of the model on the training data, indicating how well the model is learning from the training set. 
- Validation loss: the error of the model on the validation data, providing insight into how well the model is generalizing to unseen data. 
- Validation token accuracy: the percentage of tokens in the validation set that are correctly predicted by the model. 

Both validation loss and validation token accuracy serve as essential indicators of the model's overall performance, helping to assess its ability to generalize and make accurate predictions on new data.


<Tabs>
  <TabItem value="python" label="python" default>

```python
# Retrieve a jobs
retrieved_jobs = client.fine_tuning.jobs.get(job_id = created_jobs.id)
print(retrieved_jobs)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
// Retrieve a job
const retrievedJob = await client.jobs.retrieve({ jobId: createdJob.id });
```
  </TabItem>
  
  <TabItem value="curl" label="curl">

```bash
# Retrieve a job
curl https://api.mistral.ai/v1/fine_tuning/jobs/<jobid> \
--header "Authorization: Bearer $MISTRAL_API_KEY" \
--header 'Content-Type: application/json'
```
  </TabItem>
</Tabs>

<details>
<summary><b>Example output when we run 100 steps:</b></summary>

```
{
    "id": "2813b7e6-c511-43ac-a16a-1a54a5b884b2",
    "hyperparameters": {
        "training_steps": 100,
        "learning_rate": 0.0001
    },
    "fine_tuned_model": "ft:open-mistral-7b:57d37e6c:20240531:2813b7e6",
    "model": "open-mistral-7b",
    "status": "SUCCESS",
    "job_type": "FT",
    "created_at": 1717172592,
    "modified_at": 1717173491,
    "training_files": [
        "66f96d02-8b51-4c76-a5ac-a78e28b2584f"
    ],
    "validation_files": [
        "84482011-dfe9-4245-9103-d28b6aef30d4"
    ],
    "object": "job",
    "integrations": [],
    "events": [
        {
            "name": "status-updated",
            "data": {
                "status": "SUCCESS"
            },
            "created_at": 1717173491
        },
        {
            "name": "status-updated",
            "data": {
                "status": "RUNNING"
            },
            "created_at": 1717172594
        },
        {
            "name": "status-updated",
            "data": {
                "status": "QUEUED"
            },
            "created_at": 1717172592
        }
    ],
    "checkpoints": [
        {
            "metrics": {
                "train_loss": 0.816135,
                "valid_loss": 0.819697,
                "valid_mean_token_accuracy": 1.765035
            },
            "step_number": 100,
            "created_at": 1717173470
        },
        {
            "metrics": {
                "train_loss": 0.84643,
                "valid_loss": 0.819768,
                "valid_mean_token_accuracy": 1.765122
            },
            "step_number": 90,
            "created_at": 1717173388
        },
        {
            "metrics": {
                "train_loss": 0.816602,
                "valid_loss": 0.820234,
                "valid_mean_token_accuracy": 1.765692
            },
            "step_number": 80,
            "created_at": 1717173303
        },
        {
            "metrics": {
                "train_loss": 0.775537,
                "valid_loss": 0.821105,
                "valid_mean_token_accuracy": 1.766759
            },
            "step_number": 70,
            "created_at": 1717173217
        },
        {
            "metrics": {
                "train_loss": 0.840297,
                "valid_loss": 0.822249,
                "valid_mean_token_accuracy": 1.76816
            },
            "step_number": 60,
            "created_at": 1717173131
        },
        {
            "metrics": {
                "train_loss": 0.823884,
                "valid_loss": 0.824598,
                "valid_mean_token_accuracy": 1.771041
            },
            "step_number": 50,
            "created_at": 1717173045
        },
        {
            "metrics": {
                "train_loss": 0.786473,
                "valid_loss": 0.827982,
                "valid_mean_token_accuracy": 1.775201
            },
            "step_number": 40,
            "created_at": 1717172960
        },
        {
            "metrics": {
                "train_loss": 0.8704,
                "valid_loss": 0.835169,
                "valid_mean_token_accuracy": 1.784066
            },
            "step_number": 30,
            "created_at": 1717172874
        },
        {
            "metrics": {
                "train_loss": 0.880803,
                "valid_loss": 0.852521,
                "valid_mean_token_accuracy": 1.805653
            },
            "step_number": 20,
            "created_at": 1717172788
        },
        {
            "metrics": {
                "train_loss": 0.803578,
                "valid_loss": 0.914257,
                "valid_mean_token_accuracy": 1.884598
            },
            "step_number": 10,
            "created_at": 1717172702
        }
    ]
}
```
</details>

### Use a fine-tuned model 
When a fine-tuned job is finished, you will be able to see the fine-tuned model name via `retrieved_jobs.fine_tuned_model`. Then you can use our `chat` endpoint to chat with the fine-tuned model: 


<Tabs>
  <TabItem value="python" label="python" default>

```python
chat_response = client.chat.complete(
    model = retrieved_jobs.fine_tuned_model,
    messages = [{"role":'user', "content":'What is the best French cheese?'}]
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
const chatResponse = await client.chat({
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

### Integration with Weights and Biases
We can also offer support for integration with Weights & Biases (W&B) to monitor and track various metrics and statistics associated with our fine-tuning jobs. To enable integration with W&B, you will need to create an account with W&B and add your W&B information in the “integrations” section in the job creation request: 

```python
client.fine_tuning.jobs.create(
    model="open-mistral-7b", 
    training_files=[{"file_id": ultrachat_chunk_train.id, "weight": 1}],
    validation_files=[ultrachat_chunk_eval.id],
    hyperparameters={"training_steps": 10, "learning_rate": 0.0001},
    integrations=[
        {
            "project": "<value>",
            "api_key": "<value>",
        }
    ]
)
```

Here are the screenshots of the W&B dashboard showing the information of our fine-tuning job. 

<img src="/img/guides/ft2.png" alt="drawing" width="100%"/>

## End-to-end example with open-source `mistral-finetune`
We have also open sourced fine-tuning codebase mistral-finetune allowing you to fine-tune Mistral’s open-weights models (Mistral 7B, Mixtral 8x7B, Mixtral 8x22B). 

To see an end-to-end example of how to install mistral-finetune, prepare and validate your dataset, define your training configuration, fine-tune using Mistral-LoRA, and run inference, please refer to the README file provided in the Mistral-finetune repo: https://github.com/mistralai/mistral-finetune/tree/main or follow this example: 


<a target="_blank" href="https://colab.research.google.com/github/mistralai/mistral-finetune/blob/main/tutorials/mistral_finetune_7b.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>


