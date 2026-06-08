---
title: Run Workflows
sidebar_position: 7
---

# Run Workflows

If your team has built an internal automation (a data pipeline, a report generator, a ticketing flow), you can call it from Work by selecting it from the `+` menu. Pick one, prompt naturally, get the result back in the chat. No CLI, no API call.

:::info
Workflows aren't built inside Work. They're built in Mistral's Studio environment by developers, then published as Chat-compatible assistants that surface in Work. If you're a developer building or publishing Workflows, see [Conversational Workflows](/studio-api/workflows/interacting-with-workflows/conversational_workflows) in the Studio API docs.
:::

<SectionTab as="h2" sectionId="how-workflows-work">How Workflows work in Work</SectionTab>

- **Developers** in your organization build Workflows in Studio and publish them as chat-compatible assistants.
- **You** see those Workflows in Work's tool menu, ready to attach to any chat.
- When attached, Work calls the Workflow as part of its reasoning, like any other tool, with the Workflow's name surfaced in the chat so you always know which one ran.

The Workflow handles its own inputs, its own logic, and its own output format. Work routes your prompt to it and renders the result back in the chat.

<SectionTab as="h2" sectionId="using-a-workflow">Using a Workflow in a chat</SectionTab>

1. Click the `+` icon in the chat window.
2. Select `Workflows` from the menu.
3. Pick the Workflow you want to run from the list.
4. The Workflow name appears as a **tag in the chat input**, confirming it's attached.
5. Send your prompt. Work calls the Workflow immediately, alongside its thinking chunk.

Once the Workflow runs, the tag also appears **above your message in the chat history**, so you can scroll back and see which Workflow was used at each step.

<SectionTab as="h2" sectionId="what-you-see">What you see during a run</SectionTab>

A typical Workflow call surfaces:

- **Thinking chunk**: Work reasons about what arguments to pass to the Workflow based on your prompt.
- **Workflow started: `{workflow-name}`**: confirmation that the Workflow has been invoked.
- **Workflow output** (or failure): the result rendered in the chat. Some Workflows render inline; others may open in [Canvas](/vibe/work/files-and-canvas).
- **Workflow failed: `{workflow-name}`**: if the Workflow can't run (missing access, invalid input, tier restriction), the error is reported back.

Example, a Workflow that fails because of a tier restriction:

```text
Workflow started: vibe-nuage
Your account tier (free) does not have access to this feature
Workflow failed: vibe-nuage
```

Work reads the failure and surfaces it back to you in plain language:

> The workflow failed: your free account tier does not have access to this feature.

<SectionTab as="h2" sectionId="skills-vs-workflows">Skills vs. Workflows</SectionTab>

Both extend Work's capabilities, but they're different shapes for different jobs:

| | [Skills](/vibe/work/skills) | Workflows |
|---|---|---|
| **What it is** | Instructions + resources (a `SKILL.md` and optional files) | A coded process built in Studio |
| **Who creates it** | Any user, often from a chat | Developers in Studio |
| **What it does** | Tells Work *how* to approach a task | Runs deterministic logic and returns a structured output |
| **Best for** | Style, procedure, checklist, repeatable method | Data pipelines, automations, integrations with internal systems |
| **Triggered by** | Auto-match on description, slash command, or natural reference | Explicit selection via `+` > `Workflows` |

Use a Skill when you want Work to *behave a certain way*. Use a Workflow when you want Work to *call something that already exists*.

<SectionTab as="h2" sectionId="limitations">Limitations and availability</SectionTab>

- Workflows must be **published to your workspace** by a developer in your organization. If you don't see any Workflows in the menu, ask your team's Studio developer or your workspace admin.
- Some Workflows may be **gated by account tier or organization plan**. Failures of this type appear in the chat with a clear reason.
- Workflows are invoked **explicitly** via the `+` menu. Work doesn't auto-trigger them based on the prompt (unlike Skills).

<SectionTab as="h2" sectionId="for-developers">For developers</SectionTab>

If you're building Workflows that should appear in Work:

- See [Conversational Workflows](/studio-api/workflows/interacting-with-workflows/conversational_workflows) for the API and concepts.
- See [Publish in Vibe](/studio-api/workflows/interacting-with-workflows/conversational_workflows/publish_in_vibe) for the requirements (workflow must return a `ChatAssistantWorkflowOutput`).
- See [Forms and confirmations](/studio-api/workflows/interacting-with-workflows/conversational_workflows/forms_and_confirmations), [Progress tracking](/studio-api/workflows/interacting-with-workflows/conversational_workflows/progress_tracking), and [Canvas](/studio-api/workflows/interacting-with-workflows/conversational_workflows/canvas) for richer UX in the chat.