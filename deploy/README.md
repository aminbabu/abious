# Abious User-Mode Deployment (No Sudo Required)

This guide and setup are tailored for deploying Abious on a VPS or shared Linux server where you **only have regular user privileges** (no `root` or `sudo` access).

Services run using **`systemd --user`** units stored under `~/.config/systemd/user/`.

---

## 🚀 Running the Interactive Setup Wizard

On the server, run:

```bash
bash deploy/install-interactive.sh
```

*(Notice: **NO sudo** is needed!)*

---

## 🔍 How it Works Without Root / Sudo

1. **Available Port Discovery & Dynamic Binding**:
   - Inspects existing network bindings using `ss`, `netstat`, `lsof`, or quick Node.js socket probes.
   - Tests `3000` (API) and `4000` (Web).
   - If either port is occupied by another tenant/process, it scans and selects the next free unprivileged port (e.g. `3001`, `4001`) automatically.

2. **User Systemd Units (`systemd --user`)**:
   - Instead of writing to `/etc/systemd/system/`, the wizard installs units into:
     - `~/.config/systemd/user/abious-api.service`
     - `~/.config/systemd/user/abious-web.service`
   - You control them with `systemctl --user`.

3. **Persistent Background Execution (Linger)**:
   - Enables `loginctl enable-linger $(whoami)` so that your user services keep running even after you disconnect from your SSH session.

4. **Nginx Reverse Proxy Snippet**:
   - Since updating global `/etc/nginx/` requires root, the script generates a ready-to-use Nginx block at:
     `deploy/nginx/nginx-<yourdomain>.conf`
   - You can hand this file to your server administrator or configure your control panel (cPanel, CloudPanel, Hestia, or reverse proxy) to point to the selected local ports.

---

## 🛠️ Management Commands (User-Level)

All commands run **without sudo**:

```bash
# Check status of both services
systemctl --user status abious-api
systemctl --user status abious-web

# Live streaming logs
journalctl --user -u abious-api -f
journalctl --user -u abious-web -f

# Restart services
systemctl --user restart abious-api
systemctl --user restart abious-web

# Stop services
systemctl --user stop abious-api
systemctl --user stop abious-web
```

---

## 🔄 Updating the Project in the Future

When you push new git commits to main, update your running app with:

```bash
cd /path/to/abious
bash deploy/deploy.sh
```
