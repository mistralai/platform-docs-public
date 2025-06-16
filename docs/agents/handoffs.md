---
id: handoffs
title: Handoffs
slug: handoffs
sidebar_position: 6
---

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/handoffs.png"
    alt="handoffs_graph"
    width="800"
    style={{ borderRadius: '15px' }}
  />
</div>

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

When creating and using Agents, often with access to specific tools, there are moments where it is desired to call other Agents mid-action. To elaborate and engineer workflows for diverse tasks that you may want automated, this ability to give Agents tasks or hand over a conversation to other agents is called **Handoffs**.

## Create an Agentic Workflow

When creating a workflow powered by Handoffs, we first need to create all the Agents that our workflow will use.
There is no limit to how many chained Handoffs a workflow can have. You are free to create multiple Agents using diverse tools, models and handoffs, and orchestrate your own workflow using these Agents.

### Create Multiple Agents

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/multiple_agents_handoffs.png"
    alt="handoffs_graph"
    width="600"
    style={{ borderRadius: '15px' }}
  />
</div>

First things first, let's create diverse Agents with multiple tasks and capabilities.

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
from mistralai import CompletionArgs, ResponseFormat, JSONSchema
from pydantic import BaseModel

class CalcResult(BaseModel):
    reasoning: str
    result: str

