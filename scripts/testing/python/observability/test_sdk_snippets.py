#!/usr/bin/env python3
"""
Level 2: Execute SDK code snippets from observability docs with mocked HTTP responses.

Catches runtime errors that static analysis (level 1) misses:
- NameError (undefined variables)
- AttributeError (wrong response shape)
- TypeError (wrong arg types)
- Any other exception during execution

Usage:
    uv run --with "mistralai>=2,pytest" pytest scripts/test_sdk_snippets.py -v
"""

import re
import textwrap
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[4]
DOCS_DIR = PROJECT_ROOT / "src/app/(docs)/capabilities/observability"


# ---------------------------------------------------------------------------
# Realistic response factories — mirror the SDK model shapes
# ---------------------------------------------------------------------------

def make_judge(**overrides):
    j = MagicMock()
    j.id = "judge-abc-123"
    j.name = "Response Quality Classifier"
    j.description = "Classifies responses"
    j.model_name = "mistral-medium-latest"
    j.output = MagicMock(type="CLASSIFICATION")
    j.status = "active"
    for k, v in overrides.items():
        setattr(j, k, v)
    return j


def make_campaign(**overrides):
    c = MagicMock()
    c.id = "campaign-abc-123"
    c.name = "Support Quality Review"
    c.status = "COMPLETED"
    for k, v in overrides.items():
        setattr(c, k, v)
    return c


def make_campaign_status(**overrides):
    s = MagicMock()
    s.status = "COMPLETED"
    s.progress = 1.0
    for k, v in overrides.items():
        setattr(s, k, v)
    return s


def make_dataset(**overrides):
    d = MagicMock()
    d.id = "dataset-abc-123"
    d.name = "Customer Support Analysis Set"
    for k, v in overrides.items():
        setattr(d, k, v)
    return d


def make_dataset_record(**overrides):
    r = MagicMock()
    r.id = "record-abc-123"
    r.payload = MagicMock()
    r.payload.messages = [
        {"role": "user", "content": "How do I reset my password?"},
        {"role": "assistant", "content": "You can reset your password by..."},
    ]
    r.properties = {"expected_output": "Clear instructions", "category": "account"}
    for k, v in overrides.items():
        setattr(r, k, v)
    return r


def make_event(**overrides):
    """Mirror ChatCompletionEventPreview from mistralai SDK v2.

    Real attrs: event_id, correlation_id, created_at, extra_fields,
    nb_input_tokens, nb_output_tokens. No model_name — must be
    requested via extra_fields param on search().
    """
    from datetime import datetime, timezone

    e = MagicMock(spec=["event_id", "correlation_id", "created_at",
                        "extra_fields", "nb_input_tokens", "nb_output_tokens"])
    e.event_id = "evt-abc-123"
    e.correlation_id = "corr-abc-123"
    e.created_at = datetime.now(timezone.utc)
    e.extra_fields = {"model_name": "mistral-medium-2508", "__judge_abc123": "excellent"}
    e.nb_input_tokens = 150
    e.nb_output_tokens = 200
    for k, v in overrides.items():
        setattr(e, k, v)
    return e


def make_field(**overrides):
    """Mirror BaseFieldDefinition from mistralai SDK v2.

    Real attrs: name, label, type, supported_operators, group.
    No 'options' — use fields.fetch_options() separately.
    """
    f = MagicMock(spec=["name", "label", "type", "supported_operators", "group"])
    f.name = "model_name"
    f.label = "Model Name"
    f.type = "ENUM"
    f.supported_operators = ["eq", "neq", "startswith", "contains"]
    f.group = None
    for k, v in overrides.items():
        setattr(f, k, v)
    return f


def make_import_task(**overrides):
    t = MagicMock()
    t.id = "task-abc-123"
    t.status = "COMPLETED"
    for k, v in overrides.items():
        setattr(t, k, v)
    return t


def make_upload_response(**overrides):
    u = MagicMock()
    u.id = "file-abc-123"
    for k, v in overrides.items():
        setattr(u, k, v)
    return u


# ---------------------------------------------------------------------------
# Wire up a fully mocked Mistral client
# ---------------------------------------------------------------------------

