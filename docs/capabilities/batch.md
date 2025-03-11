---
id: batch
title: Batch Inference
sidebar_position: 2.92
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Prepare and upload your batch

A batch is composed of a list of API requests. The structure of an individual request includes:

- A unique `custom_id` for identifying each request and referencing results after completion 
- A `body` object with message information 

Here's an example of how to structure a batch request:

```bash
{"custom_id": "0", "body": {"max_tokens": 100, "messages": [{"role": "user", "content": "What is the best French cheese?"}]}}
{"custom_id": "1", "body": {"max_tokens": 100, "messages": [{"role": "user", "content": "What is the best French wine?"}]}}
```

Save your batch into a .jsonl file. Once saved, you can upload your batch input file to ensure it is correctly referenced when initiating batch processes: 

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
from mistralai import Mistral
import os

api_key = os.environ["MISTRAL_API_KEY"]

client = Mistral(api_key=api_key)

batch_data = client.files.upload(
    file={
        "file_name": "test.jsonl",
        "content": open("test.jsonl", "rb")},
    purpose = "batch"
    
)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from '@mistralai/mistralai';
import fs from 'fs';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const batchFile = fs.readFileSync('batch_input_file.jsonl');
const batchData = await client.files.upload({
    file: {
        fileName: "batch_input_file.jsonl",
        content: batchFile,
    }
});
```

  </TabItem>
  <TabItem value="curl" label="curl">

```curl
curl https://api.mistral.ai/v1/files \
  -H "Authorization: Bearer $MISTRAL_API_KEY" \
  -F purpose="batch" \
  -F file="@batch_input_file.jsonl"
```

  </TabItem>
</Tabs>


## Create a new batch job 
Create a new batch job, it will be queued for processing.

- `input_files`: a list of the batch input file IDs. 
- `model`: you can only use one model (e.g., `codestral-latest`) per batch. However, you can run multiple batches on the same files with different models if you want to compare outputs.
- `endpoint`: we currently support `/v1/embeddings`, `/v1/chat/completions`, `/v1/fim/completions`, `/v1/moderations`, `/v1/chat/moderations`.
- `metadata`: optional custom metadata for the batch.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>
```python
created_job = client.batch.jobs.create(
    input_files=[batch_data.id],
    model="mistral-small-latest",
    endpoint="/v1/chat/completions",
    metadata={"job_type": "testing"}
)
```
  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const createdJob = await client.batch.jobs.create({
    inputFiles: [batchData.id],
    model: "mistral-small-latest",
    endpoint: "/v1/chat/completions",
    metadata: {jobType: "testing"}
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/batch/jobs" \
--header "Authorization: Bearer $MISTRAL_API_KEY" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--data '{
    "model": "mistral-small-latest",
    "input_files": [
        "<uuid>"
    ],
    "endpoint": "/v1/chat/completions",
    "metadata": {
        "job_type": "testing"
    }
}'
```
  </TabItem>
</Tabs>


## Get a batch job details 

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
retrieved_job = client.batch.jobs.get(job_id=created_job.id)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
const retrievedJob = await client.batch.jobs.get({ jobId: createdJob.id}); 
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl https://api.mistral.ai/v1/batch/jobs/<jobid> \
--header "Authorization: Bearer $MISTRAL_API_KEY" \
--header 'Content-Type: application/json'
```

  </TabItem>
</Tabs>

## Get batch job results
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
client.files.download(file_id=retrieved_job.output_file)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
client.files.download({ fileId: retrieved_job.output_file}); 
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl 'https://api.mistral.ai/v1/files/<uuid>/content' \
--header "Authorization: Bearer $MISTRAL_API_KEY" \
```

  </TabItem>
</Tabs>

## List batch jobs 
You can view a list of your batch jobs and filter them by various criteria, including:

- Status: `QUEUED`,
`RUNNING`, `SUCCESS`, `FAILED`, `TIMEOUT_EXCEEDED`,`CANCELLATION_REQUESTED`, `CANCELLATION_REQUESTED`,
`CANCELLED`
- Metadata: custom metadata key and value for the batch

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
list_job = client.batch.jobs.list(
    status="RUNNING",   
    metadata={"job_type": "testing"}
)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
const listJob = await client.batch.jobs.list({ 
    status: "RUNNING",
    metadata: {
        job_type: "testing"
    }
});
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl 'https://api.mistral.ai/v1/batch/jobs?status=RUNNING&job_type=testing'\
--header 'x-api-key: $MISTRAL_API_KEY' \
--header 'Content-Type: application/json'
```

  </TabItem>
</Tabs>


## Request the cancellation of a batch job

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```python
canceled_job = client.batch.jobs.cancel(job_id=created_job.id)
```

  </TabItem>
  <TabItem value="typescript" label="typescript">

```typescript
const canceledJob = await mistral.fineTuning.jobs.cancel({
  jobId: createdJob.id,
});
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl -X POST https://api.mistral.ai/v1/batch/jobs/<jobid>/cancel \
--header "Authorization: Bearer $MISTRAL_API_KEY" \
--header 'Content-Type: application/json'
```

  </TabItem>
</Tabs>

## An end-to-end example

<details>
<summary><b>Example</b></summary>

```python
import argparse
import json
import os
import random
import time
from io import BytesIO

import httpx
from mistralai import File, Mistral


def create_client():
    """
    Create a Mistral client using the API key from environment variables.

    Returns:
        Mistral: An instance of the Mistral client.
    """
    return Mistral(api_key=os.environ["MISTRAL_API_KEY"])

