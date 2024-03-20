import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Client code

We provide client codes in both Python and Javascript.

## Installation

Follow installation instructions in the repository for our [Python Client](https://github.com/mistralai/client-python) or [Javascript Client](https://github.com/mistralai/client-js).

## Chat Completion

The chat completion API allows you to chat with a model fine-tuned to follow instructions.

<Tabs>
  <TabItem value="python" label="python" default>

### No streaming
```python
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"

client = MistralClient(api_key=api_key)

messages = [
    ChatMessage(role="user", content="What is the best French cheese?")
]

# No streaming
chat_response = client.chat(
    model=model,
    messages=messages,
)

print(chat_response.choices[0].message.content)
```

### With streaming 
```python
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"

client = MistralClient(api_key=api_key)

messages = [
    ChatMessage(role="user", content="What is the best French cheese?")
]

# With streaming
stream_response = client.chat_stream(model=model, messages=messages)

for chunk in stream_response:
    print(chunk.choices[0].delta.content)
```

### With async 
```python
from mistralai.async_client import MistralAsyncClient
from mistralai.models.chat_completion import ChatMessage

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"

client = MistralAsyncClient(api_key=api_key)

messages = [
    ChatMessage(role="user", content="What is the best French cheese?")
]

# With async
async_response = client.chat_stream(model=model, messages=messages)

async for chunk in async_response: 
    print(chunk.choices[0].delta.content)
```


  </TabItem>
  <TabItem value="javascript" label="javascript">
```javascript
import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const chatResponse = await client.chat({
  model: 'mistral-large-latest',
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
    "model": "mistral-large-latest",
    "messages": [
     {
        "role": "user",
        "content": "What is the best French cheese?"
      }
    ]
  }'
```
  </TabItem>
</Tabs>

## Chat messages

Chat messages (`messages`) are a collection of prompts or messages, with each message having a specific role assigned to it, such as "system," "user," "assistant," or "tool." 

- A _system message_ is an *optional* message that sets the behavior and context for an AI assistant in a 
  conversation, such as modifying its personality or providing specific instructions. A system message can 
  include task instructions, personality traits, contextual information, creativity constraints, and other 
  relevant guidelines to help the AI better understand and respond to the user's input. See the 
  [API reference](../../api) for explanations on how to set up a custom system prompt.
- A _user message_ is a message sent from the perspective of the human in a conversation with an AI assistant. 
  It typically provides a request, question, or comment that the AI assistant should respond to. User prompts 
  allow the human to initiate and guide the conversation, and they can be used to request information, ask for 
  help, provide feedback, or engage in other types of interaction with the AI.
- An _assistant message_ is a message sent by the AI assistant back to the user. It is usually meant to reply to a 
  previous user message by following its instructions, but you can also find it at the beginning of a conversation,
  for example to greet the user.
- A _tool message_ only appears in the context of _function calling_, it is used at the final response formulation
  step when the model has to format the tool call's output for the user. To learn more about function calling, see
  the [guide](../../guides/function-calling).


:::tip[When to use `user` prompt vs. `system` message then `user` message?]

- You can either combine your `system` message and `user` message into a single `user` message or separate them into two distinct messages. 
- We recommend you experiment with both ways to determine which one works better for your specific use case. 

:::

We also allow a convenient `safe_prompt` flag to force chat completion to be moderated against sensitive content (see [Guardrailing](../guardrailing)).

## JSON mode

Uers have the option to set `response_format` to `{"type": "json_object"}` to enable JSON mode. It's important to explicitly ask the model to generate JSON output in your message.

<Tabs>
  <TabItem value="python" label="python" default>

```python
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"

client = MistralClient(api_key=api_key)

messages = [
    ChatMessage(role="user", content="What is the best French cheese? Return the product and produce location in JSON format")
]

chat_response = client.chat(
    model=model,
    response_format={"type": "json_object"},
    messages=messages,
)

print(chat_response.choices[0].message.content)
```


  </TabItem>
  <TabItem value="javascript" label="javascript">
```javascript
import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const chatResponse = await client.chat({
  model: 'mistral-large-latest',
  response_format: {'type': 'json_object'},
  messages: [{role: 'user', content: 'What is the best French cheese? Return the product and produce location in JSON format'}],
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
    "model": "mistral-large-latest",
    "messages": [
     {
        "role": "user",
        "response_format": {"type": "json_object"},
        "content": "What is the best French cheese? Return the product and produce location in JSON format"
      }
    ]
  }'
```
  </TabItem>
</Tabs>

## Embeddings

The embeddings API allows you to embed sentences.

<Tabs>
  <TabItem value="python" label="python" default>
```python
from mistralai.client import MistralClient

api_key = os.environ["MISTRAL_API_KEY"]
client = MistralClient(api_key=api_key)

embeddings_batch_response = client.embeddings(
      model="mistral-embed",
      input=["Embed this sentence.", "As well as this one."],
  )
```
  </TabItem>
  <TabItem value="javascript" label="javascript">
```javascript
import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const input = [];
for (let i = 0; i < 10; i++) {
  input.push('What is the best French cheese?');
}

const embeddingsBatchResponse = await client.embeddings({
  model: 'mistral-embed',
  input: input,
});

console.log('Embeddings Batch:', embeddingsBatchResponse.data);
```
  </TabItem>
  <TabItem value="curl" label="curl">
```bash
curl --location "https://api.mistral.ai/v1/embeddings" \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $MISTRAL_API_KEY" \
     --data '{
    "model": "mistral-embed",
    "input": [
      "Embed this sentence.", 
      "As well as this one."
    ]
  }'
```
  </TabItem>
</Tabs>

# Third-Party Clients

Here are some clients built by the community for various other languages:

## CLI
[icebaker/nano-bots](https://github.com/icebaker/ruby-nano-bots)

## Go
[Gage-Technologies](https://github.com/Gage-Technologies/mistral-go)

## Ruby
[gbaptista/mistral-ai](https://github.com/gbaptista/mistral-ai)
