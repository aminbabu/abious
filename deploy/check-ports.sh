#!/usr/bin/env bash
# Show which production ports are free / in use.
# Usage: bash deploy/check-ports.sh [start_port] [count]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

START="${1:-3000}"
COUNT="${2:-20}"

echo "Scanning ports ${START}..$((START + COUNT - 1)) on $(hostname)..."
echo ""

i=0
while [ "$i" -lt "$COUNT" ]; do
  port=$((START + i))
  if is_port_in_use "$port"; then
    owner=""
    if command -v ss >/dev/null 2>&1; then
      owner="$(ss -tulnp 2>/dev/null | grep -E ":${port}\\s" | head -n 1 || true)"
    fi
    echo "IN USE  $port  ${owner}"
  else
    echo "FREE    $port"
  fi
  i=$((i + 1))
done

API_FREE="$(find_next_available_port "$DEFAULT_API_PORT_START")"
WEB_SEARCH="$DEFAULT_WEB_PORT_START"
if [ "$WEB_SEARCH" -le "$API_FREE" ]; then
  WEB_SEARCH=$((API_FREE + 1))
fi
WEB_FREE="$(find_next_available_port "$WEB_SEARCH")"

echo ""
echo "Suggested free pair:"
echo "  API  $API_FREE"
echo "  WEB  $WEB_FREE"

if [ -f "$APP_DIR/apps/api/.env.production" ] && [ -f "$APP_DIR/apps/web/.env.production" ]; then
  API_PORT="$(read_env_value "$APP_DIR/apps/api/.env.production" PORT || true)"
  WEB_PORT="$(read_env_value "$APP_DIR/apps/web/.env.production" PORT || true)"
  echo ""
  echo "Locked in .env.production (use these in CloudPanel):"
  echo "  API  PORT=$API_PORT  -> https://api.aminbabu.com"
  echo "  WEB  PORT=$WEB_PORT  -> https://aminbabu.com"
fi
