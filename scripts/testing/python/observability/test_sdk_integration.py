#!/usr/bin/env python3
"""
Level 3: Integration tests — run observability SDK snippets against the real API.

Workflow:
    1. Generate chat completion events with a unique marker
    2. Wait for events to appear in Explorer
    3. Test Explorer search and field discovery
    4. Create a Judge, run a Campaign, build a Dataset
    5. Clean up all created resources

Usage:
    uv run --with "mistralai>=2,pytest,python-dotenv" \
        pytest scripts/test_sdk_integration.py -v -s

Requires:
    - .env.test with MISTRAL_API_KEY (Enterprise access with observability)
"""

import os
import time
import uuid

import pytest
from dotenv import load_dotenv

load_dotenv(".env.test")

from mistralai.client import Mistral

MARKER = f"obs-integration-{uuid.uuid4().hex[:8]}"
MODEL = "mistral-small-latest"
POLL_INTERVAL = 2
EVENT_TIMEOUT = 30
CAMPAIGN_TIMEOUT = 120


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session")
def client():
    api_key = os.environ.get("MISTRAL_API_KEY")
    if not api_key:
        pytest.skip("MISTRAL_API_KEY not set — create a .env.test file")
    return Mistral(api_key=api_key)


@pytest.fixture(scope="session")
def test_events(client):
    """Generate chat completions and wait for them to appear in Explorer."""
    prompts = [
        f"Say exactly: {MARKER} — answer about password reset",
        f"Say exactly: {MARKER} — answer about billing",
        f"Say exactly: {MARKER} — answer about account deletion",
    ]

    # Send completions
    for prompt in prompts:
        client.chat.complete(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=60,
        )

    # Poll until events appear
    deadline = time.time() + EVENT_TIMEOUT
    events = []

    while time.time() < deadline:
        result = client.beta.observability.chat_completion_events.search(
            search_params={
                "filters": {
                    "AND": [
                        {"field": "model_name", "op": "eq", "value": MODEL},
                        {"field": "response_messages_preview", "op": "contains", "value": MARKER},
                    ]
                }
            },
            page_size=10,
        )
        events = result.completion_events.results if hasattr(result, "completion_events") else []
        if len(events) >= len(prompts):
            break
        time.sleep(POLL_INTERVAL)

    assert len(events) >= len(prompts), (
        f"Only {len(events)}/{len(prompts)} events appeared within {EVENT_TIMEOUT}s"
    )
    return events


@pytest.fixture(scope="session")
def created_judge(client):
    """Create a classification Judge and clean up after all tests."""
    judge = client.beta.observability.judges.create(
        name=f"Test Judge {MARKER}",
        description="Integration test — classifies response helpfulness",
        model_name=MODEL,
        instructions=(
            "Evaluate whether the assistant response is helpful to the user. "
            "Read the conversation and classify the response quality."
        ),
        output={
            "type": "CLASSIFICATION",
            "options": [
                {"value": "helpful", "description": "The response addresses the user's question"},
                {"value": "unhelpful", "description": "The response does not address the question"},
            ],
        },
        tools=[],
    )
    yield judge

    # Cleanup
    try:
        client.beta.observability.judges.delete(judge_id=judge.id)
    except Exception:
        pass


@pytest.fixture(scope="session")
def created_dataset(client):
    """Create a Dataset and clean up after all tests."""
    dataset = client.beta.observability.datasets.create(
        name=f"Test Dataset {MARKER}",
        description="Integration test dataset",
    )
    yield dataset

    # Cleanup
    try:
        client.beta.observability.datasets.delete(dataset_id=dataset.id)
    except Exception:
        pass


@pytest.fixture(scope="session")
def created_campaign(client, test_events, created_judge):
    """Create a Campaign and wait for it to complete. Clean up after tests."""
    campaign = client.beta.observability.campaigns.create(
        name=f"Test Campaign {MARKER}",
        description="Integration test campaign",
        judge_id=created_judge.id,
        search_params={
            "filters": {
                "AND": [
                    {"field": "model_name", "op": "eq", "value": MODEL},
                    {"field": "response_messages_preview", "op": "contains", "value": MARKER},
                ]
            }
        },
        max_nb_events=10,
    )
    yield campaign

    # Cleanup
    try:
        client.beta.observability.campaigns.delete(campaign_id=campaign.id)
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Tests — ordered to follow the docs workflow
# ---------------------------------------------------------------------------

class TestExplorer:
    """Explorer: search events, discover fields."""

    def test_search_events(self, client, test_events):
        """Explorer search returns our test events."""
        result = client.beta.observability.chat_completion_events.search(
            search_params={
                "filters": {
                    "AND": [
                        {"field": "model_name", "op": "eq", "value": MODEL},
                        {"field": "response_messages_preview", "op": "contains", "value": MARKER},
                    ]
                }
            },
            page_size=20,
        )
        events = result.completion_events.results
        assert len(events) >= 3
        for event in events:
            assert hasattr(event, "event_id")

    def test_search_with_combined_filters(self, client, test_events):
        """Explorer search with AND/OR filters works."""
        result = client.beta.observability.chat_completion_events.search(
            search_params={
                "filters": {
                    "AND": [
                        {"field": "model_name", "op": "eq", "value": MODEL},
                        {
                            "OR": [
                                {"field": "response_messages_preview", "op": "contains", "value": "password"},
                                {"field": "response_messages_preview", "op": "contains", "value": "billing"},
                            ]
                        },
                    ]
                }
            },
            page_size=20,
        )
        # May or may not find events depending on model output, just verify no error
        assert hasattr(result, "completion_events")

    def test_list_fields(self, client):
        """Fields discovery returns available filter fields."""
        fields = client.beta.observability.chat_completion_events.fields.list()
        field_list = fields.field_definitions
        assert len(field_list) > 0
        field_names = [f.name for f in field_list]
        # These should always be present for customers
        assert "model_name" in field_names
        assert "total_time_elapsed" in field_names

    def test_fetch_field_options(self, client):
        """Fetch options for an enum field."""
        options = client.beta.observability.chat_completion_events.fields.fetch_options(
            field_name="model_name",
            operator="startswith",
        )
        assert hasattr(options, "options")


