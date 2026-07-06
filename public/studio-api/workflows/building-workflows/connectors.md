---
id: connectors-in-workflows
title: Connectors in Workflows
sidebar_position: 3
---

# Connectors in Workflows

Use [Connectors](/studio-api/connectors) inside a Workflow to call external services (GitHub, Notion, Slack, Outlook, etc.) without managing credentials yourself. The Workflow declares which Connectors it needs, the Mistral platform resolves credentials at runtime and triggers OAuth flows on demand.

A Workflow resolves Connector credentials from the identity it runs under:

- **[On-behalf-of (OBO) workflows](/studio-api/workflows/building-workflows/on_behalf_of)** use the **triggering user's** credentials. OBO requires a [hardened deployment](/studio-api/workflows/managing-workflows-in-production/hardened_deployments) — see [Registering an OBO workflow](/studio-api/workflows/managing-workflows-in-production/hardened_deployments#registering-an-obo-workflow).
- **Regular workflows** use the **worker's** credentials (the identity of the API key the worker runs under).

:::info
The Workflow Connector integration uses `mistralai-workflows-plugins-mistralai`. These are **Public Preview** APIs and may change.
:::

<SectionTab as="h2" sectionId="why">Why use Connector slots</SectionTab>

Without Connector slots, every Workflow that talks to an external API has to handle its own credential storage, OAuth dance, and per-user token isolation. Slots centralize all three:

- **No secrets in Workflow code**: credentials are resolved at runtime by the platform.
- **Automatic OAuth**: if the caller hasn't authorized yet, the Workflow pauses and emits an auth URL, then resumes when the flow completes.
- **Identity-scoped credentials**: credentials resolve from whichever identity the Workflow runs under — the triggering user (OBO) or the worker.
- **Swappable auth**: bearer (PAT) and OAuth2 Connectors use the same Workflow code.

<SectionTab as="h2" sectionId="prerequisites">Prerequisites</SectionTab>

Connector slots ship with the Mistral plugin:

```bash
uv add "mistralai-workflows[mistralai]"
```

You also need at least one [Connector](/studio-api/connectors) registered for your workspace. Create one from <a href="https://console.mistral.ai/build/connectors" target="_blank" rel="noopener">Studio &rsaquo; Context &rsaquo; Connectors</a>, or via the [Connectors API](/studio-api/connectors/management).

