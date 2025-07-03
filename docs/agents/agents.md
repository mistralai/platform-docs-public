---
id: agents_basics
title: Agents & Conversations
slug: agents_basics
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Objects

We introduce three new main objects that our API makes use of:
- **Agents**: A set of pre-selected values to augment model abilities, such as tools, instructions, and completion parameters.
- **Conversation**: A history of interactions, past events and entries with an assistant, such as messages and tool executions, Conversations can be started by an Agent or a Model.
- **Entry**: An action that can be created by the user or an assistant. It brings a more flexible and expressive representation of interactions between a user and one or multiple assistants. This allows for more control over describing events.

*You can also leverage all the features of Agents and Conversations without the need to create an Agent. This means you can query our API without creating an Agent, from using the built-in Conversations features to the built-in Connectors.*

## Agent Creation

When creating an Agent, there are multiple parameters and values that need to be set in advance. These are:
- `model`: The model your agent will use among our available models for chat completion.
- `description`: The agent description, related to the task it must accomplish or the use case at stake.
- `name`: The name of your agent.
- `instructions` *optional*: The main instructions of the agent, also known as the system prompt. This must accurately describe the main task of your agent.
- `tools` *optional*: A list of tools the model can make use of. There are currently different `types` of tools:
  - `function`: User-defined tools, with similar usage to the standard function calling used with chat completion.
  - `web_search`/`web_search_premium`: Our built-in tool for web search.
  - `code_interpreter`: Our built-in tool for code execution.
  - `image_generation`: Our built-in tool for image generation.
  - `document_library`: Our built-in RAG tool for knowledge grounding and search on custom data.
- `completion_args` *optional*: Standard chat completion sampler arguments. All chat completion arguments are accepted.

### Creating an Agent
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
client = Mistral(api_key)

simple_agent = client.beta.agents.create(
    model="mistral-medium-2505",
    description="A simple Agent with persistent state.",
    name="Simple Agent"
)
```
When creating an agent, you will receive an Agent object with an agent ID. You can then use that ID to have conversations.

Here is an example of a Web Search Agent using our built-in tool:
```py
websearch_agent = client.beta.agents.create(
    model="mistral-medium-2505",
    description="Agent able to search information over the web, such as news, weather, sport results...",
    name="Websearch Agent",
    instructions="You have the ability to perform web searches with `web_search` to find up-to-date information.",
    tools=[{"type": "web_search"}],
    completion_args={
        "temperature": 0.3,
        "top_p": 0.95,
    }
)
```

You can find more information [here](../connectors/websearch).
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
import { Mistral } from "@mistralai/mistralai";
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

async function main() {
  let websearchAgent = await client.beta.agents.create({
    model: "mistral-medium-latest",
    name: "WebSearch Agent",
    instructions: "Use your websearch abilities when answering requests you don't know.",
    description: "Agent able to fetch new information on the web.",
    tools: [{ type: "web_search" }],
  });
}
```

  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/agents" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "model": "mistral-medium-latest",
     "name": "Simple Agent",
     "description": "A simple Agent with persistent state."
  }'
```

  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
{
  "model": "mistral-medium-2505",
  "name": "Simple Agent",
  "id": "ag_0684fe0e0b98773e8000323fc71a3986",
  "version": 0,
  "created_at": "2025-06-16T09:16:16.726715Z",
  "updated_at": "2025-06-16T09:16:16.726718Z",
  "instructions": null,
  "tools": [],
  "completion_args": {
    "stop": null,
    "presence_penalty": null,
    "frequency_penalty": null,
    "temperature": 0.3,
    "top_p": null,
    "max_tokens": null,
    "random_seed": null,
    "prediction": null,
    "response_format": null,
    "tool_choice": "auto"
  },
  "description": "A simple Agent with persistent state.",
  "handoffs": null,
  "object": "agent"
}
```
</details>

### Updating an Agent

After creation, you can update the Agent with new settings if needed. The arguments are the same as those used when creating an Agent.  
The result is a new `version` of the Agent with the new settings, you can this way have the previous and new versions available.

#### Create a new Version
Create a new `version` of the Agent, will be used by default.
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
simple_agent = client.beta.agents.update(
    agent_id=simple_agent.id, 
    description="An edited simple agent.",
    completion_args={
        "temperature": 0.3,
        "top_p": 0.95,
    }
)
```

  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
websearchAgent = await client.beta.agents.update({
    agentId: websearchAgent.id, 
    agentUpdateRequest: {
        completionArgs: {
            temperature: 0.3,
            topP: 0.95,
        },
        description: "An edited simple agent."
    },
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/agents/<agent_id>" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "completion_args": {
       "temperature": 0.3,
       "top_p": 0.95
     },
     "description": "An edited simple agent."
  }'
```

  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
{
  "model": "mistral-medium-2505",
  "name": "Simple Agent",
  "id": "ag_0684fe0e0b98773e8000323fc71a3986",
  "version": 1,
  "created_at": "2025-06-16T09:16:16.726715Z",
  "updated_at": "2025-06-16T09:17:19.872254Z",
  "instructions": null,
  "tools": [],
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
  "description": "An edited simple agent.",
  "handoffs": null,
  "object": "agent"
}
```
</details>

#### Change Version
Change manually the version of the Agent.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
simple_agent = client.beta.agents.update_version(
    agent_id=simple_agent.id, 
    version=0
)
```

  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
