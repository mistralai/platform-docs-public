---
title: Security
sidebar_position: 6
---

# Security

This page describes the security model for autonomous agent runs in Vibe Code Web: how to handle untrusted content the agent reads, and how session data is retained.

For network posture, sandbox isolation, and what the sandbox can access, see [Sandbox environment](/vibe/code/vibe-code-web/sandbox-environment). For GitHub authentication and tokens, see [GitHub repositories and permissions](/vibe/code/vibe-code-web/github-repositories-permissions).

<SectionTab as="h2" sectionId="prompt-injection">Prompt-injection risk</SectionTab>

When the agent reads content from outside your prompt (a file in the repo, the output of a command, a fetched URL, a pull request comment, an issue body), that content is treated as data for reasoning. **Untrusted content can attempt to redirect the agent's behavior.** This class of risk is called prompt injection.

Common vectors to be aware of:

- Repository files (README, docs, `.github/` workflows, sample data).
- Output of shell commands the agent runs.
- Web pages or APIs the agent fetches.
- Reviewer comments and issue bodies pasted into a follow-up prompt.

Mitigations applied by Vibe Code Web:

- All commands and file changes are visible in the **activity stream**, so unexpected behavior is spottable.
- GitHub **branch protections, required reviews, required status checks, and `CODEOWNERS`** still apply to whatever the agent pushes.

What you should do:

- Review the activity stream as the session runs.
- Scope tasks tightly: a focused prompt makes injected instructions easier to spot.
- Review the final code in GitHub before merging.
- Rely on branch protections, required reviews, required status checks, and `CODEOWNERS` for sensitive branches.

<SectionTab as="h2" sectionId="data-handling">Data handling</SectionTab>

Files in the sandbox and outputs of agent actions are processed for the duration of the session. The sandbox is deleted at session end. Anything that must survive the session has to be committed to the repository.

Session activity (prompts, agent messages, command output, file change history) is retained according to your plan and the applicable Mistral data policy. Retention specifics vary by plan. See your plan documentation or the [Mistral privacy policy](https://mistral.ai/terms#privacy-policy) for details.

<SectionTab as="h2" sectionId="next">Next steps</SectionTab>

<UsefullLinkContainer>
  <LinkCard href="/vibe/code/vibe-code-web/sandbox-environment" title="Sandbox environment" description="Isolation, default image, network posture, credentials, and persistence." />
  <LinkCard href="/vibe/code/vibe-code-web/github-repositories-permissions" title="GitHub repositories and permissions" description="App tokens, attribution, and access scopes." />
  <LinkCard href="/vibe/code/vibe-code-web/limits-and-lifecycle" title="Limits and lifecycle" description="Session lifecycle, end states, and persistence." />
</UsefullLinkContainer>