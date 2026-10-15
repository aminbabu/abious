#!/usr/bin/env bash
# ==============================================================================
# First-time production setup for aminbabu.com (CloudPanel reverse proxy)
# - Auto-selects free local ports (locked into .env.production)
# - npm + PM2 (pnpm is for local development only)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
cat << "EOF"
    ___    ____  ________  __  _______
   /   |  / __ )/  _/ __ \/ / / / ___/
  / /| | / __  |/ // / / / / / /\__ \
 / ___ |/ /_/ // // /_/ / /_/ /___/ /
/_/  |_/_____/___/\____/\____//____/
   Production setup — aminbabu.com (npm + PM2)
EOF
echo -e "${NC}"

cd "$APP_DIR"
ensure_runtime
print_runtime

# ------------------------------------------------------------------------------
# 1) Auto free ports (no manual guessing)
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[1/5] Selecting free ports (8000 series)...${NC}"
echo "Tip: bash deploy/check-ports.sh"

read -r API_PORT WEB_PORT <<<"$(allocate_free_port_pair "$DEFAULT_PORT_SERIES_START")"

echo -e "${GREEN}✓ API port: ${API_PORT}${NC}"
echo -e "${GREEN}✓ WEB port: ${WEB_PORT}${NC}"
echo -e "${YELLOW}These ports will be locked in .env.production.${NC}"
echo -e "${YELLOW}Point CloudPanel reverse proxies at them and do not change later.${NC}"

read -rp "$(echo -e "${CYAN}Accept these ports? (Y/n): ${NC}")" ACCEPT_PORTS
ACCEPT_PORTS=${ACCEPT_PORTS:-Y}
if [[ ! "$ACCEPT_PORTS" =~ ^[Yy]$ ]]; then
  read -rp "$(echo -e "${CYAN}Start search from port [${DEFAULT_PORT_SERIES_START}]: ${NC}")" CUSTOM_START
  CUSTOM_START=${CUSTOM_START:-$DEFAULT_PORT_SERIES_START}
  read -r API_PORT WEB_PORT <<<"$(allocate_free_port_pair "$CUSTOM_START")"
  echo -e "${GREEN}✓ Using API=${API_PORT} WEB=${WEB_PORT}${NC}"
fi

# ------------------------------------------------------------------------------
# 2) Domains (defaults for production)
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[2/5] Domains...${NC}"
read -rp "$(echo -e "${CYAN}Frontend domain [${DEFAULT_WEB_DOMAIN}]: ${NC}")" RAW_DOMAIN_WEB
RAW_DOMAIN_WEB=${RAW_DOMAIN_WEB:-$DEFAULT_WEB_DOMAIN}
CLEAN_WEB_DOMAIN=$(echo "$RAW_DOMAIN_WEB" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
CLIENT_URL="https://${CLEAN_WEB_DOMAIN}"

read -rp "$(echo -e "${CYAN}API domain [${DEFAULT_API_DOMAIN}]: ${NC}")" RAW_DOMAIN_API
RAW_DOMAIN_API=${RAW_DOMAIN_API:-$DEFAULT_API_DOMAIN}
CLEAN_API_DOMAIN=$(echo "$RAW_DOMAIN_API" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
BETTER_AUTH_URL="https://${CLEAN_API_DOMAIN}"

echo -e "${GREEN}✓ CLIENT_URL=${CLIENT_URL}${NC}"
echo -e "${GREEN}✓ BETTER_AUTH_URL=${BETTER_AUTH_URL}${NC}"

# ------------------------------------------------------------------------------
# 3) Database + secrets
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[3/5] Database & secrets...${NC}"
read -rp "$(echo -e "${CYAN}PostgreSQL DATABASE_URL: ${NC}")" DATABASE_URL
while [ -z "$DATABASE_URL" ]; do
  echo -e "${RED}DATABASE_URL is required.${NC}"
  read -rp "$(echo -e "${CYAN}PostgreSQL DATABASE_URL: ${NC}")" DATABASE_URL
done

if command -v psql >/dev/null 2>&1; then
  echo "--> Testing DATABASE_URL..."
  psql "$DATABASE_URL" -c 'SELECT current_database(), current_user;' >/dev/null
  echo -e "${GREEN}✓ Database connection OK${NC}"
else
  echo -e "${YELLOW}psql not found — skipping live DB test (install postgresql-client if needed).${NC}"
fi

DEFAULT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
read -rp "$(echo -e "${CYAN}Better Auth Secret [auto-generate]: ${NC}")" BETTER_AUTH_SECRET
BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-$DEFAULT_SECRET}

echo -e "\n${YELLOW}OAuth (optional — Enter to skip)${NC}"
read -rp "$(echo -e "${CYAN}Google Client ID: ${NC}")" GOOGLE_CLIENT_ID
read -rp "$(echo -e "${CYAN}Google Client Secret: ${NC}")" GOOGLE_CLIENT_SECRET
read -rp "$(echo -e "${CYAN}GitHub Client ID: ${NC}")" GITHUB_CLIENT_ID
read -rp "$(echo -e "${CYAN}GitHub Client Secret: ${NC}")" GITHUB_CLIENT_SECRET

echo -e "\n${YELLOW}SMTP (contact / password reset)${NC}"
read -rp "$(echo -e "${CYAN}SMTP Host [smtp.gmail.com]: ${NC}")" SMTP_HOST
SMTP_HOST=${SMTP_HOST:-smtp.gmail.com}
read -rp "$(echo -e "${CYAN}SMTP Port [465]: ${NC}")" SMTP_PORT
SMTP_PORT=${SMTP_PORT:-465}
read -rp "$(echo -e "${CYAN}SMTP Secure true/false [true]: ${NC}")" SMTP_SECURE
SMTP_SECURE=${SMTP_SECURE:-true}
read -rp "$(echo -e "${CYAN}SMTP User: ${NC}")" SMTP_USER
read -rsp "$(echo -e "${CYAN}SMTP Pass: ${NC}")" SMTP_PASS
echo ""
read -rp "$(echo -e "${CYAN}SMTP From [\"Amin Babu\" <${SMTP_USER:-noreply@${CLEAN_WEB_DOMAIN}}>]: ${NC}")" SMTP_FROM
SMTP_FROM=${SMTP_FROM:-"\"Amin Babu\" <${SMTP_USER:-noreply@${CLEAN_WEB_DOMAIN}}>"}
read -rp "$(echo -e "${CYAN}Contact receiver [${SMTP_USER:-hello@${CLEAN_WEB_DOMAIN}}]: ${NC}")" CONTACT_RECEIVER_EMAIL
CONTACT_RECEIVER_EMAIL=${CONTACT_RECEIVER_EMAIL:-${SMTP_USER:-hello@${CLEAN_WEB_DOMAIN}}}

# ------------------------------------------------------------------------------
# 4) Write env + CloudPanel notes
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[4/5] Writing env files...${NC}"

cat > "$APP_DIR/apps/api/.env.production" << EOF
HOST=127.0.0.1
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

cat > "$APP_DIR/apps/web/.env.production" << EOF
HOST=127.0.0.1
PORT=${WEB_PORT}
NODE_ENV=production
VITE_API_URL=${BETTER_AUTH_URL}
INTERNAL_API_URL=http://127.0.0.1:${API_PORT}
EOF

mkdir -p "$APP_DIR/apps/api/uploads"

NOTES="$APP_DIR/deploy/cloudpanel-aminbabu.com.txt"
cat > "$NOTES" << EOF
CloudPanel reverse proxy — aminbabu.com
=======================================
Monorepo path: ${APP_DIR}
Clone once. Do NOT clone into both site document roots.

1) Site: aminbabu.com
   Type: Reverse Proxy
   Target: http://127.0.0.1:${WEB_PORT}
   SSL: Let's Encrypt

