import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Guardrailing

## System prompt to enforce guardrails

The ability to enforce guardrails in chat generations is crucial for front-facing applications. We introduce an optional system prompt to enforce guardrails on top of our models. You can activate this prompt through a `safe_prompt` boolean flag in API calls as follows (this parameter is currently named `safe_mode` in the client libraries):

<Tabs>
  <TabItem value="python" label="python" default>
```python
chat_response = client.chat(
    model="mistral-tiny", 
    messages=ChatMessage(role="user", content="What is the best French cheese?"),
    safe_mode=True
)
```
  </TabItem>
  <TabItem value="javascript" label="javascript">
```javascript
const chatResponse = await client.chat(
    model: 'mistral-tiny',
    messages: [{role: 'user', content: 'What is the best French cheese?'}],
    safe_mode: true
);
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
    ],
    "safe_prompt": true
  }'
```
  </TabItem>
</Tabs>

Toggling the safe prompt will prepend your messages with the following system prompt:

```
Always assist with care, respect, and truth. Respond with utmost utility yet securely. Avoid harmful, unethical, prejudiced, or negative content. Ensure replies promote fairness and positivity.
```


:::warning

A previous version of this documentation incorrectly referred to the API parameter as `safe_mode` instead of `safe_prompt`. The API now strictly enforces the validity of all parameters, so you may need to update your code accordingly.

:::

<!-- 
## Safety and utility trade-off

TODO Safety and utility benchmarks with and without safe mode -->
