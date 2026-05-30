import type { Metadata } from "next";
import Link from "next/link";
import DigestLayout from "@/components/DigestLayout";
import { backendDigest, backendItems, backendStack } from "@/content/backend/index";

export const metadata: Metadata = {
  title: "バックエンド設計",
  description: backendDigest.description,
};

const flow = [
  {
    href: "/backend/architecture",
    label: "Input",
    title: "文字起こしテキストを受け取る",
    body: "フロントから届いた短い発話テキストを FastAPI が受け取り、辞書参照とスコア返却のパイプラインを開始する。",
    tags: ["FastAPI", "Request", "Session"],
  },
  {
    href: "/backend/nlp-pipeline",
    label: "Extract",
    title: "検索対象の語を抽出する",
    body: "形態素解析で名詞を拾い、連続名詞を複合語にまとめる。重複、1文字語、一般語、ブラックリスト語を落として候補を絞る。",
    tags: ["NLP", "Compound", "Filter"],
  },
  {
    href: "/backend/dictionary-api",
    label: "Parallel I/O",
    title: "文脈ベクトル化と DB 参照を並行する",
    body: "入力文の embedding を作りながら、同時に候補語を DB へバッチ問い合わせする。I/O 待ちの間に別タスクを進める。",
    tags: ["Embedding", "DB Batch", "Async"],
  },
  {
    href: "/backend/dictionary-api",
    label: "First Paint",
    title: "DB ヒット分を先に返す",
    body: "辞書に既にある語は Gemini を待たずに SSE で即返す。最初の表示を早めて、待っている感覚を減らす。",
    tags: ["DB Hit", "SSE", "UX"],
  },
  {
    href: "/backend/dictionary-api",
    label: "LLM Fill",
    title: "未知語だけ Gemini で補完する",
    body: "DB ミスした語だけをグループ化して Gemini に投げる。プロンプト単位で完了した結果から順に embedding し、後続イベントとして流す。",
    tags: ["Gemini", "Timeout", "Batch"],
  },
  {
    href: "/backend/scoring-algorithm",
    label: "Score",
    title: "スコアを付けて表示へ流す",
    body: "入力文と語義のベクトル類似度を中心にスコアを計算し、term、description、score、source を SSE でフロントへ届ける。",
    tags: ["Similarity", "Score", "Stream"],
  },
];

function BackendFlow() {
  return (
    <section className="animate-fade-up" aria-labelledby="backend-flow-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
        <div>
          <p className="kicker mb-2">Processing Flow</p>
          <h2 id="backend-flow-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            TalkScope バックエンドの処理フロー
          </h2>
        </div>
        <p className="max-w-xl text-sm text-zinc-400 leading-relaxed">
          実行時の順番に沿って、重い処理を待たせないための分岐と並列化を並べています。
        </p>
      </div>

      <ol className="relative">
        <span className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-[rgba(var(--accent-rgb),0.72)] via-white/10 to-transparent" />
        {flow.map((node, i) => (
          <li key={node.href} className="relative flex gap-5 pb-5 last:pb-0">
            <span className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-ink-surface border border-[rgba(var(--accent-rgb),0.45)] text-accent font-mono text-base font-bold flex items-center justify-center shadow-[0_4px_16px_-6px_rgba(var(--accent-rgb),0.65)] tabular-nums">
              {i + 1}
            </span>

            <Link
              href={node.href}
              className="group relative surface-panel card-hover px-5 py-4 min-w-0 flex-1 overflow-hidden"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.72)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
                <p className="text-[0.95rem] font-bold text-zinc-50 tracking-tight group-hover:text-accent transition-colors">
                  {node.title}
                </p>
                <span className="w-fit text-[10px] uppercase tracking-widest font-mono text-zinc-500">
                  {node.label}
                </span>
              </div>

              <p className="text-[0.92rem] text-zinc-300 leading-relaxed max-w-3xl">
                {node.body}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 mt-3 pr-8">
                {node.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>

              <span className="absolute bottom-4 right-5 text-accent opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function BackendPage() {
  return (
    <DigestLayout
      section="backend"
      title={backendDigest.title}
      description={backendDigest.description}
      items={backendItems}
      stack={backendStack}
      introSlot={<BackendFlow />}
    />
  );
}
