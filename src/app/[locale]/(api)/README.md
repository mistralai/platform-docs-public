# Mistral API reference — how it's built

The API reference is **generated**, not hand-written:

| Layer | Location | Edit by hand? |
|-------|----------|---------------|
| Content (English, generated) | `src/content/en/api/**` — one `endpoint/**/page.mdx` per operation group + `sidebar-metadata.json` | No |
| Content (French mirror, generated) | `src/content/fr/api/**` — translated from English by Lingo.dev | No |
| Rendering (this folder) | `src/app/[locale]/(api)/` — the route group + the Speakeasy React components the pages import | Yes |
| Generation tooling | `src/scripts/api/` — see [`src/scripts/api/README.md`](../../../scripts/api/README.md) | Yes |

> Never hand-edit anything under `src/content/{en,fr}/api/**`: the English tree
> is overwritten on the next `pnpm api:build`, the French tree on the next Lingo
> run.

## How it's generated

```
openapi-public-doc.yaml          source of truth (mistralai/dashboard) — never edited
  └─ api:apply  →  .openapi-docs.yaml        source + patch DB + transforms (hoist $defs, prune)
       └─ docs-md (V2)  →  src/content/en/api/**      Speakeasy renders pages + examples
            └─ postprocess-mdx                        re-inject File descriptions Speakeasy drops
                 └─ docs-md (V1) + merge              add V1 Python SDK tabs alongside V2
```

One command runs the whole chain:

```bash
pnpm api:build           # apply + docs-md V2 + postprocess + docs-md V1 + merge SDK tabs
pnpm api:build:strict    # same, but fail the build if audit-mdx finds CRITICAL example issues
```

Update to a newer dashboard spec, review the auto-detected bad examples, rebuild:

```bash
pnpm api:fetch           # pull latest openapi-public-doc.yaml
pnpm api:audit           # parse generated MDX, detect Speakeasy lorem/fallback examples
pnpm api:review          # accept / edit / ignore proposals interactively
pnpm api:promote         # save into src/scripts/api-examples.yaml (versioned patch DB)
pnpm api:build
```

## Examples & patches

Speakeasy fills missing examples with lorem-ipsum / dummy values. Instead of
editing generated MDX, overrides live in `src/scripts/api-examples.yaml` — a
JSON-pointer patch DB applied to the spec **before** rendering (example values,
whole-operation examples, injected `x-codeSamples`, ignore markers). This keeps
the dashboard spec untouched and makes fixes survive every regeneration.
`api:audit` finds the fallbacks; `api:review` / `api:promote` curate them.

## Speakeasy v2 components (this folder)

Generated pages import components from the local barrel
`@/app/[locale]/(api)/components/speakeasy` (this folder, set via
`componentPackageName` in `speakeasy.config.mjs`). The barrel re-exports the
Speakeasy React components **plus** the repo's local wrappers.

> When the generator emits a component, it **must** be exported from that barrel.
> Example: `OperationResponsesSectionTitle` is a local wrapper
> (`components/operation/response-body.tsx`) added because docs-md emits
> `<OperationResponsesSectionTitle slot="responses-title">` but the npm package
> doesn't ship it. A missing export surfaces as
> `Attempted import error: '<Name>' is not exported` at build/dev.

## French translation (Lingo.dev)

`src/content/fr/api/**` mirrors the English tree, translated by the Lingo.dev
engine (`.lingo/config.json`, source `en` → target `fr`). It runs via the
Lingo.dev **GitHub app on pull requests** (`onPullRequest`), committing
translations back to the PR branch. Translation is **incremental** — only
changed EN source strings are re-translated (content-hashed). To force a full
re-translation:

```bash
lingo.dev i18n --force                                   # everything
lingo.dev i18n --force --file "src/content/en/api/**"    # scope to the API tree
```

### Gotchas (Lingo × generated MDX)

The generated MDX is dense JSX; Lingo has historically corrupted it. When
touching the `fr` tree, watch for:

- **Brace escaping** — literal braces must stay escaped (`\{ \}`): heading
  anchors (`\{#...\}`) and inline JSON examples. Lingo sometimes strips the `\`,
  which makes MDX parse the line as a JS expression.
- **`typeInfo={{…}}`** — non-prose JSX expressions; must stay byte-identical to
  the English source. They must never be translated or reformatted.
- **Structural tags** — `<Expandable…>` / `<Operation…>` nesting must match the
  English source exactly; a renamed or dropped tag breaks the MDX build.

A fast MDX-compile pass over `src/content/fr/api` catches all of the above
before `pnpm build` (which renders every locale).
