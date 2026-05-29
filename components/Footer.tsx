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

        <a
          href="https://github.com/BlueDragons-KDIX/TalkScope"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-7 mb-8 rounded-2xl border-2 border-[rgba(var(--accent-rgb),0.28)] bg-gradient-to-br from-[rgba(var(--accent-rgb),0.12)] via-ink-surface to-[rgba(var(--accent-2-rgb),0.08)] transition-all duration-300 hover:border-[rgba(var(--accent-rgb),0.5)] hover:shadow-[0_0_48px_-12px_rgba(var(--accent-rgb),0.45)]"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="flex-shrink-0 grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/[0.06] border border-white/10 text-zinc-100 transition-transform duration-300 group-hover:scale-105">
              <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-1.125-.195-2.31-.975-2.31-2.085 0-.915.33-1.665.855-2.13-.09-.225-.375-1.155.075-2.385 0 0 .705-.225 2.31.855a7.8 7.8 0 012.1-.285c.705 0 1.41.105 2.1.285 1.605-1.095 2.31-.855 2.31-.855.465 1.23.18 2.16.09 2.385.525.465.855 1.215.855 2.13 0 1.125-1.185 1.875-2.31 2.085-.51.285-1.095 1.35-1.23 1.695-.24.675-1.02 1.965-4.035 1.41 0 1.005-.015 1.95-.015 2.235 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-zinc-50 tracking-tight mb-1 group-hover:text-accent-soft transition-colors">
                TalkScope on GitHub
              </p>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                アプリ本体のソースコード・Issue・開発履歴はこちら
              </p>
              <p className="mt-1.5 text-xs sm:text-sm font-mono text-zinc-500 truncate">
                github.com/BlueDragons-KDIX/TalkScope
              </p>
            </div>
          </div>
          <span className="inline-flex items-center justify-center gap-2 flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent)] to-[rgb(var(--accent-2-rgb))] shadow-[0_0_24px_-6px_rgba(var(--accent-rgb),0.6)] transition-all duration-300 group-hover:brightness-110">
            リポジトリを見る
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </span>
        </a>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            青龍&apos;s
            <span className="text-zinc-600">（ブルードラゴンズ）</span>
          </p>
          <p className="text-xs text-zinc-700 font-mono">
            Built with Next.js · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
