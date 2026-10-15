#!/usr/bin/env bash
# ==============================================================================
# Abious Monorepo Deployment (npm + PM2, CloudPanel-friendly, no sudo)
# Usage: bash deploy/deploy.sh
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# User-local Node/npm/pm2 paths (nvm, CloudPanel node, etc.)
export PATH="$HOME/.nvm/versions/node/$(ls -1 "$HOME/.nvm/versions/node" 2>/dev/null | tail -n 1)/bin:$HOME/.local/bin:$HOME/bin:/usr/local/bin:/usr/bin:$PATH"

echo "================================================="
echo " Starting Abious Monorepo Deployment"
echo " Time: $(date)"
echo " Working Directory: $APP_DIR"
echo " User: $(whoami)"
echo " Node: $(command -v node || echo 'not found') ($(node -v 2>/dev/null || true))"
echo " npm:  $(command -v npm || echo 'not found') ($(npm -v 2>/dev/null || true))"
echo " pm2:  $(command -v pm2 || echo 'not found')"
echo "================================================="

cd "$APP_DIR"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: node/npm not found in PATH."
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "--> Installing pm2 for current user..."
  npm install -g pm2
  export PATH="$(npm prefix -g)/bin:$PATH"
fi

# 1. Pull latest git changes (if deployment uses git)
if [ -d ".git" ]; then
  DEPLOY_BRANCH="${DEPLOY_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
  echo "--> Pulling latest source code from git (branch: $DEPLOY_BRANCH)..."
  git fetch origin "$DEPLOY_BRANCH"
  git checkout "$DEPLOY_BRANCH"
  git reset --hard "origin/$DEPLOY_BRANCH"
fi

# 2. Check for required production env files (stored ONLY on server)
if [ ! -f "$APP_DIR/apps/api/.env.production" ]; then
  echo "ERROR: $APP_DIR/apps/api/.env.production not found on server!"
  echo "Run: bash deploy/install-interactive.sh"
  exit 1
fi

if [ ! -f "$APP_DIR/apps/web/.env.production" ]; then
  echo "ERROR: $APP_DIR/apps/web/.env.production not found on server!"
  echo "Run: bash deploy/install-interactive.sh"
  exit 1
fi

mkdir -p "$APP_DIR/apps/api/uploads"

# 3. Install + build with npm workspaces (pnpm is local-dev only)
echo "--> Installing dependencies via npm..."
npm install --no-package-lock --workspaces --include-workspace-root

echo "--> Building apps/api (NestJS)..."
npm run build -w api

echo "--> Building apps/web (SolidStart / Nitro)..."
npm run build -w web

# 4. Optional seed
if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "--> Running database seed..."
  npm run db:seed -w api
fi

# 5. Restart or start PM2 apps
echo "--> Starting/reloading PM2 processes..."
if pm2 describe abious-api >/dev/null 2>&1 || pm2 describe abious-web >/dev/null 2>&1; then
  pm2 reload "$APP_DIR/deploy/ecosystem.config.cjs" --update-env
else
  pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
fi
pm2 save

echo "--> PM2 status:"
pm2 list

echo "================================================="
echo " Deployment completed successfully!"
echo " Point CloudPanel reverse-proxy vhosts at the PORT"
echo " values from apps/api/.env.production and"
echo " apps/web/.env.production (see deploy/CLOUDPANEL.md)."
echo "================================================="
