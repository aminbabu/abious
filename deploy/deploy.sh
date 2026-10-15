#!/usr/bin/env bash
# ==============================================================================
# Production deploy for aminbabu.com (npm + PM2 + CloudPanel reverse proxy)
# Usage:
#   DEPLOY_BRANCH=main bash deploy/deploy.sh
# Optional:
#   RUN_MIGRATE=true RUN_SEED=true bash deploy/deploy.sh
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

echo "================================================="
echo " Abious production deployment"
echo " Time: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
print_runtime
echo "================================================="

cd "$APP_DIR"
ensure_runtime

# 1. Sync git
if [ -d ".git" ]; then
  DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
  echo "--> Syncing git branch: $DEPLOY_BRANCH"
  git fetch origin "$DEPLOY_BRANCH"
  git checkout "$DEPLOY_BRANCH"
  git reset --hard "origin/$DEPLOY_BRANCH"
fi

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

# 2. Install + build (npm only on server)
echo "--> npm install (workspaces)..."
npm install --no-package-lock --workspaces --include-workspace-root

echo "--> Building API (NestJS)..."
npm run build -w api

echo "--> Building Web (SolidStart / Nitro)..."
npm run build -w web

# 3. Optional migrate / seed
if [ "${RUN_MIGRATE:-false}" = "true" ]; then
  echo "--> Applying SQL migrations..."
  bash "$APP_DIR/deploy/apply-migrations.sh"
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "--> Seeding database..."
  npm run db:seed -w api
fi

# 4. PM2 reload/start (keep process names stable for CloudPanel)
echo "--> Reloading PM2 apps..."
if pm2 describe abious-api >/dev/null 2>&1 || pm2 describe abious-web >/dev/null 2>&1; then
  pm2 reload "$APP_DIR/deploy/ecosystem.config.cjs" --update-env
else
  pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
fi
pm2 save

# 5. Health checks (local reverse-proxy targets)
echo "--> Health checks..."
set +e
health_check "abious-api" "http://127.0.0.1:${API_PORT}/" 25
API_OK=$?
health_check "abious-web" "http://127.0.0.1:${WEB_PORT}/" 25
WEB_OK=$?
set -e

pm2 list

echo "================================================="
if [ "$API_OK" -eq 0 ] && [ "$WEB_OK" -eq 0 ]; then
  echo " Deployment successful."
else
  echo " Deployment finished with health warnings — check pm2 logs."
fi
echo " CloudPanel reverse proxy targets (unchanged):"
echo "   aminbabu.com      -> http://127.0.0.1:${WEB_PORT}"
echo "   api.aminbabu.com  -> http://127.0.0.1:${API_PORT}"
echo "================================================="

if [ "$API_OK" -ne 0 ] || [ "$WEB_OK" -ne 0 ]; then
  exit 1
fi
