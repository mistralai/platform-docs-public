import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Guardrailing

## System prompt to enforce guardrails

The ability to enforce guardrails in chat generations is crucial for front-facing applications. We introduce an optional system prompt to enforce guardrails on top of our models. You can activate this prompt through a `safe_prompt` binary flag in API calls as follows:

<Tabs>
  <TabItem value="python" label="python" default>
```python
chat_response = client.chat(
    model="mistral-tiny", 
    messages=ChatMessage(role="user", content="What is the best French cheese?"),
    safe_prompt=True
)
```
  </TabItem>
  <TabItem value="javascript" label="javascript">
```javascript
const chatResponse = await client.chat(
    model: 'mistral-tiny',
    messages: [{role: 'user', content: 'What is the best French cheese?'}],
    safe_prompt: true
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

Toggling `safe_prompt` will prepend your messages with the following system prompt:
```
Always assist with care, respect, and truth. Respond with utmost utility yet securely. Avoid harmful, unethical, prejudiced, or negative content. Ensure replies promote fairness and positivity.
```
<!-- 
## Safety and utility trade-off

TODO Safety and utility benchmarks with and without safe mode -->
