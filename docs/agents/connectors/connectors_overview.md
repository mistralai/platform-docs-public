---
id: connectors
title: Connectors Overview
slug: connectors
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Connectors are tools that Agents can call at any given point. They are deployed and ready for the agents to leverage to answer questions on demand.  

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/connectors_graph.png"
    alt="connectors_graph"
    width="800"
    style={{ borderRadius: '15px' }}
  />
</div>

They are also available for users to use them directly via Conversations without the Agent creation step!

## General Usage
<Tabs groupId="code">
  <TabItem value="python" label="python" default>
You can either create an Agent with the desired tools:

```py
agent = client.beta.agents.create(
    model="<model>",
    name="<name_of_the_agent>",
    description="<description>",
    instructions="<instructions_or_system_prompt>",
    tools=[<list_of_tools>]
)
```

Or call our conversations API directly:

```py
response = client.beta.conversations.start(
    model="<model>",
    inputs=[<messages_or_question>],
    tools=[<list_of_tools>],
    # store=False
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">
    
You can either create an Agent with the desired tools:

```typescript
agent = client.beta.agents.create({
    model:"<model>",
    name:"<name_of_the_agent>",
    description:"<description>",
    instructions:"<instructions_or_system_prompt>",
    tools:[<list_of_tools>]
});
```

Or call our conversations API directly:

```typescript
response = client.beta.conversations.start({
    model:"<model>",
    inputs:[<messages_or_question>],
    tools:[<list_of_tools>],
    // store:False
});
```
  </TabItem>

  <TabItem value="curl" label="curl">
You can either create an Agent with the desired tools:

```bash
curl --location "https://api.mistral.ai/v1/agents" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "model": "<model>",
     "name": "<name_of_the_agent>",
     "description": "<description>",
     "instructions": "<instructions_or_system_prompt>",
     "tools": [<list_of_tools>]
  }'
```

Or call our conversations API directly:

```bash
curl --location "https://api.mistral.ai/v1/conversations" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "model": "<model>",
     "inputs": [<messages_or_question>],
     "tools": [<list_of_tools>]
  }'
```
  </TabItem>
</Tabs>

Currently, our API has 4 built-in Connector tools, here you can find how to use them in details:
- [Websearch](../websearch)
- [Code Interpreter](../code_interpreter)
- [Image Generation](../image_generation)
- [Document Library](../document_library)
