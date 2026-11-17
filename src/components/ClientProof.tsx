import { ArrowUpRight, MessageSquareQuote, Star } from "lucide-react";
import Link from "next/link";
import Reveal, { Eyebrow } from "@/components/Reveal";
import { APPROVED_TESTIMONIALS } from "@/data/testimonials";

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
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {APPROVED_TESTIMONIALS.length > 0 ? (
            APPROVED_TESTIMONIALS.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 100}>
                <article className="h-full rounded-3xl border border-neutral-200 bg-neutral-50/70 p-7 sm:p-9">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-neutral-900 text-white">
                      <MessageSquareQuote className="size-5" strokeWidth={1.7} />
                    </span>
                    {testimonial.rating ? (
                      <span className="flex items-center gap-1 text-xs text-neutral-600">
                        {Array.from({ length: testimonial.rating }).map((_, star) => (
                          <Star key={star} className="size-3.5 fill-current" />
                        ))}
                      </span>
                    ) : null}
                  </div>
                  <blockquote className="mt-7 text-lg leading-8 text-neutral-800">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-7 border-t border-neutral-200 pt-5">
                    <p className="font-semibold text-neutral-900">
                      {testimonial.clientName}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {testimonial.businessName} · {testimonial.service}
                    </p>
                  </div>
                  {testimonial.projectUrl ? (
                    <a
                      href={testimonial.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900"
                    >
                      View project <ArrowUpRight className="size-4" />
                    </a>
                  ) : null}
                </article>
              </Reveal>
            ))
          ) : (
            <Reveal>
              <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/70 p-7 text-sm text-neutral-500 sm:p-9">
                Approved testimonials will appear here as clients give
                permission to publish them.
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
