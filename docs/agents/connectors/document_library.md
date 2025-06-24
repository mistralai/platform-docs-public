---
id: document_library
title: Document Library (Beta)
slug: document_library
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/document_library_connector.png"
    alt="document_library_graph"
    width="400"
    style={{ borderRadius: '15px' }}
  />
</div>

Document Library is a built-in [connector](../connectors) tool that enables agents to access documents from Mistral Cloud. It is a built-in RAG capability that enhances your agents' knowledge with the data you have uploaded.

## Create a Document Library Agent

You can create an agent with access to the document library by providing it as one of the tools. Note that you can still add more tools to the agent. The model is free to access and leverage the knowledge from the uploaded documents.

You specify the libraries that the agent has access to with `library_ids`. These IDs are visible in the URL of the corresponding library created on Le Chat, for example: `https://chat.mistral.ai/libraries/<library_id>`.

Currently, you can only create libraries via Le Chat. To enable the Agent to access the library, you have to be an Org admin and share it with the Organization.  
This feature is currently in testing, so it may undergo considerable changes in the future as more features are added.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
library_agent = client.beta.agents.create(
    model="mistral-medium-2505",
    name="Document Library Agent",
    description="Agent used to access documents from the document library.",
    instructions="Use the  library tool to access external documents.",
    tools=[{"type": "document_library", "library_ids": ["<library_id>"]}],
    completion_args={
        "temperature": 0.3,
        "top_p": 0.95,
    }
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
let libraryAgent = await client.beta.agents.create({
    model:"mistral-medium-2505",
    name:"Document Library Agent",
    description:"Agent used to access documents from the document library.",
    instructions:"Use the  library tool to access external documents.",
    tools:[
        {
            type: "document_library", 
            libraryIds: ["<library_id>"]
        }
    ],
    completionArgs:{
        temperature: 0.3,
        topP: 0.95,
    }
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/agents" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "model": "mistral-medium-2505",
     "name": "Library Agent",
     "description": "Agent able to search information in your library...",
     "instructions": "You have the ability to perform searches with `document_library` to find relevant information.",
     "tools": [
       {
         "type": "document_library",
         "library_ids" : ["<library_id>"]
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

<details>
    <summary><b>Output</b></summary>

```json
{
  "model": "mistral-medium-2505",
  "name": "Document Library Agent",
  "description": "Agent used to access documents from the document library.",
  "id": "ag_06835bb196f9720680004fb1873efbae",
  "version": 0,
  "created_at": "2025-05-27T13:16:09.438785Z",
  "updated_at": "2025-05-27T13:16:09.438787Z",
  "instructions": "Use the library tool to access external documents.",
  "tools": [
    {
      "library_ids": [
        "06835a9c-262c-7e83-8000-594d29fe2948"
      ],
      "type": "document_library"
    }
  ],
  "completion_args": {
    "stop": null,
    "presence_penalty": null,
    "frequency_penalty": null,
    "temperature": 0.3,
    "top_p": 0.95,
    "max_tokens": null,
    "random_seed": null,
    "prediction": null,
    "response_format": null,
    "tool_choice": "auto"
  },
  "handoffs": null,
  "object": "agent"
}

```
</details>

As with other agents, when creating one, you will receive an agent ID corresponding to the created agent. You can use this ID to start a conversation.

## How It Works

Now that we have our document library agent ready, we can search them on demand at any point.

### Conversations with Document Library

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
response = client.beta.conversations.start(
    agent_id=image_agent.id,
    inputs="How does the vision encoder for pixtral 12b work"
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
let conversation = await client.beta.conversations.start({
    agentId: libraryAgent.id,
    inputs: "How does the vision encoder for pixtral 12b work"
});
```
  </TabItem>

  <TabItem value="curl" label="curl">
  
```bash
curl --location "https://api.mistral.ai/v1/conversations" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "inputs": "How does the vision encoder for pixtral 12b work",
     "stream": false,
     "agent_id": "<agent_id>"
  }'
```
  </TabItem>
</Tabs>

For explanation purposes, lets take a look at the output in a readable JSON format.

```json
{
  "conversation_id": "conv_06835bb1996079898000435d8a0b1afd",
  "outputs": [
    {
      "type": "tool.execution",
      "name": "document_library",
      "object": "entry",
      "created_at": "2025-05-27T13:16:09.974925Z",
      "completed_at": "2025-05-27T13:16:10.855373Z",
      "id": "tool_exec_06835bb19f99716580001de8ab64d953"
    },
    {
      "type": "message.output",
      "content": [
        {
          "type": "text",
          "text": "The vision encoder for Pixtral 12B, known as PixtralViT, is designed to process images at their natural resolution and aspect ratio. Here are the key details about how it works:\n\n1. **Architecture**: PixtralViT is a vision transformer with 400 million parameters. It is trained from scratch to support variable image sizes and aspect ratios, which is a significant departure from standard architectures that often require fixed image sizes.\n\n2. **Key Modifications**:\n   - **Break Tokens**: To help the model distinguish between images with the same number of patches but different aspect ratios, special tokens like [IMAGE BREAK] are inserted between image rows, and an [IMAGE END] token is added at the end of an image sequence.\n   - **Gating in FFN**: Instead of using a standard feedforward layer in the attention block, PixtralViT employs gating in the hidden layer, which enhances its performance.\n   - **Sequence Packing**: Images are flattened along the sequence dimension and concatenated to process multiple images efficiently within a single batch. A block-diagonal mask ensures no attention leakage between patches from different images.\n   - **RoPE-2D**: Traditional position embeddings are replaced with relative, rotary position encodings (RoPE-2D) in the self-attention layers. This allows the model to handle variable image sizes more effectively without the need for interpolation, which can degrade performance.\n\n3. **Integration with Multimodal Decoder**: The vision encoder is linked to the multimodal decoder via a two-layer fully connected network. This network transforms the output of the vision encoder into the input embedding size required by the decoder. The image tokens are treated similarly to text tokens by the multimodal decoder, which uses RoPE-1D positional encodings for all tokens.\n\n4. **Performance**: The Pixtral vision encoder significantly outperforms other models in tasks requiring fine-grained document understanding while maintaining parity for natural images. It is particularly effective in settings that require detailed visual comprehension, such as chart and document understanding.\n\nThese architectural choices and modifications enable Pixtral 12B to flexibly process images at various resolutions and aspect ratios, making it highly versatile for complex multimodal applications."
        }
      ],
      "object": "entry",
      "created_at": "2025-05-27T13:16:11.239496Z",
      "completed_at": "2025-05-27T13:16:17.211241Z",
      "id": "msg_06835bb1b3d47ca580001b213d836798",
      "agent_id": "ag_06835bb196f9720680004fb1873efbae",
      "model": "mistral-medium-2505",
      "role": "assistant"
    }
  ],
  "usage": {
    "prompt_tokens": 196,
    "completion_tokens": 485,
    "total_tokens": 3846,
    "connector_tokens": 3165,
    "connectors": {
      "document_library": 1
    }
  },
  "object": "conversation.response"
}
```

### Explanation of the Outputs

- **`tool.execution`**: This entry corresponds to the execution of the document library tool. It includes metadata about the execution, such as:
  - `name`: The name of the tool, which in this case is `document_library`.
  - `object`: The type of object, which is `entry`.
  - `type`: The type of entry, which is `tool.execution`.
  - `created_at` and `completed_at`: Timestamps indicating when the tool execution started and finished.
  - `id`: A unique identifier for the tool execution.

- **`message.output`**: This entry corresponds to the generated answer from our agent. It includes metadata about the message, such as:
  - `content`: The actual content of the message, which in this case is a list of chunks. These chunks correspond to the text chunks, the actual message response of the model, sometimes interleaved with reference chunks. These reference chunks are used for citations during Retrieval-Augmented Generation (RAG) related tool usages. In this case, it provides the source of the information it just answered with, which is extremely useful for web search. This allows for transparent feedback on where the model got its response from for each section and fact answered with. The `content` section includes:
    - `type`: The type of chunk, which can be `text` or `tool_reference`.
    - `text`: The actual text content of the message.
  - `object`: The type of object, which is `entry`.
  - `type`: The type of entry, which is `message.output`.
  - `created_at` and `completed_at`: Timestamps indicating when the message was created and completed.
  - `id`: A unique identifier for the message.
  - `agent_id`: A unique identifier for the agent that generated the message.
  - `model`: The model used to generate the message, which in this case is `mistral-medium-2505`.
  - `role`: The role of the message, which is `assistant`.

Another tool that pro-actively uses references is the websearch connector, feel free to take a look [here](../websearch).  
For more information regarding the use of citations, you can find more [here](../../../capabilities/citations).
