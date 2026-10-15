#!/usr/bin/env bash
# ==============================================================================
# Non-Root / User-Level Interactive Setup Wizard for Abious
# Works entirely without sudo / root permissions:
# - Uses PM2 (CloudPanel-friendly)
# - Checks local ports, Node.js & npm in user PATH
# - Generates production envs, builds, seeds, and launches Nest + web apps
# - Prints CloudPanel reverse-proxy vhost settings (no nginx root access needed)
# ==============================================================================

set -euo pipefail

# ANSI color codes
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
cat << "EOF"
    ___    ____  ________  __  _______
   /   |  / __ )/  _/ __ \/ / / / ___/
  / /| | / __  |/ // / / / / / /\__ \ 
 / ___ |/ /_/ // // /_/ / /_/ /___/ / 
/_/  |_/_____/___/\____/\____//____/  
   CloudPanel / User-Mode Setup (npm + PM2, no sudo)
EOF
echo -e "${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CURRENT_USER="$(whoami)"
USER_HOME="$HOME"

# ------------------------------------------------------------------------------
# Utility: Check if a port is in use
# ------------------------------------------------------------------------------
is_port_in_use() {
    local port="$1"
    if command -v ss >/dev/null 2>&1; then
        ss -tuln 2>/dev/null | grep -q ":${port} " && return 0
    fi
    if command -v netstat >/dev/null 2>&1; then
        netstat -tuln 2>/dev/null | grep -q ":${port} " && return 0
    fi
    if command -v lsof >/dev/null 2>&1; then
        lsof -i ":${port}" >/dev/null 2>&1 && return 0
    fi
    # Fallback to test binding with node
    if command -v node >/dev/null 2>&1; then
        if node -e "const net = require('net'); const s = net.createServer(); s.once('error', () => process.exit(1)); s.listen($port, '0.0.0.0', () => { s.close(); process.exit(0); });" >/dev/null 2>&1; then
            return 1 # Available
        else
            return 0 # In use
        fi
    fi
    return 1
}

find_next_available_port() {
    local candidate="$1"
    while is_port_in_use "$candidate"; do
        candidate=$((candidate + 1))
    done
    echo "$candidate"
}

# ------------------------------------------------------------------------------
# 1. Environment & Runtime Verification
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[Step 1/6] Checking User Environment & Node Runtime...${NC}"

if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Node.js is not found in your PATH.${NC}"
    echo "If installed via NVM, run: nvm use 24 (or ensure ~/.bashrc has NVM configured)."
    exit 1
fi

NODE_BIN="$(command -v node)"
NODE_VER=$(node -v)
echo -e "${GREEN}✓ Node.js found: ${NODE_VER} (${NODE_BIN})${NC}"

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] npm is not found in your PATH (required for server deploys).${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm -v)${NC}"

if ! command -v pm2 >/dev/null 2>&1; then
    echo -e "${YELLOW}--> Installing pm2 for current user...${NC}"
    npm install -g pm2 >/dev/null 2>&1 || true
    export PATH="$(npm prefix -g)/bin:$PATH"
fi
if ! command -v pm2 >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Could not install pm2. Run: npm install -g pm2${NC}"
    exit 1
fi
echo -e "${GREEN}✓ pm2 found: $(pm2 -v)${NC}"

# ------------------------------------------------------------------------------
# 2. Port Availability Checks & Selection
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[Step 2/6] Detecting Available Network Ports...${NC}"

DEFAULT_API_PORT=3000
if is_port_in_use "$DEFAULT_API_PORT"; then
    NEXT_API=$(find_next_available_port "$DEFAULT_API_PORT")
    echo -e "${YELLOW}⚠ Port $DEFAULT_API_PORT is in use. Recommended free port: $NEXT_API${NC}"
    DEFAULT_API_PORT="$NEXT_API"
else
    echo -e "${GREEN}✓ Port $DEFAULT_API_PORT is available for API.${NC}"
fi

read -rp "$(echo -e "${CYAN}Backend API Port [default: ${DEFAULT_API_PORT}]: ${NC}")" API_PORT
API_PORT=${API_PORT:-$DEFAULT_API_PORT}

