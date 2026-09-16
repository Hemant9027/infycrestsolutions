"use client";

import React, {
  useRef,
  useState,
  useEffect,
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
  Anchor,
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Citrus,
  Compass,
  Fish,
  Footprints,
  Loader2,
  Mail,
  MapPin,
  Martini,
  Menu,
  Moon,
  Music,
  Phone,
  Sailboat,
  Send,
  Shell,
  Ship,
  Sun,
  Sunset,
  Users,
  Waves,
  X,
} from "lucide-react";

// ============================================================================
// MEDIA MAPPING (1.jpg to 28.jpg)
// ============================================================================

const media = {
  hero: "/villa/1.jpg",
  about: {
    pier: "/villa/2.jpg",
    swing: "/villa/3.jpg",
    balcony: "/villa/4.jpg",
  },
  stay: ["/villa/5.jpg", "/villa/6.jpg", "/villa/7.jpg"],
  beach: "/villa/8.jpg",
  marina: {
    main: "/villa/9.jpg",
  },
  lounge: {
    main: "/villa/10.jpg",
    inset: "/villa/11.jpg",
  },
  explore: [
    {
      src: "/villa/12.jpg",
      alt: "The Barrier Reef",
      title: "The Barrier Reef",
      body: "Andros guards the third-largest barrier reef on Earth — coral gardens and blue-water drop-offs humming with life.",
    },
    {
      src: "/villa/13.jpg",
      alt: "Flats & Bonefishing",
      title: "Flats & Bonefishing",
      body: "Silverside shallows stretch for miles. Anglers cross the world for these tides — South Andros is legendary on the flats.",
    },
    {
      src: "/villa/14.jpg",
      alt: "Blue Holes & Creeks",
      title: "Blue Holes & Creeks",
      body: "Inland and offshore, Andros holds one of the world's greatest concentrations of blue holes — windows into another world.",
    },
    {
      src: "/villa/15.jpg",
      alt: "Settlement Life",
      title: "Settlement Life",
      body: "Johnson Bay and Mars Bay keep Out Island time — friendly, quiet, and genuinely Bahamian.",
    },
  ],
  gallery: Array.from({ length: 12 }, (_, i) => ({
    src: `/villa/${i + 16}.jpg`, // Uses 16.jpg through 27.jpg
    alt: `Villa Gallery Image ${i + 1}`,
    caption: `Villa View ${i + 1}`,
  })),
  booking: "/villa/28.jpg",
};

// ============================================================================
// SHARED PRIMITIVES
// ============================================================================

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  once = true,
  amount = 0.35,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  sizes = "100vw",
  speed = 0.12,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  speed?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const pct = speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${pct}%`, `${pct}%`]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute -inset-y-[14%] inset-x-0"
        style={reduce ? undefined : { y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${imgClassName ?? ""}`}
        />
      </motion.div>
    </div>
  );
}

function Kicker({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.28em] uppercase ${tone === "dark" ? "text-lagoon" : "text-aqua"}`}
    >
      <span
        className={`inline-block size-1.5 rotate-45 ${tone === "dark" ? "bg-coral" : "bg-sun"}`}
      />
      {children}
    </span>
  );
}

function SectionHead({
  index,
  kicker,
  title,
  intro,
  tone = "dark",
  align = "left",
  className,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`relative ${align === "center" ? "text-center" : ""} ${className ?? ""}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute -top-14 font-display text-[7rem] leading-none font-semibold select-none md:-top-20 md:text-[11rem] ${align === "center" ? "left-1/2 -translate-x-1/2" : "-left-2 md:-left-6"} ${tone === "dark" ? "text-outline-dark" : "text-outline-light"}`}
      >
        {index}
      </span>
      <Reveal>
        <Kicker tone={tone}>{kicker}</Kicker>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`font-display mt-5 text-4xl leading-[1.05] font-medium text-balance md:text-6xl ${tone === "dark" ? "text-deep" : "text-shell"}`}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p
            className={`mt-6 max-w-xl text-base leading-relaxed md:text-lg ${align === "center" ? "mx-auto" : ""} ${tone === "dark" ? "text-ink/70" : "text-shell/70"}`}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}

function Marquee({
  items,
  className,
  itemClassName,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={`marquee overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="marquee-track items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className={`flex items-center gap-8 pr-8 whitespace-nowrap md:gap-12 md:pr-12 ${itemClassName ?? ""}`}
              >
                {item}
                <svg
                  viewBox="0 0 10 10"
                  className="size-2 shrink-0 opacity-70"
                  fill="currentColor"
                >
                  <path d="M5 0 10 5 5 10 0 5Z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-3">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-full border ${tone === "dark" ? "border-deep/20 bg-shell text-lagoon" : "border-shell/30 bg-shell/10 text-shell"}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          <path d="M12 3v13" />
          <path d="M12 5.5c3.2.6 5.6 2.4 6.8 5-2.6.2-4.9-.4-6.8-1.8" />
          <path d="M12 5.5c-3.2.6-5.6 2.4-6.8 5 2.6.2 4.9-.4 6.8-1.8" />
          <path d="M4 20c2.4-1.6 4.4-2 6-1.2 1.5.7 3 .7 4.5 0 1.6-.8 3.4-.5 5.5 1.2" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`font-display block text-xl font-semibold tracking-tight ${tone === "dark" ? "text-deep" : "text-shell"}`}
        >
          The Pointe
        </span>
        <span
          className={`mt-1 block text-[9px] font-semibold tracking-[0.3em] uppercase ${tone === "dark" ? "text-ink/50" : "text-shell/60"}`}
        >
          South Andros — Bahamas
        </span>
      </span>
    </span>
  );
}

