#!/usr/bin/env bash
set -euo pipefail

# Generate a CSV report of all Vale prose-lint findings.
# Each row includes the rule, severity, file, line, message, and a clickable
# vscode:// link — same pattern as mdlint-report.sh.
#
# Usage:
#   pnpm vale:report              # writes vale-errors.csv
#   pnpm vale:report my-report    # writes my-report.csv

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
DIM='\033[2m'
NC='\033[0m'

if ! command -v vale &>/dev/null; then
  echo -e "${RED}vale is not installed.${NC}"
  echo "Install it with: brew install vale"
  echo "Then run: vale sync"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="${1:-vale-errors}"
OUTPUT_FILE="${REPO_ROOT}/${OUTPUT}.csv"

echo -e "${DIM}Running Vale (JSON output)...${NC}"

# vale --output JSON returns a JSON object keyed by file path.
# Each value is an array of {Check, Severity, Line, Span, Message, ...}.
# Pipe through stdin to avoid quoting issues with large JSON payloads.
# Vale exits non-zero when findings exist — ignore that exit code.
(vale --output JSON "src/app/(docs)/" 2>/dev/null || true) \
  | python3 -c "
import csv, json, sys

raw = sys.stdin.read()
if not raw.strip() or raw.strip() == '{}':
    print('No findings — nothing to report.')
    sys.exit(0)

data = json.loads(raw)
repo_root = '${REPO_ROOT}'
output_file = '${OUTPUT_FILE}'

with open(output_file, 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['rule', 'severity', 'vscode_link', 'message'])
    total = 0
    for filepath, findings in sorted(data.items()):
        for item in findings:
            rule = item.get('Check', '')
            severity = item.get('Severity', '')
            line = item.get('Line', 1)
            message = item.get('Message', '')
            vscode_link = f'vscode://file/{repo_root}/{filepath}:{line}'
            w.writerow([rule, severity, vscode_link, message])
            total += 1

print(f'Report written to {output_file}')
print(f'  {total} findings total')

errors = sum(1 for fp in data.values() for i in fp if i.get('Severity') == 'error')
warnings = sum(1 for fp in data.values() for i in fp if i.get('Severity') == 'warning')
suggestions = sum(1 for fp in data.values() for i in fp if i.get('Severity') == 'suggestion')
print(f'  {errors} errors, {warnings} warnings, {suggestions} suggestions')
"
