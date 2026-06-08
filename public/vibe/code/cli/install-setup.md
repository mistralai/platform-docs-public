---
title: Install and setup
sidebar_position: 1
---

# Install and setup

Install the Vibe CLI, run `vibe` in your project, and complete the setup prompt.

:::tip
**On a different surface?** This page covers the **CLI** specifically. If you'd rather work inside your editor or against a remote repo, jump to [VS Code extension](/vibe/code/vs-code-extension/install-authenticate) or [Vibe Code Web](/vibe/code/vibe-code-web/get-started). See [Choose CLI, VS Code, or web sessions](/vibe/code/choose-cli-vscode-web-sessions) for a side-by-side comparison.
:::

<SectionTab as="h2" sectionId="prerequisites">Prerequisites</SectionTab>

Before you install the CLI, make sure you have:

- **macOS, Linux, or Windows.**
- **Python 3.12 or later** for manual installation.
- *(Optional)* a **Mistral account** to use Mistral-hosted models. The CLI also works fully offline with [local models](/vibe/code/cli/offline-models), or against any compatible API key you provide.

If you choose to use Mistral-hosted models, you have two ways to get an API key, depending on your plan:

- With a **[Mistral plan](https://mistral.ai/pricing)** (Free, Pro, or higher), Vibe Code is included; usage and rate limits apply.
- With an **API plan**, you manage the API key yourself from the console.

<SectionTab as="h2" sectionId="install">Install the CLI</SectionTab>

<ExplorerTabs>
<ExplorerTab value="macos-linux" label="macOS / Linux" default>

Use the one-line installer:

```bash
curl -LsSf https://mistral.ai/vibe/install.sh | bash
```

The installer:

- Checks whether `uv` is installed and installs it if needed.
- Installs or upgrades `mistral-vibe` with `uv tool install` or `uv tool upgrade`.
- Makes the `vibe` and `vibe-acp` commands available, provided your `PATH` is configured.

If the installer reports that `vibe` is not on your `PATH`, add the displayed directory to your shell profile and restart your terminal.

</ExplorerTab>
<ExplorerTab value="manual" label="Manual install">

Use manual installation when you prefer to manage Python tools yourself.

With `uv`:

```bash
uv tool install mistral-vibe
```

Or with `pip`:

```bash
pip install mistral-vibe
```

</ExplorerTab>
<ExplorerTab value="windows" label="Windows">

Install `uv` first:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Then install Vibe:

```powershell
uv tool install mistral-vibe
```

:::note
Windows support is best-effort. Some keyboard shortcuts and terminal behaviors depend on the terminal emulator. See the [recommended terminals](/vibe/code/cli/commands-shortcuts#keyboard-shortcuts).
:::

</ExplorerTab>
</ExplorerTabs>

<SectionTab as="h2" sectionId="start">Start Vibe in your project</SectionTab>

Open a terminal in your project root and run:

```bash
vibe
```

On first launch, Vibe:

- Creates a default configuration file at `~/.vibe/config.toml` if it does not already exist.
- Walks you through a **setup wizard** to register your API key.

<SectionTab as="h2" sectionId="choose-access-path">Choose your access path</SectionTab>

The setup wizard asks for an [API key](/vibe/code/cli/api-keys-profiles). Pick the path that matches your plan:

- **Sign in with a Mistral account**: pick a [Mistral plan](https://mistral.ai/pricing) (Free, Pro, or higher). Vibe Code is included; usage and rate limits apply, with pay-as-you-go beyond the included budget when available.
- **Use your API plan**: generate an API key from [Studio](https://console.mistral.ai/home?profile_dialog=api-keys) or use one you already manage.

Paste your API key when prompted. The wizard saves it for future sessions in the Vibe home directory. You can also set `MISTRAL_API_KEY` in your shell environment if you prefer not to use the interactive prompt.

:::tip
You can rerun the setup wizard at any time using `vibe --setup`.
:::

<SectionTab as="h2" sectionId="verify">Verify the setup</SectionTab>

Your setup is ready when:

- `vibe --version` returns a version.
- `vibe` opens the interactive terminal interface from your project root.
- Vibe accepts a prompt without asking for an API key again.

Try a small first prompt:

```text
Find TODO comments in this project.
```

<SectionTab as="h2" sectionId="reset-config">Reset your configuration</SectionTab>

If the CLI fails to start or behaves unexpectedly after editing the config, move the file aside and restart Vibe. A fresh `~/.vibe/config.toml` is generated on the next launch:

```bash
mv ~/.vibe/config.toml ~/.vibe/config.toml.bkp
vibe
```