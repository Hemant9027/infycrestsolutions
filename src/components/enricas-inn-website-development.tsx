"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Bird,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  Feather,
  Footprints,
  HandHeart,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  MoonStar,
  Plus,
  Send,
  Shell,
  Sunrise,
  Waves,
  Wind,
  X,
} from "lucide-react";

// ============================================================================
// SITE CONFIGURATION & DATA
// ============================================================================

const SITE = {
  name: "Enrica's Inn",
  town: "Matthew Town",
  island: "Inagua",
  country: "The Bahamas",
  email: "palacious44@hotmail.com",
  mailto: "mailto:palacious44@hotmail.com",
  mailtoPlan:
    "mailto:palacious44@hotmail.com?subject=Planning%20my%20stay%20at%20Enrica%27s%20Inn",
  hero: "Discover the Quiet Side of The Bahamas",
};

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Stay", href: "#stay" },
  { label: "Island Life", href: "#island" },
  { label: "Town", href: "#town" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
] as const;

// Images 9 to 28 assigned to the gallery
const GALLERY = Array.from({ length: 20 }, (_, i) => ({
  src: `/villa/${i + 9}.jpg`,
  caption: `Villa View ${i + 1}`,
  alt: `Beautiful villa view ${i + 1}`,
}));

const HALLMARKS = [
  {
    icon: Feather,
    title: "Independent & small",
    text: "A true island inn — personal, unpretentious, and rooted in the community it calls home.",
  },
  {
    icon: HandHeart,
    title: "Warm local hospitality",
    text: "You are greeted like a guest, not a reservation number. That is simply how Inagua does things.",
  },
  {
    icon: MoonStar,
    title: "Peaceful by nature",
    text: "No crowds, no queues, no noise — just the wind in the palms and time that finally slows down.",
  },
];

const FEELINGS = [
  { no: "i", word: "Shade", note: "palm-shadowed afternoons" },
  { no: "ii", word: "Breeze", note: "windows open to the trade winds" },
  { no: "iii", word: "Quiet", note: "nights that are actually still" },
  { no: "iv", word: "Rest", note: "the deep island kind" },
];

const TRAITS = [
  {
    icon: Bird,
    title: "Flamingo country",
    text: "Great Inagua is famed for its vast resident flocks of flamingos that sweep pink across the salt flats — one of the largest colonies in the Western Hemisphere.",
  },
  {
    icon: Waves,
    title: "Salt & sea",
    text: "Salt has been harvested from the island's pans for decades. The rhythm of wind, water, and crystal still shapes daily life here.",
  },
  {
    icon: Wind,
    title: "Room to breathe",
    text: "One of the least-crowded islands in the archipelago. Long horizons, empty shores, and skies that belong to the birds.",
  },
];

const WANDERS = [
  {
    icon: Footprints,
    title: "Walk, don't rush",
    text: "A handful of sun-washed streets, pastel cottages, and sea at the end of almost every view.",
  },
  {
    icon: Sunrise,
    title: "Keep island hours",
    text: "Mornings start gently, afternoons stretch long, and evenings gather softly over the water.",
  },
  {
    icon: HeartHandshake,
    title: "Say good morning",
    text: "Matthew Town is the kind of place where strangers are greeted like neighbours — because by the second day, they are.",
  },
];

const WORDS = [
  "slow mornings",
  "salt air",
  "warm welcomes",
  "quiet nights",
  "island time",
  "flamingo skies",
  "sea breeze",
  "unhurried days",
];

const SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

// ============================================================================
// UI COMPONENTS
// ============================================================================

function Eyebrow({
  index,
  children,
  tone = "light",
}: {
  index: string;
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <p
      className={`flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.32em] ${
        tone === "light" ? "text-sea" : "text-lagoon"
      }`}
    >
      <span
        className={`font-display italic tracking-normal ${tone === "light" ? "text-coral" : "text-gold"}`}
      >
        {index}
      </span>
      <span
        className={`h-px w-10 ${tone === "light" ? "bg-sea/40" : "bg-lagoon/40"}`}
        aria-hidden="true"
      />
      {children}
    </p>
  );
}

