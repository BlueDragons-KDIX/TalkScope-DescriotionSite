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
    <figure className={`my-6 ${className}`}>
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={675}
          className="w-full h-auto object-contain"
          priority={priority}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
