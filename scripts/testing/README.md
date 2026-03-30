# Documentation snippet tests

Automated tests that verify code snippets in our docs actually work against the real SDK.

**⚠️ At the moment, only Python SDK snippets are tested.**

## Quick start

```bash
# Run safe tests (no API key needed)
pnpm test:snippets

# Run with integration tests (needs .env.test)
pnpm test:snippets --level 1,2,3

# Run a specific feature
pnpm test:snippets --feature observability

# Run a specific level
pnpm test:snippets --level 2 --verbose
```

## Test levels

| Level | What it does | Needs API key | Speed |
|-------|-------------|---------------|-------|
| **L1** — Signature validation | Checks that SDK methods exist and parameter names match | No | ~1s |
| **L2a** — Mock validation | Checks that L2 mock return values match the real SDK | No | ~1s |
| **L2b** — Mocked execution | Runs each snippet with a mocked SDK client | No | ~1s |
| **L3** — Integration tests | Runs against the real API, creates real resources, cleans up | Yes | ~25s |

**Default**: L1 + L2 (safe to run anytime).

## Structure

```
scripts/testing/
├── run-tests.sh                       # Test runner
├── README.md                          # This file
└── python/
    └── observability/                 # Observability feature tests
        ├── README.md
        ├── validate_sdk_snippets.py   # L1
        ├── test_sdk_snippets.py       # L2
        ├── test_sdk_integration.py    # L3
        └── measure_event_latency.py   # Utility
```

## Adding tests for a new feature

1. Create a directory: `scripts/testing/python/<feature-name>/` (or `typescript/` when needed)
2. Add any combination of:
   - `validate_sdk_snippets.py` — L1 signature checks
   - `test_sdk_snippets.py` — L2 mocked execution (pytest)
   - `test_sdk_integration.py` — L3 integration tests (pytest)
3. The test runner auto-discovers features by scanning subdirectories.

## API key for L3

Create a `.env.test` at the project root (gitignored):

```
MISTRAL_API_KEY=your-key-here
```

The key needs Enterprise access with observability enabled.
