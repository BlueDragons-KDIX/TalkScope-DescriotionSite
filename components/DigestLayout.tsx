import Link from "next/link";
import Image from "next/image";
import type { DigestItem } from "@/content/types";

type Props = {
  section: "frontend" | "backend";
  title: string;
  description: string;
  items: DigestItem[];
};

export default function DigestLayout({
  section,
  title,
  description,
  items,
}: Props) {
  const isFront = section === "frontend";

  return (
    <div className="mx-auto max-w-6xl px-6 pb-32">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-600 pt-8 mb-12">
        <Link href="/" className="hover:text-zinc-400 transition-colors">
          概要
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-400">{title}</span>
      </nav>

      {/* Hero */}
      <header className="relative pb-16 mb-16 overflow-hidden">
        {/* Ambient orb */}
        <div
          className={`absolute -top-10 left-0 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none ${
            isFront ? "bg-indigo-600/[0.06]" : "bg-violet-600/[0.06]"
          }`}
        />
        <div className="relative">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide mb-5 ${
              isFront
                ? "bg-indigo-500/[0.08] border border-indigo-500/20 text-indigo-300"
                : "bg-violet-500/[0.08] border border-violet-500/20 text-violet-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFront ? "bg-indigo-400" : "bg-violet-400"
              }`}
            />
            {isFront ? "Frontend" : "Backend"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            {title}
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">{description}</p>
        </div>
        <div className="divider mt-14" />
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${section}/${item.slug}`}
            className="group flex flex-col card card-hover overflow-hidden"
          >
            {/* Cover image */}
            {item.coverImage && (
              <div className="relative h-44 overflow-hidden bg-zinc-950 border-b border-white/[0.055]">
                <Image
                  src={item.coverImage.src}
                  alt={item.coverImage.alt}
                  fill
                  className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
                />
                {/* Bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16]/60 via-transparent to-transparent" />
              </div>
            )}

            <div className="flex flex-col gap-3 p-5 flex-1">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <h2
                className={`text-[0.9375rem] font-semibold text-zinc-100 transition-colors leading-snug ${
                  isFront
                    ? "group-hover:text-indigo-300"
                    : "group-hover:text-violet-300"
                }`}
              >
                {item.title}
              </h2>

              <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                {item.description}
              </p>

              <div
                className={`flex items-center gap-1 text-xs font-medium mt-auto ${
                  isFront ? "text-indigo-400" : "text-violet-400"
                }`}
              >
                詳しく読む
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
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
