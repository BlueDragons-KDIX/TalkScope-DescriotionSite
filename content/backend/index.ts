import type { DigestItem } from "@/content/types";

export const backendDigest = {
  title: "バックエンド設計",
  description:
    "Python + FastAPI で構築した TalkScope のバックエンド。日本語解析、ベクトル化、DB 先行の辞書参照、Gemini による未知語補完、SSE による逐次返却、用語スコア API までを担う。実装済みの仕組みと、今後拡張する余地を分けながら解説する。",
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
      "テキストが届いてからスコア付き用語が返るまで。形態素解析、複合名詞の結合、辞書検索用語の正規化、文脈ベクトル化、DB / Gemini 参照へ渡すまでの実装済みステップを追う。",
    tags: ["形態素解析", "GiNZA", "ベクトル化"],
  },
  {
    slug: "scoring-algorithm",
    title: "用語スコアリングアルゴリズム",
    description:
      "バブルサイズの根拠になる用語スコア。現行 API は出現回数の素点、IDF バフ、必要に応じたテーマ類似バフを加算して返す。テーマ EMA は実装済みだが既定では無効で、運用時に明示して使う設計になっている。",
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
