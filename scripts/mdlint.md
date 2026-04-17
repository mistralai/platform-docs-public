# Markdown linting

We use [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) to catch structural issues in our MDX documentation files (heading hierarchy, trailing whitespace, list formatting, etc.).

## Commands

| Command | What it does |
|---|---|
| `pnpm mdlint` | Run the linter and print errors to the terminal. |
| `pnpm mdlint:fix` | Auto-fix all fixable errors across all files. |
| `pnpm mdlint:report` | Generate `mdlint-errors.csv` with clickable VS Code links and an `auto_fixable` column. |
| `pnpm mdlint:apply` | Read `mdlint-errors.csv` and fix only the rows you marked in the `to_fix` column. |

## Typical workflows

### Fix everything at once

```bash
pnpm mdlint:fix
git diff                # review changes
git checkout -- .       # revert if unhappy
```

### Selective fix via CSV

```bash
pnpm mdlint:report
# open mdlint-errors.csv, put any value (x, yes, 1…) in the to_fix column
pnpm mdlint:apply
git diff
```

The apply script works at **file × rule** granularity: if you mark MD009 on `page.mdx` line 10, all MD009 errors in that file get fixed. markdownlint can't target individual lines.

You can also pass a custom filename to both commands:

```bash
pnpm mdlint:report my-audit    # writes my-audit.csv
pnpm mdlint:apply my-audit.csv
```

## Configuration

The config lives in `.markdownlint-cli2.jsonc` at the repo root. It targets `src/app/(docs)/**/*.mdx`.

### Rules reference

Full rule list: [markdownlint rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)

> **Note:** We use the Node.js [markdownlint](https://github.com/DavidAnson/markdownlint) (via markdownlint-cli2), not the [Ruby version](https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md). The rule IDs overlap but the implementations differ slightly.

### Disabled rules

These rules are turned off because they conflict with MDX syntax or other tooling:

| Rule | Name | Why it's off |
|---|---|---|
| MD013 | line-length | Prettier handles line wrapping (`proseWrap: "preserve"`). |
| MD025 | single-title/single-h1 | Tab components (`<Tabs>`) legitimately produce multiple `#` headings in one file. |
| MD028 | no-blanks-blockquote | JSX components between blockquotes trigger false positives. |
| MD031 | blanks-around-fences | Code blocks inside JSX (`<TabItem>`) don't have blank lines around them. |
| MD032 | blanks-around-lists | Lists inside JSX components trigger false positives. |
| MD033 | no-inline-html | MDX files are full of JSX — this rule is useless here. |
| MD036 | no-emphasis-as-heading | Admonition directives (`:::tip`) look like emphasis to the linter. |
| MD041 | first-line-heading | MDX files start with imports or frontmatter, not a heading. |
| MD046 | code-block-style | Indented code inside JSX components triggers false "indented style" warnings. |
| MD060 | table-column-style | JSX table components cause noise; Prettier handles table formatting. |

### Configured rules

| Rule | Name | Setting | Why |
|---|---|---|---|
| MD003 | heading-style | `atx` | We use `#` headings, not underline-style (`===`). |
| MD024 | no-duplicate-heading | `siblings_only: true` | Tab components repeat headings across sections — only flag duplicates within the same parent. |
| MD026 | no-trailing-punctuation | `punctuation: ".,;:!"` | Allow `?` in headings (FAQ-style) but flag other trailing punctuation. |

### All other rules

Every rule not listed above is **enabled with default settings**. This includes the ones that catch real issues:

- **MD001** — heading levels should increment by one
- **MD004** — consistent unordered list style
- **MD007** — unordered list indentation
- **MD009** — trailing spaces
- **MD012** — multiple consecutive blank lines
- **MD022** — blank lines around headings
- **MD029** — ordered list prefix style
- **MD034** — bare URLs (should use `<url>` or `[text](url)`)
- **MD037** — spaces inside emphasis markers
- **MD040** — fenced code blocks should specify a language
- **MD047** — files should end with a single newline
- **MD051** — link fragments should be valid
- **MD059** — link text should be descriptive

## Files

| File | Purpose |
|---|---|
| `.markdownlint-cli2.jsonc` | Linter configuration (globs, ignored paths, rule settings). |
| `scripts/mdlint-report.sh` | Generates the CSV error report. |
| `scripts/mdlint-apply.sh` | Applies fixes from a marked-up CSV report. |
| `mdlint-errors.csv` | Generated report (gitignored). |
