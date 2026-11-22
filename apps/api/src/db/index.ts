import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(process.cwd(), '.env.production.local') });
dotenv.config({ path: resolve(process.cwd(), '.env.production') });
dotenv.config({ path: resolve(process.cwd(), '.env.development.local') });
dotenv.config({ path: resolve(process.cwd(), '.env.development') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

export const SQLITE_CONNECTION = 'SQLITE_CONNECTION';
export const DRIZZLE_DB = 'DRIZZLE_DB';

function resolveSqlitePath(rawUrl?: string): string {
  const value = (rawUrl || 'file:./data/abious.db').trim();
  if (value === ':memory:' || value === 'file::memory:') {
    return ':memory:';
  }
  const filePath = value.startsWith('file:') ? value.slice('file:'.length) : value;
  const resolvedPath = resolve(process.cwd(), filePath);
  mkdirSync(dirname(resolvedPath), { recursive: true });
  return resolvedPath;
}

export const connectionString = process.env.DATABASE_URL || 'file:./data/abious.db';
export const sqlitePath = resolveSqlitePath(connectionString);

export const sqlite = new Database(sqlitePath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite);

export type DrizzleDb = typeof db;
