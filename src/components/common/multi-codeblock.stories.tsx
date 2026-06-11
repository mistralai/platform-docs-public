import type { Meta, StoryObj } from '@storybook/react';
import { Tabs as MultiCodeBlock, TabItem } from './multi-codeblock';
import { CodeBlock } from './code-block';
import React from 'react';

const meta: Meta<typeof MultiCodeBlock> = {
  title: 'Content/MultiCodeBlock',
  component: MultiCodeBlock,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiCodeBlock>;

export const TwoLanguages: Story = {
  render: () => (
    <MultiCodeBlock>
      <TabItem value="python" label="Python">
        <CodeBlock language="python">
{`from mistralai import Mistral

client = Mistral(api_key="your_api_key")
response = client.chat.complete(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`}
        </CodeBlock>
      </TabItem>
      <TabItem value="typescript" label="TypeScript">
        <CodeBlock language="typescript">
{`import Mistral from '@mistralai/mistralai';

const client = new Mistral({ apiKey: 'your_api_key' });
const response = await client.chat.complete({
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);`}
        </CodeBlock>
      </TabItem>
    </MultiCodeBlock>
  ),
};

export const ThreeLanguages: Story = {
  render: () => (
    <MultiCodeBlock>
      <TabItem value="python" label="Python">
        <CodeBlock language="python">
{`from mistralai import Mistral

client = Mistral(api_key="your_api_key")
response = client.chat.complete(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Hello!"}]
)`}
        </CodeBlock>
      </TabItem>
      <TabItem value="typescript" label="TypeScript">
        <CodeBlock language="typescript">
{`import Mistral from '@mistralai/mistralai';

const client = new Mistral({ apiKey: 'your_api_key' });
const response = await client.chat.complete({
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: 'Hello!' }],
});`}
        </CodeBlock>
      </TabItem>
      <TabItem value="curl" label="cURL">
        <CodeBlock language="bash">
{`curl https://api.mistral.ai/v1/chat/completions \\
  -H "Authorization: Bearer $MISTRAL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "mistral-large-latest", "messages": [{"role": "user", "content": "Hello!"}]}'`}
        </CodeBlock>
      </TabItem>
    </MultiCodeBlock>
  ),
};

export const WithOutput: Story = {
  render: () => (
    <MultiCodeBlock>
      <TabItem value="python" label="Python">
        <CodeBlock language="python">
{`from mistralai import Mistral

client = Mistral(api_key="your_api_key")
response = client.chat.complete(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "What is 2+2?"}]
)
print(response.choices[0].message.content)`}
        </CodeBlock>
      </TabItem>
      <TabItem value="output" label="Output">
        <CodeBlock language="json">
{`{
  "id": "cmpl-abc123",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "2 + 2 = 4"
      },
      "finish_reason": "stop"
    }
  ]
}`}
        </CodeBlock>
      </TabItem>
    </MultiCodeBlock>
  ),
};