def generate_random_string(start, end):
    """
    Generate a random string of variable length.

    Args:
        start (int): Minimum length of the string.
        end (int): Maximum length of the string.

    Returns:
        str: A randomly generated string.
    """
    length = random.randrange(start, end)
    return ' '.join(random.choices('abcdefghijklmnopqrstuvwxyz', k=length))

def print_stats(batch_job):
    """
    Print the statistics of the batch job.

    Args:
        batch_job: The batch job object containing job statistics.
    """
    print(f"Total requests: {batch_job.total_requests}")
    print(f"Failed requests: {batch_job.failed_requests}")
    print(f"Successful requests: {batch_job.succeeded_requests}")
    print(
        f"Percent done: {round((batch_job.succeeded_requests + batch_job.failed_requests) / batch_job.total_requests, 4) * 100}")


def create_input_file(client, num_samples):
    """
    Create an input file for the batch job.

    Args:
        client (Mistral): The Mistral client instance.
        num_samples (int): Number of samples to generate.

    Returns:
        File: The uploaded input file object.
    """
    buffer = BytesIO()
    for idx in range(num_samples):
        request = {
            "custom_id": str(idx),
            "body": {
                "max_tokens": random.randint(10, 1000),
                "messages": [{"role": "user", "content": generate_random_string(100, 5000)}]
            }
        }
        buffer.write(json.dumps(request).encode("utf-8"))
        buffer.write("\n".encode("utf-8"))
    return client.files.upload(file=File(file_name="file.jsonl", content=buffer.getvalue()), purpose="batch")


def run_batch_job(client, input_file, model):
    """
    Run a batch job using the provided input file and model.

    Args:
        client (Mistral): The Mistral client instance.
        input_file (File): The input file object.
        model (str): The model to use for the batch job.

    Returns:
        BatchJob: The completed batch job object.
    """
    batch_job = client.batch.jobs.create(
        input_files=[input_file.id],
        model=model,
        endpoint="/v1/chat/completions",
        metadata={"job_type": "testing"}
    )

    while batch_job.status in ["QUEUED", "RUNNING"]:
        batch_job = client.batch.jobs.get(job_id=batch_job.id)
        print_stats(batch_job)
        time.sleep(1)

    print(f"Batch job {batch_job.id} completed with status: {batch_job.status}")
    return batch_job


def download_file(client, file_id, output_path):
    """
    Download a file from the Mistral server.

    Args:
        client (Mistral): The Mistral client instance.
        file_id (str): The ID of the file to download.
        output_path (str): The path where the file will be saved.
    """
    if file_id is not None:
        print(f"Downloading file to {output_path}")
        output_file = client.files.download(file_id=file_id)
        with open(output_path, "w") as f:
            for chunk in output_file.stream:
                f.write(chunk.decode("utf-8"))
        print(f"Downloaded file to {output_path}")


def main(num_samples, success_path, error_path, model):
    """
    Main function to run the batch job.

    Args:
        num_samples (int): Number of samples to process.
        success_path (str): Path to save successful outputs.
        error_path (str): Path to save error outputs.
        model (str): Model name to use.
    """
    client = create_client()
    input_file = create_input_file(client, num_samples)
    print(f"Created input file {input_file}")

    batch_job = run_batch_job(client, input_file, model)
    print(f"Job duration: {batch_job.completed_at - batch_job.created_at} seconds")
    download_file(client, batch_job.error_file, error_path)
    download_file(client, batch_job.output_file, success_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Mistral AI batch job")
    parser.add_argument("--num_samples", type=int, default=100, help="Number of samples to process")
    parser.add_argument("--success_path", type=str, default="output.jsonl", help="Path to save successful outputs")
    parser.add_argument("--error_path", type=str, default="error.jsonl", help="Path to save error outputs")
    parser.add_argument("--model", type=str, default="codestral-latest", help="Model name to use")

    args = parser.parse_args()

    main(args.num_samples, args.success_path, args.error_path, args.model)
```
</details>

## FAQ

### Is the batch API available for all models?
Yes, batch API is available for all models including user fine-tuned models. 

### Does the batch API affect pricing?
The batch API offers a discount on pricing. Please see details on our [pricing page](https://mistral.ai/technology/#pricing).

### Does the batch API affect rate limits?
No

### What's the max number of requests in a batch?
Currently, there is a maximum limit of 1 million pending requests per workspace. This means you cannot submit a job with more than 1 million requests. Additionally, you cannot submit two jobs with 600,000 requests each at the same time. You would need to wait until the first job has processed at least 200,000 requests, reducing its pending count to 400,000. At that point, the new job with 600,000 requests would fit within the limit.

### What's the max number of batch jobs one can create? 
Currently, there is no maximum limit. 

### How long does the batch API take to process? 
Processing speeds may be adjusted based on current demand and the volume of your request. Your batch results will only be accessible once the entire batch processing is complete.

Users can set `timeout_hours` when creating a job, which specifies the number of hours after which the job should expire. It defaults to 24 hours and should be lower than 7 days. A batch will expire if processing does not complete within the specified timeout.

### Can I view batch results from my workspace?
Yes, batches are specific to a workspace. You can see all batches and their results that were created within the workspace associated with your API key.

### Will batch results ever expire?
No, the results do not expire at this time.

### Can batches exceed the spend limit?
Yes, due to high throughput and concurrent processing, batches may slightly exceed your workspace's configured spend limit.
