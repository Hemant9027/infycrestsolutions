import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        centered ? "mx-auto text-center" : "text-left"
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400 sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.85rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-neutral-900">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-neutral-500 sm:text-lg",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
