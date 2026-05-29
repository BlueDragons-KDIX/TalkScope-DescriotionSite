import Link from "next/link";
import Image from "next/image";
import type { DigestItem, DigestGroup } from "@/content/types";

type Props = {
  section: "frontend" | "backend";
  title: string;
  description: string;
  items: DigestItem[];
  stack?: string[];
  /** 指定すると記事をグループ見出し付きで分類表示する */
  groups?: DigestGroup[];
};

function DigestCard({
  item,
  section,
  i,
}: {
  item: DigestItem;
  section: "frontend" | "backend";
  i: number;
}) {
  return (
    <Link
      href={`/${section}/${item.slug}`}
      className="group flex flex-col card card-hover overflow-hidden animate-fade-up"
      style={{ animationDelay: `${i * 60}ms` }}
    >
      {item.coverImage ? (
        <div className="relative h-44 overflow-hidden bg-ink-deep border-b border-white/[0.06]">
          <Image
            src={item.coverImage.src}
            alt={item.coverImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
            className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="relative h-32 overflow-hidden bg-ink-deep border-b border-white/[0.06] flex items-center justify-center">
          <span className="font-mono text-5xl font-bold text-[rgba(var(--accent-rgb),0.18)] select-none">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="absolute inset-0 dot-grid opacity-40" />
        </div>
      )}

      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>

        <h2 className="text-[0.95rem] font-semibold text-zinc-100 group-hover:text-accent transition-colors leading-snug">
          {item.title}
        </h2>

        <p className="text-sm text-zinc-500 leading-relaxed flex-1">
          {item.description}
        </p>

        <div className="flex items-center gap-1 text-xs font-medium mt-auto text-accent">
          詳しく読む
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function DigestLayout({
  section,
  title,
  description,
  items,
  stack,
  groups,
}: Props) {
  const label = section === "frontend" ? "Frontend" : "Backend";

  return (
    <div data-accent={section} className="mx-auto max-w-6xl px-6 pb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-600 pt-8 mb-10">
        <Link href="/" className="hover:text-zinc-400 transition-colors">概要</Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-400">{title}</span>
      </nav>

      {/* Hero */}
      <header className="relative pb-12 mb-12 overflow-hidden animate-fade-up">
        <div className="absolute -top-16 -left-10 w-[640px] h-[340px] rounded-full blur-[130px] pointer-events-none bg-[rgba(var(--accent-rgb),0.08)]" />
        <div className="relative">
          <div className="eyebrow mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {label}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5 leading-[1.08] text-balance">
            {title}
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed text-[0.95rem]">
            {description}
          </p>
          {stack && stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {stack.map((t) => (
                <span key={t} className="tag-plain font-mono">{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="divider mt-12" />
      </header>

      {/* Cards */}
      {groups && groups.length > 0 ? (
        <div className="space-y-16">
          {groups.map((group, gi) => (
            <section key={group.id}>
              <div className="flex items-start gap-4 mb-7">
                <span className="flex-shrink-0 grid place-items-center w-12 h-12 rounded-2xl text-2xl leading-none bg-[rgba(var(--accent-rgb),0.1)] border border-[rgba(var(--accent-rgb),0.25)]">
                  {group.icon ?? String(gi + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="font-mono text-xs font-semibold text-accent tabular-nums">
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {group.title}
                    </h2>
                    <span className="ml-1 text-xs font-mono text-zinc-600">
                      {group.items.length} articles
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
                    {group.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.items.map((item, i) => (
                  <DigestCard key={item.slug} item={item} section={section} i={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <DigestCard key={item.slug} item={item} section={section} i={i} />
          ))}
        </div>
      )}
    </div>
  );
}
