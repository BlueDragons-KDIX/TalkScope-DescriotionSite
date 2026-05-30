import type { DigestItem, DigestGroup } from "@/content/types";

export const frontendDigest = {
  title: "フロントエンド設計",
  description:
    "React 19 + TypeScript で構築した TalkScope のフロントエンド。クリーンアーキテクチャによる責務分離、毎フレーム走る2D物理シミュレーション、バイナリツリーで表現する動的レイアウト、個数ベースのバブル寿命管理まで。会話中でも迷わず操作できる UX を支える設計判断を解説する。",
};

export const frontendStack = [
  "React 19",
  "TypeScript",
  "Vite 6",
  "Bun",
  "Tailwind CSS v4",
  "Zustand 5",
  "Motion 12",
  "Radix UI",
  "IndexedDB (idb)",
  "Web Speech API",
];

export const frontendItems: DigestItem[] = [
  // ── システム設計 ──
  {
    slug: "clean-architecture",
    title: "クリーンアーキテクチャの採用",
    description:
      "肥大化した App.tsx を domain / application / infrastructure / presentation の4層へ。Strategy パターンでスコアリングを差し替え可能にし、15以上の Zustand ストアで状態を分割した設計を解説する。",
    tags: ["アーキテクチャ", "Zustand", "DDD"],
    coverImage: { src: "/frontend/app-base.png", alt: "TalkScope ベース画面" },
    category: "system",
  },
  {
    slug: "bubble-physics",
    title: "バブルクラウド物理エンジン",
    description:
      "重要語の配置を2D物理シミュレーションで決定。浮力・求心力・反発力の3力を毎フレーム合成し、React を迂回した translate3d 直接書き換えで 60fps を維持する仕組みを深掘りする。",
    tags: ["物理シミュレーション", "requestAnimationFrame", "パフォーマンス"],
    coverImage: { src: "/frontend/window-bubble.png", alt: "バブルクラウド" },
    category: "system",
  },
  {
    slug: "bubble-lifetime",
    title: "バブルライフタイム管理 v3.0",
    description:
      "バブルが増えすぎると視認性が落ちる。ソフト上限・デスロウ（5秒の猶予）・ハード上限の三段階で寿命を管理し、ピン留めを死守する個数ベース方式へ辿り着くまでの設計を公開する。",
    tags: ["状態管理", "UX", "アルゴリズム"],
    coverImage: { src: "/frontend/app-bubble.png", alt: "バブルが表示された状態" },
    category: "system",
  },
  // ── UI/UX デザイン ──
  {
    slug: "design-philosophy",
    title: "企画思想 ── 「置いていかれない」リアルタイムUX",
    description:
      "知らない単語ひとつで話に置いていかれる——その瞬間をなくすために TalkScope は生まれた。リアルタイムで「ミリでも知っている」状態を保つ初期構想から、ウィンドウ選択・動的レイアウト・詳細設定へと続く、使う人ごとに深められる4段階のUXを解説する。",
    tags: ["企画思想", "UX", "カスタマイズ"],
    coverImage: { src: "/frontend/window-transcription.png", alt: "リアルタイム文字起こしウィンドウ" },
    category: "ux",
  },
  {
    slug: "layout-engine",
    title: "動的レイアウトエンジン",
    description:
      "VSCode / Unity 風のパネル自由配置を、Split / Leaf のバイナリツリーで表現。ドラッグでの分割・リサイズ・ドロップゾーン・フェーズ別レイアウト永続化の実装を解説する。",
    tags: ["レイアウト", "バイナリツリー", "Drag & Drop"],
    coverImage: { src: "/frontend/app-fullcustom.png", alt: "フルカスタムレイアウト" },
    category: "ux",
  },
  {
    slug: "customization",
    title: "高いカスタマイズ性",
    description:
      "マスターサイズ倍率・バブル倍率・文字サイズ・最大表示数・自動切替を、スライダーで自在に。localStorage と IndexedDB を使い分けた永続化と、操作を阻害しない設定 UI の設計を解説する。",
    tags: ["設定", "永続化", "UI"],
    coverImage: { src: "/frontend/mainsetting.png", alt: "設定モーダル" },
    category: "ux",
  },
];

/** 一覧ページでの2分類（システム / UI・UX） */
export const frontendGroups: DigestGroup[] = [
  {
    id: "system",
    title: "システム設計",
    description:
      "アプリの内部を動かす構造とアルゴリズム。アーキテクチャ・物理エンジン・寿命管理を深掘りする。",
    icon: "⚙️",
    items: frontendItems.filter((i) => i.category === "system"),
  },
  {
    id: "ux",
    title: "UI / UX デザイン",
    description:
      "会話中でも迷わず操作できる体験設計。自由なレイアウトとカスタマイズ性を解説する。",
    icon: "🎨",
    items: frontendItems.filter((i) => i.category === "ux"),
  },
];
