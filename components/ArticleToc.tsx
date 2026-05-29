"use client";

import { useEffect, useState } from "react";

type Item = { id: string; heading: string };

export default function ArticleToc({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(1, doc.scrollTop / total) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <div className="sticky top-24">
      <p className="kicker mb-4 text-zinc-500">目次</p>
      <nav className="flex flex-col gap-0.5">
        {items.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`text-[0.8125rem] py-1.5 px-3 rounded-r-md border-l transition-all duration-150 truncate ${
                isActive
                  ? "text-accent border-[rgba(var(--accent-rgb),0.7)] bg-[rgba(var(--accent-rgb),0.06)]"
                  : "text-zinc-600 border-zinc-800/80 hover:text-zinc-300 hover:border-zinc-600"
              }`}
            >
              {s.heading}
            </a>
          );
        })}
      </nav>
      <div className="mt-5 px-3">
        <div className="h-0.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] font-mono text-zinc-600">
          {Math.round(progress * 100)}% 読了
        </p>
      </div>
    </div>
  );
}
