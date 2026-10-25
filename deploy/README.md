# Abious production deployment

| Context | Tooling |
|---------|---------|
| Local development | pnpm |
| Server / CI | **npm** + **PM2** |
| Edge | CloudPanel reverse proxy → `aminbabu.com` / `api.aminbabu.com` |

## Quick start

```bash
bash deploy/check-ports.sh
bash deploy/install-interactive.sh   # first time
DEPLOY_BRANCH=main bash deploy/deploy.sh
```

See [CLOUDPANEL.md](./CLOUDPANEL.md).