[Add credentials](#credentials) before running a Workflow:

- **Bearer**-authenticated Connectors (e.g. GitHub PAT) require credentials in Studio first.
- **OAuth2** Connectors also work best with credentials added first. As a fallback, the Workflow triggers an OAuth flow on demand the first time it runs without credentials (see [How the fallback OAuth flow works](#oauth-flow)).

<SectionTab as="h2" sectionId="credentials">Add credentials</SectionTab>

Each user stores their own credentials per Connector in Studio. You can keep a single credential or store several named credentials (for example two GitHub PATs with different scopes, or a personal and a work Microsoft account) and [pick which one to use](#runtime-binding) per Workflow execution.

1. Open <a href="https://console.mistral.ai/build/connectors" target="_blank" rel="noopener">Studio &rsaquo; Context &rsaquo; Connectors</a> and select a Connector.
2. Switch to the **Credentials** tab.
3. Click **+ Add credentials**, give it a name (alphanumeric and hyphens), and complete the bearer token paste or OAuth flow.
4. One credential is always the **default**. To change which one runs when no name is specified, edit a credential and mark it as default.

Credentials are stored per **user**. At runtime the Workflow uses the credentials of the identity it runs under: the triggering user in an OBO Workflow, or the worker otherwise.

<SectionTab as="h3" variant="secondary" sectionId="credentials-sdk">Manage credentials from the SDK</SectionTab>

You can also create, list, and delete credentials programmatically via `client.beta.connectors`. Use this when you need to provision credentials at scale, rotate tokens, or script the OAuth handoff.

<Tabs>
  <TabItem value="python" label="Python">

```python
import os
from mistralai import Mistral

client = Mistral(api_key=os.environ["MISTRAL_API_KEY"])

# Bearer connector: store a named credential and mark it default
await client.beta.connectors.create_or_update_user_credentials_async(
    connector_id_or_name="github_app",
    name="github-pat-full",
    credentials={"bearer_token": os.environ["GITHUB_PAT"]},
    is_default=True,
)

# OAuth2 connector: request an auth URL, the user completes it in a browser
result = await client.beta.connectors.get_auth_url_async(
    connector_id_or_name="outlook_calendar",
    credentials_name="personal",
)
print(result.auth_url)

# List and delete
await client.beta.connectors.list_user_credentials_async(
    connector_id_or_name="github_app",
)
await client.beta.connectors.delete_user_credentials_async(
    connector_id_or_name="github_app",
    credentials_name="github-pat-old",
)
```

  </TabItem>
</Tabs>

:::info
The `client.beta.connectors` API is in **Public Preview**. See the [multiple authentication cookbook](https://github.com/mistralai/connector-sdk-demo/blob/main/cookbooks/06-multiple-authentication.md) for the full bearer + OAuth2 flow.
:::

<SectionTab as="h2" sectionId="oauth-flow">How the fallback OAuth flow works</SectionTab>

When a Workflow execution starts, the worker's auth interceptor runs a preflight on every Connector slot declared with `@uses_connectors`. If valid credentials exist for the resolved identity, the Workflow body runs immediately. If not (typical first OAuth2 use), the worker pauses, gets an auth URL from the Mistral API, forwards it to the client as an `auth_url` event, and waits while the user completes authorization in their browser. Once the credentials land in storage, the Workflow resumes.

<div className="[&>div>img]:!border-0 [&>div>img]:!rounded-none [&>div>img]:!shadow-none">
<Image
  url={'/img/workflows_connector_oauth_flow.svg'}
  alt="Sequence diagram of the Connector OAuth flow between the client, the worker, and the Mistral API"
  centered
  className="border-none!"
/>
</div>

The polling activity heartbeats while it waits, so a slow user doesn't cause the worker to time out. The auth URL has a **10-minute** window before `ConnectorAuthTimeout` fires.

<SectionTab as="h2" sectionId="build">Build a Workflow with Connectors</SectionTab>

A Connector Workflow has three pieces: a **slot declaration**, an **activity** that calls the Connector, and a **Workflow class** that ties them together.

<SectionTab as="h3" variant="secondary" sectionId="declare-slots">Step 1: Declare Connector slots</SectionTab>

Slots are declared at module level. Each slot holds the Connector name as registered in Studio:

```python
from mistralai.workflows.plugins.mistralai.connectors import connector

github_connector = connector("github_app")
notion_connector = connector("Notion")
```

`connector(name)` accepts these parameters:

| Parameter | Default | Description |
|---|---|---|
| `name` | required | Connector name or ID as registered in Studio. |
| `auto_auth` | `True` | Run the OAuth preflight before the Workflow starts. |
| `credentials_name` | `None` | Pin the slot to a specific named credential. Omit to use the caller's default credentials, or override per-execution with runtime bindings (see [Pick a credential at execution time](#runtime-binding)). |

<SectionTab as="h3" variant="secondary" sectionId="write-activity">Step 2: Write an activity that calls the Connector</SectionTab>

Activities receive a `ToolCallClient` via dependency injection. `Depends(slot)` resolves the slot to an authenticated client at runtime.

<Tabs>
  <TabItem value="python" label="Python">

```python
from typing import Any

import mistralai.workflows as workflows
from mistralai.workflows import Depends
from mistralai.workflows.plugins.mistralai.connectors import ToolCallClient, connector

github_connector = connector("github_app")

@workflows.activity(name="create-github-issue")
async def create_github_issue(
    owner: str,
    repo: str,
    title: str,
    body: str,
    github: ToolCallClient = Depends(github_connector),
) -> None:
    await github.call_tool(
        tool_name="issue_write",
        arguments={
            "method": "create",
            "owner": owner,
            "repo": repo,
            "title": title,
            "body": body,
        },
    )
```

  </TabItem>
</Tabs>

`call_tool(tool_name, arguments)` dispatches the call to the MCP Connector and returns the raw tool response.

<SectionTab as="h3" variant="secondary" sectionId="attach-workflow">Step 3: Attach slots to the Workflow class</SectionTab>

Use `@uses_connectors` to register the slots. Add `on_behalf_of=True` to resolve credentials from the triggering user; omit it to use the worker's credentials:

<Tabs>
  <TabItem value="python" label="Python">

```python
import pydantic
import mistralai.workflows as workflows
from mistralai.workflows.plugins.mistralai.connectors import connector, uses_connectors

github_connector = connector("github_app")

class GitHubIssuePrompt(pydantic.BaseModel):
    owner: str
    repo: str
    title: str
    body: str

@workflows.workflow.define(name="github-issue-creator", on_behalf_of=True)
@uses_connectors(github_connector)
class GitHubIssueCreatorWorkflow:
    @workflows.workflow.entrypoint
    async def run(self, prompt: GitHubIssuePrompt) -> None:
        await create_github_issue(
            prompt.owner,
            prompt.repo,
            prompt.title,
            prompt.body,
        )
```

  </TabItem>
</Tabs>

Notes:

- `on_behalf_of=True` runs the Workflow under the triggering user's identity, resolving that user's credentials. Omit it to run under the worker's identity and credentials.
- Pass several slots in one call when the Workflow needs more than one Connector: `@uses_connectors(github_connector, notion_connector)`.
- Apply `@uses_connectors` **after** `@workflow.define`. The order matters.

When the worker starts, the plugin auto-registers a `ConnectorAuthInterceptor` that handles the preflight and OAuth pause described in [How the fallback OAuth flow works](#oauth-flow).

<SectionTab as="h2" sectionId="execute">Execute a Connector Workflow</SectionTab>

<SectionTab as="h3" variant="secondary" sectionId="execute-studio">From Studio</SectionTab>

Open <a href="https://console.mistral.ai/build/workflows" target="_blank" rel="noopener">Studio &rsaquo; Workflows</a>, pick your Workflow, click **Start workflow**.

- If you have **multiple named credentials** for a Connector, the launch dialog lets you pick which one to use for this execution.
- To add or update credentials per Connector before starting a Workflow, go to <a href="https://console.mistral.ai/build/connectors" target="_blank" rel="noopener">Studio &rsaquo; Context &rsaquo; Connectors</a> and open the **Credentials** tab.
- As a **fallback**, if you start a Workflow with an OAuth2 Connector without any credentials, the execution panel shows an OAuth prompt (orange key icon). Complete the flow in a browser tab and the Workflow resumes automatically.

<SectionTab as="h3" variant="secondary" sectionId="execute-sdk">From the SDK</SectionTab>

Use `execute_with_connector_auth_async` to handle the OAuth dance programmatically. The helper polls the execution, detects auth requests, calls your `on_auth_required` callback with the URL, and waits for the user to complete the flow.

<Tabs>
  <TabItem value="python" label="Python">

```python
import asyncio
import webbrowser

from mistralai.client import Mistral
from mistralai.extra.workflows.connector_auth import (
    ConnectorAuthTaskState,
    execute_with_connector_auth_async,
)
from mistralai.extra.workflows.connector_slot import ConnectorSlot

async def on_auth_required(state: ConnectorAuthTaskState) -> None:
    if state.auth_url:
        webbrowser.open(state.auth_url)
    input("Press Enter after completing the OAuth flow...")

async def main() -> None:
    async with Mistral(api_key="<your-api-key>") as client:
        response = await execute_with_connector_auth_async(
            client=client,
            workflow_identifier="github-issue-creator",
            input_data={
                "owner": "my-org",
                "repo": "my-repo",
                "title": "Bug: something is broken",
                "body": "Steps to reproduce...",
            },
            on_auth_required=on_auth_required,
        )
        print(response)

asyncio.run(main())
```

  </TabItem>
</Tabs>

If the caller already has valid credentials for every required slot, the OAuth step is skipped and the Workflow runs straight through.

<SectionTab as="h3" variant="secondary" sectionId="runtime-binding">Pick a credential at execution time (runtime binding)</SectionTab>

If you have several [named credentials](#credentials) for a Connector, pass a `ConnectorSlot` per slot to choose which one to use for that execution. Slot names must match the slots declared with `@uses_connectors`:

<Tabs>
  <TabItem value="python" label="Python">

```python
from mistralai.extra.workflows.connector_slot import ConnectorSlot

connector_slots = [
    ConnectorSlot(connector_name="github_app", credentials_name="github-pat-full"),
    ConnectorSlot(connector_name="Notion", credentials_name="work-notion"),
]

response = await execute_with_connector_auth_async(
    client=client,
    workflow_identifier="github-issue-creator",
    input_data={...},
    connectors=connector_slots,
    on_auth_required=on_auth_required,
)
```

  </TabItem>
</Tabs>

The same Workflow code can be shared across a team while each user runs it with their own credentials. Omit `credentials_name` to fall back to the user's default credential for that Connector.

<SectionTab as="h2" sectionId="agents">Use Connectors with Durable Agents</SectionTab>

Pass a Connector slot directly to a [Durable Agent](/studio-api/workflows/building-workflows/durable_agents) to let the agent call Connector tools autonomously during its conversation loop. Keep `@uses_connectors` on the Workflow so the auth interceptor still runs:

<Tabs>
  <TabItem value="python" label="Python">

```python
from mistralai.workflows.plugins.mistralai import Agent, Runner
from mistralai.workflows.plugins.mistralai.connectors import connector, uses_connectors
import mistralai.workflows as workflows

github_connector = connector("github_app")

@workflows.workflow.define(name="github-agent", on_behalf_of=True)
@uses_connectors(github_connector)
class GitHubAgentWorkflow:
    @workflows.workflow.entrypoint
    async def run(self, repo: str) -> str:
        agent = Agent(
            name="github-pr-lister",
            model="mistral-medium-latest",
            instructions=f"List recent pull requests on {repo}.",
            connectors=[github_connector],
        )
        result = await Runner.run(agent=agent, inputs=f"Summarize PRs on {repo}.")
        return result.final_output
```

  </TabItem>
</Tabs>

The agent receives the Connector's tools in its tool belt and invokes them on each turn. OAuth and credential resolution still happen automatically via the Workflow interceptor.

<SectionTab as="h2" sectionId="errors">Common errors</SectionTab>

| Error | Cause | Fix |
|---|---|---|
| `ConnectorError: Credential 'x' not found` | Named credential doesn't exist for this Connector. | Create it from Studio &rsaquo; Connectors &rsaquo; Credentials, or drop `credentials_name` to use the default. |
| `ConnectorAuthTimeout` | OAuth flow not completed within 10 minutes. | Re-run the Workflow and complete the browser step promptly. |
| `ConnectorError: ... requires bearer authentication` | Bearer-only Connector with no stored credential. | Add a bearer credential in Studio before running. Bearer auth on the fly is not supported. |
| `ConnectorError: Extension bindings reference unknown connectors` | A runtime `ConnectorSlot` names a slot not declared in `@uses_connectors`. | Match `connector_name` to a slot on the Workflow. |
| `404` on Workflow execute | Worker not running, or Workflow name doesn't match. | Start the worker first and verify the exact `workflow_identifier`. |