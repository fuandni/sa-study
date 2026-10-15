/* Additional original applied questions grounded in the public IPA SA syllabus topics. */
window.SAFocusAppliedExtra=[
  {
    "id": "advanced2-theory-01",
    "domain": "theory",
    "concept": "排他的論理和（XOR）",
    "variant": "scenario2",
    "level": "standard",
    "stem": "8ビットの値Xについて、X XOR 11111111（2進数）を実行する。結果として正しいものはどれか。",
    "choices": [
      "Xの各ビットが反転する",
      "Xの各ビットが1になる",
      "Xと同じ値になる",
      "最上位ビットだけが反転する"
    ],
    "answer": "Xの各ビットが反転する",
    "explanation": "1との排他的論理和は元のビットを反転する。各位置でXOR 1を行う。"
  },
  {
    "id": "advanced2-theory-02",
    "domain": "theory",
    "concept": "ハミング符号",
    "variant": "scenario2",
    "level": "standard",
    "stem": "4ビットの情報に3ビットの検査ビットを付けるハミング(7,4)符号で、受信した7ビット中に2ビットの誤りが生じた。通常のハミング(7,4)符号について正しい説明はどれか。",
    "choices": [
      "1ビット誤りの訂正が保証されるが2ビット誤りの訂正は保証されない",
      "2ビット誤りも常に訂正できる",
      "検査ビット3ビットなら必ず3ビット誤りを訂正できる",
      "2ビット誤りでも常に正しい位置が一意に分かる"
    ],
    "answer": "1ビット誤りの訂正が保証されるが2ビット誤りの訂正は保証されない",
    "explanation": "通常のハミング(7,4)符号の最小距離は3で、訂正能力は床((3−1)/2)=1ビット。"
  },
  {
    "id": "advanced2-theory-03",
    "domain": "theory",
    "concept": "ハッシュ表",
    "variant": "scenario2",
    "level": "standard",
    "stem": "ハッシュ値が同一となる異なるキーが存在し、チェイン法で衝突を処理する。要素数が増えた場合の説明として適切なのはどれか。",
    "choices": [
      "衝突したキーは同じバケットの連結構造に格納され、探索時間が増える可能性がある",
      "衝突が起きた時点で全レコードが削除される",
      "チェイン法では同じハッシュ値のキーを保存できない",
      "衝突により探索時間は必ずO(1)に固定される"
    ],
    "answer": "衝突したキーは同じバケットの連結構造に格納され、探索時間が増える可能性がある",
    "explanation": "チェイン法ではバケットごとに複数要素を管理できるが、過密なら探索コストが上がる。"
  },
  {
    "id": "advanced2-theory-04",
    "domain": "theory",
    "concept": "相関係数",
    "variant": "scenario2",
    "level": "standard",
    "stem": "観測データのすべてのXを X'=3X+5、すべてのYを Y'=−2Y+1 と変換した。元の相関係数が0.6なら新しい相関係数はどれか。",
    "choices": [
      "−0.6",
      "0.6",
      "1.2",
      "−1.2"
    ],
    "answer": "−0.6",
    "explanation": "正の線形変換は相関係数の符号を変えず、負の倍率は符号を反転する。絶対値は変わらない。"
  },
  {
    "id": "advanced2-architecture-01",
    "domain": "architecture",
    "concept": "パイプライン処理",
    "variant": "scenario2",
    "level": "standard",
    "stem": "4段の命令パイプラインで各段1クロック、ストールなし。10命令の理想完了時間は何クロックか。",
    "choices": [
      "13クロック",
      "10クロック",
      "40クロック",
      "14クロック"
    ],
    "answer": "13クロック",
    "explanation": "段数4＋命令数10−1＝13クロック。最初の命令だけパイプラインを充填する時間が必要。"
  },
  {
    "id": "advanced2-architecture-02",
    "domain": "architecture",
    "concept": "キャッシュヒット率",
    "variant": "scenario2",
    "level": "standard",
    "stem": "キャッシュヒット時間2ns、ミスした場合の総所要時間102ns、ヒット率80%。実効アクセス時間は何nsか。",
    "choices": [
      "22ns",
      "20ns",
      "82ns",
      "102ns"
    ],
    "answer": "22ns",
    "explanation": "0.8×2＋0.2×102＝22ns。ミス時間が総所要時間なのでヒット時間の再加算は不要。"
  },
  {
    "id": "advanced2-architecture-03",
    "domain": "architecture",
    "concept": "セットアソシアティブ方式",
    "variant": "scenario2",
    "level": "standard",
    "stem": "総ライン数64、4ウェイのセットアソシアティブキャッシュがある。セット数は幾つか。",
    "choices": [
      "16",
      "4",
      "64",
      "256"
    ],
    "answer": "16",
    "explanation": "セット数＝総ライン数÷ウェイ数＝64÷4＝16。"
  },
  {
    "id": "advanced2-architecture-04",
    "domain": "architecture",
    "concept": "スーパースカラ",
    "variant": "scenario2",
    "level": "standard",
    "stem": "一つのCPUコアで独立な命令を同一サイクルに複数発行したい。正しい設計判断はどれか。",
    "choices": [
      "複数の命令発行・実行資源を設け、データ依存による制限も考慮する",
      "クロック周期を単純に長くすれば同時発行が保証される",
      "命令フェッチを禁止する",
      "命令の依存関係を無視すれば必ず正しい結果になる"
    ],
    "answer": "複数の命令発行・実行資源を設け、データ依存による制限も考慮する",
    "explanation": "スーパースカラは命令レベルの並列性を活用するが、依存関係により発行幅どおりには実行できない。"
  },
  {
    "id": "advanced2-performance-01",
    "domain": "performance",
    "concept": "アムダールの法則",
    "variant": "scenario2",
    "level": "standard",
    "stem": "全処理の20%が必ず直列実行される。並列化部分を何台のCPUでも理想的に高速化できるとき、高速化率の理論上限はどれか。",
    "choices": [
      "5倍",
      "4倍",
      "20倍",
      "上限なし"
    ],
    "answer": "5倍",
    "explanation": "1/(直列率)=1/0.2=5。CPU数を無限大にしても直列部分は消えない。"
  },
  {
    "id": "advanced2-performance-02",
    "domain": "performance",
    "concept": "CPI",
    "variant": "scenario2",
    "level": "standard",
    "stem": "動作周波数2.5GHz、平均CPI=1.25のCPUが5億命令を実行する。理想実行時間はどれか。",
    "choices": [
      "0.25秒",
      "0.2秒",
      "0.5秒",
      "2秒"
    ],
    "answer": "0.25秒",
    "explanation": "5×10^8×1.25÷(2.5×10^9)=0.25秒。"
  },
  {
    "id": "advanced2-performance-03",
    "domain": "performance",
    "concept": "LRUページ置換",
    "variant": "scenario2",
    "level": "standard",
    "stem": "ページ枠が3個のLRU方式で、参照列1,2,3,2,4,1を空の状態から実行した。最後の1を読むときに追い出されるページはどれか。",
    "choices": [
      "3",
      "1",
      "2",
      "4"
    ],
    "answer": "3",
    "explanation": "1,2,3を入れ2を再参照。4の読込みで1を追出し、1の再読込みで最終使用が最も古い3を追い出す。"
  },
  {
    "id": "advanced2-performance-04",
    "domain": "performance",
    "concept": "平均応答時間",
    "variant": "scenario2",
    "level": "standard",
    "stem": "ヒット時0.1秒、ミス時1.1秒のキャッシュで平均応答時間が0.4秒だった。ヒット率はどれか。",
    "choices": [
      "70%",
      "60%",
      "40%",
      "30%"
    ],
    "answer": "70%",
    "explanation": "0.1h+1.1(1−h)=0.4よりh=0.7。"
  },
  {
    "id": "advanced2-modeling-01",
    "domain": "modeling",
    "concept": "UMLクラス図",
    "variant": "scenario2",
    "level": "standard",
    "stem": "会員は複数のカードを持てるが、カードは必ず1人の会員だけに所属する。会員はカードを持たなくてもよい。多重度の組合せはどれか。",
    "choices": [
      "会員端1、カード端0..*",
      "会員端0..*、カード端1",
      "会員端1、カード端1",
      "会員端0..1、カード端1..*"
    ],
    "answer": "会員端1、カード端0..*",
    "explanation": "あるカードから見た会員は1人、ある会員から見たカードは0件以上。"
  },
  {
    "id": "advanced2-modeling-02",
    "domain": "modeling",
    "concept": "DFDのバランシング",
    "variant": "scenario2",
    "level": "standard",
    "stem": "親プロセスの外部入力がA・B、出力がCである。詳細化した子DFDについて、親と整合するのはどれか。",
    "choices": [
      "境界の入力A・Bと出力Cを維持し、子プロセス間の内部フローを追加する",
      "入力Bを省き外部からDを追加する",
      "出力Cを削除し外部への出力をなくす",
      "入力Aを出力へ変更して外部フローを入れ替える"
    ],
    "answer": "境界の入力A・Bと出力Cを維持し、子プロセス間の内部フローを追加する",
    "explanation": "子DFDでは内部フローを詳細化できるが、親との境界を横断するフローは整合させる。"
  },
  {
    "id": "advanced2-modeling-03",
    "domain": "modeling",
    "concept": "スタンプ結合",
    "variant": "scenario2",
    "level": "standard",
    "stem": "画面表示部品に顧客レコード全体を渡しているが、表示には氏名だけが必要だと分かった。結合度を下げる設計として適切なのはどれか。",
    "choices": [
      "氏名だけを引数で渡す",
      "レコードに未使用の属性をさらに追加する",
      "内部の顧客テーブルを表示部品から直接更新させる",
      "呼出し元のグローバル領域を参照させる"
    ],
    "answer": "氏名だけを引数で渡す",
    "explanation": "複合データ構造を不要に渡すスタンプ結合から、必要なデータのみ渡すデータ結合へ変更する。"
  },
  {
    "id": "advanced2-modeling-04",
    "domain": "modeling",
    "concept": "UMLシーケンス図",
    "variant": "scenario2",
    "level": "standard",
    "stem": "外部API呼出し後のタイムアウト時に再試行する処理を、相互作用の時間順としてモデル化したい。適切なのはどれか。",
    "choices": [
      "シーケンス図で呼出しと応答・例外経路を表す",
      "クラス図だけで再試行タイミングを表す",
      "ER図でタイムアウト待機を表す",
      "CRUDマトリックスのみでメッセージ順を表す"
    ],
    "answer": "シーケンス図で呼出しと応答・例外経路を表す",
    "explanation": "時系列のオブジェクト間メッセージはシーケンス図が適する。分岐・ループの表記も活用できる。"
  },
  {
    "id": "advanced2-lifecycle-01",
    "domain": "lifecycle",
    "concept": "システム適格性確認テスト",
    "variant": "scenario2",
    "level": "standard",
    "stem": "新システムは画面単体の試験に合格したが、外部機器・ネットワークを含めたシステム要求の達成が未確認である。適切なテストはどれか。",
    "choices": [
      "システム適格性確認テスト",
      "ソースコードの単体静的解析だけ",
      "利用終了後の廃棄検証",
      "機器の購入手続の審査だけ"
    ],
    "answer": "システム適格性確認テスト",
    "explanation": "システム全体の要求への適合を確認する。ソフトウェア内部の確認だけでは代替できない。"
  },
  {
    "id": "advanced2-lifecycle-02",
    "domain": "lifecycle",
    "concept": "テーラリング",
    "variant": "scenario2",
    "level": "standard",
    "stem": "規模が小さいためレビュー手順を簡略化したいが、法令上必要な証跡は残す必要がある。最適な対応はどれか。",
    "choices": [
      "プロセスの目的と必要な統制を維持し、成果物の粒度や実施方法を調整する",
      "全ての検証を無条件に省略する",
      "法令上の証跡も削除する",
      "全工程を必ず大規模案件と同じ粒度で実施する"
    ],
    "answer": "プロセスの目的と必要な統制を維持し、成果物の粒度や実施方法を調整する",
    "explanation": "テーラリングは目的・リスク・要求事項を踏まえた調整であり、一律の省略ではない。"
  },
  {
    "id": "advanced2-lifecycle-03",
    "domain": "lifecycle",
    "concept": "保守プロセス",
    "variant": "scenario2",
    "level": "standard",
    "stem": "稼働中のサービスの重大な不具合を修正した。修正版公開前に既存の周辺機能への影響を確認するのに適する活動はどれか。",
    "choices": [
      "修正の検証に加えて関連機能の回帰テストを行う",
      "影響範囲を調査せず即時公開する",
      "受入れ基準の有無を無視する",
      "廃棄プロセスだけを実施する"
    ],
    "answer": "修正の検証に加えて関連機能の回帰テストを行う",
    "explanation": "保守の修正時には変更の影響範囲を評価し、既存機能に退行がないか確認する。"
  },
  {
    "id": "advanced2-lifecycle-04",
    "domain": "lifecycle",
    "concept": "移行プロセス",
    "variant": "scenario2",
    "level": "standard",
    "stem": "旧システムからの移行で切替直後に重大障害が発生した。移行準備として最も効果的だったものはどれか。",
    "choices": [
      "事前に切戻し条件・手順とデータ整合性の検証方法を定める",
      "切戻しを計画から禁止する",
      "旧環境のバックアップを確認せず削除する",
      "移行時刻だけを決める"
    ],
    "answer": "事前に切戻し条件・手順とデータ整合性の検証方法を定める",
    "explanation": "移行計画には判断基準・事前検証・切戻し手順が必要。"
  },
  {
    "id": "advanced2-database-01",
    "domain": "database",
    "concept": "候補キー",
    "variant": "scenario2",
    "level": "standard",
    "stem": "関係R(A,B,C)でA→B、B→A、AB→Cが成立する。他に関数従属はないものとする。候補キーとして適切なのはどれか。",
    "choices": [
      "AとBのそれぞれが候補キーとなる",
      "ABのみが候補キーとなる",
      "Cのみが候補キーとなる",
      "ACのみが候補キーとなる"
    ],
    "answer": "AとBのそれぞれが候補キーとなる",
    "explanation": "A→BかつAB→CよりA→Cも導ける。同様にB→AからB→Cを導けるためA、Bがそれぞれ極小のスーパーキー。"
  },
  {
    "id": "advanced2-database-02",
    "domain": "database",
    "concept": "デッドロック",
    "variant": "scenario2",
    "level": "standard",
    "stem": "DBの待ちグラフでT1→T2、T2→T3、T3→T1の依存がある。適切な判断はどれか。",
    "choices": [
      "循環待ちがありデッドロックの可能性を検出する",
      "待ちグラフに閉路がない",
      "全トランザクションは確実にコミット済み",
      "T1だけを待ち行列から除けばデータは必ず整合する"
    ],
    "answer": "循環待ちがありデッドロックの可能性を検出する",
    "explanation": "待ちグラフの閉路はデッドロック検出の根拠になる。資源モデルに応じて解消方法を決める。"
  },
  {
    "id": "advanced2-database-03",
    "domain": "database",
    "concept": "第3正規形",
    "variant": "scenario2",
    "level": "standard",
    "stem": "社員(社員ID,所属コード,所属名称)について社員ID→所属コード、所属コード→所属名称が成り立つ。更新異常の抑制に適した対応はどれか。",
    "choices": [
      "所属(所属コード,所属名称)を別の関係に分離する",
      "所属名称を社員表の各行で独立に更新する",
      "主キー社員IDを削除する",
      "全属性を文字列で結合する"
    ],
    "answer": "所属(所属コード,所属名称)を別の関係に分離する",
    "explanation": "社員IDから所属コードを経由して所属名称が推移的に決まるため、所属情報を分離する。"
  },
  {
    "id": "advanced2-database-04",
    "domain": "database",
    "concept": "トランザクション分離レベル",
    "variant": "scenario2",
    "level": "standard",
    "stem": "二つの取引が同じ在庫数を読み、両方が残数を更新する。在庫を負にしない一貫性を維持する方策として最も適切なのはどれか。",
    "choices": [
      "適切な行ロックや更新時の条件確認を用い、競合更新を防ぐ",
      "READ UNCOMMITTEDにすれば必ず競合が消える",
      "画面に読み込んだ値だけで何度でも無条件更新する",
      "処理開始時の在庫数を永久に固定する"
    ],
    "answer": "適切な行ロックや更新時の条件確認を用い、競合更新を防ぐ",
    "explanation": "並行取引による更新競合を考え、ロックまたは原子的な条件付き更新などを利用する。"
  }
];
