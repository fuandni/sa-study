# 端末間同期

## 設計

学習アプリは引き続きブラウザの localStorage を正本として動作する。
同期を有効にした場合だけ、OCI上の個人用APIへ履歴JSONを保存し、他端末の履歴とマージする。

- オフラインでも演習可能
- 回答履歴は回答ID（旧データは時刻等の指紋）で重複排除
- 要復習フラグは更新時刻を使ってマージ
- 最近のセッションはセッションIDで重複排除
- トークンはブラウザlocalStorageとOCIの `/etc/sa-sync.env` のみに置く
- GitHubには秘密トークンを保存しない

## サーバー

- Python + `python-oracledb`
- 保存先: Oracle AI Database（`SA_APP.STATE`）
- Python環境: `/opt/sa-sync-venv/`
- localhost:8787
- systemd: `sa-sync.service`
- Nginx: `/sa-sync/` を `127.0.0.1:8787/` へreverse proxy

## 初回導入

GitHub Actionsの最新版が成功した後、OCIで:

```bash
sudo bash /opt/sa-maintenance/install_sync_server.sh
```

事前に `/etc/sa-sync.env` へ `ORACLE_USER`、`ORACLE_PASSWORD`、`ORACLE_DSN` を設定する。スクリプトは `python-oracledb` 用venvを用意し、同期トークンとNginx用location設定を表示する。
Nginxの既存HTTPS serverブロックにlocationを追加し、
`sudo nginx -t && sudo systemctl reload nginx` を行う。

その後ブラウザで `/sa/sync_settings.html` を開き、表示された同期トークンを入力する。

## バックアップ

同期データはOracle AI Databaseの `SA_APP.STATE` に保存する。移行前の `/var/lib/sa-sync/progress.db` は当面ロールバック用バックアップとして保持する。ブラウザ側のJSON書き出し機能も引き続き利用できる。
