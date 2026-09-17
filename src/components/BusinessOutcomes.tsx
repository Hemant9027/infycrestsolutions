import {
  ArrowUpRight,
  Bot,
  CalendarDays,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import Reveal, { Eyebrow } from "@/components/Reveal";

const OUTCOMES = [
  {
    icon: MessageSquare,
    title: "Get more enquiries",
    text: "Make it easy for the right visitor to understand your offer and take the next step.",
  },
  {
    icon: ShoppingCart,
    title: "Accept more orders",
    text: "Give customers a simple path from product discovery to ordering or payment.",
  },
  {
    icon: CalendarDays,
    title: "Increase direct bookings",
    text: "Put availability, contact and booking actions closer to the decision.",
  },
  {
    icon: Bot,
    title: "Automate repetitive work",
    text: "Replace manual handoffs with connected workflows built around your operation.",
  },
];

export default function BusinessOutcomes() {
  return (
    <section className="bg-neutral-50 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Eyebrow>03 / Business Outcomes</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Clearer growth. Smoother operations.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              The right digital product does more than look good. It reduces
              friction, supports the sales process and helps the business run
              more efficiently.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {OUTCOMES.map((outcome, index) => (
            <Reveal key={outcome.title} delay={(index % 2) * 100}>
              <article className="group flex h-full min-h-52 flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_24px_50px_-28px_rgb(10_10_10/0.3)] sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-neutral-950 text-white">
                    <outcome.icon className="size-5" strokeWidth={1.7} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-300">
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-12">
                  <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                    {outcome.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
                    {outcome.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={160}>
          <Link
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900"
          >
            Discuss your outcome <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
