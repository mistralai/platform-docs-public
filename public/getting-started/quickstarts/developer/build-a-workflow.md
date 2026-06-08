---
title: Build a workflow
sidebar_label: Build a workflow
sidebar_position: 4
description: "Scaffold a durable AI workflow, run a worker, and trigger your first execution in ~15 minutes."
---

# Build a workflow

Workflows let you run multi-step AI pipelines that survive crashes, retries, and long waits. Your code runs in your environment; Mistral handles orchestration, state, and observability.

By the end of this quickstart you'll have a working workflow running locally, triggered from the Mistral Console.

**Time to complete:** ~15 minutes

<SectionTab as="h2" sectionId="prerequisites">Prerequisites</SectionTab>

- A Mistral API key (see [Send your first API request](/getting-started/quickstarts/developer/first-api-request#step-1) if you don't have one yet)
- [Python](https://www.python.org/downloads/) 3.12 or later
- [uv](https://docs.astral.sh/uv/getting-started/installation/) installed (`uvx` ships with it)

<SectionTab as="h2" sectionId="step-1">Step 1: Scaffold your project</SectionTab>

Run the following command in your terminal:

```bash
uvx mistralai-workflows-cli setup
```

The CLI scaffolds a ready-to-run Python project and prompts you for your Mistral API key. Enter the key when asked — it's stored in the project's environment configuration.

Open the generated directory (default name: `my-workflow`) in your editor.

<SectionTab as="h2" sectionId="step-2">Step 2: Understand the workflow</SectionTab>

Open `src/workflows/hello.py`. The scaffolded project includes a minimal example:

```python
from pydantic import BaseModel
import mistralai.workflows as workflows

class HelloInput(BaseModel):
    name: str = "World"

@workflows.activity()
async def greet(name: str) -> str:
    return f"Hello, {name}! Welcome to Mistral Workflows."

@workflows.workflow.define(
    name="hello-world",
    workflow_display_name="Hello World",
    workflow_description="A minimal hello-world workflow.",
)
class HelloWorkflow:
    @workflows.workflow.entrypoint
    async def run(self, input: HelloInput) -> str:
        return await greet(input.name)
```

Two things to notice:

- `@workflows.activity()` marks a function as a durable step. If the process crashes mid-run, the platform replays from the last completed activity.
- `@workflows.workflow.define` registers the workflow with a name you'll use to trigger it.

<SectionTab as="h2" sectionId="step-3">Step 3: Start the worker</SectionTab>

From the root of your project, run:

```bash
make start-worker
```

The worker connects to the Mistral API, registers your workflow, and waits for tasks. Keep this terminal open.

<SectionTab as="h2" sectionId="step-4">Step 4: Trigger the workflow</SectionTab>

With the worker running, open a second terminal and trigger an execution using the Makefile command:

```bash
make execute workflow=hello-world input='{"name": "World"}'
```

Or trigger it from the [Mistral Console](https://console.mistral.ai):

1. Navigate to **Workflows** in the sidebar.
2. Select **hello-world**.
3. Click **Start Workflow** and pass `{"name": "World"}` as input.
4. Open the **Executions** tab to watch it run.

<SectionTab as="h2" sectionId="verify">Verify</SectionTab>

The execution completes with:

```json
{
  "result": "Hello, World! Welcome to Mistral Workflows."
}
```

If the worker terminal shows a connection error, confirm your API key is set correctly and that the worker process is still running.

Press `Ctrl+C` to stop the worker when you're done.

<SectionTab as="h2" sectionId="whats-next">What's next</SectionTab>

<UsefullLinkContainer>
  <LinkCard href="/studio-api/workflows/getting-started/core_concepts" title="Core concepts" />
  <LinkCard href="/studio-api/workflows/getting-started/cookbook_examples" title="Cookbook examples" />
  <LinkCard href="/studio-api/workflows/building-workflows/durable_agents" title="Build a durable agent" />
  <LinkCard href="/#quickstarts" title="All developer quickstarts" />
</UsefullLinkContainer>