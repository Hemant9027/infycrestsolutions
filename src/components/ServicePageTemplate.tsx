import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SITE } from "@/config/site";

export type ServicePageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  summary: string;
  highlights: Array<{ title: string; description: string }>;
  useCases: Array<{ title: string; description: string }>;
  process: Array<{ title: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  relatedServices: Array<{ label: string; href: string }>;
};

export function createServiceMetadata(content: ServicePageContent): Metadata {
  const title = `${content.title} | InfyCrest Solutions`;
  const description = content.summary;
  const canonical = `/${content.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${SITE.url}${canonical}`,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ServicePageTemplate({
  eyebrow,
  title,
  intro,
  summary,
  highlights,
  useCases,
  process,
  faqs,
  relatedServices,
}: ServicePageContent) {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#fafaf9] pb-20 pt-32 sm:pb-24 sm:pt-40">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.05),_transparent_68%)]" />
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
                {eyebrow}
              </p>
              <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-neutral-900 sm:text-6xl xl:text-[5rem]">
                {title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                {intro}
              </p>
            </div>
            <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_30px_80px_-45px_rgba(10,10,10,0.35)]">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                What we deliver
              </p>
              <div className="mt-5 space-y-4">
                {highlights.slice(0, 3).map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-neutral-900 text-white">
                      <CheckCircle2 className="size-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-neutral-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                  Why it matters
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                  A clearer digital experience for the right customer action.
                </h2>
              </div>
              <p className="text-[15px] leading-7 text-neutral-600 sm:text-lg">
                {summary}
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {highlights.map((item, index) => (
                <article
                  key={item.title}
                  className="rounded-[26px] border border-neutral-200 bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-100 bg-white py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                Ideal for
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Built for the kind of businesses that need trust and clarity
                online.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-6"
                >
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                Process
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                A simple process that keeps the project moving.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {process.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[24px] border border-neutral-200 bg-white p-6"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {faqs && faqs.length > 0 ? (
          <section className="border-t border-neutral-100 bg-white py-20 sm:py-24">
            <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
              <div className="max-w-2xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                  FAQ
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                  Common questions before we start.
                </h2>
              </div>
              <div className="mt-12 space-y-4">
                {faqs.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-[22px] border border-neutral-200 bg-neutral-50 p-6"
                  >
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col gap-6 rounded-[30px] border border-neutral-200 bg-neutral-50 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                  Related services
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                  Need a wider digital system instead of just one service?
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {relatedServices.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-900"
                  >
                    {item.label}
                    <ArrowUpRight className="size-4" strokeWidth={2.2} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-28">
          <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
            <div className="flex flex-col items-center justify-center gap-5 rounded-[30px] border border-neutral-200 bg-neutral-950 px-6 py-10 text-center text-white sm:px-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-300">
                Ready to start
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                See the right direction before committing.
              </h2>
              <p className="max-w-xl text-sm leading-6 text-neutral-300 sm:text-base">
                Share your current website, your goals, or a few business
                details and we&rsquo;ll create a practical concept for you.
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
                >
                  Request My Free Concept
                  <ArrowRight className="size-4" strokeWidth={2.2} />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40"
                >
                  Explore services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
