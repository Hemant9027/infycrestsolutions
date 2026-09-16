"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, SearchX } from "lucide-react";
import Reveal, { Eyebrow } from "@/components/Reveal";
import {
  PRODUCT_CATEGORIES,
  type ProductTemplate,
} from "@/lib/product-template-types";
import { cn } from "@/lib/utils";

export default function Products({
  showAll = false,
  hideEyebrow = false,
}: {
  showAll?: boolean;
  hideEyebrow?: boolean;
}) {
  const [products, setProducts] = useState<ProductTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("/api/product-templates")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: ProductTemplate[]) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const searchable = [
        product.name,
        product.category,
        product.businessType,
        product.shortDescription,
        ...product.tags,
      ]
        .join(" ")
        .toLowerCase();
      return (
        matchesCategory && (!normalized || searchable.includes(normalized))
      );
    });
  }, [category, products, query]);
  const visibleProducts = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section
      id="products"
      className="scroll-mt-28 bg-neutral-50 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            {!hideEyebrow && <Eyebrow>05 / Ready-to-Launch Templates</Eyebrow>}
            <h2 className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Ready-made{" "}
              <em className="font-display font-normal italic">foundations</em>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              Explore curated website templates for ambitious businesses. Choose
              a direction, then make it unmistakably yours.
            </p>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {PRODUCT_CATEGORIES.map((item) => (
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
                placeholder="Search dental, cafe, gym..."
                className="h-12 w-full rounded-full border border-neutral-200 bg-white pl-11 pr-4 text-[14px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-900"
              />
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading templates"
          >
            {Array.from({ length: showAll ? 9 : 6 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-neutral-200 bg-white"
              >
                <div
                  className="skeleton-block aspect-[16/10] w-full"
                  aria-hidden="true"
                />
                <div className="space-y-3 p-6">
                  <div className="skeleton-block h-3 w-24" aria-hidden="true" />
                  <div
                    className="skeleton-block h-6 w-4/5"
                    aria-hidden="true"
                  />
                  <div
                    className="skeleton-block h-4 w-full"
                    aria-hidden="true"
                  />
                  <div
                    className="skeleton-block h-4 w-3/4"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length ? (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <Reveal key={product.slug} delay={(index % 3) * 90}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-neutral-300 hover:shadow-[0_28px_60px_-24px_rgb(10_10_10/0.22)]">
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative block aspect-[16/10] overflow-hidden bg-neutral-100"
                      aria-label={`View ${product.name} details`}
                    >
                      <Image
                        src={product.thumbnail}
                        alt={`${product.name} template preview`}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      <span className="absolute left-3.5 top-3.5 rounded-full border border-white/40 bg-white/85 px-3 py-1 text-[11px] font-semibold text-neutral-700 backdrop-blur-md">
                        {product.category}
                      </span>
                      {product.featured && (
                        <span className="absolute right-3.5 top-3.5 rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold text-white">
                          Featured
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                        {product.businessType}
                      </p>
                      <h3 className="mt-2 text-[19px] font-semibold tracking-tight text-neutral-900">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-500">
                        {product.shortDescription}
                      </p>
                      <div className="mt-auto flex items-center gap-2.5 pt-6">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 text-[13.5px] font-semibold text-neutral-700 transition-all hover:border-neutral-900 hover:text-neutral-900"
                        >
                          Details
                        </Link>
                        {product.hasLivePreview && product.previewUrl ? (
                          <a
                            href={product.previewUrl}
                            target={
                              product.previewUrl.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              product.previewUrl.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-neutral-900 text-[13.5px] font-semibold text-white transition-colors hover:bg-neutral-800"
                          >
                            Preview <ArrowUpRight className="size-3.5" />
                          </a>
                        ) : (
                          <span className="flex h-10 flex-1 items-center justify-center rounded-full bg-neutral-100 text-center text-[12px] font-semibold text-neutral-400">
                            Preview Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            {!showAll && filtered.length > 6 && (
              <div className="mt-10 flex justify-center">
                <Link
                  href="/templates"
                  className="inline-flex h-11 items-center rounded-full bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  Show more templates
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-neutral-300 py-24 text-center">
            <SearchX className="size-6 text-neutral-400" />
            <p className="mt-5 text-lg font-semibold text-neutral-900">
              No templates match your search.
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
      </div>
    </section>
  );
}
