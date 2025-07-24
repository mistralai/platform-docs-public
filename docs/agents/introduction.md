---
id: agents_introduction
title: Introduction
slug: agents_introduction
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What are AI agents?

<div style={{ textAlign: 'center' }}>
  <img
    src="/img/agent_overview.png"
    alt="agent_introduction"
    width="600"
    style={{ borderRadius: '15px' }}
  />
</div>

AI agents are autonomous systems powered by large language models (LLMs) that, given high-level instructions, can plan, use tools, carry out processing steps, and take actions to achieve specific goals. These agents leverage advanced natural language processing capabilities to understand and execute complex tasks efficiently and can even collaborate with each other to achieve more sophisticated outcomes.

Our Agents and Conversations API allows developers to build such agents, leveraging multiple features such as:
- Multiple mutlimodal models available, **text and vision models**.
- **Persistent state** across conversations.
- Ability to have conversations with **base models**, **a single agent**, and **multiple agents**.
- Built-in connector tools for **code execution**, **web search**, **image generation** and **document library** out of the box.
- **Handoff capability** to use different agents as part of a workflow, allowing agents to call other agents.
- Features supported via our chat completions endpoint are also supported, such as:
  - **Structured Outputs**
  - **Document Understanding**
  - **Tool Usage**
  - **Citations**

## More Information
- [Agents & Conversations](../agents_basics): Basic explanations and code snippets around our Agents and Conversations API.
- [Connectors](../connectors/connectors): Make your tools accessible directly to any Agents.
  - [Websearch](../connectors/websearch): In-depth explanation of our web search built-in connector tool.
  - [Code Interpreter](../connectors/code_interpreter): In-depth explanation of our code interpreter for code execution built-in connector tool.
  - [Image Generation](../connectors/image_generation): In-depth explanation of our image generation built-in connector tool.
  - [Document Library (Beta)](../connectors/document_library): A RAG built-in connector enabling Agents to access a library of documents.
- [MCP](../mcp): How to use [MCP](../../capabilities/function_calling) (Model Context Protocol) servers with Agents.
- [Function Calling](../function_calling): How to use [Function calling](../../capabilities/function_calling) with Agents.
- [Handoffs](../handoffs): Relay tasks and use other agents as tools in agentic workflows.

## Cookbooks
For more information and guides on how to use our Agents, we have the following cookbooks:
- [Github Agent](https://github.com/mistralai/cookbook/tree/main/mistral/agents/agents_api/github_agent)
- [Linear Tickets](https://github.com/mistralai/cookbook/tree/main/mistral/agents/agents_api/prd_linear_ticket)
- [Financial Analyst](https://github.com/mistralai/cookbook/tree/main/mistral/agents/agents_api/financial_analyst)
- [Travel Assistant](https://github.com/mistralai/cookbook/tree/main/mistral/agents/agents_api/travel_assistant)
- [Food Diet Companion](https://github.com/mistralai/cookbook/tree/main/mistral/agents/agents_api/food_diet_companion)

## FAQ

- **Which models are supported?**

  Currently, only `mistral-medium-latest` and `mistral-large-latest` are supported, but we will soon enable it for more models.
