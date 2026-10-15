/**
 * PM2 process file for CloudPanel / VPS deploys (npm production).
 * Usage (from monorepo root):
 *   pm2 start deploy/ecosystem.config.cjs
 *   pm2 reload deploy/ecosystem.config.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;

  for (const rawLine of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const apiEnv = {
  NODE_ENV: 'production',
  ...loadEnvFile(path.join(ROOT, 'apps/api/.env.production')),
};

const webEnv = {
  NODE_ENV: 'production',
  ...loadEnvFile(path.join(ROOT, 'apps/web/.env.production')),
};

module.exports = {
  apps: [
    {
      name: 'abious-api',
      cwd: path.join(ROOT, 'apps/api'),
      script: 'dist/main.js',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      env: apiEnv,
    },
    {
      name: 'abious-web',
      cwd: path.join(ROOT, 'apps/web'),
      script: '.output/server/index.mjs',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      env: webEnv,
    },
  ],
};
