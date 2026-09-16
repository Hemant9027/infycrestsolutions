"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { Demo } from "@/data/demos";
import BrowserFrame from "@/components/BrowserFrame";
import Modal from "@/components/Modal";

interface ProductDetailsModalProps {
  demo: Demo | null;
  onClose: () => void;
  onSelect: (demo: Demo) => void;
}

export default function ProductDetailsModal({
  demo,
  onClose,
  onSelect,
}: ProductDetailsModalProps) {
  return (
    <Modal
      open={demo !== null}
      onClose={onClose}
      labelledBy="details-title"
      maxWidth="max-w-3xl"
    >
      {demo && (
        <div className="p-5 sm:p-8">
          <BrowserFrame
            src={demo.thumbnail}
            alt={`${demo.name} website preview`}
            url={`infycrestsolutions.com${demo.previewUrl}`}
            sizes="(max-width: 768px) 100vw, 672px"
          />

          <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                {demo.category}
                {demo.scope ? ` · ${demo.scope}` : ""}
              </p>
              <h3
                id="details-title"
                className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
              >
                {demo.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
                {demo.priceLabel}
              </span>
              {demo.priceNote && (
                <p className="mt-1.5 text-[11px] text-neutral-400">
                  {demo.priceNote}
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
            {demo.description}
          </p>

          <div className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {demo.includes.map((item) => (
              <p
                key={item}
                className="flex items-start gap-2.5 text-sm text-neutral-600"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-neutral-900"
                  strokeWidth={2.6}
                />
                {item}
              </p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {demo.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-neutral-100 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => onSelect(demo)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Select Website
              <ArrowRight className="size-4" strokeWidth={2.4} />
            </button>
            <Link
              href={demo.previewUrl}
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-900"
            >
              Live Preview
              <ArrowUpRight className="size-4" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
