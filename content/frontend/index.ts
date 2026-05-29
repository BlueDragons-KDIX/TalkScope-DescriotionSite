import type { DigestItem } from "@/content/types";

export const frontendDigest = {
  title: "フロントエンド設計",
  description:
    "React 19 + TypeScript で構築した TalkScope のフロントエンド。クリーンアーキテクチャ、物理シミュレーション、動的レイアウトエンジンなど、エンジニアとしてのこだわりを詰め込んだ設計の全貌を解説する。",
};

export const frontendItems: DigestItem[] = [
  {
    slug: "clean-architecture",
    title: "クリーンアーキテクチャの採用",
    description:
      "神クラスと化していた App.tsx を4層クリーンアーキテクチャへ段階的にリファクタリング。責務分離、テスタビリティ向上、Zustand によるストア分割の設計判断を解説する。",
    tags: ["アーキテクチャ", "Zustand", "設計"],
    coverImage: {
      src: "/app-base.png",
      alt: "TalkScope ベース画面",
    },
  },
  {
    slug: "bubble-physics",
    title: "バブルクラウド物理エンジン",
    description:
      "重要語バブルの配置に2D物理シミュレーションを実装。浮力・求心力・反発力の3力と requestAnimationFrame による 60fps 描画の仕組みを深掘りする。",
    tags: ["物理シミュレーション", "パフォーマンス", "UI"],
    coverImage: {
      src: "/window-bubble.png",
      alt: "バブルクラウド",
    },
  },
  {
    slug: "layout-engine",
    title: "動的レイアウトエンジン",
    description:
      "VSCode/Unity 風のパネル自由配置を実現するバイナリツリーベースのレイアウトエンジン。D&D・リサイズ・プリセット5種・ウィンドウ削除/復元の実装を解説する。",
    tags: ["レイアウト", "バイナリツリー", "DnD"],
    coverImage: {
      src: "/app-fullcustom.png",
      alt: "フルカスタムレイアウト",
    },
  },
  {
    slug: "bubble-lifetime",
    title: "バブルライフタイム管理 v3.0",
    description:
      "バブルが増えすぎると視認性が落ちる。v1→v2→v3 の進化を経て辿り着いた「個数ベース上限管理＋ゾンビ防止」方式の設計と判断を公開する。",
    tags: ["状態管理", "UX", "アルゴリズム"],
    coverImage: {
      src: "/app-bubble.png",
      alt: "バブルが表示された状態",
    },
  },
  {
    slug: "phase-system",
    title: "フェーズシステム（発表中/発表後）",
    description:
      "「発表を聴く」フェーズと「振り返る」フェーズを独立したシーンとして実装。フェーズ遷移ボタン、アクセントカラー自動補色切替、レイアウト引き継ぎの設計を解説する。",
    tags: ["フェーズ設計", "ADR", "UX"],
    coverImage: {
      src: "/app-ranking.png",
      alt: "ランキング表示（発表後フェーズ）",
    },
  },
  {
    slug: "customization",
    title: "高いカスタマイズ性",
    description:
      "ダークモード、アクセントカラー6種、文字サイズ、IT単語フィルターのしきい値、ウィンドウ個別設定。すべてをユーザーが制御できるUI設計を解説する。",
    tags: ["設定", "アクセシビリティ", "UI"],
    coverImage: {
      src: "/mainsetting.png",
      alt: "設定モーダル",
    },
  },
];
