---
title: Agents
sidebar_position: 2
---

# Agents

Agents are **configuration overrides** applied on top of the global config. They bundle a system prompt, a compaction prompt, an active model, an available tool set, and approval rules. The VS Code extension uses the same agent system as the CLI, with one additional `Chat` mode for tool-free conversation.

<SectionTab as="h2" sectionId="built-in-agents">Built-in agents</SectionTab>

| Agent | Behavior |
|---|---|
| `Default` | General-purpose agent. Asks for approval before running tools. |
| `Plan` | Read-only agent for exploration and planning. Auto-approves safe read tools. |
| `Accept Edits` | Auto-approves file edits in the working directory. Still asks for approval for other actions (for example, shell commands). |
| `Auto Approve` | Auto-approves all tool execution. Use **only in a trusted, sandboxed environment**: this agent can run arbitrary commands such as `rm -rf` against any path Vibe can reach. |
| `Chat` | Conversation-only mode with no tool execution. |

<SectionTab as="h2" sectionId="select">Select an agent</SectionTab>

Click the agent selector at the bottom of the Mistral Vibe panel to pick an agent from the dropdown. The list includes all built-in and custom agents available in your configuration.

You can also cycle through agents on the fly with `Shift+Tab`, the same shortcut as the CLI.

The selector defaults to `Default` and the selection persists for the session.

<SectionTab as="h2" sectionId="custom-agents">Custom agents</SectionTab>

The VS Code extension reads the same agent definitions as the CLI from `~/.vibe/agents/` (user-level) and `./.vibe/agents/` (project-level). Custom agents declared there appear in the selector alongside the built-ins.

See the [CLI Agents reference](/vibe/code/cli/agents) for the full configuration schema, examples, and the difference between `agent_type = "agent"` and `agent_type = "subagent"`.