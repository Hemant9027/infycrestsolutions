import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DEMOS } from "@/data/demos";
import { ALL_WEBSITE_TEMPLATE_SLUGS } from "@/lib/product-template-types";

export const metadata: Metadata = {
  title: "Sitemap | InfyCrest Solutions",
  description:
    "Browse the pages, services, demos and resources available from InfyCrest Solutions.",
};

const corePages = [
  { label: "Home", href: "/", description: "The InfyCrest overview" },
  {
    label: "Services",
    href: "/services",
    description: "Websites, software and automation",
  },
  {
    label: "Products",
    href: "/products",
    description: "Selected digital work and products",
  },
  {
    label: "Templates",
    href: "/templates",
    description: "Ready-to-customize website systems",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Start a project conversation",
  },
  {
    label: "Careers",
    href: "/careers",
    description: "Work with InfyCrest",
  },
  { label: "Blog", href: "/blog", description: "Ideas and practical guidance" },
  {
    label: "Cookie policy",
    href: "/cookie-policy",
    description: "How cookies are used on this site",
  },
];

function formatSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function SitemapPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#fafaf9] px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              InfyCrest / Sitemap
            </p>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-7xl">
              Find your way around.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
              Explore our services, products, website demos and resources from
              one simple index.
            </p>
          </header>

          <div className="mt-16 grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
            <section aria-labelledby="core-pages-heading">
              <h2
                id="core-pages-heading"
                className="border-b border-neutral-200 pb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400"
              >
                Core pages
              </h2>
              <ul className="divide-y divide-neutral-200">
                {corePages.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="group flex items-center justify-between gap-6 py-5"
                    >
                      <span>
                        <span className="block text-lg font-semibold tracking-tight text-neutral-900 transition-transform group-hover:translate-x-1">
                          {page.label}
                        </span>
                        <span className="mt-1 block text-sm text-neutral-500">
                          {page.description}
                        </span>
                      </span>
                      <ArrowUpRight className="size-5 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <div className="space-y-16">
              <section aria-labelledby="demos-heading">
                <h2
                  id="demos-heading"
                  className="border-b border-neutral-200 pb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400"
                >
                  Website demos
                </h2>
                <ul className="mt-2 grid gap-x-8 sm:grid-cols-2">
                  {DEMOS.map((demo) => (
                    <li key={demo.slug}>
                      <Link
                        href={`/demo/${demo.slug}`}
                        className="group flex items-center justify-between gap-3 border-b border-neutral-200 py-3 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
                      >
                        {demo.name}
                        <ArrowUpRight className="size-3.5 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="templates-heading">
                <h2
                  id="templates-heading"
                  className="border-b border-neutral-200 pb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400"
                >
                  Website templates
                </h2>
                <ul className="mt-2 grid gap-x-8 sm:grid-cols-2">
                  {ALL_WEBSITE_TEMPLATE_SLUGS.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/demo/${slug}`}
                        className="group flex items-center justify-between gap-3 border-b border-neutral-200 py-3 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
                      >
                        {formatSlug(slug)}
                        <ArrowUpRight className="size-3.5 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
