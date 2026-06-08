---
title: Safety, approvals, and permissions
sidebar_position: 2
---

# Safety, approvals, and permissions

Vibe Code can read files, edit code, run shell commands, and call external tools **on your behalf**. To keep you in control of what runs and what changes, Vibe Code uses **layered controls**:

- **Agents** are configuration overrides: they bundle a system prompt, tool selection, and approval rules. They define what gets auto-approved.
- **Trusted folders** define whether Vibe can load project-level configuration, skills, and agent files from the current directory.
- **Per-tool permissions** let you tighten or loosen access for specific tools.

Vibe also asks for confirmation whenever a tool tries to read, write, or run a command **outside the current working directory**, regardless of the active agent.

This page explains how those controls work and how they interact.

<SectionTab as="h2" sectionId="agent-modes">Agents</SectionTab>

The active agent defines how Vibe asks for approval before running tools, and more broadly, can override the system prompt, the compaction prompt, the model, the available tools, and other settings.

Use one of the built-in agents below. To switch, set a default, or create your own, see Agents in the [CLI](/vibe/code/cli/agents) or the [VS Code extension](/vibe/code/vs-code-extension/agents).

| Agent | Approval behavior | Use for |
|---|---|---|
| `default` | Asks before running any tool. | Day-to-day work where you want to vet each action. |
| `plan` | Read-only. Auto-approves safe read tools, blocks edits and commands. | Exploring an unfamiliar codebase or designing an approach before any change. |
| `accept-edits` | Auto-approves file edits. Still asks for shell commands and other sensitive tools. | Larger refactors you have already scoped. |
| `auto-approve` | Auto-approves every tool execution, including shell commands. | Trusted, sandboxed environments only. **Use with care**. |

:::warning
`default_agent` only applies in interactive sessions. In **programmatic mode** (`vibe --prompt …`), Vibe falls back to `auto-approve` when `--agent` is not provided, and interactive tools such as `ask_user_question` are disabled. Pass `--agent plan` explicitly if you want a read-only programmatic run.
:::

<SectionTab as="h2" sectionId="trusted-folders">Trusted folders</SectionTab>

A project can ship its own Vibe configuration (like agents, skills, MCP servers, and tool permissions) in a `.vibe/` directory at the repository root. Because that configuration **changes how Vibe behaves**, Vibe will only load it from directories **you have explicitly trusted**.

How it works:

- When you start an interactive session in a directory that contains trustable files (such as `.vibe/config.toml`) and trust state is unknown, Vibe asks whether to trust the directory.
- Trusted directories are remembered in `~/.vibe/trusted_folders.toml`.
- If you decline or have not yet trusted a directory, project-level configuration is ignored and Vibe prints a warning. User-level configuration in `~/.vibe/` still applies.

:::tip
Before trusting a directory, treat its `.vibe/` configuration the same way you would treat any other code in the repository: review it, especially the MCP server definitions and tool permissions, since they can grant Vibe access to external services or local commands.
:::

<SectionTab as="h3" variant="secondary" sectionId="temporary-trust">Temporary trust (CLI)</SectionTab>

The `vibe --trust` flag trusts the working directory for the current invocation only and does not persist.

**Programmatic mode never prompts for trust.** Use `--trust` to grant temporary trust when scripting Vibe.

```bash
# Trust the current project for one run, then exit
vibe --trust --prompt "Run the test suite and summarize failures"
```

<SectionTab as="h2" sectionId="tool-permissions">Per-tool permissions</SectionTab>

Beyond agent modes, you can lock down or open up individual tools in `config.toml`. This applies to built-in tools (`read_file`, `write_file`, `bash`, `grep`, etc.) as well as MCP tools and connector tools.

<SectionTab as="h3" variant="secondary" sectionId="enable-disable-tools">Enable or disable tools</SectionTab>

Toggle tools globally using exact names, globs, or regex patterns:

```toml
# Only allow read-only and search tools
enabled_tools = ["read_file", "grep", "task"]

# Or disable a specific class of tools
disabled_tools = ["bash"]
```

<SectionTab as="h3" variant="secondary" sectionId="set-permissions">Set per-tool permissions</SectionTab>

Set when Vibe should ask before using a tool, or always allow it:

```toml
[tools.read_file]
permission = "always"

[tools.bash]
permission = "ask"
```

