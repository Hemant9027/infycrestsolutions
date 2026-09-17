import {
  AppWindow,
  ArrowUpRight,
  CalendarCheck2,
  ChartNoAxesCombined,
  Code2,
  ShoppingBag,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import Reveal, { Eyebrow } from "@/components/Reveal";

const SERVICES = [
  {
    icon: AppWindow,
    title: "Business Websites",
    description:
      "Modern websites designed to build trust and generate enquiries.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    description:
      "Online stores with clear product discovery, ordering and payment flows.",
  },
  {
    icon: CalendarCheck2,
    title: "Booking Systems",
    description:
      "Booking experiences for hotels, villas, appointments and reservations.",
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Business-specific applications built around the way your team works.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Admin Dashboards",
    description:
      "Focused interfaces for managing content, users, orders and data.",
  },
  {
    icon: Workflow,
    title: "Automation",
    description:
      "Connect the tools you already use and reduce repetitive work.",
  },
];

export default function WhatWeBuild() {
  return (
    <section
      id="services"
      className="scroll-mt-28 border-y border-neutral-100 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Eyebrow>02 / What We Build</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Digital systems built around real business goals.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500 lg:ml-auto">
              Whether you need a stronger website, a booking flow, custom
              software or automation, we design around the outcome your business
              actually needs.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal
              key={service.title}
              delay={(index % 3) * 80}
              className="h-full"
            >
              <article className="group flex h-full flex-col bg-white p-6 transition-colors duration-300 hover:bg-neutral-50 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-900 transition-transform duration-300 group-hover:-translate-y-1">
                    <service.icon className="size-5" strokeWidth={1.7} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-12 text-lg font-semibold tracking-tight text-neutral-900">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                  {service.description}
                </p>
                <Link
                  href="#contact"
                  className="mt-7 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-neutral-900"
                >
                  Explore service
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
