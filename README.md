# TalkScope 技術解説サイト

TalkScope の展示イベント向け技術解説サイトです。

## 概要

「TalkScope」（青龍's / ブルードラゴンズ）の技術設計・実装こだわりを、エンジニア向けに解説する記事サイトです。展示ブースで参加者にアプリを触ってもらいながら、このサイトで詳細な技術説明を補完する用途を想定しています。

## ページ構成

```
/               概要ページ（アプリ全体の説明）
/frontend       フロントエンド技術のダイジェスト一覧
/frontend/[slug]  各テーマの詳細記事
/backend        バックエンド技術のダイジェスト一覧
/backend/[slug]   各テーマの詳細記事
```

### フロントエンド記事（5本）

| slug | タイトル |
|------|--------|
| `clean-architecture` | クリーンアーキテクチャの採用 |
| `bubble-physics` | バブルクラウド物理エンジン |
| `layout-engine` | 動的レイアウトエンジン |
| `bubble-lifetime` | バブルライフタイム管理 v3.0 |
| `customization` | 高いカスタマイズ性 |

### バックエンド記事（準備中）

| slug | タイトル |
|------|--------|
| `nlp-pipeline` | NLP パイプライン |
| `scoring-algorithm` | 用語スコアリングアルゴリズム |
| `dictionary-api` | 辞書 API（Gemini 連携） |

## 技術スタック

- **フレームワーク**: Next.js 15 App Router
- **スタイリング**: Tailwind CSS v3 + @tailwindcss/typography
- **言語**: TypeScript
- **デプロイ**: Vercel

## ローカル起動

```bash
npm install
npm run dev
# → http://localhost:3000
```

## コンテンツの追加方法

### フロントエンドに新ページを追加する

1. `content/frontend/[slug].ts` を作成（`DetailPage` 型に合わせて書く）
2. `content/frontend/index.ts` の `frontendItems` 配列にエントリを追加
3. `app/frontend/[slug]/page.tsx` の `contentMap` にインポートを登録

バックエンドも同様の手順です。

### 画像の追加

`public/frontend/` または `public/backend/` に PNG/JPEG を配置し、コンテンツファイルで `src: "/frontend/xxx.png"`（または `/backend/xxx.png`）を指定してください。

```typescript
// content/frontend/xxx.ts の例
{
  type: "image",
  image: {
    src: "/frontend/new-screenshot.png",
    alt: "説明テキスト",
    caption: "キャプション（任意）",
  }
}
```

## ブランチ運用

- `main`: 本番リリース用
- `develop`: 開発用。変更はすべてここに直接マージ

## ディレクトリ構成

```
.
├── app/                     Next.js App Router ページ
│   ├── page.tsx             概要ページ
│   ├── frontend/            フロントエンドセクション
│   └── backend/             バックエンドセクション
├── components/
│   ├── Nav.tsx              グローバルナビゲーション
│   ├── DigestLayout.tsx     ダイジェストページ共通レイアウト
│   ├── DetailLayout.tsx     詳細ページ共通レイアウト
│   └── ImageSlot.tsx        画像コンポーネント（キャプション付き）
├── content/
│   ├── types.ts             ContentBlock / DetailPage 型定義
│   ├── frontend/            フロントエンドコンテンツ
│   └── backend/             バックエンドコンテンツ
└── public/                  静的ファイル（アプリのスクリーンショット等）
```
