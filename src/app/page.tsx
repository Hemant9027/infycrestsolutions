import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedWork from "@/components/FeaturedWork";
import WhatWeBuild from "@/components/WhatWeBuild";
import BusinessOutcomes from "@/components/BusinessOutcomes";
import TechMarquee from "@/components/TechMarquee";
import Products from "@/components/Products";
import IndustrySolutions from "@/components/IndustrySolutions";
import WhyInfyCrest from "@/components/WhyInfyCrest";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import TrustFAQ from "@/components/TrustFAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

function FreeWebsiteConcept() {
  return (
    <section className="border-y border-neutral-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-7 shadow-[0_25px_80px_-45px_rgba(10,10,10,0.35)] sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-500">
                Free website concept
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-neutral-900 sm:text-4xl lg:text-[clamp(2.2rem,4vw,3.4rem)]">
                See What Your Business Could Look Like Online
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-neutral-600 sm:text-base">
                Send us your current website, Facebook page, Google Maps
                listing, or basic business details. We&apos;ll create a
                personalized website concept so you can see the direction before
                deciding to work with us.
              </p>
            </div>
            <div className="rounded-[24px] border border-neutral-200 bg-white p-6">
              <div className="space-y-3 text-sm text-neutral-600">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 size-2.5 rounded-full bg-neutral-900" />
                  Share your current website or social page
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 size-2.5 rounded-full bg-neutral-900" />
                  Tell us what you want to improve
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 size-2.5 rounded-full bg-neutral-900" />
                  Receive a concept built around your business
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Request My Free Concept
                </Link>
                <Link
                  href="#demos"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-900"
                >
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FreeWebsiteConcept />
        <FeaturedWork />
        <WhatWeBuild />
        <BusinessOutcomes />
        <Products />
        <IndustrySolutions />
        <WhyInfyCrest />
        <Process />
        <TechMarquee />
        <Pricing />
        <TrustFAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
