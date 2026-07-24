---
id: cookbook-examples
title: Cookbook examples
sidebar_position: 4
---

# Cookbook examples

Use the Workflows cookbook templates when you want to start with complete examples. Each cookbook demonstrates a different pattern such as human approval, parallel fan-out, or sub-workflows.

After setup, each generated project includes the workflow code, sample data, a worker entrypoint, and helper commands to run the example.

<SectionTab as="h1" sectionId="before-you-begin">
  Before you begin
</SectionTab>

Before running a cookbook, make sure you have:

1. A [Mistral account](https://console.mistral.ai/).
2. Python 3.12 installed.
3. [uvx](https://docs.astral.sh/uv/guides/tools/) available in your shell.
4. A [Mistral API key](https://console.mistral.ai/home?profile_dialog=api-keys) for the workspace where you want to run workflows.

You can inspect the execution timeline or complete a human approval step in [Studio](https://console.mistral.ai/build/workflows/executions).

<SectionTab as="h1" sectionId="set-up-a-cookbook-project">
  Set up a cookbook project
</SectionTab>

Run the setup command and select the cookbook template you want to scaffold:

```bash
uvx mistralai-workflows-cli setup
```

After setup completes, move into the generated project directory and start the examples:

```bash
cd my-workflow # or the name of the folder you created
make start-examples
```

This registers the cookbook workflows with your workspace and keeps the worker ready to process executions. You can start an execution either from a second terminal with the example command shown under each cookbook, or from [Studio](https://console.mistral.ai/build/workflows).

<SectionTab as="h1" sectionId="available-cookbooks">
  Available cookbooks
</SectionTab>

| Cookbook           | What it demonstrates                                      | Main workflow name in Studio |
| ------------------ | --------------------------------------------------------- | ------------------------------- |
| Cargo release      | Human approval, sub-workflows, structured outputs         | `cargo-release-compliance`      |
| Insurance claims   | Parallel activities, retries, deterministic routing       | `insurance-claims-triage`       |
| Code modernization | Parallel sub-workflows, syntax validation, human approval | `code-modernization`            |
| Linear Summarization | Connectors, retry policies, human-in-the-loop, structured LLM output | `linear-summarization` |

<SectionTab as="h1" sectionId="cargo-release">
  Cargo release and dangerous goods compliance
</SectionTab>

### What it does

This cookbook automates cargo release for maritime logistics. It extracts the shipping document, classifies the cargo, runs dangerous goods checks when needed, validates customs compliance, and pauses for a reviewer if an anomaly is detected.

Use this example when you want to understand `wait_for_input()`, child workflows, and typed LLM outputs in one end-to-end flow.

### How to run it

Run the default path with the included sample document:

```bash
make execute-cargo-release
```

Run the anomaly path to trigger human review:

```bash
make execute-cargo-release \
  input='{"document_uri":"src/examples/cargo_release/sample_data/shipping_doc_anomaly.png","shipment_id":"BL-2024-RTD-004812"}'
```

You can also start `cargo-release-compliance` in [Studio](https://console.mistral.ai/build/workflows?workflowSearch=cargo-release-compliance) with this input:

```json
{
  "document_uri": "src/examples/cargo_release/sample_data/shipping_doc_anomaly.png",
  "shipment_id": "BL-2024-HAM-009371"
}
```

### What to look for

In [Studio](https://console.mistral.ai/build/workflows/executions), inspect the child workflow for dangerous goods validation, then find the `wait_for_input` event on the anomaly path. Approve or block the shipment and confirm that the parent workflow resumes from the approval step instead of replaying the earlier activities.

<SectionTab as="h1" sectionId="insurance-claims">
  Insurance claims triage with vision
</SectionTab>

### What it does

This cookbook triages an insurance claim from text and photo inputs. It analyzes claim photos in parallel, checks the written description for inconsistencies, assigns a deterministic severity, scores fraud risk, and returns a structured triage report.

Use this example when you want to see how a workflow can combine parallel activity execution with deterministic routing and typed outputs.

### How to run it

Run the default workflow:

```bash
make execute-insurance-claims
```

You can provide your own input:

```bash
make execute-insurance-claims input='{"claim_id":"CLM-001","claimant_name":"Jane","description":"My car was hit.","photos":["examples/insurance_claims/sample_data/photos/claim_low_scratch_door.jpg"]}'
```

Or start the workflow in [Studio](https://console.mistral.ai/build/workflows?workflowSearch=insurance-claims-triage) with this input:

```json
{
  "claim_id": "CLM-2024-001",
  "claimant_name": "Maria Gonzalez",
  "description": "My car was T-boned at an intersection.",
  "photos": [
    "examples/insurance_claims/sample_data/photos/claim_high_totaled_front.jpg",
    "examples/insurance_claims/sample_data/photos/claim_high_totaled_side.jpg"
  ]
}
```

### What to look for

In [Studio](https://console.mistral.ai/build/workflows/executions), confirm that the `analyze_photo` activities start in parallel, then inspect the consistency check, fraud scoring, and final typed report. The routing decision comes from workflow code, not from a separate model call.

<SectionTab as="h1" sectionId="code-modernization">
  Code modernization assistant
</SectionTab>

### What it does

This cookbook modernizes a legacy Python codebase file by file. The parent workflow scans the repository, dispatches one child workflow per file, validates generated code in a subprocess, aggregates the results into a change set, and pauses for human review before producing a PR proposal.

Use this example when you want to learn how to combine sub-workflow fan-out with durable human approval.

### How to run it

Run the default workflow:

```bash
make execute-code-modernization
```

You can also start `code-modernization` in [Studio](https://console.mistral.ai/build/workflows?workflowSearch=code-modernization) with this input:

```json
{
  "repo_path": "examples/code_modernization/sample_data/legacy_repo",
  "target": "Python 2.7 → 3.12"
}
```

### What to look for

In [Studio](https://console.mistral.ai/build/workflows/executions), confirm that each source file appears as its own child execution. After the child workflows finish, inspect the `wait_for_input` pause, approve or decline the change set, and verify that the workflow only writes the PR proposal after approval.

<SectionTab as="h1" sectionId="linear-summarization">
  Linear Summarization
</SectionTab>

### What it does

This cookbook generates concise weekly summaries of activity in Linear projects. It accepts a team name or ID and a project name or ID, fetches recent issues in parallel, runs LLM summarization, and pauses for human clarification if the team or project cannot be resolved.

Use this example when you want to see how connectors, on-behalf-of (OBO) authentication, parallel activities, and human-in-the-loop fallback work together in a single workflow.

### Prerequisites

This cookbook uses the Linear Connector with on-behalf-of (OBO) mode, which requires a hardened deployment. Before running it:

1. Create a **Linear Connector** in [Studio › Context › Connectors](https://console.mistral.ai/build/connectors). Name it `linear` to match the workflow code.
2. Follow the auth flow to add the credential under the connector's **Credentials** tab.
3. Bootstrap your deployment, then harden it in **Settings › Hardened Deployments**. Re-register the workflow after hardening so the OBO workflow can register successfully.

For full details, see [hardened deployments](/studio-api/workflows/managing-workflows-in-production/hardened_deployments) and [connectors](/studio-api/workflows/building-workflows/connectors).

### How to run it

Run the default workflow:

```bash
make execute-linear-summary
```

When no input is provided, the workflow pauses and prompts for team and project in [Studio](https://console.mistral.ai/build/workflows/linear-weekly-summary). You can also provide input directly:

```bash
make execute-linear-summary \
  input='{"team":"Engineering","project":"*"}'
```

Or start `linear-weekly-summary` in [Studio](https://console.mistral.ai/build/workflows?workflowSearch=linear-weekly-summary) with this input:

```json
{
  "team": "Engineering",
  "project": "*"
}
```

### What to look for

In [Studio](https://console.mistral.ai/build/workflows/executions), confirm that the issue-fetching and summary-generation activities run in parallel. If the team or project name cannot be resolved, the workflow pauses at a `wait_for_input` step — answer the prompt in Studio and verify that execution resumes with the corrected values. Check the final output for a structured JSON summary.

<SectionTab as="h1" sectionId="next-steps">
  Next steps
</SectionTab>

After you're comfortable with a cookbook template, open the generated workflow files in `src/workflows/` and adapt the activities, input models, and execution paths to your own use case.

For the SDK concepts behind these examples, continue with [Core Concepts - Workflows](/studio-api/workflows/getting-started/core_concepts/workflows) and [Building workflows](/studio-api/workflows/building-workflows/workflows).