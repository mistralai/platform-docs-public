# Observability snippet tests

Tests for SDK code snippets in the [observability docs](../../../../src/app/(docs)/capabilities/observability/).

## What's tested

Snippets from these pages:

- **Explorer** — `search()`, `fields.list()`, `fields.fetch_options()`, `import_from_explorer()`
- **Judges** — `create()` (classification + regression), `list()`, `fetch()`, `update()`, `delete()`
- **Campaigns** — `create()`, `fetch_status()`, `list_events()`, `list()`, `delete()`
- **Datasets** — `create()`, `create_record()`, `import_from_file()`, `import_from_explorer()`, `list_records()`

## Running

```bash
# L1 — signature validation (no API key)
uv run --with "mistralai>=2" python scripts/testing/python/observability/validate_sdk_snippets.py

# L2a — mock return value validation (no API key)
uv run --with "mistralai>=2" python scripts/testing/python/observability/validate_mock_returns.py

# L2b — mocked execution (no API key)
uv run --with "mistralai>=2,pytest" pytest scripts/testing/python/observability/test_sdk_snippets.py -v

# L3 — integration tests (needs .env.test with MISTRAL_API_KEY)
uv run --with "mistralai>=2,pytest,python-dotenv" pytest scripts/testing/python/observability/test_sdk_integration.py -v -s
```

Or via the runner:

```bash
pnpm test:snippets --feature observability
pnpm test:snippets --feature observability --level 3
```

## SDK version

The observability namespace (`beta.observability`) requires `mistralai >= 2.0.1`. Earlier versions (v1.x) don't include it.

## L3 details

The integration test suite:

1. Sends three chat completions with a unique marker
2. Waits for events to appear in Explorer (~5s)
3. Tests the full workflow: Explorer → Judge → Campaign → Dataset
4. Cleans up all created resources (judge, campaign, dataset) via fixture teardown

The `measure_event_latency.py` utility measures how long events take to appear in the observability pipeline (used to calibrate poll timeouts).

## Post-mortem: incorrect L2 mock for `judges.update()` (March 2026)

### What happened

The docs snippet for "list, update, delete" judges contained:

```python
updated = mistral.beta.observability.judges.update(...)
print(f"Updated: {updated.name}")
```

This crashed at runtime with `'NoneType' object has no attribute 'name'` because `judges.update()` returns `None` (bare `return`, no response body). The bug shipped to production and was caught by a reviewer running the snippets manually.

### Why the tests didn't catch it

**L1 (signature validation):** The validator checked return type annotations to verify attribute access. `judges.update()` has no return type hint (`inspect._empty`), so L1 skipped the check entirely — it couldn't determine the return type and silently moved on.

**L2 (mocked execution):** The mock was configured as:

```python
judges.update.return_value = make_judge(name="Updated Judge")
```

This returned a full `Judge` object, so `updated.name` worked fine in the mocked environment. The test passed, hiding the real behavior.

**L3 (integration tests):** `judges.update()` was not covered. The `TestJudges` class tested `create`, `list`, and `fetch` but skipped `update`.

### Root cause: why the mock was wrong

The mock was written by **analogy with other SDK methods** without verifying the actual return behavior. The assumption was reasonable on the surface:

| Method | Returns |
|---|---|
| `judges.create()` | `Judge` |
| `judges.fetch()` | `Judge` |
| `judges.list()` | `ListJudgesResponse` |
| `judges.update()` | **`None`** (bare return) |
| `datasets.update()` | `DatasetPreview` |

The SDK is inconsistent: `datasets.update()` returns the updated object, but `judges.update()` doesn't. Without a type annotation on `judges.update()`, nothing in the codebase flagged this discrepancy. The mock author assumed `update()` follows the same pattern as `create()`/`fetch()`, which was wrong.

Contributing factors:

1. **No return type hint on `judges.update()`** — The SDK uses Speakeasy-generated code. Void methods (`update`, `delete`) have no `-> None` annotation, just a bare `return`. This made it invisible to both the mock author and L1's `typing.get_type_hints()` check.
2. **Mock-first development** — The mocks were written before L3 integration tests existed. There was no "ground truth" validation pass against the real API to verify mock accuracy.
3. **L1 had a silent skip** — When `get_return_type_attrs()` returned `None` (can't determine type), L1 skipped the check without any warning. Void methods and unannotated methods were treated identically.

### What we fixed

1. **L2 mock corrected:** `judges.update.return_value = None` — matches actual SDK behavior.
2. **L3 test added:** `test_update_judge` calls the real API, asserts `result is None`, and verifies the update via a subsequent `fetch()`.
3. **L1 enhanced:** New `method_returns_none()` function inspects method source code for bare `return` statements. If a snippet accesses attributes on the return value of a void method, L1 now raises an **error** (not a warning). This would have caught the original bug without needing API access.

### Takeaway for future mocks

When adding a new mock to L2, verify the actual SDK return behavior:

```bash
uv run --with "mistralai>=2" python3 -c "
import inspect
from mistralai.client import Mistral
c = Mistral(api_key='dummy')
src = inspect.getsource(c.beta.observability.judges.update)
returns = [l.strip() for l in src.split('\n') if l.strip().startswith('return')]
print(returns)
"
```

If the only return is `return` (no value), the mock must use `return_value = None`.
