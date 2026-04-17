# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mistral AI's platform documentation site, built with **Next.js 15** (App Router), **MDX**, **Tailwind CSS v4**, and **TypeScript**. Uses **pnpm** as package manager.

## Commands

```bash
pnpm install              # Install dependencies (also runs git submodule init + API docs build)
pnpm dev                  # Dev server (builds cookbooks + exports raw MDX first, then runs next dev)
pnpm build                # Full production build (prebuild scripts + next build)
pnpm lint                 # ESLint via next lint
pnpm type-check           # TypeScript check (tsc --noEmit)
```

Prebuild scripts (run automatically by `pnpm build`):
- `pnpm cookbook:build` — Compiles cookbook data from notebooks
- `pnpm rawmdx:export` — Exports raw MDX content
- `pnpm copy-openapi` — Copies OpenAPI specs
- `pnpm search:build` — Builds the search index
- `pnpm copy-assets-file` — Copies static assets

## Architecture

### Route Groups (App Router)

- `src/app/(docs)/` — Main documentation pages with sidebar layout. Each page is a folder with `page.mdx`, `page.md`, or `page.tsx`.
- `src/app/(api)/` — API reference pages (generated from OpenAPI via `@speakeasy-api/docs-md`)
- `src/app/(no-sidebar-pages)/` — Pages without sidebar (e.g., blog)
- `src/app/api/` — API routes (e.g., OG image generation)

### Content & Sidebar System

The sidebar is **filesystem-driven** — `src/lib/content/index.ts` (`getSidebar`) recursively scans the `(docs)` directory tree:

- **`page.mdx` / `page.md`** — Page content with YAML frontmatter (title, description, sidebar_position, sidebar_label, etc.)
- **`_meta.md` / `_meta.mdx`** — Overrides sidebar metadata for a directory without being a page
- **`_category_.json`** — Category metadata (label, position, link) for directory grouping in sidebar
- Sorting uses `sidebar_position` (frontmatter) or `position` (category JSON), then alphabetical
- Pagination is auto-generated across the flattened sidebar tree

Frontmatter schema: `src/schema/content/documentation.ts` (`DocsMetadata`, `DocsCategoryMetadata`)

### Path Alias

`@/*` maps to `src/*` (configured in `tsconfig.json` with `baseUrl: "./src"`)

### Key Directories

- `src/components/markdown/` — MDX component overrides (registered in `src/mdx-components.tsx`)
- `src/components/ui/` — Shared UI primitives (Radix-based)
- `src/components/layout/` — Header, footer, sidebar, breadcrumb, pagination
- `src/components/common/` — Reusable doc-specific components
- `src/schema/` — TypeScript types and data schemas (sidebar, models, cookbooks, etc.)
- `src/lib/content/` — Sidebar builder, frontmatter parser, heading extraction
- `src/lib/frontmatter/` — Remark plugins (directives, admonitions, audio, OG images)
- `src/scripts/` — Build-time scripts (search index, cookbook compilation, MDX export)

### MDX Pipeline

Next.js MDX is configured in `next.config.ts` with custom remark plugins:
- `remarkDirective` + `admonitionDirective` — Admonition callouts (info, warning, etc.)
- `remarkAudioToComponent` — Audio elements in MDX
- `remarkOgFromPath` — Auto-generates OG image paths
- `remarkMdxFrontmatter` — Exposes frontmatter as `_fm` export
- `remarkDetailsClasses` — Adds prose classes to `<details>` elements

### State Management

- **Jotai** — Atomic state (used across components)
- **Zustand** — Store-based state
- **nuqs** — URL query string state

## Writing Standards

See `src/docs-doctrine.md` for the full documentation style guide. Key rules:
- Active voice, imperative for instructions
- No marketing fluff — banned words: "Simply", "Just", "Obviously", "Easily", "Powerful", "Seamless"
- Sentence case for headings
- **Bold** for UI labels, `monospace` for code/file names/CLI commands
- 1-4 sentences per paragraph max
