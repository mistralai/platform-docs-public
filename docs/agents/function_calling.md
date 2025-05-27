---
id: function_calling
title: Function Calling
slug: function_calling
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The core of an agent relies on its tool usage capabilities, enabling it to use and call tools and workflows depending on the task it must accomplish.

Built into our API, we provide [connector](../connectors/connectors) tools such as `websearch`, `code_interpreter`, `image_generation` and `document_library`. However, you can also use standard function tool calling by defining a JSON schema for your function.

You can also leverage our MCP Orchestration to implement local Function Calling, visit our [Local MCP docs](../mcp/#step-4-register-mcp-client) for further details.

For more information regarding function calling, we recommend to visit our [function calling docs](../../capabilities/function_calling).

### Creating an Agent with Function Calling

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

We need to define our function that we want our model to call when needed, in this case, the function is a dummy for demonstration purposes.

```py
from typing import Dict

def get_european_central_bank_interest_rate(date: str) -> Dict[str, str]:
    """
    Retrieve the real interest rate of the European Central Bank for a given date.

    Parameters:
    - date (str): The date for which to retrieve the interest rate in the format YYYY-MM-DD.

    Returns:
    - dict: A dictionary containing the date and the corresponding interest rate.
    """
    # This is a mock implementation. In a real scenario, you would fetch this data from an API or database.
    # For demonstration, let's assume the interest rate is fixed at 2.5% for any date.
    interest_rate = "2.5%"

    return {
        "date": date,
        "interest_rate": interest_rate
    }
```

Once defined, we provide a Shema corresponding to the same function.

```py
ecb_interest_rate_agent = client.beta.agents.create(
    model="mistral-medium-2505",
    description="Can find the current interest rate of the European central bank",
    name="ecb-interest-rate-agent",
    tools=[
        {
            "type": "function",
            "function": {
                "name": "get_european_central_bank_interest_rate",
                "description": "Retrieve the real interest rate of European central bank.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "date": {
                            "type": "string",
                        },
                    },
                    "required": [
                        "date",
                    ]
                },
            },
        },
    ],
)
```
<details>
    <summary><b>Output</b></summary>

```
model='mistral-medium-2505' name='ecb-interest-rate-agent' description='Can find the current interest rate of the European central bank' id='ag_06835a34f2c476518000c372a505c2c4' version=0 created_at=datetime.datetime(2025, 5, 27, 11, 34, 39, 175924, tzinfo=TzInfo(UTC)) updated_at=datetime.datetime(2025, 5, 27, 11, 34, 39, 175926, tzinfo=TzInfo(UTC)) instructions='You can provide interest rate and information regarding the European central bank.' tools=[FunctionTool(function=Function(name='get_european_central_bank_interest_rate', parameters={'type': 'object', 'properties': {'date': {'type': 'string'}}, 'required': ['date']}, description='Retrieve the real interest rate of European central bank.', strict=False), type='function')] completion_args=CompletionArgs(stop=None, presence_penalty=None, frequency_penalty=None, temperature=0.3, top_p=None, max_tokens=None, random_seed=None, prediction=None, response_format=None, tool_choice='auto') handoffs=None object='agent'
```
</details>

  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Comming soon...*
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/agents" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "model": "mistral-medium-2505",
     "name": "ecb-interest-rate-agent",
     "description": "Can find the current interest rate of the European central bank",
     "instructions": "You can provide interest rate and information regarding the European central bank.",
     "tools": [
         {
             "function": {
                 "name": "get_european_central_bank_interest_rate",
                 "parameters": {
                     "type": "object",
                     "properties": {
                         "date": {
                             "type": "string"
                         }
                     },
                     "required": ["date"]
                 },
                 "description": "Retrieve the real interest rate of European central bank."
             },
             "type": "function"
         }
     ]
 }'

```
  </TabItem>
</Tabs>

### Using an Agent with Function Calling

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

Then, to use it, we start a conversation or continue a previously existing one.

```py
response = client.conversations.start(
    agent_id=ecb_interest_rate_agent.id,
    inputs=[{"role": "user", "content": "Whats the current 2025 real interest rate?"}]
)
```

<details>
    <summary><b>Output</b></summary>

```
conversation_id='conv_06835a34f58773bd8000f46c0d11e42c' outputs=[FunctionCallEntry(tool_call_id='6TI17yZkV', name='get_european_central_bank_interest_rate', arguments='{"date": "2024-06-06"}', object='entry', type='function.call', created_at=datetime.datetime(2025, 5, 27, 11, 34, 39, 610632, tzinfo=TzInfo(UTC)), completed_at=None, id='fc_06835a34f9c47fc88000e0370a295774')] usage=ConversationUsageInfo(prompt_tokens=91, completion_tokens=29, total_tokens=120, connector_tokens=Unset(), connectors=Unset()) object='conversation.response'
```
</details>

The model will output either an answer, or a function call, we need to detect and return the result of the expected function.

```py
from mistralai import FunctionResultEntry
import json

if response.outputs[-1].type == "function.call" and response.outputs[-1].name == "get_european_central_bank_interest_rate":

    # Running our function
    function_result = json.dumps(get_european_central_bank_interest_rate(**json.loads(response.outputs[-1].arguments)))

    # Providing the result to our Agent
    user_function_calling_entry = FunctionResultEntry(
        tool_call_id=response.outputs[-1].tool_call_id,
        result=function_result,
    )

    # Retrieving the final response
    response = client.conversations.append(
        conversation_id=response.conversation_id,
        inputs=[user_function_calling_entry]
    )
    print(response.outputs[-1])
else:

    # In case the model did not call our function
    print(response.outputs[-1])
```

<details>
    <summary><b>Output</b></summary>
```
content='The current interest rate as of June 6, 2024, is 2.5%. This information is relevant for understanding the economic conditions in 2025.' object='entry' type='message.output' created_at=datetime.datetime(2025, 5, 27, 11, 34, 40, 142767, tzinfo=TzInfo(UTC)) completed_at=datetime.datetime(2025, 5, 27, 11, 34, 40, 801117, tzinfo=TzInfo(UTC)) id='msg_06835a35024879bc80005b1bf9ab0f12' agent_id='ag_06835a34f2c476518000c372a505c2c4' model='mistral-medium-2505' role='assistant'
```
</details>
  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Comming soon...*
  </TabItem>

  <TabItem value="curl" label="curl">

For starting a conversation:
```bash
curl --location "https://api.mistral.ai/v1/conversations" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "inputs": [
         {
             "role": "user",
             "content": "Whats the current 2025 real interest rate?",
             "object": "entry",
             "type": "message.input"
         }
     ],
     "stream": false,
     "agent_id": "<agent_id>"
 }'
```

For continuing a conversation:
```bash
curl --location "https://api.mistral.ai/v1/conversations/<conv_id>" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "inputs": [
         {
             "tool_call_id": "6TI17yZkV",
             "result": "{\"date\": \"2024-06-06\", \"interest_rate\": \"2.5%\"}",
             "object": "entry",
             "type": "function.result"
         }
     ],
     "stream": false,
     "store": true,
     "handoff_execution": "server"
 }'
```
  </TabItem>
</Tabs>