class TestJudges:
    """Judges: create, list, fetch, update."""

    def test_judge_created(self, created_judge):
        """Judge was created successfully."""
        assert created_judge.id is not None
        assert MARKER in created_judge.name

    def test_list_judges(self, client, created_judge):
        """List judges returns our test judge."""
        judges = client.beta.observability.judges.list(page_size=50)
        judge_ids = [j.id for j in judges.judges.results]
        assert created_judge.id in judge_ids

    def test_fetch_judge(self, client, created_judge):
        """Fetch a specific judge by ID."""
        judge = client.beta.observability.judges.fetch(judge_id=created_judge.id)
        assert judge.id == created_judge.id
        assert judge.name == created_judge.name

    def test_update_judge(self, client, created_judge):
        """Update a judge — SDK returns None (no response body)."""
        result = client.beta.observability.judges.update(
            judge_id=created_judge.id,
            name=created_judge.name,
            description="Updated description for integration test",
            model_name=MODEL,
            instructions=(
                "Evaluate whether the assistant response is helpful to the user. "
                "Read the conversation and classify the response quality."
            ),
            output={
                "type": "CLASSIFICATION",
                "options": [
                    {"value": "helpful", "description": "The response addresses the user's question"},
                    {"value": "unhelpful", "description": "The response does not address the question"},
                ],
            },
            tools=[],
        )
        assert result is None, f"judges.update() should return None, got {type(result)}"

        # Verify the update took effect via fetch
        updated = client.beta.observability.judges.fetch(judge_id=created_judge.id)
        assert updated.description == "Updated description for integration test"


class TestCampaigns:
    """Campaigns: create, fetch status, list events."""

    def test_campaign_created(self, created_campaign):
        """Campaign was created successfully."""
        assert created_campaign.id is not None
        assert MARKER in created_campaign.name

    def test_fetch_campaign_status(self, client, created_campaign):
        """Fetch campaign status (poll until done or timeout)."""
        deadline = time.time() + CAMPAIGN_TIMEOUT
        final_status = None

        while time.time() < deadline:
            status = client.beta.observability.campaigns.fetch_status(
                campaign_id=created_campaign.id,
            )
            final_status = status.status
            if final_status in ("COMPLETED", "FAILED", "CANCELLED"):
                break
            time.sleep(5)

        assert final_status == "COMPLETED", f"Campaign ended with status: {final_status}"

    def test_list_campaign_events(self, client, created_campaign):
        """List events annotated by the campaign."""
        events = client.beta.observability.campaigns.list_events(
            campaign_id=created_campaign.id,
            page_size=50,
        )
        assert hasattr(events, "completion_events")

    def test_list_campaigns(self, client, created_campaign):
        """List campaigns returns our test campaign."""
        campaigns = client.beta.observability.campaigns.list(page_size=50)
        campaign_ids = [c.id for c in campaigns.campaigns.results]
        assert created_campaign.id in campaign_ids


class TestDatasets:
    """Datasets: create, add records, import from explorer, list records."""

    def test_dataset_created(self, created_dataset):
        """Dataset was created successfully."""
        assert created_dataset.id is not None
        assert MARKER in created_dataset.name

    def test_create_record(self, client, created_dataset):
        """Add a record manually to the dataset."""
        record = client.beta.observability.datasets.create_record(
            dataset_id=created_dataset.id,
            payload={
                "messages": [
                    {"role": "user", "content": "How do I reset my password?"},
                    {"role": "assistant", "content": "Go to Settings > Security > Reset password."},
                ],
            },
            properties={"category": "account", "expected_output": "Clear instructions"},
        )
        assert record.id is not None

    def test_import_from_explorer(self, client, created_dataset, test_events):
        """Import events from Explorer into the dataset."""
        event_ids = [e.event_id for e in test_events[:2]]
        task = client.beta.observability.datasets.import_from_explorer(
            dataset_id=created_dataset.id,
            completion_event_ids=event_ids,
        )
        assert task.id is not None

    def test_list_records(self, client, created_dataset):
        """List records in the dataset."""
        # Small wait for import to complete
        time.sleep(3)
        result = client.beta.observability.datasets.list_records(
            dataset_id=created_dataset.id,
            page_size=50,
        )
        assert hasattr(result, "records")

    def test_list_datasets(self, client, created_dataset):
        """List datasets returns our test dataset."""
        datasets = client.beta.observability.datasets.list(page_size=50)
        dataset_ids = [d.id for d in datasets.datasets.results]
        assert created_dataset.id in dataset_ids
