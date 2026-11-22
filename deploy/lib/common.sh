#!/usr/bin/env bash
# Shared helpers for Abious production deploy scripts.

set -euo pipefail

DEPLOY_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$DEPLOY_LIB_DIR/../.." && pwd)"

# Load Node for non-interactive SSH (CloudPanel / nvm).
# Interactive shells already source ~/.bashrc; CI SSH does not.
load_node_env() {
  # Login/profile snippets (ignore errors; files may be interactive-only)
  set +u
  if [ -f "$HOME/.profile" ]; then
    # shellcheck disable=SC1090
    . "$HOME/.profile" >/dev/null 2>&1 || true
  fi
  if [ -f "$HOME/.bashrc" ]; then
    # shellcheck disable=SC1090
    . "$HOME/.bashrc" >/dev/null 2>&1 || true
  fi
  if [ -f "$HOME/.bash_profile" ]; then
    # shellcheck disable=SC1090
    . "$HOME/.bash_profile" >/dev/null 2>&1 || true
  fi

  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh" >/dev/null 2>&1 || true
    nvm use default >/dev/null 2>&1 || nvm use node >/dev/null 2>&1 || true
  fi
  set -u

  # Prefer newest nvm version bin if still missing
  if ! command -v node >/dev/null 2>&1 && [ -d "$HOME/.nvm/versions/node" ]; then
    local latest
    latest="$(ls -1 "$HOME/.nvm/versions/node" 2>/dev/null | sort -V | tail -n 1 || true)"
    if [ -n "$latest" ] && [ -x "$HOME/.nvm/versions/node/$latest/bin/node" ]; then
      export PATH="$HOME/.nvm/versions/node/$latest/bin:$PATH"
    fi
  fi

  # Common CloudPanel / user paths
  export PATH="$HOME/bin:$HOME/.local/bin:$HOME/.npm-global/bin:/usr/local/bin:/usr/bin:$PATH"

  # Last resort: resolve via `which` from a login shell
  if ! command -v node >/dev/null 2>&1; then
    local login_node
    login_node="$(bash -lc 'command -v node' 2>/dev/null || true)"
    if [ -n "$login_node" ] && [ -x "$login_node" ]; then
      export PATH="$(dirname "$login_node"):$PATH"
    fi
  fi
  if ! command -v npm >/dev/null 2>&1; then
    local login_npm
    login_npm="$(bash -lc 'command -v npm' 2>/dev/null || true)"
    if [ -n "$login_npm" ] && [ -x "$login_npm" ]; then
      export PATH="$(dirname "$login_npm"):$PATH"
    fi
  fi
}

load_node_env

DEFAULT_WEB_DOMAIN="aminbabu.com"
DEFAULT_API_DOMAIN="api.aminbabu.com"
# Default fallback port series start
DEFAULT_PORT_SERIES_START=8000

# Dynamically allocate the next available port pair starting from DEFAULT_PORT_SERIES_START
# Optional args override: allocate_production_port_pair [api] [web]
allocate_production_port_pair() {
  local api_port="${1:-}"
  local web_port="${2:-}"
  if [ -z "$api_port" ]; then
    api_port="$(find_next_available_port "$DEFAULT_PORT_SERIES_START")"
  fi
  if [ -z "$web_port" ]; then
    web_port="$(find_next_available_port $((api_port + 1)))"
  fi
  echo "$api_port $web_port"
}

# Legacy helper: first free pair from a start port (used by check-ports scan).
allocate_free_port_pair() {
  local start="${1:-$DEFAULT_PORT_SERIES_START}"
  local api_port web_port
  api_port="$(find_next_available_port "$start")"
  web_port="$(find_next_available_port $((api_port + 1)))"
  echo "$api_port $web_port"
}

is_port_in_use() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -tuln 2>/dev/null | grep -E ":${port}\\s" >/dev/null 2>&1 && return 0
  fi
  if command -v netstat >/dev/null 2>&1; then
    netstat -tuln 2>/dev/null | grep -E ":${port}\\s" >/dev/null 2>&1 && return 0
  fi
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1 && return 0
  fi
  if command -v node >/dev/null 2>&1; then
    if node -e "const net=require('net');const s=net.createServer();s.once('error',()=>process.exit(1));s.listen({port:$port,host:'127.0.0.1'},()=>{s.close();process.exit(0);});" >/dev/null 2>&1; then
      return 1
    fi
    return 0
  fi
  return 1
}

find_next_available_port() {
  local candidate="$1"
  local max_port="${2:-65535}"
  while [ "$candidate" -le "$max_port" ]; do
    if ! is_port_in_use "$candidate"; then
      echo "$candidate"
      return 0
    fi
    candidate=$((candidate + 1))
  done
  echo "ERROR: No free port found starting from $1" >&2
  return 1
}

# True if port is free OR already owned by a named PM2 process.
port_usable_by_pm2_app() {
  local port="$1"
  local pm2_name="$2"

  if ! is_port_in_use "$port"; then
    return 0
  fi

  if ! command -v pm2 >/dev/null 2>&1; then
    return 1
  fi

  if ! pm2 describe "$pm2_name" >/dev/null 2>&1; then
    return 1
  fi

  # Port is in use and our PM2 app exists — treat as OK for redeploy/reload.
  return 0
}

read_env_value() {
  local file="$1"
  local key="$2"
  if [ ! -f "$file" ]; then
    return 1
  fi
  local line
  line="$(grep -E "^${key}=" "$file" | tail -n 1 || true)"
  if [ -z "$line" ]; then
    return 1
  fi
  echo "${line#*=}" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
}

