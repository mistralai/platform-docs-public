---
id: agents_basics
title: Agents Basics
slug: agents_basics
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Objects

We introduce three new main objects that our API makes use of:
- `Agents` → A set of pre-selected values to augment model abilities, such as tools, instructions, and completion parameters.
- `Conversation` → A history of interactions and past events with an assistant, such as messages and tool executions.
- `Entry` → An action that can be created by the user or an assistant. It brings a more flexible and expressive representation of interactions between a user and one or multiple assistants. This allows for more control over describing events.

**You can also leverage all the features of Agents and Conversations without the need to create an Agent. This means you can query our API without creating an Agent, from using the built-in Conversations features to the built-in Connectors.**

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
<details>
    <summary><b>Output</b></summary>
```
model='mistral-medium-2505' name='Simple Agent' description='A simple Agent with persistent state.' id='ag_0680b7000e847f6e80003620e5d4d99d' version=0 created_at=datetime.datetime(2025, 4, 25, 11, 20, 32, 909511, tzinfo=TzInfo(UTC)) updated_at=datetime.datetime(2025, 4, 25, 11, 20, 32, 909514, tzinfo=TzInfo(UTC)) instructions=None tools=[] completion_args=CompletionArgs(stop=None, presence_penalty=None, frequency_penalty=None, temperature=0.3, top_p=None, max_tokens=None, random_seed=None, prediction=None, response_format=None) handoffs=None object='agent'
```
</details>

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
<details>
    <summary><b>Output</b></summary>
```
model='mistral-medium-2505' name='Websearch Agent' description='Agent able to search information over the web, such as news, weather, sport results...' id='ag_0680b6e9b7b376bb80003b6f244c84bd' version=0 created_at=datetime.datetime(2025, 4, 25, 11, 14, 35, 483085, tzinfo=TzInfo(UTC)) updated_at=datetime.datetime(2025, 4, 25, 11, 14, 35, 483087, tzinfo=TzInfo(UTC)) instructions='You have the ability to perform web searches with `web_search` to find up-to-date information.' tools=[WebSearchTool(type='web_search')] completion_args=CompletionArgs(stop=None, presence_penalty=None, frequency_penalty=None, temperature=0.3, top_p=0.95, max_tokens=None, random_seed=None, prediction=None, response_format=None) handoffs=None object='agent'
```
You can find more information [here](../connectors/websearch).
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
     "model": "mistral-medium-latest",
     "name": "Simple Agent",
     "description": "A simple Agent with persistent state."
  }'
