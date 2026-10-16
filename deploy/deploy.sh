#!/usr/bin/env bash
# ==============================================================================
# Production deploy for aminbabu.com (npm + PM2 + CloudPanel reverse proxy)
# Usage:
#   DEPLOY_BRANCH=main bash deploy/deploy.sh
# Optional:
#   RUN_MIGRATE=true RUN_SEED=true bash deploy/deploy.sh
#   SKIP_GIT_SYNC=1 bash deploy/deploy.sh   # when caller already pulled
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$APP_ROOT"

# 1. Sync git FIRST, then re-exec so the rest of this run uses the new scripts.
#    (bash keeps the old script body in memory across git reset --hard.)
if [ "${SKIP_GIT_SYNC:-0}" != "1" ] && [ -d ".git" ]; then
  DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
  echo "--> Syncing git branch: $DEPLOY_BRANCH"
  git fetch origin "$DEPLOY_BRANCH"
  git checkout "$DEPLOY_BRANCH"
  git reset --hard "origin/$DEPLOY_BRANCH"
  echo "--> Re-executing deploy.sh from updated commit $(git rev-parse --short HEAD)"
  export SKIP_GIT_SYNC=1
  export DEPLOY_BRANCH
  export RUN_MIGRATE="${RUN_MIGRATE:-false}"
  export RUN_SEED="${RUN_SEED:-false}"
  exec bash "$APP_ROOT/deploy/deploy.sh"
fi

# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

echo "================================================="
echo " Abious production deployment"
echo " Time: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo " Commit: $(git rev-parse --short HEAD 2>/dev/null || echo n/a)"
print_runtime
echo "================================================="

ensure_runtime

API_ENV="$APP_DIR/apps/api/.env.production"
WEB_ENV="$APP_DIR/apps/web/.env.production"

if [ ! -f "$API_ENV" ] || [ ! -f "$WEB_ENV" ]; then
  echo "ERROR: Missing production env files."
  echo "First-time setup: bash deploy/install-interactive.sh"
  exit 1
fi

API_PORT="$(read_env_value "$API_ENV" PORT)"
WEB_PORT="$(read_env_value "$WEB_ENV" PORT)"
DATABASE_URL="$(read_env_value "$API_ENV" DATABASE_URL || true)"

if [ -z "${API_PORT:-}" ] || [ -z "${WEB_PORT:-}" ]; then
  echo "ERROR: PORT missing in .env.production files."
  exit 1
fi

echo "--> Locked ports from .env.production (do not change without updating CloudPanel):"
echo "    API  127.0.0.1:${API_PORT}  -> https://api.aminbabu.com"
echo "    WEB  127.0.0.1:${WEB_PORT}  -> https://aminbabu.com"

if ! port_usable_by_pm2_app "$API_PORT" "abious-api"; then
  echo "ERROR: API port ${API_PORT} is in use by another process."
  echo "Run: bash deploy/check-ports.sh"
  exit 1
fi
if ! port_usable_by_pm2_app "$WEB_PORT" "abious-web"; then
  echo "ERROR: WEB port ${WEB_PORT} is in use by another process."
  echo "Run: bash deploy/check-ports.sh"
  exit 1
fi

if [ -n "${DATABASE_URL:-}" ] && command -v psql >/dev/null 2>&1; then
  echo "--> Checking database connectivity..."
  psql "$DATABASE_URL" -c 'SELECT 1;' >/dev/null
  echo "[OK] Database reachable"
fi

mkdir -p "$APP_DIR/apps/api/uploads"

# 2. Stop web before rebuilding .output (avoids 500 on /_build assets mid-deploy)
echo "--> Stopping PM2 apps before rebuild..."
pm2 delete abious-web >/dev/null 2>&1 || true
pm2 delete abious-api >/dev/null 2>&1 || true
sleep 1

# 3. Install + build per app (never npm workspaces on server)
npm_install_apps
npm_build_apps
verify_web_build_assets

# 4. Optional migrate / seed
if [ "${RUN_MIGRATE:-false}" = "true" ]; then
  echo "--> Applying SQL migrations..."
  bash "$APP_DIR/deploy/apply-migrations.sh"
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "--> Seeding database..."
  (cd "$APP_DIR/apps/api" && npm run db:seed)
fi

# 5. Fresh PM2 start (do not reload over a half-written .output)
echo "--> Starting PM2 apps..."
pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
pm2 save

# 6. Health checks (HTML + a real CSS asset)
echo "--> Health checks..."
set +e
health_check "abious-api" "http://127.0.0.1:${API_PORT}/" 25
API_OK=$?
health_check "abious-web" "http://127.0.0.1:${WEB_PORT}/" 25
WEB_OK=$?
ASSET_OK=0
if [ -n "${WEB_ASSET_SAMPLE_PATH:-}" ]; then
  health_check_asset "$WEB_PORT" "$WEB_ASSET_SAMPLE_PATH"
  ASSET_OK=$?
fi
set -e

pm2 list

echo "================================================="
if [ "$API_OK" -eq 0 ] && [ "$WEB_OK" -eq 0 ] && [ "$ASSET_OK" -eq 0 ]; then
  echo " Deployment successful."
else
  echo " Deployment finished with health warnings — check: pm2 logs abious-web"
fi
echo " CloudPanel reverse proxy targets (unchanged):"
echo "   aminbabu.com      -> http://127.0.0.1:${WEB_PORT}"
echo "   api.aminbabu.com  -> http://127.0.0.1:${API_PORT}"
echo "================================================="

if [ "$API_OK" -ne 0 ] || [ "$WEB_OK" -ne 0 ] || [ "$ASSET_OK" -ne 0 ]; then
  exit 1
fi
