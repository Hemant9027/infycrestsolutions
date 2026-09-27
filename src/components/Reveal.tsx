import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  id?: string;
}

export default function Reveal({
  children,
  className,
  delay = 0,
  id,
}: RevealProps) {
  return (
    <div
      id={id}
      className={cn("animate-fade-up", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.3em] text-neutral-600">
      <span aria-hidden="true" className="h-px w-8 bg-neutral-300" />
      {children}
    </p>
  );
}
