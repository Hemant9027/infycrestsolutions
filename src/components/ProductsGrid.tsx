"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import type { Product, ProductProjectType } from "@/lib/products";

const reviewPools: Record<string, string[]> = {
  hospitality: [
    "The experience makes every stay feel considered before guests even arrive.",
    "A calm, polished presentation that makes the property instantly memorable.",
    "The new site turns browsing into the feeling of already being there.",
  ],
  food: [
    "It captures the atmosphere of the place and makes discovering the menu effortless.",
    "The brand feels as inviting online as it does in person.",
    "A vibrant digital experience that makes the next order or reservation feel easy.",
  ],
  healthcare: [
    "Patients can find what they need quickly, with a clearer path to the right care.",
    "The experience feels trustworthy, welcoming and remarkably easy to navigate.",
    "A thoughtful website that puts useful information exactly where people expect it.",
  ],
  business: [
    "The new experience gives the brand a sharper, more confident digital presence.",
    "A clear and focused presentation that makes the value obvious from the first visit.",
    "The product story feels more credible, modern and ready to grow.",
  ],
  creative: [
    "The work finally has the kind of digital stage it deserves.",
    "A distinctive visual experience that feels personal without getting in the way.",
    "The new presentation makes the craft and point of view impossible to miss.",
  ],
  default: [
    "A clear, confident digital experience that makes the project easy to remember.",
    "Thoughtful design, smooth browsing and a much stronger first impression.",
    "The project now feels polished, purposeful and ready to be discovered.",
  ],
};

function getReview(product: Product) {
  const category = product.category.toLowerCase();
  const poolKey =
    Object.keys(reviewPools).find((key) => category.includes(key)) ?? "default";
  const pool = reviewPools[poolKey];
  const seed = Array.from(product.slug).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  const fallbackQuote = pool[seed % pool.length];
  const hasTestimonial = Boolean(product.testimonial?.trim());

  return {
    quote: hasTestimonial ? product.testimonial!.trim() : fallbackQuote,
    label: hasTestimonial
      ? (product.clientName ?? product.clientLabel ?? "Verified client")
      : "Project preview",
    role: product.clientRole,
    rating: Math.min(5, Math.max(0, product.rating ?? 5)),
  };
}

