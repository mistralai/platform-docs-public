#!/usr/bin/env bash
set -euo pipefail

# Documentation snippet test runner
# Usage:
#   ./scripts/testing/run-tests.sh                    # L1 + L2 (default, no API key needed)
#   ./scripts/testing/run-tests.sh --level 1          # L1 only
#   ./scripts/testing/run-tests.sh --level 2          # L2 only
#   ./scripts/testing/run-tests.sh --level 3          # L3 only (needs .env.test)
#   ./scripts/testing/run-tests.sh --level 1,2,3      # All levels
#   ./scripts/testing/run-tests.sh --feature observability
#   ./scripts/testing/run-tests.sh --feature observability --level 3

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Defaults
LEVELS="1,2"
FEATURE=""
VERBOSE=""

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --)          shift ;;
    --level|-l)  LEVELS="$2"; shift 2 ;;
    --feature|-f) FEATURE="$2"; shift 2 ;;
    --verbose|-v) VERBOSE="-v"; shift ;;
    --help|-h)
      echo "Usage: $0 [--level 1,2,3] [--feature observability] [--verbose]"
      echo ""
      echo "Levels:"
      echo "  1  Signature validation (no API key)"
      echo "  2  Mocked execution (no API key)"
      echo "  3  Integration tests (needs .env.test with MISTRAL_API_KEY)"
      echo ""
      echo "Features: observability (more coming)"
      echo ""
      echo "Defaults to --level 1,2 with all features."
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Discover features
if [[ -n "$FEATURE" ]]; then
  FEATURES=("$FEATURE")
else
  FEATURES=()
  for dir in "$SCRIPT_DIR"/python/*/; do
    [[ -d "$dir" ]] && FEATURES+=("$(basename "$dir")")
  done
fi

FAILED=0
TOTAL=0

run_level() {
  local level=$1
  local feature=$2
  local feature_dir="$SCRIPT_DIR/python/$feature"

  if [[ ! -d "$feature_dir" ]]; then
    echo "  Feature '$feature' not found at $feature_dir"
    return 1
  fi

  case $level in
    1)
      local script="$feature_dir/validate_sdk_snippets.py"
      [[ ! -f "$script" ]] && return 0
      echo "  L1: Signature validation"
      TOTAL=$((TOTAL + 1))
      if ! uv run --with "mistralai>=2" python "$script"; then
        FAILED=$((FAILED + 1))
      fi
      ;;
    2)
      # Pre-check: validate mock return values match SDK
      local mock_validator="$feature_dir/validate_mock_returns.py"
      if [[ -f "$mock_validator" ]]; then
        echo "  L2a: Mock return value validation"
        TOTAL=$((TOTAL + 1))
        if ! uv run --with "mistralai>=2" python "$mock_validator"; then
          FAILED=$((FAILED + 1))
        fi
      fi

      local script="$feature_dir/test_sdk_snippets.py"
      [[ ! -f "$script" ]] && return 0
      echo "  L2b: Mocked execution"
      TOTAL=$((TOTAL + 1))
      if ! uv run --with "mistralai>=2,pytest" pytest "$script" $VERBOSE; then
        FAILED=$((FAILED + 1))
      fi
      ;;
    3)
      local script="$feature_dir/test_sdk_integration.py"
      [[ ! -f "$script" ]] && return 0
      if [[ ! -f "$PROJECT_ROOT/.env.test" ]]; then
        echo "  L3: Skipped (no .env.test found)"
        return 0
      fi
      echo "  L3: Integration tests"
      TOTAL=$((TOTAL + 1))
      if ! uv run --with "mistralai>=2,pytest,python-dotenv" pytest "$script" $VERBOSE -s; then
        FAILED=$((FAILED + 1))
      fi
      ;;
    *)
      echo "  Unknown level: $level"
      return 1
      ;;
  esac
}

echo "=== Documentation snippet tests ==="
echo ""

for feature in "${FEATURES[@]}"; do
  echo "[$feature]"
  IFS=',' read -ra LEVEL_ARRAY <<< "$LEVELS"
  for level in "${LEVEL_ARRAY[@]}"; do
    run_level "$level" "$feature"
    echo ""
  done
done

echo "=== Results: $((TOTAL - FAILED))/$TOTAL passed ==="

[[ $FAILED -gt 0 ]] && exit 1
exit 0
