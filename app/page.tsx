import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import BubbleField from "@/components/BubbleField";

export const metadata: Metadata = {
  title: "TalkScope — 概要",
};

const problems = [
  { n: "01", title: "聞き取りの壁", desc: "専門用語が多い会話は音声そのものが聞き取りづらく、聞き返すタイミングを逃してしまう。" },
  { n: "02", title: "意味理解の壁", desc: "初めて聞く技術用語の意味が分からず、その後の話の流れについていけなくなる。" },
  { n: "03", title: "重要語把握の壁", desc: "どの単語がキーワードか判断できず、集中すべき箇所やメモのタイミングを見失う。" },
];

const flow = [
  { step: "録音", desc: "Web Speech API（ja-JP）で会話をリアルタイムに取得", icon: "🎙️" },
  { step: "文字起こし", desc: "interim / final を逐次反映、重要語をハイライト", icon: "📝" },
  { step: "NLP 解析", desc: "形態素解析 → 300次元ベクトル化 → スコアリング", icon: "🧠" },
  { step: "バブル化", desc: "重要度に応じたサイズで物理シミュレーション配置", icon: "💬" },
  { step: "意味確認", desc: "クリックで Gemini 由来の説明を表示・ピン留め", icon: "🔍" },
];

const features = [
  { icon: "🎙️", title: "リアルタイム文字起こし", desc: "Web Speech API で会話を即座にテキスト化。重要語はハイライトされ、視線を外さず確認できる。" },
  { icon: "💬", title: "重要語バブル", desc: "NLP で抽出した専門語を重要度に応じたサイズのバブルとして表示。物理エンジンが自然に整列させる。" },
  { icon: "🔍", title: "ワンタップで意味確認", desc: "ホバーで概要、左クリックで詳細、右クリックでピン留め。マウスだけで操作が完結する。" },
  { icon: "📊", title: "発表後の振り返り", desc: "終了後は重要語ランキングへ。どの用語が要だったかを可視化し、振り返りを支える。" },
];

const windows = [
  { src: "/window-transcription.png", label: "文字起こし", desc: "音声をリアルタイムにテキスト化" },
  { src: "/window-bubble.png", label: "バブルクラウド", desc: "重要語を視覚的に浮かべる" },
  { src: "/window-discription.png", label: "説明パネル", desc: "文脈に応じた意味を解説" },
  { src: "/window-history.png", label: "検索履歴", desc: "閲覧した用語を一覧表示" },
];

