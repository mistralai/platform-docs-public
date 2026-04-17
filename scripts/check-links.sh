#!/usr/bin/env bash
set -euo pipefail

# Check links on a local build of the documentation site.
# Builds the site, then checks all generated HTML files for broken links.
# Usage:
#   pnpm check-links             # build + check
#   pnpm check-links --no-build  # check only (reuse existing build)

SKIP_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --no-build) SKIP_BUILD=true ;;
  esac
done

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
DIM='\033[2m'
NC='\033[0m'

# Check dependencies
if ! command -v lychee &>/dev/null; then
  echo -e "${RED}lychee is not installed.${NC}"
  echo "Install it with: brew install lychee"
  exit 1
fi

BUILD_DIR=".next/server/app"

# Build (skip with --no-build to reuse an existing build)
if [[ "$SKIP_BUILD" == true ]]; then
  if [[ ! -d "$BUILD_DIR" ]]; then
    echo -e "${RED}No build found at ${BUILD_DIR}. Run without --no-build first.${NC}"
    exit 1
  fi
  echo -e "${DIM}Skipping build (--no-build), using existing output${NC}"
else
  echo -e "${YELLOW}Building the site...${NC}"
  pnpm build --no-lint
fi
PAGE_COUNT=$(find "$BUILD_DIR" -name "*.html" -not -path "*_not-found*" | wc -l | tr -d ' ')
echo -e "${DIM}Found ${PAGE_COUNT} pages to check${NC}"

# Check links directly on build output HTML files.
# --root-dir resolves root-relative links (e.g. /admin/api-keys) against the build dir.
# --fallback-extensions tries .html when a path doesn't exist as-is.
# Static assets (images, CSS, JS, fonts) live in .next/static/ and public/, not in
# .next/server/app/, so we exclude them to avoid false positives.
REPORT_DIR="link-reports"
mkdir -p "$REPORT_DIR"
TIMESTAMP=$(date +%Y-%m-%d_%H%M%S)
REPORT_JSON="$REPORT_DIR/broken-links_${TIMESTAMP}.json"
REPORT_CSV="$REPORT_DIR/broken-links_${TIMESTAMP}.csv"

# Shared lychee options
LYCHEE_OPTS=(
  --root-dir "$BUILD_DIR"
  --fallback-extensions html
  --exclude '_next/'
  --exclude 'manifest\.webmanifest'
  --exclude 'localhost'
  --exclude '\.(png|jpe?g|gif|svg|ico|woff2?|ttf|eot|css|js|webp|mp4|webm|yaml|json)$'
  --exclude 'api\.mistral\.ai'
  --exclude 'admin\.mistral\.ai'
  --exclude 'console\.mistral\.ai'
  --exclude 'chat\.mistral\.ai'
  --exclude 'models\.mistralcdn\.com'
  --exclude 'example\.com'
  --exclude '/api-reference$'
  --exclude 'your-.*\.example'
  --exclude 'linkedin\.com'
  --exclude 'colab\.research\.google\.com'
  --exclude 'arxiv\.org'
  --exclude 'x\.com'
  --exclude 'twitter\.com'
  --exclude 'raw\.githubusercontent\.com'
  --exclude 'picsum\.photos'
  --exclude 'download\.samplelib\.com'
  --exclude 'v2\.auth\.mistral\.ai'
  --exclude 'forms\.gle'
  --exclude 'dash\.cloudflare\.com'
  --max-concurrency 5
  --timeout 30
  --max-retries 2
  --accept 200,429
  --no-progress
  --user-agent "Mozilla/5.0 (compatible; lychee-link-checker)"
)

echo -e "${YELLOW}Checking links...${NC}"
echo ""

# Single lychee run → JSON report (exit code 2 = broken links found, not a script error)
lychee "${LYCHEE_OPTS[@]}" --format json --output "$REPORT_JSON" "$BUILD_DIR/**/*.html" 2>&1 || STATUS=$?
STATUS=${STATUS:-0}

# Convert JSON report to CSV with source MDX paths
# Columns: source,broken_link,type,status
BUILD_PREFIX="$PWD/.next/server/app"
python3 -c "
import csv, json, sys

with open('$REPORT_JSON') as f:
    data = json.load(f)

error_map = data.get('error_map', {})
if not error_map:
    sys.exit(0)

with open('$REPORT_CSV', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['source', 'broken_link', 'type', 'status'])
    for source, errors in sorted(error_map.items()):
        # .next/server/app/vibe/terminal.html → src/app/(docs)/vibe/terminal/page.mdx
        mdx = source.replace('.next/server/app/', 'src/app/(docs)/').removesuffix('.html') + '/page.mdx'
        for err in errors:
            url = err['url']
            # Clean file:// URLs → just the path
            if url.startswith('file://'):
                url = url.replace('file://$BUILD_PREFIX', '')
                link_type = 'internal'
            else:
                link_type = 'external'
            status = err.get('status', {}).get('text', 'unknown')
            w.writerow([mdx, url, link_type, status])
"

# Print summary to terminal
echo ""
if [[ $STATUS -eq 0 ]]; then
  echo -e "${GREEN}All links OK across ${PAGE_COUNT} pages.${NC}"
else
  ERRORS=$(python3 -c "import json; d=json.load(open('$REPORT_JSON')); print(d.get('errors',0))")
  TOTAL=$(python3 -c "import json; d=json.load(open('$REPORT_JSON')); print(d.get('total',0))")
  echo -e "${RED}${ERRORS} broken links found across ${PAGE_COUNT} pages (${TOTAL} total checked).${NC}"
  echo ""

  # Print CSV to terminal as a readable table
  column -t -s',' "$REPORT_CSV" | head -30
  LINES=$(wc -l < "$REPORT_CSV")
  if [[ $LINES -gt 30 ]]; then
    echo -e "${DIM}... and $((LINES - 30)) more${NC}"
  fi

  echo ""
  echo -e "${DIM}Full report: ${REPORT_CSV}${NC}"
fi

exit $STATUS
