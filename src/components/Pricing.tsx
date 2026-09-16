import { ArrowUpRight, Check, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal, { Eyebrow } from "@/components/Reveal";
import { PRICING_PLANS, type PricingPlan } from "@/data/pricing";
import { whatsappUrl } from "@/config/site";

function PlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-3xl border bg-white p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5",
        "border-neutral-200 hover:border-neutral-300 hover:shadow-[0_28px_60px_-28px_rgb(10_10_10/0.22)]",
      )}
    >
      <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
        {plan.name}
      </h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-[2.1rem] font-semibold leading-none tracking-[-0.03em] text-neutral-900">
          {plan.price}
        </span>
        <span className="text-[12px] text-neutral-400">/ project</span>
      </div>
      <p className="mt-3 min-h-11 text-[13.5px] leading-relaxed text-neutral-500">
        {plan.description}
      </p>

      <ul className="mt-5 space-y-2.5 border-t border-neutral-100 pt-5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[13px] text-neutral-600"
          >
            <Check
              className="mt-0.5 size-3.5 shrink-0 text-neutral-900"
              strokeWidth={3}
            />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <a
          href={whatsappUrl(
            `Hi InfyCrest Solutions, I'd like to discuss the ${plan.name} package.`,
          )}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "group flex h-11.5 items-center justify-center gap-1.5 rounded-full text-[13.5px] font-semibold transition-all duration-300",
            "bg-neutral-900 text-white hover:bg-neutral-800",
          )}
        >
          {plan.cta}
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </article>
  );
}

function CustomCard() {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-neutral-950 p-7 text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_32px_70px_-28px_rgb(10_10_10/0.6)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid-dark opacity-50 [mask-image:radial-gradient(90%_90%_at_80%_10%,black,transparent)]" />
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      </div>
      <div className="relative flex h-full flex-col">
        <span className="w-fit rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-300">
          Custom Build
        </span>
        <h3 className="mt-6 font-display text-[2.6rem] italic leading-none tracking-tight">
          Let&apos;s Talk
        </h3>
        <p className="mt-4 text-[13.5px] leading-relaxed text-neutral-400">
          Complex scope, deep integrations or a product that doesn&apos;t fit a
          box — we&apos;ll scope it together on a free discovery call.
        </p>
        <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
          {[
            "Free 30-minute discovery call",
            "Detailed project scope",
            "Fixed-price proposal",
            "NDA available",
            "Milestone-based payments",
            "Dedicated project communication",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 text-[13px] text-neutral-300"
            >
              <Check className="size-3.5 text-emerald-400" strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-7">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="group flex h-11.5 items-center justify-center gap-1.5 rounded-full bg-white text-[13.5px] font-semibold text-neutral-900 transition-colors duration-300 hover:bg-neutral-200"
          >
            <PhoneCall className="size-4" />
            Book a Free Discovery Call
          </a>
        </div>
        <p className="relative mt-3 text-center text-[11px] text-neutral-500">
          Average response time — under 24 hours
        </p>
      </div>
    </article>
  );
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-28 border-y border-neutral-100 bg-neutral-50/70 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Eyebrow>10 / Custom Pricing</Eyebrow>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Built around your{" "}
              <em className="font-display font-normal italic">project.</em>
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <CustomCard />
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-xl text-xl leading-relaxed text-neutral-600 lg:pl-8">
              Tell us what you&apos;re building, and we&apos;ll define the right
              scope, requirements, and approach before providing a clear,
              tailored proposal.
            </p>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <p className="mt-8 text-center text-[13px] text-neutral-400">
            All projects include an initial consultation, clear milestones,
            professional communication, and transparent scope.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
