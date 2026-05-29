import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: {
    default: "TalkScope",
    template: "%s | TalkScope",
  },
  description:
    "専門的な会話の理解をリアルタイムで支援するWebアプリケーション。チーム19 ブルードラゴンズ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
        <Nav />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