2) Site: api.aminbabu.com
   Type: Reverse Proxy
   Target: http://127.0.0.1:${API_PORT}
   SSL: Let's Encrypt
   Raise upload body size if needed (15M)

Ports are locked in:
  apps/api/.env.production  PORT=${API_PORT}
  apps/web/.env.production  PORT=${WEB_PORT}

After first setup, CI/redeploy must keep these ports.
EOF

echo -e "${GREEN}✓ Wrote apps/api/.env.production${NC}"
echo -e "${GREEN}✓ Wrote apps/web/.env.production${NC}"
echo -e "${GREEN}✓ Wrote ${NOTES}${NC}"

# ------------------------------------------------------------------------------
# 5) Migrate, build, start
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[5/5] Migrate, build, start...${NC}"

read -rp "$(echo -e "${CYAN}Apply SQL migrations now? (Y/n): ${NC}")" DO_MIGRATE
DO_MIGRATE=${DO_MIGRATE:-Y}
if [[ "$DO_MIGRATE" =~ ^[Yy]$ ]]; then
  bash "$APP_DIR/deploy/apply-migrations.sh" || echo -e "${YELLOW}Migration failed — fix DB then re-run apply-migrations.sh${NC}"
fi

npm_install_apps
export VITE_API_URL="${BETTER_AUTH_URL}"
npm_build_apps

read -rp "$(echo -e "${CYAN}Run DB seed now? (Y/n): ${NC}")" DO_SEED
DO_SEED=${DO_SEED:-Y}
if [[ "$DO_SEED" =~ ^[Yy]$ ]]; then
  (cd "$APP_DIR/apps/api" && npm run db:seed) || echo -e "${YELLOW}Seed failed — ensure migrations succeeded first.${NC}"
fi

pm2 delete abious-api >/dev/null 2>&1 || true
pm2 delete abious-web >/dev/null 2>&1 || true
pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
pm2 save

sleep 2
set +e
health_check "abious-api" "http://127.0.0.1:${API_PORT}/" 20
health_check "abious-web" "http://127.0.0.1:${WEB_PORT}/" 20
set -e

echo -e "\n${GREEN}${BOLD}============================================================${NC}"
echo -e "${GREEN}${BOLD} Setup complete${NC}"
echo -e "${GREEN}${BOLD}============================================================${NC}"
echo -e "API local:  http://127.0.0.1:${API_PORT}"
echo -e "WEB local:  http://127.0.0.1:${WEB_PORT}"
echo -e ""
echo -e "CloudPanel reverse proxy:"
echo -e "  aminbabu.com     -> http://127.0.0.1:${WEB_PORT}"
echo -e "  api.aminbabu.com -> http://127.0.0.1:${API_PORT}"
echo -e ""
echo -e "Notes: ${NOTES}"
echo -e "Updates: DEPLOY_BRANCH=main bash deploy/deploy.sh"
echo -e "Ports:   bash deploy/check-ports.sh"
echo -e "============================================================\n"
