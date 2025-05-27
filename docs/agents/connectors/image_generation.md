---
id: image_generation
title: Image Generation
slug: image_generation
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/image_generation_connector.png"
    alt="image_generation_graph"
    width="400"
    style={{ borderRadius: '15px' }}
  />
</div>

Image Generation is a built-in [connector](../connectors) tool that enables agents to generate images of all kinds and forms. Enabling this tool allows models to create images at any given moment.

## Create an Image Generation Agent

You can create an agent with access to image generation by providing it as one of the tools. Note that you can still add more tools to the agent. The model is free to create images on demand.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
image_agent = client.beta.agents.create(
    model="mistral-medium-2505",
    name="Image Generation Agent",
    description="Agent used to generate images.",
    instructions="Use the image generation tool when you have to create images.",
    tools=[{"type": "image_generation"}],
    completion_args={
        "temperature": 0.3,
        "top_p": 0.95,
    }
)
```
<details>
    <summary><b>Output</b></summary>

```
model='mistral-medium-2505' name='Image Generation Agent' description='Agent used to generate images.' id='ag_068359b1d997713480003c77113b8119' version=0 created_at=datetime.datetime(2025, 5, 27, 10, 59, 41, 602844, tzinfo=TzInfo(UTC)) updated_at=datetime.datetime(2025, 5, 27, 10, 59, 41, 602846, tzinfo=TzInfo(UTC)) instructions='Use the image generation tool when you have to create images.' tools=[ImageGenerationTool(type='image_generation')] completion_args=CompletionArgs(stop=None, presence_penalty=None, frequency_penalty=None, temperature=0.3, top_p=0.95, max_tokens=None, random_seed=None, prediction=None, response_format=None, tool_choice='auto') handoffs=None object='agent'
```
</details>
  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Coming soon...*
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/agents" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "model": "mistral-medium-2505",
     "name": "Image Generation Agent",
     "description": "Agent used to generate images.",
     "instructions": "Use the image generation tool when you have to create images.",
     "tools": [
       {
         "type": "image_generation"
       }
     ],
     "completion_args": {
       "temperature": 0.3,
       "top_p": 0.95
     }
  }'

```
  </TabItem>
</Tabs>

As with other agents, when creating one, you will receive an agent ID corresponding to the created agent. You can use this ID to start a conversation.

## How It Works

Now that we have our image generation agent ready, we can create images on demand at any point.

### Conversations with Image Generation

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
response = client.beta.conversations.start(
    agent_id=image_agent.id, inputs="Generate an orange cat in an office."
)
```

<details>
    <summary><b>Output</b></summary>

```
conversation_id='conv_068359b1dc6f74658000000a358b2357' outputs=[ToolExecutionEntry(name='image_generation', object='entry', type='tool.execution', created_at=datetime.datetime(2025, 5, 27, 10, 59, 53, 92347, tzinfo=TzInfo(UTC)), completed_at=datetime.datetime(2025, 5, 27, 10, 59, 56, 436333, tzinfo=TzInfo(UTC)), id='tool_exec_068359b2917a7117800018b42bf8dc39', info={}), MessageOutputEntry(content=[TextChunk(text='Here is your image: an orange cat in an office.\n\n', type='text'), ToolFileChunk(tool='image_generation', file_id='933c5b5a-1c47-4cdd-84f6-f32526bd161b', type='tool_file', file_name='image_generated_0', file_type='png')], object='entry', type='message.output', created_at=datetime.datetime(2025, 5, 27, 10, 59, 57, 718377, tzinfo=TzInfo(UTC)), completed_at=datetime.datetime(2025, 5, 27, 10, 59, 58, 818205, tzinfo=TzInfo(UTC)), id='msg_068359b2db7e74eb8000d11444e03eb8', agent_id='ag_068359b1d997713480003c77113b8119', model='mistral-medium-2505', role='assistant')] usage=ConversationUsageInfo(prompt_tokens=129, completion_tokens=94, total_tokens=292, connector_tokens=69, connectors={'image_generation': 1}) object='conversation.response'
```
</details>
  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Coming soon...*
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/conversations" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "inputs": "Generate an orange cat in an office.",
     "stream": false,
     "agent_id": "<agent_id>"
  }'
```
  </TabItem>
</Tabs>

For explanation purposes, lets restructure the previous output in a more readeable JSON format.

