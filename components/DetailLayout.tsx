import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import type { DetailPage, ContentBlock } from "@/content/types";

type Props = {
  section: "frontend" | "backend";
  sectionLabel: string;
  page: DetailPage;
};

// Module-level constants — avoid object recreation on every renderBlock call
// (rendering-hoist-jsx / js-cache-function-results)
const CALLOUT_STYLES = {
  info: {
    wrap: "border-indigo-500/25 bg-indigo-500/[0.07]",
    text: "text-indigo-200",
    icon: "text-indigo-400",
  },
  tip: {
    wrap: "border-emerald-500/25 bg-emerald-500/[0.07]",
    text: "text-emerald-200",
    icon: "text-emerald-400",
  },
  warning: {
    wrap: "border-amber-500/25 bg-amber-500/[0.07]",
    text: "text-amber-200",
    icon: "text-amber-400",
  },
} as const;

const CALLOUT_ICONS = { info: "ℹ", tip: "✓", warning: "⚠" } as const;

function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case "text":
      return (
        <div
          key={idx}
          className="prose-ts"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );

    case "image":
      return (
        <ImageSlot
          key={idx}
          src={block.image.src}
          alt={block.image.alt}
          caption={block.image.caption}
        />
      );

    case "images":
      return (
        <div
          key={idx}
          className={
            block.layout === "row"
              ? "flex flex-col sm:flex-row gap-4 my-6"
              : "grid grid-cols-1 sm:grid-cols-2 gap-4 my-6"
          }
        >
          {block.images.map((img, i) => (
            <ImageSlot
              key={i}
              src={img.src}
              alt={img.alt}
              caption={img.caption}
              className="my-0"
            />
          ))}
        </div>
      );

    case "code":
      return (
        <div key={idx} className="my-6">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a18] border border-white/[0.065] rounded-t-xl border-b-0">
            <span className="text-[11px] text-zinc-500 font-mono tracking-wider">
              {block.code.lang}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
          </div>
          <pre className="overflow-x-auto rounded-b-xl bg-[#05050d] border border-white/[0.065] border-t-0 p-5">
            <code className="text-[0.8125rem] font-mono text-zinc-200 leading-relaxed whitespace-pre">
              {block.code.code}
            </code>
          </pre>
        </div>
      );

    case "callout": {
      const s = CALLOUT_STYLES[block.variant];
      return (
        <div
          key={idx}
          className={`flex gap-3 p-4 rounded-xl border my-6 ${s.wrap}`}
        >
          <span className={`text-base leading-none mt-0.5 ${s.icon}`}>
            {CALLOUT_ICONS[block.variant]}
          </span>
          <p className={`text-sm leading-relaxed ${s.text}`}>
            {block.content}
          </p>
        </div>
      );
    }

    case "list":
      return (
        <ul key={idx} className="my-4 space-y-2.5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-zinc-300 text-sm leading-relaxed"
            >
              <span className="mt-2 w-1 h-1 rounded-full bg-indigo-500/70 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

export default function DetailLayout({
  section,
  sectionLabel,
  page,
}: Props) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-32">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-600 pt-8 mb-12">
        <Link href="/" className="hover:text-zinc-400 transition-colors">
          概要
        </Link>
        <span className="text-zinc-700">/</span>
        <Link
          href={`/${section}`}
          className="hover:text-zinc-400 transition-colors"
        >
          {sectionLabel}
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-400 truncate max-w-[200px]">{page.title}</span>
      </nav>

      <div className="flex gap-14">
        {/* Sidebar TOC */}
        <aside className="hidden xl:block w-52 flex-shrink-0">
          <div className="sticky top-24">
            <p className="section-heading mb-4">目次</p>
            <nav className="flex flex-col gap-0.5">
              {page.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-[0.8125rem] text-zinc-600 hover:text-zinc-300 py-1.5 px-3 rounded-r-md border-l border-zinc-800/80 hover:border-indigo-500/50 hover:bg-indigo-500/[0.04] transition-all duration-150 truncate"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Article */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-5">
              {page.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
              {page.title}
            </h1>
            <p className="text-zinc-400 leading-relaxed max-w-prose">
              {page.description}
            </p>
            <div className="divider mt-8" />
          </header>

          {/* Sections */}
          {page.sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="mb-16 scroll-mt-24">
              <h2 className="text-lg font-bold text-zinc-100 mb-5 flex items-center gap-3">
                <span className="w-0.5 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 flex-shrink-0" />
                {sec.heading}
              </h2>
              {sec.blocks.map((block, idx) => renderBlock(block, idx))}
            </section>
          ))}

          {/* Footer nav */}
          <div className="divider mb-8" />
          <div className="flex justify-between">
            <Link
              href={`/${section}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {sectionLabel}一覧に戻る
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
