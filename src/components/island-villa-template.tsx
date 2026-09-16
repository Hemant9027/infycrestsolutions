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
  animate,
  motion,
  useInView as useMotionInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  AtSign,
  Baby,
  Check,
  ChefHat,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plane,
  Plus,
  Quote,
  Ship,
  Sparkles,
  Waves,
  X,
  Asterisk,
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

export const demoIslandCustomer: NewCustomer = {
  slug: "island-villa",
  businessName: "Island Villa",
  theme: { accent: "#83b6ae" }, // Sage
  CTA: { label: "Enquire" },
  hero: {
    eyebrow: "Arrive somewhere else · Private island retreat",
    title: "A slower kind of luxury.",
    description:
      "One island, one villa, twenty-two hosts. Days shaped by the tide — and nothing else.",
    primaryCta: "Plan your stay",
  },
  heroImages: [villaImg(1)],
  about: {
    title: "Space, salt air and time that belongs to you.",
    body: "A private island retreat shaped around quiet mornings, open water and the small details that make a stay unforgettable — bare feet on warm timber, breakfast wherever the light lands, a staff who appear only when wished for.",
  },
  stats: [
    { value: "7.4", label: "of private island — all of it yours" },
    { value: "9", label: "suites and salas for up to eighteen guests" },
    { value: "22", label: "hosts, chefs, captains and therapists" },
    { value: "1400", label: "of white sand circling the isle" },
  ],
  services: [
    {
      title: "Dawn reef snorkel",
      description:
        "Slip into the house reef with our resident marine biologist as turtles commute past the drop-off and the water is still glass.",
      tag: "06:00 — 09:00",
      image: villaImg(8),
    },
    {
      title: "Sandbank picnic",
      description:
        "A dhoni carries lunch, shade and a coolbox to the crescent of sand that appears at low tide.",
      tag: "12:00 — 15:00",
      image: villaImg(9),
    },
    {
      title: "Sunset dhoni sail",
      description:
        "Hand-sailed, engine-silent. Champagne appears at the exact minute the sun touches the channel.",
      tag: "17:30 — 19:30",
      image: villaImg(10),
    },
    {
      title: "Kayak the lagoon",
      description:
        "Clear-bottom kayaks drift over coral gardens thirty seconds from the jetty. Eagles rays often glide underneath.",
      tag: "Any tide",
      image: villaImg(11),
    },
  ],
  gallery: [
    { image: villaImg(12), caption: "Golden hour, from the seaplane" },
    { image: villaImg(13), caption: "Morning in the master suite" },
    { image: villaImg(14), caption: "Over the coral gardens" },
    { image: villaImg(15), caption: "Where the sea meets the supper" },
    { image: villaImg(16), caption: "The bath garden at rest" },
    { image: villaImg(17), caption: "The reef from above" },
    { image: villaImg(18), caption: "Dusk on the west deck" },
    { image: villaImg(19), caption: "The sala between tides" },
    { image: villaImg(20), caption: "First light on the jetty" },
    { image: villaImg(21), caption: "One island, one villa" },
  ],
  contact: {
    address: "North Ari Atoll, Maldives",
    phone: "+960 400 1234",
    email: "stay@islandvilla.example",
  },
};

/* -------------------------------------------------------------------------- */
/*                                UTILS & HOOKS                               */
/* -------------------------------------------------------------------------- */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const text = (value: unknown, fallback = "") =>
  typeof value === "string" && value ? value : fallback;

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  factor = 0.08,
) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || factor === 0) return;
    let raf = 0;
    let queued = false;
    const update = () => {
      queued = false;
      const rect = el.getBoundingClientRect();
      const offset =
        (rect.top + rect.height / 2 - window.innerHeight / 2) * factor;
      el.style.transform = `translate3d(0px, ${offset.toFixed(1)}px, 0px)`;
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [factor]);
  return ref;
}

/* -------------------------------------------------------------------------- */
/*                              MOTION PRIMITIVES                             */
/* -------------------------------------------------------------------------- */

const lineVariants = {
  hidden: { y: "112%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 1.05, delay: 0.09 * i, ease: EASE },
  }),
};

export function RevealLine({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        variants={lineVariants}
        custom={index}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px" }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function FadeUp({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTag({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <FadeUp y={16}>
      <p
        className={`flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em] ${light ? "text-[#bde1d9]" : "text-[#83b6ae]"}`}
      >
        <span
          className={`h-px w-12 ${light ? "bg-[#bde1d9]/50" : "bg-[#83b6ae]/60"}`}
          aria-hidden="true"
        />
        {children}
      </p>
    </FadeUp>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INTERACTIVE FX                               */
/* -------------------------------------------------------------------------- */

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.16,
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8,
    });
    (window as any).__lenis = lenis;
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
      lenis.stop();
      lenis.destroy();
      (window as any).__lenis = undefined;
      document.removeEventListener("click", onClick);
    };
  }, []);
  return <>{children}</>;
}

