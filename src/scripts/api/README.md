# API reference build pipeline

User-controlled pipeline for turning the dashboard's OpenAPI spec into the
generated docs under `src/content/en/api/**` — endpoint pages
(`endpoint/**/page.mdx`) + `sidebar-metadata.json`.

> Everything under `src/content/{en,fr}/api/**` is **generated** — never edit it
> by hand. The English tree is overwritten on the next `pnpm api:build`; the French
> tree on the next `pnpm api:build:fr` (after the FR string catalog is produced —
> local Mistral by default, or Lingo; see [French (i18n) pipeline](#french-i18n-pipeline)).
> Change one of: the spec patch DB (`api-examples.yaml`), the structural transforms
> (`lib/transforms.ts`), or the MDX post-processing (`postprocess-mdx.ts`).

## Fetch & build (TL;DR)

```bash
pnpm api:fetch     # download the latest dashboard spec -> openapi-public-doc.yaml
pnpm api:build     # apply + docs-md (V2) + postprocess + docs-md (V1) + merge SDK tabs
```

- `api:fetch` pulls `openapi/specs/v2/openapi-public-doc.yaml` from
  `mistralai/dashboard@main` (uses `GITHUB_TOKEN`/`GH_TOKEN` or `gh auth token`).
- `api:build` regenerates the whole English API reference from the current spec
  + patch DB. Run `api:fetch` first to also refresh the source spec.

## Why fetch from the dashboard

`api:fetch` (`fetch-dashboard-openapi.ts`) pulls
`openapi/specs/v2/openapi-public-doc.yaml` from `mistralai/dashboard@main` over
the GitHub Contents API. It **replaces the legacy hand-committed `openapi.yaml`**.

Before, `openapi.yaml` was committed and edited by hand ("swaggers from main" +
ad-hoc fixes baked straight into the spec). The spec drifted from what the
dashboard actually shipped, and doc-only corrections were indistinguishable from
the real spec, so every release meant a manual re-merge. The fetch step exists to
fix that. It rests on a **three-file model**:

| File | Role | Tracked? | Hand-edited? |
|------|------|----------|--------------|
| `openapi-public-doc.yaml` | fetched source of truth (dashboard v2 spec) | yes (pinned snapshot) | **never** |
| `src/scripts/api-examples.yaml` | doc-only examples & overrides (patch DB) | yes | yes |
| `.openapi-docs.yaml` | build artifact = source + patches + transforms | no (gitignored) | never |

Reasons:

1. **Single source of truth.** The spec is pulled from where it ships, so the docs
   can't silently diverge from the product. Bumping a release is `api:fetch`, not a
   hand-merge of upstream changes into a committed spec.
2. **Source vs. overrides are separated.** The fetched spec is never touched;
   doc-only fixes (examples, code samples, ignores) live in the versioned patch DB
   and are reapplied deterministically by `api:apply`, which reports **orphan
   patches** when the upstream path disappears. An upgrade is re-fetch + re-apply.
3. **Reproducible & pinned.** The fetched `openapi-public-doc.yaml` is committed as
   a snapshot, so CI builds offline; the patched `.openapi-docs.yaml` is a gitignored
   derived artifact (never committed).
4. **Authenticated & scriptable.** Token chain `GITHUB_TOKEN` → `GH_TOKEN` →
   `gh auth token`; `--repo` / `--ref` / `--spec` / `--out` override the defaults
   (e.g. pull a spec from a feature branch of the dashboard).
5. **Public download stays honest.** `copy-openapi.ts` publishes the **source**
   spec (`openapi-public-doc.yaml`) to `public/openapi.yaml` — not the internal
   patched one — so external consumers stay in sync with the dashboard.

## Pipeline

EN — `pnpm api:build`:

```
1. fetch        openapi-public-doc.yaml             (source of truth, never edited)
2. apply        .openapi-docs.yaml                  (source + patches + transforms)
3. docs-md      src/content/en/api/**/*.mdx         (pages + examples)
4. postprocess  src/content/en/api/**               (re-inject dropped File descriptions)
5. docs-md V1 + merge SDK tabs                      (V1 Python tabs alongside V2)
   --- when the spec changes, curate examples: ---
6. audit        api-examples.draft.yaml             (parse MDX, detect Speakeasy fallbacks)
7. review/promote  api-examples.yaml                (versioned patch DB) -> rebuild
```

FR — `pnpm api:build:fr` (details in
[French (i18n) pipeline](#french-i18n-pipeline)):

```
a. extract      en/api/_i18n/strings.json           (translatable prose, JSON-pointer catalog)
b. translate    fr/api/_i18n/strings.json           (Mistral local by default; or Lingo)
c. reinject     .openapi-docs.fr.yaml               (FR prose back into the spec)
d. docs-md      src/content/fr/api/**               (FR pages; EN tree untouched)
e. localize     fr sidebar labels + each page H1    (api:localize-labels)
```

## Commands

| Command                  | What it does                                                       |
|--------------------------|--------------------------------------------------------------------|
| `pnpm api:fetch`         | Download `openapi-public-doc.yaml` from `mistralai/dashboard`.     |
| `pnpm api:apply`         | Build `.openapi-docs.yaml` from source + patches + transforms.     |
| `pnpm api:audit`         | **MDX-driven** audit: parse generated MDX, find Speakeasy fallbacks, propose patches. |
| `pnpm api:audit:legacy`  | Endpoint-walk audit: scan source spec for missing `requestBody.example`. No MDX needed, less precise. |
| `pnpm api:review`        | Interactive CLI: walk draft proposals one by one (sorted critical → warning → doubt). |
| `pnpm api:promote`       | Move draft into `api-examples.yaml`.                               |
| `pnpm api:build`         | purge `endpoint/` + apply + docs-md V2 + docs-md V1 + merge SDK tabs. `--no-clean` keeps stale pages. |
| `pnpm api:extract-strings` | Extract translatable spec prose → `en/api/_i18n/strings.json` (the MT input catalog). |
| `pnpm api:translate`     | Translate the catalog locally via the Mistral API → `fr/api/_i18n/strings.json` (TM-backed, incremental). `--locale`, `--force`, `--dry-run`. Needs `MISTRAL_API_KEY`. |
| `pnpm api:localize-labels` | Translate the FR sidebar labels and set each page H1 to its (translated) label. |
| `pnpm api:build:fr`      | purge `fr/api/endpoint/` + (re)build the FR catalog + reinject → FR spec → docs-md → localize labels → `src/content/fr/api/**`. `--translate` builds the catalog via Mistral, `--stub` fakes it (offline), `--skip-apply` reuses `.openapi-docs.yaml`, `--no-clean` keeps stale pages. |
| `pnpm api:migrate`       | One-shot: import legacy overrides + hardcoded patches.             |

## Structural transforms (`lib/transforms.ts`)

Applied by `api:apply` after the patch DB, before docs-md. Not user-content;
they normalize the spec so docs-md renders correctly:

- **`hoistLocalDefs`** — docs-md doesn't support schema-level `$defs`; inline
  them into `components/schemas` with unique names.
- **`pruneUnreferencedSchemas`** — drop schemas no longer referenced after
  patches (keeps the output small).
- **`applyTagRenames`** — re-tag deprecated endpoints **by name** (index-free):
  `agents` → `deprecated.agents`, `fine-tuning` → `deprecated.fine-tuning`
  (operations + the top-level `tags` list + `x-displayName`). docs-md maps a tag
  `a.b` to slug `endpoint/a/b`, so these render under `endpoint/deprecated/**`
  and the API sidebar groups any slug containing `deprecated` under "Deprecated".
  To deprecate another tag, add it to `TAG_RENAMES`.

## Page size

Schemas are rendered **fully inline** (matching the public docs). Some pages are
large (e.g. `beta/conversations` ~57k lines) because docs-md re-expands every
operation's schema recursively. A `maxNestingLevel`/embed approach was tried to
shrink them but reverted (broke the nested rendering); see
`SPEAKEASY-V2-SPIKE.md` for the full investigation and next steps.

## French (i18n) pipeline

The FR API reference is **not** translated from the generated MDX. We translate the
spec's **prose only** (a ~260 KB catalog) and regenerate FR from a translated spec —
small input, and rendering stays fully inline (identical to the public docs). The EN
tree is never touched.

```
.openapi-docs.yaml ──extract──▶ en/api/_i18n/strings.json   (flat JSON-pointer → prose)
                                       │  translate (Mistral local by default; or Lingo)
                                       ▼
                                fr/api/_i18n/strings.json
.openapi-docs.yaml + FR catalog ──reinject──▶ .openapi-docs.fr.yaml ──docs-md──▶ fr/api/**
```

- **What's extracted** (`lib/spec-strings.ts`): only `description`, `summary`, and
  `x-displayName`; the subtrees `example` / `examples` / `enum` / `default` /
  `const` are skipped, so no keys, enums, `$ref`s, or sample payloads are ever sent
  to MT. The catalog is a flat map of RFC 6901 pointer → English string, sorted for
  diff-friendly output. It lives in `src/content/en/api/_i18n/` — the `_`-prefixed
  dir is never routed as a page.
- **Translation engine — local Mistral (default).** `api:translate`
  (`translate-catalog.ts`) translates the catalog via the Mistral API through the
  shared engine `lib/mistral-translate.ts`, backed by a content-addressed translation
  memory (`translation-memory.fr.json`, committed) — identical strings are translated
  once and re-runs are incremental. Needs `MISTRAL_API_KEY`.
- **Lingo (alternative).** Same file contract: commit + push
  `en/api/_i18n/strings.json` and Lingo writes `fr/api/_i18n/strings.json`
  (`.lingo/config.json` matches `src/content/en/api/_i18n/**/*.json`; the `en/api`
  MDX is deliberately excluded). Either engine feeds the same `build-fr.ts` reinjection.
- **Reinjection** (`build-fr.ts`): each FR pointer is written back over the spec to
  produce `.openapi-docs.fr.yaml`; pointers missing from the spec are skipped, so a
  stale catalog degrades gracefully (those fields stay English). `speakeasy.config.mjs`
  is locale-driven via `API_PAGE_OUT_DIR` / `API_SIDEBAR_META_PATH` (defaults = EN),
  so the same config emits the FR tree.
- **Labels** (`api:localize-labels`, `localize-fr-labels.ts`): docs-md derives the
  sidebar label + page H1 from the tag *name* (not a translatable field), so they'd
  stay English. This translates the sidebar labels and sets each page's H1 to its own
  translated label (keyed by slug). `build-fr.ts` runs it automatically.
- **Out of scope for FR:** the V1/SDK-tab merge — FR ships V2 code samples only.

### Regenerate FR

Local Mistral (default, one shot):

```bash
pnpm api:build:fr --translate   # apply + extract + translate (Mistral) + reinject + docs-md + localize
```

Lingo instead of local MT:

```bash
pnpm api:build                  # ensure .openapi-docs.yaml exists (EN build)
pnpm api:extract-strings        # refresh en/api/_i18n/strings.json
git add src/content/en/api/_i18n/strings.json   # commit + push → Lingo writes fr/api/_i18n/strings.json
pnpm api:build:fr               # reinject the Lingo catalog → FR pages
```

`pnpm api:build:fr --stub` synthesizes a fake catalog (`[fr] ` + English) to validate
the generation/rendering pipeline offline, without any MT pass.

> **Deferred — Lingo translating the spec directly.** Lingo reports the MDX OOM is
> fixed and now supports translating the OpenAPI YAML itself (`format: yaml-openapi`):
> move the spec to e.g. `openapi/en.yaml`, add
> `{ "pattern": "openapi/en.yaml", "format": "yaml-openapi" }` to `.lingo/config.json`,
> `lingo push openapi/en.yaml`, then rerun Speakeasy per locale into each locale
> folder. That would replace the prose-catalog hop entirely. Not wired yet — see
> `SPEAKEASY-V2-SPIKE.md`.

## Detection — how the MDX-driven audit works

Speakeasy fills missing examples from a **fixed pool** of fallback strings (see
`node_modules/@speakeasy-api/docs-md/dist/data/generateCodeSamples.js`):

```
"cillum culpa aute minim", "ipsum eiusmod", "consequat do", ... (40 entries)
```

Whenever `examples[0] ?? defaultValue ?? fallback` falls through, Speakeasy
emits one of these strings. We copy that list verbatim into
`src/scripts/api/lib/lorem-detector.ts` and **match by exact equality** —
zero false positives.

Three severity levels are emitted per finding:

| Severity   | Meaning                                                | When |
|------------|--------------------------------------------------------|------|
| `critical` | guaranteed broken                                      | Speakeasy fallback string, format-mismatch (UUID schema with non-UUID value), enum violation |
| `warning`  | violates declared schema constraint                    | number out of `min`/`max`, string failing `pattern` |
| `doubt`    | heuristic suspicion (user decides)                     | generic placeholder (`"value"`, `"foo"`), suspiciously short string, property-name vs value semantics mismatch (`document_url: "hello"`), Speakeasy fallback number |

A safety regex catches new Speakeasy fallback strings if the lib is bumped —
flag is `lorem-safety` instead of `lorem-exact`.

## Patch DB format

`src/scripts/api-examples.yaml` (versioned, hand-edited):

```yaml
version: 1
patches:
  # Override a property example (most common case)
  - path: /components/schemas/UserMessage/properties/content/example
    value: "Who is the best French painter?"
    source: user

  # Override a top-level operation example (override Speakeasy composition entirely)
  - path: /paths/~1v1~1chat~1completions/post/requestBody/content/application~1json/example
    value:
      messages: [{role: user, content: "..."}]
      model: mistral-large-latest
    source: user

  # Inject a custom code sample
  - path: /paths/~1v1~1ocr/post/x-codeSamples
    value:
      - lang: python
        source: |
          ...
    source: user

  # Permanently ignore a path
  - path: /paths/~1v1~1ocr/post/requestBody/content/application~1json/example
    ignored: true
    reason: covered by x-codeSamples
    source: user
```

Path is an [RFC 6901 JSON pointer](https://datatracker.ietf.org/doc/html/rfc6901)
into the OpenAPI spec. `~1` encodes `/`, `~0` encodes `~`. The `value` is set
verbatim at that location.

## accept vs skip vs ignore

| Action | Effect on draft | Effect on api-examples.yaml | Reappears next audit? |
|--------|-----------------|------------------------------|------------------------|
| accept | kept as `source: user`  | promoted as patch with value     | no |
| edit   | kept with new value     | promoted as patch with value     | no |
| skip   | removed entirely        | nothing added                    | yes (heuristic again) |
| ignore | kept as `ignored: true` | promoted as ignored marker       | no, audit leaves it alone |

## Workflows

### Update to a new dashboard release

```bash
pnpm api:fetch                  # pull latest spec
pnpm api:build                  # apply + docs-md + postprocess (regenerates MDX)
pnpm api:audit                  # parse MDX, find lorem hits, write draft

# Edit ./src/scripts/api-examples.draft.yaml in your editor,
# OR walk it interactively:
pnpm api:review

pnpm api:promote                # save reviewed draft as new patch DB
pnpm api:build                  # full rebuild (apply + V2 + V1 + merge)
git add src/scripts/api-examples.yaml openapi-public-doc.yaml
```

### Daily docs work (no spec change)

```bash
pnpm api:build       # rebuilds from current patch DB
```

### Detecting orphaned patches

When the dashboard renames or removes an endpoint/schema, patches pointing
to it become orphans. Both `audit` and `apply` print them:

```
Orphan patches (path no longer exists):
  - /components/schemas/RemovedSchema/properties/.../example
```

Edit `api-examples.yaml` to remove or update.

### Removed or renamed endpoints (stale pages)

docs-md writes one page per current tag but **never deletes** pages for tags that
disappeared or were renamed upstream — it has no prune step (verified: a re-tag
left orphan pages behind until they were removed by hand). So both builders purge
the generated `endpoint/` tree before regenerating:

- `pnpm api:build` removes `src/content/en/api/endpoint` first.
- `pnpm api:build:fr` removes `src/content/fr/api/endpoint` first.

Only `endpoint/` is purged; `_i18n/` (the string catalog) and `sidebar-metadata.json`
are preserved. Because the trees are git-tracked, removed endpoints show up as
deletions in `git status` — review before committing. Pass `--no-clean` to skip the
purge (e.g. incremental dev rebuilds where you know no tag was removed).

## Files

```
src/scripts/api/
├── audit.ts                    dispatcher (--legacy for old behavior)
├── audit-mdx.ts                MDX-driven audit (default)
├── audit-legacy.ts             endpoint-walk audit (--legacy)
├── apply.ts                    source + patches + transforms → .openapi-docs.yaml
├── build.ts                    orchestrator (apply + docs-md V2 + postprocess + V1 + merge)
├── build-fr.ts                 FR build: catalog → reinject → FR spec → docs-md → localize
├── extract-spec-strings.ts     extract translatable prose → en/api/_i18n/strings.json
├── translate-catalog.ts        translate the catalog via Mistral (api:translate)
├── localize-fr-labels.ts       translate FR sidebar labels + page H1 (api:localize-labels)
├── postprocess-mdx.ts          re-inject dropped File descriptions
├── interactive.ts              CLI a/s/e/i/q review
├── migrate-from-legacy.ts      one-shot import (legacy yaml + hardcoded)
├── translation-memory.fr.json  content-addressed EN→FR TM (committed; reused across runs)
└── lib/
    ├── json-pointer.ts             RFC 6901 (get, set, exists)
    ├── lorem-detector.ts           Speakeasy fallback list + format validators + heuristics
    ├── mdx-parser.ts               extract Request Example blocks from MDX
    ├── json-schema-walker.ts       map JSON path → schema property location
    ├── patch-db.ts                 load/save api-examples.yaml
    ├── propose.ts                  schema-walking heuristic example generator
    ├── proposal-heuristics.yaml    tunable defaults per name/format/type
    ├── spec-strings.ts             extract/reinject translatable prose (i18n catalog)
    ├── mistral-translate.ts        shared Mistral translation engine + TM loader
    └── transforms.ts               hoist $defs + prune unreferenced + retag deprecated tags
```

Sibling scripts in `src/scripts/` (not under `api/`):

```
fetch-dashboard-openapi.ts      api:fetch — sync the source spec from mistralai/dashboard
copy-openapi.ts                 publish the source spec to public/openapi.yaml (download)
merge-api-sdk-versions.ts       wrap V1+V2 Python samples in <SDKVersionCodeSample>
```

## Adding new heuristic defaults

Edit `src/scripts/api/lib/proposal-heuristics.yaml` (used by `audit-legacy`
and the schema-walking proposer). Three lookup tables: `stringByName`,
`stringByFormat`, `numberByName`/`booleanByName`.

For doubt-level detection rules (URL-shaped, model-name-shaped, etc.), edit
`NAME_RULES` in `src/scripts/api/lib/lorem-detector.ts`.
