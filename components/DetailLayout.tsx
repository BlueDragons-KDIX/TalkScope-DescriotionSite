import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import type { DetailPage, ContentBlock } from "@/content/types";

type Props = {
  section: "frontend" | "backend";
  sectionLabel: string;
  page: DetailPage;
};

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
            <ImageSlot key={i} src={img.src} alt={img.alt} caption={img.caption} className="my-0" />
          ))}
        </div>
      );

    case "code":
      return (
        <div key={idx} className="my-6">
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-t-xl border-b-0">
            <span className="text-xs text-zinc-500 font-mono">{block.code.lang}</span>
          </div>
          <pre className="overflow-x-auto rounded-b-xl bg-zinc-950 border border-zinc-800 border-t-0 p-4">
            <code className="text-sm font-mono text-zinc-200 leading-relaxed whitespace-pre">
              {block.code.code}
            </code>
          </pre>
        </div>
      );

    case "callout":
      const colors = {
        info: "border-indigo-800 bg-indigo-950/40 text-indigo-200",
        tip: "border-emerald-800 bg-emerald-950/40 text-emerald-200",
        warning: "border-amber-800 bg-amber-950/40 text-amber-200",
      };
      const icons = { info: "ℹ", tip: "✓", warning: "⚠" };
      return (
        <div
          key={idx}
          className={`flex gap-3 p-4 rounded-xl border my-6 ${colors[block.variant]}`}
        >
          <span className="text-lg leading-none mt-0.5">{icons[block.variant]}</span>
          <p className="text-sm leading-relaxed">{block.content}</p>
        </div>
      );

    case "list":
      return (
        <ul key={idx} className="my-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

export default function DetailLayout({ section, sectionLabel, page }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-10">
        <Link href="/" className="hover:text-zinc-300 transition-colors">概要</Link>
        <span>/</span>
        <Link href={`/${section}`} className="hover:text-zinc-300 transition-colors">{sectionLabel}</Link>
        <span>/</span>
        <span className="text-zinc-300">{page.title}</span>
      </nav>

      <div className="flex gap-12">
        {/* Sidebar TOC */}
        <aside className="hidden xl:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <p className="section-heading mb-4">このページの内容</p>
            <nav className="flex flex-col gap-1">
              {page.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-sm text-zinc-500 hover:text-zinc-200 py-1 pl-3 border-l border-zinc-800 hover:border-indigo-600 transition-colors truncate"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {page.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              {page.title}
            </h1>
            <p className="text-zinc-400 leading-relaxed text-base">{page.description}</p>
          </header>

          {/* Sections */}
          {page.sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-16 scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-zinc-800">
                {section.heading}
              </h2>
              {section.blocks.map((block, idx) => renderBlock(block, idx))}
            </section>
          ))}

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-zinc-800 flex justify-between">
            <Link
              href={`/${section}`}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {sectionLabel}一覧に戻る
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
