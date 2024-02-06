import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Deploy with Cloudflare

[Cloudflare](https://www.cloudflare.com/en-gb/) is a web performance and security company that provides content delivery network (CDN), DDoS protection, Internet security, and distributed domain name server services. Cloudflare launched Workers AI, which allows developers to run LLMs models powered by serverless GPUs on Cloudflare’s global network.

## Set-up

To set-up Workers AI on Cloudflare, you need to create an account on the [Cloudflare dashboard](https://dash.cloudflare.com/), get your account ID, and generate a token with Workers AI permissions. You can then send a completion request:

<Tabs>
  <TabItem value="cloudflare-curl" label="curl" default>
  
  ```bash
  curl https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/mistral/mistral-7b-instruct-v0.1 \
    -X POST \
    -H "Authorization: Bearer {API_TOKEN}" \
    -d '{ "messages": [{ "role": "user", "content": "[INST] 2 + 2 ? [/INST]" }]}'
  ```
  </TabItem>
  <TabItem value="cloudflare-node" label="javascript">

  ```javascript
  async function run(model, prompt) {
    const messages = [
      { role: "user", content: prompt },
    ];

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/${model}`,
      {
        headers: { Authorization: "Bearer {API_TOKEN}" },
        method: "POST",
        body: JSON.stringify({ messages }),
      }
    );
    const result = await response.json();
    return result;
  }

  run("@cf/mistral/mistral-7b-instruct-v0.1", "[INST] 2 + 2 ? [/INST]").then(
    (response) => {
      console.log(JSON.stringify(response));
    }
  );
  ```
  </TabItem>

  <TabItem value="cloudflare-python" label="python">
  
  ```python
  import requests

  API_BASE_URL = "https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/"
  headers = {"Authorization": "Bearer {API_TOKEN}"}

  def run(model, prompt):
    input = {
      "messages": [
        { "role": "user", "content": prompt }
      ]
    }
    response = requests.post(f"{API_BASE_URL}{model}", headers=headers, json=input)
    return response.json()

  output = run("@cf/mistral/mistral-7b-instruct-v0.1", "[INST] 2 + 2 = ? [/INST]")
  print(output)
  ```
  </TabItem>
</Tabs>

Here is the output you should receive

```python
{'result': {'response': '2 + 2 = 4.'}, 'success': True, 'errors': [], 'messages': []}
```