while is_port_in_use "$API_PORT"; do
    echo -e "${RED}[ERROR] Port $API_PORT is already bound to another service!${NC}"
    API_PORT=$(find_next_available_port "$API_PORT")
    read -rp "$(echo -e "${CYAN}Please enter a free port [suggested: ${API_PORT}]: ${NC}")" USER_INPUT_PORT
    API_PORT=${USER_INPUT_PORT:-$API_PORT}
done

DEFAULT_WEB_PORT=4000
if [ "$DEFAULT_WEB_PORT" -eq "$API_PORT" ] || is_port_in_use "$DEFAULT_WEB_PORT"; then
    NEXT_WEB=$(find_next_available_port $((API_PORT + 1)))
    DEFAULT_WEB_PORT="$NEXT_WEB"
    echo -e "${YELLOW}⚠ Port $DEFAULT_WEB_PORT is unavailable. Recommended free port: $NEXT_WEB${NC}"
else
    echo -e "${GREEN}✓ Port $DEFAULT_WEB_PORT is available for Web Frontend.${NC}"
fi

read -rp "$(echo -e "${CYAN}Web Frontend Port [default: ${DEFAULT_WEB_PORT}]: ${NC}")" WEB_PORT
WEB_PORT=${WEB_PORT:-$DEFAULT_WEB_PORT}

while [ "$WEB_PORT" -eq "$API_PORT" ] || is_port_in_use "$WEB_PORT"; do
    echo -e "${RED}[ERROR] Port $WEB_PORT conflicts with API or is in use!${NC}"
    WEB_PORT=$(find_next_available_port $((API_PORT + 1)))
    read -rp "$(echo -e "${CYAN}Please enter a free port [suggested: ${WEB_PORT}]: ${NC}")" USER_INPUT_PORT
    WEB_PORT=${USER_INPUT_PORT:-$WEB_PORT}
done

echo -e "${GREEN}✓ Bound Ports: API -> ${API_PORT}, Web -> ${WEB_PORT}${NC}"

