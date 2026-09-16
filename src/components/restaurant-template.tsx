"use client";

import React, {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
  type FormEvent,
} from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  Menu as MenuIcon,
  X,
  MapPin,
  Clock,
  Phone,
  UtensilsCrossed,
} from "lucide-react";
import type { NewCustomer } from "@/lib/new-customers";

// --- HELPERS ---
const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;
const restImg = (num: number) => `/restaurant/${num}.jpg`;

// --- ANIMATION COMPONENT ---
function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const translate =
    direction === "up"
      ? "translate-y-10"
      : direction === "left"
        ? "-translate-x-10"
        : "translate-x-10";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 transform-none" : `opacity-0 ${translate}`}`}
    >
      {children}
    </div>
  );
}

// --- COMPONENTS ---

export function Navbar({
  customer,
  scrolled,
}: {
  customer: NewCustomer;
  scrolled: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const brandName = text(customer.businessName, "Aurelia");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${scrolled ? "bg-[#f4f0e8]/95 backdrop-blur-md border-b border-[#24221e]/10 py-2 shadow-sm" : "bg-transparent py-6"}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Left Links */}
        <nav
          className={`hidden flex-1 gap-8 text-[11px] uppercase tracking-[0.25em] md:flex ${scrolled ? "text-[#24221e]" : "text-white"}`}
        >
          <a
            href="#story"
            className="hover:text-[var(--brand-accent)] transition-colors"
          >
            Story
          </a>
          <a
            href="#menu"
            className="hover:text-[var(--brand-accent)] transition-colors"
          >
            Menu
          </a>
        </nav>

        {/* Centered Logo */}
        <a
          href="#top"
          className={`font-serif text-2xl tracking-[0.18em] uppercase text-center flex-1 md:flex-none ${scrolled ? "text-[#24221e]" : "text-white drop-shadow-md"}`}
        >
          {brandName}
        </a>

        {/* Right Links & CTA */}
        <div className="hidden flex-1 justify-end items-center gap-8 md:flex">
          <nav
            className={`flex gap-8 text-[11px] uppercase tracking-[0.25em] ${scrolled ? "text-[#24221e]" : "text-white"}`}
          >
            <a
              href="#gallery"
              className="hover:text-[var(--brand-accent)] transition-colors"
            >
              Gallery
            </a>
          </nav>
          <a
            href="#reserve"
            className={`rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all duration-500 ${scrolled ? "bg-[var(--brand-accent)] text-[#24221e] hover:bg-[#24221e] hover:text-white" : "bg-[var(--brand-accent)] text-[#171916] hover:bg-white"}`}
          >
            {text(customer.CTA.label, "Reserve a table")}
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden ${scrolled ? "text-[#24221e]" : "text-white"}`}
        >
          {menuOpen ? (
            <X className="size-6" />
          ) : (
            <MenuIcon className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-[#f4f0e8] border-b border-[#24221e]/10 transition-all duration-500 overflow-hidden md:hidden ${menuOpen ? "max-h-96" : "max-h-0"}`}
      >
        <nav className="flex flex-col items-center gap-6 py-10 text-[11px] uppercase tracking-[0.25em] text-[#24221e]">
          <a href="#story" onClick={() => setMenuOpen(false)}>
            Story
          </a>
          <a href="#menu" onClick={() => setMenuOpen(false)}>
            Menu
          </a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>
            Gallery
          </a>
          <a
            href="#reserve"
            className="text-[var(--brand-accent)] font-bold mt-4"
            onClick={() => setMenuOpen(false)}
          >
            Reserve a table
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Hero({ customer }: { customer: NewCustomer }) {
  const slideImages =
    customer.gallery?.length >= 3
      ? customer.gallery.slice(0, 3).map((g) => g.image)
      : [restImg(1), restImg(5), restImg(12)];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % slideImages.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [slideImages.length]);

  // Handle dynamic title splitting for the "Aurelia" look
  const fullTitle = text(customer.hero.title, "A table for the curious.");
  const words = fullTitle.split(" ");
  const firstPart = words.slice(0, -2).join(" ") || "A table for";
  const lastPart = words.slice(-2).join(" ") || "the curious.";

  return (
    <section
      id="top"
      className="relative flex min-h-[760px] items-end overflow-hidden px-6 py-24 text-white lg:px-12 h-screen"
    >
      {slideImages.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${idx === currentIndex ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#171916]/90 to-transparent z-10" />
          <Image
            src={img}
            alt="Dining Room"
            fill
            priority={idx === 0}
            unoptimized
            className="object-cover animate-[subtlePan_20s_ease-in-out_infinite]"
          />
        </div>
      ))}

      <div className="relative z-20 mx-auto w-full max-w-7xl">
        <Reveal direction="up">
          <div className="max-w-5xl">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[var(--brand-accent)]">
              {text(customer.hero.eyebrow, "Food with a point of view")}
            </p>
            <h1 className="font-serif text-6xl sm:text-8xl lg:text-9xl font-light leading-[0.88]">
              {firstPart} <br />
              <em className="italic text-[var(--brand-accent)]">{lastPart}</em>
            </h1>
            {customer.hero.description && (
              <p className="mt-8 max-w-xl text-lg text-white/70 font-sans tracking-wide leading-relaxed">
                {customer.hero.description}
              </p>
            )}
            <a
              href="#reserve"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#171916] hover:bg-white transition-colors duration-300"
            >
              {text(customer.hero.primaryCta, "Reserve a table")}{" "}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Story({ customer }: { customer: NewCustomer }) {
  return (
    <section
      id="story"
      className="mx-auto grid max-w-7xl gap-12 px-6 py-28 lg:grid-cols-2 lg:px-12 items-center"
    >
      <Reveal direction="up">
        <h2 className="font-serif text-5xl sm:text-6xl font-light leading-tight">
          {text(customer.about.title, "Dinner, drinks and a little magic.")}
        </h2>
      </Reveal>

      <Reveal direction="left" delay={200}>
        <div className="lg:pt-16">
          <p className="max-w-xl text-xl leading-relaxed text-[#24221e]/65">
            {text(
              customer.about.body,
              "A modern dining room built around fire, seasonality and the pleasure of taking your time.",
            )}
          </p>

          {customer.stats && customer.stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-[#24221e]/10 pt-10 mt-10">
              {customer.stats.slice(0, 3).map((stat, idx) => (
                <div key={idx}>
                  <p className="font-serif text-3xl text-[#24221e] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#a77538]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

export function Menu({ customer }: { customer: NewCustomer }) {
  const menuItems =
    customer.services?.length > 0
      ? customer.services
      : [
          {
            title: "Charred coast vegetables",
            description:
              "Seasonal ingredients, generous plates and a reason to linger.",
          },
          {
            title: "Black garlic risotto",
            description:
              "Seasonal ingredients, generous plates and a reason to linger.",
          },
          {
            title: "Ember-roasted sea bass",
            description:
              "Seasonal ingredients, generous plates and a reason to linger.",
          },
          {
            title: "Dark chocolate torte",
            description:
              "Seasonal ingredients, generous plates and a reason to linger.",
          },
        ];

  return (
    <section
      id="menu"
      className="bg-[#24221e] px-6 py-28 text-[#f4f0e8] lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal direction="up">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--brand-accent)]">
            01 · Tonight&apos;s menu
          </p>
          <div className="mt-10 grid gap-x-12 gap-y-5 md:grid-cols-2">
            {menuItems.map((item, index) => (
              <article
                key={index}
                className="border-t border-white/20 py-8 group"
              >
                <h3 className="font-serif text-3xl font-light group-hover:text-[var(--brand-accent)] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-white/55">{item.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function GridGallery({ customer }: { customer: NewCustomer }) {
  const images =
    customer.gallery?.length > 0
      ? customer.gallery.map((g) => g.image)
      : [
          restImg(7),
          restImg(9),
          restImg(14),
          restImg(18),
          restImg(21),
          restImg(25),
        ];

  return (
    <section id="gallery" className="bg-[#f4f0e8] py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 mb-12">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-[#a77538] mb-4">
            02 · The Experience
          </p>
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {images.slice(0, 6).map((img, idx) => (
            <Reveal key={idx} delay={idx * 100} direction="up">
              <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden group bg-[#24221e]/5">
                <Image
                  unoptimized
                  src={img}
                  alt="Dish Presentation"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Booking({ customer }: { customer: NewCustomer }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      event.currentTarget.reset();
    }, 1500);
  }

  return (
    <section id="reserve" className="mx-auto max-w-7xl px-6 py-28 lg:px-12">
      <Reveal direction="up">
        <p className="text-xs uppercase tracking-[0.28em] text-[#a77538]">
          03 · Reservations
        </p>
        <h2 className="mt-6 max-w-2xl font-serif text-5xl sm:text-6xl font-light leading-none mb-12">
          Save a seat for tonight.
        </h2>
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-16 border-t border-[#24221e]/10 pt-16">
        {/* Contact Details Map */}
        <Reveal direction="up" delay={200}>
          <div className="space-y-8 font-sans text-sm text-[#24221e]/70">
            <div className="flex items-start gap-4">
              <MapPin className="size-5 text-[var(--brand-accent)] mt-0.5" />
              <div>
                <p className="text-[#24221e] font-semibold uppercase tracking-[0.1em] text-[10px] mb-1">
                  Address
                </p>
                <p>{customer.contact.address || "123 Culinary Lane, NY"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="size-5 text-[var(--brand-accent)] mt-0.5" />
              <div>
                <p className="text-[#24221e] font-semibold uppercase tracking-[0.1em] text-[10px] mb-1">
                  Hours
                </p>
                <p>{customer.contact.hours || "Tue-Sun, 5pm - 11pm"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="size-5 text-[var(--brand-accent)] mt-0.5" />
              <div>
                <p className="text-[#24221e] font-semibold uppercase tracking-[0.1em] text-[10px] mb-1">
                  Contact
                </p>
                <a
                  href={`tel:${customer.contact.phone}`}
                  className="hover:text-[var(--brand-accent)] transition-colors"
                >
                  {customer.contact.phone || "+1 (555) 123-4567"}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Elegant Form */}
        <Reveal direction="left" delay={300}>
          <div className="bg-[#24221e] p-8 sm:p-12 text-[#f4f0e8]">
            {sent ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="grid size-12 place-items-center rounded-full bg-[var(--brand-accent)]/20 mb-6">
                  <Check className="size-5 text-[var(--brand-accent)]" />
                </div>
                <h3 className="font-serif text-2xl mb-3">Request Received</h3>
                <p className="text-sm text-[#f4f0e8]/60">
                  We will confirm your table shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <input
                    required
                    name="name"
                    placeholder="Name"
                    className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--brand-accent)] transition-colors placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--brand-accent)] transition-colors placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-1 relative">
                  <input
                    required
                    name="date"
                    type="date"
                    className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--brand-accent)] transition-colors text-white/80 [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
                <div className="space-y-1">
                  <select
                    required
                    name="guests"
                    className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--brand-accent)] transition-colors text-white/80 appearance-none"
                  >
                    <option value="" className="bg-[#24221e]">
                      Guests
                    </option>
                    <option value="1" className="bg-[#24221e]">
                      1
                    </option>
                    <option value="2" className="bg-[#24221e]">
                      2
                    </option>
                    <option value="3" className="bg-[#24221e]">
                      3
                    </option>
                    <option value="4" className="bg-[#24221e]">
                      4
                    </option>
                    <option value="5+" className="bg-[#24221e]">
                      5+
                    </option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <textarea
                    name="message"
                    rows={2}
                    placeholder="Dietary notes or special requests"
                    className="w-full resize-none border-b border-white/20 bg-transparent px-0 py-3 text-sm outline-none focus:border-[var(--brand-accent)] transition-colors placeholder:text-white/40"
                  />
                </div>
                <button
                  disabled={loading}
                  className="mt-6 sm:col-span-2 inline-flex items-center gap-2 rounded-full bg-[var(--brand-accent)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#171916] hover:bg-white w-fit transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Request a table"}{" "}
                  <ArrowUpRight className="size-4" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ customer }: { customer: NewCustomer }) {
  const brandName = text(customer.businessName, "Aurelia");

  return (
    <footer className="border-t border-[#24221e]/10 px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <span className="font-serif text-2xl uppercase tracking-[0.18em] text-[#24221e]">
          {brandName}
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#24221e]/50">
          © {new Date().getFullYear()} {brandName} · Designed by InfyCrest
        </span>
      </div>
    </footer>
  );
}

export function RestaurantTemplate({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Uses customer theme if available, otherwise defaults to Aurelia's signature gold
  const style = {
    "--brand-accent": customer.theme.accent || "#d8ad69",
  } as CSSProperties;

  return (
    <main
      style={style}
      className="bg-[#f4f0e8] font-sans text-[#24221e] selection:bg-[var(--brand-accent)] selection:text-white"
    >
      {/* Required for the slow pan background animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes subtlePan {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.05) translate(-1%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
      `,
        }}
      />

      <Navbar customer={customer} scrolled={scrolled} />
      <Hero customer={customer} />
      <Story customer={customer} />
      <Menu customer={customer} />
      <GridGallery customer={customer} />
      <Booking customer={customer} />
      <Footer customer={customer} />
    </main>
  );
}

const demoCustomer = {
  businessName: "Aurelia",
  theme: { accent: "#d8ad69" },
  hero: {
    eyebrow: "Food with a point of view",
    title: "A table for the curious.",
    description:
      "A modern dining room built around fire, seasonality and the pleasure of taking your time.",
    image: "",
    primaryCta: "Reserve a table",
    secondaryCta: "Explore",
  },
  about: {
    title: "Dinner, drinks and a little magic.",
    body: "A modern dining room built around fire, seasonality and the pleasure of taking your time.",
    image: "",
  },
  services: [],
  whyChooseUs: [],
  stats: [],
  process: [],
  testimonials: [],
  gallery: [],
  faq: [],
  CTA: {
    eyebrow: "Reservations",
    title: "Save a seat",
    description: "",
    label: "Reserve a table",
  },
  contact: {
    email: "hello@aurelia.example",
    phone: "",
    address: "18 Garden Street",
    hours: "Tuesday - Sunday",
  },
  SEO: {
    title: "Aurelia Dining",
    description: "A modern dining room.",
    keywords: ["restaurant"],
  },
  status: "published",
} as unknown as NewCustomer;

export default function AureliaDiningTemplate() {
  return <RestaurantTemplate customer={demoCustomer} />;
}
