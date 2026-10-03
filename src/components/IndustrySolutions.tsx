import {
  Anchor,
  ArrowUpRight,
  Globe,
  Hotel,
  Map,
  MessageCircle,
  ShoppingBag,
  Utensils,
  Waves,
} from "lucide-react";
import Link from "next/link";
import Reveal, { Eyebrow } from "@/components/Reveal";

const HOSPITALITY_SERVICES = [
  { icon: Hotel, label: "Hotel & Resort Websites", href: "/hospitality" },
  {
    icon: Map,
    label: "Villa & Vacation Rental Websites",
    href: "/hospitality",
  },
  { icon: Anchor, label: "Direct Booking Systems", href: "/booking-systems" },
  { icon: Utensils, label: "Restaurant Reservations", href: "/hospitality" },
  { icon: Waves, label: "Marina & Yacht Websites", href: "/hospitality" },
  { icon: MessageCircle, label: "WhatsApp Booking", href: "/contact" },
  {
    icon: Globe,
    label: "Airbnb / Expedia integrations",
    href: "/booking-systems",
  },
  { icon: ShoppingBag, label: "E-commerce", href: "/ecommerce" },
];

export default function IndustrySolutions() {
  return (
    <section
      id="industries"
      className="scroll-mt-28 border-y border-neutral-100 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>06 / Hospitality & Tourism</Eyebrow>
          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-neutral-900">
              Digital Solutions for Hospitality & Tourism
            </h2>
            <p className="max-w-md text-[15.5px] leading-relaxed text-neutral-500">
              Purpose-built digital experiences for hotels, villas, resorts,
              vacation rentals, restaurants, marinas and tourism businesses.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HOSPITALITY_SERVICES.map((service, index) => (
            <Reveal key={service.label} delay={(index % 4) * 80}>
              <Link
                href={service.href}
                className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-white"
              >
                <span className="flex items-center gap-3.5">
                  <service.icon
                    className="size-5 text-neutral-700"
                    strokeWidth={1.7}
                  />
                  <span className="text-[15px] font-semibold text-neutral-900">
                    {service.label}
                  </span>
                </span>
                <ArrowUpRight className="size-4 text-neutral-300 transition-colors group-hover:text-neutral-900" />
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/hospitality"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            Build My Hospitality Website
            <ArrowUpRight className="size-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
