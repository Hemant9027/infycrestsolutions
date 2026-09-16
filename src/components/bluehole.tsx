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
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Anchor,
  ArrowDown,
  ArrowUpRight,
  BedDouble,
  CheckCircle2,
  Compass,
  CookingPot,
  Droplets,
  Fish,
  Flame,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Plane,
  Refrigerator,
  Shell,
  ShowerHead,
  TreePine,
  User,
  UtensilsCrossed,
  Waves,
  Wifi,
  X,
  Armchair,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                TYPES & DATA                                */
/* -------------------------------------------------------------------------- */

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
  label: string;
};
export type CustomerService = {
  title: string;
  description: string;
  price?: string;
  tag?: string;
  image?: string | null;
};
export type CustomerGalleryItem = {
  image: string;
  caption?: string;
};
export type CustomerContact = {
  address?: string;
  hours?: string;
  phone?: string;
  email?: string;
};
export type CustomerTheme = {
  accent?: string;
};
export type CustomerCTA = {
  label?: string;
  description?: string;
};
export type NewCustomer = {
  id?: number;
  slug?: string;
  businessName: string;
  hero: CustomerHero;
  about: CustomerAbout;
  CTA: CustomerCTA;
  theme: CustomerTheme;
  contact: CustomerContact;
  heroImages?: string[];
  stats?: CustomerStat[];
  services?: CustomerService[];
  gallery?: CustomerGalleryItem[];
};

// Colors from the original CSS
const COLORS = {
  abyss: "#06262e",
  deep: "#0a3540",
  pool: "#11454e",
  lagoon: "#149e93",
  aqua: "#7fd8cc",
  foam: "#eaf5f1",
  sand: "#f3ecdc",
  shell: "#faf6ec",
  coral: "#e58e63",
};

export const restImg = (num: number) => `/restaurant/${num}.jpg`;

export const demoVillaCustomer: NewCustomer = {
  slug: "blue-hole-villas",
  businessName: "Blue Hole Villas",
  theme: { accent: COLORS.lagoon },
  CTA: { label: "Book your stay" },
  hero: {
    eyebrow: "Congo Town · South Andros · The Bahamas",
    title: "Your private island escape in South Andros",
    description:
      "Secluded villas, turquoise water and the natural beauty of Andros.",
    primaryCta: "Explore the villas",
  },
  heroImages: [restImg(1), restImg(2), restImg(3)],
  about: {
    title: "Barefoot days on the quiet side of Andros",
    body: "Tucked among coconut palms on the Queen's Highway in Congo Town, Blue Hole Villas is a small collection of individually shaped island villas set on a secluded private beach — five minutes from the airport, and a world away from everything else. Across the street, ancient blue holes sink into the pine forest. Just offshore, a living reef keeps the shallows calm and clear.",
    image: restImg(4),
  },
  stats: [
    { value: "05", label: "to Congo Town Airport" },
    { value: "06", label: "to Driggs Hill dock" },
    { value: "02–04", label: "guests per villa" },
    { value: "01", label: "beach all to yourself" },
  ],
  services: [
    {
      title: "Fly-Fishing",
      description:
        "South Andros is bonefish country — endless flats, tailing fish, and tides that set the day's rhythm.",
      tag: "Guides arranged",
      image: restImg(5),
    },
    {
      title: "Kayaking",
      description:
        "Slip into glassy creeks and mangrove channels where the water runs clear over white sand.",
      tag: "By arrangement",
      image: restImg(6),
    },
    {
      title: "Snorkeling & the Reef",
      description:
        "A living reef shelters our waters just offshore, keeping the shallows calm and full of life.",
      tag: "Just offshore",
      image: restImg(7),
    },
  ],
  gallery: [
    { image: restImg(8), caption: "Home, from the air" },
    { image: restImg(9), caption: "The private beach" },
    { image: restImg(10), caption: "Blue holes, across the street" },
    { image: restImg(11), caption: "No two villas alike" },
    { image: restImg(12), caption: "The reef, just offshore" },
    { image: restImg(13), caption: "Bonefish on the flats" },
    { image: restImg(14), caption: "Inside your villa" },
    { image: restImg(15), caption: "Creeks made for kayaks" },
    { image: restImg(16), caption: "The path to the sea" },
    { image: restImg(17), caption: "How the day ends" },
  ],
  contact: {
    address: "Queen's Highway, Congo Town, South Andros, The Bahamas",
    hours: "Check-in: 3:00 PM · Check-out: 11:00 AM",
    phone: "+1 (242) 471-2225",
    email: "blueholevillas@gmail.com",
  },
};

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

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
      (entries) => {
        if (entries[0]?.isIntersecting) {
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
/*                                SHARED ATOMS                                */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  className,
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
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
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
          priority={priority}
          sizes={sizes}
          className="object-cover"
          unoptimized
        />
      </motion.div>
    </div>
  );
}

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <path
        d="M14 36c4-5 8-5 12 0s8 5 12 0 8-5 12 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M18 26c3.5-4 7-4 10.5 0s7 4 10.5 0 7-4 10.5 0"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.65"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M22 46c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7.5 0"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "Villas", href: "#villas" },
  { label: "Beach", href: "#beach" },
  { label: "Blue Holes", href: "#blue-holes" },
  { label: "Activities", href: "#activities" },
  { label: "Location", href: "#location" },
  { label: "Gallery", href: "#gallery" },
];