const stack = [
  "React 19", "TypeScript", "Vite 6", "Bun", "Tailwind CSS v4", "Zustand",
  "FastAPI", "SudachiPy", "GiNZA / spaCy", "pgvector", "Gemini API",
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ──────────── Hero ──────────── */}
      <section className="relative">
        <div className="absolute inset-0 dot-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <BubbleField />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[rgba(var(--accent-rgb),0.07)] blur-[150px] pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-28">
          <div className="max-w-3xl animate-fade-up">
            <div className="eyebrow mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              KC3Hack 2026 — チーム19 ブルードラゴンズ
            </div>

            <h1
              className="font-bold tracking-[-0.03em] leading-[0.9] mb-7"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
            >
              <span className="gradient-text">TalkScope</span>
            </h1>

            <p className="text-xl sm:text-2xl text-zinc-200 max-w-xl leading-snug mb-4 font-light text-balance">
              専門的な会話の理解を、リアルタイムで支援する Web アプリケーション。
            </p>
            <p className="text-sm text-zinc-500 max-w-xl leading-relaxed mb-9">
              音声を文字起こしし、NLP で文脈上重要な語を抽出・スコアリングして強調表示。
              ワンクリックで意味を確認できる導線が、難解な会話の理解を追いかけます。
              この技術解説サイトは、その設計と実装を深掘りします。
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/frontend" className="btn-primary group">
                フロントエンド設計を読む
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/backend" className="btn-ghost">バックエンド設計を読む</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        {/* ──────────── Main screenshot ──────────── */}
        <section className="mb-32 -mt-4">
          <div className="relative">
            <div className="absolute inset-x-8 inset-y-4 bg-[rgba(var(--accent-rgb),0.1)] blur-[70px] rounded-3xl pointer-events-none" />
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.75)]">
              <Image src="/app-bubble.png" alt="TalkScope — バブルクラウド画面" width={1280} height={720} className="w-full h-auto" priority />
            </div>
          </div>
        </section>

        {/* ──────────── Problem ──────────── */}
        <section className="mb-32">
          <p className="kicker mb-4">The Problem</p>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight text-balance">
            専門的な会話で生まれる、3つの理解の壁
          </h2>
          <p className="text-zinc-500 mb-10 max-w-xl leading-relaxed text-sm">
            技術発表、学術的な議論、業界用語が飛び交う商談。専門的な場で生まれる理解の壁を、TalkScope は三方向から取り除きます。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {problems.map((item) => (
              <div key={item.n} className="group relative card card-hover p-8 overflow-hidden">
                <span className="pointer-events-none absolute -top-7 -right-2 font-mono text-[7.5rem] font-bold leading-none text-white/[0.035] select-none tabular-nums">
                  {item.n}
                </span>
                <span className="relative block font-mono text-5xl font-bold gradient-text mb-7 leading-none tabular-nums">
                  {item.n}
                </span>
                <h3 className="relative text-lg font-bold text-zinc-50 mb-3 tracking-tight">{item.title}</h3>
                <p className="relative text-[0.92rem] text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────── How it works ──────────── */}
        <section className="mb-32">
          <p className="kicker mb-4">How it works</p>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">声が、理解に変わるまで</h2>
          <p className="text-zinc-500 mb-10 max-w-xl text-sm leading-relaxed">
            録音から意味確認まで、5つの段が一本のパイプラインとして連携します。フロントとバックエンドが役割を分担し、リアルタイム性と解析精度を両立させています。
          </p>
          <div className="relative">
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.3)] to-transparent" />
            <ol className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4">
              {flow.map((f, i) => (
                <li key={f.step} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 grid place-items-center w-20 h-20 rounded-2xl card mb-5">
                    <span className="text-3xl leading-none">{f.icon}</span>
                    <span className="absolute -top-2.5 -right-2.5 grid place-items-center w-7 h-7 rounded-full bg-accent text-xs font-mono font-bold text-white shadow-[0_4px_14px_-2px_rgba(var(--accent-rgb),0.7)] tabular-nums">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-[0.95rem] font-bold text-zinc-100 mb-2">{f.step}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-[13rem]">{f.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ──────────── Features ──────────── */}
        <section className="mb-32">
          <p className="kicker mb-4">Features</p>
          <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">4つの機能が連携する</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card card-hover p-7 flex gap-5">
                <span className="flex-shrink-0 grid place-items-center w-14 h-14 rounded-2xl text-3xl leading-none bg-[rgba(var(--accent-rgb),0.1)] border border-[rgba(var(--accent-rgb),0.22)]">
                  {f.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-zinc-50 mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-[0.92rem] text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────── Windows ──────────── */}
        <section className="mb-32">
          <p className="kicker mb-4">Workspace</p>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">独立したウィンドウを、自由に配置</h2>
          <p className="text-zinc-500 mb-10 max-w-xl text-sm leading-relaxed">
            各ウィンドウは独立して動作し、ドラッグ＆ドロップで自由に配置・リサイズできます。発表スタイルや画面サイズに合わせて最適なレイアウトを構築できます。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {windows.map((w) => (
              <figure key={w.label} className="card card-hover overflow-hidden group">
                <div className="overflow-hidden bg-ink-deep border-b border-white/[0.05]">
                  <Image src={w.src} alt={w.label} width={400} height={500} className="w-full h-auto object-top group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <figcaption className="px-3 py-2.5">
                  <p className="text-xs font-medium text-zinc-300">{w.label}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">{w.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ──────────── Deep dives ──────────── */}
        <section className="mb-32">
          <p className="kicker mb-4">Deep Dive</p>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">実装のこだわりを、2方向から</h2>
          <p className="text-zinc-500 mb-10 max-w-xl text-sm leading-relaxed">
            アーキテクチャの設計判断から物理エンジン、スコアリングアルゴリズムまで。フロントとバックエンドそれぞれの記事を公開しています。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/frontend" data-accent="frontend" className="group card card-hover p-7">
              <div className="flex items-center justify-between mb-4">
                <span className="tag-pill">Frontend</span>
                <span className="font-mono text-xs text-zinc-600">6 articles</span>
              </div>
              <h3 className="font-semibold text-zinc-100 group-hover:text-accent transition-colors mb-2 text-lg">フロントエンド設計</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                クリーンアーキテクチャ・物理エンジン・動的レイアウト・バブル寿命管理・フェーズシステム・カスタマイズ性。
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                6本の記事を読む
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </span>
            </Link>
            <Link href="/backend" data-accent="backend" className="group card card-hover p-7">
              <div className="flex items-center justify-between mb-4">
                <span className="tag-pill">Backend</span>
                <span className="font-mono text-xs text-zinc-600">4 articles</span>
              </div>
              <h3 className="font-semibold text-zinc-100 group-hover:text-accent transition-colors mb-2 text-lg">バックエンド設計</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                FastAPI のレイヤ構成・多段フォールバック・NLP パイプライン・IDF + EMA スコアリング・Gemini 辞書連携。
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                4本の記事を読む
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </span>
            </Link>
          </div>
        </section>

        {/* ──────────── Tech stack ──────────── */}
        <section>
          <p className="kicker mb-4">Tech Stack</p>
          <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">使用技術</h2>
          <div className="flex flex-wrap gap-2">
            {stack.map((t) => (
              <span key={t} className="tag-plain font-mono">{t}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
