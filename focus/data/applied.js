/* Independently authored applied reasoning tasks; not variants of 290 definition prompts. */
window.SAFocusAppliedQuestions=[
  {
    "id": "advanced-theory-01",
    "domain": "theory",
    "concept": "ド・モルガンの法則",
    "variant": "applied",
    "stem": "仕様で「承認済み、または緊急扱い」の注文を処理する。処理対象外になる条件はどれか。",
    "choices": [
      "承認されておらず、かつ緊急扱いでもない",
      "承認されておらず、または緊急扱いでない",
      "承認済みかつ緊急扱いでない",
      "承認済みでも緊急扱いならない"
    ],
    "answer": "承認されておらず、かつ緊急扱いでもない",
    "explanation": "NOT(A OR B) は NOT A AND NOT B。ORを否定すると両方の否定が必要。",
    "level": "standard"
  },
  {
    "id": "advanced-theory-02",
    "domain": "theory",
    "concept": "二分探索",
    "variant": "applied",
    "stem": "要素数が1024の昇順配列から存在しない値を二分探索する。比較ごとに候補範囲を半分以下にできるとき、比較回数の上界として最も近いのはどれか。",
    "choices": [
      "11回",
      "10回",
      "512回",
      "1024回"
    ],
    "answer": "11回",
    "explanation": "1024=2^10。存在しないことを確かめる最後の比較まで含め、最大で床(log2 1024)+1=11回。",
    "level": "standard"
  },
  {
    "id": "advanced-theory-03",
    "domain": "theory",
    "concept": "スタック（LIFO）",
    "variant": "applied",
    "stem": "A→B→Cの順でスタックに入れ、途中で取出しを行ってよい。各要素を1回ずつ入出力したとき、実現できない出力順はどれか。",
    "choices": [
      "C→A→B",
      "B→A→C",
      "B→C→A",
      "C→B→A"
    ],
    "answer": "C→A→B",
    "explanation": "Cを先に出すにはA,B,Cが積まれている。Cの次にはBが上にあるため、AをBより先に取り出せない。",
    "level": "standard"
  },
  {
    "id": "advanced-theory-04",
    "domain": "theory",
    "concept": "ハフマン符号",
    "variant": "applied",
    "stem": "記号A,B,C,Dの出現確率がそれぞれ0.5,0.25,0.125,0.125である。最適な二分ハフマン符号の平均符号長はどれか。",
    "choices": [
      "1.75ビット",
      "2ビット",
      "1.5ビット",
      "2.25ビット"
    ],
    "answer": "1.75ビット",
    "explanation": "長さを1,2,3,3ビットとできる。0.5×1+0.25×2+0.125×3+0.125×3=1.75。",
    "level": "standard"
  },
  {
    "id": "advanced-theory-05",
    "domain": "theory",
    "concept": "M/M/1待ち行列",
    "variant": "applied",
    "stem": "M/M/1の窓口で到着率λ=8件/分、サービス率μ=10件/分。系内平均滞在時間W（待ち時間＋処理時間）はどれか。",
    "choices": [
      "0.5分",
      "0.1分",
      "0.4分",
      "2分"
    ],
    "answer": "0.5分",
    "explanation": "M/M/1の系内平均時間W=1/(μ−λ)=1/(10−8)=0.5分。待ち行列だけの時間と混同しない。",
    "level": "standard"
  },
  {
    "id": "advanced-theory-06",
    "domain": "theory",
    "concept": "正規分布の標準化",
    "variant": "applied",
    "stem": "同じテストで受験者Xは70点（平均60、標準偏差5）、Yは80点（平均70、標準偏差10）だった。標準化得点zの関係はどれか。",
    "choices": [
      "XとYは等しい",
      "Xの方が高い",
      "Yの方が高い",
      "平均値だけでは比較できない"
    ],
    "answer": "Xの方が高い",
    "explanation": "X=(70−60)/5=2、Y=(80−70)/10=1。標準化ではXが高い。",
    "level": "standard"
  },
  {
    "id": "advanced-architecture-01",
    "domain": "architecture",
    "concept": "キャッシュヒット率",
    "variant": "applied",
    "stem": "ヒット時5ns、ミス時は主記憶アクセスを含め105nsとする。ヒット率90%の平均アクセス時間はどれか。",
    "choices": [
      "15ns",
      "10ns",
      "100ns",
      "95ns"
    ],
    "answer": "15ns",
    "explanation": "0.9×5+0.1×105=15ns。ミス時の総時間が既に105nsなので二重加算しない。",
    "level": "standard"
  },
  {
    "id": "advanced-architecture-02",
    "domain": "architecture",
    "concept": "ライトバック方式",
    "variant": "applied",
    "stem": "障害復旧後にキャッシュの更新が主記憶に未反映だった。書込み方式の性質として最も合致するものはどれか。",
    "choices": [
      "変更済み行を遅延して書き戻すため、電源断では未反映データが失われ得る",
      "書込み時に主記憶も必ず更新するため、未反映は起こり得ない",
      "主記憶を使わず常に補助記憶にのみ記録する",
      "書込みが発生するとキャッシュが必ず無効になる"
    ],
    "answer": "変更済み行を遅延して書き戻すため、電源断では未反映データが失われ得る",
    "explanation": "ライトバックは変更行をキャッシュ側に保持する。遅延反映の利点と揮発性のリスクを区別する。",
    "level": "standard"
  },
  {
    "id": "advanced-architecture-03",
    "domain": "architecture",
    "concept": "パイプライン処理",
    "variant": "applied",
    "stem": "5段パイプラインで各段が1クロック、ハザード・停止なし。独立した20命令を完了するまでの理想クロック数はどれか。",
    "choices": [
      "24",
      "20",
      "100",
      "25"
    ],
    "answer": "24",
    "explanation": "最初の命令に5クロック、以後19命令は各1クロック。D+I−1=5+20−1=24。",
    "level": "standard"
  },
  {
    "id": "advanced-architecture-04",
    "domain": "architecture",
    "concept": "SAN",
    "variant": "applied",
    "stem": "複数サーバが共有ブロックストレージを扱う。FCベースのSANと一般的なNASの違いとして適切なのはどれか。",
    "choices": [
      "SANは主にブロック単位の接続、NASはファイル共有を提供する",
      "SANはHTTPでのみ共有しNASはSCSIしか使えない",
      "両者ともファイル共有プロトコルが必須である",
      "NASは同一筐体にCPUを置けない"
    ],
    "answer": "SANは主にブロック単位の接続、NASはファイル共有を提供する",
    "explanation": "SANの接続層はブロックストレージ、NASはネットワーク越しのファイルアクセスという区別が基本。",
    "level": "standard"
  },
  {
    "id": "advanced-architecture-05",
    "domain": "architecture",
    "concept": "RAID 1",
    "variant": "applied",
    "stem": "容量2TBの同容量ディスク4台でRAID 1の二重複製を2組作成し、それぞれ独立したボリュームにする。合計利用可能容量はどれか。",
    "choices": [
      "4TB",
      "2TB",
      "6TB",
      "8TB"
    ],
    "answer": "4TB",
    "explanation": "各2TB×2台のミラーは利用可能容量2TB。それを2組なので合計4TB。RAID 0/5とは異なる。",
    "level": "standard"
  },
  {
    "id": "advanced-architecture-06",
    "domain": "architecture",
    "concept": "シンプロビジョニング",
    "variant": "applied",
    "stem": "論理容量10TBを提示し物理容量4TBを割り当てた。最も注意すべき運用リスクはどれか。",
    "choices": [
      "実書込みが物理容量を超えて割当不能となる",
      "論理容量分の物理領域が必ず確保される",
      "すべての書込みが常に圧縮される",
      "故障時に必ずRAID 1として復旧する"
    ],
    "answer": "実書込みが物理容量を超えて割当不能となる",
    "explanation": "論理容量を過剰に見せられる一方、実利用量が物理容量へ達すると書込み障害を招く。",
    "level": "standard"
  },
  {
    "id": "advanced-performance-01",
    "domain": "performance",
    "concept": "アムダールの法則",
    "variant": "applied",
    "stem": "全処理の80%を並列化可能とし4プロセッサで完全並列実行できるとする。高速化率はどれか。",
    "choices": [
      "2.5倍",
      "4倍",
      "3.2倍",
      "1.6倍"
    ],
    "answer": "2.5倍",
    "explanation": "1/{(1−0.8)+0.8/4}=1/(0.2+0.2)=2.5。直列部が限界を作る。",
    "level": "standard"
  },
  {
    "id": "advanced-performance-02",
    "domain": "performance",
    "concept": "CPI",
    "variant": "applied",
    "stem": "2GHzのCPUが10億命令を平均CPI=2で実行するとき、停止時間を無視した実行時間はどれか。",
    "choices": [
      "1秒",
      "0.5秒",
      "2秒",
      "4秒"
    ],
    "answer": "1秒",
    "explanation": "10億命令×2サイクル÷20億サイクル/秒=1秒。",
    "level": "standard"
  },
  {
    "id": "advanced-performance-03",
    "domain": "performance",
    "concept": "ページフォールト",
    "variant": "applied",
    "stem": "通常の主記憶アクセスは200ns、ページフォールト率は10万回に1回、フォールト処理時間は10msとする。平均アクセス時間の概算はどれか。",
    "choices": [
      "約300ns",
      "約201ns",
      "約10ms",
      "約100µs"
    ],
    "answer": "約300ns",
    "explanation": "200ns+10ms×10^-5=200ns+100ns≈300ns。10ms=10^7nsに注意。",
    "level": "standard"
  },
  {
    "id": "advanced-performance-04",
    "domain": "performance",
    "concept": "LRUページ置換",
    "variant": "applied",
    "stem": "ページ枠3個が空で参照列が1,2,3,1,4,2と続く。LRUで最後の2を読み込む直前に置換されるページはどれか。",
    "choices": [
      "3",
      "1",
      "2",
      "4"
    ],
    "answer": "3",
    "explanation": "1,2,3を格納し1を再参照。4の読み込みで2を追い出し、続く2の読み込みで最終参照が最も古い3を追い出す。",
    "level": "standard"
  },
  {
    "id": "advanced-performance-05",
    "domain": "performance",
    "concept": "平均応答時間",
    "variant": "applied",
    "stem": "ヒット時0.2秒、ミス時2.2秒のキャッシュで平均応答時間を0.6秒以下にしたい。必要なヒット率の下限はどれか。",
    "choices": [
      "80%",
      "60%",
      "70%",
      "90%"
    ],
    "answer": "80%",
    "explanation": "平均=0.2h+2.2(1−h)=2.2−2h。0.6以下ならh≥0.8。",
    "level": "standard"
  },
  {
    "id": "advanced-performance-06",
    "domain": "performance",
    "concept": "スループット",
    "variant": "applied",
    "stem": "ある処理系は毎秒80件を処理し、平均系内滞在時間は0.25秒。定常状態でLittleの法則が使えるとき、系内平均件数はどれか。",
    "choices": [
      "20件",
      "320件",
      "80件",
      "0.003件"
    ],
    "answer": "20件",
    "explanation": "L=λW=80件/秒×0.25秒=20件。件数と処理時間を混同しない。",
    "level": "standard"
  },
  {
    "id": "advanced-modeling-01",
    "domain": "modeling",
    "concept": "DFDのバランシング",
    "variant": "applied",
    "stem": "親DFDの処理Pに「注文情報」「顧客情報」が入力され「承認結果」が外部へ出る。子DFDで妥当な分割はどれか。",
    "choices": [
      "子の境界でも二つの入力と一つの出力を保持し、内部の処理を分割する",
      "顧客情報をなくし、子の外部出力として在庫情報を追加する",
      "承認結果を消し、データストア更新だけを描く",
      "親で存在しない外部入力を新たに追加する"
    ],
    "answer": "子の境界でも二つの入力と一つの出力を保持し、内部の処理を分割する",
    "explanation": "階層分割後も親プロセスの境界を越える入出力は一致させる。内部データフローは詳細化してよい。",
    "level": "standard"
  },
  {
    "id": "advanced-modeling-02",
    "domain": "modeling",
    "concept": "UMLクラス図",
    "variant": "applied",
    "stem": "一つの注文は一人の顧客に属し、一人の顧客は注文を0件以上持つ。顧客と注文の関連の多重度で適切なのはどれか。",
    "choices": [
      "顧客端1、注文端0..*",
      "顧客端0..*、注文端1",
      "顧客端1、注文端1",
      "顧客端0..1、注文端0..1"
    ],
    "answer": "顧客端1、注文端0..*",
    "explanation": "注文一件から見る顧客は必ず1、一人の顧客から見る注文は0以上の複数。端に記す多重度を逆にしない。",
    "level": "standard"
  },
  {
    "id": "advanced-modeling-03",
    "domain": "modeling",
    "concept": "UMLステートマシン図",
    "variant": "applied",
    "stem": "注文が「未決済」から「決済済」に遷移する際、決済成功の通知が必要という仕様を表すのに適切なのはどれか。",
    "choices": [
      "イベントとガード条件を伴う状態遷移を描く",
      "クラスの属性だけを一覧化する",
      "データベース表の主キーを定義する",
      "処理時間のガントチャートを描く"
    ],
    "answer": "イベントとガード条件を伴う状態遷移を描く",
    "explanation": "状態機械は状態、イベント、遷移条件をモデル化する。静的構造図では遷移条件を表現しにくい。",
    "level": "standard"
  },
  {
    "id": "advanced-modeling-04",
    "domain": "modeling",
    "concept": "データ結合",
    "variant": "applied",
    "stem": "モジュールAがBへ構造体Customer全体を渡すが、Bが使うのは顧客IDだけ。独立性を高める変更はどれか。",
    "choices": [
      "顧客IDを単純な引数として渡す",
      "構造体に使わない項目をさらに追加する",
      "呼出し元の内部変数を直接参照させる",
      "処理種別フラグを渡してBの分岐を増やす"
    ],
    "answer": "顧客IDを単純な引数として渡す",
    "explanation": "必要な単純データだけを渡せばスタンプ結合からデータ結合へ近づき、不要な構造依存を減らせる。",
    "level": "standard"
  },
  {
    "id": "advanced-modeling-05",
    "domain": "modeling",
    "concept": "制御結合",
    "variant": "applied",
    "stem": "関数send(data, mode)のmodeで送信・保存・破棄の処理を切り替えている。結合度の説明として適切なのはどれか。",
    "choices": [
      "呼出し元が呼出し先の処理経路を指示しており制御結合の性質がある",
      "複合データのみ渡しているので必ずスタンプ結合である",
      "単純な数値だから常にデータ結合である",
      "共通記憶域を共有しているため内容結合である"
    ],
    "answer": "呼出し元が呼出し先の処理経路を指示しており制御結合の性質がある",
    "explanation": "渡す型ではなく、受渡しデータが呼出し先の制御を決めるかが重要。",
    "level": "standard"
  },
  {
    "id": "advanced-modeling-06",
    "domain": "modeling",
    "concept": "CRUDマトリックス",
    "variant": "applied",
    "stem": "業務一覧とデータ一覧のCRUDマトリックスで、どの業務からもCが付いていない新規データ表がある。まず疑うべきことはどれか。",
    "choices": [
      "作成する業務機能の定義漏れがある可能性",
      "すべての表でDを禁止すべきこと",
      "必ず正規化に失敗していること",
      "データ表の索引数が不足していること"
    ],
    "answer": "作成する業務機能の定義漏れがある可能性",
    "explanation": "どの機能がデータを作成するか追跡できないなら、作成責任や要件の欠落を確認する。",
    "level": "standard"
  },
  {
    "id": "advanced-lifecycle-01",
    "domain": "lifecycle",
    "concept": "システム適格性確認テスト",
    "variant": "applied",
    "stem": "ソフトウェア単体の機能試験に合格したが、接続する装置を含むシステム要求の達成は未確認。次に適切な確認はどれか。",
    "choices": [
      "システム要求に照らしたシステム適格性確認テスト",
      "ソフトウェアの単体テストだけを繰り返す",
      "廃棄プロセスを開始する",
      "本番運用の終了判定を行う"
    ],
    "answer": "システム要求に照らしたシステム適格性確認テスト",
    "explanation": "システム適格性確認はソフトウェア単独でなくシステム要求の達成を確認する。",
    "level": "standard"
  },
  {
    "id": "advanced-lifecycle-02",
    "domain": "lifecycle",
    "concept": "移行プロセス",
    "variant": "applied",
    "stem": "旧システムから新システムへ移る際、データ形式が変わる。移行計画で優先して確認すべきことはどれか。",
    "choices": [
      "データ変換後の整合性確認と切戻し手順",
      "旧装置の廃棄費用だけを決める",
      "利用者教育は移行と無関係なので除く",
      "移行後の障害対応を禁止する"
    ],
    "answer": "データ変換後の整合性確認と切戻し手順",
    "explanation": "移行は切替の実施だけでなく、変換の検証、移行判定、問題時の対応も必要。",
    "level": "standard"
  },
  {
    "id": "advanced-lifecycle-03",
    "domain": "lifecycle",
    "concept": "廃棄プロセス",
    "variant": "applied",
    "stem": "個人情報を含む旧ストレージを廃棄する。適切な処置はどれか。",
    "choices": [
      "データ消去を検証し証跡を残して装置を処分する",
      "管理者のログアウトだけを確認して処分する",
      "未消去ディスクをそのまま外部へ引き渡す",
      "新システムの受入れテストだけで代替する"
    ],
    "answer": "データ消去を検証し証跡を残して装置を処分する",
    "explanation": "廃棄時は情報保護と処置結果の記録が重要。移行・受入れと役割が違う。",
    "level": "standard"
  },
  {
    "id": "advanced-lifecycle-04",
    "domain": "lifecycle",
    "concept": "テーラリング",
    "variant": "applied",
    "stem": "標準プロセスを小規模案件に適用する。妥当なテーラリングはどれか。",
    "choices": [
      "リスクに応じ手順や成果物の粒度を調整し必要な統制を確保する",
      "納期短縮のため全てのレビューを無条件で削除する",
      "規模に関係なく全手順を同じ粒度で強制する",
      "要求事項の確認自体を省く"
    ],
    "answer": "リスクに応じ手順や成果物の粒度を調整し必要な統制を確保する",
    "explanation": "テーラリングは目的を保った調整であり、品質・安全の根拠のない工程省略ではない。",
    "level": "standard"
  },
  {
    "id": "advanced-lifecycle-05",
    "domain": "lifecycle",
    "concept": "回帰テスト",
    "variant": "applied",
    "stem": "障害修正で関数Aを変更した。Aの単体テストに合格した後、同じAPIを使うBが動かなくなる可能性を確認したい。何を行うか。",
    "choices": [
      "変更影響範囲の既存テストを再実行する",
      "Aの修正内容を仕様に隠す",
      "Bのテストを新規開発終了まで延期する",
      "既存の受入れ試験を全て破棄する"
    ],
    "answer": "変更影響範囲の既存テストを再実行する",
    "explanation": "変更による非意図的な退行を検出するため既存機能も確認する。",
    "level": "standard"
  },
  {
    "id": "advanced-lifecycle-06",
    "domain": "lifecycle",
    "concept": "受入れテスト",
    "variant": "applied",
    "stem": "契約で定めた業務処理が納品物で実現できるか、発注側の業務担当が判定する。この活動に最も近いのはどれか。",
    "choices": [
      "受入れテスト",
      "ソースコードの静的解析",
      "CPU性能のベンチマーク",
      "開発者による単体テスト"
    ],
    "answer": "受入れテスト",
    "explanation": "発注者・利用者による受入れ基準への適合確認である。",
    "level": "standard"
  },
  {
    "id": "advanced-database-01",
    "domain": "database",
    "concept": "第3正規形",
    "variant": "applied",
    "stem": "受注明細(注文ID,商品ID,数量,商品名)のキーが(注文ID,商品ID)、かつ商品ID→商品名である。まず取り除くべき問題はどれか。",
    "choices": [
      "複合キーの一部への部分関数従属",
      "非キー属性を経由する推移的関数従属だけ",
      "主キーの重複だけ",
      "外部キーの参照先がないことだけ"
    ],
    "answer": "複合キーの一部への部分関数従属",
    "explanation": "商品名は商品IDだけで決まり複合キーの真部分集合へ従属する。第2正規形の問題を先に解消する。",
    "level": "standard"
  },
  {
    "id": "advanced-database-02",
    "domain": "database",
    "concept": "第3正規形",
    "variant": "applied",
    "stem": "社員(社員ID,部署ID,部署名)で社員ID→部署ID、部署ID→部署名が成り立つ。更新異常を減らす設計として適切なのはどれか。",
    "choices": [
      "部署(部署ID,部署名)を分離する",
      "社員IDを主キーから削除する",
      "部署名をすべての社員行で独立更新する",
      "社員と部署を一列に連結する"
    ],
    "answer": "部署(部署ID,部署名)を分離する",
    "explanation": "部署名が部署IDを通じて推移的に決まるため、部署情報を別表に分ける。",
    "level": "standard"
  },
  {
    "id": "advanced-database-03",
    "domain": "database",
    "concept": "ON DELETE CASCADE",
    "variant": "applied",
    "stem": "商品表に対応する受注明細が残っている状態で商品行を削除する。外部キーがON DELETE CASCADEならどの処理が起こるか。",
    "choices": [
      "該当する受注明細の子行も削除される",
      "受注明細を残したまま親行だけを削除する",
      "親行の削除は常に拒否される",
      "商品行は複製される"
    ],
    "answer": "該当する受注明細の子行も削除される",
    "explanation": "CASCADEは親行削除時に参照する子行へ削除を伝播させる。",
    "level": "standard"
  },
  {
    "id": "advanced-database-04",
    "domain": "database",
    "concept": "WAL（先行書込みログ）",
    "variant": "applied",
    "stem": "DBMSがコミット完了をアプリへ通知する。更新ページはまだディスクに書き出されていない。障害後の復旧を可能にするため必須なのはどれか。",
    "choices": [
      "更新を再現するのに必要なログを先に永続化する",
      "全てのデータページが必ず書き出されてから通知する",
      "未コミットトランザクションのログを破棄する",
      "チェックポイントを毎SQL実行時に必ず作成する"
    ],
    "answer": "更新を再現するのに必要なログを先に永続化する",
    "explanation": "先行書込みログでは更新ページより先に必要なログを安定記憶へ書く。",
    "level": "standard"
  },
  {
    "id": "advanced-database-05",
    "domain": "database",
    "concept": "デッドロック",
    "variant": "applied",
    "stem": "T1が資源Aを保持してB待ち、T2がBを保持してA待ち。待ちグラフに現れる特徴はどれか。",
    "choices": [
      "T1→T2→T1の閉路",
      "一方向の待ちだけで閉路はない",
      "両方とも待ちが解消した状態",
      "トランザクション間の依存は存在しない"
    ],
    "answer": "T1→T2→T1の閉路",
    "explanation": "互いの保持資源を待つ循環待ちがデッドロックを引き起こす。",
    "level": "standard"
  },
  {
    "id": "advanced-database-06",
    "domain": "database",
    "concept": "トランザクション分離レベル",
    "variant": "applied",
    "stem": "分離性をREAD COMMITTEDからSERIALIZABLEに高める一般的なトレードオフはどれか。",
    "choices": [
      "異常な並行実行結果を防ぎやすい一方、競合や再試行が増える場合がある",
      "不整合な読取りが必ず増える",
      "すべての待機・競合が必ずなくなる",
      "分離性は整合性と無関係である"
    ],
    "answer": "異常な並行実行結果を防ぎやすい一方、競合や再試行が増える場合がある",
    "explanation": "強い分離は直列実行相当の結果を保証するため、並列実行の自由度が下がることがある。",
    "level": "standard"
  }
];
