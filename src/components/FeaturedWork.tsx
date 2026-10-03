import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Reveal, { Eyebrow } from "./Reveal";

const SHOWCASE = [
  {
    title: "Blue Hole Villas",
    business: "Villa & retreat website",
    problem:
      "The property needed a stronger digital story and clearer guest enquiry journey.",
    solution:
      "Luxury villa website with immersive imagery, property details and direct contact flow.",
    deliverables: [
      "Property storytelling",
      "Guest enquiry flow",
      "High-impact photography layout",
    ],
    image: "/villa/1.jpg",
    alt: "Luxury villa website preview",
    href: "/demo/blue-hole-villas",
  },
  {
    title: "Island Villa",
    business: "Hospitality & luxury stay",
    problem:
      "The offer needed a more premium presentation for destination booking and guest trust.",
    solution:
      "High-end hospitality website designed around destination storytelling and guest clarity.",
    deliverables: [
      "Luxury hospitality design",
      "Stay overview pages",
      "Guest enquiry journey",
    ],
    image: "/villa/4.jpg",
    alt: "Luxury island villa website preview",
    href: "/demo/island-villa",
  },
  {
    title: "Aurelia Dining",
    business: "Restaurant & reservation website",
    problem:
      "The brand needed more atmosphere and a smoother path to reservations and dining enquiries.",
    solution:
      "Restaurant experience with premium visual treatment, menu structure and appointment flow.",
    deliverables: [
      "Reservation-focused UX",
      "Menu/story layout",
      "Dining brand presentation",
    ],
    image: "/restaurant/1.jpg",
    alt: "Restaurant website preview",
    href: "/demo/aurelia-dining",
  },
];

export default function FeaturedWork() {
  return (
    <section id="demos" className="scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Eyebrow>01 / Featured Work</Eyebrow>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Digital work that feels premium and performs for the real
              business.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-lg text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              We focus on stronger user journeys, better property storytelling
              and clearer ways to capture enquiries before a prospect decides
              elsewhere.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {SHOWCASE.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 130}
              className={i === 1 ? "md:translate-y-8" : ""}
            >
              <article className="group h-full rounded-[28px] border border-neutral-200 bg-white p-3 shadow-[0_24px_60px_-35px_rgba(10,10,10,0.28)] transition-transform duration-300 hover:-translate-y-1">
                <a
                  href={item.href}
                  aria-label={`Open ${item.title} preview`}
                  className="block rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-4"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] bg-neutral-100">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </a>

                <div className="mt-5 px-1">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-neutral-500">
                    {item.business}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <h3 className="text-[1.35rem] font-semibold tracking-[-0.04em] text-neutral-900">
                      {item.title}
                    </h3>
                    <ArrowUpRight className="size-4 shrink-0 text-neutral-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900" />
                  </div>
                  <div className="mt-5 space-y-3 text-sm text-neutral-600">
                    <p>
                      <span className="font-semibold text-neutral-900">
                        Problem / Opportunity:
                      </span>{" "}
                      {item.problem}
                    </p>
                    <p>
                      <span className="font-semibold text-neutral-900">
                        Solution:
                      </span>{" "}
                      {item.solution}
                    </p>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        Key Deliverables:
                      </p>
                      <ul className="mt-2 space-y-2 pl-4 text-neutral-600">
                        {item.deliverables.map((deliverable) => (
                          <li key={deliverable} className="list-disc leading-6">
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
