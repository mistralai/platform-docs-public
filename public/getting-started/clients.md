---
id: clients
title: SDK Clients
sidebar_position: 1.5
---

import {
  ExplorerTabs,
  ExplorerTabItem,
} from '@/components/common/explorer-tabs';

# SDK Clients

SDK Clients allow you to interact with Mistral AI's API in your preferred programming language, they implement clean and simple interfaces to our API endpoints and services.
We strongly recommend using the official SDKs to interact with our APIs.

<SectionTab as="h1" sectionId="sdks">SDKs</SectionTab>

We provide official SDK clients in both Python and Typescript, you can also find third-party non-official SDKs in other languages.

<ExplorerTabs id="sdks">
  <ExplorerTabItem value="python-sdk" label="Python SDK">
    <ExplorerTabs id="python-sdk-sections">
      <ExplorerTabItem value="install" label="Install">
        You can install our [Python Client](https://github.com/mistralai/client-python) by running:

<Tabs groupId="code">
    <TabItem value="python" label="Bash" default>
        <Tabs groupId="sdk-version">
            <TabItem value="v1" label="V1" default>

```bash
pip install "mistralai<2"
```

            </TabItem>
            <TabItem value="v2" label="V2">

```bash
pip install mistralai
```

            </TabItem>
        </Tabs>
    </TabItem>
</Tabs>

Once installed, you can for example run the chat completion as follows:
<Tabs groupId="code">
    <TabItem value="python" label="python" default>
        <Tabs groupId="sdk-version">
            <TabItem value="v1" label="V1" default>

```python
import os
from mistralai.client import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-medium-latest"

client = Mistral(api_key=api_key)

chat_response = client.chat.complete(
    model = model,
    messages = [
        {
            "role": "user",
            "content": "What is the best French cheese?",
        },
    ]
)
```

            </TabItem>
            <TabItem value="v2" label="V2">

```python
import os
from mistralai.client import Mistral

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-medium-latest"

client = Mistral(api_key=api_key)

chat_response = client.chat.complete(
    model = model,
    messages = [
        {
            "role": "user",
            "content": "What is the best French cheese?",
        },
    ]
)
```

            </TabItem>
        </Tabs>
    </TabItem>
    <TabItem value="output" label="output">

```json
{
  "id": "7c163b08d98e4eebb35564ae14ffe6e4",
  "created": 1756130273,
  "model": "mistral-medium-latest",
  "usage": {
    "prompt_tokens": 10,
    "total_tokens": 1160,
    "completion_tokens": 1150
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "The \"best\" French cheese is highly subjective—it depends on personal taste, texture preferences, and how you plan to enjoy it (on a cheese board, melted, in cooking, etc.). However, here are some of the most **iconic, beloved, and award-winning French cheeses**, each celebrated for its unique qualities:\n\n### **Top Contenders for \"Best\" French Cheese**\n1. **Comté** (AOP)\n   - **Why?** A versatile, nutty, and complex **alpine cheese** aged 4 months to 3+ years. Younger Comté is mild and buttery; aged versions develop crystalline crunch and deep caramelized flavors.\n   - **Best for:** Cheese boards, fondue, grilled cheese, or eating plain.\n   - **Fun fact:** Made in the Jura Mountains, each wheel is unique based on the terroir and aging.\n\n2. **Roquefort** (AOP)\n   - **Why?** The **king of blue cheeses**, made from sheep’s milk and aged in natural caves. Creamy, tangy, and intensely flavorful with a sharp, salty bite.\n   - **Best for:** Spread on bread with honey or pears, in salads, or sauces.\n   - **Fun fact:** One of the oldest cheeses in France (mentioned by Pliny the Elder in 79 AD).\n\n3. **Camembert de Normandie** (AOP)\n   - **Why?** The **quintessential French cheese**—creamy, earthy, and slightly mushroomy when ripe. Invented in 1791 by Marie Harel.\n   - **Best for:** Baked (Camembert en croûte), with crusty bread, or apples.\n   - **Pro tip:** Eat it at room temperature when the center is soft but not runny.\n\n4. **Époisses de Bourgogne** (AOP)\n   - **Why?** A **pungent, washed-rind cheese** with a velvety texture and bold, barnyardy flavor. Napoleon reportedly loved it.\n   - **Best for:** Spreading on bread or pairing with Burgundy wine.\n   - **Warning:** So strong it’s banned on French public transport!\n\n5. **Reblochon** (AOP)\n   - **Why?** The **star of tartiflette**—creamy, nutty, and slightly smoky. Made in the Alps with raw cow’s milk.\n   - **Best for:** Melting in tartiflette, raclette, or on potatoes.\n\n6. **Brie de Meaux** (AOP)\n   - **Why?** The **\"King of Cheeses\"** (as declared at the 1815 Congress of Vienna). Rich, buttery, and mushroomy with a soft rind.\n   - **Best for:** Pairing with Champagne or fruit (grapes, figs).\n\n7. **Munster (Munster-Géromé)** (AOP)\n   - **Why?** A **stinky, washed-rind cheese** from Alsace with a creamy, tangy interior. Often served with cumin.\n   - **Best for:** Melting in tarts or eating with beer.\n\n8. **Beaufort** (AOP)\n   - **Why?** A **firm, nutty alpine cheese** similar to Gruyère but richer. Aged versions are caramelized and complex.\n   - **Best for:** Fondue, gratins, or shaving over salads.\n\n9. **Pélardon** (AOP)\n   - **Why?** A **small, tangy goat cheese** from the Cévennes or Provence. Comes in fresh (soft) or aged (firm, peppery) varieties.\n   - **Best for:** Salads, tartines, or grilled with herbs.\n\n10. **Bleu d’Auvergne** (AOP)\n   - **Why?** A **creamy, spicy blue cheese** with a sharper taste than Roquefort but less crumbly.\n   - **Best for:** Dressings, burgers, or cheese plates with walnuts.\n\n### **How to Choose?**\n- **Mild & creamy?** → Brie de Meaux, Camembert, Saint-André.\n- **Bold & stinky?** → Époisses, Munster, Pont-l’Évêque.\n- **Nutty & firm?** → Comté, Beaufort, Cantal.\n- **Blue cheese lover?** → Roquefort, Bleu d’Auvergne.\n- **Goat cheese fan?** → Crottin de Chavignol, Pélardon, Valençay.\n\n### **Pro Tips for Enjoying French Cheese**\n- **Serve at room temperature** (take it out of the fridge 1–2 hours before eating).\n- **Pair with wine**: Brie + Champagne, Roquefort + Sauternes, Comté + Jura wine.\n- **Avoid plastic wrap**—store in cheese paper or a breathable container.\n- **Visit a *fromagerie*** in France for expert recommendations!\n\n### **Final Verdict**\nIf forced to pick **one \"best\"**, **Comté** (aged 24+ months) and **Roquefort** are often crowned for their depth and versatility. But the true joy of French cheese is in the **diversity**—so try them all!\n\n**What’s your favorite?** 😊🧀"
      }
    }
  ]
}
```

    </TabItem>
</Tabs>

See more examples [here](https://github.com/mistralai/client-python/tree/main/examples).
      </ExplorerTabItem>
      <ExplorerTabItem value="migration" label="Migrate from V1">
        Version 2.0.0 of the Python SDK introduces a small number of breaking changes. All other APIs (chat, streaming, embeddings, agents, function calling, batch…) are unchanged.

### Update the package

SDK V1 corresponds to `mistralai<2` and V2 to `mistralai>=2`. Run:

```bash
pip install "mistralai>=2"
```

### Update the import path

**Before (V1):**

```python
from mistralai.client import Mistral
```

**After (V2):**

```python
from mistralai.client import Mistral
```

### Azure AI (if applicable)

**Before (V1):**

```python
# pip install mistralai-azure>=1.0.0
from mistralai_azure import MistralAzure

client = MistralAzure(
    azure_endpoint=os.environ["AZUREAI_ENDPOINT"],
    azure_api_key=os.environ["AZUREAI_API_KEY"],
)
```

**After (V2):**

```python
# pip install mistralai>=2.0.0
from mistralai.azure.client import MistralAzure

client = MistralAzure(
    server_url=os.environ["AZUREAI_ENDPOINT"],
    api_key=os.environ["AZUREAI_API_KEY"],
)
```

### Google Cloud / Vertex AI (if applicable)

**Before (V1):**

```python
# pip install mistralai[gcp]
from mistralai_gcp import MistralGoogleCloud

client = MistralGoogleCloud(
    region=os.environ["GOOGLE_CLOUD_REGION"],
    project_id=os.environ["GOOGLE_CLOUD_PROJECT_ID"],
)
```

**After (V2):**

```python
# pip install mistralai>=2.0.0  (no separate package needed)
from mistralai.gcp.client import MistralGCP

# Auth is handled automatically via google.auth.default()
# Region defaults to "europe-west4"; override if needed:
# client = MistralGCP(region="us-central1", project_id="my-project")
client = MistralGCP()
```

### Summary

| Area | V1 | V2 |
| :--- | :--- | :--- |
| Package | `mistralai<2` | `mistralai>=2` |
| Core import | `from mistralai import Mistral` | `from mistralai.client import Mistral` |
| Azure import | `from mistralai_azure import MistralAzure` | `from mistralai.azure.client import MistralAzure` |
| Azure constructor | `azure_endpoint=`, `azure_api_key=` | `server_url=`, `api_key=` |
| GCP import | `from mistralai_gcp import MistralGoogleCloud` | `from mistralai.gcp.client import MistralGCP` |
| GCP auth | `GOOGLE_CLOUD_REGION` + `GOOGLE_CLOUD_PROJECT_ID` env vars | automatic via `google.auth.default()` |
| All other APIs | — | unchanged |
      </ExplorerTabItem>
    </ExplorerTabs>
  </ExplorerTabItem>
  <ExplorerTabItem value="typescript-sdk" label="Typescript SDK">
    You can install our [Typescript Client](https://github.com/mistralai/client-ts) in your project using:

<Tabs groupId="code">
    <TabItem value="typescript" label="Bash" default>

```bash
npm install @mistralai/mistralai
```

    </TabItem>
</Tabs>

Once installed, you can run the chat completion:

<Tabs groupId="code">
    <TabItem value="typescript" label="typescript" default>

```typescript

const apiKey = process.env.MISTRAL_API_KEY || 'your_api_key';

const client = new Mistral({apiKey: apiKey});

const chatResponse = await client.chat.complete({
  model: 'mistral-medium-latest',
  messages: [{role: 'user', content: 'What is the best French cheese?'}],
});
```

    </TabItem>
    <TabItem value="output" label="output">

```json
{
  "id": "7c163b08d98e4eebb35564ae14ffe6e4",
  "created": 1756130273,
  "model": "mistral-medium-latest",
  "usage": {
    "prompt_tokens": 10,
    "total_tokens": 1160,
    "completion_tokens": 1150
  },
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "tool_calls": null,
        "content": "The \"best\" French cheese is highly subjective—it depends on personal taste, texture preferences, and how you plan to enjoy it (on a cheese board, melted, in cooking, etc.). However, here are some of the most **iconic, beloved, and award-winning French cheeses**, each celebrated for its unique qualities:\n\n### **Top Contenders for \"Best\" French Cheese**\n1. **Comté** (AOP)\n   - **Why?** A versatile, nutty, and complex **alpine cheese** aged 4 months to 3+ years. Younger Comté is mild and buttery; aged versions develop crystalline crunch and deep caramelized flavors.\n   - **Best for:** Cheese boards, fondue, grilled cheese, or eating plain.\n   - **Fun fact:** Made in the Jura Mountains, each wheel is unique based on the terroir and aging.\n\n2. **Roquefort** (AOP)\n   - **Why?** The **king of blue cheeses**, made from sheep’s milk and aged in natural caves. Creamy, tangy, and intensely flavorful with a sharp, salty bite.\n   - **Best for:** Spread on bread with honey or pears, in salads, or sauces.\n   - **Fun fact:** One of the oldest cheeses in France (mentioned by Pliny the Elder in 79 AD).\n\n3. **Camembert de Normandie** (AOP)\n   - **Why?** The **quintessential French cheese**—creamy, earthy, and slightly mushroomy when ripe. Invented in 1791 by Marie Harel.\n   - **Best for:** Baked (Camembert en croûte), with crusty bread, or apples.\n   - **Pro tip:** Eat it at room temperature when the center is soft but not runny.\n\n4. **Époisses de Bourgogne** (AOP)\n   - **Why?** A **pungent, washed-rind cheese** with a velvety texture and bold, barnyardy flavor. Napoleon reportedly loved it.\n   - **Best for:** Spreading on bread or pairing with Burgundy wine.\n   - **Warning:** So strong it’s banned on French public transport!\n\n5. **Reblochon** (AOP)\n   - **Why?** The **star of tartiflette**—creamy, nutty, and slightly smoky. Made in the Alps with raw cow’s milk.\n   - **Best for:** Melting in tartiflette, raclette, or on potatoes.\n\n6. **Brie de Meaux** (AOP)\n   - **Why?** The **\"King of Cheeses\"** (as declared at the 1815 Congress of Vienna). Rich, buttery, and mushroomy with a soft rind.\n   - **Best for:** Pairing with Champagne or fruit (grapes, figs).\n\n7. **Munster (Munster-Géromé)** (AOP)\n   - **Why?** A **stinky, washed-rind cheese** from Alsace with a creamy, tangy interior. Often served with cumin.\n   - **Best for:** Melting in tarts or eating with beer.\n\n8. **Beaufort** (AOP)\n   - **Why?** A **firm, nutty alpine cheese** similar to Gruyère but richer. Aged versions are caramelized and complex.\n   - **Best for:** Fondue, gratins, or shaving over salads.\n\n9. **Pélardon** (AOP)\n   - **Why?** A **small, tangy goat cheese** from the Cévennes or Provence. Comes in fresh (soft) or aged (firm, peppery) varieties.\n   - **Best for:** Salads, tartines, or grilled with herbs.\n\n10. **Bleu d’Auvergne** (AOP)\n   - **Why?** A **creamy, spicy blue cheese** with a sharper taste than Roquefort but less crumbly.\n   - **Best for:** Dressings, burgers, or cheese plates with walnuts.\n\n### **How to Choose?**\n- **Mild & creamy?** → Brie de Meaux, Camembert, Saint-André.\n- **Bold & stinky?** → Époisses, Munster, Pont-l’Évêque.\n- **Nutty & firm?** → Comté, Beaufort, Cantal.\n- **Blue cheese lover?** → Roquefort, Bleu d’Auvergne.\n- **Goat cheese fan?** → Crottin de Chavignol, Pélardon, Valençay.\n\n### **Pro Tips for Enjoying French Cheese**\n- **Serve at room temperature** (take it out of the fridge 1–2 hours before eating).\n- **Pair with wine**: Brie + Champagne, Roquefort + Sauternes, Comté + Jura wine.\n- **Avoid plastic wrap**—store in cheese paper or a breathable container.\n- **Visit a *fromagerie*** in France for expert recommendations!\n\n### **Final Verdict**\nIf forced to pick **one \"best\"**, **Comté** (aged 24+ months) and **Roquefort** are often crowned for their depth and versatility. But the true joy of French cheese is in the **diversity**—so try them all!\n\n**What’s your favorite?** 😊🧀"
      }
    }
  ]
}
```

    </TabItem>
</Tabs>

See more examples [here](https://github.com/mistralai/client-js/tree/main/examples).
  </ExplorerTabItem>
  <ExplorerTabItem value="third-party-sdks" label="Third-party SDKs">
    Here are some **clients built by the community** for various other languages:

This section lists third-party clients in other languages provided by the community.
Please note that these clients are not actively maintained or supported by Mistral AI.
We recommend reaching out to the respective maintainers for any assistance or inquiries.

| Language       | Repository Links                                                                 |      |
|----------------|----------------------------------------------------------------------------------|------|
| CLI            | https://github.com/icebaker/ruby-nano-bots                 |      |
| Dart           | https://github.com/nomtek/mistralai_client_dart  |      |
| Elixir         | https://github.com/axonzeta/mistral_elixir            |      |
| Go             | https://github.com/Gage-Technologies/mistral-go  |      |
| Java           | https://github.com/langchain4j/langchain4j | https://github.com/spring-projects/spring-ai|
| JavaScript/TS  | https://github.com/vercel/ai                                    |      |
| PHP            | https://github.com/HelgeSverre/mistral | https://github.com/partITech/php-mistral |
| Ruby           | https://github.com/gbaptista/mistral-ai | https://github.com/wilsonsilva/mistral |
| Rust           | https://github.com/ivangabriele/mistralai-client-rs ||
  </ExplorerTabItem>
</ExplorerTabs>