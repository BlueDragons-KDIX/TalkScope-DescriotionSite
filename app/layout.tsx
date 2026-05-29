import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "TalkScope — 技術解説",
    template: "%s | TalkScope",
  },
  description:
    "音声をリアルタイムに文字起こしし、文脈上重要な専門語を抽出・スコアリングして強調する会話理解支援アプリ「TalkScope」の技術設計を、フロントエンド／バックエンドの両面から解説する。青龍's（ブルードラゴンズ）。",
  keywords: [
    "TalkScope",
    "会話理解",
    "NLP",
    "GiNZA",
    "FastAPI",
    "React",
    "クリーンアーキテクチャ",
  ],
  authors: [{ name: "青龍's（ブルードラゴンズ）" }],
  openGraph: {
    title: "TalkScope — 技術解説サイト",
    description:
      "音声認識 × NLP で専門的な会話の理解を支援する TalkScope の設計と実装を深掘りする技術解説サイト。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body className="min-h-screen antialiased font-sans">
        <Nav />
        <main className="pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
