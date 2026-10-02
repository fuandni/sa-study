#!/usr/bin/env bash
set -euo pipefail
WEBROOT=/var/www/sa
BACKUPS="$HOME/sa_backups"

latest="$(ls -1t "$BACKUPS"/sa-*.tar.gz 2>/dev/null | head -1 || true)"
if [ -z "$latest" ]; then
  echo "No SA deployment backup found in $BACKUPS"
  exit 1
fi

echo "Restoring: $latest"
tmp="$HOME/sa_rollback_tmp"
rm -rf "$tmp"
mkdir -p "$tmp"
tar -xzf "$latest" -C "$tmp"

sudo rsync -a --delete "$tmp/" "$WEBROOT/"
sudo find "$WEBROOT" -type d -exec chmod 755 {} \;
sudo find "$WEBROOT" -type f -exec chmod 644 {} \;
if command -v restorecon >/dev/null 2>&1; then
  sudo restorecon -RF "$WEBROOT" || true
fi
sudo nginx -t
curl -kfsS https://127.0.0.1/sa/ >/dev/null
rm -rf "$tmp"
echo "Rollback OK"
