"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/lib/blog";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = [
    "All",
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    return posts.filter(
      (post) =>
        (category === "All" || post.category === category) &&
        (!value ||
          [
            post.title,
            post.excerpt,
            post.category,
            ...post.tags,
            post.primaryKeyword,
          ]
            .join(" ")
            .toLowerCase()
            .includes(value)),
    );
  }, [category, posts, query]);
  const featured = filtered[0];
  return (
    <div className="mt-12">
      <div className="flex flex-col gap-4 border-y border-neutral-200 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold ${category === item ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 text-neutral-500"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search insights"
          aria-label="Search insights"
          className="h-11 rounded-full border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-neutral-900 lg:w-72"
        />
      </div>
      {featured ? (
        <>
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-8 grid overflow-hidden rounded-3xl border border-neutral-200 bg-white lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="relative min-h-64 bg-neutral-100 lg:min-h-[390px]">
              <Image
                src={featured.featuredImage}
                alt={featured.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Featured · {featured.category}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-5 leading-7 text-neutral-500">
                {featured.excerpt}
              </p>
              <p className="mt-7 text-xs text-neutral-400">
                Hemant Pundir · {featured.readingTime} min read
              </p>
              <span className="mt-8 text-sm font-semibold text-neutral-900">
                Read article →
              </span>
            </div>
          </Link>
          <div className="mt-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                  Latest Insights
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Practical ideas for digital growth
                </h2>
              </div>
              <p className="text-sm text-neutral-500">
                {filtered.length}{" "}
                {filtered.length === 1 ? "article" : "articles"}
              </p>
            </div>
            <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(1).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                >
                  <div className="relative aspect-[16/10] bg-neutral-100">
                    <Image
                      src={post.featuredImage}
                      alt={post.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      {post.category}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-500">
                      {post.excerpt}
                    </p>
                    <p className="mt-5 text-xs text-neutral-400">
                      {new Date(post.publishedAt!).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      · {post.readingTime} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="py-24 text-center text-sm text-neutral-500">
          No insights match your search.
        </div>
      )}
    </div>
  );
}
