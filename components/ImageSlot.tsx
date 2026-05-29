import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  priority?: boolean;
};

export default function ImageSlot({
  src,
  alt,
  caption,
  className = "",
  priority = false,
}: Props) {
  return (
    <figure className={`my-7 ${className}`}>
      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-ink-deep shadow-[0_16px_50px_-18px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.04] rounded-xl pointer-events-none z-10" />
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={675}
          className="w-full h-auto object-contain"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-center text-xs text-zinc-500 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
