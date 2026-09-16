import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatWeBuild from "@/components/WhatWeBuild";
import BusinessOutcomes from "@/components/BusinessOutcomes";
import IndustrySolutions from "@/components/IndustrySolutions";
import FinalCTA from "@/components/FinalCTA";

export const metadata: Metadata = {
  title: "Services | Websites, Software & Automation",
  description:
    "Explore InfyCrest Solutions services for business websites, e-commerce, booking systems, custom software, dashboards and automation.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#fafaf9] pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                InfyCrest / Services
              </p>
              <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-neutral-900 sm:text-7xl lg:text-[clamp(4rem,7vw,7.2rem)]">
                Digital work that moves your business forward.
              </h1>
            </div>
            <div className="lg:pb-2">
              <p className="max-w-md text-base leading-7 text-neutral-500 sm:text-lg">
                From the first useful page to the systems that run behind it, we
                build clear digital experiences around what your business needs
                to do next.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Start a conversation
                  <ArrowUpRight className="size-4" strokeWidth={2.2} />
                </Link>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                >
                  Explore services
                  <ArrowDownRight className="size-4" strokeWidth={2.2} />
                </a>
              </div>
            </div>
          </div>
        </section>
        <WhatWeBuild />
        <BusinessOutcomes />
        <IndustrySolutions />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
