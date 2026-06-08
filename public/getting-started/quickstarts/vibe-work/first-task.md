---
title: Run your first Vibe Work task
sidebar_label: Run your first task
sidebar_position: 1
description: "Open Vibe Work, run a small multi-step task end-to-end, and review the result. ~5 minutes."
---

# Run your first Vibe Work task

Run a small end-to-end task in <AppLink href="https://chat.mistral.ai/work" app="vibe">Work</AppLink> to learn the core loop: describe an outcome, watch the live todos, approve sensitive actions, review the result.

By the end you'll have one completed task in your history and a clear sense of when to use Work for the rest of your day.

**Time to complete:** ~5 minutes

<SectionTab as="h2" sectionId="prerequisites">Prerequisites</SectionTab>

- A Mistral account. The Free plan is enough to try Vibe Work. <AppLink href="https://chat.mistral.ai">Create account</AppLink>.

<SectionTab as="h2" sectionId="step-1">Step 1: Open Vibe and switch to Work</SectionTab>

1. Open <AppLink href="https://chat.mistral.ai/work" app="vibe">chat.mistral.ai</AppLink>.
2. If the sidebar is closed, click the drawer icon or press `Cmd+Shift+B` on macOS (`Ctrl+Shift+B` on Windows and Linux).
3. In the sidebar, select **Work** from the mode selector.

Vibe remembers the last tab you selected. If **Chat** or **Code** opens by default, switch to **Work** before starting the task.

<SectionTab as="h2" sectionId="step-2">Step 2: Describe the outcome you want</SectionTab>

Type a task in plain language. Be specific about the result, the source material, and any constraints. Try this one:

> Find the three most-discussed AI announcements from the past week, summarize each in two sentences, and give me a short take on what they mean for a non-technical audience.

Work breaks the request into steps and starts. It picks the tools it needs (Web Search here) without asking.

<SectionTab as="h2" sectionId="step-3">Step 3: Watch Work run</SectionTab>

Work starts immediately and streams its progress live in the conversation. You see reasoning chunks as it thinks, tool calls as they happen (for example a Web Search), the results coming back, more reasoning, more searches if needed, and finally a summary with the answer.

While the task runs you can:

- **Read each step** as it appears to see what Work is doing.
- **Stop** the task with the black square button if it goes the wrong direction.
- **Send a follow-up message** to redirect or refine while the task is in progress.

:::info
For more complex tasks, Work may display a **todos panel** on the right with each step ticked off live, ask **clarifying questions** before acting, and pause to ask for **approval** before running tools that touch your data, calendar, or external apps. See [Safety and approvals](/vibe/work/safety-and-approvals) for the full approval model.
:::

<SectionTab as="h2" sectionId="step-4">Step 4: Review the result</SectionTab>

When Work finishes, it posts the answer in the conversation. Treat it as a draft until you verify it:

- Read the final summary.
- Check facts, dates, and source links.
- Ask Work to revise if the tone, length, or framing is off. For example:

> Rewrite this for a CFO audience, keep it under 150 words.

<SectionTab as="h2" sectionId="verify">Verify</SectionTab>

You completed your first Work task if:

- The conversation appears in your sidebar history.
- The todos panel shows steps with checkmarks.
- The final answer cites sources you can click through to.

<SectionTab as="h2" sectionId="whats-next">What's next</SectionTab>

<UsefullLinkContainer>

  <LinkCard href="/getting-started/quickstarts/vibe-work/analyze-data" title="Analyze a dataset" />
  <LinkCard href="/getting-started/quickstarts/vibe-work/create-first-skill" title="Create your first Skill" />
  <LinkCard href="/vibe/work/get-started" title="Get started with Vibe Work" />
</UsefullLinkContainer>