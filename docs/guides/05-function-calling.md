# Function Calling 

<a target="_blank" href="https://colab.research.google.com/github/mistralai/cookbook/blob/main/function_calling.ipynb">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
</a>

Function calling allows Mistral models to connect to external tools. By integrating Mistral models with external tools such as user defined functions or APIs, users can easily build applications catering to specific use cases and practical problems. In this guide, for instance, we wrote two functions for tracking payment status and payment date. We can use these two tools to provide answers for payment-related queries. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/eOo4GfHj3ZE?si=-l0j8Qpi9qLNy1BA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

At a glance, there are four steps with function calling:
- User: specify tools and query
- Model: Generate function arguments if applicable
- User: Execute function to obtain tool results
- Model: Generate final answer


<img src="/img/guides/functioncalling1.png" alt="drawing" width="600"/>

In this guide, we will walk through a simple example to demonstrate how function calling works with Mistral models in these four steps. 

Before we get started, let’s assume we have a dataframe consisting of payment transactions. When users ask questions about this dataframe, they can use certain tools to answer questions about this data. This is just an example to emulate an external database that the LLM cannot directly access.

```python
import pandas as pd

# Assuming we have the following data
data = {
    'transaction_id': ['T1001', 'T1002', 'T1003', 'T1004', 'T1005'],
    'customer_id': ['C001', 'C002', 'C003', 'C002', 'C001'],
    'payment_amount': [125.50, 89.99, 120.00, 54.30, 210.20],
    'payment_date': ['2021-10-05', '2021-10-06', '2021-10-07', '2021-10-05', '2021-10-08'],
    'payment_status': ['Paid', 'Unpaid', 'Paid', 'Paid', 'Pending']
}

# Create DataFrame
df = pd.DataFrame(data)
```

## Step 1. User: specify tools and query

<img src="/img/guides/functioncalling2.png" alt="drawing" width="600"/>

### Tools
Users can define all the necessary tools for their use cases. 

- In many cases, we might have multiple tools at our disposal. For example, let’s consider we have two functions as our two tools: `retrieve_payment_status` and `retrieve_payment_date` to retrieve payment status and payment date given transaction ID.

```python
def retrieve_payment_status(df: data, transaction_id: str) -> str:
    if transaction_id in df.transaction_id.values: 
        return json.dumps({'status': df[df.transaction_id == transaction_id].payment_status.item()})
    return json.dumps({'error': 'transaction id not found.'})

def retrieve_payment_date(df: data, transaction_id: str) -> str:
    if transaction_id in df.transaction_id.values: 
        return json.dumps({'date': df[df.transaction_id == transaction_id].payment_date.item()})
    return json.dumps({'error': 'transaction id not found.'})
```


- In order for Mistral models to understand the functions, we need to outline the function specifications with a JSON schema. Specifically, we need to describe the type, function name, function description, function parameters, and the required parameter for the function.  Since we have two functions here, let’s list two function specifications in a list. 

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "retrieve_payment_status",
            "description": "Get payment status of a transaction",
            "parameters": {
                "type": "object",
                "properties": {
                    "transaction_id": {
                        "type": "string",
                        "description": "The transaction id.",
                    }
                },
                "required": ["transaction_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "retrieve_payment_date",
            "description": "Get payment date of a transaction",
            "parameters": {
                "type": "object",
                "properties": {
                    "transaction_id": {
                        "type": "string",
                        "description": "The transaction id.",
                    }
                },
                "required": ["transaction_id"],
            },
        },
    }
]
```

- Then we organize the two functions into a dictionary where keys represent the function name, and values are the function with the `df` defined. This allows us to call each function based on its function name. 

```python
import functools

names_to_functions = {
    'retrieve_payment_status': functools.partial(retrieve_payment_status, df=df),
    'retrieve_payment_date': functools.partial(retrieve_payment_date, df=df)
}
```

### User query
Suppose a user asks the following question: “What’s the status of my transaction?” A standalone LLM would not be able to answer this question, as it needs to query the business logic backend to access the necessary data. But what if we have an exact tool we can use to answer this question? We could potentially provide an answer! 

```python
from mistralai.models.chat_completion import ChatMessage

