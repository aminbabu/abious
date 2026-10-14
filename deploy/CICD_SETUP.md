# GitHub Actions CI/CD to Contabo VPS Setup

The workflow at [`.github/workflows/deploy.yml`](file:///home/aminbabu/Development/aminbabu/abious/.github/workflows/deploy.yml) automatically triggers upon every `push` to the `main` branch:

1. **Lint & Pre-flight**: Runs in GitHub runner (Node 24 + `pnpm lint`).
2. **Remote Deployment**: Connects via SSH to your Contabo VPS using an SSH Key, updates code, compiles builds using the server's local `.env.production` files, and restarts user-level Systemd services (`systemd --user`).

> **Security Note:** Neither your database password, auth secrets, nor `.env` files are stored in GitHub. They reside **exclusively on your Contabo server**.

---

## 1. Prepare SSH Access on Contabo Server

On your Contabo server (under your normal user account):

```bash
# 1. Generate an SSH keypair if you don't already have one
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy -N ""

# 2. Add the public key to authorized_keys
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# 3. View and copy the PRIVATE key (you will paste this into GitHub Secrets)
cat ~/.ssh/github_deploy
```

---

## 2. Configure GitHub Repository Secrets

Go to your GitHub repository:
**Settings $\to$ Secrets and variables $\to$ Actions $\to$ New repository secret**

Add the following secrets:

| Secret Name | Value Example | Description |
|---|---|---|
| `CONTABO_HOST` | `194.163.xxx.xxx` (or `server.yourdomain.com`) | Your Contabo VPS IP address or hostname |
| `CONTABO_USER` | `abious` (or your VPS username) | The non-root Linux user on your VPS |
| `CONTABO_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | The entire private key created in Step 1 |
| `CONTABO_PORT` | `22` *(Optional)* | SSH port (defaults to 22) |
| `CONTABO_APP_DIR` | `/home/abious/abious` *(or `~/abious`)* | Absolute path to cloned repository on server |
| `CONTABO_SSH_PASSPHRASE` | *(Leave empty if key has no password)* | Passphrase if your private key is encrypted |

---

## 3. Server-Side Environment Files

Ensure your production `.env` files are created on the Contabo server inside the project root:

- `apps/api/.env.production`
- `apps/web/.env.production`

If you haven't created them yet, simply run the interactive script on the server once:
```bash
bash deploy/install-interactive.sh
```

---

## 4. Test the Deployment

1. Make a commit and push to `main`:
   ```bash
   git add .
   git commit -m "ci: add GitHub Actions Contabo deployment workflow"
   git push origin main
   ```
2. Navigate to the **Actions** tab in your GitHub repository to watch the deployment build and execute.
