"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={cn(className)}
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -6% 0px" }}
      transition={{
        duration: reducedMotion ? 0 : 0.7,
        delay: reducedMotion ? 0 : delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.3em] text-neutral-400">
      <span aria-hidden="true" className="h-px w-8 bg-neutral-300" />
      {children}
    </p>
  );
}
