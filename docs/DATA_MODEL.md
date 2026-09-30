# データモデル

## 方針
- 問題本文・選択肢・分類・正解は `am2/data/am2_questions.json` が正本。
- UI は問題データを直接持たない。
- ブラウザで `file://` から開けるよう、正本JSONから `data/am2_questions.js` を生成する。
- 学習履歴は問題IDをキーに保持する。分類名や表示順を変更しても履歴は失われない。
- 問題IDは安定IDとして扱い、同じ問題なら将来も変更しない。

## 問題レコード
`id / year / section / question_no / question_text / choices / answer`
を基本フィールドとし、`topic / category / asset_* / source_* / audit_status`
は後から変更・追加してよい。

## 履歴 schema v2
ブラウザの `localStorage` に `sa_progress_v2` として保存する。

各問題には:
- `attempts`: 新方式での回答履歴（時刻、回答、正誤、回答時間）
- `legacy`: 旧HTMLから移行した累積値
- `flagged`: 要復習フラグ

集計は `legacy + attempts` から算出する。したがって今後UIを変更しても、
同じ問題IDを維持すれば履歴を引き継げる。
