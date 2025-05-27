---
id: connectors
title: Connectors
slug: connectors
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/connectors_graph.png"
    alt="connectors_graph"
    width="800"
    style={{ borderRadius: '15px' }}
  />
</div>

Connectors are tools that Agents can call at any given point. They are deployed and ready for the agents to leverage to answer questions on demand.  
They are also available for users to use them directly via Conversations without the Agent creation step!

## General Usage
<Tabs groupId="code">
  <TabItem value="python" label="python" default>
You can either create an Agent with the desired tools:

```py
library_agent = client.beta.agents.create(
    model="...",
    name="...",
    description="...",
    instructions="...",
    tools=[...]
)
```

Or call our conversations API directly:

```py
response = client.conversations.start(
    model="...", inputs=[...], tools=[...], # store=False
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Comming soon...*
  </TabItem>

  <TabItem value="curl" label="curl">
You can either create an Agent with the desired tools:

```bash
curl --location "https://api.mistral.ai/v1/agents" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "model": "...",
     "name": "...",
     "description": "...",
     "instructions": "...",
     "tools": [...]
  }'
```

Or call our conversations API directly:

```bash
curl --location "https://api.mistral.ai/v1/conversations" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "model": "...",
     "inputs": [...],
     "tools": [...],
     "store": false
  }'
```
  </TabItem>
</Tabs>

Currently, our API has 4 built-in Connector tools, here you can find how to use them in details:
- [Websearch](../websearch)
- [Code Interpreter](../code_interpreter)
- [Image Generation](../image_generation)
- [Document Library (Beta)](../document_library)
