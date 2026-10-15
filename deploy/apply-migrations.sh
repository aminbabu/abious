#!/usr/bin/env bash
# Apply package SQL migrations to PostgreSQL.
# Usage:
#   export DATABASE_URL='postgresql://...'
#   bash deploy/apply-migrations.sh
# Or reads DATABASE_URL from apps/api/.env.production

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

if [ -z "${DATABASE_URL:-}" ]; then
  DATABASE_URL="$(read_env_value "$APP_DIR/apps/api/.env.production" DATABASE_URL || true)"
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set and not found in apps/api/.env.production"
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "ERROR: psql not found. As root: apt install -y postgresql-client"
  exit 1
fi

echo "--> Testing database connection..."
psql "$DATABASE_URL" -c 'SELECT current_database(), current_user;' >/dev/null

shopt -s nullglob
files=("$APP_DIR"/apps/api/src/packages/*/migrations/*.sql)
if [ "${#files[@]}" -eq 0 ]; then
  echo "ERROR: No migration SQL files found."
  exit 1
fi

for f in "${files[@]}"; do
  echo "--> Applying $f"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
done

echo "--> Migrations applied successfully."
