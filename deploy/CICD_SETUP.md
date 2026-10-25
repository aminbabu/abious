# CI/CD — aminbabu.com production

Workflow: `.github/workflows/deploy.yml`  
Trigger: push to **`main`** or manual `workflow_dispatch`.

Remote: SSH → `DEPLOY_BRANCH=main bash deploy/deploy.sh`  
(npm install/build + PM2 reload + local health checks)

---

## Secrets

| Secret | Example |
|--------|---------|
| `SERVER_HOST` | server IP / hostname |
| `SERVER_USER` | CloudPanel site SSH user |
| `SERVER_PORT` | `22` |
| `SERVER_SSH_KEY` | private deploy key |
| `SERVER_APP_DIR` | `/home/SITEUSER/abious` |

Env files and `DATABASE_URL` stay on the server only.

---

## First time before enabling CI

1. `bash deploy/install-interactive.sh` on the server  
2. CloudPanel reverse proxies → printed ports  
3. Set GitHub secrets  
4. Push to `main`
