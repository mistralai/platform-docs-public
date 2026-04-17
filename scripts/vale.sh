#!/usr/bin/env bash
set -euo pipefail

# Run Vale prose linter on the documentation.
# Usage:
#   pnpm vale              # lint all docs
#   pnpm vale --minAlertLevel=error  # only errors

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

echo -e "${DIM}Running Vale on src/app/(docs)/...${NC}"
echo ""
vale "src/app/(docs)/" "$@"