// ============================================================================
// SECTIONS
// ============================================================================

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#stay", label: "Stay" },
  { href: "#beach", label: "Beach" },
  { href: "#marina", label: "Marina" },
  { href: "#lounge", label: "Bar & Lounge" },
  { href: "#explore", label: "Explore" },
  { href: "#gallery", label: "Gallery" },
];

function Nav() {
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
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solid ? "border-b border-deep/8 bg-shell/85 shadow-[0_10px_40px_-20px_rgba(5,38,46,0.35)] backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 md:px-10">
          <a
            href="#top"
            aria-label="The Pointe — home"
            onClick={() => setOpen(false)}
          >
            <Wordmark tone={solid ? "dark" : "light"} />
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-2 text-[13px] font-semibold tracking-wide transition-colors ${solid ? "text-ink/75 hover:bg-deep/5 hover:text-deep" : "text-shell/80 hover:bg-shell/10 hover:text-shell"}`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="tel:+12423694497"
              className={`hidden items-center gap-2 text-[13px] font-semibold tracking-wide transition-colors xl:flex ${solid ? "text-ink/75 hover:text-deep" : "text-shell/85 hover:text-shell"}`}
            >
              <Phone className="size-3.5" />
              +1 (242) 369-4497
            </a>
            <a
              href="#book"
              className="group hidden items-center gap-1.5 rounded-full bg-coral px-5 py-2.5 text-[13px] font-bold tracking-wide text-shell shadow-[0_10px_30px_-10px_rgba(239,106,75,0.7)] transition-all hover:bg-coral-deep hover:shadow-[0_14px_36px_-10px_rgba(239,106,75,0.85)] sm:flex"
            >
              Plan Your Escape
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              className={`grid size-11 place-items-center rounded-full border transition-colors lg:hidden ${solid ? "border-deep/15 text-deep hover:bg-deep/5" : "border-shell/30 text-shell hover:bg-shell/10"}`}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="noise fixed inset-0 z-40 flex flex-col bg-deep lg:hidden"
          >
            <div className="flex flex-1 flex-col justify-center gap-1 px-8 pt-24">
              {[
                { href: "#about", label: "About" },
                ...NAV_LINKS.slice(1),
                { href: "#contact", label: "Contact" },
                { href: "#book", label: "Book" },
              ].map((l, i) => (
                <motion.a
                  key={l.href + l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.05,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-display group flex items-baseline gap-4 border-b border-shell/8 py-3 text-3xl font-medium text-shell transition-colors hover:text-aqua"
                >
                  <span className="text-[11px] font-sans font-bold tracking-[0.25em] text-aqua/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {l.label}
                  <ArrowUpRight className="size-5 self-center opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.a>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="px-8 pb-12 text-sm text-shell/60"
            >
              <p className="font-semibold text-shell">
                Johnson Bay — Mars Bay — South Andros
              </p>
              <a href="tel:+12423694497" className="mt-2 block hover:text-aqua">
                +1 (242) 369-4497
              </a>
              <a
                href="mailto:thepointebahamas@gmail.com"
                className="mt-1 block hover:text-aqua"
              >
                thepointebahamas@gmail.com
              </a>
            </motion.div>
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
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const Word = ({ children, delay }: { children: string; delay: number }) => (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-svh min-h-[640px] overflow-hidden bg-deep"
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: videoY, scale: 1.12 }}
      >
        <Image
          src={media.hero}
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className="size-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-deep/60 via-deep/25 to-deep" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep/55 via-transparent to-deep/25" />
      <div className="noise absolute inset-0" />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-24 md:px-10 md:pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="mb-6 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-sun md:w-20" />
          <p className="text-[11px] font-bold tracking-[0.34em] text-shell/90 uppercase md:text-xs">
            Johnson Bay — Mars Bay — South Andros — The Bahamas
          </p>
        </motion.div>
        <h1 className="font-display max-w-5xl text-[13.5vw] leading-[0.98] font-medium tracking-[-0.02em] text-shell sm:text-[11vw] lg:text-[7.2rem]">
          <Word delay={0.62}>Experience</Word> <Word delay={0.72}>the</Word>{" "}
          <Word delay={0.8}>Real</Word>
          <br />
          <span className="text-sun italic">
            <Word delay={0.9}>Caribbean</Word>
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-coral"
          >
            .
          </motion.span>
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: EASE }}
          className="mt-6 max-w-md text-lg leading-relaxed text-shell/80 md:text-xl"
        >
          An unhurried South Andros escape by the sea.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a
            href="#book"
            className="group inline-flex items-center gap-2.5 rounded-full bg-coral px-7 py-4 text-sm font-bold tracking-wide text-shell shadow-[0_18px_44px_-14px_rgba(239,106,75,0.9)] transition-all hover:bg-coral-deep hover:shadow-[0_22px_54px_-14px_rgba(239,106,75,1)]"
          >
            Plan Your Island Escape
            <ArrowUpRight className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2.5 rounded-full border border-shell/35 px-7 py-4 text-sm font-bold tracking-wide text-shell backdrop-blur-sm transition-colors hover:border-shell hover:bg-shell/10"
          >
            Discover The Pointe
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.45, ease: EASE }}
          className="mt-12 flex flex-wrap gap-x-8 gap-y-3 md:mt-16"
        >
          {[
            { icon: Waves, label: "Directly on the beach" },
            { icon: Anchor, label: "Marina on site" },
            { icon: Martini, label: "Bar & lounge" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-2.5 text-[13px] font-semibold tracking-wide text-shell/75"
            >
              <Icon className="size-4 text-aqua" />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        className="absolute right-6 bottom-6 z-10 hidden flex-col items-center gap-3 text-shell/70 transition-colors hover:text-shell md:right-10 md:flex"
      >
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="h-10 w-px overflow-hidden bg-shell/25">
          <motion.span className="block h-4 w-px animate-scroll-cue bg-sun" />
        </span>
        <ArrowDown className="size-3.5" />
      </motion.a>
    </section>
  );
}

function About() {
  const FACTS = [
    { icon: Waves, label: "On the beach", note: "The sand is your doorstep" },
    { icon: Anchor, label: "Marina", note: "Arrive by land or sea" },
    { icon: Martini, label: "Bar & Lounge", note: "Sunset, poured daily" },
    { icon: MapPin, label: "Johnson Bay", note: "Mars Bay, South Andros" },
  ];
  return (
    <section id="about" className="relative overflow-hidden bg-sand">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[34rem] rounded-full bg-aqua/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 size-[30rem] rounded-full bg-coral/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <SectionHead
              index="01"
              kicker="About The Pointe"
              title={
                <>
                  The island,
                  <br />
                  <em className="text-lagoon">as it should be.</em>
                </>
              }
            />
            <Reveal
              delay={0.2}
              className="mt-8 space-y-5 text-base leading-relaxed text-ink/75 md:text-lg"
            >
              <p>
                The Pointe is a small, family-run island resort set right on the
                sands of Johnson Bay, in Mars Bay — the quiet southern reach of
                South Andros, The Bahamas. No crowds. No schedules. Just clear
                shallows, warm trade winds, and the easy rhythm of a true Out
                Island settlement.
              </p>
              <p>
                Days here are measured in swims and sunsets. Evenings end at the
                Bar &amp; Lounge with a cold drink and the sound of the tide.
                And everything — the beach, the marina, the porch light at dusk
                — is exactly what it promises to be.
              </p>
            </Reveal>
            <Reveal
              delay={0.3}
              className="mt-9 flex items-center gap-4 rounded-2xl border border-deep/10 bg-shell/70 p-5"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lagoon/10 text-lagoon">
                <Sailboat className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.24em] text-lagoon uppercase">
                  Owner &amp; Host
                </p>
                <p className="font-display mt-0.5 text-lg font-semibold text-deep">
                  Mr. George A. Farrington
                </p>
              </div>
            </Reveal>
          </div>
          <div className="relative lg:col-span-7 lg:pl-10">
            <Reveal>
              <ParallaxImage
                src={media.about.pier}
                alt="Wooden pier"
                speed={0.09}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="aspect-[4/3] rounded-[2rem] shadow-[0_40px_80px_-30px_rgba(5,38,46,0.5)]"
              />
            </Reveal>
            <Reveal
              delay={0.15}
              className="relative z-10 -mt-16 ml-auto w-[62%] rotate-2 md:-mt-24"
            >
              <div className="rounded-[1.6rem] border-[6px] border-shell shadow-[0_30px_60px_-25px_rgba(5,38,46,0.55)]">
                <ParallaxImage
                  src={media.about.swing}
                  alt="Swing chair"
                  speed={0.13}
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="aspect-[3/4] rounded-[1.3rem]"
                />
              </div>
            </Reveal>
            <Reveal
              delay={0.25}
              className="absolute -bottom-8 left-0 hidden w-56 -rotate-3 md:block lg:-left-4"
            >
              <div className="rounded-[1.4rem] border-[6px] border-shell shadow-[0_30px_60px_-25px_rgba(5,38,46,0.5)]">
                <ParallaxImage
                  src={media.about.balcony}
                  alt="Balcony"
                  speed={0.16}
                  sizes="240px"
                  className="aspect-[3/4] rounded-[1.1rem]"
                />
              </div>
              <p className="font-display mt-4 text-sm text-ink/60 italic">
                Mornings, measured slowly.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-deep/10 bg-deep/10 md:mt-32 lg:grid-cols-4">
          {FACTS.map(({ icon: Icon, label, note }, i) => (
            <Reveal key={label} delay={i * 0.08} amount={0.5}>
              <div className="group flex h-full flex-col gap-3 bg-shell p-6 transition-colors duration-500 hover:bg-foam/60 md:p-8">
                <span className="grid size-11 place-items-center rounded-full bg-lagoon/10 text-lagoon transition-colors duration-500 group-hover:bg-lagoon group-hover:text-shell">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold text-deep">
                    {label}
                  </p>
                  <p className="mt-1 text-sm text-ink/55">{note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stay() {
  const PROMISES = [
    {
      icon: Waves,
      title: "Wake up by the water",
      body: "The beach is not a short drive away. It is the first thing you see, and the last sound you hear.",
    },
    {
      icon: Sun,
      title: "Island time, kept honestly",
      body: "Breakfast when you're ready. Plans that bend with the weather. Nobody is counting minutes here.",
    },
    {
      icon: Moon,
      title: "Proper, dark-skies quiet",
      body: "South Andros nights are full of stars and nothing else. Sleep the way you meant to.",
    },
  ];
  return (
    <section
      id="stay"
      className="noise relative overflow-hidden bg-deep text-shell"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-[100%] bg-lagoon/25 blur-[120px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            index="02"
            kicker="Stay"
            tone="light"
            title={
              <>
                Stay where the sea
                <br />
                sets <em className="text-aqua">the schedule.</em>
              </>
            }
          />
          <Reveal delay={0.15}>
            <a
              href="#contact"
              className="group hidden items-center gap-2 rounded-full border border-shell/25 px-6 py-3.5 text-sm font-bold tracking-wide text-shell transition-colors hover:border-aqua hover:text-aqua md:inline-flex"
            >
              Ask about availability
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="grid grid-cols-3 gap-3 md:gap-5 lg:col-span-7">
            {[
              { src: media.stay[0], alt: "Cottages", mt: "md:mt-10" },
              { src: media.stay[1], alt: "Hammock", mt: "" },
              { src: media.stay[2], alt: "Palm view", mt: "md:mt-16" },
            ].map((img, i) => (
              <Reveal key={img.src} delay={i * 0.12} className={img.mt}>
                <ParallaxImage
                  src={img.src}
                  alt={img.alt}
                  speed={0.08 + i * 0.03}
                  sizes="(min-width: 1024px) 24vw, 33vw"
                  className="aspect-[3/4.4] rounded-2xl md:rounded-[1.6rem]"
                  imgClassName="transition-transform duration-700 hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
          <div className="lg:col-span-5">
            <Reveal>
              <p className="max-w-md text-lg leading-relaxed text-shell/75">
                Simple island lodging, done properly — comfortable, cared for,
                and closer to the water than any room has a right to be. Rooms
                are booked the island way: directly, with a real conversation.
              </p>
            </Reveal>
            <div className="mt-10 space-y-2">
              {PROMISES.map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={0.1 + i * 0.08}>
                  <div className="group flex gap-5 rounded-2xl border border-shell/10 p-5 transition-colors duration-500 hover:border-aqua/30 hover:bg-shell/5 md:p-6">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-aqua/12 text-aqua transition-colors duration-500 group-hover:bg-aqua group-hover:text-deep">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-shell">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-shell/60">
                        {body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-coral/12 p-5 md:p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-coral text-shell">
                  <Phone className="size-5" />
                </span>
                <p className="flex-1 text-sm leading-relaxed text-shell/80">
                  For dates, details and availability, call{" "}
                  <a
                    href="tel:+12423694497"
                    className="font-bold text-sun underline decoration-sun/40 underline-offset-4 hover:decoration-sun"
                  >
                    +1 (242) 369-4497
                  </a>{" "}
                  and talk to George directly.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Beach() {
  return (
    <section id="beach" className="relative overflow-hidden bg-deep">
      <ParallaxImage
        src={media.beach}
        alt="Beach background"
        speed={0.18}
        sizes="100vw"
        className="h-[85svh] min-h-[540px]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-deep/40" />
      <div className="noise absolute inset-0" />
      <div className="absolute inset-0">
        <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-end px-5 pb-20 md:px-10 md:pb-24">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.34em] text-sun uppercase">
              <span className="inline-block size-1.5 rotate-45 bg-sun" />
              The Beach
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-5 max-w-4xl text-4xl leading-[1.02] font-medium text-shell md:text-7xl">
              Powder sand. Glass-clear water.
              <br />
              <em className="text-aqua">Yours, essentially, alone.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-shell/80">
              Step straight onto the shore and swim in water so clear it hardly
              seems real. Around here, your footprints are usually the only
              ones.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap gap-3">
              {[
                { icon: Sun, label: "Swim before breakfast" },
                { icon: Footprints, label: "Walk the curve of the bay" },
                { icon: Shell, label: "Do nothing, beautifully" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2.5 rounded-full border border-shell/25 bg-deep/30 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-shell backdrop-blur-md"
                >
                  <Icon className="size-4 text-sun" />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Marina() {
  return (
    <section id="marina" className="noise relative overflow-hidden bg-foam">
      <div className="pointer-events-none absolute -top-32 right-0 size-[28rem] rounded-full bg-aqua/30 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <SectionHead
              index="03"
              kicker="The Marina"
              title={
                <>
                  Arrive by water,
                  <br />
                  <em className="text-lagoon">leave by tide.</em>
                </>
              }
              intro="The Pointe keeps its own marina on the calm side of the bay — tie up, step ashore, and you're home. Johnson Bay's sheltered water makes arriving by boat as easy as the rest of your stay."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: Ship,
                  title: "Bring your boat",
                  body: "Cruising the Out Islands? Make The Pointe your South Andros stop — berth, beach, and a cold drink at the dock.",
                },
                {
                  icon: Fish,
                  title: "Angler's latitude",
                  body: "South Andros is legendary on the flats. The marina puts bonefish country within easy reach of your morning coffee.",
                },
              ].map(({ icon: Icon, title, body }, i) => (
                <Reveal key={title} delay={0.1 + i * 0.1}>
                  <div className="h-full rounded-2xl border border-deep/12 bg-shell/80 p-6 transition-shadow duration-500 hover:shadow-[0_24px_50px_-24px_rgba(5,38,46,0.35)]">
                    <span className="grid size-11 place-items-center rounded-full bg-lagoon/10 text-lagoon">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-display mt-4 text-lg font-semibold text-deep">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">
                      {body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <a
                href="tel:+12423694497"
                className="group mt-9 inline-flex items-center gap-2 text-sm font-bold tracking-wide text-lagoon-deep underline decoration-lagoon/40 underline-offset-8 transition-colors hover:text-lagoon hover:decoration-lagoon"
              >
                <Compass className="size-4" /> Planning an arrival by sea? Call
                ahead
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>
          <div className="relative order-1 lg:order-2 lg:col-span-7">
            <Reveal>
              <div className="relative">
                <ParallaxImage
                  src={media.marina.main}
                  alt="Marina view"
                  speed={0.1}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="aspect-[4/3] rounded-[2rem] shadow-[0_40px_80px_-30px_rgba(5,38,46,0.45)]"
                />
                <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl bg-deep px-5 py-4 text-shell shadow-2xl md:-left-8">
                  <Anchor className="size-5 text-aqua" />
                  <div className="text-sm leading-tight">
                    <p className="font-display font-semibold">On-site marina</p>
                    <p className="text-shell/60">at The Pointe, Johnson Bay</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function BarLounge() {
  const NOTES = [
    { icon: Sunset, text: "Front-row sunsets over the bay" },
    { icon: Citrus, text: "Cold drinks, island classics" },
    { icon: Music, text: "Easy conversation, easier pace" },
  ];
  return (
    <section
      id="lounge"
      className="noise relative overflow-hidden bg-deep text-shell"
    >
      <div className="pointer-events-none absolute -top-24 left-1/4 size-[30rem] rounded-full bg-coral/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 size-[26rem] rounded-full bg-sun/12 blur-[110px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <span
              aria-hidden
              className="text-outline-light font-display pointer-events-none absolute -top-16 -left-2 z-10 text-[6.5rem] leading-none font-semibold select-none md:-top-24 md:text-[10rem]"
            >
              04
            </span>
            <Reveal className="ml-auto w-[86%]">
              <ParallaxImage
                src={media.lounge.main}
                alt="Lounge main"
                speed={0.1}
                sizes="(min-width: 1024px) 46vw, 86vw"
                className="aspect-[4/3] rounded-[2rem] shadow-[0_40px_90px_-30px_rgba(216,79,50,0.5)]"
              />
            </Reveal>
            <Reveal
              delay={0.18}
              className="absolute -bottom-10 left-0 w-[46%] -rotate-3 md:-bottom-14"
            >
              <div className="rounded-[1.5rem] border-[5px] border-shell shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)]">
                <ParallaxImage
                  src={media.lounge.inset}
                  alt="Lounge inset"
                  speed={0.14}
                  sizes="(min-width: 1024px) 22vw, 46vw"
                  className="aspect-[3/3.4] rounded-[1.2rem]"
                />
              </div>
            </Reveal>
          </div>
          <div className="mt-14 lg:col-span-5 lg:mt-0">
            <Reveal>
              <Kicker tone="light">Bar &amp; Lounge</Kicker>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display mt-5 text-4xl leading-[1.05] font-medium text-balance text-shell md:text-6xl">
                Golden hour lasts
                <br />
                <em className="text-sun">longer here.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-shell/70">
                The Bar &amp; Lounge at The Pointe is the social heart of the
                property — barefoot afternoons that turn into starlit evenings,
                one unhurried drink at a time. No dress code beyond dry feet.
              </p>
            </Reveal>
            <div className="mt-9 space-y-4">
              {NOTES.map(({ icon: Icon, text }, i) => (
                <Reveal key={text} delay={0.2 + i * 0.08}>
                  <div className="flex items-center gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-coral/15 text-coral">
                      <Icon className="size-4.5" />
                    </span>
                    <p className="text-[15px] font-semibold tracking-wide text-shell/85">
                      {text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Explore() {
  return (
    <section id="explore" className="relative overflow-hidden bg-sand">
      <div className="pointer-events-none absolute top-40 -left-40 size-[30rem] rounded-full bg-lagoon/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            index="05"
            kicker="Explore South Andros"
            title={
              <>
                The quietest island,
                <br />
                <em className="text-lagoon">the wildest water.</em>
              </>
            }
            intro="Andros is the largest, least-spoiled island in The Bahamas — a place of barrier reef, blue holes, and bonefish flats. These waters are the destination; The Pointe is your base camp."
          />
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {media.explore.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.09} amount={0.25}>
              <article className="group relative h-full overflow-hidden rounded-[1.6rem] bg-deep shadow-[0_30px_60px_-30px_rgba(5,38,46,0.5)]">
                <ParallaxImage
                  src={card.src}
                  alt={card.alt}
                  speed={0.09}
                  sizes="(min-width: 1280px) 24vw, (min-width: 640px) 48vw, 100vw"
                  className="aspect-[4/5.2]"
                  imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/25 to-transparent" />
                <span className="font-display absolute top-5 right-5 grid size-9 place-items-center rounded-full bg-shell/15 text-sm font-semibold text-shell backdrop-blur-md">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-2xl font-semibold text-shell">
                    {card.title}
                  </h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-shell/75 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-h-40 group-hover:opacity-100 md:max-h-none md:opacity-90 lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-40 lg:group-hover:opacity-100">
                    {card.body}
                  </p>
                  <span className="mt-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-aqua uppercase">
                    From Johnson Bay
                    <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const SHAPES = [
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[4/3]",
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-[4/3]",
    "aspect-square",
    "aspect-[3/4]",
  ];
  return (
    <section id="gallery" className="relative overflow-hidden bg-shell">
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <SectionHead
          index="06"
          kicker="Gallery"
          title={
            <>
              Postcards from
              <br />
              <em className="text-lagoon">the point of it all.</em>
            </>
          }
          intro="A slow look at island hours — shallows and sunsets, docks at dusk, and water in every shade the word 'blue' has ever deserved."
        />
        <div className="mt-16 columns-2 gap-4 md:columns-3 md:gap-5 [&>*]:mb-4 md:[&>*]:mb-5">
          {media.gallery.map((img, i) => (
            <Reveal key={img.src} delay={(i % 3) * 0.08} amount={0.15}>
              <figure className="group relative overflow-hidden rounded-2xl md:rounded-[1.4rem]">
                <div className={`relative w-full ${SHAPES[i % SHAPES.length]}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="font-display flex items-center gap-2 text-lg font-medium text-shell italic">
                    <span className="inline-block size-1.5 rotate-45 bg-sun" />
                    {img.caption}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const DETAILS = [
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (242) 369-4497",
      href: "tel:+12423694497",
    },
    {
      icon: Mail,
      label: "Email",
      value: "thepointebahamas@gmail.com",
      href: "mailto:thepointebahamas@gmail.com",
    },
    {
      icon: MapPin,
      label: "Find us",
      value: "Johnson Bay, Mars Bay, South Andros, The Bahamas",
    },
    {
      icon: Sailboat,
      label: "Your host",
      value: "Mr. George A. Farrington, Owner",
    },
  ];

  const inputCls =
    "field w-full rounded-xl border border-deep/15 bg-shell/70 p-3 outline-none focus:border-lagoon";
  const labelCls =
    "mb-1.5 block text-[11px] font-bold tracking-[0.2em] uppercase text-ink/55";

  return (
    <section
      id="contact"
      className="noise relative overflow-hidden bg-deep text-shell"
    >
      <div className="pointer-events-none absolute -top-32 right-10 size-[26rem] rounded-full bg-aqua/15 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 size-[24rem] rounded-full bg-coral/12 blur-[110px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <Kicker tone="light">Contact</Kicker>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display mt-5 text-4xl leading-[1.05] font-medium text-balance text-shell md:text-6xl">
                Book direct —<br />
                <em className="text-aqua">the island way.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-shell/70">
                No booking engines, no middlemen. Call, email, or send the form
                — you&apos;ll hear back from the property itself.
              </p>
            </Reveal>
            <div className="mt-10 space-y-2">
              {DETAILS.map(({ icon: Icon, label, value, href }, i) => {
                const inner = (
                  <>
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-shell/8 text-aqua transition-colors duration-500 group-hover:bg-aqua group-hover:text-deep">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-[10px] font-bold tracking-[0.26em] text-shell/45 uppercase">
                        {label}
                      </span>
                      <span className="mt-1 block text-[15px] font-semibold text-shell">
                        {value}
                      </span>
                    </span>
                  </>
                );
                return (
                  <Reveal key={label} delay={0.2 + i * 0.07}>
                    {href ? (
                      <a
                        href={href}
                        className="group flex items-center gap-5 rounded-2xl border border-shell/10 p-4 transition-colors duration-500 hover:border-aqua/40 hover:bg-shell/5"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="group flex items-center gap-5 rounded-2xl border border-shell/10 p-4">
                        {inner}
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.12}>
              <div className="rounded-[2rem] bg-sand p-6 text-deep shadow-[0_50px_100px_-40px_rgba(0,0,0,0.6)] md:p-10">
                {status === "sent" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-h-[26rem] flex-col items-center justify-center text-center"
                  >
                    <span className="grid size-16 place-items-center rounded-full bg-palm/12 text-palm">
                      <CheckCircle2 className="size-8" />
                    </span>
                    <h3 className="font-display mt-6 text-3xl font-semibold">
                      Message received.
                    </h3>
                    <p className="mt-3 max-w-sm text-ink/65">
                      Thank you — your inquiry is on its way to South Andros.
                      We&apos;ll reply personally, usually within a day or two
                      of island time.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-8 rounded-full border border-deep/15 px-6 py-3 text-sm font-bold tracking-wide text-ink/70 transition-colors hover:border-lagoon hover:text-lagoon"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-2xl font-semibold md:text-3xl">
                        Send an inquiry
                      </h3>
                      <span className="hidden text-[10px] font-bold tracking-[0.24em] text-ink/45 uppercase sm:block">
                        Replies from the island
                      </span>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className={labelCls}>
                          Full name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          required
                          placeholder="Alexandra Miller"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelCls}>
                          Email *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelCls}>
                          Phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="guests" className={labelCls}>
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="size-3" /> Guests
                          </span>
                        </label>
                        <input
                          id="guests"
                          name="guests"
                          placeholder="2 adults"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="arrival" className={labelCls}>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3" /> Arrival
                          </span>
                        </label>
                        <input
                          id="arrival"
                          name="arrival"
                          type="date"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="departure" className={labelCls}>
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3" /> Departure
                          </span>
                        </label>
                        <input
                          id="departure"
                          name="departure"
                          type="date"
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className={labelCls}>
                        Your message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Tell us about your trip..."
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                    {status === "error" && (
                      <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral-deep">
                        Something interrupted the signal — please try again, or
                        email us directly at thepointebahamas@gmail.com.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-deep px-7 py-4 text-sm font-bold tracking-wide text-shell transition-all hover:bg-deep-2 disabled:opacity-60 sm:w-auto"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="size-4.5 animate-spin" /> Sending
                          across the flats
                        </>
                      ) : (
                        <>
                          Send inquiry{" "}
                          <Send className="size-4.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingCta() {
  return (
    <section id="book" className="relative overflow-hidden bg-deep">
      <ParallaxImage
        src={media.booking}
        alt="Booking background"
        speed={0.16}
        sizes="100vw"
        className="h-[70svh] min-h-[520px]"
      />
      <div className="absolute inset-0 bg-deep/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-deep via-transparent to-deep" />
      <div className="noise absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="px-5 text-center">
          <Reveal>
            <p className="flex items-center justify-center gap-3 text-[11px] font-bold tracking-[0.34em] text-sun uppercase">
              <span className="h-px w-10 bg-sun/70" />
              The Pointe — South Andros
              <span className="h-px w-10 bg-sun/70" />
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mx-auto mt-6 max-w-4xl text-5xl leading-[1.02] font-medium text-balance text-shell md:text-8xl">
              Plan Your
              <br />
              <em className="text-sun">Island Escape</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-md text-lg text-shell/75">
              One phone call between you and the quietest beach in The Bahamas.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+12423694497"
                className="group inline-flex items-center gap-3 rounded-full bg-coral px-8 py-4.5 text-sm font-bold tracking-wide text-shell shadow-[0_20px_50px_-15px_rgba(239,106,75,0.9)] transition-all hover:bg-coral-deep"
              >
                <Phone className="size-4.5" /> Call +1 (242) 369-4497
              </a>
              <a
                href="mailto:thepointebahamas@gmail.com?subject=Island%20Escape%20Inquiry%20%20The%20Pointe"
                className="inline-flex items-center gap-3 rounded-full border border-shell/35 px-8 py-4.5 text-sm font-bold tracking-wide text-shell backdrop-blur-sm transition-colors hover:border-shell hover:bg-shell/10"
              >
                <Mail className="size-4.5" /> Email The Pointe
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="noise relative overflow-hidden bg-deep text-shell">
      <div className="relative mx-auto max-w-[1400px] px-5 pt-20 pb-10 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-shell/60">
              A family-run boutique island resort on the beach in Johnson Bay,
              Mars Bay — South Andros, The Bahamas. Experience the real
              Caribbean.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[10px] font-bold tracking-[0.28em] text-aqua uppercase">
              Around the resort
            </p>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-shell/70 transition-colors hover:text-shell"
                  >
                    {l.label}{" "}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="text-[10px] font-bold tracking-[0.28em] text-aqua uppercase">
              Talk to us
            </p>
            <ul className="mt-5 space-y-3 text-sm text-shell/70">
              <li>
                <a
                  href="tel:+12423694497"
                  className="font-semibold text-shell transition-colors hover:text-aqua"
                >
                  +1 (242) 369-4497
                </a>
              </li>
              <li>
                <a
                  href="mailto:thepointebahamas@gmail.com"
                  className="transition-colors hover:text-aqua"
                >
                  thepointebahamas@gmail.com
                </a>
              </li>
              <li className="max-w-xs leading-relaxed">
                Johnson Bay, Mars Bay, South Andros, The Bahamas
              </li>
              <li className="text-shell/50">
                Hosted by Mr. George A. Farrington
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-shell/10 pt-8 text-[11px] tracking-wide text-shell/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} The Pointe — South Andros, The Bahamas
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block size-1.5 rotate-45 bg-coral/70" />
            Experience the real Caribbean
          </p>
          <p>Photography — Pexels contributors</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Marquee
        className="border-y border-deep/10 bg-sun py-4"
        itemClassName="font-display text-lg md:text-xl font-semibold uppercase tracking-[0.14em] text-deep"
        items={[
          "Johnson Bay",
          "Mars Bay",
          "South Andros",
          "The Bahamas",
          "On the Beach",
          "Experience the Real Caribbean",
        ]}
      />
      <About />
      <Stay />
      <Beach />
      <Marina />
      <BarLounge />
      <Explore />
      <Gallery />
      <Marquee
        className="bg-aqua py-4"
        itemClassName="font-display text-lg md:text-xl font-semibold uppercase tracking-[0.14em] text-deep"
        items={[
          "Swim",
          "Sail",
          "Sip",
          "Snorkel",
          "Slow down",
          "Stay a while",
          "Plan Your Island Escape",
        ]}
      />
      <Contact />
      <BookingCta />
      <Footer />
    </main>
  );
}
