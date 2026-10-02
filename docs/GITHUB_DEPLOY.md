# GitHub → OCI 自動デプロイ

## GitHub Secrets
リポジトリの Settings → Secrets and variables → Actions に以下を登録。

- `OCI_HOST`: OCI の公開IPまたはSSH接続先ホスト名
- `OCI_USER`: 通常は `opc`
- `OCI_SSH_KEY`: SSH接続に使用している秘密鍵の全文

## 配置
- 公開Web: `/var/www/sa/`
- 同期API: `/opt/sa-sync/`
- メンテナンススクリプト: `/opt/sa-maintenance/`
- 同期DB: `/var/lib/sa-sync/progress.db`

一陸特の `/var/www/ichirikutoku/` とは独立させる。

## 公開URL
Nginxで `/sa/` を `/var/www/sa/` に割り当てる。
URL階層とファイルシステム階層は一致させない。

## main push時
1. 問題データ再生成
2. 構造検証
3. OCIの一時領域へ転送
4. 公開に必要なファイルだけでreleaseを生成
5. 現行 `/var/www/sa/` をバックアップ
6. `/var/www/sa/` へ反映
7. 同期APIとメンテナンススクリプトを `/opt/` 配下へ反映
8. Nginx設定検証
9. `https://127.0.0.1/sa/` をヘルスチェック
10. バックアップを最新5世代に整理

GitHubの `tools/`, `docs/`, `.github/`, OCR作業データ等は公開Webルートへ配置しない。

## ロールバック
OCIで:

```bash
sudo /opt/sa-maintenance/rollback_latest.sh
```

## 注意
GitHub ActionsのSSHユーザーがsudo時にパスワードを要求される構成では自動デプロイは停止する。
