import { Gauge, Handshake, Layers3, MessageSquareText } from "lucide-react";
import Reveal, { Eyebrow } from "@/components/Reveal";

const REASONS = [
  {
    number: "01",
    icon: Gauge,
    title: "Fast execution",
    description:
      "Launch your website, MVP or internal tool in weeks with a focused scope and a clear path to release.",
  },
  {
    number: "02",
    icon: Layers3,
    title: "Business-first development",
    description:
      "We understand the problem before choosing the technology, so every feature has a job to do.",
  },
  {
    number: "03",
    icon: MessageSquareText,
    title: "Transparent communication",
    description:
      "Clear milestones, regular updates and visible work keep decisions moving without surprise costs.",
  },
  {
    number: "04",
    icon: Handshake,
    title: "Support after launch",
    description:
      "We stay available for improvements, updates and the next stage of growth after deployment.",
  },
];

export default function WhyInfyCrest() {
  return (
    <section className="border-y border-neutral-100 bg-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <Eyebrow>07 / Why InfyCrest</Eyebrow>
            <h2 className="mt-5 max-w-2xl text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Built for business outcomes, not just design.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              We start with how your business works, then choose the right
              technology to make the process clearer, faster and easier to grow.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, index) => (
            <Reveal key={reason.number} delay={index * 100}>
              <article className="h-full border-t border-neutral-200 pt-6 transition-transform duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400">
                    {reason.number}
                  </span>
                  <reason.icon
                    className="size-5 text-neutral-700"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="mt-10 text-[17px] font-semibold tracking-tight text-neutral-900">
                  {reason.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-neutral-500">
                  {reason.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
