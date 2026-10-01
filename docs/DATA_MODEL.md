# データモデル

## 正本
- 午前I: `a1/data/a1_questions.json`
- 午前II: `am2/data/am2_questions.json`
- アプリ設定: `data/app_config.json`
- 出題頻度: `data/morning_frequency.js`

UIは問題本文を直書きせず、正本JSONから生成した
`data/a1_questions.js` / `data/am2_questions.js` を読み込む。

## 安定ID
- 午前I: `A1-YYYY-QNN`
- 午前II: `SA-YYYY-AM2-QNN`

履歴はこのIDをキーにする。本文、分類、表示順、解説を変更しても、
同一問題のIDは変更しない。

## 問題レコード
基本:
`id / year / section / question_no / question_text / choices / answer`

学習・監査:
`topic / category / learning_domain / subdomain / source_page / source_file / asset_path / asset_type / audit_status`

図表は、文章で安全に表現できる部分をテキスト化し、図そのものが必要な場合だけ
`asset_path` を設定する。

## 履歴 schema v2
ブラウザの `localStorage` に `sa_progress_v2` として保存する。

各問題:
- `attempts`: 回答ID、時刻、回答、正誤、回答時間
- `legacy`: 旧形式から移行した累積値
- `flagged`: 要復習フラグ
- `flag_updated_at`: 端末間マージ用更新時刻

端末間同期を有効にすると、localStorageを維持したままOCIのSQLiteとマージする。
詳細は `docs/SYNC.md`。

## 学習優先度
過去6実施回の細分類別平均出題数と、個人の回答履歴を分離して保持する。
表示時に、

`平均出題数/回 × 平滑化した誤答率`

を計算する。未回答は正答率50%相当から開始するため、履歴がない段階では
頻出分野が先に上がり、演習後は実際の弱点へ重みが移る。
