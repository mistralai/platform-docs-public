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
```python
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-tiny"

client = MistralClient(api_key=api_key)

messages = [
    ChatMessage(role="user", content="What is the best French cheese?")
]

# No streaming
chat_response = client.chat(
    model=model,
    messages=messages,
)

# With streaming
for chunk in client.chat_stream(model=model, messages=messages):
    print(chunk)
```
  </TabItem>
  <TabItem value="javascript" label="javascript">
```javascript
import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const chatResponse = await client.chat({
  model: 'mistral-tiny',
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
    "model": "mistral-tiny",
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

We allow users to provide a custom system prompt (see [API reference](../../api)). A convenient `safe_prompt` flag allow to force chat completion to be moderated against sensitive content (see [Guardrailing](../guardrailing)).

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

## Go
[Gage-Technologies](https://github.com/Gage-Technologies/mistral-go)
