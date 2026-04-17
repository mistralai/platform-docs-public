#!/usr/bin/env bash
set -euo pipefail

# Generate a CSV report of all markdownlint errors.
# Each row includes the rule, a clickable vscode:// link, the description,
# and whether markdownlint --fix can auto-fix it.
#
# Usage:
#   pnpm mdlint:report              # writes mdlint-errors.csv
#   pnpm mdlint:report my-report    # writes my-report.csv

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="${1:-mdlint-errors}"
OUTPUT_FILE="${REPO_ROOT}/${OUTPUT}.csv"

# Rules that markdownlint --fix can auto-correct.
FIXABLE_RULES=(
  MD004 MD005 MD007 MD009 MD010 MD012 MD014
  MD018 MD019 MD020 MD021 MD022 MD023 MD026
  MD027 MD029 MD030 MD031 MD032 MD034 MD037
  MD038 MD039 MD044 MD047 MD049 MD050 MD051
  MD053 MD054 MD055 MD058
)

# Build a lookup string for quick matching.
FIXABLE_LOOKUP="|$(IFS='|'; echo "${FIXABLE_RULES[*]}")|"

is_fixable() {
  # Extract the bare rule ID (e.g. MD009 from MD009/no-trailing-spaces).
  local rule_id="${1%%/*}"
  [[ "$FIXABLE_LOOKUP" == *"|${rule_id}|"* ]] && echo "yes" || echo "no"
}

echo "Running markdownlint-cli2..."
LINT_OUTPUT=$(npx markdownlint-cli2 2>&1 || true)

ERROR_LINES=$(echo "$LINT_OUTPUT" | grep " error ")

if [[ -z "$ERROR_LINES" ]]; then
  echo "No errors found — nothing to report."
  exit 0
fi

# Write CSV header.
echo "rule,vscode_link,description,auto_fixable,to_fix" > "$OUTPUT_FILE"

# Parse each error line and append to CSV.
while IFS= read -r line; do
  # Format: path/file.mdx:line[:col] error RULE/name Description text
  location="${line%% error *}"
  rule_and_desc="${line#* error }"
  rule="${rule_and_desc%% *}"
  description="${rule_and_desc#* }"

  # Extract file path and line number (ignore column if present).
  file="${location%%:*}"
  rest="${location#*:}"
  line_num="${rest%%:*}"

  vscode_link="vscode://file/${REPO_ROOT}/${file}:${line_num}"
  fixable=$(is_fixable "$rule")

  # Escape commas in description so CSV stays valid.
  description="${description//,/;}"

  echo "${rule},${vscode_link},${description},${fixable}," >> "$OUTPUT_FILE"
done <<< "$ERROR_LINES"

TOTAL=$(wc -l < "$OUTPUT_FILE")
TOTAL=$((TOTAL - 1))  # subtract header
FIXABLE_COUNT=$(grep -c ',yes,' "$OUTPUT_FILE" || true)
MANUAL_COUNT=$((TOTAL - FIXABLE_COUNT))

echo ""
echo "Report written to ${OUTPUT_FILE}"
echo "  ${TOTAL} errors total"
echo "  ${FIXABLE_COUNT} auto-fixable (markdownlint --fix)"
echo "  ${MANUAL_COUNT} need manual attention"