function PrimaryCta({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <a
      href={SITE.mailto}
      className={`group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold tracking-wide transition-all duration-500 ease-out ${
        dark
          ? "bg-cream text-ink hover:bg-gold hover:text-pine"
          : "bg-pine text-cream hover:bg-sea"
      } hover:shadow-[0_18px_40px_-12px_rgba(15,35,30,0.55)] ${className}`}
    >
      <Mail
        className="size-4 transition-transform duration-500 group-hover:-rotate-12"
        aria-hidden="true"
      />
      Contact Enrica's Inn
      <ArrowUpRight
        className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
        aria-hidden="true"
      />
    </a>
  );
}

function SecondaryCta({
  className = "",
  href = "#stay",
  dark = false,
}: {
  className?: string;
  href?: string;
  dark?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full border px-7 py-4 text-sm font-semibold tracking-wide transition-all duration-500 ease-out ${
        dark
          ? "border-cream/40 text-cream hover:border-cream hover:bg-cream/10"
          : "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream"
      } ${className}`}
    >
      Plan Your Stay
      <ArrowUpRight
        className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
        aria-hidden="true"
      />
    </a>
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// PAGE SECTIONS
// ============================================================================

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
          solid
            ? "border-b border-ink/10 bg-cream/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className={`group flex items-center gap-2.5 transition-colors duration-500 ${
              solid ? "text-ink" : "text-cream"
            }`}
          >
            <span
              className={`grid size-9 place-items-center rounded-full border transition-colors duration-500 ${
                solid
                  ? "border-ink/20 bg-pine text-cream"
                  : "border-cream/30 bg-cream/10 text-cream backdrop-blur-sm"
              }`}
            >
              <Bird className="size-4" aria-hidden="true" />
            </span>
            <span className="font-display text-lg leading-none tracking-tight">
              Enrica&rsquo;s <em className="font-light italic">Inn</em>
            </span>
          </a>
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.slice(0, 6).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`link-line text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
                  solid
                    ? "text-ink/80 hover:text-ink"
                    : "text-cream/85 hover:text-cream"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.18em] transition-all duration-500 ${
                solid
                  ? "bg-pine text-cream hover:bg-sea"
                  : "bg-cream text-pine hover:bg-gold"
              }`}
            >
              <Mail className="size-3.5" aria-hidden="true" />
              Contact
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`grid size-10 place-items-center rounded-full border transition-colors duration-500 lg:hidden ${
              solid ? "border-ink/20 text-ink" : "border-cream/40 text-cream"
            }`}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col bg-pine text-cream lg:hidden"
          >
            <div className="grain pointer-events-none absolute inset-0" />
            <div className="relative mt-28 flex flex-1 flex-col gap-1 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b border-cream/10 py-4 font-display text-3xl font-light tracking-tight transition-colors hover:text-gold"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={SITE.mailto}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.56,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-cream px-7 py-4 text-sm font-semibold text-pine"
              >
                <Mail className="size-4" aria-hidden="true" />
                Contact Enrica&rsquo;s Inn
              </motion.a>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ delay: 0.7 }}
                className="mt-auto pb-10 text-xs uppercase tracking-[0.3em]"
              >
                {SITE.town} — {SITE.island} — {SITE.country}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
  return (
    <section
      id="top"
      ref={ref}
      className="grain relative flex min-h-svh flex-col overflow-hidden bg-pine text-cream"
    >
      <motion.div
        style={reduce ? undefined : { y: bgY }}
        className="absolute inset-0"
      >
        <Image
          src="/villa/1.jpg"
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className={reduce ? "object-cover" : "animate-kenburns object-cover"}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine/72 via-pine/28 to-pine/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-pine/45 via-transparent to-transparent" />
      </motion.div>
      <motion.div
        style={reduce ? undefined : { opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-24 pt-36 sm:px-8 sm:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="mb-6 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-cream/80"
        >
          <span className="h-px w-12 bg-gold/80" aria-hidden="true" />
          Enrica&rsquo;s Inn — {SITE.town}, {SITE.island}
        </motion.p>
        <h1 className="max-w-5xl font-display text-[clamp(2.9rem,8.5vw,7rem)] font-light leading-[0.98] tracking-[-0.02em]">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.28, ease }}
          >
            Discover the
          </motion.span>
          <motion.span
            className="block italic text-gold"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.42, ease }}
          >
            Quiet Side
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.56, ease }}
          >
            of The Bahamas
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75, ease }}
          className="mt-8 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg"
        >
          A small independent island inn on Inagua — where mornings are slow,
          the welcome is warm, and the sea is never far away.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.92, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <PrimaryCta dark />
          <SecondaryCta dark href="#stay" />
        </motion.div>
      </motion.div>
      <motion.a
        href="#about"
        aria-label="Scroll to learn about Enrica's Inn"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-7 right-6 z-10 hidden items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-cream/70 transition-colors hover:text-cream sm:flex"
      >
        Scroll
        <span className="grid size-10 animate-drift place-items-center rounded-full border border-cream/30">
          <ArrowDown className="size-4" aria-hidden="true" />
        </span>
      </motion.a>
    </section>
  );
}

function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative z-10 -mt-px overflow-hidden border-y border-cream/10 bg-moss py-5 text-cream">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap pr-8">
        {row.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-display text-xl font-light italic tracking-wide text-cream/90"
          >
            {word}
            <Shell className="size-4 text-gold/80" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-cream py-24 sm:py-32"
    >
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 top-16 hidden select-none font-display text-[11rem] font-light italic leading-none text-pine/[0.05] lg:block"
      >
        Inn
      </p>
      <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="relative lg:col-span-6">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
              <Image
                src="/villa/2.jpg"
                alt="Veranda"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover transition-transform duration-[1600ms] ease-out hover:scale-[1.04]"
              />
            </div>
          </Reveal>
          <Reveal
            delay={0.18}
            className="absolute -bottom-10 -right-2 hidden w-56 sm:block lg:-right-8"
          >
            <div className="rotate-3 rounded-2xl bg-white p-2.5 shadow-[0_30px_60px_-25px_rgba(15,35,30,0.45)]">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src="/villa/3.jpg"
                  alt="Garden"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
              <p className="px-1 pb-1 pt-2.5 text-center font-display text-sm italic text-ink/70">
                in the garden
              </p>
            </div>
          </Reveal>
        </div>
        <div className="flex flex-col justify-center lg:col-span-6 lg:pl-8">
          <Reveal>
            <Eyebrow index="01">About Enrica&rsquo;s Inn</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-light leading-[1.04] tracking-[-0.02em] text-pine">
              Hospitality the <em className="italic text-coral">island</em> way
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
              Enrica&rsquo;s Inn is a small, independent island inn in Matthew
              Town, on Great Inagua — one of the quietest corners of The
              Bahamas. There is nothing staged here: just a genuine welcome, an
              easy rhythm, and an island that has stayed wonderfully itself.
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
              Days begin with warm light and birdsong, and end beneath more
              stars than you remembered existed. In between, the island is yours
              to meet at whatever pace you choose.
            </p>
          </Reveal>
          <div className="mt-10 space-y-6">
            {HALLMARKS.map((item, i) => (
              <Reveal key={item.title} delay={0.1 + i * 0.08}>
                <div className="group flex gap-5 border-b border-ink/10 pb-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-sea/25 bg-sea/10 text-sea transition-colors duration-500 group-hover:bg-sea group-hover:text-cream">
                    <item.icon className="size-[1.15rem]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl tracking-tight text-pine">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink/65">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Accommodation() {
  return (
    <section
      id="stay"
      className="relative overflow-hidden bg-parchment py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="02">Accommodation</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-light leading-[1.04] tracking-[-0.02em] text-pine">
                Simple rooms, made for{" "}
                <em className="italic text-coral">rest</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16} className="lg:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-ink/70 sm:text-lg lg:ml-auto">
              Nothing more than you need, and nothing to take away from the
              island outside your window. Comfortable, unhurried, and deeply
              quiet.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <figure className="group relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
                <Image
                  src="/villa/4.jpg"
                  alt="Accommodation Room"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine/35 via-transparent to-transparent opacity-80" />
              </div>
              <figcaption className="absolute bottom-5 left-5 rounded-full bg-cream/90 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-pine backdrop-blur-sm">
                Rest, island style
              </figcaption>
            </figure>
          </Reveal>
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <div role="list">
              {FEELINGS.map((f, i) => (
                <Reveal key={f.word} delay={0.06 * i}>
                  <div
                    role="listitem"
                    className="group flex items-baseline justify-between gap-4 border-b border-ink/10 py-5 first:pt-0"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="font-display text-sm italic text-coral">
                        {f.no}.
                      </span>
                      <span className="font-display text-3xl font-light tracking-tight text-pine transition-transform duration-500 ease-out group-hover:translate-x-2 sm:text-4xl">
                        {f.word}
                      </span>
                    </div>
                    <span className="text-right text-xs uppercase tracking-[0.18em] text-ink/50">
                      {f.note}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="rounded-[1.5rem] border border-sea/25 bg-sea/10 p-7">
                <p className="font-display text-lg italic leading-snug text-pine">
                  &ldquo;For room details and availability, write to us directly
                  — every enquiry is answered personally.&rdquo;
                </p>
                <a
                  href={SITE.mailto}
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sea transition-colors hover:text-pine"
                >
                  {SITE.email}
                  <ArrowUpRight
                    className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function IslandLife() {
  return (
    <section
      id="island"
      className="grain relative overflow-hidden bg-pine py-24 text-cream sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-[28rem] rounded-full bg-sea/20 blur-[120px]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col justify-center lg:col-span-6">
          <Reveal>
            <Eyebrow index="03" tone="dark">
              Life in Inagua
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-light leading-[1.04] tracking-[-0.02em]">
              An island that belongs to the{" "}
              <em className="italic text-gold">birds</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
              Inagua moves to older rhythms — trade winds, tides, and the slow
              circuit of wings overhead. It is wild in the gentlest way: a place
              where nature still sets the schedule, and people are happy to
              follow.
            </p>
          </Reveal>
          <div className="mt-10 space-y-8">
            {TRAITS.map((t, i) => (
              <Reveal key={t.title} delay={0.1 + i * 0.08}>
                <div className="group flex gap-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-lagoon/25 bg-lagoon/10 text-lagoon transition-colors duration-500 group-hover:bg-gold group-hover:text-pine">
                    <t.icon className="size-[1.15rem]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl tracking-tight">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-cream/60">
                      {t.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <Reveal delay={0.1}>
            <figure className="group relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:aspect-[5/5]">
                <Image
                  src="/villa/5.jpg"
                  alt="Island Life"
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine/45 via-transparent to-transparent" />
              </div>
              <figcaption className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <span className="rounded-full bg-pine/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-cream backdrop-blur-sm">
                  The salt flats at dusk
                </span>
                <span className="hidden font-display text-lg italic text-cream/80 sm:block">
                  outnumbered, happily
                </span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-6 border-l-2 border-gold/60 pl-5 font-display text-xl font-light italic leading-snug text-cream/85 sm:text-2xl">
              Here, it is entirely normal to share the horizon with a thousand
              flamingos and not another soul.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Town() {
  return (
    <section
      id="town"
      className="relative overflow-hidden bg-cream py-24 sm:py-32"
    >
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 bottom-10 hidden select-none font-display text-[10rem] font-light italic leading-none text-pine/[0.05] lg:block"
      >
        town
      </p>
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="relative order-2 lg:order-1 lg:col-span-6">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
              <Image
                src="/villa/6.jpg"
                alt="Town View"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover transition-transform duration-[1600ms] ease-out hover:scale-[1.04]"
              />
            </div>
          </Reveal>
          <Reveal
            delay={0.15}
            className="absolute -top-8 right-6 hidden sm:block"
          >
            <div className="grid size-28 -rotate-6 place-items-center rounded-full bg-coral text-center text-cream shadow-[0_24px_50px_-20px_rgba(179,86,44,0.7)]">
              <p className="px-3 font-display text-sm italic leading-tight">
                the island&rsquo;s main settlement
              </p>
            </div>
          </Reveal>
        </div>
        <div className="order-1 flex flex-col justify-center lg:order-2 lg:col-span-6 lg:pl-8">
          <Reveal>
            <Eyebrow index="04">Explore Matthew Town</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-light leading-[1.04] tracking-[-0.02em] text-pine">
              A town that says{" "}
              <em className="italic text-coral">good morning</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
              Matthew Town is Inagua&rsquo;s main settlement — small,
              salt-weathered, and warmly unhurried. There are no crowds to
              navigate and no schedules to keep. Just quiet streets, friendly
              faces, and the sea keeping time in the background.
            </p>
          </Reveal>
          <div className="mt-10 space-y-6">
            {WANDERS.map((w, i) => (
              <Reveal key={w.title} delay={0.1 + i * 0.08}>
                <div className="group flex gap-5 border-b border-ink/10 pb-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-coral/30 bg-coral/10 text-coral transition-colors duration-500 group-hover:bg-coral group-hover:text-cream">
                    <w.icon className="size-[1.15rem]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl tracking-tight text-pine">
                      {w.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink/65">
                      {w.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((i) =>
        i === null ? i : (i + dir + GALLERY.length) % GALLERY.length,
      ),
    [],
  );

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  return (
    <section id="gallery" className="relative bg-parchment py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow index="05">Gallery</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-light leading-[1.04] tracking-[-0.02em] text-pine">
                Moments from the <em className="italic text-coral">island</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.16} className="lg:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-ink/70 lg:ml-auto">
              Light, salt, feathers, and shade — a few glimpses of the quiet
              side, exactly as it looks.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-14">
          <div className="grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[210px] md:grid-cols-4 lg:auto-rows-[250px]">
            {GALLERY.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Open photo: ${img.caption}`}
                className={`group relative overflow-hidden rounded-[1.25rem] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea ${SPANS[i % SPANS.length]}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pine/70 via-pine/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between gap-3 p-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="font-display text-base italic text-cream">
                    {img.caption}
                  </span>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream/20 text-cream backdrop-blur-sm">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Reveal>
      </div>
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex flex-col bg-pine/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={GALLERY[active].caption}
            onClick={close}
          >
            <div className="flex items-center justify-between px-5 py-5 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/60">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(GALLERY.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close gallery"
                className="grid size-11 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream hover:text-pine"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div
              className="relative mx-auto flex w-full max-w-5xl flex-1 items-center px-16 sm:px-24"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem]"
              >
                <Image
                  src={GALLERY[active].src}
                  alt={GALLERY[active].alt}
                  fill
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous photo"
                className="absolute left-3 grid size-11 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream hover:text-pine sm:left-6"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next photo"
                className="absolute right-3 grid size-11 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream hover:text-pine sm:right-6"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
            <p className="pb-8 pt-5 text-center font-display text-xl italic text-cream/85">
              {GALLERY[active].caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LocationSection() {
  return (
    <section
      id="location"
      className="relative overflow-hidden bg-cream py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-center lg:col-span-5">
          <Reveal>
            <Eyebrow index="06">Location</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-light leading-[1.04] tracking-[-0.02em] text-pine">
              Far from the <em className="italic text-coral">crowd</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
              You&rsquo;ll find Enrica&rsquo;s Inn in Matthew Town, on Great
              Inagua — near the southern edge of The Bahamas archipelago. Few
              travellers ever make it this far. That&rsquo;s precisely the
              point.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-4 rounded-[1.25rem] border border-ink/10 bg-white/60 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sea/10 text-sea">
                  <MapPin className="size-[1.15rem]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/50">
                    The inn
                  </p>
                  <p className="mt-1 font-display text-lg leading-snug text-pine">
                    Enrica&rsquo;s Inn — Matthew Town
                    <br />
                    Inagua, The Bahamas
                  </p>
                </div>
              </div>
              <a
                href={SITE.mailto}
                className="group flex items-start gap-4 rounded-[1.25rem] border border-ink/10 bg-white/60 p-5 transition-colors duration-500 hover:border-sea/40 hover:bg-sea/5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-coral/10 text-coral">
                  <Mail className="size-[1.15rem]" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/50">
                    Write to us
                  </p>
                  <p className="link-line mt-1 w-fit font-display text-lg leading-snug text-pine">
                    {SITE.email}
                  </p>
                </div>
              </a>
            </div>
          </Reveal>
        </div>
        <div className="relative lg:col-span-7">
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:aspect-auto lg:h-full lg:min-h-[30rem]">
              <Image
                src="/villa/7.jpg"
                alt="Location View"
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover transition-transform duration-[1600ms] ease-out hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-pine/70 px-5 py-3 text-cream backdrop-blur-sm">
                <Compass className="size-4 text-gold" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Great Inagua — 20.95&deg; N, 73.68&deg; W
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-6 font-display text-xl font-light italic leading-snug text-ink/70 sm:text-2xl">
              &ldquo;Getting away from it all&rdquo; usually just means a
              quieter hotel. Here, it means an entire island.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = SITE.mailto;
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Stay enquiry from ${name || "a future guest"} — Enrica's Inn`,
    );
    const body = encodeURIComponent(
      `Hello, Enrica's Inn\n\n${message}\n\n— ${name}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `${SITE.mailto}?subject=${subject}&body=${body}`;
  };

  const inputCls =
    "w-full rounded-xl border border-cream/20 bg-cream/5 px-5 py-4 text-sm text-cream placeholder:text-cream/40 outline-none transition-all duration-300 focus:border-gold/70 focus:bg-cream/10";

  return (
    <section
      id="contact"
      className="grain relative overflow-hidden bg-pine py-24 text-cream sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 size-[30rem] rounded-full bg-moss/50 blur-[130px]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="flex flex-col justify-center lg:col-span-5">
          <Reveal>
            <Eyebrow index="07" tone="dark">
              Contact
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.6vw,3.9rem)] font-light leading-[1.04] tracking-[-0.02em]">
              Come as you <em className="italic text-gold">are</em>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-md text-base leading-relaxed text-cream/75 sm:text-lg">
              Questions, dates, or simply curiosity — write to the inn directly.
              No booking engines, no call centres. Just a warm reply from the
              island.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-10 rounded-[1.5rem] border border-cream/15 bg-cream/5 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cream/50">
                Email the inn
              </p>
              <p className="mt-3 break-all font-display text-2xl tracking-tight text-gold">
                {SITE.email}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryCta dark className="px-6! py-3!" />
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-sm font-semibold text-cream transition-colors duration-300 hover:border-cream hover:bg-cream/10"
                >
                  {copied ? (
                    <Check className="size-4 text-gold" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied ? "Copied" : "Copy address"}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="rounded-[1.75rem] border border-cream/15 bg-cream/[0.04] p-7 backdrop-blur-sm sm:p-10"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-gold/15 text-gold">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <h3 className="font-display text-2xl font-light tracking-tight">
                Write a note
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">
              This opens your email app with everything ready to send to the
              inn.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">
                  Your name
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Cooper"
                  className={inputCls}
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">
                  Your email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                  autoComplete="email"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">
                  Message
                </span>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Hello — we'd love to stay at Enrica's Inn. Could you tell us about availability?"
                  className={`${inputCls} resize-none`}
                />
              </label>
            </div>
            <button
              type="submit"
              className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-pine transition-all duration-500 ease-out hover:bg-cream hover:shadow-[0_18px_40px_-12px_rgba(217,164,65,0.5)] sm:w-auto"
            >
              Send to Enrica&rsquo;s Inn
              <Send
                className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function BookingCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      id="book"
      ref={ref}
      className="grain relative overflow-hidden bg-deep py-28 text-cream sm:py-40"
    >
      <motion.div
        style={reduce ? undefined : { y }}
        className="absolute inset-0 scale-[1.15]"
      >
        <Image
          src="/villa/8.jpg"
          alt="Golden sunset"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-pine/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/80 via-transparent to-deep/80" />
      </motion.div>
      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-cream/70">
            Enrica&rsquo;s Inn — Inagua
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-light leading-[1.02] tracking-[-0.02em]">
            The island is quiet.
            <br />
            <em className="italic text-gold">The welcome is warm.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
            Tell us when you&rsquo;d like to come, and we&rsquo;ll help you plan
            a stay that moves at island pace.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={SITE.mailto}
              className="group inline-flex items-center gap-3 rounded-full bg-cream px-8 py-4 text-sm font-semibold text-pine transition-all duration-500 ease-out hover:bg-gold hover:shadow-[0_18px_40px_-12px_rgba(250,246,236,0.45)]"
            >
              <Mail
                className="size-4 transition-transform duration-500 group-hover:-rotate-12"
                aria-hidden="true"
              />
              Contact Enrica&rsquo;s Inn
              <ArrowUpRight
                className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </a>
            <a
              href={SITE.mailtoPlan}
              className="group inline-flex items-center gap-3 rounded-full border border-cream/40 px-8 py-4 text-sm font-semibold text-cream transition-all duration-500 ease-out hover:border-cream hover:bg-cream/10"
            >
              Plan Your Stay
              <ArrowUpRight
                className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-8 text-sm text-cream/60">{SITE.email}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-deep text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <a href="#top" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-cream/10 text-cream">
                <Bird className="size-4" aria-hidden="true" />
              </span>
              <span className="font-display text-lg tracking-tight">
                Enrica&rsquo;s <em className="font-light italic">Inn</em>
              </span>
            </a>
            <p className="mt-5 font-display text-xl font-light italic leading-snug text-cream/70">
              Discover the quiet side of The Bahamas.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream/50">
              {SITE.town} — {SITE.island} — {SITE.country}
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-line w-fit text-sm text-cream/65 transition-colors hover:text-cream"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col items-start gap-4">
            <a
              href={SITE.mailto}
              className="group inline-flex items-center gap-3 rounded-full border border-cream/25 px-6 py-3 text-sm font-semibold transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <Mail className="size-4" aria-hidden="true" />
              {SITE.email}
            </a>
            <a
              href="#top"
              className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-cream/50 transition-colors hover:text-cream"
            >
              Back to top
              <span className="grid size-9 place-items-center rounded-full border border-cream/20 transition-transform duration-500 group-hover:-translate-y-1">
                <ArrowUp className="size-4" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-7 text-xs text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Enrica&rsquo;s Inn, Matthew Town, Inagua.</p>
          <p className="font-display italic">quiet mornings, warm welcomes</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default function OnePage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Accommodation />
      <IslandLife />
      <Town />
      <Gallery />
      <LocationSection />
      <Contact />
      <BookingCta />
      <Footer />
    </main>
  );
}
