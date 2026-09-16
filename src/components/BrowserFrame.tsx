import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrowserFrameProps {
  src: string;
  alt: string;
  url: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

/** Website preview rendered inside a minimal browser chrome. */
export default function BrowserFrame({
  src,
  alt,
  url,
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50/90 px-3.5 py-2.5">
        <span aria-hidden="true" className="size-2 rounded-full bg-neutral-300" />
        <span aria-hidden="true" className="size-2 rounded-full bg-neutral-300" />
        <span aria-hidden="true" className="size-2 rounded-full bg-neutral-300" />
        <span className="ml-2 flex-1 truncate rounded-md border border-neutral-200/70 bg-white px-2.5 py-1 font-mono text-[10px] text-neutral-400">
          {url}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover object-top", imageClassName)}
        />
      </div>
    </div>
  );
}
