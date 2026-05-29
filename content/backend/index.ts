import type { DigestItem } from "@/content/types";

export const backendDigest = {
  title: "バックエンド設計",
  description:
    "Python + FastAPI で構築した TalkScope のバックエンド。Sudachi / GiNZA による日本語解析、300次元ベクトル化、出現頻度・IDF・EMA テーマ類似度を足し合わせるスコアリング、Gemini 連携の辞書生成までを担う。すべての解析段にフォールバックを用意した「壊れない NLP」の設計を解説する。",
};

export const backendStack = [
  "Python 3.10+",
  "FastAPI",
  "uv",
  "Uvicorn",
  "Pydantic v2",
  "SudachiPy",
  "spaCy + GiNZA",
  "pgvector",
  "SQLAlchemy",
  "Gemini API",
];

export const backendItems: DigestItem[] = [
  {
    slug: "architecture",
    title: "バックエンド全体設計と「壊れない NLP」",
    description:
      "FastAPI のレイヤ構成（endpoints / services / crud）と、Sudachi → spaCy → ハッシュへと段階的に劣化する多段フォールバック設計。外部依存が欠けても必ず応答を返す堅牢性をどう作ったかを解説する。",
    tags: ["FastAPI", "アーキテクチャ", "フォールバック"],
  },
  {
    slug: "nlp-pipeline",
    title: "NLP パイプライン",
    description:
      "テキストが届いてからスコア付き用語が返るまで。文ベクトル化と探索対象抽出の並列実行、複合名詞の結合、品詞フィルタ、300次元ベクトル化と OOV フォールバックの全ステップを追う。",
    tags: ["形態素解析", "GiNZA", "ベクトル化"],
  },
  {
    slug: "scoring-algorithm",
    title: "用語スコアリングアルゴリズム",
    description:
      "バブルサイズを決める重要度スコア。出現回数の素点（cap=100）に、テーマ類似度バフ（重み0.5）と IDF バフ（重み0.08）を加算する設計と、セッション単位で更新される EMA テーマベクトルを解説する。",
    tags: ["IDF", "EMA", "コサイン類似度"],
  },
  {
    slug: "dictionary-api",
    title: "辞書 API と SSE ストリーミング",
    description:
      "DB ヒット語を先に、未知語は Gemini が生成した複数語義を後から流す SSE 設計。文脈ベクトルとの類似度で最適な語義を選ぶ best-sense 選択と、生成結果のベクトル化・DB 蓄積を解説する。",
    tags: ["Gemini", "SSE", "ベクトル検索"],
  },
];
