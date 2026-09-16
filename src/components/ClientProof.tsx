import { ArrowUpRight, MessageSquareQuote } from "lucide-react";
import Link from "next/link";
import Reveal, { Eyebrow } from "@/components/Reveal";

export default function ClientProof() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-28 border-y border-neutral-100 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>10 / Client Proof</Eyebrow>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <h2 className="max-w-2xl text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Real work first. Real testimonials as they arrive.
            </h2>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              We do not fill this space with invented praise. Browse the work,
              then become the next project we can feature with your permission.
            </p>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/70 p-7 sm:flex-row sm:items-center sm:p-9">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-neutral-900 text-white">
                <MessageSquareQuote className="size-5" strokeWidth={1.7} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  We&apos;ve built projects across multiple industries.
                </h3>
                <p className="mt-1.5 text-sm text-neutral-500">
                  Want to become our next featured project?
                </p>
              </div>
            </div>
            <Link
              href="#contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              Start a Project <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