# ------------------------------------------------------------------------------
# 3. Domain & Public URLs
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[Step 3/6] Domain & URL Configuration...${NC}"
read -rp "$(echo -e "${CYAN}Frontend Public Domain/URL (e.g. yourdomain.com or https://yourdomain.com): ${NC}")" RAW_DOMAIN_WEB
while [ -z "$RAW_DOMAIN_WEB" ]; do
    echo -e "${RED}Domain cannot be empty.${NC}"
    read -rp "$(echo -e "${CYAN}Frontend Public Domain/URL: ${NC}")" RAW_DOMAIN_WEB
done

# Format clean URL
CLEAN_WEB_DOMAIN=$(echo "$RAW_DOMAIN_WEB" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
CLIENT_URL="https://${CLEAN_WEB_DOMAIN}"

SUGGESTED_API_DOMAIN="api.${CLEAN_WEB_DOMAIN}"
read -rp "$(echo -e "${CYAN}Backend Public Domain [default: ${SUGGESTED_API_DOMAIN}]: ${NC}")" RAW_DOMAIN_API
RAW_DOMAIN_API=${RAW_DOMAIN_API:-$SUGGESTED_API_DOMAIN}
CLEAN_API_DOMAIN=$(echo "$RAW_DOMAIN_API" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
BETTER_AUTH_URL="https://${CLEAN_API_DOMAIN}"

echo -e "${GREEN}✓ Client URL:     ${CLIENT_URL}${NC}"
echo -e "${GREEN}✓ Better Auth URL: ${BETTER_AUTH_URL}${NC}"

# ------------------------------------------------------------------------------
# 4. Database & Auth Secret
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[Step 4/6] Database & Authentication Secret...${NC}"

read -rp "$(echo -e "${CYAN}Enter PostgreSQL DATABASE_URL: ${NC}")" DATABASE_URL
while [ -z "$DATABASE_URL" ]; do
    echo -e "${RED}DATABASE_URL is required.${NC}"
    read -rp "$(echo -e "${CYAN}Enter PostgreSQL DATABASE_URL: ${NC}")" DATABASE_URL
done

DEFAULT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
read -rp "$(echo -e "${CYAN}Better Auth Secret (min 32 chars) [press Enter to auto-generate]: ${NC}")" BETTER_AUTH_SECRET
BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-$DEFAULT_SECRET}

echo -e "\n${YELLOW}Social OAuth Providers (Optional - press Enter to skip):${NC}"
read -rp "$(echo -e "${CYAN}Google Client ID: ${NC}")" GOOGLE_CLIENT_ID
read -rp "$(echo -e "${CYAN}Google Client Secret: ${NC}")" GOOGLE_CLIENT_SECRET
read -rp "$(echo -e "${CYAN}GitHub Client ID: ${NC}")" GITHUB_CLIENT_ID
read -rp "$(echo -e "${CYAN}GitHub Client Secret: ${NC}")" GITHUB_CLIENT_SECRET

echo -e "\n${YELLOW}SMTP Email Configuration (For contact form & password reset):${NC}"
read -rp "$(echo -e "${CYAN}SMTP Host [default: smtp.gmail.com]: ${NC}")" SMTP_HOST
SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}
read -rp "$(echo -e "${CYAN}SMTP Port [default: 465]: ${NC}")" SMTP_PORT
SMTP_PORT=${SMTP_PORT:-465}
read -rp "$(echo -e "${CYAN}SMTP Secure (true/false) [default: true]: ${NC}")" SMTP_SECURE
SMTP_SECURE=${SMTP_SECURE:-true}
read -rp "$(echo -e "${CYAN}SMTP Username / Email: ${NC}")" SMTP_USER
read -rsp "$(echo -e "${CYAN}SMTP Password / App Password: ${NC}")" SMTP_PASS
echo ""
read -rp "$(echo -e "${CYAN}Sender From [default: \"Abious\" <${SMTP_USER:-noreply@${CLEAN_WEB_DOMAIN}}>]: ${NC}")" SMTP_FROM
SMTP_FROM=${SMTP_FROM:-"\"Abious\" <${SMTP_USER:-noreply@${CLEAN_WEB_DOMAIN}}>"}
read -rp "$(echo -e "${CYAN}Contact Receiver Email [default: ${SMTP_USER:-admin@${CLEAN_WEB_DOMAIN}}]: ${NC}")" CONTACT_RECEIVER_EMAIL
CONTACT_RECEIVER_EMAIL=${CONTACT_RECEIVER_EMAIL:-${SMTP_USER:-admin@${CLEAN_WEB_DOMAIN}}}

# ------------------------------------------------------------------------------
# 5. Write Env Files & CloudPanel notes
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[Step 5/6] Generating Environment Files...${NC}"

# 1. API env
cat > "$APP_DIR/apps/api/.env.production" << EOF
PORT=${API_PORT}
NODE_ENV=production

DATABASE_URL=${DATABASE_URL}

BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
BETTER_AUTH_URL=${BETTER_AUTH_URL}
CLIENT_URL=${CLIENT_URL}

GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}

SMTP_HOST=${SMTP_HOST}
SMTP_PORT=${SMTP_PORT}
SMTP_SECURE=${SMTP_SECURE}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
SMTP_FROM=${SMTP_FROM}
CONTACT_RECEIVER_EMAIL=${CONTACT_RECEIVER_EMAIL}
EOF
echo -e "${GREEN}✓ Created apps/api/.env.production${NC}"

# 2. Web env
cat > "$APP_DIR/apps/web/.env.production" << EOF
PORT=${WEB_PORT}
HOST=127.0.0.1
NODE_ENV=production
VITE_API_URL=${BETTER_AUTH_URL}
INTERNAL_API_URL=http://127.0.0.1:${API_PORT}
EOF
echo -e "${GREEN}✓ Created apps/web/.env.production${NC}"

mkdir -p "$APP_DIR/apps/api/uploads"

CLOUDPANEL_NOTES="$APP_DIR/deploy/cloudpanel-${CLEAN_WEB_DOMAIN}.txt"
cat > "$CLOUDPANEL_NOTES" << EOF
CloudPanel reverse-proxy targets for ${CLEAN_WEB_DOMAIN}
=======================================================
Monorepo root: ${APP_DIR}

