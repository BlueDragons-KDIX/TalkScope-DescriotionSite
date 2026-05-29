import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "architecture",
  title: "バックエンド全体設計と「壊れない NLP」",
  description:
    "TalkScope のバックエンドは FastAPI で書かれ、endpoints / services / crud にきれいに分かれている。だが本当の肝は構成図ではなく、Sudachi → spaCy → ハッシュへと段階的に劣化するフォールバック設計だ。外部依存が欠けても必ず応答を返す堅牢性をどう作ったかを解説する。",
  intro:
    "NLP ライブラリは重く、環境に敏感だ。GiNZA のモデルが入っていない、Gemini が落ちている——展示当日にそれが起きても、アプリは止められない。そこでバックエンドは「<strong>最良を試し、駄目なら劣化して必ず返す</strong>」を全段で徹底した。",
  tags: ["FastAPI", "アーキテクチャ", "フォールバック"],
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
            "└─ core/database.py       DB 接続（pgvector）",
          ],
        },
        {
          type: "specs",
          items: [
            { term: "Web framework", value: "FastAPI + Uvicorn" },
            { term: "言語 / 管理", value: "Python 3.10+ / uv" },
            { term: "形態素解析", value: "SudachiPy（+ sudachidict-core）" },
            { term: "ベクトル / 係り受け", value: "spaCy + GiNZA（ja-ginza）" },
            { term: "ベクトル DB", value: "pgvector + SQLAlchemy" },
            { term: "語義生成", value: "Gemini API（REST）" },
          ],
        },
      ],
    },
    {
      id: "fallback",
      heading: "多段フォールバックという思想",
      blocks: [
        {
          type: "text",
          content:
            "<p>このバックエンドを貫く設計思想は <strong>graceful degradation（優雅な劣化）</strong>だ。各解析ステップは「理想の実装」と「それが使えないときの代替」を必ずペアで持つ。代替は精度こそ落ちるが、決して例外で止まらない。</p>",
        },
        {
          type: "table",
          caption: "各段の理想実装とフォールバック",
          head: ["処理", "理想", "フォールバック"],
          rows: [
            ["形態素解析", "Sudachi", "正規表現分割 + 品詞ヒューリスティック"],
            ["係り受け", "spaCy / GiNZA", "ルールベースの簡易係り受け"],
            ["単語ベクトル", "spaCy 学習済み 300次元", "SHA256 由来の決定論的ハッシュベクトル"],
            ["語義生成", "Gemini", "DB ヒットのみで応答（生成はスキップ）"],
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "なぜハッシュベクトルか",
          content:
            "学習済みベクトルが無くても、同じ単語からは常に同じベクトルが得られれば「一貫した類似度計算」は成立する。SHA256 をシードに正規化ベクトルを生成することで、精度を諦めつつパイプラインの形は保つ。",
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
            "<p>リアルタイム性が要る軽い処理（音声認識・文字起こし・描画）はフロントに、重い解析（形態素解析・係り受け・ベクトル類似度）はバックに置く。両者は HTTP / SSE の薄い境界で繋がり、<strong>NLP の精度を段階的に上げても UI は変わらない</strong>ように設計されている。</p>",
        },
        {
          type: "list",
          items: [
            "フロント：Web Speech API での文字起こし、バブル描画、操作の即応性",
            "バック：形態素解析・ベクトル化・スコアリング・語義生成という計算の重心",
            "境界：ベクトル化 API・スコアリング API・辞書参照 SSE の3系統",
          ],
        },
        {
          type: "quote",
          text: "ルールベースから形態素解析、そして類似度モデルへ。NLP は段階導入できる形にしておく。",
          cite: "開発方針（AGENTS.md より）",
        },
      ],
    },
  ],
};

export default page;
