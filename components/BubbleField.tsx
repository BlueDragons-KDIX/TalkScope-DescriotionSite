"use client";

import { useEffect, useRef } from "react";

type Term = { label: string; score: number };

// IT / ソフトウェア工学の専門語サンプル
const TERMS: Term[] = [
  { label: "React", score: 0.85 },
  { label: "TypeScript", score: 0.9 },
  { label: "FastAPI", score: 0.8 },
  { label: "NLP", score: 0.95 },
  { label: "pgvector", score: 0.65 },
  { label: "WebSocket", score: 0.7 },
  { label: "形態素解析", score: 0.88 },
  { label: "ベクトル検索", score: 0.82 },
  { label: "LLM", score: 0.92 },
  { label: "Docker", score: 0.6 },
  { label: "CI/CD", score: 0.55 },
  { label: "OAuth", score: 0.58 },
  { label: "PostgreSQL", score: 0.72 },
  { label: "GiNZA", score: 0.68 },
  { label: "Gemini API", score: 0.78 },
];

type Node = {
  t: Term;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export default function BubbleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];

    const accent = getComputedStyle(document.body)
      .getPropertyValue("--accent-rgb")
      .trim() || "99, 102, 241";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      nodes = TERMS.map((t) => {
        const r = 22 + t.score * 46;
        return {
          t,
          r,
          x: w * (0.15 + Math.random() * 0.7),
          y: h + r + Math.random() * h * 0.6,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -1 - Math.random() * 2.5,
        };
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // 浮力（上方向）
        n.vy += -0.15;
        // 中央への緩やかな求心力
        n.vx += (cx - n.x) * 0.0008;
        // 反発（ペナルティ法）
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const min = n.r + m.r + 10;
          if (dist < min) {
            const force = (min - dist) * 0.08;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n.vx += fx; n.vy += fy;
            m.vx -= fx; m.vy -= fy;
          }
        }
      }

      for (const n of nodes) {
        n.vx *= 0.88;
        n.vy *= 0.88;
        n.x += n.vx;
        n.y += n.vy;

        // 上に抜けたら下からリサイクル
        if (n.y + n.r < -20) {
          n.y = h + n.r + Math.random() * 80;
          n.x = w * (0.15 + Math.random() * 0.7);
          n.vy = -1 - Math.random() * 2;
        }
        if (n.x < -n.r) n.x = w + n.r;
        if (n.x > w + n.r) n.x = -n.r;

        // 描画
        const grad = ctx.createRadialGradient(
          n.x - n.r * 0.3, n.y - n.r * 0.3, n.r * 0.1,
          n.x, n.y, n.r
        );
        const a = 0.1 + n.t.score * 0.18;
        grad.addColorStop(0, `rgba(${accent}, ${a + 0.12})`);
        grad.addColorStop(1, `rgba(${accent}, ${a * 0.35})`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = `rgba(${accent}, ${0.25 + n.t.score * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // ラベル
        const fs = Math.max(10, Math.min(15, n.r * 0.34));
        ctx.font = `500 ${fs}px var(--font-sans), sans-serif`;
        ctx.fillStyle = `rgba(235, 238, 250, ${0.55 + n.t.score * 0.4})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.t.label, n.x, n.y);
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    seed();
    if (reduce) {
      // 静止：一度だけ落ち着いた配置を描く
      for (let k = 0; k < 220; k++) tick.call(null);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => { resize(); seed(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none [mask-image:radial-gradient(ellipse_80%_80%_at_60%_40%,black,transparent)]"
    />
  );
}
