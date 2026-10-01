# SA 午前問題学習DB

`index.html` を開けば使えます。公開環境では OCI / Nginx の `/sa/` で配信しています。

## 収録状況
- 午前I: 2019・2021〜2025の6実施回、30問×6 = **180問**
- 午前II: 同6実施回、25問×6 = **150問**
- 合計 **330問**
- 問題本文・選択肢・正解・図表を原本画像と照合済み
- 文章で表現できる部分はHTMLテキスト、必要な図表だけ画像アセット

## 学習機能
- ホームダッシュボード
- 午前I / 午前II、年度、カテゴリ、細分類から出題
- 10問 / 25問 / 30問 / 全問
- 誤答経験・未回答・弱点・要復習フラグ
- ランダム / 年度・問番号順
- 途中終了 / 続きから再開
- 回答時間と個別回答履歴
- 最近の演習
- 年度別 / カテゴリ別 / 細分類別集計
- JSON履歴バックアップ / 復元
- キーボード 1〜4、左右キー
- 起動時構造検証

## 出題配分
`morning_distribution.html` で、6実施回330問を学習用分類で集計しています。
IPAが固定配分として公表した値ではなく、実問題から得た実測値です。

## データの正本
- 午前I: `a1/data/a1_questions.json`
- 午前II: `am2/data/am2_questions.json`
- 設定: `data/app_config.json`

年度別の監査済みデータも `a1/data/` と `am2/data/` に保存しています。
問題IDは年度・区分・問番号で固定しており、分類変更や解説追加でも学習履歴を維持できます。

## 端末間同期
ブラウザの localStorage を残したまま、OCI上の個人用同期API + SQLiteへ履歴をマージできます。
詳細は `docs/SYNC.md`。

## 構造検証
```bash
python tools/build_data.py
python tools/validate_data.py
```

GitHub Actionsでも main 更新時に自動検証します。

## GitHub → OCI
`.github/workflows/deploy.yml` が main 更新を検出し、検証後に
`/var/www/ichirikutoku/sa/` へ自動デプロイします。
詳細は `docs/GITHUB_DEPLOY.md`。
