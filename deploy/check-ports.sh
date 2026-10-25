#!/usr/bin/env bash
# Show port status and configured production ports.
# Usage: bash deploy/check-ports.sh [start_port] [count]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

START="${1:-$DEFAULT_PORT_SERIES_START}"
COUNT="${2:-20}"

CONFIGURED_API_PORT=""
CONFIGURED_WEB_PORT=""
if [ -f "$APP_DIR/apps/api/.env.production" ] && [ -f "$APP_DIR/apps/web/.env.production" ]; then
  CONFIGURED_API_PORT="$(read_env_value "$APP_DIR/apps/api/.env.production" PORT || true)"
  CONFIGURED_WEB_PORT="$(read_env_value "$APP_DIR/apps/web/.env.production" PORT || true)"
fi

if [ -n "$CONFIGURED_API_PORT" ] && [ -n "$CONFIGURED_WEB_PORT" ]; then
  echo "Production ports from .env.production: API=${CONFIGURED_API_PORT}  WEB=${CONFIGURED_WEB_PORT}"
else
  echo "No production ports locked yet. Scanning ports starting from ${START}..."
fi
echo "Scanning ports ${START}..$((START + COUNT - 1)) on $(hostname)..."
echo ""

i=0
while [ "$i" -lt "$COUNT" ]; do
  port=$((START + i))
  marker=""
  if [ -n "$CONFIGURED_API_PORT" ] && [ "$port" -eq "$CONFIGURED_API_PORT" ]; then
    marker="  <- API (configured)"
  elif [ -n "$CONFIGURED_WEB_PORT" ] && [ "$port" -eq "$CONFIGURED_WEB_PORT" ]; then
    marker="  <- WEB (configured)"
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

if [ -n "$CONFIGURED_API_PORT" ] && [ -n "$CONFIGURED_WEB_PORT" ]; then
  echo ""
  echo "Locked in .env.production:"
  echo "  API  PORT=$CONFIGURED_API_PORT  -> https://api.aminbabu.com"
  echo "  WEB  PORT=$CONFIGURED_WEB_PORT  -> https://aminbabu.com"
fi