```json
{
  "conversation_id": "conv_068359b1dc6f74658000000a358b2357",
  "outputs": [
    {
      "name": "image_generation",
      "object": "entry",
      "type": "tool.execution",
      "created_at": "2025-05-27T10:59:53.092347Z",
      "completed_at": "2025-05-27T10:59:56.436333Z",
      "id": "tool_exec_068359b2917a7117800018b42bf8dc39"
    },
    {
      "content": [
        {
          "text": "Here is your image: an orange cat in an office.\n\n",
          "type": "text"
        },
        {
          "tool": "image_generation",
          "file_id": "933c5b5a-1c47-4cdd-84f6-f32526bd161b",
          "type": "tool_file",
          "file_name": "image_generated_0",
          "file_type": "png"
        }
      ],
      "object": "entry",
      "type": "message.output",
      "created_at": "2025-05-27T10:59:57.718377Z",
      "completed_at": "2025-05-27T10:59:58.818205Z",
      "id": "msg_068359b2db7e74eb8000d11444e03eb8",
      "agent_id": "ag_068359b1d997713480003c77113b8119",
      "model": "mistral-medium-2505",
      "role": "assistant"
    }
  ],
  "usage": {
    "prompt_tokens": 129,
    "total_tokens": 292,
    "completion_tokens": 94,
    "connector_tokens": 69,
    "connectors": {
      "image_generation": 1
    }
  },
  "object": "conversation.response"
}
```

### Explanation of the Outputs
There are 2 main entries in the `outputs` of our request:

- **`tool.execution`**: This entry corresponds to the execution of the image generation tool. It includes metadata about the execution, such as:
  - `name`: The name of the tool, which in this case is `image_generation`.
  - `object`: The type of object, which is `entry`.
  - `type`: The type of entry, which is `tool.execution`.
  - `created_at` and `completed_at`: Timestamps indicating when the tool execution started and finished.
  - `id`: A unique identifier for the tool execution.

- **`message.output`**: This entry corresponds to the generated answer from our agent. It includes metadata about the message, such as:
  - `content`: The actual content of the message, which in this case is a list of chunks. These chunks can be of different types, and the model can interleave different chunks, using `text` chunks and others to complete the message. In this case, we got a two chunks corresponding to a `text` chunk and a `tool_file`, which represents the generated file, specifically the generated image. The `content` section includes:
    - `tool`: The name of the tool used for generating the file, which in this case is `image_generation`.
    - `file_id`: A unique identifier for the generated file.
    - `type`: The type of chunk, which in this case is `tool_file`.
    - `file_name`: The name of the generated file.
    - `file_type`: The type of the generated file, which in this case is `png`.
  - `object`: The type of object, which is `entry`.
  - `type`: The type of entry, which is `message.output`.
  - `created_at` and `completed_at`: Timestamps indicating when the message was created and completed.
  - `id`: A unique identifier for the message.
  - `agent_id`: A unique identifier for the agent that generated the message.
  - `model`: The model used to generate the message, which in this case is `mistral-medium-2505`.
  - `role`: The role of the message, which is `assistant`.

### Download Images
To access that image you can download it via our files endpoint.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
# Download using the ToolFileChunk ID
file_bytes = client.files.download(file_id=file_chunk.file_id).read()

# Save the file locally
with open(f"image_generated.png", "wb") as file:
    file.write(file_bytes)
```

**Generated Image:**
<div style={{ textAlign: 'center' }}>
  <img
    src="/img/agent_generated.png"
    alt="generated_image"
    width="600"
    style={{ borderRadius: '15px' }}
  />
</div>


A full code snippet to download all generated images from a response could look like so:
```py
from mistralai.models import ToolFileChunk

for i, chunk in enumerate(response.outputs[-1].content):
    # Check if chunk corresponds to a ToolFileChunk
    if isinstance(chunk, ToolFileChunk):

      # Download using the ToolFileChunk ID
      file_bytes = client.files.download(file_id=chunk.file_id).read()

      # Save the file locally
      with open(f"image_generated_{i}.png", "wb") as file:
          file.write(file_bytes)
```

  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Coming soon...*
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/files/<file_id>/content" \
     --header 'Accept: application/octet-stream' \
     --header 'Accept-Encoding: gzip, deflate, zstd' \
     --header "Authorization: Bearer $MISTRAL_API_KEY"
```
  </TabItem>
</Tabs>