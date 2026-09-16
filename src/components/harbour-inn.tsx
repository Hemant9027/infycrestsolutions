"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
  type CSSProperties,
} from "react";
import Image from "next/image";
import Lenis from "lenis";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Droplets,
  Fish,
  Flame,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plane,
  Plus,
  Quote,
  Shell,
  TreePine,
  User,
  UtensilsCrossed,
  Waves,
  Wifi,
  X,
  BedDouble,
  CookingPot,
  Refrigerator,
  Armchair,
  ShowerHead,
  Anchor,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

const villaImg = (num: number) => `/villa/${num}.jpg`;

export type CustomerHero = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCta?: string;
};
export type CustomerAbout = {
  title?: string;
  body?: string;
  image?: string;
};
export type CustomerStat = {
  value: string;
  unit: string;
  label: string;
};
export type CustomerService = {
  title: string;
  description: string;
  tag?: string;
  image?: string | null;
};
export type CustomerGalleryItem = {
  image: string;
  caption?: string;
};
export type CustomerContact = {
  address?: string;
  phone?: string;
  email?: string;
  host?: string;
  coordinates?: string;
  mapsUrl?: string;
};
export type CustomerTheme = {
  accent?: string;
};
export type NewCustomer = {
  businessName: string;
  hero: CustomerHero;
  about: CustomerAbout;
  theme: CustomerTheme;
  contact: CustomerContact;
  stats?: CustomerStat[];
  services?: CustomerService[];
  gallery?: CustomerGalleryItem[];
};

export const demoVillaCustomer: NewCustomer = {
  businessName: "Da Bay Area Bonefish Lodge",
  theme: { accent: "#1d5a55" },
  hero: {
    eyebrow: "Mars Bay · South Andros · The Bahamas",
    title: "Fish the Flats of South Andros",
    description:
      "A specialist island lodge at the southern tip of Andros Island — for anglers who measure the day in tides, and travelers drawn to the quiet edge of The Bahamas.",
    primaryCta: "Inquire About Your Stay",
  },
  about: {
    title: "A lodge at the end of the island road",
    body: "Da Bay Area Bonefish Lodge sits in Mars Bay, a small settlement at the southern tip of South Andros — the largest and least developed island in The Bahamas.",
    image: villaImg(4),
  },
  stats: [
    { value: "100", unit: "mi", label: "of pine forest & creeks" },
    { value: "365", unit: "days", label: "of tidal flats" },
    { value: "01", unit: "lodge", label: "specialist island retreat" },
    { value: "24", unit: "hrs", label: "peace & quiet" },
  ],
  services: [
    {
      title: "The grey ghost",
      description:
        "Bonefish — silver, shy, and astonishingly fast — cruise these shallows in singles, doubles, and shadowing schools.",
      tag: "Sight fishing",
      image: villaImg(14),
    },
    {
      title: "Hunted by sight",
      description:
        "This is fishing of light and patience: poling or wading in knee-deep water, reading pushes, wakes, and tails in the glare.",
      tag: "Poling & wading",
      image: villaImg(15),
    },
    {
      title: "A living wilderness",
      description:
        "Turtle-grass meadows, white-sand banks, and mangrove creeks — a nursery for fish and one of the wildest corners of the West Indies.",
      tag: "Ecosystem",
      image: villaImg(16),
    },
  ],
  gallery: [
    { image: villaImg(1), caption: "The grey ghost, released" },
    { image: villaImg(2), caption: "Glass calm at first light" },
    { image: villaImg(3), caption: "Creek country" },
    { image: villaImg(5), caption: "Mid-day palm shade" },
    { image: villaImg(6), caption: "The banks from above" },
    { image: villaImg(7), caption: "Evening over the water" },
    { image: villaImg(8), caption: "Workboats at rest" },
    { image: villaImg(9), caption: "Low water on the bank" },
  ],
  contact: {
    host: "Da Bay Area Team",
    phone: "+1 (242) 471-2225",
    email: "dabayareabonefishlodge@hotmail.com",
    address: "Mars Bay, South Andros, The Bahamas",
    coordinates: "23.77° N · 77.53° W",
    mapsUrl:
      "https://www.google.com/maps?q=Mars+Bay,+South+Andros,+The+Bahamas",
  },
};

