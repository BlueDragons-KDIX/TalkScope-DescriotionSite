import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "nlp-pipeline",
  title: "NLP パイプライン",
  description:
    "一文のテキストが届いてから、スコア付きの重要語が返るまで。文ベクトル化と探索対象抽出を並列に走らせ、複合名詞を結合し、品詞でふるいにかけ、300次元へベクトル化する。各段にフォールバックを備えた処理の全体像を追う。",
  intro:
    "ユーザーが話すたび、短いテキストがバックエンドへ届く。そこから「どの語が重要か」を判断するには、いくつもの段を通す必要がある。ここではその一連の流れを、入口から出口まで順に見ていく。",
  tags: ["形態素解析", "GiNZA", "ベクトル化"],
  sections: [
    {
      id: "flow",
      heading: "全体の流れ",
      blocks: [
        {
          type: "lead",
          content:
            "パイプラインは大きく「文をベクトルにする」流れと「語を取り出してスコアを付ける」流れが並走し、最後に合流して結果を返す。",
        },
        {
          type: "steps",
          items: [
            { title: "文ベクトル化（並列）", body: "文全体を1本の 300次元ベクトルへ。会話のテーマ把握に使う。" },
            { title: "探索対象の抽出（並列）", body: "形態素解析で名詞などを取り出し、複合名詞を結合する（例：「機械」+「学習」→「機械学習」）。" },
            { title: "辞書のバッチ参照", body: "抽出語をまとめて DB に問い合わせ、ヒットした語の語義候補を得る。" },
            { title: "文脈に合う語義の選択", body: "文ベクトルと各語義ベクトルの類似度から、最適な語義を選ぶ（best-sense）。" },
            { title: "スコアリングして返す", body: "出現回数・テーマ類似度・IDF からスコアを算出し、結果を順次返す。" },
          ],
        },
      ],
    },
    {
      id: "morph",
      heading: "形態素解析と複合名詞の結合",
      blocks: [
        {
          type: "text",
          content:
            "<p>まず文を形態素に分解する。理想は <strong>Sudachi</strong> による解析で、表層形・基本形・品詞・文字オフセットを得る。Sudachi が使えない環境では、正規表現でアルファベット・数字・かな漢字の塊に分割し、品詞をヒューリスティックに推定する代替へ切り替わる。</p>",
        },
        {
          type: "code",
          code: {
            lang: "Python",
            title: "形態素の出力イメージ",
            code: `[
  {"surface": "機械", "base_form": "機械", "pos": "NOUN", "start": 0, "end": 2},
  {"surface": "学習", "base_form": "学習", "pos": "NOUN", "start": 2, "end": 4},
]
# 連続する名詞は結合され "機械学習" として1語に扱われる`,
          },
        },
        {
          type: "callout",
          variant: "info",
          content:
            "「機械」「学習」を別々の語として扱うと意味がぼやける。連続する名詞を複合名詞として結合することで、専門用語をまとまりのある1語として抽出できる。",
        },
      ],
    },
    {
      id: "pos-filter",
      heading: "品詞フィルタ ── 重要語だけ残す",
      blocks: [
        {
          type: "text",
          content:
            "<p>助詞や記号をバブルにしても邪魔なだけだ。スコアリングの対象は<strong>内容語</strong>に絞る。名詞・固有名詞・動詞・形容詞・英単語・数値などを通し、接続詞・助詞・助動詞・記号などは落とす。</p>",
        },
        {
          type: "table",
          caption: "品詞フィルタ",
          head: ["扱い", "対象品詞"],
          rows: [
            ["通す（内容語）", "NOUN / PROPN / VERB / ADJ / ALPHA / NUM（名詞・動詞・形容詞・形状詞）"],
            ["落とす（機能語）", "CCONJ / SCONJ / PART / AUX / PUNCT（接続詞・助詞・助動詞・記号）"],
          ],
        },
      ],
    },
    {
      id: "vectorize",
      heading: "300次元へのベクトル化と OOV フォールバック",
      blocks: [
        {
          type: "text",
          content:
            "<p>残った語を 300 次元のベクトルへ変換する。第一候補は spaCy / GiNZA の学習済みベクトル。語彙に無い語（OOV）はスパンベクトルや構成トークンの平均で補い、それでも得られなければ <strong>SHA256 由来のハッシュベクトル</strong>へ落ちる。出力には <code>vector_source</code>（<code>spacy</code> か <code>hash</code> か）が必ず付く。</p>",
        },
        {
          type: "code",
          code: {
            lang: "Python",
            title: "vectorize 応答の例（/analysis/vectorize）",
            code: `{
  "text": "自然言語処理",
  "meta": {"model": "ja_ginza", "vector_dim": 300, "output_token_count": 3},
  "tokens": [
    {"surface": "自然", "base_form": "自然", "pos": "NOUN",
     "vector": [...], "vector_source": "spacy"}
  ]
}`,
          },
        },
        {
          type: "cards",
          columns: 2,
          items: [
            { icon: "🎯", title: "spaCy ベクトル", tag: "理想", body: "Wikipedia などで学習された 300次元の意味表現。語の意味的な近さをそのまま捉える。" },
            { icon: "#️⃣", title: "ハッシュベクトル", tag: "フォールバック", body: "SHA256(word) をシードに生成する決定論的な正規化ベクトル。同じ語は常に同じ値になる。" },
          ],
        },
        {
          type: "text",
          content:
            "<p>どちらの場合も、ベクトル値は 6 桁に丸めて転送量を抑えている。</p>",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "ハッシュベクトルは「意味」を表さないが、一貫性は保証する。学習モデルが無い環境でも、同じ語同士の類似度は常に最大になり、パイプラインが破綻しない。",
        },
      ],
    },
  ],
};

export default page;
