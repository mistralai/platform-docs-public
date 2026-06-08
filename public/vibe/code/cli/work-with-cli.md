---
title: Work with the CLI
sidebar_position: 4
---

# Work with the CLI

Once the CLI is installed and your API key is set, you're ready for day-to-day work. The CLI runs in **two modes**: *interactive* for chat and exploration, and *programmatic* for scripting and CI.

<SectionTab as="h2" sectionId="start">Start the CLI in your project</SectionTab>

Navigate to your project root and run:

```bash
vibe
```

You can also start with an initial prompt:

```bash
vibe "Refactor the main function in cli/main.py to be more modular."
```

The CLI launches a terminal chat interface. From there, you can iterate on coding tasks, reference files, run shell commands, and switch agents without leaving the terminal.

<SectionTab as="h2" sectionId="interactive-mode">Interactive mode</SectionTab>

Interactive mode is the default. Use it for exploration, multi-step tasks, and any work that benefits from review and follow-up.

<SectionTab as="h3" variant="secondary" sectionId="reference-files">Reference files with `@`</SectionTab>

Prefix a path with `@` to attach a file to your prompt. The CLI provides autocompletion as you type:

```text
> Read the file @src/agent.py and suggest improvements.
```

<SectionTab as="h3" variant="secondary" sectionId="builtin-commands">Run built-in commands with `/`</SectionTab>

Type `/` to open the slash-command picker with autocompletion. Use it for built-in commands like `/help`, `/model`, `/config`, or any command exposed by an installed skill. See [Commands and shortcuts](/vibe/code/cli/commands-shortcuts) for the full list.

```text
> /model
```

<SectionTab as="h3" variant="secondary" sectionId="shell-commands">Run shell commands with `!`</SectionTab>

Prefix a command with `!` to run it directly in your shell, bypassing the agent:

```text
> !ls -l
```

<SectionTab as="h3" variant="secondary" sectionId="cloud-session">Send a prompt to a cloud session with `&`</SectionTab>

Prefix a prompt with `&` to run it in a Vibe Code Web sandbox. The CLI returns a link to the cloud session.

```text
> & fix the failing tests
```

See [Teleport from CLI to web](/vibe/code/cli/teleport-cli-web) for prerequisites and limits.

<SectionTab as="h3" variant="secondary" sectionId="in-session-shortcuts">Useful in-session shortcuts</SectionTab>

| Shortcut | Action |
|---|---|
| `Shift+Tab` | Cycle through agents (default, plan, accept-edits, auto-approve). |
| `Ctrl+O` | Toggle the tool output view. |
| `Ctrl+G` | Edit the current input in an external editor. |
| `Escape` | Interrupt the current operation. |

See [Commands and shortcuts](/vibe/code/cli/commands-shortcuts) for the full list of slash commands and shortcuts.

<SectionTab as="h2" sectionId="programmatic-mode">Programmatic mode</SectionTab>

Programmatic mode is built for **scripting, CI jobs, and any non-interactive use**. Use the `--prompt` flag to run a single task and exit:

```bash
vibe --prompt "Analyze the codebase" --max-turns 5 --output json
```

Programmatic mode does not start the chat interface and disables interactive tools such as the question prompt. By default, it runs with the `auto-approve` agent.

Useful options:

- `--max-turns N` caps the number of assistant turns. **Recommended** to bound run length.
- `--enabled-tools TOOL` restricts which tools the agent can use. Supports exact names, glob patterns (`bash*`), and regex with the `re:` prefix (`re:^serena_.*$`).
- `--output text|json|streaming` sets the output format.

:::warning
The CLI also exposes a `--max-price DOLLARS` flag, but the underlying price values come from the config file and can be missing or outdated. Treat the reported cost as **indicative only**: do not rely on it for hard budget enforcement.
:::

<SectionTab as="h2" sectionId="approval">Choose how the CLI handles approval</SectionTab>

The CLI ships with several built-in agents. Pick one with `--agent`:

```bash
vibe --agent plan
vibe --agent accept-edits
vibe --agent auto-approve
```

Switch agents mid-session (interactive mode only) with `Shift+Tab`. Set a default interactive agent in `config.toml`:

```toml
default_agent = "plan"
```

See [Agents](/vibe/code/cli/agents) for the full list and behavior.

<SectionTab as="h2" sectionId="review-changes">Review changes before they apply</SectionTab>

For tasks with substantial file edits or shell commands, the CLI:

1. Shows a **preview** of the change or command before running it.
2. **Asks for confirmation**, unless the active agent auto-approves.
3. **Displays the result** after each step.

:::tip
Use the `plan` agent when you want a read-only walkthrough before any change is proposed. See [Agents](/vibe/code/cli/agents).
:::

<SectionTab as="h2" sectionId="trust-folders">Trust folders</SectionTab>

The CLI checks whether the current working directory is trusted before loading project-level configuration, skills, or agent files. The first time you run the CLI in **interactive mode** from a new directory that contains trustable files, it asks you to confirm the folder.

Trust enforcement applies in **both** interactive and programmatic modes, but the confirmation prompt only appears interactively. In programmatic mode, use `vibe --trust` to grant temporary trust for the current invocation only.

Trusted folders are remembered in `~/.vibe/trusted_folders.toml`.

<SectionTab as="h2" sectionId="resume">Continue or resume sessions</SectionTab>

The CLI can pick up where you left off:

- `vibe --continue` (or `-c`) resumes the most recent session.
- `vibe --resume SESSION_ID` resumes a specific session. Partial IDs are supported.
- `/resume` (or `/continue`) inside a session opens a browser of past sessions.

Session continuation requires logging, which is enabled by default. If resume stops working after editing your configuration, make sure logging is still enabled in `~/.vibe/config.toml`:

```toml
log_interactions = true
```