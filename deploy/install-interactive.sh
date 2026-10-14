#!/usr/bin/env bash
# ==============================================================================
# Non-Root / User-Level Interactive Setup Wizard for Abious
# Works entirely without sudo / root permissions:
# - Uses `systemd --user` units stored in ~/.config/systemd/user/
# - Checks local ports, Node.js & pnpm in user PATH
# - Generates production envs, builds, seeds, and launches services
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
   Contabo VPS User-Mode Setup (No sudo required)
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

if ! command -v pnpm >/dev/null 2>&1; then
    echo -e "${YELLOW}pnpm not found in PATH. Checking corepack or npm...${NC}"
    if command -v corepack >/dev/null 2>&1; then
        corepack enable >/dev/null 2>&1 || true
        corepack prepare pnpm@latest --activate >/dev/null 2>&1 || true
    fi
    if ! command -v pnpm >/dev/null 2>&1; then
        echo -e "${YELLOW}--> Installing pnpm locally for user...${NC}"
        npm install -g pnpm >/dev/null 2>&1 || curl -fsSL https://get.pnpm.io/install.sh | sh -
        export PATH="$USER_HOME/.local/share/pnpm:$PATH"
    fi
fi

if ! command -v pnpm >/dev/null 2>&1; then
    echo -e "${RED}[ERROR] Could not find or install pnpm. Please install pnpm in your user home directory.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ pnpm found: $(pnpm -v)${NC}"

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
# 5. Write Env Files & Systemd User Units
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[Step 5/6] Generating Environment & User-Mode Systemd Units...${NC}"

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

# 3. Systemd User directory (~/.config/systemd/user)
USER_SYSTEMD_DIR="$USER_HOME/.config/systemd/user"
mkdir -p "$USER_SYSTEMD_DIR"

sed -e "s|{{APP_DIR}}|${APP_DIR}|g" \
    -e "s|{{NODE_BIN}}|${NODE_BIN}|g" \
    "$APP_DIR/deploy/systemd/abious-api.service" > "$USER_SYSTEMD_DIR/abious-api.service"

sed -e "s|{{APP_DIR}}|${APP_DIR}|g" \
    -e "s|{{NODE_BIN}}|${NODE_BIN}|g" \
    "$APP_DIR/deploy/systemd/abious-web.service" > "$USER_SYSTEMD_DIR/abious-web.service"

echo -e "${GREEN}✓ Installed $USER_SYSTEMD_DIR/abious-api.service${NC}"
echo -e "${GREEN}✓ Installed $USER_SYSTEMD_DIR/abious-web.service${NC}"

# Enable linger so user services stay running after logout
if command -v loginctl >/dev/null 2>&1; then
    echo "--> Enabling user linger via loginctl (keeps service running after SSH disconnect)..."
    loginctl enable-linger "$CURRENT_USER" 2>/dev/null || echo -e "${YELLOW}Notice: loginctl enable-linger can be enabled by your system administrator if processes stop on logout.${NC}"
fi

# 4. Generate user nginx snippet to provide to server administrator
NGINX_SNIPPET="$APP_DIR/deploy/nginx/nginx-${CLEAN_WEB_DOMAIN}.conf"
cat > "$NGINX_SNIPPET" << EOF
# Nginx snippet for ${CLEAN_WEB_DOMAIN} (Proxying to local ports ${WEB_PORT} and ${API_PORT})
server {
    listen 80;
    server_name ${CLEAN_API_DOMAIN};
    client_max_body_size 15M;

    location /uploads/ {
        alias ${APP_DIR}/apps/api/uploads/;
        expires 30d;
        try_files \$uri =404;
    }

    location / {
        proxy_pass http://127.0.0.1:${API_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

server {
    listen 80;
    server_name ${CLEAN_WEB_DOMAIN} www.${CLEAN_WEB_DOMAIN};
    client_max_body_size 10M;

    location /_build/ {
        alias ${APP_DIR}/apps/web/.output/public/_build/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:${WEB_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
echo -e "${GREEN}✓ Generated Nginx reverse proxy snippet at ${NGINX_SNIPPET}${NC}"

# ------------------------------------------------------------------------------
# 6. Build, Seed & Start with systemd --user
# ------------------------------------------------------------------------------
echo -e "\n${BOLD}${BLUE}[Step 6/6] Building & Starting Applications...${NC}"

cd "$APP_DIR"
echo "--> Installing dependencies via pnpm..."
pnpm install --frozen-lockfile

echo "--> Compiling NestJS API..."
pnpm --filter api run build

echo "--> Compiling SolidStart / Nitro Web..."
VITE_API_URL="${BETTER_AUTH_URL}" pnpm --filter web run build

read -rp "$(echo -e "${CYAN}Run database seed now? (y/n) [default: y]: ${NC}")" RUN_SEED
RUN_SEED=${RUN_SEED:-y}
if [[ "$RUN_SEED" =~ ^[Yy]$ ]]; then
    echo "--> Running database seed..."
    pnpm --filter api run db:seed || echo -e "${YELLOW}Seed note: ensure database is reachable.${NC}"
fi

# Reload user daemon and start services
echo "--> Reloading systemd --user..."
systemctl --user daemon-reload

echo "--> Starting abious-api.service..."
systemctl --user enable abious-api.service
systemctl --user restart abious-api.service

echo "--> Starting abious-web.service..."
systemctl --user enable abious-web.service
systemctl --user restart abious-web.service

sleep 2
systemctl --user is-active --quiet abious-api && echo -e "${GREEN}✓ abious-api is ACTIVE (running on :${API_PORT})!${NC}" || echo -e "${RED}✗ abious-api failed to start (check: journalctl --user -u abious-api)${NC}"
systemctl --user is-active --quiet abious-web && echo -e "${GREEN}✓ abious-web is ACTIVE (running on :${WEB_PORT})!${NC}" || echo -e "${RED}✗ abious-web failed to start (check: journalctl --user -u abious-web)${NC}"

echo -e "\n${GREEN}${BOLD}============================================================${NC}"
echo -e "${GREEN}${BOLD} Setup Complete (User Mode)!${NC}"
echo -e "${GREEN}${BOLD}============================================================${NC}"
echo -e "API running at:  http://127.0.0.1:${API_PORT}"
echo -e "Web running at:  http://127.0.0.1:${WEB_PORT}"
echo -e "\nManagement commands (no sudo needed):"
echo -e "  systemctl --user status abious-api"
echo -e "  systemctl --user status abious-web"
echo -e "  journalctl --user -u abious-api -f"
echo -e "  journalctl --user -u abious-web -f"
echo -e "  systemctl --user restart abious-api"
echo -e "  systemctl --user restart abious-web"
echo -e "\nTo pull updates in the future:"
echo -e "  bash deploy/deploy.sh"
echo -e "============================================================\n"