def build_mock_client():
    """Build a MagicMock that mirrors the Mistral client structure with realistic responses."""
    client = MagicMock()

    # --- judges ---
    judges = client.beta.observability.judges
    judges.create.return_value = make_judge()
    judges.list.return_value = MagicMock(judges=MagicMock(results=[make_judge(), make_judge(name="Helpfulness Score")]))
    judges.fetch.return_value = make_judge()
    judges.update.return_value = None  # SDK returns None (bare return, no body)
    judges.delete.return_value = None

    # --- campaigns ---
    campaigns = client.beta.observability.campaigns
    campaigns.create.return_value = make_campaign()
    campaigns.list.return_value = MagicMock(campaigns=MagicMock(results=[make_campaign()]))
    campaigns.fetch.return_value = make_campaign()
    campaigns.fetch_status.return_value = make_campaign_status()
    campaigns.list_events.return_value = MagicMock(completion_events=MagicMock(results=[make_event(), make_event()]))
    campaigns.delete.return_value = None

    # --- datasets ---
    datasets = client.beta.observability.datasets
    datasets.create.return_value = make_dataset()
    datasets.list.return_value = MagicMock(datasets=MagicMock(results=[make_dataset()]))
    datasets.fetch.return_value = make_dataset()
    datasets.create_record.return_value = make_dataset_record()
    datasets.import_from_file.return_value = make_import_task()
    datasets.import_from_explorer.return_value = make_import_task()
    datasets.import_from_campaign.return_value = make_import_task()

    # list_records — shape confirmed by jhujhul's review
    list_records_resp = MagicMock()
    list_records_resp.records.results = [make_dataset_record(), make_dataset_record()]
    datasets.list_records.return_value = list_records_resp

    # --- chat_completion_events ---
    events = client.beta.observability.chat_completion_events
    search_resp = MagicMock()
    search_resp.completion_events.results = [make_event(), make_event()]
    events.search.return_value = search_resp

    # fields
    fields_resp = MagicMock()
    fields_resp.field_definitions = [make_field(), make_field(name="invoked_tools", type="array")]
    events.fields.list.return_value = fields_resp
    events.fields.fetch_options.return_value = MagicMock(
        options=["mistral-large", "mistral-medium-2508"]
    )

    # --- files (used in datasets import_from_file snippet) ---
    client.files.upload.return_value = make_upload_response()

    return client


# ---------------------------------------------------------------------------
# Extract snippets from MDX
# ---------------------------------------------------------------------------

def extract_python_snippets(mdx_path: Path) -> list[tuple[str, int, str]]:
    """Return (code, start_line, context_label) for each ```python block."""
    content = mdx_path.read_text()
    snippets = []
    in_block = False
    current = []
    start = 0

    for i, line in enumerate(content.split("\n"), 1):
        stripped = line.strip()
        if stripped.startswith("```python"):
            in_block = True
            current = []
            start = i + 1
        elif stripped == "```" and in_block:
            in_block = False
            code = "\n".join(current)
            # Build a short label from first comment or first SDK call
            label = ""
            for c in current:
                c = c.strip()
                if c.startswith("#") and len(c) > 2:
                    label = c.lstrip("# ").strip()[:60]
                    break
            snippets.append((code, start, label or f"line {start}"))
        elif in_block:
            current.append(line)

    return snippets


def collect_all_snippets():
    """Yield (file_rel_path, code, start_line, label) for pytest parametrize."""
    items = []
    for mdx_file in sorted(DOCS_DIR.rglob("page.mdx")):
        rel = mdx_file.relative_to(DOCS_DIR)
        for code, start, label in extract_python_snippets(mdx_file):
            test_id = f"{rel}:{start} ({label})"
            items.append(pytest.param(code, id=test_id))
    return items


# ---------------------------------------------------------------------------
# Prepare snippet code for exec()
# ---------------------------------------------------------------------------

def prepare_snippet(code: str) -> str:
    """Transform a raw snippet so it can be exec()'d with a mocked client.

    - Strips import lines and the Mistral() constructor block
    - The `mistral` variable is pre-injected via exec_globals
    - Replaces open() calls to avoid filesystem access
    """
    lines = []
    skip_until_closing_paren = False

    for line in code.split("\n"):
        stripped = line.strip()

        # Skip import lines
        if re.match(r"^(from mistralai|import os)", stripped):
            continue

        # Skip multi-line Mistral() constructor: starts with assignment, ends with )
        if re.match(r"^\w+\s*=\s*Mistral\(", stripped):
            if stripped.endswith(")"):
                continue  # single-line constructor
            skip_until_closing_paren = True
            continue
        if skip_until_closing_paren:
            if stripped == ")":
                skip_until_closing_paren = False
            continue

        # Replace open() with a mock to avoid filesystem access
        if "open(" in line:
            line = re.sub(r'open\([^)]+\)', '__mock_open__()', line)

        lines.append(line)

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

ALL_SNIPPETS = collect_all_snippets()


@pytest.mark.parametrize("code", ALL_SNIPPETS)
def test_snippet_executes(code: str):
    """Each snippet should execute without errors using a mocked SDK client."""
    mock_client = build_mock_client()
    prepared = prepare_snippet(code)

    # Pre-inject variables that continuation snippets reference from earlier tabs
    exec_globals = {
        "mistral": mock_client,
        "__mock_open__": lambda: MagicMock(),
        "__builtins__": __builtins__,
        # From "Create" tabs — referenced in "Monitor", "List records", etc.
        "campaign": make_campaign(),
        "dataset": make_dataset(),
        "record": make_dataset_record(),
        "judge": make_judge(),
        "classifier": make_judge(),
        "scorer": make_judge(output=MagicMock(type="REGRESSION")),
    }

    try:
        exec(prepared, exec_globals)
    except Exception as exc:
        # Add context to the failure message
        pytest.fail(
            f"Snippet raised {type(exc).__name__}: {exc}\n\n"
            f"--- Prepared code ---\n{textwrap.indent(prepared, '  ')}"
        )
