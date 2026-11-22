#!/usr/bin/env bash
# ==============================================================================
# First-time production setup for aminbabu.com (CloudPanel reverse proxy)
# - Auto-selects free local ports (locked into .env.production)
# - pnpm or npm + user systemd units
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
   Production setup — aminbabu.com (pnpm/npm + systemd)
EOF
echo -e "${NC}"

cd "$APP_DIR"
ensure_runtime
print_runtime

# ------------------------------------------------------------------------------
# 1) Ports (interactive prompt or defaults)
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[1/5] Production ports...${NC}"
echo "Tip: bash deploy/check-ports.sh"

read -r SUGGESTED_API_PORT SUGGESTED_WEB_PORT <<<"$(allocate_production_port_pair)"

validate_port() {
  local port="$1"
  if [[ "$port" =~ ^[0-9]+$ ]] && [ "$port" -ge 1 ] && [ "$port" -le 65535 ]; then
    return 0
  fi
  return 1
}

# Prompt API port
while true; do
  read -rp "$(echo -e "${CYAN}API port [${SUGGESTED_API_PORT}]: ${NC}")" INPUT_API_PORT
  API_PORT="${INPUT_API_PORT:-$SUGGESTED_API_PORT}"
  if validate_port "$API_PORT"; then
    break
  fi
  echo -e "${RED}Invalid port number. Must be between 1 and 65535.${NC}"
done

# Prompt WEB port
while true; do
  read -rp "$(echo -e "${CYAN}WEB port [${SUGGESTED_WEB_PORT}]: ${NC}")" INPUT_WEB_PORT
  WEB_PORT="${INPUT_WEB_PORT:-$SUGGESTED_WEB_PORT}"
  if ! validate_port "$WEB_PORT"; then
    echo -e "${RED}Invalid port number. Must be between 1 and 65535.${NC}"
    continue
  fi
  if [ "$WEB_PORT" -eq "$API_PORT" ]; then
    echo -e "${RED}WEB port cannot be the same as API port (${API_PORT}).${NC}"
    continue
  fi
  break
done

echo -e "${GREEN}✓ API port: ${API_PORT}${NC}"
echo -e "${GREEN}✓ WEB port: ${WEB_PORT}${NC}"
echo -e "${YELLOW}Configured for CloudPanel: api.aminbabu.com -> :${API_PORT}, aminbabu.com -> :${WEB_PORT}${NC}"

if is_port_in_use "$API_PORT" || is_port_in_use "$WEB_PORT"; then
  echo -e "${YELLOW}Warning: ${API_PORT} and/or ${WEB_PORT} currently in use.${NC}"
  echo -e "${YELLOW}Stop conflicting services first, or run: bash deploy/reallocate-ports.sh <api-port> <web-port>${NC}"
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
read -rp "$(echo -e "${CYAN}SQLite DATABASE_URL [file:./data/abious.db]: ${NC}")" DATABASE_URL
DATABASE_URL=${DATABASE_URL:-file:./data/abious.db}
echo -e "${GREEN}✓ DATABASE_URL=${DATABASE_URL}${NC}"

DEFAULT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
read -rp "$(echo -e "${CYAN}Better Auth Secret [auto-generate]: ${NC}")" BETTER_AUTH_SECRET
BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET:-$DEFAULT_SECRET}

echo -e "\n${YELLOW}Admin account (seeded into database)${NC}"
read -rp "$(echo -e "${CYAN}Admin Name [Amin Babu]: ${NC}")" ADMIN_NAME
ADMIN_NAME=${ADMIN_NAME:-Amin Babu}
read -rp "$(echo -e "${CYAN}Admin Email [amin.babu.bd@gmail.com]: ${NC}")" ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-amin.babu.bd@gmail.com}
DEFAULT_ADMIN_PASS=$(node -e "console.log(require('crypto').randomBytes(16).toString('base64url'))")
read -rsp "$(echo -e "${CYAN}Admin Password [auto-generate]: ${NC}")" ADMIN_PASSWORD
echo ""
ADMIN_PASSWORD_GENERATED=0
if [ -z "$ADMIN_PASSWORD" ]; then
  ADMIN_PASSWORD="$DEFAULT_ADMIN_PASS"
  ADMIN_PASSWORD_GENERATED=1
