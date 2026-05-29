import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import ArticleToc from "@/components/ArticleToc";
import { renderBlock } from "@/components/ContentBlocks";
import type { DetailPage } from "@/content/types";

type NavItem = { slug: string; title: string };

type Props = {
  section: "frontend" | "backend";
  sectionLabel: string;
  page: DetailPage;
  prev?: NavItem | null;
  next?: NavItem | null;
};

export default function DetailLayout({
  section,
  sectionLabel,
  page,
  prev,
  next,
}: Props) {
  const tocItems = page.sections.map((s) => ({ id: s.id, heading: s.heading }));

  return (
    <div data-accent={section} className="mx-auto max-w-6xl px-6 pb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-600 pt-8 mb-10">
        <Link href="/" className="hover:text-zinc-400 transition-colors">概要</Link>
        <span className="text-zinc-700">/</span>
        <Link href={`/${section}`} className="hover:text-zinc-400 transition-colors">
          {sectionLabel}
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-400 truncate max-w-[200px]">{page.title}</span>
      </nav>

      <div className="flex gap-14">
        {/* Sidebar TOC */}
        <aside className="hidden xl:block w-52 flex-shrink-0">
          <ArticleToc items={tocItems} />
        </aside>

        {/* Article */}
        <article className="flex-1 min-w-0 animate-fade-up">
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-5">
              {page.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-[2.6rem] font-bold tracking-tight text-white mb-4 leading-[1.12] text-balance">
              {page.title}
            </h1>
            <p className="surface-panel px-5 py-4 text-zinc-300 leading-relaxed max-w-prose text-[0.95rem]">
              {page.description}
            </p>
            <div className="divider mt-8" />
          </header>

          {page.heroImage && (
            <ImageSlot
              src={page.heroImage.src}
              alt={page.heroImage.alt}
              caption={page.heroImage.caption}
              priority
              className="mt-0 mb-10"
            />
          )}

          {page.intro && (
            <div
              className="surface-panel px-5 py-4 text-lg sm:text-xl leading-[1.7] text-zinc-200 font-light mb-12 text-pretty"
              dangerouslySetInnerHTML={{ __html: page.intro }}
            />
          )}

          {page.sections.map((sec, si) => (
            <section key={sec.id} id={sec.id} className="mb-14 scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-6 flex items-baseline gap-3 tracking-tight">
                <span className="num-badge select-none">
                  {String(si + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{sec.heading}</span>
              </h2>
              <div className="pl-0 sm:pl-[2.4rem]">
                {sec.blocks.map((block, idx) => renderBlock(block, idx))}
              </div>
            </section>
          ))}

          {/* Prev / Next */}
          <div className="divider mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prev ? (
              <Link
                href={`/${section}/${prev.slug}`}
                className="card card-hover p-4 group"
              >
                <p className="text-[11px] text-zinc-600 mb-1 font-mono">← 前の記事</p>
                <p className="text-sm font-medium text-zinc-200 group-hover:text-accent transition-colors leading-snug">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/${section}/${next.slug}`}
                className="card card-hover p-4 group text-right"
              >
                <p className="text-[11px] text-zinc-600 mb-1 font-mono">次の記事 →</p>
                <p className="text-sm font-medium text-zinc-200 group-hover:text-accent transition-colors leading-snug">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
          </div>

          <div className="mt-8">
            <Link
              href={`/${section}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              {sectionLabel}一覧に戻る
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
