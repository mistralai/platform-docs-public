---
title: GitHub repositories
sidebar_position: 4
---

# GitHub repositories and permissions

Vibe Code Web works on GitHub repositories from a managed cloud sandbox. To do that, it relies on the **Mistral GitHub App**, which clones repositories, pushes branches, and opens pull requests on your behalf.

This page explains how authentication works, what the agent can and cannot do, and how to revoke access.

<SectionTab as="h2" sectionId="authentication-model">Authentication model</SectionTab>

The Mistral GitHub App authenticates with GitHub in two distinct ways:

| Token | What it's used for | Effective scope |
|---|---|---|
| **User access token** | Repository read and write work on your behalf (clone, branch, commit, push, open pull request). | Restricted by **both** your GitHub permissions on the repository **and** the App's granted scopes. The narrower of the two wins. |
| **Installation access token** | App-level or bot-level actions, when those actions are live. | Limited to the scopes the App was granted at install time, scoped to the repositories the installation covers. |

<SectionTab as="h3" variant="secondary" sectionId="attribution">Attribution</SectionTab>

Code changes (commits, branches, pull requests) are authored via **your user access token**. The exact attribution shown in GitHub depends on your GitHub and Git configuration:

| Field | Source |
|---|---|
| **Commit author** | Your GitHub user, based on the user access token and your local Git config when the agent runs the commit. |
| **Commit committer** | Can differ from the author depending on Git settings (for example, GitHub web edits or merge commits). |
| **Pull request author** | Your GitHub user. |

<SectionTab as="h2" sectionId="connect-github">Connect GitHub</SectionTab>

The first time you create a project in Vibe Code Web, you're prompted to **install the Mistral GitHub App** and authorize it on your account or organization.

A typical setup:

1. Open the GitHub connection flow from Vibe Code Web.
2. Choose the GitHub account or organization where the target repository lives.
3. Select **all repositories** or **only the repositories** the App should access.
4. Confirm the installation.
5. Authorize the App on your user account so it can act on your behalf.

Repeat this for each organization that should be reachable from Vibe Code Web.

:::info
A Vibe Code Web project can include multiple repositories, but they must all belong to the **same GitHub owner** (user account or organization). To work across different owners, create separate projects.

Organization owners may need to approve the installation before members can use Vibe Code Web on organization repositories.
:::

<SectionTab as="h2" sectionId="repository-access">Repository access</SectionTab>

Grant the **narrowest repository access** that fits your workflow.

| Access choice | Use it when |
|---|---|
| **Selected repositories** | You want Vibe Code Web to work only on specific repositories. |
| **All repositories** | You trust the integration across the account or organization and want new repositories to be available automatically. |

Repository access can be changed later from GitHub settings.

<SectionTab as="h2" sectionId="what-vibe-code-web-can-do">What Vibe Code Web can do</SectionTab>

Inside a Vibe Code Web session, the agent **can**:

- Clone an authorized repository into the cloud sandbox.
- Read files in the repository.
- Create branches and edit code.
- Run shell commands, tests, and build steps inside the sandbox.
- Commit and push changes to the repository.
- Open pull requests for you to review.

Vibe Code Web **cannot**:

- Access your local machine or local filesystem.
- Read or modify repositories you have not authorized.
- Bypass branch protections, required reviews, `CODEOWNERS`, or required status checks.
- Persist files outside the repository after the sandbox is deleted.

:::tip
Use **GitHub branch protections, `CODEOWNERS`, required reviews, and required status checks** to gate sensitive branches. Vibe Code Web follows the same repository rules as any other contributor.
:::

<SectionTab as="h2" sectionId="manage-access">Manage and revoke access</SectionTab>

Review or revoke access from GitHub at any time:

- **Repository access**: open [github.com/settings/installations](https://github.com/settings/installations) and update the Mistral GitHub App.
- **Account authorization**: open [github.com/settings/applications](https://github.com/settings/applications) and revoke the Mistral entry if you no longer want the account connected.
- **Organization access**: organization owners can manage the installation from the organization's GitHub App settings.

Revoking access stops **new Vibe Code Web sessions** from reaching the affected repositories. Branches, commits, and pull requests already pushed remain in GitHub.

<SectionTab as="h2" sectionId="common-issues">Common access issues</SectionTab>

| Issue | Check |
|---|---|
| **Repository is missing** | Confirm the Mistral GitHub App is installed for the account or organization, and that the repository is selected in the installation. |
| **Organization repository unreachable** | Check whether the organization owner has approved the App installation. Approval may be pending. |
| **Repository belongs to a different GitHub owner** | A project includes repositories from a single GitHub owner. Create a separate project for the other owner. |
| **App installed but repository not listed** | The App is installed but the repository was not selected in the installation. Update the App configuration in GitHub to add it. |
| **Push or pull request fails** | Check branch protection, required reviews, required status checks, and that you have write permission on the repository. |
| **Authorized the App but pushes fail** | You may have authorized the App without having write permission on the repository. Ask the repository or organization owner to grant write access. |
| **Commits show the wrong author** | Check the email exposed by your GitHub account settings and your local Git config. |