import {
  Gauge,
  Globe,
  Handshake,
  Layers3,
  MessageSquareText,
  Smartphone,
} from "lucide-react";
import Reveal, { Eyebrow } from "@/components/Reveal";

const REASONS = [
  {
    number: "01",
    icon: Layers3,
    title: "Custom-built digital solutions",
    description:
      "We start with your workflow and build the right digital layer instead of forcing a generic template.",
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Mobile-first development",
    description:
      "Your site is designed for the way people browse, enquire and book when they are on their phones.",
  },
  {
    number: "03",
    icon: Gauge,
    title: "Modern performance-focused websites",
    description:
      "We keep the experience clean, quick and practical so it feels premium without unnecessary baggage.",
  },
  {
    number: "04",
    icon: MessageSquareText,
    title: "Booking & payment integrations",
    description:
      "We support customer journeys that need clearer enquiry, booking or payment steps.",
  },
  {
    number: "05",
    icon: Handshake,
    title: "WhatsApp business integrations",
    description:
      "We make it easier for guests or clients to reach your team directly in the channel they already use.",
  },
  {
    number: "06",
    icon: Globe,
    title: "SEO-friendly technical foundation",
    description:
      "A better structure helps search engines read the site more clearly and improves long-term visibility.",
  },
];

export default function WhyInfyCrest() {
  return (
    <section className="border-y border-neutral-100 bg-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <Eyebrow>07 / Why Businesses Choose InfyCrest</Eyebrow>
            <h2 className="mt-5 max-w-2xl text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Why Businesses Choose InfyCrest
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              Practical digital systems, a cleaner customer journey and a
              realistic path from idea to launch.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <Reveal key={reason.number} delay={index * 90}>
              <article className="h-full border-t border-neutral-200 pt-6 transition-transform duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-600">
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

        <div className="mt-10 flex flex-wrap justify-center gap-3 text-center text-[11px] font-medium tracking-[0.18em] text-neutral-600">
          <span>Custom-built solutions</span>
          <span>•</span>
          <span>Mobile-first</span>
          <span>•</span>
          <span>Booking & payment integrations</span>
          <span>•</span>
          <span>WhatsApp integrations</span>
          <span>•</span>
          <span>SEO-friendly foundation</span>
          <span>•</span>
          <span>International clients</span>
          <span>•</span>
          <span>India + USA operations</span>
        </div>
      </div>
    </section>
  );
}