<SectionTab as="h3" variant="secondary" sectionId="bash-allow-deny">Bash allow and deny lists</SectionTab>

For the `bash` tool, you can also allow or block **specific commands**. Some safe commands (`ls`, `pwd`, `cat`, `echo`, etc.) are auto-allowed by default; add your own to extend the list:

```toml
[tools.bash]
permission = "ask"
allow = ["git status", "pnpm test"]
deny = ["rm -rf *"]
```

<SectionTab as="h3" variant="secondary" sectionId="mcp-and-connector-tools">MCP and connector tools</SectionTab>

MCP tools are addressed as `{server_name}_{tool_name}`. For example, to always allow a `get` tool exposed by an MCP server named `fetch_server`:

```toml
[tools.fetch_server_get]
permission = "always"
```

See [MCP servers](/vibe/code/cli/mcp-servers) for the full configuration model and [Configuration](/vibe/code/cli/configuration) for the precedence between user and project settings.

<SectionTab as="h2" sectionId="approval-model">Approval model</SectionTab>

The approval model is consistent across the CLI, the VS Code extension, and Vibe Code Web. How you act on approvals differs by surface:

<ExplorerTabs>
<ExplorerTab value="cli" label="CLI" default>

Approval prompts appear inline in the chat. Use the keyboard:

| Key | Action |
|---|---|
| `Enter` or `1` or `Y` | Approve the action. |
| `2`, `3`, `4` | Approve with broader scope when offered (for example, always allow this tool). |
| `N` | Reject the action. |
| `Up` / `Down` | Move between approval options. |
| `Escape` | Interrupt the agent. |

The active agent and approval style are shown in the status line. Switch mid-session with `/config` or restart with `vibe --agent <name>`.

</ExplorerTab>
<ExplorerTab value="vscode" label="VS Code extension">

Approval prompts appear inside the Mistral Vibe side panel.

| Shortcut | Action |
|---|---|
| `Mod+Y`* | Approve the tool action. |
| `Mod+Alt+Y`* | Approve an alternate option. |
| `Mod+Shift+Y`* | Apply a broader permission choice (for example, always allow). |
| `Mod+Alt+N`* | Reject the tool action. |
| `Escape` | Cancel or blur the current input state. |

**`Mod` means `Command` on macOS and `Ctrl` on Windows or Linux.*

:::info
Agent selection is available through the agent selector at the bottom of the panel (see [Agents](/vibe/code/vs-code-extension/agents)). A dedicated UI for per-tool permissions is still coming soon; in the meantime, configure them through the same `config.toml` files used by the CLI.
:::

</ExplorerTab>
<ExplorerTab value="web" label="Vibe Code Web">

Vibe Code Web runs sessions in a managed sandbox tied to a GitHub repository. Approvals appear in the browser UI, and repository-level actions (creating branches, pushing commits, opening pull requests) follow the GitHub permissions you granted when connecting the repository.

:::info
Vibe Code Web is being rolled out. Exact UI labels for approvals, the full list of sandboxed actions, and the GitHub permission scopes are being finalized. See [GitHub repositories and permissions](/vibe/code/vibe-code-web/github-repositories-permissions) and [Limits and lifecycle](/vibe/code/vibe-code-web/limits-and-lifecycle).
:::

</ExplorerTab>
</ExplorerTabs>

<SectionTab as="h2" sectionId="best-practices">Best practices</SectionTab>

- **Start in `plan` for unfamiliar code.** Explore and design before granting edit or shell access.
- **Commit before risky runs.** A clean baseline gives you an instant rollback (`git reset --hard`) when something goes wrong.
- **Use `accept-edits` for scoped refactors** and review the diff before committing.
- **Reserve `auto-approve` for disposable environments** (containers, CI runners, ephemeral VMs). Never use it on machines that hold SSH keys, cloud credentials, or production access.
- **Trust deliberately.** Review a repo's `.vibe/` configuration the first time, and again whenever it changes.
- **Tighten MCP and connector tools.** Anything touching external systems should be `permission = "ask"` even under `accept-edits`.
- **Version-control your `.vibe/` config** so the team can review and reproduce the safety decisions.
- **Revoke access you no longer need.** Vibe Code Web GitHub connections, MCP credentials, and connector authorizations should be removed when a project ends.