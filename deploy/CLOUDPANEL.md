# Deploy Abious Monorepo on CloudPanel (no sudo)

NestJS API (`apps/api`) + SolidStart web (`apps/web`) as a **site user without sudo**.

- **Server / CI:** npm + PM2  
- **Local development:** pnpm is fine  
- **`archive/astro`:** code archive / testing only — not deployed by CI

---

## Layout

| Env | Branch | Example path | PM2 apps |
|-----|--------|--------------|----------|
| Production | `main` | `~/abious` | `abious-api`, `abious-web` |
| Staging (optional) | `dev` | `~/abious-dev` | separate ports / names if needed |

---

## 1. Database (PostgreSQL)

CloudPanel often ships MariaDB/MySQL. This API expects **PostgreSQL** via `DATABASE_URL`.

Options without sudo:

1. Create Postgres in CloudPanel if available, **or**
2. Use managed Postgres (Neon, Supabase, etc.), **or**
3. Ask the server admin for a Postgres URL

Example:

```text
postgresql://USER:PASSWORD@127.0.0.1:5432/abious_prod
```

Apply schema SQL once:

```bash
cd ~/abious
export DATABASE_URL='postgresql://…'

for f in apps/api/src/packages/*/migrations/*.sql; do
  echo "Applying $f"
  psql "$DATABASE_URL" -f "$f"
done
```

If `psql` is missing, run the same `.sql` files from any SQL UI that can reach the DB.

---

## 2. First-time install (site user SSH)

```bash
git clone git@github.com:aminbabu/abious.git ~/abious
cd ~/abious
git checkout main

# Node 24+ recommended (CloudPanel Node selector / nvm)
bash deploy/install-interactive.sh
```

The wizard:

- picks free ports for API + web
- writes `apps/api/.env.production` and `apps/web/.env.production`
- runs `npm install` + builds both workspaces
- starts **PM2** apps `abious-api` and `abious-web`
- writes CloudPanel notes under `deploy/cloudpanel-<domain>.txt`

---

## 3. Align CloudPanel vhosts

In CloudPanel UI (no sudo nginx edits):

### A) Frontend site (`yourdomain.com`)

1. **Sites → Add Site** (or reuse the testing vhost)
2. Domain: `yourdomain.com`
3. Type: **Reverse Proxy**
4. Target: `http://127.0.0.1:<WEB_PORT>`  
   (`PORT` in `apps/web/.env.production`)
5. Enable SSL (Let’s Encrypt)

### B) API site (`api.yourdomain.com`)

1. Add site for `api.yourdomain.com`
2. Type: **Reverse Proxy**
3. Target: `http://127.0.0.1:<API_PORT>`  
   (`PORT` in `apps/api/.env.production`)
4. SSL via CloudPanel
5. Raise max body size if uploads fail (panel UI / ask admin)

---

## 4. Updates

```bash
cd ~/abious
export DEPLOY_BRANCH=main
bash deploy/deploy.sh
```

Or push to `main` / `dev` with `SERVER_APP_DIR` pointing at this clone.

```bash
pm2 list
pm2 logs abious-api
pm2 logs abious-web
pm2 restart abious-api abious-web
pm2 save
```

---

## 5. GitHub secrets

| Secret | Value |
|--------|--------|
| `SERVER_HOST` / `USER` / `PORT` / `SSH_KEY` | SSH access |
| `SERVER_APP_DIR` | Absolute path to monorepo clone |

---

## Checklist

- [ ] Clone on `main` at `SERVER_APP_DIR`
- [ ] Postgres `DATABASE_URL` reachable as site user
- [ ] SQL migrations applied + optional seed
- [ ] `pm2 list` shows `abious-api` and `abious-web`
- [ ] CloudPanel reverse proxies for web + api
- [ ] SSL issued in CloudPanel
