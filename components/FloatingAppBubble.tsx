"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

const APP_URL = "https://talk-scope-kohl.vercel.app/";

type BubbleTheme = {
  c1: string;
  c2: string;
  c3: string;
  ring: string;
  glow: string;
  text: string;
};

/** 赤・青・黄・緑・紫・水色の明るいパレット */
const PALETTES = {
  red: {
    c1: "255, 130, 130",
    c2: "239, 68, 68",
    c3: "251, 113, 133",
    ring: "rgba(254, 180, 180, 0.95)",
    glow: "rgba(248, 113, 113, 0.85)",
    text: "#fff7f7",
  },
  blue: {
    c1: "147, 197, 253",
    c2: "59, 130, 246",
    c3: "96, 165, 250",
    ring: "rgba(191, 219, 254, 0.95)",
    glow: "rgba(59, 130, 246, 0.85)",
    text: "#f0f7ff",
  },
  yellow: {
    c1: "253, 230, 138",
    c2: "250, 204, 21",
    c3: "253, 224, 71",
    ring: "rgba(254, 240, 138, 0.95)",
    glow: "rgba(250, 204, 21, 0.85)",
    text: "#422006",
  },
  green: {
    c1: "134, 239, 172",
    c2: "34, 197, 94",
    c3: "74, 222, 128",
    ring: "rgba(187, 247, 208, 0.95)",
    glow: "rgba(34, 197, 94, 0.85)",
    text: "#f0fdf4",
  },
  purple: {
    c1: "216, 180, 254",
    c2: "168, 85, 247",
    c3: "192, 132, 252",
    ring: "rgba(233, 213, 255, 0.95)",
    glow: "rgba(168, 85, 247, 0.85)",
    text: "#faf5ff",
  },
  cyan: {
    c1: "103, 232, 249",
    c2: "6, 182, 212",
    c3: "34, 211, 238",
    ring: "rgba(165, 243, 252, 0.95)",
    glow: "rgba(6, 182, 212, 0.85)",
    text: "#ecfeff",
  },
} satisfies Record<string, BubbleTheme>;

const ROUTE_THEMES: Record<string, keyof typeof PALETTES> = {
  "/": "cyan",
  "/frontend": "purple",
  "/frontend/clean-architecture": "blue",
  "/frontend/bubble-physics": "green",
  "/frontend/bubble-lifetime": "yellow",
  "/frontend/layout-engine": "red",
  "/frontend/customization": "cyan",
  "/backend": "green",
  "/backend/architecture": "blue",
  "/backend/nlp-pipeline": "purple",
  "/backend/scoring-algorithm": "yellow",
  "/backend/dictionary-api": "red",
};

const FALLBACK_KEYS = Object.keys(PALETTES) as (keyof typeof PALETTES)[];

function themeForPath(pathname: string): BubbleTheme {
  const key = ROUTE_THEMES[pathname];
  if (key) return PALETTES[key];

  let hash = 0;
  for (let i = 0; i < pathname.length; i++) {
    hash = (hash + pathname.charCodeAt(i) * (i + 1)) % FALLBACK_KEYS.length;
  }
  return PALETTES[FALLBACK_KEYS[hash]!];
}

export default function FloatingAppBubble() {
  const pathname = usePathname();
  const theme = useMemo(() => themeForPath(pathname), [pathname]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed z-[60] animate-float pointer-events-none"
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        right: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <a
        href={APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TalkScope アプリを開く（新しいタブ）"
        className="group pointer-events-auto relative grid place-items-center w-[5.25rem] h-[5.25rem] sm:w-[5.75rem] sm:h-[5.75rem] rounded-full border-[2.5px] transition-[box-shadow,transform,border-color,background] duration-700 ease-out hover:scale-110 active:scale-95"
        style={
          {
            "--bubble-glow": theme.glow,
            background: `radial-gradient(circle at 32% 28%, rgba(${theme.c1}, 0.82) 0%, rgba(${theme.c2}, 0.68) 40%, rgba(${theme.c3}, 0.52) 72%, rgba(255, 255, 255, 0.12) 100%)`,
            borderColor: theme.ring,
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.25) inset,
              0 0 36px -2px var(--bubble-glow),
              0 0 64px -8px var(--bubble-glow),
              0 16px 48px -12px rgba(0, 0, 0, 0.45)
            `,
            color: theme.text,
          } as CSSProperties
        }
      >
        <span
          className="pointer-events-none absolute top-[14%] left-[22%] w-[38%] h-[28%] rounded-full opacity-80 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <span className="relative z-10 flex flex-col items-center justify-center leading-tight text-center px-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
          <span className="text-[0.62rem] sm:text-[0.68rem] font-bold tracking-wide">
            アプリを
          </span>
          <span className="text-[0.72rem] sm:text-xs font-bold tracking-wide">
            使う
          </span>
        </span>
      </a>
    </div>,
    document.body
  );
}
