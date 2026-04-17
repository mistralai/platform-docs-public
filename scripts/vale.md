# Prose linting with Vale

We use [Vale](https://vale.sh) to enforce tone of voice, word choice, and writing quality across our documentation. It complements markdownlint (structural markdown) and codespell (typos) by catching prose-level issues.

## Setup

Vale is a standalone binary:

```bash
brew install vale
vale sync            # downloads the Microsoft style package
```

`vale sync` populates `.vale/styles/Microsoft/` from the `Packages` directive in `.vale.ini`. That directory is gitignored — run `vale sync` after cloning.

## Commands

| Command | What it does |
|---|---|
| `pnpm vale` | Run the linter and print findings to the terminal. |
| `pnpm vale:report` | Generate `vale-errors.csv` with clickable VS Code links. |

You can pass extra flags through:

```bash
pnpm vale -- --minAlertLevel=error    # only show errors
pnpm vale -- --glob='*.mdx'           # filter by pattern
```

## Style layers

Vale applies three style layers in order:

### 1. Vale (built-in)

Minimal built-in rules (e.g., `Vale.Terms` generated from vocabulary files). Always enabled.

### 2. Microsoft Writing Style Guide

General technical writing quality: passive voice, wordiness, jargon, bias, accessibility. Downloaded by `vale sync`.

Some Microsoft rules are disabled or downgraded because they conflict with the Mistral style guide:

| Rule | Setting | Why |
|---|---|---|
| `Microsoft.We` | `NO` | Mistral style requires "we/our". |
| `Microsoft.Contractions` | `NO` | Mistral style uses contractions in prose. |
| `Microsoft.Wordiness` | `suggestion` | Avoids double-flagging with `Mistral.Substitutions`. |

### 3. Mistral (custom)

Encodes rules from the Mistral style guide (CLAUDE.md) that Microsoft doesn't cover:

| Rule | Level | What it catches |
|---|---|---|
| `Mistral.BannedWords` | error | "leverage", "facilitate", "seamlessly", etc. |
| `Mistral.Substitutions` | warning | "utilize" → "use", "initiate" → "start", etc. |
| `Mistral.ClickHere` | error | Non-descriptive link text ("click here", "read more"). |
| `Mistral.TrademarkyLanguage` | warning | Marketing-sounding words ("powerful", "world-class"). |

## Vocabulary

Product names with exact casing are listed in `.vale/styles/config/vocabularies/Mistral/accept.txt`. Vale auto-generates `Vale.Terms` rules from these, flagging incorrect casing (e.g., "Le Chat" instead of "le Chat").

Banned words are also listed in `.vale/styles/config/vocabularies/Mistral/reject.txt` as a safety net — they get flagged even if the Mistral style is somehow disabled.

## MDX handling

`.vale.ini` maps `.mdx` files to markdown format. Vale already ignores code blocks and inline code. `TokenIgnores` patterns skip:

- `import` / `export` statements
- Admonition directives (`:::tip`, `:::`)

## Configuration

All configuration lives in `.vale.ini` at the repo root. To disable a noisy rule:

```ini
Microsoft.RuleName = NO          # disable entirely
Microsoft.RuleName = suggestion  # downgrade to suggestion
```

## Files

| File | Purpose |
|---|---|
| `.vale.ini` | Vale configuration (styles, formats, rule overrides). |
| `.vale/styles/Mistral/*.yml` | Custom Mistral style rules. |
| `.vale/styles/config/vocabularies/Mistral/accept.txt` | Product names with exact casing. |
| `.vale/styles/config/vocabularies/Mistral/reject.txt` | Banned words. |
| `.vale/styles/Microsoft/` | Microsoft style package (gitignored, downloaded by `vale sync`). |
| `scripts/vale.sh` | Wrapper script for running Vale. |
| `scripts/vale-report.sh` | Generates CSV report with VS Code links. |
| `vale-errors.csv` | Generated report (gitignored). |
