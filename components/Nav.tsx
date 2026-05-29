"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "概要" },
  { href: "/frontend", label: "フロントエンド" },
  { href: "/backend", label: "バックエンド" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14">
      {/* Glass background */}
      <div className="absolute inset-0 bg-[#030309]/85 backdrop-blur-2xl border-b border-white/[0.055]" />

      <div className="relative mx-auto max-w-6xl px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-bold tracking-[0.1em] text-sm gradient-text uppercase">
            TalkScope
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/18">
            KC3Hack
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "text-indigo-300"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-lg bg-indigo-500/10 border border-indigo-500/15" />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-zinc-500 hover:text-zinc-200 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="メニュー"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="relative md:hidden border-t border-white/[0.055] bg-[#030309]/95 backdrop-blur-2xl px-6 py-3 flex flex-col gap-0.5">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-indigo-300 bg-indigo-500/10"
                    : "text-zinc-400 hover:text-zinc-100"
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
