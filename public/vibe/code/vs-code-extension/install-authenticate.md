---
title: Install and authenticate
sidebar_position: 1
---

# Install and authenticate

Install **[Mistral Vibe for VS Code](https://marketplace.visualstudio.com/items?itemName=mistralai.mistral-vibe-code)**, open the Vibe panel, and sign in. The extension ships with the Vibe agent built in, so **no separate CLI install is required**.

:::tip
**Switching surface?** This page covers the **VS Code extension**. To set up Vibe in your terminal, see [Install the CLI](/vibe/code/cli/install-setup); for a cloud session on a GitHub repo, see [Vibe Code Web](/vibe/code/vibe-code-web/get-started). Configuration and sessions are shared between the CLI and the extension.
:::

<SectionTab as="h2" sectionId="requirements">Requirements</SectionTab>

| Requirement | Details |
|---|---|
| **VS Code** | Version 1.94.0 or later. |
| **Mistral account** | Required to create or manage API keys. |
| **Access path** | A [Mistral plan](https://mistral.ai/pricing) (Free, Pro, or higher), or an API plan with a key you manage yourself. Usage and rate limits apply. |

<SectionTab as="h2" sectionId="install">Install the extension</SectionTab>

Install **Mistral Vibe for VS Code** from the VS Code Extensions view, or directly from the [Marketplace listing](https://marketplace.visualstudio.com/items?itemName=mistralai.mistral-vibe-code).

From inside VS Code:

1. Open VS Code.
2. Press `Cmd+Shift+X` on macOS or `Ctrl+Shift+X` on Windows or Linux.
3. Search for `Mistral Vibe`.
4. Select the extension published by **Mistral AI** (publisher ID: `mistralai`).
5. Click `Install`.

If the extension doesn't appear after installation, run **Developer: Reload Window** from the Command Palette or restart VS Code.

<SectionTab as="h2" sectionId="open">Open Mistral Vibe</SectionTab>

After installation, open the extension from one of these entry points:

- Click the **Mistral Vibe** icon in the VS Code activity bar.
- Run **Mistral Vibe: Open Mistral Vibe** from the Command Palette.
- Use the editor title action when the Mistral Vibe icon is available for the active file.

The extension opens a webview chat panel inside VS Code.

<SectionTab as="h2" sectionId="authenticate">Authenticate</SectionTab>

The first time the extension needs credentials, it opens a **terminal setup flow**:

1. Start setup from the extension when prompted.
2. In the **Mistral Vibe Setup** terminal, paste your Mistral API key.
3. Complete the prompt and wait for the extension to return to the ready state.

The setup flow runs the bundled Vibe agent with `--setup`. It stores credentials in the Vibe home directory for future sessions.

:::info
**Browser-based sign-in is being enabled for the bundled Vibe agent.** When your config targets a Mistral provider, you'll be signed in via a browser flow instead of pasting an API key. Until it lands in the extension, use the terminal setup flow above.
:::

{/* TODO: add screenshots of the setup flow and the ready-state panel. */}

<SectionTab as="h2" sectionId="verify">Verify the setup</SectionTab>

Your setup is ready when:

- The Mistral Vibe panel opens without an authentication prompt.
- You can send a prompt from the VS Code panel.
- The extension can use the active workspace and editor context.

Try a small first prompt:

```text
Explain the currently open file.
```

<SectionTab as="h2" sectionId="vsix">Install from a VSIX</SectionTab>

If your team receives a `.vsix` build before the public listing is available, install it from **Extensions > More Actions > Install from VSIX...**.

:::warning
Only use VSIX files from an **approved Mistral distribution channel**.
:::