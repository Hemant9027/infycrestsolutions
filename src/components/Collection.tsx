"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Search, SearchX } from "lucide-react";
import type { Demo } from "@/data/demos";
import Reveal, { Eyebrow } from "@/components/Reveal";
import ProductDetailsModal from "@/components/ProductDetailsModal";
import SelectDemoButton from "@/components/SelectDemoButton";
import ProjectRequestModal from "@/components/ProjectRequestModal";
import { cn } from "@/lib/utils";

function TemplateCard({
  demo,
  onDetails,
}: {
  demo: Demo;
  onDetails: () => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-neutral-300 hover:shadow-[0_28px_60px_-24px_rgb(10_10_10/0.22)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={demo.thumbnail}
          alt={`${demo.name} landing page preview`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-3.5 top-3.5 rounded-full border border-white/40 bg-white/85 px-3 py-1 text-[11px] font-semibold text-neutral-700 backdrop-blur-md">
          {demo.category}
        </span>
        <span className="absolute right-3.5 top-3.5 rounded-full bg-neutral-900 px-3 py-1 text-[12px] font-bold text-white shadow-lg">
          {demo.priceLabel}
        </span>
        <button
          type="button"
          onClick={onDetails}
          aria-label={`View details of ${demo.name}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
        >
          <span className="flex translate-y-3 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-[13px] font-semibold text-neutral-900 shadow-xl transition-transform group-hover:translate-y-0">
            <Eye className="size-4" />
            Quick view
          </span>
        </button>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-semibold tracking-tight text-neutral-900">
            {demo.name}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-300">
            /{demo.slug.slice(0, 2)}
          </span>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-500">
          {demo.tagline}
        </p>
        <div className="mt-auto flex items-center gap-2.5 pt-6">
          <button
            type="button"
            onClick={onDetails}
            className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 text-[13.5px] font-semibold text-neutral-700 transition-all hover:border-neutral-900 hover:text-neutral-900"
          >
            Details
          </button>
          <SelectDemoButton
            demo={demo}
            label="Select"
            className="h-10 flex-1 border-0 bg-neutral-900 px-3 text-[13.5px] font-semibold text-white hover:bg-neutral-800"
          />
        </div>
      </div>
    </article>
  );
}

export default function Collection() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [projects, setProjects] = useState<Demo[]>([]);
  const [selected, setSelected] = useState<Demo | null>(null);
  const [requestDemo, setRequestDemo] = useState<Demo | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Demo[]) => setProjects(data))
      .catch(() => setProjects([]));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((demo) => demo.category))),
  ];

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((demo) => {
      const matchesCategory = category === "All" || demo.category === category;
      const haystack =
        `${demo.name} ${demo.category} ${demo.tagline}`.toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [category, projects, query]);

  return (
    <section id="categories" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Eyebrow>02 / Collection</Eyebrow>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Explore the{" "}
              <em className="font-display font-normal italic">Collection</em>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              Choose a polished starting point, then make it yours. Every
              concept is a live, ready-to-launch foundation, not a screenshot.
            </p>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "h-10 shrink-0 rounded-full border px-5 text-[13.5px] font-medium transition-all",
                    category === item
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-900",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute left-4.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search clinics, gyms, cafes..."
                className="h-12 w-full rounded-full border border-neutral-200 bg-white pl-11 pr-4 text-[14px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-900"
              />
            </div>
          </div>
        </Reveal>
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((demo, index) => (
              <Reveal key={demo.slug} delay={(index % 3) * 110}>
                <TemplateCard demo={demo} onDetails={() => setSelected(demo)} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-neutral-300 py-24 text-center">
            <SearchX className="size-6 text-neutral-400" />
            <p className="mt-5 text-lg font-semibold text-neutral-900">
              No websites match your search.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-6 h-11 rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white"
            >
              Reset filters
            </button>
          </div>
        )}
        <Reveal delay={80}>
          <p className="mt-10 text-center text-[13px] text-neutral-400">
            Every concept ships at{" "}
            <span className="font-semibold text-neutral-700">₹999</span>,
            including customisation and launch support.
          </p>
        </Reveal>
      </div>
      <ProductDetailsModal
        demo={selected}
        onClose={() => setSelected(null)}
        onSelect={(demo) => {
          setSelected(null);
          setRequestDemo(demo);
        }}
      />
      {requestDemo && (
        <ProjectRequestModal
          demo={requestDemo}
          open
          onClose={() => setRequestDemo(null)}
        />
      )}
    </section>
  );
}
