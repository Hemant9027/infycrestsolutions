import {
  ArrowDown,
  ArrowUpRight,
  IndianRupee,
  LayoutDashboard,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Reveal, { Eyebrow } from "./Reveal";
import { WA_LAUNCHKIT } from "@/config/site";

const SHOWCASE = [
  {
    caption: "Minimal / Corporate",
    image: "/Featured-Work-1.png",
    alt: "Responsive real estate website shown across desktop, tablet and mobile screens",
    href: "https://yatradham.org/",
  },
  {
    caption: "Editorial / Studio",
    image: "/Featured-Work-2.png",
    alt: "Responsive real estate website presented in a premium desktop and mobile layout",
    href: "https://www.villaanguillitta.com/",
  },
  {
    caption: "Bold / Dark",
    image: "/Featured-Work-3.png",
    alt: "Responsive real estate website displayed across multiple device mockups",
    href: "https://islandinternationalrealty.com/",
  },
];

const LAUNCHKIT_POINTS = [
  {
    icon: Zap,
    title: "Launch faster",
    desc: "3 pages + admin panel, ready in days",
  },
  {
    icon: IndianRupee,
    title: "Just Custom quote",
    desc: "Scoped to exactly what you need",
  },
  {
    icon: ShieldCheck,
    title: "Zero clutter",
    desc: "One sharp launch, nothing wasted",
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
              Build a stronger{" "}
              <em className="font-display font-normal italic">
                first impression.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              Premium digital experiences built around your brand, your audience
              and your goals — starting concepts you can touch before you
              commit.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-neutral-400 lg:justify-end">
              <span className="rounded-full border border-neutral-200 px-3 py-1">
                Landing Page
              </span>
              <span className="text-neutral-300">—</span>
              <span>Custom quote</span>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:mt-16 md:grid-cols-3 md:gap-5 lg:gap-6">
          {SHOWCASE.map((item, i) => (
            <Reveal
              key={item.caption}
              delay={i * 130}
              className={i === 1 ? "md:translate-y-8" : ""}
            >
              <div className="group transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${item.caption} project`}
                  className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-4"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-[0_24px_60px_-30px_rgb(10_10_10/0.3)]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                </a>
                <div className="mt-4 flex items-center justify-between px-1">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-neutral-400">
                    {String(i + 1).padStart(2, "0")} — {item.caption}
                  </span>
                  <ArrowUpRight className="size-4 text-neutral-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100} className="mt-24 sm:mt-32">
          <div
            id="products"
            className="relative scroll-mt-28 overflow-hidden rounded-[2rem] bg-neutral-950 text-white sm:rounded-[2.5rem]"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.08)_1px,transparent_0)] bg-[size:28px_28px] opacity-60 [mask-image:radial-gradient(80%_80%_at_70%_20%,black,transparent)]" />
              <div className="absolute right-[-120px] top-[-160px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.09),transparent)] blur-2xl" />
              <span className="absolute -bottom-10 left-0 hidden select-none whitespace-nowrap font-display text-[11rem] italic leading-none text-white/[0.045] lg:block">
                LaunchKit — LaunchKit
              </span>
            </div>

            <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:p-16">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-300">
                    3-Page Website / Admin Panel
                  </span>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
                    Smart Starter
                  </span>
                </div>

                <h3 className="mt-7 text-[clamp(2.6rem,5.5vw,4.5rem)] font-semibold leading-none tracking-[-0.03em]">
                  Launch
                  <em className="font-display font-normal italic">Kit</em>
                </h3>

                <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-neutral-400">
                  A polished, conversion-ready website package for businesses
                  that need a strong online launch without the wait.
                </p>

                <ul className="mt-8 space-y-4">
                  {LAUNCHKIT_POINTS.map((point) => (
                    <li key={point.title} className="flex items-start gap-3.5">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                        <point.icon className="size-4 text-neutral-200" />
                      </span>
                      <div>
                        <p className="text-[14.5px] font-semibold text-white">
                          {point.title}
                        </p>
                        <p className="text-[13px] text-neutral-500">
                          {point.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="mt-8 font-display text-lg italic text-neutral-500">
                  “One sharp launch. Zero clutter.”
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href={WA_LAUNCHKIT}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-12 items-center gap-2 rounded-full bg-white px-7 text-[14.5px] font-semibold text-neutral-900 transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_16px_44px_-14px_rgb(255_255_255/0.4)]"
                  >
                    Get LaunchKit
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href="#products"
                    className="group flex h-12 items-center gap-2 rounded-full border border-white/15 px-7 text-[14.5px] font-semibold text-neutral-200 transition-colors duration-300 hover:border-white/40 hover:text-white"
                  >
                    Browse collection
                    <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </a>
                </div>
              </div>

              <div className="relative lg:pl-6">
                <div className="relative rotate-1 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-0">
                  <a
                    href="https://www.momondo.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit LaunchKit project"
                    className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-[0_50px_120px_-40px_rgb(0_0_0/0.8)]">
                      <Image
                        src="/Featured-Work-4.png"
                        alt="LaunchKit responsive website and admin panel shown across multiple devices"
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-contain"
                      />
                    </div>
                  </a>
                  <div className="absolute -left-4 -top-4 flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/90 px-3.5 py-2 text-[12px] font-medium text-neutral-200 shadow-xl backdrop-blur-md sm:-left-6">
                    <LayoutDashboard className="size-3.5 text-emerald-400" />
                    Admin panel included
                  </div>
                  <div className="absolute -bottom-4 right-6 flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/90 px-3.5 py-2 text-[12px] font-medium text-neutral-200 shadow-xl backdrop-blur-md">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live preview ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
