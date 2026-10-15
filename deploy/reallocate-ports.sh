#!/usr/bin/env bash
# One-shot: move API/WEB off 3000/4000 onto free 8000-series ports.
# Updates .env.production, recreates PM2 apps, prints CloudPanel targets.
#
# Usage:
#   bash deploy/reallocate-ports.sh
#   bash deploy/reallocate-ports.sh 8000

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

START="${1:-$DEFAULT_PORT_SERIES_START}"
API_ENV="$APP_DIR/apps/api/.env.production"
WEB_ENV="$APP_DIR/apps/web/.env.production"

if [ ! -f "$API_ENV" ] || [ ! -f "$WEB_ENV" ]; then
  echo "ERROR: Missing .env.production files. Run install-interactive.sh first."
  exit 1
fi

load_node_env
ensure_runtime

OLD_API="$(read_env_value "$API_ENV" PORT || true)"
OLD_WEB="$(read_env_value "$WEB_ENV" PORT || true)"

echo "--> Stopping existing PM2 apps (frees ${OLD_API:-?} / ${OLD_WEB:-?})..."
pm2 delete abious-api >/dev/null 2>&1 || true
pm2 delete abious-web >/dev/null 2>&1 || true
sleep 1

read -r API_PORT WEB_PORT <<<"$(allocate_free_port_pair "$START")"

echo "--> Allocated 8000-series ports:"
echo "    API  ${OLD_API:-none} -> ${API_PORT}"
echo "    WEB  ${OLD_WEB:-none} -> ${WEB_PORT}"

# Replace PORT=... in place (keep the rest of the env file)
tmp_api="$(mktemp)"
tmp_web="$(mktemp)"
awk -v port="$API_PORT" '
  BEGIN { done=0 }
  /^PORT=/ { print "PORT=" port; done=1; next }
  { print }
  END { if (!done) print "PORT=" port }
' "$API_ENV" >"$tmp_api"
awk -v port="$WEB_PORT" '
  BEGIN { done=0 }
  /^PORT=/ { print "PORT=" port; done=1; next }
  { print }
  END { if (!done) print "PORT=" port }
' "$WEB_ENV" >"$tmp_web"
mv "$tmp_api" "$API_ENV"
mv "$tmp_web" "$WEB_ENV"

# Keep INTERNAL_API_URL in sync with new API port
if grep -q '^INTERNAL_API_URL=' "$WEB_ENV"; then
  tmp_web="$(mktemp)"
  awk -v port="$API_PORT" '
    /^INTERNAL_API_URL=/ { print "INTERNAL_API_URL=http://127.0.0.1:" port; next }
    { print }
  ' "$WEB_ENV" >"$tmp_web"
  mv "$tmp_web" "$WEB_ENV"
else
  echo "INTERNAL_API_URL=http://127.0.0.1:${API_PORT}" >>"$WEB_ENV"
fi

# Ensure HOST is localhost for reverse-proxy only binding
if ! grep -q '^HOST=' "$API_ENV"; then
  echo "HOST=127.0.0.1" >>"$API_ENV"
fi
if ! grep -q '^HOST=' "$WEB_ENV"; then
  echo "HOST=127.0.0.1" >>"$WEB_ENV"
fi

echo "--> Starting PM2 with new ports..."
pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
pm2 save

sleep 2
set +e
health_check "abious-api" "http://127.0.0.1:${API_PORT}/" 20
health_check "abious-web" "http://127.0.0.1:${WEB_PORT}/" 20
set -e

NOTES="$APP_DIR/deploy/cloudpanel-aminbabu.com.txt"
cat >"$NOTES" <<EOF
CloudPanel reverse proxy — aminbabu.com (updated $(date -u +%Y-%m-%dT%H:%M:%SZ))
========================================================================
Monorepo: ${APP_DIR}

1) aminbabu.com
   Reverse Proxy -> http://127.0.0.1:${WEB_PORT}

2) api.aminbabu.com
   Reverse Proxy -> http://127.0.0.1:${API_PORT}
EOF

echo ""
echo "================================================="
echo " Ports reallocated. Update CloudPanel NOW:"
echo "   aminbabu.com      -> http://127.0.0.1:${WEB_PORT}"
echo "   api.aminbabu.com  -> http://127.0.0.1:${API_PORT}"
echo " Notes: ${NOTES}"
echo "================================================="
