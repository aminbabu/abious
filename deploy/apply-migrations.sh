#!/usr/bin/env bash
# Apply package SQL migrations to SQLite.
# Usage:
#   export DATABASE_URL='file:./data/abious.db'
#   bash deploy/apply-migrations.sh
# Or reads DATABASE_URL from apps/api/.env.production (defaults to file:./data/abious.db)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "$SCRIPT_DIR/lib/common.sh"

if [ -z "${DATABASE_URL:-}" ]; then
  DATABASE_URL="$(read_env_value "$APP_DIR/apps/api/.env.production" DATABASE_URL || true)"
fi
DATABASE_URL="${DATABASE_URL:-file:./data/abious.db}"

shopt -s nullglob
files=("$APP_DIR"/apps/api/src/packages/*/migrations/*.sql)
if [ "${#files[@]}" -eq 0 ]; then
  echo "ERROR: No migration SQL files found."
  exit 1
fi

echo "--> Applying SQLite migrations to $DATABASE_URL..."
NODE_PATH="$APP_DIR/apps/api/node_modules" DATABASE_URL="$DATABASE_URL" node -e '
  const fs = require("node:fs");
  const path = require("node:path");
  const Database = require("better-sqlite3");

  const rawUrl = process.env.DATABASE_URL || "file:./data/abious.db";
  const filePath = rawUrl.startsWith("file:") ? rawUrl.slice("file:".length) : rawUrl;
  const resolved = path.resolve(process.argv[1], filePath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });

  const db = new Database(resolved);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  for (const file of process.argv.slice(2)) {
    console.log("--> Applying " + file);
    db.exec(fs.readFileSync(file, "utf8"));
  }
  db.close();
' "$APP_DIR/apps/api" "${files[@]}"

echo "--> Migrations applied successfully."
