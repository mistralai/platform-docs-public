---
title: Sandbox environment
sidebar_position: 5
---

# Sandbox environment

Each Vibe Code Web session runs in an **isolated cloud sandbox** provisioned for that run. This page describes what the sandbox includes by default and what persists once the sandbox is gone.

<SectionTab as="h2" sectionId="isolation">Isolation</SectionTab>

Every session gets its own sandbox:

- Single-tenant for the duration of the session.
- No data shared with other sessions or other users.
- Deleted when the session ends.

:::info
The sandbox **cannot reach your local machine**. The agent works from the repository, the default image, and outbound network calls.
:::

<SectionTab as="h2" sectionId="default-image">Default image</SectionTab>

The sandbox runs a default Linux image with a baseline of common developer tooling:

- A POSIX shell.
- Git, with the Mistral GitHub App credentials configured.
- Common language runtimes and their package managers.
- A standard set of CLI utilities.

The image is **maintained by Mistral** and updated periodically. Exact tool versions can change as the default image is updated.

:::note
If your project depends on tools, runtimes, or system packages not present in the default image, the agent installs them at session time. **Custom sandbox configuration is a follow-up capability**.
:::

<SectionTab as="h2" sectionId="network-posture">Network posture</SectionTab>

The sandbox has **outbound internet access managed by Mistral** so the agent can install dependencies, fetch documentation, and use third-party APIs the project needs. Inbound access from the public internet to the sandbox is not exposed.

What this means in practice:

- The agent can install language-level dependencies, fetch a public URL, or call a public API.
- The agent cannot expose the sandbox as a server reachable from the public internet.
- Outbound calls are subject to rate limits, which can evolve over time.

:::note
User-configurable internet allowlists and sandbox network controls are not available yet. See [Follow-up capabilities](/vibe/code/vibe-code-web/limits-and-lifecycle#follow-ups).
:::

<SectionTab as="h2" sectionId="credentials">Credentials and access</SectionTab>

The sandbox has access to:

- The **Mistral GitHub App user access token**, used for Git operations on the selected repositories. See [GitHub repositories and permissions](/vibe/code/vibe-code-web/github-repositories-permissions) for the token model.
- A small set of managed variables (session ID, repository URL, branch name).

It does **not** have access to:

- Your local machine, filesystem, or shell.
- Repositories you have not authorized.
- Other users' sessions or sandboxes.
- Mistral internal services beyond what the agent needs to operate.

:::tip
Treat the sandbox like a CI job. Use test or least-privileged credentials only. Do not expose production secrets to the sandbox.
:::

<SectionTab as="h2" sectionId="filesystem">Filesystem and persistence</SectionTab>

| Path | Behavior |
|---|---|
| **The cloned repository** | Persisted across iterations of the same session. Lost when the session ends. |
| **Build artifacts** | Deleted with the sandbox unless committed to the repository. |
| **Other temporary files** | Deleted with the sandbox. |

The repository branch or pull request is the durable output. Sandbox files and build artifacts are deleted when the sandbox is deprovisioned unless committed to GitHub.

<SectionTab as="h2" sectionId="resource-limits">Resource limits</SectionTab>

Sandbox compute and storage are sized for typical coding tasks. Specific quotas (CPU, memory, disk) can vary by plan and rollout. Long-running compute, large model training, or heavy build pipelines are out of scope.

For execution time and inactivity limits, see [Limits and lifecycle](/vibe/code/vibe-code-web/limits-and-lifecycle).

<SectionTab as="h2" sectionId="next">Next steps</SectionTab>

<UsefullLinkContainer>
  <LinkCard href="/vibe/code/vibe-code-web/security" title="Security" description="Prompt-injection risk and data handling." />
  <LinkCard href="/vibe/code/vibe-code-web/limits-and-lifecycle" title="Limits and lifecycle" description="Session lifecycle, end states, and persistence." />
</UsefullLinkContainer>