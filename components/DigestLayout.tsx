import Link from "next/link";
import Image from "next/image";
import type { DigestItem } from "@/content/types";

type Props = {
  section: "frontend" | "backend";
  title: string;
  description: string;
  items: DigestItem[];
};

export default function DigestLayout({ section, title, description, items }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-10">
        <Link href="/" className="hover:text-zinc-300 transition-colors">概要</Link>
        <span>/</span>
        <span className="text-zinc-300">{title}</span>
      </nav>

      {/* Hero */}
      <header className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-900 text-indigo-400 text-xs font-medium mb-4">
          <span className={`w-1.5 h-1.5 rounded-full ${section === "frontend" ? "bg-indigo-400" : "bg-violet-400"}`} />
          {section === "frontend" ? "Frontend" : "Backend"}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      </header>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${section}/${item.slug}`}
            className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-700/60 hover:bg-zinc-800/50 transition-all duration-200"
          >
            {/* Cover image */}
            {item.coverImage && (
              <div className="relative h-44 overflow-hidden bg-zinc-950 border-b border-zinc-800">
                <Image
                  src={item.coverImage.src}
                  alt={item.coverImage.alt}
                  fill
                  className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex flex-col gap-3 p-5 flex-1">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>

              <h2 className="text-base font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors leading-snug">
                {item.title}
              </h2>

              <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                {item.description}
              </p>

              <div className="flex items-center gap-1 text-xs text-indigo-400 font-medium mt-auto">
                詳しく読む
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
