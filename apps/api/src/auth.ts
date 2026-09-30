import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

// Load env files in precedence order: .env.development.local > .env.development > .env
dotenv.config({ path: resolve(process.cwd(), '.env.development.local') });
dotenv.config({ path: resolve(process.cwd(), '.env.development') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const connectionString =
  process.env.DATABASE_URL || 'postgresql://db:db@db:5432/db?sslmode=disable';

const pool = new Pool({
  connectionString,
});

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'dummy_secret_key_change_in_production_min_32_chars_1234567890',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
  ],
  database: pool,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || 'dummy-github-client-id',
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret',
    },
  },
});