```

  </TabItem>
</Tabs>

### Updating an Agent

After creation, you can update the Agent with new settings if needed. The arguments are the same as those used when creating an Agent.  
The result is a new Agent with the new settings, you can this way have the previous and new versions available.
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
  *Coming soon...*
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

## Conversations

Once your agent is created, you can have conversations at any point while keeping the same conversation persistent. You first start a conversation by providing:
- `agent_id`: The ID of the agent, created during the Agent creation.
- `inputs`: The message to start the conversation with. It can be either a string with the first user message or question, or a list of messages.

Creating a Conversation will return a conversation ID.

To continue the conversation and append the exchanges as you go, you provide two values:
- `conversation_id`: The ID created during the conversation start or append that maps to the internally stored conversation history.
- `inputs`: The next message or reply. It can be either a string or a list of messages.

A new Conversation ID is provided at each append.

You can also opt out from the automatic storing with `store=False`; this will make the new history not being stored on our cloud.  

We also provide the parameter `handoff_execution`, which currently has two modes: `server` or `client`.
- `server`: Runs the handoff as expected internally on our cloud servers; this is the default setting.
- `client`: When a handoff is triggered, a response is provided directly to the user, enabling them to handle the handoff with control.
For more information regarding handoffs visit [this section](../handoffs).

### Starting a Conversation
<Tabs groupId="code">
  <TabItem value="python" label="python" default>
  
```py
response = client.beta.conversations.start(
    agent_id=simple_agent.id, inputs="Who is Albert Einstein?", #store=False
)
```
or...
```py
response = client.beta.conversations.start(
    agent_id=simple_agent.id, inputs=[{"role": "user", "content": "Who is Albert Einstein?"}], #store=False
)
```
Both options are equivalent.

Without an Agent, querying Conversations could look like so:
```py
response = client.beta.conversations.start(
    model="mistral-medium-latest", inputs=[{"role": "user", "content": "Who is Albert Einstein?"}], tools=[], #store=False
)
```
<details>
    <summary><b>Output</b></summary>
```
conversation_id='conv_0680b7001110794a8000568d65fd125d' outputs=[MessageOutputEntry(content='Albert Einstein (14 March 1879 – 18 April 1955) was a theoretical physicist whose contributions transformed the framework of physics and have had a profound impact on the philosophical and cultural landscape of the modern world. Here are some key points about him:\n\n### Early Life and Education\n- **Birth and Early Education**: Einstein was born in Ulm, in the Kingdom of Württemberg in the German Empire. He showed an early aptitude for mathematics and physics.\n- **Educational Journey**: He initially struggled with the rigid educational system in Germany but excelled in mathematics and physics. He later attended the Swiss Federal Polytechnic (now ETH Zurich) in Zurich, where he graduated in 1900.\n\n### Scientific Contributions\n- **1905, The "Miracle Year"**: Einstein published four groundbreaking papers in 1905, which revolutionized physics:\n  - **Photoelectric Effect**: Explained using the concept of light quanta (photons), for which he received the Nobel Prize in Physics in 1921.\n  - **Brownian Motion**: Provided evidence for the atomic nature of matter.\n  - **Special Theory of Relativity**: Introduced the famous equation E=mc², showing the equivalence of mass and energy.\n  - **Mass-Energy Equivalence**: Established the relationship between mass and energy.\n\n- **General Theory of Relativity (1915)**: Extended the principles of special relativity to include gravity, describing it as the curvature of spacetime caused by mass and energy.\n\n### Later Life and Influence\n- **Public Intellectual**: Einstein became a public figure and was known for his pacifism and humanitarian efforts. He was also a strong advocate for a world government and nuclear disarmament.\n- **Emigration to the United States**: In 1933, Einstein emigrated to the United States due to the rise of Nazism in Germany. He settled in Princeton, New Jersey, where he worked at the Institute for Advanced Study until his retirement.\n- **Legacy**: Einstein\'s work continues to influence modern physics, and he is often regarded as one of the greatest scientists of all time.\n\n### Personal Life\n- **Family**: Einstein was married twice. His first marriage to Mileva Marić produced three children, though his daughter Lieserl\'s fate is uncertain. His second marriage to his cousin Elsa Einstein lasted until her death in 1936.\n- **Personality**: Known for his wit, humility, and deep humanitarian concerns, Einstein was also an accomplished musician, playing the violin.\n\nAlbert Einstein\'s contributions to science and his impact on society make him one of the most celebrated figures in the history of science.', object='entry', type='message.output', created_at=datetime.datetime(2025, 4, 25, 11, 20, 33, 177081, tzinfo=TzInfo(UTC)), completed_at=datetime.datetime(2025, 4, 25, 11, 20, 44, 974910, tzinfo=TzInfo(UTC)), id='msg_0680b70012d5722480007a3628df8fc7', agent_id='ag_0680b7000e847f6e80003620e5d4d99d', model='mistral-medium-2505', role='assistant')] usage=ConversationUsageInfo(prompt_tokens=8, total_tokens=637, completion_tokens=629, connectors=Unset()) object='conversation.response'
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

