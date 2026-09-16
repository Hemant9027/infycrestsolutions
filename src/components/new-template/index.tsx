"use client";

import React, {
  useState,
  useEffect,
  type CSSProperties,
  type FormEvent,
} from "react";
import Image from "next/image";
import type { NewCustomer } from "@/lib/new-customers";

// Helper functions and fallbacks
const fallbackImage =
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600";
const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;
const villaImg = (num: number) => `/villa/${num}.jpg`;

export function Navbar({
  customer,
  scrolled,
}: {
  customer: NewCustomer;
  scrolled: boolean;
}) {
  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-slate-950/90 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10">
        <a
          href="#top"
          className={`font-serif text-2xl tracking-widest uppercase ${scrolled ? "text-sky-100" : "text-white drop-shadow-md"}`}
        >
          {customer.businessName}
        </a>
        <nav
          className={`hidden gap-8 text-xs uppercase tracking-widest font-medium md:flex ${scrolled ? "text-slate-300" : "text-slate-100 drop-shadow-md"}`}
        >
          <a href="#about" className="hover:text-sky-400 transition-colors">
            About
          </a>
          <a href="#services" className="hover:text-sky-400 transition-colors">
            Services
          </a>
          <a href="#gallery" className="hover:text-sky-400 transition-colors">
            Gallery
          </a>
          <a href="#contact" className="hover:text-sky-400 transition-colors">
            Contact
          </a>
        </nav>
        <a
          href="#contact"
          className="border border-sky-400/50 hover:bg-sky-500/20 text-white px-6 py-3 text-xs uppercase tracking-[0.2em] transition-all duration-300 backdrop-blur-sm"
        >
          {text(customer.CTA.label, "Book your stay")}
        </a>
      </div>
    </header>
  );
}

export function Hero({ customer }: { customer: NewCustomer }) {
  // Use customer gallery for slideshow, fallback to your local villa images if empty
  const slideImages =
    customer.gallery?.length >= 4
      ? customer.gallery.slice(0, 4).map((g) => g.image)
      : [villaImg(4), villaImg(12), villaImg(18), villaImg(25)];

  const [currentIndex, setCurrentIndex] = useState(0);
  const heroLine =
    customer.hero.title && customer.hero.title !== customer.businessName
      ? customer.hero.title
      : "A more thoughtful way to move forward";
  const heroDescription = text(
    customer.hero.description,
    "Clear thinking, considered details and an experience built around what matters most.",
  )
    .replaceAll(customer.businessName, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % slideImages.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [slideImages.length]);

  return (
    <section
      id="top"
      className="relative flex h-screen min-h-[800px] items-center justify-center overflow-hidden bg-slate-950 text-white"
    >
      {slideImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-slate-950/40 z-10" />
          <Image
            src={img}
            alt="Hero Background"
            fill
            className="object-cover scale-105 animate-[slowZoom_20s_ease-in-out_infinite]"
            priority={idx === 0}
            unoptimized
          />
        </div>
      ))}
      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center mt-20">
        <p className="text-sm font-sans uppercase tracking-[0.3em] text-sky-300 drop-shadow-md mb-6">
          {text(customer.hero.eyebrow, customer.contact.address)}
        </p>
        <h1 className="font-serif text-6xl sm:text-8xl font-light tracking-tight drop-shadow-lg leading-tight">
          {/* Split title dynamically to italicize the last word */}
          {heroLine.split(" ").slice(0, -1).join(" ")} <br />
          <span className="italic text-sky-100">
            {heroLine.split(" ").slice(-1)}
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl font-serif text-xl italic text-slate-200 drop-shadow-md">
          "{heroDescription}"
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="#about"
            className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] transition-all"
          >
            {text(customer.hero.primaryCta, "Explore")}
          </a>
          <a
            href="#contact"
            className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] transition-all backdrop-blur-sm"
          >
            {text(customer.hero.secondaryCta, "Plan your stay")}
          </a>
        </div>
      </div>
    </section>
  );
}

