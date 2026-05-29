import type { DigestItem } from "@/content/types";

export const backendDigest = {
  title: "バックエンド設計",
  description:
    "Python + FastAPI で構築した TalkScope のバックエンド。GiNZA による日本語形態素解析、300次元ベクトル化、IDF と EMA テーマを組み合わせたスコアリング、Gemini API による辞書検索の設計を解説する。",
};

export const backendItems: DigestItem[] = [
  {
    slug: "nlp-pipeline",
    title: "NLP パイプライン",
    description:
      "テキストが届いてからスコア付き用語リストが返るまでの処理を解説。GiNZA 形態素解析 → 品詞フィルタ → 300次元ベクトル化 → OOV フォールバックの全ステップ。",
    tags: ["GiNZA", "spaCy", "形態素解析"],
  },
  {
    slug: "scoring-algorithm",
    title: "用語スコアリングアルゴリズム",
    description:
      "バブルサイズを決める重要度スコアの算出方法。出現頻度の山型関数、IDF バフ、EMA テーマコサイン類似度バフの3要素を組み合わせる設計。",
    tags: ["IDF", "EMA", "コサイン類似度"],
  },
  {
    slug: "dictionary-api",
    title: "辞書 API（Gemini 連携）",
    description:
      "単語の意味説明を返す辞書エンドポイント。DB キャッシュ優先で Gemini API にフォールバックする構成と、非同期並列呼び出しの実装を解説。",
    tags: ["Gemini", "FastAPI", "非同期"],
  },
];
