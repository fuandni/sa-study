# 拡張手順

## 問題を追加・修正する
1. `am2/data/am2_questions_75.json` を編集する。
2. `python tools/build_data.py` を実行する。
3. `python tools/validate_data.py` を実行する。
4. `index.html` を開いて確認する。

HTML本体への問題の直書きは不要。

## 年度を追加する
安定ID（例 `SA-2022-AM2-Q01`）で問題をJSONへ追加するだけで、
年度・カテゴリのフィルタ候補は自動生成される。
`data/app_config.json` の `expected_question_count` なども更新する。

## 分類を変更する
各問題の `category` / `topic` を変更する。
履歴は `id` に紐づくため影響しない。

## UIを変更する
`assets/js/app.js` と `assets/css/app.css` を変更する。
問題データを触る必要はない。

## 保存形式を変更する
`progress_schema_version` を上げ、`assets/js/storage.js` の migration を追加する。
旧形式は削除せず読み取り移行する。
