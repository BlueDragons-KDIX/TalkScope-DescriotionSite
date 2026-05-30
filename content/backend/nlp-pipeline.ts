import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "nlp-pipeline",
  title: "NLP パイプライン",
  description:
    "一文のテキストが届いてから、スコア付きの用語が返るまで。文脈ベクトル化と探索対象抽出を並行して走らせ、複合名詞を結合し、DB / Gemini / スコア計算へつなぐ実装済みの流れを追う。",
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
            "SSE で返す辞書スコアのパイプラインは、「文脈ベクトルを作る流れ」と「検索対象の語を取り出す流れ」が並行し、DB / LLM の結果をスコア計算へ渡して順次返す。",
        },
        {
          type: "steps",
          items: [
            { title: "文脈ベクトル化（並行）", body: "入力テキストを embedding し、辞書候補との類似度スコアに使う。" },
            { title: "探索対象の抽出", body: "形態素解析で連続する名詞を取り出し、複合語として結合する（例：「機械」+「学習」→「機械学習」）。" },
            { title: "検索語の正規化", body: "重複を取り、1文字語とブラックリスト語を除外して DB 検索用の語リストを作る。" },
            { title: "DB / Gemini 参照", body: "DB ヒットは先に返し、ミスした語だけ Gemini に意味候補生成を依頼する。" },
            { title: "スコアリングして SSE で返す", body: "語義ベクトルと文脈ベクトルの類似度を使い、完了したまとまりから順次返す。" },
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
            "<p>まず文を形態素に分解する。<code>text_analysis.py</code> は SudachiPy が使える場合は Sudachi の結果を使い、表層形・基本形・品詞・文字オフセットを得る。辞書参照では、その中から連続する名詞をまとめて複合語として扱う。</p>",
        },
        {
          type: "code",
          code: {
            lang: "Python",
            title: "形態素の出力イメージ",
            code: `[
  {"surface": "機械", "base_form": "機械", "pos": "名詞", "start": 0, "end": 2},
  {"surface": "学習", "base_form": "学習", "pos": "名詞", "start": 2, "end": 4},
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
            "<p>辞書検索の入口では名詞を中心に扱う。SSE 用の辞書参照では連続名詞を結合したうえで、1文字語とブラックリスト語を除外する。別系統の <code>/analysis/vectorize</code> では、名詞・動詞・形容詞などの内容語をベクトル化できる。</p>",
        },
        {
          type: "table",
          caption: "現行パイプラインでのフィルタ",
          head: ["処理", "対象"],
          rows: [
            ["辞書参照 SSE", "連続する名詞を複合語化し、1文字語・ブラックリスト語を除外"],
            ["ベクトル化 API", "名詞・動詞・形容詞などを通し、助詞・助動詞・記号などを除外"],
            ["用語スコア API", "名詞系を対象にし、代名詞と1文字表層を除外"],
          ],
        },
      ],
    },
    {
      id: "vectorize",
      heading: "ベクトル化とフォールバック",
      blocks: [
        {
          type: "text",
          content:
            "<p>文や語義は spaCy / GiNZA のベクトルを優先して embedding する。文章ベクトル化では <code>spacy_doc</code>、<code>spacy_token_avg</code>、<code>content_token_avg</code>、<code>hash</code> の順に利用できるものを選ぶ。モデルが無い環境でも、決定論的なハッシュベクトルで API の形を保つ。</p>",
        },
        {
          type: "code",
          code: {
            lang: "Python",
            title: "sentence vectorize 応答の例（/analysis/vectorize/sentence）",
            code: `{
  "text": "自然言語処理を学ぶ",
  "meta": {
    "model": "ginza",
    "vector_dim": 300,
    "vector_source": "spacy_doc",
    "normalize": true
  },
  "sentence_vector": [...]
}`,
          },
        },
        {
          type: "cards",
          columns: 2,
          items: [
            { title: "spaCy / GiNZA", tag: "優先", body: "利用できる場合は、文全体またはトークン平均のベクトルを使う。" },
            { title: "ハッシュベクトル", tag: "代替", body: "SHA256 を元にした決定論的なベクトル。同じ入力は常に同じ値になる。" },
          ],
        },
        {
          type: "text",
          content:
            "<p>辞書参照 v1 では、入力文の embedding と生成・保存済み語義の embedding を使ってスコア計算へ渡す。embedding に失敗した場合は空ベクトルを返し、処理全体は継続する。</p>",
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
