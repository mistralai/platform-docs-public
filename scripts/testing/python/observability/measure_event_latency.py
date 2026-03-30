#!/usr/bin/env python3
"""
Measure how long it takes for a chat completion event to appear in the observability pipeline.

Usage:
    uv run --with "mistralai>=2,python-dotenv" python scripts/measure_event_latency.py
"""

import os
import time
import uuid

from dotenv import load_dotenv

load_dotenv(".env.test")

from mistralai.client import Mistral

api_key = os.environ.get("MISTRAL_API_KEY")
if not api_key:
    raise SystemExit("MISTRAL_API_KEY not set. Create a .env.test file.")

client = Mistral(api_key=api_key)

# Use a unique marker so we can find our event
marker = f"observability-latency-test-{uuid.uuid4().hex[:8]}"
model = "mistral-small-latest"

print(f"Marker: {marker}")
print(f"Model:  {model}")
print()

# 1. Make a chat completion
print("Sending chat completion...")
t_start = time.time()

response = client.chat.complete(
    model=model,
    messages=[
        {"role": "user", "content": f"Say exactly this and nothing else: {marker}"}
    ],
    max_tokens=50,
)

t_sent = time.time()
print(f"Chat completion received in {t_sent - t_start:.2f}s")
print(f"Response: {response.choices[0].message.content[:80]}")
print()

# 2. Poll the observability explorer for this event
print("Polling observability explorer...")
poll_interval = 2  # seconds
max_wait = 120  # seconds
found = False

while time.time() - t_sent < max_wait:
    try:
        result = client.beta.observability.chat_completion_events.search(
            search_params={
                "filters": {
                    "AND": [
                        {"field": "model_name", "op": "eq", "value": model},
                        {"field": "response_messages_preview", "op": "contains", "value": marker},
                    ]
                }
            },
            page_size=5,
        )

        events = result.completion_events.results if hasattr(result, 'completion_events') else []
        if not hasattr(result, 'completion_events'):
            # Try alternative response shapes
            events = getattr(result, 'data', [])

        if events and len(events) > 0:
            t_found = time.time()
            latency = t_found - t_sent
            print(f"\nEvent found after {latency:.1f}s (total from send: {t_found - t_start:.1f}s)")
            found = True
            break

    except Exception as e:
        print(f"  Search error: {type(e).__name__}: {e}")

    elapsed = time.time() - t_sent
    print(f"  {elapsed:.0f}s — not yet visible, retrying in {poll_interval}s...")
    time.sleep(poll_interval)

if not found:
    print(f"\nEvent not found after {max_wait}s. Pipeline may be slower than expected.")
    raise SystemExit(1)
