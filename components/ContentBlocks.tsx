import ImageSlot from "@/components/ImageSlot";
import type { ContentBlock } from "@/content/types";

const CALLOUT = {
  info: { wrap: "border-sky-500/25 bg-sky-500/[0.06]", title: "text-sky-200", icon: "ℹ", iconc: "text-sky-400" },
  tip: { wrap: "border-emerald-500/25 bg-emerald-500/[0.06]", title: "text-emerald-200", icon: "✓", iconc: "text-emerald-400" },
  warning: { wrap: "border-amber-500/25 bg-amber-500/[0.06]", title: "text-amber-200", icon: "⚠", iconc: "text-amber-400" },
  note: { wrap: "border-white/10 bg-white/[0.03]", title: "text-zinc-200", icon: "✎", iconc: "text-zinc-400" },
} as const;

export function renderBlock(block: ContentBlock, idx: number) {
  switch (block.type) {
    case "lead":
      return (
        <div
          key={idx}
          className="surface-panel px-5 py-4 text-lg sm:text-xl leading-[1.7] text-zinc-200 font-light mb-7 text-pretty"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );

    case "subheading":
      return (
        <h3
          key={idx}
          className="text-base font-semibold text-zinc-100 mt-10 mb-3 tracking-tight"
        >
          {block.content}
        </h3>
      );

    case "text":
      return (
        <div
          key={idx}
          className="prose-ts mb-5"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );

    case "image":
      return (
        <ImageSlot key={idx} src={block.image.src} alt={block.image.alt} caption={block.image.caption} />
      );

    case "images":
      return (
        <div
          key={idx}
          className={
            block.layout === "row"
              ? "flex flex-col sm:flex-row gap-4 my-7"
              : "grid grid-cols-1 sm:grid-cols-2 gap-4 my-7"
          }
        >
          {block.images.map((img, i) => (
            <ImageSlot key={i} src={img.src} alt={img.alt} caption={img.caption} className="my-0" />
          ))}
        </div>
      );

    case "code":
      return (
        <figure key={idx} className="my-7 group">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0b14] border border-white/[0.07] rounded-t-xl border-b-0">
            <span className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-[rgba(var(--accent-rgb),0.4)]" />
            </span>
            <span className="ml-1.5 text-[11px] text-zinc-400 font-mono truncate">
              {block.code.title ?? block.code.lang}
            </span>
            <span className="ml-auto text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
              {block.code.lang}
            </span>
          </div>
          <pre className="overflow-x-auto rounded-b-xl bg-[#06070e] border border-white/[0.07] border-t-0 p-5">
            <code className="text-[0.8125rem] font-mono text-zinc-200 leading-[1.7] whitespace-pre">
              {block.code.code}
            </code>
          </pre>
        </figure>
      );

    case "callout": {
      const s = CALLOUT[block.variant];
      return (
        <div key={idx} className={`flex gap-3 p-4 rounded-xl border my-7 ${s.wrap}`}>
          <span className={`text-base leading-none mt-0.5 ${s.iconc}`}>{s.icon}</span>
          <div>
            {block.title && (
              <p className={`text-sm font-semibold mb-1 ${s.title}`}>{block.title}</p>
            )}
            <p className="text-sm leading-relaxed text-zinc-300">{block.content}</p>
          </div>
        </div>
      );
    }

    case "list":
      if (block.ordered) {
        return (
          <ol key={idx} className="my-5 space-y-2.5 counter-reset">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-300 text-[0.95rem] leading-relaxed">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md bg-[rgba(var(--accent-rgb),0.12)] border border-[rgba(var(--accent-rgb),0.25)] text-[11px] font-mono text-accent flex items-center justify-center">
                  {i + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={idx} className="my-5 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-zinc-300 text-[0.95rem] leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[rgba(var(--accent-rgb),0.7)] flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      );

    case "cards": {
      const cols = block.columns ?? (block.items.length === 2 ? 2 : 3);
      const grid = cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
      return (
        <div key={idx} className={`my-8 grid grid-cols-1 ${grid} gap-4`}>
          {block.items.map((c, i) => (
            <div
              key={i}
              className="group relative card card-hover p-6 overflow-hidden"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {!c.icon && (
                <span className="pointer-events-none absolute -top-5 -right-1 font-mono text-[5rem] font-bold leading-none text-white/[0.03] select-none tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <div className="relative flex items-center gap-3 mb-4">
                {c.icon ? (
                  <span className="flex-shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-[rgba(var(--accent-rgb),0.1)] border border-[rgba(var(--accent-rgb),0.22)] text-xl leading-none">
                    {c.icon}
                  </span>
                ) : (
                  <span className="flex-shrink-0 font-mono text-3xl font-bold gradient-text leading-none tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                {c.tag && (
                  <span className="ml-auto text-[10px] uppercase tracking-widest font-mono text-zinc-500">
                    {c.tag}
                  </span>
                )}
              </div>
              <h3 className="relative text-base font-bold text-zinc-50 mb-2 leading-snug tracking-tight">
                {c.title}
              </h3>
              <p
                className="relative text-[0.92rem] text-zinc-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: c.body }}
              />
            </div>
          ))}
        </div>
      );
    }

    case "stats":
      return (
        <div
          key={idx}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-7"
        >
          {block.items.map((s, i) => (
            <div key={i} className="card p-5">
              <div className="text-2xl sm:text-3xl font-bold gradient-text tracking-tight leading-none mb-2 font-mono">
                {s.value}
              </div>
              <div className="text-xs font-medium text-zinc-300">{s.label}</div>
              {s.sub && <div className="text-[11px] text-zinc-600 mt-1 leading-snug">{s.sub}</div>}
            </div>
          ))}
        </div>
      );

    case "steps":
      return (
        <ol key={idx} className="my-8 relative">
          <span className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-[rgba(var(--accent-rgb),0.6)] via-white/10 to-transparent" />
          {block.items.map((step, i) => (
            <li key={i} className="relative flex gap-5 pb-7 last:pb-0">
              <span className="relative z-10 flex-shrink-0 w-10 h-10 rounded-xl bg-ink-surface border border-[rgba(var(--accent-rgb),0.45)] text-accent font-mono text-base font-bold flex items-center justify-center shadow-[0_4px_16px_-6px_rgba(var(--accent-rgb),0.6)] tabular-nums">
                {i + 1}
              </span>
              <div className="pt-1 min-w-0 surface-panel px-4 py-3">
                <p className="text-[0.95rem] font-bold text-zinc-50 mb-1.5 tracking-tight">{step.title}</p>
                <p className="text-[0.92rem] text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: step.body }} />
              </div>
            </li>
          ))}
        </ol>
      );

    case "table":
      return (
        <figure key={idx} className="my-7 overflow-hidden rounded-xl border border-white/[0.07]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-white/[0.03]">
                  {block.head.map((h, i) => (
                    <th key={i} className="px-4 py-3 font-semibold text-zinc-200 border-b border-white/[0.08] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition-colors">
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className={`px-4 py-3 align-top leading-relaxed ${c === 0 ? "text-zinc-200 font-medium" : "text-zinc-400"}`}
                        dangerouslySetInnerHTML={{ __html: cell }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="px-4 py-2 text-xs text-zinc-600 bg-white/[0.015] border-t border-white/[0.05]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "decision":
      return (
        <div key={idx} className="my-7 card p-5 sm:p-6 border-[rgba(var(--accent-rgb),0.2)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="kicker">Design Decision</span>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">課題 / 文脈</dt>
              <dd className="text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.context }} />
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1 font-mono">採用した判断</dt>
              <dd className="text-zinc-100 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: block.choice }} />
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1.5 font-mono">理由</dt>
              <dd>
                <ul className="space-y-1.5">
                  {block.because.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-400 leading-relaxed">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: b }} />
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      );

    case "tree":
      return (
        <figure key={idx} className="my-7">
          <pre className="overflow-x-auto rounded-xl bg-[#06070e] border border-white/[0.07] p-5">
            <code className="text-[0.8125rem] font-mono text-zinc-300 leading-[1.65] whitespace-pre">
              {block.lines.join("\n")}
            </code>
          </pre>
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-zinc-600">{block.caption}</figcaption>
          )}
        </figure>
      );

    case "specs":
      return (
        <dl key={idx} className="my-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/[0.06]">
          {block.items.map((s, i) => (
            <div key={i} className="bg-ink-surface px-4 py-3">
              <dt className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono mb-0.5">{s.term}</dt>
              <dd className="text-sm text-zinc-200" dangerouslySetInnerHTML={{ __html: s.value }} />
            </div>
          ))}
        </dl>
      );

    case "quote":
      return (
        <blockquote key={idx} className="my-7 pl-5 border-l-2 border-[rgba(var(--accent-rgb),0.5)]">
          <p className="text-lg text-zinc-200 font-light leading-relaxed italic">{block.text}</p>
          {block.cite && <cite className="block mt-2 text-sm text-zinc-500 not-italic">— {block.cite}</cite>}
        </blockquote>
      );

    default:
      return null;
  }
}