messages = [
    ChatMessage(role="user", content="What's the status of my transaction?")
]
```

## Step 2. Model: Generate function arguments 

<img src="/img/guides/functioncalling3.png" alt="drawing" width="600"/>

How do Mistral models know about these functions and know which function to use? We provide both the user query and the tools specifications to Mistral models. The goal in this step is not for the Mistral model to run the function directly. It’s to 1) determine the appropriate function to use , 2) identify if there is any essential information missing for a function, and 3) generate necessary arguments for the chosen function. 


```python
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

model = "mistral-large"
api_key="TYPE YOUR API KEY"

client = MistralClient(api_key=api_key)
response = client.chat(model=model, messages=messages, tools=tools)
response
```

Mistral model identifies there are information missing and responds that “I need the transaction id to check the status. Could you please provide me with the transaction id?”. 

```
ChatCompletionResponse(id='dca45f6bdc284d48bc13acfdb6e2f980', object='chat.completion', created=1707931630, model='mistral-large', choices=[ChatCompletionResponseChoice(index=0, message=ChatMessage(role='assistant', content='I need the transaction id to check the status. Could you please provide me with the transaction id?', name=None, tool_calls=[]), finish_reason=<FinishReason.stop: 'stop'>)], usage=UsageInfo(prompt_tokens=173, total_tokens=193, completion_tokens=20))
```

Let’s add this message to the `messages` list and then add another user message providing the transaction ID: “My transaction ID is T1001.”

```python
messages.append(ChatMessage(role="assistant", content=response.choices[0].message.content))
messages.append(ChatMessage(role="user", content="My transaction ID is T1001."))
```

Running the Mistral model again, we get the response including tool_calls with the chosen function name `retrieve_payment_status` and the arguments for this function. 

```python
response = client.chat(model=model, messages=messages, tools=tools)
response
```

Output:
```
ChatCompletionResponse(id='9ec8d47af52d4c258c641a7d9f62336e', object='chat.completion', created=1707931630, model='mistral-large', choices=[ChatCompletionResponseChoice(index=0, message=ChatMessage(role='assistant', content='', name=None, tool_calls=[ToolCall(id='null', type=<ToolType.function: 'function'>, function=FunctionCall(name='retrieve_payment_status', arguments='{"transaction_id": "T1001"}'))]), finish_reason=<FinishReason.stop: 'stop'>)], usage=UsageInfo(prompt_tokens=211, total_tokens=250, completion_tokens=39))
```
Let’s add the response message to the `messages` list.  

```python
messages.append(response.choices[0].message)
```

## Step 3. User: Execute function to obtain tool results

<img src="/img/guides/functioncalling4.png" alt="drawing" width="600"/>

How do we execute the function? Currently, it is the user’s responsibility to execute these functions and the function execution lies on the user side. In the future, we may introduce some helpful functions that can be executed server-side. 


Let’s extract some useful function information from model response including `function_name` and `function_params`. It’s clear here that our Mistral model has chosen to use the function `retrieve_payment_status` with the parameter `transaction_id` set to T1001. 
```python
import json

tool_call = response.choices[0].message.tool_calls[0]
function_name = tool_call.function.name
function_params = json.loads(tool_call.function.arguments)
print("\nfunction_name: ", function_name, "\nfunction_params: ", function_params)
```
Output
```
function_name:  retrieve_payment_status 
function_params: {'transaction_id': 'T1001'}
```
Now we can execute the function and we get the function output `'{"status": "Paid"}'`. 

```python
function_result = names_to_functions[function_name](**function_params)
function_result
```
Output
```
'{"status": "Paid"}'
```

## Step 4. Model: Generate final answer

<img src="/img/guides/functioncalling5.png" alt="drawing" width="600"/>

We can now provide the output from the tools to Mistral models, and in return, the Mistral model can produce a customised final response for the specific user.

```python
messages.append(ChatMessage(role="tool", name=function_name, content=function_result))

response = client.chat(model=model, messages=messages)
response.choices[0].message.content
```

Output:
```
The status of your transaction with ID T1001 is "Paid". Is there anything else I can assist you with?
```



