---
title: Teleport from CLI to web
sidebar_position: 6
---

# Teleport from CLI to web

Teleport moves a CLI session into a **Vibe Code Web sandbox** so the task can keep running without your terminal staying open. Use it when a task is long, when you want to follow it from another device, or when you want the agent to push commits and open a pull request from the cloud.

{/* TODO (devs): confirm whether Teleport is still in Preview at Vibe Code launch and update the note below accordingly. */}

:::info
Teleport is part of the Vibe Code Web sandbox flow, currently in **Preview**. Capabilities, limits, and the interface can change before general availability.
:::

<SectionTab as="h2" sectionId="prerequisites">Prerequisites</SectionTab>

Before you teleport, make sure that:

- You use an API key tied to a **Pro, Team, or Enterprise** account.
- The **[Mistral GitHub App](https://github.com/apps/mistralai/installations/new)** is installed on the repository you're working in.
- Your local session runs on a **Mistral model** (for example, Mistral Medium 3.5 or Devstral). Sessions on third-party models cannot be teleported.
- You run the CLI from inside a **Git repository**.

Upgrade to the latest CLI before you start:

```bash
uv tool upgrade mistral-vibe
```

<SectionTab as="h2" sectionId="two-ways">Two ways to use Teleport</SectionTab>

<SectionTab as="h3" variant="secondary" sectionId="single-prompt">Send a single prompt to a cloud session</SectionTab>

From inside a Git repository, prefix any prompt with `&`:

```bash
vibe
> & fix the failing tests
```

The task runs in a cloud sandbox. The CLI returns a Vibe Code Web URL where you can follow the session.

<SectionTab as="h3" variant="secondary" sectionId="move-session">Move an in-progress local session to the cloud</SectionTab>

Inside an active local session, run:

```text
/teleport
```

The session continues in Vibe Code Web, powered by Mistral Medium 3.5. You can monitor it from any device signed in to Vibe.

<SectionTab as="h2" sectionId="what-happens">What happens after Teleport</SectionTab>

When the cloud session runs, the agent typically:

1. **Clones your repository** into the sandbox.
2. **Works through the task**: reads files, runs commands, edits code.
3. **Streams progress** into Vibe Code Web in real time.
4. **Asks clarifying questions** when needed.
5. **Pushes a branch and opens a draft pull request** when done.

Commits, branches, and pull requests created during the run stay in your repository. The sandbox is deleted when the session ends.

<SectionTab as="h2" sectionId="limits">Limits</SectionTab>

| Limit | Value |
|---|---|
| Maximum session duration | 24 hours |
| Inactivity timeout (waiting for your reply) | 3 hours |
| Individual command timeout | 30 seconds |
| Concurrent sessions per user | Plan-dependent |

<SectionTab as="h2" sectionId="caveats">Known caveats</SectionTab>

- **Teleport is one-way.** Once a session moves to the cloud, you can't pull it back into the local CLI. Continue from Vibe Code Web.
- **Only works from inside a Git repository.** Running it from a non-code directory fails.
- **Cloud sessions run on Mistral Medium 3.5**, regardless of the local model.