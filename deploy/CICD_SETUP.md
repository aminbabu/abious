# GitHub Actions → CloudPanel site user

Workflow: `.github/workflows/deploy.yml`  
Triggers: push to `main` / `dev`, or `workflow_dispatch`.

Remote steps: SSH → `git pull` → `bash deploy/deploy.sh` (**npm** install/build + **PM2** reload).

Secrets stay on the server (`apps/*/.env.production`). Nothing DB-related is stored in GitHub.

---

## Repository secrets

| Secret | Description |
|--------|-------------|
| `SERVER_HOST` | Server hostname / IP |
| `SERVER_USER` | CloudPanel site SSH user |
| `SERVER_PORT` | SSH port |
| `SERVER_SSH_KEY` | Deploy private key |
| `SERVER_APP_DIR_MONOREPO` | Absolute path to monorepo clone (e.g. `/home/siteuser/abious`) |

Astro keeps using `SERVER_APP_DIR` so the two apps never share one directory secret.

---

## Server prerequisites

1. Monorepo cloned and first-time wizard completed (`install-interactive.sh`)
2. Postgres reachable + migrations applied
3. CloudPanel reverse-proxy sites → API/web ports
4. `pm2` available for the site user (`npm install -g pm2`)

---

## Test

```bash
git commit --allow-empty -m "ci: trigger monorepo deploy"
git push origin main
```

Watch **Actions**, then on the server: `pm2 list`.