# Create your agents
finance_agent = client.beta.agents.create(
    model="mistral-large-latest",
    description="Agent used to answer financial related requests",
    name="finance-agent",
)
web_search_agent = client.beta.agents.create(
    model="mistral-large-latest",
    description="Agent that can search online for any information if needed",
    name="websearch-agent",
    tools=[{"type": "web_search"}],
)
ecb_interest_rate_agent = client.beta.agents.create(
    model="mistral-large-latest",
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
graph_agent = client.beta.agents.create(
    model="mistral-large-latest",
    name="graph-drawing-agent",
    description="Agent used to create graphs using the code interpreter tool.",
    instructions="Use the code interpreter tool when you have to draw a graph.",
    tools=[{"type": "code_interpreter"}]
)
calculator_agent = client.beta.agents.create(
    model="mistral-large-latest",
    name="calculator-agent",
    description="Agent used to make detailed calculations",
    instructions="When doing calculations explain step by step what you are doing.",
    completion_args=CompletionArgs(
          response_format=ResponseFormat(
            type="json_schema",
            json_schema=JSONSchema(
                name="calc_result",
                schema=CalcResult.model_json_schema(),
            )
        )
    )
)
```
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
     "model": "mistral-large-latest",
     "name": "finance-agent",
     "description": "Agent used to answer financial related requests"
  }'
```
  </TabItem>
</Tabs>

### Define Handoffs Responsibilities

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/responsibilities_handoffs.png"
    alt="handoffs_graph"
    width="800"
    style={{ borderRadius: '15px' }}
  />
</div>

Once all our Agents created, we update our previous defined Agents with a list of `handoffs` available.
<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
# Allow the finance_agent to handoff the conversation to the ecb_interest_rate_agent or web_search_agent
finance_agent = client.beta.agents.update(
    agent_id=finance_agent.id,
    handoffs=[ecb_interest_rate_agent.id, web_search_agent.id]
)

# Allow the ecb_interest_rate_agent to handoff the conversation to the graph_agent or calculator_agent
ecb_interest_rate_agent = client.beta.agents.update(
    agent_id=ecb_interest_rate_agent.id,
    handoffs=[graph_agent.id, calculator_agent.id]
)

# Allow the web_search_agent to handoff the conversation to the graph_agent or calculator_agent
web_search_agent = client.beta.agents.update(
    agent_id=web_search_agent.id,
    handoffs=[graph_agent.id, calculator_agent.id]
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Coming soon...*
  </TabItem>

  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/agents/<web_search_id>" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
     "handoffs": ["<graph_agent_id>", "<calculator_agent_id>"]
  }'
```
  </TabItem>
</Tabs>

## How It Works

Our workflow and behavior are defined, now we can run it.

We created 5 agents, some of them have access to built-in tools, and others to local tools like `get_european_central_bank_interest_rate`.

It is now possible to have a chain of actions by sending a request to the `finance_agent`.

We also provide the parameter `handoff_execution`, which currently has two modes: `server` or `client`.
- `server`: Runs the handoff as expected internally on our cloud servers; this is the default setting.
- `client`: When a handoff is triggered, a response is provided directly to the user, enabling them to handle the handoff with control.

Let’s trigger two different behaviors as examples:

### Example A

**"Fetch the current US bank interest rate and calculate the compounded effect if investing for the next 10y"**

The first example asks for the US central bank interest rate, so we expect to involve the `websearch-agent` and then to calculate the compounded interest over 10 years. This should use the `calculator-agent` to do this.

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/examplea_handoffs.png"
    alt="handoffs_graph_examplea"
    width="800"
    style={{ borderRadius: '15px' }}
  />
</div>

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
response = client.beta.conversations.start(
    agent_id=finance_agent.id,
    inputs="Fetch the current US bank interest rate and calculate the compounded effect if investing for the next 10y"
)
```
  </TabItem>

  <TabItem value="typescript" label="typescript">
  *Coming soon...*
  </TabItem>

  <TabItem value="curl" label="curl">
  *Coming soon...*
  </TabItem>
</Tabs>

<details>
    <summary><b>Parsed Output</b></summary>

```shell
Conversation started: conv_067f7fce0aba70728000b32dcb0ac7e5

## Event type: agent.handoff

agent_id='ag_067f7fce04517b60800013b213ff2acb' agent_name='websearch-agent' object='conversation.entry' type='agent.handoff' created_at=datetime.datetime(2025, 4, 10, 17, 16, 18, 952817, tzinfo=TzInfo(UTC)) id='handoff_067f7fce2f3f7423800094104f3e3589'


## Event type: tool.execution

name='web_search' object='conversation.entry' type='tool.execution' created_at=datetime.datetime(2025, 4, 10, 17, 16, 23, 12996, tzinfo=TzInfo(UTC)) id='tool_exec_067f7fce7035747e800085153507b345'


## Event type: message.output

content=[TextChunk(text='The current US bank interest rate is 4.50 percent', type='text'), ToolReferenceChunk(tool='web_search', title='United States Fed Funds Interest Rate', type='tool_reference', url='https://tradingeconomics.com/united-states/interest-rate'), TextChunk(text='.\n\nI will now handoff the conversation to the calculator agent to calculate the compounded effect if investing for the next 10 years.', type='text')] object='conversation.entry' type='message.output' created_at=datetime.datetime(2025, 4, 10, 17, 16, 23, 14612, tzinfo=TzInfo(UTC)) id='msg_067f7fce703b7e01800045b2309a0750' agent_id='ag_067f7fce04517b60800013b213ff2acb' model='mistral-medium-2505' role='assistant'


## Event type: agent.handoff

agent_id='ag_067f7fce017f71a580001bf69f2cc11e' agent_name='calculator-agent' object='conversation.entry' type='agent.handoff' created_at=datetime.datetime(2025, 4, 10, 17, 16, 23, 14726, tzinfo=TzInfo(UTC)) id='handoff_067f7fce703c753680006aedb42ba7b7'


## Event type: message.output

content=' {"result": "The future value of the investment after 10 years is $1,540.10.", "reasoning": "To calculate the compounded effect of investing at the current US bank interest rate of 4.50% for the next 10 years, we use the formula for compound interest: A = P(1 + r/n)^(nt), where A is the amount of money accumulated after n years, including interest. P is the principal amount (the initial amount of money). r is the annual interest rate (decimal). n is the number of times that interest is compounded per year. t is the time the money is invested for, in years. Assuming an initial investment (P) of $1,000, an annual interest rate (r) of 4.50% (or 0.045 as a decimal), compounded annually (n = 1), over 10 years (t = 10): A = 1000(1 + 0.045/1)^(1*10) = 1000(1 + 0.045)^10 = 1000(1.045)^10 ≈ 1540.10. Therefore, the future value of the investment after 10 years is approximately $1,540.10."}' object='conversation.entry' type='message.output' created_at=datetime.datetime(2025, 4, 10, 17, 16, 30, 145207, tzinfo=TzInfo(UTC)) id='msg_067f7fcee2527cf08000744d983639dc' agent_id='ag_067f7fce017f71a580001bf69f2cc11e' model='mistral-medium-2505' role='assistant'
```
</details>

### Example B

**"Given the interest rate of the European Central Bank as of jan 2025, plot a graph of the compounded interest rate over the next 10 years"**

The second example asks for the European central bank interest rate and to plot a graph of the compounded interest. Now we require a local function call since the `ecb-interest-rate-agent` will surelly be required.

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/exampleb_handoffs.png"
    alt="handoffs_graph_exampleb"
    width="800"
    style={{ borderRadius: '15px' }}
  />
</div>

<Tabs groupId="code">
  <TabItem value="python" label="python" default>

```py
from mistralai import FunctionResultEntry

response = client.beta.conversations.start(
    agent_id=finance_agent.id,
    inputs="Given the interest rate of the European Central Bank as of jan 2025, plot a graph of the compounded interest rate over the next 10 years"
)
if response.outputs[-1].type == "function.call" and response.outputs[-1].name == "get_european_central_bank_interest_rate":

    # Add a dummy result for the function call
    user_entry = FunctionResultEntry(
        tool_call_id=response.outputs[-1].tool_call_id,
        result="2.5%",
    )
    response = client.beta.conversations.append(
        conversation_id=response.conversation_id,
        inputs=[user_entry]
    )
```

A full code snippet to download all generated images and plots from the response could look like so:
```py
from mistralai.models import ToolFileChunk

for i, chunk in enumerate(response.outputs[-1].content):
    # Check if chunk corresponds to a ToolFileChunk
    if isinstance(chunk, ToolFileChunk):

      # Download using the ToolFileChunk ID
      file_bytes = client.files.download(file_id=chunk.file_id).read()

      # Save the file locally
      with open(f"plot_generated_{i}.png", "wb") as file:
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

<details>
    <summary><b>Parsed Output</b></summary>

```shell
Conversation started: conv_067f7e71523d7be3800005c4ac560a7b

## Event type: agent.handoff

agent_id='ag_067f7e714f6e751480002beb3bfe0779' agent_name='ecb-interest-rate-agent' object='conversation.entry' type='agent.handoff' created_at=datetime.datetime(2025, 4, 10, 15, 43, 18, 590169, tzinfo=TzInfo(UTC)) id='handoff_067f7e71697176098000aa403030a74e'


## Event type: function.call

tool_call_id='NqCFiwvSV' name='get_european_central_bank_interest_rate' arguments='{"date": "2025-01-01"}' object='conversation.entry' type='function.call' created_at=datetime.datetime(2025, 4, 10, 15, 43, 20, 173505, tzinfo=TzInfo(UTC)) id='fc_067f7e7182c67b9c80006f27131026a8'


## User added event function.result:

tool_call_id='NqCFiwvSV' result='2.5%' object='conversation.entry' type='function.result' created_at=None id=None

## Event type: agent.handoff:

agent_id='ag_067f7e7147e077a280005b4ae524d317' agent_name='graph-drawing-agent' object='conversation.entry' type='agent.handoff' created_at=datetime.datetime(2025, 4, 10, 15, 43, 26, 261436, tzinfo=TzInfo(UTC)) id='handoff_067f7e71e42e7e2080009fc4fd68164a'


## Event type: message.output:

content="To plot the graph of the compounded interest rate over the next 10 years, we can use the formula for compound interest:\n\n\\[ A = P \\left(1 + \\frac{r}{n}\\right)^{nt} \\]\n\nwhere:\n- \\( A \\) is the amount of money accumulated after n years, including interest.\n- \\( P \\) is the principal amount (the initial amount of money).\n- \\( r \\) is the annual interest rate (decimal).\n- \\( n \\) is the number of times that interest is compounded per year.\n- \\( t \\) is the time the money is invested for, in years.\n\nGiven:\n- The annual interest rate \\( r = 2.5\\% = 0.025 \\).\n- Assuming the interest is compounded annually (\\( n = 1 \\)).\n- We will calculate the compounded amount for each year over the next 10 years.\n\nLet's assume the principal amount \\( P = 1000 \\) (you can choose any amount as it will not affect the rate plot).\n\nWe will calculate the compounded amount for each year and plot it." object='conversation.entry' type='message.output' created_at=datetime.datetime(2025, 4, 10, 15, 43, 39, 385339, tzinfo=TzInfo(UTC)) id='msg_067f7e72b62a768f800022b2504adfc9' agent_id='ag_067f7e7147e077a280005b4ae524d317' model='mistral-medium-2505' role='assistant'


## Event type: tool.execution:

name='code_interpreter' object='conversation.entry' type='tool.execution' created_at=datetime.datetime(2025, 4, 10, 15, 43, 39, 385463, tzinfo=TzInfo(UTC)) id='tool_exec_067f7e72b62a7e3a800072733a6a57f2'


## Event type: message.output:

content=[ToolFileChunk(tool='code_interpreter', file_id='40420c94-5f99-477f-8891-943f0defbe3b', type='tool_file', file_name='plot_0.png', file_type='png'), TextChunk(text='![Image](__emitted_0.png)\n\nThe graph shows the compounded interest over 10 years with an annual interest rate of 2.5%. The principal amount is set to $1000, and the interest is compounded once per year. The y-axis represents the amount of money, and the x-axis represents the number of years.', type='text')] object='conversation.entry' type='message.output' created_at=datetime.datetime(2025, 4, 10, 15, 43, 39, 898738, tzinfo=TzInfo(UTC)) id='msg_067f7e72be6173f48000e85e9976305a' agent_id='ag_067f7e7147e077a280005b4ae524d317' model='mistral-medium-2505' role='assistant'
```
  
</details>

A full code snippet to download all generated images and plots from the response could look like so:
```py
from mistralai.models import ToolFileChunk

for i, chunk in enumerate(response.outputs[-1].content):
    # Check if chunk corresponds to a ToolFileChunk
    if isinstance(chunk, ToolFileChunk):

      # Download using the ToolFileChunk ID
      file_bytes = client.files.download(file_id=chunk.file_id).read()

      # Save the file locally
      with open(f"plot_generated_{i}.png", "wb") as file:
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
