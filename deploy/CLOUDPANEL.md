# Deploy Abious Monorepo on CloudPanel (no sudo)

This guide is for a **NestJS API + SolidStart web** monorepo on CloudPanel, next to an existing Astro site, as a **site user without sudo**.

- **Server deploys use npm + PM2**
- **Local development can keep using pnpm**

---

## Layout (do not mix with Astro)

| App | Branch | Example path | Process | Public |
|-----|--------|--------------|---------|--------|
| Astro portfolio | `archive/astro` | `~/htdocs/astro` (or current path) | `pm2` `aminbabu-portfolio` `:8006` | Existing CloudPanel vhost |
| Monorepo | `main` / `dev` | `~/abious` | `pm2` `abious-api` + `abious-web` | **New** reverse-proxy sites |

Use a **second clone** for the monorepo. Never `git checkout main` inside the Astro directory.

---

## 1. Database (PostgreSQL)

CloudPanel often ships MariaDB/MySQL. This API expects **PostgreSQL** via `DATABASE_URL`.

Options without sudo:

1. Create Postgres in CloudPanel if your plan/admin provides it, **or**
2. Use managed Postgres (Neon, Supabase, etc.) and paste the URL into the wizard, **or**
3. Ask the server admin for a Postgres database + connection string

Example:

```text
postgresql://USER:PASSWORD@127.0.0.1:5432/abious_prod
```

Apply schema SQL once (from the monorepo clone):

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

- picks free ports (avoid Astro’s `8006`)
- writes `apps/api/.env.production` and `apps/web/.env.production`
- runs `npm install` + builds both workspaces
- starts **PM2** apps `abious-api` and `abious-web`
- writes CloudPanel notes under `deploy/cloudpanel-<domain>.txt`

---

## 3. Align CloudPanel vhosts

In CloudPanel UI (no sudo nginx edits):

### A) Frontend site (`yourdomain.com`)

1. **Sites → Add Site** (or edit existing unused site)
2. Domain: `yourdomain.com`
3. Type: **Reverse Proxy**
4. URL / target: `http://127.0.0.1:<WEB_PORT>`  
   (`WEB_PORT` = `PORT` in `apps/web/.env.production`)
5. Enable SSL (Let’s Encrypt) in CloudPanel

### B) API site (`api.yourdomain.com`)

1. Add site for `api.yourdomain.com`
2. Type: **Reverse Proxy**
3. Target: `http://127.0.0.1:<API_PORT>`  
   (`API_PORT` = `PORT` in `apps/api/.env.production`)
4. SSL via CloudPanel
5. If uploads fail, raise max body size in the site’s nginx overrides (panel UI / ask admin)

Keep the Astro vhost pointing at its own PM2 port unchanged.

---

## 4. `main` vs `dev`

| Environment | Clone | Branch | DB | Domains |
|-------------|-------|--------|----|---------|
| Production | `~/abious` | `main` | `abious_prod` | prod web + api |
| Staging (optional) | `~/abious-dev` | `dev` | `abious_dev` | staging web + api |

Do not flip one directory between `main` and `dev`.

---

## 5. Updates

```bash
cd ~/abious
export DEPLOY_BRANCH=main
bash deploy/deploy.sh
```

Or push to `main` / `dev` once GitHub Actions secrets point at this clone (`SERVER_APP_DIR_MONOREPO`).

Useful PM2 commands:

```bash
pm2 list
pm2 logs abious-api
pm2 logs abious-web
pm2 restart abious-api abious-web
pm2 save
```

---

## 6. GitHub secrets (Astro + monorepo)

| Secret | Used by | Value |
|--------|---------|--------|
| `SERVER_HOST` / `USER` / `PORT` / `SSH_KEY` | both | shared |
| `SERVER_APP_DIR` | Astro workflow | Astro clone path |
| `SERVER_APP_DIR_MONOREPO` | `main`/`dev` workflow | e.g. `/home/SITEUSER/abious` |

---

## Checklist

- [ ] Astro still healthy on its vhost/PM2
- [ ] Separate `~/abious` clone on `main`
- [ ] Postgres `DATABASE_URL` reachable as site user
- [ ] SQL migrations applied + optional seed
- [ ] `pm2 list` shows `abious-api` and `abious-web`
- [ ] CloudPanel reverse proxies for web + api
- [ ] SSL issued in CloudPanel
- [ ] `SERVER_APP_DIR_MONOREPO` set for CI