fi

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
DEFAULT_SMTP_FROM_EMAIL="noreply@${CLEAN_WEB_DOMAIN}"
if [[ "$SMTP_USER" == *@* ]]; then
  DEFAULT_SMTP_FROM_EMAIL="$SMTP_USER"
fi
DEFAULT_SMTP_FROM="\"${ADMIN_NAME}\" <${DEFAULT_SMTP_FROM_EMAIL}>"
read -rp "$(echo -e "${CYAN}SMTP From [${DEFAULT_SMTP_FROM}]: ${NC}")" SMTP_FROM
SMTP_FROM=${SMTP_FROM:-$DEFAULT_SMTP_FROM}
DEFAULT_CONTACT_EMAIL="${ADMIN_EMAIL:-hello@${CLEAN_WEB_DOMAIN}}"
read -rp "$(echo -e "${CYAN}Contact receiver [${DEFAULT_CONTACT_EMAIL}]: ${NC}")" CONTACT_RECEIVER_EMAIL
CONTACT_RECEIVER_EMAIL=${CONTACT_RECEIVER_EMAIL:-$DEFAULT_CONTACT_EMAIL}

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
# 5) Package manager, migrate, build, start
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[5/5] Package manager, migrate, build, start...${NC}"

DEFAULT_PKG="pnpm"
if ! command -v pnpm >/dev/null 2>&1 && [ ! -f "$APP_DIR/pnpm-lock.yaml" ]; then
  DEFAULT_PKG="npm"
fi
read -rp "$(echo -e "${CYAN}Package manager (pnpm/npm) [${DEFAULT_PKG}]: ${NC}")" PKG_MANAGER
PKG_MANAGER=${PKG_MANAGER:-$DEFAULT_PKG}
while [ "$PKG_MANAGER" != "pnpm" ] && [ "$PKG_MANAGER" != "npm" ]; do
  echo -e "${RED}Please enter 'pnpm' or 'npm'.${NC}"
  read -rp "$(echo -e "${CYAN}Package manager (pnpm/npm) [${DEFAULT_PKG}]: ${NC}")" PKG_MANAGER
  PKG_MANAGER=${PKG_MANAGER:-$DEFAULT_PKG}
done
export PKG_MANAGER
printf '%s\n' "$PKG_MANAGER" > "$APP_DIR/deploy/.pkg-manager"
ensure_runtime

read -rp "$(echo -e "${CYAN}Apply SQL migrations now? (Y/n): ${NC}")" DO_MIGRATE
DO_MIGRATE=${DO_MIGRATE:-Y}
if [[ "$DO_MIGRATE" =~ ^[Yy]$ ]]; then
  bash "$APP_DIR/deploy/apply-migrations.sh" || echo -e "${YELLOW}Migration failed — fix DB then re-run apply-migrations.sh${NC}"
fi

pkg_install_apps
export VITE_API_URL="${BETTER_AUTH_URL}"
pkg_build_apps

read -rp "$(echo -e "${CYAN}Run DB seed now (includes admin user)? (Y/n): ${NC}")" DO_SEED
DO_SEED=${DO_SEED:-Y}
if [[ "$DO_SEED" =~ ^[Yy]$ ]]; then
  ADMIN_NAME="$ADMIN_NAME" ADMIN_EMAIL="$ADMIN_EMAIL" ADMIN_PASSWORD="$ADMIN_PASSWORD" \
    pkg_run_api db:seed || echo -e "${YELLOW}Seed failed — ensure migrations succeeded first.${NC}"
fi

start_systemd_services

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
if [[ "$DO_SEED" =~ ^[Yy]$ ]]; then
  echo -e ""
  echo -e "Admin login (${CLIENT_URL}/auth/login):"
  echo -e "  Email:    ${ADMIN_EMAIL}"
  if [ "${ADMIN_PASSWORD_GENERATED:-0}" = "1" ]; then
    echo -e "  Password: ${ADMIN_PASSWORD}  (save this now!)"
  fi
fi
echo -e "Updates: DEPLOY_BRANCH=main bash deploy/deploy.sh"
echo -e "Ports:   bash deploy/check-ports.sh"
echo -e "============================================================\n"
