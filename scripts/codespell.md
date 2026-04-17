# Spell checking

We use [codespell](https://github.com/codespell-project/codespell) to catch common typos in documentation and source files. It runs via [uvx](https://docs.astral.sh/uv/concepts/tools/) (no Python install needed — uv handles it).

## Commands

| Command | Scope | What it does |
|---|---|---|
| `pnpm spellcheck` | `src/app/(docs)/` | Check documentation files for typos. |
| `pnpm spellcheck:fix` | `src/app/(docs)/` | Auto-fix typos in documentation files (writes in place). |
| `pnpm spellcheck:all` | `src/` | Check all source files (docs + components + scripts). |

## Configuration

There are two config files because the docs-only and full-source scopes need different skip rules.

### `pyproject.toml` — docs scope

Used by `pnpm spellcheck` and `pnpm spellcheck:fix`. Targets MDX documentation.

- **Skips:** code files (`*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`, `*.css`), images, `node_modules`, `.git`
- **Ignore list:** words that are correct but look like typos (French words, proper nouns, domain-specific terms)

### `.codespell-src.toml` — full source scope

Used by `pnpm spellcheck:all`. Targets everything under `src/`.

- **Skips:** `node_modules`, `public`, `static`, `.next`, build artifacts, lock files, binary files
- **Ignore list:** same as above, plus additional terms found in source code

## Adding words to the ignore list

When codespell flags a word that's correct (a proper noun, a foreign word, a technical term), add it to the `ignore-words-list` in the appropriate config file:

```toml
# pyproject.toml (for docs-only terms)
[tool.codespell]
ignore-words-list = "rouge,revered,mouvement,..."

# .codespell-src.toml (for terms in source code + docs)
[tool.codespell]
ignore-words-list = "rouge,revered,mouvement,..."
```

Keep both lists in sync for terms that appear in both scopes.

## Typical workflow

```bash
pnpm spellcheck          # see what's flagged
pnpm spellcheck:fix      # auto-fix (review the diff after)
git diff                  # verify changes
```

For a broader check across all source:

```bash
pnpm spellcheck:all
```

## Files

| File | Purpose |
|---|---|
| `pyproject.toml` | codespell config for docs scope (`[tool.codespell]` section). |
| `.codespell-src.toml` | codespell config for full source scope. |
