#!/usr/bin/env bash
set -euo pipefail

APPDIR=/opt/sa-sync
VENVDIR=/opt/sa-sync-venv
DATADIR=/var/lib/sa-sync
ENVFILE=/etc/sa-sync.env
UNIT=/etc/systemd/system/sa-sync.service
USER_NAME=sa-sync

if [ ! -f "$APPDIR/sync_server.py" ]; then
  echo "sync_server.py が $APPDIR にありません。先にGitHub Actionsの最新版デプロイを完了してください。" >&2
  exit 1
fi

if ! id "$USER_NAME" >/dev/null 2>&1; then
  sudo useradd --system --home "$DATADIR" --shell /sbin/nologin "$USER_NAME"
fi
sudo mkdir -p "$DATADIR"
sudo chown "$USER_NAME:$USER_NAME" "$DATADIR"
sudo chmod 700 "$DATADIR"

if [ ! -f "$ENVFILE" ]; then
  TOKEN="$(openssl rand -hex 32)"
  printf 'SA_SYNC_TOKEN=%s\nSA_SYNC_HOST=127.0.0.1\nSA_SYNC_PORT=8787\n' "$TOKEN" | sudo tee "$ENVFILE" >/dev/null
  sudo chmod 600 "$ENVFILE"
else
  TOKEN="$(sudo sed -n 's/^SA_SYNC_TOKEN=//p' "$ENVFILE" | head -1)"
fi

for key in ORACLE_USER ORACLE_PASSWORD ORACLE_DSN; do
  if ! sudo grep -q "^$key=" "$ENVFILE"; then
    echo "$ENVFILE に $key を設定してください。" >&2
    exit 1
  fi
done

if [ ! -x "$VENVDIR/bin/python" ]; then
  sudo /usr/bin/python3 -m venv "$VENVDIR"
fi
sudo "$VENVDIR/bin/pip" install --disable-pip-version-check --quiet oracledb

sudo tee "$UNIT" >/dev/null <<'UNITEOF'
[Unit]
Description=SA study progress sync API
After=network.target

[Service]
Type=simple
User=sa-sync
Group=sa-sync
EnvironmentFile=/etc/sa-sync.env
ExecStart=/opt/sa-sync-venv/bin/python /opt/sa-sync/sync_server.py
Restart=on-failure
RestartSec=2
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict

[Install]
WantedBy=multi-user.target
UNITEOF

sudo systemctl daemon-reload
sudo systemctl enable --now sa-sync
sleep 1
curl -fsS http://127.0.0.1:8787/health | grep -q '"database":"oracle"'
echo
echo
echo
echo "同期API本体はOracle AI Databaseを使用して起動しました。"
echo "ブラウザへ入力する同期トークン:"
echo "$TOKEN"
echo
echo "次にNginxのHTTPS serverブロックへ以下を追加してください:"
cat <<'NGINX'
location /sa-sync/ {
    proxy_pass http://127.0.0.1:8787/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 6m;
    proxy_read_timeout 15s;
    add_header Cache-Control "no-store" always;
}
NGINX
echo
echo "追加後: sudo nginx -t && sudo systemctl reload nginx"
