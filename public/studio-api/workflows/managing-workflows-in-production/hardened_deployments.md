---
id: hardened-deployments
title: Hardened deployments
sidebar_position: 3
---

# Hardened deployments

A **hardened deployment** is a standard [deployment](/studio-api/workflows/managing-workflows-in-production/deployments) with restricted workflow registration. Only a predefined set of API keys can register workflows in a hardened deployment. A deployment becomes hardened as soon as at least one API key is associated with it.

<SectionTab as="h1" sectionId="the-problem">The problem</SectionTab>

Workflow execution routing occurs at the deployment level. Multiple workers can register workflows — and even multiple versions of the same workflow — within a single deployment. Once two different workflows are registered under the same name in a deployment, routing becomes **non-deterministic**. There is no way to predict which version will execute for a given input.

This non-determinism poses risks for production environments, where reliability is critical. A misconfigured or accidental re-registration can disrupt deployments and compromise workflow integrity.

[On-behalf-of (OBO) workflows](/studio-api/workflows/building-workflows/on_behalf_of) — which execute under the identity of the triggering user and can access their personal files and connectors — introduce further sensitivity. Unrestricted registration of OBO workflows could expose user resources to unintended or malicious access.

<SectionTab as="h1" sectionId="how-hardened-deployments-work">How hardened deployments work</SectionTab>

Workspace and organization admins manage hardened deployments through the **Settings** panel in the Mistral console. A deployment becomes hardened when at least one API key is associated with it. From that point, only those registered API keys can register workflows on that deployment.

:::info
On-behalf-of workflows **require** a hardened deployment. They cannot be registered in a non-hardened deployment. See [On-behalf-of workflows](/studio-api/workflows/building-workflows/on_behalf_of) for details.
:::

<SectionTab as="h1" sectionId="benefits">Benefits</SectionTab>

- **Reliable production deployments**: Admins designate a production deployment as hardened, ensuring only trusted API keys can register workflows. This prevents misconfigurations (such as a wrong deployment name) from breaking production workflows.
- **Controlled OBO workflow registration**: OBO workflows cannot be registered in non-hardened deployments, ensuring sensitive workflows are validated by trusted admins before use.
- **Restricted unauthorized registration**: Unless an attacker compromises an admin account, they cannot register malicious OBO workflows in hardened deployments.

<SectionTab as="h1" sectionId="managing-hardened-deployments">Managing hardened deployments</SectionTab>

Once a deployment is created (upon registration of its first worker), an admin can harden it through the workspace's **Settings** panel under the **Hardened Deployment** section.

Admins can:

- View all current hardened deployments
- Add credentials (API key names and owners) to a deployment
- Remove credentials from a deployment

A deployment can have multiple credentials to support key rotation or multi-worker setups.

:::tip
Manage your API keys in the [API keys](/admin/security-access/api-keys) section of the admin panel.
:::

<SectionTab as="h1" sectionId="registering-an-obo-workflow">Registering an OBO workflow</SectionTab>

Hardening a deployment is a **prerequisite** for registering an OBO workflow. For new workflows, there are two paths:

1. **Dummy workflow first**: Register a worker with a placeholder workflow to create the deployment, then associate a credential with it in the admin panel. Finally, re-register the worker with the OBO workflow.

:::info
This is currently the only way to register workflows that use connectors.
:::

2. **Default API key workflow**: Initially, omit the `on_behalf_of` flag. Workers use their API key for authentication by default, running under the key owner's identity. Once development is complete, associate the API key with the deployment and set the `on_behalf_of` flag.

:::tip
For the code-level details of enabling OBO mode and using user credentials, see [On-behalf-of workflows](/studio-api/workflows/building-workflows/on_behalf_of).
:::