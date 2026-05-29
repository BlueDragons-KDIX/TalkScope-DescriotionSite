import Link from "next/link";

const cols = [
  {
    title: "技術解説",
    links: [
      { href: "/", label: "概要" },
      { href: "/frontend", label: "フロントエンド設計" },
      { href: "/backend", label: "バックエンド設計" },
    ],
  },
  {
    title: "Frontend",
    links: [
      { href: "/frontend/clean-architecture", label: "クリーンアーキテクチャ" },
      { href: "/frontend/bubble-physics", label: "バブル物理エンジン" },
      { href: "/frontend/layout-engine", label: "レイアウトエンジン" },
    ],
  },
  {
    title: "Backend",
    links: [
      { href: "/backend/nlp-pipeline", label: "NLP パイプライン" },
      { href: "/backend/scoring-algorithm", label: "スコアリング" },
      { href: "/backend/dictionary-api", label: "辞書 API" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="font-bold tracking-[0.04em] text-sm text-zinc-100">
                TalkScope
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[22ch]">
              専門的な会話の理解を、リアルタイムで支援する Web アプリケーション。
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="kicker mb-3 text-zinc-500">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider my-8" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            KC3Hack 2026 出展作品 — チーム19 ブルードラゴンズ
          </p>
          <p className="text-xs text-zinc-700 font-mono">
            Built with Next.js · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