export function Navbar({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const brandName = text(customer.businessName, "Blue Hole Villas");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
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

  const dark = !scrolled || open;

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          open
            ? "text-[#faf6ec]"
            : scrolled
              ? "bg-[#faf6ec]/90 text-[#06262e] shadow-[0_1px_0_rgba(6,38,46,0.08)] backdrop-blur-md"
              : "text-[#faf6ec]",
        )}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between px-5 sm:px-8">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3"
            aria-label={`${brandName} - back to top`}
          >
            <LogoMark
              className={cx(
                "h-10 w-10 transition-colors duration-300",
                dark ? "text-[#7fd8cc]" : "text-[#149e93]",
              )}
            />
            <span className="leading-none">
              <span className="block font-display text-lg font-semibold tracking-wide">
                {brandName}
              </span>
              <span
                className={cx(
                  "mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.3em] transition-colors duration-300",
                  dark ? "text-[#7fd8cc]/80" : "text-[#149e93]",
                )}
              >
                {text(
                  customer.hero?.eyebrow?.split("·")[1],
                  "South Andros · Bahamas",
                )}
              </span>
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
                className="link-sweep text-[0.82rem] font-medium tracking-wide opacity-90 transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className={cx(
                "group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[0.82rem] font-semibold transition-all duration-300",
                dark
                  ? "bg-[#f3ecdc] text-[#06262e] hover:bg-[#7fd8cc]"
                  : "bg-[#06262e] text-[#faf6ec] hover:bg-[#149e93]",
              )}
            >
              {text(customer.CTA?.label, "Book your stay")}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-current/20 lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={cx(
          "fixed inset-0 z-40 flex flex-col bg-[#06262e] text-[#faf6ec] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex flex-1 flex-col justify-center px-8 pt-20">
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {NAV_LINKS.map((link, i) => (
                <li
                  key={link.href}
                  className={cx(
                    "overflow-hidden transition-all duration-700",
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0",
                  )}
                  style={{ transitionDelay: `${120 + i * 60}ms` }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 py-2"
                  >
                    <span className="text-xs font-semibold text-[#149e93]">
                      0{i + 1}
                    </span>
                    <span className="font-display text-4xl font-light transition-colors group-hover:text-[#7fd8cc]">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-[#f3ecdc] px-7 py-3.5 text-sm font-semibold text-[#06262e] transition-colors hover:bg-[#7fd8cc]"
          >
            {text(customer.CTA?.label, "Book your stay")}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div
          className={cx(
            "border-t border-[#faf6ec]/10 px-8 py-6 transition-all delay-300 duration-700",
            open ? "opacity-100" : "opacity-0",
          )}
        >
          <a
            href={`tel:${customer.contact?.phone}`}
            className="flex items-center gap-3 text-sm text-[#faf6ec]/80"
          >
            <Phone className="h-4 w-4 text-[#7fd8cc]" />
            {text(customer.contact?.phone, "+1 (242) 471-2225")}
          </a>
        </div>
      </div>
    </>
  );
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
    "Your private island escape in South Andros",
  );
  const words = fullTitle.split(" ");
  const firstPart = words.slice(0, 2).join(" ");
  const italicPart = words.slice(2, 4).join(" ");
  const lastPart = words.slice(4).join(" ");

  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#06262e] text-[#faf6ec]"
    >
      {/* Background Video / Image Fallback */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={customer.heroImages?.[0] || restImg(1)}
          aria-hidden="true"
        >
          <source
            src="https://videos.pexels.com/video-files/37083114/15709742_3840_2160_60fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#06262e] via-[#06262e]/25 to-[#06262e]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06262e]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-end px-5 pb-10 pt-36 sm:px-8"
      >
        <motion.p
          variants={item}
          className="kicker mb-6 flex items-center gap-4 text-[#7fd8cc]"
        >
          <span className="h-px w-10 bg-[#7fd8cc]/50" />
          {text(
            customer.hero?.eyebrow,
            "Congo Town · South Andros · The Bahamas",
          )}
          <span className="hidden h-px w-10 bg-[#7fd8cc]/50 sm:block" />
        </motion.p>

        <h1 className="font-display text-[clamp(3rem,8.6vw,7.75rem)] font-medium leading-[0.95] tracking-[-0.01em]">
          <motion.span variants={item} className="block">
            {firstPart}
          </motion.span>
          <motion.span
            variants={item}
            className="block font-light italic text-[#7fd8cc]"
          >
            {italicPart}
          </motion.span>
          <motion.span variants={item} className="block">
            {lastPart}
          </motion.span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            variants={item}
            className="max-w-md text-base leading-relaxed text-[#faf6ec]/80 sm:text-lg"
          >
            {text(
              customer.hero?.description,
              "Secluded villas, turquoise water and the natural beauty of Andros.",
            )}
          </motion.p>
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#villas"
              className="inline-flex items-center gap-2 rounded-full bg-[#f3ecdc] px-7 py-3.5 text-sm font-semibold text-[#06262e] transition-colors duration-300 hover:bg-[#7fd8cc]"
            >
              {text(customer.hero?.primaryCta, "Explore the villas")}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#faf6ec]/35 px-7 py-3.5 text-sm font-semibold text-[#faf6ec] transition-all duration-300 hover:border-[#faf6ec] hover:bg-[#faf6ec]/10"
            >
              Plan your stay
            </a>
          </motion.div>
        </div>

        {/* Fact bar */}
        <motion.div
          variants={item}
          className="mt-12 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-[#faf6ec]/15 pt-6 sm:grid-cols-3"
        >
          {FACTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 text-sm text-[#faf6ec]/75"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#faf6ec]/10">
                <Icon className="h-4 w-4 text-[#7fd8cc]" />
              </span>
              {label}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#welcome"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-40 right-8 z-10 hidden flex-col items-center gap-3 lg:flex"
        aria-label="Scroll to welcome section"
      >
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#faf6ec]/60 [writing-mode:vertical-rl]">
          scroll
        </span>
        <span className="relative h-16 w-px overflow-hidden bg-[#faf6ec]/20">
          <span className="absolute inset-x-0 h-1/2 animate-drop bg-[#7fd8cc]" />
        </span>
        <ArrowDown className="h-3.5 w-3.5 text-[#faf6ec]/60" />
      </motion.a>
    </section>
  );
}

export function Marquee() {
  const WORDS = [
    "Secluded",
    "Private Beach",
    "Blue Holes",
    "Bonefishing Flats",
    "Turquoise Water",
    "Barrier Reef",
    "Kayaking",
    "Barefoot Luxury",
  ];

  const Sparkle = () => (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-[#e58e63] md:h-6 md:w-6"
      aria-hidden="true"
    >
      <path
        d="M12 1l2.2 8.8L23 12l-8.8 2.2L12 23l-2.2-8.8L1 12l8.8-2.2L12 1z"
        fill="currentColor"
      />
    </svg>
  );

  const Row = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12"
    >
      {WORDS.map((word, i) => (
        <li key={word} className="flex items-center gap-8 md:gap-12">
          <span
            className={`whitespace-nowrap font-display text-3xl font-light italic md:text-5xl ${i % 2 === 0 ? "text-[#f3ecdc]" : "text-[#7fd8cc]/60"}`}
          >
            {word}
          </span>
          <Sparkle />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-y border-[#faf6ec]/10 bg-[#0a3540] py-6 md:py-8">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  );
}

export function Welcome({ customer }: { customer: NewCustomer }) {
  const FEATURES = [
    {
      icon: User,
      text: "Each villa sleeps two adults — or a small family of four",
    },
    {
      icon: CookingPot,
      text: "Full kitchens made for slow mornings and long stays",
    },
    { icon: Wifi, text: "WiFi throughout, when you feel like checking in" },
    {
      icon: Heart,
      text: "Weddings & special occasions arranged with your hosts",
    },
  ];

  const STATS =
    customer.stats && customer.stats.length > 0
      ? customer.stats.map((s) => {
          const parts = s.label.split(" ");
          return {
            value: s.value,
            unit: parts[0],
            label: parts.slice(1).join(" "),
          };
        })
      : [
          { value: "05", unit: "min", label: "to Congo Town Airport" },
          { value: "06", unit: "min", label: "to Driggs Hill dock" },
          { value: "02–04", unit: "guests", label: "per private villa" },
          { value: "01", unit: "beach", label: "all to yourself" },
        ];

  const fullTitle = text(
    customer.about?.title,
    "Barefoot days on the quiet side of Andros",
  );
  const words = fullTitle.split(" ");
  const firstPart = words.slice(0, 4).join(" ");
  const italicPart = words.slice(4, 6).join(" ");
  const lastPart = words.slice(6).join(" ");

  return (
    <section
      id="welcome"
      className="relative overflow-hidden bg-[#faf6ec] py-24 md:py-36"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="kicker relative pl-[3.25rem] text-[#149e93] before:absolute before:left-0 before:top-1/2 before:h-px before:w-10 before:bg-current before:opacity-40">
                01 · Welcome to{" "}
                {text(customer.businessName, "Blue Hole Villas")}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.01em] text-[#06262e]">
                {firstPart}{" "}
                <em className="font-light italic text-[#149e93]">
                  {italicPart}
                </em>{" "}
                {lastPart}
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-8 max-w-xl space-y-5 text-[1.02rem] leading-relaxed text-[#06262e]/70">
                <p>
                  {text(
                    customer.about?.body,
                    "Tucked among coconut palms on the Queen's Highway in Congo Town, Blue Hole Villas is a small collection of individually shaped island villas set on a secluded private beach — five minutes from the airport, and a world away from everything else.",
                  )}
                </p>
                <p>
                  Across the street, ancient blue holes sink into the pine
                  forest. Just offshore, a living reef keeps the shallows calm
                  and clear. Your days here are measured in tides, not
                  appointments — and your hosts are happy to arrange everything
                  from fly-fishing guides to a wedding barefoot in the sand.
                </p>
              </div>
            </Reveal>
            <Reveal delay={220}>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                {FEATURES.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="group flex items-start gap-4 rounded-2xl border border-[#06262e]/10 bg-white/60 p-4 transition-colors duration-300 hover:border-[#149e93]/40 hover:bg-[#eaf5f1]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#149e93]/10 text-[#149e93] transition-colors duration-300 group-hover:bg-[#149e93] group-hover:text-white">
                      <Icon className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <span className="pt-1.5 text-[0.92rem] font-medium leading-snug text-[#06262e]/80">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <Reveal delay={120} className="relative ml-auto max-w-md">
              <div className="relative aspect-[3/4] overflow-hidden rounded-b-[1.75rem] rounded-t-full border-[10px] border-[#eaf5f1] shadow-[0_40px_80px_-30px_rgba(6,38,46,0.35)]">
                <Image
                  src={text(customer.about?.image, restImg(4))}
                  alt="Sandy footpath through a coconut palm grove leading to the sea"
                  fill
                  sizes="(min-width: 1024px) 38vw, 90vw"
                  className="object-cover transition-transform duration-[1.8s] ease-out hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="absolute -right-8 top-6 hidden h-28 w-28 animate-spin-slow items-center justify-center rounded-full bg-[#06262e] text-[#7fd8cc] sm:flex md:h-32 md:w-32">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full"
                >
                  <defs>
                    <path
                      id="badge-circle"
                      d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                    />
                  </defs>
                  <text className="fill-[#7fd8cc] text-[9px] font-semibold uppercase tracking-[0.28em]">
                    <textPath href="#badge-circle">
                      South Andros · The Bahamas ·{" "}
                    </textPath>
                  </text>
                </svg>
                <span className="font-display text-2xl italic">Bh</span>
              </div>
            </Reveal>
            <Reveal
              delay={260}
              className="absolute -bottom-8 left-0 hidden w-52 rotate-[-6deg] rounded-2xl border-8 border-white object-cover shadow-xl sm:block md:w-60"
            >
              <Image
                src={restImg(5)}
                alt="Golden sunset over calm water from the beach"
                width={480}
                height={360}
                className="w-full rounded-lg object-cover"
                unoptimized
              />
            </Reveal>
          </div>
        </div>

        <Reveal delay={120}>
          <dl className="mt-24 grid grid-cols-2 gap-y-10 border-t border-[#06262e]/10 pt-10 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={i}>
                <dd className="font-display text-5xl font-light text-[#06262e] md:text-6xl">
                  {stat.value}
                  <span className="ml-1 align-baseline text-xl italic text-[#e58e63]">
                    {stat.unit}
                  </span>
                </dd>
                <dt className="mt-2 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-[#06262e]/50">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export function Villas() {
  const AMENITIES = [
    {
      icon: BedDouble,
      title: "Up to 2 adults",
      desc: "or a small family of 4",
    },
    {
      icon: CookingPot,
      title: "Full kitchen",
      desc: "fully functioning & ready to cook",
    },
    {
      icon: Refrigerator,
      title: "Full-size fridge",
      desc: "room for a week's catch",
    },
    { icon: Flame, title: "Stove", desc: "for island suppers at home" },
    {
      icon: UtensilsCrossed,
      title: "Utensils & dinnerware",
      desc: "everything provided",
    },
    { icon: Armchair, title: "Dining area", desc: "slow meals, sea breeze" },
    { icon: ShowerHead, title: "Bathroom", desc: "with shower" },
    { icon: Wifi, title: "WiFi", desc: "when you feel like checking in" },
  ];

  return (
    <section
      id="villas"
      className="relative overflow-hidden bg-[#06262e] py-24 text-[#faf6ec] md:py-36"
    >
      <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-[#149e93]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-24 h-96 w-96 rounded-full bg-[#e58e63]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="kicker relative pl-[3.25rem] text-[#7fd8cc] before:absolute before:left-0 before:top-1/2 before:h-px before:w-10 before:bg-current before:opacity-40">
                02 · Our Villas
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.04]">
                No two villas{" "}
                <em className="font-light italic text-[#7fd8cc]">alike</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-md text-[1.02rem] leading-relaxed text-[#faf6ec]/70">
              Each villa takes its own shape and personality — simple,
              comfortable and completely yours. Step off your porch, through the
              palms, and onto the sand.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <figure className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:aspect-auto lg:h-full">
              <Image
                src={restImg(6)}
                alt="A uniquely shaped island villa"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                unoptimized
              />
              <figcaption className="absolute bottom-5 left-5 rounded-full bg-[#06262e]/60 px-5 py-2.5 text-[0.78rem] font-medium tracking-wide text-[#faf6ec] backdrop-blur-md">
                Individually shaped, tucked into the palms
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-5">
            <figure className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:aspect-auto lg:h-full">
              <Image
                src={restImg(7)}
                alt="Bright villa kitchen and dining area"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                unoptimized
              />
              <figcaption className="absolute bottom-5 left-5 rounded-full bg-[#06262e]/60 px-5 py-2.5 text-[0.78rem] font-medium tracking-wide text-[#faf6ec] backdrop-blur-md">
                Kitchen, dining and everything provided
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AMENITIES.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={(i % 4) * 80}>
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-[#faf6ec]/10 bg-[#faf6ec]/[0.045] p-5 transition-all duration-300 hover:border-[#7fd8cc]/40 hover:bg-[#faf6ec]/[0.08]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7fd8cc]/10 text-[#7fd8cc] transition-colors duration-300 group-hover:bg-[#7fd8cc] group-hover:text-[#06262e]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[0.95rem] font-semibold text-[#faf6ec]">
                    {title}
                  </h3>
                  <p className="mt-1 text-[0.85rem] leading-snug text-[#faf6ec]/55">
                    {desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-[#faf6ec]/10 pt-10 sm:flex-row sm:items-center">
            <p className="max-w-lg text-sm leading-relaxed text-[#faf6ec]/60">
              Villas are offered on a one-party basis — when you stay with us,
              the beach, the palms and the quiet are yours.
            </p>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[#f3ecdc] px-7 py-3.5 text-sm font-semibold text-[#06262e] transition-colors duration-300 hover:bg-[#7fd8cc]"
            >
              Check availability
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Beach() {
  return (
    <section id="beach" className="relative bg-[#06262e] text-[#faf6ec]">
      <ParallaxImage
        src={restImg(8)}
        alt="Hammock strung between palms on the secluded private beach"
        className="h-[82vh] min-h-[34rem]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06262e]/75 via-[#06262e]/10 to-[#06262e]/45" />
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="max-w-3xl text-center">
          <Reveal>
            <p className="kicker inline-flex items-center gap-4 text-[#7fd8cc]">
              <span className="h-px w-8 bg-[#7fd8cc]/50" />
              03 · Private Beach
              <span className="h-px w-8 bg-[#7fd8cc]/50" />
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-[1.02] tracking-[-0.01em]">
              Miles of sand.{" "}
              <em className="italic text-[#7fd8cc]">No one else</em> on it.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#faf6ec]/80 sm:text-lg">
              Our secluded beach slopes gently into calm, shallow turquoise —
              perfect for a first swim at sunrise, an afternoon in the hammock,
              and a sky full of stars to finish.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function BlueHoles() {
  const POINTS = [
    {
      icon: MapPin,
      title: "Directly across the street",
      desc: "Blue holes sit just steps from your villa — no tour bus, no ticket line.",
    },
    {
      icon: Waves,
      title: "Swim & explore",
      desc: "Andros holds one of the highest concentrations of blue holes on the planet, from hidden inland pools to vast ocean caverns.",
    },
    {
      icon: TreePine,
      title: "Wild Andros",
      desc: "Pine forest, coppice and empty roads — the largest, least-developed island in The Bahamas.",
    },
  ];

  return (
    <section
      id="blue-holes"
      className="relative overflow-hidden bg-[#eaf5f1] py-24 md:py-36 text-[#06262e]"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <ParallaxImage
              src={restImg(9)}
              alt="Aerial view of a circular deep blue hole"
              className="aspect-[4/5] rounded-[2rem] shadow-[0_50px_90px_-40px_rgba(6,38,46,0.45)] md:aspect-square"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute -bottom-6 -right-4 rounded-2xl bg-[#06262e] px-6 py-4 text-[#faf6ec] shadow-xl sm:right-8">
              <p className="font-display text-3xl font-light italic text-[#7fd8cc]">
                Blue holes
              </p>
              <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#faf6ec]/60">
                across the street
              </p>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <p className="kicker relative pl-[3.25rem] text-[#149e93] before:absolute before:left-0 before:top-1/2 before:h-px before:w-10 before:bg-current before:opacity-40">
                04 · Blue Holes & Nature
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.04]">
                An ancient wonder,{" "}
                <em className="font-light italic text-[#149e93]">steps away</em>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-[1.02rem] leading-relaxed text-[#06262e]/70">
                Blue holes are flooded sinkholes and underwater cave systems —
                windows into the island itself, shifting from pale jade at the
                rim to impossible sapphire at the center. On South Andros they
                are simply part of the neighbourhood.
              </p>
            </Reveal>
            <div className="mt-10 space-y-4">
              {POINTS.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={200 + i * 90}>
                  <div className="flex items-start gap-5 rounded-2xl border border-[#06262e]/10 bg-white/70 p-5 transition-colors duration-300 hover:border-[#149e93]/40 hover:bg-white">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#149e93]/10 text-[#149e93]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#06262e]">{title}</h3>
                      <p className="mt-1 text-[0.92rem] leading-relaxed text-[#06262e]/60">
                        {desc}
                      </p>
                    </div>
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

export function Activities({ customer }: { customer: NewCustomer }) {
  const ACTIVITIES =
    customer.services && customer.services.length > 0
      ? customer.services.slice(0, 3).map((s, i) => ({
          icon: [Fish, Waves, Shell][i % 3],
          tag: s.tag || "Activity",
          src: s.image || restImg(i + 10),
          title: s.title,
          blurb: s.description,
        }))
      : demoVillaCustomer.services!.map((s, i) => ({
          icon: [Fish, Waves, Shell][i % 3],
          tag: s.tag || "Activity",
          src: s.image || restImg(i + 10),
          title: s.title,
          blurb: s.description,
        }));

  return (
    <section
      id="activities"
      className="relative bg-[#f3ecdc] py-24 md:py-36 text-[#06262e]"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="kicker relative pl-[3.25rem] text-[#149e93] before:absolute before:left-0 before:top-1/2 before:h-px before:w-10 before:bg-current before:opacity-40">
                05 · Activities
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-xl font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.04]">
                Days measured{" "}
                <em className="font-light italic text-[#149e93]">in tides</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-md text-[1.02rem] leading-relaxed text-[#06262e]/70">
              Water sports of every kind belong to this coast. Tell us what you
              love, and your hosts will arrange the rest.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {ACTIVITIES.map(({ icon: Icon, tag, src, title, blurb }, i) => (
            <Reveal key={title} delay={i * 110}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#06262e]/10 bg-white shadow-[0_20px_50px_-30px_rgba(6,38,46,0.3)] transition-transform duration-500 hover:-translate-y-1.5">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={src}
                    alt={title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                    unoptimized
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#faf6ec]/85 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#06262e] backdrop-blur-sm">
                    {tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#149e93]/10 text-[#149e93]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-2xl font-medium text-[#06262e]">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-[#06262e]/65">
                    {blurb}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-[#06262e] px-8 py-8 text-[#faf6ec] sm:flex-row sm:items-center md:px-12">
            <p className="max-w-xl text-[1.02rem] leading-relaxed text-[#faf6ec]/85">
              <span className="font-display italic text-[#7fd8cc]">
                Bonefishing at dawn, a reef before lunch, kayaking at golden
                hour
              </span>{" "}
              — one conversation with your hosts and it's on the calendar.
            </p>
            <a
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f3ecdc] px-7 py-3.5 text-sm font-semibold text-[#06262e] transition-colors duration-300 hover:bg-[#7fd8cc]"
            >
              Ask about activities
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Location({ customer }: { customer: NewCustomer }) {
  const DISTANCES = [
    { icon: Plane, place: "Congo Town Airport", time: "about 5 minutes" },
    {
      icon: Anchor,
      place: "Driggs Hill docking facility",
      time: "about 6 minutes",
    },
    { icon: Droplets, place: "Blue holes", time: "across the street" },
    { icon: Fish, place: "The reef", time: "just offshore" },
  ];

  return (
    <section
      id="location"
      className="relative overflow-hidden bg-[#0a3540] py-24 text-[#faf6ec] md:py-36"
    >
      <div className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full bg-[#149e93]/10 blur-[130px]" />
      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="kicker relative pl-[3.25rem] text-[#7fd8cc] before:absolute before:left-0 before:top-1/2 before:h-px before:w-10 before:bg-current before:opacity-40">
                06 · Location
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.04]">
                Easy to reach.{" "}
                <em className="font-light italic text-[#7fd8cc]">
                  Hard to leave.
                </em>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-[1.02rem] leading-relaxed text-[#faf6ec]/70">
                Fly into Congo Town Airport and you're practically unpacked
                before the propellers stop turning. The villas sit right on the
                Queen's Highway — close to everything in South Andros, and far
                from everything everywhere else.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <address className="mt-8 flex items-start gap-4 not-italic">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7fd8cc]/10 text-[#7fd8cc]">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="pt-1 text-[1.02rem] leading-relaxed text-[#faf6ec]/85">
                  {text(
                    customer.contact?.address,
                    "Queen's Highway, Congo Town, South Andros, The Bahamas",
                  )}
                </span>
              </address>
            </Reveal>
            <div className="mt-10 divide-y divide-[#faf6ec]/10 border-y border-[#faf6ec]/10">
              {DISTANCES.map(({ icon: Icon, place, time }, i) => (
                <Reveal key={place} delay={240 + i * 70}>
                  <div className="flex items-center gap-4 py-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#faf6ec]/15 text-[#7fd8cc]">
                      <Icon className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <span className="flex-1 text-[0.98rem] font-medium text-[#faf6ec]/90">
                      {place}
                    </span>
                    <span className="text-sm italic text-[#7fd8cc]/90">
                      {time}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={140}>
            <div
              className="relative h-[30rem] overflow-hidden rounded-[2rem] border border-[#faf6ec]/10 bg-[#06262e] shadow-[0_60px_100px_-50px_rgba(0,0,0,0.8)]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(127,216,204,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(127,216,204,0.06) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            >
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#149e93]/15 blur-[80px]" />
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 600 480"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M-20 300 C 120 260, 220 320, 340 285 S 540 230, 640 250"
                  stroke="rgba(243,236,220,0.25)"
                  strokeWidth="2.5"
                  strokeDasharray="10 9"
                />
                <text
                  x="70"
                  y="252"
                  fill="rgba(243,236,220,0.45)"
                  fontSize="12"
                  letterSpacing="3"
                  fontFamily="inherit"
                >
                  QUEEN'S HIGHWAY
                </text>
                <path
                  d="M-20 90 C 140 60, 320 110, 640 70"
                  stroke="rgba(127,216,204,0.35)"
                  strokeWidth="2"
                  strokeDasharray="2 8"
                  strokeLinecap="round"
                />
                <text
                  x="430"
                  y="52"
                  fill="rgba(127,216,204,0.6)"
                  fontSize="12"
                  letterSpacing="3"
                >
                  THE REEF · OFFSHORE
                </text>
              </svg>
              <span className="absolute right-6 top-24 font-display text-3xl font-light italic text-[#7fd8cc]/40">
                Atlantic
              </span>
              <span className="absolute bottom-8 left-6 font-display text-3xl font-light italic text-[#faf6ec]/30">
                South Andros
              </span>

              <div
                className="absolute left-[24%] top-[62%] flex flex-col items-center"
                aria-hidden="true"
              >
                <span className="h-3.5 w-3.5 rounded-full border-2 border-[#149e93] bg-[#149e93]/30" />
                <span className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#faf6ec]/60">
                  Blue Holes
                </span>
              </div>
              <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inset-0 -m-1 animate-pulse-ring rounded-full bg-[#7fd8cc]/50" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#7fd8cc] text-[#06262e] shadow-[0_10px_30px_rgba(127,216,204,0.4)]">
                  <MapPin className="h-5 w-5" />
                </span>
              </div>
              <span className="absolute left-1/2 top-[48%] mt-9 -translate-x-1/2 whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#faf6ec]">
                {text(customer.businessName, "Blue Hole Villas")}
              </span>

              <div className="absolute left-6 top-6 flex items-center gap-2.5 rounded-full border border-[#faf6ec]/15 bg-[#06262e]/60 px-4 py-2 backdrop-blur-sm">
                <Compass className="h-4 w-4 text-[#7fd8cc]" />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#faf6ec]/70">
                  24.15° N · 77.59° W
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Gallery({ customer }: { customer: NewCustomer }) {
  const GALLERY =
    customer.gallery && customer.gallery.length > 0
      ? customer.gallery
      : demoVillaCustomer.gallery!;

  return (
    <section
      id="gallery"
      className="bg-[#faf6ec] py-24 md:py-36 text-[#06262e]"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="kicker relative pl-[3.25rem] text-[#149e93] before:absolute before:left-0 before:top-1/2 before:h-px before:w-10 before:bg-current before:opacity-40">
                07 · Gallery
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 max-w-xl font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.04]">
                Postcards from{" "}
                <em className="font-light italic text-[#149e93]">
                  the property
                </em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-sm text-[1.02rem] leading-relaxed text-[#06262e]/70">
              Turquoise shallows, wild palms, quiet skies — the everyday view
              around the villas.
            </p>
          </Reveal>
        </div>
        <div className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {GALLERY.map((img, i) => (
            <Reveal
              key={img.image}
              delay={(i % 3) * 90}
              className="mb-5 break-inside-avoid"
            >
              <figure className="group relative overflow-hidden rounded-2xl border-[6px] border-white shadow-[0_24px_50px_-30px_rgba(6,38,46,0.35)]">
                <Image
                  src={img.image}
                  alt={img.caption || `Gallery image ${i}`}
                  width={900}
                  height={i % 2 === 0 ? 1100 : 750}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
                  unoptimized
                />
                <figcaption className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-[#06262e]/70 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="font-display text-lg italic text-[#faf6ec]">
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

export function Contact({ customer }: { customer: NewCustomer }) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setError("");

    setTimeout(() => {
      setStatus("success");
      form.reset();
    }, 1500);
  }

  const inputLabel =
    "mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#06262e]/50";
  const fieldClass =
    "w-full rounded-2xl border border-[#06262e]/10 bg-white px-4 py-3 text-[0.925rem] text-[#06262e] outline-none transition-all placeholder:text-[#06262e]/30 focus:border-[#149e93] focus:ring-4 focus:ring-[#149e93]/10";

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#06262e] py-24 text-[#faf6ec] md:py-36"
    >
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#149e93]/10 blur-[130px]" />
      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="kicker relative pl-[3.25rem] text-[#7fd8cc] before:absolute before:left-0 before:top-1/2 before:h-px before:w-10 before:bg-current before:opacity-40">
                08 · Contact & Booking
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,4.6vw,4.25rem)] font-medium leading-[1.04]">
                The tide is{" "}
                <em className="font-light italic text-[#7fd8cc]">waiting</em>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-md text-[1.02rem] leading-relaxed text-[#faf6ec]/70">
                No booking engine, no middlemen — every stay is arranged
                personally. Send a note, or simply pick up the phone.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-10 space-y-5">
                <a
                  href={`tel:${customer.contact?.phone}`}
                  className="group flex items-center gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7fd8cc]/10 text-[#7fd8cc] transition-colors duration-300 group-hover:bg-[#7fd8cc] group-hover:text-[#06262e]">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#faf6ec]/50">
                      Phone
                    </p>
                    <p className="mt-0.5 font-medium text-[#faf6ec] link-sweep">
                      {text(customer.contact?.phone, "+1 (242) 471-2225")}
                    </p>
                  </div>
                </a>
                <a
                  href={`mailto:${customer.contact?.email}`}
                  className="group flex items-center gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7fd8cc]/10 text-[#7fd8cc] transition-colors duration-300 group-hover:bg-[#7fd8cc] group-hover:text-[#06262e]">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#faf6ec]/50">
                      Email
                    </p>
                    <p className="mt-0.5 break-all font-medium text-[#faf6ec] link-sweep">
                      {text(
                        customer.contact?.email,
                        "blueholevillas@gmail.com",
                      )}
                    </p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#7fd8cc]/10 text-[#7fd8cc]">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#faf6ec]/50">
                      Find us
                    </p>
                    <p className="mt-0.5 font-medium leading-snug text-[#faf6ec]">
                      {text(
                        customer.contact?.address,
                        "South Andros, The Bahamas",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-10 flex items-start gap-4 rounded-2xl border border-[#e58e63]/30 bg-[#e58e63]/10 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e58e63]/20 text-[#e58e63]">
                  <Heart className="h-5 w-5" />
                </span>
                <p className="text-[0.95rem] leading-relaxed text-[#faf6ec]/80">
                  <span className="font-semibold text-[#faf6ec]">
                    Barefoot weddings, anyone?
                  </span>{" "}
                  Small ceremonies and special occasions on the beach, arranged
                  personally with your hosts.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="lg:col-span-7">
            <div className="rounded-[2rem] bg-[#faf6ec] p-6 text-[#06262e] shadow-[0_60px_100px_-50px_rgba(0,0,0,0.7)] sm:p-10">
              {status === "success" ? (
                <div className="flex min-h-[26rem] flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#149e93]/10 text-[#149e93]">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h3 className="mt-6 font-display text-3xl font-medium">
                    Your note is on its way
                  </h3>
                  <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-[#06262e]/65">
                    Thank you — we'll reply personally as soon as we surface.
                    Can't wait? Call us at{" "}
                    <a
                      href={`tel:${customer.contact?.phone}`}
                      className="font-semibold text-[#149e93] link-sweep"
                    >
                      {text(customer.contact?.phone, "+1 (242) 471-2225")}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-full border border-[#06262e]/15 px-6 py-3 text-sm font-semibold transition-colors hover:border-[#149e93] hover:text-[#149e93]"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={inputLabel}>Name *</label>
                      <input
                        name="name"
                        required
                        placeholder="Your full name"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={inputLabel}>Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={inputLabel}>Phone</label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="Optional"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={inputLabel}>Guests</label>
                      <select
                        name="guests"
                        className={fieldClass}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Who's coming?
                        </option>
                        <option value="2 adults">2 adults</option>
                        <option value="Family of 3">Family of 3</option>
                        <option value="Family of 4">Family of 4</option>
                        <option value="Small group / multiple villas">
                          Small group / multiple villas
                        </option>
                        <option value="Undecided">Undecided</option>
                      </select>
                    </div>
                    <div>
                      <label className={inputLabel}>Arrival</label>
                      <input
                        name="arrival"
                        type="date"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className={inputLabel}>Departure</label>
                      <input
                        name="departure"
                        type="date"
                        className={fieldClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={inputLabel}>Message</label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Dates you're dreaming of, a wedding you're planning, the bonefish you intend to meet..."
                        className={`${fieldClass} resize-none`}
                      />
                    </div>
                  </div>
                  {status === "error" && (
                    <p className="mt-5 rounded-xl border border-[#e58e63]/40 bg-[#e58e63]/10 px-4 py-3 text-sm font-medium text-[#06262e]">
                      {error}
                    </p>
                  )}
                  <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="text-[0.8rem] leading-relaxed text-[#06262e]/50">
                      A real person reads every message.
                      <br className="hidden sm:block" /> We reply personally —
                      usually the same day.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group inline-flex items-center gap-2 rounded-full bg-[#06262e] px-8 py-4 text-sm font-semibold text-[#faf6ec] transition-all duration-300 hover:bg-[#149e93] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>
                          Request your stay
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
    </section>
  );
}

export function Footer({ customer }: { customer: NewCustomer }) {
  const brandName = text(customer.businessName, "Blue Hole Villas");

  return (
    <footer className="border-t border-[#faf6ec]/10 bg-[#06262e] text-[#faf6ec]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#top" className="flex items-center gap-3">
              <LogoMark className="h-11 w-11 text-[#7fd8cc]" />
              <span className="leading-none">
                <span className="block font-display text-xl font-semibold">
                  {brandName}
                </span>
                <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#7fd8cc]/80">
                  South Andros · Bahamas
                </span>
              </span>
            </a>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-[#faf6ec]/60">
              {text(
                customer.hero?.description,
                "Secluded villas on a private beach in Congo Town — turquoise water, blue holes across the street, and the wild, quiet beauty of South Andros.",
              )}
            </p>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#faf6ec]/50">
              Explore
            </h3>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-sweep text-[0.95rem] text-[#faf6ec]/85"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="link-sweep text-[0.95rem] text-[#faf6ec]/85"
                >
                  Contact & Booking
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#faf6ec]/50">
              Say hello
            </h3>
            <ul className="mt-5 space-y-4 text-[0.95rem]">
              <li>
                <a
                  href={`tel:${customer.contact?.phone}`}
                  className="group flex items-center gap-3 text-[#faf6ec]/85"
                >
                  <Phone className="h-4 w-4 text-[#7fd8cc]" />
                  <span className="link-sweep">
                    {text(customer.contact?.phone, "+1 (242) 471-2225")}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${customer.contact?.email}`}
                  className="group flex items-center gap-3 text-[#faf6ec]/85"
                >
                  <Mail className="h-4 w-4 text-[#7fd8cc]" />
                  <span className="link-sweep break-all">
                    {text(customer.contact?.email, "blueholevillas@gmail.com")}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-[#faf6ec]/85">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7fd8cc]" />
                <span>
                  {text(customer.contact?.address, "South Andros, The Bahamas")}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#faf6ec]/10 pt-8 text-[0.8rem] text-[#faf6ec]/45 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {brandName}
          </p>
          <p className="tracking-wide">Designed by InfyCrest</p>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumVillaTemplate({
  customer = demoVillaCustomer,
}: {
  customer?: NewCustomer;
}) {
  const style = {
    "--brand-accent": text(customer.theme?.accent, COLORS.lagoon),
  } as CSSProperties;

  return (
    <div
      style={style}
      className="relative bg-[#faf6ec] font-body text-[#06262e] selection:bg-[#149e93] selection:text-white"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes kenburns { from { transform: scale(1) translateY(0); } to { transform: scale(1.14) translateY(-1.5%); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.75; } 100% { transform: scale(3); opacity: 0; } }
        @keyframes drop { 0% { transform: translateY(-100%); } 55% { transform: translateY(100%); } 100% { transform: translateY(100%); } }
        
        .animate-marquee { animation: marquee 46s linear infinite; }
        .animate-spin-slow { animation: spin-slow 28s linear infinite; }
        .animate-pulse-ring { animation: pulse-ring 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
        .animate-drop { animation: drop 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        
        .kicker { font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase; font-weight: 600; }
        .link-sweep { background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px; background-position: 0 100%; background-repeat: no-repeat; transition: background-size 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .link-sweep:hover { background-size: 100% 1px; }

        .villa-grain::after {
          content: "";
          position: fixed;
          inset: -50%;
          z-index: 80;
          pointer-events: none;
          opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
        }
      `,
        }}
      />

      <div className="villa-grain" aria-hidden="true" />
      <Navbar customer={customer} />
      <main>
        <Hero customer={customer} />
        <Marquee />
        <Welcome customer={customer} />
        <Villas />
        <Beach />
        <BlueHoles />
        <Activities customer={customer} />
        <Location customer={customer} />
        <Gallery customer={customer} />
        <Contact customer={customer} />
      </main>
      <Footer customer={customer} />
    </div>
  );
}