export function Preloader({ brand }: { brand: string }) {
  const [progress, setProgress] = useState(0);
  const [lifted, setLifted] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    const DURATION = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLifted(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = gone ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [gone]);

  if (gone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#132626] text-[#edf6f4]"
      initial={{ y: "0%" }}
      animate={lifted ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.95, ease: EASE }}
      onAnimationComplete={() => {
        if (lifted) setGone(true);
      }}
      aria-hidden={lifted}
    >
      <div className="flex h-full flex-col justify-between px-6 py-8 lg:px-12">
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl tracking-[0.2em] text-[#bde1d9]">
            {brand}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
            North Ari Atoll
          </span>
        </div>
        <div className="flex items-end justify-between gap-6">
          <div>
            <motion.p
              className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Arrive somewhere else
            </motion.p>
            <p className="mt-2 max-w-56 font-serif text-2xl italic leading-snug text-[#edf6f4]/85">
              A slower kind of luxury is being prepared.
            </p>
          </div>
          <span className="font-serif font-light tabular-nums leading-[0.8] text-[#edf6f4] text-[clamp(6rem,18vw,16rem)]">
            {progress}
          </span>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-px bg-[#bde1d9]/70 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
}

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 1000, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 1000, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const over = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      setActive(
        Boolean(
          target?.closest?.("a, button, input, textarea, select, [data-hover]"),
        ),
      );
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[99] mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        animate={{ scale: active ? 3.6 : 1, opacity: active ? 0.75 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export function GrainOverlay() {
  return <div className="grain" aria-hidden="true" />;
}

/* -------------------------------------------------------------------------- */
/*                              SECTION COMPONENTS                            */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { label: "The villa", href: "#villa" },
  { label: "Spaces", href: "#spaces" },
  { label: "The island", href: "#island" },
  { label: "Dining", href: "#dining" },
  { label: "Rates", href: "#rates" },
];

export function Header({ customer }: { customer: NewCustomer }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const brandName = text(customer.businessName, "Island Villa");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "bg-[#edf6f4]/85 text-[#203b3b] shadow-[0_1px_0_rgba(32,59,59,0.08)] backdrop-blur-md"
            : "bg-transparent text-white"
        }`}
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
      >
        <div className="flex h-20 items-center justify-between px-6 lg:px-12">
          <a
            href="#top"
            className="font-serif text-2xl tracking-[0.18em]"
            aria-label={`${brandName} - back to top`}
          >
            {brandName}
          </a>
          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-sweep text-[11px] font-semibold uppercase tracking-[0.22em]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#stay"
              className={`hidden rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 sm:block ${
                scrolled
                  ? "bg-[#203b3b] text-white hover:bg-[#132626]"
                  : "bg-[#83b6ae] text-white hover:bg-[#bde1d9] hover:text-[#203b3b]"
              }`}
            >
              {text(customer.CTA?.label, "Enquire")}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-11 place-items-center rounded-full border border-current/20 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-[#132626] px-6 py-8 text-[#edf6f4] lg:px-12"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl tracking-[0.18em] text-[#bde1d9]">
                {brandName}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-full border border-white/20"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-16 flex flex-col">
              {[...NAV_LINKS, { label: "Your stay", href: "#stay" }].map(
                (link, i) => (
                  <div key={link.href} className="overflow-hidden">
                    <motion.a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 border-b border-white/10 py-5"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{
                        delay: 0.15 + i * 0.06,
                        duration: 0.7,
                        ease: EASE,
                      }}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#bde1d9]/60">
                        0{i + 1}
                      </span>
                      <span className="font-serif text-5xl font-light transition-all duration-300 group-hover:translate-x-3 group-hover:italic group-hover:text-[#bde1d9]">
                        {link.label}
                      </span>
                    </motion.a>
                  </div>
                ),
              )}
            </nav>
            <motion.div
              className="mt-auto flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span>
                {text(customer.contact?.address, "North Ari Atoll · Maldives")}
              </span>
              <span className="hidden sm:block">
                {text(customer.contact?.email, "stay@islandvilla.example")}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Hero({ customer }: { customer: NewCustomer }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const DELAY = 1.2;
  const imageSrc = customer.heroImages?.[0] || villaImg(1);

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col overflow-hidden text-white"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={imageSrc}
          alt="Aerial view of Island Villa"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#203b3b]/95 via-[#203b3b]/20 to-[#132626]/40" />
      <motion.div
        className="relative z-10 mt-auto px-6 pb-10 lg:px-12"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="mb-7 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#bde1d9]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: DELAY, duration: 0.9, ease: EASE }}
        >
          <span className="h-px w-12 bg-[#bde1d9]/60" aria-hidden="true" />
          {text(
            customer.hero?.eyebrow,
            "Arrive somewhere else · Private island retreat",
          )}
        </motion.p>
        <h1 className="font-serif font-light leading-[0.86] text-[clamp(3.4rem,10.5vw,10.5rem)]">
          <RevealLine index={0}>
            {text(customer.hero?.title, "A slower kind").replace(
              "of luxury.",
              "",
            )}
          </RevealLine>
          <RevealLine index={1}>
            <em className="italic text-[#bde1d9]">of luxury.</em>
          </RevealLine>
        </h1>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            className="max-w-md text-base leading-relaxed text-white/75 md:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: DELAY + 0.3, duration: 0.9, ease: EASE }}
          >
            {text(
              customer.hero?.description,
              "One island, one villa, twenty-two hosts. Days shaped by the tide — and nothing else.",
            )}
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: DELAY + 0.42, duration: 0.9, ease: EASE }}
          >
            <a
              href="#stay"
              className="group inline-flex items-center gap-2 rounded-full bg-[#83b6ae] px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-[#bde1d9] hover:text-[#203b3b]"
            >
              {text(customer.hero?.primaryCta, "Plan your stay")}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#villa"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-white/70"
            >
              Explore the island
            </a>
          </motion.div>
        </div>
        <motion.div
          className="mt-12 flex items-center justify-between border-t border-white/15 pt-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: DELAY + 0.55, duration: 1 }}
        >
          <span>3.3224° 72.9231° E</span>
          <span className="hidden md:block">North Ari Atoll · Maldives</span>
          <span className="flex items-center gap-2">
            Scroll
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.7,
                ease: "easeInOut",
              }}
            >
              <ArrowDown className="size-3.5" />
            </motion.span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Marquee() {
  const ITEMS = [
    "Private island retreat",
    "North Ari Atoll",
    "One villa · twenty-two hosts",
    "Open skies · unhurried evenings",
    "Est. 2016",
  ];
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className="overflow-hidden border-y border-[#203b3b]/10 bg-[#edf6f4] py-6"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee-slow items-center">
        {row.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center">
            <span
              className={`whitespace-nowrap font-serif text-2xl md:text-3xl ${i % 2 ? "italic text-[#83b6ae]" : "font-light text-[#203b3b]"}`}
            >
              {item}
            </span>
            <Asterisk className="mx-8 size-5 shrink-0 text-[#c9b291]" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Intro({ customer }: { customer: NewCustomer }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yTall = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [140, -110]);
  const yWide = useTransform(scrollYProgress, [0, 1], [20, -140]);

  return (
    <section
      id="villa"
      className="relative overflow-hidden px-6 py-24 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[92rem]">
        <SectionTag>00 · The idea</SectionTag>
        <h2 className="mt-10 max-w-6xl font-serif font-light leading-[0.95] text-[clamp(2.5rem,6.2vw,5.8rem)]">
          <RevealLine index={0}>Space, salt air</RevealLine>
          <RevealLine index={1}>
            <span>
              and time that <em className="italic text-[#83b6ae]">belongs</em>
            </span>
          </RevealLine>
          <RevealLine index={2}>
            <span>
              to
              <span
                className="relative mx-3 inline-block h-[0.68em] w-[1.7em] overflow-hidden rounded-full align-middle"
                data-hover
              >
                <Image
                  src={villaImg(3)}
                  alt=""
                  fill
                  sizes="15vw"
                  className="object-cover"
                />
              </span>
              you.
            </span>
          </RevealLine>
        </h2>
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_28rem] lg:items-end">
          <FadeUp>
            <p className="max-w-2xl text-xl leading-relaxed text-[#203b3b]/65 md:text-2xl">
              {text(
                customer.about?.body,
                "A private island retreat shaped around quiet mornings, open water and the small details that make a stay unforgettable — bare feet on warm timber, breakfast wherever the light lands, a staff who appear only when wished for.",
              )}
            </p>
          </FadeUp>
          <FadeUp delay={0.15} className="lg:justify-self-end">
            <a
              href="#spaces"
              className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#203b3b]"
            >
              <span className="link-sweep">Step inside the residence</span>
              <span className="grid size-11 place-items-center rounded-full bg-[#203b3b] text-white transition-colors duration-300 group-hover:bg-[#83b6ae]">
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </a>
          </FadeUp>
        </div>

        <div
          ref={ref}
          className="relative mt-24 grid grid-cols-12 gap-5 lg:mt-32 lg:gap-8"
        >
          <motion.figure
            style={{ y: yTall }}
            className="col-span-12 md:col-span-7"
          >
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem]">
              <Image
                src={villaImg(4)}
                alt="Island Villa residence"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-[#203b3b]/45">
              <span>· 01 · The residence</span>
              <span className="font-serif text-sm normal-case italic tracking-normal text-[#83b6ae]">
                dusk, west deck
              </span>
            </figcaption>
          </motion.figure>
          <motion.figure
            style={{ y: ySmall }}
            className="col-span-6 md:col-span-4 md:col-start-9 md:-mt-10"
          >
            <div className="group relative aspect-square overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem]">
              <Image
                src={villaImg(5)}
                alt="The reef"
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
              />
            </div>
            <figcaption className="mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#203b3b]/45">
              · 02 · The reef below
            </figcaption>
          </motion.figure>
          <motion.figure
            style={{ y: yWide }}
            className="col-span-6 md:col-span-3 md:col-start-8 md:mt-16"
          >
            <div className="group relative aspect-[3/4] overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem]">
              <Image
                src={villaImg(6)}
                alt="Bath garden"
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between text-[10px] font-semibold uppercase tracking-[0.28em] text-[#203b3b]/45">
              <span>· 03 · The bath garden</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}

function Counter({
  value,
  decimals = 0,
}: {
  value: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useMotionInView(ref, { once: true, margin: "-15% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = v.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals]);
  return <span ref={ref}>0</span>;
}

export function Stats({ customer }: { customer: NewCustomer }) {
  const fallbackStats = [
    {
      value: 7.4,
      decimals: 1,
      suffix: "acres",
      label: "of private island — all of it yours",
    },
    {
      value: 9,
      decimals: 0,
      suffix: "suites",
      label: "and salas for up to eighteen guests",
    },
    {
      value: 22,
      decimals: 0,
      suffix: "hosts",
      label: "chefs, captains and therapists",
    },
    {
      value: 1400,
      decimals: 0,
      suffix: "m",
      label: "of white sand circling the isle",
    },
  ];

  const displayStats =
    customer.stats && customer.stats.length > 0
      ? customer.stats.map((s) => {
          const numMatch = s.value.match(/([\d.]+)/);
          const num = numMatch ? parseFloat(numMatch[1]) : 0;
          const suffixMatch = s.value.replace(/[\d.]+/, "").trim();
          return {
            value: num,
            decimals: num % 1 !== 0 ? 1 : 0,
            suffix: suffixMatch,
            label: s.label,
          };
        })
      : fallbackStats;

  return (
    <section className="bg-[#203b3b] px-6 py-24 text-[#edf6f4] lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-[92rem] gap-14 lg:grid-cols-[20rem_1fr]">
        <div>
          <SectionTag light>The island in numbers</SectionTag>
          <FadeUp delay={0.1}>
            <p className="mt-6 font-serif text-2xl font-light italic leading-snug text-[#edf6f4]/80">
              Small enough to walk in twenty minutes. Large enough to lose a
              whole afternoon.
            </p>
          </FadeUp>
        </div>
        <dl className="grid gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {displayStats.map((stat, i) => (
            <FadeUp key={stat.suffix + i} delay={i * 0.1}>
              <div className="border-t border-[#edf6f4]/15 pt-6">
                <dd className="font-serif font-light leading-none text-[#edf6f4] text-[clamp(3.4rem,5vw,4.75rem)]">
                  <Counter value={stat.value} decimals={stat.decimals} />
                  <span className="ml-1 align-baseline font-serif text-2xl italic text-[#bde1d9]">
                    {stat.suffix}
                  </span>
                </dd>
                <dt className="mt-4 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.22em] text-white/45">
                  {stat.label}
                </dt>
              </div>
            </FadeUp>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Spaces() {
  const SPACES = [
    {
      n: "01",
      title: "The Great Room",
      blurb:
        "Fourteen metres of indoor-outdoor living beneath a vaulted timber ceiling — where mornings begin with bare feet and long espresso.",
      features: [
        "Indoor-outdoor living",
        "Vaulted timber ceiling",
        "Sunken sundown lounge",
      ],
      img: villaImg(1),
      alt: "The Great Room terrace",
    },
    {
      n: "02",
      title: "Master Suites",
      blurb:
        "Ocean-facing suites wrapped in linen and teak, each with a wraparound veranda and a rain shower open to the sky.",
      features: [
        "Ocean-facing verandas",
        "Open-sky rain showers",
        "Handwoven island linens",
      ],
      img: villaImg(7),
      alt: "Master suite",
    },
    {
      n: "03",
      title: "Spa Sala",
      blurb:
        "An over-garden treatment pavilion where therapists work to the tempo of the tide, using coconut, coral mint and warm shells.",
      features: [
        "Two therapists in residence",
        "Tide-timed treatments",
        "Breathwork at dawn",
      ],
      img: villaImg(8),
      alt: "Spa pavilion",
    },
    {
      n: "04",
      title: "The Bath Garden",
      blurb:
        "A carved stone tub beneath the frangipani, drawn with salts from the reef side — the island's favourite way to end a day.",
      features: [
        "Carved stone soaking tub",
        "Frangipani courtyard",
        "Evening bath ritual",
      ],
      img: villaImg(9),
      alt: "Stone bath garden",
    },
  ];

  return (
    <section id="spaces" className="px-6 py-24 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[92rem]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTag>01 · Make yourself at home</SectionTag>
            <h2 className="mt-8 font-serif font-light leading-[0.95] text-[clamp(2.5rem,5.5vw,5rem)]">
              <RevealLine index={0}>Rooms that breathe</RevealLine>
              <RevealLine index={1}>
                <em className="italic text-[#83b6ae]">with the tide.</em>
              </RevealLine>
            </h2>
          </div>
          <FadeUp delay={0.2}>
            <p className="max-w-sm text-base leading-relaxed text-[#203b3b]/60">
              Four spaces, one rhythm. Each opens to the water, the garden, or
              the sky — some to all three.
            </p>
          </FadeUp>
        </div>
        <div className="mt-20 space-y-10 lg:space-y-0">
          {SPACES.map((space, i) => (
            <div
              key={space.title}
              className="lg:sticky lg:pb-10"
              style={{ top: `calc(5.5rem + ${i * 1.5}rem)` }}
            >
              <FadeUp y={40}>
                <article className="group grid overflow-hidden rounded-[2rem] bg-[#203b3b] text-[#edf6f4] shadow-[0_40px_90px_-40px_rgba(19,38,38,0.55)] md:grid-cols-2 lg:rounded-[2.75rem]">
                  <div
                    className={`flex flex-col justify-between p-8 md:p-12 lg:p-14 ${i % 2 === 1 ? "md:order-2" : "md:order-1"}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#bde1d9]/70">
                          {space.n} · Space
                        </span>
                        <span
                          className="h-px w-16 bg-[#bde1d9]/25"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="mt-8 font-serif font-light leading-[1.02] text-4xl md:text-5xl lg:text-6xl">
                        {space.title}
                      </h3>
                      <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
                        {space.blurb}
                      </p>
                      <ul className="mt-8 space-y-3">
                        {space.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#bde1d9]/85"
                          >
                            <Check className="size-3.5 text-[#83b6ae]" />{" "}
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href="#stay"
                      className="group/link mt-10 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 transition-colors hover:text-[#bde1d9]"
                    >
                      <span className="link-sweep">Sleep here</span>
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:rotate-45" />
                    </a>
                  </div>
                  <div
                    className={`relative min-h-[320px] overflow-hidden md:min-h-[560px] ${i % 2 === 1 ? "md:order-1" : "md:order-2"}`}
                  >
                    <Image
                      src={space.img}
                      alt={space.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#203b3b]/35 to-transparent md:bg-gradient-to-r" />
                  </div>
                </article>
              </FadeUp>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experiences({ customer }: { customer: NewCustomer }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0);

  const fallbackExperiences = [
    {
      title: "Dawn reef snorkel",
      time: "06:00 — 09:00",
      desc: "Slip into the house reef with our resident marine biologist.",
      img: villaImg(10),
    },
    {
      title: "Sandbank picnic",
      time: "12:00 — 15:00",
      desc: "A dhoni carries lunch, shade and a coolbox to the crescent of sand.",
      img: villaImg(11),
    },
    {
      title: "Sunset dhoni sail",
      time: "17:30 — 19:30",
      desc: "Hand-sailed, engine-silent. Champagne appears at the exact minute the sun touches the channel.",
      img: villaImg(12),
    },
    {
      title: "Kayak the lagoon",
      time: "Any tide",
      desc: "Clear-bottom kayaks drift over coral gardens thirty seconds from the jetty.",
      img: villaImg(13),
    },
    {
      title: "Cinema under stars",
      time: "21:00 — late",
      desc: "A screen raised in the shallows, beanbags on the sandbar, and the reel of your choice.",
      img: villaImg(14),
    },
  ];

  const EXPERIENCES =
    customer.services && customer.services.length > 0
      ? customer.services.map((s, i) => ({
          title: s.title,
          time: s.tag || "Any tide",
          desc: s.description,
          img: s.image || villaImg(10 + i),
        }))
      : fallbackExperiences;

  const toggle = (index: number) => {
    setExpanded((current) => (current === index ? null : index));
    setActive(index);
  };

  return (
    <section
      id="island"
      className="bg-[#203b3b] px-6 py-24 text-[#edf6f4] lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[92rem]">
        <SectionTag light>02 · Island days</SectionTag>
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-serif font-light leading-[0.95] text-[clamp(2.5rem,5.5vw,5rem)]">
            <RevealLine index={0}>Days shaped</RevealLine>
            <RevealLine index={1}>
              <em className="italic text-[#bde1d9]">by the tide.</em>
            </RevealLine>
          </h2>
          <FadeUp delay={0.15}>
            <p className="max-w-sm text-base leading-relaxed text-white/55">
              There is no schedule here — only suggestions. Hover, open, and
              take what the day offers.
            </p>
          </FadeUp>
        </div>
        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <FadeUp>
            <div className="border-t border-white/15">
              {EXPERIENCES.map((exp, i) => {
                const isOpen = expanded === i;
                return (
                  <div key={exp.title} className="border-b border-white/15">
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      onMouseEnter={() => setActive(i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-baseline gap-5 md:gap-8">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#bde1d9]/50">
                          0{i + 1}
                        </span>
                        <div>
                          <h3
                            className={`font-serif font-light leading-tight transition-all duration-400 text-3xl md:text-4xl ${active === i ? "translate-x-1 text-[#bde1d9]" : "text-[#edf6f4]"}`}
                          >
                            {exp.title}
                          </h3>
                          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/40">
                            {exp.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ${isOpen ? "rotate-45 border-[#bde1d9] bg-[#bde1d9] text-[#203b3b]" : "border-white/25 text-[#edf6f4] group-hover:border-[#bde1d9]/60"}`}
                      >
                        <Plus className="size-4" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.55, ease: EASE }}
                        >
                          <p className="max-w-xl pb-8 pl-9 text-base leading-relaxed text-white/60 md:pl-14">
                            {exp.desc}
                          </p>
                          <div className="relative mb-8 ml-9 h-52 overflow-hidden rounded-2xl md:ml-14 lg:hidden">
                            <Image
                              src={exp.img}
                              alt={exp.title}
                              fill
                              sizes="100vw"
                              className="object-cover"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </FadeUp>
          <div className="relative hidden self-start lg:sticky lg:top-28 lg:block">
            <FadeUp delay={0.2}>
              <div className="relative h-[70vh] overflow-hidden rounded-[2.5rem]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={active}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    <Image
                      src={EXPERIENCES[active].img}
                      alt={EXPERIENCES[active].title}
                      fill
                      sizes="42vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#132626]/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#bde1d9]">
                      {EXPERIENCES[active].time}
                    </p>
                    <p className="mt-2 font-serif text-3xl font-light italic text-white">
                      {EXPERIENCES[active].title}
                    </p>
                  </div>
                  <span className="font-serif text-5xl font-light text-white/35">
                    0{active + 1}
                  </span>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Dining() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const MENU = [
    {
      n: "i",
      title: "The lagoon catch",
      desc: "Reef fish grilled over coconut husk, island lime, sea herbs.",
    },
    {
      n: "ii",
      title: "Garden & reef",
      desc: "A seven-course tasting that never leaves sight of the water.",
    },
    {
      n: "iii",
      title: "Island larder",
      desc: "Breadfruit, young coconut, island honey and the day's pickle.",
    },
    {
      n: "iv",
      title: "The travelling cellar",
      desc: "Pairings decanted on whichever beach the evening chooses.",
    },
  ];

  return (
    <section id="dining" className="px-6 py-24 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[92rem]">
        <SectionTag>03 · Private dining</SectionTag>
        <h2 className="mt-8 max-w-5xl font-serif font-light leading-[0.95] text-[clamp(2.5rem,5.5vw,5rem)]">
          <RevealLine index={0}>Table for two,</RevealLine>
          <RevealLine index={1}>
            <em className="italic text-[#83b6ae]">wherever you like.</em>
          </RevealLine>
        </h2>
        <FadeUp y={50} className="mt-16">
          <div
            ref={ref}
            className="relative h-[62vh] overflow-hidden rounded-[2rem] lg:h-[78vh] lg:rounded-[2.75rem]"
          >
            <motion.div
              className="absolute -top-[14%] h-[128%] w-full"
              style={{ y }}
            >
              <Image
                src={villaImg(15)}
                alt="Candlelit dinner"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#203b3b]/60 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/75 lg:bottom-8 lg:left-10">
              Sandbank · dinner served at the waterline
            </p>
          </div>
        </FadeUp>
        <div className="mt-16 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
          <FadeUp>
            <div className="border-t border-[#203b3b]/15">
              {MENU.map((course) => (
                <div
                  key={course.title}
                  className="group flex items-baseline gap-6 border-b border-[#203b3b]/15 py-7 transition-all duration-500 hover:pl-3 md:gap-10"
                >
                  <span className="font-serif text-lg italic text-[#c9b291]">
                    {course.n}.
                  </span>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl font-light text-[#203b3b] md:text-3xl">
                      {course.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#203b3b]/55">
                      {course.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="flex h-full flex-col justify-between gap-10 lg:pl-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#83b6ae]">
                  From the kitchen
                </p>
                <blockquote className="mt-6 font-serif font-light italic leading-snug text-3xl text-[#203b3b] md:text-4xl">
                  “I cook with what the lagoon decides to give us that morning.
                  No menu survives contact with the reef.”
                </blockquote>
              </div>
              <div className="flex items-center gap-4">
                <span className="h-px w-14 bg-[#c9b291]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#203b3b]">
                    Chef Amila Rasheed
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#203b3b]/50">
                    Eight seasons on the island
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function GridGallery({ customer }: { customer: NewCustomer }) {
  const ROW_A =
    customer.gallery && customer.gallery.length >= 10
      ? customer.gallery.slice(0, 5)
      : [
          { image: villaImg(16), caption: "Golden hour, from the seaplane" },
          { image: villaImg(17), caption: "Morning in the master suite" },
          { image: villaImg(18), caption: "Over the coral gardens" },
          { image: villaImg(19), caption: "Where the sea meets the supper" },
          { image: villaImg(20), caption: "The bath garden at rest" },
        ];
  const ROW_B =
    customer.gallery && customer.gallery.length >= 10
      ? customer.gallery.slice(5, 10)
      : [
          { image: villaImg(21), caption: "The reef from above" },
          { image: villaImg(22), caption: "Dusk on the west deck" },
          { image: villaImg(23), caption: "The sala between tides" },
          { image: villaImg(24), caption: "First light on the jetty" },
          { image: villaImg(25), caption: "One island, one villa" },
        ];

  const Row = ({
    items,
    reverse = false,
  }: {
    items: typeof ROW_A;
    reverse?: boolean;
  }) => {
    const doubled = [...items, ...items];
    return (
      <div
        className={`flex w-max animate-marquee-slow gap-5 hover:[animation-play-state:paused] ${reverse ? "[animation-direction:reverse]" : ""}`}
      >
        {doubled.map((item, i) => (
          <figure
            key={`${item.image}-${i}`}
            className="group relative h-52 w-72 shrink-0 overflow-hidden rounded-2xl md:h-64 md:w-[24rem] md:rounded-3xl"
            data-hover
          >
            <Image
              src={item.image}
              alt={item.caption || ""}
              fill
              sizes="(min-width: 768px) 24rem, 18rem"
              className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#203b3b]/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <figcaption className="absolute bottom-4 left-4 translate-y-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  };

  return (
    <section className="overflow-hidden py-24 lg:py-32">
      <div className="px-6 text-center lg:px-12">
        <FadeUp y={16}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#83b6ae]">
            Postcards from the atoll
          </p>
        </FadeUp>
        <h2 className="mx-auto mt-6 font-serif font-light leading-[0.95] text-[clamp(2.5rem,5.5vw,5rem)]">
          <RevealLine index={0}>Salt on the lens.</RevealLine>
        </h2>
      </div>
      <FadeUp delay={0.15} className="mt-14 space-y-5">
        <Row items={ROW_A} />
        <Row items={ROW_B} reverse />
      </FadeUp>
    </section>
  );
}

export function Testimonials() {
  const QUOTES = [
    {
      quote:
        "Seven days felt like a season. We came home with new clocks inside us.",
      name: "Elena & Marc",
      detail: "Zurich · 12 nights, whole island",
    },
    {
      quote:
        "The staff learned our rhythms by day two — then quietly built every day around them.",
      name: "The Okafor family",
      detail: "Lagos · 8 nights, festive season",
    },
    {
      quote:
        "I have stayed on private islands on five continents. This is the one I dream about.",
      name: "H. Yamashita",
      detail: "Kyoto · 21 nights, atelier suite",
    },
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % QUOTES.length),
      6500,
    );
    return () => clearInterval(timer);
  }, []);

  const step = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + QUOTES.length) % QUOTES.length);

  return (
    <section className="bg-[#e9e0d0] px-6 py-24 text-[#203b3b] lg:px-12 lg:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <FadeUp y={16}>
          <span className="inline-grid size-14 place-items-center rounded-full border border-[#203b3b]/15">
            <Quote className="size-5 text-[#83b6ae]" />
          </span>
        </FadeUp>
        <div className="relative mt-10 min-h-[16rem] md:min-h-[15rem]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -26 }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <p className="font-serif font-light leading-[1.15] text-3xl md:text-5xl">
                “{QUOTES[index].quote}”
              </p>
              <footer className="mt-8">
                <p className="text-sm font-semibold">{QUOTES[index].name}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#203b3b]/50">
                  {QUOTES[index].detail}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-12 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => step(-1)}
            className="grid size-12 place-items-center rounded-full border border-[#203b3b]/20 transition-colors hover:bg-[#203b3b] hover:text-[#edf6f4]"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#203b3b]/50">
              0{index + 1} · 0{QUOTES.length}
            </span>
            <div className="h-px w-40 overflow-hidden bg-[#203b3b]/15">
              <motion.div
                key={index}
                className="h-full origin-left bg-[#203b3b]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6.5, ease: "linear" }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            className="grid size-12 place-items-center rounded-full border border-[#203b3b]/20 transition-colors hover:bg-[#203b3b] hover:text-[#edf6f4]"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function Rates() {
  const SEASONS = [
    {
      name: "Recovery season",
      dates: "Jan 10 — Mar 31",
      rate: "21,500",
      note: "calm seas, whale-shark passes",
    },
    {
      name: "Low tide season",
      dates: "Apr 01 — Jul 31",
      rate: "16,800",
      note: "long light, an empty reef",
    },
    {
      name: "High summer",
      dates: "Aug 01 — Oct 31",
      rate: "24,000",
      note: "manta season in the channel",
    },
    {
      name: "Festive",
      dates: "Dec 15 — Jan 09",
      rate: "36,000",
      note: "the island in full bloom",
    },
  ];
  const INCLUSIONS = [
    { icon: ChefHat, label: "Private chef & sommelier" },
    { icon: Ship, label: "Dhoni, jet-ski & watercraft" },
    { icon: Plane, label: "Seaplane transfers included" },
    { icon: Waves, label: "House reef & dive kit" },
    { icon: Sparkles, label: "Daily spa & sunrise yoga" },
    { icon: Baby, label: "Nannies on request" },
  ];

  return (
    <section id="rates" className="px-6 py-24 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[92rem]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionTag>04 · Seasons & rates</SectionTag>
            <h2 className="mt-8 font-serif font-light leading-[0.95] text-[clamp(2.5rem,5.5vw,5rem)]">
              <RevealLine index={0}>One island,</RevealLine>
              <RevealLine index={1}>
                <em className="italic text-[#83b6ae]">one invitation.</em>
              </RevealLine>
            </h2>
          </div>
          <FadeUp delay={0.15}>
            <p className="max-w-sm text-base leading-relaxed text-[#203b3b]/60">
              The island is let exclusively — never shared. Rates cover the
              whole residence, every host, and every hour of quiet.
            </p>
          </FadeUp>
        </div>
        <FadeUp className="mt-16">
          <div className="border-t border-[#203b3b]/15">
            {SEASONS.map((season, i) => (
              <a
                key={season.name}
                href="#stay"
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 border-b border-[#203b3b]/15 py-7 transition-all duration-500 hover:pl-4 md:grid-cols-[3rem_1fr_1fr_1fr_auto] md:gap-x-10 md:py-9"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#83b6ae]">
                  0{i + 1}
                </span>
                <span>
                  <span className="block font-serif text-2xl font-light text-[#203b3b] transition-colors duration-300 group-hover:text-[#83b6ae] md:text-4xl">
                    {season.name}
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#203b3b]/45 md:hidden">
                    {season.dates}
                  </span>
                </span>
                <span className="hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-[#203b3b]/50 md:block">
                  {season.dates}
                </span>
                <span className="hidden font-serif text-lg italic text-[#203b3b]/50 lg:block">
                  {season.note}
                </span>
                <span className="flex items-center gap-3 justify-self-end md:gap-5">
                  <span className="text-right">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.26em] text-[#203b3b]/40">
                      from
                    </span>
                    <span className="font-serif text-xl font-light md:text-3xl">
                      ${season.rate}
                      <span className="ml-1 align-middle text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#203b3b]/45">
                        /night
                      </span>
                    </span>
                  </span>
                  <span className="grid size-11 place-items-center rounded-full border border-[#203b3b]/15 transition-all duration-400 group-hover:border-[#203b3b] group-hover:bg-[#203b3b] group-hover:text-[#edf6f4]">
                    <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:rotate-45" />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </FadeUp>
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {INCLUSIONS.map((inc, i) => (
            <FadeUp key={inc.label} delay={i * 0.06}>
              <div className="group flex h-full flex-col gap-6 rounded-2xl border border-[#203b3b]/12 p-6 transition-colors duration-500 hover:bg-[#203b3b]">
                <inc.icon className="size-5 text-[#83b6ae] transition-colors duration-500 group-hover:text-[#bde1d9]" />
                <p className="text-[11px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-[#203b3b]/70 transition-colors duration-500 group-hover:text-[#edf6f4]">
                  {inc.label}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp className="mt-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#203b3b]/45">
            Minimum stay four nights · Festive seven · Children of all ages
            adored
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

export function Enquiry({ customer }: { customer: NewCustomer }) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [sentEmail, setSentEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    setTimeout(() => {
      setSentEmail(String(data.get("email") ?? ""));
      setStatus("success");
      form.reset();
    }, 1500);
  }

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-[#edf6f4] placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-[#bde1d9]/70 focus:bg-white/10 [color-scheme:dark]";
  const labelClass =
    "mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#bde1d9]/70";

  return (
    <section id="stay" className="px-6 pb-24 pt-4 lg:px-12 lg:pb-36">
      <div className="mx-auto grid max-w-[92rem] gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionTag>05 · Your stay</SectionTag>
          <h2 className="mt-8 font-serif font-light leading-[0.95] text-[clamp(2.5rem,5.5vw,5rem)]">
            <RevealLine index={0}>Leave with more</RevealLine>
            <RevealLine index={1}>
              <em className="italic text-[#83b6ae]">time</em> than you
            </RevealLine>
            <RevealLine index={2}>arrived with.</RevealLine>
          </h2>
          <FadeUp delay={0.2}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[#203b3b]/65">
              Tell us when the tide should expect you. Our island team replies
              personally — usually within one tide, always within a day.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <ul className="mt-10 space-y-5">
              {[
                {
                  icon: Mail,
                  label: text(
                    customer.contact?.email,
                    "stay@islandvilla.example",
                  ),
                  href: `mailto:${customer.contact?.email}`,
                },
                {
                  icon: Phone,
                  label: text(customer.contact?.phone, "+960 400 1234"),
                  href: `tel:${customer.contact?.phone}`,
                },
                {
                  icon: MapPin,
                  label: text(
                    customer.contact?.address,
                    "North Ari Atoll, Maldives",
                  ),
                  href: "#top",
                },
                {
                  icon: Clock,
                  label: "Replies within 24 hours",
                  href: "#stay",
                },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-4 text-sm font-semibold text-[#203b3b]"
                  >
                    <span className="grid size-11 place-items-center rounded-full border border-[#203b3b]/15 transition-colors duration-300 group-hover:bg-[#203b3b] group-hover:text-[#edf6f4]">
                      <item.icon className="size-4" />
                    </span>
                    <span className="link-sweep">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
        <FadeUp delay={0.2}>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#203b3b] p-7 text-[#edf6f4] shadow-[0_50px_110px_-45px_rgba(19,38,38,0.6)] md:p-12 lg:rounded-[2.75rem]">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  className="flex min-h-[32rem] flex-col items-center justify-center text-center"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <motion.span
                    className="grid size-20 place-items-center rounded-full bg-[#bde1d9] text-[#203b3b]"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.15,
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    }}
                  >
                    <Check className="size-8" />
                  </motion.span>
                  <h3 className="mt-8 font-serif text-4xl font-light">
                    The island has your words.
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                    Thank you — our island team will write to{" "}
                    <span className="text-[#bde1d9]">{sentEmail}</span> within
                    24 hours with availability and a tide chart for your dates.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-10 rounded-full border border-white/25 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:border-[#bde1d9] hover:text-[#bde1d9]"
                  >
                    Send another enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-3xl font-light">
                      Enquire about a stay
                    </h3>
                    <span className="hidden text-[10px] font-semibold uppercase tracking-[0.26em] text-[#bde1d9]/60 sm:block">
                      Est. reply · 24h
                    </span>
                  </div>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Full name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Amelia Laurent"
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
                        placeholder="amelia@example.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="arrivalDate" className={labelClass}>
                        Arriving
                      </label>
                      <input
                        id="arrivalDate"
                        name="arrivalDate"
                        type="date"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="nights" className={labelClass}>
                          Nights
                        </label>
                        <input
                          id="nights"
                          name="nights"
                          type="number"
                          min={1}
                          max={90}
                          defaultValue={7}
                          required
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="guests" className={labelClass}>
                          Guests
                        </label>
                        <input
                          id="guests"
                          name="guests"
                          type="number"
                          min={1}
                          max={16}
                          defaultValue={2}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="villa" className={labelClass}>
                        Your island arrangement
                      </label>
                      <select
                        id="villa"
                        name="villa"
                        className={inputClass}
                        defaultValue="Whole island (exclusive)"
                      >
                        <option className="bg-[#203b3b]">
                          Whole island (exclusive)
                        </option>
                        <option className="bg-[#203b3b]">
                          Master suite wing
                        </option>
                        <option className="bg-[#203b3b]">
                          Family gathering — all nine suites
                        </option>
                        <option className="bg-[#203b3b]">
                          Atelier suite — long stay
                        </option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="message" className={labelClass}>
                        Anything the island should know
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="A birthday on the sandbank, a fear of speedboats, an obsession with turtles..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#83b6ae] py-4.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#bde1d9] hover:text-[#203b3b] disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Casting off
                      </>
                    ) : (
                      <>
                        Send your enquiry{" "}
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
                      </>
                    )}
                  </button>
                  <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
                    No lists. No noise. One reply, written by a person.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export function Footer({ customer }: { customer: NewCustomer }) {
  const brandName = text(customer.businessName, "Island Villa");

  return (
    <footer className="bg-[#132626] px-6 pb-10 pt-24 text-[#edf6f4] lg:px-12 lg:pt-32">
      <div className="mx-auto max-w-[92rem]">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <FadeUp>
            <h2 className="max-w-md font-serif font-light leading-[1.02] text-4xl md:text-5xl">
              <RevealLine index={0}>Arrive somewhere</RevealLine>
              <RevealLine index={1}>
                <em className="italic text-[#bde1d9]">else.</em>
              </RevealLine>
            </h2>
            <a
              href="#stay"
              className="group mt-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#bde1d9]"
            >
              <span className="link-sweep">Begin your enquiry</span>
              <span className="grid size-10 place-items-center rounded-full bg-[#bde1d9] text-[#203b3b] transition-transform duration-300 group-hover:scale-110">
                <ArrowUpRight className="size-4" />
              </span>
            </a>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
              Explore
            </p>
            <ul className="mt-6 space-y-3.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-sweep text-sm text-white/70 transition-colors hover:text-[#edf6f4]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.18}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
              Find us
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/70">
              {text(
                customer.contact?.address,
                "Island Villa, Bodu Finolhu\nNorth Ari Atoll\nRepublic of Maldives",
              )
                .split("\n")
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
            </p>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bde1d9]/70">
              3.3224° 72.9231° E
            </p>
          </FadeUp>
          <FadeUp delay={0.26}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
              Write to us
            </p>
            <p className="mt-6 text-sm leading-relaxed text-white/70">
              {text(customer.contact?.email, "stay@islandvilla.example")}
              <br />
              {text(customer.contact?.phone, "+960 400 1234")}
            </p>
            <div className="mt-6 flex gap-3">
              {[AtSign, Mail, Phone].map((Icon, i) => (
                <a
                  key={i}
                  href="#stay"
                  className="grid size-11 place-items-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-[#bde1d9] hover:text-[#bde1d9]"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </FadeUp>
        </div>
        <FadeUp y={60} className="mt-24 overflow-hidden">
          <p
            className="text-outline select-none whitespace-nowrap text-center font-serif font-light leading-[0.85] tracking-[0.14em] text-[clamp(4rem,14.5vw,15rem)]"
            aria-hidden="true"
          >
            {brandName}
          </p>
        </FadeUp>
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/35">
            © {new Date().getFullYear()} {brandName} · A slower kind of luxury
          </p>
          <p className="hidden text-[10px] font-semibold uppercase tracking-[0.26em] text-white/35 lg:block">
            Designed by Infycrest Solutions
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/60 transition-colors hover:text-[#bde1d9]"
          >
            Back to the surface
            <span className="grid size-10 place-items-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-[#bde1d9]">
              <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN TEMPLATE                                */
/* -------------------------------------------------------------------------- */

export default function PremiumIslandVillaTemplate({
  customer = demoIslandCustomer,
}: {
  customer?: NewCustomer;
}) {
  const style = {
    "--brand-accent": text(customer.theme?.accent, "#83b6ae"),
  } as CSSProperties;

  return (
    <SmoothScroll>
      <div
        style={style}
        className="bg-[#edf6f4] font-sans text-[#203b3b] selection:bg-[#83b6ae] selection:text-white relative"
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes marquee { to { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 44s linear infinite; }
          .animate-marquee-slow { animation: marquee 72s linear infinite; }
          .text-outline { -webkit-text-stroke: 1px rgba(189, 225, 217, 0.28); color: transparent; }
          .link-sweep { position: relative; }
          .link-sweep::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 1px; width: 100%; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
          .link-sweep:hover::after { transform: scaleX(1); transform-origin: left; }
          .grain { position: fixed; inset: 0; z-index: 80; pointer-events: none; opacity: 0.05; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E"); }
        `,
          }}
        />

        <Preloader brand={text(customer.businessName, "Island Villa")} />
        <div className="grain" aria-hidden="true" />
        <Cursor />
        <Header customer={customer} />

        <main id="top">
          <Hero customer={customer} />
          <Marquee />
          <Intro customer={customer} />
          <Stats customer={customer} />
          <Spaces />
          <Experiences customer={customer} />
          <Dining />
          <GridGallery customer={customer} />
          <Testimonials />
          <Rates />
          <Enquiry customer={customer} />
        </main>

        <Footer customer={customer} />
      </div>
    </SmoothScroll>
  );
}
