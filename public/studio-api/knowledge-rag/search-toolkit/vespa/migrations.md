---
title: Manage schema
sidebar_position: 3
sidebar_label: Manage schema
---

Manage your Vespa application schemas through Python migrations. For the concepts behind schemas, fields, and ranking, see [Anatomy of a Vespa application](anatomy).

<SectionTab as="h2" sectionId="creating-and-evolving-schemas">Creating and Evolving Schemas</SectionTab>

Use migrations to define and modify your schemas. Migrations are Python files under `vespa_app/migrations/` that are append-only, ordered by timestamp, and re-run on every deploy.

Generate a new migration:

```bash
uv run mistral-vespa generate-migration --app-dir ./vespa_app <name>
```

This creates a timestamped file with a class stub:

```python
from mistralai.search.toolkit.plugins.vespa.migration import VespaMigration

class MyMigration(VespaMigration):
    def migrate(self) -> None:
        pass  # Define your changes here
```

<SectionTab as="h2" sectionId="defining-a-schema">Defining a Schema</SectionTab>

Use `create_default_schema` for schemas that work with `VespaSearchIndex` out of the box:

```python
from mistralai.search.toolkit.plugins.vespa.app.schemas.app import FieldDefinition, SearchMode
from mistralai.search.toolkit.plugins.vespa.migration import VespaMigration, create_default_schema, set_app_name

class InitialSchema(VespaMigration):
    def migrate(self) -> None:
        set_app_name("myapp")
        create_default_schema(
            name="articles",
            mode=SearchMode.INDEX,
            embedding_dimensions=1024,
            schema_version=1,
            additional_fields=[
                FieldDefinition.TextField(name="title"),
                FieldDefinition.TimestampField(name="created_at"),
            ],
        )
```

This creates a schema with all the fields the pipeline needs (chunks, embeddings, metadata, etc.) plus your project-specific fields via `additional_fields`.

Use `create_schema` with explicit fields when you need full control over the field set.

### Adding Fields to an Existing Schema

Use `add_field` in a new migration to add fields after the initial schema is created:

```python
from mistralai.search.toolkit.plugins.vespa.app.schemas.app import FieldDefinition
from mistralai.search.toolkit.plugins.vespa.migration import VespaMigration, add_field

class AddViewCount(VespaMigration):
    def migrate(self) -> None:
        add_field("articles", FieldDefinition.CountField(name="view_count"))
```

Set `multi_dimensional=True` for array fields (e.g., per-chunk embeddings or text chunks). Embedding dimensions are set once in `create_schema(embedding_dimensions=...)`.

### Multiple Schemas

Call `create_schema()` or `create_default_schema()` multiple times to register multiple document types under one application. Each schema produces its own `.sd` file and query profile. Names must be unique.

<SectionTab as="h2" sectionId="migration-helpers">Migration Helpers</SectionTab>

| Helper | Description |
|---|---|
| `set_app_name(name)` | Set the application name (required in the first migration) |
| `create_default_schema(...)` | Create a schema with the default fields required by `VespaSearchIndex` (recommended) |
| `create_schema(...)` | Create a schema with explicit fields (for full control) |
| `add_field(schema, field)` | Add a field to an existing schema |
| `add_query_profiles(...)` | Add or update query profiles |
| `add_schema_rank_profiles(schema, paths)` | Add custom rank profile files |
| `add_schema_model_files(schema, paths)` | Add ML model files |
| `add_schema_custom_document_summary(...)` | Add custom document summaries |

<SectionTab as="h2" sectionId="deploying">Deploying</SectionTab>

`mistral-vespa migrate` discovers migrations, runs them in order, builds the app package, and uploads it. See the [Local Development](local-development) and [Deploy and Operate](operations) guides for details.

<SectionTab as="h2" sectionId="optional-snapshot">Optional Snapshot</SectionTab>

```bash
uv run mistral-vespa generate \
  --app-dir ./vespa_app \
  --path ./vespa.lock
```

Writes the app package to disk for inspection or CI validation. It is not used for deployment.

<SectionTab as="h2" sectionId="see-also">See Also</SectionTab>

- **[Anatomy of a Vespa application](anatomy)** — Concepts: schemas, fields, ranking profiles, migrations
- **[Local Development](local-development)** — Full local development loop
- **[CLI reference](cli)** — Full set of CLI flags