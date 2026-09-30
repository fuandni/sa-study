# GitHub → OCI 自動デプロイ

## GitHub Secrets
リポジトリの Settings → Secrets and variables → Actions に以下を登録。

- `OCI_HOST`: OCI の公開IPまたはSSH接続先ホスト名
- `OCI_USER`: 通常は `opc`
- `OCI_SSH_KEY`: SSH接続に使用している秘密鍵の全文

## 配置先
`/var/www/ichirikutoku/sa/`

## 動作
`main` への push で:
1. 問題データを再生成
2. 構造検証
3. OCI の `~/sa_release_new/` へ転送
4. 現行版を `~/sa_backups/` へバックアップ
5. `/var/www/ichirikutoku/sa/` へ反映
6. Nginx設定検証
7. `https://127.0.0.1/sa/` をヘルスチェック
8. バックアップを最新5世代に整理

## ロールバック
OCIへSSHして、このリポジトリの `scripts/rollback_latest.sh` と同内容を実行するか、
サーバーにコピーして実行する。

## 注意
GitHub Actions のSSHユーザーが `sudo` 時にパスワードを要求される構成の場合、
自動デプロイは停止する。その場合は対象コマンドだけNOPASSWDにする。
