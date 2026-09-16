"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-60 h-1 bg-transparent">
      <div
        className="h-full bg-neutral-900 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() =>
      setPageUrl(window.location.href),
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function copy() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  const encoded = encodeURIComponent(pageUrl);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="mr-2 font-mono uppercase tracking-[0.16em] text-neutral-400">
        Share
      </span>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl}`)}`}
        className="rounded-full border border-neutral-200 px-3 py-2 text-neutral-600 hover:border-neutral-900"
      >
        WhatsApp
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        className="rounded-full border border-neutral-200 px-3 py-2 text-neutral-600 hover:border-neutral-900"
      >
        LinkedIn
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encoded}`}
        className="rounded-full border border-neutral-200 px-3 py-2 text-neutral-600 hover:border-neutral-900"
      >
        X
      </a>
      <button
        type="button"
        onClick={() => void copy()}
        className="rounded-full border border-neutral-200 px-3 py-2 text-neutral-600 hover:border-neutral-900"
      >
        {copied ? "Link copied!" : "Copy link"}
      </button>
    </div>
  );
}