websearchAgent = await client.beta.agents.updateVersion({
    agentId: websearchAgent.id, 
    version: 0
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/agents/<agent_id>/version" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "version": 0
  }'
```

  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
{
  "model": "mistral-medium-2505",
  "name": "Simple Agent",
  "id": "ag_0684fe0e0b98773e8000323fc71a3986",
  "version": 0,
  "created_at": "2025-06-16T09:16:16.726715Z",
  "updated_at": "2025-06-16T09:18:04.624549Z",
  "instructions": null,
  "tools": [],
  "completion_args": {
    "stop": null,
    "presence_penalty": null,
    "frequency_penalty": null,
    "temperature": 0.3,
    "top_p": null,
    "max_tokens": null,
    "random_seed": null,
    "prediction": null,
    "response_format": null,
    "tool_choice": "auto"
  },
  "description": "A simple Agent with persistent state.",
  "handoffs": null,
  "object": "agent"
}
```
</details>

## Conversations

Once your agent is created, you can **start** conversations at any point while keeping the same conversation persistent. You first start a conversation by providing:
- `agent_id`: The ID of the agent, created during the Agent creation.
- `inputs`: The message to start the conversation with. It can be either a string with the first user message or question, or the history of messages.  

Creating a Conversation will return a conversation ID.

To **continue** the conversation and append the exchanges as you go, you provide two values:
- `conversation_id`: The ID created during the conversation start or append that maps to the internally stored conversation history.
- `inputs`: The next message or reply. It can be either a string or a list of messages.  

A new Conversation ID is provided at each append.

You can also **opt out** from the automatic storing with `store=False`; this will make the new history not being stored on our cloud.  

We also provide the parameter `handoff_execution`, which currently has two modes: `server` or `client`.
- `server`: Runs the handoff as expected internally on our cloud servers; this is the default setting.
- `client`: When a handoff is triggered, a response is provided directly to the user, enabling them to handle the handoff with control.  

For more information regarding handoffs visit [this section](../handoffs).

### Starting a Conversation
<Tabs groupId="code">
  <TabItem value="python" label="python" default>
  
```py
response = client.beta.conversations.start(
    agent_id=simple_agent.id,
    inputs="Who is Albert Einstein?",
    #store=False
)
```
or...
```py
response = client.beta.conversations.start(
    agent_id=simple_agent.id,
    inputs=[{"role": "user", "content": "Who is Albert Einstein?"}],
    #store=False
)
```
Both options are equivalent.

Without an Agent, querying Conversations could look like so:
```py
response = client.beta.conversations.start(
    model="mistral-medium-latest",
    inputs=[{"role": "user", "content": "Who is Albert Einstein?"}],
    #store=False
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
let conversation = await client.beta.conversations.start({
      agentId: websearchAgent.id,
      inputs:"Who is Albert Einstein?",
      //store:false
});
```
or...
```typescript
let conversationMultipleEntries = await client.beta.conversations.start({
    agentId: websearchAgent.id,
    inputs:[{role: "user", content:"Who is Albert Einstein?"}],
    //store:false
});
```
Both options are equivalent.

Without an Agent, querying Conversations could look like so:
```typescript
let conversationMultipleEntries = await client.beta.conversations.start({
    model: "mistral-medium-latest",
    inputs:[{role: "user", content:"Who is Albert Einstein?"}],
    //store:false
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
     "inputs": "Who is Albert Einstein?",
     "stream": false,
     "agent_id": "<agent_id>"
  }'
```
or
```bash
curl --location "https://api.mistral.ai/v1/conversations" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "inputs": [
       {
         "role": "user",
         "content": "Who is Albert Einstein?",
         "object": "entry",
         "type": "message.input"
       }
     ],
     "stream": false,
     "agent_id": "<agent_id>"
  }'
```
  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
{
  "conversation_id": "conv_0684fe18cbc57ba6800065acdd2b6c85",
  "outputs": [
    {
      "content": "Albert Einstein was a German-born theoretical physicist who is widely regarded as one of the most influential scientists of the 20th century. He is best known for developing the theory of relativity, which revolutionized our understanding of space, time, and energy. Einstein's work also made significant contributions to the development of quantum mechanics and statistical mechanics.\n\nSome of his most notable achievements include:\n\n1. **Special Theory of Relativity (1905)**: This theory introduced the idea that the laws of physics are the same for all non-accelerating observers and that the speed of light in a vacuum is constant, regardless of the observer's motion.\n\n2. **General Theory of Relativity (1915)**: This theory extended the principles of special relativity to include gravity, describing it as a property of the geometry of space and time.\n\n3. **Mass-Energy Equivalence (E=mc²)**: This famous equation from his special theory of relativity shows that mass and energy are interchangeable.\n\n4. **Photoelectric Effect**: Einstein's explanation of the photoelectric effect, which suggested that light could be described as discrete packets of energy (quanta or photons), was a pivotal step in the development of quantum theory.\n\nEinstein was awarded the Nobel Prize in Physics in 1921 for his explanation of the photoelectric effect. He was also known for his humanitarian efforts and his advocacy for civil rights and peace. Einstein emigrated to the United States in the 1930s to escape the rise of the Nazi regime in Germany and became a professor at the Institute for Advanced Study in Princeton, New Jersey, where he spent the remainder of his career.\n\nEinstein's work continues to influence modern physics and our understanding of the universe. He passed away on April 18, 1955.",
      "object": "entry",
      "type": "message.output",
      "created_at": "2025-06-16T09:19:09.031905Z",
      "completed_at": "2025-06-16T09:19:15.138424Z",
      "id": "msg_0684fe18d08278058000efa70b28fa5a",
      "agent_id": "ag_0684fe0e0b98773e8000323fc71a3986",
      "model": "mistral-medium-2505",
      "role": "assistant"
    }
  ],
  "usage": {
    "prompt_tokens": 8,
    "completion_tokens": 370,
    "total_tokens": 378,
    "connector_tokens": null,
    "connectors": null
  },
  "object": "conversation.response"
}
```
</details>

### Continue a Conversation
You can continue the conversation; the history is stored when using the correct conversation ID.
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py 
response = client.beta.conversations.append(
    conversation_id=response.conversation_id,
    inputs="Translate to French."
)
```

  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
conversation = await client.beta.conversations.append({
    conversationId: conversation.conversationId,
    conversationAppendRequest:
    {
        inputs:[{role: "user", content:"Who is Albert Einstein?"}],
        completionArgs: {
            temperature: 0.3,
            topP: 0.95,
        }
    },
    //store:false
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/conversations/<conv_id>" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "inputs": "Translate to French.",
     "stream": false,
     "store": true,
     "handoff_execution": "server"
  }'
```
  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
{
  "conversation_id": "conv_0684fe18cbc57ba6800065acdd2b6c85",
  "outputs": [
    {
      "content": "Albert Einstein était un physicien théoricien né en Allemagne, largement considéré comme l'un des scientifiques les plus influents du 20ᵉ siècle. Il est surtout connu pour avoir développé la théorie de la relativité, qui a révolutionné notre compréhension de l'espace, du temps et de l'énergie. Les travaux d'Einstein ont également apporté des contributions significatives au développement de la mécanique quantique et de la mécanique statistique.\n\nParmi ses réalisations les plus notables, on peut citer :\n\n1. **Théorie de la relativité restreinte (1905)** : Cette théorie a introduit l'idée que les lois de la physique sont les mêmes pour tous les observateurs non accélérés et que la vitesse de la lumière dans le vide est constante, indépendamment du mouvement de l'observateur.\n\n2. **Théorie de la relativité générale (1915)** : Cette théorie a étendu les principes de la relativité restreinte pour inclure la gravité, la décrivant comme une propriété de la géométrie de l'espace et du temps.\n\n3. **Équivalence masse-énergie (E=mc²)** : Cette équation célèbre de sa théorie de la relativité restreinte montre que la masse et l'énergie sont interchangeables.\n\n4. **Effet photoélectrique** : L'explication d'Einstein de l'effet photoélectrique, qui suggérait que la lumière pouvait être décrite comme des paquets discrets d'énergie (quanta ou photons), a été une étape décisive dans le développement de la théorie quantique.\n\nEinstein a reçu le prix Nobel de physique en 1921 pour son explication de l'effet photoélectrique. Il était également connu pour ses efforts humanitaires et son engagement en faveur des droits civiques et de la paix. Einstein a émigré aux États-Unis dans les années 1930 pour échapper à la montée du régime nazi en Allemagne et est devenu professeur à l'Institut d'études avancées de Princeton, dans le New Jersey, où il a passé le reste de sa carrière.\n\nLes travaux d'Einstein continuent d'influencer la physique moderne et notre compréhension de l'univers. Il est décédé le 18 avril 1955.",
      "object": "entry",
      "type": "message.output",
      "created_at": "2025-06-16T09:19:56.901953Z",
      "completed_at": "2025-06-16T09:20:03.257737Z",
      "id": "msg_0684fe1bce6e72bc8000f89d886633fe",
      "agent_id": "ag_0684fe0e0b98773e8000323fc71a3986",
      "model": "mistral-medium-2505",
      "role": "assistant"
    }
  ],
  "usage": {
    "prompt_tokens": 384,
    "completion_tokens": 471,
    "total_tokens": 855,
    "connector_tokens": null,
    "connectors": null
  },
  "object": "conversation.response"
}
```
</details>

### Retrieve Conversations
You can retrieve conversations; both all available already created and the details of each.

Retrieve conversations available:
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py 
conversations_list = client.beta.conversations.list(
    page=0, page_size=100
)
```

  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
let conversationList = await client.beta.conversations.list({
    page: 0,
    pageSize: 100
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/conversations?page=0&page_size=100" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
[
  {
    "id": "conv_0684fe18cbc57ba6800065acdd2b6c85",
    "created_at": "2025-06-16T09:19:08.735790Z",
    "updated_at": "2025-06-16T09:20:03.273654Z",
    "agent_id": "ag_0684fe0e0b98773e8000323fc71a3986",
    "name": null,
    "description": null,
    "object": "conversation"
  },
  {
    "id": "conv_0684fd306df172f2800051d4f82d4a8b",
    "created_at": "2025-06-16T08:17:10.871401Z",
    "updated_at": "2025-06-16T08:17:10.871402Z",
    "model": "mistral-medium-2505",
    "instructions": "check if it has tool calls",
    "tools": [],
    "completion_args": {
      "stop": null,
      "presence_penalty": null,
      "frequency_penalty": null,
      "temperature": 0.0,
      "top_p": null,
      "max_tokens": 1000,
      "random_seed": null,
      "prediction": null,
      "response_format": null,
      "tool_choice": "auto"
    },
    "name": null,
    "description": null,
    "object": "conversation"
  },
  ...
  {
    "id": "conv_0684fd176fba7a4880001e21144b6a00",
    "created_at": "2025-06-16T08:10:30.983084Z",
    "updated_at": "2025-06-16T08:10:30.983085Z",
    "model": "mistral-medium-2505",
    "instructions": "check if it has tool calls",
    "tools": [],
    "completion_args": {
      "stop": null,
      "presence_penalty": null,
      "frequency_penalty": null,
      "temperature": 0.3,
      "top_p": null,
      "max_tokens": null,
      "random_seed": null,
      "prediction": null,
      "response_format": null,
      "tool_choice": "auto"
    },
    "name": null,
    "description": null,
    "object": "conversation"
  },
  {
    "id": "conv_0684fd151a46729580002ff86353ebcb",
    "created_at": "2025-06-16T08:09:53.642147Z",
    "updated_at": "2025-06-16T08:09:53.642148Z",
    "model": "mistral-medium-2505",
    "instructions": "check if it has tool calls",
    "tools": [],
    "completion_args": {
      "stop": null,
      "presence_penalty": null,
      "frequency_penalty": null,
      "temperature": 0.0,
      "top_p": null,
      "max_tokens": 1000,
      "random_seed": null,
      "prediction": null,
      "response_format": {
        "type": "json_schema",
        "json_schema": null
      },
      "tool_choice": "auto"
    },
    "name": null,
    "description": null,
    "object": "conversation"
  },
  ...
  {
    "id": "conv_0684efea24637995800022373f1405cb",
    "created_at": "2025-06-15T17:10:58.274332Z",
    "updated_at": "2025-06-15T17:10:58.274334Z",
    "agent_id": "ag_0684efea22ed758e80008aae99df024c",
    "name": null,
    "description": null,
    "object": "conversation"
  },
  {
    "id": "conv_0684efe3c5b47aeb80005bbb300bf035",
    "created_at": "2025-06-15T17:09:16.356633Z",
    "updated_at": "2025-06-15T17:09:16.356635Z",
    "agent_id": "ag_0684efe3c42a72a680000054f1de6c9d",
    "name": null,
    "description": null,
    "object": "conversation"
  },
  {
    "id": "conv_0684efe0d72577578000bb81a96730ce",
    "created_at": "2025-06-15T17:08:29.446662Z",
    "updated_at": "2025-06-15T17:08:29.446664Z",
    "agent_id": "ag_0684efe0d5bb780e800001065cfbc60c",
    "name": null,
    "description": null,
    "object": "conversation"
  },
  ...
  {
    "id": "conv_0684efcc3e1975818000c45ea5de559d",
    "created_at": "2025-06-15T17:02:59.881204Z",
    "updated_at": "2025-06-15T17:02:59.881205Z",
    "agent_id": "ag_0684efcc3ccf76078000ac2c6fa89efc",
    "name": null,
    "description": null,
    "object": "conversation"
  },
]
```
</details>


Retrieve details from a specific conversation:
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py 
conversation = client.beta.conversations.get(
    conversation_id=response.conversation_id
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
let conversation = await client.beta.conversations.get({
    conversationId: conversation.conversationId
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/conversations/<conv_id>" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
{
  "id": "conv_0684fe18cbc57ba6800065acdd2b6c85",
  "created_at": "2025-06-16T09:19:08.735790Z",
  "updated_at": "2025-06-16T09:20:03.273654Z",
  "agent_id": "ag_0684fe0e0b98773e8000323fc71a3986",
  "name": null,
  "description": null,
  "object": "conversation"
}
```
</details>

Retrieve entries and history from a specific conversation:
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py 
conversation = client.beta.conversations.get_history(
    conversation_id=response.conversation_id
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
let conversationHistory = await client.beta.conversations.getHistory({
    conversationId: conversation.conversationId
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/conversations/<conv_id>/history" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
{
  "conversation_id": "conv_0684fe18cbc57ba6800065acdd2b6c85",
  "entries": [
    {
      "role": "user",
      "content": "Who is Albert Einstein?",
      "object": "entry",
      "type": "message.input",
      "created_at": "2025-06-16T09:19:08.734315Z",
      "completed_at": null,
      "id": "msg_0684fe18cbbf7c358000e14357aedf41"
    },
    {
      "content": "Albert Einstein was a German-born theoretical physicist who is widely regarded as one of the most influential scientists of the 20th century. He is best known for developing the theory of relativity, which revolutionized our understanding of space, time, and energy. Einstein's work also made significant contributions to the development of quantum mechanics and statistical mechanics.\n\nSome of his most notable achievements include:\n\n1. **Special Theory of Relativity (1905)**: This theory introduced the idea that the laws of physics are the same for all non-accelerating observers and that the speed of light in a vacuum is constant, regardless of the observer's motion.\n\n2. **General Theory of Relativity (1915)**: This theory extended the principles of special relativity to include gravity, describing it as a property of the geometry of space and time.\n\n3. **Mass-Energy Equivalence (E=mc²)**: This famous equation from his special theory of relativity shows that mass and energy are interchangeable.\n\n4. **Photoelectric Effect**: Einstein's explanation of the photoelectric effect, which suggested that light could be described as discrete packets of energy (quanta or photons), was a pivotal step in the development of quantum theory.\n\nEinstein was awarded the Nobel Prize in Physics in 1921 for his explanation of the photoelectric effect. He was also known for his humanitarian efforts and his advocacy for civil rights and peace. Einstein emigrated to the United States in the 1930s to escape the rise of the Nazi regime in Germany and became a professor at the Institute for Advanced Study in Princeton, New Jersey, where he spent the remainder of his career.\n\nEinstein's work continues to influence modern physics and our understanding of the universe. He passed away on April 18, 1955.",
      "object": "entry",
      "type": "message.output",
      "created_at": "2025-06-16T09:19:09.031905Z",
      "completed_at": null,
      "id": "msg_0684fe18d08278058000efa70b28fa5a",
      "agent_id": "ag_0684fe0e0b98773e8000323fc71a3986",
      "model": "mistral-medium-2505",
      "role": "assistant"
    },
    {
      "role": "user",
      "content": "Translate to French.",
      "object": "entry",
      "type": "message.input",
      "created_at": "2025-06-16T09:19:56.563908Z",
      "completed_at": null,
      "id": "msg_0684fe1bc9057cbe8000753468b64f7d"
    },
    {
      "content": "Albert Einstein était un physicien théoricien né en Allemagne, largement considéré comme l'un des scientifiques les plus influents du 20ᵉ siècle. Il est surtout connu pour avoir développé la théorie de la relativité, qui a révolutionné notre compréhension de l'espace, du temps et de l'énergie. Les travaux d'Einstein ont également apporté des contributions significatives au développement de la mécanique quantique et de la mécanique statistique.\n\nParmi ses réalisations les plus notables, on peut citer :\n\n1. **Théorie de la relativité restreinte (1905)** : Cette théorie a introduit l'idée que les lois de la physique sont les mêmes pour tous les observateurs non accélérés et que la vitesse de la lumière dans le vide est constante, indépendamment du mouvement de l'observateur.\n\n2. **Théorie de la relativité générale (1915)** : Cette théorie a étendu les principes de la relativité restreinte pour inclure la gravité, la décrivant comme une propriété de la géométrie de l'espace et du temps.\n\n3. **Équivalence masse-énergie (E=mc²)** : Cette équation célèbre de sa théorie de la relativité restreinte montre que la masse et l'énergie sont interchangeables.\n\n4. **Effet photoélectrique** : L'explication d'Einstein de l'effet photoélectrique, qui suggérait que la lumière pouvait être décrite comme des paquets discrets d'énergie (quanta ou photons), a été une étape décisive dans le développement de la théorie quantique.\n\nEinstein a reçu le prix Nobel de physique en 1921 pour son explication de l'effet photoélectrique. Il était également connu pour ses efforts humanitaires et son engagement en faveur des droits civiques et de la paix. Einstein a émigré aux États-Unis dans les années 1930 pour échapper à la montée du régime nazi en Allemagne et est devenu professeur à l'Institut d'études avancées de Princeton, dans le New Jersey, où il a passé le reste de sa carrière.\n\nLes travaux d'Einstein continuent d'influencer la physique moderne et notre compréhension de l'univers. Il est décédé le 18 avril 1955.",
      "object": "entry",
      "type": "message.output",
      "created_at": "2025-06-16T09:19:56.901953Z",
      "completed_at": null,
      "id": "msg_0684fe1bce6e72bc8000f89d886633fe",
      "agent_id": "ag_0684fe0e0b98773e8000323fc71a3986",
      "model": "mistral-medium-2505",
      "role": "assistant"
    }
  ],
  "object": "conversation.history"
}
```
</details>

Retrieve all messages from a specific conversation:
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py 
conversation = client.beta.conversations.get_messages(
    conversation_id=response.conversation_id
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
let conversationMessages = await client.beta.conversations.getMessages({
    conversationId: conversation.conversationId,
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/conversations/<conv_id>/messages" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY"
```

  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
{
  "conversation_id": "conv_0684fe18cbc57ba6800065acdd2b6c85",
  "messages": [
    {
      "role": "user",
      "content": "Who is Albert Einstein?",
      "object": "entry",
      "type": "message.input",
      "created_at": "2025-06-16T09:19:08.734315Z",
      "completed_at": null,
      "id": "msg_0684fe18cbbf7c358000e14357aedf41"
    },
    {
      "content": "Albert Einstein was a German-born theoretical physicist who is widely regarded as one of the most influential scientists of the 20th century. He is best known for developing the theory of relativity, which revolutionized our understanding of space, time, and energy. Einstein's work also made significant contributions to the development of quantum mechanics and statistical mechanics.\n\nSome of his most notable achievements include:\n\n1. **Special Theory of Relativity (1905)**: This theory introduced the idea that the laws of physics are the same for all non-accelerating observers and that the speed of light in a vacuum is constant, regardless of the observer's motion.\n\n2. **General Theory of Relativity (1915)**: This theory extended the principles of special relativity to include gravity, describing it as a property of the geometry of space and time.\n\n3. **Mass-Energy Equivalence (E=mc²)**: This famous equation from his special theory of relativity shows that mass and energy are interchangeable.\n\n4. **Photoelectric Effect**: Einstein's explanation of the photoelectric effect, which suggested that light could be described as discrete packets of energy (quanta or photons), was a pivotal step in the development of quantum theory.\n\nEinstein was awarded the Nobel Prize in Physics in 1921 for his explanation of the photoelectric effect. He was also known for his humanitarian efforts and his advocacy for civil rights and peace. Einstein emigrated to the United States in the 1930s to escape the rise of the Nazi regime in Germany and became a professor at the Institute for Advanced Study in Princeton, New Jersey, where he spent the remainder of his career.\n\nEinstein's work continues to influence modern physics and our understanding of the universe. He passed away on April 18, 1955.",
      "object": "entry",
      "type": "message.output",
      "created_at": "2025-06-16T09:19:09.031905Z",
      "completed_at": null,
      "id": "msg_0684fe18d08278058000efa70b28fa5a",
      "agent_id": "ag_0684fe0e0b98773e8000323fc71a3986",
      "model": "mistral-medium-2505",
      "role": "assistant"
    },
    {
      "role": "user",
      "content": "Translate to French.",
      "object": "entry",
      "type": "message.input",
      "created_at": "2025-06-16T09:19:56.563908Z",
      "completed_at": null,
      "id": "msg_0684fe1bc9057cbe8000753468b64f7d"
    },
    {
      "content": "Albert Einstein était un physicien théoricien né en Allemagne, largement considéré comme l'un des scientifiques les plus influents du 20ᵉ siècle. Il est surtout connu pour avoir développé la théorie de la relativité, qui a révolutionné notre compréhension de l'espace, du temps et de l'énergie. Les travaux d'Einstein ont également apporté des contributions significatives au développement de la mécanique quantique et de la mécanique statistique.\n\nParmi ses réalisations les plus notables, on peut citer :\n\n1. **Théorie de la relativité restreinte (1905)** : Cette théorie a introduit l'idée que les lois de la physique sont les mêmes pour tous les observateurs non accélérés et que la vitesse de la lumière dans le vide est constante, indépendamment du mouvement de l'observateur.\n\n2. **Théorie de la relativité générale (1915)** : Cette théorie a étendu les principes de la relativité restreinte pour inclure la gravité, la décrivant comme une propriété de la géométrie de l'espace et du temps.\n\n3. **Équivalence masse-énergie (E=mc²)** : Cette équation célèbre de sa théorie de la relativité restreinte montre que la masse et l'énergie sont interchangeables.\n\n4. **Effet photoélectrique** : L'explication d'Einstein de l'effet photoélectrique, qui suggérait que la lumière pouvait être décrite comme des paquets discrets d'énergie (quanta ou photons), a été une étape décisive dans le développement de la théorie quantique.\n\nEinstein a reçu le prix Nobel de physique en 1921 pour son explication de l'effet photoélectrique. Il était également connu pour ses efforts humanitaires et son engagement en faveur des droits civiques et de la paix. Einstein a émigré aux États-Unis dans les années 1930 pour échapper à la montée du régime nazi en Allemagne et est devenu professeur à l'Institut d'études avancées de Princeton, dans le New Jersey, où il a passé le reste de sa carrière.\n\nLes travaux d'Einstein continuent d'influencer la physique moderne et notre compréhension de l'univers. Il est décédé le 18 avril 1955.",
      "object": "entry",
      "type": "message.output",
      "created_at": "2025-06-16T09:19:56.901953Z",
      "completed_at": null,
      "id": "msg_0684fe1bce6e72bc8000f89d886633fe",
      "agent_id": "ag_0684fe0e0b98773e8000323fc71a3986",
      "model": "mistral-medium-2505",
      "role": "assistant"
    }
  ],
  "object": "conversation.messages"
}
```
</details>

### Restart Conversation

You can continue a conversation from any given entry from the history of entries:
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py 
conversation = client.beta.conversations.restart(
    conversation_id=response.conversation_id,
    from_entry_id="msg_0684fe18d08278058000efa70b28fa5a",
    inputs="Translate to Portuguese."
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

```typescript
let newConversation = await client.beta.conversations.restart({
    conversationId: conversation.conversationId,
    conversationRestartRequest: {
        inputs: "Translate to portuguese.",
        fromEntryId: conversationMessages.messages[conversationMessages.messages.length - 1 ].id?.toString() || ''
    }
});
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/conversations/<conv_id>/restart" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "from_entry_id": "<entry_id>",
     "inputs": "Translate to Portuguese.",
     "stream": false,
     "store": true,
     "handoff_execution": "server"
  }'
```
  </TabItem>
</Tabs>

<details>
    <summary><b>JSON Output</b></summary>

```json
{
  "conversation_id": "conv_0684fe409c757d4580000514e0c851ad",
  "outputs": [
    {
      "content": "Claro! Aqui está a tradução para o português:\n\n---\n\nAlbert Einstein foi um físico teórico nascido na Alemanha, amplamente considerado um dos cientistas mais influentes do século XX. Ele é mais conhecido por desenvolver a teoria da relatividade, que revolucionou nossa compreensão do espaço, tempo e energia. O trabalho de Einstein também contribuiu significativamente para o desenvolvimento da mecânica quântica e da mecânica estatística.\n\nAlgumas de suas realizações mais notáveis incluem:\n\n1. **Teoria da Relatividade Especial (1905)**: Esta teoria introduziu a ideia de que as leis da física são as mesmas para todos os observadores não acelerados e que a velocidade da luz no vácuo é constante, independentemente do movimento do observador.\n\n2. **Teoria da Relatividade Geral (1915)**: Esta teoria estendeu os princípios da relatividade especial para incluir a gravidade, descrevendo-a como uma propriedade da geometria do espaço e do tempo.\n\n3. **Equivalência Massa-Energia (E=mc²)**: Esta famosa equação de sua teoria da relatividade especial mostra que massa e energia são intercambiáveis.\n\n4. **Efeito Fotoelétrico**: A explicação de Einstein para o efeito fotoelétrico, que sugeria que a luz poderia ser descrita como pacotes discretos de energia (quanta ou fótons), foi um passo crucial no desenvolvimento da teoria quântica.\n\nEinstein foi agraciado com o Prêmio Nobel de Física em 1921 por sua explicação do efeito fotoelétrico. Ele também era conhecido por seus esforços humanitários e por sua defesa dos direitos civis e da paz. Einstein emigrou para os Estados Unidos na década de 1930 para escapar do regime nazista na Alemanha e tornou-se professor no Instituto de Estudos Avançados em Princeton, Nova Jersey, onde passou o restante de sua carreira.\n\nO trabalho de Einstein continua a influenciar a física moderna e nossa compreensão do universo. Ele faleceu em 18 de abril de 1955.\n\n---\n\nSe precisar de mais alguma coisa, é só avisar!",
      "object": "entry",
      "type": "message.output",
      "created_at": "2025-06-16T09:29:45.954701Z",
      "completed_at": "2025-06-16T09:29:56.369588Z",
      "id": "msg_0684fe409f46733d8000e40522f8ceea",
      "agent_id": "ag_0684fe0e0b98773e8000323fc71a3986",
      "model": "mistral-medium-2505",
      "role": "assistant"
    }
  ],
  "usage": {
    "prompt_tokens": 384,
    "completion_tokens": 461,
    "total_tokens": 845,
    "connector_tokens": null,
    "connectors": null
  },
  "object": "conversation.response"
}
```
</details>

**Note**: You can only restart conversations on which you used the `append()` method at least once.

### Streaming Output
You can also stream the outputs, both when starting a conversation, continuing or restarting a previous one.
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

#### Start
```py
response = client.beta.conversations.start_stream(
    agent_id=websearch_agent.id,
    inputs="Who is Albert Einstein?"
)
```
#### Continue
```py
response = client.beta.conversations.append_stream(
    conversation_id=response.conversation_id,
    inputs="Translate to French."
)
```
#### Restart
```py
response = client.beta.conversations.restart_stream(
    conversation_id=response.conversation_id,
    from_entry_id="msg_0684fe18d08278058000efa70b28fa5a",
    inputs="Translate to Portuguese."
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">

#### Start
```typescript
let stream = await client.beta.conversations.startStream({
    agentId: websearchAgent.id,
    inputs: "Who is albert Enstein?"
});
```
#### Continue
```typescript
let stream = await client.beta.conversations.appendStream({
    conversationId: conversation.conversationId,
    conversationAppendStreamRequest: {
        inputs: "Who is albert Enstein?"
    }
});
```
#### Restart
```typescript
let stream = await client.beta.conversations.restartStream({
    conversationId: conversation.conversationId,
    conversationRestartStreamRequest: {
        fromEntryId: conversationMessages.messages[conversationMessages.messages.length - 1 ].id?.toString() || '',
        inputs: "Who is albert Enstein?"
    }
});
```

For each streaming operation, you should use the following snippet of code:
```typescript
for await (const chunk of stream) {
    // The operation you want to make. In this example, we only choose to display each incoming streamed object.
    console.log(chunk);
}
```
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/conversations" \
     --header 'Content-Type: application/json' \
     --header 'Accept: text/event-stream' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "inputs": "Who is Albert Einstein?",
     "stream": true,
     "agent_id": "ag_06811008e6e07cb48000fd3f133e1771"
  }'
```
  </TabItem>
</Tabs>

When streaming, you will have specific indexes for specific content types during a stream. These include:
- `conversation.response.started`: The start of a conversation response.
- `conversation.response.done`: The response is done and finished.
- `conversation.response.error`: An error occurred.
- `message.output.delta`: Chunk of content, usually tokens corresponding to the model reply.
- `tool.execution.started`: A tool execution has started.
- `tool.execution.done`: A tool has finished executing.
- `agent.handoff.started`: The handoff to a different agent has started.
- `agent.handoff.done`: The handoff was concluded.
- `function.call.delta`: Chunk of content, usually tokens corresponding to the function tool call.

<details>
    <summary><b>Example</b></summary>

```
event: conversation.response.started
data: {"type":"conversation.response.started","conversation_id":"conv_067f2a98c1a773678000ce73a36b785a"}

event: tool.execution.started
data: {"type":"tool.execution.started","output_index":0,"id":"tool_exec_067f2a98ca357c8b8000ea212104b290","name":"web_search"}

event: tool.execution.done
data: {"type":"tool.execution.done","output_index":0,"id":"tool_exec_067f2a98ca357c8b8000ea212104b290","name":"web_search"}

event: message.output.delta
data: {"type":"message.output.delta","output_index":1,"id":"msg_067f2a9925d674ea8000e63c68ae0474","content_index":0,"model":"mistral-medium-2505","agent_id":"ag_067f2a39ddd67bf68000fa921bc0c25d","role":"assistant","content":"The"}

event: message.output.delta
data: {"type":"message.output.delta","output_index":1,"id":"msg_067f2a9925d674ea8000e63c68ae0474","content_index":0,"model":"mistral-medium-2505","agent_id":"ag_067f2a39ddd67bf68000fa921bc0c25d","role":"assistant","content":" last"}

event: message.output.delta
data: {"type":"message.output.delta","output_index":1,"id":"msg_067f2a9925d674ea8000e63c68ae0474","content_index":0,"model":"mistral-medium-2505","agent_id":"ag_067f2a39ddd67bf68000fa921bc0c25d","role":"assistant","content":" European"}

event: message.output.delta
data: {"type":"message.output.delta","output_index":1,"id":"msg_067f2a9925d674ea8000e63c68ae0474","content_index":0,"model":"mistral-medium-2505","agent_id":"ag_067f2a39ddd67bf68000fa921bc0c25d","role":"assistant","content":" Football"}

...

event: message.output.delta
data: {"type":"message.output.delta","output_index":1,"id":"msg_067f2a9925d674ea8000e63c68ae0474","content_index":2,"model":"mistral-medium-2505","agent_id":"ag_067f2a39ddd67bf68000fa921bc0c25d","role":"assistant","content":" tournament"}

event: message.output.delta
data: {"type":"message.output.delta","output_index":1,"id":"msg_067f2a9925d674ea8000e63c68ae0474","content_index":2,"model":"mistral-medium-2505","agent_id":"ag_067f2a39ddd67bf68000fa921bc0c25d","role":"assistant","content":"."}

event: conversation.response.done
data: {"type":"conversation.response.done","usage":{"prompt_tokens":18709,"total_tokens":18892,"completion_tokens":183}}
```
</details>