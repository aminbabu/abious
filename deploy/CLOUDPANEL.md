# Production deploy — aminbabu.com (CloudPanel)

One monorepo clone. Two CloudPanel **Reverse Proxy** sites. PostgreSQL. npm + PM2 on the server.

| Public URL | PM2 app | Local target |
|------------|---------|--------------|
| `https://aminbabu.com` | `abious-web` | `http://127.0.0.1:<WEB_PORT>` |
| `https://api.aminbabu.com` | `abious-api` | `http://127.0.0.1:<API_PORT>` |

Ports are **auto-detected once** during first setup and locked in `.env.production`. Redeploys keep the same ports so CloudPanel proxies do not break.

---

## First-time (on server)

```bash
git clone git@github.com:aminbabu/abious.git ~/abious
cd ~/abious
git checkout main

# See free ports (optional)
bash deploy/check-ports.sh

# Wizard defaults: aminbabu.com + api.aminbabu.com, auto free ports
bash deploy/install-interactive.sh
```

Paste your Postgres URL when asked, e.g.:

```text
postgresql://abious:PASSWORD@127.0.0.1:5432/abious_prod
```

At the end the wizard prints the exact reverse-proxy targets, e.g.:

```text
aminbabu.com     -> http://127.0.0.1:4000
api.aminbabu.com -> http://127.0.0.1:3000
```

(Exact numbers depend on what was free on your server.)

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

```bash
pm2 list
pm2 logs abious-api
pm2 logs abious-web
```
