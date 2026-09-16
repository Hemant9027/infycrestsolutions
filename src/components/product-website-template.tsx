"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Menu, X } from "lucide-react";
import { ALL_WEBSITE_TEMPLATE_SLUGS } from "@/lib/product-template-types";

type WebsiteConfig = {
  name: string;
  type: string;
  eyebrow: string;
  headline: string;
  accent: string;
  background: string;
  heroImage: string;
  gallery: string[];
  intro: string;
  detail: string;
  offerings: string[];
  cta: string;
};

const configs: Record<string, WebsiteConfig> = {
  "smilecare-dental": {
    name: "SmileCare",
    type: "Dental clinic",
    eyebrow: "A calmer way to care for your smile",
    headline: "Confidence starts with care.",
    accent: "#6aa99f",
    background: "#edf5f1",
    heroImage: "/dental-clinic/1.jpg",
    gallery: [
      "/dental-clinic/4.jpg",
      "/dental-clinic/8.jpg",
      "/dental-clinic/12.jpg",
    ],
    intro: "Thoughtful dentistry for every chapter of your life.",
    detail:
      "From your first visit to your brightest smile, our team makes modern dental care feel clear, comfortable and personal.",
    offerings: [
      "Preventive care",
      "Cosmetic dentistry",
      "Family appointments",
      "Emergency support",
    ],
    cta: "Book an appointment",
  },
  "medora-health": {
    name: "Medora",
    type: "Health system",
    eyebrow: "Care, connected",
    headline: "Better health. Better together.",
    accent: "#6b8eb5",
    background: "#eef3f8",
    heroImage: "/hospital/1.jpg",
    gallery: ["/hospital/5.jpg", "/hospital/9.jpg", "/hospital/14.jpg"],
    intro: "Specialist care with a human centre.",
    detail:
      "Medora brings physicians, technology and compassionate support together around the people who need it most.",
    offerings: [
      "Find a specialist",
      "Departments",
      "Patient resources",
      "Emergency care",
    ],
    cta: "Find your care",
  },
  "veloura-studio": {
    name: "Veloura",
    type: "Beauty studio",
    eyebrow: "The art of feeling like yourself",
    headline: "Your most beautiful ritual.",
    accent: "#b67f79",
    background: "#f7efec",
    heroImage: "/salon/1.jpg",
    gallery: ["/salon/4.jpg", "/salon/7.jpg", "/salon/12.jpg"],
    intro: "A considered studio for hair, skin and self-expression.",
    detail:
      "Slow down, settle in and leave feeling entirely yourself. Every service is shaped around your features, your rhythm and your day.",
    offerings: [
      "Hair design",
      "Skin rituals",
      "Bridal studio",
      "Private appointments",
    ],
    cta: "Book your ritual",
  },
  "aurelia-dining": {
    name: "Aurelia",
    type: "Fine dining restaurant",
    eyebrow: "Food with a point of view",
    headline: "A table for the curious.",
    accent: "#d8ad69",
    background: "#f4f0e8",
    heroImage: "/restaurant/1.jpg",
    gallery: ["/restaurant/8.jpg", "/restaurant/14.jpg", "/restaurant/20.jpg"],
    intro: "Dinner, drinks and a little magic.",
    detail:
      "A modern dining room built around fire, seasonality and the pleasure of taking your time.",
    offerings: [
      "Seasonal tasting",
      "A la carte",
      "Private dining",
      "Wine cellar",
    ],
    cta: "Reserve a table",
  },
  "afterglow-bar": {
    name: "Afterglow",
    type: "Cocktail bar",
    eyebrow: "Stay for one more",
    headline: "The night starts here.",
    accent: "#ef9c68",
    background: "#251c21",
    heroImage: "/Pub-Cocktail/1.jpg",
    gallery: [
      "/Pub-Cocktail/5.jpg",
      "/Pub-Cocktail/9.jpg",
      "/Pub-Cocktail/14.jpg",
    ],
    intro: "Low light, bright ideas and drinks worth remembering.",
    detail:
      "A late-night room for cocktails, vinyl and the kind of conversations that only happen after dark.",
    offerings: [
      "Signature cocktails",
      "Late kitchen",
      "Live sessions",
      "Private tables",
    ],
    cta: "Plan your night",
  },
  "crumb-hearth": {
    name: "Crumb & Hearth",
    type: "Neighbourhood bakery",
    eyebrow: "Made warm every morning",
    headline: "Good bread. Good company.",
    accent: "#ba7650",
    background: "#fbf2e7",
    heroImage: "/Bakery/1.jpg",
    gallery: ["/Bakery/5.jpg", "/Bakery/9.jpg", "/Bakery/14.jpg"],
    intro: "Small-batch bread, pastry and reasons to linger.",
    detail:
      "Everything is mixed, shaped and baked in our kitchen with patient fermentation and ingredients we are proud to name.",
    offerings: ["Morning bakes", "Sourdough", "Celebration cakes", "Catering"],
    cta: "Order something good",
  },
  dashbite: {
    name: "DashBite",
    type: "Cloud kitchen",
    eyebrow: "Big flavour, sent your way",
    headline: "Your next favourite meal.",
    accent: "#f15f3d",
    background: "#fff3df",
    heroImage: "/Cloud-Kitchen/1.jpg",
    gallery: [
      "/Cloud-Kitchen/4.jpg",
      "/Cloud-Kitchen/8.jpg",
      "/Cloud-Kitchen/12.jpg",
    ],
    intro: "Delivery-first food for busy, hungry days.",
    detail:
      "Bold bowls, generous sides and comfort food with a little more imagination. Order direct and taste the difference.",
    offerings: [
      "Signature bowls",
      "Family bundles",
      "Office lunches",
      "Direct delivery",
    ],
    cta: "Order now",
  },
  "roast-ritual": {
    name: "Roast & Ritual",
    type: "Specialty cafe",
    eyebrow: "Take your time",
    headline: "Coffee worth slowing down for.",
    accent: "#a87955",
    background: "#f4eee5",
    heroImage: "/restaurant/2.jpg",
    gallery: ["/restaurant/6.jpg", "/restaurant/10.jpg", "/restaurant/16.jpg"],
    intro: "A warm room for good coffee and better mornings.",
    detail:
      "We source expressive coffees, bake small and leave space for the rituals that make a day feel like yours.",
    offerings: [
      "Single origin",
      "Slow bar",
      "Fresh pastries",
      "Coffee classes",
    ],
    cta: "Visit the cafe",
  },
  northline: {
    name: "Northline",
    type: "Fashion house",
    eyebrow: "Form, function, feeling",
    headline: "Wear the future well.",
    accent: "#bb8b67",
    background: "#f2f0eb",
    heroImage: "/Business-Tech/1.jpg",
    gallery: [
      "/Business-Tech/4.jpg",
      "/Business-Tech/7.jpg",
      "/Business-Tech/10.jpg",
    ],
    intro: "Quietly confident pieces for a life in motion.",
    detail:
      "Northline makes considered essentials with clean lines, honest materials and a point of view that lasts beyond a season.",
    offerings: [
      "New collection",
      "Tailored essentials",
      "Materials",
      "Journal",
    ],
    cta: "Explore the collection",
  },
  scaleflow: {
    name: "ScaleFlow",
    type: "Product platform",
    eyebrow: "Clarity at every scale",
    headline: "Make growth feel simple.",
    accent: "#67a9a2",
    background: "#edf6f4",
    heroImage: "/Business-Tech/2.jpg",
    gallery: [
      "/Business-Tech/5.jpg",
      "/Business-Tech/8.jpg",
      "/Business-Tech/11.jpg",
    ],
    intro: "The operating layer for teams that are going somewhere.",
    detail:
      "ScaleFlow brings planning, visibility and momentum into one calm workspace so your team can focus on the work that matters.",
    offerings: [
      "Live dashboards",
      "Team workflows",
      "Smart reporting",
      "Integrations",
    ],
    cta: "See how it works",
  },
  launchlab: {
    name: "LaunchLab",
    type: "Digital studio",
    eyebrow: "Ideas into momentum",
    headline: "Make your next move visible.",
    accent: "#f08b54",
    background: "#171a1c",
    heroImage: "/Business-Tech/3.jpg",
    gallery: [
      "/Business-Tech/6.jpg",
      "/Business-Tech/9.jpg",
      "/Business-Tech/12.jpg",
    ],
    intro: "Strategy, identity and digital products for ambitious teams.",
    detail:
      "We help founders turn a sharp idea into a brand people remember and a website that makes the next conversation easier.",
    offerings: [
      "Brand strategy",
      "Digital products",
      "Campaigns",
      "Launch support",
    ],
    cta: "Start a conversation",
  },
  "forge-athletics": {
    name: "Forge",
    type: "Athletics club",
    eyebrow: "Earn your strength",
    headline: "Built for the work.",
    accent: "#d3a85e",
    background: "#202321",
    heroImage: "/gym/1.jpg",
    gallery: ["/gym/5.jpg", "/gym/9.jpg", "/gym/14.jpg"],
    intro: "Training with intent, community and no shortcuts.",
    detail:
      "Forge is a focused training club for people who want to get stronger, move better and keep showing up.",
    offerings: [
      "Strength floor",
      "Group training",
      "Personal coaching",
      "Recovery",
    ],
    cta: "Try a session",
  },
  "frame-soul": {
    name: "Frame & Soul",
    type: "Photography studio",
    eyebrow: "Light, held still",
    headline: "Stories in the quiet details.",
    accent: "#b17f69",
    background: "#f3eee9",
    heroImage: "/photographer/1.jpg",
    gallery: [
      "/photographer/4.jpg",
      "/photographer/8.jpg",
      "/photographer/12.jpg",
    ],
    intro: "An editorial eye for people, places and in-between moments.",
    detail:
      "Frame & Soul creates images with atmosphere and honesty for brands, couples and artists with something real to say.",
    offerings: ["Brand stories", "Portraits", "Weddings", "Editorial"],
    cta: "View the work",
  },
  "island-villa": {
    name: "Island Villa",
    type: "Private retreat",
    eyebrow: "Arrive somewhere else",
    headline: "A slower kind of luxury.",
    accent: "#83b6ae",
    background: "#edf6f4",
    heroImage: "/villa/1.jpg",
    gallery: ["/villa/8.jpg", "/villa/14.jpg", "/villa/22.jpg"],
    intro: "Space, salt air and time that belongs to you.",
    detail:
      "A private island retreat shaped around quiet mornings, open water and the small details that make a stay unforgettable.",
    offerings: ["The villa", "Island days", "Private dining", "Plan your stay"],
    cta: "Enquire about a stay",
  },
};

