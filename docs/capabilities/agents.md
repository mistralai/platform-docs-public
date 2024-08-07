---
id: agents
title: Agents
sidebar_position: 2.9
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## What are AI agents? 

AI agents are autonomous systems powered by large language models (LLMs) that, given high-level instructions, can plan, use tools, carry out steps of processing, and take actions to achieve specific goals. These agents leverage advanced natural language processing capabilities to understand and execute complex tasks efficiently and can even collaborate with each other to achieve more sophisticated outcomes.


## Creating Agents
We provide two primary methods for creating agents:

- La Plateforme [Agent builder](https://console.mistral.ai/build/agents/new): Users can use a user-friendly interface provided on La Plateforme to create and configure their agents.

- [Agent API](#the-agents-api): For developers, we offer the Agents API as a programmatic means to use agents. This method is ideal for developers who need to integrate agent creation into their existing workflows or applications.

## La Plateforme agent builder

To start building your own agent, visit https://console.mistral.ai/build/agents/new.

<img src="/img/agent.png" alt="drawing" width="600"/>

Here are the available options for customizing your agent:
- **Model**: The specific model you would like the agent to use. Default is "Mistral Large 2" (`mistral-large-2407`). The other model choicess are "Mistral Nemo" (`open-mistral-nemo`), "Codestral" (`codestral-2405`), and your fine-tuned models.
- **Temperature**: What sampling temperature to use, between 0.0 and 1.0. Higher values will make the output more random, while lower values will make it more focused and deterministic.
- **Instructions** (optional): Instructions allows you to enforce a model behavior through all conversations and messages.
- **Demonstrations** (optional): Few-shot learning examples can be added to help guide the agent to understand the specific behavior you want it to exhibit. You can show the model some examples of input and output to improve performance.
- **Deploy**: Once deployed, you will be able to call the Agent via the API with the `agent_id`, but you can also toggle the option to chat with the corresponding Agent on [Le Chat](https://chat.mistral.ai/chat).


## The Agent API 

### Create an agent

Coming soon 
<!-- 
<Tabs>
  <TabItem value="python" label="python">

```python
TODO 
```
  </TabItem>

  <TabItem value="javascript" label="javascript">

```javascript
TODO
```
  </TabItem>
  
  <TabItem value="curl" label="curl" default>

```bash
curl --location "https://api.mistral.ai/v1/agents" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
    "name": "French agent",
    "model": "mistral-large-latest",
    "instructions": "You are a French-speaking virtual agent, designed to answer your questions in French only, no matter the language of the question."
  }'
```
  </TabItem>

</Tabs> -->



### Use an agent


<Tabs>
  <TabItem value="python" label="python" default>

```python
import os
from mistralai import Mistral

api_key = os.environ["MISTRAL_API_KEY"]

client = Mistral(api_key=api_key)

chat_response = client.agents.complete(
    agent_id="ag:3996db2b:20240805:french-agent:a8997aab",
    messages=[
        {
            "role": "user",
            "content": "What is the best French cheese?",
        },
    ],
)
print(chat_response.choices[0].message.content)


```
  </TabItem>

  <TabItem value="javascript" label="javascript">

```typescript
import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});

const chatResponse = await client.agents.complete({
  agent_id: "ag:3996db2b:20240805:french-agent:a8997aab",
  messages: [{role: 'user', content: 'What is the best French cheese?'}],
});

console.log('Chat:', chatResponse.choices[0].message.content);
```
  </TabItem>
  
  <TabItem value="curl" label="curl">

```bash
curl --location "https://api.mistral.ai/v1/chat/completions" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
    "agent_id": "ag:3996db2b:20240805:french-agent:a8997aab",
    "messages": [{"role": "user", "content": "Who is the most renowned French painter?"}]
  }'
```
  </TabItem>

</Tabs>

<!-- 
### List/delete agents

<Tabs>
  <TabItem value="python" label="python" default>

```python
TODO 
```
  </TabItem>

  <TabItem value="javascript" label="javascript">

```javascript
TODO
```
  </TabItem>
  
  <TabItem value="curl" label="curl">

```bash
TODO
```
  </TabItem>

</Tabs> -->

## Use Cases
<details>
    <summary><b>Use case 1: French agent</b></summary>

You can create an agent that only speaks French. You'll need to set up the agent with specific instructions and use few-shot learning to ensure it understands the requirement to communicate solely in French. 

<!-- Here's the sample Python code to create an agent that only speaks French:

```py
TODO
``` -->

Here is an example of how you can create this agent with the La Plateforme [agent builder](https://console.mistral.ai/build/agents/new).
<img src="/img/French_agent.png" alt="drawing" width="600"/>
</details>

<details>
 <summary><b>Use case 2: Python agent</b></summary>

You can create an agent that outputs only Python code without any explanations. This is useful when you need to generate code snippets that can be easily copied and pasted, without the additional explanatory text that our model typically provides.

<!-- Here's the sample Python code to create this agent:

```py
TODO
``` -->

Here is an example of how you can create this agent with using the La Plateforme [agent builder](https://console.mistral.ai/build/agents/new).

   
<img src="/img/Python_agent.png" alt="drawing" width="600"/>
</details>

<details>
    <summary><b>Use case 3: Python agent workflow</b></summary>

You can use the Python agent we created in use case 2 in an assistant coding workflow. For example, here is a very simple Python agent workflow with the following steps:

1. User Query:

The process starts when the user submits a query or request to the Python agent.

2. Code and Test Case Generation:

The agent interprets the user's query and generates the corresponding Python code. Alongside the code, the agent creates a test case to verify the functionality of the generated code.

3. Execution and Validation:

The agent attempts to run the generated code to ensure it executes without errors.
The agent then runs the test case to confirm that the code produces the correct output.

4. Retry Mechanism:

If the code fails to run or the test case does not pass, the agent initiates a retry.
It regenerates the code and test case, addressing any issues identified during the previous attempt.

5. Result Output:

Once the code runs successfully and passes the test case, the agent delivers the result to the user.

Check out this [example notebook](https://github.com/mistralai/cookbook/blob/main/mistral/agents/simple_Python_agent_workflow.ipynb) for details. 

</details>

<details>
    <summary><b>Use case 4: Data analytical multi-agent workflow</b></summary>

You can also leverage multiple agents in a workflow. Here is an example: 

1. Data Analysis Planning:

The planning agent writes a comprehensive data analysis plan, outlining the steps required to analyze the data.

2. Code Generation and Execution:

For each step in the analysis plan, the Python agent generates the corresponding code.
The Python agent then executes the generated code to perform the specified analysis.

3. Analysis Report Summarization:

Based on the results of the executed code, the summarization agent writes an analysis report.
The report summarizes the findings and insights derived from the data analysis.

Check out this [example notebook](https://github.com/mistralai/cookbook/blob/main/mistral/agents/analytical_agent_workflow.ipynb) for details. 

</details>


<details>
    <summary><b>Use case 5: Role-playing Conversation agent</b></summary>

You can also create role-playing conversation agents. For instance, in this [example](https://github.com/mistralai/cookbook/blob/main/mistral/agents/conversation_agent.ipynb), the role-playing conversation workflow generates an entertaining and humorous exchange between two agents mimicking the styles of two stand-up comedians Ali Wong and Jimmy Yang, incorporating jokes and comedic elements to enhance the conversation.

Here is another [example](https://github.com/mistralai/cookbook/blob/main/mistral/agents/auto_roleplay.ipynb), where we have a Game Master agent orchestrating a roleplaying story between a Narrator agent and a Character agent. The Game Master agent sets the stage and determines which agent drives the next step of the story. 
</details>
