Release notes are stored as one timestamped JSON file per release, grouped by locale.

Use this file naming pattern:

```text
src/data/releases/en/YYYY-MM-DD-short-release-slug.json
src/data/releases/fr/YYYY-MM-DD-short-release-slug.json
```

Each file contains a single release note object. Lingo translates the source files from `en` into `fr`. The page imports the locale-aware collection from `index.ts`.

Release notes can include media. Store image files in an `assets` directory next to the release JSON and reference them with a relative URL:

```json
{
  "media": {
    "type": "image",
    "url": "assets/example.png",
    "alt": "Screenshot description"
  }
}
```

The `copy-release-assets` script copies these files to `public/assets/releases/<locale>/assets/` during prebuild.