ensure_runtime() {
  load_node_env

  if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "ERROR: node/npm not found in PATH for non-interactive SSH."
    echo "PATH=$PATH"
    echo "Interactive shell has node, but CI SSH did not load it."
    echo "Fix: ensure nvm/CloudPanel node is on PATH in ~/.profile (not only ~/.bashrc),"
    echo "or: bash -lc 'command -v node && node -v'"
    exit 1
  fi

  if ! command -v pm2 >/dev/null 2>&1; then
    echo "--> Installing pm2 for current user..."
    npm install -g pm2
    export PATH="$(npm prefix -g)/bin:$PATH"
    load_node_env
  fi

  if ! command -v pm2 >/dev/null 2>&1; then
    echo "ERROR: pm2 is required. Run: npm install -g pm2"
    exit 1
  fi
}

print_runtime() {
  echo " User: $(whoami)"
  echo " App:  $APP_DIR"
  echo " Node: $(command -v node) ($(node -v 2>/dev/null || true))"
  echo " npm:  $(command -v npm) ($(npm -v 2>/dev/null || true))"
  echo " pm2:  $(command -v pm2) ($(pm2 -v 2>/dev/null || true))"
}

health_check() {
  local name="$1"
  local url="$2"
  local attempts="${3:-20}"
  local i
  for i in $(seq 1 "$attempts"); do
    if curl -fsS --max-time 2 "$url" >/dev/null 2>&1; then
      echo "[OK] $name healthy at $url"
      return 0
    fi
    sleep 1
  done
  echo "[WARN] $name did not respond at $url (check: pm2 logs $name)"
  return 1
}

# Install each app separately.
# Avoids npm workspaces arborist bug: "Cannot read properties of null (reading 'edgesOut')"
npm_install_apps() {
  echo "--> Cleaning previous node_modules / lockfiles..."
  rm -rf "$APP_DIR/node_modules" \
    "$APP_DIR/apps/api/node_modules" \
    "$APP_DIR/apps/web/node_modules"
  rm -f "$APP_DIR/package-lock.json" \
    "$APP_DIR/apps/api/package-lock.json" \
    "$APP_DIR/apps/web/package-lock.json"

  # --legacy-peer-deps avoids npm@10 arborist crash:
  # "Cannot read properties of null (reading 'edgesOut')"
  echo "--> npm install in apps/api..."
  (
    cd "$APP_DIR/apps/api"
    npm install --no-package-lock --no-fund --no-audit --legacy-peer-deps
  )

  echo "--> npm install in apps/web..."
  (
    cd "$APP_DIR/apps/web"
    npm install --no-package-lock --no-fund --no-audit --legacy-peer-deps
  )
}

npm_build_apps() {
  echo "--> Building apps/api (NestJS)..."
  (
    cd "$APP_DIR/apps/api"
    npm run build
  )

  echo "--> Building apps/web (SolidStart / Nitro)..."
  (
    cd "$APP_DIR/apps/web"
    # Bake public API URL into the client bundle at build time
    if [ -f "$APP_DIR/apps/web/.env.production" ]; then
      set -a
      # shellcheck disable=SC1091
      . "$APP_DIR/apps/web/.env.production"
      set +a
    fi
    # Vite rejects NODE_ENV=production inside .env files
    unset NODE_ENV || true
    export VITE_API_URL="${VITE_API_URL:-https://api.aminbabu.com}"
    echo "    VITE_API_URL=${VITE_API_URL}"
    npm run build
  )
}

# Ensure client CSS/JS were emitted (prevents unstyled HTML after deploy)
verify_web_build_assets() {
  local public_dir="$APP_DIR/apps/web/.output/public"
  local build_dir="$public_dir/_build/assets"
  local css_count js_count sample

  if [ ! -d "$build_dir" ]; then
    echo "ERROR: Missing $build_dir — web build did not emit client assets."
    return 1
  fi

  css_count="$(find "$build_dir" -maxdepth 1 -type f -name '*.css' 2>/dev/null | wc -l | tr -d ' ')"
  js_count="$(find "$build_dir" -maxdepth 1 -type f -name '*.js' 2>/dev/null | wc -l | tr -d ' ')"

  if [ "${css_count:-0}" -lt 1 ] || [ "${js_count:-0}" -lt 1 ]; then
    echo "ERROR: Expected CSS/JS under $build_dir (css=$css_count js=$js_count)."
    return 1
  fi

  sample="$(find "$build_dir" -maxdepth 1 -type f -name 'entry-client-*.css' | head -n 1 || true)"
  if [ -z "$sample" ]; then
    sample="$(find "$build_dir" -maxdepth 1 -type f -name '*.css' | head -n 1 || true)"
  fi

  echo "[OK] Web assets present (css=$css_count js=$js_count)"
  echo "    sample: ${sample#$APP_DIR/}"
  # Expose for health checks
  WEB_ASSET_SAMPLE_PATH="/_build/assets/$(basename "$sample")"
}

health_check_asset() {
  local port="$1"
  local asset_path="$2"
  local url="http://127.0.0.1:${port}${asset_path}"
  local code

  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 "$url" || echo 000)"
  if [ "$code" = "200" ]; then
    echo "[OK] Static asset HTTP $code at $url"
    return 0
  fi
  echo "[WARN] Static asset HTTP $code at $url"
  return 1
}