### Continue a Conversation
You can continue the conversation; the history is stored when using the correct conversation ID.
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py 
response = client.beta.conversations.append(
    conversation_id=response.conversation_id, inputs="Translate to French."
)
```
<details>
    <summary><b>Output</b></summary>
```
conversation_id='conv_0680b7001110794a8000568d65fd125d' outputs=[MessageOutputEntry(content='Here is the translation of the information about Albert Einstein into French:\n\n### Vie précoce et éducation\n- **Naissance et éducation précoce**: Albert Einstein est né le 14 mars 1879 à Ulm, dans le Royaume de Wurtemberg, dans l\'Empire allemand. Il a montré très tôt une aptitude pour les mathématiques et la physique.\n- **Parcours éducatif**: Il a d\'abord eu du mal avec le système éducatif rigide en Allemagne, mais a excellé en mathématiques et en physique. Il a ensuite fréquenté l\'École polytechnique fédérale (aujourd\'hui ETH Zurich) à Zurich, où il a obtenu son diplôme en 1900.\n\n### Contributions scientifiques\n- **1905, l\'"Année miraculeuse"**: Einstein a publié quatre articles révolutionnaires en 1905, qui ont transformé la physique:\n  - **Effet photoélectrique**: Expliqué en utilisant le concept de quanta de lumière (photons), pour lequel il a reçu le prix Nobel de physique en 1921.\n  - **Mouvement brownien**: Fourni des preuves de la nature atomique de la matière.\n  - **Théorie de la relativité restreinte**: A introduit la célèbre équation E=mc², montrant l\'équivalence entre la masse et l\'énergie.\n  - **Équivalence masse-énergie**: A établi la relation entre la masse et l\'énergie.\n\n- **Théorie de la relativité générale (1915)**: A étendu les principes de la relativité restreinte pour inclure la gravité, la décrivant comme la courbure de l\'espace-temps causée par la masse et l\'énergie.\n\n### Vie ultérieure et influence\n- **Intellectuel public**: Einstein est devenu une figure publique et était connu pour son pacifisme et ses efforts humanitaires. Il était également un ardent défenseur d\'un gouvernement mondial et du désarmement nucléaire.\n- **Émigration aux États-Unis**: En 1933, Einstein a émigré aux États-Unis en raison de la montée du nazisme en Allemagne. Il s\'est installé à Princeton, dans le New Jersey, où il a travaillé à l\'Institute for Advanced Study jusqu\'à sa retraite.\n- **Héritage**: Le travail d\'Einstein continue d\'influencer la physique moderne, et il est souvent considéré comme l\'un des plus grands scientifiques de tous les temps.\n\n### Vie personnelle\n- **Famille**: Einstein a été marié deux fois. Son premier mariage avec Mileva Marić a donné naissance à trois enfants, bien que le sort de sa fille Lieserl soit incertain. Son second mariage avec sa cousine Elsa Einstein a duré jusqu\'à sa mort en 1936.\n- **Personnalité**: Connu pour son esprit, son humilité et ses profondes préoccupations humanitaires, Einstein était également un musicien accompli, jouant du violon.\n\nLes contributions d\'Albert Einstein à la science et son impact sur la société en font l\'une des figures les plus célébrées de l\'histoire des sciences.', object='entry', type='message.output', created_at=datetime.datetime(2025, 4, 25, 11, 20, 45, 354255, tzinfo=TzInfo(UTC)), completed_at=datetime.datetime(2025, 4, 25, 11, 21, 1, 334182, tzinfo=TzInfo(UTC)), id='msg_0680b700d5aa7d8d8000d565b4d34423', agent_id='ag_0680b7000e847f6e80003620e5d4d99d', model='mistral-medium-2505', role='assistant')] usage=ConversationUsageInfo(prompt_tokens=644, total_tokens=1488, completion_tokens=844, connectors=Unset()) object='conversation.response'
```
</details>

  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Coming soon...*
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

### Streaming Output
You can also stream the outputs, both when starting a conversation or continuing a previous one.
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

#### Start
```py
response = client.beta.conversations.start_stream(
    agent_id=websearch_agent.id, inputs="Who is Albert Einstein?"
)
```
#### Continue
```py
response = client.beta.conversations.append_stream(
    conversation_id=response.conversation_id, inputs="Translate to French."
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Coming soon...*
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