1) Site for frontend (${CLEAN_WEB_DOMAIN})
   - Type: Reverse Proxy (or Node.js app pointing to custom port)
   - Proxy URL / App Port: http://127.0.0.1:${WEB_PORT}
   - SSL: enable Let's Encrypt in CloudPanel

2) Site for API (${CLEAN_API_DOMAIN})
   - Type: Reverse Proxy
   - Proxy URL / App Port: http://127.0.0.1:${API_PORT}
   - SSL: enable Let's Encrypt in CloudPanel
   - Increase body size if needed for uploads (e.g. 15M)

3) Database
   - Prefer CloudPanel MariaDB/MySQL only if you migrate the app.
   - This monorepo expects PostgreSQL via DATABASE_URL.
   - Create a Postgres DB in CloudPanel (if available) or use a
     managed Postgres URL, then put it in apps/api/.env.production.

4) Process manager
   - Apps run under PM2 as your site user (no sudo):
       pm2 list
       pm2 logs abious-api
       pm2 logs abious-web
EOF
echo -e "${GREEN}✓ Wrote CloudPanel notes: ${CLOUDPANEL_NOTES}${NC}"

# ------------------------------------------------------------------------------
# 6. Build, Seed & Start with npm + PM2
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[Step 6/6] Building & Starting Applications (npm + PM2)...${NC}"

cd "$APP_DIR"
echo "--> Installing dependencies via npm..."
npm install --no-package-lock --workspaces --include-workspace-root

echo "--> Compiling NestJS API..."
npm run build -w api

echo "--> Compiling SolidStart / Nitro Web..."
VITE_API_URL="${BETTER_AUTH_URL}" npm run build -w web

read -rp "$(echo -e "${CYAN}Run database seed now? (y/n) [default: y]: ${NC}")" RUN_SEED
RUN_SEED=${RUN_SEED:-y}
if [[ "$RUN_SEED" =~ ^[Yy]$ ]]; then
    echo "--> Running database seed..."
    npm run db:seed -w api || echo -e "${YELLOW}Seed note: apply SQL migrations first, then re-run seed.${NC}"
fi

echo "--> Starting PM2 processes..."
if pm2 describe abious-api >/dev/null 2>&1 || pm2 describe abious-web >/dev/null 2>&1; then
    pm2 reload "$APP_DIR/deploy/ecosystem.config.cjs" --update-env
else
    pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
fi
pm2 save

sleep 2
pm2 describe abious-api >/dev/null 2>&1 && echo -e "${GREEN}✓ abious-api is managed by PM2 (port ${API_PORT})!${NC}" || echo -e "${RED}✗ abious-api failed (pm2 logs abious-api)${NC}"
pm2 describe abious-web >/dev/null 2>&1 && echo -e "${GREEN}✓ abious-web is managed by PM2 (port ${WEB_PORT})!${NC}" || echo -e "${RED}✗ abious-web failed (pm2 logs abious-web)${NC}"

echo -e "\n${GREEN}${BOLD}============================================================${NC}"
echo -e "${GREEN}${BOLD} Setup Complete (CloudPanel / User Mode)!${NC}"
echo -e "${GREEN}${BOLD}============================================================${NC}"
echo -e "API (local):  http://127.0.0.1:${API_PORT}"
echo -e "Web (local):  http://127.0.0.1:${WEB_PORT}"
echo -e "\nCloudPanel: create two Reverse Proxy sites → those ports."
echo -e "Details: ${CLOUDPANEL_NOTES}"
echo -e "Guide:   ${APP_DIR}/deploy/CLOUDPANEL.md"
echo -e "\nManagement (no sudo):"
echo -e "  pm2 list"
echo -e "  pm2 logs abious-api"
echo -e "  pm2 logs abious-web"
echo -e "  pm2 restart abious-api abious-web"
echo -e "\nFuture updates:"
echo -e "  bash deploy/deploy.sh"
echo -e "============================================================\n"
