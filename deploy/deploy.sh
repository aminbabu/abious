#!/usr/bin/env bash
# ==============================================================================
# Abious Monorepo User-Mode Deployment Script (CI/CD and SSH Friendly)
# Usage: bash deploy/deploy.sh
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Ensure user PATH includes common node/pnpm paths (nvm, pnpm home, local bin)
export PATH="$HOME/.local/share/pnpm:$HOME/.pnpm:$HOME/.nvm/versions/node/$(ls -1 $HOME/.nvm/versions/node 2>/dev/null | tail -n 1)/bin:$HOME/.local/bin:$HOME/bin:/usr/local/bin:/usr/bin:$PATH"

# Ensure XDG_RUNTIME_DIR and DBUS are configured for non-interactive SSH sessions with systemd --user
if [ -z "${XDG_RUNTIME_DIR:-}" ]; then
    export XDG_RUNTIME_DIR="/run/user/$(id -u)"
fi
if [ -z "${DBUS_SESSION_BUS_ADDRESS:-}" ] && [ -e "$XDG_RUNTIME_DIR/bus" ]; then
    export DBUS_SESSION_BUS_ADDRESS="unix:path=$XDG_RUNTIME_DIR/bus"
fi

echo "================================================="
echo " Starting Abious User Deployment Update"
echo " Time: $(date)"
echo " Working Directory: $APP_DIR"
echo " User: $(whoami)"
echo " Node: $(command -v node || echo 'not found') ($(node -v 2>/dev/null || true))"
echo " pnpm: $(command -v pnpm || echo 'not found') ($(pnpm -v 2>/dev/null || true))"
echo "================================================="

cd "$APP_DIR"

# 1. Pull latest git changes (if deployment uses git)
if [ -d ".git" ]; then
    echo "--> Pulling latest source code from git..."
    # Discard any accidental local modifications to tracked files
    git fetch origin main || git fetch origin master || true
    git reset --hard origin/main || git reset --hard origin/master || true
fi

# 2. Check for required production env files (stored ONLY on server)
if [ ! -f "$APP_DIR/apps/api/.env.production" ]; then
    echo "ERROR: $APP_DIR/apps/api/.env.production not found on server!"
    echo "Please configure .env.production on the server first."
    exit 1
fi

if [ ! -f "$APP_DIR/apps/web/.env.production" ]; then
    echo "ERROR: $APP_DIR/apps/web/.env.production not found on server!"
    echo "Please configure .env.production on the server first."
    exit 1
fi

# Ensure uploads directory exists
mkdir -p "$APP_DIR/apps/api/uploads"

# 3. Install Monorepo Dependencies
echo "--> Installing dependencies via pnpm..."
pnpm install --frozen-lockfile

# 4. Build Backend API (NestJS)
echo "--> Building apps/api..."
pnpm --filter api run build

# 5. Build Frontend Web (SolidStart / Nitro)
echo "--> Building apps/web..."
pnpm --filter web run build

# 6. Run Database Migrations / Seed if requested
if [ "${RUN_SEED:-false}" = "true" ]; then
    echo "--> Running initial database seed..."
    pnpm --filter api run db:seed
fi

# 7. Restart User-Level Systemd Services
echo "--> Reloading and restarting systemd --user services..."
systemctl --user daemon-reload
systemctl --user restart abious-api.service
systemctl --user restart abious-web.service

# 8. Check Service Health
echo "--> Verifying service health..."
sleep 2
systemctl --user is-active --quiet abious-api && echo "[SUCCESS] abious-api is ACTIVE!" || (echo "[FAIL] abious-api failed to start"; journalctl --user -u abious-api -n 25 --no-pager; exit 1)
systemctl --user is-active --quiet abious-web && echo "[SUCCESS] abious-web is ACTIVE!" || (echo "[FAIL] abious-web failed to start"; journalctl --user -u abious-web -n 25 --no-pager; exit 1)

echo "================================================="
echo " Deployment completed successfully!"
echo "================================================="
