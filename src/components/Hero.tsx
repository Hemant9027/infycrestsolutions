import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { whatsappUrl } from "@/config/site";

const STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "24h", label: "Response" },
  { value: "India-wide", label: "" },
  { value: "Custom", label: "Solutions" },
];

function FloatChip({
  className,
  rotate,
  children,
  slow,
}: {
  className?: string;
  rotate: number;
  children: React.ReactNode;
  slow?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute hidden select-none items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white/90 px-4 py-2.5 text-[12.5px] font-medium text-neutral-600 shadow-[0_16px_40px_-20px_rgb(10_10_10/0.3)] backdrop-blur-md xl:flex ${slow ? "animate-float-slow" : "animate-float"} ${className ?? ""}`}
      style={{ "--float-rotate": `${rotate}deg` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <FloatChip className="left-[6%] top-[38%]" rotate={-6}>
        <span className="size-1.5 rounded-full bg-emerald-500" />
        LaunchKit — Live demo ready
      </FloatChip>
      <FloatChip className="right-[5%] top-[30%]" rotate={5} slow>
        Landing pages ₹999
      </FloatChip>
      <FloatChip className="bottom-[24%] left-[10%]" rotate={4} slow>
        Admin panel included
      </FloatChip>
      <FloatChip className="bottom-[30%] right-[9%]" rotate={-4}>
        <span className="size-1.5 rounded-full bg-neutral-900" />
        WhatsApp ordering flow
      </FloatChip>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-16 pt-36 text-center sm:px-8 sm:pt-44 md:pb-24">
        <Reveal>
          <div className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-1.5 pl-3 pr-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.3em] text-neutral-500">
            <span className="size-2 rounded-full bg-neutral-900" />
            Digital Experiences / 2026
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-8 max-w-5xl text-[clamp(2.7rem,7vw,6.1rem)] font-semibold leading-[1.01] tracking-[-0.042em] text-neutral-900">
            <span className="block">We build the digital systems</span>
            <span className="hero-script block">
              your business needs to grow.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-neutral-500 sm:text-lg">
            From websites and booking flows to software, automation and internal
            operations, we turn business needs into faster paths to enquiries,
            orders and better customer experiences.
          </p>
        </Reveal>

        <Reveal delay={340}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-[52px] items-center gap-2.5 rounded-full bg-neutral-900 px-8 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-neutral-800 hover:shadow-[0_18px_40px_-14px_rgb(10_10_10/0.55)]"
            >
              Start a Project
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="#demos"
              className="group flex h-[52px] items-center gap-2.5 rounded-full border border-neutral-300 bg-white px-8 text-[15px] font-semibold text-neutral-900 transition-all duration-300 hover:border-neutral-900"
            >
              View Our Work
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="border-t border-neutral-100">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 divide-y divide-neutral-100 px-5 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:px-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="group flex items-baseline justify-center gap-2 py-6 transition-colors duration-300 hover:bg-neutral-50 sm:py-8"
              >
                <span className="font-display text-2xl tracking-tight text-neutral-900 transition-transform duration-500 group-hover:-translate-y-0.5 sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-[13px] text-neutral-400 sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default Hero;