export function DynamicTicker({ customer }: { customer: NewCustomer }) {
  // Pull titles from services/whyChooseUs to create a dynamic scrolling marquee
  const tickerItems =
    customer.services?.length > 0
      ? customer.services.map((s) => s.title)
      : [
          "Secluded",
          "Private Beach",
          "Blue Holes",
          "Bonefishing Flats",
          "Turquoise Water",
        ];

  return (
    <div className="bg-sky-900 py-4 overflow-hidden border-y border-sky-800 flex whitespace-nowrap">
      <div className="animate-[scroll_30s_linear_infinite] flex gap-12 px-6 text-xs uppercase tracking-[0.25em] text-sky-200 font-medium">
        {tickerItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <span>{item}</span>
            <span>•</span>
          </React.Fragment>
        ))}
        {tickerItems.map((item, idx) => (
          <React.Fragment key={`dup-${idx}`}>
            <span>{item}</span>
            <span>•</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function Stats({ customer }: { customer: NewCustomer }) {
  if (!customer.stats || customer.stats.length === 0) return null;
  return (
    <div className="border-b border-slate-200 bg-white px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-16 gap-y-8 text-center">
        {customer.stats.slice(0, 4).map((stat) => (
          <div key={stat.label}>
            <p className="text-4xl font-serif text-sky-800">{stat.value}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-slate-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function About({ customer }: { customer: NewCustomer }) {
  return (
    <section id="about" className="px-6 py-24 sm:px-10 lg:px-16 bg-sky-50">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-sans font-medium uppercase tracking-[0.3em] text-sky-700 mb-6">
          01 · Welcome to {customer.businessName}
        </p>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight mb-8">
              {text(customer.about.title, "A better experience")
                .split(" ")
                .slice(0, -1)
                .join(" ")}{" "}
              <span className="italic text-sky-800">
                {text(customer.about.title, "A better experience")
                  .split(" ")
                  .slice(-1)}
              </span>
            </h2>
            <p className="text-sm leading-loose text-slate-600 mb-6">
              {text(
                customer.about.body,
                "Thoughtful service, clear communication and details that make a lasting impression.",
              )}
            </p>
          </div>
          <div className="relative">
            <Image
              unoptimized
              src={customer.about.image || villaImg(8)}
              alt="About"
              width={800}
              height={1000}
              className="w-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Services({ customer }: { customer: NewCustomer }) {
  if (!customer.services || customer.services.length === 0) return null;
  return (
    <section
      id="services"
      className="px-6 py-24 sm:px-10 lg:px-16 bg-slate-950 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-sans font-medium uppercase tracking-[0.3em] text-sky-400 mb-6">
          02 · Curated Services
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight mb-16">
          Designed around{" "}
          <span className="italic text-sky-200">your comfort</span>
        </h2>
        <div className="grid gap-px bg-slate-800 sm:grid-cols-2 lg:grid-cols-4 border border-slate-800">
          {customer.services.map((item, idx) => (
            <article
              key={idx}
              className="bg-slate-900 p-8 hover:bg-slate-800 transition-colors"
            >
              <h3 className="font-serif text-xl italic text-sky-100">
                {item.title}
              </h3>
              <p className="mt-3 font-sans text-xs leading-loose text-slate-400 tracking-wide">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gallery({ customer }: { customer: NewCustomer }) {
  const images =
    customer.gallery?.length > 0
      ? customer.gallery
      : [12, 18, 5, 25, 9, 14, 21, 27].map((num) => ({
          image: villaImg(num),
          alt: "Gallery view",
        }));

  return (
    <section id="gallery" className="px-6 py-24 sm:px-10 lg:px-16 bg-sky-50">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-sans font-medium uppercase tracking-[0.3em] text-sky-700 mb-6">
          03 · Gallery
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight mb-12">
          Postcards from{" "}
          <span className="italic text-sky-800">the property</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {images.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden bg-slate-200"
            >
              <Image
                unoptimized
                src={item.image}
                alt={item.alt || `Gallery Image ${idx}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactBooking({ customer }: { customer: NewCustomer }) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact: email,
          requirements: String(form.get("message") || "").trim(),
          demoSlug: customer.slug,
          demoName: customer.businessName,
          businessType: "Customer enquiry",
        }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="px-6 py-24 sm:px-10 lg:px-16 bg-slate-950 text-white"
    >
      <div className="mx-auto max-w-6xl grid gap-16 lg:grid-cols-2">
        {/* Contact Info */}
        <div>
          <p className="text-xs font-sans font-medium uppercase tracking-[0.3em] text-sky-400 mb-6">
            04 · Location & Contact
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light leading-tight mb-6">
            The tide is <span className="italic text-sky-200">waiting</span>
          </h2>
          <p className="text-lg text-slate-400 mb-12">
            {text(
              customer.CTA.description,
              "Every stay is arranged personally. Send a note, or simply pick up the phone.",
            )}
          </p>

          <div className="space-y-6 text-sm text-slate-300">
            <div>
              <p className="text-sky-400 uppercase tracking-widest text-xs mb-1">
                Phone
              </p>
              <a
                href={`tel:${customer.contact.phone}`}
                className="hover:text-white transition-colors"
              >
                {customer.contact.phone}
              </a>
            </div>
            <div>
              <p className="text-sky-400 uppercase tracking-widest text-xs mb-1">
                Email
              </p>
              <a
                href={`mailto:${customer.contact.email}`}
                className="hover:text-white transition-colors"
              >
                {customer.contact.email}
              </a>
            </div>
            <div>
              <p className="text-sky-400 uppercase tracking-widest text-xs mb-1">
                Find Us
              </p>
              <p>{customer.contact.address}</p>
            </div>
            <div>
              <p className="text-sky-400 uppercase tracking-widest text-xs mb-1">
                Hours
              </p>
              <p>{customer.contact.hours}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Form Layout */}
        <div className="bg-white text-slate-900 p-8 sm:p-12 shadow-2xl">
          <h3 className="font-serif text-3xl mb-8">Request your stay</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-sky-600 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-sky-600 bg-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Arrival
                </label>
                <input
                  type="date"
                  name="arrival"
                  className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-sky-600 bg-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Departure
                </label>
                <input
                  type="date"
                  name="departure"
                  className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-sky-600 bg-transparent text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-sky-600 bg-transparent resize-none"
              ></textarea>
            </div>
            <div className="pt-4">
              <p className="text-xs text-slate-500 italic mb-6">
                A real person reads every message. We reply personally — usually
                the same day.
              </p>
              {status === "success" && (
                <p
                  className="mb-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                  role="status"
                >
                  Thank you — your enquiry is received. We&apos;ll connect back
                  with you within 24 hours.
                </p>
              )}
              {status === "error" && (
                <p
                  className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                  role="alert"
                >
                  We couldn&apos;t send your enquiry. Please try again or email
                  us directly.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-sky-900 hover:bg-sky-800 text-white py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors"
              >
                {status === "sending" ? "Sending..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer({ customer }: { customer: NewCustomer }) {
  return (
    <footer className="bg-slate-950 px-6 py-12 text-center text-xs tracking-[0.2em] uppercase text-slate-600 font-sans border-t border-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
        <span className="font-serif text-2xl text-slate-400 italic normal-case tracking-normal">
          {customer.businessName}
        </span>
        <p className="leading-loose">{customer.contact.address}</p>
        <span>
          © {new Date().getFullYear()} {customer.businessName}
        </span>
        <span>Designed by Infycrest Solutions</span>
      </div>
    </footer>
  );
}

export function NewTemplate({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pass dynamic accent colors if needed, defaulting to the luxury sky-blue theme
  const style = {
    "--brand-accent": customer.theme.accent || "#0284c7",
  } as CSSProperties;

  return (
    <div
      style={style}
      className="bg-sky-50 font-sans text-slate-900 selection:bg-sky-900/30"
    >
      {/* Dynamic Keyframes for Ticker and Slow Zoom */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slowZoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `,
        }}
      />

      <Navbar customer={customer} scrolled={scrolled} />
      <Hero customer={customer} />
      <DynamicTicker customer={customer} />
      <Stats customer={customer} />
      <About customer={customer} />
      <Services customer={customer} />
      <Gallery customer={customer} />
      <ContactBooking customer={customer} />
      <Footer customer={customer} />
    </div>
  );
}
