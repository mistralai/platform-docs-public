---
title: Think mode
sidebar_position: 2
---

# Think mode

:::warning
**Heads up.** This is a legacy feature, still available in the **Chat** tab. It works just like before, no rush. See [Get started with Work](/vibe/work/get-started) for the entry point.

In Vibe Work, step-by-step reasoning kicks in automatically when the task needs it — no toggle required.

Think mode stays around for now. No deprecation date set — we'll keep you posted.
:::

Think mode lets Vibe **reason through complex problems**.

Powered by our [Magistral models](https://mistral.ai/news/magistral/), it breaks your question into smaller steps, works through each one, and gives you a clear answer along with the **full reasoning path**.

:::note
This approach is known as *chain-of-thought* prompting: the model reasons explicitly before answering. For the research behind it, see the [original paper](https://arxiv.org/abs/2201.11903).
:::

<SectionTab as="h2" sectionId="how-to-use">How to use</SectionTab>

1. Select the **Chat** tab in the sidebar.
2. Select the `Think` mode at the right of the chat window (`Fast` is the default).
3. Enter your prompt and send it as usual.
4. Vibe begins reasoning and displays its thought process in real time.
5. Once complete, Vibe provides the final answer.

Think mode stays active until you switch to another mode. You can toggle it at any point in an existing chat.

<SectionTab as="h2" sectionId="when-to-use">When to use Think mode</SectionTab>

Think mode is ideal for tasks requiring **multi-step logic** or **structured analysis**:

- **Planning and strategy**: break down a product launch, prioritize a roadmap, or evaluate hiring plans.
- **Debugging production issues**: trace through error chains, compare possible root causes, and narrow down fixes.
- **Multi-factor decisions**: weigh options with competing constraints, such as vendor selection or architecture trade-offs.
- **Math and quantitative reasoning**: work through financial models, statistical calculations, or proofs.
- **Complex code review**: reason about logic flows, edge cases, and potential regressions across a codebase.

:::tip
Not every question benefits from step-by-step reasoning. For simple factual lookups, quick text generation, or straightforward tasks, standard chat is faster and equally accurate.
:::

<SectionTab as="h2" sectionId="tips">Tips for better results</SectionTab>

- **Be specific in your prompt.** The more context you give, the better the reasoning. Instead of *"What pricing model should we use?"*, try *"Compare freemium vs. usage-based pricing for a B2B SaaS product, considering churn and expansion revenue."*
- **Use the reasoning as documentation.** The chain-of-thought output makes a useful artifact for team discussions. Copy it into a [Canvas](/vibe/work/files-and-canvas) or share the conversation to give colleagues visibility into how a decision was reached.
- **Combine with other tools.** Think mode works alongside [web search](/vibe/work/web-search-open-url), [file uploads](/vibe/work/files-and-canvas), and [Libraries](/vibe/work/libraries) for reasoning based on your own data.

<SectionTab as="h2" sectionId="related-features">Related features</SectionTab>

- **[Deep Research](/vibe/chat-legacy/deep-research)**: for questions that need multi-source web research and a structured report.
- **[Files and Canvas](/vibe/work/files-and-canvas)**: refine and iterate on outputs from Think mode in an editor.
- **[Code Interpreter](/vibe/chat-legacy/code-interpreter)**: run code and validate quantitative reasoning.
- **[Get started with Work](/vibe/work/get-started)**: Vibe Work reasons step-by-step automatically when the task calls for it.