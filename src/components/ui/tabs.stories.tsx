import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import React from 'react';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="python">
      <TabsList>
        <TabsTrigger value="python">Python</TabsTrigger>
        <TabsTrigger value="typescript">TypeScript</TabsTrigger>
        <TabsTrigger value="curl">cURL</TabsTrigger>
      </TabsList>
      <TabsContent value="python" className="p-4">
        <code className="font-mono text-sm">pip install mistralai</code>
      </TabsContent>
      <TabsContent value="typescript" className="p-4">
        <code className="font-mono text-sm">npm install @mistralai/mistralai</code>
      </TabsContent>
      <TabsContent value="curl" className="p-4">
        <code className="font-mono text-sm">curl https://api.mistral.ai/v1/chat/completions</code>
      </TabsContent>
    </Tabs>
  ),
};

export const AllListVariants: Story = {
  render: () => (
    <div className="space-y-8">
      {(['default', 'secondary', 'code', 'tertiary'] as const).map((variant) => (
        <div key={variant}>
          <p className="text-sm font-mono text-muted-foreground mb-2">variant=&quot;{variant}&quot;</p>
          <Tabs defaultValue="tab1">
            <TabsList variant={variant}>
              <TabsTrigger variant={variant} value="tab1">Overview</TabsTrigger>
              <TabsTrigger variant={variant} value="tab2">Parameters</TabsTrigger>
              <TabsTrigger variant={variant} value="tab3">Response</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-4">
              <p className="text-sm text-muted-foreground">Overview content</p>
            </TabsContent>
            <TabsContent value="tab2" className="p-4">
              <p className="text-sm text-muted-foreground">Parameters content</p>
            </TabsContent>
            <TabsContent value="tab3" className="p-4">
              <p className="text-sm text-muted-foreground">Response content</p>
            </TabsContent>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

export const CodeTabs: Story = {
  render: () => (
    <Tabs defaultValue="python">
      <TabsList variant="code">
        <TabsTrigger variant="code" size="sm" value="python">Python</TabsTrigger>
        <TabsTrigger variant="code" size="sm" value="typescript">TypeScript</TabsTrigger>
        <TabsTrigger variant="code" size="sm" value="curl">cURL</TabsTrigger>
      </TabsList>
      <TabsContent value="python" className="bg-code-background text-code-foreground p-4 rounded-b-lg">
        <pre className="font-mono text-sm">
{`from mistralai import Mistral

client = Mistral(api_key="your_api_key")
response = client.chat.complete(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Hello!"}]
)`}
        </pre>
      </TabsContent>
      <TabsContent value="typescript" className="bg-code-background text-code-foreground p-4 rounded-b-lg">
        <pre className="font-mono text-sm">
{`import Mistral from '@mistralai/mistralai';

const client = new Mistral({ apiKey: 'your_api_key' });
const response = await client.chat.complete({
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: 'Hello!' }],
});`}
        </pre>
      </TabsContent>
      <TabsContent value="curl" className="bg-code-background text-code-foreground p-4 rounded-b-lg">
        <pre className="font-mono text-sm">
{`curl https://api.mistral.ai/v1/chat/completions \\
  -H "Authorization: Bearer $MISTRAL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "mistral-large-latest", "messages": [{"role": "user", "content": "Hello!"}]}'`}
        </pre>
      </TabsContent>
    </Tabs>
  ),
};
