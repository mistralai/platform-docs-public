---
id: websearch
title: Websearch
slug: websearch
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/websearch_connector.png"
    alt="websearch_graph"
    width="400"
    style={{ borderRadius: '15px' }}
  />
</div>

Websearch is the capability to browse the web in search of information, this tool does not only fix the limitations of models of not being up to date due to their training data, but also allows them to actually retrieve recent information or access specific websites.

Our built-in [connector](../connectors) tool for websearch allows any of our models to access the web at any point to search websites and sources for relevant information to answer the given query, but also open provided URLs from the user.

There are two versions:
- `web_search`: A simple web search tool that enables access to a search engine.
- `web_search_premium`: A more complex web search tool that enables access to both a search engine and two news agencies: AFP and AP.

## Create a Websearch Agent
You can create an agent with access to websearch by providing it as one of the tools.  
Note that you can still add more tools to the agent, the model is free to search the web or not on demand.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

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
model='mistral-medium-2505' name='Websearch Agent' description='Agent able to search information over the web, such as news, weather, sport results...' id='ag_06835b734cc47dec8000b5f8f860b672' version=0 created_at=datetime.datetime(2025, 5, 27, 12, 59, 32, 803403, tzinfo=TzInfo(UTC)) updated_at=datetime.datetime(2025, 5, 27, 12, 59, 32, 803405, tzinfo=TzInfo(UTC)) instructions='You have the ability to perform web searches with `web_search` to find up-to-date information.' tools=[WebSearchTool(type='web_search')] completion_args=CompletionArgs(stop=None, presence_penalty=None, frequency_penalty=None, temperature=0.3, top_p=0.95, max_tokens=None, random_seed=None, prediction=None, response_format=None, tool_choice='auto') handoffs=None object='agent'
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
     "name": "Websearch Agent",
     "description": "Agent able to search information over the web, such as news, weather, sport results...",
     "instructions": "You have the ability to perform web searches with `web_search` to find up-to-date information.",
     "tools": [
       {
         "type": "web_search"
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

As for other agents, when creating one you will receive an agent id corresponding to the created agent that you can use to start a conversation.

## How it works
Now that we have our websearch agent ready, we can at any point make use of it to ask it questions about recent events.

### Conversations with Websearch

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
response = client.beta.conversations.start(
    agent_id=websearch_agent.id, inputs="Who won the last European Football cup?"
)
```

<details>
    <summary><b>Output</b></summary>

```
conversation_id='conv_06835b734f2776bb80008fa7a309bf5a' outputs=[ToolExecutionEntry(name='web_search', object='entry', type='tool.execution', created_at=datetime.datetime(2025, 5, 27, 12, 59, 33, 171501, tzinfo=TzInfo(UTC)), completed_at=datetime.datetime(2025, 5, 27, 12, 59, 34, 828228, tzinfo=TzInfo(UTC)), id='tool_exec_06835b7352be74d38000b3523a0cce2e', info={}), MessageOutputEntry(content=[TextChunk(text='The last winner of the European Football Cup was Spain, who won the UEFA Euro 2024 by defeating England 2-1 in the final', type='text'), ToolReferenceChunk(tool='web_search', title='UEFA Euro Winners List from 1960 to today - MARCA in English', type='tool_reference', url='https://www.marca.com/en/football/uefa-euro/winners.html', source='brave'), ToolReferenceChunk(tool='web_search', title='UEFA Euro winners: Know the champions - full list', type='tool_reference', url='https://www.olympics.com/en/news/uefa-european-championships-euro-winners-list-champions', source='brave'), ToolReferenceChunk(tool='web_search', title='Full list of UEFA European Championship winners', type='tool_reference', url='https://www.givemesport.com/football-european-championship-winners/', source='brave'), TextChunk(text='.', type='text')], object='entry', type='message.output', created_at=datetime.datetime(2025, 5, 27, 12, 59, 35, 457474, tzinfo=TzInfo(UTC)), completed_at=datetime.datetime(2025, 5, 27, 12, 59, 36, 156233, tzinfo=TzInfo(UTC)), id='msg_06835b7377517a3680009b05207112ce', agent_id='ag_06835b734cc47dec8000b5f8f860b672', model='mistral-medium-2505', role='assistant')] usage=ConversationUsageInfo(prompt_tokens=188, completion_tokens=55, total_tokens=7355, connector_tokens=7112, connectors={'web_search': 1}) object='conversation.response'
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
     "inputs": "Who won the last European Football cup?",
     "stream": false,
     "agent_id": "<agent_id>"
  }'
```
  </TabItem>
</Tabs>

For explanation purposes, lets restructure the previous output in a more readable JSON format.

```json
{
  "conversation_id": "conv_06835b734f2776bb80008fa7a309bf5a",
  "outputs": [
    {
      "type": "tool.execution",
      "name": "web_search",
      "object": "entry",
      "created_at": "2025-05-27T12:59:33.171501Z",
      "completed_at": "2025-05-27T12:59:34.828228Z",
      "id": "tool_exec_06835b7352be74d38000b3523a0cce2e"
    },
    {
      "type": "message.output",
      "content": [
        {
          "type": "text",
          "text": "The last winner of the European Football Cup was Spain, who won the UEFA Euro 2024 by defeating England 2-1 in the final"
        },
        {
          "type": "tool_reference",
          "tool": "web_search",
          "title": "UEFA Euro Winners List from 1960 to today - MARCA in English",
          "url": "https://www.marca.com/en/football/uefa-euro/winners.html",
          "source": "brave"
        },
        {
          "type": "tool_reference",
          "tool": "web_search",
          "title": "UEFA Euro winners: Know the champions - full list",
          "url": "https://www.olympics.com/en/news/uefa-european-championships-euro-winners-list-champions",
          "source": "brave"
        },
        {
          "type": "tool_reference",
          "tool": "web_search",
          "title": "Full list of UEFA European Championship winners",
          "url": "https://www.givemesport.com/football-european-championship-winners/",
          "source": "brave"
        },
        {
          "type": "text",
          "text": "."
        }
      ],
      "object": "entry",
      "created_at": "2025-05-27T12:59:35.457474Z",
      "completed_at": "2025-05-27T12:59:36.156233Z",
      "id": "msg_06835b7377517a3680009b05207112ce",
      "agent_id": "ag_06835b734cc47dec8000b5f8f860b672",
      "model": "mistral-medium-2505",
      "role": "assistant"
    }
  ],
  "usage": {
    "prompt_tokens": 188,
    "completion_tokens": 55,
    "total_tokens": 7355,
    "connector_tokens": 7112,
    "connectors": {
      "web_search": 1
    }
  },
  "object": "conversation.response"
}
```

### Explanation of the Outputs

- **`tool.execution`**: This entry corresponds to the execution of the web search tool. It includes metadata about the execution, such as:
  - `name`: The name of the tool, which in this case is `web_search`.
  - `object`: The type of object, which is `entry`.
  - `type`: The type of entry, which is `tool.execution`.
  - `created_at` and `completed_at`: Timestamps indicating when the tool execution started and finished.
  - `id`: A unique identifier for the tool execution.

- **`message.output`**: This entry corresponds to the generated answer from our agent. It includes metadata about the message, such as:
  - `content`: The actual content of the message, which in this case is a list of chunks. These chunks correspond to the text chunks, the actual message response of the model, interleaved with reference chunks. These reference chunks are used for citations during Retrieval-Augmented Generation (RAG) related tool usages. In this case, it provides the source of the information it just answered with, which is extremely useful for web search. This allows for transparent feedback on where the model got its response from for each section and fact answered with. The `content` section includes:
    - `type`: The type of chunk, which can be `text` or `tool_reference`.
    - `text`: The actual text content of the message.
    - `tool`: The name of the tool used for the reference, which in this case is `web_search`.
    - `title`: The title of the reference source.
    - `url`: The URL of the reference source.
    - `source`: The source of the reference.
  - `object`: The type of object, which is `entry`.
  - `type`: The type of entry, which is `message.output`.
  - `created_at` and `completed_at`: Timestamps indicating when the message was created and completed.
  - `id`: A unique identifier for the message.
  - `agent_id`: A unique identifier for the agent that generated the message.
  - `model`: The model used to generate the message, which in this case is `mistral-medium-2505`.
  - `role`: The role of the message, which is `assistant`.

Another tool that pro-actively uses references is the document library beta connector, feel free to take a look [here](../document_library).   
For more information regarding the use of citations, you can find more [here](../../../capabilities/citations).
