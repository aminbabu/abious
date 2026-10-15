# Abious Monorepo Deployment

NestJS API (`apps/api`) + SolidStart web (`apps/web`).

| Context | Package manager | Process manager |
|---------|-----------------|-----------------|
| Local development | **pnpm** | `pnpm dev` |
| Server / CI (CloudPanel) | **npm** | **PM2** |

No sudo required for site-user deploys. See **[CLOUDPANEL.md](./CLOUDPANEL.md)** for vhost alignment.

---

## First-time setup

```bash
cd /path/to/abious
git checkout main
bash deploy/install-interactive.sh
```

Then apply SQL migrations and wire CloudPanel reverse proxies as described in `CLOUDPANEL.md`.

---

## Updates

```bash
export DEPLOY_BRANCH=main   # or dev
bash deploy/deploy.sh
```

---

## PM2

```bash
pm2 list
pm2 logs abious-api
pm2 logs abious-web
pm2 restart abious-api abious-web
```

Ecosystem file: `deploy/ecosystem.config.cjs`

Legacy `deploy/systemd/` units remain for reference but are **not** used by the current npm/PM2 flow.
