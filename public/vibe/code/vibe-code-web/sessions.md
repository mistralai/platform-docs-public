---
title: Sessions
sidebar_position: 3
---

# Sessions

A **session** is one run of the Vibe Code agent against a project: a sandbox provisioned for the task, the agent loop that does the work, and the branch or pull request it leaves behind. This page covers how sessions start, what happens inside, and what persists once they end.

<SectionTab as="h2" sectionId="how-sessions-start">How sessions start</SectionTab>

A session begins from one of three entry points:

- **From the web**: click **New session** inside a project. See the [Quickstart / Web](/vibe/code/vibe-code-web/get-started#quickstart).
- **From the Vibe CLI**: prefix a prompt with `&` to send it to a cloud session. See the [Quickstart / CLI](/vibe/code/vibe-code-web/get-started#quickstart).
- **By teleporting an active CLI session**: run `/teleport` inside the active local session. The same session continues in the cloud, with its history and branch state preserved.

:::tip
Teleport is the cleanest way to escape a local session that has become too long to run on your laptop. The cloud sandbox takes over with the same history and branch. See [Teleport from CLI to web](/vibe/code/cli/teleport-cli-web).
:::

Once a session exists, the same lifecycle applies regardless of entry point.

<SectionTab as="h2" sectionId="sandbox-creation">Sandbox creation</SectionTab>

When you create a session, Vibe Code Web provisions an **isolated cloud sandbox** for that run. The sandbox is single-tenant for the duration of the session: nothing from your other sessions or other users runs in it.

The sandbox has:

- A scoped shell.
- Access to the selected GitHub repositories (read and write, via your user access token).
- A network egress policy. See [Sandbox environment](/vibe/code/vibe-code-web/sandbox-environment#network-posture).

The sandbox is deleted when the session ends.

:::note
This section describes the sandbox from the session's perspective. See [Sandbox environment](/vibe/code/vibe-code-web/sandbox-environment) for what runs inside it and how it behaves.
:::

<SectionTab as="h2" sectionId="repository-checkout">Repository checkout</SectionTab>

The agent clones the repositories selected for the project, on the branch you chose at session creation. A project can include one or more repositories, all from the same GitHub owner. The clone uses the Mistral GitHub App's user access token, so all subsequent Git operations (commits, branches, pushes) are attributed to you.

<SectionTab as="h2" sectionId="agent-loop">Agent loop</SectionTab>

Inside the sandbox, the agent runs a loop:

1. **Read** files relevant to your prompt.
2. **Plan** the next action.
3. **Edit** code or **run a command** (shell, tests, build).
4. **Report** back to the session view (commands, file changes, intermediate output).
5. **Ask** if it needs clarification, then **wait** for your reply.

<div className="[&>div>img]:!border-0 [&>div>img]:!rounded-none [&>div>img]:!shadow-none">
<Image
  url={'/img/vibe_code_web_agent_loop.svg'}
  alt="Flow diagram of the Vibe Code agent loop with five steps (Read, Plan, Act, Report, Ask) and a loop arrow back to Read"
  centered
  className="border-none!"
/>
</div>

:::info
The loop continues until the task reaches a natural stopping point, the agent asks a question, or a limit is reached. See [Limits and lifecycle](/vibe/code/vibe-code-web/limits-and-lifecycle) for details.
:::

<SectionTab as="h2" sectionId="what-you-see">What you see during a session</SectionTab>

The session view shows:

| Element | What it shows |
|---|---|
| **Activity stream** | Commands the agent runs, with output, in chronological order. |
| **File changes** | The list of files the agent has touched during the session. |
| **Branch state** | The current branch the agent is committing to. |
| **Pull request** | Once the agent opens a pull request, a link to it in GitHub. |
| **Prompt input** | Where you reply to clarifying questions or send a follow-up. |

The activity stream is **your audit log**: every command and file change is visible while the session is alive.

:::tip
Vibe Code Web helps you follow session progress and open the resulting branch or pull request. Detailed code review, comments, required checks, and merge decisions **happen in GitHub**.
:::
<SectionTab as="h2" sectionId="output">Branch and pull request output</SectionTab>

When the agent finishes, the result is materialized as:

- A **branch** on the target repository, with the agent's commits.
- A **pull request** opened against the base branch, with a description summarizing the work.

The pull request is yours to review, edit, merge, or close using your normal GitHub workflow. Branch protections, required reviews, `CODEOWNERS` rules, and required status checks apply.

<SectionTab as="h2" sectionId="iteration">Iteration after a pull request</SectionTab>

A pushed pull request does not end the session automatically. You can send follow-up prompts while the session and sandbox are active:

- Send a follow-up prompt in the session view.
- Paste a reviewer comment and ask the agent to address it.
- Paste a failing CI output and ask the agent to fix it.

The agent reuses the same sandbox and branch, so context is preserved across iterations.

:::warning
Once the sandbox is deprovisioned, the session **cannot be resumed**. To continue, start a new session.
:::

<SectionTab as="h2" sectionId="next">Next steps</SectionTab>

<UsefullLinkContainer>
  <LinkCard href="/vibe/code/vibe-code-web/sandbox-environment" title="Sandbox environment" description="What the cloud image includes and what's configurable today." />
  <LinkCard href="/vibe/code/vibe-code-web/security" title="Security" description="Prompt-injection risk and data handling." />
  <LinkCard href="/vibe/code/vibe-code-web/limits-and-lifecycle" title="Limits and lifecycle" description="Session lifecycle, end states, and persistence." />
</UsefullLinkContainer>