import { ChevronDown } from "lucide-react";
import Reveal, { Eyebrow } from "@/components/Reveal";

const FAQS = [
  [
    "How long does a website take?",
    "Timelines depend on scope, content and integrations. We confirm the milestones and launch plan before development begins.",
  ],
  [
    "Will my website work on mobile?",
    "Yes. Production websites are designed and tested for responsive behavior across mobile, tablet and desktop screens.",
  ],
  [
    "Can I update my website later?",
    "Yes, when the project needs it we can provide a CMS or admin interface so your team can manage the relevant content.",
  ],
  [
    "Can you integrate WhatsApp and payments?",
    "Yes, where the chosen provider and project requirements support it. We define those integrations during planning.",
  ],
  [
    "What happens after launch?",
    "We remain available for agreed post-launch support, improvements and the next stage of your digital product.",
  ],
  [
    "How do payments work?",
    "Payment terms are agreed with the scope and milestones in your proposal, so expectations are clear before work starts.",
  ],
] as const;

export default function TrustFAQ() {
  return (
    <section id="faq" className="scroll-mt-28 bg-neutral-50 py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <Eyebrow>11 / Frequently Asked Questions</Eyebrow>
          <h2 className="mt-5 max-w-xl text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
            Clear answers before we start.
          </h2>
          <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-neutral-500">
            Good projects begin with shared expectations. Here are the practical
            questions clients usually ask first.
          </p>
        </Reveal>
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {FAQS.map(([question, answer], index) => (
            <Reveal key={question} delay={(index % 2) * 80}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown className="size-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-relaxed text-neutral-500">
                  {answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