function ProductImage({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = product.imageUrl.trim();

  if (!imageUrl || imageError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#e7e5e4,#fafaf9)] px-6 text-center text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
        {product.name} preview unavailable
      </div>
    );
  }

  if (imageUrl.startsWith("data:")) {
    return (
      <img
        src={imageUrl}
        alt={`${product.name} project preview`}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={`${product.name} project preview`}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      onError={() => setImageError(true)}
    />
  );
}

export default function ProductsGrid({
  projectType = "real-world",
  compact = false,
}: {
  projectType?: ProductProjectType;
  compact?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [technology, setTechnology] = useState("All");
  const [minimumRating, setMinimumRating] = useState("0");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState("displayOrder");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `/api/products?projectType=${projectType}`,
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError(`Failed to fetch products: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          `Error fetching products: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [projectType]);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.map((product) => product.category)),
      ).sort(),
    ],
    [products],
  );
  const technologies = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.flatMap((product) => product.technologies ?? [])),
      ).sort(),
    ],
    [products],
  );
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const minimum = Number(minimumRating);
    const result = products.filter((product) => {
      const searchable = [
        product.name,
        product.category,
        product.description,
        product.shortDescription,
        ...(product.technologies ?? []),
        ...(product.features ?? []),
        product.clientName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (category === "All" || product.category === category) &&
        (technology === "All" || product.technologies?.includes(technology)) &&
        (!featuredOnly || product.featured) &&
        (product.rating ?? 0) >= minimum
      );
    });

    return result.sort((first, second) => {
      if (sort === "name") return first.name.localeCompare(second.name);
      if (sort === "rating") return (second.rating ?? 0) - (first.rating ?? 0);
      return first.displayOrder - second.displayOrder;
    });
  }, [
    category,
    featuredOnly,
    minimumRating,
    products,
    query,
    sort,
    technology,
  ]);

  const hasFilters =
    Boolean(query) ||
    category !== "All" ||
    technology !== "All" ||
    minimumRating !== "0" ||
    featuredOnly ||
    sort !== "displayOrder";

  function resetFilters() {
    setQuery("");
    setCategory("All");
    setTechnology("All");
    setMinimumRating("0");
    setFeaturedOnly(false);
    setSort("displayOrder");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-neutral-200 rounded-lg mb-4" />
              <div className="h-6 bg-neutral-200 rounded mb-2" />
              <div className="h-4 bg-neutral-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-neutral-500 text-sm mt-2">
          Check browser console for more details
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 sm:py-28">
        <p className="text-neutral-500">No products yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <section
      className={`mx-auto max-w-7xl px-5 sm:px-8 ${
        compact ? "pb-16 pt-8 sm:pb-20 sm:pt-12" : "py-20 sm:py-28"
      }`}
    >
      <div className="mb-10 rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_18px_50px_-35px_rgb(10_10_10/0.35)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, services, technologies..."
              aria-label="Search projects"
              className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white"
            />
          </div>
          <label className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-2xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(event) => setFeaturedOnly(event.target.checked)}
              className="size-4 accent-neutral-900"
            />
            Featured only
          </label>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-950"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Refine
          </div>
          <FilterSelect
            label="Category"
            value={category}
            options={categories}
            onChange={setCategory}
          />
          <FilterSelect
            label="Technology"
            value={technology}
            options={technologies}
            onChange={setTechnology}
          />
          <FilterSelect
            label="Rating"
            value={minimumRating}
            options={["0", "3", "4", "5"]}
            optionLabels={{
              "0": "Any rating",
              "3": "3+ stars",
              "4": "4+ stars",
              "5": "5 stars",
            }}
            onChange={setMinimumRating}
          />
          <FilterSelect
            label="Sort"
            value={sort}
            options={["displayOrder", "rating", "name"]}
            optionLabels={{
              displayOrder: "Recommended",
              rating: "Highest rated",
              name: "Name A-Z",
            }}
            onChange={setSort}
          />
          <p className="text-xs text-neutral-400 sm:ml-auto">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "project" : "projects"}
          </p>
        </div>
      </div>

      {filteredProducts.length ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const review = getReview(product);

            return (
              <article
                key={product.slug}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200/90 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-neutral-300 hover:shadow-[0_26px_60px_-28px_rgb(10_10_10/0.32)] motion-reduce:transition-none"
              >
                <div className="relative aspect-16/10 overflow-hidden rounded-t-3xl bg-neutral-100">
                  <ProductImage product={product} />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-black/35" />
                  <div className="absolute left-4 top-4 flex max-w-[75%] flex-wrap gap-2">
                    <span className="rounded-full border border-white/45 bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-800 backdrop-blur-md">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="rounded-full bg-neutral-950/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                        Featured
                      </span>
                    )}
                  </div>
                  <Link
                    href={product.liveUrl}
                    target={product.liveUrl ? "_blank" : undefined}
                    rel={product.liveUrl ? "noopener noreferrer" : undefined}
                    aria-label={`View ${product.name} project`}
                    className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-white/45 bg-white/85 text-neutral-900 shadow-sm backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                  >
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>

                  <div className="absolute inset-x-3 bottom-3 translate-y-3 rounded-2xl border border-white/70 bg-white/70 p-3 text-neutral-950 opacity-0 shadow-2xl backdrop-blur-xl transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100 motion-reduce:transition-none">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white text-[11px] font-bold text-neutral-900">
                        {product.clientImage ? (
                          <img
                            src={product.clientImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          product.name.slice(0, 1)
                        )}
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                          {product.testimonial?.trim()
                            ? "Verified client"
                            : "Project preview"}
                        </p>
                        <p className="text-xs font-semibold text-neutral-950">
                          {review.label}
                        </p>
                        {review.role && (
                          <p className="text-[10px] text-neutral-500">
                            {review.role}
                          </p>
                        )}
                      </div>
                      <div
                        className="ml-auto flex gap-0.5"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`size-3 ${index < review.rating ? "fill-amber-400 text-amber-500" : "fill-neutral-200 text-neutral-300"}`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-neutral-800">
                      “{review.quote}”
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                      {product.category}
                    </span>
                    {product.technologies?.slice(0, 2).map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-neutral-200 px-2.5 py-1 text-[10px] font-medium text-neutral-400"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-500">
                    {product.shortDescription}
                  </p>

                  {product.features?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-400">
                      {product.features.slice(0, 2).map((feature) => (
                        <span key={feature}>+ {feature}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                    >
                      View Project{" "}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    {product.liveUrl && (
                      <a
                        href={product.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-neutral-300 px-3.5 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                      >
                        Visit Website{" "}
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-neutral-300 py-24 text-center">
          <SearchX className="size-7 text-neutral-400" aria-hidden="true" />
          <p className="mt-5 text-lg font-semibold text-neutral-900">
            No projects match your filters.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Try a broader search or clear the filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  optionLabels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative flex min-w-36 items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-neutral-200 bg-white py-2 pl-3 pr-9 text-sm text-neutral-700 outline-none transition-colors focus:border-neutral-900"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ??
              (option === "All" ? `All ${label.toLowerCase()}s` : option)}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 size-4 text-neutral-400"
        aria-hidden="true"
      />
    </label>
  );
}
