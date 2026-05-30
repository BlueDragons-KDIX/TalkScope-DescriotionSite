import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "architecture",
  title: "バックエンド全体設計",
  description:
    "TalkScope のバックエンドは FastAPI で書かれ、endpoints / services / crud に分かれている。DB 接続や外部 API に依存する処理を分離し、DB が使えない環境でも解析系 API を起動できるようにした構成を解説する。",
  intro:
    "TalkScope のバックエンドは、文字起こしされたテキストを受け取り、用語抽出・辞書参照・スコア計算を担う。設計の中心は、HTTP の入口を薄く保ち、解析・LLM・DB 操作をそれぞれ独立した層に置くことだ。",
  tags: ["FastAPI", "アーキテクチャ", "DB"],
  sections: [
    {
      id: "layers",
      heading: "レイヤ構成",
      blocks: [
        {
          type: "lead",
          content:
            "FastAPI アプリは、ルーティング・処理・永続化を素直に分離している。重い解析は services に閉じ込め、endpoints は薄く保つ。",
        },
        {
          type: "tree",
          caption: "Backend/app の構成",
          lines: [
            "app/",
            "├─ api/endpoints/",
            "│   ├─ analysis.py        ベクトル化・辞書参照・テーマ更新",
            "│   ├─ score_analysis.py  テーマ EMA・用語スコアリング",
            "│   └─ dictionary.py      辞書エントリの CRUD",
            "├─ services/",
            "│   ├─ text_analysis.py        形態素解析・ベクトル化",
            "│   ├─ refer_dictionary_v1.py  名詞抽出 → DB/LLM 参照（SSE）",
            "│   ├─ term_score.py           スコア計算・テーマ EMA",
            "│   ├─ score_building_blocks.py 純粋関数（cosine, IDF, EMA …）",
            "│   └─ llm/gemini.py           Gemini REST クライアント",
            "├─ crud/                  DB 読み書き",
            "├─ models/ schemas/       SQLAlchemy モデル / Pydantic スキーマ",
            "└─ core/database.py       DB 接続と利用可否の管理",
          ],
        },
        {
          type: "specs",
          items: [
            { term: "Web framework", value: "FastAPI + Uvicorn" },
            { term: "言語 / 管理", value: "Python 3.10+ / uv" },
            { term: "形態素解析", value: "SudachiPy（+ sudachidict-core）" },
            { term: "ベクトル / 係り受け", value: "spaCy + GiNZA（ja-ginza）" },
            { term: "DB", value: "SQLAlchemy（辞書・IDF テーブル）" },
            { term: "語義生成", value: "Gemini API（REST）" },
          ],
        },
      ],
    },
    {
      id: "availability",
      heading: "DB に依存しすぎない起動設計",
      blocks: [
        {
          type: "text",
          content:
            "<p>バックエンドは DB を使う機能を持つが、DB が未設定のときにアプリ全体を落とさない。<code>core/database.py</code> は接続文字列が無い場合に DB 機能を無効化し、<code>db.is_available</code> を見て辞書系の処理だけを切り替える。</p>",
        },
        {
          type: "table",
          caption: "外部依存と現行の扱い",
          head: ["依存", "現行の扱い"],
          rows: [
            ["DB", "未設定・初期化失敗時は DB 機能を無効化し、解析 API の起動は継続する"],
            ["Gemini", "API キー未設定や timeout は HTTP エラーとして扱い、SSE 側では失敗したプロンプトをログに残して継続する"],
            ["spaCy / GiNZA", "モデルは遅延ロードし、利用できない場合は text_analysis 内の代替ベクトル生成へ落とす"],
            ["IDF", "起動時に DB の term_idf を読み、無ければ JSON、どちらも無ければ IDF バフ無しで計算する"],
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "DB 初期化は明示的に行う",
          content:
            "<code>ENABLE_DB_INIT=true</code> のときだけ起動時にテーブル作成を試みる。デプロイ環境では、接続先や初期化タイミングを環境変数で制御できるようにしている。",
        },
      ],
    },
    {
      id: "responsibility",
      heading: "Frontend / Backend の責務分離",
      blocks: [
        {
          type: "text",
          content:
            "<p>リアルタイム性が要る軽い処理（音声認識・文字起こし・描画）はフロントに、重い解析（形態素解析・ベクトル化・辞書参照・スコア計算）はバックに置く。両者は HTTP / SSE の境界で繋がり、<strong>結果が届いた分から UI を更新できる</strong>ようにしている。</p>",
        },
        {
          type: "cards",
          items: [
            { title: "フロント", tag: "Realtime", body: "Web Speech API での文字起こし、バブル描画、操作の即応性。" },
            { title: "バック", tag: "Compute", body: "形態素解析・ベクトル化・スコアリング・語義生成という計算の重心。" },
            { title: "境界", tag: "API", body: "ベクトル化 API・スコアリング API・辞書参照 SSE の3系統。" },
          ],
        },
        {
          type: "quote",
          text: "API は薄く、重い処理は services に閉じ込める。",
          cite: "バックエンド設計方針",
        },
      ],
    },
  ],
};

export default page;
