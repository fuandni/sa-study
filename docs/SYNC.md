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

- Python標準ライブラリのみ
- SQLite: `/var/lib/sa-sync/progress.db`
- localhost:8787
- systemd: `sa-sync.service`
- Nginx: `/sa-sync/` を `127.0.0.1:8787/` へreverse proxy

## 初回導入

GitHub Actionsの最新版が成功した後、OCIで:

```bash
sudo bash /var/www/ichirikutoku/sa/scripts/install_sync_server.sh
```

スクリプトが同期トークンとNginx用location設定を表示する。
Nginxの既存HTTPS serverブロックにlocationを追加し、
`sudo nginx -t && sudo systemctl reload nginx` を行う。

その後ブラウザで `/sa/sync_settings.html` を開き、表示された同期トークンを入力する。

## バックアップ

同期DBは小さいSQLiteファイルなので、必要になったら
`/var/lib/sa-sync/progress.db` を通常のサーバーバックアップ対象へ追加する。
ブラウザ側のJSON書き出し機能も引き続き利用できる。
