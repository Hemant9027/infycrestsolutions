import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessOutcomes from "@/components/BusinessOutcomes";
import IndustrySolutions from "@/components/IndustrySolutions";
import FinalCTA from "@/components/FinalCTA";
import { SITE } from "@/config/site";

const SERVICES = [
  {
    title: "Web Development",
    description:
      "Modern, conversion-aware websites and digital systems built around the way your business works.",
    href: "/web-development",
  },
  {
    title: "Website Design",
    description:
      "Premium digital design that improves trust, clarity and the customer journey from the first screen onward.",
    href: "/website-design",
  },
  {
    title: "Booking Systems",
    description:
      "Guest and customer booking flows designed to reduce friction and keep enquiries easier to manage.",
    href: "/booking-systems",
  },
  {
    title: "E-commerce",
    description:
      "Storefronts and sales flows that help customers browse products and complete a purchase with confidence.",
    href: "/ecommerce",
  },
  {
    title: "Custom Software",
    description:
      "Internal systems and custom tools built to simplify operations, data and everyday workflows.",
    href: "/custom-software",
  },
  {
    title: "Automation",
    description:
      "Workflows that reduce manual admin tasks and keep communication and handoffs more consistent.",
    href: "/automation",
  },
  {
    title: "SEO",
    description:
      "Technical and on-page improvements that support better discoverability and clearer business messaging online.",
    href: "/seo",
  },
];

export const metadata: Metadata = {
  title: "Services | Website Design, Development & Digital Systems",
  description:
    "Explore InfyCrest Solutions services for website design, web development, booking systems, e-commerce, custom software, automation and SEO.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | InfyCrest Solutions",
    description:
      "Website design, web development, booking systems, e-commerce, custom software, automation and SEO for growth-focused businesses.",
    url: `${SITE.url}/services`,
    siteName: SITE.name,
    type: "website",
  },
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
                Digital solutions that help businesses grow with less friction.
              </h1>
            </div>
            <div className="lg:pb-2">
              <p className="max-w-md text-base leading-7 text-neutral-500 sm:text-lg">
                From the first website concept to booking flows, e-commerce,
                software and technical SEO, we build the digital parts that
                support a smoother customer journey.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contact"
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

        <section id="services" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {SERVICES.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group rounded-[28px] border border-neutral-200 bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                      Service
                    </span>
                    <ArrowUpRight className="size-4 text-neutral-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900" />
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-neutral-900">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {service.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <BusinessOutcomes />
        <IndustrySolutions />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
