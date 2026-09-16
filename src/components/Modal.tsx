"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  maxWidth?: string;
}

/**
 * Accessible portaled dialog — Escape to close, backdrop click, scroll lock,
 * keyboard-focusable panel. Bottom-sheet on mobile, centered card on desktop.
 */
export default function Modal({
  open,
  onClose,
  children,
  labelledBy,
  maxWidth = "max-w-2xl",
}: ModalProps) {
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setShow(true));
      document.body.style.overflow = "hidden";
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);
      const focusTimer = setTimeout(() => panelRef.current?.focus(), 60);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(focusTimer);
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
    setShow(false);
    const timer = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-neutral-950/45 backdrop-blur-[2px] transition-opacity duration-200",
          show ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-none transition-all duration-200 ease-out sm:max-h-[88vh] sm:rounded-3xl",
          maxWidth,
          show
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-8 opacity-0 sm:translate-y-3 sm:scale-[0.97]"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-neutral-200 bg-white/90 text-neutral-500 backdrop-blur transition-colors hover:border-neutral-900 hover:text-neutral-900"
        >
          <X className="size-4" strokeWidth={2.2} />
        </button>
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>,
    document.body
  );
}
