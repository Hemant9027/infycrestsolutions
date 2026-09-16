import {
  ArrowUpRight,
  Building2,
  HeartPulse,
  Hotel,
  Laptop,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import Reveal, { Eyebrow } from "@/components/Reveal";

const INDUSTRIES = [
  { icon: Utensils, label: "Restaurants & Food" },
  { icon: Hotel, label: "Hotels & Villas" },
  { icon: Building2, label: "Real Estate" },
  { icon: HeartPulse, label: "Healthcare" },
  { icon: ShoppingBag, label: "Retail & E-commerce" },
  { icon: Laptop, label: "Technology & Startups" },
];

export default function IndustrySolutions() {
  return (
    <section
      id="industries"
      className="scroll-mt-28 border-y border-neutral-100 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>06 / Industry Solutions</Eyebrow>
          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Built for businesses like yours.
            </h2>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500">
              Explore the kinds of businesses we design for, from hospitality
              and food to professional services and software.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry, index) => (
            <Reveal key={industry.label} delay={(index % 3) * 80}>
              <Link
                href="/products"
                className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-white"
              >
                <span className="flex items-center gap-3.5">
                  <industry.icon
                    className="size-5 text-neutral-700"
                    strokeWidth={1.7}
                  />
                  <span className="text-[15px] font-semibold text-neutral-900">
                    {industry.label}
                  </span>
                </span>
                <ArrowUpRight className="size-4 text-neutral-300 transition-colors group-hover:text-neutral-900" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
