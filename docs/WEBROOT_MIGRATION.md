# SA Webroot migration

## Target layout

- Ichirikutoku: `/var/www/ichirikutoku/`
- SA static web: `/var/www/sa/`
- SA sync API: `/opt/sa-sync/`
- SA maintenance scripts: `/opt/sa-maintenance/`
- SA sync data: `/var/lib/sa-sync/`

Public URL remains `/sa/`.

## Nginx

Inside the HTTPS `server {}` block:

```nginx
location = /sa {
    return 301 /sa/;
}

location ^~ /sa/ {
    alias /var/www/sa/;
    index index.html;
}
```

The existing `/sa-sync/` reverse proxy remains unchanged.

## Verification

```bash
sudo nginx -t
sudo systemctl reload nginx
curl -kI https://127.0.0.1/sa/
curl -k https://127.0.0.1/sa-sync/health
```

After verification, the old `/var/www/ichirikutoku/sa/` tree can be renamed and later deleted.

## Deploy

GitHub Actions deploys public files only to `/var/www/sa/`.
Repository-only tooling, workflows, OCR intermediates and maintenance scripts are not exposed from the web root.
