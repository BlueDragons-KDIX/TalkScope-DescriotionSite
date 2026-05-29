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
  { label: "React 19 + TypeScript", color: "blue" },
  { label: "Vite 6 / Bun", color: "amber" },
  { label: "Tailwind CSS v4", color: "sky" },
  { label: "Zustand", color: "orange" },
  { label: "FastAPI", color: "green" },
  { label: "GiNZA / spaCy", color: "purple" },
  { label: "Gemini API", color: "rose" },
  { label: "Cloud Run", color: "indigo" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-900 text-indigo-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          チーム19 ブルードラゴンズ
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6">
          TALKSCOPE
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-4">
          専門的な会話の理解を、リアルタイムで支援する Web アプリケーション。
        </p>
        <p className="text-base text-zinc-500 max-w-2xl leading-relaxed mb-10">
          音声を文字起こしし、文脈上重要な単語を抽出・スコアリングして強調表示。
          ワンクリックで意味を確認できる導線を提供することで、難しい会話の理解を支援します。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/frontend"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            フロントエンドを読む
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/backend"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors"
          >
            バックエンドを読む
          </Link>
        </div>
      </section>

      {/* App screenshot */}
      <section className="mb-24">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          <Image
            src="/app-bubble.png"
            alt="TalkScope アプリ画面"
            width={1200}
            height={675}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* Problem */}
      <section className="mb-24">
        <p className="section-heading mb-6">解決する課題</p>
        <h2 className="text-2xl font-bold text-white mb-4">
          専門的な会話で起きる3つの壁
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { n: "01", title: "聞き取りの壁", desc: "専門用語が多い会話は音声そのものが聞き取りづらく、聞き返すタイミングを逃す。" },
            { n: "02", title: "意味理解の壁", desc: "初めて聞く技術用語の意味がわからず、その後の話の流れについていけなくなる。" },
            { n: "03", title: "重要語把握の壁", desc: "どの単語がキーワードか判断できず、メモを取るタイミングや集中すべき箇所を見失う。" },
          ].map((item) => (
            <div key={item.n} className="card p-5">
              <span className="text-xs font-mono text-indigo-500 mb-3 block">{item.n}</span>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-24">
        <p className="section-heading mb-6">主要機能</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card p-6 flex gap-4">
              <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All windows */}
      <section className="mb-24">
        <p className="section-heading mb-6">4つのウィンドウ</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { src: "/window-transcription.png", label: "文字起こし" },
            { src: "/window-bubble.png", label: "バブルクラウド" },
            { src: "/window-discription.png", label: "説明パネル" },
            { src: "/window-history.png", label: "検索履歴" },
          ].map((w) => (
            <figure key={w.label} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
              <Image src={w.src} alt={w.label} width={400} height={500} className="w-full h-auto object-top" />
              <figcaption className="text-center text-xs text-zinc-500 py-2">{w.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-24">
        <p className="section-heading mb-6">使用技術</p>
        <div className="flex flex-wrap gap-2">
          {techItems.map((t) => (
            <span key={t.label} className="tag-pill">{t.label}</span>
          ))}
        </div>
      </section>

      {/* Deep dives */}
      <section>
        <p className="section-heading mb-6">技術解説</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/frontend"
            className="group card p-6 hover:border-indigo-700/60 hover:bg-zinc-800/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900">Frontend</span>
              <svg className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-100 group-hover:text-indigo-300 mb-2 transition-colors">フロントエンド設計</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">クリーンアーキテクチャ・物理エンジン・動的レイアウト・バブルライフタイム管理など6本のディープダイブ記事。</p>
          </Link>
          <Link
            href="/backend"
            className="group card p-6 hover:border-violet-700/60 hover:bg-zinc-800/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-violet-950 text-violet-400 border border-violet-900">Backend</span>
              <svg className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-zinc-100 group-hover:text-violet-300 mb-2 transition-colors">バックエンド設計</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">GiNZA による形態素解析・300次元ベクトル化・IDF + EMA テーマスコアリングアルゴリズムの詳細解説。</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