const aliases: Record<string, string> = {
  "dental-clinic": "smilecare-dental",
  hospital: "medora-health",
  salon: "veloura-studio",
  restaurant: "aurelia-dining",
  "pub-bar": "afterglow-bar",
  bakery: "crumb-hearth",
  "cloud-kitchen": "dashbite",
  cafe: "roast-ritual",
  ecommerce: "northline",
  saas: "scaleflow",
  "startup-agency": "launchlab",
  gym: "forge-athletics",
  photographer: "frame-soul",
  villa: "island-villa",
};

export default function ProductWebsiteTemplate({ slug }: { slug: string }) {
  const config = configs[aliases[slug] ?? slug] ?? configs["aurelia-dining"];
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }
  const isDark =
    config.background.startsWith("#1") || config.background.startsWith("#2");
  const foreground = isDark ? "#f7f2e9" : "#25231f";
  const muted = isDark ? "#f7f2e999" : "#25231f99";
  return (
    <main
      style={
        {
          "--accent": config.accent,
          "--paper": config.background,
          "--ink": foreground,
          "--muted": muted,
        } as CSSProperties
      }
      className="bg-[var(--paper)] text-[var(--ink)]"
    >
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--ink)]/10 bg-[var(--paper)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#top" className="font-serif text-xl tracking-[0.18em]">
            {config.name}
          </a>
          <nav className="hidden gap-8 text-[11px] uppercase tracking-[0.22em] md:flex">
            <a href="#story">Story</a>
            <a href="#offerings">What we do</a>
            <a href="#contact">Contact</a>
          </nav>
          <a
            href="#contact"
            className="hidden rounded-full border border-[var(--accent)] px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] sm:block"
          >
            {config.cta}
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-full border border-[var(--ink)]/20 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-[var(--ink)]/10 bg-[var(--paper)] px-6 py-5 md:hidden">
            <div className="flex flex-col gap-5 text-xs uppercase tracking-[0.2em]">
              <a href="#story" onClick={() => setOpen(false)}>
                Story
              </a>
              <a href="#offerings" onClick={() => setOpen(false)}>
                What we do
              </a>
              <a href="#contact" onClick={() => setOpen(false)}>
                Contact
              </a>
            </div>
          </nav>
        )}
      </header>
      <section
        id="top"
        className="relative flex min-h-[720px] items-end overflow-hidden pb-20 pt-32 lg:min-h-screen lg:pb-28"
      >
        <Image
          src={config.heroImage}
          alt={`${config.name} website hero`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <div className="relative mx-auto w-full max-w-7xl px-6 text-white lg:px-10">
          <p className="mb-7 text-[11px] uppercase tracking-[0.3em] text-[var(--accent)]">
            {config.eyebrow} · {config.type}
          </p>
          <h1 className="max-w-5xl font-serif text-6xl font-light leading-[0.9] sm:text-8xl lg:text-[9rem]">
            {config.headline}
          </h1>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#171717]"
            >
              {config.cta} <ArrowUpRight className="size-4" />
            </a>
            <a
              href="#story"
              className="rounded-full border border-white/40 px-6 py-3.5 text-xs uppercase tracking-[0.16em]"
            >
              Explore the site
            </a>
          </div>
        </div>
      </section>
      <section
        id="story"
        className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.75fr_1.25fr] lg:px-10 lg:py-36"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--accent)]">
            01 · The approach
          </p>
          <h2 className="mt-6 max-w-md font-serif text-5xl font-light leading-[0.98] sm:text-6xl">
            {config.intro}
          </h2>
        </div>
        <div className="max-w-xl lg:pt-16">
          <p className="text-xl leading-relaxed text-[var(--muted)]">
            {config.detail}
          </p>
          <p className="mt-7 text-sm leading-7 text-[var(--muted)]">
            Designed around real people and real decisions, this template gives
            your business a clear voice, a memorable first impression and a path
            to action.
          </p>
        </div>
      </section>
      <section
        id="offerings"
        className="bg-[var(--ink)] px-6 py-24 text-[var(--paper)] lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--accent)]">
            02 · Explore
          </p>
          <div className="mt-8 grid gap-x-12 md:grid-cols-2">
            {config.offerings.map((item, index) => (
              <article
                key={item}
                className="border-t border-[var(--paper)]/20 py-8"
              >
                <p className="font-mono text-xs text-[var(--accent)]">
                  0{index + 1}
                </p>
                <h3 className="mt-4 font-serif text-3xl font-light">{item}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--paper)]/55">
                  A focused experience shaped around what your audience needs to
                  know, feel and do next.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="grid lg:grid-cols-3">
        {config.gallery.map((image, index) => (
          <div
            key={image}
            className={`relative min-h-[360px] ${index === 1 ? "lg:min-h-[520px]" : ""}`}
          >
            <Image
              src={image}
              alt={`${config.name} detail ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </section>
      <section
        id="contact"
        className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-36"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--accent)]">
            03 · Make it yours
          </p>
          <h2 className="mt-6 max-w-md font-serif text-5xl font-light leading-none sm:text-7xl">
            Ready to build something <em>lasting?</em>
          </h2>
        </div>
        <div>
          {sent ? (
            <div className="border-t border-[var(--ink)]/20 py-8">
              <Check className="size-6 text-[var(--accent)]" />
              <h3 className="mt-5 font-serif text-3xl">
                Your message is on its way.
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">
                We&apos;ll be in touch shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="grid gap-5 border-t border-[var(--ink)]/20 pt-8 sm:grid-cols-2"
            >
              <input
                required
                name="name"
                placeholder="Your name"
                className="border-b border-[var(--ink)]/25 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[var(--muted)]"
              />
              <input
                required
                name="contact"
                placeholder="Email or phone"
                className="border-b border-[var(--ink)]/25 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[var(--muted)]"
              />
              <textarea
                required
                name="message"
                rows={4}
                placeholder={`Tell us about your ${config.type.toLowerCase()} website`}
                className="resize-none border-b border-[var(--ink)]/25 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[var(--muted)] sm:col-span-2"
              />
              <button className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--paper)]">
                Start a conversation <ArrowUpRight className="size-4" />
              </button>
            </form>
          )}
        </div>
      </section>
      <footer className="flex flex-col justify-between gap-5 border-t border-[var(--ink)]/10 px-6 py-9 sm:flex-row sm:items-center lg:px-10">
        <span className="font-serif text-2xl">{config.name}</span>
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]"
        >
          An InfyCrest Solutions template
        </Link>
      </footer>
    </main>
  );
}
