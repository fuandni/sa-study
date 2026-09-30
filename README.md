# SA 2023–2025 Flexible v2

`index.html` を開けば使えます。サーバ不要で `file://` 動作を優先しています。

## 今回の追加
- ホームダッシュボード
- 年度・カテゴリ・状態・問題数・並び順からセッション生成
- 10問 / 25問 / 全問
- 誤答経験・未回答・弱点・要復習フラグ
- 途中終了 / 続きから再開
- 回答時間と個別回答履歴
- 最近の演習
- 年度別 / カテゴリ別集計
- JSON履歴バックアップ / 復元
- 旧 `sa_<問題ID>` localStorage の自動移行
- キーボード 1–4、左右キー
- 起動時構造検証
- 問題データ、UI、設定、履歴を分離

## 柔軟性
問題本文の修正やカテゴリ変更は `am2/data/am2_questions_75.json` 側だけで行えます。
`tools/build_data.py` でブラウザ用データを再生成します。
問題IDを維持する限り、学習履歴は引き継がれます。

## 監査
内容監査は別工程です。構造監査は:
`python tools/validate_data.py`


## GitHub Actions 自動デプロイ
`.github/workflows/deploy.yml` を追加済み。
詳細は `docs/GITHUB_DEPLOY.md`。
