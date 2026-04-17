# Link checking

We use [lychee](https://github.com/lycheeverse/lychee) to find broken links. There are two modes: a **local check** that builds the site and crawls the HTML output, and a **CI check** that scans source files directly on every PR.

## Commands

| Command | What it does |
|---|---|
| `pnpm check-links` | Build the site, then check all internal and external links in the HTML output. |
| `pnpm check-links:only` | Skip the build and reuse an existing `.next` output (faster iteration). |

## How it works

### Local check (`scripts/check-links.sh`)

1. Runs `pnpm build --no-lint` to produce the full Next.js build in `.next/server/app/`.
2. Feeds every generated HTML file to lychee.
3. lychee resolves **internal links** against the build directory (`--root-dir`, `--fallback-extensions html`) and checks **external links** over HTTP.
4. Outputs a timestamped report in `link-reports/`:
   - `broken-links_<timestamp>.json` — raw lychee output
   - `broken-links_<timestamp>.csv` — cleaned up with columns: `source` (mapped back to the MDX path), `broken_link`, `type` (internal/external), `status`
5. Prints a summary table to the terminal.

Use `--no-build` to skip step 1 when you already have a recent build:

```bash
pnpm check-links:only
```

### CI check (`.github/workflows/check-links.yml`)

Runs on every PR and push to `main` that touches `src/app/(docs)/` or `.lychee.toml`. It scans `.md` and `.mdx` source files directly (no build needed) using the [lychee GitHub Action](https://github.com/lycheeverse/lychee-action).

The CI check uses a response cache (`.lycheecache`, 1-day TTL) to avoid hammering external sites on every run.

## Installation

lychee is a standalone binary. Install it locally to run `pnpm check-links`:

```bash
# macOS
brew install lychee

# Other platforms: https://github.com/lycheeverse/lychee#installation
```

The CI workflow uses the `lycheeverse/lychee-action` GitHub Action, so no installation is needed there.

## Configuration

### `.lychee.toml` — CI config

Used by the GitHub Actions workflow. Key settings:

- **`exclude_path`** — skips `src/app/(api)` (auto-generated API docs from OpenAPI spec)
- **`exclude`** — URL patterns to skip:
  - `docs.mistral.ai` — internal links are checked by the local build, not by CI
  - Mistral services (`api.mistral.ai`, `console.mistral.ai`, etc.) — require auth
  - Placeholder/example URLs (`example.com`, `localhost`, `your-*`)
  - Sites that rate-limit bots (`linkedin.com`, `arxiv.org`, `colab.research.google.com`, `x.com`)
  - Raw GitHub content (`raw.githubusercontent.com`) — often 403s from CI
- **`accept = [200, 429]`** — treat rate-limited responses as OK
- **`include_fragments = false`** — don't check anchors on external URLs (too flaky)
- **`include_mail = false`** — don't validate email addresses

### `scripts/check-links.sh` — local config

The exclude list is defined inline in the script as `LYCHEE_OPTS`. It mirrors `.lychee.toml` but also excludes static assets (`*.png`, `*.css`, `*.js`, etc.) since those live in `.next/static/` and aren't in the build output directory.

## Reports

Reports are written to `link-reports/` (gitignored) with a timestamp:

```
link-reports/
  broken-links_2026-03-13_143022.json
  broken-links_2026-03-13_143022.csv
```

The CSV maps HTML paths back to source MDX files, so you can go straight to the file that contains the broken link.

## Typical workflow

```bash
pnpm check-links              # full build + check
# ... fix broken links ...
pnpm check-links:only         # re-check without rebuilding
```

## Files

| File | Purpose |
|---|---|
| `scripts/check-links.sh` | Local link-checking script (build + lychee). |
| `.lychee.toml` | lychee config for CI (GitHub Actions). |
| `.github/workflows/check-links.yml` | CI workflow that runs on PRs and pushes to `main`. |
| `link-reports/` | Timestamped JSON and CSV reports (gitignored). |
