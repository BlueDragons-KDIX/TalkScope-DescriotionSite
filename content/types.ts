export type ImageRef = {
  src: string;
  alt: string;
  caption?: string;
};

export type ContentBlock =
  // 本文（HTML 文字列を許容）
  | { type: "text"; content: string }
  // リード文（セクション冒頭の大きめの段落）
  | { type: "lead"; content: string }
  // サブ見出し（h3 相当）
  | { type: "subheading"; content: string }
  // 画像
  | { type: "image"; image: ImageRef }
  | { type: "images"; images: ImageRef[]; layout?: "grid" | "row" }
  // コードブロック
  | { type: "code"; code: { lang: string; title?: string; code: string } }
  // コールアウト
  | { type: "callout"; variant: "info" | "tip" | "warning" | "note"; title?: string; content: string }
  // 箇条書き
  | { type: "list"; ordered?: boolean; items: string[] }
  // 並列概念のカード列挙（3要素などをグラフィカルに見せる）
  | {
      type: "cards";
      columns?: 2 | 3;
      items: { icon?: string; title: string; body: string; tag?: string }[];
    }
  // 指標カード（数値の強調）
  | { type: "stats"; items: { value: string; label: string; sub?: string }[] }
  // 手順 / パイプライン（番号付きのステップ）
  | { type: "steps"; items: { title: string; body: string }[] }
  // 表
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  // 設計判断（ADR 風）
  | { type: "decision"; context: string; choice: string; because: string[] }
  // ファイルツリー（等幅）
  | { type: "tree"; lines: string[]; caption?: string }
  // 仕様リスト（key-value）
  | { type: "specs"; items: { term: string; value: string }[] }
  // 引用
  | { type: "quote"; text: string; cite?: string };

export type Section = {
  id: string;
  heading: string;
  blocks: ContentBlock[];
};

export type DetailPage = {
  slug: string;
  title: string;
  /** 一覧カードや記事ヘッダーで使う短い要約 */
  description: string;
  /** 記事冒頭のリード文（任意・HTML 可） */
  intro?: string;
  tags: string[];
  /** ヘッダー直下のヒーロー画像（任意） */
  heroImage?: ImageRef;
  sections: Section[];
};

export type DigestItem = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  coverImage?: ImageRef;
  /** 一覧ページでのグループ分けに使うカテゴリ ID（任意） */
  category?: string;
};

/** 一覧ページで記事をまとめるグループ */
export type DigestGroup = {
  id: string;
  /** グループ見出し */
  title: string;
  /** グループの補足説明 */
  description: string;
  /** 見出し横のサポート絵文字（任意） */
  icon?: string;
  items: DigestItem[];
};
