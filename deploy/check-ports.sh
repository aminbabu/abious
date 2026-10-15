#!/usr/bin/env bash
# Show port status around the production pair (API 8009 / WEB 8010).
# Usage: bash deploy/check-ports.sh [start_port] [count]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

START="${1:-$DEFAULT_PORT_SERIES_START}"
COUNT="${2:-20}"

echo "Production ports: API=${PRODUCTION_API_PORT}  WEB=${PRODUCTION_WEB_PORT}"
echo "Scanning ports ${START}..$((START + COUNT - 1)) on $(hostname)..."
echo ""

i=0
while [ "$i" -lt "$COUNT" ]; do
  port=$((START + i))
  marker=""
  if [ "$port" -eq "$PRODUCTION_API_PORT" ]; then
    marker="  <- API (production)"
  elif [ "$port" -eq "$PRODUCTION_WEB_PORT" ]; then
    marker="  <- WEB (production)"
  fi
  if is_port_in_use "$port"; then
    owner=""
    if command -v ss >/dev/null 2>&1; then
      owner="$(ss -tulnp 2>/dev/null | grep -E ":${port}\\s" | head -n 1 || true)"
    fi
    echo "IN USE  $port${marker}  ${owner}"
  else
    echo "FREE    $port${marker}"
  fi
  i=$((i + 1))
done

echo ""
echo "Configured production pair:"
echo "  API  $PRODUCTION_API_PORT  -> api.aminbabu.com"
echo "  WEB  $PRODUCTION_WEB_PORT  -> aminbabu.com"

if [ -f "$APP_DIR/apps/api/.env.production" ] && [ -f "$APP_DIR/apps/web/.env.production" ]; then
  API_PORT="$(read_env_value "$APP_DIR/apps/api/.env.production" PORT || true)"
  WEB_PORT="$(read_env_value "$APP_DIR/apps/web/.env.production" PORT || true)"
  echo ""
  echo "Locked in .env.production:"
  echo "  API  PORT=$API_PORT  -> https://api.aminbabu.com"
  echo "  WEB  PORT=$WEB_PORT  -> https://aminbabu.com"
fi
