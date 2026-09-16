"use client";

import { useState } from "react";
import ProductsGrid from "@/components/ProductsGrid";

type Catalog = "ideas" | "real-world";

export default function ProjectCatalogSwitcher() {
  const [catalog, setCatalog] = useState<Catalog>("ideas");

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className="inline-flex rounded-full border border-neutral-200 bg-white p-1 shadow-sm"
          role="tablist"
          aria-label="Project catalog"
        >
          <button
            type="button"
            role="tab"
            aria-selected={catalog === "ideas"}
            onClick={() => setCatalog("ideas")}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              catalog === "ideas"
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Ideas
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={catalog === "real-world"}
            onClick={() => setCatalog("real-world")}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              catalog === "real-world"
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Real World
          </button>
        </div>
      </div>

      {catalog === "ideas" ? (
        <ProductsGrid projectType="ideal" compact />
      ) : (
        <ProductsGrid projectType="real-world" compact />
      )}
    </>
  );
}
