#!/usr/bin/env bash
# ==============================================================================
# Contabo VPS Setup Script for Abious (Ubuntu / Debian)
# Run as root or with sudo: sudo bash deploy/setup-vps.sh
# ==============================================================================

set -euo pipefail

echo "==========================================="
echo " Starting Contabo VPS Initialization..."
echo "==========================================="

APP_DIR="/var/www/abious"
APP_USER="abious"

# 1. Update system packages
echo "--> Updating APT packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y && apt-get upgrade -y
apt-get install -y curl wget git build-essential ufw nginx certbot python3-certbot-nginx postgresql postgresql-contrib

# 2. Install Node.js 24.x LTS & pnpm
echo "--> Installing Node.js 24..."
if ! command -v node >/dev/null 2>&1 || [[ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 24 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
    apt-get install -y nodejs
fi

echo "--> Installing pnpm..."
npm install -g pnpm@10

echo "Node version: $(node -v)"
echo "pnpm version: $(pnpm -v)"

# 3. Create dedicated application user
if ! id "$APP_USER" &>/dev/null; then
    echo "--> Creating service user '$APP_USER'..."
    useradd -m -s /bin/bash "$APP_USER"
fi

# 4. Create web directory and set ownership
echo "--> Preparing application directories at $APP_DIR..."
mkdir -p "$APP_DIR"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# 5. Configure firewall (UFW)
echo "--> Configuring UFW firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 6. Configure PostgreSQL Service
echo "--> Starting & enabling PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

echo "============================================================"
echo " Basic VPS dependencies successfully installed!"
echo " Next steps:"
echo " 1. Create your PostgreSQL database and user:"
echo "    sudo -u postgres psql"
echo "    CREATE USER abious WITH PASSWORD 'your_strong_db_password';"
echo "    CREATE DATABASE abious_prod OWNER abious;"
echo "    \q"
echo ""
echo " 2. Clone or copy your project repository to $APP_DIR"
echo " 3. Copy .env.production files into apps/api/ and apps/web/"
echo " 4. Run 'sudo bash $APP_DIR/deploy/deploy.sh' to build and run systemd services."
echo "============================================================"
