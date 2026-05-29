import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TalkScope — 概要",
};

const features = [
  {
    icon: "🎙️",
    title: "リアルタイム文字起こし",
    desc: "Web Speech API（ja-JP）で会話を即座にテキスト化。重要語はハイライト表示され、視線を外さず確認できる。",
  },
  {
    icon: "💬",
    title: "重要語バブル",
    desc: "NLP で抽出された専門語・重要語が重要度に応じたサイズのバブルとして浮かぶ。物理エンジンで自然な配置。",
  },
  {
    icon: "🔍",
    title: "ワンタップで意味確認",
    desc: "ホバーで概要、左クリックで詳細パネルを表示。Gemini API が文脈に応じた説明を返す。右クリックでピン留め。",
  },
  {
    icon: "📊",
    title: "発表後の振り返り",
    desc: "発表終了後は重要語ランキングが表示され、「どの用語が重要だったか」を可視化して振り返りをサポート。",
  },
];

const techItems = [
  "React 19",
  "TypeScript",
  "Vite 6",
  "Bun",
  "Tailwind CSS v4",
  "Zustand",
  "FastAPI",
  "GiNZA / spaCy",
  "Gemini API",
  "Cloud Run",
];

const windows = [
  {
    src: "/window-transcription.png",
    label: "文字起こし",
    desc: "音声をリアルタイムでテキスト化",
  },
  {
    src: "/window-bubble.png",
    label: "バブルクラウド",
    desc: "重要語を視覚的に浮かべる",
  },
  {
    src: "/window-discription.png",
    label: "説明パネル",
    desc: "Gemini が文脈を解説",
  },
  {
    src: "/window-history.png",
    label: "検索履歴",
    desc: "閲覧した用語を一覧表示",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-32">

      {/* ──────────── Hero ──────────── */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid opacity-100 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_0%,black,transparent)]" />

        {/* Ambient orbs */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-indigo-600/[0.07] blur-[140px] pointer-events-none" />
        <div className="absolute top-24 -right-32 w-[600px] h-[500px] rounded-full bg-violet-600/[0.05] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-[500px] h-[400px] rounded-full bg-blue-700/[0.04] blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-indigo-500/[0.08] border border-indigo-500/20 text-indigo-300 text-xs font-medium tracking-wide mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            KC3Hack 2026 — チーム19 ブルードラゴンズ
          </div>

          {/* Title */}
          <h1
            className="font-bold tracking-[-0.03em] leading-[0.92] mb-8"
            style={{ fontSize: "clamp(4rem, 10vw, 7.5rem)" }}
          >
            <span className="gradient-text">TalkScope</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-zinc-300 max-w-xl leading-relaxed mb-3 font-light">
            専門的な会話の理解を、
            <br className="hidden sm:block" />
            リアルタイムで支援する Web アプリケーション。
          </p>
          <p className="text-sm text-zinc-500 max-w-xl leading-relaxed mb-10">
            音声を文字起こしし、NLP で重要語を抽出・スコアリングして強調表示。
            ワンクリックで意味を確認できる導線を提供することで、
            難解な会話のリアルタイム理解を支援します。
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/frontend"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-indigo-600 to-violet-600 shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:shadow-[0_0_36px_rgba(99,102,241,0.45)] hover:brightness-110 transition-all duration-200"
            >
              フロントエンドを読む
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/backend"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 text-sm font-medium hover:bg-white/[0.07] hover:border-white/[0.14] hover:text-zinc-100 transition-all duration-200"
            >
              バックエンドを読む
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────── Main screenshot ──────────── */}
      <section className="mb-32">
        <div className="relative">
          {/* Glow halo behind image */}
          <div className="absolute inset-x-8 inset-y-4 bg-indigo-500/[0.09] blur-[60px] rounded-3xl pointer-events-none" />
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04)]">
            <Image
              src="/app-bubble.png"
              alt="TalkScope — バブルクラウド画面"
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* ──────────── Problem ──────────── */}
      <section className="mb-32">
        <p className="section-heading mb-5">解決する課題</p>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          専門的な会話で生まれる、
          <br className="hidden sm:block" />3つの理解の壁
        </h2>
        <p className="text-zinc-500 mb-10 max-w-xl leading-relaxed text-sm">
          技術的な発表・学術的な議論・業界用語が飛び交う商談。専門的な場で生まれる理解の壁を、TalkScope は三方向から取り除きます。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              n: "01",
              title: "聞き取りの壁",
              desc: "専門用語が多い会話は音声そのものが聞き取りづらく、聞き返すタイミングを逃す。",
            },
            {
              n: "02",
              title: "意味理解の壁",
              desc: "初めて聞く技術用語の意味がわからず、その後の話の流れについていけなくなる。",
            },
            {
              n: "03",
              title: "重要語把握の壁",
              desc: "どの単語がキーワードか判断できず、メモを取るタイミングや集中すべき箇所を見失う。",
            },
          ].map((item) => (
            <div key={item.n} className="card p-6">
              <span className="block font-mono text-2xl font-bold gradient-text mb-4 leading-none">
                {item.n}
              </span>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── Features ──────────── */}
      <section className="mb-32">
        <p className="section-heading mb-5">主要機能</p>
        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">
          4つの機能が連携する
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card card-hover p-6 flex gap-4">
              <span className="text-2xl flex-shrink-0 leading-none mt-0.5">
                {f.icon}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">
                  {f.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── 4 windows ──────────── */}
      <section className="mb-32">
        <p className="section-heading mb-5">4つのウィンドウ</p>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          独立したウィンドウで
          <br className="hidden sm:block" />
          自由に配置
        </h2>
        <p className="text-zinc-500 mb-10 max-w-xl text-sm leading-relaxed">
          各ウィンドウは独立して動作し、ドラッグ&ドロップで自由に配置できます。
          発表スタイルや画面サイズに合わせて最適なレイアウトを構築できます。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {windows.map((w) => (
            <figure key={w.label} className="card card-hover overflow-hidden group">
              <div className="overflow-hidden bg-zinc-950 border-b border-white/[0.05]">
                <Image
                  src={w.src}
                  alt={w.label}
                  width={400}
                  height={500}
                  className="w-full h-auto object-top group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <figcaption className="px-3 py-2.5">
                <p className="text-xs font-medium text-zinc-300">{w.label}</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">{w.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ──────────── Full app screenshot ──────────── */}
      <section className="mb-32">
        <p className="section-heading mb-5">カスタマイズ</p>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          完全にあなた好みに
        </h2>
        <p className="text-zinc-500 mb-10 max-w-xl text-sm leading-relaxed">
          アクセントカラー・ダークモード・文字サイズ・IT単語フィルターを自由に調整できます。
        </p>
        <div className="relative">
          <div className="absolute inset-x-8 inset-y-4 bg-violet-500/[0.07] blur-[60px] rounded-3xl pointer-events-none" />
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
            <Image
              src="/app-fullcustom.png"
              alt="TalkScope — カスタマイズ画面"
              width={1200}
              height={675}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ──────────── Tech stack ──────────── */}
      <section className="mb-32">
        <p className="section-heading mb-5">使用技術</p>
        <div className="flex flex-wrap gap-2">
          {techItems.map((t) => (
            <span key={t} className="tag-pill">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ──────────── Deep dives ──────────── */}
      <section>
        <p className="section-heading mb-5">技術解説</p>
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          実装のこだわりを語る
        </h2>
        <p className="text-zinc-500 mb-10 max-w-xl text-sm leading-relaxed">
          アーキテクチャの設計判断から物理エンジンの実装、スコアリングアルゴリズムまで。
          各テーマを掘り下げた記事を公開しています。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/frontend" className="group card card-hover p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="tag-pill">Frontend</span>
              <svg
                className="w-4 h-4 text-zinc-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-150"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors mb-2 text-base">
              フロントエンド設計
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              クリーンアーキテクチャ・物理エンジン・動的レイアウト・バブルライフタイム管理など
              6本のディープダイブ記事。
            </p>
            <div className="mt-5 text-xs text-indigo-400 font-medium tracking-wide">
              6本の記事を読む →
            </div>
          </Link>
          <Link href="/backend" className="group card card-hover p-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(167, 139, 250, 0.1)",
                  color: "#c4b5fd",
                  border: "1px solid rgba(167,139,250,0.18)",
                }}
              >
                Backend
              </span>
              <svg
                className="w-4 h-4 text-zinc-700 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all duration-150"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-100 group-hover:text-violet-300 transition-colors mb-2 text-base">
              バックエンド設計
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              GiNZA による形態素解析・300次元ベクトル化・IDF + EMA
              テーマスコアリングアルゴリズムの詳細解説。
            </p>
            <div className="mt-5 text-xs text-violet-400 font-medium tracking-wide">
              Coming soon →
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