const NAV_LINKS = [
  { label: "The Lodge", href: "#lodge" },
  { label: "Stay", href: "#accommodation" },
  { label: "Bonefishing", href: "#bonefishing" },
  { label: "South Andros", href: "#south-andros" },
  { label: "The Flats", href: "#flats" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
];

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;
export const EASE = [0.22, 1, 0.36, 1] as const;

export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12,
  rootMargin = "0px 0px -6% 0px",
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView] as const;
}

/* -------------------------------------------------------------------------- */
/*                              MOTION PRIMITIVES                             */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cx(
        "transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        inView ? "opacity-100 transform-none" : "opacity-0 translate-y-[30px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={cx("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute inset-[-12%_0]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          unoptimized
        />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INTERACTIVE FX                               */
/* -------------------------------------------------------------------------- */

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { duration: 1.5 });
      window.history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      document.removeEventListener("click", onClick);
    };
  }, []);
  return <>{children}</>;
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

export function Navbar({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const brandName = text(customer.businessName, "Da Bay Area Bonefish Lodge");

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

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-[#cfe4da]/10 bg-[#03090c]/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8 md:h-20 lg:px-12 text-[#eef3ec]">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="group flex flex-col leading-none text-[#eef3ec]"
            aria-label="Back to top"
          >
            <span className="font-display text-lg italic tracking-tight">
              Da Bay Area
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.34em] text-[#c9a266] transition-colors group-hover:text-[#eef3ec]">
              Bonefish Lodge
            </span>
          </a>
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[10.5px] uppercase tracking-[0.22em] text-[#eef3ec]/70 transition-colors duration-300 hover:text-[#eef3ec]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="group ml-3 inline-flex items-center gap-2 rounded-full border border-[#c9a266]/60 px-5 py-2 text-[10.5px] uppercase tracking-[0.22em] text-[#c9a266] transition-all duration-400 hover:bg-[#c9a266] hover:text-[#071620]"
            >
              Inquire <ArrowUpRight size={13} />
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 text-[#eef3ec] lg:hidden"
            aria-label="Open menu"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#eef3ec]/70">
              Menu
            </span>
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div
        className={cx(
          "fixed inset-0 z-[70] flex flex-col bg-[#03090c] transition-all duration-500 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 sm:px-8 text-[#eef3ec]">
          <span className="font-display text-lg italic text-[#eef3ec]">
            Da Bay Area
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[#eef3ec]"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-1 px-6 sm:px-10">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cx(
                "group flex items-baseline gap-4 border-b border-[#eef3ec]/10 py-4 transition-all duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
              style={{ transitionDelay: `${80 + i * 60}ms` }}
            >
              <span className="font-display text-sm italic text-[#c9a266]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-4xl font-light text-[#eef3ec] transition-colors group-hover:text-[#c9a266] sm:text-5xl">
                {link.label}
              </span>
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className={cx(
              "mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#c9a266] px-7 py-3.5 text-[11px] uppercase tracking-[0.24em] text-[#071620] transition-all duration-500",
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
            style={{ transitionDelay: "520ms" }}
          >
            Inquire About Your Stay <ArrowUpRight size={14} />
          </a>
        </nav>
      </div>
    </>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 42 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

export function Hero({ customer }: { customer: NewCustomer }) {
  const FACTS = [
    { icon: Plane, label: "5 min from Congo Town Airport" },
    { icon: Waves, label: "Secluded private beach" },
    { icon: Droplets, label: "Blue holes across the street" },
  ];

  const fullTitle = text(
    customer.hero?.title,
    "Fish the Flats of South Andros",
  );
  const words = fullTitle.split(" ");
  const firstPart = words.slice(0, 3).join(" ");
  const italicPart = words.slice(3).join(" ");

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#03090c] text-[#eef3ec]"
    >
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={villaImg(1)}
          aria-hidden="true"
        >
          <source
            src="https://videos.pexels.com/video-files/37083114/15709742_3840_2160_60fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#03090c] via-[#03090c]/25 to-[#03090c]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03090c]/60 via-transparent to-transparent" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end px-5 pb-10 pt-36 sm:px-8"
      >
        <motion.p
          variants={item}
          className="kicker mb-6 flex items-center gap-4 text-[#c9a266]"
        >
          <span className="h-px w-10 bg-[#c9a266]/50" />
          {text(
            customer.hero?.eyebrow,
            "Mars Bay · South Andros · The Bahamas",
          )}
          <span className="hidden h-px w-10 bg-[#c9a266]/50 sm:block" />
        </motion.p>

        <h1 className="font-display text-[clamp(3rem,8.6vw,7.75rem)] font-medium leading-[0.95] tracking-[-0.01em]">
          <motion.span variants={item} className="block">
            {firstPart}
          </motion.span>
          <motion.span
            variants={item}
            className="block font-light italic text-[#cfe4da]"
          >
            {italicPart}
          </motion.span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            variants={item}
            className="max-w-md text-base leading-relaxed text-[#eef3ec]/80 sm:text-lg"
          >
            {text(
              customer.hero?.description,
              "A specialist island lodge at the southern tip of Andros Island — for anglers who measure the day in tides, and travelers drawn to the quiet edge of The Bahamas.",
            )}
          </motion.p>
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#c9a266] px-7 py-3.5 text-sm font-semibold text-[#03090c] transition-colors duration-300 hover:bg-[#cfe4da]"
            >
              {text(customer.hero?.primaryCta, "Inquire About Your Stay")}
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#welcome"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-40 right-8 z-10 hidden flex-col items-center gap-3 lg:flex"
        aria-label="Scroll to welcome"
      >
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#eef3ec]/60 [writing-mode:vertical-rl]">
          scroll
        </span>
        <span className="relative h-16 w-px overflow-hidden bg-[#eef3ec]/20">
          <span className="absolute inset-x-0 h-1/2 animate-drop bg-[#c9a266]" />
        </span>
        <ArrowDown className="h-3.5 w-3.5 text-[#eef3ec]/60" />
      </motion.a>
    </section>
  );
}

export function Marquee() {
  const WORDS = [
    "Da Bay Area Bonefish Lodge",
    "Mars Bay",
    "South Andros",
    "The Bahamas",
    "Bonefish Country",
  ];
  const Sparkle = () => <span className="text-[#c9a266]">✦</span>;
  const Row = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12"
    >
      {WORDS.map((word, i) => (
        <li key={word} className="flex items-center gap-8 md:gap-12">
          <span className="whitespace-nowrap font-display text-2xl font-light italic text-[#eef3ec] md:text-4xl">
            {word}
          </span>
          <Sparkle />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y border-[#eef3ec]/10 bg-[#071620] py-6 md:py-8">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  );
}

export function Welcome({ customer }: { customer: NewCustomer }) {
  return (
    <section
      id="welcome"
      className="relative overflow-hidden bg-[#f4eee0] py-24 md:py-36 text-[#071620]"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="kicker relative pl-[3.25rem] text-[#1d5a55] before:absolute before:left-0 before:top-1/2 before:h-px before:w-10 before:bg-current before:opacity-40">
                01 · About the Lodge
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.01em] text-[#071620]">
                A lodge at the end{" "}
                <em className="font-light italic text-[#1d5a55]">
                  of the island road
                </em>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-8 max-w-xl space-y-5 text-[1.02rem] leading-relaxed text-[#071620]/75">
                <p>
                  {text(
                    customer.about?.body,
                    "Da Bay Area Bonefish Lodge sits in Mars Bay, a small settlement at the southern tip of South Andros — the largest and least developed island in The Bahamas.",
                  )}
                </p>
                <p>
                  It is a specialist island lodge, kept small in spirit: a place
                  for anglers who measure a day in tides rather than hours.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <Reveal delay={120} className="relative ml-auto max-w-md">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-30px_rgba(7,22,32,0.35)]">
                <Image
                  src={villaImg(4)}
                  alt="Lodge view"
                  fill
                  sizes="(min-width: 1024px) 38vw, 90vw"
                  className="object-cover transition-transform duration-[1.8s] ease-out hover:scale-105"
                  unoptimized
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Bonefishing({ customer }: { customer: NewCustomer }) {
  const pillars =
    customer.services && customer.services.length > 0
      ? customer.services
      : [
          {
            title: "The grey ghost",
            description:
              "Bonefish — silver, shy, and astonishingly fast — cruise these shallows in singles, doubles, and shadowing schools.",
          },
          {
            title: "Hunted by sight",
            description:
              "This is fishing of light and patience: poling or wading in knee-deep water, reading pushes, wakes, and tails in the glare.",
          },
          {
            title: "A living wilderness",
            description:
              "Turtle-grass meadows, white-sand banks, and mangrove creeks — a nursery for fish and one of the wildest corners of the West Indies.",
          },
        ];

  return (
    <section
      id="bonefishing"
      className="relative overflow-hidden bg-[#eef3ec] py-24 text-[#071620] md:py-36"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="kicker relative pl-[3.25rem] text-[#1d5a55] before:absolute before:left-0 before:top-1/2 before:h-px before:w-10 before:bg-current before:opacity-40">
                03 · Bonefishing
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.04]">
                Chasing tails on{" "}
                <em className="font-light italic text-[#1d5a55]">
                  the finest flats
                </em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-md text-[1.02rem] leading-relaxed text-[#071620]/70">
              South Andros is bonefish country. From Mars Bay, anglers reach
              vast, lightly fished banks.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 110}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#071620]/10 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d5a55]/10 text-[#1d5a55]">
                    <Fish className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-2xl font-medium text-[#071620]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-[#071620]/65">
                  {pillar.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SouthAndros() {
  const FACTS = [
    {
      title: "The Sleeping Giant",
      body: "Andros is the largest island in The Bahamas — and its wildest: a hundred miles of pine forest, creeks, and quiet settlements.",
    },
    {
      title: "The Andros Barrier Reef",
      body: "Off the east side runs a fringing reef often cited among the largest on Earth.",
    },
    {
      title: "Blue holes & creeks",
      body: "Inland, the island is laced with tidal creeks and vertical blue holes.",
    },
    {
      title: "Mars Bay, the south end",
      body: "The lodge's settlement rests at the island's southern tip.",
    },
  ];

  return (
    <section
      id="south-andros"
      className="bg-[#03090c] py-24 text-[#eef3ec] md:py-36"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <div className="flex items-end gap-4 sm:gap-6">
              <span
                aria-hidden
                className="font-display text-6xl font-light italic leading-[0.8] text-[#eef3ec]/32 sm:text-7xl md:text-8xl"
              >
                04
              </span>
              <div className="pb-1 sm:pb-2">
                <p className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.38em] text-[#c9a266] sm:text-[11px]">
                  <span className="inline-block h-px w-8 bg-[#c9a266]/70 sm:w-12" />{" "}
                  South Andros
                </p>
                <h2 className="font-display text-3xl font-light leading-[1.04] tracking-tight sm:text-5xl md:text-6xl text-[#eef3ec]">
                  The wildest island <br /> in The Bahamas
                </h2>
              </div>
            </div>
            <div className="mt-12 grid gap-x-10 sm:grid-cols-2">
              {FACTS.map((fact, i) => (
                <Reveal
                  key={fact.title}
                  delay={i * 120}
                  className="border-t border-[#eef3ec]/10 py-7"
                >
                  <h3 className="font-display text-lg italic text-[#cfe4da]">
                    {fact.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#eef3ec]/60">
                    {fact.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6">
            <Reveal delay={200}>
              <figure className="group relative overflow-hidden rounded-3xl">
                <Image
                  src={villaImg(17)}
                  alt="South Andros Coast"
                  width={1000}
                  height={1250}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-104"
                  unoptimized
                />
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Gallery({ customer }: { customer: NewCustomer }) {
  const galleryItems =
    customer.gallery && customer.gallery.length > 0
      ? customer.gallery
      : demoVillaCustomer.gallery!;

  return (
    <section
      id="gallery"
      className="bg-[#071620] py-24 md:py-36 text-[#eef3ec]"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex items-end gap-4 sm:gap-6">
              <span
                aria-hidden
                className="font-display text-6xl font-light italic leading-[0.8] text-[#eef3ec]/32 sm:text-7xl md:text-8xl"
              >
                06
              </span>
              <div className="pb-1 sm:pb-2">
                <p className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.38em] text-[#c9a266] sm:text-[11px]">
                  <span className="inline-block h-px w-8 bg-[#c9a266]/70 sm:w-12" />{" "}
                  Gallery
                </p>
                <h2 className="font-display text-3xl font-light leading-[1.04] tracking-tight sm:text-5xl md:text-6xl text-[#eef3ec]">
                  Light, water, <br /> and everything between
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-12 md:gap-6">
          {galleryItems.map((item, i) => (
            <Reveal
              key={item.image + i}
              delay={(i % 3) * 120}
              className={
                i % 3 === 0
                  ? "md:col-span-5"
                  : i % 3 === 1
                    ? "md:col-span-7"
                    : "md:col-span-4"
              }
            >
              <figure className="group relative h-full overflow-hidden aspect-[4/5] rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.caption || ""}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                  unoptimized
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between px-5 py-4 text-[10px] uppercase tracking-[0.28em] text-[#eef3ec] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-[#03090c]/70">
                  <span>{item.caption}</span>{" "}
                  <span className="text-[#c9a266]">
                    {String(i + 1).padStart(2, "0")}
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

export function Contact({ customer }: { customer: NewCustomer }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    setTimeout(() => {
      setStatus("sent");
      event.currentTarget.reset();
    }, 1500);
  }

  const inputClass =
    "w-full border-b border-[#eef3ec]/20 bg-transparent py-3 text-[15px] text-[#eef3ec] placeholder:text-[#eef3ec]/30 outline-none transition-colors duration-300 focus:border-[#c9a266]";
  const labelClass = "text-[10px] uppercase tracking-[0.3em] text-[#eef3ec]/50";

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#03090c] py-24 text-[#eef3ec] md:py-36"
    >
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="flex items-end gap-4 sm:gap-6">
              <span
                aria-hidden
                className="font-display text-6xl font-light italic leading-[0.8] text-[#eef3ec]/32 sm:text-7xl md:text-8xl"
              >
                08
              </span>
              <div className="pb-1 sm:pb-2">
                <p className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.38em] text-[#c9a266] sm:text-[11px]">
                  <span className="inline-block h-px w-8 bg-[#c9a266]/70 sm:w-12" />{" "}
                  Contact / Booking
                </p>
                <h2 className="font-display text-3xl font-light leading-[1.04] tracking-tight sm:text-5xl md:text-6xl text-[#eef3ec]">
                  Inquire about <br /> your stay
                </h2>
              </div>
            </div>
            <Reveal
              delay={150}
              className="mt-10 max-w-md space-y-6 text-[15px] leading-relaxed text-[#eef3ec]/70 sm:text-base"
            >
              <p>
                Tell us when you're thinking of coming, how many are traveling,
                and what you hope to do on the water.
              </p>
            </Reveal>
            <Reveal
              delay={250}
              className="mt-12 border-t border-[#eef3ec]/10 pt-8"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#eef3ec]/50">
                Prefer to write directly?
              </p>
              <a
                href={`mailto:${customer.contact?.email}`}
                className="group mt-4 flex items-start gap-3 text-[#eef3ec] transition-colors hover:text-[#c9a266]"
              >
                <Mail size={16} className="mt-1 shrink-0 text-[#c9a266]" />
                <span className="break-all font-display text-lg italic leading-snug sm:text-xl">
                  {text(
                    customer.contact?.email,
                    "dabayareabonefishlodge@hotmail.com",
                  )}
                </span>
              </a>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={250}>
              <div className="border border-[#eef3ec]/10 bg-[#071620]/60 p-6 backdrop-blur-sm sm:p-10 rounded-3xl">
                {status === "sent" ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a266]/50 bg-[#c9a266]/10">
                      <CheckCircle2 size={26} className="text-[#c9a266]" />
                    </span>
                    <h3 className="mt-8 font-display text-3xl font-light italic">
                      Your inquiry is on its way
                    </h3>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#eef3ec]/65">
                      Thank you — the lodge will reply to you by email.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-8 text-[10px] uppercase tracking-[0.28em] text-[#eef3ec]/50 transition-colors hover:text-[#c9a266]"
                    >
                      Send another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="grid gap-8 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          Full name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Your name"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelClass}>
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="mt-8">
                      <label htmlFor="dates" className={labelClass}>
                        When are you thinking of coming?
                      </label>
                      <input
                        id="dates"
                        name="dates"
                        type="text"
                        placeholder="e.g. March, a week around the full moon"
                        className={inputClass}
                      />
                    </div>
                    <div className="mt-8">
                      <label htmlFor="message" className={labelClass}>
                        About your trip
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Who's coming, how many days..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    {status === "error" && (
                      <p className="mt-6 border-l-2 border-[#c9a266] pl-4 text-sm text-[#c9a266]">
                        {error}
                      </p>
                    )}
                    <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
                      <p className="max-w-[260px] text-[11px] leading-relaxed text-[#eef3ec]/40">
                        Your details go only to the lodge.
                      </p>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group inline-flex items-center gap-3 rounded-full bg-[#c9a266] px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-[#071620] transition-all duration-300 hover:bg-[#eef3ec] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {status === "sending" ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />{" "}
                            Sending
                          </>
                        ) : (
                          <>
                            Send Inquiry <ArrowUpRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
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

export function Footer({ customer }: { customer: NewCustomer }) {
  const brandName = text(customer.businessName, "Da Bay Area Bonefish Lodge");
  return (
    <footer className="border-t border-[#eef3ec]/10 bg-[#03090c] text-[#eef3ec]">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-20 sm:px-8 md:pt-28 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a266]">
            Mars Bay · South Andros · The Bahamas
          </p>
          <p className="mt-6 font-display text-[clamp(2.8rem,8vw,7.5rem)] font-light italic leading-none tracking-tight">
            {brandName.split(" ")[0]} {brandName.split(" ")[1]}
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.5em] text-[#eef3ec]/60">
            {brandName.split(" ").slice(2).join(" ")}
          </p>
          <a
            href={`mailto:${customer.contact?.email}`}
            className="group mt-10 inline-flex items-center gap-3 text-sm text-[#eef3ec]/70 transition-colors hover:text-[#c9a266]"
          >
            <Mail size={15} className="shrink-0 text-[#c9a266]" />{" "}
            {text(
              customer.contact?.email,
              "dabayareabonefishlodge@hotmail.com",
            )}
          </a>
        </div>
        <nav
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          aria-label="Footer"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.26em] text-[#eef3ec]/50 transition-colors hover:text-[#c9a266]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-[10px] uppercase tracking-[0.26em] text-[#c9a266] transition-colors hover:text-[#eef3ec]"
          >
            Inquire
          </a>
        </nav>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#eef3ec]/10 pt-8 text-[10px] uppercase tracking-[0.2em] text-[#eef3ec]/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brandName}
          </p>
          <p>Designed by InfyCrest</p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 text-[#eef3ec]/50 transition-colors hover:text-[#c9a266]"
          >
            Back to top <ArrowUp size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumBonefishLodgeTemplate({
  customer = demoVillaCustomer,
}: {
  customer?: NewCustomer;
}) {
  const style = {
    "--brand-accent": text(customer.theme?.accent, "#1d5a55"),
  } as CSSProperties;

  return (
    <SmoothScroll>
      <div
        style={style}
        className="bg-[#03090c] font-sans text-[#eef3ec] selection:bg-[#c9a266] selection:text-[#071620]"
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes rise { from { transform: translateY(118%) rotate(1.75deg); } to { transform: translateY(0) rotate(0deg); } }
          @keyframes fadeup { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes cue { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } 50.1% { transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }
          @keyframes drift { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -12px, 0); } }

          .marquee { animation: marquee 44s linear infinite; }
          .marquee:hover { animation-play-state: paused; }
          .hero-line { display: block; overflow: hidden; padding-bottom: 0.09em; margin-bottom: -0.09em; }
          .hero-line > span { display: inline-block; transform: translateY(118%); animation: rise 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
          .hero-fade { opacity: 0; animation: fadeup 1.25s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
          .hero-video-fade { opacity: 0; animation: fadeup 2.6s ease-out forwards; }
          .scroll-cue { animation: cue 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
          .animate-drift { animation: drift 8s ease-in-out infinite; }
          .text-outline-light { color: transparent; -webkit-text-stroke: 1px rgb(238 243 236 / 0.32); }
          .text-outline-dark { color: transparent; -webkit-text-stroke: 1px rgb(7 22 32 / 0.26); }
          .noise { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E"); background-size: 160px 160px; }
        `,
          }}
        />

        <div
          aria-hidden
          className="noise pointer-events-none fixed inset-0 z-[90] opacity-[0.05] mix-blend-overlay"
        />
        <Navbar customer={customer} />
        <main>
          <Hero customer={customer} />
          <Marquee />
          <Welcome customer={customer} />
          <Bonefishing customer={customer} />
          <SouthAndros />
          <Gallery customer={customer} />
          <Contact customer={customer} />
        </main>
        <Footer customer={customer} />
      </div>
    </SmoothScroll>
  );
}
