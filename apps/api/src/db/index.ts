import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(process.cwd(), '.env.development.local') });
dotenv.config({ path: resolve(process.cwd(), '.env.development') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

export const PG_CONNECTION = 'PG_CONNECTION';
export const DRIZZLE_DB = 'DRIZZLE_DB';

export const connectionString =
  process.env.DATABASE_URL || 'postgresql://db:db@db:5432/db?sslmode=disable';

export const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool);

export type DrizzleDb = typeof db;
