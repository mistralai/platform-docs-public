---
title: Get started with Work
sidebar_label: Get started
sidebar_position: 0
---

# Get started with Work

**Vibe Work** is Vibe's productivity mode for delegating complex, multi-step tasks across your apps and tools.

Describe the outcome you want **in natural language**: Work gathers context, breaks the task into steps, calls the right tools, and asks for approval before sensitive actions.

This guide shows how to start a task in Work, give it the right context, follow its progress, and review the result.

<SectionTab as="h2" sectionId="open-work">Open Work</SectionTab>

1. Open <AppLink href="https://chat.mistral.ai/work" app="vibe">Work</AppLink>.
2. If the sidebar is closed, click the drawer icon or press `Cmd+Shift+B` on macOS or `Ctrl+Shift+B` on Windows and Linux.
3. In the sidebar, select **Work** from the mode selector.
4. Start your task.

Vibe remembers the last tab you selected. If **Chat** or **Code** opens by default, select **Work** in the sidebar before starting the task.

{/* TODO: Add a screenshot showing the `Chat`, `Work`, and `Code` tabs in the sidebar. */}

:::tip
Not sure which mode to use? See [Choose Chat, Work, or Code](/vibe/choose-chat-work-code).
:::

<SectionTab as="h2" sectionId="start-a-task">Start a task</SectionTab>

Start with the outcome you want. Work reasons through the request, breaks it into smaller steps, and calls tools when needed.

:::info
**You stay in control: **Work shows progress and asks for confirmation before sensitive actions. See [Safety and approvals](/vibe/work/safety-and-approvals) for more info.
:::

A good first prompt includes:

- the result you want
- the source material or tools Work should consider
- the audience for the output
- any constraints, such as length, tone, format, or deadline

Try prompts such as:

- `Research this topic and create a one-page brief I can share with my team.`
- `Summarize this PDF and extract owners, deadlines, and action items.`
- `Compare these two documents and highlight the main differences.`
- `Create a draft response based on this source material.`

{/* TODO: add later some prompt engineering articles/cookbooks maybe? */}

:::note
Use **Chat** if you want a quick turn-based conversation, or to use legacy features such as [Agents](/vibe/chat-legacy/agents), [Think mode](/vibe/chat-legacy/think-mode), [Code Interpreter](/vibe/chat-legacy/code-interpreter), [Deep Research](/vibe/chat-legacy/deep-research), or [Memories](/vibe/chat-legacy/memories).
:::

<SectionTab as="h2" sectionId="give-work-context">Give Work the right context</SectionTab>

Work selects the right tools and context from your prompt automatically. You can also point it to a specific source when you want full control.

Work draws on the following capabilities:

- [Connectors](/vibe/work/connectors): connect tools such as email, calendar, Slack, Notion, GitHub, Google Drive, or SharePoint so Work can use approved external data.
- [Libraries](/vibe/work/libraries): use curated document collections that are already uploaded and indexed.
- [Skills](/vibe/work/skills): apply repeatable methods, checklists, or templates to a task.
- [Files and Canvas](/vibe/work/files-and-canvas): upload documents, spreadsheets, presentations, PDFs, or images for Work to read, summarize, extract, or turn into reviewable outputs.
- [Web search and Open URL](/vibe/work/web-search-open-url): use public information or ask Work to read a specific web page.

:::note
Work can ask you to connect or authenticate a missing tool during a task. Your organization settings can also affect which tools are available.
:::

<SectionTab as="h2" sectionId="follow-progress">Follow the todos and progress</SectionTab>

For longer tasks, Work displays a live **todos panel** in the right-hand panel as it works, and may ask you **follow-up questions** when your prompt is ambiguous. It also shows progress, tool calls, and intermediate outputs while it works.

Use these checkpoints to stay in control:

- Watch the todos as they appear to see what Work is doing.
- Approve or deny sensitive actions when prompted.
- Stop the task with the **stop** button (the black square) if Work goes the wrong direction.
- Redirect with a follow-up message if Work chooses the wrong source or approach.

:::note
Work asks for approval before sensitive actions such as sending email, posting messages, creating calendar events, deleting issues, or changing data in external tools.

For more detail, see [Safety and approvals](/vibe/work/safety-and-approvals).
:::

<SectionTab as="h2" sectionId="review-result">Review the result before using it</SectionTab>

Treat Work outputs as drafts until you review them. Before you use or share the result:

- Read the final summary.
- Review generated content in [Canvas](/vibe/work/files-and-canvas) or files.
- Check facts, tables, dates, names, owners, and source references.
- Verify extracted information against the original file or source when accuracy matters.
- Ask Work to revise the output if the audience, tone, structure, or facts are wrong.
- Approve, edit, share, or reuse the result only after review.

<SectionTab as="h2" sectionId="repeated-work">Make repeated work easier</SectionTab>

After your first tasks, use Vibe settings and reusable context to reduce repeated instructions:

| Use case | Feature |
|---|---|
| Stable preferences such as tone, format, language, or recurring constraints | [Custom instructions](/vibe/work/custom-instructions) |
| Related work around the same team, customer, initiative, or topic | [Projects](/vibe/work/projects) |
| Repeatable procedures and task-specific guidance | [Skills](/vibe/work/skills) |
| Predefined processes (when your workspace supports them) | [Workflows](/vibe/work/workflows) |
| Run a prompt on a schedule (one-off, daily, weekly, monthly, yearly) | [Schedule tasks](/vibe/work/scheduled-tasks) |