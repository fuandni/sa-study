# 拡張・保守手順

## 問題を修正する
1. 午前Iは `a1/data/a1_questions.json`
2. 午前IIは `am2/data/am2_questions.json`
3. `python tools/build_data.py`
4. `python tools/validate_data.py`

mainへ反映するとGitHub Actionsでも同じ検証を行い、成功後OCIへ自動配信する。

## 年度を追加する
年度別ファイルで原本監査した後、対応する正本JSONへ統合する。
IDは午前Iなら `A1-YYYY-QNN`、午前IIなら `SA-YYYY-AM2-QNN`。
`data/app_config.json` の年一覧・期待問題数も更新する。

## 図表
本文と選択肢は可能な限りテキスト。
問題を解くために図・グラフ・フローチャート等が必要な場合だけ
`a1/assets/` 又は `am2/assets/` に切り出す。
元PDF全ページ画像を演習画面へ貼らない。

## 分類
`category / learning_domain / subdomain / topic` は学習用メタデータ。
変更しても問題IDを変えないため、既存履歴には影響しない。
IPA公式の固定出題区分でない値は、その旨を表示する。

## UI
`assets/js/app.js`, `assets/js/priority.js`, `assets/css/app.css` を変更する。
問題データとUIを混在させない。

## 保存・同期形式
保存形式を破壊的に変更するときは `progress_schema_version` を上げ、
`assets/js/storage.js` にmigrationを追加する。
同期側は旧データを削除せずマージ可能性を確認してから更新する。
