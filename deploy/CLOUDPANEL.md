# Production deploy — aminbabu.com (CloudPanel)

One monorepo clone. Two CloudPanel **Reverse Proxy** sites. PostgreSQL. npm + PM2 on the server.

| Public URL | PM2 app | Local target |
|------------|---------|--------------|
| `https://aminbabu.com` | `abious-web` | `http://127.0.0.1:<WEB_PORT>` |
| `https://api.aminbabu.com` | `abious-api` | `http://127.0.0.1:<API_PORT>` |

Production ports are configured in `.env.production` during setup.

---

## First-time (on server)

```bash
git clone git@github.com:aminbabu/abious.git ~/abious
cd ~/abious
git checkout main

# See free ports (optional)
bash deploy/check-ports.sh

# Interactive setup: choose or accept suggested free ports
bash deploy/install-interactive.sh
```

Paste your Postgres URL when asked, e.g.:

```text
postgresql://abious:PASSWORD@127.0.0.1:5432/abious_prod
```

At the end the wizard prints the exact reverse-proxy targets, e.g.:

```text
aminbabu.com     -> http://127.0.0.1:<WEB_PORT>
api.aminbabu.com -> http://127.0.0.1:<API_PORT>
```

To update or reallocate ports: `bash deploy/reallocate-ports.sh [api_port] [web_port]`

---

## CloudPanel

1. Site **aminbabu.com** → Reverse Proxy → web target from the wizard  
2. Site **api.aminbabu.com** → Reverse Proxy → API target from the wizard  
3. Enable Let’s Encrypt on both  

Do **not** clone the repo into both site document roots. One clone is enough.

---

## Updates / CI

```bash
cd ~/abious
DEPLOY_BRANCH=main bash deploy/deploy.sh
```

Or push to `main` (GitHub Action).

Secrets: `SERVER_HOST`, `SERVER_USER`, `SERVER_PORT`, `SERVER_SSH_KEY`, `SERVER_APP_DIR`.

Optional one-off:

```bash
RUN_MIGRATE=true bash deploy/deploy.sh
RUN_SEED=true bash deploy/deploy.sh
```

---

## Helpers

| Script | Purpose |
|--------|---------|
| `deploy/check-ports.sh` | List free/in-use ports + configured ports |
| `deploy/apply-migrations.sh` | Run package SQL migrations |
| `deploy/install-interactive.sh` | First-time setup |
| `deploy/deploy.sh` | Production redeploy |
| `deploy/reallocate-ports.sh` | Reallocate or change production ports |

```bash
pm2 list
pm2 logs abious-api
pm2 logs abious-web
```

## Unstyled page / `/_build` 500

If HTML loads but CSS/JS return **500**:

```bash
cd ~/abious
ls apps/web/.output/public/_build/assets/ | head
curl -sI "http://127.0.0.1:<WEB_PORT>/_build/assets/$(ls apps/web/.output/public/_build/assets/*.css | head -1 | xargs basename)"

# Rebuild + clean restart (safe)
git pull origin main
SKIP_GIT_SYNC=1 bash deploy/deploy.sh
```

Confirm CloudPanel `aminbabu.com` proxies to the web port, not the API port.
