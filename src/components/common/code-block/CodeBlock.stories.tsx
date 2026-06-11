import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from './index';
import React from 'react';

const meta: Meta<typeof CodeBlock> = {
  title: 'Content/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const Python: Story = {
  args: {
    language: 'python',
    children: `from mistralai import Mistral

client = Mistral(api_key="your_api_key")

response = client.chat.complete(
    model="mistral-large-latest",
    messages=[
        {"role": "user", "content": "What is the best French cheese?"}
    ]
)

print(response.choices[0].message.content)`,
  },
};

export const TypeScript: Story = {
  args: {
    language: 'typescript',
    children: `import Mistral from '@mistralai/mistralai';

const client = new Mistral({ apiKey: 'your_api_key' });

const response = await client.chat.complete({
  model: 'mistral-large-latest',
  messages: [
    { role: 'user', content: 'What is the best French cheese?' },
  ],
});

console.log(response.choices[0].message.content);`,
  },
};

export const Bash: Story = {
  args: {
    language: 'bash',
    children: `curl https://api.mistral.ai/v1/chat/completions \\
  -H "Authorization: Bearer $MISTRAL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "mistral-large-latest",
    "messages": [
      {"role": "user", "content": "What is the best French cheese?"}
    ]
  }'`,
  },
};

export const JSON: Story = {
  args: {
    language: 'json',
    children: `{
  "id": "cmpl-abc123",
  "object": "chat.completion",
  "model": "mistral-large-latest",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Among French cheeses, Comté is often considered one of the finest."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 14,
    "completion_tokens": 42,
    "total_tokens": 56
  }
}`,
  },
};

export const WithFilename: Story = {
  args: {
    language: 'python',
    filename: 'chat.py',
    children: `from mistralai import Mistral

client = Mistral(api_key="your_api_key")
response = client.chat.complete(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Hello!"}]
)`,
  },
};

export const WithLineNumbers: Story = {
  args: {
    language: 'typescript',
    showLineNumbers: true,
    children: `import Mistral from '@mistralai/mistralai';

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

async function chat(prompt: string) {
  const response = await client.chat.complete({
    model: 'mistral-large-latest',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content;
}`,
  },
};

export const WithHighlight: Story = {
  args: {
    language: 'python',
    highlight: '3,5-8',
    children: `from mistralai import Mistral

client = Mistral(api_key="your_api_key")

response = client.chat.complete(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Hello!"}],
    temperature=0.7,
)

print(response.choices[0].message.content)`,
  },
};
