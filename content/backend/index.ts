import type { DigestItem } from "@/content/types";

export const backendDigest = {
  title: "バックエンド設計",
  description:
    "Python + FastAPI で構築した TalkScope のバックエンド。最も重視したのはレイテンシで、SSE、DB / Gemini のバッチ処理、非同期並列、リージョン近接によって待ち時間を体感上短くした。その上で、日本語解析と文脈ベクトルを用いたスコア計算を組み合わせている。",
};

export const backendStack = [
  "Python 3.10+",
  "FastAPI",
  "uv",
  "Uvicorn",
  "Pydantic v2",
  "SudachiPy",
  "spaCy + GiNZA",
  "SQLAlchemy",
  "Gemini API",
  "SSE",
];

export const backendItems: DigestItem[] = [
  {
    slug: "dictionary-api",
    title: "レイテンシ改善と SSE ストリーミング",
    description:
      "DB ヒットを先に返し、未知語は Gemini の完了順に流す。DB / Gemini のバッチ処理、I/O 待ち中の非同期並列、Gemini timeout、Cloud Run と DB のリージョン近接など、UX を守るためのレイテンシ対策を解説する。",
    tags: ["レイテンシ", "SSE", "Gemini"],
  },
  {
    slug: "architecture",
    title: "バックエンド全体設計",
    description:
      "FastAPI のレイヤ構成（endpoints / services / crud）と、DB が使えない環境でも解析系 API を止めないための起動・接続設計。重い処理を services に寄せ、API レイヤを薄く保つ構成を解説する。",
    tags: ["FastAPI", "アーキテクチャ", "DB"],
  },
  {
    slug: "nlp-pipeline",
    title: "NLP パイプライン",
    description:
      "形態素解析で得られた全名詞をそのまま返すのではなく、複合名詞の結合、1文字語や一般語の除外、ブラックリストによって必要な情報へ絞る。無駄な計算とリクエストを減らすための NLP 前処理を追う。",
    tags: ["形態素解析", "GiNZA", "ベクトル化"],
  },
  {
    slug: "scoring-algorithm",
    title: "用語スコアリングアルゴリズム",
    description:
      "リクエストテキストと出現単語のベクトル類似度を使い、文脈に沿った単語へ高いスコアを与える。IT 用語で文脈ベクトルを補正する工夫と、明確な重要度指標を置く難しさを解説する。",
    tags: ["IDF", "EMA", "コサイン類似度"],
  },
  {
    slug: "dictionary-api",
    title: "辞書 API と SSE ストリーミング",
    description:
      "DB ヒット語を先に、未知語は Gemini が生成した意味候補を後から流す SSE 設計。生成結果のベクトル化、DB 蓄積、プロンプト単位の逐次返却を解説する。",
    tags: ["Gemini", "SSE", "辞書"],
  },
  {
    slug: "optimizations",
    title: "実装の工夫と難所 ── レイテンシ・スコア・レスポンス",
    description:
      "DB と Gemini のバッチ処理でリクエスト数を削り、ヒット/ミスを分離し、SSE で準備でき次第返す。タイムアウトと非同期並列で I/O 待ちを重ねる——レイテンシ軽減の工夫と、スコアの基底値やレスポンスの絞り込みで残る設計上の難所を率直に解説する。",
    tags: ["パフォーマンス", "SSE", "設計判断"],
  },
];
