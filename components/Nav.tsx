"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "概要" },
  { href: "/frontend", label: "Frontend" },
  { href: "/backend", label: "Backend" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const accent = pathname.startsWith("/backend") ? "backend" : "frontend";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header data-accent={accent} className="fixed top-0 inset-x-0 z-50">
      <div
        className={`absolute inset-0 transition-all duration-300 border-b ${
          scrolled
            ? "bg-ink/80 backdrop-blur-xl border-white/[0.07]"
            : "bg-transparent border-transparent"
        }`}
      />

      <div className="relative mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-pulse-ring" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
          </span>
          <span className="font-bold tracking-[0.04em] text-sm text-zinc-100">
            TalkScope
          </span>
          <span
            className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide tag-pill"
            title="ブルードラゴンズ"
          >
            青龍&apos;s
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            const itemAccent = l.href === "/backend" ? "backend" : "frontend";
            return (
              <Link
                key={l.href}
                href={l.href}
                data-accent={itemAccent}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  active ? "text-accent" : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] border border-[rgba(var(--accent-rgb),0.18)]" />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="メニュー"
          aria-expanded={open}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="relative md:hidden border-t border-white/[0.06] bg-ink/95 backdrop-blur-xl px-6 py-3 flex flex-col gap-1">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            const itemAccent = l.href === "/backend" ? "backend" : "frontend";
            return (
              <Link
                key={l.href}
                href={l.href}
                data-accent={itemAccent}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "text-accent bg-[rgba(var(--accent-rgb),0.1)]" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
