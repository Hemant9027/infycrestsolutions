"use client";

import { useState } from "react";
import type { Demo } from "@/data/demos";
import ProjectRequestModal from "@/components/ProjectRequestModal";
import { cn } from "@/lib/utils";

interface SelectDemoButtonProps {
  demo: Demo;
  className?: string;
  label?: string;
  variant?: "light" | "dark";
}

/** Opens the project-request flow pre-filled with the given demo. */
export default function SelectDemoButton({
  demo,
  className,
  label = "Select Website",
  variant = "light",
}: SelectDemoButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-[15px] font-medium transition-all",
          variant === "dark"
            ? "border-neutral-900 bg-neutral-900 text-white hover:bg-black hover:shadow-[0_12px_26px_rgba(0,0,0,0.18)]"
            : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-900",
          className
        )}
      >
        {label}
      </button>
      <ProjectRequestModal
        demo={demo}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
